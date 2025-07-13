const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const userStatusSchema = {
  user :{ type: String, require: false},
  status :{ type: String, require: false},
  computer_name :{ type: String, require: false},
  homedir :{ type: String, require: false},
  type :{ type: String, require: false},
  privilege:{ type: String, require: false},
  login_time :{ type: Date, require: false},
  logout_time :{ type: Date, require: false},
}


let EventUserStatus = mongoose.model('EventUserStatus', userStatusSchema, 'user_status');



module.exports = EventUserStatus