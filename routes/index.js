var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');



/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('indextest');
  
});

router.get('/adddocument',function (req,res,next) {
    
    
    
    res.render('add_document');
});

router.get('/admin',function (req,res,next) {
    res.render('admintest');
    
});
/*
router.get('/helloworld',function(req,res,next){
  res.render('helloworld',{title:"Hello, World!"});
  
  });
router.get('/users',function(req,res,next){
  var db=req.db;
  var collection=db.get('users');
  collection.find({"username":/test/},{sort:{"username":-1},limit:2},function(e,docs){
    res.render('userlist',{userlist:docs});
    });
});

router.get('/newuser',function(req,res,next){
  
  res.render('newuser',{title:"Add New User"});
  
  });

router.post('/adduser',function(req,res,next){
  var db=req.db;
  
  var username=req.body.username;
  var email=req.body.useremail;
  
   var collection = db.get('users');
   
   collection.insert({
    "username":username,
    "email":email
    },function(err,doc){
      if (err) {
        //code
       res.send("There was a problem adding the information to the database.");
      }
      else
      {
         res.redirect("userlist");
      }
      
      
      
      });
  
  });


*/


module.exports = router;
