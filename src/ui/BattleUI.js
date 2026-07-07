import { skills } from "../data/skills.js";
import { items } from "../data/items.js";

export class BattleUI {
  constructor(engine, turnManager) {
    this.engine = engine;
    this.turnManager = turnManager;
    this.turnCount = 0;
    this.selectedSkill = null;
    this.selectedTarget = null;
    this.selectedItem = null;

    this.init();
  }

  init() {

    const app = document.getElementById("app");

   app.innerHTML = `
<div class="battleContainer">

    <div class="battleHeader">
        <div>
            <p class="eyebrow">Turn-based battle</p>
            <h1 class="title">Battle Simulator</h1>
            <p class="subtitle">전투 상황을 한눈에 보고, 행동을 선택해보세요.</p>
        </div>
        <div id="turnInfo" class="turnBanner"></div>
    </div>

    <div class="battleStage">
        <div class="battleMeta">
            <div class="battleBadge">⚔️ Battlefield</div>
            <div class="battleStatusRow">
                <div class="statusChip" id="turnChip"></div>
                <div class="statusChip" id="teamChip"></div>
                <div class="statusChip" id="aliveChip"></div>
            </div>
        </div>
    </div>

    <div class="battleTop">

        <section class="teamColumn">
            <h2>🟦 Team 1</h2>
            <div id="team1" class="teamGrid"></div>
        </section>

        <section class="teamColumn">
            <h2>🟥 Team 2</h2>
            <div id="team2" class="teamGrid"></div>
        </section>

    </div>

    <div class="battleGrid">
        <section class="panel">
            <h2>📜 Battle Log</h2>
            <div id="actionSummary" class="actionSummary"></div>
            <div id="log"></div>
        </section>

        <section class="panel">
            <h2>⚔️ Skills</h2>
            <div id="skills"></div>

            <h2>🧪 Items</h2>
            <div id="items"></div>

            <h2>🎯 Targets</h2>
            <div id="targets"></div>

            <div class="battleButtons">
                <button id="confirmBtn">행동 확정</button>
                <button id="skipBtn">턴 스킵</button>
            </div>
        </section>
    </div>

    <div id="resultOverlay" class="resultOverlay hidden">
        <div class="resultCard">
            <div id="resultTitle" class="resultTitle"></div>
            <div id="resultText" class="resultText"></div>
            <button id="restartBtn">다시 선택</button>
        </div>
    </div>

    <details class="debugPanel">
        <summary>Debug</summary>

        <div id="debugTargets"></div>

        <input id="hpInput" type="number" value="10">
        <button id="hpPlus">HP+</button>
        <button id="hpMinus">HP-</button>

        <br><br>

        <input id="mpInput" type="number" value="10">
        <button id="mpPlus">MP+</button>
        <button id="mpMinus">MP-</button>

        <br><br>

        <input id="statusInput" placeholder="status">
        <button id="addStatus">상태이상 추가</button>
    </details>

</div>
`;

    this.turnInfo = document.getElementById("turnInfo");
    this.turnChip = document.getElementById("turnChip");
    this.teamChip = document.getElementById("teamChip");
    this.aliveChip = document.getElementById("aliveChip");
    this.actionSummary = document.getElementById("actionSummary");
    this.skillDiv = document.getElementById("skills");
    this.skipBtn = document.getElementById("skipBtn");
    this.resultOverlay = document.getElementById("resultOverlay");
    this.resultTitle = document.getElementById("resultTitle");
    this.resultText = document.getElementById("resultText");
    this.restartBtn = document.getElementById("restartBtn");
    this.itemDiv = document.getElementById("items");
    this.targetDiv = document.getElementById("targets");
    this.log = document.getElementById("log");
    this.confirmBtn = document.getElementById("confirmBtn");
  this.bindDebugControls(); //
    this.confirmBtn.addEventListener("click", () => {
      this.confirmAction();
      this.renderCharacters();
      this.debugTargetId = null;
    });

    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => {
        this.skipTurn();
      });
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener("click", () => {
        window.location.reload();
      });
    }

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
  this.renderBattleMeta(actor);

  const selectedLabel = this.selectedSkill
    ? skills[this.selectedSkill]?.name
    : this.selectedItem
      ? items[this.selectedItem]?.name
      : "행동을 선택하세요";
  const target = this.selectedTarget
    ? this.engine.characters.find(c => c.id === this.selectedTarget)
    : null;
  const targetLabel = target ? target.name : "대상 미선택";
  const selectedData = this.selectedSkill
    ? skills[this.selectedSkill]
    : this.selectedItem
      ? items[this.selectedItem]
      : null;

  const description = selectedData?.description ? `<div class="summaryDesc">${selectedData.description}</div>` : "";
  const statusText = this.selectedSkill || this.selectedItem
    ? `<strong>${this.selectedSkill ? "스킬" : "아이템"}</strong>: ${selectedLabel}${target && (this.selectedSkill || this.selectedItem) ? ` → ${targetLabel}` : ""}${description}`
    : `현재 턴의 행동을 선택하면 여기에 요약이 표시됩니다.`;

  if (this.actionSummary) {
    this.actionSummary.innerHTML = `<div class="summaryTitle">행동 미리보기</div><div class="summaryBody">${statusText}</div>`;
  }

  this.renderSkills(actor);
  this.renderItems(actor);

  if (selectedData) {

    const needsTarget =
        selectedData.target !== "self" &&
        selectedData.range !== "all";

    if (needsTarget) {
        this.renderTargets(actor, selectedData);
    } else {
        this.targetDiv.innerHTML = "";
    }

} else {
    this.targetDiv.innerHTML = "";
}
  this.renderCharacters();
  this.updateBattleResult();
}

