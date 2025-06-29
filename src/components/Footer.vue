<template>
  <footer class="footer">
    <!-- Contenu principal mobile -->
    <div class="footer-mobile">
      <!-- Logo centré -->
      <div class="footer-logo-section">
        <img src="@/assets/logoblancsvg-25.svg" alt="Logo" class="footer-logo" />
      </div>

      <!-- Newsletter -->
      <div class="footer-newsletter">
        <h3 class="newsletter-title">Abonnez-vous à notre newsletter 📩</h3>
        <BaseButton color="primary" size="md" class="full-width-mobile">
          Cliquez ici
        </BaseButton>
      </div>

      <!-- Slogan -->
      <div class="footer-slogan">
        <p>Optimiser les bénéfices par la valorisation du capital humain.</p>
      </div>

      <!-- Réseaux sociaux -->
      <div class="footer-social">
        <h4 class="social-title">Suivez-nous</h4>
        <div class="social-buttons">
          <a href="https://facebook.com" target="_blank" class="social-link">
            <img src="@/assets/icons/icons8-facebook-nouveau.svg" alt="Facebook" />
          </a>
          <a href="https://linkedin.com" target="_blank" class="social-link">
            <img src="@/assets/icons/icons8-linkedin.svg" alt="Linkedin" />
          </a>
          <a href="https://instagram.com" target="_blank" class="social-link">
            <img src="@/assets/icons/icons8-instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
    </div>

    <!-- Contenu desktop (layout original) -->
    <div class="footer-desktop">
      <!-- Colonne gauche : logo -->
      <div class="footer-left">
        <img src="@/assets/logoblancsvg-25.svg" alt="Logo" class="footer-logo" />
      </div>

      <!-- Colonne centre : titre + bouton -->
      <div class="footer-center">
        <h3 class="footer-title">Abonnez-vous à notre newsletter 📩</h3>
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
    </div>

    <!-- Copyright mobile/desktop -->
    <div class="footer-copyright">
      <p>&copy; {{ new Date().getFullYear() }} MSCG Solo. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>

<style scoped>
/* Mobile-first footer */
.footer {
  background-color: #253786;
  color: white;
  padding: 2rem 1rem 1rem;
  position: relative;
}

@media (min-width: 768px) {
  .footer {
    padding: 2rem;
  }
}

/* Vue mobile (défaut) */
.footer-mobile {
  display: block;
}

.footer-desktop {
  display: none;
}

@media (min-width: 1024px) {
  .footer-mobile {
    display: none;
  }
  
  .footer-desktop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
}

/* Sections mobiles */
.footer-logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.footer-logo {
  height: 80px;
  transition: height 0.2s ease;
}

@media (min-width: 768px) {
  .footer-logo {
    height: 100px;
  }
}

@media (min-width: 1024px) {
  .footer-logo {
    height: 120px;
  }
}

.footer-newsletter {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.newsletter-title {
  color: #f9f9f9;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.4;
}

@media (min-width: 768px) {
  .newsletter-title {
    font-size: 1.25rem;
  }
}

.footer-slogan {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.footer-slogan p {
  color: #f9f9f9;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

@media (min-width: 768px) {
  .footer-slogan p {
    font-size: 1rem;
  }
}

.footer-social {
  text-align: center;
  margin-bottom: 1rem;
}

.social-title {
  color: #f9f9f9;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .social-title {
    display: none; /* Caché sur desktop car redondant */
  }
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 768px) {
  .social-buttons {
    gap: 1.5rem;
  }
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-link img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

@media (min-width: 768px) {
  .social-link img {
    width: 24px;
    height: 24px;
  }
}

/* Copyright */
.footer-copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
  margin-top: 1rem;
}

.footer-copyright p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

@media (min-width: 768px) {
  .footer-copyright p {
    font-size: 0.9rem;
  }
}

/* Styles desktop (layout original) */
@media (min-width: 1024px) {
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

  .footer-right h4 {
    color: #f9f9f9;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    line-height: 1.4;
  }

  .footer-desktop .social-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }

  .footer-desktop .social-buttons a {
    width: auto;
    height: auto;
    background: none;
    border-radius: 0;
  }

  .footer-desktop .social-buttons img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .footer-desktop .social-buttons img:hover {
    opacity: 0.7;
  }
}

/* Animation d'entrée pour mobile */
@media (max-width: 1023px) {
  .footer-mobile > div {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
  }

  .footer-mobile > div:nth-child(1) { animation-delay: 0.1s; }
  .footer-mobile > div:nth-child(2) { animation-delay: 0.2s; }
  .footer-mobile > div:nth-child(3) { animation-delay: 0.3s; }
  .footer-mobile > div:nth-child(4) { animation-delay: 0.4s; }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Touch-friendly pour appareils tactiles */
@media (hover: none) and (pointer: coarse) {
  .social-link:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .social-link:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }
}

/* Responsive amélioration pour très petits écrans */
@media (max-width: 480px) {
  .footer {
    padding: 1.5rem 0.75rem 1rem;
  }
  
  .footer-logo {
    height: 60px;
  }
  
  .footer-newsletter,
  .footer-slogan {
    padding: 0 0.5rem;
  }
  
  .newsletter-title {
    font-size: 1rem;
  }
  
  .footer-slogan p {
    font-size: 0.9rem;
  }
  
  .social-buttons {
    gap: 0.75rem;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
  }
}
</style>
