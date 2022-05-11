const app = require("./routes/index");
const port = process.env.PORT || 4001;
const DatabaseConn = require("./config/dbConfig");
DatabaseConn();
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("working fine ............");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
