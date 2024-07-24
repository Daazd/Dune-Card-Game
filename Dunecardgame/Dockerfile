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

ENV PYTHONPATH=/usr/src/app

EXPOSE 8000

# Print directory structure and file contents for debugging
RUN echo "Directory structure:" && \
    ls -R /usr/src/app && \
    echo "Contents of manage.py:" && \
    cat /usr/src/app/manage.py && \
    echo "Contents of settings.py:" && \
    cat /usr/src/app/Dunecardgame/settings.py

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

