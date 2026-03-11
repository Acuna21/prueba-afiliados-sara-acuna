# 🏥 Portal de Afiliados - Sistema de Gestión
![Dashboard](./doc/images/image.png)

Portal web moderno para la gestión de servicios de afiliados de salud. Permite consultar certificados, solicitar cambios de EPS, gestionar cartas de derechos y registrar peticiones, quejas y reclamos (PQR).
---

## 📋 Información General
| Aspecto | Detalle |
|--------|---------|
| **Framework** | **Angular 19.2** |
| **Lenguaje** | **TypeScript** |
| **Estilos** | **Tailwind CSS + SCSS** |
| **Formularios** | **Reactive Forms (Angular)** |
| **Estado** | **Signals (Angular 19+) + Services** |
| **Gestión HTTP** | **HttpClient** |
| **Persistencia** | **LocalStorage** |
| **Componentes** | **Standalone Components (Angular 17+)** |
| **Build Tool** | **Angular CLI** |

---

## 🔐 Credenciales de Prueba

### Login
```
📧 Usuario:     afiliado@prueba.com
🔑 Contraseña:  Prueba2024*
```

---

## 📦 Módulos del Sistema

El proyecto está compuesto por **6 módulos principales**:

### 1. **🔑 Login y Autenticación** 
- **Ruta:** `/login`
- **Descripción:** Autenticación de usuarios con validación de credenciales
- **Funcionalidades:**
  - Validación de correo electrónico (RFC de validación)
  - Campos obligatorios
  - Mensajes de error dinámicos
  - Persistencia de sesión en localStorage
  - Guard para proteger rutas autenticadas

### 2. **📊 Dashboard**
- **Ruta:** `/dashboard`
- **Descripción:** Panel principal con resumen de información del afiliado
- **Funcionalidades:**
  - Bienvenida personalizada con nombre del afiliado
  - Cards de estadísticas (certificados, solicitudes, etc.)
  - Acceso rápido a todos los módulos
  - Información de afiliación actualizada
  - Interfaz responsiva y amigable

### 3. **📋 Carta de Derechos**
- **Ruta:** `/carta-derechos`
- **Descripción:** Gestión de cartas de derechos del afiliado
- **Funcionalidades:**
  - Listado de cartas de derechos creadas
  - CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - Formulario modal para crear/editar
  - Vista de detalles con información completa
  - Tabla con búsqueda y filtrado
  - Historial de solicitudes

### 4. **🎓 Certificado de Afiliación**
- **Ruta:** `/certificado`
- **Descripción:** Gestión de certificados de afiliación
- **Funcionalidades:**
  - Solicitud de certificados
  - Validación de fechas (inicio y fin de afiliación)
  - Descarga de documentos
  - Historial de certificados solicitados
  - Estados: Pendiente, Generado, Descargado
  - Integración con formularios reactivos

### 5. **🔄 Portabilidad**
- **Ruta:** `/portabilidad`
- **Descripción:** Solicitudes de cambio de EPS (portabilidad)
- **Funcionalidades:**
  - Formulario multi-paso (3 pasos):
    1. Datos Personales (nombre, documento)
    2. Datos de EPS (origen, destino, motivo)
    3. Confirmación de la solicitud
  - Validación en cada paso
  - Impedimento de seleccionar la misma EPS origen/destino
  - Tabla de solicitudes con:
    - **Ordenamiento por fecha** (ascendente/descendente)
    - **Dropdown inline para cambiar estado**
    - **Columna de acciones** con botón "Ver detalle"
  - Modal detalle con todos los datos de la solicitud
  - Historial de solicitudes con estados
  - Gateway actualizaciones en tiempo real

### 6. **❓ PQR (Peticiones, Quejas, Reclamos)**
- **Ruta:** `/pqr`
- **Descripción:** Sistema de gestión de peticiones, quejas y reclamos
- **Funcionalidades:**
  - Listado dinámico con tabla:
    - Columnas: PQR, Afiliado, Tipo, Fecha, Estado, Respuesta
    - **Ordenamiento por fecha** (botón clickeable)
    - Búsqueda por número o nombre
    - Filtrado por tipo (Petición, Queja, Reclamo, Sugerencia)
  - Panel de detalle con información completa:
    - 👤 Datos del Afiliado (nombre, correo, teléfono)
    - 📝 Descripción (tipo, contenido, fecha recepción)
    - 💬 Respuesta (mostrada si existe, pendiente si no)
    - Formulario inline para responder
  - Estadísticas (Total, Pendientes, Respondidas, % de respuesta)
  - Cambio de estado automático al responder
  - Registro de fecha/hora de respuesta

---

## 🗂️ Estructura del Proyecto

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts                 # Protección de rutas autenticadas
│   ├── models/
│   │   ├── auth.model.ts                 # Interfaces de autenticación
│   │   ├── carta-derechos.model.ts      # Interfaces de cartas
│   │   ├── certificado.model.ts          # Interfaces de certificados
│   │   ├── dashboard.model.ts            # Interfaces del dashboard
│   │   ├── portabilidad.model.ts         # Interfaces de portabilidad
│   │   └── pqr.model.ts                  # Interfaces de PQR
│   └── services/
│       ├── auth.service.ts               # Lógica de autenticación
│       ├── carta-derechos.service.ts    # Gestión de cartas
│       ├── carta-derechos-modal.service.ts
│       ├── certificado.service.ts        # Gestión de certificados
│       ├── portabilidad.service.ts       # Gestión de portabilidad
│       └── pqr.service.ts                # Gestión de PQR
│
├── features/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   │
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   ├── dashboard.component.scss
│   │   └── dashboard.constants.ts
│   │
│   ├── carta-derechos/
│   │   ├── carta-derechos.component.ts
│   │   ├── crear-editar/
│   │   ├── crear-editar-modal/
│   │   ├── detalle/
│   │   └── lista/
│   │
│   ├── certificado/
│   │   ├── certificado.component.ts
│   │   ├── certificado.component.html
│   │   ├── certificado.component.scss
│   │   └── fechaValidators.ts
│   │
│   ├── portabilidad/
│   │   ├── portabilidad.component.ts
│   │   ├── portabilidad.component.html
│   │   └── portabilidad.component.scss
│   │
│   └── pqr/
│       ├── detalle/
│       │   └── detalle.component.ts
│       └── listado/
│           ├── listado.component.ts
│           ├── listado.component.html
│           └── listado.component.scss
│
├── shared/
│   └── components/
│       ├── badge.component.ts            # Componente de badges
│       ├── button.component.ts           # Componente debotones
│       ├── loader.component.ts           # Componente de carga
│       ├── modal.component.ts            # Componente de modal
│       └── navbar.component.ts           # Barra de navegación
│
├── app.component.ts
├── app.config.ts                         # Configuración global
├── app.routes.ts                         # Rutas de la aplicación
└── app.component.scss

public/
└── (assets estáticos)

```

---

## Instalación y Uso

### Requisitos Previos
- **Node.js** v18+ 
- **npm** o **yarn**
- **Angular CLI** v19+

Credenciales de acceso:
- **Usuario:** `afiliado@prueba.com`
- **Contraseña:** `Prueba2024*`

