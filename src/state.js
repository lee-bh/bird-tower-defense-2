/* Bird Tower Defense - State & Data Model (Full GDD Specification) */

export const GRADES = {
  NORMAL: 'normal',       // 일반 (흰색)
  UNCOMMON: 'uncommon',   // 고급 (초록색)
  RARE: 'rare',           // 레어 (파란색)
  EPIC: 'epic',           // 에픽 (보라색)
  LEGENDARY: 'legendary', // 전설 (노란색)
  MYTHIC: 'mythic'        // 신화 (빨간색)
};

export const GRADE_COLORS = {
  [GRADES.NORMAL]: '#e2e8f0',
  [GRADES.UNCOMMON]: '#38a169',
  [GRADES.RARE]: '#3182ce',
  [GRADES.EPIC]: '#805ad5',
  [GRADES.LEGENDARY]: '#d69e2e',
  [GRADES.MYTHIC]: '#e53e3e'
};

export const GRADE_NAMES = {
  [GRADES.NORMAL]: '일반',
  [GRADES.UNCOMMON]: '고급',
  [GRADES.RARE]: '레어',
  [GRADES.EPIC]: '에픽',
  [GRADES.LEGENDARY]: '전설',
  [GRADES.MYTHIC]: '신화'
};

// 등급별 필드 배치 비용 (코인)
export const PLACEMENT_COSTS = {
  [GRADES.NORMAL]: 15,
  [GRADES.UNCOMMON]: 30,
  [GRADES.RARE]: 60,
  [GRADES.EPIC]: 120,
  [GRADES.LEGENDARY]: 250,
  [GRADES.MYTHIC]: 500
};

// 등급별 알 가격 (깃털)
export const EGG_PRICES = {
  [GRADES.NORMAL]: 50,
  [GRADES.UNCOMMON]: 200,
  [GRADES.RARE]: 800,
  [GRADES.EPIC]: 3000,
  [GRADES.LEGENDARY]: 15000,
  [GRADES.MYTHIC]: 100000
};

