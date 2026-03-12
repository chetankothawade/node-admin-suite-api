import { validationRegistry } from "../validations/index.js";
import { validateRules } from "../utils/validator.js";


export const validateRequest = (key) => {
    return async (req, res, next) => {
        const [entity, action] = key.split(".");
        const rules = validationRegistry?.[entity]?.[action];
        if (!rules) {
            return res.status(500).json({
                success: false,
                message: `Validation rules not found for ${key}`
            });
        }
        const requestData = {
            ...req.params,
            ...req.query,
            ...req.body,
        };
        if (typeof rules.safeParseAsync === "function") {
            const parsed = await rules.safeParseAsync(requestData);
            if (!parsed.success) {
                const errors = {};
                for (const issue of parsed.error.issues) {
                    const field = issue.path?.[0] || "request";
                    if (!errors[field]) errors[field] = issue.message;
                }
                return res.status(422).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }
            req.validated = parsed.data;
            return next();
        }
        const errors = await validateRules(rules, requestData);
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }
        next();
    };
};