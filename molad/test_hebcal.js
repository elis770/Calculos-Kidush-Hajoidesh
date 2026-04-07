import { HDate } from '@hebcal/core';

function testMonthSteps(year, monthName, n) {
  try {
    let hd = new HDate(1, monthName, year);
    console.log(`Starting: ${hd.getMonthName()} ${hd.getFullYear()}`);
    
    // Avanzar meses usando el constructor o sumando días
    // HDate no tiene un "advance months" directo, pero podemos hacerlo a mano
    for (let i = 0; i < Math.abs(n); i++) {
        let abs_hd = hd.abs();
        if (n > 0) {
            // Ir al primer día del mes siguiente
            // Hebcal: daysInMonth() es útil
            hd = new HDate(hd.daysInMonth() + 1, hd.getMonth(), hd.getFullYear());
        } else {
            // Ir al último día del mes anterior
            hd = new HDate(1, hd.getMonth(), hd.getFullYear()).prev();
            // Y luego al primer día de ese mes
            hd = new HDate(1, hd.getMonth(), hd.getFullYear());
        }
    }
    console.log(`Ending: ${hd.getMonthName()} ${hd.getFullYear()}`);
  } catch (e) {
    console.log("Error: ", e.message);
  }
}

testMonthSteps(5784, "Adar I", 1);
testMonthSteps(5784, "Adar I", -1);
testMonthSteps(5783, "Adar", 1);
testMonthSteps(5783, "Adar", -1);
