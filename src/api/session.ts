import * as express from "express";
import { Request, Response } from "express";

import Session from "../models/Session";
import keygen from "../utils/key-gen";
import validateDisplayName from "../utils/validateDisplayName";
import validateJoinGame from "../utils/validateJoinGame";
import shuffle from "../utils/shuffle";

interface Session {
  santas: [{ name: string; giveTo?: string }];
  assigned: boolean;
  save: () => void;
  accessKey: string;
  host: string;
  _id: string;
}

const router = express.Router();

router.get("/test", (req: Request, res: Response) =>
  res.json({ msg: "GET test" })
);

// POST
// Host New Game
router.post("/host", (req: Request, res: Response) => {
  console.log(req.body);
  const { displayName }: { displayName: string } = req.body;
  const { errors, isValid } = validateDisplayName(displayName);
  let response = {
    accessKey: "",
    sessionId: "",
    santas: [displayName],
    thisSanta: displayName,
    host: displayName,
    assigned: false
  };

  if (!isValid) {
    return res.status(400).json(errors);
  }

  keygen().then(newKey => {
    response.accessKey = newKey;
    const newSession = new Session({
      accessKey: newKey,
      host: displayName,
      santas: [{ name: displayName }]
    });

    newSession
      .save()
      .then(session => {
        response.sessionId = session._id;
        res.status(200).json(response);
      })
      .catch(err => res.status(400).json(err));
  });
});

// PUT
// Join Game with Access Key
router.put("/join", (req: Request, res: Response) => {
  const { displayName } = req.body;
  const accessKey = req.body.accessKey.toUpperCase();
  const { errors, isValid } = validateJoinGame(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Session.findOne({ accessKey: accessKey }).exec((err, session: Session) => {
    if (session) {
      const { santas, accessKey, _id: sessionId, assigned, host } = session;
      if (session.assigned) {
        return res.status(400).json({
          displayName: "Wait for host to end current session before joining."
        });
      }
      for (let i = 0; i < session.santas.length; i++) {
        if (
          session.santas[i].name.toLowerCase() === displayName.toLowerCase()
        ) {
          return res
            .status(400)
            .json({ displayName: "That name is already taken" });
        }
      }

      const response = {
        santas: [...santas.map(santa => santa.name), displayName],
        thisSanta: displayName,
        accessKey,
        sessionId,
        assigned,
        host
      };

      session.santas.push({ name: displayName });
      session.save();
      res.status(200).json(response);
    } else {
      return res.status(404).json({ accessKey: "Access key not found" });
    }
  });
});

// GET
// Get the currrent status of a session with session ID and name params
router.get("/status/:sessionId/:displayName", (req: Request, res: Response) => {
  const {
    sessionId,
    displayName
  }: {
    sessionId: string;
    displayName: string;
  } = req.params;

  Session.findOne({ _id: sessionId }).exec((err, session: Session) => {
    if (session) {
      const { santas, accessKey, _id: sessionId, assigned, host } = session;
      const {
        name: thisSanta,
        giveTo
      }: { name: string; giveTo?: string } = santas.find(santa => {
        return santa.name.toLowerCase() === displayName.toLowerCase();
      });
      if (!thisSanta) return res.status(404).json("Santa not found");

      const response = {
        santas: santas.map(santa => santa.name),
        thisSanta,
        giveTo,
        accessKey,
        sessionId,
        assigned,
        host
      };

      return res.json(response);
    } else {
      return err
        ? res.status(400).json(err)
        : res.status(404).json("Session not found");
    }
  });
});

// PUT
// Shuffle gift giving
router.put("/shuffle", (req: Request, res: Response) => {
  const {
    sessionId,
    displayName
  }: {
    sessionId: string;
    displayName: string;
  } = req.body;

  Session.findOne({ _id: sessionId }).exec((err, session: Session) => {
    if (session) {
      const { santas } = session;

      const santaArray = santas.map(santa => santa.name); // Pulls names and puts them in a new array
      const shuffledArray = shuffle(santaArray); // shuffles the array and creates a new array
      santas.forEach((santa, key) => (santa.giveTo = shuffledArray[key])); // Mutates the original santa objects, adding a name in the giveTo field

      session.save();
      console.log(santas);
      return res.json(santas); // Isn't returning anything, will need to call status after
    } else {
      return err
        ? res.status(400).json(err)
        : res.status(404).json("Session not found");
    }
  });
});

export default router;
