<template>
  <section class="simulation-section">
    <div class="simulation-header">
      <h3 class="section-title">Mes simulations</h3>
      <div class="buttons">
        <RouterLink to="/simulation">
          <BaseButton color="primary" size="sm">Nouvelle simulation</BaseButton>
        </RouterLink>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des simulations...</p>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <BaseButton color="secondary" size="sm" @click="loadSimulations">Réessayer</BaseButton>
    </div>

    <!-- Liste des simulations -->
    <div v-else-if="simulations.length > 0" class="simulations-container">
      
      <!-- Vue mobile : Cards -->
      <div class="mobile-cards">
        <div 
          v-for="(sim, i) in simulations" 
          :key="sim.id"
          class="simulation-card"
        >
          <div class="card-header">
            <h4 class="sim-name">{{ sim.nom }}</h4>
            <span class="sim-date">{{ formatDate(sim.date) }}</span>
          </div>
          
          <div class="card-body">
            <div class="sim-metrics">
              <div class="metric">
                <span class="metric-label">CA</span>
                <span class="metric-value">{{ sim.ca }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Revenu net</span>
                <span class="metric-value revenue">{{ sim.revenuNet }}</span>
              </div>
            </div>
            
                         <div class="card-actions">
               <div class="action-buttons-mobile">
                                    <BaseButton 
                     color="primary" 
                     size="sm" 
                     @click="handleView(sim)"
                     class="action-btn-mobile"
                   >
                     Voir
                   </BaseButton>
                 <BaseButton 
                   color="secondary" 
                   size="sm" 
                   @click="(event) => handleExportPDF(sim, event)"
                   class="action-btn-mobile"
                   :disabled="isExporting !== null"
                 >
                   {{ isExporting !== null ? 'Export...' : 'Export PDF' }}
                 </BaseButton>
               </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Vue desktop : Table -->
      <div class="desktop-table">
        <div class="table-responsive">
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
                     <BaseButton 
                       color="primary" 
                       size="sm" 
                       @click="handleView(sim)"
                     >
                       Voir
                     </BaseButton>
                     <BaseButton 
                       color="secondary" 
                       size="sm" 
                       @click="(event) => handleExportPDF(sim, event)"
                       :disabled="isExporting !== null"
                     >
                       {{ isExporting !== null ? 'Export...' : 'Export PDF' }}
                     </BaseButton>
                   </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="empty-state">
      <div class="empty-icon">📊</div>
      <h4>Aucune simulation trouvée</h4>
      <p>Créez votre première simulation pour commencer à analyser vos seuils de rentabilité</p>
      <RouterLink to="/simulation">
        <BaseButton color="secondary" size="md" class="full-width-mobile">
          Créer ma première simulation
        </BaseButton>
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
import ExportService from '@/services/exportService'

// État réactif
const simulations = ref<SimulationListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isExporting = ref<number | null>(null)

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
  // Rediriger vers ResultsView pour afficher les résultats de la simulation
  router.push(`/results/${simulation.id}`)
}

const handleExportPDF = async (simulation: SimulationListItem, event?: Event) => {
  // Empêcher la propagation et les actions par défaut
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  // Vérifier qu'un export n'est pas déjà en cours
  if (isExporting.value !== null) {
    console.warn('Export déjà en cours, ignorer le nouveau clic')
    return
  }

  try {
    isExporting.value = simulation.id
    await ExportService.exportSimulationToPDF(simulation.id)
  } catch (err: any) {
    console.error('Erreur lors de l\'export PDF:', err)
    alert('Erreur lors de l\'export : ' + (err.message || 'Erreur inconnue'))
  } finally {
    isExporting.value = null
  }
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
/* Mobile-first SimulationTable */
.simulation-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

@media (min-width: 768px) {
  .simulation-section {
    margin-top: 3rem;
    padding: 2rem;
    border-radius: 12px;
  }
}

/* Header mobile-first */
.simulation-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .simulation-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2B3A46;
  text-align: center;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.4rem;
    text-align: left;
  }
}

.buttons {
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .buttons {
    justify-content: flex-end;
  }
}

/* États de chargement mobile-first */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

@media (min-width: 768px) {
  .loading-state,
  .error-state,
  .empty-state {
    padding: 3rem 2rem;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #253786;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

@media (min-width: 768px) {
  .loading-state p {
    font-size: 1.1rem;
  }
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .error-message {
    font-size: 1rem;
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: #2B3A46;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .empty-state p {
    font-size: 1.1rem;
  }
}

/* Vue mobile : Cards (défaut) */
.mobile-cards {
  display: block;
}

.desktop-table {
  display: none;
}

@media (min-width: 768px) {
  .mobile-cards {
    display: none;
  }
  
  .desktop-table {
    display: block;
  }
}

/* Cards pour mobile */
.simulation-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.simulation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #253786;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.sim-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.sim-date {
  font-size: 0.85rem;
  opacity: 0.9;
  white-space: nowrap;
}

.card-body {
  padding: 1rem;
}

.sim-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric {
  text-align: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.metric-label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2B3A46;
}

.metric-value.revenue {
  color: #28a745;
}

.card-actions {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.action-buttons-mobile {
  display: flex;
  gap: 0.75rem;
}

.action-btn-mobile {
  flex: 1;
  min-height: 44px;
}

/* Table desktop */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.simulation-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  background: white;
}

.simulation-table th,
.simulation-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.simulation-table th {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  position: sticky;
  top: 0;
  border-bottom: 2px solid #253786;
}

.name-cell {
  font-weight: 600;
  color: #2B3A46;
}

.date-cell {
  color: #6b7280;
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
  white-space: nowrap;
  min-width: 140px;
  width: 140px;
}

@media (min-width: 1024px) {
  .actions-cell {
    min-width: 160px;
    width: 160px;
  }
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .actions-buttons {
    gap: 0.75rem;
    flex-wrap: nowrap;
  }
}

/* Touch-friendly pour appareils tactiles */
@media (hover: none) and (pointer: coarse) {
  .simulation-card:hover {
    transform: none;
    box-shadow: inherit;
  }
  
  .simulation-card:active {
    transform: scale(0.98);
  }
}

/* Responsive amélioré pour très petits écrans */
@media (max-width: 480px) {
  .simulation-section {
    margin-top: 1rem;
    padding: 0.75rem;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .sim-name {
    font-size: 1rem;
  }
  
  .card-body {
    padding: 0.75rem;
  }
  
  .sim-metrics {
    grid-template-columns: 1fr;
  }
  
  .metric {
    padding: 0.5rem;
  }
}
</style>
