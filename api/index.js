// server.js

import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", userRoutes); // Usando o roteador definido em users.js para todas as rotas

app.listen(8800);
