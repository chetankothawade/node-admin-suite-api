import prisma from "../lib/prisma.js";

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const modelDelegateCache = new Map();

function resolveModelDelegate(tableName) {
    if (!tableName) return null;

    const normalized = String(tableName).trim();
    if (modelDelegateCache.has(normalized)) {
        return modelDelegateCache.get(normalized);
    }

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
            modelDelegateCache.set(normalized, delegate);
            return delegate;
        }
    }

    modelDelegateCache.set(normalized, null);
    return null;
}

function normalizeRuleDefinition(ruleDefinition) {
    if (typeof ruleDefinition === "object" && ruleDefinition !== null) {
        return {
            ruleString: String(ruleDefinition.rules || ""),
            customMessages: ruleDefinition.message || {}
        };
    }

    return {
        ruleString: String(ruleDefinition || ""),
        customMessages: {}
    };
}

function buildFieldHelpers(field, customMessages) {
    const makeError = (key, params = {}) => ({
        key,
        params: {
            field,
            ...params
        }
    });

    const getMessage = (ruleName, defaultMessage) => {
        const customMessage = customMessages?.[ruleName];
        if (!customMessage) {
            return defaultMessage;
        }

        if (typeof customMessage === "string") {
            return {
                key: customMessage,
                params: defaultMessage?.params || { field }
            };
        }

        if (typeof customMessage === "object" && customMessage.key) {
            return {
                key: customMessage.key,
                params: {
                    ...(defaultMessage?.params || { field }),
                    ...(customMessage.params || {})
                }
            };
        }

        return customMessage;
    };

    return { makeError, getMessage };
}

async function validateRule({ ruleName, ruleValue, value, field, data, files, helpers }) {
    const { makeError, getMessage } = helpers;

    switch (ruleName) {
        case "required":
            if (value === undefined || value === null || value === "") {
                return getMessage(ruleName, makeError("validation.required"));
            }
            return null;

        case "email":
            if (value && !EMAIL_REGEX.test(value)) {
                return getMessage(ruleName, makeError("validation.email"));
            }
            return null;

        case "min": {
            const min = Number(ruleValue);
            if (value && value.length < min) {
                return getMessage(ruleName, makeError("validation.min", { min }));
            }
            return null;
        }

        case "max": {
            const max = Number(ruleValue);
            if (value && value.length > max) {
                return getMessage(ruleName, makeError("validation.max", { max }));
            }
            return null;
        }

        case "numeric":
            if (value && Number.isNaN(Number(value))) {
                return getMessage(ruleName, makeError("validation.numeric"));
            }
            return null;

        case "boolean":
            if (typeof value !== "boolean") {
                return getMessage(ruleName, makeError("validation.boolean"));
            }
            return null;

        case "in": {
            const options = String(ruleValue || "").split(",");
            if (!options.includes(value)) {
                return getMessage(ruleName, makeError("validation.in"));
            }
            return null;
        }

        case "confirmed":
            if (value !== data[`${field}_confirmation`]) {
                return getMessage(ruleName, makeError("validation.confirmed"));
            }
            return null;

        case "unique": {
            const [table, column] = String(ruleValue || "").split(",");
            const delegate = resolveModelDelegate(table);

            if (!delegate || !column) {
                return getMessage(ruleName, makeError("validation.invalid"));
            }

            const exists = await delegate.findFirst({
                where: { [column]: value }
            });

            if (exists) {
                return getMessage(ruleName, makeError("validation.unique"));
            }
            return null;
        }

        case "exists": {
            const [tableName, columnName] = String(ruleValue || "").split(",");
            const delegateForExists = resolveModelDelegate(tableName);

            if (!delegateForExists || !columnName) {
                return getMessage(ruleName, makeError("validation.invalid"));
            }

            const record = await delegateForExists.findFirst({
                where: { [columnName]: value }
            });

            if (!record) {
                return getMessage(ruleName, makeError("validation.exists"));
            }
            return null;
        }

        case "array":
            if (!Array.isArray(value)) {
                return getMessage(ruleName, makeError("validation.array"));
            }
            return null;

        case "file":
            if (!files[field]) {
                return getMessage(ruleName, makeError("validation.file"));
            }
            return null;

        case "mimes": {
            const allowed = String(ruleValue || "").split(",");
            const file = files[field];
            if (file) {
                const ext = String(file.originalname || "").split(".").pop();
                if (!allowed.includes(ext)) {
                    return getMessage(ruleName, makeError("validation.mimes"));
                }
            }
            return null;
        }

        case "maxFile": {
            const file = files[field];
            if (file) {
                const maxKb = Number(ruleValue);
                const sizeKB = file.size / 1024;

                if (sizeKB > maxKb) {
                    return getMessage(ruleName, makeError("validation.maxFile"));
                }
            }
            return null;
        }

        default:
            return null;
    }
}

export async function validateRules(rules, data, files = {}) {
    const errors = {};

    for (const [field, ruleDefinition] of Object.entries(rules || {})) {
        const { ruleString, customMessages } = normalizeRuleDefinition(ruleDefinition);
        const helpers = buildFieldHelpers(field, customMessages);
        const value = data[field];
        const ruleList = ruleString.split("|").filter(Boolean);

        for (const rule of ruleList) {
            const [ruleName, ruleValue] = rule.split(":");
            const error = await validateRule({
                ruleName,
                ruleValue,
                value,
                field,
                data,
                files,
                helpers
            });

            if (error) {
                errors[field] = error;
                break;
            }
        }
    }

    return errors;
}
