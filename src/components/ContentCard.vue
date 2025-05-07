<template>
  <div class="card">
    <div class="card-video">
      <iframe
        width="100%"
        height="200"
        :src="`https://www.youtube.com/embed/${videoId}`"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="text">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  videoId: string
  title: string
  description: string
}>()
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  max-width: 350px;
  box-sizing: border-box;
  text-align: center;
}

.title {
  font-size: 18px;
  margin: 0;
}
.card-video {
  border-radius: 8px;
  overflow:hidden;
}

.text {
  font-size: 1rem;
  opacity: 0.9;
}
</style>
