# ── Stage 1: Composer dependencies ───────────────────────────────────────────
FROM composer:2 AS vendor
WORKDIR /app
COPY app/composer.json app/composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --ignore-platform-reqs \
    --prefer-dist

COPY app/ .
RUN composer dump-autoload --optimize --no-dev

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
# Usamos una imagen optimizada para producción que ya soluciona los problemas de Apache
FROM webdevops/php-apache:8.2

# Variables de entorno para configurar el DocumentRoot y el puerto
ENV WEB_DOCUMENT_ROOT=/var/www/html/public
ENV WEB_DOCUMENT_INDEX=index.php
ENV APACHE_LISTEN_PORT=8080

# Instalamos extensiones necesarias
RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-install intl pdo_mysql opcache

WORKDIR /var/www/html

# Copiamos la aplicación desde el stage de vendor
COPY --from=vendor /app ./

# Permisos para Symfony
RUN mkdir -p var/cache var/log config/jwt && \
    chown -R www-data:www-data var/ config/jwt && \
    chmod -R 775 var/

# Generamos las llaves JWT automáticamente durante la compilación

RUN echo "APP_ENV=prod" > .env && \
    echo "DATABASE_URL=sqlite:///:memory:" >> .env && \
    echo "JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem" >> .env && \
    echo "JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem" >> .env && \
    echo "JWT_PASSPHRASE=proyectotfg" >> .env && \
    echo "APP_SECRET=8f3e2a1c9b0d4e5f6g7h8i9j0k1l2m3n" >> .env && \
    php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction

EXPOSE 8080
