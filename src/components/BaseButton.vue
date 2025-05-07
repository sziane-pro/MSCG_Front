<template>
  <button
    :class="['base-button', colorClass, sizeClass, 'poppins']"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  }
})

const colorClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  validation: 'btn-validation',
  danger: 'btn-danger'
}[props.color]

const sizeClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg'
}[props.size || 'md']
</script>

<style scoped>
.base-button {
  margin: 5px; /* Marge automatique autour du bouton */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}


/* Couleurs */
.btn-primary {
  background-color: #f9f9f9;
  color: #151515;
}

.btn-primary:hover {
  background-color: #b79e62;
  color: #f9f9f9;
}

.btn-secondary {
  background-color: #253786;
  color: #f9f9f9;
}

.btn-secondary:hover {
  background-color: #b79e62;
  color: #f9f9f9;
}

.btn-validation {
  background-color: #009B14;
  color: #151515;
}

.btn-validation:hover {
  background-color: #007A10;
}

.btn-danger {
  background-color: #e74c3c;
  color: #151515;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Tailles */
.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style>
