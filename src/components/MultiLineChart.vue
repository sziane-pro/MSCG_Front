<template>
  <div class="chart-container">
    <div v-if="!chartData" class="no-data">
      <p>Aucune donnée disponible pour le graphique</p>
    </div>
    <canvas v-else ref="chartCanvas" class="chart-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'

// Props pour recevoir les données du parent
interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

const props = defineProps<{
  chartData?: ChartData | null
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

// Données par défaut si aucune donnée n'est fournie
const defaultChartData: ChartData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Chiffre d\'affaires',
      data: [25000, 28000, 32000, 35000, 38000, 42000],
      borderColor: '#2B3A46',
      backgroundColor: 'rgba(43, 58, 70, 0.1)',
    },
    {
      label: 'Bénéfice net',
      data: [15000, 18000, 21000, 24000, 27000, 29000],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
    },
    {
      label: 'Charges',
      data: [8000, 9000, 10000, 11000, 12000, 12500],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
    }
  ]
}

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const dataToUse = props.chartData || defaultChartData

  // Simulation simple d'un graphique linéaire en Canvas
  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)
  
  const width = chartCanvas.value.width
  const height = chartCanvas.value.height
  const padding = 60
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  // Trouver les valeurs min/max pour l'échelle
  const allValues = dataToUse.datasets.flatMap(dataset => dataset.data)
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const valueRange = maxValue - minValue || 1

  // Dessiner les axes
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 1
  ctx.beginPath()
  // Axe Y
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  // Axe X
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Dessiner les labels X
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  dataToUse.labels.forEach((label, i) => {
    const x = padding + (i * chartWidth) / (dataToUse.labels.length - 1)
    ctx.fillText(label, x, height - padding + 20)
  })

  // Dessiner les lignes de données
  dataToUse.datasets.forEach((dataset, datasetIndex) => {
    ctx.strokeStyle = dataset.borderColor
    ctx.lineWidth = 2
    ctx.beginPath()

    dataset.data.forEach((value, i) => {
      const x = padding + (i * chartWidth) / (dataset.data.length - 1)
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Dessiner les points
    ctx.fillStyle = dataset.borderColor
    dataset.data.forEach((value, i) => {
      const x = padding + (i * chartWidth) / (dataset.data.length - 1)
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  })

  // Légende
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  dataToUse.datasets.forEach((dataset, i) => {
    const legendY = 30 + i * 20
    ctx.fillStyle = dataset.borderColor
    ctx.fillRect(width - 150, legendY - 10, 15, 15)
    ctx.fillText(dataset.label, width - 130, legendY + 2)
  })
}

// Redessiner le graphique quand les données changent
watch(() => props.chartData, () => {
  if (chartCanvas.value) {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  if (chartCanvas.value) {
    // Définir la taille du canvas
    chartCanvas.value.width = 800
    chartCanvas.value.height = 400
    createChart()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-canvas {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.no-data {
  color: #666;
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
