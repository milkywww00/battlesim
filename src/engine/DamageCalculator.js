export class DamageCalculator {
  static apply(actor, targets, skill) {
    let log = [];

    for (const effect of skill.effects) {
      if (effect.type === "dmg") {
        const dmg = Math.floor(actor.atk * effect.value);
        for (const originalTarget of targets) {

  let target = originalTarget;
          target.hp = Math.max(0, target.hp - dmg);
          log.push(`${target.name} takes ${dmg} dmg`);
        }
      }

      if (effect.type === "self_damage") {
        actor.hp = Math.max(0, actor.hp - effect.value);
        log.push(`${actor.name} takes ${effect.value} recoil`);
      }
    }

    return log;
  }
}