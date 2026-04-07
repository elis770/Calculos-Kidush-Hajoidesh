import { getTekufa } from './shmuel.js';
import { getTekufaRavAda } from './ada.js';
import { Seasons } from 'astronomy-engine';

// ==========================
// CONFIGURACIÓN DE MESES
// ==========================

export const MESES_HEBREOS = {
  "nisan": ["nisan"],
  "iyar": ["nisan", "tamuz"],
  "sivan": ["nisan", "tamuz"],
  "tamuz": ["tamuz"],
  "av": ["tamuz", "tishrei"],
  "elul": ["tamuz", "tishrei"],
  "tishrei": ["tishrei"],
  "cheshvan": ["tishrei", "tevet"],
  "kislev": ["tishrei", "tevet"],
  "tevet": ["tevet"],
  "shevat": ["tevet", "nisan"],
  "adar": ["tevet", "nisan"],
  "adar1": ["tevet", "nisan"],
  "adar2": ["tevet", "nisan"]
};

// ==========================
// LÓGICA DE COMPARACIÓN
// ==========================

async function obtenerDatosTekufa(anio, mesTekufa) {
  const m = mesTekufa.toLowerCase();
  const shmuelResult = await getTekufa(anio, m);
  const shmuelDate = shmuelResult.utc;
  
  const adaResult = await getTekufaRavAda(anio, m);
  const adaDate = adaResult.utc;

  const anioRef = shmuelDate.getUTCFullYear();
  let astro;
  
  switch (m) {
    case "nisan": astro = Seasons(anioRef).mar_equinox.date; break;
    case "tamuz": astro = Seasons(anioRef).jun_solstice.date; break;
    case "tishrei": astro = Seasons(anioRef).sep_equinox.date; break;
    case "tevet": astro = Seasons(anioRef - 1).dec_solstice.date; break;
  }

  return { mes: m, shmuel: shmuelDate, ada: adaDate, astro: astro };
}

function imprimirReporte(res) {
  console.log(`\n==================================================`);
  console.log(`  DATOS DE LA TEKUFA: ${res.mes.toUpperCase()}`);
  console.log(`==================================================`);

  const fmt = (d) => new Intl.DateTimeFormat("es-IL", {
    timeZone: "Asia/Jerusalem", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).format(d) + " (Israel)";

  const diff = (t, b) => {
    const dMs = t - b;
    const dH = dMs / (1000 * 60 * 60);
    const sign = dMs >= 0 ? "+" : "-";
    const d = Math.floor(Math.abs(dH) / 24);
    const h = Math.floor(Math.abs(dH) % 24);
    const m = Math.floor((Math.abs(dH) * 60) % 60);
    return `${sign}${d}d ${h}h ${m}m respecto al cielo`;
  };

  console.log(`[SHMUEL]  ${fmt(res.shmuel)} | ${diff(res.shmuel, res.astro)}`);
  console.log(`[RAV ADA] ${fmt(res.ada)} | ${diff(res.ada, res.astro)}`);
  console.log(`[REAL]    ${fmt(res.astro)} | Punto exacto`);
}

/**
 * Función principal que orquestará la comparación según el mes hebreo.
 */
export async function realizarComparativaCompleta(mesInput, anioInput) {
  const m = mesInput.toLowerCase();
  
  if (!MESES_HEBREOS[m]) {
    throw new Error(`El mes '${mesInput}' no es un mes hebreo válido.`);
  }

  const tekufotTarget = MESES_HEBREOS[m];

  console.log(`\n--- INICIANDO COMPARACIÓN PARA: ${m.toUpperCase()} ${anioInput} ---`);
  
  if (tekufotTarget.length > 1) {
    console.log(`Nota: El mes ${m} no inicia estación. Mostrando adyacentes.`);
  }

  for (const t of tekufotTarget) {
    const data = await obtenerDatosTekufa(anioInput, t);
    imprimirReporte(data);
  }
}
