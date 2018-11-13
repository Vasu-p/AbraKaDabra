var app=angular.module("searchApp",[]);
app.controller('homeCtrl',function($scope) {
    var term;
    $scope.byName=true;
    $scope.documents=[];
    $scope.pages=0;
    $scope.showPagination=false;
    $scope.currentPage=0;
    
    
    $scope.getPages=function(pages){
        return new Array(pages);
        
    }
    $scope.changePage=function(pageno,$event){
        //alert(elem.value);
        
        
        $($event.target).siblings().removeClass("active");
        $($event.target).addClass("active");
        
        $scope.currentPage=pageno;
    }
    
    
    $scope.search=function() {
        
       $scope.currentPage=0; 
       $scope.documents=[];
       var flag=0;
       term=$scope.searchterm;
       if(!term){
           $.ajax({
               url:"/api/documents/",
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log("name:"+data.result);
                       $scope.documents=$scope.documents.concat(data.result);
                       $scope.pages=Math.ceil($scope.documents.length/3);
                       
                       $scope.showPagination=true;
                      $("#page0").addClass("active");
                   }
                   else
                   {
                       flag=1;
                       return;
                   }
                   
               }
               
           });
           return;
           
       }
      
       if($scope.byName){
           $.ajax({
               url:"/api/documents/search/name/"+term,
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log("name:"+data.result);
                       $scope.documents=$scope.documents.concat(data.result);
                   }
                   else
                   {
                       flag=1;
                       return;
                   }
                   
               }
               
           });
           if(flag==1){
               Materialize.toast("Cannot retreive documents ...",4000,'rounded');
               return;
           }
           
       }
       if($scope.byAuthor){
           $.ajax({
               url:"/api/documents/search/author/"+term,
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log("author:"+data.result[0]);
                       $scope.documents=$scope.documents.concat(data.result);
                   }
                   else
                   {
                       flag=1;
                       return;
                   }
                   
               }
               
           });
           if(flag==1){
               Materialize.toast("Cannot retreive documents ...",4000,'rounded');
               return;
           }
           
           
       }
       if($scope.byKeyWords){
           $.ajax({
               url:"/api/documents/search/"+term,
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log("key:"+data.result[0]);
                       $scope.documents=$scope.documents.concat(data.result);
                   }
                   else
                   {
                       flag=1;
                       return;
                   }
                   
               }
               
           });
           if(flag==1){
               Materialize.toast("Cannot retreive documents ...",4000,'rounded');
               return;
           }
           
           
       }
       if($scope.documents.length==0)
           Materialize.toast("No Documents Found ...",4000,'rounded');
       
       console.log($scope.documents);
       arr=$scope.documents;
       var a = arr.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i]._id === a[j]._id)
                a.splice(j--, 1);
        }
    }
    
    
      $scope.documents=a; 
      var noofdocs=$scope.documents.length;
      $scope.pages=Math.ceil(noofdocs/3);
      
     
      if(noofdocs>0)
        $scope.showPagination=true;
        else
         $scope.showPagination=false;
         
         $("#page0").addClass("active");
      console.log($scope.showPagination);
      
    };
    
    $scope.incDownload=function(id){
       // alert(id);
       $.ajax({
           url:'/api/documents/downloads/'+id,
           type:"GET",
           async:false
        
        });
       $scope.search(); 
        
    };
    $scope.incLike=function(id){
       // alert(id);
       $.ajax({
           url:'/api/documents/likes/'+id,
           type:"GET",
           async:false
        
        });
       $scope.search(); 
        
    };
    
});


