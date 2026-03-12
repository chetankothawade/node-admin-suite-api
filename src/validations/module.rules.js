export default {
  create: {
    name: "required|min:2|max:50",
    seq_no: "required|numeric",
    is_permission: "required|in:Y,N",
    is_sub_module: "required|in:Y,N",
  },
  update: {
    uuid: "required",
    name: "required|min:2|max:50",
    seq_no: "required|numeric",
    is_permission: "required|in:Y,N",
    is_sub_module: "required|in:Y,N",
  },
  delete: {
    uuid: "required",
  },
  get: {
    uuid: "required",
  },
  status: {
    uuid: "required",
    status: "required|in:active,inactive",
  },
};
