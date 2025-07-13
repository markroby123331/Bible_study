const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

// Use environment variable for MongoDB URI
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://mm3906760:oveGIL9sYq7eX9Wj@sanawy-bible.xlr3d.mongodb.net/';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  } else {
    console.log('DB Connection Start');
  }
});

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});