app.controller('adminCtrl',function($scope,$window){
    
    $scope.documents=[];
    $scope.isUpdate=false;
    $scope.test="vau";
    
    
    $scope.login=function(){
      var username=$scope.username;
      var password=$scope.password;
      $.ajax({
               url:"/api/admin/adminAuth/",
               type:"POST",
               data:{"username":username,"password":password},
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log("Succesfully Authenticated");
                       console.log(data.token);
                       sessionStorage.setItem('token',data.token);
                       
                       //Materialize.toast('Authenticated..',4000,'rounded');
                       //window.location="/adddocument";
                   }
                   else
                   {
                       //console.log("Problem ...");
                       //flag=1;
                        delete $window.sessionStorage.token;
                        Materialize.toast('Invalid Credentials..',4000,'rounded');
                       
                   }
                   
               }
               
           });
      
        
        
    };
    
    $scope.isAuth=function(){
        
        if(sessionStorage.getItem('token')==null)
        return false;
        else
        return true;
    };
    $scope.logout=function(){
       // alert('here');
        sessionStorage.removeItem('token');
        //$scope.debug=sessionStorage.getItem('token');
        //alert(sessionStorage.getItem('token'));
    };
    $scope.loadAll=function(){
        
         $.ajax({
               url:"/api/documents/",
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       //console.log("key:"+data.result[0]);
                       $scope.documents=data.result;
                   }
                   else
                   {
                       Materialize.toast('Cant load ..',4000);
                   }
                   
               }
               
           });
        
    };
    $scope.loadAll();
    $scope.delete=function(id){
        var token=sessionStorage.getItem('token');
        
          $.ajax({
           url:'/api/documents/'+id+'?token='+token,
           type:"DELETE",
           async:false,
           success:function(data){
               if(data.success=="true")
                    Materialize.toast("Deleted Succesfully",4000);
               else
                    Materialize.toast("Cant Delete ",4000);
           } 
        });
        $scope.loadAll();
        
    };
    
    $scope.uploadDoc=function(){
				var docid="";
				var token=sessionStorage.getItem('token');
                //alert(token);
				var keywords=$scope.docKeyWords.split(',');
				$.ajax({
					url:'/api/documents?token='+token,
					data:{"docName":$scope.docName,"docAuthor":$scope.docAuthor,"docKeyWords":keywords,"docLikes":0},
					type:"POST",
					async:false,
                    
					success:function(data){
                    
                    //console.log(data);
                    if (data.success=="false") {
                       Materialize.toast("Cannot upload document ...",4000,'rounded');
                       return;
					   
                    }else{
                       
					   docid=data.id;
					   console.log(docid);
                    }
                    
                    
                    
                    
                    }});
                
				
				//document image ..... ---------------------------
				var docuImg=$('#docuImg')[0];
				docuImg=docuImg.files[0];
				var fd=new FormData();
				fd.append('file',docuImg);
				var imageUrl="/api/documents/image/"+docid+'?token='+token;
				console.log(imageUrl);

				$.ajax({
					url: imageUrl,
					type: 'POST',
					data: fd,
					async: false,
					cache: false,
					contentType: false,
					enctype: 'multipart/form-data',
					processData: false,
                    
					success: function (response) {
						if (response.success=="true") {
							//imgpath=response.fileInfo.path;
						}
						else
						{
							Materialize.toast("Cannot upload Document",4000,'rounded');
						 	return;
						 
						}
					}
				});
				
				//--------- Document Upload ------------
				var docu=$('#docu')[0];
				docu=docu.files[0];
				var fd1=new FormData();
				fd1.append('file',docu);
				var fileUrl="/api/documents/upload/"+docid+'?token='+token;
				console.log(fileUrl);
				$.ajax({
					url: fileUrl,
					type: 'POST',
					data: fd1,
					async: false,
					cache: false,
					contentType: false,
					enctype: 'multipart/form-data',
					processData: false,
                    
					success: function (response) {
						if (response.success=="true") {
							Materialize.toast("Document uploaded succesfully...",4000,'rounded');
						}
						else
						{
							Materialize.toast("Cannot upload document ...",4000,'rounded');
						 	return;
						 
						}
					}
				});


				
            
            
            
            };
    
    $scope.loadDoc=function (id){
        $scope.isUpdate=true;   
        //alert(id); 
        
        $.ajax({
               url:"/api/documents/"+id,
               type:"GET",
               async:false,
               success:function(data){
                   if(data.success=="true")
                   {
                       console.log(data.result);
                       $scope.docAuthor=data.result[0].docAuthor;
                       $scope.docName=data.result[0].docName;
                       $scope.docKeyWords=data.result[0].docKeyWords.toString();
                       $('#docName').focus();
                       $('#docAuthor').focus();
                       $('#docKeyWords').focus();
                       $scope.currentDocId=id;
                       
                       
                   }
                   else
                   {
                       flag=1;
                       return;
                   }
                   
               }
               
           });
        
        
        
    };
    $scope.cancel=function(){
        $scope.isUpdate=false;
        $scope.docAuthor="";
        $scope.docName="";
        $scope.docKeyWords="";
        $("#docuImg").val('');
        $("#docu").val('');  
        $("#imagename").val('');
        $("#filename").val('');
        
        
    };
    $scope.updateDoc=function(){
                var flag=0;
                var docid=$scope.currentDocId;
				var token=sessionStorage.getItem('token');
                //alert(token);
				var keywords=$scope.docKeyWords.split(',');
				$.ajax({
					url:'/api/documents/'+docid+'?token='+token,
					data:{"docName":$scope.docName,"docAuthor":$scope.docAuthor,"docKeyWords":keywords},
					type:"PUT",
					async:false,
                    
					success:function(data){
                    
                    console.log(data);
                        if (data.success=="false") {
                            flag=1;
                            Materialize.toast("Cannot Update document ...",4000,'rounded');
                            return;
					   
                        }
                    }
                });
                
                if($('#docuImg').val()&&!flag)
                {
                    //alert("img there");
                    
                    var docuImg=$('#docuImg')[0];
                    docuImg=docuImg.files[0];
                    var fd=new FormData();
                    fd.append('file',docuImg);
                    var imageUrl="/api/documents/image/"+docid+'?token='+token;
                    //console.log(imageUrl);

                    $.ajax({
                        url: imageUrl,
                        type: 'POST',
                        data: fd,
                        async: false,
                        cache: false,
                        contentType: false,
                        enctype: 'multipart/form-data',
                        processData: false,
                        
                        success: function (response) {
                            if (response.success=="true") {
                                //imgpath=response.fileInfo.path;
                            }
                            else
                            {
                                Materialize.toast("Cannot upload Document",4000,'rounded');
                                flag=1;
                                return;
                            
                            }
                        }
                    });
                    
                    
                    
                }
                if($('#docu').val()&&!flag){
                   // alert("documebt there");
                    var docu=$('#docu')[0];
                    docu=docu.files[0];
                    var fd1=new FormData();
                    fd1.append('file',docu);
                    var fileUrl="/api/documents/upload/"+docid+'?token='+token;
                    console.log(fileUrl);
                    $.ajax({
                        url: fileUrl,
                        type: 'POST',
                        data: fd1,
                        async: false,
                        cache: false,
                        contentType: false,
                        enctype: 'multipart/form-data',
                        processData: false,
                        
                        success: function (response) {
                            if (response.success=="true") {
                                //Materialize.toast("Document succesfully...",4000,'rounded');
                            }
                            else
                            {
                                flag=1;
                                return;
                            
                            }
                        }
                    });
                   
                   
                }
                if(flag)
                {
                     Materialize.toast("Cannot update document ...",4000,'rounded');
                     $scope.cancel();
                }
                else
                {
                     Materialize.toast("Document updateed Succesfully ...",4000,'rounded');
                     $scope.cancel();
                     $scope.loadAll();
                    // window.location("/admin");
                }
                
                
            };     
                    
                    
                    
        
        
    
    
    
});