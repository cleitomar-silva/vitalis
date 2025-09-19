import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctor from "./routes/doctorRoutes.js";
import specialty from "./routes/specialtyRoutes.js";
import medication from "./routes/medicationRoutes.js";
import operator from "./routes/operatorRoutes.js";
import procedure from "./routes/procedureRoutes.js";
import exams from "./routes/examsRoutes.js";

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
app.use('/operator', operator);
app.use('/procedure', procedure);
app.use('/exams', exams);

// TODO crud exames, agenda, atendimento






app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
