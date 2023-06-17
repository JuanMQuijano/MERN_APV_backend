//Importamos el jwt
import jwt from "jsonwebtoken";

//Creamos una función donde recibiremos el parametro que vamos a almacenar en el token
const generarJWT = (id) => {
  //Retornamos el token, donde almacenamos el id, le pasamos una palabra secreta, e indicamos que expira en 30 días
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  ); //Crea un nuevo JWT
};

export default generarJWT;
