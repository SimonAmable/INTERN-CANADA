###########################################
# Required Dependencies
###########################################
# - selenium: Web scraping and automation
# - pymongo: MongoDB database operations
# - python-dotenv: Environment variable management
# - webdriver_manager: Chrome driver management
# - beautifulsoup4: HTML parsing


# Import Basic Python Libraries
import time
from datetime import datetime
import json
import logging
import os
# Selenium imports
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException, NoAlertPresentException, StaleElementReferenceException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
# env
from dotenv import load_dotenv
#SOUP
from bs4 import BeautifulSoup
# Webdriver Manager
from webdriver_manager.chrome import ChromeDriverManager  # type: ignore

###########################################
# Environment Setup & Configuration
###########################################
# Load credentials and connection strings from .env file
load_dotenv()
email = os.getenv('GLASSDOOR_EMAIL')
password = os.getenv('GLASSDOOR_PASSWORD')
mongodb_atlas_uri = os.getenv('MONGODB_ATLAS_URI')

# Initialize MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["canadian_intership_database"]
collection = db['opportunities_glassdoor']

# Delete all documents in the collection before starting a new ingestion
timestamp = datetime.now()
job_search_input = "Intern"

# collection.insert_one({"date-ingested-timestamp": timestamp, "status": "OK"})

###########################################
# Helper Functions
###########################################
def handle_possible_popup(driver):
    """
    Handles various types of popup dialogs that might appear during scraping.
    Attempts to close popups or save job alerts if they appear.
    """
    try:
        close_button = WebDriverWait(driver, 1).until(EC.element_to_be_clickable((By.XPATH, "//div[@role='dialog']//button[@class='CloseButton']")))
        save_job_alert_button = WebDriverWait(driver, 1).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test="job-alert-modal-cta-save"]')))
        close_button.click()
        save_job_alert_button.click()
        print(f"Clicked the close or save button.")
    except (TimeoutException, NoSuchElementException):
        print(f"No alert button found or unable to click it, safely pass")
    except Exception as e:
        print(f"An unexpected error occurred trying to click the close button.")

def close_overlay(driver, timeout=10):
    """
    Closes modal overlays that might block interaction with the page.
    Args:
        driver: Selenium WebDriver instance
        timeout: Maximum time to wait for overlay (seconds)
    """
    try:
        overlay = WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.CLASS_NAME, "modal_ModalOverlay__DXtn2")))
        close_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Cancel"]')
        close_button.click()
        WebDriverWait(driver, timeout).until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal_ModalOverlay__DXtn2")))
        print("Overlay closed successfully")
    except TimeoutException:
        print("No overlay found or unable to close within the timeout period")
    except NoSuchElementException:
        print("Close button not found in the overlay")

# Fucntion to add products in batches to the collection in MongoDB (goal of increasing speed by reducing netwrok requests)
def add_jobs_to_collection(jobs_data):
    batch_size = 100
    for i in range(0, len(jobs_data), batch_size):
        batch = jobs_data[i:i+batch_size]
        try:
            collection.insert_many(batch)
            print(f"Batch {i//batch_size + 1} of {len(jobs_data)//batch_size + 1} inserted successfully")
        except Exception as e:
            print(f"Error inserting batch {i//batch_size + 1}: {e}")
            # Fall back to individual inserts for failed batch
            for job in batch:
                try:
                    collection.insert_one(job)
                except Exception as e:
                    print(f"Failed to insert job: {e}")

###########################################
# Browser Setup
###########################################
# Configure Chrome options for optimal scraping
options = Options()
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
# Uncomment below for headless operation
# options.add_argument("--headless")
options.add_argument("--no-sandbox")  # Bypass OS security model
options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
# driver = webdriver.Chrome(options=options)
actions = ActionChains(driver)

###########################################
# Login Process
###########################################
# Initialize driver and perform Glassdoor login
driver.get("https://www.glassdoor.ca/index.htm")
email_input = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, 'inlineUserEmail')))
email_input.send_keys(email)
email_input.send_keys(Keys.RETURN)
time.sleep(5)

password_input = driver.find_element(By.ID, "inlineUserPassword")
time.sleep(2)
password_input.click()
password_input.send_keys(password)
password_input.send_keys(Keys.RETURN)

print("Login in success")

