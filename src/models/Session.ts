import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  createdAt: {
    type: Date,
    expires: 28800,
    default: Date.now
  },
  accessKey: {
    type: Schema.Types.String,
    required: true
  },
  santas: [
    {
      name: {
        type: String
      },
      giveTo: {
        type: String
      }
    }
  ],
  host: {
    type: String,
    required: true
  },
  assigned: {
    type: Boolean,
    default: false
  }
});

const Session = mongoose.model("sessions", SessionSchema);
export default Session;
