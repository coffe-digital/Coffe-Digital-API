import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const roleAdmin = await prisma.role.create({
    data: { name: 'admin' },
  });

  const roleUser = await prisma.role.create({
    data: { name: 'user' },
  });

  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('admin', 10);
  const hashedUserPassword = await bcrypt.hash('user', 10);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'enzodouglaspaiva@gmail.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      roleId: roleAdmin.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'enzodouglaspaiva@outlook.com',
      password: hashedUserPassword,
      name: 'Regular User',
      roleId: roleUser.id,
    },
  });

  console.log('Seed data created successfully', { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
