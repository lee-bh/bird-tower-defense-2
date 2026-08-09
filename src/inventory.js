/* Bird Tower Defense - Roster, Deck & Monster Codex (Full GDD Specification) */

import { stateManager, BIRD_TEMPLATES, MONSTER_TEMPLATES, GRADES, GRADE_NAMES, GRADE_COLORS } from './state.js';
import { getBirdSVG } from './assets.js';

export class InventorySystem {
  constructor() {
    this.birdGrid = document.getElementById('bird-grid');
    this.detailPanel = document.getElementById('bird-detail-panel');
    this.deckPreviewRow = document.getElementById('active-deck-preview');
    this.monsterCodexContainer = document.getElementById('monster-codex-grid');

    this.selectedBirdId = null;
    this.activeGradeFilter = 'all';
  }

  init() {
    this.render();
    this.initEvents();
  }

  initEvents() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeGradeFilter = btn.dataset.grade;
        this.renderBirdList();
      });
    });

    const btnEquip = document.getElementById('btn-equip-bird');
    if (btnEquip) {
      btnEquip.addEventListener('click', () => {
        if (!this.selectedBirdId) return;
        stateManager.toggleDeck(this.selectedBirdId);
        this.render();
        this.showBirdDetails(this.selectedBirdId);
      });
    }
  }

  render() {
    this.renderBirdList();
    this.renderDeckPreview();
    this.renderMonsterCodex();
  }

  renderBirdList() {
    if (!this.birdGrid) return;
    this.birdGrid.innerHTML = '';
    const state = stateManager.state;

    let birdKeys = Object.keys(BIRD_TEMPLATES);
    if (this.activeGradeFilter !== 'all') {
      birdKeys = birdKeys.filter(k => BIRD_TEMPLATES[k].grade === this.activeGradeFilter);
    }

    birdKeys.forEach(birdId => {
      const template = BIRD_TEMPLATES[birdId];
      const owned = state.ownedBirds.find(b => b.birdId === birdId);
      const isEquipped = state.deck.includes(birdId);

      const card = document.createElement('div');
      card.className = `bird-card glass-panel ${isEquipped ? 'equipped' : ''}`;
      if (!owned) card.style.opacity = '0.35';

      card.innerHTML = `
        <div class="bird-card-svg">${getBirdSVG(birdId, 44)}</div>
        <div class="bird-card-name">${template.name}</div>
        <div class="bird-card-grade" style="color: ${GRADE_COLORS[template.grade]}; font-size: 11px;">${GRADE_NAMES[template.grade]}</div>
        ${owned ? `<div class="bird-card-level">보유 ${owned.count}마리</div>` : '<div class="bird-card-level">미획득</div>'}
      `;

      card.addEventListener('click', () => {
        if (owned) this.showBirdDetails(birdId);
        else alert('아직 미획득한 새입니다. 상점에서 알을 구하세요!');
      });

      this.birdGrid.appendChild(card);
    });
  }

  renderDeckPreview() {
    if (!this.deckPreviewRow) return;
    this.deckPreviewRow.innerHTML = '';
    const state = stateManager.state;

    state.deck.forEach(birdId => {
      const icon = document.createElement('div');
      icon.className = 'deck-icon-preview';
      icon.innerHTML = getBirdSVG(birdId, 32);
      this.deckPreviewRow.appendChild(icon);
    });
  }

  showBirdDetails(birdId) {
    this.selectedBirdId = birdId;
    const template = BIRD_TEMPLATES[birdId];
    const state = stateManager.state;
    const owned = state.ownedBirds.find(b => b.birdId === birdId);
    const isEquipped = state.deck.includes(birdId);

    if (!this.detailPanel) return;
    this.detailPanel.classList.remove('hidden');

    document.getElementById('detail-bird-svg').innerHTML = getBirdSVG(birdId, 60);
    document.getElementById('detail-bird-name').textContent = template.name;
    const gradeBadge = document.getElementById('detail-bird-grade');
    gradeBadge.textContent = GRADE_NAMES[template.grade];
    gradeBadge.style.color = GRADE_COLORS[template.grade];

    const lvl1Stats = template.levels[0];
    document.getElementById('detail-stat-atk').textContent = Math.round(lvl1Stats.atk || 0);
    document.getElementById('detail-stat-spd').textContent = lvl1Stats.interval ? lvl1Stats.interval.toFixed(2) + 's' : '-';
    document.getElementById('detail-stat-rng').textContent = lvl1Stats.range || 0;
    document.getElementById('detail-bird-count').textContent = owned ? owned.count : 0;
    document.getElementById('detail-bird-desc').textContent = template.desc;

    const btnEquip = document.getElementById('btn-equip-bird');
    if (btnEquip) {
      btnEquip.textContent = isEquipped ? '전투 덱 해제' : '전투 덱 장착';
      btnEquip.className = `btn w-100 mb-2 ${isEquipped ? 'btn-danger' : 'btn-success'}`;
    }
  }

  // --- 11-1 몬스터 도감 ---
  renderMonsterCodex() {
    if (!this.monsterCodexContainer) return;
    this.monsterCodexContainer.innerHTML = '';

    for (let mKey in MONSTER_TEMPLATES) {
      const tmpl = MONSTER_TEMPLATES[mKey];
      const card = document.createElement('div');
      card.className = 'monster-card glass-panel';
      card.innerHTML = `
        <div style="font-size: 36px; text-align:center;">${tmpl.icon}</div>
        <h4 style="margin: 4px 0;">${tmpl.name}</h4>
        <p style="font-size: 11px; color: var(--text-muted); margin: 0;">HP: ${tmpl.hp} | 속도: ${tmpl.speed}</p>
        <p style="font-size: 11px; color: var(--accent-color); margin: 4px 0 0 0;">${tmpl.typeDesc || '몬스터'}</p>
      `;
      this.monsterCodexContainer.appendChild(card);
    }
  }
}
