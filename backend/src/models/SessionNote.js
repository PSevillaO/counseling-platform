const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
  {
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    isPrivate: {
      type: Boolean,
      default: true, // solo el counselor puede verla
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SessionNote", sessionNoteSchema);
