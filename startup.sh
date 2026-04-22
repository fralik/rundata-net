#!/bin/bash
# Azure App Service startup script for rundatanet.
# Activates the pre-built virtualenv shipped in the deployment package,
# applies pending Django migrations, then launches Gunicorn.
set -e

cd /home/site/wwwroot
source /home/site/wwwroot/antenv/bin/activate

python manage.py migrate --noinput

exec gunicorn config.wsgi:application \
    --bind=0.0.0.0:8000 \
    --workers 3 \
    --worker-class gevent \
    --timeout 120 \
    --access-logfile '-' \
    --error-logfile '-'
