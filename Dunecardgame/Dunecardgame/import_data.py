import pandas as pd
import psycopg2

# Read the specific sheet from the Excel file
file_path = '/mnt/c/Users/Taylor/Dune_CCG_Card_Database_v1.xlsx'
sheet_name = 'EotSdb'
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Clean the DataFrame
# Drop any rows that are completely empty
df.dropna(how='all', inplace=True)

# Replace spaces and special characters in column names with underscores
df.columns = df.columns.str.replace(r'\W+', '_')

# Print the first few rows and column names for verification
print(df.head())
print(df.columns)

# Database connection details
conn = psycopg2.connect(
    dbname='dune_card_game',
    user='',
    password='',
    host='',
    port=''
)
cur = conn.cursor()

# Generate the CREATE TABLE SQL statement based on the DataFrame
table_name = "cards2"
columns = df.columns

# Properly quote column names
quoted_columns = [f'"{col}"' for col in columns]
create_table_query = f'CREATE TABLE {table_name} (id SERIAL PRIMARY KEY, ' + ', '.join([f'{col} TEXT' for col in quoted_columns]) + ');'

# Execute the CREATE TABLE statement
cur.execute(create_table_query)
conn.commit()

# Print the CREATE TABLE statement for verification
print(create_table_query)

# Insert data into the table
for index, row in df.iterrows():
    insert_query = f'INSERT INTO {table_name} ({", ".join(quoted_columns)}) VALUES ({", ".join(["%s"] * len(columns))})'
    cur.execute(insert_query, tuple(row))

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

