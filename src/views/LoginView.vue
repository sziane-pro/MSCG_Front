<template>
  <div class="auth-container">
    <h1>Connexion</h1>

    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="Adresse email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        required
      />

      <BaseButton :disabled="loading" color="secondary">
        {{ loading ? 'Connexion...' : 'Connexion' }}
      </BaseButton>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>

    <p class="link">
      Pas encore de compte ?
      <RouterLink to="/register">Inscription</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const auth = useAuthStore()
const router = useRouter()

// Utiliser loading du store
const loading = auth.loading

const login = () => {
  errorMessage.value = ''
  
  // Validation basique
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  // Appeler la vraie méthode login du store
  auth.login(email.value, password.value)
    .then(() => {
      // Redirection après connexion réussie
      router.push('/')
    })
    .catch((error: any) => {
      errorMessage.value = error.message || 'Erreur de connexion'
    })
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f7f9fb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.link {
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
