import userRules from "./user.rules.js";
import moduleRules from "./module.rules.js";

export const validationRegistry = {
  user: userRules,
  module: moduleRules
};