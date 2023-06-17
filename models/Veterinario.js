//Importamos mongoose para poder usar sus métodos
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarToken from "../helpers/generarToken.js";

//Creamos un schema de la base de datos
const veterinarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarToken(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

//Antes de almacenar en la bd;
veterinarioSchema.pre("save", async function (next) {
  //Si el password ya está hasheado no lo vuelve a hashear
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


//Le registramos un metodo al modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
  //Compara si el password del formulario es igual al password del modelo
  return await bcrypt.compare(passwordFormulario, this.password)
}

//Creamos un modelo con el nombre de Veterinario basado en el Schema creado previamente
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
//Exportamos el modelo para poder ser usado
export default Veterinario;
