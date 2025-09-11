import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctor from "./routes/doctorRoutes.js";
import specialty from "./routes/specialtyRoutes.js";
import medication from "./routes/medicationRoutes.js";

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
app.use('/doctor', doctor);
app.use('/specialty', specialty);
app.use('/medication', medication);

// TODO crud procedimento, agenda, atendimento



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
