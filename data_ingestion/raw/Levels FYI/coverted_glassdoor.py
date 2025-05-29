# %% [markdown]
# # Import Libraires

# %%
# %pip install openai
# %pip install python-dotenv
# %pip install selenium
# %pip install pymongo

# %pip install "pymongo[srv]"

# %%
# import some basic python libaries (operating system, regular expressions, time)
import time
from datetime import datetime
import json
import logging
import os
# import some selenium components to rememeneber by name
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException,NoAlertPresentException,StaleElementReferenceException

#import mongoDB, we may add additional databases in the future for better 

# from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from bs4 import BeautifulSoup
from dotenv import load_dotenv, find_dotenv

#import custom library 


# %% [markdown]
# # Load ENViroment variables

# %%
load_dotenv()
# Get environment variables
email = os.getenv('GLASSDOOR_EMAIL')
password = os.getenv('GLASSDOOR_PASSWORD')
mongodb_atlas_uri = os.getenv('MONGODB_ATLAS_URI')


# %% [markdown]
# # Setup

# %%
# ---------------------------- THIS BLOCK CONNECTS TO MONGO DB ATLAS SRVER-------------------------------------------------------------


# Create a new client and connect to the server
client = MongoClient(mongodb_atlas_uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
db = client["canadian_intership_database"]

# -----------------------------------------------------------------------------------------


# %% [markdown]
# PARAMETERS TO CUSTOMIZE

# %%

#Setup url
login_url = "https://www.glassdoor.ca/index.htm"
jobs_url = "https://www.glassdoor.ca/Job/index.htm"

# Create a connection to the running mongodb instance i have locally
# client = MongoClient("mongodb://localhost:27017")
# db = client["my_database"]

#Delete all documents in the collection before we start a new ingestions, switch to an approach that keeps all historical data once finished
collection = db['opportunities_glassdoor']
# result = collection.delete_many({})
# print(result.deleted_count, " documents deleted.")

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
#search term for glass door
job_search_input ="Intern"



# %%
collection.insert_one({"date-ingested-timestamp":timestamp, "status":"OK"})

# %% [markdown]
# # Functions

# %%
def handle_possible_popup(driver):
    """
    Function that safely handles possible popups that may appear on this page.

    Parameters:
        driver (WebDriver): The WebDriver object
    """    
    try:
        # Wait for the modal to appear and find the close button
        close_button = WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@role='dialog']//button[@class='CloseButton']"))
        )
        save_job_alert_button = WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-test="job-alert-modal-cta-save"]'))
        )
        # Click the close button
        close_button.click()
        save_job_alert_button.click()
        print(f"Clicked the close or save button.")
    except (TimeoutException, NoSuchElementException):
        # No alert button found or unable to click it, safely pass
        print(f"no alert buton found or unable to click it, safely pass")

        pass
    except Exception as e:
        # Log the unexpected exception for debugging
        print(f"An unexpected error occurred trying to click the close button.")
        # print(f"An unexpected error occurred: {e}")
        pass

# def random_sleep(min_time=1, max_time=3):
#     time.sleep(random.uniform(min_time, max_time))


def close_overlay(driver, timeout=10):
    try:
        # Wait for the overlay to be present
        overlay = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.CLASS_NAME, "modal_ModalOverlay__DXtn2"))
        )
        
        # Find and click the close button
        # Note: You may need to adjust this selector based on the actual structure of the overlay
        close_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Cancel"]')
        close_button.click()
        # overlay.click()
        # Wait for the overlay to disappear
        WebDriverWait(driver, timeout).until(
            EC.invisibility_of_element_located((By.CLASS_NAME, "modal_ModalOverlay__DXtn2"))
        )
        
        print("Overlay closed successfully")
    except TimeoutException:
        print("No overlay found or unable to close within the timeout period")
    except NoSuchElementException:
        print("Close button not found in the overlay")

# %%


# %% [markdown]
# # Data Ingestion

# %% [markdown]
# ## first Login

# %%

# Configure webdriver object and ActionsChain object
# do some extra bs so the website thinks we are a real person
# Configure Chrome options

options = Options()
options.headless = True
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
# options.add_argument('--proxy-server=http://your-proxy-server:port')
driver = webdriver.Chrome(options=options)

actions = ActionChains(driver)

# Open the website
driver.get(login_url)


#first we must login
# email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
email_input = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, 'inlineUserEmail')))
# email_input.click()
email_input.send_keys(email)
email_input.send_keys(Keys.RETURN)

# random_sleep()
# submit_button = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "button[type='submit']")))
# submit_button.click()

