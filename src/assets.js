/* Bird Tower Defense - SVG Assets, Canvas Rendering & Web Audio Synthesizer */

import { BIRD_TEMPLATES, GRADE_COLORS } from './state.js';

// --- Web Audio API 사운드 합성기 ---
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playShot() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playExplosion() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playCoin() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playHatch() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

export const soundEngine = new SoundEngine();

// --- 42종 새 커스텀 스타일 및 주 색상 테이블 ---
export const BIRD_VISUALS = {
  sparrow: { body: '#d2b48c', wing: '#8b5a2b', belly: '#f5f5dc', beak: '#ffa500' },
  heavy_bird: { body: '#707070', wing: '#404040', belly: '#a0a0a0', beak: '#333333' },
  fire_bird: { body: '#e53e3e', wing: '#dd6b20', belly: '#feebc8', beak: '#d69e2e' },
  black_bird: { body: '#2d3748', wing: '#1a202c', belly: '#4a5568', beak: '#718096' },
  
  bird2: { body: '#38a169', wing: '#276749', belly: '#c6f6d5', beak: '#ecc94b' },
  hard_bird: { body: '#4a5568', wing: '#2d3748', belly: '#cbd5e0', beak: '#1a202c' },
  gunslinger_bird: { body: '#d69e2e', wing: '#9b2c2c', belly: '#fefcbf', beak: '#744210' },
  fast_bird: { body: '#319795', wing: '#234e52', belly: '#e6fffa', beak: '#ed8936' },
  
  flame_bird: { body: '#c53030', wing: '#9b2c2c', belly: '#fff5f5', beak: '#d69e2e' },
  poison_bird: { body: '#6b46c1', wing: '#44337a', belly: '#e9d8fd', beak: '#319795' },
  farmer_bird: { body: '#dd6b20', wing: '#9c4221', belly: '#feebc8', beak: '#d69e2e' },
  summoner_bird: { body: '#3182ce', wing: '#2b6cb0', belly: '#ebf8ff', beak: '#ed8936' },
  soldier_bird: { body: '#2f855a', wing: '#22543d', belly: '#c6f6d5', beak: '#4a5568' },
  brave_bird: { body: '#b83280', wing: '#702459', belly: '#fed7e2', beak: '#d69e2e' },
  strange_bird: { body: '#805ad5', wing: '#553c9a', belly: '#faf5ff', beak: '#319795' },
  
  fancy_bird: { body: '#d69e2e', wing: '#b7791f', belly: '#fefcbf', beak: '#d69e2e' },
  miner_bird: { body: '#744210', wing: '#521b10', belly: '#feebc8', beak: '#ecc94b' },
  sniper_bird: { body: '#2c5282', wing: '#1a365d', belly: '#ebf8ff', beak: '#4a5568' },
  woodpecker: { body: '#e53e3e', wing: '#2d3748', belly: '#ffffff', beak: '#1a202c' },
  explosive_bird: { body: '#dd6b20', wing: '#c53030', belly: '#feebc8', beak: '#744210' },
  architect_bird: { body: '#319795', wing: '#285e61', belly: '#e6fffa', beak: '#d69e2e' },
  hasty_bird: { body: '#3182ce', wing: '#1a365d', belly: '#ebf8ff', beak: '#ecc94b' },
  infector_bird: { body: '#553c9a', wing: '#322659', belly: '#e9d8fd', beak: '#38a169' },
  
  party_bird: { body: '#d69e2e', wing: '#ed64a6', belly: '#fff5f5', beak: '#3182ce' },
  ice_bird: { body: '#63b3ed', wing: '#3182ce', belly: '#ebf8ff', beak: '#90cdf4' },
  gambler_bird: { body: '#ecc94b', wing: '#b7791f', belly: '#fefcbf', beak: '#c53030' },
  accurate_bird: { body: '#2b6cb0', wing: '#1a365d', belly: '#ebf8ff', beak: '#e53e3e' },
  hot_bird: { body: '#9b2c2c', wing: '#742a2a', belly: '#fff5f5', beak: '#dd6b20' },
  minigun_bird: { body: '#4a5568', wing: '#1a202c', belly: '#e2e8f0', beak: '#d69e2e' },
  commander_bird: { body: '#2c5282', wing: '#1a202c', belly: '#ebf8ff', beak: '#ecc94b' },
  musician_bird: { body: '#805ad5', wing: '#44337a', belly: '#faf5ff', beak: '#ed64a6' },
  assassin_bird: { body: '#1a202c', wing: '#000000', belly: '#4a5568', beak: '#e53e3e' },
  
  bird_o_tron: { body: '#4a5568', wing: '#3182ce', belly: '#e2e8f0', beak: '#ecc94b' },
  engineer_bird: { body: '#dd6b20', wing: '#744210', belly: '#feebc8', beak: '#319795' },
  pelican: { body: '#e2e8f0', wing: '#a0aec0', belly: '#ffffff', beak: '#dd6b20' },
  cursed_bird: { body: '#742a2a', wing: '#4a154b', belly: '#fff5f5', beak: '#9b2c2c' },
  hacker_bird: { body: '#22543d', wing: '#1c4532', belly: '#c6f6d5', beak: '#38a169' },
  duck: { body: '#ecc94b', wing: '#d69e2e', belly: '#fefcbf', beak: '#dd6b20' },
  pigeon: { body: '#a0aec0', wing: '#718096', belly: '#edf2f7', beak: '#ed64a6' },
  firebug: { body: '#c53030', wing: '#9b2c2c', belly: '#feebc8', beak: '#e53e3e' },
  charged_bird: { body: '#3182ce', wing: '#2b6cb0', belly: '#ebf8ff', beak: '#ecc94b' },
  hen: { body: '#ffffff', wing: '#e2e8f0', belly: '#feebc8', beak: '#dd6b20' }
};

