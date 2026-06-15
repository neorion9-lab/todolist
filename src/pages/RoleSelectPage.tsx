import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleSelectPage() {
  const [selected, setSelected] = useState<'teacher' | 'student' | null>(null)
  const [loading, setLoading] = useState(false)
  const { selectRole, currentUser } = useAuth()
  const navigate = useNavigate()

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)
    try {
      await selectRole(selected)
      navigate('/dashboard')
    } catch {
      // 에러 처리
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">🎭</div>
          <h1>역할 선택</h1>
          <p className="auth-subtitle">
            안녕하세요, {currentUser?.displayName || '사용자'}님!<br />
            역할을 선택해주세요
          </p>
        </div>

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${selected === 'teacher' ? 'active' : ''}`}
            onClick={() => setSelected('teacher')}
          >
            <span className="role-icon">👨‍🏫</span>
            <span className="role-label">교사</span>
            <span className="role-desc">할 일을 관리하고 진행 상황을 확인</span>
          </button>
          <button
            type="button"
            className={`role-btn ${selected === 'student' ? 'active' : ''}`}
            onClick={() => setSelected('student')}
          >
            <span className="role-icon">🎓</span>
            <span className="role-label">학생</span>
            <span className="role-desc">과제와 할 일을 체계적으로 정리</span>
          </button>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleConfirm}
          disabled={!selected || loading}
          style={{ marginTop: '1.5rem' }}
        >
          {loading ? '설정 중...' : '시작하기'}
        </button>
      </div>
    </div>
  )
}
