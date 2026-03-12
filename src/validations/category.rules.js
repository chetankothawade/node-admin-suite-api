export default {
  create: {
    name: "required|min:2|max:255",
    parent_id: "numeric",
  },
  update: {
    uuid: "required",
    name: "required|min:2|max:255",
    parent_id: "numeric",
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
