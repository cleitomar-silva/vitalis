import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API rodando! Bem-vindo à e-flow.' });
});
app.use('/users', userRoutes);




app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
