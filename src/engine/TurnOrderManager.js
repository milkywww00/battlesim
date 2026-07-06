export class TurnOrderManager {
  constructor(characters) {
    this.characters = characters;
    this.order = [];
    this.index = 0;
    this.turn = 0;
  }

  rebuildOrder() {
  this.order = [...this.characters].sort((a, b) => {

  const agiDiff =
    (b.stats.agi ?? 0) -
    (a.stats.agi ?? 0);

  if (agiDiff !== 0)
    return agiDiff;

  return a.tieBreaker - b.tieBreaker;
});

  // 현재 턴 위치 유지 보정
  this.index = 0;
}

 initOrder() {
  this.order = [...this.characters].sort((a, b) => b.agi - a.agi);
  this.index = 0;
}
  getNext() {

  if (this.order.length === 0) return null;

  let safety = 0;

  while (safety < this.order.length) {

    const actor = this.order[this.index];

    this.index++;

    if (this.index >= this.order.length) {
      this.index = 0;
    }

    this.turn++;

    if (actor.hp > 0) {
      return actor;
    }

    safety++;
  }

  return null;
}
 removeDead(id) {

  const deadIndex = this.order.findIndex(c => c.id === id);

  this.order = this.order.filter(c => c.id !== id);

  if (deadIndex === -1) return;

  if (deadIndex < this.index) {
    this.index--;
  }

  if (this.index < 0) this.index = 0;
  if (this.index >= this.order.length) this.index = 0;
}
current() {
  return this.order[this.index] ?? null;
}

addCharacter(character) {

  if (!this.characters.find(c => c.id === character.id)) {
    this.characters.push(character);
  }

  if (!this.order.find(c => c.id === character.id)) {
    this.order.push(character);
  }

  this.rebuildOrder();
}
}