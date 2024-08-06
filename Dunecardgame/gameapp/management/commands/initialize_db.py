from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Initialize the database with migrations and initial data'

    def handle(self, *args, **options):
        # Run migrations
        self.stdout.write('Running migrations...')
        call_command('migrate')

        # Load initial data (if you have fixtures)
        # self.stdout.write('Loading initial data...')
        # call_command('loaddata', 'your_fixture_name')

        self.stdout.write(self.style.SUCCESS('Database initialization completed successfully.'))