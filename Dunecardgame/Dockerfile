FROM python:3.10

WORKDIR /usr/src/app

# Copy the entire project
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set Python path
ENV PYTHONPATH=/usr/src/app

EXPOSE 8000

# Print directory structure and file contents for debugging
RUN echo "Directory structure:" && \
    ls -R /usr/src/app && \
    echo "Python path:" && \
    python -c "import sys; print(sys.path)" && \
    echo "Content of settings.py:" && \
    cat /usr/src/app/Dunecardgame/settings.py && \
    echo "Content of gameapp directory:" && \
    ls -la /usr/src/app/gameapp

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

