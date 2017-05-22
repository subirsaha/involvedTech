    postApp.service('loginService',function ($rootScope,$http,$location,notificationService) {
        var service = {};

        service.loginResponse = function (grant_type,email,password,clientid,devicetoken,platform,callback) {
            $http({
                    method: 'POST',
                    url: api_base_url+'token',
                    data: "grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password+"&devicetoken="+devicetoken+"&platform="+platform,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}, ignoreLoadingBar: true,
                }).success(function(data, status, headers, config){
                    data.status=true;
                    data.message = '';
                    callback(data);
                    $rootScope.userid = data.userid;
                    notificationService.subscribe();
                }).error(function (data, status, headers, config) {

                    if(status == 400){
                        var data = {status:false,message:"Wrong Email or Password!"}
                    }else if(status == 0){
                        var data = {status:false,message:"Server failed to respond!"}
                    }
                    callback(data);
                });
            //$http({
            //        method: 'POST',
            //        url: api_base_url+'token',
            //        data: "grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password,
            //        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //    }).then(function(data){
            //        console.log(data);
            //        callback(data);
            //    }).catch(function (data) {
            //        console.log(data);
            //        if(status == 400){
            //            var data = {status:false,message:"Wrong Email or Password!"}
            //        }else if(status == 0){
            //            var data = {status:false,message:"Server failed to respond!"}
            //            //$("#confy").click();
            //            //alert('Server failed to respond!');
            //        }
            //        callback(data);
            //    });
        }
        
        
        service.forgetPasswordResponse = function (forgetPasswordEmail,clientid,callback) {
            //alert(forgetPasswordEmail);
            $http({
                    method: 'POST',
                    url: api_base_url+'api/account/resetpassword/username='+forgetPasswordEmail,
                   // headers: "clientid="+clientid,
                   headers: {'Content-Type': 'application/x-www-form-urlencoded','clientid' : clientid}, ignoreLoadingBar: true,
                }).success(function(data, status, headers, config){
                    data.status=true;
                    data.message = '';
                    callback(data);
                }).error(function (data, status, headers, config){
                    if(status == 400){
                    }else if(status == 0){
                        var data = {status:false,msg:"Server failed to respond!"}
                    } 
                    callback(data);
                });
        }
        
    
        
        return service;
    
    });