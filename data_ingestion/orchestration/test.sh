#!/bin/bash

# Get today's date in the format YYYY-MM-DD
DATE=$(date +"%Y-%m-%d")

# Activate the virtual environment
source /root/code/venv/bin/activate

# Run the first Python script and redirect output to a date-named file
python /root/code/job__data_ingestion/data_ingestion/raw/Glassdoor/glassdoor_python.py > "/root/code/job__data_ingestion/data_ingestion/logs/glassdoor_output_$DATE.log" 2>&1

# Run the second Python script and redirect output to a date-named file
python /root/code/job__data_ingestion/data_ingestion/clean/temp_clean.py > "/root/code/job__data_ingestion/data_ingestion/logs/glassdoor_output_$DATE.log" 2>&1

# Deactivate the virtual environment
deactivate
