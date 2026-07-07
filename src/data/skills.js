export const skills = {
  attack: {
  name: "기본 공격",
  description:"지정 대상을 공격한다.",
  target: "enemy",
  range: "single",
  mpCost: 0,
    effects: [
      {
        type: "dmg",
        formula: "10 + dice(str * 5)"
      }
    ]
  },

 heavy_attack: {
  name: "반동",
  description:"적 1인을 기본 공격보다 강화된 데미지로 공격한 후 최종 데미지의 40% 만큼 데미지를 입는다.",
  target: "enemy",
  range: "single",
  mpCost: 10,
    effects: [
      {
        type: "dmg",
        formula: "15 + dice(str * 5)+ dice(str * 5)"
      },
      {
        type: "self_damage",
        ratio: 0.4
      }
    ]
  },

  full_attack: {
  name: "강화",
  description:"적 1인을 기본 공격보다 강화된 데미지로 공격한다.",
  target: "enemy",
  range: "single",
  mpCost: 10,
    effects: [
      {
        type: "dmg",
        formula: "20 + dice(str * 5)"
      }
    ]
  },

  defend: {
  name: "방어",
  description:"자신의 턴이 되돌아 올때까지 방어 태세를 취한다.",
  target: "self",
  range: "single",
    mpCost: 0,
    effects: [
      { type: "guard" }
    ]
  },

 dodge: {
  name: "회피",
  description:"자신의 턴이 되돌아 올때까지 회피 태세를 취한다.",
  target: "self",
  range: "single",
    mpCost: 0,
    effects: [
      { type: "dodge" }
    ]
  },

  escape: {
  name: "도주",
  description:"전투를 포기하고 도주한다.",
  target: "self",
  range: "single",
  mpCost: 0,
  effects: [
    {
      type: "escape"
    }
  ]
},

  heal: {
    name: "회복",
    description:"아군 1인의 체력을 회복한다.",
    target: "ally",
    range: "single",
    mpCost: 20,
    effects: [
      {
        type: "heal",
        formula: "30 + dice(int * 5)"
      }
    ]
  },
  all_attack: {
  name: "광역",
  description:"전투에 참여한 적 전원을 공격한다.",
  target: "enemy",
  range: "all",
  mpCost: 20,
  effects: [
    {
      type: "dmg",
      formula: "10 + dice(str * 5)"
    }
  ]
},

bleed: {
  name: "잔열",
  description:"적 1인을 공격한 후 3턴 간 지속 피해를 입힌다.",
  target: "enemy",
  range: "single",
  mpCost: 15,
   effects: [
    {
        type: "dmg",
        formula: "10 +  dice(str * 5)"
      },
      {
        type: "apply_status",
        status: {
          type: "dot",
          duration: 3,
          formula: "5 + dice(str * 2)"
        }
      },
      
  ]
},


multi_attack: {
  name: "연속",
  description:"적 1인을 1회 공격 후 확률에 따라 최대 4회까지 연속으로 공격한다.",
  target: "enemy",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "multi_hit",
      formula: "10 + dice(str * 5)"
    }
  ]
},

counter: {
  name: "반격",
  description:"자신의 턴이 되돌아 올때까지 반격 태세를 취한다. 이후 공격 받을 시 반격해 상대에게 데미지를 준다.",
  target: "self",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "counter",
    }
  ]
},
lifesteal: {
  name: "흡혈",
  description:"적 1인을 1회 공격 후 최종 데미지의 50% 만큼 자신의 체력을 회복한다.",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
        type: "dmg",
        formula: "15+dice(str*5)"
    },
    {
        type: "lifesteal",
        ratio: 0.5
    }
  ]
},
sure_hit: {
  name: "명중",
  description:"회피, 공격 실패 등과 관련 없이 적 1인을 확정적으로 공격한다.",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "dmg",
      formula: "10+dice(str*5)",
      ignoreHit: true
    }
  ]
},
attribute_attack: {
  name: "변환A",
  description:"자신의 속성이 아닌 속성으로 적 1인을 공격한다 (A 속성)",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "dmg",
      formula: "10+dice(str*5)",
      attackType: "A"
    }
  ]
},
attribute_attackk: {
  name: "변환B",
  description:"자신의 속성이 아닌 속성으로 적 1인을 공격한다 (B 속성)",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "dmg",
      formula: "10+dice(str*5)",
      attackType: "B"
    }
  ]
},
attribute_attackkk: {
  name: "변환C",
  description:"자신의 속성이 아닌 속성으로 적 1인을 공격한다 (C 속성)",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "dmg",
      formula: "10+dice(str*5)",
      attackType: "C"
    }
  ]
},
execute: {
  name: "즉사",
  description:"체력이 전체 체력의 50% 이하인 적을 일정 확률로 즉사시킨다. (주요 레이드 미적용)",
  target: "enemy",
  range: "single",
  mpCost: 25,
  effects: [
    {
      type: "execute"
    }
  ]
},
charge: {
  name: "충전",
  description:"스킬 시전 후 다음 턴에 적 1인을 강화된 데미지로 공격한다.",
  target: "self",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "charge",
    }
  ]
},
charge_attack: {
  name: "충전 완료",
  description:"공격 준비가 끝났다.",
  target: "enemy",
  range: "single",
  mpCost: 0,

  effects: [
    {
      type: "dmg",
      formula: "15 + dice(str * 5)+ dice(str * 5)"
    }
  ]
},
berserk: {
  name: "광기",
  description:"3턴간 기본 공격만 가능하다. 단, 기본 공격의 데미지를 강화한다.",
  target: "self",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "berserk",
      duration: 3,
    }
  ]
},
barrier: {
  name: "베리어",
  description:"지정 1인에게 3턴 간 방어막을 씌운다. 방어막 효과 적용 중 공격 받을 시, 데미지를 1회 무효로 한다.",
  target: "ally",
  range: "single",
  mpCost: 20,
  effects: [
    {
      type: "barrier",
      duration: 3
    }
  ]
},

