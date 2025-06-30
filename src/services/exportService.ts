import jsPDF from 'jspdf'
import apiService, { type FullSimulation } from './apiService'

export interface ExportData {
  simulation: FullSimulation
  generatedAt: string
}

export class ExportService {
  private static isExporting = false
  private static lastExportTime = 0
  
  /**
   * Exporte une simulation en PDF
   */
  static async exportSimulationToPDF(simulationId: number): Promise<void> {
    const now = Date.now()
    
    // Protection contre les doubles clics (minimum 1 seconde entre exports)
    if (this.isExporting || (now - this.lastExportTime < 1000)) {
      console.warn('Export en cours ou trop rapide, ignorer')
      return
    }
    
    this.isExporting = true
    this.lastExportTime = now
    
    try {
      // Récupérer les données complètes de la simulation
      const simulation = await apiService.getSimulation(simulationId)
      
      if (!simulation || !simulation.results) {
        throw new Error('Simulation ou résultats non trouvés')
      }

      // Générer le PDF
      const pdf = this.generatePDF(simulation)
      
      // Télécharger le fichier
      const filename = this.generateFilename(simulation.name)
      pdf.save(filename)
      
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error)
      throw error
    } finally {
      // Délai minimal avant de permettre un nouvel export
      setTimeout(() => {
        this.isExporting = false
      }, 500)
    }
  }

  /**
   * Génère le document PDF
   */
  private static generatePDF(simulation: FullSimulation): jsPDF {
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    let yPosition = 20

    // Configuration des styles et espacement amélioré
    const colors = {
      primary: '#253786',
      secondary: '#4A6D86', 
      accent: '#b79e62',
      success: '#28a745',
      text: '#2B3A46',
      lightGray: '#f8fafc'
    }

    // Améliorer l'espacement par défaut
    pdf.setCharSpace(0.2) // Espacement entre caractères
    pdf.setR2L(false) // Assurer la direction gauche-droite

    // === HEADER ===
    yPosition = this.addHeader(pdf, colors, yPosition)
    
    // === INFORMATIONS SIMULATION ===
    yPosition = this.addSimulationInfo(pdf, simulation, colors, yPosition)
    
    // === CHARGES MENSUELLES ===
    yPosition = this.addChargesSection(pdf, simulation, colors, yPosition)
    
    // === REVENUS ET SEUILS ===
    yPosition = this.addRevenuesSection(pdf, simulation, colors, yPosition)
    
    // === SIMULATION FISCALE ===
    yPosition = this.addFiscalSection(pdf, simulation, colors, yPosition)
    
    // === FOOTER ===
    this.addFooter(pdf, colors)

    return pdf
  }

  /**
   * Ajoute l'en-tête du document
   */
  private static addHeader(pdf: jsPDF, colors: any, yPosition: number): number {
    // Titre principal
    pdf.setFontSize(24)
    pdf.setTextColor(colors.primary)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RAPPORT DE SIMULATION', 105, yPosition, { align: 'center' })
    
    yPosition += 10
    
    // Sous-titre
    pdf.setFontSize(14)
    pdf.setTextColor(colors.secondary)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Analyse des seuils de rentabilité', 105, yPosition, { align: 'center' })
    
    yPosition += 15
    
    // Ligne de séparation
    pdf.setDrawColor(colors.primary)
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, 190, yPosition)
    
    return yPosition + 10
  }

  /**
   * Ajoute les informations de la simulation
   */
  private static addSimulationInfo(pdf: jsPDF, simulation: FullSimulation, colors: any, yPosition: number): number {
    pdf.setFontSize(16)
    pdf.setTextColor(colors.text)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Informations de la simulation', 20, yPosition)
    
    yPosition += 10
    
    // Nom de la simulation
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nom : ${simulation.name}`, 25, yPosition)
    yPosition += 7
    
    // Date de création
    const createdDate = new Date(simulation.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    pdf.text(`Créée le : ${createdDate}`, 25, yPosition)
    yPosition += 7
    
    // Date de génération
    const now = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    })
    pdf.text(`Rapport généré le : ${now}`, 25, yPosition)
    
    return yPosition + 15
  }

  /**
   * Ajoute la section des charges mensuelles
   */
  private static addChargesSection(pdf: jsPDF, simulation: FullSimulation, colors: any, yPosition: number): number {
    if (!simulation.results) return yPosition

    pdf.setFontSize(16)
    pdf.setTextColor(colors.text)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Charges mensuelles', 20, yPosition)
    
    yPosition += 10
    
    const results = simulation.results
    
    // Charges vitales
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setCharSpace(0.1)
    pdf.text('Charges vitales :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    const vitalCharges = this.formatCurrency(Number(results.totalMonthlyVital) || 0)
    pdf.text(vitalCharges, 165, yPosition, { align: 'right' })
    yPosition += 7
    
    // Charges de confort
    pdf.setFont('helvetica', 'normal')
    pdf.text('Charges de confort :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    const comfortCharges = this.formatCurrency(Number(results.totalMonthlyComfortCharges) || 0)
    pdf.text(comfortCharges, 165, yPosition, { align: 'right' })
    yPosition += 7
    
    // Charges professionnelles
    pdf.setFont('helvetica', 'normal')
    pdf.text('Charges professionnelles :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    const operatingCharges = this.formatCurrency(Number(results.totalOperatingCharges) || 0)
    pdf.text(operatingCharges, 165, yPosition, { align: 'right' })
    yPosition += 9
    
    // Total charges (encadré)
    const totalCharges = (Number(results.totalMonthlyVital) || 0) + 
                        (Number(results.totalMonthlyComfortCharges) || 0) + 
                        (Number(results.totalOperatingCharges) || 0)
    
    pdf.setDrawColor(colors.primary)
    pdf.setFillColor(248, 250, 252) // #f8fafc
    pdf.roundedRect(25, yPosition - 4, 145, 12, 2, 2, 'FD')
    
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(colors.primary)
    pdf.setCharSpace(0.1)
    pdf.text('Total charges :', 30, yPosition + 2)
    pdf.text(this.formatCurrency(totalCharges), 160, yPosition + 2, { align: 'right' })
    
    return yPosition + 15
  }

  /**
   * Ajoute la section revenus et seuils
   */
  private static addRevenuesSection(pdf: jsPDF, simulation: FullSimulation, colors: any, yPosition: number): number {
    if (!simulation.results) return yPosition

    pdf.setFontSize(16)
    pdf.setTextColor(colors.text)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Revenus et seuils', 20, yPosition)
    
    yPosition += 10
    
    const results = simulation.results
    
    // Revenu mensuel amélioré
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setCharSpace(0.1)
    pdf.text('Revenu mensuel amélioré :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(colors.success)
    const improvedIncome = this.formatCurrency(results.totalMonthlyImprovedIncome)
    pdf.text(improvedIncome, 165, yPosition, { align: 'right' })
    yPosition += 7
    
    // Seuil de rentabilité  
    pdf.setTextColor(colors.text)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Seuil de rentabilité :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    const threshold = this.formatCurrency(results.breakevenThreshold)
    pdf.text(threshold, 165, yPosition, { align: 'right' })
    yPosition += 7
    
    // Coefficient appliqué
    pdf.setFont('helvetica', 'normal')
    pdf.text('Coefficient appliqué :', 25, yPosition)
    pdf.setFont('helvetica', 'bold')
    const baseCharges = (Number(results.totalMonthlyVital) || 0) + (Number(results.totalMonthlyComfortCharges) || 0)
    const coefficient = baseCharges > 0 ? results.totalMonthlyImprovedIncome / baseCharges : 1
    pdf.text(coefficient.toFixed(2), 165, yPosition, { align: 'right' })
    
    return yPosition + 15
  }

  /**
   * Ajoute la section simulation fiscale
   */
  private static addFiscalSection(pdf: jsPDF, simulation: FullSimulation, colors: any, yPosition: number): number {
    if (!simulation.results) return yPosition

    pdf.setFontSize(16)
    pdf.setTextColor(colors.text)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Simulation fiscale', 20, yPosition)
    
    yPosition += 10
    
    const results = simulation.results
    const isMicroBest = results.bestOption === 'micro'
    const isEnterpriseBest = results.bestOption === 'entreprise'
    const isEqual = results.bestOption === 'egalite'

    // Micro-entreprise
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(isMicroBest ? colors.success : colors.text)
    pdf.text('Micro-entreprise', 25, yPosition)
    
    if (isMicroBest) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text('( Meilleure option )', 130, yPosition)
    }
    
    yPosition += 7
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(colors.text)
    pdf.setCharSpace(0.1)
    const microRevenue = this.formatCurrency(results.microEnterpriseRevenue)
    pdf.text(`Chiffre d'affaires annuel : ${microRevenue}`, 30, yPosition)
    
    yPosition += 12
    
    // Entreprise classique
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(isEnterpriseBest ? colors.success : colors.text)
    pdf.text('Entreprise classique', 25, yPosition)
    
    if (isEnterpriseBest) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text('( Meilleure option )', 130, yPosition)
    }
    
    yPosition += 7
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(colors.text)
    pdf.setCharSpace(0.1)
    const enterpriseRevenue = this.formatCurrency(results.enterpriseRevenue)
    pdf.text(`Chiffre d'affaires annuel : ${enterpriseRevenue}`, 30, yPosition)
    
    yPosition += 10
    
    // Recommandation encadrée
    if (isEqual) {
      pdf.setDrawColor(colors.accent)
      pdf.setFillColor(251, 245, 231) // warm yellow
      pdf.roundedRect(25, yPosition - 2, 140, 8, 2, 2, 'FD')
      
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(colors.accent)
      pdf.text('Les deux options sont équivalentes', 30, yPosition + 3)
    } else {
      const bestOption = isMicroBest ? 'Micro-entreprise' : 'Entreprise classique'
      const savings = Math.abs(results.microEnterpriseRevenue - results.enterpriseRevenue)
      
      pdf.setDrawColor(colors.success)
      pdf.setFillColor(240, 253, 244) // light green
      pdf.roundedRect(25, yPosition - 2, 140, 12, 2, 2, 'FD')
      
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(colors.success)
      pdf.text(`Recommandation : ${bestOption}`, 30, yPosition + 2)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text(`Économie annuelle : ${this.formatCurrency(savings)}`, 30, yPosition + 7)
    }
    
    return yPosition + 20
  }

  /**
   * Ajoute le pied de page
   */
  private static addFooter(pdf: jsPDF, colors: any): void {
    const pageHeight = pdf.internal.pageSize.height
    const yPosition = pageHeight - 20
    
    pdf.setFontSize(8)
    pdf.setTextColor(colors.secondary)
    pdf.setFont('helvetica', 'italic')
    pdf.text('Généré par MSCG Solo - Optimiser les bénéfices par la valorisation du capital humain', 105, yPosition, { align: 'center' })
    
    // Ligne décorative
    pdf.setDrawColor(colors.secondary)
    pdf.setLineWidth(0.3)
    pdf.line(20, yPosition - 5, 190, yPosition - 5)
  }

  /**
   * Formate un montant en euros avec espacement correct
   */
  private static formatCurrency(amount: number): string {
    // Formatage manuel pour assurer un bon rendu dans le PDF
    const formattedNumber = Math.round(amount).toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    
    return `${formattedNumber} €`
  }

  /**
   * Génère le nom du fichier PDF
   */
  private static generateFilename(simulationName: string): string {
    const date = new Date().toISOString().split('T')[0]
    const cleanName = simulationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    return `rapport-simulation_${cleanName}_${date}.pdf`
  }
}

export default ExportService 