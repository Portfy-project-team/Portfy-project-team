import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface PDFStyleOptions {
  themeColor?: string;
}

// ── DATES ─────────────────────────────────────────────────────────────────────
const formatDate = (date: any): string => {
  if (!date) return 'Présent';
  const d     = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${month}/${year}`;
};





// ── CIRCULAR IMAGE ─────────────────────────────────────────────────────────────
const getCircularImageUrl = async (avatarUrl?: string): Promise<string | null> => {
  if (!avatarUrl) return null;
  try {
    const SIZE = 300;
    let rawBuffer: Buffer;

    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      const res = await fetch(avatarUrl);
      if (!res.ok) return null;
      rawBuffer = Buffer.from(await res.arrayBuffer());
    } else {
      const cleanPath = avatarUrl.startsWith('/') ? avatarUrl.slice(1) : avatarUrl;
      const filePath  = path.join(process.cwd(), cleanPath);
      if (!fs.existsSync(filePath)) return null;
      rawBuffer = fs.readFileSync(filePath);
    }

    const circleMask = Buffer.from(
      `<svg width="${SIZE}" height="${SIZE}">
        <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2}" fill="white"/>
      </svg>`
    );

    const pngBuffer = await sharp(rawBuffer)
      .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } catch (err) {
    console.error('[PDF] Erreur image:', err);
    return null;
  }
};

// ── PALETTE ───────────────────────────────────────────────────────────────────
const NAVY    = '#1C2B3A';
const NAVY2   = '#243044';
const WHITE   = '#FFFFFF';
const OFF     = '#F8F9FB';
const SLATE   = '#6B7A8D';
const LIGHT   = '#E8ECF0';
const INK     = '#0F1A24';
const MUTED   = '#94A3B8';

// ── STYLES ────────────────────────────────────────────────────────────────────
const buildStyles = (theme: string) => StyleSheet.create({

  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: INK,
    backgroundColor: WHITE,
  },

  // ════ SIDEBAR ════
  sidebar: {
    width: '30%',
    backgroundColor: NAVY,
    paddingBottom: 40,
    flexDirection: 'column',
  },

  avatarZone: {
    backgroundColor: NAVY2,
    paddingTop: 30,
    paddingBottom: 22,
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  avatarRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    border: `2.5px solid ${theme}`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: NAVY,
  },

  avatarImage: { width: 76, height: 76 },

  avatarInitials: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },

  sidebarName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  sidebarRole: {
    fontSize: 7,
    color: theme,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: 'Helvetica-Bold',
  },

  sideSection: {
    paddingHorizontal: 18,
    marginTop: 18,
  },

  sideDivider: {
    height: 0.5,
    backgroundColor: NAVY2,
    marginHorizontal: 18,
    marginTop: 18,
  },

  sideSectionTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: MUTED,
    marginBottom: 10,
  },

  infoRow: { marginBottom: 9 },

  infoLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 8,
    color: WHITE,
    lineHeight: 1.4,
  },

  // Skill bar style
  skillItem: { marginBottom: 8 },

  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  skillName: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },

  skillLevelText: {
    fontSize: 6,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  skillBarBg: {
    height: 4,
    backgroundColor: NAVY2,
    borderRadius: 2,
    width: '100%',
  },

  // ════ MAIN ════
  main: {
    width: '70%',
    backgroundColor: WHITE,
    paddingBottom: 50,
  },

  // Header blanc avec nom grand
  mainHeader: {
    backgroundColor: WHITE,
    paddingTop: 30,
    paddingBottom: 18,
    paddingHorizontal: 28,
    borderBottom: `1px solid ${LIGHT}`,
  },

  mainName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textTransform: 'uppercase',
    letterSpacing: 2,
    lineHeight: 1.1,
  },

  mainSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },

  mainSubtitle: {
    fontSize: 8,
    color: theme,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  mainSubtitleDot: {
    fontSize: 8,
    color: MUTED,
  },

  mainSubtitleSchool: {
    fontSize: 8,
    color: MUTED,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  mainBody: {
    paddingHorizontal: 28,
    paddingTop: 2,
  },

  // Bio card
  bioCard: {
    backgroundColor: OFF,
    borderRadius: 4,
    padding: 10,
    marginTop: 14,
    borderLeft: `2px solid ${theme}`,
  },

  bioText: {
    fontSize: 8,
    color: SLATE,
    lineHeight: 1.7,
  },

  sectionBlock: { marginTop: 18 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginRight: 10,
  },

  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: LIGHT,
  },

  // Entry card avec date à droite
  entryCard: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: `0.5px solid ${LIGHT}`,
  },

  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },

  entryTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    flex: 1,
  },

  entryDate: {
    fontSize: 7,
    color: MUTED,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: 8,
  },

  entryMeta: {
    fontSize: 7.5,
    color: theme,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },

  entryBody: {
    fontSize: 7.5,
    color: SLATE,
    lineHeight: 1.6,
    marginTop: 3,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 3,
  },

  tag: {
    backgroundColor: OFF,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    border: `0.5px solid ${LIGHT}`,
  },

  tagText: {
    fontSize: 6.5,
    color: INK,
    fontFamily: 'Helvetica-Bold',
  },

  footer: {
    position: 'absolute',
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `0.5px solid ${LIGHT}`,
    paddingTop: 5,
  },

  footerBrand: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: theme,
    letterSpacing: 2,
  },

  footerDate: {
    fontSize: 6.5,
    color: MUTED,
  },
});

// ── COMPOSANTS ────────────────────────────────────────────────────────────────

const AvatarSection = ({ circularSrc, initials, S }: {
  circularSrc: string | null; initials: string; S: any;
}) => (
  <View style={S.avatarRing}>
    {circularSrc
      ? <Image src={circularSrc} style={S.avatarImage} />
      : <Text style={S.avatarInitials}>{initials}</Text>
    }
  </View>
);

// Skill bar
const levelToPct = (niveau: string): number => {
  const map: Record<string, number> = {
    DEBUTANT: 25, INTERMEDIAIRE: 50, AVANCE: 75, EXPERT: 95,
  };
  return map[(niveau || '').toUpperCase()] ?? 50;
};

const SkillBar = ({ niveau, theme }: { niveau: string; theme: string }) => {
  const pct = levelToPct(niveau);
  // @react-pdf: width en string '75%' fonctionne UNIQUEMENT dans StyleSheet.create()
  // En inline style, il faut passer par un objet créé dynamiquement avec la valeur string
  const fillStyle = { height: 4, width: (pct + '%') as any, backgroundColor: theme, borderRadius: 2 };
  return (
    <View style={{ height: 4, backgroundColor: NAVY2, borderRadius: 2 }}>
      <View style={fillStyle} />
    </View>
  );
};

const SectionHeader = ({ title, S }: { title: string; S: any }) => (
  <View style={S.sectionHeader}>
    <Text style={S.sectionTitle}>{title}</Text>
    <View style={S.sectionLine} />
  </View>
);

// ── DOCUMENT ──────────────────────────────────────────────────────────────────
const PortfolioDocument = ({ data, themeColor, circularSrc }: {
  data: any; themeColor: string; circularSrc: string | null;
}) => {
  const S        = buildStyles(themeColor);
  const fullName = `${data.prenom || ''} ${data.nom || ''}`.trim();
  const initials = fullName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
        <View style={S.sidebar}>

          <View style={S.avatarZone}>
            <AvatarSection circularSrc={circularSrc} initials={initials} S={S} />
            <Text style={S.sidebarName}>{fullName}</Text>
            {data.filiere ? <Text style={S.sidebarRole}>{data.filiere}</Text> : null}
          </View>

          {/* Informations */}
          <View style={S.sideSection}>
            <Text style={S.sideSectionTitle}>Informations</Text>

            {data.niveau ? (
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>Niveau</Text>
                <Text style={S.infoValue}>{data.niveau}</Text>
              </View>
            ) : null}
            {data.formationType ? (
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>Formation</Text>
                <Text style={S.infoValue}>{data.formationType}</Text>
              </View>
            ) : null}
            {data.etablissement ? (
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>École</Text>
                <Text style={S.infoValue}>{data.etablissement}</Text>
              </View>
            ) : null}

            {data.linkedin ? (
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>LinkedIn</Text>
                <Text style={S.infoValue}>{data.linkedin}</Text>
              </View>
            ) : null}
          </View>

          {/* Compétences avec dots */}
          {data.skills?.length > 0 ? (
            <>
              <View style={S.sideDivider} />
              <View style={S.sideSection}>
                <Text style={S.sideSectionTitle}>Compétences</Text>
                {data.skills.map((s: any, i: number) => (
                  <View key={i} style={S.skillItem}>
                    <View style={S.skillHeader}>
                      <Text style={S.skillName}>{s.skill?.nom || s.nom || s.name || ''}</Text>
                      <Text style={S.skillLevelText}>{s.niveau}</Text>
                    </View>
                    <SkillBar niveau={s.niveau} theme={themeColor} />
                  </View>
                ))}
              </View>
            </>
          ) : null}

        </View>

        {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
        <View style={S.main}>

          {/* Header blanc */}
          <View style={S.mainHeader}>
            <Text style={S.mainName}>{fullName}</Text>
            <View style={S.mainSubtitleRow}>
              {data.filiere ? <Text style={S.mainSubtitle}>{data.filiere}</Text> : null}
              {data.filiere && data.etablissement
                ? <Text style={S.mainSubtitleDot}>•</Text>
                : null}
              {data.etablissement
                ? <Text style={S.mainSubtitleSchool}>{data.etablissement}</Text>
                : null}
            </View>
          </View>

          <View style={S.mainBody}>

            {/* Bio card */}
            {(data.bio || data.portfolio?.objective) ? (
              <View style={S.bioCard}>
                <Text style={S.bioText}>{data.bio || data.portfolio?.objective}</Text>
              </View>
            ) : null}

            {/* Formation */}
            {data.StudentFormation?.length > 0 ? (
              <View style={S.sectionBlock}>
                <SectionHeader title="Formation" S={S} />
                {data.StudentFormation.map((sf: any, i: number) => (
                  <View key={i} style={S.entryCard} wrap={false}>
                    <View style={S.entryTopRow}>
                      <Text style={S.entryTitle}>{sf.Formation?.etablissement}</Text>
                      <Text style={S.entryDate}>
                        {formatDate(sf.Formation?.dateDebut)} — {formatDate(sf.Formation?.dateFin)}
                      </Text>
                    </View>
                    <Text style={S.entryMeta}>{sf.Formation?.diplome}</Text>
                    {sf.Formation?.specialite
                      ? <Text style={S.entryBody}>{sf.Formation.specialite}</Text>
                      : null}
                  </View>
                ))}
              </View>
            ) : null}

            {/* Expériences & Stages */}
            {data.Stage?.length > 0 ? (
              <View style={S.sectionBlock}>
                <SectionHeader title="Expériences & Stages" S={S} />
                {data.Stage.map((s: any, i: number) => (
                  <View key={i} style={S.entryCard} wrap={false}>
                    <View style={S.entryTopRow}>
                      <Text style={S.entryTitle}>{s.entreprise}</Text>
                      <Text style={S.entryDate}>
                        {formatDate(s.dateDebut)} — {formatDate(s.dateFin)}
                      </Text>
                    </View>
                    {s.poste ? <Text style={S.entryMeta}>{s.poste}</Text> : null}
                    {s.mission ? <Text style={S.entryBody}>{s.mission}</Text> : null}
                    {s.technologies?.length > 0 ? (
                      <View style={S.tagRow}>
                        {s.technologies.map((t: string, ti: number) => (
                          <View key={ti} style={S.tag}>
                            <Text style={S.tagText}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}

            {/* Projets */}
            {data.portfolio?.projets?.length > 0 ? (
              <View style={S.sectionBlock}>
                <SectionHeader title="Projets Académiques" S={S} />
                {data.portfolio.projets.map((p: any, i: number) => (
                  <View key={i} style={S.entryCard} wrap={false}>
                    <View style={S.entryTopRow}>
                      <Text style={S.entryTitle}>{p.titre}</Text>
                      {p.type ? (
                        <View style={{ ...S.tag, marginLeft: 8 }}>
                          <Text style={S.tagText}>{p.type}</Text>
                        </View>
                      ) : null}
                    </View>
                    {p.technologie ? <Text style={S.entryMeta}>{p.technologie}</Text> : null}
                    {p.description ? <Text style={S.entryBody}>{p.description}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}

          </View>

          {/* Footer */}
          <View style={S.footer} fixed>
            <Text style={S.footerBrand}>PORTFY</Text>
            <Text style={S.footerDate}>{new Date().toLocaleDateString('fr-FR')}</Text>
          </View>

        </View>
      </Page>
    </Document>
  );
};

// ── EXPORT ────────────────────────────────────────────────────────────────────
export const generateStudentPdf = async (data: any, options: PDFStyleOptions): Promise<Buffer> => {
  const themeColor  = options.themeColor || '#2E86AB';
  const circularSrc = await getCircularImageUrl(data.avatarUrl || null);

  return await renderToBuffer(
    <PortfolioDocument
      data={data}
      themeColor={themeColor}
      circularSrc={circularSrc}
    />
  );
};