import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let data = [];
let nextID = 1;

//post is used when we want to save the data in the database, can use get as well

//adding a new data
app.post("/data", (req, res) => {
  const { name, price } = req.body;
  const newItem = { id: nextID++, name, price };
  data.push(newItem);
  res.status(201).send(newItem);
});

//get all data
app.get("/data", (req, res) => {
  res.status(201).send(data);
});

//update
app.put("/data/:id", (req, res) => {
  const d = data.find((t) => t.id === parseInt(req.params.id));
  if (!d) {
    return res.status(404).send("data not found");
  } else {
    const { name, price } = req.body;
    d.name = name;
    d.price = price;
    res.send(200).send(d);
  }
});

//delete data
app.delete("/data/:id", (req, res) => {
  const index = data.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("data not found");
  } else {
    data.splice(index, 1);
    return res.status(200).send("delete successful");
  }
});

//retreiving data
app.get("/data/:id", (req, res) => {
  const d = data.find((t) => t.id === parseInt(req.params.id));
  if (!d) {
    return res.status(404).send("data not found");
  } else {
    return res.status(202).send(d);
  }
});

//extras
app.get("/", (req, res) => {
  res.send("Hello there");
});

app.get("/login", (req, res) => {
  res.send("login checking");
});

app.get("/check", (req, res) => {
  res.send("checking the check route");
});

app.listen(port, () => {
  console.log(`Server is listening at port : ${port} ... `);
});
