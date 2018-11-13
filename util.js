var objid=require('mongodb').ObjectID
var jwt=require('jsonwebtoken');


var util={
    checkId:function(id){
        //code here to check validity of id
        //id can be 24 hex digits or 12 characters
        return objid.isValid(id);
        
    },
    verifyToken:function(token){
        try{
        var i=jwt.verify(token,"vasusecretvasu");
        
        }
        catch(err){
            return false;
        }
        return i;
        
        
    }
    
}
module.exports=util;