import { useState } from "react";

function App() {
  const [openSection, setOpenSection] = useState({
    taskList: false,
    tasks: true,
    completed: true,
  })

  const [tasks, setTasks] = useState([])
  const [sortType, setSortType] = useState("date"); // Priority
  const [sortOrder, setSortOrder] = useState("asd"); // desc

  function toggleTaskTable(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  function addTask(task) {
    setTasks([...tasks, {...task, completed: false, id: Date.now() }]);
  }

  function makeComplete(id) {
    setTasks(tasks.map(task => task.id === id ? {...task, completed: true} : task))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task=>task.id !== id));
  }

  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  }

  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === "priority") {
        const priorityOrder = {High: 1, Medium: 2, Low: 3};
        return sortOrder == "asc" 
        ? priorityOrder[a.priority] - priorityOrder[b.priority] 
        : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else {
        return sortOrder === "asc" 
          ? new Date(a.deadlne) - new Date(b.deadlne) 
          : new Date(b.deadlne) - new Date(a.deadlne); 
      }
    });
  }

  const activeTasks = sortTask(tasks.filter(task => !task.completed));
  const completedTasks = tasks.filter(task => task.completed);

  console.log(tasks);

  return (
    <div className="app">
      <div className="task-container">
        <h1>Task list with Priority</h1>
        <button className={`close-button ${openSection.taskList ? "open" : ""}`} onClick={()=>toggleTaskTable("taskList")}>+</button>
        {openSection.taskList && <TaskForm addTask={addTask}/>}
      </div>
      <div className="task-container">
        <h2>Tasks:</h2>
        <button className={`close-button ${openSection.tasks ? "open" : ""}`} onClick={()=>toggleTaskTable("tasks")}>+</button>
        {
          openSection.tasks && (
            <>
            <div className="sort-controls">
              <button className={`sort-button ${sortType === "date" ? "active" : ""} `} onClick={()=> toggleSortOrder("date")}>By Date {sortType === "date" && (sortOrder === "asc" ? "\u2191" : "\u2193")}</button>
              <button className={`sort-button ${sortType === "priority" ? "active" : ""}`} onClick={()=> toggleSortOrder("priority")}>By Priority {sortType === "priority" && (sortOrder === "asc" ? "\u2191" : "\u2193")}</button>
            </div>
            <TaskList activeTasks={activeTasks} deleteTask={deleteTask} makeComplete={makeComplete}/>
            </>
          )
        }
      </div>
      <div className="completed-task-container">
        <h2>Completed Tasks</h2>
        <button className={`close-button ${openSection.completed ? "open" : ""}`} onClick={()=>toggleTaskTable("completed")}>+</button>
        {openSection.completed && <CompletedTaskList completedTasks={completedTasks} deleteTask={deleteTask}/>}
      </div>
      <Footer />
    </div>
  );
}

function TaskForm({addTask}){
  const [title, setTitle] = useState("");
  const [priority, setPriorty] = useState("Low");
  const [deadlne, setDeadlne] = useState(""); 

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadlne) {
      addTask({title, priority, deadlne});
      setTitle("");
      setPriorty("Low");
      setDeadlne("");
    }
  }

  return (
    <form action="" className="task-form" onSubmit={handleSubmit}>
      <input type="text" value={title} placeholder="Task title" required onChange={(e) => setTitle(e.target.value)}/>
      <select value={priority} required onChange={(e)=>setPriorty(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input type="date" value={deadlne} required onChange={(e)=>setDeadlne(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  )
}

function TaskList({activeTasks, deleteTask, makeComplete}) {
  return (
    <ul className="task-list">
      {
        activeTasks.map(task=> <TaskItem task={task} key={task.id} deleteTask={deleteTask} makeComplete={makeComplete}/>)
      }
    </ul>
  )
}

function CompletedTaskList({completedTasks, deleteTask}) {
  return (
    <ul className="completed-task-list">
      {
        completedTasks.map(task => <TaskItem task={task} key={task.id} deleteTask={deleteTask}/>)
      }
    </ul>
  )
}

function TaskItem({task, deleteTask, makeComplete}) {

  return (
    <li className={`task-item ${task.priority.toLowerCase()}`}>
      <div className="task-info">
        <div>{task.title} <strong>{task.priority}</strong></div>
        <div className="task-deadline">Due: {new Date(task.deadlne).toLocaleDateString()}</div>
      </div>
      <div className="task-buttons">
        {
          !task.completed && (
            <button className="complete-button" onClick={()=>makeComplete(task.id)}>Complete</button>
          ) 
        }
        <button className="delete-button" onClick={()=>deleteTask(task.id)}>Delete</button>
      </div>
    </li>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Technologies and React concepts used: React, JSX, props, useState, component composition,
        conditional rendering, array methods (map, filter), event handling.
      </p>
    </footer>
  )
}

export default App;
