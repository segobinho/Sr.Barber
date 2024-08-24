import express from "express";
import { getUsers, getServiceById, updateService, deleteService, addService, getBarbearias } from "../controllers/user.js";
import { testesla } from "../controllers/testando.js";
import {getFuncionarios} from "../controllers/funcionarios.js"
import { getClientes, addClientes } from "../controllers/clientes.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/se", getUsers);
router.get("/service/:id", getServiceById);
router.put("/service/:id", updateService);
router.delete("/service/:id_servico", deleteService);
router.post("/service", addService);
router.post("/login", testesla);
router.get("/barbearias", getBarbearias);
router.get("/funcionarios", getFuncionarios);
router.get("/clientes", getClientes);
router.post("/add", addClientes)



export default router;
