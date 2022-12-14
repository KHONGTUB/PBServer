const record = require("../models/userRecord");
const upload = require("../PicUpload");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const singleUpload = upload.single("image");

async function getUserRecord(req, res) {
  const id = req.params.id;
  try {
    const records = await record.findOne({ user_id: id });
    res.json(records.records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addSpecies(req, res) {
  const { userid, species } = req.body;
  try {
    record.findOneAndUpdate(
      { user_id: userid },
      {
        $push: { records: { speciesName: species, catches: [] } },
      },
      { new: true },
      function (err, docs) {
        if (err) {
          res.json(err);
        } else {
          res.json(docs);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addPicture(req, res) {
  const postid = req.params.postid;
  const userid = req.params.id;
  const species = req.params.species;

  singleUpload(req, res, async function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    record.findOneAndUpdate(
      {
        user_id: { $eq: userid },
      },
      {
        $set: {
          "records.$[record].catches.$[catch].picture": req.file.location,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "record.speciesName": species },
          { "catch.post_id": postid },
        ],
      },
      function (err, docs) {
        if (err) {
          res.json(err);
        } else {
          res.json(docs);
        }
      }
    );
  });
}

async function addCatch(req, res) {
  const { userid, species, length, weight, date } = req.body;
  let postdate;
  date === undefined ? (postdate = Date.now()) : (postdate = date);
  record.findOneAndUpdate(
    {
      $and: [
        {
          user_id: { $eq: userid },
        },
        {
          records: { $elemMatch: { speciesName: species } },
        },
      ],
    },
    {
      $push: {
        "records.$.catches": {
          post_id: new ObjectId().toString(),
          length,
          weight,
          postdate,
          picture:
            "https://img.freepik.com/free-vector/fish-doodle-simple-style-white-background_1308-87508.jpg?w=2000",
        },
      },
    },
    { new: true },
    function (err, docs) {
      if (err) {
        res.json(err);
      } else {
        res.json(docs);
      }
    }
  );
}

module.exports = { getUserRecord, addSpecies, addPicture, addCatch };
