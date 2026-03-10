// routes/access.js
import express from "express";
//import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getUserModuleAccess} from '../utils/permission.js';

const router = express.Router();

// GET /api/access/:user_id
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const access = await getUserModuleAccess(user_id);
    return res.json({ success: true, access });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;


// import express from "express";
// import { getUserModuleAccess } from "../utils/permission.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";

// const router = express.Router();

// router
//   .route("/get/:id")
//   .get(isAuthenticated, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const access = await getUserModuleAccess(id);
//       return res.json({ success: true, access });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   });

// export default router;


