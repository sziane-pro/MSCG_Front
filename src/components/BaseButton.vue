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
/* Mobile-first button base */
.base-button {
  margin: 2px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-height: 44px; /* Touch target minimum */
  white-space: nowrap;
  font-family: 'Poppins', sans-serif;
}

@media (min-width: 768px) {
  .base-button {
    margin: 5px;
    min-height: auto;
  }
}

.base-button:active {
  transform: translateY(1px);
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Couleurs */
.btn-primary {
  background-color: #f9f9f9;
  color: #151515;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background-color: #b79e62;
  color: #f9f9f9;
}

.btn-primary:focus {
  outline: none;
  border-color: #b79e62;
  box-shadow: 0 0 0 2px rgba(183, 158, 98, 0.2);
}

.btn-secondary {
  background-color: #253786;
  color: #f9f9f9;
  border: 2px solid transparent;
}

.btn-secondary:hover {
  background-color: #b79e62;
  color: #f9f9f9;
}

.btn-secondary:focus {
  outline: none;
  border-color: #4A6D86;
  box-shadow: 0 0 0 2px rgba(74, 109, 134, 0.2);
}

.btn-validation {
  background-color: #009B14;
  color: #f9f9f9;
  border: 2px solid transparent;
}

.btn-validation:hover {
  background-color: #007A10;
}

.btn-validation:focus {
  outline: none;
  border-color: #007A10;
  box-shadow: 0 0 0 2px rgba(0, 155, 20, 0.2);
}

.btn-danger {
  background-color: #e74c3c;
  color: #f9f9f9;
  border: 2px solid transparent;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-danger:focus {
  outline: none;
  border-color: #c0392b;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

/* Tailles mobiles d'abord */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .btn-sm {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
}

/* Variantes responsive */
.base-button.full-width-mobile {
  width: 100%;
}

@media (min-width: 768px) {
  .base-button.full-width-mobile {
    width: auto;
  }
}

/* États focus améliorés pour accessibilité */
.base-button:focus-visible {
  outline: 2px solid #4A6D86;
  outline-offset: 2px;
}
</style>
