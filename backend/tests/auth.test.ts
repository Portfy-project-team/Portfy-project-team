import assert from 'assert'

const BASE_URL = 'http://localhost:3000/api'

// Test 1 : Inscription sans données → 400
async function testInscriptionVide(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  assert.strictEqual(res.status, 400)
  console.log('✅ Inscription vide : OK')
}

// Test 2 : Login mauvais credentials → 401
async function testLoginEchoue(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'faux@test.ma', mot_de_passe: 'mauvais' })
  })
  assert.strictEqual(res.status, 401)
  console.log('✅ Login échoué : OK')
}

// Test 3 : Route protégée sans token → 401
async function testSansToken(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/profile`)
  assert.strictEqual(res.status, 401)
  console.log('✅ Accès sans token : OK')
}

;(async () => {
  console.log('─── Tests auth ───')
  await testInscriptionVide()
  await testLoginEchoue()
  await testSansToken()
  console.log('─── Terminé ───')
})()