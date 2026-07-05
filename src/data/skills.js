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
  mpCost: 15,
    effects: [
      {
        type: "dmg",
        formula: "15 + dice(str * 5)+ dice(str * 5)"
      },
      {
        type: "self_damage",
        ratio: 0.3
      }
    ]
  },

  full_attack: {
  name: "쎈공격",
  target: "enemy",
  range: "single",
  mpCost: 15,
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
  mpCost: 20,
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
  mpCost: 10,
   effects: [
    {
        type: "dmg",
        formula: "15 + dice(str * 5)+ dice(str * 5)"
      },
      {
        type: "apply_status",
        status: {
          type: "dot",
          duration: 3,
          formula: "5 + dice(6)"
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
  mpCost: 15,
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
  mpCost: 15,
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
  mpCost: 20,
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
  mpCost: 20,
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
  mpCost: 20,
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
  mpCost: 20,
  effects: [
    {
      type: "reflect",
      duration: 3,
      ratio: 0.5
    }
  ]
},

};

