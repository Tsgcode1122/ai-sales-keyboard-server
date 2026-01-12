import express from "express";
import { rewriteText } from "../controllers/rewriteController.js";

const router = express.Router();

router.post("/rewrite", rewriteText);

export default router;
