const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const userLoginSchema = {
  student_name :{ type: String, require: false},
  student_number :{ type: String, require: false},
  student_mail:{ type: String, require: false},
  student_location :{ type: String, require: false},
  student_level :{ type: String, require: false},
  user_name :{ type: String, require: false},
  isdeleted :{ type: String, require: false},
  status :{ type: String, require: false},

}


let event1 = mongoose.model('event1', userLoginSchema, 'student_data');



module.exports = event1