import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

// Mock API URL (replace with your backend API)
const API_URL = "https://your-backend-api.com/tasks";

const AddTask = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "todo",
    dueDate: "",
  });

  const [activityLog, setActivityLog] = useState([]);

  // Fetch tasks from the database on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      const tasks = response.data;

      // Organize tasks by category
      const organizedTasks = {
        todo: tasks.filter((task) => task.category === "todo"),
        inProgress: tasks.filter((task) => task.category === "inProgress"),
        done: tasks.filter((task) => task.category === "done"),
      };

      setTasks(organizedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

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
      await axios.post(API_URL, task);

      // Update local state
      setTasks((prevTasks) => ({
        ...prevTasks,
        [task.category]: [...prevTasks[task.category], task],
      }));

      // Add to activity log
      setActivityLog((prevLog) => [
        ...prevLog,
        `Task "${task.title}" added to ${task.category}.`,
      ]);

      // Reset form
      setNewTask({ title: "", description: "", category: "todo", dueDate: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId, category) => {
    try {
      // Delete task from the database
      await axios.delete(`${API_URL}/${taskId}`);

      // Update local state
      setTasks((prevTasks) => ({
        ...prevTasks,
        [category]: prevTasks[category].filter((task) => task.id !== taskId),
      }));

      // Add to activity log
      const deletedTask = tasks[category].find((task) => task.id === taskId);
      setActivityLog((prevLog) => [
        ...prevLog,
        `Task "${deletedTask.title}" deleted from ${category}.`,
      ]);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;
    const task = tasks[sourceCategory][source.index];

    // If the task is moved to a different category
    if (sourceCategory !== destinationCategory) {
      // Update task category in the database
      await axios.patch(`${API_URL}/${task.id}`, {
        category: destinationCategory,
      });

      // Update local state
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        newTasks[sourceCategory] = newTasks[sourceCategory].filter(
          (t) => t.id !== task.id
        );
        newTasks[destinationCategory].splice(destination.index, 0, {
          ...task,
          category: destinationCategory,
        });
        return newTasks;
      });

      // Add to activity log
      setActivityLog((prevLog) => [
        ...prevLog,
        `Task "${task.title}" moved from ${sourceCategory} to ${destinationCategory}.`,
      ]);
    } else {
      // Reorder tasks within the same category
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const [removed] = newTasks[sourceCategory].splice(source.index, 1);
        newTasks[destinationCategory].splice(destination.index, 0, removed);
        return newTasks;
      });
    }
  };

  // Determine task color based on due date
  const getTaskColor = (dueDate) => {
    if (!dueDate) return "gray"; // No due date
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return "red"; // Overdue
    if (daysDiff <= 3) return "orange"; // Due soon
    return "gray"; // Not urgent
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Task Management System</h1>

      {/* Add Task Form */}
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

      {/* Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasks).map(([category, tasksInCategory]) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {category === "todo"
                  ? "To-Do"
                  : category === "inProgress"
                  ? "In Progress"
                  : "Done"}
              </h2>
              <Droppable droppableId={category}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {tasksInCategory.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg shadow-sm ${
                              getTaskColor(task.dueDate) === "red"
                                ? "bg-red-50"
                                : getTaskColor(task.dueDate) === "orange"
                                ? "bg-orange-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <h3 className="font-bold">{task.title}</h3>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due: {task.dueDate || "No due date"}
                            </p>
                            <button
                              onClick={() =>
                                handleDeleteTask(task.id, category)
                              }
                              className="mt-2 text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Activity Log */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {activityLog.map((log, index) => (
            <p key={index} className="text-sm text-gray-600">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTask;