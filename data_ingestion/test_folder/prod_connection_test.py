from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
# import pandas as pd
from datetime import datetime

# Get env variables
load_dotenv()
mongodb_atlas_uri = os.getenv('MONGODB_ATLAS_URI')


#Get current time
current_time = datetime.now().strftime("%Y_%m_%d-%H-%M-%S")


# ---------------------------- THIS BLOCK CONNECTS TO THE MONGO local_db ATLAS SERVER-------------------------------------------------------------

# Create a new client and connect to the server
production_client = MongoClient(mongodb_atlas_uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
local_client = MongoClient('mongodb://localhost:27017/')

try:
    local_client.admin.command('ping')
    production_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
production_db = production_client["canadian_intership_database"]

# -----------------------------------------------------------------------------------------
#THIS COMMENTED OUT CODE IS FOR A LOCAL CONNECTION TO MONGO local_db:

# Setu varible for mongo db coneections

# client = MongoClient("mongodb://localhost:27017")
# db = local_client["canadian_intership_database"]
# collection = db['opportunities_glassdoor']

local_db = local_client["canadian_intership_database"]
glassdoor_collection = local_db['opportunities_glassdoor']


all_jobs_collection_production = production_db['all_jobs']




glassdoor_documents = list(glassdoor_collection.find())
doc_count_local= glassdoor_collection.count_documents({})

# all_jobs_collection_production.insert_many(glassdoor_documents) #Insert the glassdoor jobs into the live prod db

print(doc_count_local)

#WE NEED TO GET THE MOST RECENT TIMESTAMP FROM LOCAL COLLECTION AND THEN ONLY TAKE DOCUMENTS WTH THAT TIMESTAMP
#the clean file should also recent of jobs to some extent. right now i'm thinking 
most_recent_doc = glassdoor_collection.find_one(sort=[("timestamp", -1)])
most_recent_documents = glassdoor_collection.find({"timestamp":most_recent_doc["timestamp"]})
most_recent_documents_count = glassdoor_collection.count_documents({"timestamp":most_recent_doc["timestamp"]})

print(f"Most recent timestamp: {most_recent_doc}, {most_recent_doc["timestamp"]}")

print(f"count from recent load:{most_recent_documents_count}")

def normalize_job_data(job_document):
    """
    Normalize a job document by ensuring consistent timestamp formats, standardizing string fields,
    and handling missing or inconsistent data.
    
    Args:
    job_document (dict): A single job document containing fields like title, company, timestamp, etc.

    Returns:
    dict: The normalized job document.
    """

    # Normalize timestamp: Ensure the timestamp is in ISO8601 format
    if 'timestamp' in job_document:
        try:
            # Assuming job_document['timestamp'] is a string, convert to datetime object
            if isinstance(job_document['timestamp'], str):
                job_document['timestamp'] = datetime.fromisoformat(job_document['timestamp'])
            # Convert datetime object to ISO8601 string
            job_document['timestamp'] = job_document['timestamp'].isoformat()
        except ValueError:
            # Handle invalid timestamp format by setting it to None or a default value
            job_document['timestamp'] = None
    else:
        # Add a default timestamp if missing
        job_document['timestamp'] = datetime.now().isoformat()
# for i in range(10,20):
    # print(glassdoor_documents[i])
    return job_document

n_data=normalize_job_data(most_recent_doc)
print(f"normalized data: {n_data}")