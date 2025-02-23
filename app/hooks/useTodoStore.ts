"use client"

import { useState, useEffect } from "react"

interface Todo {
  id: number
  task: string
}

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TodoDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" })
      }
    }
  })
}

export const useTodoStore = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  // Initialize and load todos from IndexedDB
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const db = (await initDB()) as IDBDatabase
        const transaction = db.transaction(["todos"], "readonly")
        const store = transaction.objectStore("todos")
        const request = store.getAll()

        request.onsuccess = () => {
          setTodos(request.result)
        }
      } catch (error) {
        console.error("Error loading todos:", error)
      }
    }

    loadTodos()
  }, [])

  const addTodo = async (todo: Todo) => {
    try {
      const db = (await initDB()) as IDBDatabase
      const transaction = db.transaction(["todos"], "readwrite")
      const store = transaction.objectStore("todos")
      await store.add(todo)
      setTodos((prev) => [...prev, todo])
    } catch (error) {
      console.error("Error adding todo:", error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const db = (await initDB()) as IDBDatabase
      const transaction = db.transaction(["todos"], "readwrite")
      const store = transaction.objectStore("todos")
      await store.delete(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  return { todos, addTodo, deleteTodo }
}

