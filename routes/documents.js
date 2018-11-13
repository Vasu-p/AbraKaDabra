var express = require('express');
var router = express.Router();
var crypto=require('crypto');
var multer=require('multer');
var path=require('path');
var fs=require('fs');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  }
});
var upload = multer({ storage: storage });
var util=require('../util');


/* GET users listing. 

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
  */

router.get('/', function(req, res, next){
  var db=req.db;
  var collection=db.get('documents');
  collection.find({},function(err,result){
    
    if (err) {
      throw err;
      //code
    }
    else
      //res.render('documents',result);
      res.json({"result":result,"success":"true"});
    
    });
});

router.param('docid',function(req,res,next,docid){
    var db=req.db;
    var collection=db.get('documents');
    
    var check=util.checkId(docid);
    if (!check) {
     return res.json({"success":"false","message":"Invalid ID"});
     
    }
    
  
  collection.find({"_id":docid},function(err,result){
    
    console.log(result);
    if (err) {
      
     return res.json({"success":"false","message":"error finding in database"});
    }
    else
    {
      
      if (result.length==0) {
        
        return res.json({"success":"fasle","message":"ID not Found.."});
      }
      else
      req.doc=result;
      next();
    }
  });
    
  
  });


router.get('/:docid',function(req,res,next){
 
 
  res.json({"result":req.doc,"success":"true"});
 
  
  
});

router.get('/search/:searchterm',function(req,res,next){
  
   var term=req.params.searchterm;
   var db=req.db;
   var collection=db.get('documents');
   collection.find({$text:{$search:term,$caseSensitive:false}},function(err,data){
      
    if (err) {
      res.json({"success":"false",result:"Error in database .."});
    }
    else
    res.json({"success":"true","result":data});
    
    
    
    });  
  
  });
router.get('/search/name/:term',function(req,res,next){
  
   var term=req.params.term;
   var db=req.db;
   var collection=db.get('documents');
   collection.find({"docName":{$regex:term,$options:'i'}},function(err,data){
      
    if (err) {
      res.json({"success":"false",result:"Error in database .."});
    }
    else
    res.json({"success":"true","result":data});
    
    
    
    });  
  
  });
router.get('/search/author/:term',function(req,res,next){
  
   var term=req.params.term;
   var db=req.db;
   var collection=db.get('documents');
   collection.find({"docAuthor":{$regex:term,$options:'i'}},function(err,data){
      
    if (err) {
      res.json({"success":"false",result:"Error in database .."});
    }
    else
    res.json({"success":"true","result":data});
    
    
    
    });  
  
  });
router.get('/downloads/:docid',function (req,res,next) {
    
   console.log(req.doc[0].docDownloads); 
   var downloads=parseInt(req.doc[0].docDownloads)+1; 
   console.log(downloads);
   
   var id=req.params.docid;
   var db=req.db;
   var collection=db.get('documents');
   collection.findAndModify({"_id":id},{$set:{"docDownloads":downloads}},function(err,data){
      
    if (err) {
      res.json({"success":"false",result:"Error in database .."});
    }
    else
    res.json({"success":"true","result":""});
    
    
    
    });  
    
   
    
});

router.get('/likes/:docid',function (req,res,next) {
    
   //console.log(req.doc[0].docLikes); 
   var likes=parseInt(req.doc[0].docLikes)+1; 
   //console.log(downloads);
   
   var id=req.params.docid;
   var db=req.db;
   var collection=db.get('documents');
   collection.findAndModify({"_id":id},{$set:{"docLikes":likes}},function(err,data){
      
    if (err) {
      res.json({"success":"false",result:"Error in database .."});
    }
    else
    res.json({"success":"true","result":""});
    
    
    
    });  
    
   
    
});

// now these are routes which require authentication


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
  
router.post('/',function(req,res,next){
  var db=req.db;
  var collection=db.get('documents');
  
  var docName=req.body.docName;
  var docAuthor=req.body.docAuthor;
  var docLikes=req.body.docLikes;
  var docKeyWords=req.body.docKeyWords;
  var docPhotoURL=req.body.docPhotoURL;
  var docPath=req.body.docPath;
  //console.log(docName+" "+docAuthor+" "+docLikes+" "+docKeyWords);
  
  if (!docName || !docAuthor || !docLikes) {
    res.json({"success":"fasle","message":"Invalid Syntax"});
    return;
  }
  
  collection.insert({"docName":docName,"docAuthor":docAuthor,"docLikes":docLikes,"docKeyWords":docKeyWords,"docPhotoURL":"","docPath":"","docDownloads":0},function(err,docInserted){
    
    if (err) {
      throw err;
      //code
    }
    else
      res.json({"success":"true","message":"Succesfully Added","code":"200","id":docInserted._id});
    
    });
  
 });

router.put('/:docid',function(req,res,next){
    var db=req.db;
    var collection=db.get('documents');
    collection.find({"_id":req.params.docid},function(err,data){
      
        if (err) {
          res.json({"success":"fasle","message":"Error:User id invalid"});
        }
        else{
          
          
          var docName=req.body.docName || data[0].docName;
          var docAuthor=req.body.docAuthor || data[0].docAuthor;
          var docLikes=req.body.docLikes || data[0].docLikes;
          var docKeyWords=req.body.docKeyWords||data[0].docKeyWords;
          
          
          
          var docPhotoURL=req.body.docPhotoURL || data[0].docPhotoURL; 
          var docPath=req.body.docPath || data[0].docPath;
          var docDownloads=req.body.docDownloads || data[0].docDownloads;
          
          collection.updateById(req.params.docid,{"docName":docName,"docAuthor":docAuthor,"docLikes":docLikes,"docKeyWords":docKeyWords,"docPhotoURL":docPhotoURL,"docPath":docPath,"docDownloads":docDownloads},function(err1){
            if (err1) {
              //code
              res.json({"success":"fasle","message":"Error: cant update"});
            }
            else{
              
              res.json({"success":"true",result:"Successfully updated",code:"200"});
            }
            
            });
          
          }

      });
});

router.delete('/:docid',function(req,res){
    var db=req.db;
    var collection=db.get('documents');
    collection.remove({"_id":req.params.docid},function(err){
      if (err) {
        res.json({"success":"fasle","message":"Error Deleting"});
      }
      else{
        res.json({"success":"true","message":"Succesfully Deleted"});
      }
      
      });
  
  });

router.post('/image/:docid',upload.single('file'),function(req,res,next){
  
  /*
  if (req.file) {
    res.json({"success":"true","fileInfo":req.file});
  }
  else
  {
    res.json({"success":"false"});
  }
  */
  var db=req.db;
  var collection=db.get('documents');
  collection.findAndModify({"_id":req.params.docid},{$set:{"docPhotoURL":req.file.path}},function(err){
      if (err) {
        res.json({"success":"fasle","message":"Error in updating"});
      }
      else
      {
        res.json({"success":"true","message":"Successfully inserted path"});
      }
    
    });
  
  
  
  });

router.post('/upload/:docid',upload.single('file'),function(req,res,next){
  
  var db=req.db;
  var collection=db.get('documents');
  collection.findAndModify({"_id":req.params.docid},{$set:{"docPath":req.file.path}},function(err){
      if (err) {
        res.json({"success":"fasle","message":"Error in updating"});
      }
      else
      {
        res.json({"success":"true","message":"Successfully inserted path"});
      }
    
    });
  
  
  
  });





module.exports = router;
