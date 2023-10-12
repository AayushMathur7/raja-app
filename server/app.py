from fastapi import FastAPI, HTTPException
from models import Item
from typing import List, Any
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

client = AsyncIOMotorClient("mongodb://localhost:27017/")  
db = client["raja"]  


@app.get("/tasks", response_model=List[Any])
async def get_all_tasks():
    tasks = await db.tasks.find().to_list(length=100)
    return tasks