import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API rodando! Bem-vindo' });
});
app.use('/users', userRoutes);
app.use('/patient', patientRoutes);




app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
