/**
 * Fonctions de validation reutilisables
 */

/**
 * Valide un email
 */
export function isValidEmail(email) {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valide une URL
 */
export function isValidUrl(url) {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valide un numero de telephone marocain
 * Formats acceptes: +212 6XX XXX XXX, 06XXXXXXXX, 0612345678
 */
export function isValidPhoneMA(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/\s/g, '')
  const regex = /^(\+212|0)[5-7]\d{8}$/
  return regex.test(cleaned)
}

/**
 * Valide un mot de passe fort
 * Au moins 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre
 */
export function isStrongPassword(password) {
  if (!password) return false
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Verifie que la valeur n'est pas vide
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Valide la longueur d'un champ
 */
export function hasMinLength(value, min) {
  if (!value) return false
  return value.length >= min
}

export function hasMaxLength(value, max) {
  if (!value) return true
  return value.length <= max
}

/**
 * Valide un URL GitHub
 */
export function isValidGitHubUrl(url) {
  if (!url) return false
  const regex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)?\/?$/
  return regex.test(url)
}

/**
 * Valide un URL LinkedIn
 */
export function isValidLinkedInUrl(url) {
  if (!url) return false
  const regex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/
  return regex.test(url)
}

/**
 * Valide un fichier (taille et type)
 */
export function isValidFile(file, options = {}) {
  if (!file) return { valid: false, error: 'Aucun fichier' }

  const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`
    }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non accepte. Types autorises: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true, error: null }
}