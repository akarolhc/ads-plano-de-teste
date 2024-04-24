const express = require("express");
const routers = require("./src/routes/pessoa.js");

const app = express();

app.use(express.json());

app.use(routers);

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
