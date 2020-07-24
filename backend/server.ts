import express from "express";
import bodyParser from "body-parser";
import router from "./routes";
import { handleErrors } from "./middleware";
import { NotFound } from "./utils";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);
// Error handling of accessing a non-existing route
app.use((req, res, next) => {
  next(new NotFound("Accessing non-existing route"));
});

app.use(handleErrors);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
