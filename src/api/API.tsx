const BASE_URL = "http://localhost:8000";

export const getAllTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
