from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import requests
import os
from urllib.parse import urljoin

# Configure Selenium to use Chrome in headless mode
options = Options()
options.headless = True

# URL of the page to scrape
url = "https://www.ccgtrader.net/games/dune-ccg/eye-of-the-storm/"

# Connect to the running ChromeDriver instance
driver = webdriver.Remote(
    command_executor='http://localhost:9515',
    options=options
)
driver.get(url)

try:
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//img[contains(@src, 'key=card-medium')]"))
    )
except Exception as e:
    print("Card images not loaded within the time frame.")
    driver.quit()
    exit()

# Get the page source after JavaScript has rendered the content
page_source = driver.page_source

# Save the page source for inspection
with open('rendered_page.html', 'w', encoding='utf-8') as file:
    file.write(page_source)

driver.quit()

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(page_source, 'html.parser')

# Create a directory to save the images
os.makedirs('dune_card_images', exist_ok=True)

# Find all image tags
img_tags = soup.find_all('img')

# Print the number of images found and some details for debugging
print(f"Found {len(img_tags)} images on the page.")
for img in img_tags[:10]:  # Print details of the first 10 images for inspection
    print(f"Image: {img.get('alt')}, Source: {img.get('src')}")

# Filter images based on the specific pattern observed
card_img_tags = [img for img in img_tags if img.get('src') and 'key=card-medium' in img.get('src')]

# Print the number of card images found
print(f"Found {len(card_img_tags)} card images.")

# Download each image
for img in card_img_tags:
    img_url = urljoin(url, img['src'])
    alt_text = img.get('alt', 'card').replace(' ', '_').replace('/', '_')
    img_name = os.path.join('dune_card_images', f"{alt_text}.jpg")

    # Print the URL and filename for debugging
    print(f"Downloading {img_url} as {img_name}")
    
    try:
        img_data = requests.get(img_url).content
        with open(img_name, 'wb') as f:
            f.write(img_data)
            print(f'Downloaded {img_name}')
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")

print('All images downloaded.')