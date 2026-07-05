export function evaluateFormula(formula, context) {
  try {
    const dice = (n) => Math.floor(Math.random() * (Number(n) + 1));

    const fn = new Function(
      "dice",
      ...Object.keys(context),
      `return ${formula};`
    );

    return fn(dice, ...Object.values(context));
  } catch (e) {
    console.error("Formula error:", formula, context);
    return 0;
  }
}