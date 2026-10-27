# Búnker Engine – Probabilistic Pattern Analytics & Google AI Studio API

Búnker Engine es un entorno experimental para la evaluación de patrones estocásticos, distribución de frecuencias y transición de estados en secuencias numéricas pseudoaleatorias. El proyecto está orientado a la investigación de modelos probabilísticos, análisis de series temporales y validación estadística mediante cadenas de Markov, simulación Monte Carlo y estudio de matrices de transición.

La plataforma se diseñó como una base técnica para pruebas comparativas entre modelos predictivos, análisis de anomalías y apoyo de IA para la identificación de tendencias y cambios estructurales. No está concebida como una herramienta de apuestas ni como un sistema de predicción de sorteos, sino como un laboratorio analítico para la modelización estadística y la auditoría probabilística.

## Autor y metadatos

- Autor/Analista: Enrique Ángel Sierra Ruiz
- Stack base: GNU/Linux (Kali, Debian, antiX), Bash Scripting, Python, Git/GitHub, Vercel
- Marcos y estándares: NIST CSF, OWASP, ISO 27001
- Fecha de referencia: Octubre 2026

## Resumen ejecutivo

Búnker Engine funciona como un entorno de pruebas para la evaluación de dinámicas probabilísticas en secuencias numéricas. Permite analizar frecuencia, dependencia entre eventos, rendimientos esperados y señalética de patrones recurrentes, así como reforzar la detección de anomalías mediante integración con Google AI Studio / Gemini API.

La intención principal del proyecto es validar la eficiencia de modelos probabilísticos frente a secuencias pseudoaleatorias, permitiendo comparar resultados con enfoques estadísticos tradicionales y con apoyo de IA para observación de tendencias y desviaciones.

## Arquitectura del sistema

### 1) Módulo de procesamiento de datos
- Python / Pandas / NumPy para preparación, normalización y análisis exploratorio
- Carga y validación de series temporales y matrices de transición
- Estructuración de secuencias para comparación entre historias, ventanas temporales y eventos discretos

### 2) Motor de probabilidad
- Cadenas de Markov para modelado de estados y transiciones
- Análisis frecuencial y distribución marginal
- Modelos de probabilidad condicional y evaluación de dependencia secuencial
- Simulación Monte Carlo para exploración de escenarios y sensibilidad estadística

### 3) Integración IA
- Google AI Studio / Gemini API para análisis de tendencias, anomalías y validación semántica
- Generación de insights técnicos a partir de resultados y matrices de transición
- Apoyo a la investigación de patrones complejos en datos estocásticos

### 4) Persistencia y despliegue
- Vercel para despliegue web y entorno de demostración
- Git/GitHub para control de versiones, trazabilidad y documentación técnica
- Variables de entorno para configuración segura y segmentación de credenciales

## Casos de uso y flujo de trabajo

### Identificación
- Determinar si una secuencia presenta dependencia temporal o comportamiento esencialmente aleatorio
- Evaluar frecuencias absolutas y relativas por estado o categoría
- Explorar patrones de persistencia y cambio de régimen

### Análisis de impacto
- Cuantificar la sensibilidad de la secuencia a cambios de contexto o condiciones previas
- Medir la contribución de cada estado a la probabilidad global observada
- Evaluar la estabilidad del sistema en ventanas de tiempo consecutivas

### Contención
- Aislar eventos anómalos o patrones no esperados dentro del flujo analítico
- Establecer umbrales de alerta y verificar desviaciones respecto a la línea base
- Revisar posibles fuentes de ruido, recalibración o sesgos de datos

### Erradicación
- Corregir derivaciones, normalización indebida o consolidación errónea de registros
- Ajustar parámetros del modelo probabilístico cuando la transición observada es artificial o inconsistente
- Documentar cambios de configuración para mantener trazabilidad operativa

### Métricas probabilísticas
- Probabilidad de transición entre estados
- Frecuencia observada vs frecuencia esperada
- Estabilidad del patrón a corto y largo plazo
- Coeficiente de autocorrelación y señales de deriva temporal

## Requisitos y configuración de entorno

Este repositorio utiliza variables de entorno para servicios externos, especialmente la API de Google AI Studio / Gemini.

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Actualiza el valor de la clave:

```dotenv
GEMINI_API_KEY=tu_clave_aqui
APP_URL=http://localhost:3000
```

3. Instala dependencias:

```bash
npm install
```

4. Ejecuta la aplicación localmente:

```bash
npm run dev
```

Nota: Nunca subas un archivo `.env` al repositorio. Se recomienda mantener la configuración sensible fuera del control de versiones.

## Sanitización y seguridad

Se aplicó una política de saneamiento y control de información sensible:

- Se mantuvieron rutas relativas o convencionales del sistema (`~/`, `/var/log/`, `/etc/`) en lugar de rutas absolutas locales del desarrollador
- Se evitó la exposición de IPs privadas o reales, sustituyéndolas por rangos genéricos o localhost cuando se requiere referencia de red
- No se almacenan credenciales reales ni tokens en el repositorio
- La única plantilla de entorno disponible es `.env.example`, con la variable `GEMINI_API_KEY` sin valores de producción

## Playbook / lecciones aprendidas

### Lecciones aprendidas
- Una tendencia visual no implica causalidad; la validación debe basarse en métricas estadísticas y transiciones observadas
- El análisis frecuencial debe acompañarse siempre de validación temporal para evitar sesgos de sobremuestreo
- La integración de modelos de IA debe servir como apoyo analítico, no como sustituto del rigor probabilístico
- La trazabilidad y la documentación técnica son esenciales para auditorías y reutilización del conocimiento

### Post-mortem orientado a infraestructura
- Revisar fuentes de datos para detectar ruido, sesgos de normalización o errores de codificación
- Validar la coherencia de la secuencia antes de entrenar o comparar modelos
- Mantener una configuración segura de entorno y evitar credenciales persistentes en el código
- Documentar suposiciones, supuestos de estado y definiciones de transición para cada experimento

## Estructura sugerida del proyecto

```text
.
├── .env.example
├── .gitignore
├── App.tsx
├── package.json
├── server.ts
├── services/
├── components/
├── utils/
├── README.md
└── metadata.json
```

## Nota de posicionamiento

El repositorio se presenta como un proyecto técnico de investigación y análisis probabilístico, orientado a la validación experimental de modelos estocásticos, teoría de cadenas de Markov y simulación numérica. Su propósito principal es la comparación de comportamiento probabilístico frente a secuencias pseudoaleatorias y la integración de asistencia de IA para la detección de tendencias en un entorno de análisis estadístico rigoroso.

Este repositorio está listo para ser presentado en entornos profesionales de ciberseguridad, SecOps, análisis de sistemas, documentación técnica y desarrollo de soluciones basadas en datos, bajo la narrativa adecuada de ingeniería estadística y modelado predictivo.
