/* Bird Tower Defense - Farm & 3-Layer Mutation Engine (Full GDD Specification) */

import { stateManager, CROPS, SEED_MUTATIONS, NATURAL_MUTATIONS, WEATHER_TYPES, GRADE_NAMES, GRADE_COLORS } from './state.js';
import { soundEngine } from './assets.js';

export class FarmSystem {
  constructor() {
    this.gridContainer = document.getElementById('farm-grid');
    this.initWeather();
  }

  init() {
    this.render();
    setInterval(() => {
      this.updateTimers();
    }, 1000);
  }

  initWeather() {
    setInterval(() => {
      const state = stateManager.state;
      state.weatherTimer--;
      if (state.weatherTimer <= 0) {
        state.weatherTimer = 1200; // 20분
        // 날씨 무작위 변경
        const rand = Math.random();
        let cumulative = 0;
        for (let wKey in WEATHER_TYPES) {
          cumulative += WEATHER_TYPES[wKey].chance;
          if (rand <= cumulative) {
            state.currentWeather = wKey;
            break;
          }
        }
        stateManager.notify();
      }
    }, 1000);
  }

  render() {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';
    const state = stateManager.state;

    // 날씨 바 업데이트
    const currentWeatherInfo = WEATHER_TYPES[state.currentWeather] || WEATHER_TYPES.sunny;
    const weatherEl = document.getElementById('weather-indicator');
    if (weatherEl) {
      const mins = Math.floor(state.weatherTimer / 60);
      const secs = state.weatherTimer % 60;
      weatherEl.innerHTML = `${currentWeatherInfo.icon} <b>${currentWeatherInfo.name}</b> (${mins}:${secs < 10 ? '0' : ''}${secs})`;
    }

    // 밭 렌더링
    state.farmPlots.forEach((plot, index) => {
      const plotEl = document.createElement('div');
      plotEl.className = `farm-plot glass-panel`;
      plotEl.dataset.index = index;

      if (plot.status === 'locked') {
        plotEl.classList.add('plot-locked');
        plotEl.innerHTML = `<div class="lock-info">💎 ${plot.unlockCost}</div>`;
        plotEl.addEventListener('click', () => this.unlockPlot(index));
      } else if (plot.status === 'empty') {
        plotEl.classList.add('plot-empty');
        plotEl.innerHTML = `<div class="empty-icon">🌱</div><div>씨앗 심기</div>`;
        plotEl.addEventListener('click', () => this.openPlantModal(index));
      } else if (plot.status === 'growing') {
        plotEl.classList.add('plot-growing');
        const crop = CROPS[plot.cropId] || CROPS.carrot;
        const elapsed = (Date.now() - plot.plantTime) / 1000;
        const remaining = Math.max(0, plot.duration - elapsed);
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);

        plotEl.innerHTML = `
          <div class="crop-icon">${crop.icon}</div>
          <div class="crop-name">${crop.name}</div>
          <div class="farm-timer">${mins}:${secs < 10 ? '0' : ''}${secs}</div>
        `;
      } else if (plot.status === 'ready') {
        plotEl.classList.add('plot-ready');
        const crop = CROPS[plot.cropId] || CROPS.carrot;
        plotEl.innerHTML = `
          <div class="crop-icon">${crop.icon}</div>
          <div class="crop-name">${crop.name}</div>
          <div class="farm-timer ready-btn">✨ 수확하기</div>
        `;
        plotEl.addEventListener('click', () => this.harvestCrop(index));
      }

      this.gridContainer.appendChild(plotEl);
    });
  }

  updateTimers() {
    const state = stateManager.state;
    let changed = false;

    state.farmPlots.forEach(plot => {
      if (plot.status === 'growing') {
        const elapsed = (Date.now() - plot.plantTime) / 1000;
        if (elapsed >= plot.duration) {
          plot.status = 'ready';
          changed = true;
        }
      }
    });

    if (changed) {
      stateManager.save();
    }
    this.render();
  }

  unlockPlot(index) {
    const plot = stateManager.state.farmPlots[index];
    if (confirm(`이 밭을 💎 ${plot.unlockCost}개로 해제하시겠습니까?`)) {
      if (stateManager.spendGems(plot.unlockCost)) {
        plot.status = 'empty';
        stateManager.save();
        this.render();
      } else {
        alert('젬이 부족합니다!');
      }
    }
  }

  openPlantModal(plotIndex) {
    const state = stateManager.state;
    const ownedSeeds = state.inventory.seeds;
    const availableCrops = Object.keys(ownedSeeds).filter(k => ownedSeeds[k] > 0);

    if (availableCrops.length === 0) {
      alert('심을 수 있는 확정 씨앗이 없습니다. 상점에서 씨앗을 구입하세요!');
      return;
    }

    const cropId = availableCrops[0]; // 대표 씨앗 사용
    state.inventory.seeds[cropId]--;

    // 씨앗 돌연변이 판정 (5% 확률) (GDD 5-2)
    let seedMut = null;
    if (Math.random() < 0.05) {
      const r = Math.random();
      let cum = 0;
      for (let mKey in SEED_MUTATIONS) {
        if (mKey === 'unstable') continue;
        cum += SEED_MUTATIONS[mKey].chance;
        if (r <= cum) {
          seedMut = mKey;
          break;
        }
      }
    }

    const crop = CROPS[cropId];
    const plot = state.farmPlots[plotIndex];
    plot.status = 'growing';
    plot.cropId = cropId;
    plot.seedMutation = seedMut;
    plot.plantTime = Date.now();
    plot.duration = crop.growSec;
    plot.isOneTime = crop.isOneTime;

    soundEngine.playCoin();
    stateManager.save();
    this.render();
  }

  // --- 수확 및 3중 돌연변이 공식 적용 (GDD 5-2 ③) ---
  harvestCrop(plotIndex) {
    const state = stateManager.state;
    const plot = state.farmPlots[plotIndex];
    const crop = CROPS[plot.cropId] || CROPS.carrot;

    // ① 씨앗 배율
    let seedMult = 1;
    if (plot.seedMutation) {
      const mutInfo = SEED_MUTATIONS[plot.seedMutation];
      if (mutInfo) seedMult = mutInfo.mult;
    }

    // 날씨 보너스 판정 (제3의 독립 판정)
    let weatherMult = 0;
    const weatherInfo = WEATHER_TYPES[state.currentWeather];
    if (weatherInfo && weatherInfo.mutationId && Math.random() < 0.10) {
      const wMut = SEED_MUTATIONS[weatherInfo.mutationId];
      if (wMut) weatherMult = wMut.mult;
    }

    // ② 자연 돌연변이 판정
    let naturalMult = 1;
    let doubleNat = (weatherInfo && weatherInfo.naturalDouble) ? 2 : 1;
    const rNat = Math.random();

    if (rNat < NATURAL_MUTATIONS.diamond.chance * doubleNat) {
      naturalMult = NATURAL_MUTATIONS.diamond.mult; // x50
    } else if (rNat < (NATURAL_MUTATIONS.diamond.chance + NATURAL_MUTATIONS.golden.chance) * doubleNat) {
      naturalMult = NATURAL_MUTATIONS.golden.mult; // x30
    }

    // ③ 중첩 공식: (씨앗 + 날씨) * 자연
    let totalMult = (seedMult + weatherMult) * naturalMult;

    // 수확 재화(깃털) 환산 계산
    const baseValue = Math.floor(Math.random() * (crop.maxSell - crop.minSell + 1)) + crop.minSell;
    const finalFeatherGain = Math.round(baseValue * totalMult);

    stateManager.addFeathers(finalFeatherGain);
    soundEngine.playCoin();

    alert(` 수확 완료!\n[${crop.name}] 수확으로 🪶 깃털 +${finalFeatherGain}개 획득! (배율: x${totalMult})`);

    // 1회용 작물이면 빈 밭으로, 다회용이면 다시 재배 시작
    if (plot.isOneTime) {
      plot.status = 'empty';
      plot.cropId = null;
    } else {
      plot.status = 'growing';
      plot.plantTime = Date.now();
    }

    stateManager.save();
    this.render();
  }
}
