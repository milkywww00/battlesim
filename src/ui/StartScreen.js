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
        
        <h1>Battle Simulator</h1>

        <h2>아군 선택</h2>

        <div id="allyList"></div>

        <h2>적 선택</h2>

        <div id="enemyList"></div>

        <br>

        <button id="startBattle">
            전투 시작
        </button>

        `;

        this.renderCharacters();

    }

    renderCharacters(){

        const allyDiv = document.getElementById("allyList");
        const enemyDiv = document.getElementById("enemyList");

        allies.forEach(c=>{

            allyDiv.innerHTML+=`
                <label>
                    <input type="checkbox" value="${c.id}">
                    ${c.name}
                </label><br>
            `;
        });

        enemies.forEach(c=>{

            enemyDiv.innerHTML+=`
                <label>
                    <input type="checkbox" value="${c.id}">
                    ${c.name}
                </label><br>
            `;
        });

        document
            .getElementById("startBattle")
            .onclick=()=>this.startBattle();

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
