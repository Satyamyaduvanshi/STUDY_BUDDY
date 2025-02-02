import express  from "express";
import dotenv from "dotenv";
import routes from "./routes/index";

dotenv.config();
const app = express();

app.use(express.json());

app.use(routes)





app.listen(3000);
