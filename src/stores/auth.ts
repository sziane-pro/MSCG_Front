import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(localStorage.getItem('user'))
  const isAuthenticated = ref(!!localStorage.getItem('user'))

  const login = async (email: string, password: string) => {
    // 🔁 Simulation d’une vraie authentification
    if (email === 'test@example.com' && password === 'password') {
      user.value = email
      isAuthenticated.value = true
      localStorage.setItem('user', email)
    } else {
      throw new Error('Identifiants invalides')
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})
