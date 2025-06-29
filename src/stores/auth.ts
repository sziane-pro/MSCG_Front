import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService, { type User, type LoginResponse } from '@/services/apiService'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const login = async (email: string, password: string): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const response: LoginResponse = await apiService.login(email, password)
      
      // Sauvegarder le token et les infos utilisateur
      token.value = response.token
      user.value = response.user
      
      // Persister dans localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
    } catch (err: any) {
      error.value = err.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (
    email: string, 
    password: string, 
    firstname: string,
    lastname: string
  ): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const response: LoginResponse = await apiService.register(email, password, firstname, lastname)
      
      // Sauvegarder le token et les infos utilisateur (auto-login après inscription)
      token.value = response.token
      user.value = response.user
      
      // Persister dans localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    // Nettoyer l'état
    user.value = null
    token.value = null
    error.value = null
    
    // Nettoyer localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = (): void => {
    try {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données utilisateur:', err)
      logout()
    }
  }

  const refreshUserProfile = async (): Promise<void> => {
    if (!token.value) return
    
    try {
      const updatedUser = await apiService.getCurrentUser()
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil:', err)
      // Si le token est invalide, déconnecter
      if (err.message.includes('401') || err.message.includes('token')) {
        logout()
      }
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  // Initialiser le store avec les données du localStorage
  loadUserFromStorage()

  return {
    // État
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    refreshUserProfile,
    clearError,
    loadUserFromStorage
  }
})
