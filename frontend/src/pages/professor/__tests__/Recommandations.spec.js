import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Recommandations from '../Recommandations.vue'

vi.mock('lucide-vue-next', () => {
  const Icon = {
    template: '<span class="icon-stub"></span>'
  }

  return {
    Eye: Icon,
    Star: Icon,
    MessageCircle: Icon,
    Search: Icon,
    Edit: Icon,
    Trash2: Icon,
    Plus: Icon,
    TrendingUp: Icon,
    X: Icon,
    CheckCircle: Icon,
    Clock: Icon,
    Clipboard: Icon
  }
})

const mountPage = () => {
  return mount(Recommandations, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        StatusBadge: {
          props: ['status'],
          template: '<span class="status-badge-stub">{{ status }}</span>'
        }
      }
    }
  })
}

describe('Professor Recommandations.vue', () => {
  test('affiche la page recommandations', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mes recommandations')
    expect(wrapper.text()).toContain('Gérez les recommandations que vous avez rédigées')
  })

  test('affiche les statistiques', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Total rédigées')
    expect(wrapper.text()).toContain('31')
    expect(wrapper.text()).toContain('Publiées')
    expect(wrapper.text()).toContain('En attente')
  })

  test('affiche la liste des recommandations', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).toContain('Leila Moussaoui')
    expect(wrapper.text()).toContain('Très bon niveau technique')
  })

  test('filtre les recommandations publiees', async () => {
    const wrapper = mountPage()

    const publishedButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Publiées')

    await publishedButton.trigger('click')

    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).toContain('Youssef Khalil')
    expect(wrapper.text()).not.toContain('Leila Moussaoui')
  })

  test('filtre les recommandations en attente', async () => {
    const wrapper = mountPage()

    const pendingButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'En attente')

    await pendingButton.trigger('click')

    expect(wrapper.text()).toContain('Leila Moussaoui')
    expect(wrapper.text()).toContain('Omar Mellouki')
    expect(wrapper.text()).not.toContain('Ahmed Alami')
  })

  test('recherche une recommandation par etudiant', async () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')
    await input.setValue('Sara')

    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).not.toContain('Ahmed Alami')
  })

  test('ouvre le modal nouvelle recommandation', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)

    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nouvelle recommandation')
  })

  test('ajoute une nouvelle recommandation', async () => {
    const wrapper = mountPage()

    await wrapper.find('.btn-primary').trigger('click')

    const input = wrapper.find('.modal input')
    const textarea = wrapper.find('.modal textarea')
    const selects = wrapper.findAll('.modal select')

    await input.setValue('Nadia Karim')
    await textarea.setValue('Très bon profil frontend.')
    await selects[0].setValue('Portfolio')
    await selects[1].setValue('published')

    const publishButton = wrapper
      .findAll('.modal .btn-primary')
      .find((button) => button.text() === 'Publier')

    await publishButton.trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    expect(wrapper.text()).toContain('Nadia Karim')
    expect(wrapper.text()).toContain('Très bon profil frontend.')
  })

  test('ouvre le modal modification', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.action-btn.edit')[0].trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Modifier recommandation')

    const input = wrapper.find('.modal input')
    expect(input.element.value).toBe('Ahmed Alami')
  })

  test('modifie une recommandation', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.action-btn.edit')[0].trigger('click')

    const textarea = wrapper.find('.modal textarea')
    await textarea.setValue('Recommandation modifiee.')

    const saveButton = wrapper
      .findAll('.modal .btn-primary')
      .find((button) => button.text() === 'Enregistrer')

    await saveButton.trigger('click')

    expect(wrapper.text()).toContain('Recommandation modifiee.')
  })

  test('supprime une recommandation', async () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Ahmed Alami')

    await wrapper.findAll('.action-btn.delete')[0].trigger('click')

    expect(wrapper.text()).not.toContain('Ahmed Alami')
  })
})