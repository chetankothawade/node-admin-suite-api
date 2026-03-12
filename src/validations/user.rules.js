export default {
    create: {
        name: "required|min:2|max:50",
        email: {
            rules: "required|email|unique:users,email",
            message: {
                required: "Email cannot be empty",
                email: "Please enter a valid email address",
                unique: "Email already registered"
            }
        },
        phone: "required|min:8",
        role: "required|in:admin,user",
        password: "required|min:6"
    },
    update: {
        name: "required|min:2|max:50",
        email: "required|email",
        phone: "required|min:8",
        role: "required|in:admin,user"
    },
    delete: {
        uuid: "required"
    },
    status: {
        status: "required|in:active,inactive,suspended"
    }
};
