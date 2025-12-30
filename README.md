# Reservas — Sistema de reservas para Barbería

✅ **Resumen**

Reservas es una aplicación web construida con **Laravel (Inertia + React)** que permite gestionar servicios de barbería, reservas de clientes y agenda de barberos. Incluye panel administrativo (Filament), gestión de roles (Spatie) y autenticación con Fortify.

---

## 🧰 Stack tecnológico

- Backend: **Laravel 12** (PHP ^8.2)
- Frontend: **Inertia.js + React**, build con **Vite**
- Estilos: **Tailwind CSS**
- Panel administrativo: **Filament**
- Control de permisos: **spatie/laravel-permission**
- Autenticación: **Laravel Fortify**
- DB por defecto en dev: **sqlite** (configurable a MySQL, Postgres, etc.)

---

## ⚙️ Requisitos

- PHP >= 8.2
- Composer
- Node.js (v18+ recomendado) + npm
- MYSQL (o SQLite/Postgres si lo prefieres)

---

## 🚀 Instalación rápida (Desarrollo)

1. Clona el repositorio:

    ```bash
    git clone <repo-url> reservas
    cd reservas
    ```

2. Instala dependencias PHP y JS:

    ```bash
    composer install
    npm install
    ```

3. Copia el env y genera la clave de la app:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. Si usas SQLite (por defecto):

    ```bash
    touch database/database.sqlite
    # o crea el archivo manualmente en Windows
    ```

5. Ejecuta migraciones y seeders (crea roles y usuarios de ejemplo):

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

    > El seeder `UserSeeder` crea roles `super_admin` y `barbero` y usuarios de ejemplo. Contraseña por defecto: `12345678`.

6. En desarrollo ejecuta:

    ```bash
    npm run dev
    php artisan serve --host=127.0.0.1 --port=8000
    ```

    O usa el script composer definido: `composer run dev` (usa concurrently para levantar servidor + queue + vite)

7. Accede en: http://localhost:8000

---

## 📋 Scripts útiles

- `composer run setup` — corre la instalación completa (instala dependencias, copia .env, genera key, corre migraciones y build de assets). Útil para despliegues o instalaciones automáticas.
- `npm run dev` — modo desarrollo (Vite)
- `npm run build` — construir assets para producción
- `php artisan test` — ejecutar tests

---

## 🔑 Usuarios y roles (seeder)

El seeder crea:

- **Admin**: `marcoscarpiocorazon@gmail.com` (password `12345678`) — rol `super_admin`
- **Barbero**: `sincovid19marco@gmail.com` (password `12345678`) — rol `barbero`
- **Cliente** de prueba: `clientedeprueba@gmail.com` (password `12345678`)

Si ves errores tipo: "There is no role named `barbero`", ejecuta `php artisan db:seed` para crear los roles.

---

## 🔍 Funcionalidades principales

- Catálogo de **Servicios** (activo/desactivable)
- Flujo de **Reservación**: elegir servicio, elegir barbero (o cualquiera), seleccionar slot disponible y confirmar
- **Cálculo de horarios** disponibles por servicio y barbero
- Gestión de **Indisponibilidades** (ausencias) por barbero
- Agenda diaria para barberos y historial
- Panel administrativo con **Filament** (gestión de servicios, horarios, etc.)

---

## 📁 Estructura relevante

- `app/Models` — modelos principales: `Reserva`, `Servicio`, `Disponibilidad`, `HorarioBarbero`
- `app/Http/Controllers` — controladores clave: `BarberiaController`, `BarberController`
- `routes/web.php` — rutas principales (la mayoría requiere `auth` y `verified`)
- `database/migrations` — migraciones para `servicios`, `reservas`, etc.
- `database/seeders` — `UserSeeder`, `ServicioSeeder` y `DatabaseSeeder`
- `resources/js` — frontend (Inertia + React)

---

## 🔐 Rutas importantes

- `/` — página pública (catálogo)
- `/dashboard` — catálogo protegido (después de login)
- `/reserva` — página de creación de reservas
- `GET /horarios-disponibles` — obtiene slots disponibles (JSON)
- `POST /reservacion` — crea reserva
- `/programacion` — programación/mi-reservas (clientes)
- `/barbero/*` — rutas de agenda, historial y disponibilidad para barberos

---

## 📝 Notas de desarrollo y recomendaciones

- Ejecuta `php artisan storage:link` si vas a usar `imagen_url` con `storage`.
- Si usas MySQL/Postgres cambia `DB_CONNECTION` en `.env` y ajusta variables.
- Para estabilizar nodos concurrentes en desarrollo usa `composer run dev` (concurrently) o ejecuta servicios por separado.
- Considera mejorar validaciones y _rate limiting_ si se expone públicamente la API de disponibilidad.

---

## ✅ Tests

Ejecuta la suite de tests:

```bash
php artisan test
```

---

## 💬 Contribuciones

Si quieres contribuir, abre un issue o un pull request. Añadir tests y documentación es siempre bienvenido.

SI TIENES ALGUN DUDA NO DUDES EN AVISARME :D

---

## 📄 Licencia

MIT