// 42종 새 수치 및 스킬 정의
export const BIRD_TEMPLATES = {
  // --- 9-1. 일반 (흰색) — 4종 ---
  sparrow: {
    id: 'sparrow', name: '참새', grade: GRADES.NORMAL, type: '단일 공격형',
    desc: '공격속도가 빠르고 사거리가 무난한 기본기 새.',
    levels: [
      { level: 1, atk: 1, interval: 1.02, range: 120, cost: 0, effectDesc: '-' },
      { level: 2, atk: 2, interval: 0.85, range: 128, cost: 80, effectDesc: '-' },
      { level: 3, atk: 3, interval: 0.68, range: 140, cost: 180, effectDesc: '-' }
    ]
  },
  heavy_bird: {
    id: 'heavy_bird', name: '무거운 새', grade: GRADES.NORMAL, type: '단일 공격형 (고위력)',
    desc: '공격속도는 느리지만 한 방 데미지가 크고 적을 넉백/기절시킵니다.',
    levels: [
      { level: 1, atk: 2, interval: 1.70, range: 100, cost: 0, effectDesc: '기절 확률 15%', stunChance: 0.15, stunTime: 0.6 },
      { level: 2, atk: 4, interval: 1.53, range: 108, cost: 110, effectDesc: '기절 확률 20%', stunChance: 0.20, stunTime: 0.8 },
      { level: 3, atk: 5, interval: 1.36, range: 120, cost: 260, effectDesc: '기절 확률 25%', stunChance: 0.25, stunTime: 1.0 }
    ]
  },
  fire_bird: {
    id: 'fire_bird', name: '불새', grade: GRADES.NORMAL, type: '광역 공격형',
    desc: '착탄 지점에 화염 범위 피해를 주며 지속 화상 피해를 남깁니다.',
    levels: [
      { level: 1, atk: 1, interval: 1.27, range: 112, cost: 0, effectDesc: '화상 0.4/초 (3초)', aoeRadius: 40, burnDmg: 0.4, burnDur: 3 },
      { level: 2, atk: 1, interval: 1.10, range: 120, cost: 120, effectDesc: '화상 0.6/초 (3초)', aoeRadius: 45, burnDmg: 0.6, burnDur: 3 },
      { level: 3, atk: 2, interval: 0.94, range: 132, cost: 280, effectDesc: '화상 0.9/초 (4초)', aoeRadius: 50, burnDmg: 0.9, burnDur: 4 }
    ]
  },
  black_bird: {
    id: 'black_bird', name: '검은 새', grade: GRADES.NORMAL, type: '디버프형',
    desc: '공격한 적의 이동속도를 크게 감소시킵니다.',
    levels: [
      { level: 1, atk: 1, interval: 0.85, range: 120, cost: 0, effectDesc: '이동속도 -20% (2초)', slowRate: 0.20, slowDur: 2 },
      { level: 2, atk: 1, interval: 0.77, range: 128, cost: 90, effectDesc: '이동속도 -25% (2.5초)', slowRate: 0.25, slowDur: 2.5 },
      { level: 3, atk: 1, interval: 0.68, range: 140, cost: 200, effectDesc: '이동속도 -30% (3초)', slowRate: 0.30, slowDur: 3 }
    ]
  },

  // --- 9-2. 고급 (초록색) — 4종 ---
  bird2: {
    id: 'bird2', name: '새 2.0', grade: GRADES.UNCOMMON, type: '단일 공격형 (전천후)',
    desc: '공격력/속도/사거리가 모두 고르게 준수한 범용 딜러 유닛.',
    levels: [
      { level: 1, atk: 4, interval: 0.85, range: 132, cost: 0, effectDesc: '-' },
      { level: 2, atk: 6, interval: 0.72, range: 140, cost: 180, effectDesc: '-' },
      { level: 3, atk: 8, interval: 0.59, range: 152, cost: 440, effectDesc: '-' }
    ]
  },
  hard_bird: {
    id: 'hard_bird', name: '단단한 새', grade: GRADES.UNCOMMON, type: '저지형 (CC)',
    desc: '공격 시 적을 그 자리에 잠시 속박합니다.',
    levels: [
      { level: 1, atk: 3, interval: 1.10, range: 112, cost: 0, effectDesc: '속박 확률 10% (1초)', rootChance: 0.10, rootDur: 1.0 },
      { level: 2, atk: 5, interval: 0.94, range: 120, cost: 220, effectDesc: '속박 확률 14% (1.2초)', rootChance: 0.14, rootDur: 1.2 },
      { level: 3, atk: 7, interval: 0.77, range: 132, cost: 520, effectDesc: '속박 확률 18% (1.5초)', rootChance: 0.18, rootDur: 1.5 }
    ]
  },
  gunslinger_bird: {
    id: 'gunslinger_bird', name: '총잡이 새', grade: GRADES.UNCOMMON, type: '관통 공격형',
    desc: '일직선상의 여러 적을 동시에 관통하는 사격을 합니다.',
    levels: [
      { level: 1, atk: 5, interval: 0.94, range: 160, cost: 0, effectDesc: '관통 3명', pierceCount: 3 },
      { level: 2, atk: 8, interval: 0.81, range: 172, cost: 240, effectDesc: '관통 4명', pierceCount: 4 },
      { level: 3, atk: 12, interval: 0.68, range: 184, cost: 560, effectDesc: '관통 5명', pierceCount: 5 }
    ]
  },
  fast_bird: {
    id: 'fast_bird', name: '빠른 새', grade: GRADES.UNCOMMON, type: '다단 공격형',
    desc: '공격속도가 매우 빨라 많은 타격 횟수를 자랑합니다.',
    levels: [
      { level: 1, atk: 3, interval: 0.42, range: 100, cost: 0, effectDesc: '-' },
      { level: 2, atk: 4, interval: 0.34, range: 108, cost: 190, effectDesc: '-' },
      { level: 3, atk: 6, interval: 0.26, range: 120, cost: 460, effectDesc: '-' }
    ]
  },

  // --- 9-3. 레어 (파란색) — 7종 ---
  flame_bird: {
    id: 'flame_bird', name: '화염 새', grade: GRADES.RARE, type: '광역 공격형 (도트)',
    desc: '넓은 범위의 여러 적에게 지속 화상 피해를 건다.',
    levels: [
      { level: 1, atk: 4, interval: 1.19, range: 120, cost: 0, effectDesc: '화상 0.7/초 (3초)', aoeRadius: 50, burnDmg: 0.7, burnDur: 3 },
      { level: 2, atk: 6, interval: 1.02, range: 128, cost: 160, effectDesc: '화상 0.9/초 (3초)', aoeRadius: 55, burnDmg: 0.9, burnDur: 3 },
      { level: 3, atk: 8, interval: 0.89, range: 136, cost: 340, effectDesc: '화상 1.2/초 (4초)', aoeRadius: 60, burnDmg: 1.2, burnDur: 4 },
      { level: 4, atk: 11, interval: 0.77, range: 144, cost: 640, effectDesc: '화상 1.6/초 (4초)', aoeRadius: 65, burnDmg: 1.6, burnDur: 4 }
    ]
  },
  poison_bird: {
    id: 'poison_bird', name: '중독된 새', grade: GRADES.RARE, type: '디버프형 (중첩)',
    desc: '공격 시 맹독 스택을 쌓아 3스택 시 폭발 피해를 일으킵니다.',
    levels: [
      { level: 1, atk: 5, interval: 1.10, range: 128, cost: 0, effectDesc: '독 0.7, 3스택 폭발 6.0', poisonDmg: 0.7, maxStack: 3, explodeDmg: 6.0 },
      { level: 2, atk: 7, interval: 0.98, range: 136, cost: 180, effectDesc: '독 0.9, 3스택 폭발 8.0', poisonDmg: 0.9, maxStack: 3, explodeDmg: 8.0 },
      { level: 3, atk: 10, interval: 0.85, range: 144, cost: 380, effectDesc: '독 1.2, 3스택 폭발 11.0', poisonDmg: 1.2, maxStack: 3, explodeDmg: 11.0 },
      { level: 4, atk: 13, interval: 0.77, range: 152, cost: 700, effectDesc: '독 1.6, 3스택 폭발 14.0', poisonDmg: 1.6, maxStack: 3, explodeDmg: 14.0 }
    ]
  },
  farmer_bird: {
    id: 'farmer_bird', name: '농부 새', grade: GRADES.RARE, type: '지원형 (경제)',
    desc: '배치되어 있는 동안 매 초마다 소량의 코인을 자동 생성합니다.',
    levels: [
      { level: 1, atk: 0, interval: 1.27, range: 100, cost: 0, effectDesc: '초당 코인 +1', cps: 1.0 },
      { level: 2, atk: 0, interval: 1.19, range: 108, cost: 140, effectDesc: '초당 코인 +1.5', cps: 1.5 },
      { level: 3, atk: 0, interval: 1.10, range: 116, cost: 300, effectDesc: '초당 코인 +2.5', cps: 2.5 },
      { level: 4, atk: 0, interval: 1.02, range: 124, cost: 560, effectDesc: '초당 코인 +4.0', cps: 4.0 }
    ]
  },
  summoner_bird: {
    id: 'summoner_bird', name: '소환사 새', grade: GRADES.RARE, type: '소환형',
    desc: '주기적으로 병아리를 소환해 함께 싸웁니다.',
    levels: [
      { level: 1, atk: 1, interval: 1.70, range: 112, cost: 0, effectDesc: '5.1초마다 병아리 1마리 (ATK 0.5)', summonCD: 5.1, chickCount: 1, chickAtk: 0.5 },
      { level: 2, atk: 1.5, interval: 1.53, range: 120, cost: 170, effectDesc: '4.2초마다 병아리 1마리 (ATK 0.7)', summonCD: 4.2, chickCount: 1, chickAtk: 0.7 },
      { level: 3, atk: 2, interval: 1.36, range: 128, cost: 360, effectDesc: '3.4초마다 병아리 2마리 (ATK 1.0)', summonCD: 3.4, chickCount: 2, chickAtk: 1.0 },
      { level: 4, atk: 3, interval: 1.19, range: 136, cost: 660, effectDesc: '3.0초마다 병아리 2마리 (ATK 1.3)', summonCD: 3.0, chickCount: 2, chickAtk: 1.3 }
    ]
  },
  soldier_bird: {
    id: 'soldier_bird', name: '병사 새', grade: GRADES.RARE, type: '중거리 연사형',
    desc: '기관총으로 중거리에서 매우 빠르게 연사합니다.',
    levels: [
      { level: 1, atk: 3, interval: 0.26, range: 160, cost: 0, effectDesc: '-' },
      { level: 2, atk: 5, interval: 0.21, range: 168, cost: 160, effectDesc: '-' },
      { level: 3, atk: 7, interval: 0.17, range: 176, cost: 340, effectDesc: '-' },
      { level: 4, atk: 9, interval: 0.13, range: 184, cost: 640, effectDesc: '-' }
    ]
  },
  brave_bird: {
    id: 'brave_bird', name: '용감한 새', grade: GRADES.RARE, type: '각성형',
    desc: '성과 가까운 구역에 배치될수록 피해량이 크게 상승합니다.',
    levels: [
      { level: 1, atk: 5, interval: 1.02, range: 100, cost: 0, effectDesc: '성 근접 보너스 +10%', castleBonus: 0.10 },
      { level: 2, atk: 7, interval: 0.89, range: 108, cost: 170, effectDesc: '성 근접 보너스 +15%', castleBonus: 0.15 },
      { level: 3, atk: 10, interval: 0.77, range: 116, cost: 360, effectDesc: '성 근접 보너스 +20%', castleBonus: 0.20 },
      { level: 4, atk: 13, interval: 0.68, range: 124, cost: 660, effectDesc: '성 근접 보너스 +25%', castleBonus: 0.25 }
    ]
  },
  strange_bird: {
    id: 'strange_bird', name: '이상한 새', grade: GRADES.RARE, type: '랜덤형',
    desc: '공격마다 피해량과 부가효과(둔화/화상/기절)가 무작위로 적용됩니다.',
    levels: [
      { level: 1, atkMin: 3, atkMax: 6, interval: 1.10, range: 120, cost: 0, effectDesc: '랜덤 딜 & 디버프' },
      { level: 2, atkMin: 4, atkMax: 8, interval: 0.98, range: 128, cost: 180, effectDesc: '랜덤 딜 & 디버프' },
      { level: 3, atkMin: 6, atkMax: 11, interval: 0.85, range: 136, cost: 380, effectDesc: '랜덤 딜 & 디버프' },
      { level: 4, atkMin: 8, atkMax: 14, interval: 0.77, range: 144, cost: 700, effectDesc: '랜덤 딜 & 디버프' }
    ]
  },

  // --- 9-4. 에픽 (보라색) — 8종 ---
  fancy_bird: {
    id: 'fancy_bird', name: '화려한 새', grade: GRADES.EPIC, type: '코인 타워 (경제)',
    desc: '화려한 자태로 지속적으로 다량의 코인을 생산하는 경제형 타워.',
    levels: [
      { level: 1, atk: 0, interval: 1.0, range: 0, cost: 0, effectDesc: '초당 코인 +2.5', cps: 2.5 },
      { level: 2, atk: 0, interval: 1.0, range: 0, cost: 300, effectDesc: '초당 코인 +4.0', cps: 4.0 },
      { level: 3, atk: 0, interval: 1.0, range: 0, cost: 640, effectDesc: '초당 코인 +6.5', cps: 6.5 },
      { level: 4, atk: 0, interval: 1.0, range: 0, cost: 1200, effectDesc: '초당 코인 +9.5', cps: 9.5 }
    ]
  },
  miner_bird: {
    id: 'miner_bird', name: '광부 새', grade: GRADES.EPIC, type: '채굴형',
    desc: '적의 방어력을 무시하며 처치 시 일정 확률로 깃털을 획득합니다.',
    levels: [
      { level: 1, atk: 8, interval: 0.94, range: 120, cost: 0, effectDesc: '방어무시, 깃털 드롭 5%', featherChance: 0.05, ignoreArmor: true },
      { level: 2, atk: 11, interval: 0.81, range: 128, cost: 280, effectDesc: '방어무시, 깃털 드롭 7%', featherChance: 0.07, ignoreArmor: true },
      { level: 3, atk: 15, interval: 0.72, range: 136, cost: 600, effectDesc: '방어무시, 깃털 드롭 10%', featherChance: 0.10, ignoreArmor: true },
      { level: 4, atk: 20, interval: 0.64, range: 144, cost: 1100, effectDesc: '방어무시, 깃털 드롭 14%', featherChance: 0.14, ignoreArmor: true }
    ]
  },
  sniper_bird: {
    id: 'sniper_bird', name: '저격수 새', grade: GRADES.EPIC, type: '초장거리 처형형',
    desc: '사거리가 매우 길며 체력이 일정 % 이하인 적을 즉시 처형합니다.',
    levels: [
      { level: 1, atk: 12, interval: 2.12, range: 240, cost: 0, effectDesc: '체력 15% 이하 즉시 처형', execPct: 0.15 },
      { level: 2, atk: 16, interval: 1.87, range: 252, cost: 320, effectDesc: '체력 18% 이하 즉시 처형', execPct: 0.18 },
      { level: 3, atk: 21, interval: 1.61, range: 264, cost: 680, effectDesc: '체력 22% 이하 즉시 처형', execPct: 0.22 },
      { level: 4, atk: 28, interval: 1.36, range: 280, cost: 1240, effectDesc: '체력 27% 이하 즉시 처형', execPct: 0.27 }
    ]
  },
  woodpecker: {
    id: 'woodpecker', name: '딱다구리', grade: GRADES.EPIC, type: '연속 타격형 (방깎)',
    desc: '초고속 부리 쪼기로 타격마다 적의 방어력을 깎아 누적시킵니다.',
    levels: [
      { level: 1, atk: 4, interval: 0.21, range: 104, cost: 0, effectDesc: '방어력 -2% (최대 5스택)', armorShred: 0.02, maxShredStack: 5 },
      { level: 2, atk: 5, interval: 0.17, range: 112, cost: 300, effectDesc: '방어력 -3% (최대 6스택)', armorShred: 0.03, maxShredStack: 6 },
      { level: 3, atk: 8, interval: 0.14, range: 120, cost: 640, effectDesc: '방어력 -4% (최대 7스택)', armorShred: 0.04, maxShredStack: 7 },
      { level: 4, atk: 10, interval: 0.12, range: 128, cost: 1160, effectDesc: '방어력 -5% (최대 8스택)', armorShred: 0.05, maxShredStack: 8 }
    ]
  },
  explosive_bird: {
    id: 'explosive_bird', name: '폭발성 새', grade: GRADES.EPIC, type: '폭발 공격형',
    desc: '원거리 폭발탄을 발사하며, 회수 시 주변에 대폭발을 일으킵니다.',
    levels: [
      { level: 1, atk: 7, interval: 1.36, range: 140, cost: 0, effectDesc: '파괴/회수시 폭발 4.0', aoeRadius: 48, deathExplode: 4.0 },
      { level: 2, atk: 9, interval: 1.19, range: 148, cost: 300, effectDesc: '파괴/회수시 폭발 5.5', aoeRadius: 52, deathExplode: 5.5 },
      { level: 3, atk: 12, interval: 1.02, range: 156, cost: 640, effectDesc: '파괴/회수시 폭발 7.5', aoeRadius: 56, deathExplode: 7.5 },
      { level: 4, atk: 16, interval: 0.89, range: 164, cost: 1160, effectDesc: '파괴/회수시 폭발 10.0', aoeRadius: 60, deathExplode: 10.0 }
    ]
  },
  architect_bird: {
    id: 'architect_bird', name: '건축가 새', grade: GRADES.EPIC, type: '설치 지원형',
    desc: '필드 상에 일정 시간 유지되는 임시 포탑을 설치합니다.',
    levels: [
      { level: 1, atk: 3, interval: 1.27, range: 112, cost: 0, effectDesc: '8.5초마다 포탑(ATK 4, 5초)', turretCD: 8.5, turretAtk: 4, turretDur: 5 },
      { level: 2, atk: 4, interval: 1.15, range: 120, cost: 320, effectDesc: '7.6초마다 포탑(ATK 5, 6초)', turretCD: 7.6, turretAtk: 5, turretDur: 6 },
      { level: 3, atk: 5, interval: 1.02, range: 128, cost: 660, effectDesc: '6.8초마다 포탑(ATK 6, 7초)', turretCD: 6.8, turretAtk: 6, turretDur: 7 },
      { level: 4, atk: 7, interval: 0.89, range: 136, cost: 1200, effectDesc: '6.0초마다 포탑(ATK 8, 8초)', turretCD: 6.0, turretAtk: 8, turretDur: 8 }
    ]
  },
  hasty_bird: {
    id: 'hasty_bird', name: '급한 새', grade: GRADES.EPIC, type: '지원형 (오라)',
    desc: '주변 새들의 공격속도를 크게 상승시키는 오라를 발산합니다.',
    levels: [
      { level: 1, atk: 3, interval: 1.10, range: 104, cost: 0, effectDesc: '주변 공격속도 +8%', auraSpd: 0.08, auraRange: 120 },
      { level: 2, atk: 4, interval: 0.98, range: 112, cost: 280, effectDesc: '주변 공격속도 +12%', auraSpd: 0.12, auraRange: 130 },
      { level: 3, atk: 5, interval: 0.85, range: 120, cost: 600, effectDesc: '주변 공격속도 +16%', auraSpd: 0.16, auraRange: 140 },
      { level: 4, atk: 7, interval: 0.77, range: 128, cost: 1100, effectDesc: '주변 공격속도 +20%', auraSpd: 0.20, auraRange: 150 }
    ]
  },
  infector_bird: {
    id: 'infector_bird', name: '감염자 새', grade: GRADES.EPIC, type: '전염형 디버프',
    desc: '공격 시 감염을 걸어 주변 적들에게 지속 도트 피해가 전파되게 합니다.',
    levels: [
      { level: 1, atk: 4, interval: 1.19, range: 120, cost: 0, effectDesc: '전파 20%, 도트 0.5/초 (4초)', infectChance: 0.20, dotDmg: 0.5, dotDur: 4 },
      { level: 2, atk: 5, interval: 1.02, range: 128, cost: 300, effectDesc: '전파 25%, 도트 0.7/초 (4초)', infectChance: 0.25, dotDmg: 0.7, dotDur: 4 },
      { level: 3, atk: 7, interval: 0.89, range: 136, cost: 640, effectDesc: '전파 30%, 도트 1.0/초 (5초)', infectChance: 0.30, dotDmg: 1.0, dotDur: 5 },
      { level: 4, atk: 9, interval: 0.77, range: 144, cost: 1160, effectDesc: '전파 35%, 도트 1.3/초 (5초)', infectChance: 0.35, dotDmg: 1.3, dotDur: 5 }
    ]
  },

  // --- 9-5. 전설 (노란색) — 9종 ---
  party_bird: {
    id: 'party_bird', name: '파티광 새', grade: GRADES.LEGENDARY, type: '지원형 (광역 버프)',
    desc: '신나는 파티 오라로 주변 새들의 공격력과 공격속도를 동시 상승시킵니다.',
    levels: [
      { level: 1, atk: 2, interval: 1.02, range: 112, cost: 0, effectDesc: '주변 ATK+5%, SPD+5%', auraAtk: 0.05, auraSpd: 0.05, auraRange: 130 },
      { level: 2, atk: 3, interval: 0.89, range: 120, cost: 400, effectDesc: '주변 ATK+7%, SPD+7%', auraAtk: 0.07, auraSpd: 0.07, auraRange: 140 },
      { level: 3, atk: 4, interval: 0.77, range: 128, cost: 840, effectDesc: '주변 ATK+9%, SPD+9%', auraAtk: 0.09, auraSpd: 0.09, auraRange: 150 },
      { level: 4, atk: 5, interval: 0.68, range: 136, cost: 1500, effectDesc: '주변 ATK+11%, SPD+11%', auraAtk: 0.11, auraSpd: 0.11, auraRange: 160 },
      { level: 5, atk: 6, interval: 0.59, range: 144, cost: 2400, effectDesc: '주변 ATK+14%, SPD+14%', auraAtk: 0.14, auraSpd: 0.14, auraRange: 170 }
    ]
  },
  ice_bird: {
    id: 'ice_bird', name: '얼음새', grade: GRADES.LEGENDARY, type: '광역 제어형',
    desc: '냉기를 뿜어 다수의 적 이동속도를 감소시키며 빙결을 겁니다.',
    levels: [
      { level: 1, atk: 6, interval: 1.27, range: 128, cost: 0, effectDesc: '속도 -30%, 빙결 10% (1초)', slowRate: 0.30, freezeChance: 0.10, freezeDur: 1.0, aoeRadius: 60 },
      { level: 2, atk: 8, interval: 1.10, range: 136, cost: 420, effectDesc: '속도 -35%, 빙결 13% (1.2초)', slowRate: 0.35, freezeChance: 0.13, freezeDur: 1.2, aoeRadius: 65 },
      { level: 3, atk: 11, interval: 0.98, range: 144, cost: 880, effectDesc: '속도 -40%, 빙결 16% (1.4초)', slowRate: 0.40, freezeChance: 0.16, freezeDur: 1.4, aoeRadius: 70 },
      { level: 4, atk: 14, interval: 0.85, range: 152, cost: 1560, effectDesc: '속도 -45%, 빙결 19% (1.6초)', slowRate: 0.45, freezeChance: 0.19, freezeDur: 1.6, aoeRadius: 75 },
      { level: 5, atk: 18, interval: 0.77, range: 160, cost: 2500, effectDesc: '속도 -50%, 빙결 22% (2초)', slowRate: 0.50, freezeChance: 0.22, freezeDur: 2.0, aoeRadius: 80 }
    ]
  },
  gambler_bird: {
    id: 'gambler_bird', name: '도박사 새', grade: GRADES.LEGENDARY, type: '지원형 (경제, 랜덤)',
    desc: '주기적으로 무작위 금액의 코인을 터뜨리는 도박형 경제 유닛.',
    levels: [
      { level: 1, atk: 0, interval: 4.20, range: 0, cost: 0, effectDesc: '4.2초마다 4~24 코인', coinMin: 4, coinMax: 24 },
      { level: 2, atk: 0, interval: 3.80, range: 0, cost: 400, effectDesc: '3.8초마다 6~36 코인', coinMin: 6, coinMax: 36 },
      { level: 3, atk: 0, interval: 3.40, range: 0, cost: 840, effectDesc: '3.4초마다 10~52 코인', coinMin: 10, coinMax: 52 },
      { level: 4, atk: 0, interval: 3.00, range: 0, cost: 1500, effectDesc: '3.0초마다 14~72 코인', coinMin: 14, coinMax: 72 },
      { level: 5, atk: 0, interval: 2.50, range: 0, cost: 2400, effectDesc: '2.5초마다 20~96 코인', coinMin: 20, coinMax: 96 }
    ]
  },
  accurate_bird: {
    id: 'accurate_bird', name: '정확한 새', grade: GRADES.LEGENDARY, type: '단일 관통형 (필중)',
    desc: '절대 빗나가지 않는 관통 탄환을 발사합니다.',
    levels: [
      { level: 1, atk: 12, interval: 1.10, range: 160, cost: 0, effectDesc: '필중, 관통 2명', pierceCount: 2, alwaysHit: true },
      { level: 2, atk: 16, interval: 0.98, range: 168, cost: 440, effectDesc: '필중, 관통 3명', pierceCount: 3, alwaysHit: true },
      { level: 3, atk: 21, interval: 0.85, range: 176, cost: 920, effectDesc: '필중, 관통 4명', pierceCount: 4, alwaysHit: true },
      { level: 4, atk: 27, interval: 0.77, range: 184, cost: 1600, effectDesc: '필중, 관통 5명', pierceCount: 5, alwaysHit: true },
      { level: 5, atk: 34, interval: 0.68, range: 192, cost: 2600, effectDesc: '필중, 관통 6명', pierceCount: 6, alwaysHit: true }
    ]
  },
  hot_bird: {
    id: 'hot_bird', name: '뜨거운 새', grade: GRADES.LEGENDARY, type: '장판 설치형',
    desc: '경로 위에 일정 시간 지속되는 용암 장판을 깔아 도트 피해를 줍니다.',
    levels: [
      { level: 1, atk: 2, interval: 1.36, range: 112, cost: 0, effectDesc: '10.2초마다 용암(2/초, 4초)', lavaCD: 10.2, lavaDmg: 2, lavaDur: 4, lavaRadius: 40 },
      { level: 2, atk: 3, interval: 1.19, range: 120, cost: 400, effectDesc: '8.5초마다 용암(3/초, 4초)', lavaCD: 8.5, lavaDmg: 3, lavaDur: 4, lavaRadius: 45 },
      { level: 3, atk: 4, interval: 1.02, range: 128, cost: 840, effectDesc: '7.6초마다 용암(4/초, 5초)', lavaCD: 7.6, lavaDmg: 4, lavaDur: 5, lavaRadius: 50 },
      { level: 4, atk: 5, interval: 0.89, range: 136, cost: 1500, effectDesc: '6.8초마다 용암(6/초, 5초)', lavaCD: 6.8, lavaDmg: 6, lavaDur: 5, lavaRadius: 55 },
      { level: 5, atk: 6, interval: 0.77, range: 144, cost: 2400, effectDesc: '6.0초마다 용암(8/초, 6초)', lavaCD: 6.0, lavaDmg: 8, lavaDur: 6, lavaRadius: 60 }
    ]
  },
  minigun_bird: {
    id: 'minigun_bird', name: '미니건 새', grade: GRADES.LEGENDARY, type: '광역 연사형',
    desc: '부채꼴 범위로 엄청난 속도의 연속 난사를 퍼붓습니다.',
    levels: [
      { level: 1, atk: 3, interval: 0.17, range: 120, cost: 0, effectDesc: '동시 5명 난사', multiTarget: 5 },
      { level: 2, atk: 4, interval: 0.14, range: 128, cost: 420, effectDesc: '동시 6명 난사', multiTarget: 6 },
      { level: 3, atk: 6, interval: 0.12, range: 136, cost: 880, effectDesc: '동시 7명 난사', multiTarget: 7 },
      { level: 4, atk: 8, interval: 0.10, range: 144, cost: 1560, effectDesc: '동시 8명 난사', multiTarget: 8 },
      { level: 5, atk: 10, interval: 0.09, range: 152, cost: 2500, effectDesc: '동시 10명 난사', multiTarget: 10 }
    ]
  },
  commander_bird: {
    id: 'commander_bird', name: '지휘관 새', grade: GRADES.LEGENDARY, type: '지원형 (전술)',
    desc: '아군의 공격 유형별로 각기 다른 전술 보너스를 부여합니다.',
    levels: [
      { level: 1, atk: 3, interval: 1.19, range: 112, cost: 0, effectDesc: '단일 치명+5%, 광역범위+5%', auraCrit: 0.05, auraAoe: 0.05, auraRange: 140 },
      { level: 2, atk: 4, interval: 1.06, range: 120, cost: 400, effectDesc: '단일 치명+7%, 광역범위+7%', auraCrit: 0.07, auraAoe: 0.07, auraRange: 150 },
      { level: 3, atk: 6, interval: 0.94, range: 128, cost: 840, effectDesc: '단일 치명+9%, 광역범위+9%', auraCrit: 0.09, auraAoe: 0.09, auraRange: 160 },
      { level: 4, atk: 8, interval: 0.85, range: 136, cost: 1500, effectDesc: '단일 치명+12%, 광역범위+12%', auraCrit: 0.12, auraAoe: 0.12, auraRange: 170 },
      { level: 5, atk: 10, interval: 0.77, range: 144, cost: 2400, effectDesc: '단일 치명+15%, 광역범위+15%', auraCrit: 0.15, auraAoe: 0.15, auraRange: 180 }
    ]
  },
  musician_bird: {
    id: 'musician_bird', name: '음악가 새', grade: GRADES.LEGENDARY, type: '지원형 (크리티컬 버프)',
    desc: '아름다운 선율로 주변 새들의 치명타율과 치명타 피해를 중첩 상승시킵니다.',
    levels: [
      { level: 1, atk: 3, interval: 1.10, range: 112, cost: 0, effectDesc: '6.8초마다 치명률+2%p, 피해+10%', pulseCD: 6.8, stackCritChance: 0.02, stackCritDmg: 0.10, maxStack: 5, auraRange: 140 },
      { level: 2, atk: 4, interval: 0.98, range: 120, cost: 420, effectDesc: '치명률+3%p, 피해+13%', pulseCD: 6.8, stackCritChance: 0.03, stackCritDmg: 0.13, maxStack: 5, auraRange: 150 },
      { level: 3, atk: 6, interval: 0.85, range: 128, cost: 880, effectDesc: '치명률+4%p, 피해+16%', pulseCD: 6.8, stackCritChance: 0.04, stackCritDmg: 0.16, maxStack: 5, auraRange: 160 },
      { level: 4, atk: 8, interval: 0.77, range: 136, cost: 1560, effectDesc: '치명률+5%p, 피해+20%', pulseCD: 6.8, stackCritChance: 0.05, stackCritDmg: 0.20, maxStack: 5, auraRange: 170 },
      { level: 5, atk: 10, interval: 0.68, range: 144, cost: 2500, effectDesc: '치명률+6%p, 피해+25%', pulseCD: 6.8, stackCritChance: 0.06, stackCritDmg: 0.25, maxStack: 5, auraRange: 180 }
    ]
  },
  assassin_bird: {
    id: 'assassin_bird', name: '암살자 새', grade: GRADES.LEGENDARY, type: '단일 저격형 (우선순위)',
    desc: '성에 가장 가까운 개체를 우선 타격하며 모든 공격이 확정 치명타로 적용됩니다.',
    levels: [
      { level: 1, atk: 20, interval: 1.70, range: 200, cost: 0, effectDesc: '성 근접 우선, 확정 치명타 x2.0', critMult: 2.0, targetClosestToCastle: true },
      { level: 2, atk: 26, interval: 1.49, range: 212, cost: 460, effectDesc: '성 근접 우선, 확정 치명타 x2.2', critMult: 2.2, targetClosestToCastle: true },
      { level: 3, atk: 34, interval: 1.27, range: 224, cost: 960, effectDesc: '성 근접 우선, 확정 치명타 x2.4', critMult: 2.4, targetClosestToCastle: true },
      { level: 4, atk: 44, interval: 1.10, range: 236, cost: 1700, effectDesc: '성 근접 우선, 확정 치명타 x2.6', critMult: 2.6, targetClosestToCastle: true },
      { level: 5, atk: 56, interval: 0.94, range: 248, cost: 2700, effectDesc: '성 근접 우선, 확정 치명타 x3.0', critMult: 3.0, targetClosestToCastle: true }
    ]
  },

  // --- 9-6. 신화 (빨간색) — 10종 ---
  bird_o_tron: {
    id: 'bird_o_tron', name: '버드-오-트론', grade: GRADES.MYTHIC, type: '변형형 (전천후 궁극)',
    desc: '근접 및 원거리 모드를 자율 전환하는 만능형 변형 로봇 새.',
    levels: [
      { level: 1, atk: 18, interval: 1.02, range: 160, cost: 0, effectDesc: '8.5초마다 근/원거리 모드 전환', switchCD: 8.5 },
      { level: 2, atk: 23, interval: 0.89, range: 168, cost: 600, effectDesc: '8.5초마다 모드 전환', switchCD: 8.5 },
      { level: 3, atk: 29, interval: 0.77, range: 176, cost: 1240, effectDesc: '8.5초마다 모드 전환', switchCD: 8.5 },
      { level: 4, atk: 38, interval: 0.68, range: 184, cost: 2100, effectDesc: '8.5초마다 모드 전환', switchCD: 8.5 },
      { level: 5, atk: 48, interval: 0.59, range: 192, cost: 3300, effectDesc: '8.5초마다 모드 전환', switchCD: 8.5 }
    ]
  },
  engineer_bird: {
    id: 'engineer_bird', name: '엔지니어 새', grade: GRADES.MYTHIC, type: '설치형 (궁극)',
    desc: '강력한 자동 포탑과 함정을 필드에 계속 배치합니다.',
    levels: [
      { level: 1, atk: 0, interval: 1.0, range: 0, cost: 0, effectDesc: '12.8초마다 터렛(ATK 8, 8초)+함정(피해 7)', cd: 12.8, tAtk: 8, tDur: 8, trDmg: 7 },
      { level: 2, atk: 0, interval: 1.0, range: 0, cost: 620, effectDesc: '11.0초마다 터렛(ATK 11, 9초)+함정(피해 9)', cd: 11.0, tAtk: 11, tDur: 9, trDmg: 9 },
      { level: 3, atk: 0, interval: 1.0, range: 0, cost: 1280, effectDesc: '9.3초마다 터렛(ATK 14, 10초)+함정(피해 12)', cd: 9.3, tAtk: 14, tDur: 10, trDmg: 12 },
      { level: 4, atk: 0, interval: 1.0, range: 0, cost: 2160, effectDesc: '7.6초마다 터렛(ATK 18, 11초)+함정(피해 16)', cd: 7.6, tAtk: 18, tDur: 11, trDmg: 16 },
      { level: 5, atk: 0, interval: 1.0, range: 0, cost: 3400, effectDesc: '6.0초마다 터렛(ATK 22, 12초)+함정(피해 20)', cd: 6.0, tAtk: 22, tDur: 12, trDmg: 20 }
    ]
  },
  pelican: {
    id: 'pelican', name: '펠리컨', grade: GRADES.MYTHIC, type: '포획 즉사형',
    desc: '부리 주머니로 적을 통째로 삼켜 즉시 처치합니다 (소화 쿨타임 필요).',
    levels: [
      { level: 1, atk: 0, interval: 8.0, range: 120, cost: 0, effectDesc: '1명 삼켜 즉사 (소화 8초)', devourCount: 1, digestDur: 8.0 },
      { level: 2, atk: 0, interval: 7.0, range: 120, cost: 640, effectDesc: '3명 삼켜 즉사 (소화 7초)', devourCount: 3, digestDur: 7.0 },
      { level: 3, atk: 0, interval: 6.0, range: 128, cost: 1320, effectDesc: '5명 삼켜 즉사 (소화 6초)', devourCount: 5, digestDur: 6.0 },
      { level: 4, atk: 0, interval: 5.0, range: 128, cost: 2200, effectDesc: '7명 삼켜 즉사 (소화 5초)', devourCount: 7, digestDur: 5.0 },
      { level: 5, atk: 0, interval: 4.0, range: 136, cost: 3500, effectDesc: '10명 삼켜 즉사 (소화 4초)', devourCount: 10, digestDur: 4.0 }
    ]
  },
  cursed_bird: {
    id: 'cursed_bird', name: '저주받은 새', grade: GRADES.MYTHIC, type: '저주형 디버프',
    desc: '저주를 걸어 대상이 다른 모든 새로부터 받는 피해를 대폭 증폭시킵니다.',
    levels: [
      { level: 1, atk: 11, interval: 1.19, range: 136, cost: 0, effectDesc: '받는 피해 +15% (4초)', amp: 0.15, dur: 4 },
      { level: 2, atk: 15, interval: 1.02, range: 144, cost: 600, effectDesc: '받는 피해 +18% (5초)', amp: 0.18, dur: 5 },
      { level: 3, atk: 19, interval: 0.89, range: 152, cost: 1240, effectDesc: '받는 피해 +22% (6초)', amp: 0.22, dur: 6 },
      { level: 4, atk: 24, interval: 0.77, range: 160, cost: 2100, effectDesc: '받는 피해 +26% (7초)', amp: 0.26, dur: 7 },
      { level: 5, atk: 31, interval: 0.68, range: 168, cost: 3300, effectDesc: '받는 피해 +30% (8초)', amp: 0.30, dur: 8 }
    ]
  },
  hacker_bird: {
    id: 'hacker_bird', name: '해커 새', grade: GRADES.MYTHIC, type: '제어형 (빙의)',
    desc: '적을 해킹하여 아군으로 전향시키고 다른 적을 대신 공격하게 만듭니다.',
    levels: [
      { level: 1, atk: 4, interval: 1.53, range: 140, cost: 0, effectDesc: '쿨 51s, 1명 8초 아군화 (ATK +30%)', cd: 51.0, count: 1, dur: 8, atkBonus: 0.30 },
      { level: 2, atk: 5, interval: 1.36, range: 148, cost: 660, effectDesc: '쿨 42.5s, 1명 10초 아군화 (ATK +35%)', cd: 42.5, count: 1, dur: 10, atkBonus: 0.35 },
      { level: 3, atk: 7, interval: 1.19, range: 156, cost: 1360, effectDesc: '쿨 34s, 2명 10초 아군화 (ATK +40%)', cd: 34.0, count: 2, dur: 10, atkBonus: 0.40 },
      { level: 4, atk: 8, interval: 1.02, range: 164, cost: 2300, effectDesc: '쿨 27.2s, 2명 12초 아군화 (ATK +45%)', cd: 27.2, count: 2, dur: 12, atkBonus: 0.45 },
      { level: 5, atk: 11, interval: 0.85, range: 172, cost: 3600, effectDesc: '쿨 21.2s, 3명 14초 아군화 (ATK +50%, 해제후 받피증 20%)', cd: 21.2, count: 3, dur: 14, atkBonus: 0.50, postDebuff: 0.20 }
    ]
  },
  duck: {
    id: 'duck', name: '오리', grade: GRADES.MYTHIC, type: '딜+힐 복합형',
    desc: '적의 최대 체력 비례 데미지를 주며 아군 새를 지속 회복시킵니다.',
    levels: [
      { level: 1, atkPct: 0.04, interval: 1.10, range: 128, cost: 0, effectDesc: '체력비례 4%, 4.2초마다 아군 힐 5%', healCD: 4.2, healPct: 0.05 },
      { level: 2, atkPct: 0.05, interval: 0.98, range: 136, cost: 600, effectDesc: '체력비례 5%, 아군 힐 7%', healCD: 4.2, healPct: 0.07 },
      { level: 3, atkPct: 0.06, interval: 0.85, range: 144, cost: 1240, effectDesc: '체력비례 6%, 아군 힐 9%', healCD: 4.2, healPct: 0.09 },
      { level: 4, atkPct: 0.08, interval: 0.77, range: 152, cost: 2100, effectDesc: '체력비례 8%, 아군 힐 12%', healCD: 4.2, healPct: 0.12 },
      { level: 5, atkPct: 0.09, interval: 0.68, range: 160, cost: 3300, effectDesc: '체력비례 9%, 아군 힐 15%', healCD: 4.2, healPct: 0.15 }
    ]
  },
  pigeon: {
    id: 'pigeon', name: '비둘기', grade: GRADES.MYTHIC, type: '감염 처형형',
    desc: '감염 3스택 적용 시 대상 즉시 처치 후 독가스를 방출합니다.',
    levels: [
      { level: 1, atk: 7, interval: 1.10, range: 120, cost: 0, effectDesc: '3스택 즉사+독가스(1.5반경, 5/초, 3초)', gasRad: 40, gasDmg: 5, gasDur: 3 },
      { level: 2, atk: 9, interval: 0.98, range: 128, cost: 620, effectDesc: '독가스(1.7반경, 7/초, 3초)', gasRad: 45, gasDmg: 7, gasDur: 3 },
      { level: 3, atk: 11, interval: 0.85, range: 136, cost: 1280, effectDesc: '독가스(1.9반경, 9/초, 4초)', gasRad: 50, gasDmg: 9, gasDur: 4 },
      { level: 4, atk: 14, interval: 0.77, range: 144, cost: 2160, effectDesc: '독가스(2.1반경, 12/초, 4초)', gasRad: 55, gasDmg: 12, gasDur: 4 },
      { level: 5, atk: 18, interval: 0.68, range: 152, cost: 3400, effectDesc: '독가스(2.3반경, 16/초, 5초)', gasRad: 60, gasDmg: 16, gasDur: 5 }
    ]
  },
  firebug: {
    id: 'firebug', name: '방화광', grade: GRADES.MYTHIC, type: '광역 화염형 (궁극)',
    desc: '경로 전체에 불길을 놓아 지나가는 모든 적에게 막대한 지속 피해를 줍니다.',
    levels: [
      { level: 1, atk: 4, interval: 1.27, range: 9999, cost: 0, effectDesc: '경로 화염 2/초 (17초 주기)', globalBurn: 2, intervalCD: 17.0 },
      { level: 2, atk: 5, interval: 1.10, range: 9999, cost: 640, effectDesc: '경로 화염 2.6/초 (15.3초 주기)', globalBurn: 2.6, intervalCD: 15.3 },
      { level: 3, atk: 7, interval: 0.98, range: 9999, cost: 1320, effectDesc: '경로 화염 3.5/초 (13.6초 주기)', globalBurn: 3.5, intervalCD: 13.6 },
      { level: 4, atk: 9, interval: 0.85, range: 9999, cost: 2200, effectDesc: '경로 화염 4.7/초 (11.9초 주기)', globalBurn: 4.7, intervalCD: 11.9 },
      { level: 5, atk: 12, interval: 0.77, range: 9999, cost: 3500, effectDesc: '경로 화염 6.5/초 (10.2초 주기)', globalBurn: 6.5, intervalCD: 10.2 }
    ]
  },
  charged_bird: {
    id: 'charged_bird', name: '충전된 새', grade: GRADES.MYTHIC, type: '광역 전기형 (스택 궁극)',
    desc: '공격 시 마비를 걸며 10회 타격마다 체력비례 20% 딜. 200스택 도달시 동시 10명 확정 마비.',
    levels: [
      { level: 1, atk: 17, interval: 0.57, range: 160, cost: 0, effectDesc: '마비 10%, 스택상한 40', stunChance: 0.10, maxStackCap: 40 },
      { level: 2, atk: 20, interval: 0.54, range: 168, cost: 660, effectDesc: '마비 13%, 스택상한 80', stunChance: 0.13, maxStackCap: 80 },
      { level: 3, atk: 22, interval: 0.50, range: 176, cost: 1360, effectDesc: '마비 16%, 스택상한 120', stunChance: 0.16, maxStackCap: 120 },
      { level: 4, atk: 26, interval: 0.47, range: 184, cost: 2300, effectDesc: '마비 19%, 스택상한 160', stunChance: 0.19, maxStackCap: 160 },
      { level: 5, atk: 30, interval: 0.42, range: 192, cost: 3600, effectDesc: '마비 22%, 스택상한 200 (궁극 전환)', stunChance: 0.22, maxStackCap: 200 }
    ]
  },
  hen: {
    id: 'hen', name: '닭', grade: GRADES.MYTHIC, type: '지원형 (경제, 궁극)',
    desc: '짧은 주기로 다수의 알을 낳아 다량의 코인과 황금알(깃털)을 생성합니다.',
    levels: [
      { level: 1, atk: 0, interval: 6.0, range: 0, cost: 0, effectDesc: '6초마다 알 2개(32코인), 황금알 5%', eggInterval: 6.0, eggCount: 2, coinPerEgg: 32, goldenChance: 0.05 },
      { level: 2, atk: 0, interval: 5.0, range: 0, cost: 640, effectDesc: '5초마다 알 3개(44코인), 황금알 7%', eggInterval: 5.0, eggCount: 3, coinPerEgg: 44, goldenChance: 0.07 },
      { level: 3, atk: 0, interval: 4.0, range: 0, cost: 1320, effectDesc: '4초마다 알 4개(60코인), 황금알 10%', eggInterval: 4.0, eggCount: 4, coinPerEgg: 60, goldenChance: 0.10 },
      { level: 4, atk: 0, interval: 3.0, range: 0, cost: 2200, effectDesc: '3초마다 알 5개(80코인), 황금알 13%', eggInterval: 3.0, eggCount: 5, coinPerEgg: 80, goldenChance: 0.13 },
      { level: 5, atk: 0, interval: 2.0, range: 0, cost: 3500, effectDesc: '2초마다 알 6개(112코인), 황금알 18% (10번째 알 확정 깃털 2개)', eggInterval: 2.0, eggCount: 6, coinPerEgg: 112, goldenChance: 0.18, pityGolden: true }
    ]
  }
};

