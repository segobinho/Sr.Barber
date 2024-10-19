// server.js

import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import multer from "multer";
import { storage } from "./multerconfig.js";


const app = express();
const upload = multer({ storage: storage });


app.use(express.json());
app.use(cors());
app.use("/", userRoutes); 
app.use('/fotos', express.static('images'));


app.listen(8800);

app.post("/upload1", upload.single("file"), (req, res) => {
    return res.json(req.file.filename);
  });
