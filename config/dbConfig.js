const mongooes = require("mongoose");

const DatabaseConn = () => {
  mongooes
    .connect(process.env.MONOGODBLOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => console.log("DB connected !"))
    .catch((error) => console.log("error", error));
};
module.exports = DatabaseConn;
