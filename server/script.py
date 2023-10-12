from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["raja"]  

# Define the task
task = {
    "title": "Sample Task",
    "description": "This is a sample task description.",
    "assigned_to": "5f50a782d48d419171297a85",  # Assuming this is the ObjectId of a user
    "status": "pending",
    "created_at": datetime.now(),
    "updated_at": datetime.now()
}

# Insert the task
result = db.tasks.insert_one(task)
print(f"Task inserted with ID: {result.inserted_id}")
