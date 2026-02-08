import { prisma } from './src/lib/db'

async function main() {
  console.log('🔍 Testing database connection...\n')

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hashed_password_here',
    },
  })

  console.log('✅ Created user:', user)

  // Count all users
  const count = await prisma.user.count()
  console.log(`\n📊 Total users in database: ${count}`)

  // Clean up
  await prisma.user.delete({ where: { id: user.id } })
  console.log('\n🧹 Cleaned up test data')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
