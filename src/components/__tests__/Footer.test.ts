import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../Footer.vue'
import BaseButton from '../BaseButton.vue'

describe('Footer', () => {
  it('affiche le logo dans la section gauche', () => {
    const wrapper = mount(Footer, {
      global: {
        components: {
          BaseButton
        }
      }
    })

    const logo = wrapper.find('.footer-left img')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('alt')).toBe('Logo')
    expect(logo.attributes('src')).toContain('logoblancsvg-25.svg')
  })

  it('affiche le contenu de la newsletter au centre', () => {
    const wrapper = mount(Footer, {
      global: {
        components: {
          BaseButton
        }
      }
    })

    const centerSection = wrapper.find('.footer-center')
    expect(centerSection.exists()).toBe(true)
    
    const title = wrapper.find('.footer-title')
    expect(title.text()).toBe('Abonnez-vous à notre newsletter 📩')
    
    const button = wrapper.findComponent(BaseButton)
    expect(button.exists()).toBe(true)
  })

  it('affiche les réseaux sociaux dans la section droite', () => {
    const wrapper = mount(Footer, {
      global: {
        components: {
          BaseButton
        }
      }
    })

    const rightSection = wrapper.find('.footer-right')
    expect(rightSection.exists()).toBe(true)
    
    const subtitle = rightSection.find('h4')
    expect(subtitle.text()).toBe('Optimiser les bénéfices par la valorisation du capital humain.')
    
    const socialButtons = wrapper.find('.social-buttons')
    expect(socialButtons.exists()).toBe(true)
    
    const socialLinks = socialButtons.findAll('a')
    expect(socialLinks).toHaveLength(3)
  })

  it('vérifie les liens des réseaux sociaux', () => {
    const wrapper = mount(Footer, {
      global: {
        components: {
          BaseButton
        }
      }
    })

    const socialLinks = wrapper.findAll('.social-buttons a')
    
    // Facebook
    expect(socialLinks[0].attributes('href')).toBe('https://facebook.com')
    expect(socialLinks[0].attributes('target')).toBe('_blank')
    
    // LinkedIn
    expect(socialLinks[1].attributes('href')).toBe('https://linkedin.com')
    expect(socialLinks[1].attributes('target')).toBe('_blank')
    
    // Instagram
    expect(socialLinks[2].attributes('href')).toBe('https://instagram.com')
    expect(socialLinks[2].attributes('target')).toBe('_blank')
  })

  it('a la structure HTML correcte', () => {
    const wrapper = mount(Footer, {
      global: {
        components: {
          BaseButton
        }
      }
    })

    // Vérifier la structure principale
    expect(wrapper.find('footer.footer').exists()).toBe(true)
    expect(wrapper.find('.footer-left').exists()).toBe(true)
    expect(wrapper.find('.footer-center').exists()).toBe(true)
    expect(wrapper.find('.footer-right').exists()).toBe(true)
  })
}) 