/* Bird Tower Defense - Objects & Entities (Full GDD Engine Support) */

import { BIRD_TEMPLATES, MONSTER_TEMPLATES, PLACEMENT_COSTS, GRADE_COLORS } from '../state.js';
import { drawBirdCanvas, soundEngine } from '../assets.js';

// --- 몬스터 개체 클래스 ---
export class Enemy {
  constructor(typeKey, path, levelMultiplier = 1.0) {
    this.id = 'mob_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    this.typeKey = typeKey;
    const tmpl = MONSTER_TEMPLATES[typeKey] || MONSTER_TEMPLATES.basic;
    
    this.name = tmpl.name;
    this.icon = tmpl.icon || '👾';
    this.maxHp = tmpl.hp * levelMultiplier;
    this.hp = this.maxHp;
    this.baseSpeed = tmpl.speed;
    this.speed = tmpl.speed;
    this.isBoss = tmpl.isBoss || false;
    this.isCubic = tmpl.isCubic || false;
    this.isShaman = tmpl.isShaman || false;
    this.isSplitter = tmpl.isSplitter || false;
    this.isSplitterBoss = tmpl.isSplitterBoss || false;
    
    this.path = path;
    this.pathIndex = 0;
    this.x = path[0][0];
    this.y = path[0][1];
    this.radius = this.isCubic ? 30 : (this.isBoss ? 22 : 14);
    
    this.isDead = false;
    this.reachedEnd = false;
    
    // 디버프 및 상태
    this.stunTimer = 0;
    this.rootTimer = 0;
    this.slowRatio = 0;
    this.slowTimer = 0;
    this.burnDmg = 0;
    this.burnTimer = 0;
    this.poisonStacks = 0;
    this.poisonDmg = 0;
    this.armorShred = 0; // % 방어 감소
    this.curseAmp = 0; // % 받피증
    this.isMindControlled = false;
    this.mindControlTimer = 0;
    
    // Special Abilities CD
    this.shamanCD = 4.0;
  }

