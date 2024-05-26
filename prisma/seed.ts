import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const permissions = ['CREATE', 'UPDATE', 'READ', 'DELETE', 'ADMIN'];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: { name: permission },
    });
  }

  console.log('Permissions seeded successfully');

  // Hash passwords
  // const hashedAdminPassword = await bcrypt.hash('admin', 10);
  // const hashedUserPassword = await bcrypt.hash('user', 10);

  // // Create users
  // const user1 = await prisma.user.create({
  //   data: {
  //     email: 'enzodouglaspaiva@gmail.com',
  //     password: hashedAdminPassword,
  //     name: 'Admin User',
  //   },
  // });

  // const user2 = await prisma.user.create({
  //   data: {
  //     email: 'enzodouglaspaiva@outlook.com',
  //     password: hashedUserPassword,
  //     name: 'Regular User',
  //   },
  // });

  // console.log('Seed data created successfully', { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