renderBattleMeta(actor) {
  const alive = this.engine.characters.filter(c => c.hp > 0);
  const teams = [...new Set(alive.map(c => c.team))];
  const turnLabel = actor ? `${actor.name}의 턴` : "전투 종료";

  if (this.turnChip) {
    this.turnChip.innerHTML = `<strong>현재 턴</strong> · ${turnLabel}`;
  }

  if (this.teamChip) {
    const teamSummary = teams.length > 1 ? `${teams.length}팀 전투 중` : `팀 ${teams[0]} 우세`;
    this.teamChip.innerHTML = `<strong>전투 상태</strong> · ${teamSummary}`;
  }

  if (this.aliveChip) {
    this.aliveChip.innerHTML = `<strong>잔존 인원</strong> · ${alive.length}명`; 
  }
}

updateBattleResult() {
  const alive = this.engine.characters.filter(c => c.hp > 0);
  const teams = [...new Set(alive.map(c => c.team))];

  if (teams.length <= 1 && this.resultOverlay) {
    const winner = teams[0] ?? this.engine.characters[0]?.team;
    this.resultTitle.textContent = winner === 1 ? "아군 승리" : "적군 승리";
    this.resultText.textContent = `남은 전투 인원 ${alive.length}명으로 전투가 끝났습니다.`;
    this.resultOverlay.classList.remove("hidden");
  } else if (this.resultOverlay) {
    this.resultOverlay.classList.add("hidden");
  }
}

