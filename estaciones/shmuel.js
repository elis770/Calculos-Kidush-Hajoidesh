import { HDate } from '@hebcal/core';

// Anchor moderno: Tishrei 5782 (Autumn 2021)
const BASE_UTC = Date.UTC(2021, 9, 7, 15, 0); 
const BASE_HEBREW_YEAR = 5782;
const BASE_INDEX = 0; // Tishrei

// El orden lógico del año hebreo (empieza en Tishrei)
const TEKUFOT = ["tishrei", "tevet", "nisan", "tamuz"];

const MS_PER_TEKUFA = (91 * 24 + 7.5) * 60 * 60 * 1000;

function computeTekufaUTC(anioHebreo, tipoTekufa) {
  const t = tipoTekufa.toLowerCase();
  if (!TEKUFOT.includes(t)) throw new Error("Mes inválido");
  
  const targetIndex = TEKUFOT.indexOf(t);
  const n = (anioHebreo - BASE_HEBREW_YEAR) * 4 + (targetIndex - BASE_INDEX);

  return new Date(BASE_UTC + n * MS_PER_TEKUFA);
}

export async function getTekufa(anioHebreo, tipoTekufa) {
  const utc = computeTekufaUTC(anioHebreo, tipoTekufa);
  return { utc };
}
