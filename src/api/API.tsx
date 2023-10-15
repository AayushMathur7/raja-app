const BASE_URL = "http://localhost:8000";


const fetchRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const getAllTasks = () => 
fetchRequest(`/tasks`);

export const createTask = (task: any) => 
fetchRequest(`/create-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

export const deleteTask = (id: string) => 
fetchRequest(`/delete-task/${id}`, { 
  method: "DELETE" 
});

