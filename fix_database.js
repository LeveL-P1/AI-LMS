import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log('Checking existing users...');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} existing users`);
    
    if (users.length > 0) {
      console.log('Updating existing users with temporary clerkId values...');
      for (const user of users) {
        await prisma.user.update({
          where: { id: user.id },
          data: { clerkId: `temp_${user.id}` }
        });
      }
      console.log('Users updated successfully');
    }
    
    console.log('Database is ready for migration');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();