var Artist = require('../models/artists');

exports.all = function (req, res) {
  Artist.all(function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};

exports.findById = function (req, res) {
  Artist.findById(req.params.id, function (err, doc) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }   
    res.send(doc);
  })
};

exports.create = function (req, res) {
    var artist = {
        name: req.body.name,
        description: req.body.description,
        photo: req.body.photo,
        avatar: req.body.avatar,
    };
    Artist.create(artist, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(artist);
    })
};

exports.update = function (req, res) {
  var newData = { name: req.body.name};
  Artist.update(req.params.id, newData, function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
};

exports.delete = function (req, res) {
  Artist.delete(req.params.id, function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
};