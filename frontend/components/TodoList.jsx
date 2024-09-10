'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { apiFetch } from '@/lib/utils';
import { Trash2, Edit, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const { token } = useAuth();  // Get token from useAuth hook

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const tasks = await apiFetch('/task/', token);  // Fetch tasks
        setTodos(tasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Add new task
  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const newTask = await apiFetch('/task', token, { content: newTodo }, 'POST');  // Send POST request to create task
        setTodos([...todos, newTask]);
        setNewTodo('');
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    }
  };

  // Delete task
  const deleteTodo = async (id) => {
    try {
      await apiFetch(`/task/${id}/`, token, null, 'DELETE');  // Send DELETE request to remove task
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Toggle task completion
  const toggleTodo = async (id, completed) => {
    try {
      const updatedTask = await apiFetch(`/task/${id}/`, token, { status: completed ? 'completed' : 'in_progress' }, 'PUT');
      console.log(updatedTask);
      setTodos(todos.map(todo => (todo.id === id ? updatedTask : todo)));
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  // Save task edit
  const saveEdit = async () => {
    if (editingId !== null) {
      try {
        const updatedTask = await apiFetch(`/task/${editingId}/`, token, { content: editText }, 'PUT');
        setTodos(todos.map(todo => (todo.id === editingId ? updatedTask : todo)));
        setEditingId(null);
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.status === 'completed';
    if (filter === 'uncompleted') return todo.status === 'in_progress';
    return true;
  });

  return (
    <div className="w-full md:w-[28rem] mt-8 p-4 bg-background rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex flex-col mb-4">
        <Textarea
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mb-2 min-h-[60px]"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      <RadioGroup
        value={filter}
        onValueChange={(value) => setFilter(value)}
        className="flex justify-between mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="completed" id="completed" />
          <Label htmlFor="completed">Completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="uncompleted" id="uncompleted" />
          <Label htmlFor="uncompleted">Uncompleted</Label>
        </div>
      </RadioGroup>
      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="flex items-start bg-muted p-2 rounded">
            {editingId !== todo.id && (
              <Checkbox
                checked={todo.status === 'completed'}
                onCheckedChange={() => toggleTodo(todo.id, todo.status !== 'completed')}
                className="mr-2 mt-1"
              />
            )}
            <div className="flex-grow">
              {editingId === todo.id ? (
                <div className="flex flex-col">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="mb-2 min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={saveEdit} variant="ghost" className="mr-1">
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" onClick={cancelEdit} variant="ghost">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <span className={`break-words ${todo.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.content}
                  </span>
                  <div className="flex ml-2">
                    <Button size="icon" onClick={() => startEditing(todo.id, todo.content)} variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={() => deleteTodo(todo.id)} variant="ghost" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
