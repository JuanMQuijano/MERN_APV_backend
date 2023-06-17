//Mongoose para crear la conexión a la base de datos
import mongoose from "mongoose";

//Creamos una función para conectar a la bd
const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const URL = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB Conectado en ${URL}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;
