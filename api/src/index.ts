import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import patientRoutes from "./routes/patientRoutes";
import doctor from "./routes/doctorRoutes";
import specialty from "./routes/specialtyRoutes";
import medication from "./routes/medicationRoutes";
import operator from "./routes/operatorRoutes";
import procedure from "./routes/procedureRoutes";
import exams from "./routes/examsRoutes";
import hour from "./routes/hourRoutes";

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
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
app.use('/hour', hour);




app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
