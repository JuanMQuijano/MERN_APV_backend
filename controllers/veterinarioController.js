//Controladores del routing

import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  //Extraemos la información del req para enviar el email
  const { nombre, email } = req.body;

  //Prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({ email });

  //Validamos si el usuario ya se encuentra registrado
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    //Guardar nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar Email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    //Retornamos como respuesta el veterinario
    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const confirmar = async (req, res) => {
  //Al ser un parametro de url usamos el req.params
  const { token } = req.params;

  //Buscamos en la base de datos un registro que tenga el token
  const usuarioConfirmar = await Veterinario.findOne({ token });

  //Si no lo encuentra retorna que el token no es válido
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //Reinicia el token y cambia el confirmado a true
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;

    //Guarda la nueva información
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  //Extrae la información enviada en el formulario
  const { email, password } = req.body;

  try {
    //Busca en la bd un usario que tenga el email X
    const usuario = await Veterinario.findOne({ email });

    //Comprobar si el usuario existe
    if (!usuario) {
      const error = new Error("El usuario no se encuentra registrado");
      return res.status(403).json({ msg: error.message });
    }

    //Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
      const error = new Error("Tu cuenta no ha sido confirmada");
      return res.status(403).json({ msg: error.message });
    }

    //Revisar que el password enviado en el form coincida con el hash de la DB
    if (await usuario.comprobarPassword(password)) {
      //Autenticar al usuario

      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        //Genero un nuevo JWT donde voy a almacenar el id del usuario
        token: generarJWT(usuario.id),
      });
    } else {
      const error = new Error("El Password es incorrecto");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  //Despues de validar que el usuario está autenticado, se crea el atributo veterinario en el req. Y lo extraemos
  const { veterinario } = req;

  res.json(veterinario);
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;

  //Si el usuario está cambiando el email validamos que el email no exista ya
  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email });

    if (existeEmail) {
      const error = new Error("El email ya se encuentra en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  //Extrae la información del Request
  const { email } = req.body;

  //Busca el veterinario con el email X
  const existeVeterinario = await Veterinario.findOne({ email });

  //Si el veterinario no existe retonar este error
  if (!existeVeterinario) {
    const error = new Error("El Usuario no se encuentra Registrado");
    res.status(400).json({ msg: error.message });
  }

  //Si existe, genera un token y guarda la nueva información
  try {
    existeVeterinario.token = generarToken();
    await existeVeterinario.save();

    //Enviar Email
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  //Extra el token de la url
  const { token } = req.params;

  //Busca el usuario con el token X
  const tokenValido = await Veterinario.findOne({ token });

  //Valida si encontró o no el token
  if (!tokenValido) {
    const error = new Error("El Token no es válido o ya caducó");
    return res.status(400).json({ msg: error.message });
  }

  //Si encontró el token retornamos el mensaje
  res.json({ msg: "Token Válido el usuario existe" });
};

const nuevoPassword = async (req, res) => {
  //Extraemos el token de la url y el password de lo enviado por el form
  const { token } = req.params;
  const { password } = req.body;

  //Buscamos el usuario que tenga el token X
  const veterinario = await Veterinario.findOne({ token });

  //Validamos si existe o no
  if (!veterinario) {
    const error = new Error("El Token no es válido o ya caducó");
    return res.status(400).json({ msg: error.message });
  }

  //Reiniciamos el token y seteamos el nuevo password
  try {
    veterinario.token = null;
    veterinario.password = password;

    await veterinario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  //Leer datos
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;

  //Comprobar veterinario
  const veterinario = await Veterinario.findById(id);

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  //Comprobar Password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    //Almacenar el password
    veterinario.password = pwd_nuevo;
    await veterinario.save();

    res.json({ msg: "Password Actualizado" });
  } else {
    const error = new Error("El Password Actual no coincide");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  actualizarPerfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPassword,
};
