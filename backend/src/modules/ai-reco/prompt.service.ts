export interface LetterInput {
  profName: string
  profEmail: string
  department?: string
  institution: string
  studentName: string
  level?: string
  candidatureType: 'Master / Doctorat' | 'Double Diplomation' | 'Stage' | 'Emploi' | 'Programme International'
  language: 'Français' | 'Anglais' | 'Arabe' | 'Espagnol'
  technicalQualities: string
  softSkills?: string
  mention?: 'Très Bien' | 'Bien' | 'Assez Bien' | 'Passable'
  extra: {
    university?: string
    program?: string
    researchMotivation?: string
    partnerSchool?: string
    country?: string
    partnerContext?: string
    company?: string
    duration?: string
    mission?: string
    position?: string
    proSkills?: string
    programName?: string
    region?: string
    programObjective?: string
  }
}

export function buildPrompt(input: LetterInput): string {
  const {
    profName, profEmail, department, institution,
    studentName, level,
    candidatureType, language,
    technicalQualities, softSkills, mention,
    extra,
  } = input

  // ── Langue ──────────────────────────────────────────────────────
  const languageMap: Record<string, string> = {
    'Français': 'FRENCH (Français)',
    'Anglais':  'ENGLISH',
    'Arabe':    'ARABIC (العربية)',
    'Espagnol': 'SPANISH (Español)',
  }
  const targetLanguage = languageMap[language] ?? 'FRENCH (Français)'

  // ── Salutation selon langue ──────────────────────────────────────
  const salutationMap: Record<string, string> = {
    'Français': 'Madame, Monsieur,',
    'Anglais':  'Dear Sir or Madam,',
    'Arabe':    'السيدة / السيد الفاضل،',
    'Espagnol': 'Estimado/a Sr./Sra.,',
  }
  const salutation = salutationMap[language] ?? 'Madame, Monsieur,'

  // ── Contexte selon type de candidature ──────────────────────────
  let contextBlock = ''

  if (candidatureType === 'Master / Doctorat') {
    contextBlock = `
- Target university: ${extra.university || 'not specified'}
- Target program: ${extra.program || 'not specified'}
- Research project / academic motivation: ${extra.researchMotivation || 'not specified'}
${mention ? `- Academic grade / overall level: ${mention}` : ''}`
  } else if (candidatureType === 'Double Diplomation') {
    contextBlock = `
- Partner institution: ${extra.partnerSchool || 'not specified'}
- Destination country: ${extra.country || 'not specified'}
- Partnership / exchange context: ${extra.partnerContext || 'not specified'}
${mention ? `- Academic grade / overall level: ${mention}` : ''}`
  } else if (candidatureType === 'Stage') {
    contextBlock = `
- Host company / organization: ${extra.company || 'not specified'}
- Internship duration: ${extra.duration || 'not specified'}
- Mission / technical domain: ${extra.mission || 'not specified'}`
  } else if (candidatureType === 'Emploi') {
    contextBlock = `
- Target company: ${extra.company || 'not specified'}
- Position applied for: ${extra.position || 'not specified'}
- Relevant professional skills: ${extra.proSkills || 'not specified'}`
  } else if (candidatureType === 'Programme International') {
    contextBlock = `
- Program name: ${extra.programName || 'not specified'}
- Target country / region: ${extra.region || 'not specified'}
- Program objective: ${extra.programObjective || 'not specified'}`
  }

  // ── Prompt principal ─────────────────────────────────────────────
  const prompt = `
You are an expert academic writer specializing in formal recommendation letters for universities, companies, and international programs.

════════════════════════════════════════════
⚠️  ABSOLUTE LANGUAGE RULE — NO EXCEPTION
════════════════════════════════════════════
You MUST write the COMPLETE letter EXCLUSIVELY in ${targetLanguage}.
Every single word — salutation, body, closing, signature — must be in ${targetLanguage}.
If you write even one word in another language, the output is invalid.

════════════════════════════════════════════
LETTER CONTEXT
════════════════════════════════════════════
Professor (author of the letter):
- Full name   : ${profName}
- Institution : ${institution}${department ? ` — Department of ${department}` : ''}
- Email       : ${profEmail}

Student (subject of the letter):
- Full name   : ${studentName}${level ? `\n- Field / Level : ${level}` : ''}

Application type: ${candidatureType}
${contextBlock}

Professor's assessment:
- Technical qualities : ${technicalQualities}${softSkills ? `\n- Soft skills / behavioral qualities : ${softSkills}` : ''}

════════════════════════════════════════════
LETTER STRUCTURE — FOLLOW EXACTLY
════════════════════════════════════════════
[HEADER]
  • Professor's full name and title (top right)
  • Institution and department
  • Professional email
  • City and date (use current month and year)

[SALUTATION]
  ${salutation}

[PARAGRAPH 1 — INTRODUCTION (60–80 words)]
  • Who you are, your role, how long you have known the student
  • In what academic context (course, project, thesis supervision, etc.)

[PARAGRAPH 2 — TECHNICAL PROFILE (90–110 words)]
  • Highlight the student's technical skills with 1–2 concrete examples
  • Reference the technical qualities provided
  • Connect skills directly to the target application (${candidatureType})

[PARAGRAPH 3 — HUMAN & BEHAVIORAL PROFILE (70–90 words)]
  • Highlight soft skills, attitude, work ethic, team spirit
  • Include one anecdote or real situation if possible

[PARAGRAPH 4 — CONCLUSION & RECOMMENDATION (50–70 words)]
  • Clear, strong, unconditional recommendation
  • Express full confidence in the student's success
  • Offer to provide further information if needed

[CLOSING]
  • Formal closing formula appropriate to the language
  • Professor's full name and title

════════════════════════════════════════════
QUALITY REQUIREMENTS
════════════════════════════════════════════
- Total word count: strictly between 350 and 430 words
- Tone: formal, warm, and convincing — as written by a senior academic
- NO generic phrases like "hardworking student" without supporting details
- NO bullet points, NO markdown, NO headers inside the letter
- NO meta-commentary, NO explanation outside the letter
- Output ONLY the letter text, nothing else
`.trim()

  return prompt
}