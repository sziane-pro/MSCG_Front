// Service API centralisé pour toutes les communications avec le backend
const API_BASE_URL = 'http://localhost:5002'

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
    firstname: string    // Obligatoire maintenant
    lastname: string     // Obligatoire maintenant
  }
}

interface User {
  id: number
  email: string
  firstname: string      // Obligatoire maintenant
  lastname: string       // Obligatoire maintenant
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
  bestOption?: string    // Nouveau champ
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
  id: number
  simulationId: number
  totalMonthlyVital: number
  totalMonthlyComfortCharges: number
  totalMonthlyImprovedIncome: number
  totalOperatingCharges: number
  breakevenThreshold: number
  microEnterpriseRevenue: number
  enterpriseRevenue: number
  bestOption: 'micro' | 'entreprise' | 'egalite'
  calculatedAt: string
}

interface FullSimulation {
  id: number
  name: string
  userId: number
  createdAt: string
  updatedAt: string
  results?: SimulationResults
}

interface CreateSimulationData {
  name: string
  totalMonthlyVital?: number
  totalMonthlyComfortCharges?: number
  totalMonthlyImprovedIncome?: number
  totalOperatingCharges?: number
  breakevenThreshold?: number
  microEnterpriseRevenue?: number
  enterpriseRevenue?: number
  bestOption?: 'micro' | 'entreprise' | 'egalite'
}

interface DashboardStats {
  chiffreAffaire: string
  charge: string
  beneficeNet: string
  tauxCharge: string
  rawData: {
    totalCA: number
    totalCharges: number
    totalRevenuNet: number
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
  register(email: string, password: string, firstname: string, lastname: string): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstname, lastname })
    })
  }

  login(email: string, password: string): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  getCurrentUser(): Promise<User> {
    return this.fetchApi<User>('/api/auth/me')
  }

  // **SIMULATIONS - LISTE ET DASHBOARD**
  getUserSimulations(): Promise<SimulationListItem[]> {
    return this.fetchApi<SimulationListItem[]>('/api/simulations')
  }

  getDashboardStats(): Promise<DashboardStats> {
    return this.fetchApi<DashboardStats>('/api/simulations/dashboard/stats')
  }

  // **SIMULATIONS - CRUD CONFORME AU MPD**
  createSimulation(data: CreateSimulationData): Promise<{ simulation: FullSimulation }> {
    return this.fetchApi<{ simulation: FullSimulation }>('/api/simulations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  getSimulation(id: number): Promise<FullSimulation> {
    return this.fetchApi<FullSimulation>(`/api/simulations/${id}`)
  }

  updateSimulation(id: number, data: Partial<CreateSimulationData>): Promise<{ simulation: FullSimulation }> {
    return this.fetchApi<{ simulation: FullSimulation }>(`/api/simulations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  deleteSimulation(id: number): Promise<{ message: string }> {
    return this.fetchApi<{ message: string }>(`/api/simulations/${id}`, {
      method: 'DELETE'
    })
  }

  // **UTILITAIRES POUR LE FRONTEND**
  
  // Convertir les données du formulaire complexe vers la structure MPD simple
  static convertComplexFormToMPD(formData: {
    name: string
    categories: Array<{name: string, monthly: number}>
    comfortCategories: Array<{name: string, monthly: number}>
    operatingCharges: Array<{name: string, monthly: number}>
    coefficient: number
    temporalParams?: any
    socialChargesParams?: any
    calculatedResults?: any
  }): CreateSimulationData {
    // Calculer les totaux depuis les catégories
    const totalMonthlyVital = formData.categories?.reduce((sum, cat) => sum + (cat.monthly || 0), 0) || 0
    const totalMonthlyComfortCharges = formData.comfortCategories?.reduce((sum, cat) => sum + (cat.monthly || 0), 0) || 0
    const totalOperatingCharges = formData.operatingCharges?.reduce((sum, charge) => sum + (charge.monthly || 0), 0) || 0
    
    // Revenu amélioré = (charges vitales + charges confort) × coefficient
    const totalMonthlyImprovedIncome = (totalMonthlyVital + totalMonthlyComfortCharges) * (formData.coefficient || 1.2)
    
    // Seuil de rentabilité = charges vitales + charges confort + charges professionnelles  
    const breakevenThreshold = totalMonthlyVital + totalMonthlyComfortCharges + totalOperatingCharges
    
    // Simulations de revenus (ici on peut utiliser les résultats calculés ou des formules simples)
    const microEnterpriseRevenue = formData.calculatedResults?.microEnterpriseRevenue || (totalMonthlyImprovedIncome * 1.3)
    const enterpriseRevenue = formData.calculatedResults?.enterpriseRevenue || (totalMonthlyImprovedIncome * 1.2)
    
    // Déterminer la meilleure option
    const bestOption: 'micro' | 'entreprise' | 'egalite' = 
      microEnterpriseRevenue > enterpriseRevenue ? 'micro' :
      enterpriseRevenue > microEnterpriseRevenue ? 'entreprise' : 'egalite'

    return {
      name: formData.name,
      totalMonthlyVital,
      totalMonthlyComfortCharges,
      totalMonthlyImprovedIncome,
      totalOperatingCharges,
      breakevenThreshold,
      microEnterpriseRevenue,
      enterpriseRevenue,
      bestOption
    }
  }

  // Convertir les données MPD vers le format d'affichage frontend
  static convertMPDToDisplayFormat(simulation: FullSimulation) {
    if (!simulation.results) {
      return {
        id: simulation.id,
        name: simulation.name,
        categories: [],
        comfortCategories: [],
        operatingCharges: [],
        results: null
      }
    }

    return {
      id: simulation.id,
      name: simulation.name,
      totalMonthlyVital: simulation.results.totalMonthlyVital,
      totalMonthlyComfortCharges: simulation.results.totalMonthlyComfortCharges,
      totalMonthlyImprovedIncome: simulation.results.totalMonthlyImprovedIncome,
      totalOperatingCharges: simulation.results.totalOperatingCharges,
      breakevenThreshold: simulation.results.breakevenThreshold,
      microEnterpriseRevenue: simulation.results.microEnterpriseRevenue,
      enterpriseRevenue: simulation.results.enterpriseRevenue,
      bestOption: simulation.results.bestOption,
      calculatedAt: simulation.results.calculatedAt
    }
  }
}

// Export par défaut
export default new ApiService()

// Export de la classe pour accéder aux méthodes statiques
export { ApiService }

// Export des types pour utilisation dans les composants
export type { 
  User, 
  LoginResponse, 
  SimulationListItem, 
  FullSimulation, 
  SimulationResults,
  CreateSimulationData, 
  DashboardStats 
} 