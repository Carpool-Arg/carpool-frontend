# Carpool App 🚗

Carpool es una aplicación web desarrollada con **Next.js** y **Spring Boot** que permite a los usuarios publicar y reservar viajes compartidos. La app soporta dos tipos de usuarios: **conductores** y **pasajeros**, y permite que un mismo usuario pueda desempeñar ambos roles.

---

## Características

* Registro y login de usuarios con **JWT**.
* Autenticación vía **Google**.
* Perfil de usuario con información personal.
* Publicación de viajes por conductores (origen, destino, cantidad de asientos y precio).
* Reserva de viajes por pasajeros.
* Gestión de estado de reservas y stock de asientos.
* Interfaz adaptativa según el rol del usuario.
* Sistema de validación de tokens y refresco automático.

---

## Tecnologías

* **Frontend**: Next.js, React, Tailwind CSS, TypeScript
* **Backend**: Spring Boot, Java
* **Base de datos**: Postgre SQL
* **Autenticación**: JWT, OAuth con Google

---

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/carpool-app.git
cd carpool-app
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con tus variables, por ejemplo:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id
```

4. Ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Estructura del proyecto

* `app/` → rutas y páginas de Next.js.
* `components/` → componentes reutilizables de UI.
* `contexts/` → contexto de autenticación (`AuthProvider`).
* `services/` → llamadas a la API (`authService`, `reservationService`, etc.).
* `types/` → definición de tipos de TypeScript.
* `middleware.ts` → middleware de autenticación y validación de rutas.
* `constants/` → constantes del proyecto.

---

## Rutas Públicas y Privadas

El sistema cuenta con **rutas públicas** (login, registro, recuperación de contraseña, etc.) y **rutas privadas** protegidas mediante middleware que valida el token JWT.

---

## Equipo

* **SARGON** 

---

## Recursos

* [Next.js Documentation](https://nextjs.org/docs)
* [React Documentation](https://reactjs.org/docs/getting-started.html)
* [Spring Boot Documentation](https://spring.io/projects/spring-boot)
* [Tailwind CSS](https://tailwindcss.com/docs)

