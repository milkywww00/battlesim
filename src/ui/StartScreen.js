import { allies } from "../data/allies.js";
import { enemies } from "../data/enemies.js";

import { initCharacter } from "../engine/initCharacter.js";
import { TurnOrderManager } from "../engine/TurnOrderManager.js";
import { BattleEngine } from "../engine/BattleEngine.js";
import { BattleUI } from "./BattleUI.js";

export class StartScreen {

    constructor(){

        this.render();

    }

    render(){

        const app = document.getElementById("app");

        app.innerHTML = `
        <div class="startScreen">
            <div class="startHeader">
                <div>
                    <p class="eyebrow">Turn-based battle playground</p>
                    <h1 class="title">Battle Simulator</h1>
                    <p class="subtitle">아군과 적군을 선택해 전투를 시작하세요.</p>
                </div>
            </div>

            <div class="selectionGrid">
                <section class="selectSection">
                    <h2>🟦 아군 선택</h2>
                    <div id="allyList"></div>
                </section>

                <section class="selectSection">
                    <h2>🟥 적 선택</h2>
                    <div id="enemyList"></div>
                </section>
            </div>

            <div id="selectionSummary" class="selectionSummary pending"></div>

            <div class="startActions">
                <button id="startBattle" class="startButton" disabled>
                    전투 시작
                </button>
            </div>
        </div>
        `;

        this.renderCharacters();

    }

    renderCharacters(){

        const allyDiv = document.getElementById("allyList");
        const enemyDiv = document.getElementById("enemyList");

        allyDiv.innerHTML = "";
        enemyDiv.innerHTML = "";

        allies.forEach(c=>{

            allyDiv.innerHTML += `
                <label class="optionCard">
                    <input type="checkbox" value="${c.id}">
                    <span>${c.name}</span>
                </label>
            `;
        });

        enemies.forEach(c=>{

            enemyDiv.innerHTML += `
                <label class="optionCard">
                    <input type="checkbox" value="${c.id}">
                    <span>${c.name}</span>
                </label>
            `;
        });

        allyDiv.querySelectorAll("input").forEach(input => {
            input.addEventListener("change", () => this.updateSelectionSummary());
        });

        enemyDiv.querySelectorAll("input").forEach(input => {
            input.addEventListener("change", () => this.updateSelectionSummary());
        });

        this.updateSelectionSummary();

        document
            .getElementById("startBattle")
            .onclick=()=>this.startBattle();

    }

    updateSelectionSummary(){
        const allyCount = document.querySelectorAll("#allyList input:checked").length;
        const enemyCount = document.querySelectorAll("#enemyList input:checked").length;
        const summary = document.getElementById("selectionSummary");
        const startBtn = document.getElementById("startBattle");

        if (!summary || !startBtn) return;

        const ready = allyCount > 0 && enemyCount > 0 && allyCount + enemyCount >= 2;
        summary.className = `selectionSummary ${ready ? "ready" : "pending"}`;
        startBtn.disabled = !ready;

        if (!ready) {
            summary.innerHTML = `<div class="summaryTitle">선택 현황</div>아군 ${allyCount}명 · 적 ${enemyCount}명<br>최소 2명 이상 선택하면 전투를 시작할 수 있습니다.`;
            return;
        }

        summary.innerHTML = `<div class="summaryTitle">전투 준비 완료</div>아군 ${allyCount}명 · 적 ${enemyCount}명<br>좋습니다. 전투를 시작해볼까요?`;
    }

    startBattle(){

        const allyIds=[
            ...document.querySelectorAll("#allyList input:checked")
        ].map(i=>i.value);

        const enemyIds=[
            ...document.querySelectorAll("#enemyList input:checked")
        ].map(i=>i.value);

        const selected=[
            ...allies.filter(c=>allyIds.includes(c.id)),
            ...enemies.filter(c=>enemyIds.includes(c.id))
        ].map(initCharacter);

        if(selected.length<2){

            alert("최소 2명을 선택하세요.");

            return;

        }

        const turnManager=new TurnOrderManager(selected);

        turnManager.initOrder();

        const engine=new BattleEngine(selected,turnManager);

        document.getElementById("app").innerHTML="";

        new BattleUI(engine,turnManager);

    }
showResult(logs) {

  const winner = logs.find(l => l.includes("승리"));

  if (!winner) return;

  const btn = document.createElement("button");

  btn.innerText = "다시 선택";

  btn.onclick = () => {

    new StartScreen();

  };

  document.getElementById("log").appendChild(document.createElement("br"));
  document.getElementById("log").appendChild(btn);
}    

}
