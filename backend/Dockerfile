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
FROM php:8.2-apache

# Install system dependencies + PHP extensions required by Symfony + MySQL
RUN apt-get update && apt-get install -y \
        libicu-dev \
        libonig-dev \
        libxml2-dev \
        libzip-dev \
    && docker-php-ext-install \
        intl \
        mbstring \
        opcache \
        pdo \
        pdo_mysql \
        xml \
        zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite (needed by Symfony's front controller)
RUN a2enmod rewrite

# Solución definitiva para el error de MPM:
RUN a2dismod mpm_event mpm_worker || true
RUN rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* || true
RUN a2enmod mpm_prefork

# Change Apache to listen on 8080 (only ports.conf needs changing)
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf

# Replace the default vhost with our explicit config
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# Copy application (with vendor from build stage)
COPY --from=vendor /app ./

# Symfony needs write access to var/
RUN mkdir -p var/cache var/log config/jwt && \
    chown -R www-data:www-data var/ config/jwt && \
    chmod -R 775 var/

EXPOSE 8080

CMD ["apache2-foreground"]
