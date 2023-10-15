from fastapi import FastAPI, HTTPException
from models import Item, Task, Repo
from typing import List, Any
from helper.taskHelper import generate_task_id
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient("mongodb://localhost:27017/")  
db = client["raja"]  

# TASK ENDPOINTS

@app.get("/tasks", response_model=List[Any])
async def get_all_tasks():
    tasks = []
    async for task in db.tasks.find():
        task["_id"] = str(task["_id"])
        tasks.append(task)
    return tasks

@app.post("/create-task", response_model=Task)
async def create_task(task_data: Task):
    try:
        task_id = await generate_task_id(db.tasks)
        new_task = Task(
            task_id=task_id,
            title=task_data.title,
            description=task_data.description,
            status="todo",
            created_at=str(datetime.datetime.now()),
            updated_at=str(datetime.datetime.now()),
            acceptance_criteria=task_data.acceptance_criteria,
            priority="high",
            user_id="1234"
        )

        result = await db.tasks.insert_one(new_task.dict(by_alias=True))
        return new_task
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/delete-task/{task_id}")
async def delete_task(task_id: str):
    try:
        existing_task = await db.tasks.find_one({"task_id": task_id})
        if existing_task:
            await db.tasks.delete_one({"task_id": task_id})
            return {"message": "Task deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# REPO ENDPOINTS

@app.post("/initialize-repo", response_model=Repo)
async def initialize_repo(repo_data: List[Any]):
    try:
        #Todo: Get repo, read through every file, save to DeepLake, get repo info, save to db
        #Return success
        result = await db.repos.insert_one(repo_data)
        return repo_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get("/get-repo-list", response_model=List[Any])
async def get_repo_list():
    repos = []
    async for repo in db.repos.find():
        repo["_id"] = str(repo["_id"])
        repos.append(repo)
    return repos


# AGENT ENDPOINTS

@app.post("/run-agent", response_model=Task)
async def run_agent(task_data: Task):
    try:
        #TODO: Run Agent
        #Return success
        return task_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    