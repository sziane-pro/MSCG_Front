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
.content-block {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* <-- ici le changement clé */
  gap: 2rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.content-block.reverse {
  flex-direction: row-reverse;
}

h3 {
  font-size: 32px;
}

.video {
  flex: 1;
  max-width: 500px;
  border-radius: 40px;
  overflow:hidden;
}

.text {
  flex: 1;
  max-width: 500px;
}
</style>
