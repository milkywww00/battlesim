export const skills = {
  attack: {
  name: "기본 공격",
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
  name: "강공격",
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
  name: "쎈공격",
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
  target: "self",
  range: "single",
    mpCost: 0,
    effects: [
      { type: "guard" }
    ]
  },

 dodge: {
  name: "회피",
  target: "self",
  range: "single",
    mpCost: 0,
    effects: [
      { type: "dodge" }
    ]
  },

  escape: {
  name: "도주",
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
    name: "힐",
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
  name: "광역 공격",
  target: "enemy",
  range: "all",
  mpCost: 15,
  effects: [
    {
      type: "dmg",
      formula: "10 + dice(str * 5)"
    }
  ]
},

bleed: {
  name: "출혈",
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
  name: "연속 공격",
  target: "enemy",
  range: "single",
  mpCost: 10,
  effects: [
    {
      type: "multi_hit",
      formula: "10 + dice(str * 5)"
    }
  ]
},

counter: {
  name: "반격",
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
  name: "확정 공격",
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
  name: "속성 변경 공격",
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
execute: {
  name: "즉사",
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
  name: "차지",
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
  name: "차지 공격",
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
  name: "광폭화",
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
  name: "방어 강화",
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
  name: "데미지 반사",
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
  name: "몸빵",
  target: "ally",
  range: "single",
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
  target: "ally",
  range: "single",
  mpCost: 50,

  effects: [
    {
      type: "revive"
    }
  ]
},
};

