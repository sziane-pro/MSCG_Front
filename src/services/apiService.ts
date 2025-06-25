// Service API centralisé pour toutes les communications avec le backend
const API_BASE_URL = 'http://185.98.139.128:40150'

interface ApiResponse<T = any> {
  message?: string
  data?: T
  error?: string
}

interface LoginResponse {
  message: string
  token: string
  user: {
    id: number
    email: string
    firstname?: string
    lastname?: string
  }
}

interface User {
  id: number
  email: string
  firstname?: string
  lastname?: string
  createdAt: string
  updatedAt: string
}

interface SimulationListItem {
  id: number
  nom: string
  name: string
  date: string
  ca: string
  revenuNet: string
  createdAt: string
  updatedAt: string
}

interface CategoryData {
  name: string
  monthly: number
  annual?: number
}

interface SimulationParameters {
  timeHorizon: number
  adjustmentPeriod: number
  growthRate: number
  coefficient: number
  socialChargesRate: number
  socialChargesMaxBase: number
  microBrutMarginRate: number
}

interface SimulationResults {
  totalMonthlyRevenue: number
  totalVitalCharges: number
  totalComfortCharges: number
  totalOperatingCharges: number
  iterativeChargesResults: any[]
  iterativeRevenueResults: any[]
  iterativeSocialChargesResults: any[]
  finalNetRevenue: number
  finalGrossRevenue: number
}

interface FullSimulation {
  id: number
  name: string
  userId: number
  createdAt: string
  updatedAt: string
  categories: Array<{
    id: number
    name: string
    monthlyAmount: number
    categoryType: 'vital' | 'confort'
  }>
  operatingCharges: Array<{
    id: number
    name: string
    monthlyAmount: number
  }>
  parameters?: SimulationParameters
  results?: SimulationResults
}

interface CreateSimulationData {
  name: string
  categories?: CategoryData[]
  comfortCategories?: CategoryData[]
  operatingCharges?: CategoryData[]
  parameters?: Partial<SimulationParameters>
  results?: Partial<SimulationResults>
}

interface DashboardStats {
  chiffreAffaire: string
  charge: string
  beneficeNet: string
  tauxCharge: string
  nombreSimulations: number
  rawData: {
    totalCA: number
    totalRevenuNet: number
    totalCharges: number
    totalSimulations: number
  }
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    return fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    }).then(response => {
      if (!response.ok) {
        return response.json().catch(() => ({})).then(errorData => {
          throw new Error(errorData.message || `HTTP Error: ${response.status}`)
        })
      }
      return response.json()
    })
  }

  // **AUTHENTIFICATION**
  register(email: string, password: string, firstname?: string, lastname?: string): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstname, lastname })
    })
  }

  login(email: string, password: string): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  getCurrentUser(): Promise<User> {
    return this.fetchApi<User>('/auth/me')
  }

  // **SIMULATIONS - LISTE ET DASHBOARD**
  getUserSimulations(): Promise<SimulationListItem[]> {
    return this.fetchApi<SimulationListItem[]>('/simulations')
  }

  getDashboardStats(): Promise<DashboardStats> {
    return this.fetchApi<DashboardStats>('/simulations/dashboard/stats')
  }

  // **SIMULATIONS - CRUD COMPLET**
  createSimulation(data: CreateSimulationData): Promise<{ simulation: FullSimulation }> {
    return this.fetchApi<{ simulation: FullSimulation }>('/simulations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  getSimulation(id: number): Promise<FullSimulation> {
    return this.fetchApi<FullSimulation>(`/simulations/${id}`)
  }

  updateSimulation(id: number, data: Partial<CreateSimulationData>): Promise<{ simulation: FullSimulation }> {
    return this.fetchApi<{ simulation: FullSimulation }>(`/simulations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  deleteSimulation(id: number): Promise<{ message: string }> {
    return this.fetchApi<{ message: string }>(`/simulations/${id}`, {
      method: 'DELETE'
    })
  }

  // **UTILITAIRES POUR LE FRONTEND**
  
  // Convertir les données frontend vers le format API
  static formatSimulationForApi(frontendData: {
    name: string
    categories: any[]
    comfortCategories: any[]
    operatingCharges: any[]
    coefficient: number
    temporalParams: any
    socialChargesParams: any
    results?: any
  }): CreateSimulationData {
    return {
      name: frontendData.name,
      categories: frontendData.categories.map(cat => ({
        name: cat.name,
        monthly: cat.monthly || 0
      })),
      comfortCategories: frontendData.comfortCategories.map(cat => ({
        name: cat.name,
        monthly: cat.monthly || 0
      })),
      operatingCharges: frontendData.operatingCharges.map(charge => ({
        name: charge.name,
        monthly: charge.monthly || 0
      })),
      parameters: {
        timeHorizon: frontendData.temporalParams?.timeHorizon || 12,
        adjustmentPeriod: frontendData.temporalParams?.adjustmentPeriod || 6,
        growthRate: frontendData.temporalParams?.growthRate || 0,
        coefficient: frontendData.coefficient,
        socialChargesRate: frontendData.socialChargesParams?.microEnterprise?.socialChargesRate || 0.22,
        socialChargesMaxBase: frontendData.socialChargesParams?.enterprise?.socialChargesMaxBase || 45000,
        microBrutMarginRate: frontendData.socialChargesParams?.microEnterprise?.grossMarginRate || 0.30
      },
      results: frontendData.results
    }
  }

  // Convertir les données API vers le format frontend
  static formatSimulationForFrontend(apiData: FullSimulation) {
    const vitalCategories = apiData.categories?.filter(cat => cat.categoryType === 'vital') || []
    const comfortCategories = apiData.categories?.filter(cat => cat.categoryType === 'confort') || []
    
    return {
      id: apiData.id,
      name: apiData.name,
      categories: vitalCategories.map(cat => ({
        name: cat.name,
        monthly: cat.monthlyAmount,
        annual: cat.monthlyAmount * 12
      })),
      comfortCategories: comfortCategories.map(cat => ({
        name: cat.name,
        monthly: cat.monthlyAmount,
        annual: cat.monthlyAmount * 12
      })),
      operatingCharges: (apiData.operatingCharges || []).map(charge => ({
        name: charge.name,
        monthly: charge.monthlyAmount,
        annual: charge.monthlyAmount * 12
      })),
      parameters: apiData.parameters,
      results: apiData.results,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt
    }
  }
}

export default new ApiService()

// Export des types pour utilisation dans les composants
export type {
  LoginResponse,
  User,
  SimulationListItem,
  FullSimulation,
  CreateSimulationData,
  DashboardStats,
  CategoryData,
  SimulationParameters,
  SimulationResults
} 