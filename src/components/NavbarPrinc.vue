<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/" class="logo">
        <img src="@/assets/logoblancsvg-25.svg" alt="Logo" />
      </RouterLink>
    </div>

    <!-- Menu hamburger pour mobile -->
    <div class="mobile-menu-toggle" @click="toggleMobileMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Navigation desktop -->
    <div class="navbar-center desktop-nav" v-if="auth.isAuthenticated">
      <ul class="nav-tabs">
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink to="/dashboard">Tableau de bord</RouterLink></li>
        <li><RouterLink to="/simulation">Simulation</RouterLink></li>
      </ul>
    </div>

    <!-- Boutons desktop -->
    <div class="nav-buttons desktop-nav">
      <template v-if="!auth.isAuthenticated">
        <RouterLink to="/login"><BaseButton color="primary" size="sm">Connexion</BaseButton></RouterLink>
        <RouterLink to="/register"><BaseButton color="primary" size="sm">Inscription</BaseButton></RouterLink>
      </template>
      <template v-else>
        <BaseButton color="primary" size="sm" @click="auth.logout">Déconnexion</BaseButton>
      </template>
    </div>

    <!-- Menu mobile overlay -->
    <div class="mobile-menu" :class="{ 'mobile-menu-open': mobileMenuOpen }">
      <div class="mobile-menu-content">
        <ul class="mobile-nav-tabs" v-if="auth.isAuthenticated">
          <li><RouterLink to="/" @click="closeMobileMenu">Accueil</RouterLink></li>
          <li><RouterLink to="/dashboard" @click="closeMobileMenu">Tableau de bord</RouterLink></li>
          <li><RouterLink to="/simulation" @click="closeMobileMenu">Simulation</RouterLink></li>
        </ul>
        
        <div class="mobile-nav-buttons">
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/login" @click="closeMobileMenu">
              <BaseButton color="primary" size="md">Connexion</BaseButton>
            </RouterLink>
            <RouterLink to="/register" @click="closeMobileMenu">
              <BaseButton color="secondary" size="md">Inscription</BaseButton>
            </RouterLink>
          </template>
          <template v-else>
            <BaseButton color="primary" size="md" @click="handleLogout">Déconnexion</BaseButton>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = () => {
  auth.logout()
  closeMobileMenu()
}
</script>

<style scoped>
/* Mobile-first navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: #253786;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .navbar {
    height: 64px;
    padding: 0 2rem;
  }
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  transition: height 0.2s ease;
}

@media (min-width: 768px) {
  .logo img {
    height: 80px;
  }
}

.logo {
  padding-top: 8px;
}

@media (min-width: 768px) {
  .logo {
    padding-top: 15px;
  }
}

/* Mobile menu toggle - Hamburger */
.mobile-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 28px;
  cursor: pointer;
  z-index: 1001;
}

.mobile-menu-toggle span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

/* Desktop navigation - cachée sur mobile */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.navbar-center {
  flex: 1;
  justify-content: center;
}

.nav-tabs {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-tabs a {
  text-decoration: none;
  color: #f9f9f9;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-tabs a.router-link-active {
  border-bottom: 2px solid #4A6D86;
  padding-bottom: 4px;
}

.nav-tabs a:hover {
  color: #4A6D86;
}

/* Boutons desktop */
.nav-buttons {
  gap: 0.5rem;
}

.nav-buttons .base-button {
  margin: 0 0.25rem;
}

/* Menu mobile overlay */
.mobile-menu {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(37, 55, 134, 0.98);
  backdrop-filter: blur(10px);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
}

.mobile-menu-open {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 2rem 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2rem;
}

.mobile-nav-tabs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-tabs a {
  text-decoration: none;
  color: #f9f9f9;
  font-weight: 500;
  font-size: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: block;
  transition: color 0.2s ease;
}

.mobile-nav-tabs a.router-link-active {
  color: #4A6D86;
  border-bottom-color: #4A6D86;
}

.mobile-nav-tabs a:hover {
  color: #4A6D86;
}

.mobile-nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
}

.mobile-nav-buttons .base-button {
  width: 100%;
  margin: 0;
}

/* Animation hamburger quand menu ouvert */
.mobile-menu-open .mobile-menu-toggle span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.mobile-menu-open .mobile-menu-toggle span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-open .mobile-menu-toggle span:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

/* Overlay pour fermer le menu en cliquant dehors */
@media (max-width: 767px) {
  body.menu-open {
    overflow: hidden;
  }
}
</style>
