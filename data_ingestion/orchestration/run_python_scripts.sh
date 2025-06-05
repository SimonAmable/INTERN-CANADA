#!/bin/bash

# Activate the virtual environment
source ~/code/INTERN-CANADA/venv/bin/activate

# Get current date for log file naming (format: YYYYMMDD_HHMMSS)
LOG_DATE=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/root/code/INTERN-CANADA/data_ingestion/logs/log_${LOG_DATE}.log"

# Run the first Python script and log output
python3 /root/code/INTERN-CANADA/data_ingestion/raw/Glassdoor/glassdoor_python.py >> "$LOG_FILE" 2>&1

# Run the second Python script and log output
python3 /root/code/INTERN-CANADA/data_ingestion/clean/temp_clean.py >> "$LOG_FILE" 2>&1

# Deactivate the virtual environment
deactivate
