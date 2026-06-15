import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

interface AuthContextType {
  currentUser: User | null
  userRole: 'teacher' | 'student' | null
  loading: boolean
  needsRoleSelection: boolean
  loginWithGoogle: () => Promise<void>
  selectRole: (role: 'teacher' | 'student') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid))

    if (userDoc.exists()) {
      setUserRole(userDoc.data().role)
      setNeedsRoleSelection(false)
    } else {
      // 첫 로그인: 역할 선택 필요
      setNeedsRoleSelection(true)
    }
  }

  async function selectRole(role: 'teacher' | 'student') {
    if (!currentUser) return
    await setDoc(doc(db, 'users', currentUser.uid), {
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      role,
      createdAt: new Date().toISOString(),
    })
    setUserRole(role)
    setNeedsRoleSelection(false)
  }

  async function logout() {
    await signOut(auth)
    setUserRole(null)
    setNeedsRoleSelection(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
          setNeedsRoleSelection(false)
        } else {
          setNeedsRoleSelection(true)
        }
      } else {
        setUserRole(null)
        setNeedsRoleSelection(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading,
    needsRoleSelection,
    loginWithGoogle,
    selectRole,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
