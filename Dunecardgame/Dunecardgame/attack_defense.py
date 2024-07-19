import psycopg2
from psycopg2 import sql

# Connect to your PostgreSQL database
try:
    conn = psycopg2.connect(
        dbname="dune_card_game",
        user="",
        password="",
        host="",
        port=""
    )
    conn.autocommit = False  # Ensure autocommit is off
except psycopg2.Error as e:
    print(f"Error connecting to the database: {e}")
    exit()

cur = conn.cursor()

# Function to generate attack and defense values
def generate_attack_defense(card_id):
    # Example logic for generating attack and defense values
    attack = (card_id % 20) + 5
    defense = (card_id % 30) + 10
    return attack, defense

# Update the attack and defense for all cards
try:
    for card_id in range(1, 311):
        attack, defense = generate_attack_defense(card_id)
        query = sql.SQL("UPDATE cards2 SET attack = %s, defense = %s WHERE id = %s")
        cur.execute(query, (attack, defense, card_id))
        print(f"Updated card ID {card_id} with attack {attack} and defense {defense}")
    conn.commit()  # Explicitly commit the transaction
except psycopg2.Error as e:
    print(f"Error executing query: {e}")
    conn.rollback()
finally:
    cur.close()
    conn.close()


