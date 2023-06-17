//Importamos moongose para hacer crear el Schema y el modelo
import mongoose from "mongoose";

//Creamos el schema de la bd con los siguiente valores
const pacientesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    propietario: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      //Por default la fecha será los milisegundos actuales
      default: Date.now(),
    },
    sintomas: {
      type: String,
      required: true,
    },
    veterinario: {
      //Así es como relacionamos en mongo. Especificamos que será de tipo objectId y la referencia que usará
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinario",
    },
  },
  //Agregamos los timestamps para saber cuando fue creado y actualizado
  { timestamps: true }
);

//Creamos el modelo basado en el schema
const Paciente = mongoose.model("Paciente", pacientesSchema);
export default Paciente;
