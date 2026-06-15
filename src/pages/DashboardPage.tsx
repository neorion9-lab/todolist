import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import TodoItem from '../components/TodoItem'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  userId: string
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const { currentUser, userRole, logout } = useAuth()

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[]
      setTodos(todosData)
    })

    return unsubscribe
  }, [currentUser])

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (newTodo.trim() === '' || !currentUser) return

    await addDoc(collection(db, 'todos'), {
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      userId: currentUser.uid,
    })

    setNewTodo('')
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodoCount = todos.filter((t) => !t.completed).length
  const completedTodoCount = todos.filter((t) => t.completed).length

  const roleLabel = userRole === 'teacher' ? '교사' : '학생'
  const roleEmoji = userRole === 'teacher' ? '👨‍🏫' : '🎓'

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📋 할 일 관리</h1>
          <span className="user-badge">
            {roleEmoji} {roleLabel}
          </span>
        </div>
        <div className="header-right">
          <span className="user-email">{currentUser?.email}</span>
          <button className="btn btn-ghost" onClick={logout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="todo-input"
          />
          <button type="submit" className="btn btn-primary">
            추가
          </button>
        </form>

        <div className="todo-stats">
          <div className="stat">
            <span className="stat-number">{todos.length}</span>
            <span className="stat-label">전체</span>
          </div>
          <div className="stat">
            <span className="stat-number">{activeTodoCount}</span>
            <span className="stat-label">진행 중</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedTodoCount}</span>
            <span className="stat-label">완료</span>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            진행 중
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="todo-empty">
              <span className="empty-icon">🎉</span>
              <p>{filter === 'all' ? '할 일을 추가해보세요!' : '해당하는 항목이 없습니다.'}</p>
            </li>
          ) : (
            filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}
        </ul>
      </main>
    </div>
  )
}
