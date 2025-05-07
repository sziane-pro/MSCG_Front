<template>
  <section class="offer">
    <div class="offer-content">
      <h1 class="offer-title poppins">
        Le GOUVERNAIL,<br/>
        Manageur MSCG Solo
      </h1>
      <p class="offer-subtitle subtitle">Trois simulations du MSCG solo</p>
      <BaseButton color="primary" size="lg">ESSAYEZ L’OUTIL GRATUITEMENT SANS CARTE BANCAIRE*</BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>

<style scoped>
.offer {
  width: 100%;
  background-color: #8790BB; /* couleur personnalisée */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 2rem;
  text-align: center;
}

.offer-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 700px;
}

.offer-title {
  color: #f9f9f9;
  font-size: 2.5rem;
  font-weight: bold;
}

.offer-subtitle {
  color: #f9f9f9;
  font-size: 1.25rem;
  opacity: 0.9;
}
</style>
