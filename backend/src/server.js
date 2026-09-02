require("dotenv").config();

// Prisma returns BigInt for every surrogate id in this schema; patch it so
// res.json() can serialize responses instead of throwing.
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = require("./app");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`travel-app backend listening on port ${port}`);
});
