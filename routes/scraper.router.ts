import {Router} from "express";
const router = Router();

import {scrap} from "../controllers/scraper.controller";

router.post("/scrap-data", scrap);

export default router;