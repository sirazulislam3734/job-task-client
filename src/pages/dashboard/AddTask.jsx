import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import AddTaskForm from "./AddTaskForm"; // Import the AddTaskForm component
import Swal from "sweetalert2";

const AddTask = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [activityLog, setActivityLog] = useState([]);

  // Fetch tasks from the database on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://backend-gules-alpha.vercel.app/task");
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

  // Update local state when a new task is added
  const handleTaskAdded = (task) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [task.category]: [...prevTasks[task.category], task],
    }));

    // Add to activity log
    setActivityLog((prevLog) => [
      ...prevLog,
      `Task "${task.title}" added to ${task.category}.`,
    ]);
  };

  // Delete a task
  const handleDeleteTask = async (taskId, category) => {
    try {
      // Delete task from the database
      const res = await axios.delete(`https://backend-gules-alpha.vercel.app/deleteTask/${taskId}`);
      console.log(res.data, "Delete Data");
      if(res.data.deletedCount > 0){
        Swal.fire({
            title: "Good job!",
            text: "Delete successfully!",
            icon: "success",
        });
      }

      // Update local state
      setTasks((prevTasks) => ({
        ...prevTasks,
        [category]: prevTasks[category].filter((task) => task._id !== taskId),
      }));

      // Add to activity log
      const deletedTask = tasks[category].find((task) => task._id === taskId);
      setActivityLog((prevLog) => [
        ...prevLog,
        `Task "${deletedTask.title}" deleted from ${category}.`,
      ]);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle drag-and-drop
  const handleDragEnd = async (result) => {
    console.log("data", result);
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;
    const task = tasks[sourceCategory][source.index];

    // If the task is moved to a different category
    if (sourceCategory !== destinationCategory) {
      // Update task category in the database
      const res = await axios.put(`https://backend-gules-alpha.vercel.app/putTask/${task.id}`, {
        category: destinationCategory,
      });
      console.log(res.data, "Update Data");

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
    <div className="bg-gray-100 md:my-10 my-5 p-4 min-h-screen">
      {/* Add Task Form */}
      <AddTaskForm onTaskAdded={handleTaskAdded} />

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
                        key={task._id}
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
                                handleDeleteTask(task._id, category)
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