import { useState, useEffect } from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await FetchTasks();
      setTasks(taskFromServer);
    };

    getTasks();
  }, []);

  // Fetch Tasks
  const FetchTasks = async () => {
    const res = await fetch("http://localhost:500/tasks");
    const data = await res.json();
    return data;
  };
  // Fetch Task
  const FetchTask = async (id) => {
    const res = await fetch(`http://localhost:500/tasks/${id}`);
    const data = await res.json();
    return data;
  };
  // Add Task
  const addTask = async (task) => {
    const res = await fetch("http://localhost:500/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);
  };

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:500/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };
  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskTotoggle = await FetchTask(id);
    const updTask = { ...taskTotoggle, reminder: !taskTotoggle.reminder };
    const res = await fetch(`http://localhost:500/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };
  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "No Tasks To Show"
      )}
    </div>
  );
}

export default App;
