<template>
  <section class="simulation-section">
    <div class="simulation-header">
      <h3 class="section-title">Mes simulations</h3>
      <div class="buttons">
        <BaseButton color="primary">Exporter</BaseButton>
        <RouterLink to="/simulation">
          <BaseButton color="primary">Nouvelle simulation</BaseButton>
        </RouterLink>
      </div>
    </div>

    <table class="simulation-table">
      <thead>
      <tr>
        <th>Nom</th>
        <th>Statut</th>
        <th>Date de création</th>
        <th>CA</th>
        <th>Revenu net</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(sim, i) in simulations" :key="i">
        <td>{{ sim.nom }}</td>
        <td>{{ sim.statut }}</td>
        <td>{{ sim.date }}</td>
        <td>{{ sim.ca }}</td>
        <td>{{ sim.revenuNet }}</td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

const simulations = [
  {
    nom: 'Simulation A',
    statut: 'Terminée',
    date: '2024-05-01',
    ca: '12 000 €',
    revenuNet: '8 400 €'
  },
  {
    nom: 'Simulation B',
    statut: 'En cours',
    date: '2024-05-12',
    ca: '8 500 €',
    revenuNet: '5 300 €'
  }
  // ... plus de lignes si nécessaire
]
</script>

<style scoped>
.simulation-section {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
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
}
</style>
