# Proyecto de Cálculos del Calendario Hebreo (Molad y Tekufot)

la base de todo es el libro Kidush Hajoidesh de Maimonides Kidush Hajoidesh (capitulos 6-10)


**Molad** la aparicion de la luna cada mes y las posposiciones de Rosh Hashaná, con los calculos de sobrante en cada mes y las dejiot (empujar) condicionalmente para rosh hashana (no puede ser cada dia, tiene 4 condiciones segun la ley judia) (capitulos 6-8)
**Tekufot** la discucion entre rab shmuel y rab ada bar ahava y hacemos una conversion con el real (capitulo 9-10)

Este sistema modular permite realizar cálculos astronómicos y halájicos precisos relacionados con el calendario hebreo, unificando el estudio del **Molad** (ciclo lunar) y las **Tekufot** (estaciones/ciclos solares).

---

## 🚀 Cómo usar el sistema (Panel de Control Central)

Desde la raíz del proyecto, utiliza el archivo `main.js` para realizar todas las consultas de forma intuitiva:

### 1. Cálculos de Molad y Rosh Hashaná
Utiliza el subcomando `molad` (o simplemente `m`):

*   **Resumen del Año**: Obtén el tipo de año (Jaser, Ke-Sidran, Shalem), duración y fecha de Rosh Hashaná.
    ```bash
    node main.js molad 5788
    ```
*   **Molad de un Mes Específico**:
    ```bash
    node main.js molad 5788 Nisan
    ```
*   **Navegación Dinámica**: Avanza o retrocede meses desde un punto específico.
    ```bash
    node main.js molad 5788 Nisan +1
    ```

### 2. Cálculos de Estaciones (Tekufot)
Utiliza el subcomando `estaciones`, `tekufot`, `e` o `t`:

*   **Comparativa Completa**: Compara los cálculos de Shmuel, Ada y datos Astronómicos modernos.
    ```bash
    node main.js estaciones nisan 5786
    ```

---

## 📂 Estructura del Proyecto

### Carpeta Raíz
*   `main.js`: **Punto de mando central**. Dirige tus peticiones a los módulos de Molad o Estaciones.

### Módulo de Molad (`/molad`)
*   `base.js`: Contiene las **constantes básicas** (halakim, horas) y funciones matemáticas base (`toHalakim`, `fromHalakim`).
*   `dejiot.js`: Implementa las **4 reglas de posposición** (Dehiyyot) de Rosh Hashaná (Molad Zaken, ADU, GaTRaD, BeTuTaKPaT).
*   `molad_hashana.js`: Motor de **caracterización del año**. Determina si el año es Deficiente, Regular o Completo.
*   `molad_main.js`: Expone la lógica de cálculo mensual para ser usada por el panel central.
*   `conversores.js`: Utilidades para traducir entre el **horario civil y el horario halájico**.

### Módulo de Estaciones (`/estaciones`)
*   `estaciones_main.js`: Lógica principal para la consulta de Tekufot.
*   `comparacion.js`: Archivo encargado de **comparar las tres fuentes** (Astronomía real vs. Ada vs. Shmuel).
*   `tekufot-shmuel.js` / `tekufot-ada.js`: Implementaciones específicas de los cálculos solares tradicionales.

---

## 🛠️ Requisitos
*   **Node.js v18+**
*   Haber instalado las dependencias:
    ```bash
    npm install @hebcal/core
    ```

---
*Desarrollado para el estudio profundo de los fundamentos del calendario hebreo.*