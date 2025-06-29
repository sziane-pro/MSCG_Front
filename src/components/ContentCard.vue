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
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="text">{{ description }}</p>
    </div>
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
/* Mobile-first card design */
.card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #f0f0f0;
}

@media (min-width: 768px) {
  .card {
    max-width: 350px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Video section */
.card-video {
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  background: #f8fafc;
}

.card-video iframe {
  width: 100%;
  height: 180px;
  border: none;
}

@media (min-width: 768px) {
  .card-video iframe {
    height: 200px;
  }
}

/* Content section */
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  flex: 1;
}

@media (min-width: 768px) {
  .card-content {
    padding: 2rem;
  }
}

.title {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
  color: #253786;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .title {
    font-size: 1.2rem;
  }
}

.text {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 768px) {
  .text {
    font-size: 1rem;
  }
}

/* Touch-friendly hover states */
@media (hover: none) and (pointer: coarse) {
  .card:hover {
    transform: none;
    box-shadow: inherit;
  }
  
  .card:active {
    transform: scale(0.98);
  }
}
</style>
