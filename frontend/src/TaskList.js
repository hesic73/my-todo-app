import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onFetchTasks }) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onFetchTasks={onFetchTasks} />
      ))}
    </div>
  );
}

export default TaskList;
