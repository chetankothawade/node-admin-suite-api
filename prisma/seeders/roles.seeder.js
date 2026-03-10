export async function seedRoles(prisma) {
  const dashboard = await prisma.module.upsert({
    where: { name: "Dashboard" },
    update: {
      status: "active",
      isPermission: "Y",
      isSubModule: "N",
      parentId: 0,
      seqNo: 1,
    },
    create: {
      name: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
      seqNo: 1,
      parentId: 0,
      isPermission: "Y",
      isSubModule: "N",
      status: "active",
    },
  });

  const permissions = await prisma.permission.findMany({
    where: { action: { in: ["create", "read", "update", "delete", "approve"] } },
  });

  for (const permission of permissions) {
    await prisma.modulePermission.upsert({
      where: {
        moduleId_permissionId: {
          moduleId: dashboard.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        moduleId: dashboard.id,
        permissionId: permission.id,
      },
    });
  }

  const modules = await prisma.module.findMany({
    where: { status: "active" },
    select: { id: true },
  });

  const roleModuleRows = [];
  for (const moduleRecord of modules) {
    roleModuleRows.push({ role: "super_admin", moduleId: BigInt(moduleRecord.id) });
    roleModuleRows.push({ role: "admin", moduleId: BigInt(moduleRecord.id) });
  }

  for (const row of roleModuleRows) {
    await prisma.roleModule.upsert({
      where: {
        role_module_unique: {
          role: row.role,
          moduleId: row.moduleId,
        },
      },
      update: {},
      create: {
        role: row.role,
        moduleId: row.moduleId,
      },
    });
  }

  console.log("roles.seeder: done");
}
