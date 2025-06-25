<template>
  <section class="simulation-section">
    <div class="simulation-header">
      <h3 class="section-title">Mes simulations</h3>
      <div class="buttons">
        <BaseButton color="primary" @click="exportSimulations">Exporter</BaseButton>
        <RouterLink to="/simulation">
          <BaseButton color="primary">Nouvelle simulation</BaseButton>
        </RouterLink>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading-state">
      <p>Chargement des simulations...</p>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="loadSimulations" class="retry-button">Réessayer</button>
    </div>

    <!-- Table des simulations -->
    <div v-else-if="simulations.length > 0" class="table-container">
      <table class="simulation-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date de création</th>
            <th>CA</th>
            <th>Revenu net</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sim, i) in simulations" :key="sim.id">
            <td class="name-cell">{{ sim.nom }}</td>
            <td class="date-cell">{{ formatDate(sim.date) }}</td>
            <td class="ca-cell">{{ sim.ca }}</td>
            <td class="revenue-cell">{{ sim.revenuNet }}</td>
            <td class="actions-cell">
              <div class="actions-buttons">
                <button @click="handleView(sim)" class="action-btn view-btn">
                  Voir
                </button>
                <button @click="editSimulation(sim.id)" class="action-btn edit-btn">
                  Modifier
                </button>
                <button @click="deleteSimulation(sim.id)" class="action-btn delete-btn">
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- État vide -->
    <div v-else class="empty-state">
      <p>Aucune simulation trouvée</p>
      <RouterLink to="/simulation">
        <BaseButton color="secondary">Créer ma première simulation</BaseButton>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService, { type SimulationListItem } from '@/services/apiService'
import BaseButton from '@/components/BaseButton.vue'

// État réactif
const simulations = ref<SimulationListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const router = useRouter()
const authStore = useAuthStore()

// Charger les simulations depuis l'API
const loadSimulations = () => {
  if (!authStore.isAuthenticated) {
    error.value = 'Vous devez être connecté pour voir vos simulations'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  apiService.getUserSimulations()
    .then(data => {
      simulations.value = data
      loading.value = false
    })
    .catch((err: any) => {
      console.error('Erreur chargement simulations:', err)
      error.value = err.message || 'Erreur lors du chargement des simulations'
      loading.value = false
      
      // Si erreur d'authentification, rafraîchir le profil
      if (err.message.includes('401') || err.message.includes('token')) {
        authStore.refreshUserProfile()
      }
    })
}

// Actions sur les simulations
const handleView = (simulation: any) => {
  // Rediriger vers SimulationView avec l'ID de la simulation
  router.push(`/simulation?load=${simulation.id}`)
}

const editSimulation = (id: number) => {
  router.push(`/simulation/${id}/edit`)
}

const deleteSimulation = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
    apiService.deleteSimulation(id)
      .then(() => {
        // Recharger la liste après suppression
        loadSimulations()
      })
      .catch((err: any) => {
        console.error('Erreur suppression simulation:', err)
        alert('Erreur lors de la suppression : ' + err.message)
      })
  }
}

const exportSimulations = () => {
  // Fonction d'export simple en CSV
  if (simulations.value.length === 0) {
    alert('Aucune simulation à exporter')
    return
  }

  const headers = ['Nom', 'Date', 'CA', 'Revenu Net']
  const csvContent = [
    headers.join(','),
    ...simulations.value.map(sim => [
      `"${sim.nom}"`,
      sim.date,
      `"${sim.ca}"`,
      `"${sim.revenuNet}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `simulations_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Formater la date pour l'affichage
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Charger les simulations au montage du composant
onMounted(() => {
  loadSimulations()
})
</script>

<style scoped>
.simulation-section {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.simulation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2B3A46;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-state p {
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  color: #dc3545;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #2B3A46;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.retry-button:hover {
  background-color: #1e2a35;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
}

.simulation-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.simulation-table th,
.simulation-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #d0d6db;
  text-align: left;
}

.simulation-table th {
  background-color: #f5f7fa;
  color: #2b3a46;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.name-cell {
  font-weight: 600;
  color: #2B3A46;
}

.date-cell {
  color: #666;
  font-size: 0.9rem;
}

.ca-cell,
.revenue-cell {
  font-weight: 600;
  text-align: right;
}

.ca-cell {
  color: #2B3A46;
}

.revenue-cell {
  color: #28a745;
}

.actions-cell {
  text-align: center;
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.view-btn {
  background-color: #17a2b8;
  color: white;
}

.view-btn:hover {
  background-color: #138496;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .simulation-section {
    margin-top: 2rem;
    padding: 1rem;
  }
  
  .simulation-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .buttons {
    justify-content: center;
  }
  
  .simulation-table {
    font-size: 0.85rem;
  }
  
  .simulation-table th,
  .simulation-table td {
    padding: 0.5rem;
  }
  
  .actions-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>
