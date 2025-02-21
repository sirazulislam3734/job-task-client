import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddTaskForm = ({ onTaskAdded }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "todo",
    dueDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    if (!newTask.title) {
      alert("Title is required!");
      return;
    }

    const task = {
      ...newTask,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    try {
      // Save task to the database
      const {data} =  await axios.post("http://localhost:5000/tasks", task)
      if(data.insertedId){
        Swal.fire({
            title: "success!",
            text: "Add Task Successful!",
            icon: "success",
          });
      }
      // Notify parent component (AddTask) that a new task has been added
      onTaskAdded(task);

      // Reset form
      setNewTask({ title: "", description: "", category: "todo", dueDate: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={newTask.title}
        onChange={handleInputChange}
        className="p-2 border rounded-lg mr-2"
        maxLength={50}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Task Description"
        value={newTask.description}
        onChange={handleInputChange}
        className="p-2 border rounded-lg mr-2"
        maxLength={200}
      />
      <input
        type="date"
        name="dueDate"
        value={newTask.dueDate}
        onChange={handleInputChange}
        className="p-2 border rounded-lg mr-2"
      />
      <select
        name="category"
        value={newTask.category}
        onChange={handleInputChange}
        className="p-2 border rounded-lg mr-2"
      >
        <option value="todo">To-Do</option>
        <option value="inProgress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        onClick={handleAddTask}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskForm;