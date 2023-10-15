import { createContext, useState } from 'react'

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Function to add a new task
  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const initializeTasks = (newTasks) => {
    setTasks(newTasks);
  }

  // Function to update an existing task
    const updateTasks = (updatedTasks) => {
      setTasks(updatedTasks);
    };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, initializeTasks, updateTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
