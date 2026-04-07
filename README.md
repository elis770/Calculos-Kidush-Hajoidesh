# 📜 Cálculos de Kidush Hajoidesh
Este proyecto es una herramienta de estudio y cálculo sobre las **Tekufot** (estaciones del año) y el **Molad** (nacimiento de la luna) según la tradición judía, permitiendo comparar los cálculos tradicionales con los datos astronómicos reales modernos.

la base de todo es el libro Kidush Hajoidesh de Maimonides Kidush Hajoidesh donde te encontraras 

**Tekufot** la discucion entre rab shmuel y rab ada bar ahava y hacemos una conversion con el real

**Molad** la aparicion de la luna cada mes y las posposiciones de Rosh Hashaná, con los calculos de sobrante en cada mes y las dejiot (empujar) condicionalmente para rosh hashana (no puede ser cada dia, tiene 4 condiciones segun la ley judia)

---

## 🚀 Inicialización

Para poner en marcha el proyecto, asegúrate de tener [Node.js](https://nodejs.org/) instalado y sigue estos pasos:

1. **Clonar el repositorio** (o descargar los archivos).
2. **Instalar dependencias**:
   ```bash
   npm install
   ```

---

## 🛠️ Uso del Comparador Principal

El núcleo del proyecto actualmente permite comparar las dos grandes opiniones sobre las estaciones (**Shmuel** y **Rav Ada**) frente al **Punto Astronómico Real** (Equinoccios y Solsticios calculados con algoritmos de alta precisión).

### Ejecución
El punto de entrada es `main.js`. Debes pasarle el nombre del mes hebreo y opcionalmente el año.

```bash
node main.js <mes_hebreo> [año_hebreo]
```

#### Ejemplos:
*   **Para un mes que inicia estación:**
    ```bash
    node main.js nisan 5786
    ```
*   **Para un mes intermedio** (el sistema detectará que no inicia estación y te mostrará los dos puntos más cercanos):
    ```bash
    node main.js iyar 5786
    ```

---

## 📊 ¿Qué devuelve el programa?

Al ejecutar el comando, obtendrás un reporte detallado que incluye:

1.  **[SHMUEL]**: El cálculo basado en el año solar de 365.25 días. Verás la fecha y hora en Israel y su desviación respecto al cielo real (generalmente entre 17 y 19 días en nuestra época).
2.  **[RAV ADA]**: El cálculo basado en el ciclo promedio de 19 años. Verás su fecha corregida y su desviación.
3.  **[REAL]**: El momento astronómico exacto (Equinoccio/Solsticio) calculado científicamente para ese año.

---

## 🏗️ Estado del Proyecto

*   ✅ **Comparación de Estaciones**: Terminado y funcional (Shmuel vs Rav Ada vs Real).
*   🚧 **Módulo Molad**: En desarrollo. Actualmente en `molad.js` y `1.js` se están implementando las funciones para calcular la aparición de la luna y las posposiciones (*Dejiot*) de Rosh Hashaná.

---

## 🌍 Tecnologías
*   **JavaScript (ESM)**
*   **Node.js**
*   **Astronomy-Engine**: Para cálculos astronómicos precisos.
*   **Hebcal Core**: Para manejo de fechas hebreas.

---