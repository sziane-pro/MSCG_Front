<template>
  <div class="auth-container">
    <h1>Inscription</h1>

    <form @submit.prevent="register">
      <div class="name-fields">
        <input
          v-model="firstname"
          type="text"
          placeholder="Prénom"
          required
        />
        <input
          v-model="lastname"
          type="text"
          placeholder="Nom"
          required
        />
      </div>
      
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

      <BaseButton :disabled="loading" color="secondary">
        {{ loading ? 'Création...' : 'Créer un compte' }}
      </BaseButton>
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

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const auth = useAuthStore()
const router = useRouter()

// Utiliser loading du store
const loading = auth.loading

const register = () => {
  errorMessage.value = ''

  // Validation des champs obligatoires
  if (!firstname.value.trim()) {
    errorMessage.value = "Le prénom est obligatoire."
    return
  }

  if (!lastname.value.trim()) {
    errorMessage.value = "Le nom est obligatoire."
    return
  }

  if (!email.value.trim()) {
    errorMessage.value = "L'email est obligatoire."
    return
  }

  // Validation des mots de passe
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas."
    return
  }

  // Validation mot de passe minimum
  if (password.value.length < 6) {
    errorMessage.value = "Le mot de passe doit contenir au moins 6 caractères."
    return
  }

  // Validation longueur prénom/nom selon MPD
  if (firstname.value.trim().length > 100) {
    errorMessage.value = "Le prénom ne peut pas dépasser 100 caractères."
    return
  }

  if (lastname.value.trim().length > 100) {
    errorMessage.value = "Le nom ne peut pas dépasser 100 caractères."
    return
  }

  // Appeler la méthode register du store avec les champs obligatoires
  auth.register(
    email.value.trim(), 
    password.value, 
    firstname.value.trim(), 
    lastname.value.trim()
  ).then(() => {
    // Redirection après inscription réussie
    router.push('/')
  }).catch((error: any) => {
    errorMessage.value = error.message || 'Erreur lors de l\'inscription'
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

.name-fields {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.name-fields input {
  flex: 1;
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

input:required {
  border-left: 3px solid #2B3A46;
}

input:invalid {
  border-color: #dc3545;
}

.name-fields input {
  margin-bottom: 0;
}

.link {
  margin-top: 1rem;
}

.error {
  color: #dc3545;
  margin-top: 0.5rem;
  font-weight: 500;
}
</style>
