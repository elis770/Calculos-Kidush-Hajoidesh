import process from 'node:process';
import { ejecutarMolad } from './molad/molad_main.js';
import { ejecutarEstaciones } from './estaciones/estaciones_main.js';

/**
 * CALCULADORA HEBREA CENTRALIZADA
 */

async function main() {
  const args = process.argv.slice(2);
  const comando = args[0] ? args[0].toLowerCase() : null;

  if (!comando) {
    console.log("\n=========================================");
    console.log("   SISTEMA DE CÁLCULO HEBREO CENTRAL");
    console.log("=========================================");
    console.log("COMANDOS DISPONIBLES:");
    console.log("-----------------------------------------");
    console.log("1. Molad y Rosh Hashaná:");
    console.log("   node main.js molad <año> [mes] [+/-X]");
    console.log("   Ejemplo: node main.js molad 5788 Nisan");
    console.log("-----------------------------------------");
    console.log("2. Estaciones y Tekufot:");
    console.log("   node main.js estaciones <mes> [año]");
    console.log("   Ejemplo: node main.js estaciones nisan 5786");
    console.log("-----------------------------------------\n");
    return;
  }

  // Redirección de comandos
  const subArgs = args.slice(1);

  switch (comando) {
    case "molad":
    case "m":
      await ejecutarMolad(subArgs);
      break;

    case "estaciones":
    case "tekufot":
    case "e":
    case "t":
      await ejecutarEstaciones(subArgs);
      break;

    default:
      console.log(`\n❌ Error: El comando "${comando}" no existe.`);
      console.log("Usa: node main.js (sin argumentos) para ver la ayuda.");
  }
}

main();
