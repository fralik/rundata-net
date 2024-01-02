#!/bin/bash

# Navigate to the directory containing your 'requirements/production.txt' file
cd $HOME

# Use pip to install dependencies
pip install -r requirements/production.txt

# Collect static files for Django
# python manage.py collectstatic --noinput

# Apply database migrations
python manage.py migrate

# Navigate back to the root directory
cd -

# Oryx needs to know the startup file for your application. For Django, this is usually 'wsgi.py'.
# You can specify this using the 'ORYX_APP_PATH' environment variable.
export ORYX_APP_PATH="config/wsgi.py"
