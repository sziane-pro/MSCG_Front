<template>
  <div class="dashboard">
    <h1>Bienvenue sur votre tableau de bord</h1>

    <!-- Première section : Statistiques -->
    <section class="stat-section">
      <StatCard
        name="Revenus"
        value="12 500 €"
        changeText="+12% depuis le mois dernier"
      />
      <StatCard
        name="Abonnés"
        value="1 850"
        changeText="+7% en 30 jours"
      />
      <StatCard
        name="Conversion"
        value="38%"
        changeText="+4% par rapport à la semaine dernière"
      />
      <StatCard
        name="Visites"
        value="42 000"
        changeText="-2% par rapport au mois dernier"
      />
    </section>
    <section class="chart-section">
      <h3>Courbes d'évolution</h3>
      <MultiLineChart />
    </section>
    <SimulationTable />

  </div>
  <Footer />
</template>

<script setup lang="ts">
import StatCard from '@/components/StatCard.vue'
import MultiLineChart from '@/components/MultiLineChart.vue'
import SimulationTable from '@/components/SimulationTable.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.dashboard {
  padding: 2rem;
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
}
</style>
