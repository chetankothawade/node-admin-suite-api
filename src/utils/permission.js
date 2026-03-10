import { moduleRepository } from "../repositories/module.repository.js";

export async function getUserModuleAccess(user_id) {
  const numericUserId = Number(user_id);

  const [allModules, user_permissions] = await Promise.all([
    moduleRepository.findMany({
      include: {
        module_permissions: {
          include: {
            permission: { select: { id: true, action: true } },
          },
        },
      },
    }),
    moduleRepository.findUserPermissions({
      where: { user_id: numericUserId },
      include: {
        module_permission: {
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
  user_permissions.forEach((up) => {
    const mp = up.module_permission;
    if (!mp || !mp.module || !mp.permission) return;
    const module_id = mp.module.id;
    if (!userAccess[module_id]) userAccess[module_id] = [];
    if (!userAccess[module_id].includes(mp.permission.action)) {
      userAccess[module_id].push(mp.permission.action);
    }
  });

  allModules.forEach((mod) => {
    const moduleName = mod.name;
    const module_id = mod.id;

    if (userAccess[module_id] && userAccess[module_id].length > 0) {
      accessMap[moduleName] = userAccess[module_id];
    } else {
      accessMap[moduleName] = mod.module_permissions.map((mp) => mp.permission.action);
    }
  });

  return accessMap;
}


