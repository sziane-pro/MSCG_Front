<template>
  <div class="stat-card">
    <h3 class="title">{{ name }}</h3>
    <p class="value">{{ value }}</p>
    <p class="info">{{ changeText }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  value: string
  changeText: string
}>()
</script>

<style scoped>
.stat-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  flex: 1 1 200px;
  min-width: 220px;
  box-sizing: border-box;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
}
.title {
  font-size: 1rem;
  color: #2B3A46;
  margin-bottom: 0.5rem;
}
.value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4A6D86;
}
.info {
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
