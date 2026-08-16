const grays = {
  caretIcon: '#8A94A3',
  timelineRail: '#E0E0E0',
  yearHeading: '#7C879A',
  dateLabel: '#7C879A',
  cardHoverBorder: '#C0C8D2',
}

const landing = {
  ink: '#142032',
  body: '#4A596B',
  muted: '#5E6E84',
  border: '#E7E9EE',
  surface: '#F8F7FC',
  pink: '#E31C58',
  pinkHover: '#C81E51',
  contentMaxWidth: '1120px',
  cardRadius: '8px',
  cardShadow: '0 8px 24px rgba(20, 32, 50, 0.08)',
  sectionPaddingX: ['24px', '32px', '48px', '64px'] as const,
  sectionPaddingY: ['48px', '56px', '72px'] as const,
  type: {
    heroTitle: ['28px', '32px', '36px', '40px'] as const,
    heroTitleLine: ['34px', '40px', '44px', '48px'] as const,
    heroBody: ['16px', '16px', '18px', '18px'] as const,
    heroBodyLine: ['24px', '24px', '26px', '26px'] as const,
    sectionTitle: ['24px', '28px', '28px', '32px'] as const,
    sectionTitleLine: ['32px', '36px', '36px', '40px'] as const,
    sectionBody: ['16px', '16px', '18px'] as const,
    sectionBodyLine: ['24px', '24px', '26px'] as const,
    cardTitle: '18px',
    cardTitleLine: '26px',
    cardBody: '16px',
    cardBodyLine: '22px',
    cardCta: '16px',
    cardCtaLine: '22px',
    meta: '14px',
    metaLine: '20px',
  },
}

export default {
  grays,
  landing,
}
