<template>
  <div>
    <section class="hero-section">
      <div class="hero-content">
        <div class="badge">
          ⚡ Nouvelle génération de comptabilité et gestion
        </div>
        <h1 class="hero-title">
          Manageur MSCG Solo test 2
        </h1>
        <p class="hero-description">
          Simplifiez votre comptabilité, votre gestion et centralisez tous vos documents en un seul endroit. Conçu pour les indépendants qui veulent se concentrer sur l’essentiel : leur activité.
        </p>
        <BaseButton color="primary" size="lg" class="hero-button">
          Commencer gratuitement
        </BaseButton>
      </div>
    </section>

    <!-- Section Avantages -->
    <section class="advantages-section">
      <div class="container">
        <h2 class="section-title">Les avantages du Manageur Solo</h2>
        <p class="section-subtitle">
          Découvrez tous les outils dont vous avez besoin pour gérer votre boutique efficacement
        </p>
        
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle blue">
                <span class="icon">📊</span>
              </div>
            </div>
            <h3 class="advantage-title">Calcul du seuil de rentabilité</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle orange">
                <span class="icon">🎯</span>
              </div>
            </div>
            <h3 class="advantage-title">Calculer ses objectifs de revenus</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle green">
                <span class="icon">💰</span>
              </div>
            </div>
            <h3 class="advantage-title">Calculer son seuil de rentabilité</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle purple">
                <span class="icon">🏢</span>
              </div>
            </div>
            <h3 class="advantage-title">Entreprise / Micro-Entreprise quel est le statut le plus profitable ?</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle teal">
                <span class="icon">📈</span>
              </div>
            </div>
            <h3 class="advantage-title">Construisez votre tableau de bord</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <div class="icon-circle red">
                <span class="icon">💼</span>
              </div>
            </div>
            <h3 class="advantage-title">Prix de vente & rentabilité prestataire et service</h3>
            <p class="advantage-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Comment ça marche -->
    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">
          Découvrez tous les outils dont vous avez besoin pour gérer votre boutique efficacement
        </p>
        
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-icon">
              <div class="step-number">+</div>
            </div>
            <h3 class="step-title">Lorem ipsum</h3>
            <p class="step-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="step-item">
            <div class="step-icon">
              <div class="step-number">+</div>
            </div>
            <h3 class="step-title">Lorem ipsum</h3>
            <p class="step-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>

          <div class="step-item">
            <div class="step-icon">
              <div class="step-number">+</div>
            </div>
            <h3 class="step-title">Lorem ipsum</h3>
            <p class="step-description">
              Lorem the industry's standard dummy text ever since the 
              1500s, when an unknown printer took a galley of type 
              and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
  <Footer />
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
/* Section Hero */
.hero-section {
  background: linear-gradient(135deg, #253786, #4158d0, #8790bb);
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #fff;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
  color: #fff;
}

.hero-button {
  align-self: center;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Sections communes */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #253786;
  text-align: center;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Section Avantages */
.advantages-section {
  padding: 6rem 0;
  background: #f9fafb;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.advantage-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.advantage-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.advantage-icon {
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.icon-circle.blue { background: #dbeafe; }
.icon-circle.orange { background: #fed7aa; }
.icon-circle.green { background: #d1fae5; }
.icon-circle.purple { background: #e9d5ff; }
.icon-circle.teal { background: #ccfbf1; }
.icon-circle.red { background: #fecaca; }

.advantage-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #253786;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.advantage-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Section Comment ça marche */
.how-it-works-section {
  padding: 6rem 0;
  background: white;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.step-item {
  text-align: center;
}

.step-icon {
  margin-bottom: 2rem;
}

.step-number {
  width: 80px;
  height: 80px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #9ca3af;
  margin: 0 auto;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #253786;
  margin-bottom: 1rem;
}

.step-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .advantages-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
}
</style>
