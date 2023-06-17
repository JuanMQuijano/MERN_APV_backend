//Imports necesarios
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/bd.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

//Es una forma de proteger la API
import cors from "cors";

//Configuramos las variables de entorno
dotenv.config();

//Definimos un puerto, si no lo encuentra en las variables de entorno por defecto será 4000
const PORT = process.env.PORT || 4000;

//Creamos una instancia de express
const app = new express();

//Conectamos la BD
conectarDB();

const dominiosPermitidos = ["https://mern-apv-frontend-sand.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      //El origen del request está permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors({ origin: "*" }));

//Permitir el envío de datos
app.use(express.json());

//Definimos un routing para las rutas que empiecen con /api/veterinarios
app.use("/api/veterinarios", veterinarioRoutes);
//Definimos un routing para las rutas que empiecen con /api/pacientes
app.use("/api/pacientes", pacienteRoutes);

//Establecemos el puerto de escucha
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://:${PORT}`);
});