###########################################
# Job Search & Data Collection
###########################################
# Navigate to jobs page and set search parameters
time.sleep(8)
driver.get("https://www.glassdoor.ca/Job/index.htm")
time.sleep(3)

job_search = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "searchBar-jobTitle")))
# job_search = driver.find_element(By.ID, "searchBar-jobTitle")
job_search.click()
job_search.clear()
job_search.send_keys(job_search_input)
time.sleep(2)

location_search = driver.find_element(By.XPATH, "//input[@aria-labelledby='searchBar-location_label']")
location_search.click()
location_search.clear()
location_search.send_keys("Canada")
time.sleep(2)
location_search.send_keys(Keys.RETURN)
time.sleep(3)

close_overlay(driver)

# Infinite scroll to load all job listings
while True:
    try:
        show_more_jobs_button = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//button[@data-test='load-more']")))
        if show_more_jobs_button.is_displayed():
            actions.move_to_element(show_more_jobs_button).perform()
            show_more_jobs_button.click()
            # time.sleep(0.2)
            handle_possible_popup(driver)
        else:
            break
    except (NoSuchElementException, IndexError):
        print("No more 'Show More Jobs' button found.")
        break
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        break
time.sleep(2)

# We have opened all the jobs, now we can get the data
# Get raw html and save to file
html = driver.page_source
with open("./glassdoor_jobs.html", "w", encoding='utf-8') as file:
    file.write(html)

# Get all the jobs
all_jobs = driver.find_elements(By.CLASS_NAME, "JobsList_jobListItem__wjTHv")
links = driver.find_elements(By.XPATH, "//a[contains(@class, 'JobCard_trackingLink__GrRYn')]")
print(f"Number of jobs found: {len(all_jobs)}")

###########################################
# Job Data Extraction
###########################################
# List to store all job data
all_job_data = []
# Iterate through each job listing and extract details
for job in all_jobs:
    # Initialize variables to prevent undefined reference errors
    current_window = ""
    direct_job_board_raw_html = ""
    
    try:
        actions.move_to_element(job).perform()
        time.sleep(0.5)  # Add small delay for stability
        job.click()
        time.sleep(1)
        handle_possible_popup(driver)

        # Wait for page to load before continuing
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "JobDetails_jobDetailsContainer__y9P3L"))
        )

        try:
            show_desc_button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[class='JobDetails_showMore___Le6L'] span"))
            )
            show_desc_button.click()
            time.sleep(0.5)
        except (TimeoutException, NoSuchElementException):
            print("Show description button not found, continuing...")

        # Extract job details with fallback values
        try:
            description = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, "JobDetails_jobDetailsContainer__y9P3L"))
            )
            description_text = description.text
        except (TimeoutException, NoSuchElementException):
            description_text = "Description not available"

        try:
            company_name = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//h4[@aria-live='polite']"))
            )
            company_name_text = company_name.text
        except (TimeoutException, NoSuchElementException):
            company_name_text = "Company not available"

        try:
            position_title = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//h1[@aria-live='polite']"))
            )
            position_title_text = position_title.text
        except (TimeoutException, NoSuchElementException):
            position_title_text = "Title not available"

        try:
            location = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//div[@data-test='location']"))
            )
            location_text = location.text
        except (TimeoutException, NoSuchElementException):
            location_text = "Location not available"

        try:
            apply_button = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div[id='app-navigation'] div div div div div header div div div div button[type='button']"))
            )
            apply_button_text = apply_button.text
        except (TimeoutException, NoSuchElementException):
            apply_button_text = "Apply button not found"

        try:
            salary = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//body/div/div[@data-app-navigation-hidden-class='Page_hideNav__grCji']/div/div/div/div/div/section/section[1]/div[1]/div[1]"))
            )
            salary_text = salary.text
        except (TimeoutException, NoSuchElementException):
            salary_text = "Salary not available"

        if "Apply on employer site" in apply_button_text:
            print("Apply on employer site found")
            try:
                ActionChains(driver).key_down(Keys.CONTROL).click(apply_button).key_up(Keys.CONTROL).perform()
                time.sleep(1)

                try:
                    skip_for_now_button = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test="skip-registration"]'))
                    )
                    skip_for_now_button.click()
                    print("Skip for now button found.")
                except (TimeoutException, NoSuchElementException):
                    print("No skip for now button found.")

                if len(driver.window_handles) > 1:
                    driver.switch_to.window(driver.window_handles[-1])
                    # Wait for new page to load
                    time.sleep(2)
                    current_window = driver.current_url
                    direct_job_board_raw_html = driver.page_source
                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])
                    # Wait for original window to be active
                    time.sleep(0.5)
            except (WebDriverException, TimeoutException) as e:
                print(f"Error handling apply button: {e}")
                # Ensure we're back on the main window
                if len(driver.window_handles) > 1:
                    for handle in driver.window_handles[1:]:
                        driver.switch_to.window(handle)
                        driver.close()
                    driver.switch_to.window(driver.window_handles[0])
        else:
            print("Easy apply found, no link to apply")

        data = {
            "custom_job_id": f"{company_name_text}_{position_title_text}_{location_text}",
            "title": position_title_text,
            "company": company_name_text,
            "location": location_text,
            "apply_link": current_window,
            "description": description_text,
            "job_board_raw_html": direct_job_board_raw_html,
            "salary": salary_text,
            "timestamp": timestamp
        }
        
        # Add to batch instead of immediate insertion
        all_job_data.append(data)
        if len(all_job_data) >= 100:
            add_jobs_to_collection(all_job_data)
            all_job_data = []

        print(f"Successfully processed Job: {data['company']}")
        
    except (WebDriverException, TimeoutException, StaleElementReferenceException) as e:
        print(f"Selenium error occurred while processing a job: {type(e).__name__}: {e}")
        # Try to recover by going back to main window
        try:
            if len(driver.window_handles) > 1:
                for handle in driver.window_handles[1:]:
                    driver.switch_to.window(handle)
                    driver.close()
                driver.switch_to.window(driver.window_handles[0])
        except:
            pass
    except Exception as e:
        print(f"Unexpected error occurred while processing a job: {type(e).__name__}: {e}")

