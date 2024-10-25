    import express from "express";
    import multer from "multer";
    import { getUsers, getServiceById, updateService, deleteService, addService, getBarbearias } from "../controllers/user.js";
    import { testesla } from "../controllers/testando.js";
    import {getFuncionarios, addFuncionario,  editFuncionario, removeFuncionario, getBarbeiros, getFuncionarioById, uploadImage } from "../controllers/funcionarios.js"
    import { getClientes, addClientes, editCliente, removeCliente } from "../controllers/clientes.js";
    import { getProducts, addProduct, editProduct, deleteProduct } from '../controllers/productController.js';
    import { addAgendamentos, atualizarAgendamento, getAgendamentos, moverAgendamento, removeAgendamento } from "../controllers/agendamentos.js";
    import { Grafico, quantservicos, receita, metodos, barbersdata, quantprodutos} from "../controllers/graficos.js";
    import { storage } from "../multerconfig.js";
import { getCarrinhos } from "../controllers/compras.js";
    const upload = multer({ storage: storage });



    const router = express.Router();

    router.get("/", getUsers);
    router.get("/se", getUsers);
    router.get("/service/:id", getServiceById);
    router.put("/service/:id", updateService);
    router.delete("/service/:id_servico", deleteService);
    router.post("/service", addService);
    router.post("/login", testesla);
    router.get("/barbearias", getBarbearias);
    router.get("/clientes", getClientes);
    router.post("/add", addClientes)
    router.put("/clientes/:id_cliente", editCliente);
    router.delete("/clientes/:id_cliente", removeCliente);

    router.get("/funcionarios", getFuncionarios);
    router.get("/funcionariosByID/:id_funcionario", getFuncionarioById);

    router.post("/funcionarios", addFuncionario);
    router.put("/funcionarios/:id_funcionario", upload.single("file"), editFuncionario);
    router.delete("/funcionarios/:id_funcionario",  removeFuncionario);
    router.post("/upload", upload.single("file"), uploadImage);


    router.get("/barbeiros", getBarbeiros)

    router.get('/products', getProducts);
    router.post('/products', addProduct);
    router.put('/products/:id', editProduct);
    router.delete('/products/:id', deleteProduct);


    router.post('/agendamentos', addAgendamentos);
    router.get('/agendamentos', getAgendamentos);
    router.put('/mover/:id', moverAgendamento)
    router.delete('/agendamentos/:id', removeAgendamento)
    router.put('/agendamentos/:id', atualizarAgendamento)

    router.get("/teste123", Grafico)
    router.get("/quantservicos", quantservicos)
    router.get("/quantprodutos", quantprodutos)
    router.get("/receita", receita)
    router.get("/metodos", metodos)
    router.get("/bdata", barbersdata)





    router.get("/carrinhos", getCarrinhos)









    export default router;
