// ==========================
// 1. CONSTANTES
// ==========================
const HALAKIM_PER_HOUR = 1080;
const HALAKIM_PER_MINUTE = 18;
const HOURS_PER_DAY = 24;
const HALAKIM_PER_DAY = HALAKIM_PER_HOUR * HOURS_PER_DAY;

class MoladTime {
  constructor(day, hours, halakim) {
    this.day = day;
    this.hours = hours;
    this.halakim = halakim;
  }
}

// ==========================
// 2. CONVERSIÓN CIVIL ⇄ HALÁJICO
// ==========================

// civil → halájico
function civilToHalachic(hours) {
  return (hours + 6) % 24;
}

// halájico → civil
function halachicToCivil(hours) {
  return (hours - 6 + 24) % 24;
}

// ==========================
// 3. PARSER (CON MINUTOS)
// ==========================
function parseMolad(day, hours, minutes = 0, halakim = 0) {
  const halachicHours = civilToHalachic(hours);

  const totalHalakim =
    minutes * HALAKIM_PER_MINUTE + halakim;

  return normalize(new MoladTime(day, halachicHours, totalHalakim));
}

// ==========================
// 4. NORMALIZACIÓN
// ==========================
function normalize(m) {
  let halakim = m.halakim;

  let hours = m.hours + Math.floor(halakim / HALAKIM_PER_HOUR);
  halakim = halakim % HALAKIM_PER_HOUR;

  let day = m.day + Math.floor(hours / HOURS_PER_DAY);
  hours = hours % HOURS_PER_DAY;

  day = day % 7;

  return new MoladTime(day, hours, halakim);
}

// ==========================
// 5. CONVERSIONES A HALAKIM
// ==========================
function toHalakim(m) {
  return (
    m.day * HALAKIM_PER_DAY +
    m.hours * HALAKIM_PER_HOUR +
    m.halakim
  );
}

function fromHalakim(total) {
  let day = Math.floor(total / HALAKIM_PER_DAY);
  total = total % HALAKIM_PER_DAY;

  let hours = Math.floor(total / HALAKIM_PER_HOUR);
  let halakim = total % HALAKIM_PER_HOUR;

  return new MoladTime(day % 7, hours, halakim);
}

// ==========================
// 6. SHEERIT MES
// ==========================
const SHEERIT_CHODESH = new MoladTime(1, 12, 793);
const SHEERIT_TOTAL = toHalakim(SHEERIT_CHODESH);

// ==========================
// 7. AVANZAR MESES
// ==========================
function advanceMonths(molad, n) {
  let total = toHalakim(molad);
  total += n * SHEERIT_TOTAL;
  return fromHalakim(total);
}

// ==========================
// 8. FORMATEO (VOLVER A CIVIL)
// ==========================
function formatMolad(m) {
  const civilHours = halachicToCivil(m.hours);

  const minutes = Math.floor(m.halakim / HALAKIM_PER_MINUTE);
  const halakim = m.halakim % HALAKIM_PER_MINUTE;

  return {
    day: m.day,
    hours: civilHours,
    minutes,
    halakim
  };
}

// ==========================
// 9. CLI
// ==========================
const DIAS_SEMANA = [
  "Sábado", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"
];

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 5) {
    console.log("\nUso:");
    console.log("node 1.js <día> <hora_civil> <minutos> <halakim> <meses>");
    console.log("Ejemplo:");
    console.log("node 1.js 4 4 34 14 1\n");
    return;
  }

  const d = parseInt(args[0]);
  const h = parseInt(args[1]);
  const m = parseInt(args[2]);
  const p = parseInt(args[3]);
  const n = parseInt(args[4]);

  const base = parseMolad(d, h, m, p);

  console.log(`\n--- BASE (civil) ---`);
  const baseFormatted = formatMolad(base);
  console.log(
    `Molad: ${DIAS_SEMANA[base.day]} (${base.day}), ` +
    `${baseFormatted.hours}h, ${baseFormatted.minutes}m, ${baseFormatted.halakim}p`
  );

  console.log(`\nAvanzando ${n} meses...`);

  const final = advanceMonths(base, n);
  const finalFormatted = formatMolad(final);

  console.log(`\n--- RESULTADO FINAL (civil) ---`);
  console.log(
    `Molad: ${DIAS_SEMANA[final.day]} (${final.day}), ` +
    `${finalFormatted.hours}h, ${finalFormatted.minutes}m, ${finalFormatted.halakim}p`
  );

  console.log(`========================================\n`);
}

main();