import { skills } from "../data/skills.js";

export class BattleUI {
  constructor(engine, turnManager) {
    this.engine = engine;
    this.turnManager = turnManager;
    this.turnCount = 0;
    this.selectedSkill = null;
    this.selectedTarget = null;

    this.init();
  }

  init() {

    this.skipBtn = document.getElementById("skipBtn");

if (this.skipBtn) {
  this.skipBtn.addEventListener("click", () => {
    this.skipTurn();
  });
}
    this.turnInfo = document.getElementById("turnInfo");
    this.skillDiv = document.getElementById("skills");
    this.targetDiv = document.getElementById("targets");
    this.log = document.getElementById("log");
    this.confirmBtn = document.getElementById("confirmBtn");
  this.bindDebugControls(); //
    this.confirmBtn.addEventListener("click", () => {
      this.confirmAction();
      this.renderCharacters();
      this.debugTargetId = null;
    });

    this.render();
  }

  render() {
    const actor = this.turnManager.current();
  const skill = skills[this.selectedSkill];


  if (!actor) {
    this.turnInfo.innerText = "NO ACTOR (TURN BROKEN)";
    return;
  }

  this.turnInfo.innerText = `TURN: ${actor.name}`;

  this.renderSkills(actor);

  if (this.selectedSkill) {
    const skill = skills[this.selectedSkill];

const needsTarget =
  skill.target !== "self" &&
  skill.range !== "all";

    if (needsTarget) {
  this.renderTargets(actor, skill);
} else {
      this.targetDiv.innerHTML = "";
    }
  } else {
    this.targetDiv.innerHTML = "";
  }
  this.renderCharacters();
}

renderCharacters() {

  const team1 = document.getElementById("team1");
  const team2 = document.getElementById("team2");

  team1.innerHTML = "";
  team2.innerHTML = "";

  for (const c of this.engine.characters) {

    const hpPercent = (c.hp / c.maxHp) * 100;
    const mpPercent = (c.mp / c.maxMp) * 100;

    const statuses = (c.statusEffects ?? [])
  .map(s => {

      if(s.duration != null)
          return `${this.getStatusIcon(s.type)}${s.duration}`;

      return this.getStatusIcon(s.type);

  })
  .join(" ");

    const card = document.createElement("div");

    card.className = "characterCard";

    if (c.id === this.turnManager.current()?.id) {
  card.classList.add("currentTurn");
}

const dead = c.hp <= 0;

if(dead){
    card.classList.add("dead");
}

    card.innerHTML = `
    <b style="color:${this.getTypeColor(c.type)}">
    ${c.name}
</b></b> (${c.type})

      <div class="bar">
        <div class="hpBar" style="width:${hpPercent}%"></div>
      </div>

      HP ${c.hp}/${c.maxHp}

      <div class="bar">
        <div class="mpBar" style="width:${mpPercent}%"></div>
      </div>

      MP ${c.mp}/${c.maxMp}

      <div class="statusRow">${statuses}</div>
    `;

    if (c.team === 1)
      team1.appendChild(card);
    else
      team2.appendChild(card);
  }
}

getTypeColor(type){

    switch(type){

        case "A":
            return "#ff6666";

        case "B":
            return "#66ff66";

        case "C":
            return "#6699ff";

        default:
            return "white";
    }
}

getStatusIcon(type) {

  const icons = {

    guard:"🛡",

    dodge:"💨",

    dot:"🔥",

    fear:"😱",

    seal:"🔒",

    confusion:"❓",

    berserk:"💢",

    charge:"⚡",

    barrier:"🟦",

    reflect:"🔁",

    protect:"🛡",

    guts:"❤️",

    counter:"⚔",

    buff:"⬆",

    damage_reduction:"⬇",

    taunt:"📢",

    drain:"🩸"
  };

  return icons[type] ?? "•";
}
renderSkills(actor) {
  this.skillDiv.innerHTML = "";

  const charge = actor.statusEffects?.find(
    e => e.type === "charge"
  );

  const berserk = actor.statusEffects?.find(
  e => e.type === "berserk"
  
);

const feared = actor.statusEffects?.find(
  e => e.type === "fear"

);

const sealed =
  actor.statusEffects?.some(
    e => e.type === "seal"
  );

  for (const skillId of actor.skills) {

    if (feared) {
    if (skillId !== "escape") continue;
  }

  // 차지 중
  if (charge) {
    if (skillId !== "charge_release") continue;
  }

  // 광폭화 중
  if (berserk && skillId !== "attack") {
  continue;
}
    // 평소에는 차지공격 숨김
    else {
      if (skillId === "charge_attack") continue;
    }

    const skill = skills[skillId];
    if (
  sealed &&
  ![
    "attack",
    "defend",
    "dodge",
    "escape"
  ].includes(skillId)
) {
  continue;
}

    if (!skill) continue;

    const btn = document.createElement("button");
    btn.innerText = skill.name;

    btn.onclick = () => {
      this.selectedSkill = skillId;
      this.selectedTarget = null;
      this.render();
    };

    if (this.selectedSkill === skillId) {
      btn.classList.add("selected");
    }

    this.skillDiv.appendChild(btn);
  }
}

renderTargets(actor, skill) {
  const type = skill.range;

  if (type === "self") {
    this.targetDiv.innerHTML = "";
    return;
  }

  this.targetDiv.innerHTML = "";

  const canTargetDead =
  skill.effects?.some(e => e.type === "revive");
for (const c of this.engine.characters) {

    // 부활이 아니면 죽은 대상 선택 불가
    if (!canTargetDead && c.hp <= 0) continue;

    // 부활이면 살아있는 대상 선택 불가
    if (canTargetDead && c.hp > 0) continue;

    if (skill.target === "enemy" && c.team === actor.team) continue;
    if (skill.target === "ally" && c.team !== actor.team) continue;

    const btn = document.createElement("button");
    btn.innerText = `${c.name} HP:${c.hp}/${c.maxHp} MP:${c.mp}/${c.maxMp}`;
    btn.innerText =
  c.hp <= 0
    ? `☠ ${c.name}`
    : `${c.name} HP:${c.hp}/${c.maxHp} MP:${c.mp}/${c.maxMp}`;
    btn.onclick = () => {
      this.selectedTarget = c.id;

      // 🔥 여기 중요: 전체 render 하지 말고 버튼 상태만 갱신
      this.renderTargets(actor, skill);
    };

    if (this.selectedTarget === c.id) {
      btn.classList.add("selected");
    }

    this.targetDiv.appendChild(btn);
  }
}

