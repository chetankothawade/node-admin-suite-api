"use strict";

import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const SALT_ROUNDS = 10;

export async function up(queryInterface, Sequelize) {
    const hashedPasswordAdmin = await bcrypt.hash("Admin@123", SALT_ROUNDS);
    const hashedPasswordUser = await bcrypt.hash("User@123", SALT_ROUNDS);

    const users = [
        // {
        //     name: "Super Admin",
        //     email: "admin@yopmail.com",
        //     password: hashedPasswordAdmin,
        //     phone: "+911234567890",
        //     avatar: null,
        //     role: "admin",
        //     status: "active",
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        // },
        // {
        //     name: "John Doe",
        //     email: "JohnDoe@yopmail.com",
        //     password: hashedPasswordUser,
        //     phone: "+911111111111",
        //     avatar: null,
        //     role: "user",
        //     status: "active",
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        // },
    ];

    // Add 50 random fake users
    for (let i = 0; i < 10; i++) {
        const hashedPassword = await bcrypt.hash("Password@123", SALT_ROUNDS);
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            phone: faker.phone.number("+91##########"),
            avatar: faker.image.avatar(),
            role: "user",
            status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    return queryInterface.bulkInsert("users", users);
}

export async function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
}
