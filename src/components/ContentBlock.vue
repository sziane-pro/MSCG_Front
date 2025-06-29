<template>
  <div :class="['content-block', { reverse }]">
    <div class="video">
      <iframe
        width="100%"
        height="250"
        :src="`https://www.youtube.com/embed/${videoId}`"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div class="text">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  videoId: string
  reverse?: boolean
}>()
</script>

<style scoped>
/* Mobile-first content block */
.content-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .content-block {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    margin: 3rem 0;
    padding: 0;
  }
}

@media (min-width: 768px) {
  .content-block.reverse {
    flex-direction: row-reverse;
  }
}

.content-block h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  text-align: center;
}

@media (min-width: 768px) {
  .content-block h3 {
    font-size: 2rem;
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .content-block h3 {
    font-size: 2rem;
  }
}

.video {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .video {
    flex: 1;
    max-width: 500px;
    border-radius: 40px;
  }
}

.video iframe {
  width: 100%;
  height: 200px;
  border: none;
}

@media (min-width: 768px) {
  .video iframe {
    height: 250px;
  }
}

.text {
  width: 100%;
  text-align: center;
}

@media (min-width: 768px) {
  .text {
    flex: 1;
    max-width: 500px;
    text-align: left;
  }
}

.text p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

@media (min-width: 768px) {
  .text p {
    font-size: 1rem;
  }
}

/* Animation d'entrée pour mobile */
@media (max-width: 767px) {
  .content-block {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
