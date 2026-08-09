/* Bird Tower Defense - 6-Slot Dynamic Shop System (Full GDD Specification) */

import { stateManager, EGG_PRICES, SHOP_EGG_SLOT_PROBS, SEED_BOX_GACHA_PROBS, GRADES, GRADE_NAMES, CROPS } from './state.js';
import { getEggSVG, soundEngine } from './assets.js';

export class ShopSystem {
  constructor() {
    this.container = document.getElementById('shop-slots-container');
    this.resetBtn = document.getElementById('btn-reset-shop');
  }

  init() {
    const state = stateManager.state;
    if (!state.shopItems || state.shopItems.length === 0) {
      this.generateShopItems();
    }
    this.render();
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetShop());
    }
  }

  generateShopItems() {
    const state = stateManager.state;
    const items = [];

    // 칸 1~3: 알 (3칸) - 6-2 확률표 적용
    for (let i = 0; i < 3; i++) {
      const grade = this.rollGrade(SHOP_EGG_SLOT_PROBS);
      items.push({
        type: 'egg',
        grade,
        price: EGG_PRICES[grade] || 50
      });
    }

    // 칸 4~6: 씨앗/씨앗상자 (3칸) - 6-3 확률표 적용
    for (let i = 0; i < 3; i++) {
      const isFixedSeed = Math.random() < 0.55;
      if (isFixedSeed) {
        const cropKeys = Object.keys(CROPS);
        const cropId = cropKeys[Math.floor(Math.random() * cropKeys.length)];
        const crop = CROPS[cropId];
        const baseEggPrice = EGG_PRICES[crop.grade] || 50;
        const price = Math.round(baseEggPrice * 0.15); // 알 가격의 15% 수준
        items.push({
          type: 'seed',
          cropId,
          grade: crop.grade,
          price
        });
      } else {
        const grade = this.rollGrade(SHOP_EGG_SLOT_PROBS);
        const price = Math.round((EGG_PRICES[grade] || 50) * 0.2);
        items.push({
          type: 'seed_box',
          grade,
          price
        });
      }
    }

    state.shopItems = items;
    stateManager.save();
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

  resetShop() {
    const state = stateManager.state;
    if (state.dailyResetCount >= 5) {
      alert('1일 최대 새로고침 횟수(5회)를 초과했습니다!');
      return;
    }
    const gemCost = (state.dailyResetCount + 1) * 10;
    if (confirm(`상점을 새로고침 하시겠습니까? (비용: 💎 ${gemCost}개, 남은 횟수: ${5 - state.dailyResetCount}회)`)) {
      if (stateManager.spendGems(gemCost)) {
        state.dailyResetCount++;
        this.generateShopItems();
        soundEngine.playHatch();
        this.render();
      } else {
        alert('젬이 부족합니다!');
      }
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const state = stateManager.state;

    state.shopItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'shop-item glass-panel';

      if (item.type === 'egg') {
        card.innerHTML = `
          <div class="shop-item-icon">${getEggSVG(item.grade, 50)}</div>
          <h4>${GRADE_NAMES[item.grade]} 알</h4>
          <p>${GRADE_NAMES[item.grade]} 등급 알 (새 부화)</p>
          <button class="btn btn-primary btn-buy" data-index="${index}">🪶 ${item.price}</button>
        `;
      } else if (item.type === 'seed') {
        const crop = CROPS[item.cropId] || CROPS.carrot;
        card.innerHTML = `
          <div class="shop-item-icon" style="font-size: 40px;">${crop.icon}</div>
          <h4>${crop.name} 씨앗</h4>
          <p>확정 재배 (${GRADE_NAMES[crop.grade]})</p>
          <button class="btn btn-primary btn-buy" data-index="${index}">🪶 ${item.price}</button>
        `;
      } else if (item.type === 'seed_box') {
        card.innerHTML = `
          <div class="shop-item-icon" style="font-size: 40px;">🎁</div>
          <h4>${GRADE_NAMES[item.grade]} 씨앗 상자</h4>
          <p>랜덤 작물 씨앗 개봉</p>
          <button class="btn btn-primary btn-buy" data-index="${index}">🪶 ${item.price}</button>
        `;
      }

      card.querySelector('.btn-buy').addEventListener('click', () => this.buyItem(index));
      this.container.appendChild(card);
    });

    const resetLabel = document.getElementById('reset-count-label');
    if (resetLabel) {
      resetLabel.textContent = `오늘 새로고침: ${state.dailyResetCount}/5회`;
    }
  }

  buyItem(index) {
    const state = stateManager.state;
    const item = state.shopItems[index];
    if (!item) return;

    if (stateManager.spendFeathers(item.price)) {
      if (item.type === 'egg') {
        state.inventory.eggs[item.grade] = (state.inventory.eggs[item.grade] || 0) + 1;
        alert(`🥚 [${GRADE_NAMES[item.grade]} 알]을 획득했습니다! 부화소에서 부화시키세요!`);
      } else if (item.type === 'seed') {
        state.inventory.seeds[item.cropId] = (state.inventory.seeds[item.cropId] || 0) + 1;
        alert(`🌱 [${CROPS[item.cropId].name} 씨앗]을 획득했습니다! 농장에서 재배하세요!`);
      } else if (item.type === 'seed_box') {
        state.inventory.seedBoxes[item.grade] = (state.inventory.seedBoxes[item.grade] || 0) + 1;
        alert(`🎁 [${GRADE_NAMES[item.grade]} 씨앗 상자]를 획득했습니다!`);
      }

      soundEngine.playCoin();
      stateManager.save();
    } else {
      alert('깃털이 부족합니다!');
    }
  }
}
