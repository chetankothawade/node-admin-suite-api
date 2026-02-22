import db from "../models/index.js";
const { Module, ModulePermission, Permission, UserPermission } = db;

export async function getUserModuleAccess(userId) {
    // Fetch all modules with their permissions
    const allModules = await Module.findAll({
        include: [
            {
                model: ModulePermission,
                include: [{ model: Permission, attributes: ["id", "action"] }],
            },
        ],
    });

    // Fetch user's permissions
    const userPermissions = await UserPermission.findAll({
        where: { userId },
        include: [
            {
                model: ModulePermission,
                include: [
                    { model: Module, attributes: ["id", "name"] },
                    { model: Permission, attributes: ["id", "action"] },
                ],
            },
        ],
    });

    const accessMap = {};

    // Build quick lookup of user permissions: { moduleId: [actions] }
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

    // Now merge module-wise
    allModules.forEach((mod) => {
        const moduleName = mod.name;
        const moduleId = mod.id;

        if (userAccess[moduleId] && userAccess[moduleId].length > 0) {
            // Use user-specific permissions
            accessMap[moduleName] = userAccess[moduleId];
        } else {
            // No user permissions → grant all available actions for that module
            accessMap[moduleName] = mod.modulePermissions.map(
                (mp) => mp.permission.action
            );
        }
    });

    return accessMap;
}
