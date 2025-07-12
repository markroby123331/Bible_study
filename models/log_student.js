const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const userLoginSchema = {
  student_name :{ type: String, require: false},
  student_number :{ type: String, require: false},
  student_attendance:{ type: String, require: false},
  student_quiz :{ type: String, require: false},
  student_bible :{ type: String, require: false},
  student_bible_church :{ type: String, require: false},
  student_without_bible :{ type: String, require: false},
  student_Task :{ type: String, require: false},
  student_Friend :{ type: String, require: false},
  student_bonus :{ type: String, require: false},
  student_date :{ type: String, require: false}
}


let Event2 = mongoose.model('Event2', userLoginSchema, 'log_student');



module.exports = Event2