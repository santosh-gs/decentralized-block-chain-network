const express = require("express");
const bodyParser = require("body-parser");
const { Blockchain, Block } = require("./blockchain");

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blockchain = new Blockchain();

app.get("/", (req, res) => {
  res.render("index", { transactionId: null });
});

app.post("/make-transaction", (req, res) => {
  const { sender, recipient, amount } = req.body;
  const transactionId = generateTransactionId();
  const newBlock = new Block(blockchain.chain.length, new Date().toString(), {
    transactionId,
    sender,
    recipient,
    amount,
  });
  blockchain.addBlock(newBlock);
  console.log(newBlock);
  res.render("index", { transactionId });
});

app.get("/verify-transaction/", (req, res) => {
  res.render("verify", { isValid: null });
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/verify-transaction", (req, res) => {
  const { transactionId } = req.body;
  const block = blockchain.chain.find(
    (block) => block.data.transactionId === transactionId
  );
  const isValid = block !== undefined;
  res.render("verify", { transactionId, isValid });
});

function generateTransactionId() {
  return Math.random().toString(36).substring(2, 10);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
