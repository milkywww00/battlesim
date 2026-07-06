import { skills } from "../data/skills.js";
import { evaluateFormula } from "./FormulaEngine.js";

export class BattleEngine {
  constructor(allCharacters, turnManager) {
  this.characters = allCharacters;

  this.turnManager = turnManager;
}
  printTurnOrder(logs) {
  const orderText = this.turnManager.order
    .map(c => `${c.name}(AGI:${c.stats.agi})`)
    .join(" → ");

  logs.push(`[턴 순서] ${orderText}`);
}

step(action) {
  const logs = [];

  if (!this._battleStarted) {
    this._battleStarted = true;
    this.printTurnOrder(logs);
  }

  while (
  this.turnManager.current() &&
  this.turnManager.current().hp <= 0
) {
  this.turnManager.getNext();
}

 const currentActor = this.turnManager.current();

if (!currentActor) return logs;

// 죽은 캐릭터면 턴을 즉시 넘긴다.
if (currentActor.hp <= 0) {
  this.turnManager.getNext();
  return logs;
}

const restricted = currentActor.statusEffects?.find(
  e => e.type === "restrict"
);


if (restricted) {
  logs.push(`[행동 불가] ${currentActor.name}은(는) 움직일 수 없다.`);

  // 이제 지속시간 감소
  this.processStatusEffects(logs, currentActor);

  this.turnManager.getNext();
  return logs;
}

const fear = currentActor.statusEffects?.find(
  e => e.type === "fear"
);

if (fear) {

  logs.push(
    `[공포] ${currentActor.name}은(는) 겁에 질려 도주를 시도한다.`
  );

  this.processStatusEffects(logs, currentActor);

  return logs.concat(
    this.executeSkill(
      currentActor,
      [currentActor],
      skills.escape
    )
  );
}

// 행동 가능하면 그 다음 상태이상 처리
this.processStatusEffects(logs, currentActor);

    if (!action) return logs;

    if (action.skillId === "skip") {
      this.turnManager.getNext();
      logs.push("턴을 스킵했다");
     return logs;
    }

    


    const actor = this.characters.find(c => c.id === action.actorId);
    const skill = skills[action.skillId];

    const confused = currentActor.statusEffects?.find(
  e => e.type === "confusion"
);

if (confused) {

  const alive = this.characters.filter(c => c.hp > 0);

  const randomTarget =
    alive[Math.floor(Math.random() * alive.length)];

  action.actorId = currentActor.id;
  action.targetId = randomTarget.id;

  logs.push(
    `[식별불가] ${currentActor.name}의 공격 대상이 ${randomTarget.name}(으)로 변경되었다.`
  );
}

    // 봉인 체크
const sealed = actor.statusEffects?.find(
  e => e.type === "seal"
);

const allowedSkills = [
  "attack",
  "defend",
  "dodge",
  "escape"
];

if (
  sealed &&
  !allowedSkills.includes(action.skillId)
) {

  logs.push(
    `[봉인] ${actor.name}은(는) 기본 행동만 사용할 수 있다.`
  );

  this.turnManager.getNext();

  return logs;
}

let targetType;

switch (skill.target) {
  case "self":
    targetType = { type: "self" };
    break;

  case "enemy":
  targetType = {
    type: skill.range === "all"
      ? "all_enemies"
      : "single",
    id: action.targetId
  };
  break;

  case "all_enemies":
    targetType = {
      type: "all_enemies"
    };
    break;

    case "all_allies":
    targetType = {
        type: "all_allies"
    };
    break;

  default:
    targetType = {
      type: "single",
      id: action.targetId
    };
}

console.log(targetType);

const targets = this.resolveTargets(actor, {
  targets: targetType
});

    const skillLogs = this.executeSkill(actor, targets, skill);
logs.push(...skillLogs);

for (const t of targets) {
  if (t.hp <= 0 && t !== actor) {
    logs.push(`${t.name}이(가) 쓰러졌다.`);
  }
}

for (const t of targets) {
  if (t.hp <= 0) {
    this.turnManager.removeDead(t.id);
  }
}

    const alive = this.characters.filter(c => c.hp > 0);
    if (alive.length === 1) {
      logs.push(`${alive[0].name} 승리!`);
    }

    this.turnManager.getNext();

    return logs;
  }

executeSkill(actor, targets, skill) {

  console.log(skill.name);
console.log(targets);

  const logs = [];

  let totalDamage = 0;
  let skillTotalDamage = 0;


  // =========================
  // MP COST 처리 (여기 추가)
  // =========================
  if (skill.mpCost > 0) {
    if ((actor.mp ?? 0) < skill.mpCost) {
      logs.push(`[실패] MP가 부족하다`);
      return logs;
    }

    actor.mp -= skill.mpCost;
    logs.push(`[MP] ${skill.mpCost} 소모`);
  }

  const stats = this.getFinalStats(actor);

const context = {
  str: stats.str ?? 0,
  agi: stats.agi ?? 0,
  luk: stats.luk ?? 0,
  int: stats.int ?? 0,
  hp: actor.hp ?? 0
};


  for (const effect of skill.effects) {
    console.log(effect);
console.log(effect.type);

    if (effect.type === "charged_attack") {

  const charge = actor.statusEffects?.find(
    e => e.type === "charge"
  );

  if (!charge) {
    logs.push("차지 상태가 아니다.");
    continue;
  }

  const dmgEffect = {
    type: "dmg",
    formula: charge.formula
  };

  logs.push(
    ...this.executeSkill(actor, targets, {
      effects: [dmgEffect],
      mpCost: 0
    })
  );

  actor.statusEffects =
    actor.statusEffects.filter(
      e => e.type !== "charge"
    );

  continue;
}

if (effect.type === "berserk") {

  actor.statusEffects.push({
    type: "berserk",
    duration: effect.duration
  });

  logs.push(`${actor.name}이(가) 광폭화했다.`);

  continue;
}

if (effect.type === "transfer") {

  const target = targets[0];

  actor.statusEffects.push({
    type: "transfer",
    duration: effect.duration,
    targetId: target.id
  });

  logs.push(
    `[전가] ${actor.name}의 피해가 ${target.name}에게 전가된다.`
  );

  continue;
}

if (effect.type === "share_damage") {

  actor.statusEffects.push({
    type: "share_damage",
    duration: effect.duration
  });

  logs.push(
    `[분배] ${actor.name}이(가) 피해를 아군과 분배한다.`
  );

  continue;
}

if (effect.type === "element_weakness") {

  for (const target of targets) {

    target.statusEffects.push({

      type: "element_weakness",

      attackType: effect.attackType,

      duration: effect.duration

    });

    logs.push(
      `[약점] ${target.name}의 ${effect.attackType} 약점을 노출시켰다.`
    );

  }

  continue;
}

if (effect.type === "element_support") {

  for (const target of targets) {

    target.statusEffects.push({

      type: "element_support",

      attackType: effect.attackType,

      duration: effect.duration

    });

    logs.push(
      `[보완] ${target.name}의 ${effect.attackType} 대응력이 강화되었다.`
    );

  }

  continue;
}

if (effect.type === "reflect") {

  actor.statusEffects.push({
    type: "reflect",
    duration: effect.duration,
    ratio: effect.ratio
  });

  logs.push(`[반사] ${actor.name}이(가) 반사 상태가 되었다.`);

  continue;
}

if (effect.type === "protect") {

  for (const originalTarget of targets) {

  let target = originalTarget;

    if (!target.statusEffects) target.statusEffects = [];

    target.statusEffects.push({
      type: "protect",
      duration: effect.duration,
      protectorId: actor.id
    });

    logs.push(`[몸빵] ${actor.name}이(가) ${target.name}을(를) 보호한다.`);
  }

  continue;
}

if (effect.type === "barrier") {
  

  for (const originalTarget of targets) {

  let target = originalTarget;

    if (!target.statusEffects) target.statusEffects = [];

    target.statusEffects.push({
      type: "barrier",
      duration: effect.duration
    });

    logs.push(`[베리어] ${target.name}`);
  }

  continue;
}

if (effect.type === "damage_reduction") {

  for (const originalTarget of targets) {

  let target = originalTarget;

    if (!target.statusEffects) target.statusEffects = [];

    target.statusEffects.push({
      type: "damage_reduction",
      duration: effect.duration,
      ratio: effect.ratio
    });

    logs.push(`[방어 강화] ${target.name}`);
  }

  continue;
}

    if (effect.type === "counter") {
  for (const t of targets) {
    const real = this.characters.find(c => c.id === t.id);

    if (!real.statusEffects) real.statusEffects = [];

    real.statusEffects.push({
    type: "counter",
    expireActorId: actor.id
});
    logs.push(`[반격] ${t.name}이(가) 반격 태세를 취했다.`);
  }
  continue;
}

if (effect.type === "execute") {

  for (const originalTarget of targets) {

  let target = originalTarget;

    // 보스는 즉사 면역
    if (target.isBoss) {
      logs.push(`[즉사 실패] ${target.name}은(는) 보스다.`);
      continue;
    }

    // 체력 절반 이상이면 실패
    if (target.hp > target.maxHp / 2) {
      logs.push(`[즉사 실패] ${target.name}의 체력이 너무 높다.`);
      continue;
    }

    const chance = Math.min(95, (actor.stats.luk ?? 0) * 5);

    const roll = Math.random() * 100;

    logs.push(`[즉사 판정] ${roll.toFixed(1)} / ${chance}`);

    if (roll < chance) {

      target.hp = 0;

      logs.push(`[즉사 성공] ${target.name}`);

    } else {

      logs.push(`[즉사 실패]`);

    }

  }

  continue;
}

if (effect.type === "guts") {

  actor.statusEffects.push({
    type: "guts"
  });

  logs.push(
    `[근성] ${actor.name}이(가) 쓰러지지 않으려 한다.`
  );

  continue;
}

if (effect.type === "drain") {

  for (const target of targets) {

    if (!target.statusEffects)
      target.statusEffects = [];

    target.statusEffects.push({
      type: "drain",
      duration: effect.duration,
      ratio: effect.ratio,
      healerId: actor.id
    });

    logs.push(
      `[흡수] ${target.name}에게 흡수 효과 부여`
    );
  }

  continue;
}

if (effect.type === "dodge_buff") {

  for (const target of targets) {

    if (!target.statusEffects)
      target.statusEffects = [];

    target.statusEffects.push({
      type: "dodge_buff",
      value: effect.value,
      duration: effect.duration
    });

    logs.push(
      `[회피율] ${target.name} +${effect.value}%`
    );
  }

  continue;
}
    if (effect.type === "buff") {

  for (const target of targets) {

    if (!target.statusEffects)
      target.statusEffects = [];

    // 같은 버프 개수 확인
    const count = target.statusEffects.filter(e =>
      e.type === "buff" &&
      e.stat === effect.stat &&
      e.value === effect.value
    ).length;

    if (count >= (effect.maxStack ?? 99)) {
      logs.push(`[실패] ${target.name}은(는) 더 이상 중첩되지 않는다.`);
      continue;
    }

    target.statusEffects.push({
      type: "buff",
      stat: effect.stat,
      value: effect.value,
      duration: effect.duration
    });

    const text = effect.value > 0 ? "증가" : "감소";

logs.push(
  `[${text}] ${target.name} ${effect.stat} ${Math.abs(effect.value)}`
);
  }

  continue;
}

if (effect.type === "accuracy_buff") {

  for (const target of targets) {

    if (!target.statusEffects)
      target.statusEffects = [];

    target.statusEffects.push({
      type: "accuracy_buff",
      value: effect.value,
      duration: effect.duration
    });

    logs.push(
      `[명중률] ${target.name} ${effect.value > 0 ? "+" : ""}${effect.value}%`
    );
  }

  continue;
}

if (effect.type === "crit_buff") {

  for (const target of targets) {

    if (!target.statusEffects)
      target.statusEffects = [];

    target.statusEffects.push({
      type: "crit_buff",
      value: effect.value,
      duration: effect.duration
    });

    logs.push(
      `[크리티컬] ${target.name} +${effect.value}%`
    );
  }

  continue;
}

  if (effect.type === "apply_status") {

  for (const t of targets) {
    if (!t.statusEffects) t.statusEffects = [];

    const status = structuredClone(effect.status);
    if (status.type === "dot") {
  status.formula = effect.status.formula.replaceAll(
    "str",
    stats.str
  );
}
    status.duration ??= 3;
    status.onApply?.(t, logs);

    t.statusEffects.push(status);

    logs.push(`[상태이상] ${t.name} 부여`);
  }

  continue;
}

if (effect.type === "fear") {

  for (const target of targets) {

    if (target.isBoss) {
      logs.push(`[공포 실패] ${target.name}은(는) 보스다.`);
      continue;
    }

    if (!target.statusEffects)
      target.statusEffects = [];

    target.statusEffects.push({
      type: "fear",
      duration: 1
    });

    logs.push(
      `[공포] ${target.name}은(는) 다음 행동에 도주한다.`
    );
  }

  continue;
}

if (effect.type === "taunt") {

  for (const target of targets) {

    if (!target.statusEffects) target.statusEffects = [];

    target.statusEffects.push({
      type: "taunt",
      duration: effect.duration,
      targetId: actor.id
    });

    logs.push(
      `[도발] ${target.name}은(는) ${actor.name}만 공격할 수 있다.`
    );
  }

  continue;
}

if (effect.type === "charge") {

  actor.statusEffects.push({
    type: "charge",
    formula: effect.formula
  });

  logs.push(`${actor.name}이(가) 힘을 모으기 시작했다.`);

  continue;
}

if (effect.type === "multi_hit") {

  
  const chanceTable = [80, 40, 20, 10];
  let hitCount = 0;

  for (let i = 0; i < chanceTable.length; i++) {
    if (Math.random() * 100 < chanceTable[i]) hitCount++;
    else break;
  }

  for (let i = 0; i < hitCount + 1; i++) {
    for (const originalTarget of targets) {

  let target = originalTarget;
      let dmg = evaluateFormula(effect.formula, context);
      dmg = Math.floor(dmg);
    this.applyDamage(target, dmg, logs);
      const gutsIndex = target.statusEffects?.findIndex(
  e => e.type === "guts"
);

if (
  target.hp <= 0 &&
  gutsIndex >= 0
) {
  target.hp = 1;

  target.statusEffects.splice(gutsIndex, 1);

  logs.push(
    `[근성] ${target.name}이(가) 체력 1로 버텼다!`
  );
}
      logs.push(`[연속타 ${i + 1}] ${dmg}`);
    }
  }

  continue;
}

    
    // =========================
    // GUARD
    // =========================
    if (effect.type === "guard") {

  actor.statusEffects.push({
    type: "guard",
    expireActorId: actor.id
});

  logs.push(`[방어] ${actor.name}이(가) 방어 태세를 취했다.`);
  continue;
}

    // =========================
    // DODGE
    // =========================
    if (effect.type === "dodge") {

 actor.statusEffects.push({
    type: "dodge",
    expireActorId: actor.id
});
  logs.push(`[회피] ${actor.name}이(가) 회피를 준비했다.`);
  continue;
}

    // =========================
    // ESCAPE
    // =========================
    if (effect.type === "escape") {

    const chance = Math.min(
        95,
        this.getFinalStats(actor).agi * 10
    );

    if (Math.random() * 100 < chance) {

        actor.hp = 0;
        this.turnManager.removeDead(actor.id);

        logs.push(`[도주 성공] ${actor.name}이(가) 전투에서 도주했다.`);

        const allyAlive =
this.characters.some(
 c=>c.team===1 && c.hp>0
);

const enemyAlive =
this.characters.some(
 c=>c.team===2 && c.hp>0
);

if (!allyAlive)
    logs.push("Team2 승리!");

if (!enemyAlive)
    logs.push("Team1 승리!");

    } else {

        logs.push(`[도주 실패]`);

    }

    return logs;
}

    if (effect.type === "cleanse") {

  for (const target of targets) {

    if (!target.statusEffects) continue;

    // 제거 가능한 상태이상
    const removable = [
      "debuff",
      "accuracy_buff",
      "buff"
    ];

    const index = target.statusEffects.findIndex(e =>
      removable.includes(e.type) &&
      (e.value ?? 0) < 0
    );

    if (index >= 0) {

      const removed =
        target.statusEffects.splice(index,1)[0];

      logs.push(
        `[치유] ${target.name}의 ${removed.type} 제거`
      );

    } else {

      logs.push(
        `[치유] 제거할 효과가 없다.`
      );

    }

  }

  continue;
}

    // =========================
    // HEAL
    // =========================
 if (effect.type === "heal") {

  const heal = Math.floor(Math.max(0, evaluateFormula(effect.formula, context)));

for (const originalTarget of targets) {

  let target = originalTarget;
  const beforeHp = target.hp; 
  const maxHp = target.maxHp;

  target.hp = Math.min(target.maxHp, target.hp + heal);

  const actualHeal = Math.floor(target.hp - beforeHp);

  if (actualHeal > 0) {
    logs.push(`[회복] ${target.name}이(가) ${actualHeal}만큼 회복했다`);
  } else {
    logs.push(`[회복] ${target.name}은(는) 이미 최대 체력이다`);
  }

} }

if (effect.type === "revive") {

  const deadTarget = this.characters.find(
    c =>
      c.id === targets[0]?.id &&
      c.team === actor.team &&
      c.hp <= 0
  );

  if (!deadTarget) {

    logs.push("[부활 실패] 대상이 살아있다.");

    continue;
  }

  deadTarget.hp = Math.floor(deadTarget.maxHp * 0.5);

this.turnManager.addCharacter(deadTarget);

logs.push(
  `[부활] ${deadTarget.name}이(가) 부활했다.`
);

  continue;
}

    // =========================
    // DAMAGE
    // =========================
if (effect.type === "dmg") {

  for (const originalTarget of targets) {

  let target = originalTarget;


    let formula = effect.formula;

const berserk = actor.statusEffects?.find(
  e => e.type === "berserk"
);

if (berserk && skill.name === "기본 공격") {
  formula = "20 + dice(str * 5)";
}

let dmg = evaluateFormula(formula, context);

const protect = target.statusEffects?.find(
  e => e.type === "protect"
);

if (protect) {

  const protector = this.characters.find(
    c => c.id === protect.protectorId && c.hp > 0
  );

  if (protector) {

    logs.push(
      `[몸빵] ${protector.name}이(가) ${target.name} 대신 공격을 받았다.`
    );

    target.statusEffects = target.statusEffects.filter(
      e => e !== protect
    );

    target = protector;
  }
}
  // -------------------------
  // 회피
  // -------------------------
  const dodgeIndex = target.statusEffects.findIndex(
  e => e.type === "dodge"
);

if (!effect.ignoreHit && dodgeIndex >= 0) {

    let chance =
  20 +
  (target.stats.agi * 10) +
  (target.stats.int * 5) -
  (100 - target.hp);

const dodgeBuff =
  target.statusEffects?.filter(
    e => e.type === "dodge_buff"
  ) ?? [];

for (const b of dodgeBuff) {
  chance += b.value;
}

    const roll = Math.random() * 100;

    logs.push(`[회피 체크] ${roll.toFixed(1)} / ${chance.toFixed(1)}`);

    if (roll < chance) {
      logs.push(`[회피 성공] ${target.name}이(가) 공격을 회피했다.`);
      target.statusEffects.splice(dodgeIndex, 1);
      continue;
    }

    logs.push(`[회피 실패]`);
    target.statusEffects.splice(dodgeIndex, 1);
}

      if (!effect.ignoreHit) {

  let hitChance =
  60 + (actor.stats?.luk ?? 0) * 9;

const accuracyBuff =
  actor.statusEffects?.filter(
    e => e.type === "accuracy_buff"
  ) ?? [];

for (const b of accuracyBuff) {
  hitChance += b.value;
}

hitChance = Math.min(95, hitChance);

  if (Math.random() * 100 >= hitChance) {
    logs.push(`[실패] ${actor.name} → ${target.name}`);
    continue;
  }

}

const barrierIndex = target.statusEffects.findIndex(
  e => e.type === "barrier"
);

if (barrierIndex >= 0) {

  logs.push(`[베리어] ${target.name}이(가) 공격을 막았다.`);

  target.statusEffects.splice(barrierIndex, 1);

  continue;
}

const attackType = effect.attackType ?? actor.type;
      const tempAttacker = {
  ...actor,
  type: attackType
};


  logs.push(`[명중] ${actor.name}이(가) ${target.name}을(를) 공격했다.`);
  logs.push(
  `[속성] ${actor.name}(${attackType}) → ${target.name}(${target.type})`
);

const {
  critBonus,
  damageMultiplier
} = this.getElementMultiplier(
  tempAttacker,
  target
);

    dmg *= damageMultiplier;
    dmg *= this.rollCrit(actor);

    if (critBonus) dmg *= 1.5;
    
    dmg = Math.floor(dmg);

const reduction = target.statusEffects.find(
  e => e.type === "damage_reduction"
);

if (reduction) {

  dmg = Math.floor(dmg * (1 - reduction.ratio));

  logs.push(
    `[피해 감소] ${(reduction.ratio * 100).toFixed(0)}%`
  );
}

    const guardIndex = target.statusEffects.findIndex(
  e => e.type === "guard"
);

if (guardIndex >= 0) {

      const reductionRate = Math.min(
        0.8,
        ((target.maxHp / 10) + (target.stats.str * 2)) / 100
      );

        logs.push(
  `[방어] 피해 ${(reductionRate * 100).toFixed(1)}% 감소`
);

      const reduced = dmg * (1 - reductionRate);
dmg = Math.max(0, Math.floor(reduced));
      target.statusEffects.splice(guardIndex, 1);
    }
    // 최종 데미지 계산 끝난 후 (기존 코드)
    skillTotalDamage += dmg;

  // =========================================================
// 1. 피해 적용 (기존 코드 유지 또는 확인)
// =========================================================
// 피해 적용
this.applyDamage(target, dmg, logs);
const gutsIndex = target.statusEffects?.findIndex(
  e => e.type === "guts"
);

if (
  target.hp <= 0 &&
  gutsIndex >= 0
) {
  target.hp = 1;

  target.statusEffects.splice(gutsIndex, 1);

  logs.push(
    `[근성] ${target.name}이(가) 체력 1로 버텼다!`
  );
}
logs.push(`[피해] ${dmg}`);

const reflect = target.statusEffects?.find(
  e => e.type === "reflect"
);

if (reflect) {

  const reflectDamage = Math.floor(dmg * reflect.ratio);

  this.applyDamage(actor, reflectDamage, logs);

  logs.push(
    `[반사] ${actor.name}이(가) ${reflectDamage}의 피해를 받았다.`
  );
}

// 💥 여기서 realTarget 다시 잡지 말고 target 그대로 써
const counterIndex = target.statusEffects?.findIndex(
  e => e.type === "counter"
);

if (counterIndex >= 0) {

  const attackerStr = actor.stats?.str ?? 5;
  const counterDmg = Math.floor(attackerStr * 2);

  this.applyDamage(actor, counterDmg, logs);

  logs.push(
    `[반격 성공] ${target.name} → ${actor.name} ${counterDmg}`
  );

  target.statusEffects.splice(counterIndex, 1);

  logs.push(`[반격 종료] ${target.name}`);
}
  }
  actor.lastDamage = skillTotalDamage;


}

}
for (const effect of skill.effects) {
 if (effect.type !== "self_damage") continue;

    const recoil = Math.floor(skillTotalDamage * (effect.ratio ?? 0));
actor.hp = Math.max(0, actor.hp - recoil);
logs.push(`[반동] ${recoil}`);
}

for (const effect of skill.effects) {
  if (effect.type !== "lifesteal") continue;

  const heal = Math.floor(skillTotalDamage * (effect.ratio ?? 0));

  const beforeHp = actor.hp;

  actor.hp = Math.min(actor.maxHp, actor.hp + heal);

  const actualHeal = actor.hp - beforeHp;

  logs.push(`[흡혈] ${actor.name}이(가) ${actualHeal} 회복했다.`);
}
  return logs;
}



resolveTargets(actor, action) {

  
  if (!action?.targets) return [];
  const enemies = this.characters.filter(c =>
    c.id !== actor.id && c.hp > 0 && c.team !== actor.team
  );

  const allies = this.characters.filter(c =>
    c.id !== actor.id && c.hp > 0 && c.team === actor.team
  );

  switch (action.targets?.type) {

    case "self":
      return [actor];

    case "single": {

  const attacker = actor;

  const taunt = attacker.statusEffects?.find(
    e => e.type === "taunt"
  );

  if (taunt) {

    const forced = this.characters.find(
      c => c.id === taunt.targetId && c.hp > 0
    );

    if (forced) {
      return [forced];
    }
  }

  const t = this.characters.find(
    c => c.id === action.targets.id
  );

  return t ? [t] : [];
}

      case "all_allies":
    return this.characters.filter(
        c =>
            c.hp > 0 &&
            c.team === actor.team
    );

    case "all_enemies":
  return this.characters.filter(
    c => c.hp > 0 && c.team !== actor.team
  );

  

    case "random_enemy":
      return [enemies[Math.floor(Math.random() * enemies.length)]];
  }

  return [];
}

getFinalStats(character) {
  const base = { ...character.stats };

  if (!character.statusEffects) return base;

  for (const e of character.statusEffects) {

    
    if (e.type === "stat_mod") {
    base[e.stat] = (base[e.stat] ?? 0) + e.value;
  }

  if (e.type === "buff") {
    base[e.stat] = (base[e.stat] ?? 0) + e.value;
  }

  }

  return base;
}

