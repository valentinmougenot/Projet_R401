import {Router} from "express";
const router = Router();

import {scrap} from "../controllers/scrapper.controller";

router.post("/scrap-data", scrap);

export default router;