<template>
  <div class="dashboard">
    <h1>Bienvenue sur votre tableau de bord</h1>

    <!-- Message de chargement -->
    <div v-if="loading" class="loading-state">
      <p>Chargement des données...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="loadDashboardData" class="retry-button">Réessayer</button>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Section Statistiques -->
      <section class="stat-section">
        <StatCard
          name="Chiffre d'affaire"
          :value="stats?.chiffreAffaire || '0 €'"
          changeText="+12% depuis le mois dernier"
        />
        <StatCard
          name="Charge"
          :value="stats?.charge || '0 €'"
          changeText="+7% en 30 jours"
        />
        <StatCard
          name="Bénéfice net"
          :value="stats?.beneficeNet || '0 €'"
          changeText="+4% par rapport à la semaine dernière"
        />
        <StatCard
          name="Taux de charge"
          :value="stats?.tauxCharge || '0%'"
          changeText="-2% par rapport au mois dernier"
        />
      </section>

      <!-- Section Graphiques -->
      <section class="chart-section">
        <h3>Courbes d'évolution</h3>
        <MultiLineChart :chartData="chartData" />
      </section>

      <!-- Tableau des simulations -->
      <SimulationTable />
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiService, { type DashboardStats } from '@/services/apiService'
import StatCard from '@/components/StatCard.vue'
import MultiLineChart from '@/components/MultiLineChart.vue'
import SimulationTable from '@/components/SimulationTable.vue'
import Footer from '@/components/Footer.vue'

// État réactif
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const authStore = useAuthStore()

// Données pour le graphique basées sur les stats réelles
const chartData = computed(() => {
  if (!stats.value?.rawData) return null
  
  return {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Chiffre d\'affaires',
        data: generateMonthlyData(stats.value.rawData.totalCA),
        borderColor: '#2B3A46',
        backgroundColor: 'rgba(43, 58, 70, 0.1)',
      },
      {
        label: 'Bénéfice net',
        data: generateMonthlyData(stats.value.rawData.totalRevenuNet),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
      },
      {
        label: 'Charges',
        data: generateMonthlyData(stats.value.rawData.totalCharges),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
      }
    ]
  }
})

// Charger les données du dashboard
const loadDashboardData = () => {
  if (!authStore.isAuthenticated) {
    error.value = 'Vous devez être connecté pour voir le dashboard'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  
  apiService.getDashboardStats()
    .then(dashboardStats => {
      stats.value = dashboardStats
      loading.value = false
    })
        .catch((err: any) => {
      console.error('Erreur chargement dashboard:', err)
      error.value = err.message || 'Erreur lors du chargement des données'
      loading.value = false
      
      // Si erreur d'authentification, rafraîchir le profil
      if (err.message.includes('401') || err.message.includes('token')) {
        authStore.refreshUserProfile()
      }
    })
}

// Générer des données mensuelles simulées basées sur le total annuel
const generateMonthlyData = (annualTotal: number): number[] => {
  const baseMonthly = annualTotal / 12
  return Array.from({ length: 6 }, (_, i) => {
    // Variation aléatoire de ±20% autour de la moyenne mensuelle
    const variation = (Math.random() - 0.5) * 0.4
    return Math.round(baseMonthly * (1 + variation))
  })
}

// Charger les données au montage du composant
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-state p {
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  color: #dc3545;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #2B3A46;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #1e2a35;
}

.stat-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

.chart-section {
  margin-top: 4rem;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-section h3 {
  margin: 0 0 2rem 0;
  color: #2B3A46;
  font-size: 1.4rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .stat-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .chart-section {
    margin-top: 2rem;
    padding: 1rem;
  }
}
</style>
