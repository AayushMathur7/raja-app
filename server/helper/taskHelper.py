async def generate_task_id(collection):
    # Find the count of existing tasks
    count = await collection.count_documents({})
    next_task_id = f"TASK-{count + 1:03d}"  # Format as TASK-001, TASK-002, etc.
    return next_task_id