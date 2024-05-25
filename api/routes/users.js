import express from "express";
import { getUsers, getServiceById, updateService, deleteService, addService } from "../controllers/user.js";


const router = express.Router();

router.get("/", getUsers);
router.get("/se", getUsers);
router.get("/service/:id", getServiceById);
router.put("/service/:id", updateService);
router.delete("/service/:id", deleteService); 
router.post("/service", addService);

export default router;
