#!/bin/bash

# Activate the virtual environment
source /root/code/venv/bin/activate

# Run the first Python script
python /root/code/job__data_ingestion/data_ingestion/raw/Glassdoor/glassdoor_python.py

# Run the second Python script
python /root/code/job__data_ingestion/data_ingestion/clean/temp_clean.py

# Deactivate the virtual environment
deactivate
