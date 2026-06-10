import groqClient from './groq.service.js'
import { buildPrompt, type LetterInput } from './prompt.service.js'

const MODEL = 'llama-3.3-70b-versatile' // Most powerful free Groq model

export async function generateRecommendationLetter(input: LetterInput): Promise<string> {
  const prompt = buildPrompt(input)

  const completion = await groqClient.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'Tu es un assistant spécialisé dans la rédaction de lettres de recommandation académiques et professionnelles. Tu rédiges uniquement la lettre, sans commentaire ni explication.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  })

  const letter = completion.choices[0]?.message?.content

  if (!letter) {
    throw new Error('Aucun contenu généré par le modèle.')
  }

  return letter.trim()
}