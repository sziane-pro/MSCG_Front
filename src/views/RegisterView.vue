<template>
  <div class="auth-container">
    <h1>Inscription</h1>

    <form @submit.prevent="register">
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
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmez le mot de passe"
        required
      />

      <BaseButton :disabled="loading" color="secondary">Créer un compte</BaseButton>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>

    <p class="link">
      Déjà inscrit ?
      <RouterLink to="/login">Connexion</RouterLink>
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
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const register = async () => {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas."
    return
  }

  loading.value = true
  try {
    await auth.login(email.value, password.value) // ← simule création de compte
    router.push('/')
  } catch (e: any) {
    errorMessage.value = e.message || 'Erreur lors de l’inscription'
  } finally {
    loading.value = false
  }
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
}

.link {
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
