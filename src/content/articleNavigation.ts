export const articleSections = [
  { id: 'case-approach', label: 'Approach' },
  { id: 'case-outcome', label: 'Outcome' },
] as const

// The anchor IDs stay stable independently of the source heading wording.
export const articleHeadings: Partial<
  Record<string, readonly [string, string]>
> = {
  'smartsaver-native-mobile-apps': [
    'Building two apps from zero',
    'Did the timing pay off?',
  ],
  'smartsaver-passive-income': ['So, why not automate it?', 'Did it work?'],
  'smartsaver-infrastructure-for-scale': [
    'One model for every account',
    'What happened next',
  ],
  'smartsaver-banner-launches': ['Give Growth the controls', 'What changed?'],
  'solid-solar-prospecting-platform': [
    'Making the data useful',
    'And then we met the market',
  ],
}
