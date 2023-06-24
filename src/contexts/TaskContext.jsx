import { createContext, useState } from 'react'

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Function to add a new task
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Function to update an existing task
  const updateTask = (taskIndex, updatedTask) => {
    setTasks(prevTasks => prevTasks.map((task, index) => {
      if (index === taskIndex) {
        return updatedTask;
      } else {
        return task;
      }
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};
