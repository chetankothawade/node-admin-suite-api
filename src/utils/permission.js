import prisma from "../lib/prisma.js";

export async function getUserModuleAccess(userId) {
  const numericUserId = Number(userId);

  const [allModules, userPermissions] = await Promise.all([
    prisma.module.findMany({
      include: {
        modulePermissions: {
          include: {
            permission: { select: { id: true, action: true } },
          },
        },
      },
    }),
    prisma.userPermission.findMany({
      where: { userId: numericUserId },
      include: {
        modulePermission: {
          include: {
            module: { select: { id: true, name: true } },
            permission: { select: { id: true, action: true } },
          },
        },
      },
    }),
  ]);

  const accessMap = {};

  const userAccess = {};
  userPermissions.forEach((up) => {
    const mp = up.modulePermission;
    if (!mp || !mp.module || !mp.permission) return;
    const moduleId = mp.module.id;
    if (!userAccess[moduleId]) userAccess[moduleId] = [];
    if (!userAccess[moduleId].includes(mp.permission.action)) {
      userAccess[moduleId].push(mp.permission.action);
    }
  });

  allModules.forEach((mod) => {
    const moduleName = mod.name;
    const moduleId = mod.id;

    if (userAccess[moduleId] && userAccess[moduleId].length > 0) {
      accessMap[moduleName] = userAccess[moduleId];
    } else {
      accessMap[moduleName] = mod.modulePermissions.map((mp) => mp.permission.action);
    }
  });

  return accessMap;
}
