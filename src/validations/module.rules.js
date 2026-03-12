export default {

  create: {
    name: "required|min:2",
    seq_no: "required|numeric",
    is_permission: "required|in:Y,N"
  },

  update: {
    name: "required|min:2",
    seq_no: "required|numeric"
  }

};