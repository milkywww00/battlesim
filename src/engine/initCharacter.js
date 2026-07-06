export function initCharacter(c) {

 const maxHp = 100 + (c.stats.hpStat ?? 0) * 10;
const maxMp = 100 + (c.stats.mpStat ?? 0) * 10;
  return {
    ...c,

      tieBreaker: Math.random(),

    maxHp,
    hp: maxHp,

    maxMp,
    mp: maxMp,

    inventory: c.inventory ?? {
     potion: 2,
     ether: 1
    }
  };
}