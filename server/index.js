import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answers.js";
import postRoutes from "./routes/post.js";
// import publicSpaceRouter from "./routes/public-space.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
    res.send("This is stack overflow clone api");
});

// Routes
app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use("/posts", postRoutes);
// app.use('/public-space', publicSpaceRouter);

// Database and server setup
const port = process.env.PORT || 5000;
const DATABASE_URL = process.env.CONNECTION_URL;

mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => { console.log(`Server is running at port ${port}`); }))
    .catch((err) => { console.log(err.message); });
