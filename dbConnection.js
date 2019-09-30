const mongoose = require('mongoose');
var db = mongoose.createConnection("mongoUrl",
 {
"user": "username",
"pass": "password"
});

db.on('error', function(err) {
     db.close();
 
    
 });

 module.exports = db;