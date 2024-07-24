FROM python:3.10

WORKDIR /usr/src/app

# Copy the entire project
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set Python path
ENV PYTHONPATH=/usr/src/app:/usr/src/app/Dunecardgame:/usr/src/app/gameapp:$PYTHONPATH

EXPOSE 8000

# Print directory structure and Python path for debugging
RUN ls -R /usr/src/app && python -c "import sys; print(sys.path)"

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

