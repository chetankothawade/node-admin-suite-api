import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import logger from "./logger.js";

class EmailService {
    constructor() {
        // Initialize transporter once
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // Layout defaults (always available in templates)
        this.layoutVars = {
            siteName: process.env.APP_NAME || "MySite",
            base_url: process.env.CLIENT_ORIGIN || "",
            year: new Date().getFullYear(),
            logoSrc: "cid:app-logo",
        };

        // Template cache
        this.templateCache = new Map();
    }

    /**
     * Preload templates into cache
     */
    async preloadTemplates(templatesDir) {
        const files = await fs.readdir(templatesDir);
        for (const file of files) {
            if (file.endsWith(".html")) {
                const file_path = path.join(templatesDir, file);
                const source = await fs.readFile(file_path, "utf8");
                const template = handlebars.compile(source);
                const templateKey = path.parse(file).name;
                this.templateCache.set(templateKey, template);
            }
        }
        logger.info({ count: this.templateCache.size }, "Preloaded email templates");
    }

    /**
     * Send an email
     */
    async send(templateName, options = {}) {
        const { to, subject, cc, bcc, attachments, templateVars = {} } = options;

        if (!to) throw new Error("Recipient email (to) is required");
        if (!subject) throw new Error("Email subject is required");

        // Get body template
        const bodyTemplate = this.templateCache.get(templateName);
        if (!bodyTemplate) throw new Error(`Template "${templateName}" not found`);

        const bodyHtml = bodyTemplate(templateVars);

        // Get layout template
        const layoutTemplate = this.templateCache.get("layout");
        if (!layoutTemplate) throw new Error(`Layout template "layout" not found`);

        const logoPath = path.join(process.cwd(), "emails", "templates", "logo.png");
        let logoAttachment = null;
        try {
            await fs.access(logoPath);
            logoAttachment = {
                filename: "logo.png",
                path: logoPath,
                cid: "app-logo",
            };
        } catch {
            // If logo file is missing, fallback to external URL from templateVars/env.
        }

        const mergedAttachments = [...(attachments || [])];
        if (logoAttachment && !mergedAttachments.some((item) => item?.cid === "app-logo")) {
            mergedAttachments.push(logoAttachment);
        }

        // Merge layout vars + templateVars
        const html = layoutTemplate({
            ...this.layoutVars,   // siteName, siteLogo, base_url
            ...templateVars,      // name, reset_url
            ...(logoAttachment ? { logoSrc: "cid:app-logo" } : {}),
            body: bodyHtml,
        });

        // Handle dynamic subject (function or string)
        const emailSubject =
            typeof subject === "function" ? subject(templateVars) : subject;

        const from = `"${process.env.MAIL_FROM_NAME || "No Reply"}" <${process.env.MAIL_FROM_EMAIL || "no-reply@example.com"}>`;

        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                cc,
                bcc,
                subject: emailSubject,
                html,
                attachments: mergedAttachments,
            });

            logger.info({ to, messageId: info.message_id || "" }, "Email sent");
            return info;
        } catch (err) {
            logger.error({ err, to }, "Email sending failed");
            throw new Error(err.message || "Failed to send email");
        }
    }

}

// Singleton instance
export const emailService = new EmailService();

// Preload templates at server startup
const templatesDir = path.join(process.cwd(), "emails", "templates");
emailService.preloadTemplates(templatesDir).catch((err) => {
    logger.error({ err }, "Failed to preload email templates");
});


