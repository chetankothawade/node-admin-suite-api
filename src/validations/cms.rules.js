export default {
  create: {
    title: "required|min:2|max:100",
    content: "required|min:2",
  },
  update: {
    uuid: "required",
    title: "required|min:2|max:100",
    content: "required|min:2",
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
