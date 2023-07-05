import { createServer } from "./server";
import { log } from "logger";
import { TodoRouter } from "./routers";

const port = process.env.PORT || 3001;
const server = createServer();

server.use("/todo", TodoRouter())

server.listen(port, () => {
  log(`api running on ${port}`);
});