// 8. 알 등급별 결과 확률표
export const EGG_GACHA_PROBS = {
  [GRADES.NORMAL]: { [GRADES.NORMAL]: 0.70, [GRADES.UNCOMMON]: 0.25, [GRADES.RARE]: 0.045, [GRADES.EPIC]: 0.005, [GRADES.LEGENDARY]: 0, [GRADES.MYTHIC]: 0 },
  [GRADES.UNCOMMON]: { [GRADES.NORMAL]: 0.30, [GRADES.UNCOMMON]: 0.45, [GRADES.RARE]: 0.20, [GRADES.EPIC]: 0.045, [GRADES.LEGENDARY]: 0.005, [GRADES.MYTHIC]: 0 },
  [GRADES.RARE]: { [GRADES.NORMAL]: 0.05, [GRADES.UNCOMMON]: 0.30, [GRADES.RARE]: 0.40, [GRADES.EPIC]: 0.20, [GRADES.LEGENDARY]: 0.045, [GRADES.MYTHIC]: 0.005 },
  [GRADES.EPIC]: { [GRADES.NORMAL]: 0, [GRADES.UNCOMMON]: 0.10, [GRADES.RARE]: 0.30, [GRADES.EPIC]: 0.40, [GRADES.LEGENDARY]: 0.18, [GRADES.MYTHIC]: 0.02 },
  [GRADES.LEGENDARY]: { [GRADES.NORMAL]: 0, [GRADES.UNCOMMON]: 0, [GRADES.RARE]: 0.15, [GRADES.EPIC]: 0.35, [GRADES.LEGENDARY]: 0.40, [GRADES.MYTHIC]: 0.10 },
  [GRADES.MYTHIC]: { [GRADES.NORMAL]: 0, [GRADES.UNCOMMON]: 0, [GRADES.RARE]: 0.05, [GRADES.EPIC]: 0.20, [GRADES.LEGENDARY]: 0.40, [GRADES.MYTHIC]: 0.35 }
};

