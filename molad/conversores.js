// ==========================
// CONVERSIONES Y PARSER
// ==========================
import { HALAKIM_PER_MINUTE, MoladTime, normalize } from './calculos.js';

/**
 * civil → halájico
 */
export function civilToHalachic(hours) {
  return (hours + 6) % 24;
}

/**
 * halájico → civil
 */
export function halachicToCivil(hours) {
  return (hours - 6 + 24) % 24;
}

/**
 * PARSER (CON MINUTOS)
 * Convierte datos de entrada civil a estructura MoladTime (halájica)
 */
export function parseMolad(day, hours, minutes = 0, halakim = 0) {
  const halachicHours = civilToHalachic(hours);

  const totalHalakim =
    minutes * HALAKIM_PER_MINUTE + halakim;

  return normalize(new MoladTime(day, halachicHours, totalHalakim));
}

/**
 * FORMATEO (VOLVER A CIVIL)
 * Convierte estructura MoladTime (halájica) a objeto legible civil
 */
export function formatMolad(m) {
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
