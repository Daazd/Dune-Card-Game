FROM python:3.10

WORKDIR /usr/src/app

# Copy only necessary files
COPY manage.py .
COPY requirements.txt .
COPY Dunecardgame ./Dunecardgame
COPY gameapp ./gameapp

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set Python path
ENV PYTHONPATH=/usr/src/app:$PYTHONPATH

EXPOSE 8000

# Print directory structure and Python path for debugging
RUN ls -R /usr/src/app && python -c "import sys; print(sys.path)"

# Ensure gameapp is copied
RUN ls -R /usr/src/app/gameapp

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


