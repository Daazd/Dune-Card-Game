from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connections
from django.db.utils import OperationalError
import time

class Command(BaseCommand):
    help = 'Initialize the database with migrations and initial data'

    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        db_conn = None
        for i in range(60):  # try for 60 seconds
            try:
                db_conn = connections['default']
                db_conn.cursor()
                break
            except OperationalError:
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)

        if db_conn is None:
            self.stdout.write(self.style.ERROR('Database unavailable'))
            return

        self.stdout.write('Database available!')

        # Run migrations
        self.stdout.write('Running migrations...')
        call_command('migrate')

        # Load initial data (if you have fixtures)
        # self.stdout.write('Loading initial data...')
        # call_command('loaddata', 'fixture_name')

        self.stdout.write(self.style.SUCCESS('Database initialization completed successfully.'))