# 🕹️ Habit Monk 🧘

> 🚀 **Despliegue en vivo:** ¡Prueba la aplicación ya mismo en [Netlify] (https://habitmonk.netlify.app/)!

¡Bienvenido a **Habit Monk**! Este es un gestor de hábitos e historial de progreso diseñado bajo principios de gamificación. No solo registra lo que haces, sino que calcula tu consistencia mediante un sistema de **Puntos de Esfuerzo** y te guía a través de una **Hoja de Ruta (Roadmap)** interactiva donde desbloqueas recompensas reales a medida que mantienes tus rachas.

---

## 🤖 Autoría, Créditos y Co-creación (IA)

> 💡 **Nota del Autor:** La totalidad del código fuente de esta aplicación (estructurado en HTML5, CSS3 modular y la lógica de negocio en JavaScript ES6+) ha sido generada utilizando el modelo de lenguaje avanzado **Gemini de Google**. 
> 
> Sin embargo, el verdadero mérito y valor de este desarrollo radica en el proceso de **dirección, diseño conceptual e ingeniería de instrucciones (prompting)**. Mi rol como autor ha sido el de guiar meticulosamente a la Inteligencia Artificial en todo momento: definiendo las reglas de negocio (como el estado *stand-by* diario o las penalizaciones), estructurando la arquitectura limpia por módulos, detectando y refinando bugs, y pivotando el diseño de la interfaz hasta alcanzar exactamente el código y la experiencia de usuario deseados.

Este proyecto es un testimonio real de cómo la IA, bajo una dirección humana clara y estratégica, puede actuar como el copiloto técnico definitivo para transformar una idea en un software funcional y ordenado.

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