// 8-1. 씨앗 상자 등급별 결과 확률표 (알과 동일)
export const SEED_BOX_GACHA_PROBS = EGG_GACHA_PROBS;

// 6-2 & 6-3. 상점 칸 진열 확률
export const SHOP_EGG_SLOT_PROBS = {
  [GRADES.NORMAL]: 0.55,
  [GRADES.UNCOMMON]: 0.27,
  [GRADES.RARE]: 0.12,
  [GRADES.EPIC]: 0.045,
  [GRADES.LEGENDARY]: 0.012,
  [GRADES.MYTHIC]: 0.003
};

// 5-1-1 & 5-1-2. 작물 28종 리스트
export const CROPS = {
  // 일반
  carrot: { id: 'carrot', name: '당근', grade: GRADES.NORMAL, minSell: 5, maxSell: 6, isOneTime: true, growSec: 10, icon: '🥕' },
  tomato: { id: 'tomato', name: '토마토', grade: GRADES.NORMAL, minSell: 5, maxSell: 7, isOneTime: false, growSec: 12, icon: '🍅' },
  cabbage: { id: 'cabbage', name: '양배추', grade: GRADES.NORMAL, minSell: 7, maxSell: 9, isOneTime: false, growSec: 15, icon: '🥬' },
  strawberry: { id: 'strawberry', name: '딸기', grade: GRADES.NORMAL, minSell: 8, maxSell: 12, isOneTime: false, growSec: 18, icon: '🍓' },
  // 고급
  tulip: { id: 'tulip', name: '튤립', grade: GRADES.UNCOMMON, minSell: 20, maxSell: 25, isOneTime: true, growSec: 25, icon: '🌷' },
  basil: { id: 'basil', name: '바질', grade: GRADES.UNCOMMON, minSell: 22, maxSell: 28, isOneTime: false, growSec: 30, icon: '🌿' },
  blueberry: { id: 'blueberry', name: '블루베리', grade: GRADES.UNCOMMON, minSell: 25, maxSell: 32, isOneTime: false, growSec: 35, icon: '🫐' },
  sugarcane: { id: 'sugarcane', name: '사탕수수', grade: GRADES.UNCOMMON, minSell: 28, maxSell: 36, isOneTime: false, growSec: 40, icon: '🎋' },
  wheat: { id: 'wheat', name: '밀', grade: GRADES.UNCOMMON, minSell: 32, maxSell: 42, isOneTime: false, growSec: 45, icon: '🌾' },
  raspberry: { id: 'raspberry', name: '산딸기', grade: GRADES.UNCOMMON, minSell: 36, maxSell: 50, isOneTime: false, growSec: 50, icon: '🍇' },
  // 레어
  pumpkin: { id: 'pumpkin', name: '호박', grade: GRADES.RARE, minSell: 80, maxSell: 95, isOneTime: false, growSec: 60, icon: '🎃' },
  plum: { id: 'plum', name: '자두', grade: GRADES.RARE, minSell: 90, maxSell: 110, isOneTime: false, growSec: 70, icon: '🍑' },
  apple: { id: 'apple', name: '사과', grade: GRADES.RARE, minSell: 100, maxSell: 130, isOneTime: false, growSec: 80, icon: '🍎' },
  pear: { id: 'pear', name: '배', grade: GRADES.RARE, minSell: 120, maxSell: 160, isOneTime: false, growSec: 90, icon: '🍐' },
  watermelon: { id: 'watermelon', name: '수박', grade: GRADES.RARE, minSell: 140, maxSell: 200, isOneTime: false, growSec: 100, icon: '🍉' },
  // 에픽
  orange: { id: 'orange', name: '오렌지', grade: GRADES.EPIC, minSell: 300, maxSell: 360, isOneTime: false, growSec: 120, icon: '🍊' },
  grapefruit: { id: 'grapefruit', name: '자몽', grade: GRADES.EPIC, minSell: 330, maxSell: 400, isOneTime: false, growSec: 140, icon: '🍊' },
  grape: { id: 'grape', name: '포도', grade: GRADES.EPIC, minSell: 360, maxSell: 450, isOneTime: false, growSec: 160, icon: '🍇' },
  mango: { id: 'mango', name: '망고', grade: GRADES.EPIC, minSell: 420, maxSell: 550, isOneTime: false, growSec: 180, icon: '🥭' },
  coconut: { id: 'coconut', name: '코코넛', grade: GRADES.EPIC, minSell: 480, maxSell: 750, isOneTime: false, growSec: 200, icon: '🥥' },
  // 전설
  potato: { id: 'potato', name: '감자', grade: GRADES.LEGENDARY, minSell: 750, maxSell: 900, isOneTime: false, growSec: 240, icon: '🥔' },
  durian: { id: 'durian', name: '두리안', grade: GRADES.LEGENDARY, minSell: 900, maxSell: 1100, isOneTime: false, growSec: 270, icon: '🍈' },
  cactus: { id: 'cactus', name: '선인장', grade: GRADES.LEGENDARY, minSell: 1050, maxSell: 1350, isOneTime: false, growSec: 300, icon: '🌵' },
  aloe: { id: 'aloe', name: '알로에', grade: GRADES.LEGENDARY, minSell: 1250, maxSell: 1875, isOneTime: false, growSec: 330, icon: '🪴' },
  // 신화
  golden_apple: { id: 'golden_apple', name: '황금사과', grade: GRADES.MYTHIC, minSell: 5000, maxSell: 6500, isOneTime: false, growSec: 400, icon: '🍏' },
  dragonfruit: { id: 'dragonfruit', name: '용과', grade: GRADES.MYTHIC, minSell: 6000, maxSell: 8000, isOneTime: false, growSec: 450, icon: '🐉' },
  cacao: { id: 'cacao', name: '카카오', grade: GRADES.MYTHIC, minSell: 7000, maxSell: 9500, isOneTime: false, growSec: 500, icon: '🍫' },
  chili: { id: 'chili', name: '고추', grade: GRADES.MYTHIC, minSell: 8500, maxSell: 12500, isOneTime: false, growSec: 600, icon: '🌶️' }
};

