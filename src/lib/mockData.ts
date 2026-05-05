// ---------------------------------------------------------------------------
// Seed data – defined once and stored on globalThis so that Next.js HMR /
// module re-evaluation doesn't reset runtime mutations (adds / edits / deletes).
// ---------------------------------------------------------------------------

const seedScholars = [
  // Rasoolullah and Sahaba
  { id: '1', name: 'Muhammad ﷺ', birth_year: 570, death_year: 632, generation: 'sahaba', madhhab: null, creed: null, region: 'Makkah/Madinah', notes: 'Rasoolullah (SAW)' },
  { id: '2', name: 'Abu Bakr', birth_year: 573, death_year: 634, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'First Caliph' },
  { id: '3', name: 'Umar ibn al-Khattab', birth_year: 584, death_year: 644, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'Second Caliph' },
  { id: '4', name: 'Ali ibn Abi Talib', birth_year: 600, death_year: 661, generation: 'sahaba', madhhab: null, creed: 'athari', region: 'Makkah', notes: 'Fourth Caliph' },

  // Tabi'un
  { id: '5', name: 'Hasan al-Basri', birth_year: 642, death_year: 728, generation: 'tabiun', madhhab: null, creed: 'athari', region: 'Basra', notes: "Famous Tabi'i" },
  { id: '6', name: 'Ata ibn Abi Rabah', birth_year: 654, death_year: 732, generation: 'tabiun', madhhab: null, creed: 'athari', region: 'Makkah', notes: '' },

  // Imams - Classical
  { id: '7', name: 'Abu Hanifa', birth_year: 699, death_year: 767, generation: 'imams', madhhab: 'hanafi', creed: 'athari', region: 'Kufa', notes: 'Founder of Hanafi madhhab' },
  { id: '8', name: 'Malik ibn Anas', birth_year: 711, death_year: 795, generation: 'imams', madhhab: 'maliki', creed: 'athari', region: 'Medina', notes: 'Founder of Maliki madhhab' },
  { id: '9', name: "Al-Shafi'i", birth_year: 767, death_year: 820, generation: 'imams', madhhab: 'shafii', creed: 'ashari', region: 'Baghdad', notes: "Founder of Shafi'i madhhab" },
  { id: '10', name: 'Ahmad ibn Hanbal', birth_year: 780, death_year: 855, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Baghdad', notes: 'Founder of Hanbali madhhab' },

  // Later classical
  { id: '11', name: 'Ibn Taymiyyah', birth_year: 1263, death_year: 1328, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Damascus', notes: 'Major Islamic scholar' },
  { id: '12', name: 'Ibn al-Qayyim', birth_year: 1292, death_year: 1350, generation: 'imams', madhhab: 'hanbali', creed: 'athari', region: 'Damascus', notes: 'Student of Ibn Taymiyyah' },

  // 20th century scholars
  { id: '13', name: 'Muhammad ibn Ibrahim Al al-Shaykh', birth_year: 1893, death_year: 1969, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Grand Mufti of Saudi Arabia' },
  { id: '14', name: "Abd al-Rahman al-Sa'di", birth_year: 1889, death_year: 1956, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Prominent scholar' },
  { id: '15', name: 'Abd al-Aziz ibn Baz', birth_year: 1910, death_year: 1999, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Grand Mufti of Saudi Arabia' },

  // Contemporary Scholars
  { id: '16', name: 'Muhammad Nasir al-Din al-Albani', birth_year: 1914, death_year: 1999, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Syria', notes: 'Hadith scholar' },
  { id: '17', name: 'Muhammad ibn Salih al-Uthaymeen', birth_year: 1925, death_year: 2001, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Popular scholar' },
  { id: '18', name: 'Salih al-Fawzan', birth_year: 1933, death_year: null, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Active scholar' },
  { id: '19', name: 'Salih al-Luhaydan', birth_year: 1931, death_year: 2022, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Islamic judge' },
  { id: '20', name: 'Rabee al-Madkhali', birth_year: 1933, death_year: null, generation: 'scholars', madhhab: 'hanbali', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
  { id: '21', name: "Muqbil ibn Hadi al-Wadi'i", birth_year: 1933, death_year: 2001, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Yemen', notes: 'Yemeni scholar' },
  { id: '22', name: 'Ubayd al-Jabiri', birth_year: 1932, death_year: 2023, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
  { id: '23', name: 'Abd al-Muhsin al-Abbad', birth_year: 1933, death_year: null, generation: 'scholars', madhhab: 'hadith', creed: 'athari', region: 'Saudi Arabia', notes: 'Scholar' },
]

const seedRelationships = [
  // Rasoolullah to Sahaba
  { id: 'r1', teacher_id: '1', student_id: '2', type: 'teacher' },
  { id: 'r2', teacher_id: '1', student_id: '3', type: 'teacher' },
  { id: 'r3', teacher_id: '1', student_id: '4', type: 'teacher' },
  // Classical transmission
  { id: 'r4', teacher_id: '8', student_id: '9', type: 'teacher' },   // Malik -> Shafi'i
  { id: 'r5', teacher_id: '9', student_id: '10', type: 'teacher' },  // Shafi'i -> Ahmad
  { id: 'r6', teacher_id: '10', student_id: '11', type: 'teacher' }, // Ahmad -> Ibn Taymiyyah
  { id: 'r7', teacher_id: '11', student_id: '12', type: 'teacher' }, // Ibn Taymiyyah -> Ibn al-Qayyim
  // 20th century chain
  { id: 'r8', teacher_id: '13', student_id: '15', type: 'teacher' }, // Muhammad Ibrahim -> Ibn Baz
  { id: 'r9', teacher_id: '13', student_id: '19', type: 'teacher' }, // Muhammad Ibrahim -> Luhaydan
  { id: 'r10', teacher_id: '13', student_id: '23', type: 'teacher' }, // Muhammad Ibrahim -> Abbad
  { id: 'r11', teacher_id: '14', student_id: '17', type: 'teacher' }, // Sa'di -> Uthaymeen
  { id: 'r12', teacher_id: '15', student_id: '16', type: 'teacher' }, // Ibn Baz -> Albani
  { id: 'r13', teacher_id: '15', student_id: '17', type: 'teacher' }, // Ibn Baz -> Uthaymeen
  { id: 'r14', teacher_id: '15', student_id: '18', type: 'teacher' }, // Ibn Baz -> Fawzan
  { id: 'r15', teacher_id: '15', student_id: '20', type: 'teacher' }, // Ibn Baz -> Madkhali
  { id: 'r16', teacher_id: '15', student_id: '21', type: 'teacher' }, // Ibn Baz -> Muqbil
  { id: 'r17', teacher_id: '15', student_id: '22', type: 'teacher' }, // Ibn Baz -> Ubayd
  { id: 'r18', teacher_id: '15', student_id: '23', type: 'teacher' }, // Ibn Baz -> Abbad
  // Albani's students
  { id: 'r19', teacher_id: '16', student_id: '20', type: 'teacher' }, // Albani -> Madkhali
  { id: 'r20', teacher_id: '16', student_id: '21', type: 'teacher' }, // Albani -> Muqbil
]

const seedBooks = [
  { id: 'b1', title: 'Sahih al-Bukhari', author_id: '1', notes: 'The most authentic hadith collection' },
  { id: 'b2', title: 'Al-Muwatta', author_id: '8', notes: 'First written collection of hadith' },
  { id: 'b3', title: 'Al-Risala', author_id: '9', notes: 'First book on Islamic jurisprudence theory' },
  { id: 'b4', title: 'Al-Musnad', author_id: '10', notes: 'Major hadith collection' },
  { id: 'b5', title: 'Majmu al-Fatawa', author_id: '11', notes: 'Collected fatwas of Ibn Taymiyyah' },
  { id: 'b6', title: 'Zad al-Maad', author_id: '12', notes: 'Provisions of the Hereafter' },
  { id: 'b7', title: 'Silsilah al-Ahadith al-Sahihah', author_id: '16', notes: 'Chain of authentic hadiths' },
  { id: 'b8', title: 'Taysir al-Karim al-Rahman', author_id: '14', notes: 'Tafsir of the Quran' },
]

// Attach to globalThis so HMR module re-evaluation doesn't wipe runtime mutations.
type Store = {
  _mockScholars: typeof seedScholars
  _mockRelationships: typeof seedRelationships
  _mockBooks: typeof seedBooks
}
const g = globalThis as typeof globalThis & Store
if (!g._mockScholars)     g._mockScholars     = seedScholars
if (!g._mockRelationships) g._mockRelationships = seedRelationships
if (!g._mockBooks)        g._mockBooks        = seedBooks

export const mockScholars     = g._mockScholars
export const mockRelationships = g._mockRelationships
export const mockBooks        = g._mockBooks
