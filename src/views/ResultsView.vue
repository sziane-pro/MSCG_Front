<template>
  <div class="results-container">
    <div class="container">
      <div class="results-header">
        <h1>Résultats de la simulation</h1>
        <RouterLink to="/" class="back-link">
          ← Retour au dashboard
        </RouterLink>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="loading-state">
        <p>Chargement de la simulation...</p>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <RouterLink to="/dashbord" class="retry-button">Retour au dashboard</RouterLink>
      </div>

      <!-- Résultats de la simulation -->
      <div v-else-if="simulation" class="results-content">
        <!-- Informations générales -->
        <div class="simulation-info">
          <h2>{{ simulation.name }}</h2>
          <p class="simulation-date">
            Créée le {{ formatDate(simulation.createdAt) }}
          </p>
        </div>

        <div v-if="simulation.results" class="results-grid">
          <!-- Charges mensuelles -->
          <div class="result-card">
            <h3>💰 Charges mensuelles</h3>
            <div class="charge-item">
              <span class="label">Charges vitales :</span>
              <span class="value">{{ formatCurrency(Number(simulation.results.totalMonthlyVital) || 0) }}</span>
            </div>
            <div class="charge-item">
              <span class="label">Charges de confort :</span>
              <span class="value">{{ formatCurrency(Number(simulation.results.totalMonthlyComfortCharges) || 0) }}</span>
            </div>
            <div class="charge-item">
              <span class="label">Charges professionnelles :</span>
              <span class="value">{{ formatCurrency(Number(simulation.results.totalOperatingCharges) || 0) }}</span>
            </div>
            <div class="charge-item total">
              <span class="label">Total charges :</span>
              <span class="value">{{ totalCharges >= 0 ? formatCurrency(totalCharges) : '0 €' }}</span>
            </div>
          </div>

          <!-- Revenus et seuils -->
          <div class="result-card">
            <h3>📈 Revenus et seuils</h3>
            <div class="charge-item">
              <span class="label">Revenu mensuel amélioré :</span>
              <span class="value">{{ formatCurrency(simulation.results.totalMonthlyImprovedIncome) }}</span>
            </div>
            <div class="charge-item">
              <span class="label">Seuil de rentabilité :</span>
              <span class="value">{{ formatCurrency(simulation.results.breakevenThreshold) }}</span>
            </div>
            <div class="charge-item">
              <span class="label">Coefficient appliqué :</span>
              <span class="value">{{ coefficient.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Simulation fiscale -->
          <div class="result-card">
            <h3>🏛️ Simulation fiscale</h3>
            <div class="fiscal-option" :class="{ 'best-option': simulation.results.bestOption === 'micro' }">
              <h4>Micro-entreprise</h4>
              <p class="revenue">{{ formatCurrency(simulation.results.microEnterpriseRevenue) }} / an</p>
              <p v-if="simulation.results.bestOption === 'micro'" class="best-label">✨ Meilleure option</p>
            </div>
            <div class="fiscal-option" :class="{ 'best-option': simulation.results.bestOption === 'entreprise' }">
              <h4>Entreprise classique</h4>
              <p class="revenue">{{ formatCurrency(simulation.results.enterpriseRevenue) }} / an</p>
              <p v-if="simulation.results.bestOption === 'entreprise'" class="best-label">✨ Meilleure option</p>
            </div>
            <div v-if="simulation.results.bestOption === 'egalite'" class="equality-notice">
              <p>🤝 Les deux options sont équivalentes</p>
            </div>
          </div>

        </div>

        <!-- État sans résultats -->
        <div v-else class="no-results">
          <p>Cette simulation n'a pas de résultats calculés.</p>
          <RouterLink to="/simulation">
            <BaseButton color="secondary" size="lg">
              Nouvelle simulation
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService, { type FullSimulation } from '@/services/apiService'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// État réactif
const simulation = ref<FullSimulation | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Calculs dérivés
const totalCharges = computed(() => {
  if (!simulation.value?.results) return 0
  
  const results = simulation.value.results
  const vital = Number(results.totalMonthlyVital) || 0
  const comfort = Number(results.totalMonthlyComfortCharges) || 0
  const operating = Number(results.totalOperatingCharges) || 0
  
  return vital + comfort + operating
})

const coefficient = computed(() => {
  if (!simulation.value?.results) return 1
  const results = simulation.value.results
  const baseCharges = (Number(results.totalMonthlyVital) || 0) + (Number(results.totalMonthlyComfortCharges) || 0)
  const improvedIncome = Number(results.totalMonthlyImprovedIncome) || 0
  return baseCharges > 0 ? improvedIncome / baseCharges : 1
})

// Fonctions utilitaires
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Charger la simulation
const loadSimulation = async () => {
  const simulationId = route.params.id as string
  
  if (!simulationId) {
    error.value = 'ID de simulation manquant'
    loading.value = false
    return
  }

  if (!authStore.isAuthenticated) {
    error.value = 'Vous devez être connecté pour voir cette simulation'
    loading.value = false
    return
  }

  try {
    simulation.value = await apiService.getSimulation(parseInt(simulationId))
    loading.value = false
  } catch (err: any) {
    console.error('Erreur chargement simulation:', err)
    error.value = err.message || 'Erreur lors du chargement de la simulation'
    loading.value = false
  }
}

// Initialisation
onMounted(() => {
  loadSimulation()
})
</script>

<style scoped>
/* Container principal */
.results-container {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.results-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #253786;
  font-family: 'Poppins', sans-serif;
}

.back-link {
  color: #253786;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid #253786;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.back-link:hover {
  background-color: #253786;
  color: #ffffff;
}

/* États de chargement et d'erreur */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.loading-state p {
  font-size: 1.2rem;
  color: #374151;
  font-family: 'Poppins', sans-serif;
  margin: 0;
}

.error-message {
  color: #dc2626;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 1rem;
}

.retry-button {
  color: #ffffff;
  text-decoration: none;
  background: #253786;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #1e2a5e;
}

/* Contenu des résultats */
.results-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.simulation-info {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.simulation-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #253786;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

.simulation-date {
  color: #374151;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
}

/* Grille des résultats */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.result-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #253786;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.result-card h3 {
  margin: 0 0 1.5rem 0;
  color: #253786;
  font-size: 1.3rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

/* Items de charges */
.charge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
}

.charge-item.total {
  border-top: 2px solid #e5e7eb;
  margin-top: 1rem;
  font-weight: 700;
  color: #253786;
}

.label {
  color: #374151;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}

.value {
  font-weight: 700;
  color: #111827;
  font-family: 'Poppins', sans-serif;
}

/* Options fiscales */
.fiscal-option {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.fiscal-option.best-option {
  background: #065f46;
  color: #ffffff;
  border-color: #047857;
  transform: scale(1.02);
}

.fiscal-option h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: inherit;
}

.fiscal-option:not(.best-option) h4 {
  color: #374151;
}

.revenue {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: inherit;
}

.fiscal-option:not(.best-option) .revenue {
  color: #111827;
}

.best-label {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #d1fae5;
}

.equality-notice {
  background: #dbeafe;
  color: #1e40af;
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #93c5fd;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #374151;
  font-family: 'Poppins', sans-serif;
}

.no-results p {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .results-header h1 {
    font-size: 2rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .result-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .results-container {
    padding: 1rem 0;
  }

  .charge-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .fiscal-option {
    padding: 1rem;
  }
}
</style> 