// ==========================
// 1. CONSTANTES
// ==========================
const HALAKIM_PER_HOUR = 1080;
const HOURS_PER_DAY = 24;

class MoladTime {
  constructor(days, hours, halakim) {
    this.days = days;
    this.hours = hours;
    this.halakim = halakim;
  }
}

// Molad Tohu (inicio del cálculo)
const MOLAD_TOHU = new MoladTime(2, 5, 204);

// Restos (Rambam cap. 6)
const SHEERIT_CHODESH = new MoladTime(1, 12, 793);
const SHEERIT_PESHUTA = new MoladTime(4, 8, 876);
const SHEERIT_MEVU = new MoladTime(5, 21, 589);
const SHEERIT_19 = new MoladTime(2, 16, 595);

// ==========================
// 2. NORMALIZACIÓN
// ==========================
function normalize(m) {
  let halakim = m.halakim;
  let hours = m.hours + Math.floor(halakim / HALAKIM_PER_HOUR);
  halakim = halakim % HALAKIM_PER_HOUR;

  let days = m.days + Math.floor(hours / HOURS_PER_DAY);
  hours = hours % HOURS_PER_DAY;

  days = days % 7;

  return new MoladTime(days, hours, halakim);
}

function addMolad(a, b) {
  return normalize(new MoladTime(
    a.days + b.days,
    a.hours + b.hours,
    a.halakim + b.halakim
  ));
}

// ==========================
// 3. AÑO BISIESTO
// ==========================
function isLeapYear(year) {
  return ((7 * year + 1) % 19) < 7;
}

// ==========================
// 4. MOLAD (RAMBAM)
// ==========================
function moladOfYear(year) {
  let cycles = Math.floor((year - 1) / 19);
  let yearInCycle = (year - 1) % 19;

  let molad = new MoladTime(
    MOLAD_TOHU.days,
    MOLAD_TOHU.hours,
    MOLAD_TOHU.halakim
  );

  // sumar ciclos completos
  for (let i = 0; i < cycles; i++) {
    molad = addMolad(molad, SHEERIT_19);
  }

  // sumar años dentro del ciclo
  for (let i = 0; i < yearInCycle; i++) {
    molad = addMolad(
      molad,
      isLeapYear(i + 1) ? SHEERIT_MEVU : SHEERIT_PESHUTA
    );
  }

  return normalize(molad);
}

// ==========================
// 5. DEJIOT (RAMBAM)
// ==========================
function applyDehiyyot(year, molad) {
  let { days: day, hours, halakim } = molad;

  const leap = isLeapYear(year);
  const prevLeap = isLeapYear(year - 1);

  // 1. Molad Zaken
  if (hours >= 18) {
    day = (day + 1) % 7;
  }

  // 2. Lo ADU Rosh
  if ([0, 3, 5].includes(day)) {
    day = (day + 1) % 7;
  }

  // 3. GaTRaD
  if (
    !leap &&
    day === 2 &&
    (hours > 9 || (hours === 9 && halakim >= 204))
  ) {
    day = (day + 2) % 7;
  }

  // 4. BeTuTaKPaT
  if (
    prevLeap &&
    day === 1 &&
    (hours > 15 || (hours === 15 && halakim >= 589))
  ) {
    day = (day + 1) % 7;
  }

  return day;
}

// ==========================
// 6. ROSH HASHANÁ
// ==========================
function roshHashanahDay(year) {
  const molad = moladOfYear(year);
  return applyDehiyyot(year, molad);
}

// ==========================
// 7. PIPELINE ASYNC
// ==========================

const DIAS_SEMANA = [
  "Sábado", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"
];

/**
 * Ejecuta el cálculo completo del Molad y Rosh Hashaná con trazado detallado.
 */
export async function getMoladPipeline(year) {
  console.log(`\n--- INICIANDO PIPELINE DE MOLAD PARA EL AÑO ${year} ---`);
  
  const leap = isLeapYear(year);
  const cycle = Math.floor((year - 1) / 19) + 1;
  const yearInCycle = ((year - 1) % 19) + 1;

  console.log(`[Trace] Ciclo: ${cycle}, Año en ciclo: ${yearInCycle} (${leap ? "Bisiesto" : "Simple"})`);

  // 1. Cálculo del Molad
  console.log(`\n--- Paso 1: Cálculo del Molad Tishrei ---`);
  const molad = moladOfYear(year);
  console.log(`[Molad] Día: ${DIAS_SEMANA[molad.days]} (${molad.days})`);
  console.log(`[Molad] Hora: ${molad.hours}, Halakim: ${molad.halakim}`);

  // 2. Aplicación de Dejiot
  console.log(`\n--- Paso 2: Aplicación de Dejiot (Pospociciones) ---`);
  const finalDay = applyDehiyyot(year, molad);
  
  if (finalDay !== molad.days) {
    const diff = (finalDay - molad.days + 7) % 7;
    console.log(`[Postergación] El Rosh Hashaná se movió ${diff} día(s).`);
  } else {
    console.log(`[Postergación] No se aplicaron postergaciones.`);
  }

  console.log(`\n--- RESULTADO FINAL ---`);
  console.log(`Rosh Hashaná ${year}: ${DIAS_SEMANA[finalDay]} (${finalDay})`);
  console.log(`========================================\n`);

  return { year, molad, finalDay };
}

// ==========================
// 8. INTERFAZ CLI
// ==========================

async function main() {
  const args = process.argv.slice(2);
  const yearInput = args[0] ? parseInt(args[0]) : null;

  if (!yearInput || isNaN(yearInput)) {
    console.log("\nUso: node molad.js <año_hebreo>");
    return;
  }

  await getMoladPipeline(yearInput);
}

// Ejecutamos la función principal
main();