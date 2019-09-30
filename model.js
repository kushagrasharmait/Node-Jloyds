var Schema = require('mongoose').Schema;
var db = require('./dbConnection');

var UserSchema = Schema({
  
    "firstName": String,
    "lastName": String,
    "email": String,
    "startDate": Date,
    "endDate": Date,
    "status":String
}, {
        collection: 'user'

    });

var UserModel = db.model('UserModel',
    UserSchema);

module.exports = UserModel;




