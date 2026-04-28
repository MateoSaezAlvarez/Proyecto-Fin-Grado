# 🎲 Trabajo Final: Sistema de Gestión de Personajes y Combate para D&D. 

## Hecho por Mateo Saez Alvarez

#### ¿Por qué este proyecto? 

Como jugador de rol he observado que muchas personas usan aplicaciones que no son del todo intuitivas. Por ello, he decidido crear una aplicación que permita gestionar personajes y combates de forma más cómoda y eficiente. Sirve como apoyo para jugadores con la hoja de papel, facilitando la creación y edición de personajes, así como la gestión de combates, haciendo más rápidos los turnos de los jugadores.



## Tecnologías Utilizadas

### Frontend
- **React 18** (con TypeScript)
- **Vite** como herramienta de construcción rápida.
- **Vanilla CSS** para los estilos que se han usado en este proyecto.
- **React Router** para navegación SPA.

### Backend
- **Symfony 7** (PHP 8.2)
- **MySQL 8.0** para persistencia de datos.
- **Doctrine ORM** para el mapeo de entidades.
- **JWT (LexikJWTAuthentication)** para seguridad y autenticación.
- **CORS Bundle** para comunicación cross-origin segura.

### Infraestructura y Despliegue
- **Docker & Docker Compose** para entorno local consistente.
- **Railway** para el despliegue en la nube (PaaS).
- **Nginx** para servir los assets del frontend.
- **Apache** como servidor de aplicaciones para PHP.

## Características Principales

- **Gestión de Personajes:** Creación y edición persistente de estadísticas, habilidades y bonificadores.
- **Sistema de Ataques Dinámico:** Configura ataques con dados específicos (d4, d6, d8, d10, d12) y modificadores de característica.
- **Tiradas Automatizadas:** Realiza tiradas de impacto y daño con un solo click, con soporte para bonos de competencia.
- **Sincronización en Tiempo Real:** Las tiradas se guardan en el historial de la campaña para su revisión.
- **Diseño Premium:** Interfaz oscura, elegante y optimizada para la experiencia de juego.

## Instalación y Ejecución Local

### Requisitos previos
- Docker y Docker Compose instalados.

### Pasos
1. Clona el repositorio:
   ```bash
   git clone https://github.com/MateoSaezAlvarez/Proyecto-Fin-Grado.git
   cd Proyecto-Fin-Grado
   ```

2. Levanta el entorno con Docker:
   ```bash
   docker compose up -d --build
   ```

3. El sistema estará disponible en:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **Base de Datos:** Puerto 3307 localmente.

## Despliegue en Railway

Para desplegar en Railway, sigue estos pasos:

1. Crea un nuevo proyecto en [Railway.app](https://railway.app).
2. Añade un servicio de **MySQL**.
3. Añade el servicio del **Backend**:
   - Conecta tu repo y selecciona la carpeta `/backend`.
   - Configura las variables: `DATABASE_URL`, `JWT_PASSPHRASE`, `APP_ENV=prod`.
4. Añade el servicio del **Frontend**:
   - Selecciona la carpeta `/frontend`.
   - **IMPORTANTE:** Configura el Build Arg `VITE_API_URL` con la URL de tu servicio de backend generado por Railway.

---

*Proyecto desarrollado como Trabajo de Fin de Grado - 2026*
