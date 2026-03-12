import { validationRegistry } from "../validations/index.js";
import { validateRules } from "../utils/validator.js";

const capitalizeFirst = (value) => {
    if (typeof value !== "string" || !value.length) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const validateRequest = (key) => {
    return async (req, res, next) => {
        const [entity, action] = key.split(".");
        const rules = validationRegistry?.[entity]?.[action];
        if (!rules) {
            return res.status(500).json({
                success: false,
                message: req.__("error.internal")
            });
        }
        const requestData = {
            ...req.params,
            ...req.query,
            ...req.body,
        };
        /*
        |--------------------------------------------------------------------------
        | Zod Validation
        |--------------------------------------------------------------------------
        */
        if (typeof rules.safeParseAsync === "function") {
            const parsed = await rules.safeParseAsync(requestData);
            if (!parsed.success) {
                const errors = {};
                for (const issue of parsed.error.issues) {
                    const field = issue.path?.[0] || "request";
                    if (!errors[field]) {
                        errors[field] = capitalizeFirst(req.__(issue.message));
                    }
                }
                return res.status(422).json({
                    success: false,
                    message: req.__("validation.error"),
                    errors,
                });
            }
            req.validated = parsed.data;
            return next();
        }
        /*
        |--------------------------------------------------------------------------
        | Custom Validator
        |--------------------------------------------------------------------------
        */
        const errors = await validateRules(rules, requestData, req.files || {});
        if (Object.keys(errors).length > 0) {
            const translatedErrors = {};
            for (const field in errors) {
                const errorValue = errors[field];
                if (typeof errorValue === "string") {
                    translatedErrors[field] = capitalizeFirst(req.__(errorValue));
                    continue;
                }
                if (errorValue && typeof errorValue === "object" && errorValue.key) {
                    translatedErrors[field] = capitalizeFirst(req.__(errorValue.key, errorValue.params || {}));
                    continue;
                }
                translatedErrors[field] = errorValue;
            }
            return res.status(422).json({
                success: false,
                message: req.__("validation.error"),
                errors: translatedErrors
            });
        }
        next();
    };
};