 addLog(text) {
  const div = document.createElement("div");
  div.innerText = text;

  this.log.appendChild(div);
}

confirmAction() {
  if (!this.selectedSkill) return;

  const actor = this.turnManager.current();
  const skill = skills[this.selectedSkill];

  const needsTarget =
    skill.target !== "self" &&
    skill.range !== "all";

    if (needsTarget && !this.selectedTarget) return;

  const action = {
  actorId: actor.id,
  skillId: this.selectedSkill,
  targetId: needsTarget ? this.selectedTarget : null
};

const logs = this.engine.step(action);

  logs.forEach(l => this.addLog(l));

  this.selectedSkill = null;
  this.selectedTarget = null;

  this.render();
  }

  renderDebugTargets() {
  const div = document.getElementById("debugTargets");
  div.innerHTML = "";

  for (const c of this.engine.characters) {
    const btn = document.createElement("button");

    btn.innerText = `${c.name} (${c.hp}/${c.mp})`;

    btn.onclick = () => {
      this.debugTargetId = c.id;
      this.renderDebugTargets();
    };

    if (this.debugTargetId === c.id) {
      btn.classList.add("selected");
    }

    div.appendChild(btn);
  }
}
bindDebugControls() {
  
  const hpPlus = document.getElementById("hpPlus");
  const hpMinus = document.getElementById("hpMinus");
  const mpPlus = document.getElementById("mpPlus");
  const mpMinus = document.getElementById("mpMinus");

  const statusInput = document.getElementById("statusInput"); 
  const addStatus = document.getElementById("addStatus");
  const hpInput = document.getElementById("hpInput");
  const mpInput = document.getElementById("mpInput");

  const getTarget = () =>
  this.engine.characters.find(c => c.id === this.debugTargetId);

  hpPlus.addEventListener("click", () => {
  const t = getTarget();
  if (!t) return;

  const value = Number(hpInput.value || 0);

  t.hp = Math.min(t.maxHp, t.hp + value);
  this.render();
});

  hpMinus.addEventListener("click", () => {
    
    const t = getTarget();
    if (!t) return;

    const value = Number(hpInput.value || 0);

    t.hp = Math.max(0, t.hp - value);
    this.render();
  });

  mpPlus.addEventListener("click", () => {
    const t = getTarget();
    if (!t) return;

    const value = Number(mpInput.value || 0);

    t.mp = Math.min(t.maxMp ?? 9999, (t.mp ?? 0) + value);
    this.render();
  });

  mpMinus.addEventListener("click", () => {
    const t = getTarget();
    if (!t) return;

    const value = Number(mpInput.value || 0);

    t.mp = Math.max(0, (t.mp ?? 0) - value);
    this.render();
  });
  addStatus.addEventListener("click", () => {
  const t = getTarget();
  if (!t) return;

  const type = statusInput.value.trim();
  if (!type) return;

  if (!t.statusEffects) t.statusEffects = [];

  t.statusEffects.push({
    type,
    duration: 3
  });

  this.render();
});
this.renderDebugTargets();
}
skipTurn() {
  const actor = this.turnManager.current();
  if (!actor) return;

  const logs = this.engine.step({
    actorId: actor.id,
    skillId: "skip",
    targetId: actor.id
  });

  logs.forEach(l => this.addLog(l)); // ⭐ 이거 추가

  this.selectedSkill = null;
  this.selectedTarget = null;

  this.render();
}
}