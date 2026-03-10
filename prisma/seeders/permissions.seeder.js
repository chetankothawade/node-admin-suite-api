export async function seedPermissions(prisma) {
  const permissions = [
    { uuid: "00000000-0000-0000-0000-000000000101", action: "create" },
    { uuid: "00000000-0000-0000-0000-000000000102", action: "read" },
    { uuid: "00000000-0000-0000-0000-000000000103", action: "update" },
    { uuid: "00000000-0000-0000-0000-000000000104", action: "delete" },
    { uuid: "00000000-0000-0000-0000-000000000105", action: "approve" },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { uuid: permission.uuid },
      update: {
        action: permission.action,
        status: "active",
      },
      create: {
        uuid: permission.uuid,
        action: permission.action,
        status: "active",
      },
    });
  }

  console.log("permissions.seeder: done");
}
