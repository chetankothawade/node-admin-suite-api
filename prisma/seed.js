import { PrismaClient } from "@prisma/client";
import { seedPermissions } from "./seeders/permissions.seeder.js";
import { seedRoles } from "./seeders/roles.seeder.js";
import { seedUsers } from "./seeders/users.seeder.js";
import { seedCategories } from "./seeders/categories.seeder.js";

const prisma = new PrismaClient();

async function main() {
  await seedPermissions(prisma);
  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedCategories(prisma);

  console.log("Prisma seed completed.");
}

main()
  .catch((error) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
