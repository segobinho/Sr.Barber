import express from "express";
import { getUsers, getServiceById, updateService, deleteService } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/se", getUsers);
router.get("/service/:id", getServiceById);
router.put("/service/:id", updateService);
router.delete("/service/:id", deleteService); // Nova rota para excluir um serviço

export default router;
