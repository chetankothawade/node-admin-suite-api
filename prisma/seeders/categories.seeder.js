export async function seedCategories(prisma) {
  const defaults = [
    { uuid: "00000000-0000-0000-0000-000000000201", name: "General", status: "active" },
    { uuid: "00000000-0000-0000-0000-000000000202", name: "Work", status: "active" },
    { uuid: "00000000-0000-0000-0000-000000000203", name: "Personal", status: "active" },
  ];

  for (const category of defaults) {
    await prisma.category.upsert({
      where: { uuid: category.uuid },
      update: {
        name: category.name,
        status: category.status,
        parentId: null,
      },
      create: category,
    });
  }

  console.log("categories.seeder: done");
}
