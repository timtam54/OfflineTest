"use client"

import type React from "react"

import { useSyncExternalStore } from "react"
import { useState } from "react"
import { useTodoStore } from "./hooks/useTodoStore"

interface Todo {
  id: number
  task: string
}

export default function TodoApp() {
  const { todos, addTodo, deleteTodo } = useTodoStore()
  const [newTask, setNewTask] = useState("")

  // Handle online/offline status using useSyncExternalStore
  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback)
      window.addEventListener("offline", callback)
      return () => {
        window.removeEventListener("online", callback)
        window.removeEventListener("offline", callback)
      }
    },
    () => navigator.onLine,
    () => true,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      addTodo({
        id: Date.now(),
        task: newTask.trim(),
      })
      setNewTask("")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {todos.map((todo:any) => (
          <li key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <span>{todo.task}</span>
            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

