import express from "express";
import { signup, login } from "../controllers/auth.js";
import { getAllUsers, updateProfile, follow, unfollow, getUserById, searchUserById } from "../controllers/Users.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/getAllUsers", getAllUsers);
router.get('/getUserById/:id',getUserById)

router.patch("/update/:id", auth, updateProfile);

router.put("/follow/:id", auth, follow);
router.put("/unfollow/:id", auth, unfollow);
router.get('/search', searchUserById);


export default router;