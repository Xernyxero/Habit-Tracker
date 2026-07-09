# 🕹️ Habit Tracker Pro (Gamificado & Modular)

¡Bienvenido a **Habit Tracker Pro**! Este es un gestor de hábitos e historial de progreso diseñado bajo principios de gamificación. No solo registra lo que haces, sino que calcula tu consistencia mediante un sistema de **Puntos de Esfuerzo** y te guía a través de una **Hoja de Ruta (Roadmap)** interactiva donde desbloqueas recompensas reales a medida que mantienes tus rachas.

El proyecto está construido con **HTML5, CSS3 nativo y JavaScript moderno (ES6+)**, organizado bajo una arquitectura limpia y modular sin dependencias externas.

---

## 🚀 Características Principales

* **Días en Stand-by:** El día actual no te penaliza con un "Fallo" por defecto a primera hora de la mañana. Se queda en espera neutra hasta que acabe el día o registres tu logro.
* **Viaje en el Tiempo:** ¿Olvidaste apuntar lo que hiciste ayer o anteayer? El panel de control diario incluye flechas de navegación (`<` y `>`) para moverte por el historial.
* **Seguridad Histórica:** No puedes registrar hábitos en días previos a su fecha de creación real (los días anteriores se bloquean con un candado `🔒`).
* **Carrusel de Hojas de Ruta:** En lugar de saturar la pantalla, el sistema unifica las Hojas de Ruta en una única tarjeta dinámica que puedes pasar con controles táctiles/clic.
* **Diseño Serpiente (Flex-wrap):** El mapa de recompensas se adapta al ancho de cualquier pantalla y fluye hacia abajo de forma natural, evitando barras de scroll incómodas.

---

## 📂 Estructura del Proyecto

El código está completamente modularizado para facilitar su lectura y mantenimiento:

```text
mi-habit-tracker/
├── css/
│   ├── variables.css      # Paleta de colores, fuentes y diseño base
│   ├── layout.css         # Estructura del contenedor principal y botones
│   ├── today-panel.css    # Sección superior de control diario y tiempo
│   ├── matrix.css         # Cuadrícula e historial de estados (Éxito, Fallo, Comodín)
│   ├── roadmap.css        # El camino de recompensas y bocadillos emergentes
│   └── modal.css          # Ventana emergente para la creación de objetivos
├── js/
│   ├── dateUtils.js       # Helper para matemáticas de fechas y desfases temporales
│   ├── storage.js         # Abstracción para la persistencia en LocalStorage
│   ├── roadmap.js         # Renderizador lógico de nodos y banderas de premios
│   └── main.js            # Cerebro de la aplicación, control de eventos y DOM
└── index.html             # Estructura HTML limpia y punto de entrada modular