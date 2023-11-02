import express from "express";
import fillForm from "../controller/formController.js";

const router = express.Router();

router.post("/fillform", fillForm);

export default router;
