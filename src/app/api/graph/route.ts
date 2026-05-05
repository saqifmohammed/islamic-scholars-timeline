import { NextRequest, NextResponse } from 'next/server'

const mockScholars = [
  // Rasoolullah and Sahaba (AH years)
  // Muhammad ﷺ: Born 53 BH (570 CE), Hijra 622 CE, Died 10 AH (632 CE)
  { id: '1', name: 'Muhammad ﷺ', birth_year: -53, death_year: 10, generation: 'sahaba', madhhab: null, creed: null, region: 'Makkah/Madinah', notes: 'Rasoolullah (SAW)' },
  { id: '2', name: 'Abu Bakr al-Siddiq', birth_year: -49, death_year: 13, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'First Caliph' },
  { id: '3', name: 'Umar ibn al-Khattab', birth_year: -38, death_year: 23, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'Second Caliph' },
  { id: '4', name: 'Uthman ibn Affan', birth_year: -47, death_year: 35, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'Third Caliph' },
  { id: '5', name: 'Ali ibn Abi Talib', birth_year: -10, death_year: 40, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'Fourth Caliph' },
  
  // Tabi'un
  { id: '6', name: 'Hasan al-Basri', birth_year: 21, death_year: 110, generation: 'tabiun', madhhab: null, creed: 'athari', region: 'Basra', notes: 'Famous Tabi\'i' },
  { id: '7', name: 'Ata ibn Abi Rabah', birth_year: 27, death_year: 114, generation: 'tabiun', madhhab: null, creed: 'athari', region: 'Makkah', notes: '' },
  
  // Imams - Classical (AH)
  { id: '8', name: 'Imam Abu Hanifa', birth_year: 80, death_year: 150, generation: 'imams', madhhab: 'hanafi', creed: 'athari', region: 'Kufa', notes: 'Founder of Hanafi madhhab' },
  { id: '9', name: 'Imam Malik ibn Anas', birth_year: 93, death_year: 179, generation: 'imams', madhhab: 'maliki', creed: 'athari', region: 'Medina', notes: 'Founder of Maliki madhhab' },
  { id: '10', name: 'Imam al-Shafi\'i', birth_year: 150, death_year: 204, generation: 'imams', madhhab: 'shafii', creed: 'ashari', region: 'Baghdad', notes: 'Founder of Shafi\'i madhhab' },
  { id: '11', name: 'Imam Ahmad ibn Hanbal', birth_year: 164, death_year: 241, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Baghdad', notes: 'Founder of Hanbali madhhab' },
  
  // Later classical
  { id: '12', name: 'Ibn Taymiyyah', birth_year: 661, death_year: 728, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Damascus', notes: 'Major Islamic scholar' },
  { id: '13', name: 'Ibn al-Qayyim', birth_year: 691, death_year: 751, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Damascus', notes: 'Student of Ibn Taymiyyah' },
  
  // 20th century scholars (AH)
  { id: '14', name: 'Muhammad ibn Ibrahim Al al-Shaykh', birth_year: 1310, death_year: 1389, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Grand Mufti of Saudi Arabia' },
  { id: '15', name: 'Abd al-Rahman al-Sa\'di', birth_year: 1306, death_year: 1376, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Prominent scholar' },
  { id: '16', name: 'Abd al-Aziz ibn Baz', birth_year: 1330, death_year: 1420, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Grand Mufti of Saudi Arabia' },
  
  // Contemporary Scholars
  { id: '17', name: 'Muhammad Nasir al-Din al-Albani', birth_year: 1334, death_year: 1420, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Syria', notes: 'Hadith scholar' },
  { id: '18', name: 'Muhammad ibn Salih al-Uthaymeen', birth_year: 1345, death_year: 1422, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Popular scholar' },
  { id: '19', name: 'Salih al-Fawzan', birth_year: 1353, death_year: null, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Active scholar' },
  { id: '20', name: 'Salih al-Luhaydan', birth_year: 1351, death_year: 1443, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Islamic judge' },
  { id: '21', name: 'Rabee al-Madkhali', birth_year: 1353, death_year: null, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
  { id: '22', name: 'Muqbil ibn Hadi al-Wadi\'i', birth_year: 1353, death_year: 1422, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Yemen', notes: 'Yemeni scholar' },
  { id: '23', name: 'Ubayd al-Jabiri', birth_year: 1352, death_year: 1444, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
  { id: '24', name: 'Abd al-Muhsin al-Abbad', birth_year: 1353, death_year: null, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
]

const mockRelationships = [
  // Rasoolullah to Sahaba (prophet is the source - only teacher, no student)
  { id: 'r1', teacher_id: '1', student_id: '2', type: 'teacher' }, // Muhammad -> Abu Bakr
  { id: 'r2', teacher_id: '1', student_id: '3', type: 'teacher' }, // Muhammad -> Umar
  { id: 'r3', teacher_id: '1', student_id: '4', type: 'teacher' }, // Muhammad -> Uthman
  { id: 'r4', teacher_id: '1', student_id: '5', type: 'teacher' }, // Muhammad -> Ali
  // Tabi'un generation gaps (sahaba to tabiun - spiritual connection)
  { id: 'r5', teacher_id: '2', student_id: '6', type: 'teacher' }, // Abu Bakr -> Hasan al-Basri
  { id: 'r6', teacher_id: '5', student_id: '6', type: 'teacher' }, // Ali -> Hasan al-Basri
  // Imams classical chain
  { id: 'r7', teacher_id: '9', student_id: '10', type: 'teacher' }, // Malik -> Shafi'i
  { id: 'r8', teacher_id: '10', student_id: '11', type: 'teacher' }, // Shafi'i -> Ahmad
  { id: 'r9', teacher_id: '11', student_id: '12', type: 'teacher' }, // Ahmad -> Ibn Taymiyyah
  { id: 'r10', teacher_id: '12', student_id: '13', type: 'teacher' }, // Ibn Taymiyyah -> Ibn al-Qayyim
  // 20th century chain (new IDs: 14=1310, 15=1306, 16=1330)
  { id: 'r11', teacher_id: '14', student_id: '15', type: 'teacher' }, // Muhammad Ibrahim -> Sa'di
  { id: 'r12', teacher_id: '14', student_id: '16', type: 'teacher' }, // Muhammad Ibrahim -> Ibn Baz
  { id: 'r13', teacher_id: '14', student_id: '18', type: 'teacher' }, // Muhammad Ibrahim -> Uthaymeen
  { id: 'r14', teacher_id: '14', student_id: '20', type: 'teacher' }, // Muhammad Ibrahim -> Luhaydan
  { id: 'r15', teacher_id: '14', student_id: '24', type: 'teacher' }, // Muhammad Ibrahim -> Abbad
  { id: 'r16', teacher_id: '15', student_id: '18', type: 'teacher' }, // Sa'di -> Uthaymeen
  { id: 'r17', teacher_id: '16', student_id: '17', type: 'teacher' }, // Ibn Baz -> Albani
  { id: 'r18', teacher_id: '16', student_id: '18', type: 'teacher' }, // Ibn Baz -> Uthaymeen
  { id: 'r19', teacher_id: '16', student_id: '19', type: 'teacher' }, // Ibn Baz -> Fawzan
  { id: 'r20', teacher_id: '16', student_id: '21', type: 'teacher' }, // Ibn Baz -> Madkhali
  { id: 'r21', teacher_id: '16', student_id: '22', type: 'teacher' }, // Ibn Baz -> Muqbil
  { id: 'r22', teacher_id: '16', student_id: '23', type: 'teacher' }, // Ibn Baz -> Ubayd
  { id: 'r23', teacher_id: '16', student_id: '24', type: 'teacher' }, // Ibn Baz -> Abbad
  // Albani's students
  { id: 'r24', teacher_id: '17', student_id: '21', type: 'teacher' }, // Albani -> Madkhali
  { id: 'r25', teacher_id: '17', student_id: '22', type: 'teacher' }, // Albani -> Muqbil
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const generation = searchParams.get('generation') || undefined
  const madhhab = searchParams.get('madhhab') || undefined
  const creed = searchParams.get('creed') || undefined
  const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
  const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined
  const search = searchParams.get('search')?.toLowerCase() || undefined

  let scholars = [...mockScholars]

  if (generation) {
    scholars = scholars.filter(s => s.generation === generation)
  }
  if (madhhab) {
    scholars = scholars.filter(s => s.madhhab === madhhab)
  }
  if (creed) {
    scholars = scholars.filter(s => s.creed === creed)
  }
  if (minYear) {
    scholars = scholars.filter(s => s.birth_year && s.birth_year >= minYear)
  }
  if (maxYear) {
    scholars = scholars.filter(s => s.birth_year && s.birth_year <= maxYear)
  }
  if (search) {
    scholars = scholars.filter(s => 
      s.name.toLowerCase().includes(search) ||
      s.notes?.toLowerCase().includes(search) ||
      s.region?.toLowerCase().includes(search)
    )
  }

  const scholarIds = scholars.map(s => s.id)
  const relationships = mockRelationships.filter(r => 
    scholarIds.includes(r.teacher_id) && scholarIds.includes(r.student_id)
  )

  const nodes = scholars.map(s => ({
    id: s.id,
    label: s.name,
    data: {
      generation: s.generation,
      madhhab: s.madhhab,
      creed: s.creed,
      birthYear: s.birth_year,
      deathYear: s.death_year,
    },
  }))

  const edges = relationships.map(r => ({
    id: r.id,
    source: r.teacher_id,
    target: r.student_id,
    type: r.type,
  }))

  return NextResponse.json({ nodes, edges })
}