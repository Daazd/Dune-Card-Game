import psycopg2
import os

# Normalize function to handle case and space discrepancies
def normalize(name):
    return name.strip().lower().replace(' ', '_').replace('-', '_')

# Database connection details
conn = psycopg2.connect(
    dbname="dune_card_game",
    user="",
    password="",
    host="",
    port=""
)
cur = conn.cursor()

# Fetch all card names from the database
cur.execute('SELECT "Name" FROM cards2')
cards = cur.fetchall()
card_dict = {normalize(card[0]): card[0] for card in cards}

print("Normalized card names in database:")
for norm_name, orig_name in card_dict.items():
    print(f"{norm_name} -> {orig_name}")

# Directory containing the images
image_dir = 'dune_card_images'

# Iterate over each image file in the directory
for image_file in os.listdir(image_dir):
    if image_file.endswith('.jpg'):
        # Extract the card name from the image file name
        card_name_key = normalize(image_file.replace('.jpg', ''))
        
        # Check if the normalized card name matches any card in the database
        if card_name_key in card_dict:
            card_name = card_dict[card_name_key]
            
            # Print the card name and image file for debugging
            print(f"Updating {card_name} with image {image_file}")

            # Update the database with the image file name
            update_query = """
            UPDATE cards2
            SET image_file = %s
            WHERE "Name" = %s;
            """
            cur.execute(update_query, (image_file, card_name))
        else:
            print(f"No matching card found for {image_file}")

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print('All cards updated with images.')




