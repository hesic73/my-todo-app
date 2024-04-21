import React from 'react';
import TaskItem from './TaskItem';


/**
 * @typedef {import('./types/types').Task} Task
 */


/**
 * @param {Object} props 
 * @param {Task[]} props.tasks
 * @param {(number) => void} props.removeTask
 * @param {(Task) => void} props.updateTask
 * @returns {React.ReactElement}
 */
function TaskList({ tasks, removeTask, updateTask }) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} removeTask={removeTask} updateTask={updateTask} />
      ))}
    </div>
  );
}

export default TaskList;
