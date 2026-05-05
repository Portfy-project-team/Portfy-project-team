import "dotenv/config";




import app from './index.js';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Portfy API demarree sur le port ${PORT}`);
  console.log(`Environnement : ${process.env.NODE_ENV}`);
  // console.log("ACCESS:", process.env.JWT_SECRET);
})

// const PORT = process.env.PORT || 3000

// app.listen(PORT, () => {
//   console.log(`Portfy API démarrée sur le port ${PORT}`)
// })