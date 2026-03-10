import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const SALT_ROUNDS = 10;

export async function seedUsers(prisma) {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@yopmail.com";
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const adminPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: "super_admin",
      status: "active",
    },
    create: {
      name: "Super Admin",
      email,
      password: adminPassword,
      role: "super_admin",
      status: "active",
      phone: "+911234567890",
    },
  });

  const targetCount = Number(process.env.SEED_USER_COUNT || 10);
  const userPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD || "Password@123", SALT_ROUNDS);

  for (let i = 1; i <= targetCount; i += 1) {
    const demoEmail = `user${i}@yopmail.com`;

    await prisma.user.upsert({
      where: { email: demoEmail },
      update: {
        role: "user",
      },
      create: {
        name: faker.person.fullName(),
        email: demoEmail,
        password: userPassword,
        phone: faker.phone.number("+91##########"),
        avatar: faker.image.avatar(),
        role: "user",
        status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
      },
    });
  }

  console.log("users.seeder: done");
}


