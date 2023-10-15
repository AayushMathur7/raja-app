from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str

class Task(BaseModel):
    task_id: str = None
    title: str = None
    description: str = None
    status: str = None
    created_at: str = None
    updated_at: str = None
    acceptance_criteria: str = None
    priority: str = None
    user_id: str = None

class Repo(BaseModel):
    user_id: str = None
    user_email: str = None
    repo_url: str = None