// 5-2. 씨앗 돌연변이 종류 & 배율
export const SEED_MUTATIONS = {
  wet: { id: 'wet', name: '젖은 (Wet)', mult: 2, chance: 0.30 },
  sweet: { id: 'sweet', name: '달콤한 (Sweet)', mult: 3, chance: 0.22 },
  aurora: { id: 'aurora', name: '오로라 (Aurora)', mult: 4, chance: 0.15 },
  cursed: { id: 'cursed', name: '저주받은 (Cursed)', mult: 5, chance: 0.12 },
  sticky: { id: 'sticky', name: '끈적한 (Sticky)', mult: 1, chance: 0.06, isSticky: true },
  frozen: { id: 'frozen', name: '얼어붙은 (Frozen)', mult: 10, chance: 0.08 },
  cooked: { id: 'cooked', name: '요리된 (Cooked)', mult: 15, chance: 0.05 },
  charged: { id: 'charged', name: '충전된 (Charged)', mult: 40, chance: 0.015 },
  random: { id: 'random', name: '랜덤 (Random)', mult: 1, chance: 0.005, isRandom: true },
  unstable: { id: 'unstable', name: '불안정한 (Unstable)', mult: 1, chance: 0.0, isUnstable: true }
};

// 5-2-1. 자연 돌연변이
export const NATURAL_MUTATIONS = {
  none: { id: 'none', name: '없음', mult: 1, chance: 0.994 },
  golden: { id: 'golden', name: '황금 (Golden)', mult: 30, chance: 0.005 },
  diamond: { id: 'diamond', name: '다이아몬드 (Diamond)', mult: 50, chance: 0.001 }
};

