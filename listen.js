const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});
