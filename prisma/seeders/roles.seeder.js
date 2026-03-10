export async function seedRoles(prisma) {
  const dashboard = await prisma.module.upsert({
    where: { name: "Dashboard" },
    update: {
      status: "active",
      is_permission: "Y",
      is_sub_module: "N",
      parent_id: 0,
      seq_no: 1,
    },
    create: {
      name: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
      seq_no: 1,
      parent_id: 0,
      is_permission: "Y",
      is_sub_module: "N",
      status: "active",
    },
  });

  const permissions = await prisma.permission.findMany({
    where: { action: { in: ["create", "read", "update", "delete", "approve"] } },
  });

  for (const permission of permissions) {
    await prisma.modulePermission.upsert({
      where: {
        module_id_permission_id: {
          module_id: dashboard.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        module_id: dashboard.id,
        permission_id: permission.id,
      },
    });
  }

  const modules = await prisma.module.findMany({
    where: { status: "active" },
    select: { id: true },
  });

  const roleModuleRows = [];
  for (const moduleRecord of modules) {
    roleModuleRows.push({ role: "super_admin", module_id: BigInt(moduleRecord.id) });
    roleModuleRows.push({ role: "admin", module_id: BigInt(moduleRecord.id) });
  }

  for (const row of roleModuleRows) {
    await prisma.roleModule.upsert({
      where: {
        role_module_unique: {
          role: row.role,
          module_id: row.module_id,
        },
      },
      update: {},
      create: {
        role: row.role,
        module_id: row.module_id,
      },
    });
  }

  console.log("roles.seeder: done");
}