time.sleep(5)
password_input = driver.find_element(By.ID, "inlineUserPassword")
# password_input = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "/html[1]/body[1]/div[2]/section[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/form[1]/div[1]/div[1]/div[1]/div[1]/input[1]")))
# random_sleep()
time.sleep(2)

password_input.click()
password_input.send_keys(password)
password_input.send_keys(Keys.RETURN)
#HORAYYYYYYY we are logged in


# %% [markdown]
# # OPEN ALL JOBS AND GET DATA

# %%

#once logged in we can now search for jobs
time.sleep(8)
try:
    driver.get(jobs_url)
    time.sleep(3)
except Exception as e:
    print(f"Error occurred while navigating to {jobs_url}: {e}")
time.sleep(3)

# %%

#Here we will search based on the variables earlier defined

job_search = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Find your perfect job']")
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
#The page should now be loaded with the search results

close_overlay(driver)


# First, find the 'Show More Jobs' button and click it until all jobs are open
while True:
    try:
        show_more_jobs_button = driver.find_element(By.XPATH, "//button[@data-test='load-more']")
        if show_more_jobs_button.is_displayed():
            actions.move_to_element(show_more_jobs_button).perform()
            show_more_jobs_button.click()
            time.sleep(1)
            handle_possible_popup(driver)
        else:
            break
    except (NoSuchElementException, IndexError):
        # If the button is not found, break the loop
        print("No more 'Show More Jobs' button found.")
        break
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        break
# All jobs are now open on the page
time.sleep(2)

# Get a clickable link to all the jobs on the page
all_jobs = driver.find_elements(By.CLASS_NAME, "JobsList_jobListItem__wjTHv")
links = driver.find_elements(By.XPATH, "//a[contains(@class, 'JobCard_trackingLink__GrRYn')]")
print(f"Number of jobs found: {len(all_jobs)}")

# Loop through all the jobs and extract the details
for job in all_jobs:
    try:

        # Click each job
        actions.move_to_element(job).perform()
        #print(job.text)
        time.sleep(1)
        job.click()
        time.sleep(1)
        handle_possible_popup(driver)
        time.sleep(1)


        # Extract and proccees job details here
        show_desc_button = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[class='JobDetails_showMore___Le6L'] span")))
        show_desc_button.click()

        time.sleep(2)
        description = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "JobDetails_jobDetailsContainer__y9P3L")))
        description_text = description.text
        # print(description_text)
        
        company_name = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h4[@aria-live='polite']")))
        company_name_text = company_name.text
        print(company_name_text)

        position_title = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h1[@aria-live='polite']")))
        position_title_text = position_title.text
        print(position_title_text)

        location = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//div[@data-test='location']")))
        location_text = location.text
        print(location_text)

        apply_button = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "JobDetails_applyButtonContainer__L36Bs")))
        apply_button_text = apply_button.text
        print(F"Apply link: {apply_button_text}")

        salary = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//body/div/div[@data-app-navigation-hidden-class='Page_hideNav__grCji']/div/div/div/div/div/section/section[1]/div[1]/div[1]")))
        salary_text = salary.text
        print(salary_text)
        
        
        current_window = ""
        if ("Apply on employer site" in apply_button_text ):
            print("Apply on employer site found")
            # Click the apply button, save url then close page
            ActionChains(driver).key_down(Keys.CONTROL).click(apply_button).key_up(Keys.CONTROL).perform() #can be replaced with a normal click proabably
            time.sleep(5)

            #check for popups
            try:
                skip_for_now_button = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'button[data-test="skip-registration"]')))
                skip_for_now_button.click()
                print("Skip for now button found.")
                time.sleep(5)
            except (NoSuchElementException, IndexError):
                print("No skip for now button found.")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                pass
                # if windows is opened save url and close
            if (len(driver.window_handles) > 1):
                # Get the current window handle
                driver.switch_to.window(driver.window_handles[-1])
                current_window = driver.current_url
                # Switch to the new window
                # Close the current window
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
        else:
            print ("Easy apply found, no link to apply")
                
        

        # print (apply_button_text)
        # print(current_window)
        # print (description_text)
        # Insert the job details into the database
        data = {
            "title": position_title_text,
            "company": company_name_text,
            "location": location_text,
            "apply_link": current_window,
            "description": description_text,
            "timestamp": timestamp
        }
        print(data)
        collection.insert_one(data)
    except Exception as e:
        print(f"Error occurred while processing a job: {e}")
        
        

# Close driver
time.sleep(2)
driver.quit()

# %%



