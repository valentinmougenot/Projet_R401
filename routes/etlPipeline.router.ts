import {Router} from "express";
const router = Router();
import {loadData} from "../controllers/etlPipeline.controller";

router.post("/load-data", loadData);

export default router;