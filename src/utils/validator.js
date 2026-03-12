import prisma from "../lib/prisma.js";

function resolveModelDelegate(tableName) {
    if (!tableName) return null;

    const normalized = String(tableName).trim();
    const singular = normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;

    const candidates = [
        normalized,
        normalized.toLowerCase(),
        singular,
        singular.toLowerCase()
    ];

    for (const modelName of candidates) {
        const delegate = prisma[modelName];
        if (delegate && typeof delegate.findFirst === "function") {
            return delegate;
        }
    }

    return null;
}

export async function validateRules(rules, data, files = {}) {

    const errors = {};

    for (const field in rules) {

        let ruleString = rules[field];
        let customMessages = {};

        // Support object style rules
        if (typeof ruleString === "object") {
            customMessages = ruleString.message || {};
            ruleString = ruleString.rules;
        }

        const ruleList = ruleString.split("|");
        const value = data[field];

        for (const rule of ruleList) {

            const [ruleName, ruleValue] = rule.split(":");

            const getMessage = (defaultMessage) => {
                return customMessages?.[ruleName] || defaultMessage;
            };

            switch (ruleName) {

                case "required":
                    if (value === undefined || value === null || value === "") {
                        errors[field] = getMessage(`${field} is required`);
                    }
                    break;

                case "email":
                    const emailRegex = /\S+@\S+\.\S+/;
                    if (value && !emailRegex.test(value)) {
                        errors[field] = getMessage(`${field} must be a valid email`);
                    }
                    break;

                case "min":
                    if (value && value.length < Number(ruleValue)) {
                        errors[field] = getMessage(`${field} must be at least ${ruleValue}`);
                    }
                    break;

                case "max":
                    if (value && value.length > Number(ruleValue)) {
                        errors[field] = getMessage(`${field} must be less than ${ruleValue}`);
                    }
                    break;

                case "numeric":
                    if (value && isNaN(value)) {
                        errors[field] = getMessage(`${field} must be numeric`);
                    }
                    break;

                case "boolean":
                    if (typeof value !== "boolean") {
                        errors[field] = getMessage(`${field} must be boolean`);
                    }
                    break;

                case "in":
                    const options = ruleValue.split(",");
                    if (!options.includes(value)) {
                        errors[field] = getMessage(`${field} must be one of ${options.join(", ")}`);
                    }
                    break;

                case "confirmed":
                    if (value !== data[`${field}_confirmation`]) {
                        errors[field] = getMessage(`${field} confirmation does not match`);
                    }
                    break;

                case "unique":

                    const [table, column] = ruleValue.split(",");
                    const delegate = resolveModelDelegate(table);

                    if (!delegate) {
                        errors[field] = getMessage(`${field} has invalid validation rule configuration`);
                        break;
                    }

                    const exists = await delegate.findFirst({
                        where: { [column]: value }
                    });

                    if (exists) {
                        errors[field] = getMessage(`${field} already exists`);
                    }

                    break;

                case "exists":

                    const [tableName, columnName] = ruleValue.split(",");
                    const delegateForExists = resolveModelDelegate(tableName);

                    if (!delegateForExists) {
                        errors[field] = getMessage(`${field} has invalid validation rule configuration`);
                        break;
                    }

                    const record = await delegateForExists.findFirst({
                        where: { [columnName]: value }
                    });

                    if (!record) {
                        errors[field] = getMessage(`${field} does not exist`);
                    }

                    break;

                case "array":
                    if (!Array.isArray(value)) {
                        errors[field] = getMessage(`${field} must be an array`);
                    }
                    break;

                case "file":
                    if (!files[field]) {
                        errors[field] = getMessage(`${field} file is required`);
                    }
                    break;

                case "mimes":

                    const allowed = ruleValue.split(",");

                    if (files[field]) {
                        const ext = files[field].originalname.split(".").pop();

                        if (!allowed.includes(ext)) {
                            errors[field] = getMessage(`${field} must be ${allowed.join(", ")}`);
                        }
                    }

                    break;

                case "maxFile":

                    if (files[field]) {
                        const sizeKB = files[field].size / 1024;

                        if (sizeKB > Number(ruleValue)) {
                            errors[field] = getMessage(`${field} must be less than ${ruleValue} KB`);
                        }
                    }

                    break;

            }

            // Stop checking further rules if error exists
            if (errors[field]) break;
        }
    }

    return errors;
}