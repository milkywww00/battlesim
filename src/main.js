import { allies } from "./data/allies.js";
import { enemies } from "./data/enemies.js";
import { BattleUI } from "./ui/BattleUI.js";
import { TurnOrderManager } from "./engine/TurnOrderManager.js";
import { BattleEngine } from "./engine/BattleEngine.js";

import { initCharacter } from "./engine/initCharacter.js";

window.addEventListener("DOMContentLoaded", () => {
const allCharacters = [...allies, ...enemies].map(initCharacter);
const turnManager = new TurnOrderManager(allCharacters);
turnManager.initOrder();
const engine = new BattleEngine(allCharacters, turnManager);
// 2️⃣ UI 생성 (맨 마지막)
const ui = new BattleUI(engine, turnManager);
});