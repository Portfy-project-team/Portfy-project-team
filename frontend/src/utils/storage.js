/**
 * Wrapper pour localStorage avec gestion d'erreurs et JSON
 */

const PREFIX = 'portfy_'

/**
 * Sauvegarde une valeur (objet ou string)
 */
export function setItem(key, value) {
  try {
    const data = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(PREFIX + key, data)
    return true
  } catch (error) {
    console.error('Erreur localStorage setItem:', error)
    return false
  }
}

/**
 * Recupere une valeur (avec parsing JSON automatique)
 */
export function getItem(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(PREFIX + key)
    if (data === null) return defaultValue

    // Essaie de parser JSON, sinon retourne tel quel
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  } catch (error) {
    console.error('Erreur localStorage getItem:', error)
    return defaultValue
  }
}

/**
 * Supprime une cle
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key)
    return true
  } catch (error) {
    console.error('Erreur localStorage removeItem:', error)
    return false
  }
}

/**
 * Supprime toutes les donnees Portfy
 */
export function clearAll() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    return true
  } catch (error) {
    console.error('Erreur localStorage clearAll:', error)
    return false
  }
}

/**
 * Verifie si une cle existe
 */
export function hasItem(key) {
  return localStorage.getItem(PREFIX + key) !== null
}

/* ===== Helpers pour le token JWT ===== */

export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'auth_user'

export function getToken() {
  return getItem(TOKEN_KEY)
}

export function setToken(token) {
  return setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return removeItem(TOKEN_KEY)
}

export function getUser() {
  return getItem(USER_KEY)
}

export function setUser(user) {
  return setItem(USER_KEY, user)
}

export function removeUser() {
  return removeItem(USER_KEY)
}

export function isAuthenticated() {
  return hasItem(TOKEN_KEY)
}

export function logout() {
  removeToken()
  removeUser()
}