/* Bird Tower Defense - Hatchery & Gacha System (Full GDD Specification) */

import { stateManager, EGG_GACHA_PROBS, BIRD_TEMPLATES, GRADES, GRADE_NAMES, GRADE_COLORS } from './state.js';
import { getEggSVG, getBirdSVG, soundEngine } from './assets.js';

export class HatcherySystem {
  constructor() {
    this.container = document.getElementById('egg-inventory-list');
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const state = stateManager.state;
    const eggs = state.inventory.eggs;

    let totalEggs = 0;
    for (let gKey in eggs) {
      const count = eggs[gKey] || 0;
      totalEggs += count;
      if (count > 0) {
        const card = document.createElement('div');
        card.className = 'egg-card glass-panel';
        card.innerHTML = `
          <div class="egg-icon">${getEggSVG(gKey, 56)}</div>
          <h4>${GRADE_NAMES[gKey]} 알</h4>
          <p>보유: <b>${count}개</b></p>
          <button class="btn btn-success btn-sm btn-hatch" data-grade="${gKey}">부화하기</button>
        `;
        card.querySelector('.btn-hatch').addEventListener('click', () => this.hatchEgg(gKey));
        this.container.appendChild(card);
      }
    }

    if (totalEggs === 0) {
      this.container.innerHTML = '<div style="color:var(--text-muted); padding:2rem;">보유 중인 알이 없습니다. 상점에서 깃털로 알을 구매하세요!</div>';
    }
  }

  hatchEgg(eggGrade) {
    const state = stateManager.state;
    if ((state.inventory.eggs[eggGrade] || 0) <= 0) return;

    // 1개 소모
    state.inventory.eggs[eggGrade]--;

    // 1. 결과 새 등급 가챠 롤 (Section 8)
    const probTable = EGG_GACHA_PROBS[eggGrade] || EGG_GACHA_PROBS[GRADES.NORMAL];
    const rolledGrade = this.rollGrade(probTable);

    // 2. 해당 등급 내의 새 무작위 선택
    const matchingBirds = Object.keys(BIRD_TEMPLATES).filter(bKey => BIRD_TEMPLATES[bKey].grade === rolledGrade);
    const chosenBirdId = matchingBirds[Math.floor(Math.random() * matchingBirds.length)];
    const chosenBird = BIRD_TEMPLATES[chosenBirdId];

    // 인벤토리에 새 추가
    stateManager.addBird(chosenBirdId);
    soundEngine.playHatch();

    // 부화 결과 모달 팝업
    alert(`🎉 [${GRADE_NAMES[eggGrade]} 알] 부화 성공!\n\n🦅 등급: ${GRADE_NAMES[rolledGrade]}\n 이름: ${chosenBird.name} (${chosenBird.type})\n설명: ${chosenBird.desc}`);

    stateManager.save();
    this.render();
  }

  rollGrade(probTable) {
    const rand = Math.random();
    let cum = 0;
    for (let gKey in probTable) {
      cum += probTable[gKey];
      if (rand <= cum) return gKey;
    }
    return GRADES.NORMAL;
  }
}
