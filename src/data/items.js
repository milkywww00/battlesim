export const items = {

  potion: {
    id: "potion",
    name: "체력 회복 물품",
    target: "ally",
    range: "single",
    effects: [
      {
        type: "heal",
        formula: "30"
      }
    ]
  },

  hiPotion: {
    id: "hiPotion",
    name: "체력 회복 물품2",
    target: "ally",
    range: "single",
    effects: [
      {
        type: "heal",
        formula: "70"
      }
    ]
  },

  ether: {
    id: "ether",
    name: "MP 회복 물품",
    target: "ally",
    range: "single",
    effects: [
      {
        type: "mp_heal",
        amount: 30
      }
    ]
  }

};