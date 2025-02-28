import React, { useState, useEffect } from 'react';
import './Todo.css';

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    const newTaskObject = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingId ? { ...task, text: editText } : task
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDragStart = (task) => {
    setIsDragging(true);
    setDraggedTask(task);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetId) return;
    
    const tasksCopy = [...tasks];
    const draggedIndex = tasksCopy.findIndex(task => task.id === draggedTask.id);
    const targetIndex = tasksCopy.findIndex(task => task.id === targetId);
    const [removed] = tasksCopy.splice(draggedIndex, 1);
    tasksCopy.splice(targetIndex, 0, removed);
    
    setTasks(tasksCopy);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTask(null);
  };

  const changePriority = (id, priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className={`app-container ${theme}`}>
      <div className="todo-container">
        <div className="header">
          <h1 className="title">Todo List</h1>
          <button 
            onClick={toggleTheme}
            className={`theme-toggle ${theme}`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        
        <form onSubmit={addTask} className="add-form">
          <div className="input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className={`task-input ${theme}`}
            />
            <button 
              type="submit"
              className="add-button"
            >
              Add
            </button>
          </div>
        </form>
    
        <div className="filters">
          <div className="filter-buttons">
            <button 
              onClick={() => setFilter('all')} 
              className={`filter-button ${filter === 'all' ? 'active' : `inactive ${theme}`}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')} 
              className={`filter-button ${filter === 'active' ? 'active' : `inactive ${theme}`}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`filter-button ${filter === 'completed' ? 'active' : `inactive ${theme}`}`}
            >
              Completed
            </button>
          </div>
          {(activeCount > 0 || completedCount > 0) && (
            <div className="stats">
              {activeCount > 0 && <span>{activeCount} Active</span>}
              {completedCount > 0 && <span className="ml-2">{completedCount} Completed</span>}
            </div>
          )}
        </div>
        
        <div className={`task-list ${theme}`}>
          {filteredTasks.length > 0 ? (
            <ul className="list-none m-0 p-0">
              {filteredTasks.map((task) => (
                <li 
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDragOver={(e) => handleDragOver(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`task-item ${theme} ${isDragging && draggedTask?.id === task.id ? 'dragging' : ''}`}
                >
                  <div className="task-content">
                    {editingId === task.id ? (
                    
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`edit-input ${theme}`}
                          autoFocus
                        />
                        <button 
                          onClick={saveEdit}
                          className="save-button"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="task-view">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id)}
                          className="task-checkbox"
                        />
                        <div className="task-text-container">
                          <p className={`task-text ${task.completed ? 'completed' : ''} ${task.priority === 'high' ? 'high-priority' : task.priority === 'low' ? 'low-priority' : ''}`}>
                            {task.text}
                          </p>
                          <p className="task-date">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="task-actions">
                          <select
                            value={task.priority}
                            onChange={(e) => changePriority(task.id, e.target.value)}
                            className={`priority-select ${theme}`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <button 
                            onClick={() => startEdit(task)}
                            className="action-button edit-button"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="action-button delete-button"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="empty-message">No tasks to display</p>
              <p className="empty-hint">
                {filter !== 'all' ? `Try switching to "All" to see everything` : 'Add your first task above'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;