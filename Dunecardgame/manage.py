#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Dunecardgame.settings')
    
    print(f"Current working directory: {os.getcwd()}")
    print(f"Contents of current directory: {os.listdir('.')}")
    print(f"Python path before modification: {sys.path}")
    
    # Add the project root to the Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)
    
    print(f"Python path after modification: {sys.path}")
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    print("Trying to import gameapp...")
    try:
        import gameapp
        print("Successfully imported gameapp")
    except ImportError as e:
        print(f"Failed to import gameapp: {e}")
    
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
