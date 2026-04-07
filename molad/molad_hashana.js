import { 
  MoladTime, toHalakim, fromHalakim, normalize,
  HALAKIM_PER_DAY, HALAKIM_PER_HOUR, HALAKIM_PER_MINUTE 
} from './base.js';
import { aplicarDejiot } from './dejiot.js';
import { HDate } from '@hebcal/core';
import process from 'node:process';

// ==========================
// CONSTANTES Y CONFIGURACIÓN
// ==========================
const SHEERIT_PESHUTA_TOTAL = toHalakim(new MoladTime(4, 8, 876));
const SHEERIT_MEUBERET_TOTAL = toHalakim(new MoladTime(5, 21, 589));
const SHEERIT_MAJZOR_TOTAL = toHalakim(new MoladTime(2, 16, 595));
const MOLAD_TOHU_TOTAL = toHalakim(new MoladTime(2, 5, 204));
const DIAS_SEMANA = ["Sábado", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

/**
 * Función para calcular los ciclos y años restantes de un año hebreo
 */
function calcularCiclos(anyo) {
  const ciclos = Math.floor((anyo - 1) / 19);
  const anyoEnCiclo = ((anyo - 1) % 19) + 1;
  let peshutot = 0, meuberot = 0;
  const inicioDelCiclo = (ciclos * 19) + 1;
  for (let y = anyo - 1; y >= inicioDelCiclo; y--) {
    if (HDate.isLeapYear(y)) meuberot++;
    else peshutot++;
  }
  return { ciclos, anyoEnCiclo, peshutot, meuberot };
}

/**
 * Función principal para obtener el Molad de Tishrei de un año
 */
export function getMoladTishrei(anyo) {
  const { ciclos, peshutot, meuberot } = calcularCiclos(anyo);
  const totalCiclos = ciclos * SHEERIT_MAJZOR_TOTAL;
  const totalPeshutot = peshutot * SHEERIT_PESHUTA_TOTAL;
  const totalMeuberot = meuberot * SHEERIT_MEUBERET_TOTAL;
  
  const moladTotal = MOLAD_TOHU_TOTAL + totalCiclos + totalPeshutot + totalMeuberot;
  const moladObj = fromHalakim(moladTotal);
  const { day: rhDay, dejiotAplicadas } = aplicarDejiot(anyo, moladObj);

  return { total: moladTotal, moladObj, rhDay, dejiotAplicadas };
}

/**
 * Caracterización del año (Jaser, Ke-Sidran, Shalem)
 */
export function caracterizarAnyo(anyo) {
  const actual = getMoladTishrei(anyo);
  const siguiente = getMoladTishrei(anyo + 1);
  const esBisiesto = HDate.isLeapYear(anyo);

  // Diferencia de días entre Rosh Hashanás
  let diasDiferencia = (siguiente.rhDay - actual.rhDay + 7) % 7;
  
  // La duración real del año
  let duracion = esBisiesto ? 384 : 354;
  if (esBisiesto) {
    if (diasDiferencia === 5) duracion = 383; // Jaser
    if (diasDiferencia === 6) duracion = 384; // Ke-Sidran
    if (diasDiferencia === 0) duracion = 385; // Shalem
  } else {
    if (diasDiferencia === 3) duracion = 353; // Jaser
    if (diasDiferencia === 4) duracion = 354; // Ke-Sidran
    if (diasDiferencia === 5) duracion = 355; // Shalem
  }

  let tipo = "Ke-Sidran (Regular)";
  if (duracion === 353 || duracion === 383) tipo = "Jaser (Deficiente)";
  if (duracion === 355 || duracion === 385) tipo = "Shalem (Completo)";

  return { duracion, tipo, actual, siguiente };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("\nUso: node molad_hashana.js <año_hebreo>");
    return;
  }
  const anyo = parseInt(args[0]);
  const info = caracterizarAnyo(anyo);

  console.log(`\n========================================`);
  console.log(`   ANÁLISIS DEL AÑO HEBREO ${anyo}`);
  console.log(`========================================`);
  console.log(`Molad Tishrei: ${DIAS_SEMANA[info.actual.moladObj.day]} a las ${info.actual.moladObj.hours}h y ${info.actual.moladObj.halakim}p`);
  if (info.actual.dejiotAplicadas.length > 0) {
    console.log(`Posposiciones: ${info.actual.dejiotAplicadas.join(", ")}`);
  }
  console.log(`Rosh Hashaná ${anyo}: ${DIAS_SEMANA[info.actual.rhDay]}`);
  
  console.log(`\nRosh Hashaná ${anyo + 1}: ${DIAS_SEMANA[info.siguiente.rhDay]}`);
  console.log(`Duración del año: ${info.duracion} días`);
  console.log(`Tipo de año: ${info.tipo}`);
  
  console.log(`\n--- ESTRUCTURA DE MESES ---`);
  let meses = ["Tishrei", "Cheshvan", "Kislev", "Tevet", "Shevat"];
  if (HDate.isLeapYear(anyo)) {
    meses.push("Adar I", "Adar II");
  } else {
    meses.push("Adar");
  }
  meses.push("Nisan", "Iyar", "Sivan", "Tamuz", "Av", "Elul");

  meses.forEach(m => {
    let dias = 30; // Predeterminado
    if (["Tevet", "Iyar", "Tamuz", "Elul"].includes(m)) dias = 29;
    if (m === "Adar") dias = 29;
    if (m === "Adar II") dias = 29;

    // Lógica de Cheshvan y Kislev según tipo de año
    if (m === "Cheshvan") {
        dias = (info.duracion === 355 || info.duracion === 385) ? 30 : 29;
    }
    if (m === "Kislev") {
        dias = (info.duracion === 353 || info.duracion === 383) ? 29 : 30;
    }

    console.log(`   - ${m.padEnd(10)}: ${dias} días`);
  });
  console.log(`----------------------------------------\n`);
}

if (process.argv[1] && process.argv[1].endsWith('molad_hashana.js')) {
  main();
}
