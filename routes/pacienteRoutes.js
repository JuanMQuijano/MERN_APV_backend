//Importamos express para crear el router, y cada una de las funciones que se usarán dependiendo de la ruta
import express from "express";
import {
  actualizarPaciente,
  agregarPacientes,
  eliminarPaciente,
  obtenerPaciente,
  obtenerPacientes,
} from "../controllers/pacienteController.js";
//Tambien exportamos el middleware para validar la autentificación
import checkAuth from "../middleware/authMiddelware.js";

//Creamos el router
const router = express.Router();

//Para poder agregar u obtener sus pacientes debe haber iniciado sesión, así protegemos los endpoints
router.get("/", checkAuth, obtenerPacientes);
router.post("/", checkAuth, agregarPacientes);

//Creamos una ruta dinamica es decir /api/pacientes/X
router
  .route("/:id")
  //Valida si está autenticado y después va a los metodos establecidos
  .get(checkAuth, obtenerPaciente)
  .put(checkAuth, actualizarPaciente)
  .delete(checkAuth, eliminarPaciente);

export default router;
