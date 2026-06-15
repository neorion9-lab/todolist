import { useState } from 'react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  async function handleToggle() {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    })
  }

  async function handleUpdate() {
    if (editText.trim() === '') return
    await updateDoc(doc(db, 'todos', todo.id), {
      text: editText.trim(),
    })
    setIsEditing(false)
  }

  async function handleDelete() {
    await deleteDoc(doc(db, 'todos', todo.id))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleUpdate()
    if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <button
          className="todo-checkbox"
          onClick={handleToggle}
          aria-label={todo.completed ? '완료 취소' : '완료 처리'}
        >
          <span className="checkbox-icon">{todo.completed ? '✓' : ''}</span>
        </button>

        {isEditing ? (
          <input
            className="todo-edit-input"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
            {todo.text}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <button className="btn-icon btn-edit" onClick={() => setIsEditing(true)} aria-label="수정">
            ✏️
          </button>
        )}
        <button className="btn-icon btn-delete" onClick={handleDelete} aria-label="삭제">
          🗑️
        </button>
      </div>
    </li>
  )
}
