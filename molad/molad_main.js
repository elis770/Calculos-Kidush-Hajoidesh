import { getMoladTishrei, caracterizarAnyo } from './molad_hashana.js';
import { fromHalakim, HALAKIM_PER_MINUTE, HALAKIM_PER_DAY, HALAKIM_PER_HOUR } from './base.js';
import { HDate } from '@hebcal/core';

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
  return { civilDay, jewishDay: m.day, hours: civilHours, minutes, halakim, moladHalajico: m };
}

export async function ejecutarMolad(args) {
  if (args.length < 1) {
    console.log("\nUso Molad: node main.js molad <año> [mes] [offset]");
    return;
  }

  const anyo = parseInt(args[0]);
  const mesDestino = args[1];
  const offset = args[2] ? parseInt(args[2]) : 0;

  if (!mesDestino) {
    const info = caracterizarAnyo(anyo);
    const fTishrei = formatMoladCivil(info.actual.total);
    console.log(`\n--- RESUMEN AÑO ${anyo} ---`);
    console.log(`Molad Tishrei: ${DIAS_SEMANA[fTishrei.civilDay]} noche para ${DIAS_SEMANA[fTishrei.jewishDay]}, ${fTishrei.hours}:${fTishrei.minutes.toString().padStart(2, '0')}`);
    console.log(`ROSH HASHANÁ: ${DIAS_SEMANA[info.actual.rhDay]} (Duración: ${info.duracion} días)`);
    console.log(`--------------------------\n`);
    return;
  }

  const infoTishrei = getMoladTishrei(anyo);
  let hd = new HDate(1, "Tishrei", anyo);
  let mesesDesdeTishrei = 0;

  while (hd.getMonthName().toLowerCase() !== mesDestino.toLowerCase() && mesesDesdeTishrei < 14) {
    hd = new HDate(hd.daysInMonth() + 1, hd.getMonth(), hd.getFullYear());
    mesesDesdeTishrei++;
  }

  if (offset !== 0) {
    const direccion = offset > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(offset); i++) {
        hd = new HDate(direccion > 0 ? (hd.daysInMonth() + 1) : -1, hd.getMonth(), hd.getFullYear());
    }
  }

  const f = formatMoladCivil(infoTishrei.total + ((mesesDesdeTishrei + offset) * SHEERIT_CHODESH_TOTAL));
  const rj = new HDate(1, hd.getMonth(), hd.getFullYear());
  
  console.log(`\n--- MOLAD: ${hd.getMonthName()} ${hd.getFullYear()} ---`);
  console.log(`Día: ${DIAS_SEMANA[f.civilDay]} noche para ${DIAS_SEMANA[f.jewishDay]}, ${f.hours}:${f.minutes.toString().padStart(2, '0')}`);
  console.log(`Rosh Jodesh: ${rj.greg().toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'})}`);
  console.log(`--------------------------\n`);
}
