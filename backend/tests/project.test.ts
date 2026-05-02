import assert from 'assert'

const BASE_URL = 'http://localhost:3000/api'

// Test 1 : Créer un projet sans token → 401
async function testCreerSansToken(): Promise<void> {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titre: 'Test' })
  })
  assert.strictEqual(res.status, 401)
  console.log('✅ Créer projet sans token : OK')
}

// Test 2 : Portfolio public accessible sans token → 200
async function testPortfolioPublic(): Promise<void> {
  const fakeId = '00000000-0000-0000-0000-000000000000'
  const res = await fetch(`${BASE_URL}/projects/portfolio/${fakeId}`)
  // 200 ou 404 — les deux sont corrects, juste pas 401
  assert.notStrictEqual(res.status, 401)
  console.log('✅ Portfolio public accessible : OK')
}

;(async () => {
  console.log('─── Tests projets ───')
  await testCreerSansToken()
  await testPortfolioPublic()
  console.log('─── Terminé ───')
})()