damage_reduction: {
  name: "보호",
  description:"지정 1인이 3턴 간 받는 데미지를 15% 감소시킨다.",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "damage_reduction",
      duration: 3,
      ratio: 0.15
    }
  ]
},

reflect: {
  name: "반사",
  description:"지정 1인이 3턴 간 받는 데미지의 30%를 반사한다.",
  target: "self",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "reflect",
      duration: 3,
      ratio: 0.3
    }
  ]
},

protect: {
  name: "희생",
  description:"사용 후, 지정 대상이 공격을 받을 시 받은 데미지를 스킬 시전자가 대신 받는다.",
  range: "single",
  target: "ally",
  mpCost: 15,
  effects: [
    {
      type: "protect",
      duration: 3
    }
  ]
},
taunt: {
  name: "도발",
  description:"적 1인이 3턴 간 스킬 시전자만을 공격한다.",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "taunt",
      duration: 3
    }
  ]
},

courage: {
  name: "용기",
  description:"2턴 간 아군 1인의 근력 스테이터스를 1 증가시킨다. (중첩 최대 2회)",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat: "str",
      value: 1,
      duration: 2,
      maxStack: 2
    }
  ]
},

weakness: {
  name: "쇠약",
  description:"2턴 간 적 1인의 근력 스테이터스를 1 감소시킨다. (중첩 최대 2회)",
  target: "enemy",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat: "str",
      value: -1,
      duration: 2,
      maxStack: 2
    }
  ]
},
lucky: {
  name: "행운",
  description:"2턴 간 아군 1인의 행운 스테이터스를 1 증가시킨다. (중첩 최대 2회)",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat:"luk",
value:+1,
      duration: 2,
      maxStack: 2
    }
  ]
},
unlucky: {
  name: "불운",
  description:"2턴 간 적 1인의 행운 스테이터스를 1 감소시킨다. (중첩 최대 2회)",
  target: "enemy",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat:"luk",
value:-1,
      duration: 2,
      maxStack: 2
    }
  ]
},
yyy: {
  name: "둔화",
  description:"2턴 간 적 1인의 민첩 스테이터스를 1 감소시킨다. (중첩 최대 2회)",
  target: "enemy",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat:"agi",
value:-1,
      duration: 2,
      maxStack: 2
    }
  ]
},
zzz: {
  name: "신속",
  description:"2턴 간 아군 1인의 민첩 스테이터스를 1 증가시킨다. (중첩 최대 2회)",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "buff",
      stat:"agi",
value:+1,
      duration: 2,
      maxStack: 2
    }
  ]
},
alert: {
  name: "경계",
  description:"2턴 간 아군 1인의 공격 성공 확률을 10% 증가시킨다.",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "accuracy_buff",
      value: 10,
      duration: 2
    }
  ]
},
ddd: {
  name: "방심",
  description:"2턴 간 적 1인의 공격 성공 확률을 10% 감소시킨다.",
  target: "enemy",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "accuracy_buff",
      value: -10,
      duration: 2
    }
  ]
},
onechance: {
  name: "일발",
  description:"2턴 간 아군 1인의 크리티컬 확률을 10% 증가시킨다.",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
    type:"crit_buff",
    value:10,
    duration:2
}
  ]
},
aaa: {
  name: "모면",
  description:"2턴 간 아군 1인의 회피 성공 확률을 10% 증가시킨다.",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
    type:"dodge_buff",
    value:10,
    duration:2
}
  ]
},
heal_all: {
  name: "회생",
  description:"아군 전원의 체력을 회복한다.",
  target: "all_allies",
  range: "all",
  mpCost: 25,

  effects: [
    {
      type: "heal",
      formula: "10 + dice(int*5)"
    }
  ]
},

