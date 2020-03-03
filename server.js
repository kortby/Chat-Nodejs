var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var dbUrl =
  'mongodb+srv://kortby:user@cluster0-9pqhf.mongodb.net/test?retryWrites=true&w=majority';

var Message = mongoose.model('Message', {
  name: String,
  message: String
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = Promise;

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);

  message
    .save()
    .then(() => {
      console.log('saved');
      return Message.findOne({ message: 'badword' });
    })
    .then(censored => {
      if (censored) {
        console.log('censored words found', censored);
        return Message.remove({ _id: censored.id });
      }
      io.emit('message', req.body);
      res.sendStatus(200);
    })
    .catch(err => {
      res.sendStatus(500);
      return console.error(err);
    });
});

mongoose.connect(
  dbUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => {
    console.log('Mongo db Connection', err);
  }
);

var server = http.listen(3000, err => {
  console.log('server is listening on port: ', server.address().port);
});
