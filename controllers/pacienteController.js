//Importamos el modelo de Paciente para poder registrar y hacer otras acciones
import Paciente from "../models/Paciente.js";

//Como antes de llamar esta función, debemos validar el login y almacenar el id en el req, podemos hacer uso de req.veterinario
const obtenerPacientes = async (req, res) => {
  //Buscamos en la base de datos todos los registros que coincidan con el veterinario X
  const pacientes = await Paciente.find()
    .where("veterinario")
    .equals(req.veterinario);

  //Retornamos los pacientes para mostrarlos en el frontend
  res.json(pacientes);
};

//Como antes de llamar esta función, debemos validar el login y almacenar el id en el req, podemos hacer uso de req.veterinario
const agregarPacientes = async (req, res) => {
  //Creamos un paciente con la información enviada en el form
  const paciente = new Paciente(req.body);
  //Relacionamos el paciente nuevo con el id del veterinario
  paciente.veterinario = req.veterinario._id;

  try {
    //Almacenamos y retornamos una respuesta
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

//Como antes de llamar esta función, debemos validar el login y almacenar el id en el req, podemos hacer uso de req.veterinario
const obtenerPaciente = async (req, res) => {
  //Extraemos el id de la url
  const { id } = req.params;

  //Buscamos el paciente que tenga el id X
  const paciente = await Paciente.findById(id);

  //Si no encontramos al paciente
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }

  //Si el veterinario del paciente NO coincide con el veterinario logeado
  if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Acción no válida" });
  }

  //Retornamos la respuesta
  res.json(paciente);
};

//Como antes de llamar esta función, debemos validar el login y almacenar el id en el req, podemos hacer uso de req.veterinario
const actualizarPaciente = async (req, res) => {
  //Extraemos el id de la url
  const { id } = req.params;

  //Buscamos el paciente que tenga el id X
  const paciente = await Paciente.findById(id);

  //Si no encontramos al paciente
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }

  //Si el veterinario del paciente NO coincide con el veterinario logeado
  if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Acción no válida" });
  }

  //Actualizar Paciente

  //Establecemos lo enviado por el usuario en el form, si no envio nada dejamos la información actual
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fecha = req.body.fecha || paciente.fecha;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;

  try {
    //Guardamos el paciente y retornamos la respuesta
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarPaciente = async (req, res) => {
  //Extraemos el id de la url
  const { id } = req.params;

  //Buscamos el paciente que tenga el id X
  const paciente = await Paciente.findById(id);

  //Si no encontramos al paciente
  if (!paciente) {
    return res.status(404).json({ msg: "No encontrado" });
  }

  //Si el veterinario del paciente NO coincide con el veterinario logeado
  if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Acción no válida" });
  }

  try {
    //Eliminamos el paciente y retornamos la respuesta
    await paciente.deleteOne();
    res.json({ msg: "Paciente Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

//Exportamos las funciones para usarlas en el router
export {
  obtenerPacientes,
  agregarPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
