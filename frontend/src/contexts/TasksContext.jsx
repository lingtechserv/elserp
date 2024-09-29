import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasksData, setTasksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasksData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/tasks');
      setTasksData(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tasksData.length === 0) {
      fetchTasksData();
    }
  }, [tasksData.length, fetchTasksData]);

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      const newTask = response.data.task;
      setTasksData(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, taskData);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TasksContext.Provider value={{ tasksData, fetchTasksData, addTask, updateTask, deleteTask, isLoading }}>
      {children}
    </TasksContext.Provider>
  );
};