cure: {
  name: "치유",
  description:"아군 1인의 부정적 효과를 랜덤으로 1가지 치료한다.",
  target: "ally",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "cleanse"
    }
  ]
},
seal: {
  name: "봉인",
  description:"2턴 간 적 1인의 스킬 사용을 금지한다.",
  target: "enemy",
  range: "single",
  mpCost: 20,

  effects: [
    {
      type: "apply_status",
      status: {
        type: "seal",
        duration: 2
      }
    }
  ]
},
restrict: {
  name: "제한",
  description:"적 1인을 1턴 간 행동 불가로 만든다.",
  target: "enemy",
  range: "single",
  mpCost: 20,

  effects: [
    {
      type: "apply_status",
      status: {
        type: "restrict",
        duration: 1
      }
    }
  ]
},
confusion: {
  name: "식별불가",
  description:"3턴 간 적 1인의 공격 대상을 적/아군/자기 자신 중 랜덤으로 결정하게 만든다.",
  target: "enemy",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "apply_status",
      status: {
        type: "confusion",
        duration: 3
      }
    }
  ]
},
fear: {
  name: "공포",
  description:"적 1인의 다음 행동을 도주로 고정한다. (주요 레이드 미적용)",
  target: "enemy",
  range: "single",
  mpCost: 30,

  effects: [
    {
      type: "fear"
    }
  ]
},
guts: {
  name: "근성",
  description:"사용 후, 체력이 0이 될 시 체력 1로 부활한다.",
  target: "self",
  range: "single",
  mpCost: 30,

  effects: [
    {
      type: "guts"
    }
  ]
},
drain: {
  name: "흡수",
  description:"지정 1인이 3턴간 받는 데미지의 30%만큼의 체력을 스킬 시전자가 회복한다.",
  target: "ally",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "drain",
      duration: 3,
      ratio: 0.3
    }
  ]
},
revive: {
  name: "부활",
  description:"행동불가 상태의 아군 1인을 최대 체력의 50%로 즉시 부활시킨다.",
  target: "ally",
  range: "single",
  mpCost: 50,

  effects: [
    {
      type: "revive"
    }
  ]
},
transfer: {
  name: "전가",
  description:"사용 후, 스킬 시전자가 3턴 간 받는 데미지를 지정 대상에게 떠넘긴다.",
  target: "ally",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "transfer",
      duration: 3
    }
  ]
},
share_damage: {
  name: "분배",
  description:"사용 후, 스킬 시전자가 3턴 간 받는 데미지를 아군 전체에게 분배한다.",
  target: "self",
  range: "single",
  mpCost: 15,
  effects: [
    {
      type: "share_damage",
      duration: 3
    }
  ]
},
weakness: {
  name: "약점A",
  description:"적 1인의 특정 속성을 약화시킨다. (A 속성)",
  target: "enemy",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_weakness",
      attackType: "A",
      duration: 3
    }
  ]
},
weaknesss: {
  name: "약점B",
  description:"적 1인의 특정 속성을 약화시킨다. (B 속성)",
  target: "enemy",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_weakness",
      attackType: "B",
      duration: 3
    }
  ]
},
weaknessss: {
  name: "약점C",
  description:"적 1인의 특정 속성을 약화시킨다. (C 속성)",
  target: "enemy",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_weakness",
      attackType: "C",
      duration: 3
    }
  ]
},
support: {
  name: "보완A",
  description:"아군 1인의 특정 속성을 강화시킨다. (A 속성)",
  target: "ally",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_support",
      attackType: "A",
      duration: 3
    }
  ]
},
supportt: {
  name: "보완B",
  description:"아군 1인의 특정 속성을 강화시킨다. (B 속성)",
  target: "ally",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_support",
      attackType: "B",
      duration: 3
    }
  ]
},
supporttt: {
  name: "보완C",
  description:"아군 1인의 특정 속성을 강화시킨다. (C 속성)",
  target: "ally",
  range: "single",
  mpCost: 15,

  effects: [
    {
      type: "element_support",
      attackType: "C",
      duration: 3
    }
  ]
},
};

