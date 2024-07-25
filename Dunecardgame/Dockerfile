FROM python:3.10-slim

WORKDIR /usr/src/app

# Install PostgreSQL development package
RUN apt-get update && apt-get install -y libpq-dev gcc

# Update pip
RUN pip install --upgrade pip

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH="${PYTHONPATH}:/usr/src/app:/usr/src/app/gameapp"

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]







