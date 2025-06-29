<template>
  <div class="simulation-container">
    <div class="simulation-header">
      <h1>
        Simulation
      </h1>
      
      <!-- Indicateur de chargement -->
      <div v-if="loading" class="loading-indicator">
        <p>Chargement de la simulation...</p>
      </div>
      
      <!-- Indicateur d'étapes -->
      <div class="steps-indicator" :data-progress="currentStep">
        <div 
          v-for="step in steps" 
          :key="step.number"
          class="step-item"
          :class="{ 'active': currentStep === step.number, 'completed': currentStep > step.number }"
          @click="goToStep(step.number)"
        >
          <div class="step-number">
            <span v-if="currentStep <= step.number">{{ step.number }}</span>
          </div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>
    </div>

    <div class="simulation-content">
      <!-- Étape 1: Budget du ménage -->
      <div v-if="currentStep === 1" class="step-content">
        <form @submit.prevent="calculateResults" class="budget-form">
          <h2>Charges minimum vital</h2>
          <div class="categories-grid">
            <div 
              v-for="(category, index) in categories" 
              :key="index" 
              class="category-item"
            >
              <h3>{{ category.name }}</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Mensuel</label>
                  <input 
                    type="number" 
                    v-model.number="category.monthly" 
                    :placeholder="category.placeholderMonthly"
                    step="0.1"
                    @input="updateAnnual(index)"
                  />
                </div>
                <div class="input-field">
                  <label>Annuel</label>
                  <input 
                    type="number" 
                    v-model.number="category.annual" 
                    :placeholder="category.placeholderAnnual"
                    step="0.1"
                    @input="updateMonthly(index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="button" @click="addNewCategory" class="add-field-btn">
            AJOUTER UN CHAMP
          </button>
          
          <hr>
          <h2 class="comfort-title">Charges de confort</h2>
          <div class="categories-grid">
            <div 
              v-for="(category, index) in comfortCategories" 
              :key="'comfort-' + index" 
              class="category-item"
            >
              <h3>{{ category.name }}</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Mensuel</label>
                  <input 
                    type="number" 
                    v-model.number="category.monthly" 
                    :placeholder="category.placeholderMonthly"
                    step="0.1"
                    @input="updateComfortAnnual(index)"
                  />
                </div>
                <div class="input-field">
                  <label>Annuel</label>
                  <input 
                    type="number" 
                    v-model.number="category.annual" 
                    :placeholder="category.placeholderAnnual"
                    step="0.1"
                    @input="updateComfortMonthly(index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="button" @click="addNewComfortCategory" class="add-field-btn">
            AJOUTER UN CHAMP
          </button>

          <div class="results-section">
            <div class="result-item">
              <span class="result-label">Coefficient</span>
              <input 
                type="number" 
                v-model.number="coefficient" 
                step="0.1" 
                min="0.1"
                class="coefficient-input"
              />
            </div>
            <div class="result-item">
              <span class="result-label">Revenu mensuel mini</span>
              <span class="result-value">{{ monthlyMinRevenue.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Charges de confort mensuelles</span>
              <span class="result-value comfort-value">{{ monthlyComfortSupplement.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Revenu amélioré</span>
              <span class="result-value total-value">{{ totalMonthlyRevenue.toFixed(1) }}</span>
            </div>
          </div>
        </form>
      </div>

      <!-- Étape 2: Charges de fonctionnement -->
      <div v-if="currentStep === 2" class="step-content">
        <form @submit.prevent="calculateBreakeven" class="budget-form">
          <h2>Charges Professionnelles</h2>
          <div class="categories-grid">
            <div 
              v-for="(charge, index) in operatingCharges" 
              :key="'charge-' + index" 
              class="category-item"
            >
              <h3>{{ charge.name }}</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Mensuel</label>
                  <input 
                    type="number" 
                    v-model.number="charge.monthly" 
                    :placeholder="charge.placeholderMonthly"
                    step="0.1"
                    @input="updateChargeAnnual(index)"
                  />
                </div>
                <div class="input-field">
                  <label>Annuel</label>
                  <input 
                    type="number" 
                    v-model.number="charge.annual" 
                    :placeholder="charge.placeholderAnnual"
                    step="0.1"
                    @input="updateChargeMonthly(index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="button" @click="addNewCharge" class="add-field-btn">
            AJOUTER UN CHAMP
          </button>

          <hr>
          <h2 class="social-charges-title">Paramètres des charges sociales</h2>
          <div class="categories-grid">
            <div class="category-item">
              <h3>Micro-Entreprise - Taux charges sociales</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Taux (%)</label>
                  <input 
                    type="number" 
                    v-model.number="socialChargesParams.microEnterprise.socialChargesRate" 
                    min="0" 
                    max="1"
                    step="0.01"
                    placeholder="0.22"
                    class="sim-input"
                  />
                </div>
                <div class="input-field">
                  <label>Taux en pourcentage</label>
                  <input 
                    type="number" 
                    :value="(socialChargesParams.microEnterprise.socialChargesRate * 100).toFixed(1)" 
                    readonly
                    class="sim-input readonly"
                  />
                </div>
              </div>
            </div>

            <div class="category-item">
              <h3>Micro-Entreprise - Taux marge brute</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Taux (%)</label>
                  <input 
                    type="number" 
                    v-model.number="socialChargesParams.microEnterprise.grossMarginRate" 
                    min="0"
                    max="1"
                    step="0.01"
                    placeholder="0.30"
                    class="sim-input"
                  />
                </div>
                <div class="input-field">
                  <label>Taux en pourcentage</label>
                  <input 
                    type="number" 
                    :value="(socialChargesParams.microEnterprise.grossMarginRate * 100).toFixed(1)" 
                    readonly
                    class="sim-input readonly"
                  />
                </div>
              </div>
            </div>

            <div class="category-item">
              <h3>Entreprise - Taux charges base</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Taux (%)</label>
                  <input 
                    type="number" 
                    v-model.number="socialChargesParams.enterprise.socialChargesRateBase" 
                    min="0" 
                    max="1"
                    step="0.01"
                    placeholder="0.45"
                  />
                </div>
                <div class="input-field">
                  <label>Taux en pourcentage</label>
                  <input 
                    type="number" 
                    :value="(socialChargesParams.enterprise.socialChargesRateBase * 100).toFixed(1)" 
                    readonly
                    class="readonly-field"
                  />
                </div>
              </div>
            </div>

            <div class="category-item">
              <h3>Entreprise - Taux charges élevé</h3>
              <div class="input-group">
                <div class="input-field">
                  <label>Taux (%)</label>
                  <input 
                    type="number" 
                    v-model.number="socialChargesParams.enterprise.socialChargesRateHigh" 
                    min="0" 
                    max="1"
                    step="0.01"
                    placeholder="0.50"
                  />
                </div>
                <div class="input-field">
                  <label>Taux en pourcentage</label>
                  <input 
                    type="number" 
                    :value="(socialChargesParams.enterprise.socialChargesRateHigh * 100).toFixed(1)" 
                    readonly
                    class="readonly-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="results-section">
            <div class="result-item">
              <span class="result-label">Revenu minimum net visé</span>
              <span class="result-value">{{ monthlyMinRevenue.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Charges de confort</span>
              <span class="result-value comfort-value">{{ monthlyComfortSupplement.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Revenu amélioré</span>
              <span class="result-value total-value">{{ totalMonthlyRevenue.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Charges professionnelles</span>
              <span class="result-value charges-value">{{ totalOperatingCharges.toFixed(1) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Charges sociales Micro-Entreprise</span>
              <span class="result-value social-charges-value">{{ (socialChargesParams.microEnterprise.socialChargesRate * 100).toFixed(1) }}%</span>
            </div>
            <div class="result-item">
              <span class="result-label">Charges sociales Entreprise</span>
              <span class="result-value social-charges-value">{{ (socialChargesParams.enterprise.socialChargesRateBase * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </form>
      </div>

      <!-- Étape 3: Paramètres temporels & Seuils -->
      <div v-if="currentStep === 3" class="step-content">
        <form @submit.prevent="calculateFinalResults" class="budget-form">
          
          <!-- Paramètres temporels -->
          <div class="temporal-params">
            <h3>Paramètres temporels</h3>
            <div class="params-grid">
              <div class="param-item">
                <label>Semaines Exercice</label>
                <input 
                  type="number" 
                  v-model.number="temporalParams.weeksPerYear" 
                  min="1" 
                  max="52"
                  class="param-input"
                />
              </div>
              <div class="param-item">
                <label>Jours ouvrés/semaine</label>
                <input 
                  type="number" 
                  v-model.number="temporalParams.workingDaysPerWeek" 
                  min="1" 
                  max="7"
                  step="0.1"
                  class="param-input"
                />
              </div>
              <div class="param-item">
                <label>Semaines de vacances</label>
                <input 
                  type="number" 
                  v-model.number="temporalParams.vacationWeeks" 
                  min="0" 
                  max="52"
                  step="0.1"
                  class="param-input"
                />
              </div>
              <div class="param-item">
                <label>Mois ouvrés par an</label>
                <input 
                  type="number" 
                  v-model.number="temporalParams.workingMonthsPerYear" 
                  min="1" 
                  max="12"
                  step="0.01"
                  class="param-input"
                />
              </div>
            </div>
          </div>

                    <!-- Tableau des résultats consolidé -->
          <div class="consolidated-results">
            <h3>Seuils de Rentabilité & Comparaison des Statuts</h3>
            
            <div class="results-table-container">
              <table class="results-table">
                <thead>
                  <tr>
                    <th class="period-header">Période</th>
                    <th colspan="2" class="status-header micro">Micro-Entreprise</th>
                    <th colspan="2" class="status-header enterprise">Entreprise</th>
                  </tr>
                  <tr class="sub-header">
                    <th></th>
                    <th class="revenue-type">Mini</th>
                    <th class="revenue-type">Confort</th>
                    <th class="revenue-type">Mini</th>
                    <th class="revenue-type">Confort</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="annual-row">
                    <td class="period-label">An (exercice)</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round((monthlyMinRevenue + totalOperatingCharges) * 12).toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? iterativeChargesResults.microEnterprise.revenue.toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round((monthlyMinRevenue + totalOperatingCharges) * 12).toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? iterativeChargesResults.enterprise.revenue.toLocaleString() : '-' }} €</td>
                  </tr>
                  <tr class="monthly-row">
                    <td class="period-label">Mois</td>
                    <td class="value-cell">{{ Math.round(monthlyMinRevenue + totalOperatingCharges).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.microEnterprise.revenue / 12).toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ Math.round(monthlyMinRevenue + totalOperatingCharges).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.enterprise.revenue / 12).toLocaleString() : '-' }} €</td>
                  </tr>
                  <tr class="weekly-row">
                    <td class="period-label">Semaine</td>
                    <td class="value-cell">{{ Math.round(weeklyBreakevenRevenueMin).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.microEnterprise.revenue / workingWeeksPerYear).toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ Math.round(weeklyBreakevenRevenueMin).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.enterprise.revenue / workingWeeksPerYear).toLocaleString() : '-' }} €</td>
                  </tr>
                  <tr class="daily-row">
                    <td class="period-label">Jour</td>
                    <td class="value-cell">{{ Math.round(dailyBreakevenRevenueMin).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.microEnterprise.revenue / workingDaysPerYear).toLocaleString() : '-' }} €</td>
                    <td class="value-cell">{{ Math.round(dailyBreakevenRevenueMin).toLocaleString() }} €</td>
                    <td class="value-cell">{{ iterativeChargesResults.converged ? Math.round(iterativeChargesResults.enterprise.revenue / workingDaysPerYear).toLocaleString() : '-' }} €</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Recommandation -->
            <div v-if="socialChargesComparison && iterativeChargesResults.converged" class="recommendation-summary">
              <div class="recommendation-card">
                <h4>💡 Recommandation</h4>
                <div class="recommendation-content">
                  <p><strong>Statut optimal :</strong> <span class="highlight">{{ socialChargesComparison.betterOption }}</span></p>
                  <p><strong>Économie mensuelle :</strong> <span class="savings">{{ socialChargesComparison.difference.toLocaleString() }} €</span></p>
                  
                  <div v-if="grossMarginStatus" class="margin-info">
                    <div class="margin-item">
                      <span class="status-label">Micro-Entreprise:</span>
                      <span :class="['status-badge', grossMarginStatus.microAboveThreshold ? 'above' : 'below']">
                        {{ grossMarginStatus.microAboveThreshold ? 'Au-dessus du seuil' : 'Sous le seuil' }}
                      </span>
                    </div>
                    <div class="margin-item">
                      <span class="status-label">Entreprise:</span>
                      <span :class="['status-badge', grossMarginStatus.enterpriseAboveThreshold ? 'above' : 'below']">
                        {{ grossMarginStatus.enterpriseAboveThreshold ? 'Au-dessus du seuil' : 'Sous le seuil' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Citation inspirante -->
            <div class="inspiration-quote">
              <p><em>"Il n'existe pas de vent favorable pour celui qui ne sait où est le port"</em></p>
              <small>- Sénèque</small>
            </div>
          </div>
        </form>
      </div>

      <!-- Navigation -->
      <div class="navigation-buttons">
        <button 
          v-if="currentStep > 1"
          @click="previousStep" 
          class="nav-button prev-button"
        >
          ← Précédent
        </button>
        <button 
          v-if="currentStep < steps.length"
          @click="nextStep" 
          class="nav-button next-button"
        >
          Suivant →
        </button>
        <button 
          v-if="currentStep === steps.length"
          @click="finishSimulation" 
          class="nav-button finish-button"
          :disabled="saving"
        >
          {{ saving ? 'Sauvegarde...' : 'Terminer la simulation' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService, { ApiService } from '@/services/apiService'
import '@/assets/simulation.css'

interface Category {
  name: string
  monthly: number | null
  annual: number | null
  placeholderMonthly: string
  placeholderAnnual: string
}

interface Step {
  number: number
  label: string
}

// Configuration des étapes
const steps = ref<Step[]>([
  { number: 1, label: 'Budget du ménage' },
  { number: 2, label: 'Charges de fonctionnement' },
  { number: 3, label: 'Paramètres temporels & Seuils' }
])

const currentStep = ref<number>(1)

// État de sauvegarde et navigation
const saving = ref(false)
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// SimulationView est maintenant uniquement pour créer de nouvelles simulations
// Pour consulter les résultats, utiliser ResultsView

// Données existantes (Étape 1)
const categories = ref<Category[]>([
  { name: 'Logement', monthly: null, annual: null, placeholderMonthly: '800', placeholderAnnual: '9600' },
  { name: 'Eau', monthly: null, annual: null, placeholderMonthly: '35', placeholderAnnual: '420' },
  { name: 'Électricité', monthly: null, annual: null, placeholderMonthly: '80', placeholderAnnual: '960' },
  { name: 'Chauffage', monthly: null, annual: null, placeholderMonthly: '120', placeholderAnnual: '1440' },
  { name: 'Épicerie', monthly: null, annual: null, placeholderMonthly: '400', placeholderAnnual: '4800' },
  { name: 'Entretien Véhicule', monthly: null, annual: null, placeholderMonthly: '100', placeholderAnnual: '1200' },
  { name: 'Assurance Logement', monthly: null, annual: null, placeholderMonthly: '25', placeholderAnnual: '300' },
  { name: 'Assurance Véhicule', monthly: null, annual: null, placeholderMonthly: '60', placeholderAnnual: '720' },
  { name: 'Vêtement', monthly: null, annual: null, placeholderMonthly: '80', placeholderAnnual: '960' },
  { name: 'Téléphone', monthly: null, annual: null, placeholderMonthly: '25', placeholderAnnual: '300' },
  { name: 'Matériel / Équipement', monthly: null, annual: null, placeholderMonthly: '50', placeholderAnnual: '600' },
  { name: 'Divers', monthly: null, annual: null, placeholderMonthly: '150', placeholderAnnual: '1800' }
])

const comfortCategories = ref<Category[]>([
  { name: 'Sorties', monthly: null, annual: null, placeholderMonthly: '450', placeholderAnnual: '5400' },
  { name: 'Vacances', monthly: null, annual: null, placeholderMonthly: '200', placeholderAnnual: '2400' },
  { name: 'Hobbies', monthly: null, annual: null, placeholderMonthly: '150', placeholderAnnual: '1800' },
  { name: 'Divers', monthly: null, annual: null, placeholderMonthly: '100', placeholderAnnual: '1200' },
  { name: 'Épargne', monthly: null, annual: null, placeholderMonthly: '300', placeholderAnnual: '3600' },
  { name: 'Projet', monthly: null, annual: null, placeholderMonthly: '250', placeholderAnnual: '3000' }
])

// Nouvelles données (Étape 2)
const operatingCharges = ref<Category[]>([
  { name: 'Coût de la rémunération', monthly: null, annual: null, placeholderMonthly: '2351', placeholderAnnual: '28211' },
  { name: 'Loyer et charges Locatives', monthly: null, annual: null, placeholderMonthly: '0', placeholderAnnual: '0' },
  { name: 'Énergies (EDF, Eau etc.)', monthly: null, annual: null, placeholderMonthly: '0', placeholderAnnual: '0' },
  { name: 'Matériel informatique', monthly: null, annual: null, placeholderMonthly: '15', placeholderAnnual: '175' },
  { name: 'Accès internet', monthly: null, annual: null, placeholderMonthly: '32', placeholderAnnual: '384' },
  { name: 'Abonnement logiciel bureau', monthly: null, annual: null, placeholderMonthly: '0', placeholderAnnual: '0' },
  { name: 'Abonnement appli Webmarketing', monthly: null, annual: null, placeholderMonthly: '30', placeholderAnnual: '360' },
  { name: 'Fournitures de bureaux', monthly: null, annual: null, placeholderMonthly: '8', placeholderAnnual: '96' },
  { name: 'Hébergement Site web', monthly: null, annual: null, placeholderMonthly: '10', placeholderAnnual: '120' },
  { name: 'Site web (graphiste)', monthly: null, annual: null, placeholderMonthly: '10', placeholderAnnual: '120' },
  { name: 'Téléphone portable', monthly: null, annual: null, placeholderMonthly: '15', placeholderAnnual: '180' },
  { name: 'Dépense de Communication non ciblée', monthly: null, annual: null, placeholderMonthly: '22', placeholderAnnual: '264' },
  { name: 'Formations BB webmarketing O.I.B.', monthly: null, annual: null, placeholderMonthly: '13', placeholderAnnual: '156' },
  { name: 'Impôts et taxes (CFE)', monthly: null, annual: null, placeholderMonthly: '18', placeholderAnnual: '216' },
  { name: 'Autres impôts et taxes', monthly: null, annual: null, placeholderMonthly: '10', placeholderAnnual: '120' },
  { name: 'Frais bancaires', monthly: null, annual: null, placeholderMonthly: '10', placeholderAnnual: '120' },
  { name: 'Personnel d\'appoint', monthly: null, annual: null, placeholderMonthly: '90', placeholderAnnual: '1080' },
  { name: 'Carburant et entretien Production', monthly: null, annual: null, placeholderMonthly: '60', placeholderAnnual: '720' },
  { name: 'Amortissement biens de Production', monthly: null, annual: null, placeholderMonthly: '0', placeholderAnnual: '0' },
  { name: 'Expert Comptable', monthly: null, annual: null, placeholderMonthly: '0', placeholderAnnual: '0' },
  { name: 'Subvention ACCRE', monthly: null, annual: null, placeholderMonthly: '-400', placeholderAnnual: '-4800' }
])

// Paramètres temporels (Étape 3)
const temporalParams = ref({
  weeksPerYear: 52,
  workingDaysPerWeek: 6.00,
  vacationWeeks: 6.00,
  workingMonthsPerYear: 10.62
})

// Paramètres des charges sociales et fiscales
const socialChargesParams = ref({
  microEnterprise: {
    socialChargesRate: 0.22, // 22% pour auto-entrepreneur
    grossMarginRate: 0.30, // 30% de marge brute
    grossMarginThreshold: 100000 // Seuil de marge brute
  },
  enterprise: {
    socialChargesRateBase: 0.45, // Base des charges sociales entreprise
    socialChargesRateHigh: 0.50  // Taux élevé au-dessus du seuil
  }
})



// Fonctions de mise à jour existantes
const updateAnnual = (index: number) => {
  if (categories.value[index].monthly !== null) {
    categories.value[index].annual = Math.round((categories.value[index].monthly * 12) * 100) / 100
  }
}

const updateMonthly = (index: number) => {
  if (categories.value[index].annual !== null) {
    categories.value[index].monthly = Math.round((categories.value[index].annual / 12) * 100) / 100
  }
}

const updateComfortAnnual = (index: number) => {
  if (comfortCategories.value[index].monthly !== null) {
    comfortCategories.value[index].annual = Math.round((comfortCategories.value[index].monthly * 12) * 100) / 100
  }
}

const updateComfortMonthly = (index: number) => {
  if (comfortCategories.value[index].annual !== null) {
    comfortCategories.value[index].monthly = Math.round((comfortCategories.value[index].annual / 12) * 100) / 100
  }
}

// Nouvelles fonctions pour les charges
const updateChargeAnnual = (index: number) => {
  if (operatingCharges.value[index].monthly !== null) {
    operatingCharges.value[index].annual = Math.round((operatingCharges.value[index].monthly * 12) * 100) / 100
  }
}

const updateChargeMonthly = (index: number) => {
  if (operatingCharges.value[index].annual !== null) {
    operatingCharges.value[index].monthly = Math.round((operatingCharges.value[index].annual / 12) * 100) / 100
  }
}

// Fonctions d'ajout
const addNewCategory = () => {
  const newCategoryName = prompt('Nom de la nouvelle catégorie:')
  if (newCategoryName) {
    categories.value.push({
      name: newCategoryName,
      monthly: null,
      annual: null,
      placeholderMonthly: '0',
      placeholderAnnual: '0'
    })
  }
}

const addNewComfortCategory = () => {
  const newCategoryName = prompt('Nom de la nouvelle catégorie de confort:')
  if (newCategoryName) {
    comfortCategories.value.push({
      name: newCategoryName,
      monthly: null,
      annual: null,
      placeholderMonthly: '0',
      placeholderAnnual: '0'
    })
  }
}

const addNewCharge = () => {
  const newChargeName = prompt('Nom de la nouvelle charge:')
  if (newChargeName) {
    operatingCharges.value.push({
      name: newChargeName,
      monthly: null,
      annual: null,
      placeholderMonthly: '0',
      placeholderAnnual: '0'
    })
  }
}

// Variables et calculs existants
const coefficient = ref<number>(1.0)

const totalMonthly = computed(() => {
  return categories.value.reduce((sum, category) => sum + (category.monthly || 0), 0)
})

const totalComfortMonthly = computed(() => {
  return comfortCategories.value.reduce((sum, category) => sum + (category.monthly || 0), 0)
})

const monthlyMinRevenue = computed(() => {
  return totalMonthly.value * coefficient.value
})

const monthlyComfortSupplement = computed(() => {
  return totalComfortMonthly.value * coefficient.value
})

const totalMonthlyRevenue = computed(() => {
  return monthlyMinRevenue.value + monthlyComfortSupplement.value
})

// Nouveaux calculs pour l'étape 2
const totalOperatingCharges = computed(() => {
  return operatingCharges.value.reduce((sum, charge) => sum + (charge.monthly || 0), 0)
})

const breakevenThreshold = computed(() => {
  return totalMonthlyRevenue.value + totalOperatingCharges.value
})

// Calculs pour l'étape 3 - Seuils de rentabilité détaillés
const workingWeeksPerYear = computed(() => {
  return temporalParams.value.weeksPerYear - temporalParams.value.vacationWeeks
})

const workingDaysPerYear = computed(() => {
  return workingWeeksPerYear.value * temporalParams.value.workingDaysPerWeek
})

// Chiffres d'affaires de rentabilité
const annualBreakevenRevenue = computed(() => {
  return breakevenThreshold.value * 12
})

const annualBreakevenRevenueMin = computed(() => {
  return (monthlyMinRevenue.value + totalOperatingCharges.value) * 12
})

const monthlyBreakevenRevenue = computed(() => {
  return annualBreakevenRevenue.value / 12
})

const monthlyBreakevenRevenueMin = computed(() => {
  return annualBreakevenRevenueMin.value / 12
})

const weeklyBreakevenRevenue = computed(() => {
  return annualBreakevenRevenue.value / workingWeeksPerYear.value
})

const weeklyBreakevenRevenueMin = computed(() => {
  return annualBreakevenRevenueMin.value / workingWeeksPerYear.value
})

const dailyBreakevenRevenue = computed(() => {
  return annualBreakevenRevenue.value / workingDaysPerYear.value
})

const dailyBreakevenRevenueMin = computed(() => {
  return annualBreakevenRevenueMin.value / workingDaysPerYear.value
})

// Calcul automatique et dynamique des charges sociales
const iterativeChargesResults = computed(() => {
  const targetNetRevenue = totalMonthlyRevenue.value * 12 // Revenu net souhaité annuel
  const operatingChargesAnnual = totalOperatingCharges.value * 12
  const maxIterations = 100
  const tolerance = 1 // Tolérance de 1€

  // Initialisation des résultats
  const results = {
    microEnterprise: {
      revenue: 0,
      socialCharges: 0,
      netRevenue: 0,
      iterations: 0
    },
    enterprise: {
      revenue: 0,
      socialCharges: 0,
      netRevenue: 0,
      iterations: 0
    },
    converged: false
  }

  // Si pas de revenu cible, on retourne des résultats vides
  if (targetNetRevenue <= 0) {
    return results
  }

  // Calcul pour Micro-Entreprise
  let microRevenue = targetNetRevenue + operatingChargesAnnual
  let microIterations = 0
  let microConverged = false

  while (microIterations < maxIterations && !microConverged) {
    const socialCharges = microRevenue * socialChargesParams.value.microEnterprise.socialChargesRate
    const netAfterCharges = microRevenue - socialCharges - operatingChargesAnnual
    
    if (Math.abs(netAfterCharges - targetNetRevenue) < tolerance) {
      microConverged = true
      results.microEnterprise = {
        revenue: Math.round(microRevenue),
        socialCharges: Math.round(socialCharges),
        netRevenue: Math.round(netAfterCharges),
        iterations: microIterations
      }
    } else {
      // Ajustement pour la prochaine itération
      const adjustment = (targetNetRevenue - netAfterCharges) / (1 - socialChargesParams.value.microEnterprise.socialChargesRate)
      microRevenue += adjustment
      microIterations++
    }
  }

  // Calcul pour Entreprise (plus complexe avec seuils)
  let enterpriseRevenue = targetNetRevenue + operatingChargesAnnual
  let enterpriseIterations = 0
  let enterpriseConverged = false

  while (enterpriseIterations < maxIterations && !enterpriseConverged) {
    // Calcul des charges sociales progressives
    let socialChargesRate = socialChargesParams.value.enterprise.socialChargesRateBase
    if (enterpriseRevenue > socialChargesParams.value.microEnterprise.grossMarginThreshold) {
      socialChargesRate = socialChargesParams.value.enterprise.socialChargesRateHigh
    }
    
    const socialCharges = enterpriseRevenue * socialChargesRate
    const netAfterCharges = enterpriseRevenue - socialCharges - operatingChargesAnnual
    
    if (Math.abs(netAfterCharges - targetNetRevenue) < tolerance) {
      enterpriseConverged = true
      results.enterprise = {
        revenue: Math.round(enterpriseRevenue),
        socialCharges: Math.round(socialCharges),
        netRevenue: Math.round(netAfterCharges),
        iterations: enterpriseIterations
      }
    } else {
      // Ajustement pour la prochaine itération
      const adjustment = (targetNetRevenue - netAfterCharges) / (1 - socialChargesRate)
      enterpriseRevenue += adjustment
      enterpriseIterations++
    }
  }

  results.converged = microConverged && enterpriseConverged
  
  return results
})

// Calculs automatiques des comparaisons
const socialChargesComparison = computed(() => {
  if (!iterativeChargesResults.value.converged) return null
  
  const microMonthly = iterativeChargesResults.value.microEnterprise.revenue / 12
  const enterpriseMonthly = iterativeChargesResults.value.enterprise.revenue / 12
  const difference = Math.abs(microMonthly - enterpriseMonthly)
  const betterOption = microMonthly < enterpriseMonthly ? 'Micro-Entreprise' : 'Entreprise'
  
  return {
    microMonthly: Math.round(microMonthly),
    enterpriseMonthly: Math.round(enterpriseMonthly),
    difference: Math.round(difference),
    betterOption,
    microAnnual: iterativeChargesResults.value.microEnterprise.revenue,
    enterpriseAnnual: iterativeChargesResults.value.enterprise.revenue
  }
})

// Seuil de marge brute
const grossMarginStatus = computed(() => {
  if (!iterativeChargesResults.value.converged) return null
  
  const microRevenue = iterativeChargesResults.value.microEnterprise.revenue
  const enterpriseRevenue = iterativeChargesResults.value.enterprise.revenue
  const threshold = socialChargesParams.value.microEnterprise.grossMarginThreshold
  
  return {
    microAboveThreshold: microRevenue > threshold,
    enterpriseAboveThreshold: enterpriseRevenue > threshold,
    threshold
  }
})

// Fonctions de navigation
const nextStep = () => {
  if (currentStep.value < steps.value.length) {
    currentStep.value++
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToStep = (stepNumber: number) => {
  if (stepNumber >= 1 && stepNumber <= steps.value.length) {
    currentStep.value = stepNumber
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const finishSimulation = () => {
  if (!authStore.isAuthenticated) {
    alert('Vous devez être connecté pour sauvegarder une simulation')
    return
  }

  // Demander le nom de la simulation
  const simulationName = prompt('Nom de la simulation:', 'Ma simulation du ' + new Date().toLocaleDateString())
  if (!simulationName) {
    return
  }

  saving.value = true

  try {
    // Préparer les données complexes du formulaire
    const complexFormData = {
      name: simulationName,
      categories: categories.value.map(cat => ({
        name: cat.name,
        monthly: cat.monthly || 0
      })),
      comfortCategories: comfortCategories.value.map(cat => ({
        name: cat.name,
        monthly: cat.monthly || 0
      })),
      operatingCharges: operatingCharges.value.map(charge => ({
        name: charge.name,
        monthly: charge.monthly || 0
      })),
      coefficient: coefficient.value,
      temporalParams: temporalParams.value,
      socialChargesParams: socialChargesParams.value,
      calculatedResults: {
        totalMonthlyRevenue: totalMonthlyRevenue.value,
        totalVitalCharges: totalMonthly.value,
        totalComfortCharges: totalComfortMonthly.value,
        totalOperatingCharges: totalOperatingCharges.value,
        iterativeChargesResults: iterativeChargesResults.value?.converged ? [iterativeChargesResults.value] : [],
        iterativeRevenueResults: [],
        iterativeSocialChargesResults: [],
        finalNetRevenue: iterativeChargesResults.value?.converged ? 
          (iterativeChargesResults.value.microEnterprise?.netRevenue || totalMonthlyRevenue.value) : 
          totalMonthlyRevenue.value,
        finalGrossRevenue: iterativeChargesResults.value?.converged ? 
          (iterativeChargesResults.value.microEnterprise?.revenue || totalMonthlyRevenue.value * 12) : 
          totalMonthlyRevenue.value * 12,
        microEnterpriseRevenue: iterativeChargesResults.value?.converged ? 
          (iterativeChargesResults.value.microEnterprise?.revenue || 0) : 0,
        enterpriseRevenue: iterativeChargesResults.value?.converged ? 
          (iterativeChargesResults.value.enterprise?.revenue || 0) : 0
      }
    }

    // Convertir vers le format MPD simple en utilisant la méthode statique
    const simulationData = ApiService.convertComplexFormToMPD(complexFormData)

    // Sauvegarder via l'API
    apiService.createSimulation(simulationData)
      .then(response => {
        saving.value = false
        alert('Simulation sauvegardée avec succès !')
        
        // Rediriger vers le dashboard
        router.push('/')
      })
      .catch(error => {
        saving.value = false
        console.error('Erreur sauvegarde simulation:', error)
        alert('Erreur lors de la sauvegarde : ' + error.message)
      })

  } catch (error) {
    saving.value = false
    console.error('Erreur préparation données:', error)
    alert('Erreur lors de la préparation des données')
  }
}

// Fonctions de calcul
const calculateResults = () => {
  console.log('Résultats étape 1 calculés')
}

const calculateBreakeven = () => {
  console.log('Seuil de rentabilité calculé')
}

const calculateFinalResults = () => {
  console.log('Résultats finaux calculés')
}

// Logique de chargement supprimée - utiliser ResultsView pour consulter les simulations existantes

// SimulationView est maintenant un formulaire propre pour créer de nouvelles simulations
// Pas de logique de chargement - voir ResultsView pour les simulations existantes
</script>

<style scoped>
/* Styles spécifiques à la simulation (importés depuis simulation.css) */
.simulation-container {
  min-height: 100vh;
  background-color: var(--color-bg-light);
}

.simulation-header {
  color: white;
  padding: 2rem;
}

.simulation-header h1 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

/* Indicateur d'étapes - Mobile First */
.steps-indicator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem auto;
  width: 100%;
  max-width: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .steps-indicator {
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
    max-width: 500px;
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  .steps-indicator {
    max-width: 600px;
    padding: 1.5rem;
  }
}

/* Ligne de progression - cachée sur mobile */
.steps-indicator::before {
  display: none;
}

@media (min-width: 768px) {
  .steps-indicator::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 5%;
    right: 5%;
    height: 3px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    border-radius: 2px;
    transform: translateY(-50%);
    z-index: 1;
  }
}

.step-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid transparent;
}

@media (min-width: 768px) {
  .step-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    flex: 1;
    padding: 0;
    background: transparent;
    border: none;
  }
}

.step-item:hover {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.4);
}

@media (min-width: 768px) {
  .step-item:hover {
    transform: translateY(-2px);
    background: transparent;
    border: none;
  }
}

.step-item.active {
  background: rgba(74, 109, 134, 0.1);
  border-color: var(--color-primary);
}

@media (min-width: 768px) {
  .step-item.active {
    background: transparent;
    border: none;
  }
}

.step-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .step-number {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .step-number {
    width: 60px;
    height: 60px;
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
    box-shadow: var(--shadow-lg);
  }
}

/* États des étapes */
.step-item .step-number {
  background: rgba(255, 255, 255, 0.4);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

@media (min-width: 1024px) {
  .step-item .step-number {
    border: 3px solid var(--color-primary);
  }
}

.step-item.active .step-number {
  background: linear-gradient(135deg, var(--color-bg-white), var(--color-bg-gray));
  color: var(--color-accent);
  border-color: var(--color-primary);
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4);
}

@media (min-width: 768px) {
  .step-item.active .step-number {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3), 
                0 0 0 3px rgba(255, 255, 255, 0.2);
  }
}

@media (min-width: 1024px) {
  .step-item.active .step-number {
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3), 
                0 0 0 4px rgba(255, 255, 255, 0.2);
  }
}

.step-item.completed .step-number {
  background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
  color: white;
  border-color: var(--color-success);
  transform: scale(1.02);
  box-shadow: 0 3px 12px rgba(40, 167, 69, 0.3);
}

@media (min-width: 768px) {
  .step-item.completed .step-number {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }
}

.step-item.completed .step-number::after {
  content: '✓';
  position: absolute;
  font-size: 1rem;
  font-weight: 900;
}

@media (min-width: 768px) {
  .step-item.completed .step-number::after {
    font-size: 1.2rem;
  }
}

.step-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  flex: 1;
}

@media (min-width: 768px) {
  .step-label {
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    flex: none;
  }
}

@media (min-width: 1024px) {
  .step-label {
    font-size: 0.95rem;
  }
}

.step-item .step-label {
  color: var(--color-primary);
}

.step-item.completed .step-label {
  color: #059669;
}

/* Ligne de progression dynamique - cachée sur mobile */
.steps-indicator::after {
  display: none;
}

@media (min-width: 768px) {
  .steps-indicator::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 5%;
    height: 3px;
    background: var(--color-primary);
    border-radius: 2px;
    transform: translateY(-50%);
    z-index: 1;
    width: 0%;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (min-width: 1024px) {
  .steps-indicator::after {
    height: 4px;
  }
}

/* Largeur de la barre de progression selon l'étape active */
@media (min-width: 768px) {
  .steps-indicator[data-progress="1"]::after { width: 20%; }
  .steps-indicator[data-progress="2"]::after { width: 50%; }
  .steps-indicator[data-progress="3"]::after { width: 80%; }
}

.simulation-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.simulation-content h2 {
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.comfort-title,
.social-charges-title {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
}

.budget-form {
  background: var(--color-bg-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.category-item {
  padding: var(--spacing-sm);
}

.category-item h3 {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
}

.input-group {
  display: flex;
  gap: var(--spacing-sm);
}

.input-field {
  flex: 1;
}

.input-field label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.input-field input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
  background-color: var(--color-bg-gray);
  transition: border-color 0.2s ease;
}

.input-field input:focus {
  outline: none;
  border-color: var(--color-secondary);
  background-color: var(--color-bg-white);
}

.add-field-btn {
  display: block;
  margin: var(--spacing-lg) auto;
  padding: 0.75rem var(--spacing-lg);
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-field-btn:hover {
  background-color: var(--color-accent);
  color: white;
}

.results-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
  border-top: 3px solid var(--color-secondary);
  gap: var(--spacing-sm);
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.result-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.result-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.comfort-value {
  color: var(--color-secondary);
}

.total-value {
  color: var(--color-success);
  font-size: 2.2rem;
}

.charges-value {
  color: var(--color-danger);
}

.breakeven-value {
  color: var(--color-warning);
}

.social-charges-value {
  color: var(--color-info);
}

/* Styles spécifiques supprimés - utilisation du style commun de l'étape 1 */

.coefficient-input {
  font-size: 2rem;
  font-weight: 700;
  color: #2B3A46;
  background-color: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
  width: 120px;
  transition: border-color 0.2s ease;
}

.coefficient-input:focus {
  outline: none;
  border-color: #4A6D86;
  background-color: white;
}

/* Les champs readonly utilisent maintenant .sim-input.readonly */

/* Styles pour l'étape 2 - Seuil de rentabilité */
.breakeven-section {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.breakeven-section h3 {
  color: #28a745;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
  text-align: center;
}

.breakeven-section h4 {
  color: #2B3A46;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

/* Sections de résumé */
.budget-summary, .charges-summary {
  background: white;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.budget-summary {
  border-left: 4px solid #4A6D86;
}

.charges-summary {
  border-left: 4px solid #dc3545;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.summary-item.total-charges {
  background: #fff5f5;
  border-color: #fed7d7;
}

.summary-label {
  font-weight: 600;
  color: #2B3A46;
  flex: 1;
}

.summary-values {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 0.25rem;
}

.monthly-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2B3A46;
}

.monthly-value.highlight {
  color: #dc3545;
  font-size: 1.4rem;
}

.annual-value {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.annual-value::before {
  content: '(';
}

.annual-value::after {
  content: ' annuel)';
}

/* Résultats finaux */
.breakeven-results {
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 8px;
  padding: 2rem;
  color: white;
}

.breakeven-results h4 {
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
}

.breakeven-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.breakeven-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease;
}

.breakeven-item:hover {
  transform: translateY(-2px);
}

.breakeven-item.priority {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.breakeven-value {
  color: white !important;
  font-size: 2.5rem !important;
  font-weight: 800 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Styles pour l'étape 3 - Paramètres temporels & Seuils */
.temporal-params {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid #253786;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tableau consolidé des résultats - Mobile First */
.consolidated-results {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 8px;
  padding: 1.5rem 1rem;
  margin-top: 2rem;
  border: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .consolidated-results {
    border-radius: 12px;
    padding: 2rem;
  }
}

.consolidated-results h3 {
  color: #2B3A46;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .consolidated-results h3 {
    font-size: 1.4rem;
    margin-bottom: 2rem;
    letter-spacing: 1px;
  }
}

.results-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .results-table-container {
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    overflow-x: auto;
  }
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 600px;
}

@media (min-width: 768px) {
  .results-table {
    font-size: 0.9rem;
    min-width: auto;
  }
}

@media (min-width: 1024px) {
  .results-table {
    font-size: 1rem;
  }
}

.results-table thead {
  background: #1a365d;
  color: white;
}

.period-header {
  background: #1a365d;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  vertical-align: middle;
  color: white;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .period-header {
    padding: 1rem;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
  }
}

.status-header {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  position: relative;
  color: white;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .status-header {
    padding: 1rem;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
  }
}

.status-header.micro {
  background: #047857;
}

.status-header.enterprise {
  background: #1e40af;
}

.sub-header th {
  background: #2d3748;
  padding: 0.5rem 0.25rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.75rem;
  border-bottom: 2px solid #4a5568;
  color: white;
}

@media (min-width: 768px) {
  .sub-header th {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}

@media (min-width: 1024px) {
  .sub-header th {
    font-size: 0.9rem;
  }
}

.revenue-type {
  color: white;
  font-style: italic;
}

.results-table tbody tr {
  transition: background-color 0.2s ease;
}

@media (hover: hover) {
  .results-table tbody tr:hover {
    background-color: #f8fafc;
  }
}

.results-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.period-label {
  background: #1a365d;
  color: white;
  padding: 0.75rem 0.5rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .period-label {
    padding: 1rem;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
  }
}

.value-cell {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a202c;
  border-right: 1px solid #e2e8f0;
  background: white;
}

@media (min-width: 768px) {
  .value-cell {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .value-cell {
    font-size: 1.1rem;
  }
}

.value-cell:last-child {
  border-right: none;
}

.annual-row .value-cell {
  background: #fef5e7;
  color: #744210;
  border-left: 3px solid #d69e2e;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .annual-row .value-cell {
    border-left: 4px solid #d69e2e;
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .annual-row .value-cell {
    font-size: 1.2rem;
  }
}

.monthly-row .value-cell {
  background: #e6f3ff;
  color: #1e3a8a;
  border-left: 3px solid #3182ce;
}

@media (min-width: 768px) {
  .monthly-row .value-cell {
    border-left: 4px solid #3182ce;
  }
}

.weekly-row .value-cell {
  background: #f0fff4;
  color: #22543d;
  border-left: 3px solid #38a169;
}

@media (min-width: 768px) {
  .weekly-row .value-cell {
    border-left: 4px solid #38a169;
  }
}

.daily-row .value-cell {
  background: #fef2f2;
  color: #742a2a;
  border-left: 3px solid #e53e3e;
}

@media (min-width: 768px) {
  .daily-row .value-cell {
    border-left: 4px solid #e53e3e;
  }
}

/* Scroll horizontal pour table sur mobile */
@media (max-width: 767px) {
  .results-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .results-table-container::after {
    content: '👈 Faites glisser pour voir plus';
    display: block;
    text-align: center;
    padding: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }
}

/* Recommandation simplifiée */
.recommendation-summary {
  margin-top: 2rem;
}

.recommendation-card {
  background: #1a365d;
  border-radius: 10px;
  padding: 2rem;
  color: white;
  text-align: center;
  border: 2px solid #2d3748;
}

.recommendation-card h4 {
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.recommendation-content p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.highlight {
  color: #f6e05e;
  font-weight: 800;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.savings {
  color: #68d391;
  font-weight: 800;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.margin-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #4a5568;
}

.margin-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-label {
  font-weight: 700;
  font-size: 1rem;
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.status-badge.above {
  background: #fed7d7;
  color: #742a2a;
  border: 2px solid #e53e3e;
}

.status-badge.below {
  background: #c6f6d5;
  color: #22543d;
  border: 2px solid #38a169;
}

.temporal-params h3 {
  color: #253786;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.param-item {
  display: flex;
  flex-direction: column;
}

.param-item label {
  font-weight: 600;
  color: #2B3A46;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.param-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.param-input:focus {
  outline: none;
  border-color: #253786;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(37, 55, 134, 0.1);
}

/* Seuils de rentabilité */
.profitability-thresholds {
  background: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  border: 2px solid #e2e8f0;
}

.profitability-thresholds h3 {
  color: #1a202c;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.thresholds-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.threshold-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #e2e8f0;
  border-top: 4px solid #38a169;
}

.threshold-section.comfort {
  border-top-color: #3182ce;
}

.threshold-title {
  color: #22543d;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.threshold-section.comfort .threshold-title {
  color: #1e3a8a;
}

.threshold-values {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.threshold-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.threshold-item:hover {
  transform: translateX(5px);
}

.threshold-item.annual {
  background: #fef5e7;
  border-left: 4px solid #d69e2e;
  border: 1px solid #e2e8f0;
}

.threshold-item.monthly {
  background: #e6f3ff;
  border-left: 4px solid #3182ce;
  border: 1px solid #e2e8f0;
}

.threshold-item.weekly {
  background: #f0fff4;
  border-left: 4px solid #38a169;
  border: 1px solid #e2e8f0;
}

.threshold-item.daily {
  background: #fef2f2;
  border-left: 4px solid #e53e3e;
  border: 1px solid #e2e8f0;
}

.threshold-label {
  font-weight: 700;
  color: #1a202c;
  font-size: 1rem;
}

.threshold-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a202c;
}

.threshold-period {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
  margin-left: 0.5rem;
}

/* Citation inspirante */
.inspiration-quote {
  background: linear-gradient(135deg, #253786, #1e2f6f);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: white;
  margin-top: 2rem;
}

.inspiration-quote p {
  font-size: 1.2rem;
  font-style: italic;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: white;
}

.inspiration-quote small {
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 600;
}

/* Styles pour les charges sociales et comparaison */
.social-charges-section {
  background: linear-gradient(135deg, #f0f4f8, #e6efff);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  border: 2px solid #4A6D86;
}

.social-charges-section h3 {
  color: #253786;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.charges-params {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.charges-params h4 {
  color: #2B3A46;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.params-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.param-group {
  background: #f8fafc;
  border-radius: 6px;
  padding: 1.5rem;
  border-left: 4px solid #4A6D86;
}

.param-group h5 {
  color: #253786;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-align: center;
  text-transform: uppercase;
}

.calculate-button {
  display: block;
  margin: 0 auto;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #253786, #4A6D86);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calculate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 55, 134, 0.3);
}

/* Résultats itératifs */
.iterative-results {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.iterative-results h4 {
  color: #2B3A46;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-align: center;
}

.status-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.status-card {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 10px;
  padding: 1.5rem;
  border-top: 4px solid #28a745;
  position: relative;
}

.status-card.enterprise {
  border-top-color: #4A6D86;
}

.status-card h5 {
  color: #2B3A46;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-transform: uppercase;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #e0e0e0;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
}

.margin-status {
  margin-top: 1rem;
  text-align: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.status-badge.above {
  background: #fee2e2;
  color: #dc2626;
  border: 2px solid #dc2626;
}

.status-badge.below {
  background: #d1fae5;
  color: #059669;
  border: 2px solid #059669;
}

/* Recommandation alternative */
.recommendation {
  background: #1a365d;
  border-radius: 8px;
  padding: 2rem;
  color: white;
  margin-top: 2rem;
  border: 2px solid #2d3748;
}

.recommendation h4 {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.recommendation-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
}

.recommendation-summary p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  line-height: 1.5;
  color: white;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: #2d3748;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid #4a5568;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #4a5568;
  color: white;
}

.comparison-table th {
  background: #4a5568;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: white;
}

.comparison-table td {
  font-weight: 600;
  color: #e2e8f0;
}

/* Boutons de navigation - Mobile First */
.navigation-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0;
}

@media (min-width: 768px) {
  .navigation-buttons {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
    margin-top: 3rem;
    padding: 2rem 0;
  }
}

.nav-button {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

@media (min-width: 768px) {
  .nav-button {
    padding: 1rem 2rem;
    width: auto;
    min-width: 150px;
  }
}

.prev-button {
  background-color: #6c757d;
  color: white;
  order: 2;
}

@media (min-width: 768px) {
  .prev-button {
    order: 1;
  }
}

.prev-button:hover {
  background-color: #5a6268;
}

@media (hover: hover) {
  .prev-button:hover {
    transform: translateX(-2px);
  }
}

.prev-button:active {
  transform: scale(0.98);
  background-color: #545b62;
}

.next-button {
  background-color: #2B3A46;
  color: white;
  order: 1;
}

@media (min-width: 768px) {
  .next-button {
    margin-left: auto;
    order: 2;
  }
}

.next-button:hover {
  background-color: #1e2a35;
}

@media (hover: hover) {
  .next-button:hover {
    transform: translateX(2px);
  }
}

.next-button:active {
  transform: scale(0.98);
  background-color: #1a252f;
}

.finish-button {
  background-color: #28a745;
  color: white;
  order: 1;
}

@media (min-width: 768px) {
  .finish-button {
    margin-left: auto;
    order: 2;
  }
}

.finish-button:hover {
  background-color: #218838;
}

@media (hover: hover) {
  .finish-button:hover {
    transform: translateY(-2px);
  }
}

.finish-button:active {
  transform: scale(0.98);
  background-color: #1e7e34;
}

.finish-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.finish-button:disabled:hover {
  background-color: #6c757d;
  transform: none;
}

/* Animation pour les étapes */
.step-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimisations supplémentaires mobile-first */
.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

@media (min-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (min-width: 480px) {
  .input-group {
    flex-direction: row;
  }
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
}

@media (min-width: 768px) {
  .results-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
  }
}

.breakeven-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .breakeven-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.params-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 480px) {
  .params-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.margin-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #4a5568;
}

@media (min-width: 768px) {
  .margin-info {
    grid-template-columns: 1fr 1fr;
  }
}

.params-comparison {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .params-comparison {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.status-comparison {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .status-comparison {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.recommendation-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .recommendation-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.comparison-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.detail-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #e0e0e0;
}

@media (min-width: 768px) {
  .detail-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    gap: 1rem;
  }
}
</style> 