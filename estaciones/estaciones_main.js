import { realizarComparativaCompleta } from './comparacion.js';
import { HDate } from '@hebcal/core';

export async function ejecutarEstaciones(args) {
  const mesInput = args[0];
  const anioInput = args[1] ? parseInt(args[1]) : new HDate(new Date()).getFullYear();

  if (!mesInput) {
    console.log("\nUso Estaciones: node main.js estaciones <mes_hebreo> [año_hebreo]");
    return;
  }

  try {
    await realizarComparativaCompleta(mesInput, anioInput);
    console.log("\n==================================================\n");
  } catch (err) {
    console.error(`\n❌ ERROR: ${err.message}\n`);
  }
}

// Para compatibilidad directa
if (import.meta.url === `file://${process.argv[1]}`) {
  ejecutarEstaciones(process.argv.slice(2));
}
