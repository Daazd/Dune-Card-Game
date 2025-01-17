import psycopg2

# Database connection details
conn = psycopg2.connect(
    dbname="dune_card_game",
    user="",
    password="",
    host="",
    port=""
)
cur = conn.cursor()

# List of updates
updates = [
    (37, 'Paul_Atreides.jpg'),
    (41, 'Lady_Margot.jpg'),
    (42, 'Princess_Irulan.jpg'),
    (45, 'Count_Hasimir_Fenring.jpg'),
    (49, 'Shaddam_IV.jpg'),
    (50, 'Chani.jpg'),
    (51, 'Jamis.jpg'),
    (53, 'Stilgar.jpg'),
    (56, 'Feyd_Rautha.jpg'),
    (57, 'Glossu_Rabban.jpg'),
    (61, 'Dorvin_Saeth.jpg'),
    (62, 'Gauvir_Mucca.jpg'),
    (64, 'Oberon.jpg'),
    (68, 'Fremen_Naib.jpg'),
    (70, 'Guild_Navigator.jpg'),
    (78, 'Leven_Breche.jpg'),
    (79, 'Leven_Breche.jpg'),
    (90, 'Garrison.jpg'),
    (91, 'Hand_of_God.jpg'),
    (92, 'Heat_Sickness.jpg'),
    (106, 'Prescience.jpg'),
    (94, 'Hereditary_Claim.jpg'),
    (97, 'Imperial_Seal.jpg'),
    (98, 'Juice_of_Sapho.jpg'),
    (100, 'Mentat_Analysis.jpg'),
    (103, 'Palace_Keep.jpg'),
    (116, 'Timed_Drug.jpg'),
    (118, 'Truth_sayer.jpg'),
    (123, 'Baliset.jpg'),
    (124, 'Carryall.jpg'),
    (125, 'Crysknife.jpg'),
    (127, 'Flip_Dart.jpg'),
    (128, 'Gom_Jabbar.jpg'),
    (131, 'Hunter_Seeker.jpg'),
    (132, 'Kindjal.jpg'),
    (133, 'Lasgun_Rifle.jpg'),
    (134, 'Maker_Hooks.jpg'),
    (135, 'Maula_Pistol.jpg'),
    (137, 'Personal_Shield.jpg'),
    (140, 'Seismic_Probes.jpg'),
    (141, 'Slip-Tip.jpg'),
    (142, 'Spice_Harvester.jpg'),
    (143, 'Stunner.jpg'),
    (146, 'Windtrap.jpg'),
    (147, 'Coriolis_Storm.jpg'),
    (149, 'Imperial_Favour.jpg'),
    (152, 'Sandworm.jpg'),
    (225, 'Intelligence.jpg'),
    (243, 'Pre-Emptive_Strike.jpg'),
    (248, 'Rachag_Stimulants.jpg'),
    (250, 'Secund-Elect.jpg'),
    (260, 'Unforseen_Difficulties.jpg'),
    (262, 'Venomous_Faith.jpg'),
    (268, 'Best_Blade.jpg'),
    (269, 'Betrayal.jpg'),
    (287, 'Proces_Verbal.jpg'),
    (293, 'Sand_Scrub.jpg'),
    (296, 'Spice_Trance.jpg'),
    (297, 'Stranglehold.jpg'),
    (301, 'Terrorism.jpg'),
    (309, 'Waking_Dream.jpg'),
]

# Execute updates
for card_id, image_file in updates:
    update_query = """
    UPDATE cards2
    SET image_file = %s
    WHERE id = %s;
    """
    cur.execute(update_query, (image_file, card_id))

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print('All cards updated with images.')
