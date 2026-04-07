import { getMoladTishrei } from '../molad_hashana.js';
import { HDate } from '@hebcal/core';
import process from 'node:process';
import { 
  MoladTime, toHalakim, fromHalakim, normalize,
  HALAKIM_PER_DAY, HALAKIM_PER_HOUR, HALAKIM_PER_MINUTE 
} from './base.js';
import { aplicarDejiot } from './dejiot.js';

// ==========================
// LÓGICA DINÁMICA POR MES
// ==========================
const SHEERIT_CHODESH_TOTAL = 1 * HALAKIM_PER_DAY + 12 * HALAKIM_PER_HOUR + 793;
const DIAS_SEMANA = ["Sábado", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

function formatMoladCivil(total) {
  const m = fromHalakim(total);
  let civilHours = m.hours - 6;
  let civilDay = m.day;
  if (civilHours < 0) {
    civilHours += 24;
    civilDay = (civilDay - 1 + 7) % 7;
  }
  const minutes = Math.floor(m.halakim / HALAKIM_PER_MINUTE);
  const halakim = m.halakim % HALAKIM_PER_MINUTE;
  return { day: civilDay, hours: civilHours, minutes, halakim, moladHalajico: m };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("\nUso: node calculos.js <año> <mes> [offset]");
    console.log("Ejemplo: node calculos.js 5788 Tishrei\n");
    return;
  }

  const anyo = parseInt(args[0]);
  const mesDestino = args[1];
  const offset = args[2] ? parseInt(args[2]) : 0;

  const infoTishrei = getMoladTishrei(anyo);
  let hd = new HDate(1, "Tishrei", anyo);
  let mesesDesdeTishrei = 0;

  while (hd.getMonthName().toLowerCase() !== mesDestino.toLowerCase() && mesesDesdeTishrei < 14) {
    hd = new HDate(hd.daysInMonth() + 1, hd.getMonth(), hd.getFullYear());
    mesesDesdeTishrei++;
  }

  if (mesesDesdeTishrei >= 14) {
    console.log(`Error: No se encontró el mes ${mesDestino} en el año ${anyo}.`);
    return;
  }

  const totalMesesAvanzar = mesesDesdeTishrei + offset;
  const moladFinalTotal = infoTishrei.total + (totalMesesAvanzar * SHEERIT_CHODESH_TOTAL);
  const f = formatMoladCivil(moladFinalTotal);

  console.log(`\n--- RESULTADO PARA: ${hd.getMonthName()} de ${hd.getFullYear()} ---`);
  console.log(`Base: Molad Tishrei ${anyo}`);
  console.log(`Molad (Civil): ${DIAS_SEMANA[f.day]} (${f.day}), ${f.hours}:${f.minutes.toString().padStart(2, '0')} y ${f.halakim}p`);
  
  // SI ES TISHREI, APLICAMOS LAS DEJIOT PARA ROSH HASHANÁ
  if (hd.getMonthName() === "Tishrei" && offset === 0) {
    const { day: rhDay, dejiotAplicadas } = aplicarDejiot(anyo, f.moladHalajico);
    console.log(`\n--- ROSH HASHANÁ ${anyo} ---`);
    if (dejiotAplicadas.length > 0) {
        console.log(`Pospociciones aplicadas:`);
        dejiotAplicadas.forEach(d => console.log(`   - ${d}`));
    }
    console.log(`Día definitivo: ${DIAS_SEMANA[rhDay]} (${rhDay})`);
  }
  
  console.log(`----------------------------------------\n`);
}

if (process.argv[1] && process.argv[1].endsWith('calculos.js')) {
  main();
}