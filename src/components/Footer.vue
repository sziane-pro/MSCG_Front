<template>
  <footer class="footer">
    <!-- Colonne gauche : logo -->
    <div class="footer-left">
      <img src="@/assets/logoblancsvg-25.svg" alt="Logo" class="footer-logo" />
    </div>

    <!-- Colonne centre : titre + bouton -->
    <div class="footer-center">
      <h3 class="footer-title">Abonnez-vous à notre newsletter 📩 </h3>
      <BaseButton color="primary">Cliquez ici</BaseButton>
    </div>

    <!-- Colonne droite : titre + boutons réseaux -->
    <div class="footer-right">
      <h4>Optimiser les bénéfices par la valorisation du capital humain.</h4>
      <div class="social-buttons">
        <a href="https://facebook.com" target="_blank">
          <img src="@/assets/icons/icons8-facebook-nouveau.svg" alt="Facebook" />
        </a>
        <a href="https://linkedin.com" target="_blank">
          <img src="@/assets/icons/icons8-linkedin.svg" alt="Linkedin" />
        </a>
        <a href="https://instagram.com" target="_blank">
          <img src="@/assets/icons/icons8-instagram.svg" alt="Instagram" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #253786;
  color: white;
  padding: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-left img {
  height: 120px;
}

.footer-center {
  text-align: center;
}

.footer-title {
  color: #f9f9f9;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.footer-right {
  display: flex;
  width: 15rem;
  align-items: center;
  flex-direction: column;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.social-buttons img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1); /* rend les icônes blanches */
  cursor: pointer;
}
</style>
