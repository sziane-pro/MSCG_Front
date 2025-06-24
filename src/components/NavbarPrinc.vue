<template>
  <nav class="navbar">
    <div class="navbar-right">
      <RouterLink to="/" class="logo">
        <img src="@/assets/logoblancsvg-25.svg" alt="Logo" />
      </RouterLink>

      <ul class="nav-tabs" v-if="auth.isAuthenticated">
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink to="/dashboard">Tableau de bord</RouterLink></li>
        <li><RouterLink to="/simulation">Simulation</RouterLink></li>
      </ul>
    </div>

    <div class="nav-buttons">
      <template v-if="!auth.isAuthenticated">
        <RouterLink to="/login"><BaseButton color="primary">Connexion</BaseButton></RouterLink>
        <RouterLink to="/register"><BaseButton color="primary">Inscription</BaseButton></RouterLink>
      </template>
      <template v-else>
        <BaseButton color="primary" @click="auth.logout">Déconnexion</BaseButton>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: #253786;
  z-index: 1000;
}

.navbar-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.logo img {
  height: 80px;
}

.logo {
  padding-top: 15px;
}

.nav-buttons .btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4A6D86;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
}

.nav-tabs {
  display: flex;
  list-style: none;
  margin-left: 2rem;
  padding: 0;
  gap: 1.5rem;
}

.nav-tabs a {
  text-decoration: none;
  color: #f9f9f9;
  font-weight: 500;
}

.nav-tabs a.router-link-active {
  border-bottom: 2px solid #4A6D86;
  padding-bottom: 4px;
}

/* Pour éviter que le contenu passe derrière la navbar */
:global(body) {
  padding-top: 64px;
}
</style>