// 5-7. 날씨 종류
export const WEATHER_TYPES = {
  sunny: { id: 'sunny', name: '맑음', chance: 0.47, mutationId: null, icon: '☀️' },
  rain: { id: 'rain', name: '비', chance: 0.12, mutationId: 'wet', bonusChance: 0.10, icon: '🌧️' },
  heatwave: { id: 'heatwave', name: '폭염', chance: 0.10, mutationId: 'cooked', bonusChance: 0.10, icon: '🔥' },
  cold: { id: 'cold', name: '한파(눈)', chance: 0.10, mutationId: 'frozen', bonusChance: 0.10, icon: '❄️' },
  thunder: { id: 'thunder', name: '뇌우', chance: 0.08, mutationId: 'charged', bonusChance: 0.10, icon: '⚡' },
  fog: { id: 'fog', name: '안개', chance: 0.08, mutationId: 'random', bonusChance: 0.10, icon: '🌫️' },
  fullmoon: { id: 'fullmoon', name: '보름달(밤)', chance: 0.03, mutationId: 'cursed', bonusChance: 0.10, icon: '🌕' },
  rainbow: { id: 'rainbow', name: '무지개', chance: 0.015, mutationId: 'sweet', bonusChance: 0.10, icon: '🌈' },
  aurora: { id: 'aurora', name: '오로라', chance: 0.005, mutationId: 'aurora', bonusChance: 0.10, naturalDouble: true, icon: '🌌' }
};

