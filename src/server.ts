import { App } from "./app";
import * as path from "path";

let app = new App().getApp();

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "index.html"));
});

export { app };
