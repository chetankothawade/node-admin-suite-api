export default {
  register: {
    name: "required|min:2|max:100",
    email: "required|email",
    password: "required|min:6",
    role: "required|in:user,admin,super_admin",
  },
  login: {
    email: "required|email",
    password: "required",
  },
  forgot_password: {
    email: "required|email",
  },
  reset_password: {
    token: "required",
    password: "required|min:6",
  },
  send_email_verification: {
    email: "required|email",
  },
  verify_email: {
    token: "required",
  },
};
