const generarToken = () => {
  //Retorna una combinación de caracteres random
  return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export default generarToken;
