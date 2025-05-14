<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Seuil de perte',
      data: [5, 10, 15, 20, 25],
      borderColor: '#4A6D86',
      fill: false
    },
    {
      label: 'Seuil de bénéfice',
      data: [3, 8, 13, 18, 23],
      borderColor: '#2B3A46',
      fill: false
    },
    {
      label: 'Chiffre d\'affaires',
      data: [25, 8, 47, 12, 30],
      borderColor: '#e67e22',
      backgroundColor: '#e67e22',
      fill: false,
      showLine: true,
      pointRadius: 5
    },
    {
      label: 'Commandes',
      data: [12, 33, 5, 22, 40],
      borderColor: '#e74c3c',
      backgroundColor: '#e74c3c',
      fill: false,
      showLine: true,
      pointRadius: 5
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Mois'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valeur'
      },
      beginAtZero: true
    }
  }
}
</script>

<style scoped>
/* Pour fixer la hauteur du conteneur */
:deep(canvas) {
  max-height: 400px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px; /* ← fixe la hauteur du graphique ici */
}
</style>
