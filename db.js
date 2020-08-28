const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true});

const msgSchema = new mongoose.Schema({
    userName: String,
    room: String,
    id: String,
    msg: String,
    time: String
  }, { timestamps: true });

  const Msg = mongoose.model('Msg', msgSchema);

  function addMsg(data) {
      const temp = new Msg(data);

      temp.save((err) => {
          if (err) {
              console.log("Error Saving Msg to Database")
          }
      })
  }

  function getMsg(room) {
      return  new Promise(function (resolve, reject){
        Msg.find({room}, (err, res) => {
            if (err) {
                console.log("Error Retrieving data")
            }
            else {
                return  res
            }
        }).sort({'updatedAt': 1}).exec((err, res) => {
            if (err) {
                console.log("Error sorting data")
            }
            else {
              resolve(res)
            }
        })
      })
  }

  module.exports = {
    addMsg,
    getMsg
  }