// 12-5-1. 몬스터 스탯 정의
export const MONSTER_TEMPLATES = {
  basic: { id: 'basic', name: '기본 몬스터', hp: 2, speed: 1.0, icon: '👾', typeDesc: '일반형' },
  fast: { id: 'fast', name: '빠른 몬스터', hp: 3, speed: 2.0, icon: '⚡', typeDesc: '빠른형' },
  heavy: { id: 'heavy', name: '무거운 몬스터', hp: 8, speed: 0.5, icon: '🛡️', typeDesc: '탱커형' },
  gen_boss: { id: 'gen_boss', name: '일반 보스', hp: 140, speed: 0.8, icon: '👑', isBoss: true, typeDesc: '보스형' },
  special: { id: 'special', name: '특이한 몬스터', hp: 60, speed: 1.0, icon: '🌀', typeDesc: '방어형' },
  shaman: { id: 'shaman', name: '주술사 몬스터', hp: 300, speed: 1.0, icon: '🧙', isShaman: true, typeDesc: '지원형' },
  skeleton: { id: 'skeleton', name: '해골', hp: 40, speed: 1.0, icon: '💀' },
  fast_skeleton: { id: 'fast_skeleton', name: '빠른 해골', hp: 30, speed: 1.5, icon: '💀⚡' },
  splitter: { id: 'splitter', name: '분열 몬스터', hp: 80, speed: 1.0, icon: '🫧', isSplitter: true, typeDesc: '분열형' },
  split_sub: { id: 'split_sub', name: '분열체', hp: 50, speed: 1.5, icon: '🫧' },
  swift: { id: 'swift', name: '신속 몬스터', hp: 90, speed: 4.0, icon: '💨', typeDesc: '빠른형' },
  special_boss: { id: 'special_boss', name: '특이한 보스', hp: 1200, speed: 0.5, icon: '👺', isBoss: true },
  swift_boss: { id: 'swift_boss', name: '신속 보스', hp: 1600, speed: 2.0, icon: '👹', isBoss: true },
  splitter_boss: { id: 'splitter_boss', name: '분열자 보스', hp: 2000, speed: 1.0, icon: '🐙', isBoss: true, isSplitterBoss: true },
  cubic: { id: 'cubic', name: '큐빅 (최종 보스)', hp: 10000, speed: 0.4, icon: '🧊', isCubic: true }
};

