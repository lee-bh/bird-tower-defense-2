/* Bird Tower Defense - Game Engine (Full GDD Mechanics & CUBIC Boss) */

import { stateManager, BIRD_TEMPLATES, WAVE_CONFIG, MONSTER_TEMPLATES, PLACEMENT_COSTS } from '../state.js';
import { Enemy, Tower, Projectile } from './objects.js';
import { soundEngine } from '../assets.js';

export class GameEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.timeScale = 1.0;

    // 경로 정의: S자 커브 길 (GDD 2-1 지정 경로)
    this.path = [
      [0, 140],
      [240, 140],
      [240, 340],
      [520, 340],
      [520, 200],
      [800, 200]
    ];

    this.resetMatch();

    // 입력 이벤트 리스너
    this.selectedPlacementBird = null;
    this.selectedTower = null;

    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  resetMatch() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.damageTexts = [];

    this.inRunCoins = 150; // 기본 시작 코인
    this.castleHp = 20;
    this.maxCastleHp = 20;
    this.currentWave = 0;
    this.isWaveActive = false;
    this.waveSkipped = false;

    this.enemiesToSpawn = [];
    this.spawnTimer = 0;
    this.selectedTower = null;
    this.selectedPlacementBird = null;

    // 큐빅 보스 패턴용 상태
    this.cubicHealed = false;
    this.cubicAwakened = false;
    this.cubicSummonTimer = 12.0;

    this.updateUI();
  }

  // --- 웨이브 관리 및 수동 넘기기 (GDD 2-4) ---
  startWave() {
    if (this.currentWave >= 25) {
      alert('이미 최종 25웨이브까지 진입하였습니다!');
      return;
    }

    if (this.isWaveActive) {
      // 수동 웨이브 넘기기 (Wave Skip)
      this.waveSkipped = true; // "전멸 클리어 추가 코인" 보상 포기 플래그
    }

    this.currentWave++;
    this.isWaveActive = true;
    
    // 웨이브 몬스터 대기열 생성
    const cfg = WAVE_CONFIG[this.currentWave - 1];
    this.enemiesToSpawn = [];
    if (cfg) {
      cfg.mobs.forEach(m => {
        for (let i = 0; i < m.count; i++) {
          this.enemiesToSpawn.push(m.type);
        }
      });
    }

    soundEngine.playHatch();
    this.updateUI();
  }

  // --- 자유 배치 (GDD 2-1: 정해진 슬롯이 아니라 경로 외 자유 위치) ---
  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. 이미 배치된 타워 클릭 선택
    const clickedTower = this.towers.find(t => Math.hypot(t.x - x, t.y - y) <= 24);
    if (clickedTower) {
      if (this.selectedTower) this.selectedTower.isSelected = false;
      this.selectedTower = clickedTower;
      this.selectedTower.isSelected = true;
      this.renderSelectedTowerPanel();
      return;
    }

    if (this.selectedTower) {
      this.selectedTower.isSelected = false;
      this.selectedTower = null;
      this.renderSelectedTowerPanel();
    }

    // 2. 새 배치 시도
    if (this.selectedPlacementBird) {
      const birdId = this.selectedPlacementBird;
      const template = BIRD_TEMPLATES[birdId];
      const cost = PLACEMENT_COSTS[template.grade] || 15;

      if (this.inRunCoins < cost) {
        alert('코인이 부족합니다!');
        return;
      }

      // 경로 및 타워 중복 간격 검사
      if (this.isOnPath(x, y, 28)) {
        alert('몬스터 이동 경로 위에는 배치할 수 없습니다!');
        return;
      }
      if (this.towers.some(t => Math.hypot(t.x - x, t.y - y) < 32)) {
        alert('다른 새와 너무 가까워 배치할 수 없습니다!');
        return;
      }

      // 배치 성공
      this.inRunCoins -= cost;
      const ownedData = stateManager.state.ownedBirds.find(b => b.birdId === birdId) || {};
      const newTower = new Tower(birdId, x, y, 1, ownedData);
      this.towers.push(newTower);

      soundEngine.playCoin();
      this.updateUI();
    }
  }

  isOnPath(x, y, padding = 24) {
    for (let i = 0; i < this.path.length - 1; i++) {
      const p1 = this.path[i];
      const p2 = this.path[i + 1];

      const dist = this.distToSegment({ x, y }, { x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] });
      if (dist < padding) return true;
    }
    return false;
  }

  distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  // --- 메인 루프 ---
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1) * this.timeScale;
      lastTime = now;

      this.update(dt);
      this.draw();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
  }

  update(dt) {
    // 1. 몬스터 스폰
    if (this.isWaveActive && this.enemiesToSpawn.length > 0) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= 0.8) {
        this.spawnTimer = 0;
        const typeKey = this.enemiesToSpawn.shift();
        const enemy = new Enemy(typeKey, this.path, 1.0 + this.currentWave * 0.05);
        this.enemies.push(enemy);
      }
    }

    // 2. 몬스터 업데이트 & 성 피해 판정 (GDD 2-2)
    this.enemies.forEach(e => {
      e.update(dt, this);
      if (e.reachedEnd && !e.isDead) {
        e.isDead = true;
        // 남은 HP만큼 성 피해!
        const dmg = Math.ceil(e.hp);
        this.castleHp -= dmg;
        soundEngine.playExplosion();

        if (this.castleHp <= 0) {
          this.castleHp = 0;
          this.gameOver();
        }
      }
    });
    this.enemies = this.enemies.filter(e => !e.isDead);

    // 3. 타워 업데이트
    this.towers.forEach(t => t.update(dt, this));

    // 4. 투사체 업데이트
    this.projectiles.forEach(p => p.update(dt, this));
    this.projectiles = this.projectiles.filter(p => !p.isHit);

    // 5. 데미지 텍스트 업데이트
    this.damageTexts.forEach(d => {
      d.y -= 20 * dt;
      d.life -= dt;
    });
    this.damageTexts = this.damageTexts.filter(d => d.life > 0);

    // 6. CUBIC 최종 보스 패턴 업데이트 (GDD 12-5-3)
    const cubic = this.enemies.find(e => e.isCubic && !e.isDead);
    if (cubic) {
      // 패턴 1: 소환 (3마리 무작위 보스)
      this.cubicSummonTimer -= dt;
      if (this.cubicSummonTimer <= 0) {
        this.cubicSummonTimer = 15.0;
        this.spawnSubMob('special_boss', cubic.x - 20, cubic.y, cubic.pathIndex);
        this.spawnSubMob('swift_boss', cubic.x, cubic.y, cubic.pathIndex);
        this.spawnSubMob('splitter_boss', cubic.x + 20, cubic.y, cubic.pathIndex);
        this.addDamageText(cubic.x, cubic.y - 30, '⚡ 소환 패턴!', '#f6e05e');
      }

      // 패턴 3: 리젠 (HP 1,000 회복)
      if (!this.cubicHealed && cubic.hp <= 7000) {
        this.cubicHealed = true;
        cubic.hp = Math.min(cubic.maxHp, cubic.hp + 1000);
        this.addDamageText(cubic.x, cubic.y - 30, '💚 +1,000 HP 리젠!', '#48bb78');
      }

      // 패턴 4: 각성 (HP < 5,000시 스피드 2배 + 3초 전범위 타워 스턴)
      if (!this.cubicAwakened && cubic.hp <= 5000) {
        this.cubicAwakened = true;
        cubic.baseSpeed *= 2.0;
        this.towers.forEach(t => t.cooldownTimer = 3.0);
        this.spawnSubMob('special_boss', cubic.x, cubic.y, cubic.pathIndex);
        this.addDamageText(cubic.x, cubic.y - 30, '🔥 큐빅 각성! 스피드 2배!', '#e53e3e');
      }
    }

    // 7. 웨이브 종료 체크 및 전멸 클리어 보상 (GDD 2-4)
    if (this.isWaveActive && this.enemiesToSpawn.length === 0 && this.enemies.length === 0) {
      this.isWaveActive = false;
      
      // 전멸 클리어 보상 (수동 넘기기를 안 했을 때만 코인 추가!)
      if (!this.waveSkipped) {
        const bonusCoins = 30 + this.currentWave * 10;
        this.inRunCoins += bonusCoins;
        this.addDamageText(400, 200, `웨이브 전멸 보너스 +${bonusCoins}🪙!`, '#ecc94b');
      }
      this.waveSkipped = false;

      // 25웨이브 완료시 깃털 보상
      stateManager.addFeathers(20 + this.currentWave * 5);

      if (this.currentWave >= 25) {
        this.stageClear();
      }
    }

    this.updateUI();
  }

  // --- 헬퍼 메소드 ---
  spawnSubMob(typeKey, x, y, pathIdx) {
    const mob = new Enemy(typeKey, this.path, 1.0 + this.currentWave * 0.05);
    mob.x = x;
    mob.y = y;
    mob.pathIndex = Math.max(0, pathIdx);
    this.enemies.push(mob);
  }

  findTargetForTower(tower, stats) {
    let best = null;
    let maxDist = -1;

    for (let e of this.enemies) {
      if (e.isDead || e.reachedEnd) continue;
      const d = Math.hypot(e.x - tower.x, e.y - tower.y);
      if (d <= stats.range) {
        if (stats.targetClosestToCastle) {
          if (e.pathIndex > maxDist) {
            maxDist = e.pathIndex;
            best = e;
          }
        } else {
          return e; // 첫 대상
        }
      }
    }
    return best;
  }

  findTargetsInRange(x, y, range, limit = 999) {
    return this.enemies.filter(e => !e.isDead && !e.reachedEnd && Math.hypot(e.x - x, e.y - y) <= range).slice(0, limit);
  }

  spawnProjectile(tower, target, stats) {
    this.projectiles.push(new Projectile(tower, target, stats));
  }

  addInRunCoins(amt) {
    this.inRunCoins += amt;
    this.updateUI();
  }

  addFeathers(amt) {
    stateManager.addFeathers(amt);
  }

  addDamageText(x, y, text, color = '#ffffff') {
    this.damageTexts.push({ x, y, text, color, life: 1.2 });
  }

  gameOver() {
    this.stop();
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.className = 'game-overlay-visible';
      document.getElementById('overlay-title').textContent = 'STAGE FAILED';
      document.getElementById('overlay-subtitle').textContent = `웨이브 ${this.currentWave}에서 성이 파괴되었습니다.`;
    }
  }

  stageClear() {
    this.stop();
    const stars = this.castleHp >= 15 ? 3 : (this.castleHp >= 8 ? 2 : 1);
    stateManager.state.stars = Math.max(stateManager.state.stars, stars);
    stateManager.save();

    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.className = 'game-overlay-visible';
      document.getElementById('overlay-title').textContent = '🎉 STAGE CLEAR!';
      document.getElementById('overlay-subtitle').textContent = `축하합니다! ⭐ ${stars}성으로 챕터 1을 클리어하셨습니다!`;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. 맵 경로 그리기 (S자 커브)
    this.ctx.strokeStyle = '#4a5568';
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.path.forEach((p, i) => {
      if (i === 0) this.ctx.moveTo(p[0], p[1]);
      else this.ctx.lineTo(p[0], p[1]);
    });
    this.ctx.stroke();

    this.ctx.strokeStyle = '#cbd5e0';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    // 성(Gate) 아이콘
    const gatePos = this.path[this.path.length - 1];
    this.ctx.font = '32px sans-serif';
    this.ctx.fillText('🏰', gatePos[0] - 20, gatePos[1] + 10);

    // 2. 타워 그리기
    this.towers.forEach(t => t.draw(this.ctx));

    // 3. 몬스터 그리기
    this.enemies.forEach(e => e.draw(this.ctx));

    // 4. 투사체 그리기
    this.projectiles.forEach(p => p.draw(this.ctx));

    // 5. 데미지 텍스트 그리기
    this.damageTexts.forEach(d => {
      this.ctx.save();
      this.ctx.fillStyle = d.color;
      this.ctx.font = 'bold 14px Outfit, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(d.text, d.x, d.y);
      this.ctx.restore();
    });
  }

  updateUI() {
    const elWave = document.getElementById('current-wave');
    const elHp = document.getElementById('gate-hp');
    const elHpBar = document.getElementById('gate-hp-bar');
    const elCoins = document.getElementById('player-coins');
    const elFeathers = document.getElementById('player-feathers');

    if (elWave) elWave.textContent = `${this.currentWave} / 25`;
    if (elHp) elHp.textContent = `${Math.max(0, this.castleHp)} / ${this.maxCastleHp}`;
    if (elHpBar) elHpBar.style.width = `${(Math.max(0, this.castleHp) / this.maxCastleHp) * 100}%`;
    if (elCoins) elCoins.textContent = Math.floor(this.inRunCoins);
    if (elFeathers) elFeathers.textContent = stateManager.state.feathers;
  }

  renderSelectedTowerPanel() {
    const panel = document.getElementById('selected-tower-panel');
    if (!panel) return;
    if (!this.selectedTower) {
      panel.classList.add('hidden');
      return;
    }

    panel.classList.remove('hidden');
    const t = this.selectedTower;
    const stats = t.getStats();

    document.getElementById('sel-tower-name').textContent = t.name;
    document.getElementById('sel-tower-level').textContent = t.runLevel;
    document.getElementById('sel-tower-dmg').textContent = Math.round(stats.atk);
    document.getElementById('sel-tower-speed').textContent = stats.interval.toFixed(2);

    const upgradeBtn = document.getElementById('btn-upgrade-tower');
    const cost = stats.cost || 0;
    if (upgradeBtn) {
      if (t.runLevel >= t.template.levels.length) {
        upgradeBtn.textContent = '최대 레벨';
        upgradeBtn.disabled = true;
      } else {
        upgradeBtn.textContent = `업그레이드 (${cost}🪙)`;
        upgradeBtn.disabled = this.inRunCoins < cost;
      }
    }
  }

  upgradeSelectedTower() {
    if (!this.selectedTower) return;
    const t = this.selectedTower;
    const nextLvl = t.runLevel + 1;
    if (nextLvl > t.template.levels.length) return;

    const nextStats = t.template.levels[nextLvl - 1];
    if (this.inRunCoins >= nextStats.cost) {
      this.inRunCoins -= nextStats.cost;
      t.runLevel = nextLvl;
      soundEngine.playCoin();
      this.updateUI();
      this.renderSelectedTowerPanel();
    }
  }

  sellSelectedTower() {
    if (!this.selectedTower) return;
    const template = BIRD_TEMPLATES[this.selectedTower.birdId];
    const refund = Math.floor((PLACEMENT_COSTS[template.grade] || 15) * 0.6);
    this.inRunCoins += refund;

    this.towers = this.towers.filter(t => t !== this.selectedTower);
    this.selectedTower = null;
    soundEngine.playCoin();
    this.updateUI();
    this.renderSelectedTowerPanel();
  }
}
