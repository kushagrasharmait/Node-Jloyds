const express = require('express');

const router = express.Router();
const bcrypt =require('bcryptjs')
const moment =require('moment')
const jwt = require('jsonwebtoken')
const model = require("./model")
/*
 * GET home page.
 */
router.get('/', function(req, res) {
  res.send('Hello world!');
});

router.post('/login', async function (req, res,next) {
 var user ={"UserName":"avn","password":"sky123"}
  console.log(req.body);


let authenticated =   user.password == req.body.password;


 if(authenticated){
token =  await createAccessToken(req.body)
 res.send( {"status":"success", "token":token})}
 else{
   res.status(401)
  res.send({"status":"failure"})}
});


 router.post('/registerCompany', async function (req, res,next) {
 let exitingCompanies =await model.find([{"company":req.body.company},{"_id":0,"company":1}]);
 if(exitingCompanies && exitingCompanies.length>0){

  res.send({"message":"Company name should be unique"})


 }
 else{
   
model.create({
"firstName":req.body.firstName,
"lastName":req.body.lastName,
"email":req.body.email,
"startDate":req.body.startDate,
"endDate":req.body.endDate,
"status":req.body.status
})
res.send({"message":"company added sucessfully"})
 
}
 
 next();
 });

 router.put('/api/updateCompanyStatus', async function (req, res,next) {
  let exitingCompanies =await model.update([{"company":req.body.company},{$set:{"status":req.body.status,"startDate":req.body.startDate,"endDate":req.body.endDate,}}]);
  if(exitingCompanies && exitingCompanies.length>0){
 
   res.send({"message":"Company name should be unique"})
 
 
  }
  else{
    
 model.create({
 "firstName":req.body.firstName,
 "lastName":req.body.lastName,
 "email":req.body.email,
 "startDate":req.body.startDate,
 "endDate":req.body.endDate,
 "status":req.body.status
 })
 res.send({"message":"company added sucessfully"})
  
 }
  
  next();
  });
 router.get('/api/getAllCompanies', async function (req, res,next) {
  var detailsList=[];
  let data ={};



 datalist = await model.aggregate([
{'$match':{
  '$status':'active',

} },
{'$sort':{'$startDate':-1}}
{'$group':{
'_id':"_id",
'data':{
  $push:{
    "startDate":'$startDate',
    'endDate':'$endDate',
    'company':'$company',

  }
}
}
},

{'$project':{
 '$id':0,
 '$data':1 
}} ]);


res.send(detailsList);
     next();
    });



 
    async function  createAccessToken(user) {
      try {
        let partnerToken = {};
        partnerToken.partnerName = user.UserName;
        partnerToken.exp = moment().add((process.env.TOKEN_EXPIRES_IN_MINUTES || 10), 'minutes').valueOf();
        partnerToken.id = user.UserName;
        
  
        let signedToken = jwt.sign({ data: partnerToken },"publicKey", {
        });
  
        
        let expiryDate = moment().add((process.env.TOKEN_EXPIRES_IN_MINUTES || 10), 'minutes').toString();
        // Create the code access token response
        let   partnersAccessToken ={};
  
        partnersAccessToken.expires_in = new Date(expiryDate);
        partnersAccessToken.access_token = signedToken;
  
  
        return {
          user,
          token: partnersAccessToken,
        };
      } catch (err) {
        throw new Error(err);
      }
    }
module.exports = router;
