# 🎲 Gestor de Personajes y Apoyo para las Sesiones de Dragones y Mazmorras - Proyecto Fin de Grado

### Desarrollado por Mateo Sáez

Como jugador de Dragones y Mazmorras, he observado que las sesiones de juego se suelen alargar, dado que hay ocasiones en las que hay que sumar muchos bonificadores, ya sea en una tirada común como en un combate. El fin de este proyecto es facilitar la gestión de partidas de D&D (forma abreviada de Dungeons & Dragons). Permite tanto a Dungeon Masters como a Jugadores llevar un control exhaustivo de sus campañas, personajes y combates de una forma intuitiva y dinámica. He tomado como referencia la aplicación de Roll20 y el creador de personajes de D&D Beyond.

**URL del Proyecto:** [https://extraordinary-analysis-production.up.railway.app](https://extraordinary-analysis-production.up.railway.app)

---

## ¿Para qué sirve esta aplicación?

La aplicación nace de la necesidad de agilizar la experiencia de juego en mesa, ya que las tiradas y los cálculos suelen ocupar una parte importante de la sesión, dejando el roleo a un segundo plano. Esta aplicación sirve como un apoyo el cual complementa la hoja de papel tradicional, permitiendo:
- **Automatización de cálculos:** Olvida sumar manualmente bonificadores; la app lo hace por ti.
- **Historial de dados:** Registro en tiempo real de todas las tiradas de dados en una campaña, ya sean de habilidad, de salvación, de ataque o de daño.
- **Gestión centralizada:** Todo lo necesario para una sesión de juego en un solo lugar, accesible desde cualquier ordenador.

---

## Roles

La aplicación distingue dos tipos de roles:

- **Jugador**: Puede crear y gestionar sus personajes, unirse a campañas y realizar tiradas de dados.
- **Dungeon Master**: Puede crear y gestionar campañas, invitar jugadores a sus campañas, gestionar las hojas de personaje de sus jugadores, realizar tiradas de dados y acceder al historial de tiradas.

## ¿Por qué es útil esta aplicación?
Como se ha expuesto; las sesiones de rol presenciales suelen alargarse cuando llega el momento de tirar dados y la experiencia conjunta de contar una historia se transforma en un excel donde hay que realizar cálculos; aunque sean sumas y restas, al haber tantos dados y también muchos jugadores en la mesa, los cálculos se hacen tediosos y pesados, y es aquí donde entra en juego esta aplicación para hacer que la experiencia sea más fluida y dinámica.

---

## Tecnologías Usadas

El proyecto utiliza un conjunto de tecnologías moderno y robusto para garantizar rendimiento y escalabilidad:

### Frontend
- **React 18**: Biblioteca principal para la interfaz de usuario.
- **TypeScript**: Para un desarrollo seguro y tipado.
- **Vanilla CSS**: Estilos personalizados con un enfoque en diseño premium y oscuro (glassmorphism).
- **Vite**: Herramienta de construcción y desarrollo ultra rápida.

### Backend
- **Symfony 7 (PHP 8.2)**: Framework de alto rendimiento para la API.
- **MySQL 8.0**: Base de datos relacional para la persistencia.
- **Doctrine ORM**: Mapeo de objetos para la base de datos.
- **LexikJWTAuthentication**: Seguridad basada en tokens JWT para la autenticación.

### Infraestructura
- **Docker & Docker Compose**: Contenedores para asegurar que el proyecto funcione igual en cualquier entorno.
- **Nginx**: Servidor web para el frontend.
- **Apache**: Servidor de aplicaciones para el backend.
- **Railway**: Plataforma PaaS para el despliegue continuo según se vaya subiendo código.

---

## 📊 Modelo Entidad-Relación

El diseño de la base de datos ha sido optimizado para soportar la complejidad de las reglas básicas de D&D, permitiendo relaciones dinámicas entre personajes, habilidades y ataques.

![Modelo Entidad Relación](screenshots/Esquema-BD.png)

---

## 📋 Tablas de la Base de Datos

El esquema se compone de las siguientes tablas principales:

- **`user`**: Almacena las credenciales y roles de los usuarios.
- **`campaign`**: Información de las partidas (DM, sistema, estado).
- **`character`**: Hojas de personaje con estadísticas base e historia.
- **`characteristic`**: Puntuaciones de Fuerza, Destreza, etc., y sus respectivas salvaciones.
- **`ability`**: Habilidades específicas (Acrobacias, Atletismo, etc.) junto a la competencia en cada habilidad.
- **`attack`**: Configuración de ataques personalizados.
- **`damage`**: Definición de dados de daño y modificadores.
- **`dice_roll`**: Registro histórico de todas las tiradas efectuadas.

---

## Roles de Usuario

La aplicación distingue dos roles fundamentales:

### 1. Jugador (Player)
- Crea y personaliza sus propias hojas de personaje según sean las necesidades de la partida.
- Sube de nivel y actualiza estadísticas en tiempo real.
- Realiza las tiradas de habilidad, salvación y ataque con un solo click.
- Ve sus propios ataques y bonificadores calculados automáticamente.

### 2. Master (Dungeon Master)
- Crear y gestionar múltiples campañas.
- Invita a jugadores a sus campañas.
- Supervisa las hojas de personaje de todos sus jugadores.
- Historial de Tiradas: Visualizar en tiempo real los resultados de los dados de todos los jugadores de la mesa.

---

## Despliegue y Dockerización

El proyecto está totalmente **dockerizado**, lo que facilita su despliegue y ejecución local.

### Dockerización
Se han creado sendos `Dockerfile` específicos para cada servicio:
- **Backend**: Utiliza una imagen optimizada con PHP 8.2 y Apache. Configura automáticamente el entorno de producción y genera las llaves JWT.
- **Frontend**: Utiliza una build multi-etapa. Primero compila el código React y luego lo sirve mediante **Nginx**.

Posteriormente, se ha creado un archivo `docker-compose.yml` que permite levantar el proyecto localmente con todos los servicios necesarios.

### Railway
El despliegue se realiza en Railway mediante la conexión directa con GitHub, configurando servicios independientes para el Frontend, Backend y MySQL, comunicados a través de variables de entorno seguras.

---

## Casos de Uso (User Stories)

| Rol | Acción | Resultado esperado |
| :--- | :--- | :--- |
| **Usuario** | Login y Registro | Al entrar en la aplicación, todos deben registrarse para acceder a todas las funcionalidades que ofrece la aplicación. |
| **Jugador** | Unirse a una campaña | Antes de poder crear un personaje, el usuario debe unirse a una campaña que esté en curso. |
| **Jugador** | Crear un personaje | La columna del proyecto. Todos los jugadores crean su personaje mediante un formulario completo con todas las características y habilidades de Dragones y Mazmorras |
| **Jugador** | Crear un ataque | Cuando el personaje está creado, el jugador puede asignarle ataques con un formulario simple contemplando las opciones que ofrece Dragones y Mazmorras. |
| **Jugador** | Hacer una tirada de ataque | El sistema calcula `1d20 + Bono Competencia (si lo hubiera) + Mod.` y registra el resultado. |
| **Jugador** | Hacer una tirada de habilidad | El sistema calcula `1d20 + Bono Competencia (si lo hubiera) + Mod.` y registra el resultado. |
| **Jugador** | Hacer una tirada de salvación | El sistema calcula `1d20 + Bono Competencia (si lo hubiera) + Mod.` y registra el resultado. |
| **Jugador** | Hacer una tirada de daño | El sistema calcula `dado de daño (se usan varios tipos de dados: 1d4, 1d6, 1d8, 1d10 y 1d12) + Mod.` y registra el resultado. |
| **Jugador** | Subir las características | Los bonificadores de las habilidades y tiradas de salvación se actualizan automáticamente. |
| **Master** | Crear Campaña | Se crea una campaña mediante un formulario donde los jugadores pueden unirse con sus personajes. |
| **Master** | Revisar historial de tiradas | El DM ve los resultados de las tiradas de sus jugadores. |

---

## Capturas de Pantalla

### Pantalla de inicio
![Pantalla de inicio](screenshots/landing-page.png)

### Login
![Login](screenshots/login.png)

### Registro
![Registro](screenshots/register.png)

### Dashboard Principal
![Dashboard](screenshots/dashboard.png)

### Visor de personajes creados
![Visor de personajes](screenshots/listado-personajes.png)

### Hoja de Personaje Detallada
![Hoja de Personaje](screenshots/hoja-de-personaje.png)

### Gestión de Campaña (Vista DM)
![Campaña DM](screenshots/campaña-detalle-DM.png)

### Historial de Tiradas en Tiempo Real
![Historial](screenshots/log-tiradas.png)

### Configuración de Ataques
![Ataques](screenshots/lista-ataques.png)

### Creación de Campañas
![Creación de Campañas](screenshots/form-campaña.png)

### Listado de Campañas por Usuario
![Listado de Campañas](screenshots/mis-campañas.png)

### Creación de Personajes
![Creación de Personajes](screenshots/form-personaje-1.png)
![Creación de Personajes](screenshots/form-personaje-2.png)
![Creación de Personajes](screenshots/form-personaje-3.png)

### Añadir ataques a un personaje
![Añadir ataques a un personaje](screenshots/form-ataque-1.png)
![Añadir ataques a un personaje](screenshots/form-ataque-2.png)

---
*Desarrollado como Proyecto de Fin de Grado por Mateo Sáez - 2026*
