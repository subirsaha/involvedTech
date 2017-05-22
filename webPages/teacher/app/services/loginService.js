    postApp.service('loginService',function ($rootScope,$http,$location,notificationService) {
        var service = {};

        service.loginResponse = function (grant_type,email,password,clientid,devicetoken,platform,callback) {
            $http({
                    method: 'POST',
                    url: api_base_url+'token',
                    data: "grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password+"&devicetoken="+devicetoken+"&platform="+platform,
                    headers: {'Content-Type': 'application/json;charset=utf-8'}, ignoreLoadingBar: true,
                    crossDomain: true
                }).success(function(data, status, headers, config){
                    console.log(data);
                    data.status=true;
                    data.message = '';
                    callback(data);
                    $rootScope.userid = data.userid;
                    notificationService.subscribe();
                }).error(function (data, status, headers, config) {

                    if(status == 400){
                        var data1 = {status:false,message:"Wrong Email or Password!"}
                    }else if(status == 0){
                        var data1 = {status:false,message:"Server failed to respond!"}
                    }
                    callback(data1);
                });
        }
        
        
        service.forgetPasswordResponse = function (forgetPasswordEmail,clientid,callback) {
            //alert(forgetPasswordEmail);
            $http({
                    method: 'POST',
                    url: api_base_url+'api/account/resetpassword/username='+forgetPasswordEmail,
                   // headers: "clientid="+clientid,
                   headers: {'Content-Type': 'application/json;charset=utf-8','clientid' : clientid}, ignoreLoadingBar: true,
                }).success(function(data, status, headers, config){
                    data.status=true;
                    data.message = '';
                    callback(data);
                }).error(function (data, status, headers, config){
                    if(status == 400){
                    }else if(status == 0){
                        var data1 = {status:false,msg:"Server failed to respond!"}
                    } 
                    callback(data1);
                });
        }
        
    
        
        return service;
    
    });