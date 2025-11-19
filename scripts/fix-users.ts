import { runWithPrisma } from './utils/runWithPrisma';

async function fixExistingUsers() {
  await runWithPrisma(async prisma => {
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
        console.log(`Updated user ${user.id} with clerkId: temp_${user.id}`);
      }
      console.log('All users updated successfully');
    }

    console.log('Database is ready for migration');
  });
}

fixExistingUsers().catch(error => {
  console.error('Error running fix-users script:', error);
  process.exit(1);
});