# Insert any remaining jobs in the batch
if all_job_data:
    add_jobs_to_collection(all_job_data)

# Fuction to extract job data from HTML file
def extract_jobs_from_html(html_file):
    # Read HTML file
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all job cards
    job_cards = soup.find_all('div', class_='JobCard_jobCardContainer__arQlW')
    
    # List to store job data
    jobs_data = []
    
    # Extract info from each job card
    for card in job_cards:
        job = {}
        
        # Extract job title
        title_elem = card.find('a', class_='JobCard_jobTitle__GLyJ1')
        job['title'] = title_elem.text.strip() if title_elem else None
        
        # Extract company name
        company_elem = card.find('span', class_='EmployerProfile_compactEmployerName__9MGcV')
        job['company'] = company_elem.text.strip() if company_elem else None
        
        # Extract location
        location_elem = card.find('div', class_='JobCard_location__Ds1fM')
        job['location'] = location_elem.text.strip() if location_elem else None
        
        # Extract salary if available
        salary_elem = card.find('div', class_='JobCard_salaryEstimate__QpbTW')
        job['salary'] = salary_elem.text.strip() if salary_elem else None
        
        # Extract posting date
        date_elem = card.find('div', class_='JobCard_listingAge__jJsuc')
        job['posting_date'] = date_elem.text.strip() if date_elem else None
        
        # Extract job link
        link_elem = card.find('a', class_='JobCard_trackingLink__HMyun')
        job['patial_link'] = link_elem.get('href') if link_elem else None
        
        # Add timestamp
        job['extracted_at'] = datetime.now().isoformat()
        
        jobs_data.append(job)
    
    return jobs_data

# Join extracted data with the data we pulled into the collection
jobs_data = extract_jobs_from_html('glassdoor_jobs.html')

# add the data to the collection in object form after joining by custom_job_id
for job in jobs_data:
    custom_job_id = f"{job['company']}_{job['title']}_{job['location']}"
    job_data = collection.find_one({"custom_job_id": custom_job_id})
    if job_data:
        additional_data = {key: job[key] for key in job if key not in job_data}
        job_data.update(additional_data)
        collection.update_one({"custom_job_id": custom_job_id}, {"$set": job_data})
    else:
        print(f"Job not found in the collection: {custom_job_id}")

###########################################
# Cleanup
###########################################
# Close browser and finish execution

time.sleep(2)
driver.quit()
print("Glassdoor job ingestion completed successfully")

