import { HDate } from '@hebcal/core';

/**
 * REGLAS DE DEJIOT (POSPOSICIONES)
 * Según el Rambam y la tradición halájica.
 * 
 * Índices en este proyecto:
 * 0: Sábado, 1: Domingo (A), 2: Lunes (B), 3: Martes (G), 4: Miércoles (D), 5: Jueves (H), 6: Viernes (V)
 */

export function aplicarDejiot(anyo, molad) {
  const moladOriginalDay = molad.day;
  const { hours, halakim } = molad;
  let day = moladOriginalDay;
  let dejiotAplicadas = [];

  const esBisiesto = HDate.isLeapYear(anyo);
  const anteriorFueBisiesto = HDate.isLeapYear(anyo - 1);

  // --- REGLA 1: Molad Zaken ---
  if (hours >= 18) {
    day = (day + 1) % 7;
    dejiotAplicadas.push("Molad Zaken (Molad después del mediodía)");
  }

  // --- REGLA 3: GaTRaD ---
  // IMPORTANTE: Basado en el día del MOLAD original
  if (!esBisiesto && moladOriginalDay === 3) {
    if (hours > 9 || (hours === 9 && halakim >= 204)) {
      day = (day + 2) % 7; // Mueve de Martes a Jueves
      dejiotAplicadas.push("GaTRaD (Año simple, Molad Martes >= 9h 204p)");
    }
  }

  // --- REGLA 4: BeTuTaKPaT ---
  // IMPORTANTE: Basado en el día del MOLAD original
  if (anteriorFueBisiesto && moladOriginalDay === 2) {
    if (hours > 15 || (hours === 15 && halakim >= 589)) {
      day = (day + 1) % 7; // Mueve de Lunes a Martes
      dejiotAplicadas.push("BeTuTaKPaT (Post-bisiesto, Molad Lunes >= 15h 589p)");
    }
  }

  // --- REGLA 2: Lo ADU Rosh ---
  // Se aplica al final sobre el día resultante
  if ([1, 4, 6].includes(day)) {
    day = (day + 1) % 7;
    dejiotAplicadas.push("Lo ADU Rosh (Día prohibido: Domingo, Miércoles o Viernes)");
    
    // Si al moverlo por ADU cae en otro día prohibido, se vuelve a mover
    if ([1, 4, 6].includes(day)) {
        day = (day + 1) % 7;
    }
  }

  return { day, dejiotAplicadas };
}
