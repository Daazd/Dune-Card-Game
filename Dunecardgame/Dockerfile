FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

# Install PostgreSQL development package
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Update pip
RUN pip install --upgrade pip

COPY requirements.txt ./

COPY staticfiles /app/staticfiles

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

#RUN python3 manage.py collectstatic --noinput

RUN chown -R www-data:www-data /app

ENV PYTHONPATH="${PYTHONPATH}:/usr/src/app:/usr/src/app/gameapp"

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "Dunecardgame.wsgi:application"]








