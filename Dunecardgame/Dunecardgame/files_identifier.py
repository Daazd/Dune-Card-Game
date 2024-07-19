import psycopg2

# Database connection details
try:
    conn = psycopg2.connect(
        dbname="dune_card_game",
        user="",
        password="",
        host="",
        port=""
    )
    print("Database connection established.")
except Exception as e:
    print(f"Error connecting to database: {e}")
    exit()

cur = conn.cursor()

# Fetch all card names from the database
try:
    cur.execute('SELECT "Name" FROM cards2')
    cards = cur.fetchall()
    if not cards:
        print("No data found in the cards2 table.")
    else:
        print("Card names in database:")
        for card in cards:
            print(card[0])
except Exception as e:
    print(f"Error fetching data from database: {e}")

cur.close()
conn.close()



