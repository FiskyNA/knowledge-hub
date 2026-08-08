import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const PUBLIC_USER_ID = '00000000-0000-0000-0000-000000000000'

const subjects = [
  {
    name: 'Mathematics',
    description: 'NCERT Class 10 Mathematics — 14 chapters',
    color: '#3b82f6',
    order: 0,
    chapters: [
      'Real Numbers',
      'Polynomials',
      'Pair of Linear Equations in Two Variables',
      'Quadratic Equations',
      'Arithmetic Progressions',
      'Triangles',
      'Coordinate Geometry',
      'Introduction to Trigonometry',
      'Some Applications of Trigonometry',
      'Circles',
      'Areas Related to Circles',
      'Surface Areas and Volumes',
      'Statistics',
      'Probability',
    ],
  },
  {
    name: 'Science',
    description: 'NCERT Class 10 Science — 13 chapters (Chemistry, Biology, Physics)',
    color: '#10b981',
    order: 1,
    chapters: [
      'Chemical Reactions and Equations',
      'Acids, Bases and Salts',
      'Metals and Non-metals',
      'Carbon and its Compounds',
      'Life Processes',
      'Control and Coordination',
      'How do Organisms Reproduce?',
      'Heredity',
      'Light \u2013 Reflection and Refraction',
      'The Human Eye and the Colourful World',
      'Electricity',
      'Magnetic Effects of Electric Current',
      'Our Environment',
    ],
  },
  {
    name: 'English',
    description: 'NCERT Class 10 English — First Flight & Footprints Without Feet',
    color: '#f59e0b',
    order: 2,
    chapters: [
      'First Flight \u2014 A Letter to God',
      'First Flight \u2014 Nelson Mandela: Long Walk to Freedom',
      'First Flight \u2014 Two Stories about Flying',
      'First Flight \u2014 From the Diary of Anne Frank',
      'First Flight \u2014 The Hundred Dresses \u2013 I',
      'First Flight \u2014 The Hundred Dresses \u2013 II',
      'First Flight \u2014 Glimpses of India',
      'First Flight \u2014 Mijbil the Otter',
      'First Flight \u2014 Madam Rides the Bus',
      'First Flight \u2014 The Sermon at Benares',
      'First Flight \u2014 The Proposal',
      'Footprints Without Feet \u2014 A Triumph of Surgery',
      "Footprints Without Feet \u2014 The Thief's Story",
      'Footprints Without Feet \u2014 Footprints without Feet',
      'Footprints Without Feet \u2014 The Making of a Scientist',
      'Footprints Without Feet \u2014 The Necklace',
      'Footprints Without Feet \u2014 The Hack Driver',
      'Footprints Without Feet \u2014 Bholi',
      'Footprints Without Feet \u2014 The Book That Saved the Earth',
    ],
  },
  {
    name: 'Hindi (Course A)',
    description: 'NCERT Class 10 Hindi Course A \u2014 Kshitij & Kritika',
    color: '#ef4444',
    order: 3,
    chapters: [
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0938\u0942\u0930\u0926\u093E\u0938',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0930\u093E\u092E \u0935\u093F\u0932\u093E\u0938 \u0936\u0930\u094D\u092E\u093E',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0926\u0947\u0935',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u091C\u092F\u0936\u0902\u0915\u0930 \u092A\u094D\u0930\u0938\u093E\u0926',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0938\u0942\u0930\u094D\u092F\u0915\u093E\u0902\u0924 \u0924\u094D\u0930\u093F\u092A\u093E\u0920\u0940 \u0928\u093F\u0930\u093E\u0932\u093E',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0938\u0939 \u0932\u0947\u0916\u0915',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0935\u094D\u092F\u093E\u092A\u093E\u0930\u0940 \u0932\u094B\u0917 \u0914\u0930 \u0932\u0918\u0941 \u0909\u0926\u094D\u092F\u094B\u0917',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0907\u092B\u094D\u0924\u093E\u0930 \u0915\u0940 \u0928\u092E\u093E\u091C\u093C',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0926\u094B \u0915\u0932\u093E\u0915\u093E\u0930',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u092F\u0939 \u0926\u0936\u0915',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u092E\u0928\u0941\u0937\u094D\u092F\u0924\u093E',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0921\u093E\u0915 \u0918\u0930',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u092C\u0921\u093C\u0947 \u092D\u093E\u0908 \u0938\u093E\u0939\u093F\u092C',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0921\u093E\u0915 \u0918\u0930',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u090F\u0915 \u0915\u0939\u093E\u0928\u0940 \u092F\u0939 \u092D\u0940',
      '\u0915\u094D\u0937\u093F\u0924\u093F\u091C \u2014 \u0928\u0948\u0924\u093F\u0915\u0924\u093E \u0915\u0940 \u092A\u0922\u093C\u093E\u0908',
      '\u0915\u0943\u0924\u093F\u0915\u093E \u2014 \u092E\u093E\u0924\u093E \u0915\u093E \u0906\u0902\u091A\u0932',
      '\u0915\u0943\u0924\u093F\u0915\u093E \u2014 \u091C\u0949\u0930\u094D\u091C \u092A\u0902\u091A\u092E \u0915\u0940 \u0928\u093E\u0915',
      '\u0915\u0943\u0924\u093F\u0915\u093E \u2014 \u0938\u093E\u0928\u094D\u0924\u094D\u0935\u0928\u093E',
      '\u0915\u0943\u0924\u093F\u0915\u093E \u2014 \u092F\u0939 \u0926\u0936\u0915 \u0915\u0948\u0938\u093E \u0939\u0948',
      '\u0915\u0943\u0924\u093F\u0915\u093E \u2014 \u0915\u093E\u0930\u0924\u0942\u0938',
    ],
  },
  {
    name: 'Social Science',
    description: 'NCERT Class 10 Social Science \u2014 History, Geography, Political Science, Economics',
    color: '#8b5cf6',
    order: 4,
    chapters: [
      'History \u2014 The Rise of Nationalism in Europe',
      'History \u2014 Nationalism in India',
      'History \u2014 The Making of a Global World',
      'History \u2014 The Age of Industrialisation',
      'History \u2014 Print Culture and the Modern World',
      'Geography \u2014 Resources and Development',
      'Geography \u2014 Forest and Wildlife Resources',
      'Geography \u2014 Water Resources',
      'Geography \u2014 Agriculture',
      'Geography \u2014 Minerals and Energy Resources',
      'Geography \u2014 Manufacturing Industries',
      'Geography \u2014 Lifelines of National Economy',
      'Political Science \u2014 Power Sharing',
      'Political Science \u2014 Federalism',
      'Political Science \u2014 Democracy and Diversity',
      'Political Science \u2014 Gender, Religion and Caste',
      'Political Science \u2014 Political Parties',
      'Political Science \u2014 Outcomes of Democracy',
      'Economics \u2014 Development',
      'Economics \u2014 Sectors of the Indian Economy',
      'Economics \u2014 Money and Credit',
      'Economics \u2014 Globalisation and the Indian Economy',
      'Economics \u2014 Consumer Rights',
    ],
  },
  {
    name: 'Artificial Intelligence',
    description: 'Class 10 AI \u2014 Introduced by CBSE',
    color: '#06b6d4',
    order: 5,
    chapters: [
      'Introduction to Artificial Intelligence',
      'AI Project Cycle',
      'Data',
      'Data Exploration',
      'Introduction to Python',
      'Python Basics',
      'Python Libraries',
      'AI Ethics',
      'Neural Networks',
      'Computer Vision',
    ],
  },
]

async function main() {
  console.log('Seeding NCERT Class 10 data...')

  await prisma.user.upsert({
    where: { id: PUBLIC_USER_ID },
    update: {},
    create: {
      id: PUBLIC_USER_ID,
      email: 'public@knowledgehub.local',
      password: 'placeholder',
      name: 'Public User',
    },
  })

  await prisma.chapter.deleteMany()
  await prisma.subject.deleteMany({ where: { userId: PUBLIC_USER_ID } })

  for (const subjectData of subjects) {
    const { chapters, ...subjectFields } = subjectData

    const subject = await prisma.subject.create({
      data: {
        ...subjectFields,
        userId: PUBLIC_USER_ID,
      },
    })

    await prisma.chapter.createMany({
      data: chapters.map((name, i) => ({
        name,
        order: i,
        subjectId: subject.id,
      })),
    })

    console.log(`${subject.name}: ${chapters.length} chapters`)
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
