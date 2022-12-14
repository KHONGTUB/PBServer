const mongoose = require("mongoose");

const userRecordSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  records: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("userRecord", userRecordSchema);
