<template>
  <section class="home-content">
    <ContentBlock
      title="CALCUL DU SEUIL DE RENTABILITÉ AVEC LA MSCG"
      description="Et si, en moins de 5 minutes, vous pouviez savoir exactement à partir de quel moment votre entreprise devient rentable ? Avec MSCG Solo, deux variables suffisent. Le pilotage de votre activité n’a jamais été aussi simple."
      videoId="dQw4w9WgXcQ"
    />
    <ContentBlock
      title="CALCULER SES OBJECTIFS DE REVENUS"
      description="Se fixer un objectif de revenus clair, ce n’est pas juste une bonne idée — c’est la base de toute autonomie financière. Avec MSCG Solo, vous identifiez le chiffre qui vous permet de couvrir vos besoins… et de construire votre avenir."
      videoId="V-_O7nl0Ii0"
      :reverse="true"
    />
    <ContentBlock
      title="CALCULER SON SEUIL DE RENTABILTÉ"
      description="Le seuil de rentabilité est le point précis à partir duquel vous créez plus de richesse que de dépenses. Il est donc l’indicateur de base pour le gestionnaire. Il faut pouvoir le calculer en permanence, surtout pour les jeunes entreprises dont la structure technique et humaine évoluent constamment, vous pouvez ainsi mesurer le résultat de vos efforts en permanence."
      videoId="3GwjfUFyY6M"
    />
  </section>
  <section class="card-section">
    <ContentCard
      videoId="dQw4w9WgXcQ"
      title="Entreprise / Micro-Entreprise QUEL EST LE STATUT LE PLUS PROFITABLE ?"
      description="Know everything about the inner line permit before heading to Ladakh because a lot of things have changed since 2017."
    />
    <ContentCard
      videoId="3GwjfUFyY6M"
      title="CONSTRUISEZ VOTRE TABLEAU DE BORD"
      description="Présentation de la deuxième fonctionnalité."
    />
    <ContentCard
      videoId="V-_O7nl0Ii0"
      title="PRIX DE VENTE & RENTABILITÉ Prestataire et service à la personne."
      description="Zoom sur la dernière fonctionnalité importante."
    />
  </section>
  <section class="home-content">
    <ContentBlock
      videoId="dQw4w9WgXcQ"
      title="Un aperçu en action"
      description="Voyez comment notre solution fonctionne concrètement pour vous."
    />
    <ContentBlock
      videoId="V-_O7nl0Ii0"
      title="Pourquoi nous choisir ?"
      description="Nous mettons l'accent sur la simplicité, la sécurité et la performance."
      :reverse="true"
    />
  </section>
</template>

<script setup lang="ts">
import ContentBlock from '@/components/ContentBlock.vue'
import ContentCard from '@/components/ContentCard.vue'
</script>

<style scoped>
.home-content {
  padding: 4rem 2rem;
}

.card-section {
  display: flex;
  justify-content: center;
  align-items: stretch; /* <-- clé pour étirer les enfants à hauteur égale */
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem 2rem;
}

</style>
