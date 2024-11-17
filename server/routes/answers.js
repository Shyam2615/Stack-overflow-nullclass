import express from "express";
import { deleteAnswer, getBadges, postAnswer, transferPoints } from "../controllers/Answers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.patch("/post/:id", auth, postAnswer);
router.patch("/delete/:id", auth, deleteAnswer);
router.get("/getbadges/:id", getBadges);
router.post("/transfer",auth, transferPoints);

export default router;