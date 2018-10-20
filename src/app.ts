import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import { createServer, Server } from "http";
import * as socketIo from "socket.io";

import session from "./api/session";

const db = require("./config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

export class App {
  public static readonly PORT: number = 5000;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.routes();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || 5000;

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static("client"));
  }

  private sockets(): void {
    this.io = socketIo(this.server);
    this.io.use((socket, next) => {
      let clientId = socket.handshake.headers["x-clientid"];
      return next();
    });
  }

  private routes(): void {
    this.app.use("/api/session", session);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Running on port ${this.port}`);
    });

    this.io.on("connect", (socket: any) => {
      let room = socket.handshake["query"]["r_var"];

      socket.join(room);

      socket.on("user", (user: string) => {
        this.io.to(room).emit("user", user);
      });

      socket.on("message", (message: string) => {
        this.io.to(room).emit("message", message);
      });

      // socket.on("disconnect", () => {
      //   console.log("Client Disconnected");
      // });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
