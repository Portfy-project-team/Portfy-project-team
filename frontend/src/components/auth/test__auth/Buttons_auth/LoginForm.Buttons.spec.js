import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import LoginForm from '../../LoginForm.vue'

const mocks = vi.hoisted(() => {
  return {
    push: vi.fn()
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')

  return {
    ...actual,
    useRouter: () => ({
      push: mocks.push
    })
  }
})

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>'
}

function mountLoginForm() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(LoginForm, {
    global: {
      plugins: [pinia],
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })
}

describe('LoginForm buttons and links', () => {
  beforeEach(() => {
    mocks.push.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('affiche les boutons Connexion et Inscription en haut', () => {
    const wrapper = mountLoginForm()

    const tabs = wrapper.findAll('.tabs .tab')

    expect(tabs).toHaveLength(2)
    expect(tabs[0].text()).toContain('Connexion')
    expect(tabs[1].text()).toContain('Inscription')
  })

  test('bouton Connexion est actif', () => {
    const wrapper = mountLoginForm()

    const activeTab = wrapper.find('.tabs .tab.active')

    expect(activeTab.exists()).toBe(true)
    expect(activeTab.text()).toContain('Connexion')
  })

  test('lien Inscription pointe vers register', () => {
    const wrapper = mountLoginForm()

    const registerLink = wrapper.find('.tab-link')

    expect(registerLink.exists()).toBe(true)
    expect(registerLink.text()).toContain('Inscription')
    expect(registerLink.attributes('href')).toBe('/register')
  })

  test('lien Mot de passe oublié pointe vers forgot-password', () => {
    const wrapper = mountLoginForm()

    const forgotLink = wrapper.find('.forgot-link')

    expect(forgotLink.exists()).toBe(true)
    expect(forgotLink.text()).toContain('Mot de passe oublié')
    expect(forgotLink.attributes('href')).toBe('/forgot-password')
  })

  test('lien Continuer quand même pointe vers register', () => {
    const wrapper = mountLoginForm()

    const registerFooterLink = wrapper.find('.inline-link')

    expect(registerFooterLink.exists()).toBe(true)
    expect(registerFooterLink.text()).toContain('Continuer quand même')
    expect(registerFooterLink.attributes('href')).toBe('/register')
  })

  test('bouton afficher le mot de passe fonctionne', async () => {
    const wrapper = mountLoginForm()

    const passwordInput = wrapper.find('#password')

    expect(passwordInput.element.type).toBe('password')

    await wrapper.find('.toggle-password').trigger('click')

    expect(passwordInput.element.type).toBe('text')
  })

  test('bouton masquer le mot de passe fonctionne', async () => {
    const wrapper = mountLoginForm()

    const passwordInput = wrapper.find('#password')

    await wrapper.find('.toggle-password').trigger('click')
    expect(passwordInput.element.type).toBe('text')

    await wrapper.find('.toggle-password').trigger('click')
    expect(passwordInput.element.type).toBe('password')
  })

  test('bouton Se connecter existe', () => {
    const wrapper = mountLoginForm()

    const submitButton = wrapper.find('.btn-submit')

    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('Se connecter')
  })

  test('bouton Se connecter affiche les erreurs si formulaire vide', async () => {
    const wrapper = mountLoginForm()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain("L'adresse e-mail est requise.")
    expect(wrapper.text()).toContain('Le mot de passe est requis.')
    expect(mocks.push).not.toHaveBeenCalled()
  })

  test('bouton Se connecter affiche erreur si email invalide et mot de passe court', async () => {
    const wrapper = mountLoginForm()

    await wrapper.find('#email').setValue('email-invalide')
    await wrapper.find('#password').setValue('123')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Veuillez entrer une adresse e-mail valide.')
    expect(wrapper.text()).toContain('Le mot de passe doit comporter au moins 6 caractères.')
    expect(mocks.push).not.toHaveBeenCalled()
  })

  test('bouton Se connecter devient disabled pendant le chargement', async () => {
    vi.useFakeTimers()

    const wrapper = mountLoginForm()

    await wrapper.find('#email').setValue('test@institution.ma')
    await wrapper.find('#password').setValue('123456')

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.find('.btn-submit').attributes('disabled')).toBeDefined()

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
  })

  test('bouton Se connecter redirige vers dashboard si formulaire valide', async () => {
    vi.useFakeTimers()

    const wrapper = mountLoginForm()

    await wrapper.find('#email').setValue('test@institution.ma')
    await wrapper.find('#password').setValue('123456')

    await wrapper.find('form').trigger('submit')
    await nextTick()

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(mocks.push).toHaveBeenCalledWith('/dashboard')
    expect(wrapper.find('.btn-submit').attributes('disabled')).toBeUndefined()
  })
})