  // =========================
  // ELEMENT
  // =========================
  getElementMultiplier(attacker, defender) {
    const a = attacker.type;
    const d = defender.type;

    let forceCrit = false;
let ignorePenalty = false;

for (const e of defender.statusEffects ?? []) {

  if (
    e.type === "element_weakness" &&
    e.attackType === attacker.type
  ) {
    ignorePenalty = true;
  }

}

for (const e of attacker.statusEffects ?? []) {

  if (
    e.type === "element_support" &&
    e.attackType === defender.type
  ) {
    forceCrit = true;
  }

}

    const advantage =
      (a === "A" && d === "B") ||
      (a === "B" && d === "C") ||
      (a === "C" && d === "A");

    const disadvantage =
(
  (a === "A" && d === "C") ||
  (a === "B" && d === "A") ||
  (a === "C" && d === "B")
)
&& !ignorePenalty;
    return {

  critBonus:
    advantage || forceCrit ? 1 : 0,

  damageMultiplier:
    disadvantage ? 0.7 : 1,

  elementText: ""
};
  }

  // =========================
  // CRIT
  // =========================
  rollCrit(actor) {
 const luk = actor.stats.luk ?? 0;
const hp = actor.hp ?? 0;

let chance = Math.max(
  0,
  (luk * 5) - (100 - hp)
);

const critBuff =
  actor.statusEffects?.filter(
    e => e.type === "crit_buff"
  ) ?? [];

for (const b of critBuff) {
  chance += b.value;
}

    if (Math.random() * 100 >= chance) return 1;

    return 1.2 + Math.random() * 0.3;
  }

processStatusEffects(logs, actor) {
  if (!actor.statusEffects) return;

  const next = [];

  for (const e of actor.statusEffects) {

  this.applyStatusEffect(e, actor, logs);

  // duration을 사용하는 상태이상(DOT 등)
  if (e.duration != null) {
    e.duration--;

    if (e.duration > 0) {
      next.push(e);
    } else {
      logs.push(`[효과 종료] ${actor.name} - ${e.type}`);
    }

    continue;
  }

  // expireTurn을 사용하는 상태(방어, 회피, 반격)
  if (e.expireActorId != null) {

    if (e.expireActorId === actor.id) {
        logs.push(`[효과 종료] ${actor.name} - ${e.type}`);
    } else {
        next.push(e);
    }

    continue;
}
  next.push(e);
}

  actor.statusEffects = next;
}
applyDamage(target, damage, logs, attacker = null) {
const transfer = target.statusEffects?.find(
  e => e.type === "transfer"
);

if (transfer) {

  const receiver = this.characters.find(
    c =>
      c.id === transfer.targetId &&
      c.hp > 0
  );

  if (receiver) {

    logs.push(
      `[전가] ${target.name}의 피해가 ${receiver.name}에게 넘어갔다.`
    );

    target = receiver;
  }
}
const share = target.statusEffects?.find(
  e => e.type === "share_damage"
);

if (share) {

  const allies = this.characters.filter(
    c =>
      c.team === target.team &&
      c.hp > 0
  );

  const split = Math.floor(damage / allies.length);

  for (const ally of allies) {

    ally.hp = Math.max(
      0,
      ally.hp - split
    );

    logs.push(
      `[분배] ${ally.name} -${split}`
    );
  }

  return;
}
  target.hp = Math.max(0, target.hp - damage);

const drain = target.statusEffects?.find(
  e => e.type === "drain"
);

if (drain) {

  const healer = this.characters.find(
    c => c.id === drain.healerId
  );

  if (healer && healer.hp > 0) {

    const heal = Math.floor(damage * drain.ratio);

    healer.hp = Math.min(
      healer.maxHp,
      healer.hp + heal
    );

    logs.push(
      `[흡수] ${healer.name}이(가) ${heal} 회복`
    );
  }
}

  // 근성
  const gutsIndex = target.statusEffects?.findIndex(
    e => e.type === "guts"
  ) ?? -1;

  if (target.hp <= 0 && gutsIndex >= 0) {

    target.hp = 1;

    target.statusEffects.splice(gutsIndex, 1);

    logs.push(
      `[근성] ${target.name}이(가) 죽음을 버티고 체력 1로 살아남았다.`
    );
  }
}

applyStatusEffect(effect, actor, logs) {
  switch (effect.type) {

    case "dot": {
  const stats = actor.stats;

  const dmg = Math.floor(
    evaluateFormula(effect.formula, {})
);

  this.applyDamage(actor, dmg, logs);
  logs.push(`[DOT] ${actor.name} -${dmg}`);
  break;
}
}}
}