import { Router } from "express";
import termoController from "../controllers/termoController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(termoController.create));
router.get("/", asyncHandler(termoController.getAll));
router.get("/:curday", asyncHandler(termoController.getByCurday));
router.put('/', asyncHandler(termoController.update));
router.get('/:curday/exists', asyncHandler(termoController.verifyCurdayExistance));
router.delete('/:curday', asyncHandler(termoController.delete));

export default router;