import { HDate } from '@hebcal/core';

// Anchor moderno: Tishrei 5782 (Autumn 2021)
const BASE_UTC = Date.UTC(2021, 9, 7, 14, 41, 41, 754); // Tishrei 5782 UTC adaptada del Molad
const BASE_HEBREW_YEAR = 5782;
const BASE_INDEX = 0; // Tishrei

const TEKUFOT = ["tishrei", "tevet", "nisan", "tamuz"];

// 91d 7h 519 halakim 31 regaim (Rav Ada)
const horasPorTekufa = 91 * 24 + 7 + (519 / 1080) + (31 / (1080 * 76));
const MS_PER_TEKUFA = horasPorTekufa * 60 * 60 * 1000;

function computeTekufaUTC_RavAda(anioHebreo, tipoTekufa) {
  const t = tipoTekufa.toLowerCase();
  
  if (!TEKUFOT.includes(t)) throw new Error("Tipo de tekufa inválido");
  
  const targetIndex = TEKUFOT.indexOf(t);
  const n = (anioHebreo - BASE_HEBREW_YEAR) * 4 + (targetIndex - BASE_INDEX);

  return new Date(BASE_UTC + n * MS_PER_TEKUFA);
}

export async function getTekufaRavAda(anioHebreo, tipoTekufa) {
  const utc = computeTekufaUTC_RavAda(anioHebreo, tipoTekufa);
  return { utc };
}
