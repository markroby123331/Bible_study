const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://mm3906760:oveGIL9sYq7eX9Wj@sanawy-bible.xlr3d.mongodb.net/', (err) =>{ 
  
  if (err) {
    console.log(err)
  } else {
    console.log('DB Connection Start')
  }
});

