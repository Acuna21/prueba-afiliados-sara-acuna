# GUIA COMPLETA DE ESTUDIO PARA TU ENTREVISTA TECNICA
## Portal de Afiliados - Angular 19

---

# TABLA DE CONTENIDOS

1. [Introduccion: Tu Proyecto en 5 Minutos](#1-introduccion-tu-proyecto-en-5-minutos)
2. [Capitulo 1: Signals - El Corazon de Angular Moderno](#capitulo-1-signals---el-corazon-de-angular-moderno)
3. [Capitulo 2: Inyeccion de Dependencias](#capitulo-2-inyeccion-de-dependencias)
4. [Capitulo 3: Routing y Guards](#capitulo-3-routing-y-guards)
5. [Capitulo 4: Reactive Forms y Validaciones](#capitulo-4-reactive-forms-y-validaciones)
6. [Capitulo 5: RxJS Basico](#capitulo-5-rxjs-basico)
7. [Capitulo 6: Standalone Components](#capitulo-6-standalone-components)
8. [Capitulo 7: TypeScript Avanzado](#capitulo-7-typescript-avanzado)
9. [Capitulo 8: Arquitectura del Proyecto](#capitulo-8-arquitectura-del-proyecto)
10. [Capitulo 9: Comunicacion entre Componentes](#capitulo-9-comunicacion-entre-componentes)
11. [Capitulo 10: Lifecycle Hooks](#capitulo-10-lifecycle-hooks)
12. [Capitulo 11: Preguntas y Respuestas de Entrevista](#capitulo-11-preguntas-y-respuestas-de-entrevista)
13. [Capitulo 12: Tu Pitch de 3 Minutos](#capitulo-12-tu-pitch-de-3-minutos)
14. [Capitulo 13: Posibles Criticas y Como Defenderlas](#capitulo-13-posibles-criticas-y-como-defenderlas)

---

# 1. INTRODUCCION: TU PROYECTO EN 5 MINUTOS

## Que es el proyecto?

Es un **Portal de Afiliados para una EPS** (Entidad Promotora de Salud) que permite a los usuarios:

1. **Iniciar sesion** con credenciales
2. **Ver un dashboard** con accesos rapidos a los modulos
3. **Generar certificados** de afiliacion
4. **Solicitar cartas de derechos** (CRUD completo)
5. **Gestionar portabilidad** entre EPS
6. **Consultar PQR** (Peticiones, Quejas, Reclamos)

## Tecnologias usadas:

```
Angular 19          -> Framework principal
TypeScript          -> Lenguaje de programacion
Signals             -> Manejo de estado reactivo
Reactive Forms      -> Formularios
RxJS                -> Programacion reactiva (minimo uso)
Tailwind CSS        -> Estilos
localStorage        -> Persistencia de datos (simulado)
```

## Estructura de carpetas:

```
src/app/
   |
   +-- core/                  <- Logica central de la aplicacion
   |     +-- guards/          <- Proteccion de rutas
   |     +-- models/          <- Interfaces de TypeScript
   |     +-- services/        <- Servicios (logica de negocio)
   |
   +-- features/              <- Modulos por funcionalidad
   |     +-- login/           <- Pantalla de login
   |     +-- dashboard/       <- Panel principal
   |     +-- certificado/     <- Generar certificados
   |     +-- carta-derechos/  <- Solicitudes (CRUD)
   |     +-- portabilidad/    <- Cambio de EPS
   |     +-- pqr/             <- Listado de PQR
   |
   +-- shared/                <- Componentes reutilizables
         +-- components/      <- Button, Modal, Navbar, Badge
```

---

# CAPITULO 1: SIGNALS - EL CORAZON DE ANGULAR MODERNO

## Que es un Signal?

Un Signal es una **caja que guarda un valor** y **avisa a Angular cuando cambia**.

Piensa en un Signal como una variable especial que:
- Guarda un valor
- Cuando cambias el valor, Angular se entera automaticamente
- Angular actualiza solo las partes del HTML que usan ese valor

## Analogia Simple:

```
Variable normal:         Signal:
+--------+               +--------+
| valor  |               | valor  | -----> Angular se entera
+--------+               +--------+        del cambio
                              |
Cuando cambia:           Cuando cambia:
Nadie se entera          Angular actualiza
                         el HTML automatico
```

## Los 3 tipos de Signals que usas:

### 1. signal() - Estado que puede cambiar

```typescript
// EN TU CODIGO: auth.service.ts
private currentUserSignal = signal<User | null>(null);
//                          ^^^^^^ ^^^^^^^^^^^^^  ^^^^
//                          |      |              |
//                          |      |              Valor inicial
//                          |      Tipo de dato que guarda
//                          Crea el signal
```

**Como leer el valor:**
```typescript
const usuario = this.currentUserSignal();  // Llamas como funcion con ()
```

**Como cambiar el valor:**
```typescript
// Metodo 1: set() - Reemplaza completamente
this.currentUserSignal.set(nuevoUsuario);

// Metodo 2: update() - Modifica basado en valor anterior
this.showPassword.update(valorActual => !valorActual);
//                       ^^^^^^^^^^^^^^^^^^^^^^^^^^
//                       Funcion que recibe el valor actual
//                       y retorna el nuevo valor
```

### 2. computed() - Valor calculado automaticamente

```typescript
// EN TU CODIGO: auth.service.ts
isAuthenticated = computed(() => this.currentUserSignal() !== null);
//               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//               |
//               Esta funcion se RE-EJECUTA automaticamente
//               cada vez que currentUserSignal cambia
```

**Diagrama de como funciona:**

```
currentUserSignal         computed                  Resultado
+----------------+       +------------------+      +----------+
|     null       | ----> | user !== null ? | ---> |  false   |
+----------------+       +------------------+      +----------+

Despues del login:

+----------------+       +------------------+      +----------+
| { email: ...}  | ----> | user !== null ? | ---> |  true    |
+----------------+       +------------------+      +----------+
                              ^
                              |
                         Se recalcula
                         automaticamente!
```

### 3. asReadonly() - Solo lectura

```typescript
// EN TU CODIGO: auth.service.ts
private currentUserSignal = signal<User | null>(null);  // Privado, modificable
currentUser = this.currentUserSignal.asReadonly();      // Publico, solo lectura
```

**Por que usarlo?**

```
DENTRO del AuthService:
+----------------------------------+
| currentUserSignal.set(user)  OK  |  <- Puede modificar
| currentUserSignal()          OK  |  <- Puede leer
+----------------------------------+

FUERA del AuthService (en componentes):
+----------------------------------+
| authService.currentUser()    OK  |  <- Puede leer
| authService.currentUser.set() X  |  <- NO puede modificar (no existe set)
+----------------------------------+
```

**PREGUNTA DE ENTREVISTA:** "Por que usas asReadonly()?"

**TU RESPUESTA:**
> "Para encapsulacion. El signal privado solo puede modificarse dentro del servicio con set() o update(). Los componentes externos solo pueden leer el valor, no modificarlo directamente. Esto sigue el principio de encapsulacion de la programacion orientada a objetos."

---

## Flujo completo de Signals en tu Login:

```
PASO 1: Usuario escribe credenciales y hace click en "Ingresar"

LoginComponent                         AuthService
     |                                      |
     |  validateCredentials(email, pass)    |
     |------------------------------------->|
     |                                      |
     |  { valid: true, user: {...} }        |
     |<-------------------------------------|
     |                                      |
     |  login(user)                         |
     |------------------------------------->|
     |                                      |
     |              currentUserSignal.set(user)
     |                                      |
     |              isAuthenticated() -> true (computed se recalcula)
     |                                      |
     |  router.navigate(['/dashboard'])     |
     |------------------------------------->|

PASO 2: Usuario intenta acceder a /dashboard

authGuard                              AuthService
     |                                      |
     |  isAuthenticated()                   |
     |------------------------------------->|
     |                                      |
     |  true (porque ya hay usuario)        |
     |<-------------------------------------|
     |                                      |
     |  return true; // permite acceso      |
```

---

## EJERCICIO PARA PRACTICAR:

Mira este codigo de tu login.component.ts:

```typescript
showPassword = signal(false);

togglePasswordVisibility(): void {
  this.showPassword.update(val => !val);
}
```

**Pregunta:** Que hace `update(val => !val)`?

**Respuesta:** 
1. Toma el valor actual del signal (por ejemplo, `false`)
2. Lo pasa a la funcion como `val`
3. La funcion retorna el opuesto: `!false` = `true`
4. El signal se actualiza con el nuevo valor `true`
5. Si el HTML usa `showPassword()`, Angular lo actualiza

---

# CAPITULO 2: INYECCION DE DEPENDENCIAS

## Que es Inyeccion de Dependencias (DI)?

Es cuando **Angular te da** las cosas que necesitas, en lugar de que tu las crees.

**Sin DI (malo):**
```typescript
class LoginComponent {
  authService = new AuthService();  // Tu creas la instancia
}
```

**Con DI (bueno):**
```typescript
class LoginComponent {
  authService = inject(AuthService);  // Angular te la da
}
```

## Por que es mejor?

```
Sin DI:                              Con DI:
+-------------------+                +-------------------+
| LoginComponent    |                | LoginComponent    |
|  new AuthService()|                |  inject()         |
+-------------------+                +--------+----------+
                                              |
+-------------------+                         v
| DashboardComponent|                +-------------------+
|  new AuthService()|                |   Angular crea    |
+-------------------+                |   UNA instancia   |
                                     |   y la comparte   |
2 instancias diferentes!             +-------------------+
Datos no compartidos                 
                                     1 instancia compartida!
                                     Todos ven los mismos datos
```

## Dos formas de inyectar:

### Forma 1: Constructor (antigua pero valida)

```typescript
class LoginComponent {
  constructor(private authService: AuthService) {}
}
```

### Forma 2: inject() (moderna - la que usas tu)

```typescript
// EN TU CODIGO: login.component.ts
private readonly authService = inject(AuthService);
//      ^^^^^^^^               ^^^^^^
//      |                      |
//      No se puede reasignar  Funcion que obtiene la instancia
```

**PREGUNTA DE ENTREVISTA:** "Cual es la diferencia entre inject() y constructor injection?"

**TU RESPUESTA:**
> "Funcionalmente hacen lo mismo: obtienen una instancia del servicio. La diferencia es que inject() es mas flexible, se puede usar en funciones como guards funcionales, no necesita estar en el constructor, y con readonly me aseguro de no reasignar accidentalmente. Es el patron recomendado en Angular moderno."

---

## providedIn: 'root' - Que significa?

```typescript
// EN TU CODIGO: auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService { }
```

**Explicacion:**

```
providedIn: 'root' significa:

+--------------------------------------------------+
|                   APLICACION                      |
|                                                   |
|  +-------------------------------------------+   |
|  |           AuthService (SINGLETON)          |   |
|  |           Una sola instancia               |   |
|  +-------------------------------------------+   |
|         ^              ^              ^          |
|         |              |              |          |
|  +------+----+  +------+----+  +------+----+    |
|  | Login     |  | Dashboard |  | Certificado|    |
|  | Component |  | Component |  | Component  |    |
|  +-----------+  +-----------+  +------------+    |
|                                                   |
|  Todos usan LA MISMA instancia del servicio      |
+--------------------------------------------------+
```

**PREGUNTA DE ENTREVISTA:** "Que es providedIn root?"

**TU RESPUESTA:**
> "Significa que Angular crea una sola instancia del servicio para toda la aplicacion (patron Singleton). Todos los componentes que inyecten ese servicio recibiran la misma instancia, lo que permite compartir estado entre componentes. Ademas, si ningun componente usa el servicio, Angular lo elimina del bundle final (tree-shaking)."

---

# CAPITULO 3: ROUTING Y GUARDS

## Como funciona el Router?

El Router decide **que componente mostrar** segun la URL.

```
URL                    Componente
/login           ->    LoginComponent
/dashboard       ->    DashboardComponent
/certificado     ->    CertificadoComponent
```

## Tu archivo app.routes.ts explicado:

```typescript
// EN TU CODIGO: app.routes.ts

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component')
                          .then(m => m.LoginComponent)
  },
  // ... mas rutas
];
```

**Que significa cada parte:**

```typescript
{
  path: 'login',           // Cuando la URL sea /login
  loadComponent: () =>     // Carga el componente asi:
    import('./features/login/login.component')  // Import dinamico
    .then(m => m.LoginComponent)                // Extrae la clase
}
```

## Lazy Loading - Carga perezosa

**Sin lazy loading:**
```
Usuario abre la app
       |
       v
+----------------------------------+
| Se descarga TODO el JavaScript   |
| Login + Dashboard + Certificado  |
| + Carta + Portabilidad + PQR     |
|                                  |
| Total: 500KB (ejemplo)           |
+----------------------------------+
       |
       v
Usuario espera mucho...
```

**Con lazy loading (tu codigo):**
```
Usuario abre la app
       |
       v
+----------------------------------+
| Se descarga solo lo necesario    |
| AppComponent + Routing config    |
|                                  |
| Total: 100KB (ejemplo)           |
+----------------------------------+
       |
       v
App carga rapido!
       |
Usuario navega a /dashboard
       |
       v
+----------------------------------+
| Se descarga dashboard.js         |
| Solo cuando se necesita          |
+----------------------------------+
```

**PREGUNTA DE ENTREVISTA:** "Que es lazy loading y por que lo usaste?"

**TU RESPUESTA:**
> "Lazy loading es cargar modulos solo cuando el usuario los necesita, no al inicio. Esto reduce el bundle inicial y mejora el tiempo de carga. En mi proyecto, cada feature se carga solo cuando el usuario navega a esa ruta. Uso loadComponent con import() dinamico que retorna una Promise."

---

## Guards - Proteger rutas

Un Guard es un **portero** que decide si puedes entrar a una ruta.

```
Usuario quiere ir a /dashboard
           |
           v
    +-------------+
    |  authGuard  |
    +-------------+
           |
    Esta autenticado?
    /              \
   SI              NO
   |               |
   v               v
Entra a        Redirige a
/dashboard     /login
```

## Tu authGuard explicado linea por linea:

```typescript
// EN TU CODIGO: auth.guard.ts

// Es una funcion (guard funcional, no una clase)
export const authGuard: CanActivateFn = (route, state) => {
  
  // Obtiene el servicio de autenticacion
  const authService = inject(AuthService);
  
  // Obtiene el router para redireccionar
  const router = inject(Router);

  // Pregunta: esta autenticado?
  if (authService.isAuthenticated()) {
    return true;  // SI -> permite entrar
  }

  // NO -> redirige a login
  router.navigate(['/login']);
  return false;  // bloquea la navegacion original
};
```

**Como se usa en las rutas:**

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],  // <-- Aqui se aplica el guard
  loadComponent: () => import(...)
}
```

**PREGUNTA DE ENTREVISTA:** "Por que usaste un guard funcional en lugar de una clase?"

**TU RESPUESTA:**
> "Los guards funcionales fueron introducidos en Angular 14 y son el patron recomendado ahora. Son mas simples, no necesitan decorador @Injectable ni implementar interfaces. Usan inject() para obtener dependencias. Retornan boolean, UrlTree, o un Observable. Son funciones puras mas faciles de testear."

---

## Rutas hijas (Children)

Tu modulo carta-derechos tiene rutas hijas:

```typescript
// EN TU CODIGO: app.routes.ts

{
  path: 'carta-derechos',
  loadComponent: () => import('./features/carta-derechos/carta-derechos.component')
                        .then(m => m.CartaDerechosComponent),
  children: [  // <-- RUTAS HIJAS
    {
      path: '',              // /carta-derechos
      loadComponent: () => import('./features/carta-derechos/lista/lista.component')
    },
    {
      path: 'detalle/:id',   // /carta-derechos/detalle/5
      loadComponent: () => import('./features/carta-derechos/detalle/detalle.component')
    }
  ]
}
```

**Diagrama de rutas hijas:**

```
/carta-derechos
      |
      v
+------------------------------------------+
|  CartaDerechosComponent (PADRE)          |
|  +------------------------------------+  |
|  |  Contenido comun (navbar, titulo)  |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  <router-outlet></router-outlet>   |  |  <-- Aqui van los hijos
|  |                                    |  |
|  |  Si URL es /carta-derechos:        |  |
|  |    -> Muestra ListaComponent       |  |
|  |                                    |  |
|  |  Si URL es /carta-derechos/detalle/5:|
|  |    -> Muestra DetalleComponent     |  |
|  +------------------------------------+  |
+------------------------------------------+
```

**PREGUNTA DE ENTREVISTA:** "Por que usaste rutas hijas?"

**TU RESPUESTA:**
> "Para compartir un layout comun entre varias vistas. El componente padre CartaDerechos tiene el navbar y la estructura general. Los hijos (lista y detalle) se renderizan dentro del router-outlet del padre. Asi no duplico codigo y mantengo consistencia visual."

---

# CAPITULO 4: REACTIVE FORMS Y VALIDACIONES

## Que son Reactive Forms?

Son formularios donde **el control esta en TypeScript**, no en el HTML.

**Template-driven (HTML controla):**
```html
<input [(ngModel)]="email">  <!-- Logica en HTML -->
```

**Reactive Forms (TypeScript controla):**
```typescript
email = new FormControl('');  // Logica en TypeScript
```

## Por que Reactive Forms es mejor?

| Template-driven | Reactive Forms |
|-----------------|----------------|
| Logica en HTML | Logica en TypeScript |
| Dificil de testear | Facil de testear |
| Validaciones en HTML | Validaciones en TypeScript |
| Menos control | Control total |

---

## Tu formulario de Login explicado:

```typescript
// EN TU CODIGO: login.component.ts

// 1. Inyectar FormBuilder (ayuda a crear formularios)
private readonly fb = inject(FormBuilder);

// 2. Crear el formulario en el constructor
constructor() {
  this.loginForm = this.fb.group({
    //              ^^^^^^^^^^ Crea un FormGroup
    
    email: ['', [Validators.required, Validators.email]],
    //      ^   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //      |   Array de validadores
    //      Valor inicial (string vacio)
    
    password: ['', [Validators.required, Validators.minLength(1)]]
  });
}
```

**Estructura del FormGroup:**

```
loginForm (FormGroup)
    |
    +-- email (FormControl)
    |     +-- value: ''
    |     +-- valid: false (porque esta vacio y es required)
    |     +-- errors: { required: true }
    |     +-- touched: false
    |     +-- dirty: false
    |
    +-- password (FormControl)
          +-- value: ''
          +-- valid: false
          +-- errors: { required: true }
          +-- touched: false
          +-- dirty: false
```

## Propiedades importantes de un FormControl:

| Propiedad | Que significa |
|-----------|---------------|
| `value` | El valor actual del campo |
| `valid` | true si pasa TODAS las validaciones |
| `invalid` | true si falla ALGUNA validacion |
| `errors` | Objeto con los errores actuales |
| `touched` | true si el usuario hizo focus y salio |
| `dirty` | true si el usuario modifico el valor |
| `pristine` | true si el usuario NO ha modificado el valor |

---

## Validadores estandar de Angular:

```typescript
Validators.required        // Campo obligatorio
Validators.email           // Formato email valido
Validators.minLength(n)    // Minimo n caracteres
Validators.maxLength(n)    // Maximo n caracteres
Validators.min(n)          // Valor minimo (numeros)
Validators.max(n)          // Valor maximo (numeros)
Validators.pattern(regex)  // Debe coincidir con regex
```

---

## Tu validador personalizado explicado:

```typescript
// EN TU CODIGO: fechaValidators.ts

export function fechaNacimientoValidator(
  control: AbstractControl
): ValidationErrors | null {
  //                 ^^^^^^^^^^^^^^^^^^^
  //                 Retorna objeto de errores O null si es valido

  // Si el campo esta vacio, otro validador (required) lo maneja
  if (!control.value) return null;

  // Convertir el string a fecha
  const fecha = new Date(control.value);
  const hoy = new Date();
  
  // Normalizar horas para comparar solo fechas
  fecha.setHours(0,0,0,0);
  hoy.setHours(0,0,0,0);

  // Calcular fecha de hace 120 años
  const hace120 = new Date();
  hace120.setFullYear(hoy.getFullYear() - 120);
  hace120.setHours(0,0,0,0);

  // VALIDACION 1: No puede ser fecha futura
  if (fecha > hoy) {
    return { fechaFutura: true };  // <-- Retorna error
    //       ^^^^^^^^^^^
    //       Esta clave aparece en control.errors
  }

  // VALIDACION 2: No puede ser hace mas de 120 años
  if (fecha < hace120) {
    return { mayor120: true };  // <-- Retorna error
  }

  // Si pasa ambas validaciones
  return null;  // <-- null significa VALIDO
}
```

**Como se usa:**

```typescript
// EN TU CODIGO: certificado.component.ts

this.form = this.fb.group({
  fechaNacimiento: ['', [
    Validators.required,           // Validador estandar
    fechaNacimientoValidator       // Tu validador personalizado
  ]]
});
```

**En el HTML:**

```html
@if (fechaNacimiento?.errors?.['fechaFutura']) {
  <span class="error">La fecha no puede ser futura</span>
}

@if (fechaNacimiento?.errors?.['mayor120']) {
  <span class="error">La fecha no puede ser hace mas de 120 años</span>
}
```

**Diagrama del flujo de validacion:**

```
Usuario escribe fecha
        |
        v
+-------------------+
| FormControl       |
| (fechaNacimiento) |
+-------------------+
        |
        v
+-------------------+     +-------------------+
| Validators.       | --> | fechaNacimiento   |
| required          |     | Validator         |
+-------------------+     +-------------------+
        |                         |
        v                         v
   Es vacio?              Es fecha futura?
   Si -> error            Si -> error
        |                         |
        +------------+------------+
                     |
                     v
              +-------------+
              | errors = {  |
              |   required?,|
              |   fechaFutura?,
              |   mayor120? |
              | }           |
              +-------------+
```

**PREGUNTA DE ENTREVISTA:** "Como funciona tu validador de fecha de nacimiento?"

**TU RESPUESTA:**
> "Recibe un AbstractControl que contiene el valor del campo. Primero verifico que no este vacio, si lo esta retorno null para que required lo maneje. Luego convierto el valor a Date y hago dos validaciones: que no sea mayor a hoy (fecha futura) y que no sea menor a hace 120 años. Si alguna falla, retorno un objeto como {fechaFutura: true}. Si ambas pasan, retorno null que significa valido. En el HTML puedo verificar errors?.fechaFutura para mostrar el mensaje apropiado."

---

## Getters para acceder a campos:

```typescript
// EN TU CODIGO: login.component.ts

get email() {
  return this.loginForm.get('email');
}

get password() {
  return this.loginForm.get('password');
}
```

**Por que usar getters?**

```html
<!-- Sin getter (largo y repetitivo): -->
<span *ngIf="loginForm.get('email')?.errors?.['required']">

<!-- Con getter (limpio): -->
<span *ngIf="email?.errors?.['required']">
```

---

# CAPITULO 5: RxJS BASICO

## Que es RxJS?

RxJS es una libreria para manejar **datos que llegan con el tiempo** (streams).

**Analogia:**
- Una variable normal es como una foto: captura UN momento
- Un Observable es como un video: captura MUCHOS momentos en el tiempo

## Donde usas RxJS en tu proyecto:

```typescript
// EN TU CODIGO: dashboard.component.ts

import { interval, Subscription, startWith } from 'rxjs';

ngOnInit(): void {
  this.dateUpdateSubscription = interval(60000)
    .pipe(startWith(0))
    .subscribe(() => {
      this.currentDateTime.set(new Date());
    });
}
```

**Explicacion linea por linea:**

```typescript
interval(60000)
// Crea un Observable que emite un numero cada 60000ms (1 minuto)
// Emite: 0, 1, 2, 3... cada minuto

.pipe(startWith(0))
// pipe() encadena operadores
// startWith(0) hace que emita 0 INMEDIATAMENTE, sin esperar

.subscribe(() => {
  this.currentDateTime.set(new Date());
})
// subscribe() "activa" el Observable
// El callback se ejecuta cada vez que emite un valor
```

**Diagrama temporal:**

```
Tiempo:    0ms     1ms    60000ms   120000ms   180000ms
           |        |        |          |          |
           v        v        v          v          v
emite:     0       ---       1          2          3
           ^
           |
     startWith(0) hace que
     emita inmediatamente
```

---

## Subscription y Memory Leaks

**Problema:** Un Observable puede seguir emitiendo PARA SIEMPRE.

```typescript
interval(60000).subscribe(...)
// Este Observable NUNCA se detiene por si solo
// Si el componente se destruye, sigue ejecutandose en memoria
// = MEMORY LEAK
```

**Solucion:** Guardar y cancelar la subscription.

```typescript
// EN TU CODIGO: dashboard.component.ts

// 1. Guardar la subscription
private dateUpdateSubscription: Subscription | null = null;

ngOnInit(): void {
  // 2. Asignar la subscription
  this.dateUpdateSubscription = interval(60000)
    .pipe(startWith(0))
    .subscribe(() => {
      this.currentDateTime.set(new Date());
    });
}

ngOnDestroy(): void {
  // 3. Cancelar cuando el componente se destruye
  if (this.dateUpdateSubscription) {
    this.dateUpdateSubscription.unsubscribe();
  }
}
```

**Diagrama del ciclo de vida:**

```
Componente se crea
        |
        v
    ngOnInit()
        |
    subscribe() a interval
        |
        v
+-------------------+
|  Observable       |
|  emitiendo cada   |
|  60 segundos      |
+-------------------+
        |
Usuario navega a otra pagina
        |
        v
    ngOnDestroy()
        |
    unsubscribe()
        |
        v
+-------------------+
|  Observable       |
|  CANCELADO        |
|  No mas emisiones |
+-------------------+
```

**PREGUNTA DE ENTREVISTA:** "Que es un memory leak y como lo evitas?"

**TU RESPUESTA:**
> "Un memory leak ocurre cuando el programa usa memoria que ya no necesita pero no la libera. En Angular, si un componente se suscribe a un Observable y no cancela la suscripcion cuando se destruye, el Observable sigue ejecutandose en memoria aunque el componente ya no exista. Lo evito guardando la Subscription en una variable y llamando unsubscribe() en ngOnDestroy()."

---

## Signals vs Observables

**Cuando usar cada uno:**

| Signals | Observables (RxJS) |
|---------|-------------------|
| Estado simple de UI | Eventos asincronos |
| Datos sincronos | HTTP requests |
| Estado local del componente | Eventos del DOM |
| Valores derivados (computed) | Combinacion de streams |

**En tu proyecto:**
- Signals: Estado de usuario, mensajes de error, loading states
- RxJS: Actualizar fecha/hora cada minuto (evento temporal)

---

# CAPITULO 6: STANDALONE COMPONENTS

## Que son Standalone Components?

Son componentes que **no necesitan un NgModule** para funcionar.

**Antes (con NgModule):**
```typescript
// login.module.ts
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginComponent]
})
export class LoginModule { }

// login.component.ts
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent { }
```

**Ahora (Standalone):**
```typescript
// EN TU CODIGO: login.component.ts
@Component({
  selector: 'app-login',
  standalone: true,  // <-- No necesita NgModule
  imports: [ReactiveFormsModule],  // <-- Importa lo que necesita directamente
  templateUrl: './login.component.html'
})
export class LoginComponent { }
```

## Ventajas:

```
Con NgModule:                      Standalone:
+------------------+               +------------------+
| LoginModule      |               | LoginComponent   |
|   declarations   |               |   standalone     |
|   imports        |               |   imports        |
|   exports        |               +------------------+
+------------------+                    Solo 1 archivo
       +                                vs 2 archivos
+------------------+
| LoginComponent   |
+------------------+
   2 archivos
```

**PREGUNTA DE ENTREVISTA:** "Por que usaste standalone components?"

**TU RESPUESTA:**
> "Es el patron recomendado desde Angular 14 y default desde Angular 17. Simplifica el codigo eliminando la necesidad de crear NgModules para cada componente. Cada componente declara sus propias dependencias en imports, lo que hace el codigo mas explicito y facil de entender. Tambien mejora el tree-shaking porque Angular sabe exactamente que necesita cada componente."

---

## @if y @for - Nueva sintaxis de control de flujo

**Antes (directivas):**
```html
<div *ngIf="isVisible">Contenido</div>
<div *ngFor="let item of items">{{ item }}</div>
```

**Ahora (tu codigo):**
```html
@if (isVisible) {
  <div>Contenido</div>
}

@for (item of items; track item.id) {
  <div>{{ item }}</div>
}
```

**Ventajas:**
- Sintaxis mas clara
- Mejor rendimiento
- No necesita importar CommonModule para estas directivas

---

# CAPITULO 7: TYPESCRIPT AVANZADO

## Interfaces - Definir la forma de los datos

```typescript
// EN TU CODIGO: auth.model.ts

export interface User {
  id?: number;       // Opcional (puede no existir)
  email: string;     // Obligatorio
  nombre: string;    // Obligatorio
  token?: string;    // Opcional
}
```

**Para que sirven:**
```typescript
// TypeScript te avisa si faltan propiedades
const user: User = {
  email: "test@test.com"
  // ERROR: falta 'nombre'
};

// TypeScript te avisa si escribes mal
user.nombr  // ERROR: 'nombr' no existe en User
```

---

## Union Types - Multiples opciones

```typescript
// EN TU CODIGO: carta-derechos.model.ts

estado: 'Pendiente' | 'En proceso' | 'Resuelta' | 'Rechazada';
//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//      Solo puede ser UNO de estos 4 strings

tipoSolicitud: 'Derecho' | 'Deber' | 'Consulta' | 'Reclamo';
```

**Beneficio:**
```typescript
carta.estado = 'Pendiente';  // OK
carta.estado = 'Aprobada';   // ERROR: 'Aprobada' no es valido
```

---

## Type Aliases - Nombres para tipos

```typescript
// EN TU CODIGO: carta-derechos.model.ts

export type TipoSolicitud = 'Derecho' | 'Deber' | 'Consulta' | 'Reclamo';
export type EstadoSolicitud = 'Pendiente' | 'En proceso' | 'Resuelta' | 'Rechazada';

// Ahora puedes usar:
tipoSolicitud: TipoSolicitud;  // Mas limpio
```

---

## Utility Types - Transformar tipos

### Omit<T, K> - Quitar propiedades

```typescript
// EN TU CODIGO: carta-derechos.service.ts

create(carta: Omit<CartaDerechos, 'id' | 'numeroSolicitud' | 'fechaSolicitud'>)
```

**Que hace Omit:**

```
CartaDerechos (tipo original):
+------------------------+
| id                     |
| numeroSolicitud        |
| fechaSolicitud         |
| tipoSolicitud          |
| descripcion            |
| nombreAfiliado         |
| numeroDocumento        |
| estado                 |
+------------------------+

Omit<CartaDerechos, 'id' | 'numeroSolicitud' | 'fechaSolicitud'>:
+------------------------+
|                        |  <- id REMOVIDO
|                        |  <- numeroSolicitud REMOVIDO
|                        |  <- fechaSolicitud REMOVIDO
| tipoSolicitud          |
| descripcion            |
| nombreAfiliado         |
| numeroDocumento        |
| estado                 |
+------------------------+
```

**Por que usarlo:**
> Cuando creas una carta nueva, el id, numeroSolicitud y fechaSolicitud se generan automaticamente en el servicio. El usuario no los proporciona. Omit asegura que TypeScript no espere esas propiedades en el parametro.

### Partial<T> - Todas las propiedades opcionales

```typescript
// EN TU CODIGO: carta-derechos.service.ts

update(id: number, carta: Partial<CartaDerechos>)
```

**Que hace Partial:**

```
CartaDerechos:                    Partial<CartaDerechos>:
+------------------------+        +------------------------+
| id: number             |        | id?: number            |
| tipoSolicitud: string  | -----> | tipoSolicitud?: string |
| descripcion: string    |        | descripcion?: string   |
+------------------------+        +------------------------+
                                  Todas opcionales!
```

**Por que usarlo:**
> En una actualizacion, quizas solo quieres cambiar el estado, no todos los campos. Partial permite pasar solo las propiedades que quieres actualizar.

**PREGUNTA DE ENTREVISTA:** "Que es Omit y por que lo usaste?"

**TU RESPUESTA:**
> "Omit es un Utility Type de TypeScript que crea un tipo nuevo excluyendo propiedades especificas. Lo use en create() porque cuando el usuario crea una carta, el id, numeroSolicitud y fechaSolicitud se generan automaticamente en el servicio, no los pasa el usuario. Asi el tipo del parametro refleja exactamente lo que se espera recibir, y TypeScript me avisaria si intento pasar esas propiedades."

---

## Generics - Tipos parametrizados

```typescript
// Signal con generico
signal<User | null>(null)
//     ^^^^^^^^^^^^
//     Este signal solo puede contener User o null

// Array con generico
signal<Certificado[]>([])
//     ^^^^^^^^^^^^^
//     Este signal solo puede contener un array de Certificados
```

---

# CAPITULO 8: ARQUITECTURA DEL PROYECTO

## Las 3 capas de tu proyecto:

```
+------------------------------------------------------------------+
|                           /app                                    |
|                                                                   |
|  +--------------------+  +--------------------+  +-------------+  |
|  |       CORE         |  |     FEATURES       |  |   SHARED    |  |
|  +--------------------+  +--------------------+  +-------------+  |
|  | Servicios          |  | Componentes de     |  | Componentes |  |
|  | singleton          |  | negocio            |  | reutilizables|  |
|  | (AuthService,      |  | (Login, Dashboard, |  | (Button,    |  |
|  | CertificadoService)|  | Certificado, etc.) |  | Modal,      |  |
|  |                    |  |                    |  | Navbar)     |  |
|  | Guards             |  | Cada feature es    |  |             |  |
|  | (authGuard)        |  | independiente y    |  | Sin logica  |  |
|  |                    |  | lazy loaded        |  | de negocio  |  |
|  | Models             |  |                    |  |             |  |
|  | (interfaces)       |  |                    |  |             |  |
|  +--------------------+  +--------------------+  +-------------+  |
+------------------------------------------------------------------+
```

## Por que esta estructura?

### CORE - Logica central compartida

```
/core
  /guards
    auth.guard.ts         <- Usado por todas las rutas protegidas
  /models
    auth.model.ts         <- Interfaz User usada en toda la app
    certificado.model.ts
    carta-derechos.model.ts
  /services
    auth.service.ts       <- Singleton, estado de autenticacion
    certificado.service.ts
    carta-derechos.service.ts
```

**Regla:** Lo que va en core es usado por MULTIPLES features.

### FEATURES - Modulos de negocio

```
/features
  /login
    login.component.ts
    login.component.html
    login.component.scss
  /dashboard
    dashboard.component.ts
    dashboard.component.html
    dashboard.constants.ts   <- Constantes especificas
  /certificado
    certificado.component.ts
    fechaValidators.ts       <- Validadores especificos
  /carta-derechos
    carta-derechos.component.ts
    /lista
      lista.component.ts     <- Sub-componente
    /detalle
      detalle.component.ts   <- Sub-componente
```

**Regla:** Cada feature es independiente, tiene todo lo que necesita.

### SHARED - Componentes reutilizables

```
/shared
  /components
    button.component.ts     <- Usado en Login, Certificado, Modal...
    modal.component.ts      <- Usado en Carta, PQR...
    navbar.component.ts     <- Usado en Dashboard, Certificado...
    badge.component.ts      <- Usado en Lista, PQR...
```

**Regla:** Sin logica de negocio, solo presentacion configurable.

---

## Principios aplicados:

### 1. Separacion de responsabilidades

```
Componente:                     Servicio:
+------------------------+      +------------------------+
| Solo UI                |      | Solo logica/datos      |
| - Mostrar datos        |      | - CRUD                 |
| - Capturar eventos     |      | - Validaciones         |
| - Formularios          |      | - Persistencia         |
+------------------------+      +------------------------+
         |                               |
         +-------------------------------+
                     |
         El componente USA el servicio
         pero NO implementa la logica
```

### 2. Single Responsibility (Responsabilidad Unica)

```
MAL:                            BIEN:
+------------------------+      +------------------------+
| CartaDerechosService   |      | CartaDerechosService   |
|  - CRUD cartas         |      |  - CRUD cartas         |
|  - Estado del modal    |      +------------------------+
|  - Validaciones        |
+------------------------+      +------------------------+
                                | ModalService           |
                                |  - Estado del modal    |
                                +------------------------+
```

**PREGUNTA DE ENTREVISTA:** "Como explicarias la arquitectura de tu proyecto?"

**TU RESPUESTA:**
> "Use arquitectura basada en 3 capas: Core para servicios singleton, guards y modelos compartidos; Features para modulos de negocio organizados por funcionalidad donde cada uno es independiente y se carga con lazy loading; y Shared para componentes UI reutilizables sin logica de negocio. Esta separacion permite que el codigo sea escalable, testeable y facil de mantener."

---

# CAPITULO 9: COMUNICACION ENTRE COMPONENTES

## 3 formas de comunicacion:

### 1. Input - Padre envia datos al hijo

```typescript
// EN TU CODIGO: button.component.ts

// HIJO define inputs
label = input('Button');
variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
disabled = input(false);
loading = input(false);
```

```html
<!-- PADRE envia datos via property binding -->
<app-button
  [label]="'Guardar'"
  [variant]="'primary'"
  [disabled]="isLoading()"
  [loading]="isLoading()"
></app-button>
```

**Diagrama:**
```
Componente Padre                    ButtonComponent (Hijo)
+------------------+               +------------------+
|                  |   [label]     |                  |
|  'Guardar'       | ------------> |  label()         |
|                  |               |  = 'Guardar'     |
|                  |   [disabled]  |                  |
|  true            | ------------> |  disabled()      |
|                  |               |  = true          |
+------------------+               +------------------+
```

### 2. Output - Hijo envia eventos al padre

```typescript
// EN TU CODIGO: button.component.ts

// HIJO define output
onClick = output<void>();

// En el template del hijo:
// <button (click)="onClick.emit()">
```

```html
<!-- PADRE escucha eventos via event binding -->
<app-button
  [label]="'Guardar'"
  (onClick)="onGuardar()"
></app-button>
```

**Diagrama:**
```
Componente Padre                    ButtonComponent (Hijo)
+------------------+               +------------------+
|                  |   (onClick)   |                  |
|  onGuardar()     | <------------ |  onClick.emit()  |
|  se ejecuta      |               |                  |
+------------------+               +------------------+
```

### 3. Servicio - Comunicacion entre componentes no relacionados

```typescript
// EN TU CODIGO: auth.service.ts

// Servicio con signal
currentUserSignal = signal<User | null>(null);
currentUser = this.currentUserSignal.asReadonly();
```

```typescript
// Cualquier componente puede:
// 1. Leer
const user = this.authService.currentUser();

// 2. Suscribirse a cambios (con effect o en el template)
// En template: {{ authService.currentUser()?.nombre }}
```

**Diagrama:**
```
LoginComponent                AuthService               DashboardComponent
+-------------+              +-------------+            +----------------+
|             |  login(user) |             |  reads     |                |
|             | -----------> | currentUser | <--------- | currentUser()  |
|             |              | .set(user)  |            | muestra nombre |
+-------------+              +-------------+            +----------------+
                                   ^
                                   |
                             Signal compartido
                             entre componentes
```

---

# CAPITULO 10: LIFECYCLE HOOKS

## Ciclo de vida de un componente:

```
Componente se crea
        |
        v
  constructor()        <- Inyeccion de dependencias
        |
        v
  ngOnInit()           <- Inicializacion, llamadas a servicios
        |
        v
  ngOnChanges()        <- Cuando cambian los inputs (puede llamarse multiples veces)
        |
        v
  [Componente vive y funciona]
        |
        v
  ngOnDestroy()        <- Limpieza antes de destruirse
        |
        v
  Componente destruido
```

## Los que usas en tu proyecto:

### constructor()
```typescript
// EN TU CODIGO: login.component.ts

constructor() {
  // Crear el formulario
  this.loginForm = this.fb.group({...});
}
```
**Cuando se ejecuta:** Cuando Angular crea la instancia del componente.
**Para que usarlo:** Inicializar variables, crear formularios.

### ngOnInit()
```typescript
// EN TU CODIGO: dashboard.component.ts

ngOnInit(): void {
  // Suscribirse a observables
  this.dateUpdateSubscription = interval(60000)
    .pipe(startWith(0))
    .subscribe(() => {
      this.currentDateTime.set(new Date());
    });
}
```
**Cuando se ejecuta:** Despues del constructor, cuando los inputs ya estan disponibles.
**Para que usarlo:** Llamar servicios, suscribirse a observables, inicializaciones que necesitan inputs.

### ngOnDestroy()
```typescript
// EN TU CODIGO: dashboard.component.ts

ngOnDestroy(): void {
  if (this.dateUpdateSubscription) {
    this.dateUpdateSubscription.unsubscribe();
  }
}
```
**Cuando se ejecuta:** Justo antes de que Angular destruya el componente.
**Para que usarlo:** Cancelar suscripciones, limpiar timers, liberar recursos.

**PREGUNTA DE ENTREVISTA:** "Cual es la diferencia entre constructor y ngOnInit?"

**TU RESPUESTA:**
> "El constructor es de TypeScript, se ejecuta cuando se crea la instancia de la clase, antes de que Angular haya inicializado los inputs. ngOnInit es de Angular, se ejecuta despues de que Angular ha configurado los inputs del componente. Por eso las llamadas a servicios y suscripciones van en ngOnInit: los datos ya estan disponibles."

---

# CAPITULO 11: PREGUNTAS Y RESPUESTAS DE ENTREVISTA

## PREGUNTAS SOBRE SIGNALS

**P1: "Que es un Signal y para que sirve?"**
> "Un Signal es un contenedor reactivo de Angular que guarda un valor y notifica automaticamente cuando cambia. Permite que Angular sepa exactamente que partes del template actualizar, mejorando el rendimiento. Se lee llamandolo como funcion: signal(), y se actualiza con set() o update()."

**P2: "Diferencia entre signal(), computed() y effect()?"**
> "signal() crea estado mutable que puedo cambiar. computed() crea un valor derivado que se recalcula automaticamente cuando sus dependencias cambian, es de solo lectura. effect() ejecuta codigo secundario cuando un signal cambia, como logs o sincronizacion con localStorage."

**P3: "Por que usaste asReadonly()?"**
> "Para encapsulacion. El signal privado solo puede modificarse dentro del servicio, mientras que los componentes externos solo pueden leer el valor. Sigue el principio de que el estado solo se modifica desde un lugar controlado."

---

## PREGUNTAS SOBRE FORMS

**P4: "Diferencia entre Template-driven y Reactive Forms?"**
> "Template-driven pone la logica en el HTML con ngModel, es simple pero dificil de testear. Reactive Forms define el formulario en TypeScript, dando control total, mejor testabilidad, y es ideal para formularios complejos con validaciones dinamicas."

**P5: "Como funciona un validador personalizado?"**
> "Es una funcion que recibe un AbstractControl y retorna null si es valido, o un objeto con errores si es invalido. Por ejemplo, {fechaFutura: true}. En el template verifico control.errors?.fechaFutura para mostrar mensajes."

---

## PREGUNTAS SOBRE ROUTING

**P6: "Que es lazy loading?"**
> "Es cargar modulos solo cuando se necesitan, no al inicio. Reduce el bundle inicial y mejora el tiempo de carga. Uso loadComponent con import() dinamico que retorna una Promise del componente."

**P7: "Como funciona un Guard?"**
> "Es una funcion que Angular ejecuta antes de navegar a una ruta. Verifica una condicion, como si el usuario esta autenticado, y retorna true para permitir o false para bloquear. Puede redirigir a otra ruta si bloquea."

---

## PREGUNTAS SOBRE ARQUITECTURA

**P8: "Por que separaste servicios del componente?"**
> "Separacion de responsabilidades. El componente maneja la UI: mostrar datos, capturar eventos. El servicio maneja la logica: CRUD, persistencia, validaciones de negocio. Esto hace el codigo mas testeable, reutilizable y mantenible."

**P9: "Que es providedIn root?"**
> "Significa que Angular crea una sola instancia del servicio para toda la aplicacion, patron Singleton. Todos los componentes comparten esa instancia. Tambien permite tree-shaking: si nadie usa el servicio, no se incluye en el bundle."

---

## PREGUNTAS SOBRE RxJS

**P10: "Por que guardas la subscription y la cancelas?"**
> "Para evitar memory leaks. Observables como interval() emiten indefinidamente. Si el componente se destruye sin cancelar, el callback sigue ejecutandose en memoria. Guardo la subscription y llamo unsubscribe() en ngOnDestroy()."

**P11: "Cuando usar Signals vs Observables?"**
> "Signals para estado simple de UI, datos sincronos, valores derivados. Observables para eventos asincronos, HTTP requests, combinacion de multiples streams, eventos del DOM que ocurren con el tiempo."

---

## PREGUNTAS SOBRE TYPESCRIPT

**P12: "Que es Omit y por que lo usaste?"**
> "Omit es un Utility Type que crea un tipo nuevo excluyendo propiedades. Lo use en create() porque id, numeroSolicitud y fechaSolicitud se generan automaticamente, no los pasa el usuario. El tipo del parametro refleja exactamente lo que espero."

**P13: "Diferencia entre interface y type?"**
> "Son muy similares. Interface se puede extender con extends y es mejor para definir la forma de objetos. Type es mas flexible, puede crear union types y tipos condicionales. Para objetos uso interface, para unions o tipos complejos uso type."

---

## PREGUNTAS SOBRE ANGULAR MODERNO

**P14: "Por que standalone components?"**
> "Es el patron recomendado desde Angular 14+. Elimina NgModules para componentes simples. Cada componente declara sus imports directamente, es mas explicito, facil de entender, y mejora tree-shaking."

**P15: "Por que inject() en lugar de constructor?"**
> "Ambos hacen lo mismo pero inject() es mas flexible. Funciona en guards funcionales, fuera del constructor. Con readonly me aseguro de no reasignar accidentalmente. Es el patron moderno recomendado."

---

# CAPITULO 12: TU PITCH DE 3 MINUTOS

## Version para memorizar:

> "Desarrolle un **Portal de Afiliados para EPS** usando **Angular 19** con arquitectura **standalone**.
>
> El sistema permite a usuarios de una EPS gestionar sus tramites de salud a traves de **5 modulos principales**: autenticacion, dashboard, certificados de afiliacion, carta de derechos con CRUD completo, y consulta de PQR.
>
> **Decisiones tecnicas destacadas:**
>
> Primero, use **Signals** para el manejo de estado reactivo. Por ejemplo, en el AuthService, un signal privado guarda el usuario actual, y un computed deriva si esta autenticado. Esto simplifica la reactividad comparado con RxJS para estado de UI.
>
> Segundo, implemente **Reactive Forms** con validadores personalizados. Cree un validador para fecha de nacimiento que verifica que no sea futura ni mayor a 120 años, retornando errores especificos que muestro en el template.
>
> Tercero, use **Lazy Loading** en todas las rutas. Cada feature se carga solo cuando el usuario navega ahi, reduciendo el bundle inicial y mejorando el tiempo de carga.
>
> Cuarto, protegi las rutas privadas con un **guard funcional** que verifica autenticacion y redirige a login si es necesario.
>
> La arquitectura sigue el patron de **3 capas**: Core para servicios singleton y modelos, Features para modulos de negocio independientes, y Shared para componentes reutilizables como Button y Modal que usan la nueva API de input() y output().
>
> Como mejora futura, integraria un backend real con JWT y agregaria tests unitarios con Jasmine."

---

# CAPITULO 13: POSIBLES CRITICAS Y COMO DEFENDERLAS

## Critica 1: "Usas localStorage, eso no es seguro"

**Defensa:**
> "Correcto, localStorage es solo para la demostracion. En produccion usaria un backend con autenticacion JWT real. El token iria en cookies HTTP-only para mayor seguridad, y usaria un HttpInterceptor para agregarlo automaticamente a las peticiones."

---

## Critica 2: "No tienes tests"

**Defensa:**
> "Es cierto, por tiempo no inclui tests. Sin embargo, la arquitectura facilita el testing: los servicios estan separados de los componentes, los validadores son funciones puras. Agregaria tests unitarios con Jasmine para servicios y validadores, y tests de componentes con TestBed."

---

## Critica 3: "El manejo de errores es basico"

**Defensa:**
> "Actualmente uso try/catch simple y mensajes de error locales. En produccion crearia un servicio global de errores, un HttpInterceptor para capturar errores HTTP, y un sistema de notificaciones (toast) para mostrar mensajes al usuario de forma consistente."

---

## Critica 4: "Hay magic strings como 'afiliado@prueba.com'"

**Defensa:**
> "Buena observacion. Deberian ser constantes en un archivo de configuracion o variables de entorno. Asi seria mas facil cambiarlas y evitaria errores de tipeo. En produccion no existirian porque la validacion seria contra un backend."

---

## Critica 5: "El componente de certificado tiene mucha logica"

**Defensa:**
> "Tienes razon, parte de la logica de generacion de PDF y la manipulacion del DOM para descarga podria moverse al servicio. El componente deberia solo manejar la UI y delegar al servicio la generacion del documento."

---

## Critica 6: "Por que no usaste NgRx para el estado?"

**Defensa:**
> "Para una aplicacion de este tamano, Signals en servicios es suficiente y mas simple. NgRx agrega complejidad con actions, reducers, effects. Lo consideraria si la aplicacion creciera mucho o necesitara features como devtools o undo/redo."

---

# RESUMEN FINAL - CONCEPTOS CLAVE

| Concepto | Que es | Tu codigo |
|----------|--------|-----------|
| Signal | Estado reactivo mutable | `signal<User\|null>(null)` |
| Computed | Valor derivado | `computed(() => signal() !== null)` |
| asReadonly | Expone solo lectura | `this.signal.asReadonly()` |
| inject() | Inyeccion moderna | `inject(AuthService)` |
| providedIn root | Servicio singleton | `@Injectable({providedIn: 'root'})` |
| Standalone | Sin NgModule | `standalone: true` |
| Lazy loading | Carga bajo demanda | `loadComponent: () => import()` |
| Guard funcional | Protege rutas | `CanActivateFn` |
| Reactive Forms | Forms en TS | `fb.group({...})` |
| Custom Validator | Validacion propia | Retorna `null` o `{error: true}` |
| Subscription | Suscripcion RxJS | Guardar y cancelar en ngOnDestroy |
| Omit<T,K> | Quitar propiedades | `Omit<Carta, 'id'>` |
| Partial<T> | Todo opcional | `Partial<Carta>` |
| input() | Input signal | `isOpen = input(false)` |
| output() | Output signal | `confirm = output<void>()` |

---

FIN DE LA GUIA

Estudia cada capitulo en orden. Practica explicando cada concepto en voz alta como si estuvieras en la entrevista. Buena suerte!
