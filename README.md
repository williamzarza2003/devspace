# DEVSPACE

Panel personal para organizar y gestionar las tecnologías que uso y quiero aprender. Aplicación de una sola página construida con React y TypeScript, con persistencia local y sin necesidad de backend.

## Qué es

DEVSPACE es un dashboard donde se registran lenguajes, frameworks, herramientas y bases de datos como tarjetas, con búsqueda, filtros, ordenamiento y estadísticas. Los datos se guardan en el navegador, por lo que la aplicación funciona sin servidor ni cuenta.

## Funcionalidades

- Alta, edición y eliminación de tecnologías, con validación de campos y de duplicados (sin distinguir mayúsculas).
- Búsqueda por nombre y filtro por categoría (lenguaje, framework, herramienta, base de datos).
- Ordenamiento: orden original, A → Z, Z → A y por categoría. La preferencia se recuerda entre sesiones.
- Panel de estadísticas con el resumen de las tecnologías registradas.
- Exportación a JSON e importación desde JSON, con validación estricta del archivo (estructura, categorías permitidas, campos vacíos y duplicados) y confirmación previa.
- Restauración de los valores predeterminados.
- Modales de confirmación para acciones destructivas y notificaciones de estado (éxito, error, información).
- Estados vacíos diferenciados: sin datos y sin resultados de búsqueda.
- Persistencia automática en `localStorage`.

## Tecnologías

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vite.dev/) 8
- [ESLint](https://eslint.org/) 10 con `typescript-eslint`, `react-hooks` y `react-refresh`

## Instalación

Requisitos: [Node.js](https://nodejs.org/) (versión LTS reciente) y npm.

```bash
git clone https://github.com/williamzarza2003/devspace.git
cd devspace
npm install
npm run dev
```

La aplicación queda disponible en la URL que muestra Vite (por defecto `http://localhost:5173`).

## Scripts

| Script            | Descripción                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con HMR.            |
| `npm run build`   | Verifica tipos (`tsc -b`) y genera el build en `dist`. |
| `npm run lint`    | Ejecuta ESLint sobre el proyecto.                    |
| `npm run preview` | Sirve localmente el build de producción.             |

## Estructura del proyecto

```
src/
├── components/        # Componentes de interfaz
│   ├── Header.tsx
│   ├── DashboardStats.tsx
│   ├── TechnologyForm.tsx
│   ├── EditTechnologyForm.tsx
│   ├── TechnologyFilters.tsx
│   ├── InfoCard.tsx
│   ├── ConfirmModal.tsx
│   └── Notification.tsx
├── hooks/
│   └── useTechnologies.ts   # Estado y lógica de negocio
├── App.tsx            # Composición del dashboard
├── App.css / index.css
└── main.tsx
```

## Decisiones técnicas

- **Lógica en un custom hook.** `useTechnologies` concentra el estado, el filtrado, el ordenamiento, la persistencia y la importación/exportación; `App.tsx` solo compone la interfaz.
- **Sin backend.** `localStorage` simplifica el despliegue y permite uso offline, a costa de que los datos queden ligados al navegador.
- **Validación defensiva al importar.** El JSON se trata como entrada no confiable: se valida forma, categorías y duplicados antes de ofrecer la importación.
- **Confirmación en acciones destructivas.** Eliminar, restaurar e importar reemplazan datos, por lo que pasan por un modal.
- **TypeScript estricto** para modelar el dominio (`Technology`, `NotificationData`) y reducir errores en tiempo de compilación.

## Limitaciones

- Los datos viven solo en el navegador: no se sincronizan entre dispositivos y se pierden si se borra el almacenamiento.
- El título de la tecnología actúa como identificador, por lo que no puede repetirse.
- No hay pruebas automatizadas.
- No hay autenticación ni multiusuario.

## Próximos pasos

- Agregar pruebas unitarias y de componentes.
- Sincronización con un backend o servicio en la nube.
- Identificadores únicos en lugar de usar el título como clave.
- Mejoras de accesibilidad (gestión de foco en modales, anuncios de notificaciones).
- Despliegue público y CI con lint y build.

## Capturas

> _Próximamente: capturas de pantalla del dashboard._

<!-- ![Dashboard](docs/dashboard.png) -->

## Autor

**William Zarza** — GitHub: [@williamzarza2003](https://github.com/williamzarza2003)
