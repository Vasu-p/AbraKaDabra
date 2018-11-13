var express = require('express');
var router = express.Router();

var util=require('../util');


/* GET users listing. */

router.use(function(req,res,next){
  
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  if (token) {
  
    var result=util.verifyToken(token);
    if (result) {
      next();
    }
    else
      return res.json({"result":"Invalid Auth Credentials"});
  
  }
  else
  {
    return res.json({"result":"Auth Token Not provided"});
  }
  
  });

router.get('/', function(req, res, next){
  var db=req.db;
  var collection=db.get('users');
  collection.find({},function(err,result){
    
    if (err) {
      throw err;
      //code
    }
    else
      res.json(result);
    
    });
});

router.param('userid',function(req,res,next,userid){
    var db=req.db;
    var collection=db.get('users');
    
    var check=util.checkId(userid);
    if (!check) {
     return res.json({result:"Invalid ID "});
     
    }
    
  
  collection.find({"_id":userid},function(err,result){
    
    console.log(result);
    if (err) {
      
     return res.json({"result":"error finding in database"});
    }
    else
    {
      
      if (result.length==0) {
        
        return res.json({"result":"ID not Found.."});
      }
      else
      req.user=result;
      next();
    }
  });
    
  
  });


router.get('/:userid',function(req,res,next){
 
 
  res.json(req.user);
 
  
  
});

router.post('/',function(req,res,next){
  var db=req.db;
  var collection=db.get('users');
  
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
 
  
  
  if (!username || !email || !password) {
    res.json({"result":"Invalid Syntax"});
    return;
  }
  
  collection.insert({"username":username,"email":email,"password":password,"profile_path":""},function(err){
    
    if (err) {
      throw err;
      //code
    }
    else
      res.json({"result":"Succesfully Added","code":"200"});
    
    });
  
 });

router.put('/:userid',function(req,res,next){
    var db=req.db;
    var collection=db.get('users');
    collection.find({"_id":req.params.userid},function(err,data){
      
        if (err) {
          res.json({result:"Error:User id invalid"});
        }
        else{
          
          
          var username=req.body.username || data[0].username;
          var email=req.body.email || data[0].email;
          var password=req.body.password || data[0].password;
          
          collection.updateById(req.params.userid,{"username":username,"email":email,"password":password},function(err1){
            if (err1) {
              //code
              res.json({result:"Error: cant update"});
            }
            else{
              
              res.json({result:"Successfully updated",code:"200"});
            }
            
            });
          
          }

      });
});

router.delete('/:userid',function(req,res){
    var db=req.db;
    var collection=db.get('users');
    collection.remove({"_id":req.params.userid},function(err){
      if (err) {
        res.json({"result":"Error Deleting"});
      }
      else{
        res.json({"result":"Succesfully Deleted"});
      }
      
      });
  
  });

module.exports = router;
