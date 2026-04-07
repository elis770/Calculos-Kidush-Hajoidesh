import { realizarComparativaCompleta } from './comparacion.js';
import { HDate } from '@hebcal/core';

async function main() {
  const args = process.argv.slice(2);
  const mesInput = args[0];
  
  // Usar el año hebreo actual si no se proporciona uno
  const anioInput = args[1] ? parseInt(args[1]) : new HDate(new Date()).getFullYear();

  if (!mesInput) {
    console.log("\nUso: node main.js <mes_hebreo> [año_hebreo]");
    console.log("Ejemplo: node main.js nisan 5786\n");
    return;
  }

  try {
    await realizarComparativaCompleta(mesInput, anioInput);
    console.log("\n==================================================\n");
  } catch (err) {
    console.error(`\n❌ ERROR: ${err.message}\n`);
  }
}

main();
