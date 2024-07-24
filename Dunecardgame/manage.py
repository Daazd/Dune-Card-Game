#!/usr/bin/env python
import os
import sys

def main():
    print(f"Current working directory: {os.getcwd()}")
    print(f"Contents of current directory: {os.listdir('.')}")
    print(f"Python path before: {sys.path}")

    # Add the Dunecardgame directory to the Python path
    dunecardgame_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.insert(0, dunecardgame_path)
    sys.path.insert(0, os.path.join(dunecardgame_path, 'Dunecardgame'))

    print(f"Python path after: {sys.path}")

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Dunecardgame.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
