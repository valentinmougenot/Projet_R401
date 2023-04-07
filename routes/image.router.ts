import {Router} from "express";
const router = Router();

import imageController from "../controllers/image.controller";

router.get("/", imageController.getImages);
router.get("/:id", imageController.getImageById);
router.post("/", imageController.downloadAndResizeImages);

export default router;