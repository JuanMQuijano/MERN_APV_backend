//Importamos el express para crear el router y los callbacks que se llamarán cuando entremos a esas rutas
import express from "express";
import {
  perfil,
  registrar,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddelware.js";

//Creamos el router
const router = express.Router();

//Al ingresar a /api/veterinarios/ se manda a llamar el callback de registrar
router.post("/", registrar);

//Al ingresar a /api/veterinarios/confirmar el /:token hace dinamica la url por lo tanto al ser dinamico se evalua el token en la bd
router.get("/confirmar/:token", confirmar);

//Al enviar el formulario
router.post("/login", autenticar);

//AREA PRIVADA

//Al ingresar a /api/veterinarios/perfil, primero valida que el token coincida, segundo muestra el perfil
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);

//Al ingresar a esta ruta se solicita el envio de un email para reiniciar el password
router.post("/olvide-password", olvidePassword);

//Al ingresar a esta ruta se comprueba el token del usuario y se muestra un formulario para actualizar el password
router.get("/olvide-password/:token", comprobarToken);
//Al enviar el formulario se actualiza el password del usuario
router.post("/olvide-password/:token", nuevoPassword);

router.put("/actualizar-password", checkAuth, actualizarPassword);

//Es lo mismo que lo de arriba, debido a que ambos apuntan a la misma ruta
//router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Exportamos el router para usarlo en el index principal
export default router;
