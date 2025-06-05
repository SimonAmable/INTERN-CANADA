# temp_clean.py
# Purpose: Clean and normalize Glassdoor job data, export to JSON/CSV, and update MongoDB Atlas production database.

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import csv
import json
import re
from datetime import datetime

# Load environment variables from .env file
load_dotenv()
mongodb_atlas_uri = os.getenv('MONGODB_ATLAS_URI')

# Generate a timestamp for file naming
current_time = datetime.now().strftime('%Y_%m_%d_T-h%H')
print(f"Time: {current_time}")

# ------------------------------ MongoDB Connections ------------------------------
try:
    # Connect to MongoDB Atlas (production)
    production_client = MongoClient(mongodb_atlas_uri, server_api=ServerApi('1'))
    production_client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas.")
except Exception as e:
    print(e)

production_db = production_client["canadian_intership_database"]

# Connect to glassdoor MongoDB collection (for reading raw data)
glassdoor_collection = production_db['opportunities_glassdoor']

# Target collection in production
all_jobs_collection_production = production_db['all_jobs']

# ------------------------------ Utility Functions ------------------------------
def save_documents_to_csv(documents, csv_file_name):
    """Save a list of dictionaries to a CSV file."""
    if documents:
        keys = documents[0].keys()
        with open(csv_file_name, 'w', newline='', encoding='utf-8') as csvfile:
            csv_writer = csv.DictWriter(csvfile, fieldnames=keys)
            csv_writer.writeheader()
            csv_writer.writerows(documents)
        print(f"Data saved to {csv_file_name}")
    else:
        print("No documents found.")

def save_documents_to_json(documents, json_file_name):
    """Save a list of dictionaries to a JSON file, converting ObjectIds to strings."""
    for doc in documents:
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])
    with open(json_file_name, 'w', encoding='utf-8') as jsonfile:
        json.dump(documents, jsonfile, indent=4, ensure_ascii=False)
    print(f"Data saved to {json_file_name}")

def normalize_job_data(job_document):
    """Ensure the 'timestamp' field is ISO formatted and present."""
    if 'timestamp' in job_document:
        try:
            if isinstance(job_document['timestamp'], str):
                job_document['timestamp'] = datetime.fromisoformat(job_document['timestamp'])
            job_document['timestamp'] = job_document['timestamp'].isoformat()
        except ValueError:
            job_document['timestamp'] = None
    else:
        job_document['timestamp'] = datetime.now().isoformat()
    return job_document

# ------------------------------ Data Extraction and Cleaning ------------------------------
# Fetch all Glassdoor job documents from local DB
glassdoor_documents = list(glassdoor_collection.find())
# Normalize timestamps and clean data
cleaned_glassdoor_documents = [normalize_job_data(d) for d in glassdoor_documents]

# ------------------------------ File Paths for Output ------------------------------
json_dir = os.path.join(os.getcwd(), 'data_ingestion/clean/json_save_files')
all_jobs_json = os.path.join(json_dir, f'save_all_jobs_{current_time}.json')
glassdoor_json = os.path.join(json_dir, f'save_glassdoor_documents_{current_time}.json')

# Ensure output directory exists
os.makedirs(json_dir, exist_ok=True)
print(f"Directory {json_dir} ready.")

# Save cleaned data to JSON files
save_documents_to_json(cleaned_glassdoor_documents, all_jobs_json)
save_documents_to_json(cleaned_glassdoor_documents, glassdoor_json)

# ------------------------------ Find Most Recent Load ------------------------------
# Get the most recent document by timestamp
most_recent_doc = glassdoor_collection.find_one(sort=[("timestamp", -1)])
recent_timestamp = most_recent_doc["timestamp"]
# Get all documents with the most recent timestamp
recent_documents = glassdoor_collection.find({"timestamp": recent_timestamp})
recent_count = glassdoor_collection.count_documents({"timestamp": recent_timestamp})

print(f"Most recent timestamp: {most_recent_doc}")
print(f"Recent load count: {recent_count}")

# ------------------------------ Aggregation: Most Recent Document per Title ------------------------------
pipeline = [
    {'$sort': {'timestamp': -1}},
    {'$group': {
        '_id': '$title',
        'most_recent_document': {'$first': '$$ROOT'}
    }},
    {'$replaceRoot': {'newRoot': '$most_recent_document'}}
]

most_recent_unique_titles = list(glassdoor_collection.aggregate(pipeline))
print(f"Aggregated document count: {len(most_recent_unique_titles)}")

# Save aggregation result to JSON
aggregated_jobs_json = os.path.join(json_dir, f'aggregation_jobs_{current_time}.json')
for item in most_recent_unique_titles:
    if 'timestamp' in item:
        item['timestamp'] = str(item['timestamp'])
    if 'timestamp_as_date' in item:
        item['timestamp_as_date'] = str(item['timestamp_as_date'])

save_documents_to_json(most_recent_unique_titles, aggregated_jobs_json)

# ------------------------------ Update Production Database ------------------------------ ewww, this should be a smart upsert that handles deletes and updates
# Remove all existing documents in production 'all_jobs' collection
result = all_jobs_collection_production.delete_many({})
print(result.deleted_count, "documents deleted.")
# Insert the most recent load into production
insert_result = all_jobs_collection_production.insert_many(recent_documents)
print(f"{len(insert_result.inserted_ids)} documents inserted.")

# ------------------------------ Salary Field Normalization ------------------------------
def extract_salary(text):
    """Extract salary value and optional timeframe from a string (e.g., '$20/hr', '$60K/yr')."""
    if not isinstance(text, str):
        return None
    match = re.search(r'\$\d+[KkMm]?/?(yr|hr)?', text)
    return match.group(0) if match else None

def add_timeframe(salary):
    """Add '/yr' or '/hr' to salary if missing, based on value format."""
    if salary:
        if "K" in salary.upper():
            return salary if "/yr" in salary.lower() else salary + "/yr"
        return salary if "/hr" in salary.lower() else salary + "/hr"
    return salary

# Update salary fields in production collection
# Only update if salary is valid and not 'Unknown'
documents = list(all_jobs_collection_production.find({"salary": {"$exists": True}}))
for doc in documents:
    salary_text = doc.get("salary", "")
    extracted_salary = extract_salary(salary_text)
    final_salary = add_timeframe(extracted_salary)
    salary_int = int(re.findall(r'\d+', extracted_salary)[0]) if extracted_salary else 0

    if salary_int < 10 or "Unknown" in salary_text:
        update = {"salary": ""}
        print(f"Invalid salary for {doc['_id']}. Setting to empty.")
    elif final_salary:
        update = {"salary": final_salary}
        print(f"Updated salary for {doc['_id']} to {final_salary}")
    else:
        continue

    all_jobs_collection_production.update_one({"_id": doc["_id"]}, {"$set": update})

# ------------------------------ Cleanup ------------------------------
# Close all database connections
production_client.close()
