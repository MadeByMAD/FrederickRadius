import type { Municipality } from '../types';

export type Classification = 'City' | 'Town' | 'Village';

export interface MunicipalityStyle {
  classification: Classification;
  /** CSS gradient for hero strips / cards. */
  gradient: string;
  /** Solid accent for chips / underlines. */
  accent: string;
  /** Matching foreground color for text on the gradient. */
  onAccent: string;
}

const PRESETS: Record<Classification, Omit<MunicipalityStyle, 'classification'>> = {
  City: {
    gradient: 'linear-gradient(135deg, #8B1F2F 0%, #B8374A 55%, #D4344A 100%)',
    accent: '#8B1F2F',
    onAccent: '#FFFFFF',
  },
  Town: {
    gradient: 'linear-gradient(135deg, #8C6310 0%, #B8860B 60%, #D5A334 100%)',
    accent: '#8C6310',
    onAccent: '#FFFFFF',
  },
  Village: {
    gradient: 'linear-gradient(135deg, #2F5238 0%, #4C7A5A 60%, #6F9C7A 100%)',
    accent: '#2F5238',
    onAccent: '#FFFFFF',
  },
};

export function classifyMunicipality(m: Municipality): MunicipalityStyle {
  const classification: Classification = m.name.startsWith('City')
    ? 'City'
    : m.name.startsWith('Town')
      ? 'Town'
      : 'Village';
  return { classification, ...PRESETS[classification] };
}

export function stripTitlePrefix(name: string): string {
  return name.replace(/^(City of |Town of |Village of )/, '');
}

export function municipalityInitials(name: string): string {
  const stripped = stripTitlePrefix(name);
  const words = stripped.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function personInitials(fullName: string): string {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