// --- Egg SVG Renderer ---
export function getEggSVG(type, size = 40) {
  const gradeColor = GRADE_COLORS[type] || '#ffffff';
  return `
    <svg width="${size}" height="${size * 1.2}" viewBox="0 0 40 48" style="display:inline-block; overflow:visible; filter: drop-shadow(0 0 6px ${gradeColor});">
      <defs>
        <radialGradient id="egg-grad-${type}" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="${gradeColor}"/>
          <stop offset="100%" stop-color="#1a202c"/>
        </radialGradient>
      </defs>
      <path d="M20,4 C30,4 36,20 36,32 C36,42 29,46 20,46 C11,46 4,42 4,32 C4,20 10,4 20,4 Z" fill="url(#egg-grad-${type})" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
    </svg>
  `;
}

// --- HTML용 Bird SVG Renderer ---
export function getBirdSVG(type, size = 60) {
  const vis = BIRD_VISUALS[type] || { body: '#3182ce', wing: '#2b6cb0', belly: '#ebf8ff', beak: '#ecc94b' };
  const template = BIRD_TEMPLATES[type];
  const gradeColor = template ? GRADE_COLORS[template.grade] : '#ffffff';

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 60 60" style="display:block; overflow:visible; filter: drop-shadow(0 0 4px ${gradeColor}88);">
      <circle cx="30" cy="52" r="16" fill="rgba(0,0,0,0.2)" />
      <!-- 몸통 -->
      <circle cx="30" cy="30" r="18" fill="${vis.body}" />
      <circle cx="30" cy="34" r="13" fill="${vis.belly}" />
      <!-- 날개 -->
      <path d="M12,30 C6,25 6,37 12,38 Z" fill="${vis.wing}" />
      <path d="M48,30 C54,25 54,37 48,38 Z" fill="${vis.wing}" />
      <!-- 눈 -->
      <circle cx="23" cy="20" r="3" fill="#1a202c" />
      <circle cx="24" cy="19" r="1" fill="#ffffff" />
      <circle cx="37" cy="20" r="3" fill="#1a202c" />
      <circle cx="38" cy="19" r="1" fill="#ffffff" />
      <!-- 부리 -->
      <polygon points="26,24 34,24 30,32" fill="${vis.beak}" />
    </svg>
  `;
}

// --- Canvas용 Bird Rendering ---
export function drawBirdCanvas(ctx, type, x, y, size, angle = 0, state = {}) {
  const vis = BIRD_VISUALS[type] || { body: '#3182ce', wing: '#2b6cb0', belly: '#ebf8ff', beak: '#ecc94b' };
  
  ctx.save();
  ctx.translate(x, y);
  
  // 선택시 사거리 원
  if (state.isSelected && state.range) {
    ctx.strokeStyle = 'rgba(66, 153, 225, 0.4)';
    ctx.fillStyle = 'rgba(66, 153, 225, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, state.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }

  // 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, size * 0.45, size * 0.4, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.rotate(angle);

  // 몸통
  ctx.fillStyle = vis.body;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 배
  ctx.fillStyle = vis.belly;
  ctx.beginPath();
  ctx.arc(0, size * 0.1, size * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // 부리
  ctx.fillStyle = vis.beak;
  ctx.beginPath();
  ctx.moveTo(size * 0.2, -size * 0.08);
  ctx.lineTo(size * 0.45, 0);
  ctx.lineTo(size * 0.2, size * 0.08);
  ctx.closePath();
  ctx.fill();

  // 눈
  ctx.fillStyle = '#1a202c';
  ctx.beginPath();
  ctx.arc(size * 0.12, -size * 0.15, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size * 0.14, -size * 0.17, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  // 레벨 표기
  if (state.level) {
    ctx.rotate(-angle);
    ctx.fillStyle = '#ecc94b';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Lv.' + state.level, 0, -size * 0.45);
  }

  ctx.restore();
}
