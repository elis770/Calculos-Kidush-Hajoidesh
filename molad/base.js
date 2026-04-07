// ==========================
// BASE MATEMÁTICA Y TIPOS
// ==========================

export const HALAKIM_PER_HOUR = 1080;
export const HALAKIM_PER_MINUTE = 18;
export const HOURS_PER_DAY = 24;
export const HALAKIM_PER_DAY = HALAKIM_PER_HOUR * HOURS_PER_DAY;

export class MoladTime {
  constructor(day, hours, halakim) {
    this.day = day;
    this.hours = hours;
    this.halakim = halakim;
  }
}

export function normalize(m) {
  let halakim = m.halakim;
  let hours = m.hours + Math.floor(halakim / HALAKIM_PER_HOUR);
  halakim = halakim % HALAKIM_PER_HOUR;
  let day = m.day + Math.floor(hours / HOURS_PER_DAY);
  hours = hours % HOURS_PER_DAY;
  return new MoladTime(day % 7, hours, halakim);
}

export function toHalakim(m) {
  return (m.day * HALAKIM_PER_DAY) + (m.hours * HALAKIM_PER_HOUR) + m.halakim;
}

export function fromHalakim(total) {
  const WEEK_HALAKIM = HALAKIM_PER_DAY * 7;
  let normalizedTotal = ((total % WEEK_HALAKIM) + WEEK_HALAKIM) % WEEK_HALAKIM;
  let day = Math.floor(normalizedTotal / HALAKIM_PER_DAY);
  let remainder = normalizedTotal % HALAKIM_PER_DAY;
  let hours = Math.floor(remainder / HALAKIM_PER_HOUR);
  let halakim = remainder % HALAKIM_PER_HOUR;
  return new MoladTime(day, hours, halakim);
}
