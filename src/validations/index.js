import userRules from "./user.rules.js";
import moduleRules from "./module.rules.js";
import categoryRules from "./category.rules.js";
import cmsRules from "./cms.rules.js";
import authRules from "./auth.rules.js";

export const validationRegistry = {
  user: userRules,
  module: moduleRules,
  category: categoryRules,
  cms: cmsRules,
  auth: authRules,
};
