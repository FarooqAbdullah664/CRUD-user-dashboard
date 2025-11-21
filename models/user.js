const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("DB Error: ", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String
});

module.exports = mongoose.model('user', userSchema);
