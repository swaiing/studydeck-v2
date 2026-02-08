import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a demo user for the public decks
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@studydeck.app' },
    update: {},
    create: {
      email: 'demo@studydeck.app',
      username: 'studydeck',
      passwordHash: hashedPassword,
      role: 'user',
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Sample decks with flashcards
  const sampleDecks = [
    {
      name: 'Spanish Vocabulary - Basics',
      description: 'Essential Spanish words and phrases for beginners',
      privacy: 'public' as const,
      tags: ['Spanish', 'Language', 'Beginner'],
      cards: [
        { question: 'Hello', answer: 'Hola' },
        { question: 'Goodbye', answer: 'Adiós' },
        { question: 'Please', answer: 'Por favor' },
        { question: 'Thank you', answer: 'Gracias' },
        { question: 'Yes', answer: 'Sí' },
        { question: 'No', answer: 'No' },
        { question: 'Good morning', answer: 'Buenos días' },
        { question: 'Good night', answer: 'Buenas noches' },
        { question: 'How are you?', answer: '¿Cómo estás?' },
        { question: 'What is your name?', answer: '¿Cómo te llamas?' },
      ],
    },
    {
      name: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts every developer should know',
      privacy: 'public' as const,
      tags: ['JavaScript', 'Programming', 'Web Development'],
      cards: [
        { question: 'What does const mean?', answer: 'Declares a constant variable that cannot be reassigned' },
        { question: 'What is a closure?', answer: 'A function that has access to variables in its outer scope, even after the outer function has returned' },
        { question: 'What is the difference between == and ===?', answer: '== compares values with type coercion, === compares values without type coercion (strict equality)' },
        { question: 'What is hoisting?', answer: 'JavaScript\'s behavior of moving variable and function declarations to the top of their scope' },
        { question: 'What is an arrow function?', answer: 'A shorter syntax for writing function expressions, using () => syntax' },
        { question: 'What is a promise?', answer: 'An object representing the eventual completion or failure of an asynchronous operation' },
        { question: 'What is async/await?', answer: 'Syntactic sugar for working with promises, making asynchronous code look synchronous' },
        { question: 'What is the spread operator?', answer: 'The ... operator that expands an iterable into individual elements' },
      ],
    },
    {
      name: 'World Capitals',
      description: 'Learn the capital cities of countries around the world',
      privacy: 'public' as const,
      tags: ['Geography', 'World', 'Capitals'],
      cards: [
        { question: 'What is the capital of France?', answer: 'Paris' },
        { question: 'What is the capital of Japan?', answer: 'Tokyo' },
        { question: 'What is the capital of Australia?', answer: 'Canberra' },
        { question: 'What is the capital of Brazil?', answer: 'Brasília' },
        { question: 'What is the capital of Canada?', answer: 'Ottawa' },
        { question: 'What is the capital of India?', answer: 'New Delhi' },
        { question: 'What is the capital of Germany?', answer: 'Berlin' },
        { question: 'What is the capital of Italy?', answer: 'Rome' },
        { question: 'What is the capital of Spain?', answer: 'Madrid' },
        { question: 'What is the capital of Egypt?', answer: 'Cairo' },
      ],
    },
    {
      name: 'Basic Chemistry',
      description: 'Fundamental chemistry concepts and definitions',
      privacy: 'public' as const,
      tags: ['Chemistry', 'Science', 'Education'],
      cards: [
        { question: 'What is an atom?', answer: 'The smallest unit of matter that retains the properties of an element' },
        { question: 'What is a molecule?', answer: 'Two or more atoms bonded together' },
        { question: 'What is the periodic table?', answer: 'A table organizing elements by atomic number and chemical properties' },
        { question: 'What is pH?', answer: 'A measure of how acidic or basic a solution is (scale 0-14)' },
        { question: 'What is a covalent bond?', answer: 'A chemical bond formed by sharing electrons between atoms' },
        { question: 'What is an ionic bond?', answer: 'A chemical bond formed by transferring electrons between atoms' },
        { question: 'What is the chemical formula for water?', answer: 'H₂O' },
        { question: 'What is photosynthesis?', answer: 'The process by which plants convert light energy into chemical energy' },
      ],
    },
    {
      name: 'U.S. Presidents',
      description: 'Learn about notable U.S. Presidents and their terms',
      privacy: 'public' as const,
      tags: ['History', 'USA', 'Politics'],
      cards: [
        { question: 'Who was the first U.S. President?', answer: 'George Washington (1789-1797)' },
        { question: 'Which President delivered the Gettysburg Address?', answer: 'Abraham Lincoln (1861-1865)' },
        { question: 'Which President served more than two terms?', answer: 'Franklin D. Roosevelt (1933-1945, 4 terms)' },
        { question: 'Who was President during World War I?', answer: 'Woodrow Wilson (1913-1921)' },
        { question: 'Which President resigned from office?', answer: 'Richard Nixon (1969-1974)' },
        { question: 'Who was the youngest elected President?', answer: 'John F. Kennedy (43 years old)' },
        { question: 'Which President signed the Emancipation Proclamation?', answer: 'Abraham Lincoln (1863)' },
      ],
    },
    {
      name: 'React Hooks',
      description: 'Essential React Hooks and their use cases',
      privacy: 'public' as const,
      tags: ['React', 'JavaScript', 'Web Development'],
      cards: [
        { question: 'What does useState do?', answer: 'Manages state in functional components, returns [state, setState]' },
        { question: 'What does useEffect do?', answer: 'Performs side effects in functional components (data fetching, subscriptions, etc.)' },
        { question: 'What does useContext do?', answer: 'Accesses React Context values without prop drilling' },
        { question: 'What does useRef do?', answer: 'Creates a mutable reference that persists across renders, often used for DOM access' },
        { question: 'What does useMemo do?', answer: 'Memoizes expensive computations to avoid recalculation on every render' },
        { question: 'What does useCallback do?', answer: 'Memoizes callback functions to prevent unnecessary re-renders' },
        { question: 'When does useEffect run?', answer: 'After render by default, or when dependencies in the dependency array change' },
      ],
    },
    {
      name: 'Medical Terminology',
      description: 'Common medical terms and abbreviations',
      privacy: 'public' as const,
      tags: ['Medicine', 'Healthcare', 'Terminology'],
      cards: [
        { question: 'What does "acute" mean?', answer: 'Sudden onset, severe, short duration' },
        { question: 'What does "chronic" mean?', answer: 'Long-lasting, persistent condition' },
        { question: 'What does "benign" mean?', answer: 'Non-cancerous, not harmful' },
        { question: 'What does "malignant" mean?', answer: 'Cancerous, potentially harmful' },
        { question: 'What does "prognosis" mean?', answer: 'The likely outcome or course of a disease' },
        { question: 'What does "diagnosis" mean?', answer: 'Identification of a disease or condition' },
        { question: 'What does BP stand for?', answer: 'Blood Pressure' },
        { question: 'What does HR stand for?', answer: 'Heart Rate' },
      ],
    },
    {
      name: 'French Verbs - Present Tense',
      description: 'Common French verbs conjugated in present tense',
      privacy: 'public' as const,
      tags: ['French', 'Language', 'Verbs'],
      cards: [
        { question: 'être (to be) - je', answer: 'je suis' },
        { question: 'avoir (to have) - je', answer: 'j\'ai' },
        { question: 'faire (to do/make) - je', answer: 'je fais' },
        { question: 'aller (to go) - je', answer: 'je vais' },
        { question: 'pouvoir (can/to be able) - je', answer: 'je peux' },
        { question: 'vouloir (to want) - je', answer: 'je veux' },
        { question: 'savoir (to know) - je', answer: 'je sais' },
        { question: 'voir (to see) - je', answer: 'je vois' },
      ],
    },
  ]

  // Create decks with cards and tags
  for (const deckData of sampleDecks) {
    const { cards, tags, ...deckInfo } = deckData

    const deck = await prisma.deck.create({
      data: {
        ...deckInfo,
        userId: demoUser.id,
        cards: {
          create: cards.map((card, index) => ({
            question: card.question,
            answer: card.answer,
            cardOrder: index,
          })),
        },
      },
    })

    // Create tags and associate with deck
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })

      await prisma.deckTag.create({
        data: {
          deckId: deck.id,
          tagId: tag.id,
        },
      })
    }

    console.log(`✅ Created deck: ${deck.name} (${cards.length} cards)`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
