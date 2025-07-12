const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const PointsValueSchema = {
  student_quiz :{ type: String, require: false},
  student_bible :{ type: String, require: false},
  student_bible_church:{ type: String, require: false},
  student_without_bible :{ type: String, require: false},
  student_Task :{ type: String, require: false},
  student_Friend :{ type: String, require: false},
  student_bonus :{ type: String, require: false},
  Date_points :{ type: Date, require: false},
  user_name :{ type: String, require: false},
  isdeleted :{ type: String, require: false},
  status :{ type: String, require: false},
  date_delete: { type: Date, require: false }

}


let Event4 = mongoose.model('Event4', PointsValueSchema, 'points_value');



module.exports = Event4