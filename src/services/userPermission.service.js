import { BaseService } from "./base.service.js";
import { userPermissionRepository } from "../repositories/userPermission.repository.js";

export const userPermissionService = {
  toModuleIdList(roleModules = []) {
    return roleModules
      .map((row) => Number(row.module_id))
      .filter((id) => Number.isInteger(id) && id > 0);
  },

  /*
   * Resolve user from various possible identifiers (id, uuid) and return user with specified select fields
   * Accepts either numeric ID or UUID string as userIdentifier
   * Default select fields are id and role, but can be customized via the select parameter
   * Throws error if user not found
  */
  async resolveUser(userIdentifier, select = { id: true, role: true }) {
    const raw = String(userIdentifier ?? "").trim();

    if (!raw) throw new Error("User not found");

    const numericId = Number(raw);
    const where = Number.isInteger(numericId) && numericId > 0
      ? { id: numericId }
      : { uuid: raw };

    const user = await userPermissionRepository.findUser(where, select);

    if (!user) throw new Error("User not found");
    return user;
  },

  /*
  * Resolve module_permission_id from either direct ID or module_id + permission_id
    * Accepts payload with either:  
    - module_permission_id
    - module_id + permission_id
  */
  async resolveModulePermissionId(payload) {
    const directId = Number(payload.module_permission_id);
    if (Number.isInteger(directId) && directId > 0) {
      const modulePermission = await userPermissionRepository.findModulePermissionById(directId);
      if (!modulePermission) {
        BaseService.throwError(400, "validation.invalid_module_permission");
      }
      return modulePermission.id;
    }

    const moduleId = Number(payload.module_id);
    const permissionId = Number(payload.permission_id);
    if (Number.isInteger(moduleId) && moduleId > 0 && Number.isInteger(permissionId) && permissionId > 0) {
      const modulePermission = await userPermissionRepository.findModulePermissionByModuleAndPermission(
        moduleId,
        permissionId
      );
      if (!modulePermission) {
        BaseService.throwError(400, "validation.invalid_module_permission");
      }
      return modulePermission.id;
    }

    BaseService.throwError(400, "validation.invalid_module_permission");
  },

  /**
   * Toggle permission 
   * If isChecked is true, add permission; if false, remove permission
   */
  async toggle(userIdOrPayload, modulePermissionIdArg, isCheckedArg) {
    const payload = typeof userIdOrPayload === "object" && userIdOrPayload !== null
      ? userIdOrPayload
      : {
        user_id: userIdOrPayload,
        module_permission_id: modulePermissionIdArg,
        isChecked: isCheckedArg,
      };

    if (payload.isChecked === undefined || payload.isChecked === null) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const isChecked = payload.isChecked === true || payload.isChecked === "true" || payload.isChecked === 1 || payload.isChecked === "1";
    const user = await this.resolveUser(payload.user_id, { id: true });
    const modulePermissionId = await this.resolveModulePermissionId(payload);

    if (isChecked) {
      return userPermissionRepository.upsertUserPermission(user.id, modulePermissionId);
    }

    return userPermissionRepository.deleteUserPermission(user.id, modulePermissionId);
  },

  async getUsersModulesPermission(uuid) {
    const user = await this.resolveUser(uuid, { id: true });

    return this.getModulePermissionMatrix(user.id, "N");
  },


  /**
   * Get module permission matrix for a user, including role-based permissions and user-specific overrides
   * isPermission: "Y" to filter modules with is_permission = "Y"
   */
  async getModulePermissionMatrix(userId, isPermission = "N") {
    const user = await this.resolveUser(userId, { id: true, role: true });

    // role_modules filtering (missing in your code)
    const roleModules = await userPermissionRepository.findRoleModules(user.role);

    const roleModuleIds = this.toModuleIdList(roleModules);

    const modules = await userPermissionRepository.findModules({
      where: {
        id: { in: roleModuleIds },
        status: "active",
        ...(isPermission === "Y" ? { is_permission: "Y" } : {})
      },
      orderBy: [
        { seq_no: "asc" },
        { id: "asc" }
      ]
    });

    const permissions = await userPermissionRepository.findPermissions({
      where: { status: "active" },
      orderBy: { id: "asc" }
    });

    const modulePermissions = await userPermissionRepository.findModulePermissions();

    const userPermissions = await userPermissionRepository.findUserPermissions({
      where: { user_id: user.id },
      select: { module_permission_id: true }
    });

    const userPermissionIds = userPermissions.map(p => p.module_permission_id);

    const modulesResult = modules.map(m => {

      const perms = permissions.map(p => {

        const mp = modulePermissions.find(
          x => x.module_id === m.id && x.permission_id === p.id
        );

        return {
          id: p.id,
          action: p.action,
          modulePermissionId: mp ? mp.id : null
        };
      });

      return {
        id: m.id,
        name: m.name,
        url: m.url,
        icon: m.icon,
        seq_no: m.seq_no,
        is_sub_module: m.is_sub_module,
        parent_id: m.parent_id,
        is_permission: m.is_permission,
        permissions: perms
      };
    });

    return {
      modules: modulesResult,
      userPermissions: [...new Set(userPermissionIds)]
    };
  },


  /**
   * Get user module access
   * Returns an object mapping module names to arrays of permission actions the user has for that module, based on role and user-specific permissions
   */
  async getUserModuleAccess(userId) {
    const user = await this.resolveUser(userId, { id: true, role: true });

    const roleModules = await userPermissionRepository.findRoleModules(user.role);

    const roleModuleIds = this.toModuleIdList(roleModules);

    const modules = await userPermissionRepository.findModules({
      where: {
        id: { in: roleModuleIds }
      },
      include: {
        module_permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    const userPermissions = await userPermissionRepository.findUserPermissions({
      where: { user_id: user.id },
      include: {
        module_permission: {
          include: {
            permission: true,
            module: true
          }
        }
      }
    });

    const userAccess = {};

    for (const up of userPermissions) {

      const mp = up.module_permission;
      if (!mp) continue;

      if (!userAccess[mp.module_id]) {
        userAccess[mp.module_id] = [];
      }

      userAccess[mp.module_id].push(mp.permission.action);
    }

    const permissionMap = {};
    const roleModulesNames = [];

    for (const module of modules) {

      const moduleKey = module.name;
      roleModulesNames.push(moduleKey);

      if (userAccess[module.id]) {
        permissionMap[moduleKey] = [...new Set(userAccess[module.id])];
      } else {
        permissionMap[moduleKey] = module.module_permissions
          .map(mp => mp.permission.action)
          .filter(Boolean);
      }
    }

    return {
      roleModules: [...new Set(roleModulesNames)],
      permissions: permissionMap
    };
  },


  /**
   * buildSidebarMenu
   * Build sidebar menu based on user permissions
   */
  async buildSidebarMenu(userId) {

    const user = await userPermissionRepository.findUser(
      { id: userId },
      { role: true }
    );

    const roleModules = await userPermissionRepository.findRoleModules(user.role);

    const roleModuleIds = this.toModuleIdList(roleModules);

    const matrix = await this.getModulePermissionMatrix(userId, "N");

    const modules = matrix.modules.filter(m =>
      roleModuleIds.includes(m.id)
    );

    return this.applyUserPermissionRules(
      modules,
      matrix.userPermissions
    );
  },


  /**
   * applyUserPermissionRules
   * Apply permission rules to determine module access for sidebar
   */
  applyUserPermissionRules(modules, userPermissions) {

    const userPermissionSet = new Set(userPermissions);
    const moduleMap = {};

    for (const m of modules) {

      const permissions = m.permissions || [];
      const configuredPermissionIds = [];
      let viewMPId = null;

      for (const perm of permissions) {

        if (perm.modulePermissionId) {
          configuredPermissionIds.push(perm.modulePermissionId);
        }

        if (perm.action === "view") {
          viewMPId = perm.modulePermissionId;
        }
      }

      const hasConfigured = configuredPermissionIds.length > 0;

      const userHasAny = configuredPermissionIds.some(
        id => userPermissionSet.has(id)
      );

      if (
        !hasConfigured ||
        (viewMPId && userPermissionSet.has(viewMPId)) ||
        (hasConfigured && !userHasAny)
      ) {

        moduleMap[m.id] = {
          id: m.id,
          name: m.name,
          url: m.url,
          icon: m.icon,
          parent_id: m.parent_id,
          children: []
        };
      }
    }

    const tree = {};

    for (const m of Object.values(moduleMap)) {

      if (!m.parent_id) {
        tree[m.id] = m;
      } else if (moduleMap[m.parent_id]) {
        moduleMap[m.parent_id].children.push(m);
      }
    }

    return Object.values(tree);
  }
};
