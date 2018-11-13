var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
var app=require('../app');

router.get('/',function(req,res){
    
    res.end('Admin Portal Running. Auth. at /adminAuth');
    });


router.post('/adminAuth',function(req,res){
    var db=req.db;
    var collection=db.get('admin');
    var username=req.body.username||false;
    var password=req.body.password||false;
    
    if(!username || !password)
        return res.json({"message":"username or password not supplied","success":false});
    
    collection.findOne({"username":username},function(err,data){
        if (err) {
            return res.json({"message":"Error in Database","success":false});
        }
        else
        {
            if (!data) {
                return res.json({"message":"Authentication Failed","success":false});
            }
            else
            {
               if (data.password!=password) {
                    return res.json({"message":"Authentication Failed","success":false});    
                
               }
               else
               {
                    
                    var token=jwt.sign(data,"vasusecretvasu",{expiresIn:3600000});
                    return res.json({"message":"Successfully Authenticated","token":token,"success":"true"});
               }
               
            }
        }
        });    
    
    
    
    });

module.exports=router;
