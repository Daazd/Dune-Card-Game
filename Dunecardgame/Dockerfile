FROM python:3.10

WORKDIR /usr/src/app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the manage.py file
COPY manage.py .

# Copy the Dunecardgame directory
COPY Dunecardgame ./Dunecardgame

# Copy the gameapp directory if it's needed
COPY gameapp ./gameapp

EXPOSE 8000

CMD ["sh", "-c", "ls -la /usr/src/app && python manage.py runserver 0.0.0.0:8000"]

