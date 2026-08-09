/* Bird Tower Defense - Main Controller & Bootstrap */

import { stateManager, BIRD_TEMPLATES, PLACEMENT_COSTS } from './state.js';
import { getBirdSVG } from './assets.js';
import { GameEngine } from './game/engine.js';
import { FarmSystem } from './farm.js';
import { HatcherySystem } from './hatchery.js';
import { InventorySystem } from './inventory.js';
import { ShopSystem } from './shop.js';

let gameEngine;
let farmSystem;
let hatcherySystem;
let inventorySystem;
let shopSystem;

function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (targetId === 'tab-farm' && farmSystem) farmSystem.render();
      else if (targetId === 'tab-hatchery' && hatcherySystem) hatcherySystem.render();
      else if (targetId === 'tab-inventory' && inventorySystem) inventorySystem.render();
      else if (targetId === 'tab-shop' && shopSystem) shopSystem.render();
    });
  });
}

function renderDefenseDeck() {
  const deckContainer = document.getElementById('defense-deck');
  if (!deckContainer) return;
  deckContainer.innerHTML = '';

  const state = stateManager.state;

  if (state.deck.length === 0) {
    deckContainer.innerHTML = '<p class="deck-empty-hint">도감/덱 탭에서 새를 덱에 장착하세요</p>';
    return;
  }

  state.deck.forEach(birdId => {
    const template = BIRD_TEMPLATES[birdId];
    if (!template) return;

    const cost = PLACEMENT_COSTS[template.grade] || 15;
    const canAfford = gameEngine ? gameEngine.inRunCoins >= cost : true;

    const slot = document.createElement('div');
    slot.className = `deck-slot ${canAfford ? '' : 'deck-slot-poor'}`;
    slot.dataset.birdId = birdId;

    slot.innerHTML = `
      <div class="deck-slot-bird">${getBirdSVG(birdId, 32)}</div>
      <div class="deck-slot-name">${template.name}</div>
      <div class="deck-slot-cost ${canAfford ? 'cost-ok' : 'cost-no'}">🪙${cost}</div>
    `;

    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (gameEngine.selectedPlacementBird === birdId) {
        gameEngine.selectedPlacementBird = null;
        slot.classList.remove('selected');
      } else {
        deckContainer.querySelectorAll('.deck-slot').forEach(s => s.classList.remove('selected'));
        gameEngine.selectedPlacementBird = birdId;
        slot.classList.add('selected');
      }
    });

    deckContainer.appendChild(slot);
  });
}

function initDefenseControls() {
  const btnStart = document.getElementById('btn-start-wave');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (gameEngine) gameEngine.startWave();
    });
  }

  const btnSpeed = document.getElementById('btn-speed-up');
  if (btnSpeed) {
    btnSpeed.addEventListener('click', () => {
      if (gameEngine) {
        if (gameEngine.timeScale === 1.0) {
          gameEngine.timeScale = 2.0;
          btnSpeed.textContent = '속도 x2';
        } else {
          gameEngine.timeScale = 1.0;
          btnSpeed.textContent = '속도 x1';
        }
      }
    });
  }

  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      const overlay = document.getElementById('game-overlay');
      if (overlay) overlay.className = 'game-overlay-hidden';
      if (gameEngine) {
        gameEngine.resetMatch();
        gameEngine.start();
        renderDefenseDeck();
      }
    });
  }

  const btnUpgrade = document.getElementById('btn-upgrade-tower');
  if (btnUpgrade) {
    btnUpgrade.addEventListener('click', () => {
      if (gameEngine) gameEngine.upgradeSelectedTower();
    });
  }

  const btnSell = document.getElementById('btn-sell-tower');
  if (btnSell) {
    btnSell.addEventListener('click', () => {
      if (gameEngine) gameEngine.sellSelectedTower();
    });
  }
}

function subscribeStateChanges() {
  stateManager.subscribe((state) => {
    const elFeathers = document.getElementById('player-feathers');
    const elGems = document.getElementById('player-gems');

    if (elFeathers) elFeathers.textContent = state.feathers.toLocaleString();
    if (elGems) elGems.textContent = state.gems.toLocaleString();

    renderDefenseDeck();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  gameEngine = new GameEngine('game-canvas');
  farmSystem = new FarmSystem();
  hatcherySystem = new HatcherySystem();
  inventorySystem = new InventorySystem();
  shopSystem = new ShopSystem();

  initNavigation();
  initDefenseControls();
  subscribeStateChanges();

  stateManager.load();

  farmSystem.init();
  hatcherySystem.init();
  inventorySystem.init();
  shopSystem.init();

  gameEngine.resetMatch();
  gameEngine.start();
  renderDefenseDeck();
});