  update(dt, gameEngine) {
    if (this.isDead || this.reachedEnd) return;

    // 디버프 타이머 처리
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      return;
    }
    if (this.rootTimer > 0) {
      this.rootTimer -= dt;
      return;
    }

    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowRatio = 0;
    }

    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      this.hp -= this.burnDmg * dt;
      if (this.hp <= 0) {
        this.die(gameEngine);
        return;
      }
    }

    if (this.mindControlTimer > 0) {
      this.mindControlTimer -= dt;
      if (this.mindControlTimer <= 0) {
        this.isMindControlled = false;
      }
    }

    // 주술사 스킬 (해골 소환)
    if (this.isShaman) {
      this.shamanCD -= dt;
      if (this.shamanCD <= 0) {
        this.shamanCD = 5.0;
        const skelType = Math.random() < 0.5 ? 'skeleton' : 'fast_skeleton';
        gameEngine.spawnSubMob(skelType, this.x, this.y, this.pathIndex);
      }
    }

    // 이동 처리
    const target = this.path[this.pathIndex + 1];
    if (!target) {
      this.reachedEnd = true;
      return;
    }

    const dx = target[0] - this.x;
    const dy = target[1] - this.y;
    const dist = Math.hypot(dx, dy);
    
    const curSpeed = this.baseSpeed * (1 - this.slowRatio);
    const step = curSpeed * 45 * dt;

    if (dist <= step) {
      this.x = target[0];
      this.y = target[1];
      this.pathIndex++;
      if (this.pathIndex >= this.path.length - 1) {
        this.reachedEnd = true;
      }
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
  }

  takeDamage(amount, gameEngine, attacker = null) {
    if (this.isDead) return;
    
    // 방어 감소 및 저주 증폭 계산
    let finalDmg = amount * (1 + this.curseAmp) * (1 + this.armorShred);
    this.hp -= finalDmg;
    
    // 데미지 텍스트 파티클
    if (gameEngine) {
      gameEngine.addDamageText(this.x, this.y - 15, Math.round(finalDmg));
    }

    if (this.hp <= 0) {
      this.die(gameEngine, attacker);
    }
  }

  die(gameEngine, attacker = null) {
    if (this.isDead) return;
    this.isDead = true;
    
    // 적 처치시 코인 보상 (인런)
    const coinGain = this.isCubic ? 100 : (this.isBoss ? 30 : 2);
    if (gameEngine) {
      gameEngine.addInRunCoins(coinGain);
    }

    // 분열 몬스터 특수 사망
    if (this.isSplitter && gameEngine) {
      gameEngine.spawnSubMob('split_sub', this.x - 10, this.y, this.pathIndex);
      gameEngine.spawnSubMob('split_sub', this.x + 10, this.y, this.pathIndex);
    }
    
    // 분열자 보스 사망시 (1차/2차 분열)
    if (this.isSplitterBoss && gameEngine) {
      gameEngine.spawnSubMob('special_boss', this.x - 15, this.y, this.pathIndex);
      gameEngine.spawnSubMob('swift_boss', this.x + 15, this.y, this.pathIndex);
    }

    // 광부 새 깃털 드롭
    if (attacker && attacker.featherChance && Math.random() < attacker.featherChance && gameEngine) {
      gameEngine.addFeathers(1);
    }
  }

  draw(ctx) {
    if (this.isDead || this.reachedEnd) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // 디버프 오라 표시
    if (this.stunTimer > 0) {
      ctx.fillStyle = '#f6e05e';
      ctx.font = '12px sans-serif';
      ctx.fillText('💫', -6, -this.radius - 12);
    } else if (this.rootTimer > 0) {
      ctx.fillStyle = '#68d391';
      ctx.font = '12px sans-serif';
      ctx.fillText('🌿', -6, -this.radius - 12);
    } else if (this.burnTimer > 0) {
      ctx.fillStyle = '#f56565';
      ctx.font = '12px sans-serif';
      ctx.fillText('🔥', -6, -this.radius - 12);
    } else if (this.isMindControlled) {
      ctx.fillStyle = '#b794f4';
      ctx.font = '12px sans-serif';
      ctx.fillText('🧠', -6, -this.radius - 12);
    }

    // 아이콘 & 바디
    ctx.font = `${this.radius * 1.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, 0, 0);

    // HP 바
    const barW = this.radius * 2.2;
    const barH = 4;
    const hpRatio = Math.max(0, this.hp / this.maxHp);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-barW / 2, this.radius + 4, barW, barH);

    ctx.fillStyle = hpRatio > 0.5 ? '#48bb78' : (hpRatio > 0.2 ? '#ecc94b' : '#f56565');
    ctx.fillRect(-barW / 2, this.radius + 4, barW * hpRatio, barH);

    ctx.restore();
  }
}

// --- 타워(새) 개체 클래스 ---
export class Tower {
  constructor(birdId, x, y, runLevel = 1, birdData = {}) {
    this.id = 'tower_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    this.birdId = birdId;
    this.x = x;
    this.y = y;
    this.runLevel = runLevel; // 인런 레벨 (1 ~ 3/4/5)
    this.buff = birdData.buff || null;

    const template = BIRD_TEMPLATES[birdId];
    this.template = template;
    this.name = template.name;
    this.grade = template.grade;

    this.cooldownTimer = 0;
    this.isSelected = false;
    this.angle = 0;
    
    // 특수 스택/타이머
    this.chargedStacks = 0;
    this.henEggTimer = 0;
    this.henEggCount = 0;
    this.digestTimer = 0;
    this.devouredMobs = 0;
  }

  getStats() {
    const lvlIdx = Math.min(this.runLevel - 1, this.template.levels.length - 1);
    const lvlInfo = this.template.levels[lvlIdx];

    let atk = lvlInfo.atk || 0;
    let interval = lvlInfo.interval || 1.0;
    let range = lvlInfo.range || 120;

    // 모이 버프 적용
    if (this.buff) {
      if (this.buff.type === 'power') atk *= (1 + this.buff.val);
      if (this.buff.type === 'speed') interval *= (1 - this.buff.val);
      if (this.buff.type === 'sight') range *= (1 + this.buff.val);
    }

    return { ...lvlInfo, atk, interval, range };
  }

  update(dt, gameEngine) {
    const stats = this.getStats();

    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= dt;
    }
    if (this.digestTimer > 0) {
      this.digestTimer -= dt;
    }

    // 소환/경제 타워 업데이트
    if (this.birdId === 'farmer_bird' || this.birdId === 'fancy_bird') {
      if (stats.cps) {
        gameEngine.addInRunCoins(stats.cps * dt);
      }
    } else if (this.birdId === 'gambler_bird') {
      if (this.cooldownTimer <= 0) {
        this.cooldownTimer = stats.interval;
        const gain = Math.floor(Math.random() * (stats.coinMax - stats.coinMin + 1)) + stats.coinMin;
        gameEngine.addInRunCoins(gain);
        gameEngine.addDamageText(this.x, this.y - 20, `+${gain}🪙`, '#ecc94b');
      }
    } else if (this.birdId === 'hen') {
      this.henEggTimer += dt;
      if (this.henEggTimer >= stats.eggInterval) {
        this.henEggTimer = 0;
        this.henEggCount += stats.eggCount;
        let totalGain = stats.eggCount * stats.coinPerEgg;
        gameEngine.addInRunCoins(totalGain);

        let isGolden = Math.random() < stats.goldenChance;
        if (stats.pityGolden && this.henEggCount >= 10) {
          isGolden = true;
          this.henEggCount = 0;
        }
        if (isGolden) {
          gameEngine.addFeathers(stats.pityGolden ? 2 : 1);
          gameEngine.addDamageText(this.x, this.y - 25, '🪶 깃털!', '#f6e05e');
        }
      }
    }

    // 공격 처리
    if (this.cooldownTimer <= 0 && stats.atk > 0 && this.digestTimer <= 0) {
      const target = gameEngine.findTargetForTower(this, stats);
      if (target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.attack(target, stats, gameEngine);
        this.cooldownTimer = stats.interval;
      }
    }
  }

  attack(target, stats, gameEngine) {
    soundEngine.playShot();

    // 펠리컨 (포획 즉사)
    if (this.birdId === 'pelican') {
      const targets = gameEngine.findTargetsInRange(this.x, this.y, stats.range, stats.devourCount);
      targets.forEach(m => m.die(gameEngine, this));
      this.digestTimer = stats.digestDur;
      return;
    }

    // 찌르기/발사체 생성
    gameEngine.spawnProjectile(this, target, stats);
  }

  draw(ctx) {
    const stats = this.getStats();
    drawBirdCanvas(ctx, this.birdId, this.x, this.y, 40, this.angle, {
      isSelected: this.isSelected,
      range: stats.range,
      level: this.runLevel
    });

    // 버프 오라 표시
    if (this.buff) {
      ctx.save();
      ctx.strokeStyle = '#ecc94b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// --- 투사체 클래스 ---
export class Projectile {
  constructor(tower, target, stats) {
    this.x = tower.x;
    this.y = tower.y;
    this.target = target;
    this.stats = stats;
    this.tower = tower;

    this.speed = 450;
    this.isHit = false;
  }

  update(dt, gameEngine) {
    if (this.isHit) return;

    if (!this.target || this.target.isDead) {
      this.isHit = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 15) {
      this.hit(gameEngine);
      this.isHit = true;
    } else {
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
    }
  }

  hit(gameEngine) {
    if (!this.target || this.target.isDead) return;

    // 타격 데미지
    this.target.takeDamage(this.stats.atk, gameEngine, this.tower);

    // 부가 효과
    if (this.stats.stunChance && Math.random() < this.stats.stunChance) {
      this.target.stunTimer = this.stats.stunTime || 1.0;
    }
    if (this.stats.slowRate) {
      this.target.slowRatio = this.stats.slowRate;
      this.target.slowTimer = this.stats.slowDur || 2.0;
    }
    if (this.stats.burnDmg) {
      this.target.burnDmg = this.stats.burnDmg;
      this.target.burnTimer = this.stats.burnDur || 3.0;
    }
    if (this.stats.aoeRadius) {
      const near = gameEngine.findTargetsInRange(this.x, this.y, this.stats.aoeRadius);
      near.forEach(m => {
        if (m !== this.target) m.takeDamage(this.stats.atk * 0.7, gameEngine, this.tower);
      });
    }
  }

  draw(ctx) {
    if (this.isHit) return;
    ctx.save();
    ctx.fillStyle = '#ecc94b';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
