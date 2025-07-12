const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const userLoginSchema = {
  user_name :{ type: String, require: false},
  password :{ type: String, require: false},
  privilege:{ type: String, require: false}
}


let EventUserLogin = mongoose.model('EventUserLogin', userLoginSchema, 'users');



module.exports = EventUserLogin