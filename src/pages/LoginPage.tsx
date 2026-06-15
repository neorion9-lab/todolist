import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)

    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 창이 닫혔습니다. 다시 시도해주세요.')
      } else if (err.code === 'auth/cancelled-popup-request') {
        // 무시: 중복 팝업 요청
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">📋</div>
          <h1>할 일 관리</h1>
          <p className="auth-subtitle">Google 계정으로 간편하게 시작하세요</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="google-logo" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? '로그인 중...' : 'Google로 로그인'}
        </button>

        <div className="auth-divider">
          <span>교사 · 학생 모두 사용 가능</span>
        </div>

        <div className="auth-info">
          <div className="info-item">
            <span className="info-icon">👨‍🏫</span>
            <div>
              <strong>교사</strong>
              <p>할 일을 관리하고 진행 상황을 확인하세요</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎓</span>
            <div>
              <strong>학생</strong>
              <p>과제와 할 일을 체계적으로 정리하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
