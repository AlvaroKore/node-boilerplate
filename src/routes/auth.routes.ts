import { Router } from "express";
import { findAll, profile, signin, signup, update } from "../controllers/auth.controller";
import { tokenValidation } from "../lib/verifyToken";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", tokenValidation, profile);
router.get("/users", tokenValidation, findAll);
router.put("/users/:id", tokenValidation, update);

export default router;