renderCharacters() {

  

  const team1 = document.getElementById("team1");
  const team2 = document.getElementById("team2");

  team1.innerHTML = "";
  team2.innerHTML = "";

  for (const c of this.engine.characters) {

    const hpPercent = (c.hp / c.maxHp) * 100;
    const mpPercent = (c.mp / c.maxMp) * 100;
    const inv = c.inventory || {};
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
    <div class="cardHeader">
      <span class="typeCircle" style="background:${this.getTypeColor(c.type)}"></span>
      <b>${c.name}</b>
    </div>

    <div class="bar">
      <div class="hpBar" style="width:${hpPercent}%"></div>
    </div>
    <div class="statText"><span>HP</span><span>${c.hp}/${c.maxHp}</span></div>

    <div class="bar">
      <div class="mpBar" style="width:${mpPercent}%"></div>
    </div>
    <div class="statText"><span>MP</span><span>${c.mp}/${c.maxMp}</span></div>

    <div class="inventory">
      <span class="inventoryItem">🧪 ${inv.potion ?? 0}</span>
      <span class="inventoryItem">🔵 ${inv.ether ?? 0}</span>
    </div>

    <div class="statusRow">${statuses ? statuses : '<span class="statusBadge">상태 없음</span>'}</div>
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

btn.innerHTML = `
    <div class="skillName">${skill.name}</div>
    <div class="skillCost">
        ${skill.mpCost > 0 ? `${skill.mpCost} MP` : "FREE"}
    </div>
`;

if (actor.mp < skill.mpCost) {

    btn.disabled = true;

}

    btn.onclick = () => {
      this.selectedSkill = skillId;
      this.selectedItem = null;
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

addLog(text){

    const div=document.createElement("div");

    div.classList.add("log-line");

    if(text.includes("[피해]")){

        div.innerHTML=`⚔ ${text}`;
        div.classList.add("log-damage");

    }

    else if(text.includes("[회복]")){

        div.innerHTML=`💚 ${text}`;
        div.classList.add("log-heal");

    }

    else if(text.includes("[상태이상]")){

        div.innerHTML=`🌀 ${text}`;
        div.classList.add("log-status");

    }

    else if(text.includes("[명중]")){

        div.innerHTML=`🎯 ${text}`;
        div.classList.add("log-system");

    }

    else if(text.includes("[효과 종료]")){

        div.innerHTML=`⌛ ${text}`;
        div.classList.add("log-status");

    }

    else{

        div.innerHTML=text;
    }

    this.log.appendChild(div);

    this.log.scrollTop=this.log.scrollHeight;
}

  logActionAndResults(actionText, logs) {
    const turnOrderLog = logs.find(log => log.includes("[턴 순서]"));
    const otherLogs = logs.filter(log => !log.includes("[턴 순서]"));

    if (turnOrderLog) {
      this.addLog(turnOrderLog);
    }

    this.addLog(actionText);

    otherLogs.forEach(log => this.addLog(log));
  }

confirmAction() {

    if (!this.selectedSkill && this.selectedItem == null) return;

    const actor = this.turnManager.current();

    // =========================
    // 아이템 사용
    // =========================
    if (this.selectedItem != null) {

    const item = items[this.selectedItem];
    const target = this.selectedTarget
      ? this.engine.characters.find(c => c.id === this.selectedTarget)
      : null;

    const logs = this.engine.step({
        actorId: actor.id,
        itemId: this.selectedItem,
        targetId: this.selectedTarget
    });

    this.logActionAndResults(`[행동] ${actor.name}이(가) ${item?.name || "아이템"}을(를) ${target ? `${target.name}에게` : "사용했다"}.`, logs);

        this.selectedSkill = null;
        this.selectedItem = null;
        this.selectedTarget = null;

        this.render();

        return;
    }

    // =========================
    // 스킬 사용
    // =========================
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

    this.logActionAndResults(`[행동] ${actor.name}이(가) ${skill?.name || "스킬"}을(를) 사용했다.`, logs);

    this.selectedSkill = null;
    this.selectedItem = null;
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

  this.logActionAndResults(`[행동] ${actor.name}이(가) 턴을 스킵했다.`, logs);
  this.selectedSkill = null;
  this.selectedTarget = null;

  this.render();
}
renderItems(actor){

    this.itemDiv.innerHTML = "";

    const inventory = actor.inventory ?? {};

    for(const itemId in inventory){

        const count = inventory[itemId];

        if(count<=0) continue;

        const item = items[itemId];

        if(!item) continue;

        const btn=document.createElement("button");

        btn.innerText=`${item.name} x${count}`;

        btn.onclick = () => {
    this.selectedItem = itemId;
    this.selectedSkill = null;
    this.selectedTarget = null;
    this.render();
};

        if(this.selectedItem===itemId){

            btn.classList.add("selected");

        }

        this.itemDiv.appendChild(btn);

    }

}
}