// 12-5-2. 25 웨이브 몬스터 구성표
export const WAVE_CONFIG = [
  { wave: 1, mobs: [{ type: 'basic', count: 8 }] },
  { wave: 2, mobs: [{ type: 'basic', count: 12 }] },
  { wave: 3, mobs: [{ type: 'basic', count: 16 }] },
  { wave: 4, mobs: [{ type: 'basic', count: 10 }, { type: 'fast', count: 6 }] },
  { wave: 5, mobs: [{ type: 'basic', count: 12 }, { type: 'fast', count: 8 }] },
  { wave: 6, mobs: [{ type: 'basic', count: 15 }, { type: 'fast', count: 10 }] },
  { wave: 7, mobs: [{ type: 'basic', count: 10 }, { type: 'fast', count: 8 }, { type: 'heavy', count: 4 }] },
  { wave: 8, mobs: [{ type: 'basic', count: 12 }, { type: 'fast', count: 10 }, { type: 'heavy', count: 6 }] },
  { wave: 9, mobs: [{ type: 'basic', count: 15 }, { type: 'fast', count: 12 }, { type: 'heavy', count: 8 }] },
  { wave: 10, mobs: [{ type: 'gen_boss', count: 1 }, { type: 'basic', count: 20 }] },
  { wave: 11, mobs: [{ type: 'heavy', count: 10 }, { type: 'special', count: 5 }] },
  { wave: 12, mobs: [{ type: 'heavy', count: 12 }, { type: 'special', count: 8 }] },
  { wave: 13, mobs: [{ type: 'heavy', count: 15 }, { type: 'special', count: 10 }] },
  { wave: 14, mobs: [{ type: 'special_boss', count: 1 }, { type: 'special', count: 15 }] },
  { wave: 15, mobs: [{ type: 'shaman', count: 3 }, { type: 'basic', count: 15 }] },
  { wave: 16, mobs: [{ type: 'shaman', count: 5 }, { type: 'heavy', count: 10 }] },
  { wave: 17, mobs: [{ type: 'swift_boss', count: 1 }, { type: 'swift', count: 12 }] },
  { wave: 18, mobs: [{ type: 'splitter', count: 8 }, { type: 'swift', count: 10 }] },
  { wave: 19, mobs: [{ type: 'splitter', count: 12 }, { type: 'swift', count: 15 }] },
  { wave: 20, mobs: [{ type: 'splitter_boss', count: 1 }, { type: 'splitter', count: 10 }] },
  { wave: 21, mobs: [{ type: 'shaman', count: 4 }, { type: 'splitter', count: 10 }, { type: 'swift', count: 15 }] },
  { wave: 22, mobs: [{ type: 'shaman', count: 5 }, { type: 'splitter', count: 12 }, { type: 'swift', count: 18 }] },
  { wave: 23, mobs: [{ type: 'special', count: 15 }, { type: 'splitter', count: 15 }, { type: 'swift', count: 20 }] },
  { wave: 24, mobs: [{ type: 'shaman', count: 6 }, { type: 'heavy', count: 15 }, { type: 'swift', count: 25 }] },
  { wave: 25, mobs: [{ type: 'cubic', count: 1 }] }
];

const DEFAULT_STATE = {
  feathers: 300,    // 메인 재화 (알/씨앗 구매, 모이 제작)
  gems: 50,         // 프리미엄 재화 (상점 리셋)
  inRunCoins: 0,    // 스테이지 인런 전용 재화
  castleMaxHP: 20,
  castleHP: 20,
  level: 1,
  exp: 0,
  
  // 플레이어가 보유한 새 목록 ({ id, birdId, level: 1, count: 1, buff: null })
  ownedBirds: [
    { id: 'sparrow_init', birdId: 'sparrow', level: 1, count: 1, buff: null }
  ],
  deck: ['sparrow'], // 전투 덱 (최대 6종 선택)
  
  inventory: {
    eggs: { normal: 1, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 },
    seedBoxes: { normal: 1, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 },
    seeds: { carrot: 3, tomato: 2 }, // 확정 씨앗 개수 ({ [cropId]: count })
    crops: {}, // 수확한 작물 저장 ({ [cropId]: [{ id, cropId, seedMutation, naturalMutation, weatherMutation, totalMult, isUnstable, unstableMult }] })
    baits: []  // 제작된 모이 버프들
  },

  farmPlots: [
    { id: 0, status: 'empty', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 0 },
    { id: 1, status: 'empty', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 0 },
    { id: 2, status: 'empty', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 0 },
    { id: 3, status: 'empty', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 0 },
    { id: 4, status: 'locked', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 10 },
    { id: 5, status: 'locked', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 20 },
    { id: 6, status: 'locked', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 30 },
    { id: 7, status: 'locked', cropId: null, seedMutation: null, plantTime: null, duration: 10, isOneTime: false, unlockCost: 50 }
  ],

  // 현재 날씨 및 20분 쿨다운
  currentWeather: 'sunny',
  weatherTimer: 1200,

  // 상점 6칸 진열 및 리셋 횟수 (1일 5회)
  shopItems: [],
  dailyResetCount: 0,

  // 몬스터 도감 단계 (유형별 encounter count)
  monsterCodex: {},

  // 스테이지 최고 기록
  highWave: 0,
  stars: 0
};

export class StateManager {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
    this.save();
  }

  load() {
    const saved = localStorage.getItem('bird_td_gdd_save_v2');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        this.state = { ...DEFAULT_STATE, ...loaded };
      } catch (e) {
        console.error('Save parse error:', e);
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    this.notify();
  }

  save() {
    localStorage.setItem('bird_td_gdd_save_v2', JSON.stringify(this.state));
  }

  reset() {
    localStorage.removeItem('bird_td_gdd_save_v2');
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.notify();
  }

  addFeathers(amt) {
    this.state.feathers = Math.max(0, this.state.feathers + amt);
    this.notify();
  }

  spendFeathers(amt) {
    if (this.state.feathers >= amt) {
      this.state.feathers -= amt;
      this.notify();
      return true;
    }
    return false;
  }

  addGems(amt) {
    this.state.gems = Math.max(0, this.state.gems + amt);
    this.notify();
  }

  spendGems(amt) {
    if (this.state.gems >= amt) {
      this.state.gems -= amt;
      this.notify();
      return true;
    }
    return false;
  }

  addBird(birdId) {
    const template = BIRD_TEMPLATES[birdId];
    if (!template) return;
    const existing = this.state.ownedBirds.find(b => b.birdId === birdId);
    if (existing) {
      existing.count++;
    } else {
      this.state.ownedBirds.push({
        id: 'bird_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        birdId,
        level: 1,
        count: 1,
        buff: null
      });
    }
    this.notify();
  }

  toggleDeck(birdId) {
    const has = this.state.ownedBirds.some(b => b.birdId === birdId);
    if (!has) return false;
    const idx = this.state.deck.indexOf(birdId);
    if (idx !== -1) {
      if (this.state.deck.length <= 1) return false;
      this.state.deck.splice(idx, 1);
    } else {
      if (this.state.deck.length >= 6) return false;
      this.state.deck.push(birdId);
    }
    this.notify();
    return true;
  }

  applyBuffToBird(birdId, buff) {
    const bird = this.state.ownedBirds.find(b => b.birdId === birdId);
    if (bird) {
      bird.buff = buff; // 기존 버프 대체 (1마리당 1버프)
      this.notify();
      return true;
    }
    return false;
  }
}

export const stateManager = new StateManager();
