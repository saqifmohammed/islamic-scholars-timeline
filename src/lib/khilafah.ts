export interface Khilafah {
  id: string
  name: string
  startYear: number
  endYear: number | null
  khalifas: string[]
  color: string
}

export const KHILAFAH_DATA: Khilafah[] = [
  {
    id: 'rasulullah',
    name: 'Rasulullah',
    startYear: 570,
    endYear: 632,
    khalifas: ['Muhammad ﷺ'],
    color: '#10b981',
  },
  {
    id: 'rashidun',
    name: 'Rashidun',
    startYear: 632,
    endYear: 661,
    khalifas: ['Abu Bakr', 'Umar', 'Uthman', 'Ali'],
    color: '#06b6d4',
  },
  {
    id: 'umayyad',
    name: 'Umayyad',
    startYear: 661,
    endYear: 750,
    khalifas: ['Muawiyah', 'Yazid', 'Abd al-Malik', 'Walid'],
    color: '#8b5cf6',
  },
  {
    id: 'abbasid',
    name: 'Abbasid',
    startYear: 750,
    endYear: 1258,
    khalifas: ['Al-Saffah', 'Al-Mansur', 'Harun al-Rashid', 'Al-Ma\'mun'],
    color: '#ec4899',
  },
  {
    id: 'ottoman',
    name: 'Ottoman',
    startYear: 1299,
    endYear: 1922,
    khalifas: ['Osman I', 'Mehmed II', 'Suleiman', 'Abdul Hamid II'],
    color: '#f59e0b',
  },
]

export function getKhilafahForYear(year: number): Khilafah | null {
  for (const kh of KHILAFAH_DATA) {
    const end = kh.endYear || 2030
    if (year >= kh.startYear && year <= end) {
      return kh
    }
  }
  return null
}

export function getKhilafahInRange(startYear: number, endYear: number): Khilafah[] {
  return KHILAFAH_DATA.filter(kh => {
    const khEnd = kh.endYear || 2030
    return kh.startYear <= endYear && khEnd >= startYear
  })
}