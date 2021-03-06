postApp.controller('testeditctrl', function ($scope, $filter, $http, $compile, $location, $timeout, constantsProvider, loginService, homeService, cfpLoadingBar) {

    var access_token = getOnlyCookie("access_token");
    var userid = getOnlyCookie("userid");
    var weekDayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    $scope.daysInMonth = constantsProvider.daysInMonth;
    $scope.monthsInYear = constantsProvider.monthsInYear;

    $scope.get_browser=function() {
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
                return {name:'IE',version:(tem[1]||'')};
                }   
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR|Edge\/(\d+)/)
                if(tem!=null)   {return {name:'Opera', version:tem[1]};}
                }   
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            return {
              name: M[0],
              version: M[1]
            };
         }
        var browser=$scope.get_browser();
        var platform=browser.name+'_'+browser.version;
    

    // Added By Krishna to access Server Time On 03.02.17 Start
    // console.log(navigator.userAgent);
    // var objAgent = navigator.userAgent;
    // if(objAgent.indexOf("MSIE")!=-1)
    // {
    //     console.log("MSIE");
    // }
    //document.body.onclick = function(e) {
    //if(e.target != document.getElementById('content-area')) {
    //    document.getElementById('wk_picker').innerHTML = 'You clicked outside.';
    //    $('#week_drp').css({'display':'none'});
    //} else {
    //    document.getElementById('wk_picker').innerHTML = 'Display Contents';   
    //}
    //}

    var xmlHttp;
    function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        console.log(err1);
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
    }
    var st = srvTime();
    // var server_date = new Date(st);
    // console.log(server_date);
    // Added By Krishna to access Server Time On 03.02.17 Ends


    // Added by Krishna on 14.02.2017 to detech IE and EDGE for Browser Start Here
    function detectIE() {
          var ua = window.navigator.userAgent;
          var msie = ua.indexOf('MSIE ');
          if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
          }

          var trident = ua.indexOf('Trident/');
          if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
          }

          var edge = ua.indexOf('Edge/');
          if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
          }

          // other browser
          return false;
    }

    // Added by Krishna on 14.02.2017 to detech IE and EDGE for Browser Ends Here



    $scope.myTaskStatus = 0;
    /*initializing scrollers*/
    $timeout(function () {
        $("#chat_box").mCustomScrollbar({
            axis: "y",
            theme: "3d",
            scrollInertia: 550,
            scrollbarPosition: "outside"
        });
        $(".contentDateDIv").mCustomScrollbar({
            axis: "y",
            theme: "3d",
            scrollInertia: 550,
            scrollbarPosition: "outside"
        });
        //$(".right_srl").mCustomScrollbar({
        //    axis: "x",
        //    theme: "3d",
        //    scrollInertia: 550,
        //    scrollbarPosition: "outside"
        //});
        $(".nav").mCustomScrollbar({
            axis: "x",
            theme: "3d",
            scrollInertia: 550,
            scrollbarPosition: "outside",
            scrollButtons: { scrollType: "stepped" }
        });
    }, 1000);

    /*loader*/
    $scope.loader_hide = function () {
        $(window).scrollTop(0);
        $("#status").delay(5000).fadeOut("slow");
        $("#preloader").delay(5000).fadeOut("slow");
    }
    $scope.loader_hide();

    /*IF USER NOT LOGGED IN , HE CANNOT ACCESS HOME PAGE*/
    $scope.init = function () {
        ///LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content4").css("display", "block");
        $("#preloader_right_content4").css("display", "block");
        if (userid == undefined) {
            $location.path("login");
            //var URL = base_url + 'login';
            //window.location = URL;
        } else {
            /*FETCH TEACHER DETAILS ON PAGE LOAD*/
            $scope.teacherDetailsResponse = function () {
                homeService.teacherDetailsResponse(access_token, function (response) {
                    console.log("TEACHER DETAILS");
                    console.log(response.SupportedFeatures);
                    //suppoted features assign
                    $scope.Messaging=response.SupportedFeatures.Messaging;
                    $scope.ParentMessaging=response.SupportedFeatures.ParentMessaging;
                    $scope.PerformanceGraph=response.SupportedFeatures.PerformanceGraph;
                    $scope.StudentSupport=response.SupportedFeatures.StudentSupport;
                    $scope.Timetable=response.SupportedFeatures.Timetable;
                   
                    
                    $scope.Id = response.Id;
                    $scope.TeacherTitle = response.Title;
                    $scope.Email = response.Email;
                    $scope.TeacherFirstname = response.Firstname;
                    $scope.TeacherLastname = response.Lastname;
                    $scope.Gender = response.Gender;
                    $scope.TeacherSchoolName = response.SchoolName;
                    $scope.UnreadInboxCount = response.UnreadInboxCount;
                    $scope.TeacherImage = response.Image;
                    $scope.UnreadInboxCount = response.UnreadInboxCount;
                    //setOnlyCookie("teacherId",response.Id, 60 * 60 * 60); 
                    /*FETCH MY CLASSES*/
                    //var teacherId=response.Id;
                    //var teacherId = getOnlyCookie("teacherId");
                    setOnlyCookie("tab", "myClasses", 60 * 60 * 60);
                    $scope.myClassesResponse = function () { ///LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content4").css("display", "block");
                        $("#preloader_right_content4").css("display", "block");
                        homeService.myClassesResponse(access_token, function (response) {
                            //console.log("MY CLASSES");
                            //console.log(response);
                            if (response.status) {
                                if (response != '') {
                                    $scope.myClasses = response;
                                    $scope.classListMessage = "";
                                    $scope.classListMessage1 = "";
                                    $scope.classListMessage2 = "";
                                    $scope.classListMessage3 = "";
                                    $scope.classListMessage4 = "";
                                    $('.showStudentDiv').show();
                                    $('#noRecord4').removeClass('noRecord');
                                    $scope.defaultClassId = response[0].Id;
                                } else {
                                    $scope.myClasses = '';
                                    $scope.classListMessage = 'No Classes Found…';
                                    $scope.classListMessage1 = "Try:";
                                    $scope.classListMessage2 = "1. Reload the webpage.";
                                    $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                    $scope.classListMessage4 = "here.";
                                    $('.showStudentDiv').hide();
                                    $('#noRecord4').addClass('noRecord');
                                    $scope.defaultClassId = "";
                                }
                              
                            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") { //ERROR : no internet connection

                                $("#confy1").click();
                                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                $scope.myClasses = '';
                                $scope.classListMessage = 'No Classes Found…';
                                $scope.classListMessage1 = "Try:";
                                $scope.classListMessage2 = "1. Reload the webpage.";
                                $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                $scope.classListMessage4 = "here.";
                                $('.showStudentDiv').hide();
                                $('#noRecord4').addClass('noRecord');
                                $scope.defaultClassId = "";
                               
                            } else {  //ERROR : 500 in api
                                $scope.myClasses = '';
                                $scope.classListMessage = 'No Classes Found…';
                                $scope.classListMessage1 = "Try:";
                                $scope.classListMessage2 = "1. Reload the webpage.";
                                $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                $scope.classListMessage4 = "here.";
                                $('.showStudentDiv').hide();
                                $('#noRecord4').addClass('noRecord');
                                $scope.defaultClassId = "";
                              
                            }
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content4").css("display", "none");
                            $("#preloader_right_content4").css("display", "none");
                           // $(".showStudentDiv ").mCustomScrollbar("update");
                        });
                    };
                    $scope.myClassesResponse();
                });
            };
            $scope.teacherDetailsResponse();
        }

        // var teacherId = getOnlyCookie("teacherId");
    }

    $scope.init();
    //var teacherId = getOnlyCookie("teacherId");

    ///OPEN SETTINGS POP UP ON CLICK
    $scope.settings_popup_open = function () {
        $('#open_settings_popup').click();
        $scope.settings();
    };

    //$scope.toggle_status='tab';
    $scope.toggle_status_performance = '';
    $scope.toggle_status_message = '';
    $scope.toggle_status_back_btn = '';
    $scope.toggle_status_my_classes = '';
    $scope.toggle_status_my_timetable = '';
    $scope.toggle_status_my_inbox = '';
    $scope.toggle_status_my_task = '';

    $('#createTaskPopUpClose').on('click', function (e) {
        $("select option[value='']").attr("selected", "selected");
        $('.poplist').css({ "display": "none" });
        $("#noRecord7").css("display", "none");
        // $("#createTaskMessage").css("display", "block");
    });

    /*ISO TO YYYY-mm-dd date conversion function*/

    $scope.ISOdateConvertion = function (ISOdate) {
        //var ISOdateInt = parseInt(ISOdate);
        ISOdateInt = (typeof ISOdate != 'undefined' && ISOdate != '') ? ISOdate : new Date(st);
        var dateStr = new Date(ISOdateInt);
        var dateStr2 = dateStr.toISOString();
        var dateStr3 = new Date(dateStr2);
        var dateStr4 = dateStr3.getFullYear() + '-' + (dateStr3.getMonth() + 1) + '-' + dateStr3.getDate();
        return dateStr4;
    }

    /*today date to be already selected in calendar ddp*/
    var todayTime = new Date(st);
    var month = (todayTime.getMonth() + 1);
    var day = (todayTime.getDate());
    var year = (todayTime.getFullYear());

    //$scope.TodayYr = year;
    $scope.TodayMnth = month;
    $scope.TodayDay = day;
    $scope.NowYear = year;
    var todayDate = year + '-' + month + '-' + day;
    var academicYear = year + '-9-1';
    //console.log(todayDate + '  &&&&&&  ' + academicYear);

    //if(todayDate < academicYear){
    //    var nextYear = (todayTime .getFullYear() - 1);
    //    $scope.NextYr = nextYear;
    //}else{
    //    var nextYear = (todayTime .getFullYear() + 1);
    //    $scope.NextYr = nextYear;
    //}
    if (month <= 8) {
        $scope.TodayYr = (todayTime.getFullYear() - 1);
        $scope.NextYr = year;
    } else {
        $scope.TodayYr = year;
        $scope.NextYr = (todayTime.getFullYear() + 1);
    }

    /*********************************TEACHER DETAILS & CLASSES begins****************************************************************/
    /*********************************MY CLASSES SECTION begins****************************************************************/
    var InitStudentIds = [];
    $scope.isChecked = function (id) {
        return InitStudentIds.indexOf(id);
    }

    var isClicked = false;
    $scope.clickRow = function () {
        ///LOADER SHOW
        //$(window).scrollTop(0);
        //$("#status_right_content").css("display", "block");
        //$("#preloader_right_content").css("display", "block");
        setTimeout(function () {
            $scope.clickTab();
        }, 100);
    };

    $scope.clickTab = function (val) {
        $('#message1').val('');
        //$scope.loader_right_content_show();
        if (!isClicked) {
            isClicked = true;
            //console.time('clicked');
            //console.log('clicked');
            val = (typeof val != 'undefined') ? val : "performance";
            if (val == "performance") {
                $("#performance_class").addClass("active");
                $("#performance").addClass("in active");
                if ($("#task_class").hasClass('active')) {
                    $("#task_class").removeClass('active');
                }
                if ($("#task").hasClass('active')) {
                    $("#task").removeClass('active');
                }
                if ($("#message_class").hasClass('active')) {
                    $("#message_class").removeClass('active');
                }
                if ($("#message").hasClass('active')) {
                    $("#message").removeClass('active');
                }
            } else if (val == "task") {
                $("#task_class").addClass("active");
                $("#task").addClass("in active");
                if ($("#performance_class").hasClass('active')) {
                    $("#performance_class").removeClass('active');
                }
                if ($("#performance").hasClass('active')) {
                    $("#performance").removeClass('active');
                }
                if ($("#message_class").hasClass('active')) {
                    $("#message_class").removeClass('active');
                }
                if ($("#message").hasClass('active')) {
                    $("#message").removeClass('active');
                }
                $(".selectpicker").selectpicker('refresh');

            } else if (val == "message") {
                if ($scope.ParentMessaging) {
                     $("#message_class").addClass("active");
                $("#message").addClass("in active");
                if ($("#task_class").hasClass('active')) {
                    $("#task_class").removeClass('active');
                }
                if ($("#task").hasClass('active')) {
                    $("#task").removeClass('active');
                }
                if ($("#performance_class").hasClass('active')) {
                    $("#performance_class").removeClass('active');
                }
                if ($("#performance").hasClass('active')) {
                    $("#performance").removeClass('active');
                }

                $(".selectpicker").selectpicker('refresh');
                $("#message1").attr("placeholder", "Please enter message").removeClass('red_place');
                $('.student_list').find('input[type=checkbox]:checked').remove();
                // $('.student_list').find('input[type=checkbox]:checked').removeAttr('checked');
                }else{
                    $('#supportfeature').click();
                    $scope.$apply(function() {
                        $timeout(function(){
                            $('#my_classes').click();
                            },500);
                        
                    });
                    
                    
                }
               
            }
            setTimeout(function () {
                isClicked = false;
            }, 500);
        }
    };
    ///*print in performance page*/
    //$scope.performance_screenshot=function()
    //{
    //    ////var restorepage = document.body.innerHTML;
    //    //var printcontent = document.getElementById("performance").innerHTML;
    //    //document.body.innerHTML = printcontent;
    //    //window.print();
    //    ////document.body.innerHTML = restorepage;
    //       
    //    window.print();
    //}

    



    /*for toggle in 3-tabs in MY CLASSES*/
    $scope.cancelClickTab = function (val, $event) {
        ///LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content").css("display", "none");
        $("#preloader_right_content").css("display", "none");
       
        $("#status_right_content13").css("display", "none");
        $("#preloader_right_content13").css("display", "none");
        //alert(val +"  ##########  "+ $event);
        /*todays date*/
        //var todayTime = new Date();
        var todayTime = new Date(st);   // Updated by krishna to access server date

        // console.log(todayTime);
        var current_month = (todayTime.getMonth() + 1);
        var current_day = (todayTime.getDate());
        var current_year = (todayTime.getFullYear());
        //console.log(current_year+' ## '+current_month+' ## '+current_day);
        var tasktype = $('#tasktype1').val();
        var title = $.trim($('#title1').val());
        var description = $.trim($('#description1').val());
        var day = $('#day1').val();
        var mnth = $('#mnth1').val();
        var year = $('#year1').val();
        //alert(day);

         // console.log('current_month:'+current_month+' current_day:'+current_day+' current_year:'+current_year);
         // console.log('mnth:'+mnth+' day:'+day+' year:'+year);

        var StudentIds = $.trim($('#studentIdsForCreateTask').val());
        var fileNum = $('#fileNum').val();
        var flag = 0;
        if (StudentIds != '') {
            flag++;
        }
        if (tasktype == '' || tasktype == null || tasktype == 'null') {

        } else {
            flag++;
        }
        if (title == '' || title == null) {

        } else {
            flag++;
        }
        if (description == '' || description == null) {

        } else {
            flag++;
        }
        if (day != current_day || mnth != current_month || year != current_year) {
            flag++;
        }
        if (fileNum != 0) {
            flag++;
        }
        //console.log(day+ " = " +current_day+ " &&& " +mnth+ " = " +current_month+  " && " +year+ " = " +current_year);
        //console.log(" >>>>>>>> FLAG = " + flag);

        if (flag > 0) {
            // ///LOADER HIDE
            //$(window).scrollTop(0);
            //$("#status_right_content").fadeOut();
            //$("#preloader_right_content").fadeOut("slow");

            $scope.toggle_status_performance = '';
            $scope.toggle_status_message = '';
            $scope.toggle_status_back_btn = '';
            $scope.toggle_status_my_classes = '';
            $scope.toggle_status_my_timetable = '';
            $scope.toggle_status_my_inbox = '';
            $scope.toggle_status_my_task = '';
            $scope.myTaskStatus = 1;
            $('#dataLostConfyTab').click();
            //FLAG RESET
            flag = 0;
        } else if (flag == 0 && val == "performance") {
            $scope.toggle_status_performance = 'tab';
            ///LOADER SHOW
            //$(window).scrollTop(0);
            //$("#status_right_content13").css("display", "block");
            //$("#preloader_right_content13").css("display", "block");
            $('.showStudentDiv').css('display', 'none');
            $scope.performanceList = "";
        } else if (flag == 0 && val == "message") {
            
            if ($scope.ParentMessaging)
            {
                $scope.toggle_status_message = 'tab';
                ///LOADER SHOW
                //$(window).scrollTop(0);
                //$("#status_right_content12").css("display", "block");
                //$("#preloader_right_content12").css("display", "block");
                 $('#message1').val('');
                $('#remember').attr('checked', "false");
                $('#remember').prop('checked', false);
            }else{
                $('#supportfeature').click();
            }
            
        } else if (flag == 0 && val == "back_btn") {
            $scope.toggle_status_back_btn = 'tab';
        } else if (flag == 0 && val == "my_classes") {
            $scope.toggle_status_my_classes = 'tab';
            $(window).scrollTop(0);
            //$("#status_right_content").css("display", "block");
            //$("#preloader_right_content").css("display", "block");            
            if ($($event.currentTarget).parent('li').hasClass('active')) {
                $(".table_outter .right_content.tab-content .tab-pane.fade").removeClass('active').removeClass('in');
                var currentTarget = $($event.currentTarget).data('target');
                $(currentTarget).addClass('active in');
            }
            //$(".right_srl").mCustomScrollbar("destroy");
            //$(".right_srl").mCustomScrollbar({
            //    axis: "x",
            //    theme: "3d",
            //    scrollInertia: 550,
            //    scrollbarPosition: "outside"
            //});

        } else if (flag == 0 && val == "my_timetable") {
            if ($scope.Timetable) {
                $scope.toggle_status_my_timetable = 'tab';
            }
            
            //$("#performance_print_span").css("display", "none");
        } else if (flag == 0 && val == "my_inbox") {
            if ($scope.Messaging) {
                $scope.toggle_status_my_inbox = 'tab';
                $scope.myTaskStatus = 0;
                ////LOADER SHOW
                ////$(window).scrollTop(0);
                ////$("#status_right_content8").css("display", "block");
                ////$("#preloader_right_content8").css("display", "block");
                $(".studentListInMessageCheckbox").removeAttr('checked');
            }else{
                $('#supportfeature').click();
            }
            
        } else if (flag == 0 && val == "my_task") {
            $scope.toggle_status_my_task = 'tab';
            //$('#myTask').addClass('active');

        }

        /*yes click in modal*/
        $scope.yesBtn = function () {
            var flag = 0;
            $scope.myTaskStatus=0;
            if (val == "performance") {
                $scope.toggle_status_performance = 'tab';
                $('#performance_tab').click();
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content13").css("display", "block");
                $("#preloader_right_content13").css("display", "block");
            } else if (val == "message") {
                $scope.toggle_status_message = 'tab';
                $('#message_tab').click();
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content12").css("display", "block");
                $("#preloader_right_content12").css("display", "block");
            } else if (val == "back_btn") {
                $scope.toggle_status_back_btn = 'tab';
                $('#back_btn').click();
                //$("#performance_print_span").css("display", "none");
            } else if (val == "my_classes") {
                $scope.toggle_status_my_classes = 'tab';
                $('#my_classes').click();
                //$("#performance_print_span").css("display", "none");
                if ($($event.currentTarget).parent('li').hasClass('active')) {
                    $(".table_outter .right_content.tab-content .tab-pane.fade").removeClass('active').removeClass('in');
                    var currentTarget = $($event.currentTarget).data('target');
                    $(currentTarget).addClass('active in');
                }
                //$(".right_srl").mCustomScrollbar("destroy");
                //$(".right_srl").mCustomScrollbar({
                //    axis: "x",
                //    theme: "3d",
                //    scrollInertia: 550,
                //    scrollbarPosition: "outside"
                //});
            } else if (val == "my_timetable") {
                $scope.toggle_status_my_timetable = 'tab';
                $('#my_timetable').click();

            } else if (val == "my_inbox") {
                $scope.toggle_status_my_inbox = 'tab';
                $('#my_inbox').click();
                //LOADER SHOW
                //$(window).scrollTop(0);
                //$("#status_right_content8").css("display", "block");
                //$("#preloader_right_content8").css("display", "block");

                $("#message1").attr("placeholder", "Please enter message").removeClass('red_place');
                $(".studentListInMessageCheckbox").removeAttr('checked');
            } else if (val == "my_task") {
                $scope.toggle_status_my_task = 'tab';
                $('#myTask').click();
                $('#myTask').addClass('active');
                //$("#performance_print_span").css("display", "none");
            }

            /*Reset all prefilled fields in MY CLASSES section*/
            /*create task section*/
            $('#remember_1').attr('checked', "false");
            $('#remember_1').prop('checked', false);
            $("#taskCreateReset").click();
            $("#tasktype1").val('Task Type');
            $("#tasktype1").change();
            //reset calendar
            //$("#day1").change();
            //$("#mnth1").change();
            //$("#year1").change();
            //var day00 = $('#day1').val();
            //
            //alert('YES BTN '+day00);
            
            $scope.tasktypeErr = "";
            $("#title1").attr("placeholder", "Title").removeClass('red_place');
            $("#description1").attr("placeholder", "Description").removeClass('red_place');
            $scope.dateErr = "";
            $scope.countSelectStudentsTask = 0;
            $("#studentIdsForCreateTask").val('');
            $scope.countSelectStudentsMessage = 0;
            $("#studentIdsForMessage").val('');
            /*clear the attachment div*/
            $('#adddiv').html('');
            /*reset file upload fields*/
            $('#fileNum').val(0);
            $('#file_size1').val(0);

            /*create message section*/
            $("#messageReset").click();
            $('#remember').attr('checked', "false");
            $('#remember').prop('checked', false);
            $('.studentListInMessageCheckbox').attr('checked', "false");
            $('.studentListInMessageCheckbox').prop('checked', false);
            $('#message1').html('');
            $("#message1").attr("placeholder", "Please enter message").removeClass('red_place');
            //FLAG RESET
            flag = 0;
        };
        $scope.noBtn = function () {
            $('#myTask').removeClass('active');
        }
    };


    /************************   ***** MY CLASSES SECTION begins *****  *************************************************
    ********************************************************************************************************************/

    /************************   ***** CREATE TASK SECTION *****  *************************/
    $scope.createTask = function (ClassId, ClassName, SubjectName) {
        ///LOADER SHOW
        //console.log("TodayDay   --" + $scope.TodayDay+'  TodayMnth'+$scope.TodayMnth+'   NowYear'+$scope.NowYear);
        $('.studentListInTaskCheckbox').removeAttr('checked');
        $(window).scrollTop(0);
        $("#status_right_content").css("display", "block");
        $("#preloader_right_content").css("display", "block");

        $("#performance_print_span").css("display", "none");
        /*fetch student list*/
        $scope.classId = ClassId;
        $scope.className = ClassName;
        $scope.subject = SubjectName;
        setOnlyCookie("classId", ClassId, 60 * 60 * 60);
        
        $('#day1').val($scope.TodayDay);
        $('#mnth1').val($scope.TodayMnth);
        $('#year1').val($scope.NowYear);
        $scope.dateErr2 = "";
        $('.selectpicker').selectpicker('refresh');
        homeService.studentListResponse(access_token, ClassId, function (response) {
            //console.log('STUDENT LIST');
            //console.log(response);
            if (response.status) {
                if (response != '') {
                    $('#noRecord2').removeClass('noRecord');
                    $('.showStudentDiv').show();
                    $scope.studentList = response;
                    $scope.noOfStudents = response.length;
                    $scope.IsUnlocked = response.IsUnlocked;
                    $scope.nostudentList = "";
                    $scope.nostudentList1 = "";
                    $scope.nostudentList2 = "";
                    $scope.nostudentList3 = "";
                    $scope.nostudentlist4 = "";
                    $scope.studentListMessage = '';
                    $('#remember_1').removeAttr('checked');
                    ///LOADER HIDE
                    $('.studentListInMessageCheckbox').removeAttr('checked');
                    $('.user_box').removeClass('active');
                } else {
                    $('.showStudentDiv').hide();
                    $scope.studentList = "";
                    $scope.noOfStudents = 0;
                    $scope.IsUnlocked = '';
                    $scope.nostudentList = "No Students Found… ";
                    $scope.nostudentList1 = "Try: ";
                    $scope.nostudentList2 = "1. Reload the webpage.";
                    $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                    $scope.nostudentlist4 = "here.";
                    $('#noRecord2').addClass('noRecord');
                }
            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                $("#confy1").click();
                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                $('.showStudentDiv').hide();
                $scope.studentList = "";
                $scope.noOfStudents = 0;
                $scope.IsUnlocked = '';
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentlist4 = "here.";
                $('#noRecord2').addClass('noRecord');
            } else {
                $('.showStudentDiv').hide();
                $scope.studentList = "";
                $scope.noOfStudents = 0;
                $scope.IsUnlocked = '';
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentlist4 = "here.";
                $('#noRecord2').addClass('noRecord');
            }
            $timeout(function () {
                $(window).scrollTop(0);
                $("#status_right_content").css("display", "none");
                $("#preloader_right_content").css("display", "none");
            }, 500);
        });

        /*COUNT SELECT STUDENT CHECKBOX IN TASK SECTION*/
        $scope.countSelectStudentsTask = 0;

        /*ONCLICK SELECT ALL CHECKBOX*/
        $scope.eachTaskClick = function (student_id) //click on each checkbox
        {
            /*for active class :: click on each check box*/
            var attr = $("#studentTask" + student_id).prop('checked');

            if (attr == true) {
                setTimeout(function () {
                    $('#studentTask' + student_id).attr('checked', "true");
                    //$("#studentTask"+student_id).prop("checked", false);
                }, 100);
                $('#studentListInTask' + student_id).addClass('active');
            } else {
                setTimeout(function () {
                    $('#studentTask' + student_id).removeAttr('checked');
                    //$("#studentTask"+student_id).prop("checked", true);
                }, 100);
                $('#studentListInTask' + student_id).removeClass('active');
            }

            var studentIds = new Array();
            var i = 0;
            $("input[type=checkbox]:checked").each(function () {
                if ($(this).attr("studentIdTask") != undefined) {
                    studentIds[i] = $(this).attr("studentIdTask");
                    $("#studentListInTask" + studentIds[i]).addClass('active');
                    i++;
                }
            });
            var numberOfChecked = $('input:checkbox.studentListInTaskCheckbox:checked').length;
            var totalCheckboxes = $('input:checkbox.studentListInTaskCheckbox').length;
            //console.log(studentIds.length+"###"+totalCheckboxes);
            if (studentIds.length != totalCheckboxes) {
                $('#remember_1').prop('checked', false);
                $('#remember_1').attr('checked', false);
            } else {
                $('#remember_1').prop('checked', true);
                $('#remember_1').attr('checked', true);
            }
            $scope.countSelectStudentsTask = studentIds.length;
            //$scope.studentIdsForCreateTask = studentIds.toString();
            document.getElementById('studentIdsForCreateTask').value = studentIds.toString();
        };

        $scope.allTaskClick = function () //click on select all checkbox
        {
            var studentIds = new Array();
            var i = 0;
            if (document.getElementById('remember_1').checked == true) {
                $("input[name='studentListInTaskCheckbox[]']").each(function () {
                    //console.log($(this).attr("studentIdTask"));
                    if ($(this).attr("studentIdTask") != undefined) {
                        studentIds[i] = $(this).attr("studentIdTask");
                        $("#studentListInTask" + studentIds[i]).addClass('active');
                        var attr = $("#studentTask" + studentIds[i]).attr('checked');
                        // For some browsers, `attr` is undefined; for others,
                        // `attr` is false.  Check for both.
                        if (typeof attr == typeof undefined || attr == false) {
                            $("#studentTask" + studentIds[i]).attr("checked", "true");
                            $("#studentTask" + studentIds[i]).prop("checked", true);
                        }
                        i++;
                    }
                });
                //$(".user_box").addClass("active");
                //$scope.studentIdsForCreateTask = studentIds.toString();
                document.getElementById('studentIdsForCreateTask').value = studentIds.toString();
            } else {
                $("input[name='studentListInTaskCheckbox[]']").each(function () {
                    if ($(this).attr("studentIdTask") != undefined) {
                        studentIds[i] = $(this).attr("studentIdTask");
                        $("#studentListInTask" + studentIds[i]).addClass('active');
                        var elm = $("#studentListInTask" + studentIds[i]);
                        $("#studentTask" + studentIds[i]).attr("checked", "false");
                        $("#studentTask" + studentIds[i]).prop("checked", false);
                        i++;
                    }
                });
                $(".studentListInTaskCheckbox").removeAttr('checked');
                $(".user_box").removeClass("active");
                //$scope.studentIdsForCreateTask = "";
                document.getElementById('studentIdsForCreateTask').value = "";
            }
            var numberOfChecked = $('input:checkbox.studentListInTaskCheckbox:checked').length;
            var totalCheckboxes = $('input:checkbox.studentListInTaskCheckbox').length;
            $scope.countSelectStudentsTask = numberOfChecked;
        };

        /*CALENDAR DROPDOWN ON CHANGE*/
        $scope.checkCalendar = function (val) {
            var day = $('#day1').val();
            var mnth = $('#mnth1').val();
            var year = $('#year1').val();
            var error=0;
            var text = mnth + '/' + day + '/' + year;
            var curDate = '"' + mnth + '-' + day + '-' + year + '"';
            var comp = text.split('/');
            var m = parseInt(comp[0], 10);
            var d = parseInt(comp[1], 10);
            var y = parseInt(comp[2], 10);
            var date = new Date(y, m - 1, d);
            if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                $scope.dateErr = "";
            } else {
                $scope.dateErr = "Please enter a valid date";
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (mnth < 10) {
                mnth = '0' + mnth;
            }
            var dueDateToCompare = year + '-' + mnth + '-' + day+ 'T' + '00:00:00';
            var today = new Date(st);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var currentDate = yyyy + '-' + mm + '-' + dd+ 'T' + '00:00:00';
            //if (dueDateToCompare > currentDate) {
            //    var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
            //    $scope.dateErr = "";
            //} else if (dueDateToCompare == currentDate) {
            //    var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
            //    $scope.dateErr = "";
            //} else {
            //    $scope.dateErr = "Please enter a date in the future";
            //}
            var curDate = new Date(currentDate);
                var dateComp = new Date(dueDateToCompare);
                console.log(currentDate+'--------'+dueDateToCompare);
                console.log(curDate+'--------'+dateComp);
                if (dateComp < curDate) {
                    $scope.dateErr = "Please enter a date in the future";
                    error++;
                    return false;
                } else {
                    var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                    $scope.dateErr = "";
                }

            /*today date to be already selected in calendar ddp*/
            var todayTime = new Date(st);
            var monthAcademic = (todayTime.getMonth() + 1);
            var dayAcademic = (todayTime.getDate());
            var yearAcademic = (todayTime.getFullYear());
            var nextYearAcademic = (todayTime.getFullYear() + 1);
            var prevYearAcademic = (todayTime.getFullYear() - 1);

            if (monthAcademic <= 8) {
                var academicYearStartDate = prevYearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                var academicYearEndDate = yearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
            } else {
                var academicYearStartDate = yearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                var academicYearEndDate = nextYearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
            }

            var dateStart = new Date(academicYearStartDate);
            var dateEnd = new Date(academicYearEndDate);
            var dateComp = new Date(dueDateToCompare);
            //console.log(academicYearStartDate + ' ### ' + academicYearEndDate + '###' + dueDateToCompare);
            //console.log(dateStart + '---' + dateEnd + '---' + dateComp);
            //if ( !((dueDateToCompare >= academicYearStartDate) && (dueDateToCompare <= academicYearEndDate)) ) {
            if ((dateComp < dateStart) || (dateComp > dateEnd)) {
                $scope.dateErr = "Please select a date in the current academic year";
            } else {
                $scope.dateErr = "";
            }
        };


        $('#adddiv1').html('');
        /*reset file upload fields*/
        $('#fileNum').val(0);
        $('#file_size1').val(0);
        /**************************/

        /*ONCLICK SET TASK BUTTON*/
        $scope.setTask = function () {
            // var teacherId= getOnlyCookie("teacherId");
            //spinningwheel.gif loader
            //$('#loader_settask').show();
            //return false;
            $scope.myTaskStatus = 0;
            var tasktype = $('#tasktype1').val();
            var title = $.trim($('#title1').val());
            var description = $.trim($('#description1').val());
            var classId = getOnlyCookie("classId");

            var day = $('#day1').val();
            var mnth = $('#mnth1').val();
            var year = $('#year1').val();
            var StudentIds = $('#studentIdsForCreateTask').val();
            var tot_file_size = $('#file_size1').val();
            var error = 0;
            if (StudentIds == '') {
                $("#confy").click();
                $scope.message = "Please select students";
                error++;
                return false;
            }
            if (tasktype == '' || tasktype == null) {
                $scope.tasktypeErr = "Please enter Task Type";
                document.getElementById('tasktypeErr').innerHTML = "Please enter Task Type";
                error++;
                return false;
            } else {
                $scope.tasktypeErr = "";
            }
            if ($('#title1').val().toString().trim() == '') {
                $('#title1').val('');
                $("#title1").attr("placeholder", "Please enter task title").addClass('red_place');
                error++;
                return false;
            } else {
                $("#title1").attr("placeholder", "Title").removeClass('red_place');
            }

            if (title.length > 50) {
                $("#title1").attr("placeholder", "Task title must not be more than 50 characters").addClass('red_place');
                error++;
                return false;
            } else {
                $("#title1").attr("placeholder", "Title").removeClass('red_place');
            }
            //if(description==''){}
            if ($('#description1').val().toString().trim() == '') {
                $('#description1').val('');
                $("#description1").attr("placeholder", "Please enter task description").addClass('red_place');
                error++;
                return false;
            } else {
                $("#description1").attr("placeholder", "Description").removeClass('red_place');
            }
            if (description.length > 2000) {
                $("#description1").attr("placeholder", "Task description must not be more than 2000 characters").addClass('red_place');
                error++;
                return false;
            } else {
                $("#description1").attr("placeholder", "Description").removeClass('red_place');
            }
            //if (tot_file_size >5120000) {
            //    document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
            //    $("#fileErr").click();
            //    error++;
            //    return false;       
            //}
            if (day == '' || mnth == '' || year == '' || day == null || mnth == null || year == null) {
                $scope.dateErr = "Please select date";
                error++;
                return false;
            } else {
                $scope.dateErr = "";
            }

            var text = mnth + '/' + day + '/' + year;
            var curDate = '"' + mnth + '-' + day + '-' + year + '"';
            var comp = text.split('/');
            var m = parseInt(comp[0], 10);
            var d = parseInt(comp[1], 10);
            var y = parseInt(comp[2], 10);
            var date = new Date(y, m - 1, d);
            if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                $scope.dateErr = "";
            } else {
                $scope.dateErr = "Please enter a valid date";
                error++;
                return false;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (mnth < 10) {
                mnth = '0' + mnth;
            }

            var dueDateToCompare = year + '-' + mnth + '-' + day+ 'T' + '00:00:00';
            //var today = new Date();
            //var dd = today.getDate();
            //var mm = today.getMonth() + 1; //January is 0!
            //var yyyy = today.getFullYear();
            //if(day<10){
            //    day='0'+day
            //} 
            //if(mnth<10){
            //    mnth='0'+mnth
            //}
            //var text2 = mnth+'/'+day+'/'+year;
            //console.log(">>>>>>>>>>>"+text2);
            /*today date to be already selected in calendar ddp*/
            var todayTime = new Date(st);
            var monthAcademic = (todayTime.getMonth() + 1);
            var dayAcademic = (todayTime.getDate());
            var yearAcademic = (todayTime.getFullYear());
            var nextYearAcademic = (todayTime.getFullYear() + 1);
            var prevYearAcademic = (todayTime.getFullYear() - 1);

            if (monthAcademic <= 8) {
                var academicYearStartDate = prevYearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                var academicYearEndDate = yearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
            } else {
                var academicYearStartDate = yearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                var academicYearEndDate = nextYearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
            }
            var today = new Date(st);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            var dateStart = new Date(academicYearStartDate);
            var dateEnd = new Date(academicYearEndDate);
            var dateComp = new Date(dueDateToCompare);
            var currentDate = yyyy + '-' + mm + '-' + dd + 'T' + '00:00:00';
            var curDate = new Date(currentDate);
            console.log(dueDateToCompare + ' $$$$ ' + curDate);
            console.log(dateComp + ' $$$$ ' + curDate);
            //return false;
            if (dateComp < curDate) {
                $scope.dateErr = "Please enter a date in the future";
                error++;
                return false;
            } else {
                var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                $scope.dateErr = "";
            }
            //console.log(academicYearStartDate + ' ### ' + academicYearEndDate + '###' + dueDateToCompare);
            //console.log(dateStart + '---' + dateEnd + '---' + dateComp);
            //if ( !((dueDateToCompare >= academicYearStartDate) && (dueDateToCompare <= academicYearEndDate)) ) {
            if ((dateComp < dateStart) || (dateComp > dateEnd)) {
                $scope.dateErr = "Please select a date in the current academic year";
                error++;
                return false;
            } else {
                $scope.dateErr = "";
            }


            if (error == 0) {
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content").css("display", "block");
                $("#preloader_right_content").css("display", "block");

                document.getElementById("setTaskBtn").disabled = true;
                var nothing = "";
                //$('#studentIdsForCreateTask').val(nothing);

                fromDate = new Date(text);
                fromDateTime = fromDate.getTime();
                var weekDay = fromDate.getDay();
                if (weekDay == 0) {
                    var weekStart = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6)));
                    var weekEnd = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)))));
                } else {
                    var weekStart = $scope.ISOdateConvertion(((((fromDateTime - (fromDate.getDay() * 86400000)) + 86400000))));
                    var weekEnd = $scope.ISOdateConvertion(((((fromDateTime - (fromDate.getDay() * 86400000)) + (86400000 * 7)))));
                }
                var k = 0;
                $(".file_attachment_class1").each(function () {
                    var file_attachment_id = $.trim($(this).attr('id')).replace("file_attachment1", "");
                    if (($('#individual_file_size1' + file_attachment_id).val() != 0) &&
                       ($('#individual_file_size1' + file_attachment_id).val() != '') &&
                       ($('#individual_file_size1' + file_attachment_id).val() != undefined) &&
                       ($('#individual_file_size1' + file_attachment_id).val() != 'undefined')) {
                        k++;
                    }
                });

                if (k != 0) {
                    //$("#myTask").on("click");
                    //$("#myTaskInner").on("click");
                    var values = $('#uploadFile').val();
                    homeService.fileUpload(access_token, function (fileUploadResponse) {
                        //console.log("CTRL RESPONSE");
                        //console.log(fileUploadResponse);
                        $scope.fileUploadResponse = fileUploadResponse;
                        // console.log(JSON.parse(fileUploadResponse));
                        homeService.setTaskResponse(access_token, StudentIds, tasktype, title, description, classId, dueDate, fileUploadResponse, function (response) {
                            console.log("SET TASK W3");
                            console.log(response);
                            document.getElementById("setTaskBtn").disabled = false;
                            if (response > 0) {
                                $scope.successMsg1 = 'Task successfully set';
                                $('#successMsg1').click();
                                $("#taskCreateReset").click();
                                $scope.countSelectStudentsTask = 0;
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content").css("display", "none");
                                $("#preloader_right_content").css("display", "none");
                                setTimeout(function () {
                                    setOnlyCookie("weekStartDate", weekStart, 60 * 60 * 60);
                                    setOnlyCookie("weekEndDate", weekEnd, 60 * 60 * 60);
                                    $scope.toggle_status_my_task = "tab";
                                    $("#myTask").click();
                                }, 500);
                            } else {
                                $scope.successMsg1 = 'Task not set';
                                $('#successMsg1').click();
                                $("#taskCreateReset").click();
                                $scope.countSelectStudentsTask = 0;
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content").css("display", "none");
                                $("#preloader_right_content").css("display", "none");
                            }
                            setTimeout(function () {
                                $('.modal-backdrop').hide(); // for black background
                                $('body').removeClass('modal-open'); // For scroll run
                                $('#successMsg_modal1').modal('hide');
                                $("#highlightRow"+response).css("background-color", "rgba(84, 201, 232, 0.2)");
                                // $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                            }, 1000);

                            setTimeout(function () {
                                $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                            }, 1500);
                        });
                    });
                } else {
                    var fileUploadResponse = null;
                    homeService.setTaskResponse(access_token, StudentIds, tasktype, title, description, classId, dueDate, fileUploadResponse, function (response) {
                        console.log("SET TASK W3");
                        console.log(response);
                        document.getElementById("setTaskBtn").disabled = false;
                        if (response > 0) {
                            //$('#loader_settask').hide();
                            $scope.successMsg1 = 'Task successfully set';
                            $('#successMsg1').click();
                            $("#taskCreateReset").click();
                            $scope.countSelectStudentsTask = 0;
                            setTimeout(function () {
                                setOnlyCookie("weekStartDate", weekStart, 60 * 60 * 60);
                                setOnlyCookie("weekEndDate", weekEnd, 60 * 60 * 60);
                                $scope.toggle_status_my_task = "tab";
                                $("#myTask").click();
                            }, 200);
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content").css("display", "none");
                            $("#preloader_right_content").css("display", "none");
                        } else {
                            $scope.successMsg1 = 'Task not set';
                            $('#successMsg1').click();
                            $("#taskCreateReset").click();
                            $scope.countSelectStudentsTask = 0;
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content").css("display", "none");
                            $("#preloader_right_content").css("display", "none");
                        }
                        setTimeout(function () {
                            $('.modal-backdrop').hide(); // for black background
                            $('body').removeClass('modal-open'); // For scroll run
                            $('#successMsg_modal1').modal('hide');
                            $("#highlightRow"+response).css("background-color", "rgba(84, 201, 232, 0.2)");
                            //$('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                        }, 1000);
                        setTimeout(function () {
                                $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                            }, 1500);
                    });
                }
            }
        };


        //var AttachmentCount = $('#file_attachment1').val();
        //$scope.AttachmentCount = AttachmentCount + 1;
        //$scope.removeAttachmentCreateTask = function(val)
        //{
        //   //$scope.files.splice(attachmentName,1);
        //  
        //    $("#attachmentCreateTask"+val).remove();
        //    var fileNum=parseInt($('#fileNum').val())-1;
        //    $('#fileNum').val(fileNum);
        //   
        //};

        var dynamicId = 0;
        $scope.attach = function () {
            var fileNum = parseInt($('#fileNum').val());
            if (fileNum < 4) {
                fileNum = fileNum + 1;
                $('#fileNum').val(fileNum);
                dynamicId++;
                $('#adddiv1').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentCreateTask' + (dynamicId - 1) + '"><div class="pdf_left attachmentEditNew w3attach"><input id="file_attachment1' + (dynamicId - 1) + '" type="file" class="upload file_attachment_class1" style="cursor: pointer;opacity: 0;position: absolute;" onclick="file_upload1(' + (dynamicId - 1) + ');" /><label class="file_div attc" for="file_attachment1' + (dynamicId - 1) + '"><a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span1' + (dynamicId - 1) + '">Choose file..</span></a></label></div><span onclick="removeAttachmentCreateTask(' + (dynamicId - 1) + ');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span><input type="hidden" id="individual_file_size1' + (dynamicId - 1) + '" value="0" class="indiFsize"></div>');
                $("#file_attachment1" + (dynamicId - 1)).click();
            } else {
                document.getElementById('fileUploadErrMsg').innerHTML = "Maximum 4 attachments are permitted";
                $("#fileErr").click();
            }
            if (fileNum == 1) {
                $('#attach_pic1').css("display", "none");
                $('#add_more').css("display", "block");
            }
        };

    };

    /************************   ***** SEND MESSAGE SECTION *****  ****************************************/
    /*SELECT STUDENT CHECKBOX IN MESSAGE SECTION*/
    $scope.sendMessage = function (ClassId, ClassName, SubjectName)
    {
        if ($scope.ParentMessaging)
        {
        
        ///LOADER HIDE
        $(window).scrollTop(0);
        // changed 12 t0 13 content for loader in message details sections
        $("#status_right_content13").show();
        $("#preloader_right_content13").show();
        $("#performance_print_span").css("display", "none");
        /*fetch student list*/
        $scope.classId = ClassId;
        $scope.className = ClassName;
        $scope.subject = SubjectName;
        setOnlyCookie("classId", ClassId, 60 * 60 * 60);
        $('#studentIdsForMessage').val('');

        homeService.studentListResponse(access_token, ClassId, function (response) {
            //console.log('STUDENT LIST');
            //console.log(response);


            if (response.status) {
                if (response != '') {
                    // $('.showStudentDiv').show();
                    // $('#noRecord3').removeClass('noRecord');
                    $scope.studentListmsg = response;
                    $scope.noOfStudents = response.length;
                    $scope.IsUnlocked = response.IsUnlocked;
                    $scope.nostudentList = "";
                    $scope.nostudentList1 = "";
                    $scope.nostudentList2 = "";
                    $scope.nostudentList3 = "";
                    $scope.nostudentList4 = "";
                    $scope.studentListMessage = '';
                    $('#remember').removeAttr('checked');

                    ///LOADER HIDE
                    // Added By Krishna On 03.02.17 Start
                        // console.log(response);
                        $(window).scrollTop(0);
                        $("#status_right_content13").hide();
                        $("#preloader_right_content13").hide();
                        $('.showStudentDiv').show();
                        $('#noRecord3').removeClass('noRecord');
                        // console.log(response);
                    // Added By Krishna On 03.02.17 Ends

                } else {
                    $('.showStudentDiv').hide();
                    $('#noRecord3').addClass('noRecord');
                    $scope.studentListmsg = "";
                    $scope.noOfStudents = 0;
                    $scope.IsUnlocked = '';
                    $scope.nostudentList = "No Students Found… ";
                    $scope.nostudentList1 = "Try: ";
                    $scope.nostudentList2 = "1. Reload the webpage.";
                    $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                    $scope.nostudentList4 = "here.";
                    ///LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content13").hide();
                    $("#preloader_right_content13").hide();
                }
                $(".studentListInMessageCheckbox").removeAttr('checked');
            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content13").hide();
                $("#preloader_right_content13").hide();
                $("#confy1").click();
                $scope.msg = 'Server failed to respond. Please check your internet connection.';

                $('.showStudentDiv').hide();
                $('#noRecord3').addClass('noRecord');
                $scope.studentListmsg = "";
                $scope.noOfStudents = 0;
                $scope.IsUnlocked = '';
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentList4 = "here.";
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content13").hide();
                $("#preloader_right_content13").hide();
            } else {
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content13").hide();
                $("#preloader_right_content13").hide();

                $('.showStudentDiv').hide();
                $('#noRecord3').addClass('noRecord');
                $scope.studentListmsg = "";
                $scope.noOfStudents = 0;
                $scope.IsUnlocked = '';
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentList4 = "here.";
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content13").hide();
                $("#preloader_right_content13").hide();
            }
            $timeout(function () {
                $(".studentListInMessageCheckbox").removeAttr('checked');
            }, 200);
        });

        homeService.predefinedMessagesResponse(access_token, function (response) {
            //console.log('PREDEFINED MESSAGES LIST');
            //console.log(response);
            if (response.status) {
                if (response != '') {
                    $('#pre_msg').show();
                    $scope.predefinedMessages = response;
                    $scope.errorMsg = "";
                } else {
                    $('#pre_msg').hide();
                    $scope.predefinedMessages = "";
                    $scope.errorMsg = "No predefined messages found.";
                }
            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                $('#pre_msg').hide();
                $scope.predefinedMessages = "";
                $scope.errorMsg = "No predefined messages found.";
            } else {
                $('#pre_msg').hide();
                $scope.predefinedMessages = "";
                $scope.errorMsg = "No predefined messages found.";
            }
        });

        $scope.countSelectStudentsMessage = 0;
        $scope.eachMessageClick = function (student_id) {
            /*for active class :: click on each check box*/
            var attr = $("#studentMessage" + student_id).prop('checked');
            if (attr == true) {
                setTimeout(function () {
                    $('#studentMessage' + student_id).attr('checked', "true");
                }, 100);
                $('#studentListInMessage' + student_id).addClass('active');
            } else {
                setTimeout(function () {
                    $('#studentMessage' + student_id).removeAttr('checked');
                }, 100);
                $('#studentListInMessage' + student_id).removeClass('active');
            }

            var studentIds = new Array();
            var i = 0;
            $("input[type=checkbox]:checked").each(function () {
                if ($(this).attr("studentIdMessage") != undefined) {
                    studentIds[i] = $(this).attr("studentIdMessage");
                    $("#studentListInMessage" + studentIds[i]).addClass('active');
                    i++;
                }
            });
            var numberOfChecked = $('input:checkbox.studentListInMessageCheckbox:checked').length;
            var totalCheckboxes = $('input:checkbox.studentListInMessageCheckbox').length;
            //console.log(studentIds.length+"###"+totalCheckboxes);
            if (studentIds.length != totalCheckboxes) {
                $('#remember').prop('checked', false);
            } else {
                $('#remember').prop('checked', true);
            }
            $scope.countSelectStudentsMessage = studentIds.length;
            //$scope.studentIdsForMessage = studentIds.toString();
            document.getElementById('studentIdsForMessage').value = studentIds.toString();
        };
        
        $scope.allMessageClick = function () {
            var studentIds = new Array();
            var i = 0;
            if (document.getElementById('remember').checked == true) {
                $("input[name='studentListInMessageCheckbox[]']").each(function () {
                    if ($(this).attr("studentIdMessage") != undefined) {
                        studentIds[i] = $(this).attr("studentIdMessage");
                        $("#studentListInMessage" + studentIds[i]).addClass('active');
                        var attr = $("#studentMessage" + studentIds[i]).attr('checked');
                        // For some browsers, `attr` is undefined; for others,
                        // `attr` is false.  Check for both.
                        if (typeof attr == typeof undefined || attr == false) {
                            $("#studentMessage" + studentIds[i]).attr("checked", "true");
                            $("#studentMessage" + studentIds[i]).prop("checked", true);
                        }
                        i++;
                    }
                });
                //$(".studentListInMessageCheckbox").attr("checked", "true");
                //$(".user_box").addClass("active");
                //$scope.studentIdsForMessage = studentIds.toString();
                document.getElementById('studentIdsForMessage').value = studentIds.toString();
            } else {
                $("input[name='studentListInMessageCheckbox[]']").each(function () {
                    if ($(this).attr("studentIdMessage") != undefined) {
                        studentIds[i] = $(this).attr("studentIdMessage");
                        $("#studentListInMessage" + studentIds[i]).addClass('active');
                        var elm = $("#studentListInMessage" + studentIds[i]);

                        $("#studentMessage" + studentIds[i]).attr("checked", "false");
                        $("#studentMessage" + studentIds[i]).prop("checked", false);

                        i++;
                    }
                });
                $(".studentListInMessageCheckbox").removeAttr('checked');
                $(".user_box").removeClass("active");
                //$scope.studentIdsForMessage = "";
                document.getElementById('studentIdsForMessage').value = "";
            }
            var numberOfChecked = $('input:checkbox.studentListInMessageCheckbox:checked').length;
            var totalCheckboxes = $('input:checkbox.studentListInMessageCheckbox').length;
            $scope.countSelectStudentsMessage = numberOfChecked;
        };

        $scope.predefinedMessageDisplay = function (msg) {
            $('#message1').val(function (_, val) {
                return val + msg;
            });
        };
        $("#message1").mousedown(function () {
            $("#message1").attr("placeholder", "Please enter message").removeClass('red_place');
        });
        /*ONCLICK SEND MESSAGE BUTTON*/
        $scope.sendMessageBtnClick = function () {
            var message = $('#message1').val();
            var StudentIds = $('#studentIdsForMessage').val();
            var error = 0;
            if (StudentIds == '') {
                $("#confy").click();
                $scope.message = "Please select students";
                error++;
                return false;
            }
            if ($('#message1').val().toString().trim() == '') {
                $('#message1').val('');
                $("#message1").attr("placeholder", "Please enter message").addClass('red_place');
                error++;
                return false;
            } else {
                $("#message1").attr("placeholder", "Type Message Here").removeClass('red_place');
            }
            if (message.length > 1000) {
                $("#message1").attr("placeholder", "Message must not be more than 1000 characters").addClass('red_place');
                error++;
                return false;
            } else {
                $("#message1").attr("placeholder", "Type Message Here").removeClass('red_place');
            }
            if (error == 0) {
                document.getElementById("sendMessageBtn").disabled = true;
                /////LOADER SHOW
                //$(window).scrollTop(0);
                //$("#status_right_content1").css("display", "block");
                //$("#preloader_right_content1").css("display", "block");
                homeService.studentParentMessageSend(access_token, StudentIds, ClassId, message, function (response) {
                    //console.log("studentParentMessageSend");
                    //console.log(response);
                    document.getElementById("sendMessageBtn").disabled = false;
                    if (response == true) {
                        ///LOADER HIDE
                        //$(window).scrollTop(0);
                        //$("#status_right_content1").fadeOut();
                        //$("#preloader_right_content1").delay(200).fadeOut("slow");
                        $(".studentListInMessageCheckbox").removeAttr('checked');
                        $(".user_box").removeClass('active');
                        $("#remember").removeAttr('checked');
                        $scope.successMsg1 = 'Message successfully sent';
                        $('#successMsg1').click();
                        $("#messageReset").click();
                    } else {
                        ///LOADER HIDE
                        //$(window).scrollTop(0);
                        //$("#status_right_content1").fadeOut();
                        //$("#preloader_right_content1").delay(200).fadeOut("slow");
                        $scope.successMsg1 = 'Message not sent';
                        $('#successMsg1').click();
                        $("#messageReset").click();
                    }
                    setTimeout(function () {
                        $('.modal-backdrop').hide(); // for black background
                        $('body').removeClass('modal-open'); // For scroll run
                        $('#successMsg_modal1').modal('hide');
                    }, 1500);
                });

                $('.studentListInMessageCheckbox').attr('checked', "false");
                $('.studentListInMessageCheckbox').prop('checked', false);
                $('#remember').attr('checked', "false");
                $('#remember').prop('checked', false);
                $(".studentListInMessageCheckbox").removeAttr('checked');
                $('#studentIdsForMessage').val('');
                $scope.countSelectStudentsMessage = 0;
            }
        };
        }else{
            //$('#supportfeature').click();
        }
    };

    //removing the validation error of task type dropdown field of create task on mouse click
    $scope.onCategoryChange1 = function () {
        $('#tasktypeErr').html('');
        var tasktype1 = $('#tasktype1').val();
        if (tasktype1 == '' || tasktype1 == null) {
            $scope.tasktypeErr = "Please select task type";
            return false;
        } else {
            $scope.tasktypeErr = "";
        }
    }

    //removing the validation error of title field of create task on mouse click
    $("#title1").mousedown(function () {
        $("#title1").attr("placeholder", "Title").removeClass('red_place');
    });

    //removing the validation error of decsription field of create task on mouse click
    $("#description1").mousedown(function () {
        $("#description1").attr("placeholder", "Description").removeClass('red_place');
    });


    /************************   ***** PERFORMANCE SECTION (MY CLASSES)*****  ****************************************/

    /*FOR PERFORMANCE TABBING (CLASSWISE)*/
    $scope.classPerformance = function (ClassId, ClassName, SubjectName) {
        ///LOADER HIDE
        $(window).scrollTop(0);
        $("#status_right_content13").show();
        $("#preloader_right_content13").show();
        $("#performance_print_span").css("display", "block");

        $("#performance_print").css("display", "none");  // added by krishna 

        $scope.classId = ClassId;
        $scope.className = ClassName;
        $scope.subject = SubjectName;
        setOnlyCookie("classId", ClassId, 60 * 60 * 60);
        $scope.graph_screenshot = function () {
            document.getElementById('printpreloader').style.display='block';
            var restorepage = document.body.innerHTML;
            var close = $(".close").html();
            var print_div = $(".print_div").html();

            $(".close").hide();
            $(".print_div").hide();
            var printcontent = document.getElementById("student_performance").innerHTML;
            
            printcontent = printcontent.replace(/fa fa-caret-up pop-col/g, 'fa fa-caret-up pi-print-stud-srch');
            
            printcontent = printcontent.replace(/aria-hidden="true"/g, '');

            printcontent = printcontent.replace(/pi-green-two/g, 'fa fa-caret-up pi-print-stud-srch');

            $(".close").show();
            $(".print_div").show();
            
            // document.body.innerHTML = printcontent;
            // window.print();
            // document.body.innerHTML = restorepage;


            /*###########################  Print functionality with Popup Start Here  ########################*/
            var popupWin = window.open('', '_blank', 'width=1000,height=600');
            //var popupWin = window.open('', 'printwindow');
            popupWin.document.open();
            popupWin.document.write('<html><head>');
            //popupWin.document.write('<link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>');

            popupWin.document.write('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>');
            //// popupWin.document.write('<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>'); 
            
            popupWin.document.write('<link href="css/custom.css" rel="stylesheet" type="text/css"/>');

            // popupWin.document.write('<script src="app/controller/homeCtrl.js></script>');
            // popupWin.document.write('<link href="css/responsive.css" rel="stylesheet" type="text/css"/>');
            popupWin.document.write('<link href="css/developer.css" rel="stylesheet" type="text/css"/>');
            
            popupWin.document.write('<link href="css/developer_print.css" rel="stylesheet" type="text/css"/>');
            popupWin.document.write('</head>');
            // popupWin.document.write('<body onload="window.print()">');
            popupWin.document.write('<body>');


            // printcontenthead = student_post_text+'<br><div class="performance-table-th print_hd" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Student</div><div class="performance-table-th ng-binding print_hd" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Attendance</div><div class="print_hd performance-table-th ng-binding" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Target</div><div class="print_hd performance-table-th ng-binding" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Grade</div>';


            popupWin.document.write('<div style="/*margin-left: 5%;*/ /*border: 1px solid #bebebe;*/" class="print_page">' + printcontent + '</div>');
            popupWin.document.write('<script>setTimeout(function(){ window.print();},3000); </script>');
            popupWin.document.write('</body></html>');
            popupWin.document.close();

            //popupWin.document.focus();
            /*popupWin.PPClose = false;                                     // Clear Close Flag
            popupWin.onbeforeunload = function(){                         // Before Window Close Event
                if(popupWin.PPClose === false){
                    alert('false');// Close not OK?
                    return 'Leaving this page will block the parent window!\nPlease select "Stay on this Page option" and use the\nCancel button instead to close the Print Preview Window.\n';
                }
            }  */                                                              // Print preview
             popupWin.PPClose = true; 
            /*###########################  Print functionality with Popup Ends Here  ########################*/

            // $(".close").html(close);
            // $(".print_div").html(print_div);

            // $(".close").show();
            // $(".print_div").show();

                                    popupWin.onunload = function(){
                console.log('closed!');
                document.getElementById('printpreloader').style.display='none';
               }
        };
        setTimeout(function () {
            homeService.performanceListResponse(access_token, ClassId, function (response) {
                //console.log('----------:::PERFORMANCE::::----------');
                //console.log(response);
                if (response.status) {
                    if (response != '') {
                        $('.showStudentDiv').show();
                        console.log("performanceList");
                        console.log(response);
                        $scope.performanceList = response;
                        $scope.noOfStudents = response.length;
                        $scope.studentListMessagePerformance = "";
                        $scope.studentListMessagePerformance1 = "";
                        $scope.studentListMessagePerformance2 = "";
                        $scope.studentListMessagePerformance3 = "";
                        $scope.studentListMessagePerformance4 = "";
                        $('#noRecord1').removeClass('noRecord');
                        //LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content13").hide();
                        $("#preloader_right_content13").hide();
                        $("#performance_print").css("display", "block");  // added by krishna 
                    } else {
                        $('.showStudentDiv').hide();
                        $scope.performanceList = '';
                        $scope.noOfStudents = 0;
                        //  $scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                        $scope.studentListMessagePerformance = "No Students Found… ";
                        $scope.studentListMessagePerformance1 = "Try: ";
                        $scope.studentListMessagePerformance2 = "1. Reload the webpage.";
                        $scope.studentListMessagePerformance3 = "2. If the problem persists, please submit your query";
                        $scope.studentListMessagePerformance4 = "here.";
                        $('#noRecord1').addClass('noRecord');
                        //LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content13").hide();
                        $("#preloader_right_content13").hide();
                    }
                    $(".showStudentDiv ").mCustomScrollbar("update");

                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    $('.showStudentDiv').hide();
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $scope.performanceList = '';
                    $scope.noOfStudents = 0;
                    //$scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                    $scope.studentListMessagePerformance = "No Students Found… ";
                    $scope.studentListMessagePerformance1 = "Try: ";
                    $scope.studentListMessagePerformance2 = "1. Reload the webpage.";
                    $scope.studentListMessagePerformance3 = "2. If the problem persists, please submit your query";
                    $scope.studentListMessagePerformance4 = "here.";
                    $('#noRecord1').addClass('noRecord');
                    //LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content13").hide();
                    $("#preloader_right_content13").hide();
                } else {
                    $('.showStudentDiv').hide();
                    $scope.performanceList = '';
                    $scope.noOfStudents = 0;
                    //$scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                    $scope.studentListMessagePerformance = "No Students Found… ";
                    $scope.studentListMessagePerformance1 = "Try: ";
                    $scope.studentListMessagePerformance2 = "1. Reload the webpage.";
                    $scope.studentListMessagePerformance3 = "2. If the problem persists, please submit your query";
                    $scope.studentListMessagePerformance4 = "here.";
                    $('#noRecord1').addClass('noRecord');
                    //LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content13").hide();
                    $("#preloader_right_content13").hide();
                }
            });

        }, 200);

        /* STUDENT GRAPH POP UP */
        $scope.studentPerformance = function (studentId, Name, Image, Attendance, TargetGrade, LastGrade, AttendanceTrend, TargetTrend, GradeTrend, AttendanceUnit, TargetUnit, GradeUnit, IsUnlocked, HeaderCol1, HeaderCol2, HeaderCol3) {
            if ($scope.PerformanceGraph) {
               
            //code form svg image
            setTimeout(function () {
                if (parseInt($('#carbs-input').val()) <= 100 && parseInt($('#carbs-input').val()) >= 0) {
                    $percent = parseInt(($('#carbs-input').val() * 22.1));
                    $('#carbs1').css({ 'stroke-dashoffset': 2210 - $percent });
                    $('#carbs2').css({ 'stroke-dashoffset': 2210 - $percent });
                    $('#carbs3').css({ 'stroke-dashoffset': 2210 - $percent });
                } else {
                    $('#carbs-input').val('');
                }
            }, 500);

            $scope.ClassName = ClassName;
            $scope.SubjectName = SubjectName;
            $scope.Name = Name;
            //$scope.Lastname = Lastname;
            $scope.Image = Image;
            if (IsUnlocked == 1) {
                $scope.IsUnlocked = "outer_border";
            } else {
                $scope.IsUnlocked = "";
            }
            $scope.Attendance = Attendance;
            $scope.TargetGrade = TargetGrade;
            $scope.LastGrade = LastGrade;
            $scope.AttendanceTrend = AttendanceTrend;
            $scope.TargetTrend = TargetTrend;
            $scope.GradeTrend = GradeTrend;
            $scope.AttendanceUnit = AttendanceUnit;
            $scope.TargetUnit = TargetUnit;
            $scope.GradeUnit = GradeUnit;

            $scope.HeaderCol1 = HeaderCol1;
            $scope.HeaderCol2 = HeaderCol2;
            $scope.HeaderCol3 = HeaderCol3;

            if (GradeTrend == 1) {
                $scope.plotcolor = "#5BD9A4"; //green
            } else if (GradeTrend == 3) {
                $scope.plotcolor = "#FF5958"; //red
            } else if (GradeTrend == 2) {
                $scope.plotcolor = "orange";
            } else if (GradeTrend == 0 || GradeTrend == null || GradeTrend == "null" || GradeTrend == undefined) {
                $scope.plotcolor = "#111111";
            }
            /////LOADER SHOW
            $(window).scrollTop(0);
            $("#status_right_content7").css("display", "block");
            $("#preloader_right_content7").css("display", "block");

            homeService.studentPerformanceListResponse(access_token, ClassId, studentId, function (response) {
                //console.log('PERFORMANCE STUDENT');
                //console.log(response);
                if (response.status) {
                    /////LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content7").css("display", "none");
                    $("#preloader_right_content7").css("display", "none");
                    if (response != '') {
                        $scope.studentPerformanceList = response;
                        //$scope.studentListMessagePopup = '';
                        //$('.noRecordClass').removeClass('noRecord');
                        GradeSetCode = new Array();
                        GradeSetValue = new Array();
                        GradeResultsDate = new Array();
                        GradeResultsGrade = new Array();
                        GradeResultsName = new Array();
                        Grade_and_Date = new Array();
                        GradeResultsDateTime = new Array();
                        GradeResultsSplit = new Array();
                        GradeResultsYear = new Array();
                        GradeResultsMnth = new Array();
                        GradeResultsDay = new Array();
                        GradeResultsGraphDate = new Array();
                        GradeResultsDateTimeYaxis = new Array();

                        TargetGradeDate = new Array();
                        TargetGradeDateSplit = new Array();
                        TargetGradeDatePlot = new Array();
                        TargetGradeGradePlot = new Array();
                        TargetGradeDatePlotYear = new Array();
                        TargetGradeDatePlotMnth = new Array();
                        TargetGradeDatePlotDay = new Array();
                        TargetGradeResultsGrade = new Array();

                        XaxisGradesDate = new Array();
                        XaxisGradesDateSplit = new Array();
                        XaxisGradesDatePlotYear = new Array();
                        XaxisGradesDatePlotMnth = new Array();
                        XaxisGradesDatePlotDay = new Array();
                        XaxisGradesGradePlot = new Array();
                        XaxisGradesResultsGrade = new Array();

                        for (var i = 0; i < response.GradeSet.length; i++) {
                            GradeSetCode[i] = response.GradeSet[i].Code;
                            GradeSetValue[i] = response.GradeSet[i].Value;
                        }
                        for (var j = 0; j < response.GradeResults.length; j++) {
                            GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                            GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                            GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                            GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]);
                            GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);

                            GradeResultsGraphDate[j] = GradeResultsYear[j] + ',' + GradeResultsMnth[j] + ',' + GradeResultsDay[j];

                            GradeResultsGrade[j] = response.GradeResults[j].Grade;
                            GradeResultsName[response.GradeResults[j].Date] = response.GradeResults[j].Name;

                            GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j] + "," + GradeResultsMnth[j] + "," + GradeResultsDay[j]);
                        }
                        for (var k = 0; k < response.TargetGrades.length; k++) {
                            TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);
                            TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                            TargetGradeDatePlotYear[k] = parseInt(TargetGradeDateSplit[k][0]);
                            TargetGradeDatePlotMnth[k] = parseInt(TargetGradeDateSplit[k][1]);
                            TargetGradeDatePlotDay[k] = parseInt(TargetGradeDateSplit[k][2]);
                            TargetGradeDatePlot[k] = Date.UTC(TargetGradeDatePlotYear[k], TargetGradeDatePlotMnth[k], TargetGradeDatePlotDay[k]);
                            TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;
                        }

                        /*calculation of academic year*/
                        var todayTime = new Date(st);
                        var monthAcademic = (todayTime.getMonth() + 1);
                        var dayAcademic = (todayTime.getDate());
                        var yearAcademic = (todayTime.getFullYear());
                        var nextYearAcademic = (todayTime.getFullYear() + 1);
                        var prevYearAcademic = (todayTime.getFullYear() - 1);

                        if (monthAcademic <= 8) {
                            //alert(1);
                            var academicYearStartDate = prevYearAcademic + '-' + '9' + '-' + '1';
                            var academicYearEndDate = yearAcademic + '-' + '8' + '-' + '31';
                        } else {
                            //alert(2);
                            var academicYearStartDate = yearAcademic + '-' + '9' + '-' + '1';
                            var academicYearEndDate = nextYearAcademic + '-' + '8' + '-' + '31';
                        }

                        //var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                        //var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';

                        var current_date = yearAcademic + '-' + monthAcademic + '-' + dayAcademic;

                        if ((current_date >= academicYearStartDate)) {
                            var currentAcademicYear1 = yearAcademic;
                            var currentAcademicYear2 = yearAcademic + 1;
                        } else {
                            var currentAcademicYear1 = yearAcademic - 1;
                            var currentAcademicYear2 = yearAcademic;
                        }

                        //console.log(currentAcademicYear1 + ' #### ' + currentAcademicYear2);
                        console.log('GRAPH RESPONSE');
                        console.log(response);

                        var TargetGradeDateTimeXaxisPlot = [];
                        var openTooltips = [];
                        $('#graph_container').css({ 'display': 'block' });
                        //////////  PERFORMANCE GRAPH BEGIN /////////////////
                        $(document).ready(function () {
                            $('#graph_container').highcharts({
                                exporting: { enabled: false },
                                chart: {
                                    type: 'line'
                                },
                                title: {
                                    text: '<h2><b>Performance Graph</b></h2>'
                                },
                                xAxis: {
                                    type: 'datetime',
                                    title: {
                                        text: 'Month'
                                    },
                                    //dateTimeLabelFormats: { 
                                    //    month: '%b %Y',
                                    //    
                                    //},
                                    //categories: (function () {                                     
                                    //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                    //                {
                                    //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                    //                    return GradeResultsDateTimeYaxis[r];
                                    //                }
                                    //            }()),
                                    labels: {
                                        format: '{value:%b %Y}',
                                        style: {
                                            fontWeight: 'bold'
                                        }
                                    },
                                    gridLineWidth: 1,
                                },
                                yAxis: {
                                    min: 0,
                                    // tickInterval: 1,
                                    labels: {
                                        formatter: function () {
                                            if (GradeSetCode[this.value] != undefined) {
                                                return '<b>' + GradeSetCode[this.value] + '</b>';
                                            }
                                        }
                                    },
                                    //categories: GradeSetCode,
                                    title: {
                                        text: HeaderCol3
                                    },
                                    //linkedTo: 0,
                                    //from: GradeSetCode[0]
                                },
                                plotOptions: {
                                    //spline: {
                                    //    marker: {
                                    //        enabled: true,
                                    //        radius: 3,
                                    //    },
                                    //},
                                    scatter: {
                                        lineWidth: 2,
                                    },
                                    series: {
                                        pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                        pointInterval: 15 * 24 * 3600 * 1000// one day
                                    }
                                },
                                tooltip: {
                                    useHTML: true,
                                    formatter: function () {
                                        var tooltiptxt = '';
                                        if (this.series.name == HeaderCol3) {
                                            //tooltiptxt = '<b>' + GradeResultsName[this.y] + '</b><br> ' + HeaderCol3 + ' ' + GradeSetCode[this.y] + ', ' + Highcharts.dateFormat('%e %b %Y', new Date(this.x));
                                             tooltiptxt = '<b>' + GradeResultsName[Highcharts.dateFormat('%Y-%m-%dT00:00:00', new Date(this.x))] + '</b><br> ' + HeaderCol3 + ' ' + GradeSetCode[this.y] + ', ' + Highcharts.dateFormat('%e %b %Y', new Date(this.x));
                                            return tooltiptxt;
                                        } else {
                                            return false;
                                        }
                                    },
                                    shared: false,
                                    backgroundColor: $scope.plotcolor,
                                    style: {
                                        color: 'white'
                                    },
                                },
                                legend: {
                                    enabled: false
                                },

                                series: [
                                    {
                                        name: 'XaxisGrades',
                                        color: '#FFF',
                                        data: (function () {
                                            var data2 = [];
                                            for (var m = 0; m < response.XaxisGrades.length; m++) {
                                                XaxisGradesDate[m] = convertDate(response.XaxisGrades[m].Date);
                                                XaxisGradesDateSplit[m] = XaxisGradesDate[m].split('-');
                                                XaxisGradesDatePlotYear[m] = parseInt(XaxisGradesDateSplit[m][0]);
                                                XaxisGradesDatePlotMnth[m] = parseInt(XaxisGradesDateSplit[m][1]);
                                                XaxisGradesDatePlotDay[m] = parseInt(XaxisGradesDateSplit[m][2]);
                                                XaxisGradesGradePlot[m] = response.XaxisGrades[m].Grade;
                                                XaxisGradesResultsGrade[m] = response.XaxisGrades[m].Grade;
                                                data2.push({
                                                    x: Date.UTC(XaxisGradesDatePlotYear[m], (XaxisGradesDatePlotMnth[m] - 1), XaxisGradesDatePlotDay[m]),
                                                    y: GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                });
                                            }
                                            return data2;
                                        }()),
                                        marker: {
                                            enabled: false,
                                            states: {
                                                hover: {
                                                    enabled: false
                                                }
                                            }
                                        },
                                    },

                                    {
                                        name: 'Target',
                                        color: '#48CAE5',
                                        data: (function () {
                                            var data1 = [];
                                            for (var m = 0; m < response.TargetGrades.length; m++) {
                                                TargetGradeDate[m] = convertDate(response.TargetGrades[m].Date);
                                                TargetGradeDateSplit[m] = TargetGradeDate[m].split('-');
                                                TargetGradeDatePlotYear[m] = parseInt(TargetGradeDateSplit[m][0]);
                                                TargetGradeDatePlotMnth[m] = parseInt(TargetGradeDateSplit[m][1]);

                                                TargetGradeDatePlotDay[m] = parseInt(TargetGradeDateSplit[m][2]);
                                                //TargetGradeGradePlot[m]     = m;
                                                TargetGradeGradePlot[m] = response.TargetGrades[m].Grade;
                                                TargetGradeResultsGrade[m] = response.TargetGrades[m].Grade;
                                                data1.push({
                                                    //x:Date.UTC(TarYr[m],TarMn[m],TarD[m]),
                                                    //y:dataArray[m],
                                                    x: Date.UTC(TargetGradeDatePlotYear[m], (TargetGradeDatePlotMnth[m] - 1), TargetGradeDatePlotDay[m]),
                                                    y: GradeSetCode.indexOf(TargetGradeGradePlot[m]),
                                                });
                                            }
                                            return data1;
                                        }()),
                                        marker: {
                                            enabled: false,
                                            states: {
                                                hover: {
                                                    enabled: false
                                                }
                                            }
                                        },
                                    },

                                    {
                                        name: HeaderCol3,
                                        color: $scope.plotcolor,
                                        type: "scatter",
                                        data: (function () {
                                            var data = [];
                                            for (var j = 0; j < response.GradeResults.length; j++) {
                                                GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                                                GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                                                GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]) - 1;
                                                GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);
                                                GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                GradeResultsName[j] = response.GradeResults[j].Name;
                                                data.push({
                                                    x: Date.UTC(GradeResultsYear[j], GradeResultsMnth[j], GradeResultsDay[j]),
                                                    y: GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                });
                                            }
                                            return data;
                                        }()),
                                        marker: {
                                            enabled: true,
                                            radius: 5,
                                            symbol: 'circle'
                                        },
                                        tooltip: {
                                            pointFormat: '',
                                            //enabled: false                                               
                                        },
                                    }
                                ]
                            });
                        });
                        ////////  PERFORMANCE GRAPH ENDS /////////////////
                        $scope.studentPerformanceNoData = "";
                        $('.showStudentDiv').show();
                        $('#noRecord12').removeClass('noRecord');
                        $timeout(function () {
                            $("#graph_container").highcharts().reflow();
                        }, 100);
                    } else {
                        $('#graph_container').css({ 'display': 'block' });
                        $scope.studentPerformance = '';
                        $scope.studentPerformanceNoData = "No Performance Data Found…<br>Try:</br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                        $('.showStudentDiv').hide();
                        $('#noRecord12').addClass('noRecord');

                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $('#graph_container').css({ 'display': 'block' });
                    $scope.studentPerformance = '';
                    $scope.studentPerformanceNoData = "";
                    $('.showStudentDiv').hide();
                    $('#noRecord12').addClass('noRecord');
                } else {//ERROR : 500 in api
                    /////LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content7").css("display", "none");
                    $("#preloader_right_content7").css("display", "none");
                    $('#graph_container').css({ 'display': 'block' });
                    $scope.studentPerformance = '';
                    $scope.studentPerformanceNoData = "No Performance Data Found…<br>Try:</br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                    $('.showStudentDiv').hide();
                    $('#noRecord12').addClass('noRecord');

                }
            });
            }else{
                //$('#supportfeature').click();
            }
        };

$('#performance_table').click(function(){
            if ($scope.PerformanceGraph) {
            
            }else{
                $('#supportfeature').click();
            }
    });
        // /*print in performance page*/
        $scope.performance_screenshot=function(list)
        {
            console.log(list);
            document.getElementById('printpreloader').style.display='block';
           var restorepage = document.body.innerHTML;
           // var printcontent = document.getElementById("performance").innerHTML;
           var printcontent = document.getElementById("performance_table").innerHTML;

           printcontent = printcontent.replace(/pi-green/g, 'fa fa-caret-up pi-print');
           printcontent = printcontent.replace(/pi-red/g, 'fa fa-caret-down pi-print');

           var student_post_text = document.getElementById("student_post_text").innerHTML;
           
           
           //var my_var = '<div class="performance-table" id="performance_table">';
           //
           //for(var index=0; index<Object.keys(list) - 1; index++){
           //     my_var += '<a href="javascript:void(0)" data-target="#student_performance" data-toggle="modal" class="performance-table-tr performance-active performance_class2"  id="studentPerformance'+list[index].Id+'">ss';
           //     
           //     my_var += '</a>';
           //}
           //
           //my_var +=Object.keys(list)+' ll '+list[0].Id+'krishba</div>';
           //console.log(list[0]);
           
           // document.body.innerHTML = printcontent;
           // window.print();
           // document.body.innerHTML = restorepage;          
           // window.print();
           // console.log('Krishna');
           // console.log(printcontent);
           

            var popupWin = window.open('', '_blank', 'width=1000,height=600');
            //var popupWin = window.open('', 'printwindow');
            popupWin.document.open();
            popupWin.document.write('<html><head>');
            // popupWin.document.write('<link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>');
            popupWin.document.write('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>');
            // https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
            //// popupWin.document.write('<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>');
            
            popupWin.document.write('<link href="css/developer_print.css" rel="stylesheet" type="text/css"/>');
            popupWin.document.write('<link href="css/custom.css" rel="stylesheet"  type="text/css"/>');

            // popupWin.document.write('<script src="app/controller/homeCtrl.js></script>');
            
            //popupWin.document.write('<link href="css/responsive.css" rel="stylesheet" type="text/css"/>');
             //popupWin.document.write('<link href="css/developer.css" rel="stylesheet" type="text/css"/>');
             // popupWin.document.write('<style>#performance .p-green:after, #student_pop .p-green:after {border-color: transparent transparent #6bc04b;border-style: solid;border-width: 7px 5px;content: "";display: inline-block;margin-left: 8px;margin-top: -5px;position: absolute;top: 50%;transform: translateY(-50%);}</style>');
            popupWin.document.write('</head>');
            // popupWin.document.write('<body onload="window.print()">');
            popupWin.document.write('<body>');


            printcontenthead = student_post_text+'<br><div class="performance-table-th print_hd fstchld" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Student</div><div class="performance-table-th ng-binding print_hd" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Attendance</div><div class="print_hd performance-table-th ng-binding" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Target</div><div class="print_hd performance-table-th ng-binding" style="border-bottom: 1px solid #bebebe; background: #bebebe;">Grade</div>';


            popupWin.document.write('<div style="/*margin-left: 3%;*/ /*border: 1px solid #bebebe;*/">' +printcontenthead + printcontent + '</div>');
            popupWin.document.write('<script>setTimeout(function(){ window.print();},3000); </script>');
            popupWin.document.write('</body></html>');
            popupWin.document.close();
                        popupWin.onunload = function(){
                console.log('closed!');
                document.getElementById('printpreloader').style.display='none';
               }

        }




    };
    //};

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /*********************************  **** **** SEARCH **** **** ****************************************************
    *******************************************************************************************************************/

    $scope.performance_graph_close = function () {
        $("#hover_div").val('-1');
    };
    ////student search on keyup
    $(document).mouseup(function (e) {

        var container = $(".search_reasult");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
    });
    $('#closediv').click(function (e) {
        e.stopPropagation();
        document.getElementById('searchterm').value = "";
        $('#errordiv').css({ 'display': 'none' });
        $('#errordiv').html('');
        $('.stdprof').remove();
        $('.inner_content').click();
        $('#closediv').css({ 'display': 'none' });
    });
    $('#searchdiv').click(function (e) {
        var key = e.which || e.keyCode;
        $('#errordiv').html('');
        var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;
        if (srcLen > 2) {
            if (!$(".stdprof")) {
                if (key != 40 || key != 38) {
                    $('.search_reasult').css({ 'display': 'block' });
                    $('#errordiv').css({ 'display': 'block' });
                    $('#errordiv').html('Press Enter to search');
                    $('#closediv').css({ 'display': 'block' });
                }
            }
        } else {
            $('.search_reasult').css({ 'display': 'block' });
            $('#errordiv').css({ 'display': 'block' });
            $('#errordiv').html('Enter a minimum of 3 characters');
            $('#closediv').css({ 'display': 'block' });
        }
    });


    $('#searchdiv').keyup(function (e) {
        //$('.srch_data').css({'display':'none'});
        $('#searchterm').click(function (e) {
            $scope.searchResList = "";
        });
        $timeout(function () {
            $('.srch_data').css({ 'display': 'block' });
        }, 1000);

        /* UP & DOWN KEY */
        var key = e.which || e.keyCode;
        if (key != 13) {
            $("#hover_div").val('-1');
        }

        var no_of_search_result = 0;
        $(".move").each(function () {
            no_of_search_result = no_of_search_result + 1;
        });
        var search_count = no_of_search_result - 1;
        if (key == 38) { // up arrow key
            if ($(".stdprof").length > 0) {
                $('#errordiv').css({ 'display': 'none' });
                var div_id = $(".result_hover").attr('id').replace('search_div', '');
                var prev_div_id = parseInt(div_id) - 1;
                if (prev_div_id >= 0) {
                    $('.move').removeClass("result_hover");
                    $('#search_div' + prev_div_id).addClass("result_hover");
                    $('#search_div' + prev_div_id).focus();
                    $('#hover_div').val(prev_div_id);
                } else {
                    prev_div_id = search_count;
                    $('.move').removeClass("result_hover");
                    $('#search_div' + prev_div_id).addClass("result_hover");
                    $('#search_div' + prev_div_id).focus();
                    $('#hover_div').val(prev_div_id);
                }
                $(".srch_data").scrollTop(0);//set to top
                $(".srch_data").scrollTop($('.result_hover').offset().top - $(".srch_data").height());
            }
        } else if (key == 40) { // down arrow key
            if ($(".stdprof").length > 0) {
                $('#errordiv').css({ 'display': 'none' });
                if ($(".result_hover").attr('id') == undefined) {
                    $('.move').removeClass("result_hover");
                    $('#search_div0').addClass("result_hover");
                    $("#search_div0").hover();
                    $('#hover_div').val('0');
                } else {
                    var div_id = $(".result_hover").attr('id').replace('search_div', '');
                    var next_div_id = parseInt(div_id) + 1;
                    if (next_div_id <= search_count) {
                        $('.move').removeClass("result_hover");
                        $('#search_div' + next_div_id).addClass("result_hover");
                        $('#search_div' + next_div_id).focus();
                        $('#hover_div').val(next_div_id);
                    } else {
                        next_div_id = 0;
                        $('.move').removeClass("result_hover");
                        $('#search_div' + next_div_id).addClass("result_hover");
                        $('#search_div' + next_div_id).focus();
                        $('#hover_div').val(next_div_id);
                    }
                    $(".srch_data").scrollTop(0);//set to top
                    $(".srch_data").scrollTop($('.result_hover').offset().top - $(".srch_data").height());
                }
            }

        } else if (key != 13) {
            $('.stdprof').remove();
        }



        //$('.stdprof').remove();
        var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;

        if (srcLen > 2) {
            if (key != 40 && key != 38) {
                $('.search_reasult').css({ 'display': 'block' });
                $('#errordiv').css({ 'display': 'block' });
                $('#errordiv').html('Press Enter to search');
                $('#closediv').css({ 'display': 'block' });
            }

            if (key == 13) {
                $('#errordiv').css({ 'display': 'none' });
                $('#closediv').css({ 'display': 'none' });
                $scope.successMsg = "";
                $scope.searchResList = "";
                $scope.noOfres = 0;
                //var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                //var values = searchterm.split(' ').filter(function(v){return v!==''});

                var hover_div = $("#hover_div").val();

                if (hover_div != "-1") {

                    $('#search_div_anchor' + hover_div).click();
                }
                else {

                    $scope.successMsg = "";
                    $scope.searchResList = "";
                    $scope.noOfres = 0;
                    var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                    var values = searchterm.split(' ').filter(function (v) { return v !== '' });


                    if (values.length > 2) {
                        //two or more words
                        if (key != 40 && key != 38) {
                            $('.search_reasult').css({ 'display': 'block' });
                            $('#errordiv').css({ 'display': 'block' });
                            $('#errordiv').html("Search is limited to Student's<br>First Name and Last Name only");
                            $scope.successMsg = "";
                            //$scope.searchResListErr = 'No students found<br>Please refine your search';
                            $scope.searchResList = "";
                            $scope.noOfres = 0;
                            $('#closediv').css({ 'display': 'block' });
                        }
                    } else {
                        homeService.studentSearchResponse(access_token, searchterm, function (response) {

                            //console.log('SERCH');
                            //console.log(response);
                            if (response.status) {
                                if (response.Count != 0) {
                                    if (response.Count > 20) {
                                        if (key != 40 && key != 38) {
                                            $('.search_reasult').css({ 'display': 'block' });
                                            $('#errordiv').css({ 'display': 'block' });
                                            //$('#errordiv').html('More than 20 students found<br>Please refine your search<br>The search text should be make more specific as it matches more than 20 records');
                                            $('#errordiv').html('More than 20 students found<br>Please refine your search<br>');
                                            $scope.successMsg = ""
                                            //$scope.searchResListErr = 'The search text should be make more specific as it matches more than 20 records';
                                            $scope.searchResList = "";
                                            $('#closediv').css({ 'display': 'block' });
                                        }
                                    } else {

                                        if (key != 40 && key != 38) {

                                            $('.search_reasult').css({ 'display': 'block' });
                                            $('#errordiv').css({ 'display': 'none' });
                                            //$scope.searchResListErr = "";
                                            $scope.searchResList = response.Data;
                                            $scope.noOfres = response.Count;
                                            $('#closediv').css({ 'display': 'block' });
                                        }
                                    }
                                } else {
                                    if (key != 40 && key != 38) {

                                        $('.search_reasult').css({ 'display': 'block' });
                                        $('#errordiv').css({ 'display': 'block' });
                                        $('#errordiv').html('No students found<br>Please refine your search');
                                        $scope.successMsg = "";
                                        //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                        $scope.searchResList = "";
                                        $scope.noOfres = 0;
                                        $('#closediv').css({ 'display': 'block' });
                                    }
                                }
                            } else {//ERROR : 500 in api`
                                if (key != 40 && key != 38) {

                                    $('.search_reasult').css({ 'display': 'block' });
                                    $scope.successMsg = "";
                                    //$scope.searchResListErr = "";
                                    $scope.searchResList = response.Message;
                                    $scope.noOfres = 0;
                                    $('#closediv').css({ 'display': 'block' });
                                }
                            }
                        });
                    }
                }
            }
        } else {
            if (key != 40 && key != 38) {

                $('.search_reasult').css({ 'display': 'block' });
                $('#errordiv').css({ 'display': 'block' });
                $('#errordiv').html('Enter a minimum of 3 characters');
                $('#closediv').css({ 'display': 'block' });
            }
        }
    });

    $("#srch").click(function (e) {
        //var teacherId= getOnlyCookie("teacherId");
        $('.srch_data').css({ 'display': 'none' });
        $('#searchterm').click(function (e) {
            $scope.searchResList = "";

        });
        $timeout(function () {
            $('.srch_data').css({ 'display': 'block' });
        }, 1000);
        var key = e.which || e.keyCode;
        $('.stdprof').remove();
        var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;
        if (srcLen > 2) {
            $scope.successMsg = "";
            $scope.searchResList = "";
            $scope.noOfres = 0;
            var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
            var values = searchterm.split(' ').filter(function (v) { return v !== '' });
            if (values.length > 2) {
                if (key != 40 && key != 38) {
                    $('.search_reasult').css({ 'display': 'block' });
                    $('#errordiv').css({ 'display': 'block' });
                    $('#errordiv').html("Search is limited to Student's<br>First Name and Last Name only.");
                    $scope.successMsg = "";
                    //$scope.searchResList = 'No results found. Please refine your search';
                    $scope.searchResList = "";
                    $scope.noOfres = 0;
                    $('#closediv').css({ 'display': 'block' });
                }
            } else {
                homeService.studentSearchResponse(access_token, searchterm, function (response) {
                    if (response.status) {
                        if (response.Count != 0) {
                            if (response.Count > 20) {
                                if (key != 40 && key != 38) {
                                    $('.search_reasult').css({ 'display': 'block' });
                                    $('#errordiv').css({ 'display': 'block' });
                                    $('#errordiv').html('More than 20 students found<br>Please refine your search.<br>The search text should be make more specific as it matches more than 20 records.');
                                    $scope.successMsg = ""
                                    //$scope.searchResList = 'The search text should be make more specific as it matches more than 20 records';
                                    $scope.searchResList = "";
                                    $('#closediv').css({ 'display': 'block' });
                                }
                            } else {
                                if (key != 40 && key != 38) {
                                    $('.search_reasult').css({ 'display': 'block' });
                                    $('#errordiv').css({ 'display': 'none' });
                                    $scope.searchResList = response.Data;
                                    $scope.noOfres = response.Count;
                                    $('#closediv').css({ 'display': 'block' });
                                }
                            }
                        } else {
                            if (key != 40 && key != 38) {
                                $('.search_reasult').css({ 'display': 'block' });
                                $('#errordiv').css({ 'display': 'block' });
                                $('#errordiv').html('No students found<br>Please refine your search');
                                $scope.successMsg = "";
                                //$scope.searchResList = 'No students found<br>Please refine your search';
                                $scope.searchResList = "";
                                $scope.noOfres = 0;
                                $('#closediv').css({ 'display': 'block' });
                            }
                        }
                    } else {//ERROR : 500 in api
                        if (key != 40 && key != 38) {
                            $('.search_reasult').css({ 'display': 'block' });
                            $scope.successMsg = "";
                            $scope.searchResList = response.Message;
                            $scope.noOfres = 0;
                            $('#closediv').css({ 'display': 'block' });
                        }
                    }
                });
            }
        } else {
            if (key != 40 && key != 38) {
                $('.search_reasult').css({ 'display': 'block' });
                $('#errordiv').css({ 'display': 'block' });
                $('#errordiv').html('Enter a minimum of 3 characters');
                $('#closediv').css({ 'display': 'block' });
            }
        }
    });
    /************************************************************************************************/

    /****************************  **** **** SEARCH (MY INBOX) **** **** ***********************************/

    ////student search on keyup
    $(document).mouseup(function (e) {
        var container = $(".search_reasult1");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
            $("#hover_div1").val('-1');
        }
    });
    $('#closediv1').click(function (e) {
        e.stopPropagation();
        document.getElementById('searchterm1').value = "";
        $('#errordiv1').css({ 'display': 'none' });
        $('#errordiv1').html('');
        $('.stdprof1').remove();
        //$('.inner_content').click();
        $('#closediv1').css({ 'display': 'none' });
        $("#hover_div1").val('-1');
    });
    $('#searchdiv1').click(function (e) {
        var key = e.which || e.keyCode;
        $('#errordiv1').html('');
        var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;
        if (srcLen > 2) {

            //if (key != 40 || key !=38)
            //{
            //    $('.search_reasult1').css({'display':'block'});
            //    $('#errordiv1').css({'display':'block'});
            //    $('#errordiv1').html('Press Enter to search');
            //    $('#closediv1').css({'display':'block'});
            //}

        } else {
            $('.search_reasult1').css({ 'display': 'block' });
            $('#errordiv1').css({ 'display': 'block' });
            $('#errordiv1').html('Enter a minimum of 3 characters');
            $('#closediv1').css({ 'display': 'block' });
        }
    });

    /////  KEYUP  ////////////////////////////////
    $('#searchdiv1').keyup(function (e) {
        /* UP & DOWN KEY */
        var key = e.which || e.keyCode;
        $('#searchterm1').click(function (e) {
            $scope.searchResList1 = "";
        });

        if (key != 13) {
            //$('.stdprof1').remove();
            $("#hover_div1").val('-1');
        }
        var no_of_search_result = 0;
        $(".move1").each(function () {
            no_of_search_result = no_of_search_result + 1;
        });
        var search_count = no_of_search_result - 1;

        if (key == 38) { // up arrow key
            if ($('.stdprof1').length > 0) {
                $('#errordiv1').css({ 'display': 'none' });
                var div_id = $(".result_hover").attr('id').replace('search_div1', '');
                var prev_div_id = parseInt(div_id) - 1;
                if (prev_div_id >= 0) {
                    $('.move1').removeClass("result_hover");
                    $('#search_div1' + prev_div_id).addClass("result_hover");
                    $('#search_div1' + prev_div_id).focus();
                    $('#hover_div1').val(prev_div_id);
                } else {
                    prev_div_id = search_count;
                    $('.move1').removeClass("result_hover");
                    $('#search_div1' + prev_div_id).addClass("result_hover");
                    $('#search_div1' + prev_div_id).focus();
                    $('#hover_div1').val(prev_div_id);
                }
                $(".new_search").scrollTop(0);//set to top
                $(".new_search").scrollTop($('.result_hover').offset().top - $("srch_data").height());
            }
        } else if (key == 40) { // down arrow key
            if ($('.stdprof1').length > 0) {
                $('#errordiv1').css({ 'display': 'none' });
                if ($(".result_hover").attr('id') == undefined) {
                    $('.move1').removeClass("result_hover");
                    $('#search_div10').addClass("result_hover");
                    $("#search_div10").hover();
                    $('#hover_div1').val('0');
                } else {
                    var div_id = $(".result_hover").attr('id').replace('search_div1', '');
                    var next_div_id = parseInt(div_id) + 1;
                    if (next_div_id <= search_count) {
                        $('.move1').removeClass("result_hover");
                        $('#search_div1' + next_div_id).addClass("result_hover");
                        $('#search_div1' + next_div_id).focus();
                        $('#hover_div1').val(next_div_id);
                    } else {
                        next_div_id = 0;
                        $('.move1').removeClass("result_hover");
                        $('#search_div1' + next_div_id).addClass("result_hover");
                        $('#search_div1' + next_div_id).focus();
                        $('#hover_div1').val(next_div_id);
                    }
                    $(".new_search").scrollTop(0);//set to top
                    $(".new_search").scrollTop($('.result_hover').offset().top - $("srch_data").height());
                }
            }
        } else if (key != 13) {
            $('.stdprof1').remove();
            // $("#hover_div1").val('-1');
        }

        //$('.stdprof').remove();
        var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;

        if (srcLen > 2) {
            if (key != 40 && key != 38) {
                $('.search_reasult1').css({ 'display': 'block' });
                $('#errordiv1').css({ 'display': 'block' });   
                $('#errordiv1').html('Press Enter to search');         
                $('#closediv1').css({ 'display': 'block' });
            }

            if (key == 13) {
                //console.log('ENTER');
                $scope.successMsg = "";
                $scope.searchResList1 = "";
                $scope.noOfres = 0;
                var hover_div1 = $("#hover_div1").val();
                //console.log("hover_div1   " + hover_div1);
                if (hover_div1 != "-1") {
                    //console.log('helllo');
                    $('#errordiv1').css({ 'display': 'none' });
                    $('#search_div_anchor1' + hover_div1).click();

                } else {
                    //console.log('loop 2');
                    $scope.successMsg = "";
                    $scope.searchResList1 = "";
                    $scope.noOfres = 0;
                    var searchterm = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                    var values = searchterm.split(' ').filter(function (v) { return v !== '' });

                    if (values.length > 2) {
                        //two or more words
                        if (key != 40 && key != 38) {
                            $('.search_reasult1').css({ 'display': 'block' });
                            $('#errordiv1').css({ 'display': 'block' });
                            $('#errordiv1').html("Search is limited to Student's<br>First Name and Last Name only");
                            $scope.successMsg = "";
                            //$scope.searchResListErr = 'No students found<br>Please refine your search';
                            $scope.searchResList1 = "";
                            $scope.noOfres = 0;
                            $('#closediv1').css({ 'display': 'block' });
                        }
                    } else {

                        homeService.studentSearchInboxResponse(access_token, searchterm, function (response) {

                            //console.log('SERCH');
                            //console.log(response);
                            if (response.status) {
                                if (response.Count != 0) {
                                    if (key != 40 && key != 38) {
                                        $('.search_reasult1').css({ 'display': 'block' });
                                        $('#errordiv1').css({ 'display': 'none' });
                                        //$scope.searchResListErr = "";
                                        $scope.searchResList1 = response.Data;
                                        $scope.noOfres = response.Count;
                                        $('#closediv1').css({ 'display': 'block' });
                                    }
                                } else {
                                    if (key != 40 && key != 38) {
                                        $('.search_reasult1').css({ 'display': 'block' });
                                        $('#errordiv1').css({ 'display': 'block' });
                                        $('#errordiv1').html('No students found<br>Please refine your search');
                                        $scope.successMsg = "";
                                        //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                        $scope.searchResList1 = "";
                                        $scope.noOfres = 0;
                                        $('#closediv1').css({ 'display': 'block' });
                                    }
                                }

                                //$("#hover_div1").val('-1');
                            } else {//ERROR : 500 in api`
                                if (key != 40 && key != 38) {
                                    $('.search_reasult1').css({ 'display': 'block' });
                                    $scope.successMsg = "";
                                    //$scope.searchResListErr = "";
                                    $scope.searchResList1 = response.Message;
                                    $scope.noOfres = 0;
                                    $('#closediv1').css({ 'display': 'block' });
                                }
                            }
                        });
                    }
                }
            }
        } else {
            if (key != 40 && key != 38) {
                $('.search_reasult1').css({ 'display': 'block' });
                $('#errordiv1').css({ 'display': 'block' });
                $('#errordiv1').html('Enter a minimum of 3 characters');
                $('#closediv1').css({ 'display': 'block' });
            }
        }
    });

    // ########### Added on 16.02.17 for hold Press Enter to search  in inobx section and Search section start here
    $('#errordiv1').click(function (evt) {
        evt.stopPropagation();
        //console.log('click');
    });
    $('#errordiv').click(function (evt) {
        evt.stopPropagation();
        //console.log('click');
    });
    // ########### Added on 16.02.17 for hold Press Enter to search  in inobx section and Search section Ends here
    /////   SEARCH BTN CLICK ////////////////////////

    $("#srch1").click(function (e) {
        var key = e.which || e.keyCode;
        //$('.stdprof1').remove();
        var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
        var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g, '');
        var srcLen = searchtext_with_space.length;
        // alert('call');
        if ($("#hover_div1").val() == -1) {
            if (srcLen > 2) {
                $scope.successMsg = "";
                $scope.searchResList1 = "";
                $scope.noOfres = 0;
                var searchterm = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                var values = searchterm.split(' ').filter(function (v) { return v !== '' });
                if (values.length > 2) {
                    if (key != 40 && key != 38) {
                        $('.search_reasult1').css({ 'display': 'block' });
                        $('#errordiv1').css({ 'display': 'block' });
                        $('#errordiv1').html("Search is limited to Student's<br>First Name and Last Name only.");
                        $scope.successMsg = "";
                        //$scope.searchResList = 'No results found. Please refine your search'; 
                        $scope.searchResList1 = "";
                        $scope.noOfres = 0;
                        $('#closediv1').css({ 'display': 'block' });
                    }
                } else {


                    homeService.studentSearchInboxResponse(access_token, searchterm, function (response) {

                        if (response.status) {
                            if (response.Count != 0) {
                                if (key != 40 && key != 38) {
                                    //console.log('should Not call')
                                    $('.search_reasult1').css({ 'display': 'block' });
                                    $('#errordiv1').css({ 'display': 'none' });
                                    $scope.searchResList1 = response.Data;
                                    $scope.noOfres = response.Count;
                                    $('#closediv1').css({ 'display': 'block' });
                                }
                            } else {
                                if (key != 40 && key != 38) {

                                    $('.search_reasult1').css({ 'display': 'block' });
                                    $('#errordiv1').css({ 'display': 'block' });
                                    $('#errordiv1').html('No students found<br>Please refine your search');
                                    $scope.successMsg = "";
                                    //$scope.searchResList = 'No students found<br>Please refine your search';
                                    $scope.searchResList1 = "";
                                    $scope.noOfres = 0;
                                    $('#closediv1').css({ 'display': 'block' });
                                }
                            }
                        } else {//ERROR : 500 in api
                            if (key != 40 && key != 38) {
                                $('.search_reasult1').css({ 'display': 'block' });
                                $scope.successMsg = "";
                                $scope.searchResList1 = response.Message;
                                $scope.noOfres = 0;
                                $('#closediv1').css({ 'display': 'block' });
                            }
                        }
                    });

                }
            } else {
                if (key != 40 && key != 38) {
                    $('.search_reasult1').css({ 'display': 'block' });
                    $('#errordiv1').css({ 'display': 'block' });
                    $('#errordiv1').html('Enter a minimum of 3 characters');
                    $('#closediv1').css({ 'display': 'block' });
                }
            }
        }
    });

    /*ONCLICK ON SEARCH RESULT*/
    $scope.searchStudentSelected = function (Id, Firstname, Lastname, ParentsName, SubjectName, YearGroup, Image, IsUnlocked, ClassId, ClassName) {

        // var teacherId= getOnlyCookie("teacherId");
        //console.log('called');
        $("#hover_div1").val('-1');
        $(window).scrollTop(0);
        $('.stdprof1').remove();
        $('#closediv1').css({ 'display': 'none' });

        //console.log('Parents : ' + ParentsName);
        if (IsUnlocked == true) {
            var style_class = 'outr_border';
        } else if (IsUnlocked == false) {
            var style_class = '';
        }
        $scope.Id = Id;
        $scope.ClassId = ClassId;
        $scope.Firstname = Firstname;
        $scope.Lastname = Lastname;
        $scope.ParentsName = ParentsName;
        $scope.Image = Image;
        $scope.ClassName = ClassName;
        $scope.IsUnlocked = IsUnlocked;

        if (ParentsName != null) {
            ParentsName = ParentsName;
        } else {
            ParentsName = "";
        }
        var img = "'" + Image + "'";
        var clnm = "'" + ClassName + "'";
        var PName = "'" + ParentsName + "'";
        var Fname = "'" + Firstname + "'";
        var Lname = "'" + Lastname + "'";
        var subName = "'" + SubjectName + "'";

        //$('.inner_content').click();
        //$('#closediv1').css({'display':'none'});


        /*student id fetched from hidden field*/
        var studentIdsInList = $('#studentIds').val();

        var str = studentIdsInList;
        var str_array = str.split(',');
        var studentArr = Array();
        for (var i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace.
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
            studentArr[i] = str_array[i];
        }
        //console.log('-----studentArr-----');
        //console.log(studentArr);
        //console.log(Id);
        /*class id fetched from hidden field*/
        var classIdsInList = $('#classIds').val();
        var str2 = classIdsInList;
        var str2_array = str2.split(',');
        var classArr = Array();
        for (var i = 0; i < str2_array.length; i++) {
            // Trim the excess whitespace.
            str2_array[i] = str2_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
            classArr[i] = str2_array[i];
        }
        //console.log('-----classArr-----');
        //console.log(classArr);

        /*checking if selected student id is present in student list id */
        function inArray(Id, studentArr) {
            var length = studentArr.length;
            for (var i = 0; i < length; i++) {
                if (studentArr[i] == Id) {
                    //console.log("position="+i);
                    var studentArrIndex = i;
                    if (classArr[studentArrIndex] == ClassId) {
                        return studentArrIndex;
                    }

                }
            }
            return -1;
        }
        var returnArrayResult = inArray(Id, studentArr);
        var classArrCheck = classArr[returnArrayResult];

        if ((returnArrayResult != -1) || (classArrCheck == ClassId)) {
            //console.log('LOADING after sneding message');
            $('.msgstud').removeClass('studSelect');
            if ($scope.studActive == 1) {
                //console.log('calling not needed' + '#msgstud' + Id + ClassId);
                $('#msgstud' + Id + ClassId).addClass('studSelect');
                $scope.studActive = 0;
            }

        } else {
            //var divTemplate = '<div class="user_box top_border_user_box clearfix studSelect" id="msgstud'+Id+ClassId+'" ng-click="studentInboxPerformanceResponse('+Id+','+ClassId+','+Fname+','+Lname+','+PName+','+img+','+clnm+','+IsUnlocked+','+subName+')"><label><div class="user_pic '+style_class+'"><img alt="" src="data:image/png;base64,'+Image+'"></div><div class="user_details"><h3>'+Firstname+' '+Lastname+' ('+ClassName+')</h3><span>'+ClassName+'</span></div></label></div>';
            $('#noMsgClass').hide();
            var divTemplate = '<div class="user_box top_border_user_box clearfix studSelect" id="msgstud' + Id + ClassId + '" ng-click="studentInboxPerformanceResponse(' + Id + ',' + ClassId + ',' + Fname + ',' + Lname + ',' + PName + ',' + img + ',' + clnm + ',' + IsUnlocked + ',' + subName + ')"><label class="studRow"><div class="user_pic ' + style_class + '"><img alt="" src="data:image/png;base64,' + Image + '"></div><div class="user_details"><h3>' + Firstname + ' ' + Lastname + ' <span>(' + ClassName + ')<span></h3><span>' + ParentsName + '</span></div></label></div>';

            var temp = $compile(divTemplate)($scope);

            //Then append it to the HTML:
            angular.element(document.getElementById('append_search_div')).prepend(temp);

            //You can also bind the event to the div as following:
            var div = angular.element('msgstud' + Id + ClassId);
            div.bind('click', $scope.studentInboxPerformanceResponse(Id, ClassId, Firstname, Lastname, ParentsName, Image, ClassName, IsUnlocked, subName));

            /*id is pushed into existing array*/
            studentArr.push(Id);
            $('#studentIds').val(studentArr.toString());
            classArr.push(ClassId);
            $('#classIds').val(classArr.toString());
        }

        $scope.studentInboxPerformanceResponse(Id, ClassId, Firstname, Lastname, ParentsName, Image, ClassName, IsUnlocked, SubjectName);


    };
    /******************************************************************************************************/
    //W14: student profile & graph subjectwise
    $scope.studentProfile = function (Id, fname, lname, year, image, IsUnlocked) {
        $("#hover_div").val('-1');
        // var teacherId= getOnlyCookie("teacherId");
        /////LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content6").css("display", "block");
        $("#preloader_right_content6").css("display", "block");


        $scope.Image = image;
        $scope.Name = fname + " " + lname;
        $scope.Year = year;
        if (IsUnlocked == 1) {
            $scope.IsUnlocked = "outer_border";
        } else {
            $scope.IsUnlocked = "";
        }

        $scope.profileperlist = "";
        $scope.NameofSubject = "";
        $('#graph_container_popup').html("");

        /*LHS : STUDENT PROFILE*/
        homeService.studentProfileResponse(access_token, Id, function (response) {

            $('#student_performance_print').hide();    // hide print button for till the response come

            //console.log('STUDENT PROFILE' + Id);
            //console.log(response);
            var studentName = fname + " " + lname;
            if (response != '') {
                /////LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content6").css("display", "none");
                $("#preloader_right_content6").css("display", "none");
                if (response.status) {
                    //console.log('PROFILER LIST');
                    //console.log(response);
                    $scope.profileperlist = response;
                    $scope.studentprofileMessage = '';
                    var ClassId = response[0].Performance.ClassId;
                    var GradeTrend = response[0].Performance.Column3.Trend;
                    var NameofSubject = response[0].SubjectName;
                    var HeaderColumn31 = response[0].Performance.Column3.Header;
                    //console.log("HEADER");
                    //console.log(response[0].Performance.Column3.Header);
                    //$scope.graphstudentPerformanceSubjectwise(ClassId,GradeTrend,NameofSubject);
                    /*RHS : GRAPH SUBJECT WISE */
                    $scope.graphstudentPerformanceSubjectwise = function (ClassId, GradeTrend, NameofSubject, HeaderColumn3) {

                        if (GradeTrend == 1) {
                            $scope.plotcolor = "#5BD9A4"; //green
                        } else if (GradeTrend == 3) {
                            $scope.plotcolor = "#FF5958"; //red
                        } else if (GradeTrend == 2) {
                            $scope.plotcolor = "orange";
                        } else if (GradeTrend == 0 || GradeTrend == null || GradeTrend == "null" || GradeTrend == undefined) {
                            $scope.plotcolor = "#111111";
                        }

                        $scope.NameofSubject = NameofSubject;


                        homeService.studentPerformanceListResponse(access_token, ClassId, Id, function (response) {
                            console.log('PERFORMANCE STUDENT SUBJECT WISE');
                            console.log(response);
                            if (response.status) {
                                if (response != '') {

                                    $scope.studentPerformanceList = response;
                                    $('.prof').css({ 'background-color': '' });
                                    $('#prof' + ClassId).css({ 'background-color': 'rgba(157, 224, 242, 0.8)' });
                                    //$scope.studentPerformanceListErrMsg = "";
                                    //$scope.studentListMessagePopup = '';
                                    //$('.noRecordClass').removeClass('noRecord');

                                    GradeSetCode = new Array();
                                    GradeSetValue = new Array();
                                    GradeResultsDate = new Array();
                                    GradeResultsGrade = new Array();
                                    GradeResultsName = new Array();
                                    Grade_and_Date = new Array();
                                    GradeResultsDateTime = new Array();
                                    GradeResultsSplit = new Array();
                                    GradeResultsYear = new Array();
                                    GradeResultsMnth = new Array();
                                    GradeResultsDay = new Array();
                                    GradeResultsGraphDate = new Array();
                                    GradeResultsDateTimeYaxis = new Array();

                                    TargetGradeDate = new Array();
                                    TargetGradeDateSplit = new Array();
                                    TargetGradeDatePlot = new Array();
                                    TargetGradeGradePlot = new Array();
                                    TargetGradeDatePlotYear = new Array();
                                    TargetGradeDatePlotMnth = new Array();
                                    TargetGradeDatePlotDay = new Array();
                                    TargetGradeResultsGrade = new Array();

                                    XaxisGradesDate = new Array();
                                    XaxisGradesDateSplit = new Array();
                                    XaxisGradesDatePlotYear = new Array();
                                    XaxisGradesDatePlotMnth = new Array();
                                    XaxisGradesDatePlotDay = new Array();
                                    XaxisGradesGradePlot = new Array();
                                    XaxisGradesResultsGrade = new Array();

                                    for (var i = 0; i < response.GradeSet.length; i++) {
                                        GradeSetCode[i] = response.GradeSet[i].Code;
                                        GradeSetValue[i] = response.GradeSet[i].Value;
                                    }
                                    for (var j = 0; j < response.GradeResults.length; j++) {
                                        GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                        GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                                        GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]);
                                        GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);

                                        GradeResultsGraphDate[j] = GradeResultsYear[j] + ',' + GradeResultsMnth[j] + ',' + GradeResultsDay[j];

                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                        GradeResultsName[response.GradeResults[j].Date] = response.GradeResults[j].Name;

                                        GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j] + "," + GradeResultsMnth[j] + "," + GradeResultsDay[j]);
                                    }
                                    for (var k = 0; k < response.TargetGrades.length; k++) {
                                        TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);
                                        TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                                        TargetGradeDatePlotYear[k] = parseInt(TargetGradeDateSplit[k][0]);
                                        TargetGradeDatePlotMnth[k] = parseInt(TargetGradeDateSplit[k][1]);
                                        TargetGradeDatePlotDay[k] = parseInt(TargetGradeDateSplit[k][2]);
                                        TargetGradeDatePlot[k] = Date.UTC(TargetGradeDatePlotYear[k], TargetGradeDatePlotMnth[k], TargetGradeDatePlotDay[k]);
                                        TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;
                                    }

                                    console.log("GRAPH RESULT");
                                    //console.log(response);
                                      console.log(GradeResultsName);
                                    //console.log(GradeResultsDateTime);


                                    /*calculation of academic year*/
                                    var todayTime = new Date(st);
                                    var monthAcademic = (todayTime.getMonth() + 1);
                                    var dayAcademic = (todayTime.getDate());
                                    var yearAcademic = (todayTime.getFullYear());
                                    var nextYearAcademic = (todayTime.getFullYear() + 1);
                                    var prevYearAcademic = (todayTime.getFullYear() - 1);

                                    if (monthAcademic <= 8) {
                                        //alert(1);
                                        var academicYearStartDate = prevYearAcademic + '-' + '9' + '-' + '1';
                                        var academicYearEndDate = yearAcademic + '-' + '8' + '-' + '31';
                                    } else {
                                        //alert(2);
                                        var academicYearStartDate = yearAcademic + '-' + '9' + '-' + '1';
                                        var academicYearEndDate = nextYearAcademic + '-' + '8' + '-' + '31';
                                    }
                                    //var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                                    //var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';

                                    var current_date = yearAcademic + '-' + monthAcademic + '-' + dayAcademic;

                                    if ((current_date >= academicYearStartDate)) {
                                        var currentAcademicYear1 = yearAcademic;
                                        var currentAcademicYear2 = yearAcademic + 1;
                                    } else {
                                        var currentAcademicYear1 = yearAcademic - 1;
                                        var currentAcademicYear2 = yearAcademic;
                                    }

                                    ////////  PERFORMANCE GRAPH BEGIN /////////////////
                                    $(document).ready(function () {
                                        $('#graph_container_popup').highcharts({
                                            exporting: { enabled: false },
                                            chart: {
                                                type: 'line'
                                            },
                                            title: {
                                                // text: '<h2><b>Performance Graph</b></h2>'
                                                text: ''
                                            },
                                            xAxis: {
                                                type: 'datetime',
                                                title: {
                                                    text: 'Month'
                                                },
                                                //dateTimeLabelFormats: { 
                                                //    month: '%b %Y',
                                                //    
                                                //},
                                                //categories: (function () {                                     
                                                //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                                //                {
                                                //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                                //                    return GradeResultsDateTimeYaxis[r];
                                                //                }
                                                //            }()),
                                                labels: {
                                                    format: '{value:%b %Y}',
                                                    style: {
                                                        fontWeight: 'bold'
                                                    }
                                                },
                                                gridLineWidth: 1,
                                            },
                                            yAxis: {
                                                min: 0,
                                                tickInterval: 1,
                                                labels: {
                                                    formatter: function () {
                                                        if (GradeSetCode[this.value] != undefined) {
                                                            return '<b>' + GradeSetCode[this.value] + '</b>';
                                                        }
                                                    }
                                                },
                                                //categories: GradeSetCode,
                                                title: {
                                                    text: HeaderColumn3
                                                },
                                            },
                                            plotOptions: {
                                                //spline: {
                                                //    marker: {
                                                //        enabled: true,
                                                //        radius: 3,
                                                //    },
                                                //},
                                                scatter: {
                                                    lineWidth: 2,
                                                },
                                                series: {
                                                    pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                                    pointInterval: 15 * 24 * 3600 * 1000// one day
                                                }
                                            },
                                            tooltip: {
                                                shared: false,
                                                formatter: function () {
                                                    var tooltiptxt = '';
                                                    if (this.series.name == HeaderColumn3) {
                                                        tooltiptxt = '<b>' + GradeResultsName[Highcharts.dateFormat('%Y-%m-%dT00:00:00', new Date(this.x))] + '</b><br> ' + HeaderColumn3 + ' ' + GradeSetCode[this.y] + ', ' + Highcharts.dateFormat('%e %b %Y', new Date(this.x));
                                                        return tooltiptxt;
                                                    } else {
                                                        return false;
                                                    }
                                                },
                                                shared: false,
                                                backgroundColor: $scope.plotcolor,
                                                style: {
                                                    color: 'white'
                                                },
                                            },
                                            legend: {
                                                enabled: true
                                            },
                                            plotOptions: {
                                                spline: {
                                                    marker: {
                                                        enabled: true,
                                                        radius: 3,
                                                    },
                                                },
                                                scatter: {
                                                    lineWidth: 2,
                                                }
                                            },
                                            series: [
                                                {
                                                    showInLegend: false,
                                                    name: 'XaxisGrades',
                                                    color: '#FFF',
                                                    data: (function () {
                                                        var data2 = [];
                                                        for (var m = 0; m < response.XaxisGrades.length; m++) {
                                                            XaxisGradesDate[m] = convertDate(response.XaxisGrades[m].Date);
                                                            XaxisGradesDateSplit[m] = XaxisGradesDate[m].split('-');
                                                            XaxisGradesDatePlotYear[m] = parseInt(XaxisGradesDateSplit[m][0]);
                                                            XaxisGradesDatePlotMnth[m] = parseInt(XaxisGradesDateSplit[m][1]);
                                                            XaxisGradesDatePlotDay[m] = parseInt(XaxisGradesDateSplit[m][2]);
                                                            XaxisGradesGradePlot[m] = response.XaxisGrades[m].Grade;
                                                            XaxisGradesResultsGrade[m] = response.XaxisGrades[m].Grade;
                                                            data2.push({
                                                                x: Date.UTC(XaxisGradesDatePlotYear[m], (XaxisGradesDatePlotMnth[m] - 1), XaxisGradesDatePlotDay[m]),
                                                                y: GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                            });
                                                        }
                                                        return data2;
                                                    }()),
                                                    marker: {
                                                        enabled: false,
                                                        states: {
                                                            hover: {
                                                                enabled: false
                                                            }
                                                        }
                                                    },
                                                },
                                                {
                                                    showInLegend: true,
                                                    name: 'Target',
                                                    color: '#48CAE5',
                                                    data: (function () {
                                                        var data = [];
                                                        //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                        for (var m = 0; m < response.TargetGrades.length; m++) {
                                                            TargetGradeDate[m] = convertDate(response.TargetGrades[m].Date);
                                                            TargetGradeDateSplit[m] = TargetGradeDate[m].split('-');
                                                            TargetGradeDatePlotYear[m] = parseInt(TargetGradeDateSplit[m][0]);
                                                            TargetGradeDatePlotMnth[m] = parseInt(TargetGradeDateSplit[m][1]);
                                                            TargetGradeDatePlotDay[m] = parseInt(TargetGradeDateSplit[m][2]);
                                                            TargetGradeGradePlot[m] = response.TargetGrades[m].Grade;
                                                            //TargetGradeResultsGrade[m]  = response.TargetGrades[m].Grade;
                                                            data.push({
                                                                x: Date.UTC(TargetGradeDatePlotYear[m], (TargetGradeDatePlotMnth[m] - 1), TargetGradeDatePlotDay[m]),
                                                                y: GradeSetCode.indexOf(TargetGradeGradePlot[m]),
                                                            });
                                                        }
                                                        return data;
                                                    }()),
                                                    marker: {
                                                        enabled: false,
                                                        states: {
                                                            hover: {
                                                                enabled: false
                                                            }
                                                        }
                                                    },
                                                },
                                                {
                                                    showInLegend: true,
                                                    name: HeaderColumn3,
                                                    color: $scope.plotcolor,
                                                    type: "scatter",
                                                    data: (function () {
                                                        var data = [];
                                                        //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                        for (var j = 0; j < response.GradeResults.length; j++) {
                                                            GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                                                            GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                            GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                                                            GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]) - 1;
                                                            GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);
                                                            GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                            GradeResultsName[j] = response.GradeResults[j].Name;
                                                            data.push({
                                                                x: Date.UTC(GradeResultsYear[j], GradeResultsMnth[j], GradeResultsDay[j]),
                                                                y: GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                            });


                                                        }
                                                        return data;
                                                    }()),
                                                    marker: {
                                                        enabled: true,
                                                        radius: 5,
                                                        symbol: 'circle'
                                                    },
                                                    tooltip: {
                                                        pointFormat: ''
                                                    }
                                                }
                                            ]
                                        });
                                    });

                                    $scope.studentPerformanceList1 = "";
                                    $scope.studentPerformanceList2 = "";
                                    $scope.studentPerformanceList3 = "";
                                    $scope.studentPerformanceList4 = "";

                                    $scope.studentPerformanceData1 = "";
                                    $scope.studentPerformanceData2 = "";
                                    $scope.studentPerformanceData3 = "";
                                    $scope.studentPerformanceData4 = "";

                                    $('.showStudentDiv').show();
                                    $('#noRecord10').removeClass('noRecord');
                                    $('#noRecord11').removeClass('noRecord');

                                     $('#student_performance_print').show();    // hide print button for till the response come
                                     $('.performanceListPrint').show();    // hide print button for till the response come
                                    ////////  PERFORMANCE GRAPH ENDS ///////////////// 

                                } else {
                                    $scope.studentPerformanceList1 = "No Classes Found… ";
                                    $scope.studentPerformanceList2 = "Try: ";
                                    $scope.studentPerformanceList3 = "1. Reload the webpage.";
                                    $scope.studentPerformanceList4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                    //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                    $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                    $scope.studentPerformanceData2 = "Try: ";
                                    $scope.studentPerformanceData3 = "1. Reload the webpage.";
                                    $scope.studentPerformanceData4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                    //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    $('.showStudentDiv').hide();
                                    $('#noRecord10').addClass('noRecord');
                                    $('#noRecord11').addClass('noRecord');
                                }
                            } else {//ERROR : 500 in api

                                $scope.studentPerformanceList1 = "No Classes Found… ";
                                $scope.studentPerformanceList2 = "Try: ";
                                $scope.studentPerformanceList3 = "1. Reload the webpage.";
                                $scope.studentPerformanceList4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                $scope.studentPerformanceData2 = "Try: ";
                                $scope.studentPerformanceData3 = "1. Reload the webpage.";
                                $scope.studentPerformanceData4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                                //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                $('.showStudentDiv').hide();
                                $('#noRecord10').addClass('noRecord');
                                $('#noRecord11').addClass('noRecord');
                            }
                        });
                    };
                    $scope.graphstudentPerformanceSubjectwise(ClassId, GradeTrend, NameofSubject, HeaderColumn31);

                } else {
                    $scope.profileperlist = '';
                    $scope.studentprofileMessage = 'No classes found for ' + studentName;
                }
            } else {//ERROR : 500 in api
                /////LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content6").css("display", "none");
                $("#preloader_right_content6").css("display", "none");
                $scope.profileperlist = '';
                $scope.studentprofileMessage = 'No classes found for ' + studentName;
            }
        });


        /*RHS : GRAPH SUBJECT WISE */
        $scope.graphstudentPerformanceSubjectwise = function (ClassId, GradeTrend, nameofsubject, HeaderColumn3) {
            //var teacherId= getOnlyCookie("teacherId");

            if (GradeTrend == true) {
                $scope.plotcolor = "#5BD9A4";
            } else if (GradeTrend == false) {
                $scope.plotcolor = "#FF5958";
            } else if (GradeTrend == null || GradeTrend == "null") {
                $scope.plotcolor = "orange";
            } else {
                $scope.plotcolor = "orange";
            }

            $scope.NameofSubject = nameofsubject;


            homeService.studentPerformanceListResponse(access_token, ClassId, Id, function (response) {
                //console.log('PERFORMANCE STUDENT SUBJECT WISE');
                //console.log(response);
                if (response.status) {
                    if (response != '') {
                        $scope.studentPerformanceList = response;
                        $('.prof').css({ 'background-color': '' });
                        $('#prof' + ClassId).css({ 'background-color': 'rgba(157, 224, 242, 0.8)' });
                        //$scope.studentPerformanceListErrMsg = "";
                        //$scope.studentListMessagePopup = '';
                        //$('.noRecordClass').removeClass('noRecord');

                        GradeSetCode = new Array();
                        GradeSetValue = new Array();
                        GradeResultsDate = new Array();
                        GradeResultsGrade = new Array();
                        GradeResultsName = new Array();
                        Grade_and_Date = new Array();
                        GradeResultsDateTime = new Array();
                        GradeResultsSplit = new Array();
                        GradeResultsYear = new Array();
                        GradeResultsMnth = new Array();
                        GradeResultsDay = new Array();
                        GradeResultsGraphDate = new Array();
                        GradeResultsDateTimeYaxis = new Array();

                        TargetGradeDate = new Array();
                        TargetGradeDateSplit = new Array();
                        TargetGradeDatePlot = new Array();
                        TargetGradeGradePlot = new Array();
                        TargetGradeDatePlotYear = new Array();
                        TargetGradeDatePlotMnth = new Array();
                        TargetGradeDatePlotDay = new Array();
                        TargetGradeResultsGrade = new Array();

                        XaxisGradesDate = new Array();
                        XaxisGradesDateSplit = new Array();
                        XaxisGradesDatePlotYear = new Array();
                        XaxisGradesDatePlotMnth = new Array();
                        XaxisGradesDatePlotDay = new Array();
                        XaxisGradesGradePlot = new Array();
                        XaxisGradesResultsGrade = new Array();

                        for (var i = 0; i < response.GradeSet.length; i++) {
                            GradeSetCode[i] = response.GradeSet[i].Code;
                            GradeSetValue[i] = response.GradeSet[i].Value;
                        }
                        for (var j = 0; j < response.GradeResults.length; j++) {
                            GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                            GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                            GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                            GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]);
                            GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);

                            GradeResultsGraphDate[j] = GradeResultsYear[j] + ',' + GradeResultsMnth[j] + ',' + GradeResultsDay[j];

                            GradeResultsGrade[j] = response.GradeResults[j].Grade;
                            GradeResultsName[j] = response.GradeResults[j].Name;

                            GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j] + "," + GradeResultsMnth[j] + "," + GradeResultsDay[j]);
                        }
                        for (var k = 0; k < response.TargetGrades.length; k++) {
                            TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);
                            TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                            TargetGradeDatePlotYear[k] = parseInt(TargetGradeDateSplit[k][0]);
                            TargetGradeDatePlotMnth[k] = parseInt(TargetGradeDateSplit[k][1]);
                            TargetGradeDatePlotDay[k] = parseInt(TargetGradeDateSplit[k][2]);
                            TargetGradeDatePlot[k] = Date.UTC(TargetGradeDatePlotYear[k], TargetGradeDatePlotMnth[k], TargetGradeDatePlotDay[k]);
                            TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;
                        }

                        //console.log("GRAPH RESULT");
                        //console.log(response);
                        //console.log(GradeResultsName);
                        //console.log(GradeResultsDateTime);


                        /*calculation of academic year*/
                        var todayTime = new Date(st);
                        var monthAcademic = (todayTime.getMonth() + 1);
                        var dayAcademic = (todayTime.getDate());
                        var yearAcademic = (todayTime.getFullYear());
                        var nextYearAcademic = (todayTime.getFullYear() + 1);
                        var prevYearAcademic = (todayTime.getFullYear() - 1);

                        if (monthAcademic <= 8) {
                            //alert(1);
                            var academicYearStartDate = prevYearAcademic + '-' + '9' + '-' + '1';
                            var academicYearEndDate = yearAcademic + '-' + '8' + '-' + '31';
                        } else {
                            //alert(2);
                            var academicYearStartDate = yearAcademic + '-' + '9' + '-' + '1';
                            var academicYearEndDate = nextYearAcademic + '-' + '8' + '-' + '31';
                        }
                        //var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                        //var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';

                        var current_date = yearAcademic + '-' + monthAcademic + '-' + dayAcademic;

                        if ((current_date >= academicYearStartDate)) {
                            var currentAcademicYear1 = yearAcademic;
                            var currentAcademicYear2 = yearAcademic + 1;
                        } else {
                            var currentAcademicYear1 = yearAcademic - 1;
                            var currentAcademicYear2 = yearAcademic;
                        }
                        
                        ////////  PERFORMANCE GRAPH BEGIN /////////////////
                        $(document).ready(function () {
                            $('#graph_container_popup').highcharts({
                                exporting: { enabled: false },
                                chart: {
                                    type: 'line'
                                },
                                title: {
                                    // text: '<h2><b>Performance Graph</b></h2>'
                                    text: ''
                                },
                                xAxis: {
                                    type: 'datetime',
                                    title: {
                                        text: 'Month'
                                    },
                                    //dateTimeLabelFormats: { 
                                    //    month: '%b %Y',
                                    //    
                                    //},
                                    //categories: (function () {                                     
                                    //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                    //                {
                                    //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                    //                    return GradeResultsDateTimeYaxis[r];
                                    //                }
                                    //            }()),
                                    labels: {
                                        format: '{value:%b %Y}',
                                        style: {
                                            fontWeight: 'bold'
                                        }
                                    },
                                    gridLineWidth: 1,
                                },
                                yAxis: {
                                    min: 0,
                                    tickInterval: 1,
                                    labels: {
                                        formatter: function () {
                                            if (GradeSetCode[this.value] != undefined) {
                                                return '<b>' + GradeSetCode[this.value] + '</b>';
                                            }
                                        }
                                    },
                                    //categories: GradeSetCode,
                                    title: {
                                        text: HeaderColumn3
                                    },
                                },
                                plotOptions: {
                                    //spline: {
                                    //    marker: {
                                    //        enabled: true,
                                    //        radius: 3,
                                    //    },
                                    //},
                                    scatter: {
                                        lineWidth: 2,
                                    },
                                    series: {
                                        pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                        pointInterval: 15 * 24 * 3600 * 1000// one day
                                    }
                                },
                                tooltip: {
                                    shared: false,
                                    formatter: function () {
                                        var tooltiptxt = '';
                                        if (this.series.name == HeaderColumn3) {
                                            tooltiptxt = '<b>' + GradeResultsName[this.y] + '</b><br> ' + HeaderColumn3 + ' ' + GradeSetCode[this.y] + ', ' + Highcharts.dateFormat('%e %b %Y', new Date(this.x));
                                            return tooltiptxt;
                                        } else {
                                            return false;
                                        }
                                    },
                                    shared: false,
                                    backgroundColor: $scope.plotcolor,
                                    style: {
                                        color: 'white'
                                    },
                                },
                                legend: {
                                    enabled: true
                                },
                                plotOptions: {
                                    spline: {
                                        marker: {
                                            enabled: true,
                                            radius: 3,
                                        },
                                    },
                                    scatter: {
                                        lineWidth: 2,
                                    }
                                },
                                series: [
                                    {
                                        showInLegend: false,
                                        name: 'XaxisGrades',
                                        color: '#FFF',
                                        data: (function () {
                                            var data2 = [];
                                            for (var m = 0; m < response.XaxisGrades.length; m++) {
                                                XaxisGradesDate[m] = convertDate(response.XaxisGrades[m].Date);
                                                XaxisGradesDateSplit[m] = XaxisGradesDate[m].split('-');
                                                XaxisGradesDatePlotYear[m] = parseInt(XaxisGradesDateSplit[m][0]);
                                                XaxisGradesDatePlotMnth[m] = parseInt(XaxisGradesDateSplit[m][1]);
                                                XaxisGradesDatePlotDay[m] = parseInt(XaxisGradesDateSplit[m][2]);
                                                XaxisGradesGradePlot[m] = response.XaxisGrades[m].Grade;
                                                XaxisGradesResultsGrade[m] = response.XaxisGrades[m].Grade;
                                                data2.push({
                                                    x: Date.UTC(XaxisGradesDatePlotYear[m], (XaxisGradesDatePlotMnth[m] - 1), XaxisGradesDatePlotDay[m]),
                                                    y: GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                });
                                            }
                                            return data2;
                                        }()),
                                        marker: {
                                            enabled: false,
                                            states: {
                                                hover: {
                                                    enabled: false
                                                }
                                            }
                                        },
                                    },
                                    {
                                        showInLegend: true,
                                        name: 'Target',
                                        color: '#48CAE5',
                                        data: (function () {
                                            var data = [];
                                            //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                            for (var m = 0; m < response.TargetGrades.length; m++) {
                                                TargetGradeDate[m] = convertDate(response.TargetGrades[m].Date);
                                                TargetGradeDateSplit[m] = TargetGradeDate[m].split('-');
                                                TargetGradeDatePlotYear[m] = parseInt(TargetGradeDateSplit[m][0]);
                                                TargetGradeDatePlotMnth[m] = parseInt(TargetGradeDateSplit[m][1]);
                                                TargetGradeDatePlotDay[m] = parseInt(TargetGradeDateSplit[m][2]);
                                                TargetGradeGradePlot[m] = response.TargetGrades[m].Grade;
                                                //TargetGradeResultsGrade[m]  = response.TargetGrades[m].Grade;
                                                data.push({
                                                    x: Date.UTC(TargetGradeDatePlotYear[m], (TargetGradeDatePlotMnth[m] - 1), TargetGradeDatePlotDay[m]),
                                                    y: GradeSetCode.indexOf(TargetGradeGradePlot[m]),
                                                });
                                            }
                                            return data;
                                        }()),
                                        marker: {
                                            enabled: false,
                                            states: {
                                                hover: {
                                                    enabled: false
                                                }
                                            }
                                        },
                                    },
                                    {
                                        showInLegend: true,
                                        name: 'Grade',
                                        color: $scope.plotcolor,
                                        type: "scatter",
                                        data: (function () {
                                            var data = [];
                                            //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                            for (var j = 0; j < response.GradeResults.length; j++) {
                                                GradeResultsDate[j] = convertDate(response.GradeResults[j].Date);
                                                GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                GradeResultsYear[j] = parseInt(GradeResultsSplit[j][0]);
                                                GradeResultsMnth[j] = parseInt(GradeResultsSplit[j][1]) - 1;
                                                GradeResultsDay[j] = parseInt(GradeResultsSplit[j][2]);
                                                GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                GradeResultsName[j] = response.GradeResults[j].Name;
                                                data.push({
                                                    x: Date.UTC(GradeResultsYear[j], GradeResultsMnth[j], GradeResultsDay[j]),
                                                    y: GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                });


                                            }
                                            return data;
                                        }()),
                                        marker: {
                                            enabled: true,
                                            radius: 5,
                                            symbol: 'circle'
                                        },
                                        tooltip: {
                                            pointFormat: ''
                                        }
                                    }
                                ]
                            });
                        });

                        $scope.studentPerformanceList1 = "";
                        $scope.studentPerformanceList2 = "";
                        $scope.studentPerformanceList3 = "";
                        $scope.studentPerformanceList4 = "";

                        $scope.studentPerformanceData1 = "";
                        $scope.studentPerformanceData2 = "";
                        $scope.studentPerformanceData3 = "";
                        $scope.studentPerformanceData4 = "";

                        $('.showStudentDiv').show();
                        $('#noRecord10').removeClass('noRecord');
                        $('#noRecord11').removeClass('noRecord');
                        ////////  PERFORMANCE GRAPH ENDS ///////////////// 

                    } else {
                        $scope.studentPerformanceList1 = "No Classes Found… ";
                        $scope.studentPerformanceList2 = "Try: ";
                        $scope.studentPerformanceList3 = "1. Reload the webpage.";
                        $scope.studentPerformanceList4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                        //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                        $scope.studentPerformanceData1 = "No Performance Data Found… ";
                        $scope.studentPerformanceData2 = "Try: ";
                        $scope.studentPerformanceData3 = "1. Reload the webpage.";
                        $scope.studentPerformanceData4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                        //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                        $('.showStudentDiv').hide();
                        $('#noRecord10').addClass('noRecord');
                        $('#noRecord11').addClass('noRecord');
                    }
                } else {//ERROR : 500 in api

                    $scope.studentPerformanceList1 = "No Classes Found… ";
                    $scope.studentPerformanceList2 = "Try: ";
                    $scope.studentPerformanceList3 = "1. Reload the webpage.";
                    $scope.studentPerformanceList4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                    //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                    $scope.studentPerformanceData1 = "No Performance Data Found… ";
                    $scope.studentPerformanceData2 = "Try: ";
                    $scope.studentPerformanceData3 = "1. Reload the webpage.";
                    $scope.studentPerformanceData4 = "2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";

                    //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                    $('.showStudentDiv').hide();
                    $('#noRecord10').addClass('noRecord');
                    $('#noRecord11').addClass('noRecord');
                }
            });
        };
    }


    $scope.changeStyle = function () {

        $('.select_outter_new').removeClass('blink_me');
    }

    /*FETCH STUDENT LIST WHEN CLASS IS SELECTED FROM DROPDOWN IN CREATE NEW TASK MODAL*/
    $scope.studentListResponseDropdown = function (classId) {
        //var teacherId= getOnlyCookie("teacherId");
        // console.log($("input[name='studentIdTaskPopupCheckbox[]']"));
        // console.log($('#studentIdsForTaskPopUp').val()); 
        $("input[name='studentIdTaskPopupCheckbox[]']").prop('checked', false);     // Added by Krishna 07.02.2017
        $('#studentIdsForTaskPopUp').val('');
        // console.log($("input[name='studentIdTaskPopupCheckbox[]']"));
        // console.log($('#studentIdsForTaskPopUp').val());
        $scope.countSelectStudentsTaskPopup = 0;
        ///LOADER SHOW
        $(window).scrollTop(0);
        $("#status_create_task_modal").css("display", "block");
        $("#preloader_create_task_modal").css("display", "block");

        if (classId == 0) {
            $('.select_outter_new').css({ 'border': '2px solid #54c9e8' });
            $('.select_outter_new').addClass('blink_me');
        } else {
            $('.select_outter_new').css({ 'border': 'none' });
            $('.select_outter_new').removeClass('blink_me');
        }
        //var classId = $scope.classIdModel;
        setOnlyCookie("classId", classId, 60 * 60 * 60);

        homeService.studentListResponse(access_token, classId, function (response) {
            if (response.status) {
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_create_task_modal").fadeOut();
                $("#preloader_create_task_modal").delay(200).fadeOut("slow");
                if (response != '') {
                    //  $("#createTaskMessage").css("display", "none");
                    $('.showStudentDivPopup').show();
                    $(".setTaskPopBtn").removeAttr('disabled');
                    $scope.studentList = response;
                    $scope.noOfStudents = response.length;
                    $scope.nostudentList = "";
                    $scope.nostudentList1 = "";
                    $scope.nostudentList2 = "";
                    $scope.nostudentList3 = "";
                    $scope.nostudentlist4 = "";
                    //$scope.studentListMessagePopup = '';
                    //$('#noRecord5').removeClass('noRecord');
                    $('#noRecord7').removeClass('noRecord');

                    //on changing class name from dropdown selected check box gets deselected
                    var SelectedStudentIds = new Array();
                    $scope.isExist = function (id) {
                        return SelectedStudentIds.indexOf(id);
                    }
                    var numberOfChecked = 0;
                    $('#remember4').prop('checked', false);
                    $('#remember4').removeAttr('checked');
                } else {

                    if (classId == 0) {
                        $('.select_outter_new').css({ 'border': '2px solid #54c9e8' });
                        $('.select_outter_new').addClass('blink_me');
                        $('.showStudentDivPopup').hide();
                        $(".setTaskPopBtn").attr('disabled');
                        $scope.studentList = '';
                        $scope.noOfStudents = 0;
                        $("#noRecord7").css("display", "none");
                        $('#noRecord7').removeClass('noRecord');
                    } else {
                        $('.showStudentDivPopup').hide();
                        $(".setTaskPopBtn").attr('disabled');
                        $scope.studentList = '';
                        $scope.noOfStudents = 0;
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1 = "Try: ";
                        $scope.nostudentList2 = "1. Reload the webpage.";
                        $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                        $scope.nostudentlist4 = "here.";
                        $("#noRecord7").css("display", "block");
                        $('#noRecord7').addClass('noRecord');
                    }

                }

            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api

                $('.showStudentDivPopup').hide();
                $("#confy1").click();
                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                $(".setTaskPopBtn").attr('disabled');
                $scope.studentList = '';
                $scope.noOfStudents = 0;
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentlist4 = "here.";
                $("#noRecord7").css("display", "block");
                $('#noRecord7').addClass('noRecord');

            } else {
                $('.showStudentDivPopup').hide();
                $(".setTaskPopBtn").attr('disabled');
                $scope.studentList = '';
                $scope.noOfStudents = 0;
                $scope.nostudentList = "No Students Found… ";
                $scope.nostudentList1 = "Try: ";
                $scope.nostudentList2 = "1. Reload the webpage.";
                $scope.nostudentList3 = "2. If the problem persists, please submit your query";
                $scope.nostudentlist4 = "here.";
                $("#noRecord7").css("display", "block");
                $('#noRecord7').addClass('noRecord');
            }

        });
    };




    /******************  ***  ***MY TASK SECTION begins (includes CREATE NEW TASK POP UP SECTION)***  ***  ****************/
    $scope.removeWeekRangeCookie = function () {
        //var teacherId= getOnlyCookie("teacherId");

        removeItem("weekStartDate");
        removeItem("weekEndDate");
        $('#week_drp').css({'display':'none'});
        fromDate = new Date(st);
        fromDateTime = fromDate.getTime();
        var weekDay = fromDate.getDay();

        if (weekDay == 0) {    //if weekday = 0 ; then day is SUNDAY
            //var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
            //var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );

            var weekStartDate = $scope.ISOdateConvertion((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6));
            var weekEndDate = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000))));

        } else {
            var weekStartDate = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)) + 86400000)));
            var weekEndDate = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)) + (86400000 * 7))));
        }

        //console.log("CHECK FORMAT="+weekStartDate);
        //console.log(weekStartDate + '   @@@   ' + weekEndDate);
        setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
        setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);
    }
    $scope.removeWeekRangeCookie();
    //$("#myTask").removeClass('active');

    $(document).on('click', '.dropdown-menu', function (e) {
        if (e.target.nodeName == 'B' || e.target.nodeName == 'DIV')
            e.stopPropagation();

    });


    $scope.myTimetable = function ()
    {
      
        if($scope.Timetable)
        {
            ///LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content14").css("display", "block");
        $("#preloader_right_content14").css("display", "block");

        homeService.myTimetableResponse(access_token, function (response) {
            var start_date = Array();
            var end_date = Array();
            //console.log("response_timetable");
            //console.log(response.Timetables);
            if (response.status == true) {
                $scope.mynumber = 5;
                $scope.timetableRes = response.Timetables;
                $scope.SDate = start_date;
                $scope.EDate = end_date
                //console.log($scope.SDate);
                //console.log($scope.EDate);
            } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                $("#confy1").click();
                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                $scope.timetableRes = "";
            } else {
                $scope.timetableRes = "";
            }
            ///LOADER HIDE
            $(window).scrollTop(0);
            $("#status_right_content14").css("display", "none");
            $("#preloader_right_content14").css("display", "none");

        });

        setTimeout(function () {
            $('.modal-backdrop').hide(); // for black background
            $('body').removeClass('modal-open'); // For scroll run
            $('#successMsg_modal1').modal('hide');
        }, 2000);

        setOnlyCookie("tab", "myTimetable", 60 * 60 * 60);
        ///LOADER HIDE
        $(window).scrollTop(0);
        $("#status_right_content").fadeOut();
        $("#preloader_right_content").delay(200).fadeOut("fast");
        
        }else{
            $('#supportfeature').click();
        }
        

    };

    /*MY INBOX*/

    $scope.myInbox = function ()
    {
        if ($scope.Messaging) {
        $('.msgstud').removeClass('studSelect');
        //var teacherId= getOnlyCookie("teacherId");
        //LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content8").css("display", "block");
        $("#preloader_right_content8").css("display", "block");
        //$scope.UnreadMessageCountNew = 0;
        $scope.isDisabled = true;
        $('#append_search_div').html('');
        $('#sendMessageInboxReset').click();
        $('.RHS_Section').hide();
        $('#LHS_Section').css("border-right", "1px solid #d7d7d7");
        $('.myNoINnernet').css({ 'display': 'none' });
        $('.myInINnernet').css({ 'display': 'block' });
        $('#noMsg').show();
        $scope.studentListInbox = '';
        setOnlyCookie("tab", "myInbox", 60 * 60 * 60);
        $scope.studActive = 0;


        $timeout(function () {
            //CLICK ON STUDENT NAME
            $scope.studentInboxPerformanceResponse = function (studentId, classId, Firstname, Lastname, ParentsName, Image, ClassName, IsUnlocked, SubjectName) {
                $scope.studActive = 1;

                $('.user_box').removeClass('studSelect');
                $("#preloader_right_inbox").css("display", "block");

                $('.msgstud').removeClass('studSelect');
                if ($scope.studActive == 1) {
                    $('#msgstud' + studentId + classId).addClass('studSelect');
                    $scope.studActive = 0;
                }

                var oteachers = '';
                //$scope.InboxMessageHistoryLoadMore=[];
                $('#load_more_div').hide();
                //$('#chat_div').hide();
                $('#append_dummy_div').hide();

                /*RED DOT OF UNREAD MSGs WILL DISAPPEAR */
                $timeout(function () {
                    $('.red_dummy').delay(200).fadeOut("slow");
                    $('.red_dummy').delay(200).fadeOut("slow");
                    $('.red_dummy').delay(200).fadeOut("slow");
                }, 5000);

                $('#loader10').hide();
                $('#sendMessageInbox').css('pointer-events', 'auto');
                $scope.InboxMessageHistory = "";
                $('#content1').val('');
                $("#content1").attr("placeholder", "Please enter your message").removeClass('red_place');

                $('.RHS_Section').show();
                $('#LHS_Section').css("border-right", "none");
                $('#noMsg').hide();
                $('#append_dummy_div').html('');

                $scope.FirstnameInbox = Firstname;
                $scope.LastnameInbox = Lastname;
                $scope.ClassNameInbox = ClassName;
                $scope.ImageInbox = Image;
                $scope.IsUnlockedInbox = IsUnlocked;
                $scope.SubjectName = SubjectName;

                if (IsUnlocked == false) {
                    $("#content1").attr("disabled", true);
                    $("#content1").attr("placeholder", "").removeClass('red_place');
                    //document.getElementById("chat_box").removeEventListener("wheel", myFunction);
                    //$('#loader10').hide();
                    //$('#load_more_div').hide();  
                    //$('#chat_div').hide();
                    //$('#append_dummy_div').hide();
                    $('#sendMessageInbox').hide();
                    $scope.ParentsNameInbox = "Messages cannot be sent to Parent. Student account must be unlocked by parent.";
                } else {
                    $("#content1").attr("disabled", false);
                    $("#content1").attr("placeholder", "Type a message here...").removeClass('red_place');
                    $('#load_more_div').show();
                    //$('#chat_div').show();
                    $('#append_dummy_div').show();
                    $('#sendMessageInbox').show();

                    $scope.ParentsNameInbox = "Parents/Guardians: " + ParentsName;
                }
                //call from mouse wheel
                //function myFunction(event) {
                //    //console.log(event);
                //    var offset = $("#dummy_top_div").offset();
                //    var Top = offset.top;
                //    if (Top == 0) {
                //        if (IsUnlocked == true) {
                //            $('#loader10').show();
                //            $timeout(function () {
                //               
                //                $scope.getMore();
                //            }, 500);
                //        } else {
                //            //$('#loader10').hide();
                //            //$('#chat_box').html('');            
                //        }
                //    }
                //
                //}

                homeService.studentInboxPerformanceResponse(access_token, studentId, classId, function (response) {
                    //console.log('----::: STUD INBOX PERFORMANCE :::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                    //console.log(response);

                    //RELOAD MESSAE COUNTER
                    homeService.reloadMessageCounterResponse(access_token, studentId, classId, function (response4) {
                        //console.log('RELOAD MSG COUNTER' + studentId + classId);
                        //console.log(response4);
                        var reloadMessageCounterResponse = response4.UnreadMessageCount;
                        if (reloadMessageCounterResponse != 0) {
                            $('#unreadMsg' + studentId + classId).html(reloadMessageCounterResponse);
                        } else {
                            $('#unreadMsg' + studentId + classId).html(' ');
                            $('#unreadMsg' + studentId + classId).css("display", "none");
                        }
                    });
                    $scope.teacherDetailsResponse();
                    $('.search-user-side-right').css({ 'display': 'block' });
                    $('.noInernet').css({ 'display': 'none' });
                    if (response.status) {
                        if (response != '') {
                            for (a = 0; a < response.ClassTeachers.length; a++) {
                                if (userid != response.ClassTeachers[a].UserId) {
                                    if (a == 0) {
                                        oteachers += response.ClassTeachers[a].Name;
                                    } else {
                                        if (oteachers != "") {
                                            oteachers += ', ' + response.ClassTeachers[a].Name;
                                        } else {
                                            oteachers += response.ClassTeachers[a].Name;
                                        }
                                    }
                                }
                            }
                            if (oteachers == "") {
                                $scope.otherTeachers = "None";
                            } else {
                                $scope.otherTeachers = oteachers;
                            }
                          //  console.log("W16 RESPONSE");console.log(response);
                            $scope.studentInboxAttendance = response.Performance.Column1.Value;
                            $scope.studentInboxAttendanceTrend = response.Performance.Column1.Trend;
                            $scope.studentInboxAttendanceUnit = response.Performance.Column1.Unit;
                            $scope.studentInboxAttendanceHeader = response.Performance.Column1.Header;

                            $scope.studentInboxTargetTrend = response.Performance.Column2.Trend;
                            $scope.studentInboxTargetGrade = response.Performance.Column2.Value;
                            $scope.studentInboxTargetUnit = response.Performance.Column2.Unit;
                            $scope.studentInboxTargetHeader = response.Performance.Column2.Header;

                            $scope.studentInboxLastGrade = response.Performance.Column3.Value;
                            $scope.studentInboxGradeTrend = response.Performance.Column3.Trend;
                            $scope.studentInboxGradeUnit = response.Performance.Column3.Unit;
                            $scope.studentInboxGradeHeader = response.Performance.Column3.Header;

                            $scope.studentInboxstatus = response.status;

                            //$('#unreadMsg'+studentId+classId).css({'display':'none'});
                            //$('.user_box').removeClass('studSelect');
                            //$('#msgstud'+studentId+classId).addClass('studSelect');

                            //*********LOAD MORE SCROLL**********//

                            //if (IsUnlocked == true) {
                            $('#load_more_div').show();
                            //$('#chat_div').show();
                            $('#append_dummy_div').show();
                            //$timeout(function () {
                            //    //$("#chat_box").mCustomScrollbar("scrollTo","bottom",{ scrollInertia:0 });
                            //    document.getElementById("chat_box").addEventListener("wheel", myFunction);
                            //}, 100);
                            //}else if (IsUnlocked == false){
                            //    //document.getElementById("chat_box").removeEventListener("wheel", myFunction);
                            //    //$('#loader10').hide();
                            //    //$('#load_more_div').hide();
                            //    //$('#chat_div').hide();
                            //    //$('#append_dummy_div').hide();                
                            //}

                        } else {
                            $scope.studentInboxAttendance = "";
                            $scope.studentInboxAttendanceTrend = "";
                            $scope.studentInboxGradeTrend = "";
                            $scope.studentInboxLastGrade = "";
                            $scope.studentInboxTargetGrade = "";
                            $scope.studentInboxstatus = "";
                            $("#preloader_right_inbox").css("display", "none");
                        }

                    } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        $('.search-user-side-right').css({ 'display': 'none' });
                        $('.noInernet').css({ 'display': 'block' });
                        $scope.studentInboxAttendance = "";
                        $scope.studentInboxAttendanceTrend = "";
                        $scope.studentInboxGradeTrend = "";
                        $scope.studentInboxLastGrade = "";
                        $scope.studentInboxTargetGrade = "";
                        $scope.studentInboxstatus = "";
                        $("#preloader_right_inbox").css("display", "none");
                    } else {
                        $scope.studentInboxAttendance = "";
                        $scope.studentInboxAttendanceTrend = "";
                        $scope.studentInboxGradeTrend = "";
                        $scope.studentInboxLastGrade = "";
                        $scope.studentInboxTargetGrade = "";
                        $scope.studentInboxstatus = "";
                        $("#preloader_right_inbox").css("display", "none");
                    }
                });

                var userid = getOnlyCookie("userid");

                var parent_array = [];
                $scope.getColor = function (parentId) {
                    var color_array = ['color_red', 'color_blue', 'color_yellow', 'color_green', 'color_magento', 'color_black', 'color_grey', 'color_orange'];

                    var parentid_index = $.inArray(parentId, parent_array);
                    // console.log(parentid_index);
                    if (parentid_index < 0) {
                        parent_array.push(parentId);
                        var parentid_index = parent_array.length
                    }
                    color = color_array[parentid_index];
                    return color;
                }

                /*LOAD MESSAGE HISTORY*/
                homeService.InboxMessageHistoryResponse(access_token, studentId, classId, function (response1) {
                    var UnreadMessageStatus = 0;
                    var key = "";
                    if (response1.status) {
                        //$("#preloader_right_inbox").css("display","none");
                        if (response1 != '')
                        {
                            //if (IsUnlocked == true)
                            //{
                            //console.log('MESSAGE HISTORY');
                            //console.log(response1);
                            $scope.InboxMessageHistory = response1;
                            $timeout(function () {
                                $("#chat_box").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 0 });

                            }, 300);
                            $timeout(function () {
                                $("#preloader_right_inbox").css("display", "none");
                            }, 400);

                            $('#load_more_div').show();
                            //$('#chat_div').show();
                            $('#append_dummy_div').show();
                            for (var k = 0; k < response1.length; k++) {
                                if (response1[k].SenderUserId != userid) {
                                    if (response1[k].IsRead == false) {
                                        if (key == '') {
                                            key = response1[k].Id;
                                            //break;
                                        }
                                        UnreadMessageStatus++;
                                    }
                                }
                            }
                            //$timeout(function () {
                            //    if (key == "") {
                            //        $("#chat_box").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 0 });
                            //    }
                            //}, 300);
                            $timeout(function () {

                                if (key != "") {
                                    var div = "msg" + key;
                                    // var objDivPosition = $("#msg"+key).offset().top;

                                    $('#chat_box').mCustomScrollbar("scrollTo", "#msg" + key, { scrollInertia: 0 });

                                }
                            }, 1000);


                            /*UNREAD MESSAGE COUNT CHECK*/
                            //console.log("InboxMessageHistoryResponse");
                            //console.log(response1);

                            $scope.noChatFound = "";
                            $scope.loggedInTeacherId = userid;
                            $scope.latestmessagetime = response1[0].SentDate;
                            $scope.loggedInTeacherIdLoadMore = userid;
                            //$("#append_chat_div").mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
                            $scope.fetching = false;
                            $scope.disabled = false;
                            $("#latestmessagetime").val(response1[0].SentDate);
                            var latestmessagetime = $("#latestmessagetime").val();

                            $scope.stripAddr = function (content) {

                                var d= content.replace(/\n/g, '<br>');
                                return d;
                            }

                            /***ON CLICK LOAD MORE MESSAGES BUTTON*******/
                            $scope.getMoreStatus = true;
                            var LOAD_MORE_ARR = new Array();
                            var datarepeat = 0;
                            $scope.InboxMessageHistoryLoadMore = [];

                            $scope.getMore = function () {
                                $('#preloader_right_inbox1').css({ "display": "block" });
                                $('#loader10').css({ "display": "block" });
                                //console.log('GETMORESTATUS  = ' + $scope.getMoreStatus);
                                /*RED DOT OF UNREAD MSGs WILL DISAPPEAR */
                                $timeout(function () {
                                    $('.red_dummy').delay(200).fadeOut("slow");
                                    $('.red_dummy').delay(200).fadeOut("slow");
                                    $('.red_dummy').delay(200).fadeOut("slow");
                                }, 5000);

                                $('#load_more_div').show();
                                //$('#chat_div').show();
                                $('#append_dummy_div').show();

                                //$('#loader10').hide();
                                var latestmessagetime1 = $("#latestmessagetime").val();

                                // Block fetching until the AJAX call returns
                                if ($scope.getMoreStatus == true) {
                                    $scope.getMoreStatus = false;

                                console.log('studentId= '+studentId+'classId= '+classId+'latestmessagetime1= '+latestmessagetime1);
                                    /*LOAD MORE MESSAGES*/
                                    homeService.InboxMessageHistoryLoadMoreResponse(access_token, studentId, classId, latestmessagetime1, function (response2) {
                                        var UnreadMessageStatus2 = 0;
                                        var key1 = 0;
                                        var k2 = 0;
                                        console.log(response2);
                                        if (response2.status) {
                                            //(typeof variable === 'undefined')
                                            if (response2.msg == "0") {
                                                if (typeof response2[0].SentDate !== undefined) {
                                                    console.log('MESSAGE HISTORY LOAD MORE');
                                                    console.log(response2);

                                                    if (datarepeat == 0) {
                                                        $scope.InboxMessageHistoryLoadMore = response2;
                                                        datarepeat++;

                                                    } else {
                                                        $scope.InboxMessageHistoryLoadMore = response2.concat($scope.InboxMessageHistoryLoadMore);
                                                    }
                                                    $scope.loggedInTeacherIdLoadMore = userid;
                                                    $("#latestmessagetime").val(response2[0].SentDate);
                                                    $('#load_more_div').show();
                                                    //$('#chat_div').show();
                                                    $('#append_dummy_div').show();
                                                    for (var j = 0; j < response2.length; j++) {
                                                        if (response1[j].SenderUserId != userid) {
                                                            if (response1[j].IsRead == false) {
                                                                if (key1 == '') {
                                                                    key1 = response2[j].Id;
                                                                    //break;
                                                                }
                                                                UnreadMessageStatus++;
                                                            }
                                                        }
                                                        var lastId = response2[j].Id;
                                                    }
                                                    $timeout(function () {
                                                        if (key1 == "") {
                                                            $("#chat_box").mCustomScrollbar("scrollTo", "#msg" + lastId, { scrollInertia: 0 });
                                                        }
                                                    }, 300);
                                                    $timeout(function () {

                                                        if (key1 != "") {
                                                            var div = "msg" + key1;
                                                            // var objDivPosition = $("#msg"+key).offset().top;

                                                            $('#chat_box').mCustomScrollbar("scrollTo", "#msg" + key1, { scrollInertia: 0 });

                                                        }
                                                    }, 1000);
                                                    //RELOAD MESSAGE COUNTER
                                                    homeService.reloadMessageCounterResponse(access_token, studentId, classId, function (response4) {
                                                        //console.log('RELOAD MSG COUNTER' + studentId + classId);
                                                        //console.log(response4);
                                                        var reloadMessageCounterResponse = response4.UnreadMessageCount;
                                                        //$('#unreadMsg'+studentId+classId).html(reloadMessageCounterResponse);
                                                        if (reloadMessageCounterResponse != 0) {
                                                            $('#unreadMsg' + studentId + classId).html(reloadMessageCounterResponse);
                                                        } else {
                                                            $('#unreadMsg' + studentId + classId).html(' ');
                                                            $('#unreadMsg' + studentId + classId).css("display", "none");
                                                        }
                                                    });
                                                    $scope.teacherDetailsResponse();
                                                    //}
                                                } else {
                                                    $scope.disabled = true;
                                                }
                                            } else {
                                                $scope.disabled = true;
                                                $('#preloader_right_inbox1').css({ "display": "none" });
                                                $('#nomsgfound').css({ "display": "block" });

                                            }
                                        } else if (response2.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                                            $("#confy1").click();
                                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                            $scope.disabled = true;
                                        } else {
                                            $scope.disabled = true;
                                        }
                                        $('#loader10').css({ "display": "none" });
                                         $timeout(function () {
                                        $('#preloader_right_inbox1').css({ "display": "none" });
                                         },1200);
                                         $timeout(function(){
                                            
                                            $('#nomsgfound').css({ "display": "none" });
                                            },1500);
                                        $scope.getMoreStatus = true;
                                    });
                                }

                            };
                        } else {
                            //console.log('MESSAGE HISTORY');
                            //console.log(response1);
                            $scope.InboxMessageHistory = "";
                            $scope.noChatFound = "";
                            //$scope.noChatFound = "No Active Chats Found…";
                            $scope.loggedInTeacherId = userid;
                            $scope.latestmessagetime = "";
                            $("#preloader_right_inbox").css("display", "none");
                        }
                    } else if (response1.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        //console.log('MESSAGE HISTORY');
                        //console.log(response1);
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        $scope.InboxMessageHistory = "";
                        $scope.noChatFound = "";
                        //$scope.noChatFound = "No Active Chats Found…";
                        $scope.loggedInTeacherId = userid;
                        $scope.latestmessagetime = "";
                        $("#preloader_right_inbox").css("display", "none");
                    } else {
                        //console.log('MESSAGE HISTORY');
                        //console.log(response1);
                        $scope.InboxMessageHistory = "";
                        $scope.noChatFound = "";
                        //$scope.noChatFound = "No Active Chats Found…";
                        $scope.loggedInTeacherId = userid;
                        $scope.latestmessagetime = "";
                        $("#preloader_right_inbox").css("display", "none");
                    }
                });
                //}
                function h(e) {
                    $(e).css({ 'height': 'auto', 'overflow-y': 'hidden' }).height(e.scrollHeight);
                }
                $("#content1").keypress(function (e) {
                    $("#content1").attr("placeholder", "Please enter your message").removeClass('red_place');
                    if (e.which == 13) {
                        $("#content1").mousedown(function () {
                            $("#content1").attr("placeholder", "Please enter your message").removeClass('red_place');
                        });
                        if ($('#content1').val().toString().trim() == '') {
                            $('#content1').val('');
                            $("#content1").attr("placeholder", "Please enter your message").addClass('red_place');
                            return false;
                        } else {
                            $("#content1").attr("placeholder", "Type a message here...").removeClass('red_place');
                        }
                    }
                });

                /*SEND MESSAGE INBOX*/
                $scope.sendMessageInbox = function () {
                    // $scope.studActive = 1;
                    //console.log('----------INSIDE------------------');
                    $("#content1").mousedown(function () {
                        $("#content1").attr("placeholder", "Please enter your message").removeClass('red_place');
                    });
                    $scope.stripAddr1 = function (content) {
                        return content.replace(/\n/g, '<br>');
                    }

                    $scope.noChatFound = "";
                    var content = $.trim($("#content1").val());
                    var error = 0;
                    if ($('#content1').val().toString().trim() == '') {
                        $('#content1').val('');
                        $("#content1").attr("placeholder", "Please enter your message").addClass('red_place');
                        error++;
                        return false;
                    } else {
                        $("#content1").attr("placeholder", "Type a message here...").removeClass('red_place');
                    }
                    if (content.length > 500) {
                        $("#content1").attr("placeholder", "Your message must not be more than 500 characters").addClass('red_place');
                        error++;
                        return false;
                    } else {
                        $("#content1").attr("placeholder", "Type a message here...").removeClass('red_place');
                    }

                    if (error == 0) {
                        $('#sendMessageInbox').css('pointer-events', 'none');
                        //$('#sendMessageInbox').css('background-color', '#8d8c8c');
                        homeService.studentInboxMessageSend(access_token, studentId, classId, content, function (response3) {
                            //console.log('INBOX MESSAGE SEND');
                            //console.log(response3);

                            if (response3.status) {
                                //$('#msgstud'+studentId+classId).addClass('studSelect'); ////??????????/
                                $scope.response3 = response3;
                                var SenderName = response3.SenderName;
                                var Content = response3.Content;
                                var SentDate = $filter('date')(response3.SentDate, "dd MMM HH:mm");
                                var Id = response3.Id;
                                $('#append_dummy_div').append('<span class="clearfix " style="display: block;"><div class="chat-convrstaion chat-rel"><div class="conversation arrow_box" id="msg' + Id + '"></div><span>' + SentDate + '</span></div></span>');
                                $("#content1").val('');
                                $('#msg' + Id).html($scope.stripAddr1(Content));

                                // $scope.studentListInboxResponse();
                                // $("#preloader_left_inbox").css("display", "block");

                                $timeout(function () {
                                    $scope.param = 0;
                                    //$('#txt'+response3.Id).css({'height':'auto','overflow-y':'hidden'}).height('#txt'+response3.Id.scrollHeight);
                                    //$("#chat_box").mCustomScrollbar({
                                    //    axis: "y",
                                    //    theme: "3d",
                                    //    scrollInertia: 550,
                                    //    scrollbarPosition: "outside"
                                    //});

                                    $("#chat_box").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 0 });
                                }, 100);
                                $scope.isDisabled = false;
                            } else if (response3.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                                $scope.isDisabled = false;
                                $("#confy1").click();
                                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            } else {
                                $scope.isDisabled = false;
                            }

                            $('#sendMessageInbox').css('pointer-events', 'auto');
                            //$('#sendMessageInbox').css('background-color', '#fff');
                            //$('#sendMessageInbox').css('color', '#54c9e8');

                        });
                    }
                };

            };
            $("#chat_box").mCustomScrollbar({
                //axis:"y",
                //autoHideScrollbar:true,
                //alwaysShowScrollbar:0,
                //contentTouchScroll:true,
                //mouseWheel: true,
                //advanced:{autoExpandHorizontalScroll:false},

                callbacks: {
                    onTotalScrollBack: function () {
                        console.log('load more calling');
                        // $('#loader10').show();
                        $('#loader10').css({ "display": "block" });
                        //console.log("Scrolled to end of content.");
                        //$timeout(function () {

                        $scope.getMore();
                        //}, 500);
                    }
                }

            });

            $scope.studentListInboxResponse = function () {
                homeService.studentListInboxResponse(access_token, function (response) {
                    $scope.studActive = 0;
                    /*RESET STUDENT IDS IN HIDDEN FILED*/
                    $('#studentIds').val('');
                    var studentIds = Array();
                    var classIds = Array();
                    //console.log('STUDENT LIST INBOX');
                    //console.log(response);
                    if (response.status) {
                        if (response != '') {
                            $('#append_search_div').html('');
                            $scope.studentListInbox = response;
                            $('#noMsgClass').hide();
                            for (var i = 0; i < response.length; i++) {
                                studentIds[i] = response[i].Id;
                                classIds[i] = response[i].ClassId;
                            }
                            $scope.noStudentMsg = "";
                            $("#preloader_left_inbox").css("display", "none");
                            //LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content8").css("display", "none");
                            $("#preloader_right_content8").css("display", "none");
                        } else {
                            $scope.studentListInbox = "";
                            $('#noMsgClass').show();
                            $scope.noStudentMsg = "No student found";
                            //LOADER HIDE
                            $("#preloader_left_inbox").css("display", "none");
                            $(window).scrollTop(0);
                            $("#status_right_content8").css("display", "none");
                            $("#preloader_right_content8").css("display", "none");
                        }
                        $scope.teacherDetailsResponse();
                    } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        $('.myNoINnernet').css({ 'display': 'block' });
                        $('.myInINnernet').css({ 'display': 'none' });
                        $scope.studentListInbox = "";
                        $('#noMsgClass').show();
                        $scope.noStudentMsg = "No student found";
                        //LOADER HIDE
                        $("#preloader_left_inbox").css("display", "none");
                        $(window).scrollTop(0);
                        $("#status_right_content8").css("display", "none");
                        $("#preloader_right_content8").css("display", "none");
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    } else {
                        $scope.studentListInbox = "";
                        $('#noMsgClass').show();
                        $scope.noStudentMsg = "No student found";
                        //LOADER HIDE
                        $("#preloader_left_inbox").css("display", "none");
                        $(window).scrollTop(0);
                        $("#status_right_content8").css("display", "none");
                        $("#preloader_right_content8").css("display", "none");
                    }
                    //console.log(studentIds);
                    /*STORE STUDENT IDS & RESPECTIVE CLASS IDS IN HIDDEN FILED*/
                    if (studentIds.length != 0) {
                        $('#studentIds').val(studentIds.toString());
                    }
                    if (classIds.length != 0) {
                        $('#classIds').val(classIds.toString());
                    }
                });
            }
            $scope.studentListInboxResponse();
        }, 100);
        
        }else{
            //$('#supportfeature').click();
        }
    };
    $scope.myInbox();


    /*MY TASK*/
    $scope.myTask = function (check_date) {
        //console.log('------MY TASK------');
        //console.log('$scope.myTaskStatus =' + $scope.myTaskStatus);
        //var teacherId= getOnlyCookie("teacherId");
        /////LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content5").css("display", "block");
        $("#preloader_right_content5").css("display", "block");
    
        setOnlyCookie("tab", "myTask", 60 * 60 * 60);
        var displayStartDate = getOnlyCookie("weekStartDate");
        var displayEndDate = getOnlyCookie("weekEndDate");

        var time3 = new Date(st);
        var curdateIST = time3.toISOString();
        var curdateISOstrdate = curdateIST.split('T');
        var curdateFinal = curdateISOstrdate[0] + 'T00:00:00';

        /*TO FOCUS ON CURRENT DATE DIV*/
        $timeout(function () {
            var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
            var eID = "dateDiv" + divDate; //ddMMyyyy
            var elm = document.getElementById(eID);
            if (elm) {
                $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
            }else{
                $(".contentDateDIv").mCustomScrollbar("scrollTo", 'top', { scrollInertia: 0 });
            }
        }, 1500);

        /*reset fields after setting task redirects to my task*/
        /*Reset all prefilled fields in MY CLASSES section*/
        if ($scope.myTaskStatus == 0) {
            $scope.tasktypeErr = "";
            $("#title1").attr("placeholder", "Title").removeClass('red_place');
            $("#description1").attr("placeholder", "Description").removeClass('red_place');
            $scope.dateErr = "";
            $scope.countSelectStudentsTask = 0;
            $("#studentIdsForCreateTask").val('');
            $scope.countSelectStudentsMessage = 0;
            $("#studentIdsForMessage").val('');
            /*clear the attachment div*/
            $('#adddiv').html('');
            /*reset file upload fields*/
            $('#fileNum').val(0);
            $('#file_size1').val(0);
        }
        /**************************/


        /***MY TASK SEARCH****/
        $('#taskclosediv').click(function (e) {
            e.stopPropagation();
            document.getElementById('task_search_term').value = "";
            $('#taskerrordiv').css({ 'display': 'none' });
            $('#taskerrordiv').html('');
            $('#search_task').css({ 'display': 'none' });
            $('#taskclosediv').css({ 'display': 'none' });
            $('.taskstdprof').remove();
        });

        //on keyup
        $("#tasksearchdiv").keyup(function (e) {
            var key = e.which || e.keyCode;
            $('#searchterm').click(function (e) {
                $scope.tasksearchResList = "";
            });
            //UP DOWN
            if (key != 13) {
                $("#task_hover_div").val('-1');
            }

            var no_of_search_result = 0;
            $(".taskmove").each(function () {
                no_of_search_result = no_of_search_result + 1;
            });
            var search_count = no_of_search_result - 1;
            if (key == 38) { // up arrow key

                $('#taskerrordiv').css({ 'display': 'none' });
                if ($('.nav li').length > 0) {
                    var div_id = $(".result_hover").attr('id').replace('tasksearchdiv', '');
                    var prev_div_id = parseInt(div_id) - 1;
                    if (prev_div_id >= 0) {
                        $('.taskmove').removeClass("result_hover");
                        $('#tasksearchdiv' + prev_div_id).addClass("result_hover");
                        $('#tasksearchdiv' + prev_div_id).focus();
                        $('#task_hover_div').val(prev_div_id);
                    } else {
                        prev_div_id = search_count;
                        $('.taskmove').removeClass("result_hover");
                        $('#tasksearchdiv' + prev_div_id).addClass("result_hover");
                        $('#tasksearchdiv' + prev_div_id).focus();
                        $('#task_hover_div').val(prev_div_id);
                    }
                    $("#task_srch_data").scrollTop(20);//set to top
                    $("#task_srch_data").scrollTop($('.result_hover').offset().top - $("#task_srch_data").height());
                }
            } else if (key == 40) { // down arrow key

                $('#taskerrordiv').css({ 'display': 'none' });
                if ($('.nav li').length > 0) {
                    if ($(".result_hover").attr('id') == undefined) {
                        $('.taskmove').removeClass("result_hover");
                        $('#tasksearchdiv0').addClass("result_hover");
                        $("#tasksearchdiv0").hover();
                        $('#task_hover_div').val('0');
                    } else {
                        var div_id = $(".result_hover").attr('id').replace('tasksearchdiv', '');
                        var next_div_id = parseInt(div_id) + 1;
                        if (next_div_id <= search_count) {
                            $('.taskmove').removeClass("result_hover");
                            $('#tasksearchdiv' + next_div_id).addClass("result_hover");
                            $('#tasksearchdiv' + next_div_id).focus();
                            $('#task_hover_div').val(next_div_id);
                        } else {
                            next_div_id = 0;
                            $('.taskmove').removeClass("result_hover");
                            $('#tasksearchdiv' + next_div_id).addClass("result_hover");
                            $('#tasksearchdiv' + next_div_id).focus();
                            $('#task_hover_div').val(next_div_id);
                        }
                        $("#task_srch_data").scrollTop(20);//set to top
                        $("#task_srch_data").scrollTop($('.result_hover').offset().top - $("#task_srch_data").height());
                    }
                }
            } else if (key != 13) {
                $('.taskstdprof').remove();
            }

            var task_searchterm = $.trim($("#task_search_term").val()).replace(/  +/g, ' ');
            var values = task_searchterm.split(' ').filter(function (v) { return v !== '' });
            var tasksearchtext_space = $.trim($("#task_search_term").val()).replace(/\s/g, '');
            var tasksrcLen = tasksearchtext_space.length;

            if (tasksrcLen > 2) {
                if (key != 40 && key != 38) {
                    $('#search_task').css({ 'display': 'block' });
                    $('#taskerrordiv').css({ 'display': 'block' });
                    $('#taskerrordiv').html('Press Enter to search');
                    $('#taskclosediv').css({ 'display': 'block' });
                }
                if (key == 13) {

                    //$('.taskmove').remove();
                    $('#taskerrordiv').css({ 'display': 'none' });
                    $('#taskclosediv').css({ 'display': 'none' });
                    $scope.successMsg = "";
                    $scope.tasksearchResList = "";
                    $scope.noOfres = 0;

                    var hover_div = $("#task_hover_div").val();

                    if (hover_div != "-1") {
                        //$("#task_hover_div").val('-1');

                        $('#tasksearch_div_anchor' + hover_div).click();

                    }
                    else {
                        if (values.length > 10) {
                            //ten or more words
                            if (key != 40 && key != 38) {
                                $('#search_task').css({ 'display': 'block' });
                                $('#taskerrordiv').css({ 'display': 'block' });
                                $('#taskerrordiv').html("A maximum of 10 words can be searched");
                                $scope.successMsg = "";
                                $scope.tasksearchResList = "";
                                $scope.noOfres = 0;
                                $('#taskclosediv').css({ 'display': 'block' });
                            }
                        } else {
                            homeService.taskSearchResponse(access_token, task_searchterm, function (response) {
                                //console.log('TASKSEARCH');
                                //console.log(response);
                                if (response.status) {
                                    if (response.Count != 0) {
                                        if (response.Count > 40) {
                                            if (key != 40 && key != 38) {
                                                $('#search_task').css({ 'display': 'block' });
                                                $('#taskerrordiv').css({ 'display': 'block' });
                                                $('#taskerrordiv').html('More than 40 tasks found<br>Please refine your search<br>');
                                                $('#task_srch_data').css({ 'display': 'none' });
                                                $scope.successMsg = ""
                                                $scope.tasksearchResList = "";
                                                $('#taskclosediv').css({ 'display': 'block' });
                                            }
                                        } else {

                                            if (key != 40 && key != 38) {
                                                $('#task_srch_data').css({ 'display': 'block' });
                                                $('#taskerrordiv').css({ 'display': 'none' });
                                                $('#search_task').css({ 'display': 'block' });
                                                $scope.tasksearchResList = response.Data;
                                                $scope.tasknoOfres = response.Count;
                                                $('#taskclosediv').css({ 'display': 'block' });
                                            }
                                        }
                                    }
                                    else {
                                        if (key != 40 && key != 38) {
                                            $('#task_srch_data').css({ 'display': 'none' });
                                            $('#search_task').css({ 'display': 'block' });
                                            $('#taskerrordiv').css({ 'display': 'block' });
                                            $('#taskerrordiv').html('No tasks found<br>Please refine your search');
                                            $scope.successMsg = "";
                                            $scope.tasksearchResList = "";
                                            $scope.tasknoOfres = 0;
                                            $('#taskclosediv').css({ 'display': 'block' });
                                        }
                                    }
                                }
                                else {
                                    if (key != 40 && key != 38) {
                                        $('#task_srch_data').css({ 'display': 'none' });
                                        $('#search_task').css({ 'display': 'block' });
                                        $scope.successMsg = "";
                                        $scope.tasksearchResList = response.Message;
                                        $scope.tasknoOfres = 0;
                                        $('#taskclosediv').css({ 'display': 'block' });
                                    }

                                }
                            });
                        }
                    }
                }
            }
            else {
                if (key != 40 && key != 38) {
                    $('#task_srch_data').css({ 'display': 'none' });
                    $('#search_task').css({ 'display': 'block' });
                    $('#taskerrordiv').css({ 'display': 'block' });
                    $('#taskerrordiv').html('Enter a minimum of 3 characters');
                    $('#taskclosediv').css({ 'display': 'block' });
                }
            }
        });

        $('#tasksearchdiv').click(function (e) {
            var key = e.which || e.keyCode;
            $('#taskerrordiv').css({ 'display': 'none' });
            $('#taskerrordiv').html('');
            var searchtext = $.trim($("#task_search_term").val()).replace(/  +/g, ' ');
            var searchtext_with_space = $.trim($("#task_search_term").val()).replace(/\s/g, '');
            var srcLen = searchtext_with_space.length;
            if (srcLen > 2) {
                //if (!$(".stdprof"))
                //{ 
                //    if (key != 40 || key !=38)
                //    {
                //        $('#search_task').css({'display':'block'});
                //        $('#taskerrordiv').css({'display':'block'});
                //        $('#taskerrordiv').html('Press Enter to search');
                //        $('#taskclosediv').css({'display':'block'});
                //    }
                //}   
            } else {
                $('#search_task').css({ 'display': 'block' });
                $('#taskerrordiv').css({ 'display': 'block' });
                $('#taskerrordiv').html('Enter a minimum of 3 characters');
                $('#taskclosediv').css({ 'display': 'block' });
            }
        });

        //onclick
        $("#tasksrch").click(function (e) {
            var key = e.which || e.keyCode;
            var task_searchterm = $.trim($("#task_search_term").val()).replace(/  +/g, ' ');
            var values = task_searchterm.split(' ').filter(function (v) { return v !== '' });
            var tasksearchtext_space = $.trim($("#task_search_term").val()).replace(/\s/g, '');
            var tasksrcLen = tasksearchtext_space.length;

            if (tasksrcLen > 2) {
                if (values.length > 10) {
                    //ten or more words
                    if (key != 40 && key != 38) {
                        $('#search_task').css({ 'display': 'block' });
                        $('#taskerrordiv').css({ 'display': 'block' });
                        $('#taskerrordiv').html("A maximum of 10 words can be searched");
                        $scope.successMsg = "";
                        $scope.tasksearchResList = "";
                        $scope.noOfres = 0;
                        $('#taskclosediv').css({ 'display': 'block' });
                    }
                } else {
                    homeService.taskSearchResponse(access_token, task_searchterm, function (response) {
                        //console.log('TASKSEARCH');
                        //console.log(response);
                        if (response.status) {
                            if (response.Count != 0) {
                                if (response.Count > 40) {
                                    if (key != 40 && key != 38) {
                                        $('#search_task').css({ 'display': 'block' });
                                        $('#taskerrordiv').css({ 'display': 'block' });
                                        $('#taskerrordiv').html('More than 40 tasks found<br>Please refine your search<br>');
                                        $('#task_srch_data').css({ 'display': 'none' });
                                        $scope.successMsg = ""
                                        $scope.tasksearchResList = "";
                                        $('#taskclosediv').css({ 'display': 'block' });
                                    }
                                } else {

                                    if (key != 40 && key != 38) {
                                        $('#task_srch_data').css({ 'display': 'block' });
                                        $('#taskerrordiv').css({ 'display': 'none' });
                                        $('#search_task').css({ 'display': 'block' });
                                        $scope.tasksearchResList = response.Data;
                                        $scope.tasknoOfres = response.Count;
                                        $('#taskclosediv').css({ 'display': 'block' });
                                    }
                                }
                            }
                            else {
                                if (key != 40 && key != 38) {
                                    $('#task_srch_data').css({ 'display': 'none' });
                                    $('#search_task').css({ 'display': 'block' });
                                    $('#taskerrordiv').css({ 'display': 'block' });
                                    $('#taskerrordiv').html('No tasks found<br>Please refine your search');
                                    $scope.successMsg = "";
                                    $scope.tasksearchResList = "";
                                    $scope.tasknoOfres = 0;
                                    $('#taskclosediv').css({ 'display': 'block' });
                                }
                            }
                        }
                        else {
                            if (key != 40 && key != 38) {
                                $('#task_srch_data').css({ 'display': 'none' });
                                $('#search_task').css({ 'display': 'block' });
                                $scope.successMsg = "";
                                $scope.tasksearchResList = response.Message;
                                $scope.tasknoOfres = 0;
                                $('#taskclosediv').css({ 'display': 'block' });
                            }

                        }
                    });
                }
            }
            else {
                if (key != 40 && key != 38) {
                    $('#task_srch_data').css({ 'display': 'none' });
                    $('#search_task').css({ 'display': 'block' });
                    $('#taskerrordiv').css({ 'display': 'block' });
                    $('#taskerrordiv').html('Enter a minimum of 3 characters');
                    $('#taskclosediv').css({ 'display': 'block' });
                }
            }
        });

        $(document).mouseup(function (e) {
            var container = $("#search_task");
            if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                container.hide();
                $("#task_hover_div").val('-1');
            }
        });


        /***MY TASK CALENDAR***/
        /*CALENDER DROPDOWN ONLOAD*/
        $scope.myTaskCalendar = function () {
            var time = new Date(st);
            var weekDay = time.getDay();
            if (check_date == 1) /// on load current week will show,if date not present in cookie then current week will show
            {
                if (displayStartDate == "" && displayEndDate == "") {
                    var time = new Date(st);
                    var startdateIST = time.setDate(time.getDate() - 21);
                    var startdateISO = new Date(startdateIST);
                    var startdateISOstr = startdateISO.toISOString();
                    var startdateISOstrdate = new Date(startdateISOstr);
                    var startdate = startdateISOstrdate.getFullYear() + '-' + (startdateISOstrdate.getMonth() + 1) + '-' + startdateISOstrdate.getDate();

                    var time1 = new Date(st);
                    var enddateIST = time1.setDate(time1.getDate() + 21);
                    var enddateISO = new Date(enddateIST);
                    var enddateISOstr = enddateISO.toISOString();
                    var enddateISOstrdate = new Date(enddateISOstr);
                    var enddate = enddateISOstrdate.getFullYear() + '-' + (enddateISOstrdate.getMonth() + 1) + '-' + enddateISOstrdate.getDate();

                    homeService.myTaskCalenderResponse(access_token, startdate, enddate, function (response) {
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content5").css("display", "none");
                        $("#preloader_right_content5").css("display", "none");

                        //console.log('CAL DATA');
                        //console.log(response);
                        $scope.myTaskListCalendar = response;
                        var response_length = response.length;
                        var firstWeekRangeStartDate = response[0]['StartDate'];
                        var firstWeekRangeEndDate = response[0]['EndDate'];
                        var lastWeekRangeStartDate = response[response_length - 1]['StartDate'];
                        var lastWeekRangeEndDate = response[response_length - 1]['EndDate'];
                        setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                        setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                        setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                        setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                        /*onclick next week load more button , new weeks gets concated with existing ones*/
                        $scope.load_more_weeks = function (val) {
                            //$('.wk_picker').addClass('open');
                            if (val == 'next')
                            {

                                var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                                var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                                var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                                var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                                var time_2 = new Date(lastWeekRangeEndDate1);
                                var enddateIST_2 = time_2.setDate(time_2.getDate() + 21);
                                var enddateISO_2 = new Date(enddateIST_2);
                                var enddateISOstr_2 = enddateISO_2.toISOString();
                                var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                                var enddate_2 = enddateISOstrdate_2.getFullYear() + '-' + (enddateISOstrdate_2.getMonth() + 1) + '-' + enddateISOstrdate_2.getDate();

                                startdate_1 = firstWeekRangeStartDate1;

                                //console.log('startdate_1 ==' + startdate_1);
                                //console.log('enddate_2 ==' + startdate_1);
                                homeService.myTaskCalenderResponse(access_token, startdate_1, enddate_2, function (response_next) {

                                    response_concat_response_next = response_next;
                                    $scope.myTaskListCalendar = response_next;

                                    //console.log('APPEND NEXT WEEK =====>>');
                                    //console.log(response_concat_response_next);

                                    var response_length = response_concat_response_next.length;;
                                    var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                    var firstWeekRangeEndDate = response_concat_response_next[0]['EndDate'];
                                    var lastWeekRangeStartDate = response_concat_response_next[response_length - 1]['StartDate'];
                                    var lastWeekRangeEndDate = response_concat_response_next[response_length - 1]['EndDate'];
                                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                });

                            } else if (val == 'prev')
                            {

                                var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                                var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                                var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                                var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                                var time_3 = new Date(firstWeekRangeStartDate1);
                                var startdateIST_3 = time_3.setDate(time_3.getDate() - 21);
                                var startdateISO_3 = new Date(startdateIST_3);
                                var startdateISOstr_3 = startdateISO_3.toISOString()
                                var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                                var startdate_3 = startdateISOstrdate_3.getFullYear() + '-' + (startdateISOstrdate_3.getMonth() + 1) + '-' + startdateISOstrdate_3.getDate();

                                enddate_4 = lastWeekRangeEndDate1;

                                homeService.myTaskCalenderResponse(access_token, startdate_3, enddate_4, function (response_prev) {

                                    var response_prev_concat_response = new Array();
                                    response_prev_concat_response = response_prev;
                                    $scope.myTaskListCalendar = response_prev_concat_response;

                                    //console.log('APPEND PREVIOUS WEEK =====>>');
                                    //console.log(response_prev_concat_response);

                                    var response_length = response_prev_concat_response.length;

                                    var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                    var firstWeekRangeEndDate = response_prev_concat_response[0]['EndDate'];
                                    var lastWeekRangeStartDate = response_prev_concat_response[response_length - 1]['StartDate'];
                                    var lastWeekRangeEndDate = response_prev_concat_response[response_length - 1]['EndDate'];
                                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                });
                            }
                        };
                    });

                } else { /// on redirect from set task / update task , calendar will load with that week range 

                    var time = convertStringToDate(displayStartDate);
                    var startdateIST = time.setDate(time.getDate() - 21);
                    var startdateISO = new Date(startdateIST);
                    var startdateISOstr = startdateISO.toISOString();
                    var startdateISOstrdate = new Date(startdateISOstr);
                    var startdate = startdateISOstrdate.getFullYear() + '-' + (startdateISOstrdate.getMonth() + 1) + '-' + startdateISOstrdate.getDate();

                    //console.log("mytask" + displayEndDate);
                    var time1 = convertStringToDate(displayEndDate);
                    var enddateIST = time1.setDate(time1.getDate() + 21);
                    var enddateISO = new Date(enddateIST);
                    var enddateISOstr = enddateISO.toISOString();
                    var enddateISOstrdate = new Date(enddateISOstr);
                    var enddate = enddateISOstrdate.getFullYear() + '-' + (enddateISOstrdate.getMonth() + 1) + '-' + enddateISOstrdate.getDate();

                    homeService.myTaskCalenderResponse(access_token, startdate, enddate, function (response) {

                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content5").css("display", "none");
                        $("#preloader_right_content5").css("display", "none");

                        //console.log('::: CAL DATA ::::------------------------');
                        //console.log(response);
                        $scope.myTaskListCalendar = response;
                        var response_length = response.length;
                        var firstWeekRangeStartDate = response[0]['StartDate'];
                        var firstWeekRangeEndDate = response[0]['EndDate'];
                        var lastWeekRangeStartDate = response[response_length - 1]['StartDate'];
                        var lastWeekRangeEndDate = response[response_length - 1]['EndDate'];
                        setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                        setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                        setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                        setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                        /*onclick next week load more button , new weeks gets concated with existing ones*/
                        $scope.load_more_weeks = function (val) {

                            if (val == 'next') {
                                var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                                var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                                var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                                var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                                var time_2 = new Date(lastWeekRangeEndDate1);
                                var enddateIST_2 = time_2.setDate(time_2.getDate() + 21);
                                var enddateISO_2 = new Date(enddateIST_2);
                                var enddateISOstr_2 = enddateISO_2.toISOString();
                                var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                                var enddate_2 = enddateISOstrdate_2.getFullYear() + '-' + (enddateISOstrdate_2.getMonth() + 1) + '-' + enddateISOstrdate_2.getDate();

                                startdate_1 = firstWeekRangeStartDate1;

                                //console.log('startdate_1 ==' + startdate_1);
                                //console.log('enddate_2 ==' + startdate_1);
                                homeService.myTaskCalenderResponse(access_token, startdate_1, enddate_2, function (response_next) {
                                    response_concat_response_next = response_next;
                                    $scope.myTaskListCalendar = response_next;

                                    //console.log('::: CAL DATA 1 ::::------------------------');
                                    //console.log(response_concat_response_next);

                                    var response_length = response_concat_response_next.length;;
                                    var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                    var firstWeekRangeEndDate = response_concat_response_next[0]['EndDate'];
                                    var lastWeekRangeStartDate = response_concat_response_next[response_length - 1]['StartDate'];
                                    var lastWeekRangeEndDate = response_concat_response_next[response_length - 1]['EndDate'];
                                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                });

                            } else if (val == 'prev') {

                                var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                                var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                                var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                                var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                                //console.log(firstWeekRangeStartDate1 + ' ## ' + firstWeekRangeEndDate1 + ' ## ' + lastWeekRangeStartDate1 + ' ## ' + lastWeekRangeEndDate1);

                                var time_3 = new Date(firstWeekRangeStartDate1);
                                var startdateIST_3 = time_3.setDate(time_3.getDate() - 21);
                                var startdateISO_3 = new Date(startdateIST_3);
                                var startdateISOstr_3 = startdateISO_3.toISOString()
                                var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                                var startdate_3 = startdateISOstrdate_3.getFullYear() + '-' + (startdateISOstrdate_3.getMonth() + 1) + '-' + startdateISOstrdate_3.getDate();

                                enddate_4 = lastWeekRangeEndDate1;

                                homeService.myTaskCalenderResponse(access_token, startdate_3, enddate_4, function (response_prev) {
                                    var response_prev_concat_response = new Array();
                                    response_prev_concat_response = response_prev;
                                    $scope.myTaskListCalendar = response_prev_concat_response;

                                    //console.log('APPEND PREVIOUS WEEK =====>>');
                                    //console.log(response_prev_concat_response);

                                    var response_length = response_prev_concat_response.length;
                                    var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                    var firstWeekRangeEndDate = response_prev_concat_response[0]['EndDate'];
                                    var lastWeekRangeStartDate = response_prev_concat_response[response_length - 1]['StartDate'];
                                    var lastWeekRangeEndDate = response_prev_concat_response[response_length - 1]['EndDate'];
                                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                });
                            }
                        };
                    });
                }

            } else { //if date present in cookie then that week will show

                var time = convertStringToDate(displayStartDate);
                var startdateIST = time.setDate(time.getDate() - 21);
                var startdateISO = new Date(startdateIST);
                var startdateISOstr = startdateISO.toISOString()
                var startdateISOstrdate = new Date(startdateISOstr);
                var startdate = startdateISOstrdate.getFullYear() + '-' + (startdateISOstrdate.getMonth() + 1) + '-' + startdateISOstrdate.getDate();

                var time1 = convertStringToDate(displayEndDate);
                var enddateIST = time1.setDate(time1.getDate() + 21);
                var enddateISO = new Date(enddateIST);
                var enddateISOstr = enddateISO.toISOString();
                var enddateISOstrdate = new Date(enddateISOstr);
                var enddate = enddateISOstrdate.getFullYear() + '-' + (enddateISOstrdate.getMonth() + 1) + '-' + enddateISOstrdate.getDate();

                homeService.myTaskCalenderResponse(access_token, startdate, enddate, function (response) {
                    ///LOADER HIDE
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");

                    $scope.myTaskListCalendar = response;
                    var response_length = response.length;
                    var firstWeekRangeStartDate = response[0]['StartDate'];
                    var firstWeekRangeEndDate = response[0]['EndDate'];
                    var lastWeekRangeStartDate = response[response_length - 1]['StartDate'];
                    var lastWeekRangeEndDate = response[response_length - 1]['EndDate'];
                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                    /*onclick next week load more button , new weeks gets concated with existing ones*/
                    $scope.load_more_weeks = function (val) {
                        //console.log('3 = ' + val);
                        var response_concat_response_next = new Array();
                        var response_prev_concat_response = new Array();
                        if (val == 'next') {
                            var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                            var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                            var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                            var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                            var time_2 = new Date(lastWeekRangeEndDate1);
                            var enddateIST_2 = time_2.setDate(time_2.getDate() + 21);
                            var enddateISO_2 = new Date(enddateIST_2);
                            var enddateISOstr_2 = enddateISO_2.toISOString();
                            var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                            var enddate_2 = enddateISOstrdate_2.getFullYear() + '-' + (enddateISOstrdate_2.getMonth() + 1) + '-' + enddateISOstrdate_2.getDate();

                            startdate_1 = firstWeekRangeStartDate1;

                            //console.log('startdate_1 ==' + startdate_1);
                            //console.log('enddate_2 ==' + startdate_1);
                            homeService.myTaskCalenderResponse(access_token, startdate_1, enddate_2, function (response_next) {

                                response_concat_response_next = response_next;
                                $scope.myTaskListCalendar = response_concat_response_next;

                                //console.log('APPEND NEXT WEEK =====>>');
                                //console.log(response_concat_response_next);

                                var response_length = response_concat_response_next.length;;
                                var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                var firstWeekRangeEndDate = response_concat_response_next[0]['EndDate'];
                                var lastWeekRangeStartDate = response_concat_response_next[response_length - 1]['StartDate'];
                                var lastWeekRangeEndDate = response_concat_response_next[response_length - 1]['EndDate'];
                                setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                            });

                        } else if (val == 'prev') {

                            var firstWeekRangeStartDate1 = getOnlyCookie("firstWeekRangeStartDate");
                            var firstWeekRangeEndDate1 = getOnlyCookie("firstWeekRangeEndDate");
                            var lastWeekRangeStartDate1 = getOnlyCookie("lastWeekRangeStartDate");
                            var lastWeekRangeEndDate1 = getOnlyCookie("lastWeekRangeEndDate");

                            var time_3 = new Date(firstWeekRangeStartDate1);
                            var startdateIST_3 = time_3.setDate(time_3.getDate() - 21);
                            var startdateISO_3 = new Date(startdateIST_3);
                            var startdateISOstr_3 = startdateISO_3.toISOString()
                            var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                            var startdate_3 = startdateISOstrdate_3.getFullYear() + '-' + (startdateISOstrdate_3.getMonth() + 1) + '-' + startdateISOstrdate_3.getDate();

                            enddate_4 = lastWeekRangeEndDate1;

                            homeService.myTaskCalenderResponse(access_token, startdate_3, enddate_4, function (response_prev) {

                                response_prev_concat_response = response_prev;
                                $scope.myTaskListCalendar = response_prev_concat_response;

                                //console.log('APPEND PREVIOUS WEEK =====>>');
                                //console.log(response_prev_concat_response);

                                var response_length = response_prev_concat_response.length;

                                var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                var firstWeekRangeEndDate = response_prev_concat_response[0]['EndDate'];
                                var lastWeekRangeStartDate = response_prev_concat_response[response_length - 1]['StartDate'];
                                var lastWeekRangeEndDate = response_prev_concat_response[response_length - 1]['EndDate'];
                                setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                            });
                        }
                    };
                });
            }

            $timeout(function () {
                //console.log("$scope.myTaskStatus  ----"+$scope.myTaskStatus);
                if ($scope.myTaskStatus == 0) {
                    $('#myTask').addClass('active');
                }

            }, 100);

        };
        $scope.myTaskCalendar();


        var fromDate = new Date(st);
        $scope.currentWeek = function (fromDate) {
            /////LOADER SHOW
            $(window).scrollTop(0);
            $("#status_right_content5").css("display", "block");
            $("#preloader_right_content5").css("display", "block");
            //console.log(displayStartDate +'###'+ displayEndDate);
            fromDate = (typeof fromDate != 'undefined' && fromDate != '') ? new Date(fromDate) : new Date(st);
            fromDateTime = fromDate.getTime();

            var time = new Date(st);
            var weekDay = time.getDay();

            if (weekDay == 0) {    //if weekday = 0 ; then day is SUNDAY

                if ((displayStartDate == "" || displayStartDate == undefined || displayStartDate == 'undefined') && check_date == 1) {

                    $scope.currentWeekStartDate = $scope.ISOdateConvertion((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6));
                    $scope.currentWeekEndDate = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000))));

                    var weekStartDate = $scope.ISOdateConvertion((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6));
                    var weekEndDate = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000))));
                    //console.log("CHECK FORMAT="+weekStartDate);
                    setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                    setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);

                } else {

                    var time1 = convertStringToDate(displayStartDate);
                    var weekDay1 = time1.getDay();

                    if (weekDay1 == 0) {

                        var weekStartDate = $scope.ISOdateConvertion((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6));
                        var weekEndDate = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000))));
                    } else {

                        var weekStartDate = displayStartDate;
                        var weekEndDate = displayEndDate;

                    }

                    $scope.currentWeekStartDate = convertStringToDate(weekStartDate);
                    $scope.currentWeekEndDate = convertStringToDate(weekEndDate);
                }

            } else {

                if ((displayStartDate == "" || displayStartDate == undefined || displayStartDate == 'undefined') && check_date == 1) {

                    $scope.currentWeekStartDate = new Date((((fromDateTime - (fromDate.getDay() * 86400000)) + 86400000)));
                    $scope.currentWeekEndDate = new Date((((fromDateTime - (fromDate.getDay() * 86400000)) + (86400000 * 7))));

                    var weekStartDate = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)) + 86400000)));
                    var weekEndDate = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)) + (86400000 * 7))));
                    //console.log("CHECK FORMAT="+weekStartDate);
                    setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                    setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);

                } else {

                    var weekStartDate = displayStartDate;
                    var weekEndDate = displayEndDate;
                    $scope.currentWeekStartDate = convertStringToDate(weekStartDate);
                    $scope.currentWeekEndDate = convertStringToDate(weekEndDate);
                }
            }

            $scope.weekStartDate = weekStartDate;
            $scope.weekEndDate = weekEndDate;

            /*ONLOAD TASK LIST OF CURRENT WEEK WILL DISPLAY*/

            homeService.myTaskResponse(access_token, weekStartDate, weekEndDate, function (response) {
                //console.log("###"+response);
                //console.log("###TASKLIST ON LOAD" + response);
                if (response.status) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    if (response != '') {
                        $('#noRecord6').removeClass('noRecord');
                        $scope.weeklyTaskMessage = "";
                        $scope.weeklyTaskMessage1 = "";
                        $scope.weeklyTaskMessage2 = "";
                        $scope.weeklyTaskMessage3 = "";
                        $scope.myTaskList = response;

                    } else {
                        $('#noRecord6').addClass('noRecord');
                        $scope.weeklyTaskMessage = "No Tasks Due this week.";
                        $scope.weeklyTaskMessage1 = "Click on ";
                        $scope.weeklyTaskMessage2 = "Create Task";
                        $scope.weeklyTaskMessage3 = "to set a task for the students.";
                        $scope.myTaskList = '';
                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                } else {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                }
                        /*TO FOCUS ON CURRENT DATE DIV*/
                    $timeout(function () {
                        var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
                        var eID = "dateDiv" + divDate; //ddMMyyyy
                        var elm = document.getElementById(eID);
                        if (elm) {
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
                        }else{
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", 'top', { scrollInertia: 0 });
                        }
                    }, 100);
            });

        };
        $scope.currentWeek();

        $scope.selectWeek = function (startDate, endDate) {
            /////LOADER SHOW
            $('#week_drp').css({'display':'none'});
            $(window).scrollTop(0);
            $("#status_right_content5").css("display", "block");
            $("#preloader_right_content5").css("display", "block");
            $scope.currentWeekStartDate = startDate;
            $scope.currentWeekEndDate = endDate;

            var startDate = $scope.ISOdateConvertion(startDate);
            var endDate = $scope.ISOdateConvertion(endDate);

            setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
            setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);

            var time3 = convertStringToDate(startDate);
            var startdateIST = time3.setDate(time3.getDate() - 21);
            var startdateISO = new Date(startdateIST);
            var startdateISOstr = startdateISO.toISOString()
            var startdateISOstrdate = new Date(startdateISOstr);
            var startDateRange = startdateISOstrdate.getFullYear() + '-' + (startdateISOstrdate.getMonth() + 1) + '-' + startdateISOstrdate.getDate();

            var time4 = convertStringToDate(endDate);
            var enddateIST = time4.setDate(time4.getDate() + 21);
            var enddateISO = new Date(enddateIST);
            var enddateISOstr = enddateISO.toISOString();
            var enddateISOstrdate = new Date(enddateISOstr);
            var endDateRange = enddateISOstrdate.getFullYear() + '-' + (enddateISOstrdate.getMonth() + 1) + '-' + enddateISOstrdate.getDate();

            /*ON SELECT WEEK TASK LIST OF SELECTED WEEK WILL DISPLAY*/
            homeService.myTaskResponse(access_token, startDate, endDate, function (response)
            {
                if (response.status) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    if (response != '') {
                        $('#noRecord6').removeClass('noRecord');
                        $scope.myTaskList = response;
                        $scope.weeklyTaskMessage = "";
                        $scope.weeklyTaskMessage1 = "";
                        $scope.weeklyTaskMessage2 = "";
                        $scope.weeklyTaskMessage3 = "";

                        var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
                        var eID = "dateDiv" + divDate;
                        var elm = document.getElementById(eID);

                        //console.log(elm);
                        //console.log('check');
                        if (elm) {
                            //var y = elm.offsetTop;
                            // $('.mCSB_container').css({'top':-y});
                            // $(".contentDateDIv").mCustomScrollbar("update");
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
                        }

                    } else {
                        $('#noRecord6').addClass('noRecord');
                        $scope.myTaskList = '';
                        $scope.weeklyTaskMessage = "No Tasks Due this week.";
                        $scope.weeklyTaskMessage1 = "Click on ";
                        $scope.weeklyTaskMessage2 = "Create Task";
                        $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $('#noRecord6').addClass('noRecord');
                    $scope.myTaskList = '';
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                } else {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $('#noRecord6').addClass('noRecord');
                    $scope.myTaskList = '';
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                }
                    /*TO FOCUS ON CURRENT DATE DIV*/
                    $timeout(function () {
                        var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
                        var eID = "dateDiv" + divDate; //ddMMyyyy
                        var elm = document.getElementById(eID);
                        if (elm) {
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
                        }else{
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", 'top', { scrollInertia: 0 });
                        }
                    }, 100);
            });

            /*CALENDER DROPDOWN ONSELECT will show 28 days after & before */
            //$scope.myTaskCalendar = function () {        
            //    homeService.myTaskCalenderResponse(access_token,startDateRange,endDateRange,function (response) {
            //        $scope.myTaskListCalendar = response;
            //    });
            //};
            //$scope.myTaskCalendar();



            /*CALENDER DROPDOWN ONSELECT will show 21 days after & before */
            $scope.myTaskCalendar = function () {
                homeService.myTaskCalenderResponse(access_token, startDateRange, endDateRange, function (response4) {
                    $scope.myTaskListCalendar = response4;
                    /*selected date is set in cookie for load more functionality*/
                    var response_length = response4.length;
                    var firstWeekRangeStartDate = response4[0]['StartDate'];
                    var firstWeekRangeEndDate = response4[0]['EndDate'];
                    var lastWeekRangeStartDate = response4[response_length - 1]['StartDate'];
                    var lastWeekRangeEndDate = response4[response_length - 1]['EndDate'];
                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                });
            };
            $scope.myTaskCalendar();


        };

        /***ONLOAD CALENDAR NEXT BUTTON CLICK*/
        $scope.nextWeekClick = function () {
            /////LOADER SHOW
            $('#week_drp').css({'display':'none'});
            $(window).scrollTop(0);
            $("#status_right_content5").css("display", "block");
            $("#preloader_right_content5").css("display", "block");

            var displayStartDate = getOnlyCookie("weekStartDate");
            var displayEndDate = getOnlyCookie("weekEndDate");

            var time5 = convertStringToDate(displayStartDate);
            var startdateIST1 = time5.setDate(time5.getDate() + 7);
            var startdateISO1 = new Date(startdateIST1);
            var startdateISOstr1 = startdateISO1.toISOString();
            var startdateISOstrdate1 = new Date(startdateISOstr1);
            var startDate = startdateISOstrdate1.getFullYear() + '-' + (startdateISOstrdate1.getMonth() + 1) + '-' + startdateISOstrdate1.getDate();

            var time6 = convertStringToDate(displayEndDate);
            var enddateIST2 = time6.setDate(time6.getDate() + 7);
            var enddateISO2 = new Date(enddateIST2);
            var enddateISOstr2 = enddateISO2.toISOString();
            var enddateISOstrdate2 = new Date(enddateISOstr2);
            var endDate = enddateISOstrdate2.getFullYear() + '-' + (enddateISOstrdate2.getMonth() + 1) + '-' + enddateISOstrdate2.getDate();

            /*FOR DROPDOWN*/
            var time7 = convertStringToDate(displayStartDate);
            var startdateIST3 = time7.setDate(time7.getDate() - 14);
            var startdateISO3 = new Date(startdateIST3);
            var startdateISOstr3 = startdateISO3.toISOString()
            var startdateISOstrdate3 = new Date(startdateISOstr3);
            var startDateRangeDropdown = startdateISOstrdate3.getFullYear() + '-' + (startdateISOstrdate3.getMonth() + 1) + '-' + startdateISOstrdate3.getDate();

            var time8 = convertStringToDate(displayEndDate);
            var enddateIST4 = time8.setDate(time8.getDate() + 27);
            var enddateISO4 = new Date(enddateIST4);
            var enddateISOstr4 = enddateISO4.toISOString();
            var enddateISOstrdate4 = new Date(enddateISOstr4);
            var endDateRangeDropdown = enddateISOstrdate4.getFullYear() + '-' + (enddateISOstrdate4.getMonth() + 1) + '-' + enddateISOstrdate4.getDate();

            $scope.currentWeekStartDate = startdateIST1;
            $scope.currentWeekEndDate = enddateIST2;

            //var startDate = setOnlyCookie("startDate");
            setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
            setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);

            homeService.myTaskResponse(access_token, startDate, endDate, function (response2)
            {
                if (response2.status) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    if (response2 != '') {
                        $('#noRecord6').removeClass('noRecord');
                        $scope.weeklyTaskMessage = "";
                        $scope.weeklyTaskMessage1 = "";
                        $scope.weeklyTaskMessage2 = "";
                        $scope.weeklyTaskMessage3 = "";
                        $scope.myTaskList = response2;
                    } else {
                        $('#noRecord6').addClass('noRecord');
                        //$scope.weeklyTaskMessage = "No Tasks Due this week.Click on Create Task to set a task for the students.";
                        $scope.weeklyTaskMessage = "No Tasks Due this week.";
                        $scope.weeklyTaskMessage1 = "Click on ";
                        $scope.weeklyTaskMessage2 = "Create Task";
                        $scope.weeklyTaskMessage3 = "to set a task for the students.";
                        $scope.myTaskList = '';
                    }
                } else if (response2.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                } else {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                }
                    /*TO FOCUS ON CURRENT DATE DIV*/
                    $timeout(function () {
                        var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
                        var eID = "dateDiv" + divDate; //ddMMyyyy
                        var elm = document.getElementById(eID);
                        if (elm) {
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
                        }else{
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", 'top', { scrollInertia: 0 });
                        }
                    }, 100);
            });

            /*CALENDER DROPDOWN ONSELECT will show 21 days after & before */
            $scope.myTaskCalendar = function () {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                homeService.myTaskCalenderResponse(access_token, startDateRangeDropdown, endDateRangeDropdown, function (response4) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $scope.myTaskListCalendar = response4;
                    /*selected date is set in cookie for load more functionality*/
                    var response_length = response4.length;
                    var firstWeekRangeStartDate = response4[0]['StartDate'];
                    var firstWeekRangeEndDate = response4[0]['EndDate'];
                    var lastWeekRangeStartDate = response4[response_length - 1]['StartDate'];
                    var lastWeekRangeEndDate = response4[response_length - 1]['EndDate'];
                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);

                });
            };
            $scope.myTaskCalendar();

        };
        /***ONLOAD CALENDAR PREVIOUS BUTTON CLICK*/
        $scope.previousWeekClick = function () {
            /////LOADER SHOW
            $('#week_drp').css({'display':'none'});
            $(window).scrollTop(0);
            $("#status_right_content5").css("display", "block");
            $("#preloader_right_content5").css("display", "block");

            var displayStartDate = getOnlyCookie("weekStartDate");
            var displayEndDate = getOnlyCookie("weekEndDate");
                console.log(displayStartDate);
                console.log(displayEndDate);
            var time9 = convertStringToDate(displayStartDate);
            var startdateIST1 = time9.setDate(time9.getDate() - 7);
            var startdateISO1 = new Date(startdateIST1);
            var startdateISOstr1 = startdateISO1.toISOString()
            var startdateISOstrdate1 = new Date(startdateISOstr1);
            var startDate = startdateISOstrdate1.getFullYear() + '-' + (startdateISOstrdate1.getMonth() + 1) + '-' + startdateISOstrdate1.getDate();

            var time10 = convertStringToDate(displayEndDate);
            var enddateIST2 = time10.setDate(time10.getDate() - 7);
            var enddateISO2 = new Date(enddateIST2);
            var enddateISOstr2 = enddateISO2.toISOString();
            var enddateISOstrdate2 = new Date(enddateISOstr2);
            var endDate = enddateISOstrdate2.getFullYear() + '-' + (enddateISOstrdate2.getMonth() + 1) + '-' + enddateISOstrdate2.getDate();

            /*FOR DROPDOWN*/
            var time11 = convertStringToDate(displayStartDate);
            var startdateIST3 = time11.setDate(time11.getDate() - 27);
            var startdateISO3 = new Date(startdateIST3);
            var startdateISOstr3 = startdateISO3.toISOString()
            var startdateISOstrdate3 = new Date(startdateISOstr3);
            var startDateRangeDropdown = startdateISOstrdate3.getFullYear() + '-' + (startdateISOstrdate3.getMonth() + 1) + '-' + startdateISOstrdate3.getDate();

            var time12 = convertStringToDate(displayEndDate);
            var enddateIST4 = time12.setDate(time12.getDate() + 14);
            var enddateISO4 = new Date(enddateIST4);
            var enddateISOstr4 = enddateISO4.toISOString();
            var enddateISOstrdate4 = new Date(enddateISOstr4);
            var endDateRangeDropdown = enddateISOstrdate4.getFullYear() + '-' + (enddateISOstrdate4.getMonth() + 1) + '-' + enddateISOstrdate4.getDate();

            $scope.currentWeekStartDate = startdateIST1;
            $scope.currentWeekEndDate = enddateIST2;

            setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
            setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);

            homeService.myTaskResponse(access_token, startDate, endDate, function (response2)
            {
                if (response2.status) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    if (response2 != '') {
                        $('#noRecord6').removeClass('noRecord');
                        $scope.weeklyTaskMessage = "";
                        $scope.weeklyTaskMessage1 = "";
                        $scope.weeklyTaskMessage2 = "";
                        $scope.weeklyTaskMessage3 = "";
                        $scope.myTaskList = response2;
                    } else {
                        $('#noRecord6').addClass('noRecord');
                        $scope.weeklyTaskMessage = "No Tasks Due this week.";
                        $scope.weeklyTaskMessage1 = "Click on ";
                        $scope.weeklyTaskMessage2 = "Create Task";
                        $scope.weeklyTaskMessage3 = "to set a task for the students.";
                        $scope.myTaskList = '';
                    }
                } else if (response2.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                } else {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $('#noRecord6').addClass('noRecord');
                    $scope.weeklyTaskMessage = "No Tasks Due this week.";
                    $scope.weeklyTaskMessage1 = "Click on ";
                    $scope.weeklyTaskMessage2 = "Create Task";
                    $scope.weeklyTaskMessage3 = "to set a task for the students.";
                    $scope.myTaskList = '';
                }
                    /*TO FOCUS ON CURRENT DATE DIV*/
                    $timeout(function () {
                        var divDate = $filter('date')(curdateFinal, "ddMMyyyy");
                        var eID = "dateDiv" + divDate; //ddMMyyyy
                        var elm = document.getElementById(eID);
                        if (elm) {
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", elm, { scrollInertia: 0 });
                        }else{
                            $(".contentDateDIv").mCustomScrollbar("scrollTo", 'top', { scrollInertia: 0 });
                        }
                    }, 100);
            });

            /*CALENDER DROPDOWN ONSELECT will show 28 days after & before */
            $scope.myTaskCalendar = function () {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                homeService.myTaskCalenderResponse(access_token, startDateRangeDropdown, endDateRangeDropdown, function (response4) {
                    /////LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content5").css("display", "none");
                    $("#preloader_right_content5").css("display", "none");
                    $scope.myTaskListCalendar = response4;
                    /*selected date is set in cookie for load more functionality*/
                    var response_length = response4.length;
                    var firstWeekRangeStartDate = response4[0]['StartDate'];
                    var firstWeekRangeEndDate = response4[0]['EndDate'];
                    var lastWeekRangeStartDate = response4[response_length - 1]['StartDate'];
                    var lastWeekRangeEndDate = response4[response_length - 1]['EndDate'];
                    setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                    setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                });
            };
            $scope.myTaskCalendar();
        };


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /************************   ***** CREATE NEW TASK POP UP SECTION *****  ****************************************
        ****************************************************************************************************************/
        /*COUNT SELECT STUDENT CHECKBOX IN CREATE NEW TASK POP UP*/
        $scope.createTaskPopup = function () {
            $('#noOfItems1').val(0);
            $scope.name = '';
            $scope.files = [];
            var nothing = "";
            setTimeout(function () {
                $('select[id=selectClassDdp]').val(0);
                $("#selectClassDdp").change();
                $('.selectpicker').selectpicker('refresh');
                $('#studentIdsForTaskPopUp').val(nothing);
                $scope.studentList = '';
            }, 200);
            //$('.selectClassDdp').refresh();
            setTimeout(function () {
                //$('select[name=selValue]').val(0);
                //$('.selectpicker').selectpicker('refresh');
                //$('#studentIdsForTaskPopUp').val(nothing);

                $scope.$apply(function () {
                    $scope.studentListResponseDropdown(0);
                });
            }, 1000);
            //console.log('$scope.TodayDay = '+$scope.TodayDay);
            //console.log('$scope.TodayMnth = '+$scope.TodayMnth);
            //console.log('$scope.NowYear = '+$scope.NowYear);
            $('#noRecord5').css({ 'display': 'none' });
            $('.showStudentDivPopup').css({ 'display': 'none' });
            $('.select_outter_new').css({ 'border': '2px solid #54c9e8' });
            $('.select_outter_new').addClass('blink_me');
            $scope.countSelectStudentsTaskPopup = 0;
            $scope.eachTaskPopupClick = function (student_id) {
                /*for active class :: click on each check box*/
                var attr = $("#studentTaskPopup" + student_id).prop('checked');

                if (attr == true) {
                    setTimeout(function () {
                        $('#studentTaskPopup' + student_id).attr('checked', "true");
                    }, 100);
                    $('#studentListInTaskPopup' + student_id).addClass('active');
                } else {
                    setTimeout(function () {
                        $('#studentTaskPopup' + student_id).removeAttr('checked');
                    }, 100);
                    $('#studentListInTaskPopup' + student_id).removeClass('active');
                }

                var studentIds = new Array();
                var i = 0;
                $("input[type=checkbox]:checked").each(function () {
                    if ($(this).attr("studentIdTaskPopup") != undefined) {
                        studentIds[i] = $(this).attr("studentIdTaskPopup");
                        $("#studentListInTaskPopup" + studentIds[i]).addClass('active');
                        i++;
                    }
                });
                var numberOfChecked = $('input:checkbox.studentIdTaskPopupCheckbox:checked').length;
                var totalCheckboxes = $('input:checkbox.studentIdTaskPopupCheckbox').length;

                if (studentIds.length != totalCheckboxes) {
                    $('#remember4').prop('checked', false);
                } else {
                    $('#remember4').prop('checked', true);
                }
                $scope.countSelectStudentsTaskPopup = studentIds.length;

                //$scope.studentIdsForTaskPopUp = studentIds.toString();
                document.getElementById('studentIdsForTaskPopUp').value = studentIds.toString();

            };
            
            $scope.allTaskPopupClick = function () {
                var studentIds = new Array();
                var i = 0;
                if (document.getElementById('remember4').checked == true) {
                    $("input[name='studentIdTaskPopupCheckbox[]']").each(function () {
                        if ($(this).attr("studentIdTaskPopup") != undefined) {
                            studentIds[i] = $(this).attr("studentIdTaskPopup");
                            $("#studentListInTaskPopup" + studentIds[i]).addClass('active');

                            var attr = $("#studentTaskPopup" + studentIds[i]).attr('checked');
                            // For some browsers, `attr` is undefined; for others,
                            // `attr` is false.  Check for both.
                            if (typeof attr == typeof undefined || attr == false) {
                                $("#studentTaskPopup" + studentIds[i]).attr("checked", "true");
                                $("#studentTaskPopup" + studentIds[i]).prop("checked", true);
                            }
                            i++;
                        }
                    });

                    //$(".user_box").addClass("active");
                    //$scope.studentIdsForTaskPopUp = studentIds.toString();
                    document.getElementById('studentIdsForTaskPopUp').value = studentIds.toString();
                } else {
                    $("input[name='studentIdTaskPopupCheckbox[]']").each(function () {
                        if ($(this).attr("studentIdTaskPopup") != undefined) {
                            studentIds[i] = $(this).attr("studentIdTaskPopup");
                            $("#studentListInTaskPopup" + studentIds[i]).addClass('active');
                            var elm = $("#studentListInTaskPopup" + studentIds[i]);

                            $("#studentTaskPopup" + studentIds[i]).attr("checked", "false");
                            $("#studentTaskPopup" + studentIds[i]).prop("checked", false);

                            i++;
                        }
                    });
                    $(".studentIdTaskPopupCheckbox").removeAttr('checked');
                    $(".user_box").removeClass("active");
                    //$scope.studentIdsForTaskPopUp = "";
                    document.getElementById('studentIdsForTaskPopUp').value = "";
                }
                var numberOfChecked = $('input:checkbox.studentIdTaskPopupCheckbox:checked').length;
                var totalCheckboxes = $('input:checkbox.studentIdTaskPopupCheckbox').length;
                $scope.countSelectStudentsTaskPopup = numberOfChecked;
            };

            $scope.checkCalendarPop = function () {
                $scope.dateErr2 = '';
                if (!$scope.day2 || !$scope.mnth2 || !$scope.year2) {
                    $scope.dateErr2 = "Please enter a valid date";
                    return false;
                }

                if (!isValidDate($scope.year2 + "-" + $scope.mnth2 + "-" + $scope.day2)) {
                    $scope.dateErr2 = "Please enter a valid date";
                    return false;
                }

                var selectedDate = new Date($scope.year2, $scope.mnth2 - 1, $scope.day2);
                var todaysDate = new Date(st);
                if (selectedDate < new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate())) {
                    $scope.dateErr2 = "Please enter a date in the future";
                    return false;
                }

                var academicEndingYear = todaysDate.getMonth() > 7 ? todaysDate.getFullYear() + 1 : todaysDate.getFullYear();
                if (selectedDate > new Date(academicEndingYear, 7, 31)) {
                    $scope.dateErr2 = "Please select a date in the current academic year";
                    return false;
                }
                return true;
            }

            function isValidDate(dateString) {
                // First check for the pattern
                var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

                if (!regex_date.test(dateString)) {
                    return false;
                }

                // Parse the date parts to integers
                var parts = dateString.split("-");
                var day = parseInt(parts[2], 10);
                var month = parseInt(parts[1], 10);
                var year = parseInt(parts[0], 10);

                // Check the ranges of month and year
                if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                    return false;
                }

                var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Adjust for leap years
                if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                    monthLength[1] = 29;
                }

                // Check the range of the day
                return day > 0 && day <= monthLength[month - 1];
            }

            /*set task button click in create task pop up*/
            $('#adddiv2').html('');
            $('#fileNum2').val(0);

            $scope.setTaskPop = function () {
                //spinningwheel.gif loader
                //$('#loader_settask2').css("display", "none");
                //return false;
                var tasktype2 = $('#tasktype2').val();
                var title2 = $.trim($('#title2').val());
                var description2 = $.trim($('#description2').val());
                var classId = getOnlyCookie("classId");

                var tot_file_size = $('#file_size2').val();

                var StudentIds2 = $('#studentIdsForTaskPopUp').val();

                var error = 0;
                if (StudentIds2 == '') {

                    $("#confy").click();
                    $scope.message = "Please select class and students";
                    error++;
                    return false;
                }
                if (tasktype2 == '' || tasktype2 == null) {
                    $scope.tasktypeErr2 = "Please enter Task Type";
                    document.getElementById('tasktypeErr2').innerHTML = "Please enter Task Type";
                    error++;
                    return false;
                } else {
                    $scope.tasktypeErr2 = "";
                }
                if ($('#title2').val().toString().trim() == '') {
                    $('#title2').val('');
                    $("#title2").attr("placeholder", "Please enter task title").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#title2").attr("placeholder", "Title").removeClass('red_place');
                }
                if (title2.length > 50) {
                    $("#title2").attr("placeholder", "Task title must not be more than 50 characters").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#title2").attr("placeholder", "Title").removeClass('red_place');
                }
                if ($('#description2').val().toString().trim() == '') {
                    $('#description2').val('');
                    $("#description2").attr("placeholder", "Please enter task description").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#description2").attr("placeholder", "Description").removeClass('red_place');
                }
                if (description2.length > 2000) {
                    $("#description2").attr("placeholder", "Task description must not be more than 2000 characters").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#description2").attr("placeholder", "Description").removeClass('red_place');
                }
                if (tot_file_size > 5120000) {
                    document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                    $("#fileErr").click();
                    error++;
                    return false;
                }

                if (!$scope.checkCalendarPop()) {
                    return false;
                }

                if (error == 0) {

                    ///LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content3").css("display", "block");
                    $("#preloader_right_content3").css("display", "block");
                    document.getElementById("createTaskPopupClose").disabled = true;
                    //$scope.isDisabled=true;
                    document.getElementById("setTaskPopBtn").disabled = true;
                    var dueDate = $scope.year2 + '-' + $scope.mnth2 + '-' + $scope.day2 + 'T' + '00:00:00';
                    var fromDate = new Date($scope.year2, $scope.mnth2 - 1, $scope.day2);
                    var fromDateTime = fromDate.getTime();
                    // console.log(curDate2+'$$$$$$'+fromDate+' ######## '+ fromDateTime);
                    var weekDay = fromDate.getDay();
                    if (weekDay == 0) {
                        var weekStart = $scope.ISOdateConvertion(((fromDateTime - (fromDate.getDay() * 86400000)) - (86400000 * 6)));
                        var weekEnd = $scope.ISOdateConvertion((((fromDateTime - (fromDate.getDay() * 86400000)))));
                    } else {
                        var weekStart = $scope.ISOdateConvertion(((((fromDateTime - (fromDate.getDay() * 86400000)) + 86400000))));
                        var weekEnd = $scope.ISOdateConvertion(((((fromDateTime - (fromDate.getDay() * 86400000)) + (86400000 * 7)))));
                    }

                    var k1 = 0;
                    $(".file_attachment_class2").each(function () {
                        var file_attachment_id1 = $.trim($(this).attr('id')).replace("file_attachment2", "");
                        if (($('#individual_file_size2' + file_attachment_id1).val() != 0) &&
                            ($('#individual_file_size2' + file_attachment_id1).val() != '') &&
                            ($('#individual_file_size2' + file_attachment_id1).val() != undefined) &&
                            ($('#individual_file_size2' + file_attachment_id1).val() != 'undefined')) {
                            k1++;
                        }
                    });

                    if (k1 != 0) {
                        homeService.fileUploadForPopUp(access_token, function (fileUploadResponse) {
                            //console.log("CTRL RESPONSE");
                            //console.log(JSON.parse(fileUploadResponse));

                            homeService.setTaskResponse(access_token, StudentIds2, tasktype2, title2, description2, classId, dueDate, fileUploadResponse, function (response) {
                                document.getElementById("setTaskPopBtn").disabled = false;
                                if (response > 0) {
                                    //$('#loader_settask2').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content3").fadeOut();
                                    $("#preloader_right_content3").delay(200).fadeOut("slow");
                                    /*Reset all fields in CREATE NEW TASK POP UP on submit*/
                                    $("#taskCreatePopUpReset").click();
                                    $("#tasktype2").change();
                                    $("#day2").change();
                                    $("#mnth2").change();
                                    $("#year2").change();

                                    $scope.allTaskPopupClick();
                                    $scope.successMsg1 = 'Task successfully set';
                                    $('#successMsg1').click();
                                    $("#createTaskPopUpClose").click();
                                    setTimeout(function () {
                                        setOnlyCookie("weekStartDate", weekStart, 60 * 60 * 60);
                                        setOnlyCookie("weekEndDate", weekEnd, 60 * 60 * 60);
                                        $scope.toggle_status_my_task = "tab";
                                        $("#myTask").click(); //get redirected to My Weekly task page
                                    }, 500);
                                } else {
                                    //$('#loader_settask2').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content3").fadeOut();
                                    $("#preloader_right_content3").delay(200).fadeOut("slow");
                                    document.getElementById("createTaskPopupClose").disabled = false;
                                    $scope.successMsg1 = 'Task not set';
                                    $('#successMsg1').click();
                                }
                                setTimeout(function () {
                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#successMsg_modal1').modal('hide');
                                    $("#highlight"+response).css("background-color", "rgba(84, 201, 232, 0.2)");
                                    //$('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                                }, 1000);

                                setTimeout(function () {
                                $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                                }, 1500);
                               
                            });
                        });
                    } else {
                        var fileUploadResponse = null;
                        homeService.setTaskResponse(access_token, StudentIds2, tasktype2, title2, description2, classId, dueDate, fileUploadResponse, function (response) {
                            document.getElementById("setTaskPopBtn").disabled = false;
                            if (response > 0) {
                                //$('#loader_settask2').hide();
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content3").fadeOut();
                                $("#preloader_right_content2").delay(200).fadeOut("slow");
                                /*Reset all fields in CREATE NEW TASK POP UP on submit*/
                                $("#taskCreatePopUpReset").click();
                                $("#tasktype2").change();
                                $("#day2").change();
                                $("#mnth2").change();
                                $("#year2").change();

                                $scope.allTaskPopupClick();
                                $scope.successMsg1 = 'Task successfully set';
                                $('#successMsg1').click();
                                $("#createTaskPopUpClose").click();
                                setTimeout(function () {
                                    setOnlyCookie("weekStartDate", weekStart, 60 * 60 * 60);
                                    setOnlyCookie("weekEndDate", weekEnd, 60 * 60 * 60);
                                    $scope.toggle_status_my_task = "tab";
                                    $("#myTask").click(); //get redirected to My Weekly task page
                                }, 500);
                            } else {
                                //$('#loader_settask2').hide();
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content3").fadeOut();
                                $("#preloader_right_content3").delay(200).fadeOut("slow");
                                document.getElementById("createTaskPopupClose").disabled = false;
                                $scope.successMsg1 = 'Task not set';
                                $('#successMsg1').click();
                            }
                            setTimeout(function () {
                                $('.modal-backdrop').hide(); // for black background
                                $('body').removeClass('modal-open'); // For scroll run
                                $('#successMsg_modal1').modal('hide');
                                $("#highlight"+response).css("background-color", "rgba(84, 201, 232, 0.2)");
                                // $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                            }, 1000);
                            setTimeout(function () {
                                $('.contentDateDIv').mCustomScrollbar("scrollTo", "#highlight" + response, { scrollInertia: 10 });
                            }, 1500);
                        });
                    }
                }
            }
            //$scope.removeAttachmentCreateTaskPopup = function(val)
            //{
            //    //$scope.files.splice(attachmentName,1);
            //  
            //    $("#attachmentCreateTaskPopup"+val).remove();
            //    var fileNum2=parseInt($('#fileNum2').val())-1;
            //    $('#fileNum2').val(fileNum2);
            // 
            //};
            var dynamicId = 0;
            $scope.attach2 = function () {
                var fileNum = parseInt($('#fileNum2').val());
                if (fileNum < 4) {
                    fileNum = fileNum + 1;
                    $('#fileNum2').val(fileNum);
                    dynamicId++;
                    $('#adddiv2').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentCreateTaskPopup' + (dynamicId - 1) + '"><div class="pdf_left w3attach"><input type="file" id="file_attachment2' + (dynamicId - 1) + '" onclick="file_upload2(' + (dynamicId - 1) + ');" class="upload file_attachment_class2" style="cursor: pointer;opacity: 0;position: absolute;" /><label class="file_div attc" for="file_attachment2' + (dynamicId - 1) + '">  <a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span2' + (dynamicId - 1) + '">Choose file..</span></a>  </label></div><span onclick="removeAttachmentCreateTaskPopup(' + (dynamicId - 1) + ');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span><input type="hidden" id="individual_file_size2' + (dynamicId - 1) + '" value="0" class="indiFsize2"></div>');

                    $('#file_attachment2' + (dynamicId - 1)).click();

                } else {
                    document.getElementById('fileUploadErrMsg').innerHTML = "Maximum 4 attachments are permitted";
                    $("#fileErr").click();
                }
                if (fileNum == 1) {
                    $('#attach_pic2').css("display", "none");
                    $('#add_more2').css("display", "block");
                }

            };

            $scope.cancelClickPop = function () {
                /*todays date*/
                var todayTime = new Date(st);
                var current_month = (todayTime.getMonth() + 1);
                var current_day = (todayTime.getDate());
                var current_year = (todayTime.getFullYear());
                
                var tasktype2 = $('#tasktype2').val();
                var title2 = $.trim($('#title2').val());
                var description2 = $.trim($('#description2').val());
                var classId = getOnlyCookie("classId");
                var day2 = $('#day2').val();
                var mnth2 = $('#mnth2').val();
                var year2 = $('#year2').val();
                var StudentIds2 = $.trim($('#studentIdsForTaskPopUp').val());
                var fileNum = $('#fileNum2').val();
                var studentListDiv = $.trim($('.studentListInTaskPopup').html());
                
                var flag = 0;
                
                if (studentListDiv != '') {
                   flag++;
                }
                if (StudentIds2 != '') {
                   flag++;
                }
                if (tasktype2 == '' || tasktype2 == null || tasktype2 == 'null') {
                
                } else {
                   flag++;
                }
                if (title2 == '' || title2 == null) {
                
                } else {
                   flag++;
                }
                if (description2 == '' || description2 == null) {
                
                } else {
                   flag++;
                }
                if (day2 != current_day || mnth2 != current_month || year2 != current_year) {
                   flag++;
                }
                if (fileNum != 0) {
                   flag++;
                }
                
                //alert('FLAG W5 = '+flag);
                if (flag > 0) {
                    $('#dataLostConfyPop').click();
                    flag = 0;
                } else {
                    $('.showStudentDivPopup').css({ 'display': 'none' });
                    var nothing = "";
                    setTimeout(function () {
                        $('select[id=selectClassDdp]').val(0);
                        $("#selectClassDdp").change();
                        $('.selectpicker').selectpicker('refresh');
                        $('#studentIdsForTaskPopUp').val(nothing);
                        $scope.studentList = '';
                    }, 200);

                    $('#noRecord5').css({ 'display': 'none' });
                    $('.showStudentDivPopup').css({ 'display': 'none' });
                    $('.select_outter_new').css({ 'border': '2px solid #54c9e8' });
                    $('.select_outter_new').addClass('blink_me');
                    $scope.countSelectStudentsTaskPopup = 0;
                    setTimeout(function(){
                        $('#createTaskPopUpClose').click();


                        
                        $('#create_task').on('hidden.bs.modal', function () {
                            $(this).data('modal', null);
                                $("#day2").change();
                                $("#mnth2").change();
                                $("#year2").change();
                                e.preventDefault();
                            // $.clearInput();
                            //$(this).removeData('bs.modal');
                            //$('.selectpicker').selectpicker('refresh');
                            console.log('Krishna is here');
                        });
                        
                        
                        }, 5000);   
                    //$('#createTaskPopUpClose').click();
                    /*reset all fields*/
                    $scope.countSelectStudentsTaskPopup = 0;
                    $("#studentIdsForTaskPopUp").val('');
                    /*clear the attachment div*/
                    $('#adddiv2').html('');
                    /*reset file upload fields*/
                    $('#fileNum2').val(0);
                    $('#file_size2').val(0);
                    /**************************/
                }

                $scope.yesBtnClick = function () {
                    var flag = 0;
                    $scope.myTaskStatus=0;
                    //console.log("CHECK FLAG after YES"+flag);
                    $('.showStudentDivPopup').css({ 'display': 'none' });
                    var nothing = "";
                    // setTimeout(function () {
                    $('select[id=selectClassDdp]').val(0);
                    $("#selectClassDdp").change();
                    $('#day2').val($scope.TodayDay);
                    $('#mnth2').val($scope.TodayMnth);
                    $('#year2').val($scope.NowYear);
                    // Added by krishna start 06.02.17
                    $('#day1').val($scope.TodayDay);
                    $('#mnth1').val($scope.TodayMnth);
                    $('#year1').val($scope.NowYear);
                    // Added by krishna end
                    // console.log('$scope.TodayDay: '+$scope.TodayDay+'$scope.TodayMnth: '+$scope.TodayMnth+'$scope.NowYear: '+$scope.NowYear);
                    // console.log($('#mnth1').val());
                    $scope.dateErr2 = "";
                    $('.selectpicker').selectpicker('refresh');
                    $('#studentIdsForTaskPopUp').val(nothing);
                    $scope.studentList = '';
                    //  }, 200);

                    $('#noRecord5').css({ 'display': 'none' });
                    $('.showStudentDivPopup').css({ 'display': 'none' });
                    $('.select_outter_new').css({ 'border': '2px solid #54c9e8' });
                    $('.select_outter_new').addClass('blink_me');
                    $scope.countSelectStudentsTaskPopup = 0;

                    $('#createTaskPopUpClose').click();
                    /*reset all fields*/
                    $scope.countSelectStudentsTaskPopup = 0;
                    $("#studentIdsForTaskPopUp").val('');
                    /*clear the attachment div*/
                    $('#adddiv2').html('');
                    /*reset file upload fields*/
                    $('#fileNum2').val(0);
                    $('#file_size2').val(0);
                    /**************************/
                }

            }
            
            console.log('K1 '+ $('#day2').val());
            console.log('K2 '+ $('#mnth2').val());
            console.log('K3 '+ $('#year2').val());
        

        }

        //removing the validation error of task type dropdown field of create task on mouse click
        $scope.onCategoryChange = function () {
            $('#tasktypeErr2').html('');
            var tasktype2 = $('#tasktype2').val();
            if (tasktype2 == '' || tasktype2 == null) {
                $scope.tasktypeErr2 = "Please enter Task Type";
                return false;
            } else {
                $scope.tasktypeErr2 = "";
            }
        };

        //removing the validation error of title field of create task on mouse click
        $("#title2").mousedown(function () {
            $("#title2").attr("placeholder", "Title").removeClass('red_place');
        });

        //removing the validation error of title field of update task on mouse click
        $("#title3").mousedown(function () {
            $("#title3").attr("placeholder", "Title").removeClass('red_place');
        });

        //removing the validation error of decsription field of create task on mouse click
        $("#description2").mousedown(function () {
            $("#description2").attr("placeholder", "Description").removeClass('red_place');
        });

        //removing the validation error of decsription field of update task on mouse click
        $("#description3").mousedown(function () {
            $("#description3").attr("placeholder", "Description").removeClass('red_place');
        });

        /*Reset all fields in CREATE NEW TASK POP UP ON CLICKING create task icon*/
        $scope.createTaskFieldsReset = function () {
            setTimeout(function () {
                // $("#selectClassDdp").change();
                $("#taskCreatePopUpReset").click();
                $("#tasktype2").change();
                $("#day2").change();
                $("#mnth2").change();
                $("#year2").change();

                $scope.tasktypeErr2 = "";
                $("#title2").attr("placeholder", "Title").removeClass('red_place');
                $("#description2").attr("placeholder", "Description").removeClass('red_place');
                $scope.dateErr2 = "";

                var dynamicId = 0;
                $('#selectClassDdp option[value=' + dynamicId + ']').prop('selected', true);
                //$("#selectClassDdp").selectpicker('refresh');
                //
                //$('#selectClassDdp option').prop('selected', function() {
                //    return this.defaultSelected;
                //});


                //$("#selectClassDdp").bind("click", function () {
                //    $("#selectClassDdp")[0].selectedIndex = 0;
                //});


                //$('#selectClassDdp option').each(function (index, option) {
                //    if(index!=0)
                //    {
                //        $(this).remove();
                //    }
                //});
                $("#status_right_content3").css("display", "none");
                $("#preloader_right_content3").css("display", "none");
                document.getElementById("createTaskPopupClose").disabled = false;

                $("select option[value='']").attr("selected", "selected");
                $('.poplist').css({ "display": "none" });
                //$("#createTaskMessage").css("display", "block");    

                $('.studentIdTaskPopupCheckbox').attr('checked', "false");
                $('.studentIdTaskPopupCheckbox').prop('checked', false);
                $('#remember4').attr('checked', "false");
                $('#remember4').prop('checked', false);

            }, 500);

        };

        /*********************************CREATE NEW TASK POP UP ends***********************************************/

        /*********************************TASK DESCRIPTION POP UP & EDIT TASK POP UP begins************************/
        $scope.taskDescription = function (taskId, className, taskType, SubjectName, ClassId) {
            $("#task_hover_div").val('-1');
            $(window).scrollTop(0);
            $("#status_right_content10").css("display", "block");
            $("#preloader_right_content10").css("display", "block");
            $("#status_right_content11").css("display", "block");
            $("#preloader_right_content11").css("display", "block");
            var error=0;
            ///RESET FIELD 
            $('#studentsReset6').click();
            //$("#tasktype3").change();
            //$("#day3").change();
            //$("#mnth3").change();
            //$("#year3").change();
            $("#status_right_content2").css("display", "none");
            $("#preloader_right_content2").css("display", "none");
            document.getElementById("editPopupClose").disabled = false;

            $('.studentListInEditPopupCheckbox').attr('checked', "false");
            $('.studentListInEditPopupCheckbox').prop('checked', false);
            $('#remember3').attr('checked', "false");
            $('#remember3').prop('checked', false);

            $(".file_attachment_class3").each(function () {
                var file_attachment_id = $.trim($(this).attr('id')).replace('file_attachment3', '');

                if (($('#individual_file_size3' + file_attachment_id).val() == 0) ||
                   ($('#individual_file_size3' + file_attachment_id).val() == '') ||
                   ($('#individual_file_size3' + file_attachment_id).val() == undefined) ||
                   ($('#individual_file_size3' + file_attachment_id).val() == 'undefined')) {
                    $('#attachmentDivNew' + file_attachment_id).remove();
                }
            });

            $scope.tasktypeErr3 = "";
            $scope.tasktitleErr3 = "";
            $scope.taskdescErr3 = "";
            $scope.dateErr3 = "";

            //var teacherId = getOnlyCookie("teacherId");
            /*highlight div when edit / delete is clicked*/
            $('.post_row').css("background-color", "");
            //$('#highlightRow'+taskId).css("background-color", "rgba(84,201,232,0.2)");

            $scope.className = className;
            $scope.taskType = taskType;
            $scope.SubjectName = SubjectName;
            $scope.ClassId = ClassId;
            var tot_stud_id = Array();

            /*for student list class wise*/
            homeService.studentListResponse(access_token, ClassId, function (response) {
                //console.log('TASK DESC STUDENT LIST');
                //console.log(response);
                if (response.status) {
                    if (response != '') {
                        $('.showStudentDiv').show();
                        $scope.studentList = response;
                        $scope.noOfStudents = response.length;
                        $scope.nodesc1 = "";
                        $scope.nodesc2 = "";
                        $scope.nodesc3 = "";
                        $scope.nodesc4 = "";
                        $scope.nodesc5 = "";
                        $('#noRecord13').removeClass('noRecord');
                        $('#noRecord14').removeClass('noRecord');
                        for (var i = 0; i < response.length; i++) {
                            tot_stud_id[i] = response[i].Id;
                        }
                        console.log('TOTAL STUDENTS >>> ');
                        console.log(tot_stud_id);
                        //document.getElementById('studentIdsForEditPopup').value = tot_stud_id.toString();

                        //var studentIdsAssigned = $('#studentIdsAssigned').val();
                        //var studentArr         = $('#studentIdsForEditPopup').val();
                        //console.log(studentIdsAssigned+'  @@@@@@  '+studentArr)
                        //$scope.isExist = function (id) {
                        //    return SelectedStudentIds.indexOf(id);
                        //}

                    } else {
                        $('.showStudentDiv').hide();
                        $scope.studentList = "";
                        $scope.noOfStudents = 0;
                        $scope.nodesc1 = "No Students Found… ";
                        $scope.nodesc2 = "Try: ";
                        $scope.nodesc3 = "1. Reload the webpage.";
                        $scope.nodesc4 = "2. If the problem persists, please submit your query";
                        $scope.nodesc5 = "here.";
                        $('#noRecord13').addClass('noRecord');
                        $('#noRecord14').addClass('noRecord');
                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                    $('.showStudentDiv').hide();
                    $scope.studentList = "";
                    $scope.noOfStudents = 0;
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                    $scope.noOfStudents = 0;
                    $scope.nodesc1 = "No Students Found… ";
                    $scope.nodesc2 = "Try: ";
                    $scope.nodesc3 = "1. Reload the webpage.";
                    $scope.nodesc4 = "2. If the problem persists, please submit your query";
                    $scope.nodesc5 = "here.";
                    $('#noRecord13').addClass('noRecord');
                    $('#noRecord14').addClass('noRecord');
                } else {
                    $('.showStudentDiv').hide();
                    $scope.studentList = "";
                    $scope.noOfStudents = 0;
                    $scope.nodesc1 = "No Students Found… ";
                    $scope.nodesc2 = "Try: ";
                    $scope.nodesc3 = "1. Reload the webpage.";
                    $scope.nodesc4 = "2. If the problem persists, please submit your query";
                    $scope.nodesc5 = "here.";
                    $('#noRecord13').addClass('noRecord');
                    $('#noRecord14').addClass('noRecord');
                }
            });

            $scope.downloadAttachment = function (uploadedFileId, filename) {
                //console.log(uploadedFileId);
                cfpLoadingBar.start();
                $http({
                    async: true,
                    crossDomain: true,
                    url: api_base_url + "api/files/taskattachment=" + uploadedFileId,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "authorization": "Bearer " + access_token,
                        "cache-control": "no-cache",
                    },
                    processData: false,
                    // contentType: false,
                    // mimeType: "multipart/form-data",
                    responseType: "arraybuffer"
                }).success(function (data, status, headers, config) {
                    //console.log("DOWNLOAD RESPONSE");
                    // console.log(data);
                    // console.log('down start');
                    //%%%%%%%%%%%% Added By Krishna on 14.02.17 for create blob object with specific type start here

                     var file = new Blob([data], { type: 'application/binary' });
                    // var file = new Blob([data], { type: 'image/jpg' });
                    // console.log(file);
                    // console.log(navigator.userAgent);
                    var browser = detectIE();
                    if (browser === false) {                            // For All Browser Except MS default Browser
                        var fileURL = URL.createObjectURL(file);
                        var anchor = document.createElement("a");
                        anchor.download = filename;
                        anchor.href = fileURL;
                        anchor.id = 'download_myfile';
                        document.body.appendChild(anchor);
                        anchor.click();
                        // console.log(anchor);
                        document.body.removeChild(anchor);

                    }else if (browser >= 0){                            //  Only for MS default browser
                        window.navigator.msSaveOrOpenBlob(file, filename);
                    }

                    //%%%%%%%%%%%%% Added By Krishna on 14.02.17 for create blob object with specific type start here
                    cfpLoadingBar.complete();
                    //console.log('down end');
                    //window.open(fileURL);
                }).error(function (data, status, headers, config) {
                    //upload failed
                });
            };

            //var totFileSize = 0;
            /*for details of tasks in TASK*/
            homeService.taskDescriptionResponse(access_token, taskId, function (response) {
                console.log('TASK DESCRIPTION');
                //console.log(response);
                if (response.status) {
                    if (response != '') {
                        $scope.TaskType = response.TaskType;
                        $scope.Title = response.Title;
                        //$scope.Description = "dummy desc";

                        //$scope.Description = response.Description;
                        $('#description3').html(response.Description);
                        $('#description4').html(response.Description);
                        
                        $scope.CreatedDate = response.CreatedDate;
                        $scope.DueDate = response.DueDate;
                        $scope.AttachmentCount = response.Attachments.length;
                        var AttachmentCount = response.Attachments.length;
                        $scope.Attachments = response.Attachments;
                        //$scope.selectedStudentCount = response.StudentIds.length;
                        document.getElementById('studentIdsAssigned').value = response.StudentIds;

                        var responseDueDate = response.DueDate;
                        var responseDueDateExplode = responseDueDate.split('T');
                        var DueDateStr = responseDueDateExplode[0];
                        var DueDateStrExplode = DueDateStr.split('-');
                        var DueDateYear = DueDateStrExplode[0];
                        var DueDateMnth = DueDateStrExplode[1];
                        var DueDateDay = DueDateStrExplode[2];
                        $scope.DueDateDisplay = DueDateMnth + '/' + DueDateDay + '/' + DueDateYear;
                        var responseCreatedDate = response.CreatedDate;
                        var responseCreatedDateExplode = responseCreatedDate.split('T');
                        var CreatedDateStr = responseCreatedDateExplode[0];
                        var CreatedDateStrStrExplode = CreatedDateStr.split('-');
                        var CreatedDateStrYear = CreatedDateStrStrExplode[0];
                        var CreatedDateStrMnth = CreatedDateStrStrExplode[1];
                        var CreatedDateStrDay = CreatedDateStrStrExplode[2];
                        $scope.CreatedDateDisplay = CreatedDateStrMnth + '/' + CreatedDateStrDay + '/' + CreatedDateStrYear;
                        $scope.DueDateYear = DueDateYear;
                        $scope.DueDateMnth = DueDateMnth;
                        $scope.DueDateDay = DueDateDay;
                        $('#day3').val(DueDateDay);
                        $("#day3").change();
                        $('#mnth3').val(DueDateMnth);
                        $("#mnth3").change();
                        $('#year3').val(DueDateYear);
                        $("#year3").change();

                        /******already assigned student will be checked******/

                        var nodata = "-1";
                        /*list of actual updated students*/
                        var SelectedStudentIds = response.StudentIds;
                        //console.log("selected"+SelectedStudentIds);
                        $scope.isExist = function (id) {
                            //if($('#studentListInEditPopup'+id).find(':checkbox').length > 0){
                            return SelectedStudentIds.indexOf(id);
                            // }else{
                            //  return nodata;
                            // }
                        }

                        ////////////////////////////////////////////////////////               

                        /*SELECT ALL & NO OF SELECTED STUDENTS*/
                        $timeout(function () {
                            var numberOfChecked = $('input:checkbox.studentListInEditPopupCheckbox:checked').length;
                            var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                       
                               // console.log("numberOfChecked"+numberOfChecked);
                               // console.log("totalCheckboxes"+totalCheckboxes);
                            $scope.selectedStudentCount = numberOfChecked;
                            //when all student selected ; select all checkbox will be selected
                            if (numberOfChecked != totalCheckboxes) {
                                $('#remember3').prop('checked', false);
                                $('#remember3').removeAttr('checked');
                            }
                            else {
                                $('#remember3').attr('checked', "true");
                                $('#remember3').prop('checked', true);
                            }
                       
                            $(window).scrollTop(0);
                            $("#status_right_content10").css("display", "none");
                            $("#preloader_right_content10").css("display", "none");
                            $("#status_right_content11").css("display", "none");
                            $("#preloader_right_content11").css("display", "none");
                        }, 5000);

                    } else {
                        $scope.TaskType = '';
                        $scope.Title = '';
                        $scope.Description = '';
                        //$('#description3').html('');
                        //$('#description4').html('');
                        $scope.CreatedDate = '';
                        $scope.DueDate = '';
                        $scope.StudentIds = '';

                        $scope.selectedStudentCount = 0;
                        $(window).scrollTop(0);
                        $("#status_right_content2").css("display", "none");
                        $("#preloader_right_content2").css("display", "none");
                    }
                } else {//ERROR : 500 in api
                    $scope.TaskType = '';
                    $scope.Title = '';
                    $scope.Description = '';
                    //$('#description3').html('');
                    //$('#description4').html('');
                    $scope.CreatedDate = '';
                    $scope.DueDate = '';
                    $scope.StudentIds = '';

                    $scope.selectedStudentCount = 0;
                    $(window).scrollTop(0);
                    $("#status_right_content2").css("display", "none");
                    $("#preloader_right_content2").css("display", "none");
                }
                //console.log('studentIdsAssigned' + studentIdsAssigned);
                if (typeof studentIdsAssigned != "undefined") {
                    $scope.studentIdsAssigned = studentIdsAssigned.toString();
                }
            });



            //$scope.selectedStudentCount = '';
            /*ONCLICK SELECT ALL CHECKBOX*/
            $scope.eachEditTaskClick = function (student_id) //click on each checkbox
            {
                var studentIds = new Array();
                var i = 0;
                /*for active class :: click on each check box*/
                var attr = $("#studentEditPopup" + student_id).prop('checked');
                if (attr == true) {
                    //if ($('#studentEditPopup'+student_id).attr('checked')=="checked") {          
                    setTimeout(function () {
                        $('#studentEditPopup' + student_id).attr('checked', "true");
                    }, 100);
                    $('#studentListInEditPopup' + student_id).addClass('active');
                } else {
                    setTimeout(function () {
                        $('#studentEditPopup' + student_id).removeAttr('checked');
                    }, 100);
                    $('#studentListInEditPopup' + student_id).removeClass('active');
                }
                $("input[type=checkbox]:checked").each(function () {
                    if ($(this).attr("studentEditPopup") != undefined) {
                        studentIds[i] = $(this).attr("studentEditPopup");
                        $("#studentEditPopup" + studentIds[i]).addClass('active');
                        i++;
                    }
                });
                var numberOfChecked = $('input:checkbox.studentListInEditPopupCheckbox:checked').length;
                var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                if (numberOfChecked != totalCheckboxes) {
                    $('#remember3').prop('checked', false);
                    $('#remember3').removeAttr('checked');
                } else {
                    $('#remember3').attr('checked', "true");
                    $('#remember3').prop('checked', true);
                }
                $scope.selectedStudentCount = numberOfChecked;
                //$scope.$apply(function() {
                //       
                //        $scope.selectedStudentCount = numberOfChecked;
                //});
                document.getElementById('studentIdsAssigned').value = studentIds.toString();
            };

            //click on select all checkbox
            $("#remember3").on("click", function () {
                var studentIds = Array();
                var i = 0;
                if (this.checked) {
                    $("#remember3").attr("checked", "true");
                    $("#remember3").prop("checked", true);
                    $("input[name='studentEditPopupCheckbox[]']").each(function () {
                        if ($(this).attr("studentEditPopup") != undefined) {
                            studentIds[i] = $(this).attr("studentEditPopup");
                            $("#studentListInEditPopup" + studentIds[i]).addClass('active');
                            var Attr = $("#studentEditPopup" + studentIds[i]).attr('checked');
                            // For some browsers, `attr` is undefined; for others,
                            // `attr` is false.  Check for both. 
                            if (typeof Attr == typeof undefined || Attr == false) {
                                $("#studentEditPopup" + studentIds[i]).attr("checked", "true");
                                $("#studentEditPopup" + studentIds[i]).prop("checked", true);
                            }
                            i++;
                        }
                    });
                    //$(".user_box").addClass("active");                
                    document.getElementById('studentIdsAssigned').value = studentIds.toString();
                } else {
                    $("#remember3").prop("checked", false);
                    $("#remember3").removeAttr("checked");

                    $("input[name='studentEditPopupCheckbox[]']").each(function () {
                        if ($(this).attr("studentEditPopup") != undefined) {
                            studentIds[i] = $(this).attr("studentEditPopup");
                            $("#studentListInEditPopup" + studentIds[i]).removeClass('active');
                            $("#studentEditPopup" + studentIds[i]).prop("checked", false);
                            $("#studentEditPopup" + studentIds[i]).removeAttr("checked");
                            i++;
                        }
                    });
                    //$(".user_box").removeClass("active");
                    document.getElementById('studentIdsAssigned').value = "";
                }
                var numberOfChecked = $('input:checkbox.studentListInEditPopupCheckbox:checked').length;
                var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                $scope.$apply(function () { $scope.selectedStudentCount = numberOfChecked; });
            });

            /*UPDATE BUTTON CLICK IN EDIT TASK POP UP*/
            $scope.checkCalendarEditPop = function (val) {
                var day3 = $('#day3').val();
                var mnth3 = $('#mnth3').val();
                var year3 = $('#year3').val();
                var error=0;
                if (day3 == '' || mnth3 == '' || year3 == '' || day3 == null || mnth3 == null || year3 == null) {
                    $scope.dateErr3 = "Please select date";
                } else {
                    $scope.dateErr3 = "";
                }
                /*date validation for valid / invalid date*/
                var text2 = mnth3 + '/' + day3 + '/' + year3;
                var curDate2 = '"' + mnth3 + '-' + day3 + '-' + year3 + '"';
                var comp2 = text2.split('/');
                var m2 = parseInt(comp2[0], 10);
                var d2 = parseInt(comp2[1], 10);
                var y2 = parseInt(comp2[2], 10);
                var date2 = new Date(y2, m2 - 1, d2);
                if (date2.getFullYear() == y2 && date2.getMonth() + 1 == m2 && date2.getDate() == d2) {

                    //$scope.dateErr = "Please select Date";
                    var dueDate2 = year3 + '-' + mnth3 + '-' + day3 + 'T' + '00:00:00';
                    $scope.dateErr3 = "";
                } else {
                    $scope.dateErr3 = "Please enter a valid date";
                }

                /*date validation for date greater than or eqqual to today*/
                var today = new Date(st);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                var currentDate2 = yyyy + '-' + mm + '-' + dd + 'T' + '00:00:00';
                var dueDateToCompare2 = year3 + '-' + mnth3 + '-' + day3 + 'T' + '00:00:00';
                console.log(currentDate2+'---'+dueDateToCompare2);
                //if (dueDateToCompare2 > currentDate2) {
                //    var dueDate2 = year3 + '-' + mnth3 + '-' + day3 + 'T' + '00:00:00';
                //    $scope.dateErr3 = "";
                //} else if (dueDateToCompare2 == currentDate2) {
                //    var dueDate2 = year3 + '-' + mnth3 + '-' + day3 + 'T' + '00:00:00';
                //    $scope.dateErr3 = "";
                //} else {
                //    $scope.dateErr3 = "Please enter a date in the future";
                //}
                var curDate = new Date(currentDate2);
                var dateComp = new Date(dueDateToCompare2);
                if (dateComp < curDate) {
                    $scope.dateErr3 = "Please enter a date in the future";
                    error++;
                    return false;
                } else {
                    var dueDate2 = year3 + '-' + mnth3 + '-' + day3 + 'T' + '00:00:00';
                    $scope.dateErr3 = "";
                }
                
                var todayTime = new Date(st);
                var monthAcademic = (todayTime.getMonth() + 1);
                var dayAcademic = (todayTime.getDate());
                var yearAcademic = (todayTime.getFullYear());
                var nextYearAcademic = (todayTime.getFullYear() + 1);
                var prevYearAcademic = (todayTime.getFullYear() - 1);

                if (monthAcademic <= 8) {
                    var academicYearStartDate = prevYearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                    var academicYearEndDate = yearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
                } else {
                    var academicYearStartDate = yearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                    var academicYearEndDate = nextYearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
                }

                var dateStart = new Date(academicYearStartDate);
                var dateEnd = new Date(academicYearEndDate);
                var dateComp = new Date(dueDateToCompare2);
                //console.log(academicYearStartDate + ' ### ' + academicYearEndDate + '###' + dueDateToCompare2);
                //console.log(dateStart + '---' + dateEnd + '---' + dateComp);

                if ((dateComp < dateStart) || (dateComp > dateEnd)) {
                    $scope.dateErr3 = "Please select a date in the current academic year";
                    error++;
                    return false;
                } else {
                    $scope.dateErr3 = "";
                }
                //if ((dueDateToCompare2 < academicYearStartDate) || (dueDateToCompare2 > academicYearEndDate)) {
                //    $scope.dateErr3 = "Please select a date in the current academic year";
                //}else{
                //    $scope.dateErr3 = "";  
                //}

            }

            $scope.removeAttachmentOld = function (attachmentId) {
                ///*file size gets deducted everytime a file is removed*/
                //var file_size = parseInt($('#individual_file_size_old'+(attachmentId)).val());
                //var total_file_size = parseInt($('#totFileSizeOld').val());
                //var update_file_size = parseInt(total_file_size) - parseInt(file_size);
                //$('#totFileSizeOld').val(update_file_size);
                $("#attachmentDivOld" + attachmentId).remove();
                var noOfOldFiles = $('#noOfOldFiles').val();
                $scope.AttachmentCount = noOfOldFiles - 1;
            }

            var dynamicId = 0;
            $scope.attach3 = function () {
                //var newAttach=$('#newAttach').val();
                var noOfOldFiles = $('#noOfOldFiles').val();
                var remainingNoOfFileCanBeUploaded = 4 - noOfOldFiles;
                var fileNum = parseInt($('#fileNum3').val());
                if (fileNum < remainingNoOfFileCanBeUploaded) {
                    fileNum = fileNum + 1;
                    $('#fileNum3').val(fileNum);
                    dynamicId++;
                    $('#adddiv3').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentDivNew' + (dynamicId - 1) + '"><div class="pdf_left attachmentEditNew w3attach"><input type="file" id="file_attachment3' + (dynamicId - 1) + '" onclick="file_upload3(' + (dynamicId - 1) + ');" class="upload file_attachment_class3" style="cursor: pointer;opacity: 0;position: absolute;" /><label class="file_div attc" for="file_attachment3' + (dynamicId - 1) + '"><a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span3' + (dynamicId - 1) + '">Choose file..</span></a></label><span onclick="removeAttachmentEdit(' + (dynamicId - 1) + ');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span></div><input type="hidden" id="individual_file_size3' + (dynamicId - 1) + '" value="0" class="indiFsize3"></div>');

                    $('#file_attachment3' + (dynamicId - 1)).click();
                } else {
                    document.getElementById('fileUploadErrMsg').innerHTML = "Maximum 4 attachments are permitted";
                    $("#fileErr").click();
                }
                if (fileNum == 1) {
                    $('#attach_pic3').css("display", "none");
                    $('#add_more3').css("display", "block");
                }
            };

            $('#adddiv').html('');
            $('#fileNum3').val(0);

            /*UPDATE TASK*/
            $scope.updateTask = function () {
                /*list of actual updated students*/
                var m = 0;
                var studentIdsARR = Array();
                $(".studentListInEditPopupCheckbox").each(function () {
                    var ID = this.id;
                    //console.log('cal' + '---' + ID);
                    if ($("#" + ID).attr('checked') == 'checked') {
                        studentIdsARR[m] = $(this).attr("studentEditPopup");
                        m++;
                    }
                });
                //console.log(studentIdsARR.toString());

                $scope.myTaskStatus = 0;
                var title = $.trim($('#title3').val());
                var description = $.trim($('#description3').val());
                //$scope.SelectedDay = Days; 
                var day = $('#day3').val();
                var mnth = $('#mnth3').val();
                var year = $('#year3').val();
                //var StudentIds = $('#studentIdsAssigned').val();
                var StudentIds = studentIdsARR.toString();
                var tot_file_size = $('#file_size3').val();

                var error = 0;

                if (StudentIds == '') {
                    $("#confy").click();
                    $scope.message = "Please select students";
                    error++;
                    return false;
                }
                if ($('#title3').val().toString().trim() == '') {
                    $('#title3').val('');
                    $("#title3").attr("placeholder", "Please enter task title").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#title3").attr("placeholder", "Title").removeClass('red_place');
                }
                if (title.length > 50) {
                    $("#title3").attr("placeholder", "Task title must not be more than 50 characters").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#title3").attr("placeholder", "Title").removeClass('red_place');
                }
                if ($('#description3').val().toString().trim() == '') {
                    $('#description3').val('');
                    $("#description3").attr("placeholder", "Please enter task description").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#description3").attr("placeholder", "Description").removeClass('red_place');
                }
                if (description.length > 2000) {
                    $("#description3").attr("placeholder", "Task description must not be more than 2000 characters").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $("#description3").attr("placeholder", "Description").removeClass('red_place');
                }
                if (tot_file_size > 5120000) {
                    document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                    $("#fileErr").click();
                    error++;
                    return false;
                }
                if (day == '' || mnth == '' || year == '' || day == null || mnth == null || year == null) {
                    $scope.dateErr3 = "Please select date";
                    error++;
                    return false;
                } else {
                    $scope.dateErr3 = "";
                }

                var text = mnth + '/' + day + '/' + year;
                var curDate = '"' + mnth + '-' + day + '-' + year + '"';
                var comp = text.split('/');
                var m = parseInt(comp[0], 10);
                var d = parseInt(comp[1], 10);
                var y = parseInt(comp[2], 10);
                var date = new Date(y, m - 1, d);
                if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                    var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                    $scope.dateErr3 = "";
                } else {
                    $scope.dateErr3 = "Please enter a valid date";
                    error++;
                    return false;
                }
                var dueDateToCompare = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                var today = new Date(st);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                //var currentDate =yyyy+'-'+mm+'-'+dd;
                //if(dueDateToCompare > currentDate){
                //    var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                //    $scope.dateErr3 = "";
                //}else if(dueDateToCompare == currentDate){
                //    var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                //    $scope.dateErr3 = "";
                //}else{ 
                //    $scope.dateErr3 = "Please enter a date in the future";
                //    error++;
                //    return false;
                //}

                var todayTime = new Date(st);
                var monthAcademic = (todayTime.getMonth() + 1);
                var dayAcademic = (todayTime.getDate());
                var yearAcademic = (todayTime.getFullYear());
                var nextYearAcademic = (todayTime.getFullYear() + 1);
                var prevYearAcademic = (todayTime.getFullYear() - 1);

                if (monthAcademic <= 8) {
                    var academicYearStartDate = prevYearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                    var academicYearEndDate = yearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
                } else {
                    var academicYearStartDate = yearAcademic + '-' + '09' + '-' + '01' + 'T' + '00:00:00';
                    var academicYearEndDate = nextYearAcademic + '-' + '08' + '-' + '31' + 'T' + '00:00:00';
                }
                var dateStart = new Date(academicYearStartDate);
                var dateEnd = new Date(academicYearEndDate);
                var dateComp = new Date(dueDateToCompare);
                var currentDate = yyyy + '-' + mm + '-' + dd + 'T' + '00:00:00';
                var curDate = new Date(currentDate);
                if (dateComp < curDate) {
                    $scope.dateErr3 = "Please enter a date in the future";
                    error++;
                    return false;
                } else {
                    var dueDate = year + '-' + mnth + '-' + day + 'T' + '00:00:00';
                    $scope.dateErr3 = "";
                }
                if ((dateComp < dateStart) || (dateComp > dateEnd)) {
                    $scope.dateErr3 = "Please select a date in the current academic year";
                    error++;
                    return false;
                } else {
                    $scope.dateErr3 = "";
                }
                if (StudentIds != '') {
                    StudentIdsStr = StudentIds;
                }
                if (error == 0) {
                    document.getElementById("editPopupClose").disabled = true;
                    ///LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content2").css("display", "block");
                    $("#preloader_right_content2").css("display", "block");

                    var attachmentId = new Array();
                    var attachmentName = new Array();
                    var existingFileUploadData = new Array();

                    var k = 0;

                    $(".file_attachment_class3").each(function () {
                        var file_attachment_id = $.trim($(this).attr('id')).replace('file_attachment3', '');

                        if (($('#individual_file_size3' + file_attachment_id).val() != 0) &&
                           ($('#individual_file_size3' + file_attachment_id).val() != '') &&
                           ($('#individual_file_size3' + file_attachment_id).val() != undefined) &&
                           ($('#individual_file_size3' + file_attachment_id).val() != 'undefined')) {
                            k++;
                        }
                    });
                    if (k != 0) {

                        //var noOfAttach=$('.attachmentEditNew').length;
                        homeService.fileUploadForEdit(access_token, function (fileUploadResponse) {
                            //console.log('FILE UPLOAD RES');
                            //console.log(fileUploadResponse);
                            var s = 0;
                            $("div[name='attachmentEdit[]']").each(function () {
                                attachmentId[s] = $(this).attr("attachmentId");
                                attachmentName[s] = $(this).attr("attachmentName");
                                existingFileUploadData[s] = { "Id": attachmentId[s], "Name": attachmentName[s] };
                                s++;
                            });

                            //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                            //console.log(existingFileUploadData);
                            //console.log(fileUploadResponse);
                            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

                            homeService.updateTaskResponse(access_token, StudentIdsStr, taskId, title, description, dueDate, fileUploadResponse, existingFileUploadData, function (response) {
                                //document.getElementById("editTaskPopBtn").disabled = true;
                                var dueDateExp = dueDate.split('T');
                                fromDate3 = new Date(convertDate(dueDateExp[0]));
                                fromDateTime3 = fromDate3.getTime();

                                var weekDay = fromDate3.getDay();
                                if (weekDay == 0) {
                                    var weekStartDate = $scope.ISOdateConvertion((fromDateTime3 - (fromDate3.getDay() * 86400000)) - (86400000 * 6));
                                    var weekEndDate = $scope.ISOdateConvertion(((fromDateTime3 - (fromDate3.getDay() * 86400000))));
                                } else {
                                    var weekStartDate = $scope.ISOdateConvertion((((fromDateTime3 - (fromDate3.getDay() * 86400000)) + 86400000)));
                                    var weekEndDate = $scope.ISOdateConvertion((((fromDateTime3 - (fromDate3.getDay() * 86400000)) + (86400000 * 7))));
                                }
                                if (response == true) {
                                    //$('#loader_settask3').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content2").fadeOut();
                                    $("#preloader_right_content2").delay(200).fadeOut("slow");

                                    $scope.successMsg1 = 'Task successfully updated';

                                    $('#successMsg1').click();
                                    setTimeout(function () {
                                        /*close the edit pop up*/
                                        /*redirects to the updated week*/
                                        setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                                        setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);

                                        //console.log(fromDate3+'  &&&&&&&&  '+weekStartDate+'   &&&&&&&&&&   '+weekEndDate);
                                        /*clear the attachment div*/
                                        $('#adddiv3').html('');
                                        /*reset file upload fields*/
                                        $('#fileNum3').val(0);
                                        $('#file_size3').val(0);
                                        //$('#totFileSizeOld').val(0);
                                        /**************************/
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#edit_task').modal('hide');
                                        document.getElementById("editPopupClose").disabled = false;
                                        $scope.toggle_status_my_task = "tab";
                                        $("#myTask").click();

                                    }, 500);
                                    setTimeout(function () {
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#successMsg_modal1').modal('hide');
                                    }, 1500);
                                } else {
                                    //$('#loader_settask3').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content2").fadeOut();
                                    $("#preloader_right_content2").delay(200).fadeOut("slow");
                                    document.getElementById("editPopupClose").disabled = false;
                                    $scope.successMsg1 = 'Task not updated';
                                    $('#successMsg1').click();
                                    setTimeout(function () {
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#successMsg_modal1').modal('hide');
                                    }, 1500);
                                }
                            });
                        });

                    } else {



                        var s = 0;
                        $("div[name='attachmentEdit[]']").each(function () {
                            attachmentId[s] = $(this).attr("attachmentId");
                            attachmentName[s] = $(this).attr("attachmentName");
                            existingFileUploadData[s] = { "Id": attachmentId[s], "Name": attachmentName[s] };
                            s++;
                        });

                        var fileUploadResponse = null;

                        homeService.updateTaskResponse(access_token, StudentIdsStr, taskId, title, description, dueDate, fileUploadResponse, existingFileUploadData, function (response) {
                            //document.getElementById("editTaskPopBtn").disabled = true;
                            var dueDateExp = dueDate.split('T');
                            fromDate3 = new Date(convertDate(dueDateExp[0]));
                            fromDateTime3 = fromDate3.getTime();

                            var weekDay = fromDate3.getDay();

                            if (weekDay == 0) {
                                var weekStartDate = $scope.ISOdateConvertion((fromDateTime3 - (fromDate3.getDay() * 86400000)) - (86400000 * 6));
                                var weekEndDate = $scope.ISOdateConvertion(((fromDateTime3 - (fromDate3.getDay() * 86400000))));
                            } else {
                                var weekStartDate = $scope.ISOdateConvertion((((fromDateTime3 - (fromDate3.getDay() * 86400000)) + 86400000)));
                                var weekEndDate = $scope.ISOdateConvertion((((fromDateTime3 - (fromDate3.getDay() * 86400000)) + (86400000 * 7))));
                            }
                            //console.log(dueDateExp+'  start= '+weekStartDate+'  end=  '+weekEndDate);                      
                            if (response == true) {
                                //$('#loader_settask3').hide();
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content2").fadeOut();
                                $("#preloader_right_content2").delay(200).fadeOut("slow");
                                $scope.successMsg1 = 'Task successfully updated';
                                $('#successMsg1').click();
                                setTimeout(function () {
                                    /*close the edit pop up*/
                                    /*redirects to the updated week*/
                                    setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                                    setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);

                                    //console.log(fromDate3+'  &&&&&&&&  '+weekStartDate+'   &&&&&&&&&&   '+weekEndDate);

                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#edit_task').modal('hide');
                                    document.getElementById("editPopupClose").disabled = false;
                                    $scope.toggle_status_my_task = "tab";
                                    $("#myTask").click();

                                }, 500);
                                setTimeout(function () {
                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#successMsg_modal1').modal('hide');
                                }, 1500);
                            } else {
                                //$('#loader_settask3').hide();
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content2").fadeOut();
                                $("#preloader_right_content2").delay(200).fadeOut("slow");
                                document.getElementById("editPopupClose").disabled = false;
                                $scope.successMsg1 = 'Task not updated';
                                $('#successMsg1').click();
                                setTimeout(function () {
                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#successMsg_modal1').modal('hide');
                                }, 1500);
                            }
                        });
                    }
                }
            };

            //setTimeout(function () {
            //    $("#closeModal").click();                                                              
            //}, 200);

            /*CANCEL BUTTON CLICK IN EDIT TASK POP UP*/
            $scope.cancelTask = function () {
                $('#studentsReset6').click();
                $("#tasktype3").change();
                $("#day3").change();
                $("#mnth3").change();
                $("#year3").change();
                $("#day3").val($scope.DueDateDay);
                $("#mnth3").val($scope.DueDateMnth);
                $("#year3").val($scope.DueDateYear);
                $('.selectpicker').selectpicker('refresh');
                $scope.tasktypeErr3 = "";
                $scope.tasktitleErr3 = "";
                $scope.taskdescErr3 = "";
                $scope.dateErr3 = "";
                $('#adddiv3').html('');
                $('.post_row').css("background-color", "");
                $('#editPopupClose').click();
                $('.modal-backdrop').hide(); // for black background
                $('body').removeClass('modal-open'); // For scroll run
                $('#edit_task').modal('hide');
            };
            $scope.cancelClick = function () {
                $('#dataLostConfy').click();
                // /*clear the attachment div*/
                // $('#adddiv3').html('');
                // /*reset file upload fields*/
                // $('#fileNum3').val(0);
                // $('#file_size3').val(0);
                //// $('#totFileSizeOld').val(0);
                // /**************************/

            }
            /*CLOSE BTN IN EDIT POP UP*/
            $scope.editclose = function () {
                $('#dataLostConfy').click();
                // $('.post_row').css("background-color", "");
            };
            /*EDIT BUTTON CLICK IN TASK DESCRIPTION POP UP*/
            $scope.editModalOpen = function () {
                $("#taskDescriptionClose").click();
                setTimeout(function () {
                    $("#editMyTask" + taskId).click();
                }, 500);
            };
            $scope.deselect = function () {
                $('.post_row').css("background-color", "");
                $("#task_hover_div").val('-1');
            };
            $scope.deleteModalOpenforDesc = function () {
                $('#deleteMyTask' + taskId).click();
                /*********************************DELETE TASK POP UP begins*******************************************/
                $scope.taskDelete = function () {
                    homeService.deleteTaskResponse(access_token, taskId, function (response) {
                        if (response == true) {

                            $scope.successMsg1 = 'Task successfully deleted';
                            $('#successMsg1').click();
                            $("#taskDescriptionClose").click();
                            setTimeout(function () {
                                var displayStartDate = getOnlyCookie("weekStartDate");
                                var displayEndDate = getOnlyCookie("weekEndDate");
                                var displayStartDatesplit = displayStartDate.split("-");
                                var startyear = displayStartDatesplit[0];
                                var startmonth = displayStartDatesplit[1];
                                var startdate =  displayStartDatesplit[2];
                                if (startmonth <= 9) {
                                        startmonth = "0"+startmonth;
                                }
                                if (startdate <= 9) {
                                        startdate = "0"+startdate;
                                }
                                
                                var displayEndDate = displayEndDate.split("-");
                                var endyear = displayEndDate[0];
                                var endmonth = displayEndDate[1];
                                var enddate =  displayEndDate[2];
                                if (endmonth <= 9) {
                                        endmonth = "0"+endmonth;
                                }
                                if (enddate <= 9) {
                                        enddate = "0"+enddate;
                                }
                                var startfullDate = startyear+"-"+startmonth+"-"+startdate;
                                var endfullDate = endyear+"-"+endmonth+"-"+enddate;
                        
                                $scope.selectWeek(startfullDate,endfullDate);
                                //$scope.selectWeek(displayStartDate + "T00:00:00", displayEndDate + "T00:00:00");
                            }, 500);
                        } else {

                            $scope.successMsg1 = 'Task not deleted';
                            $('#successMsg1').click();
                        }
                        setTimeout(function () {
                            $('.modal-backdrop').hide(); // for black background
                            $('body').removeClass('modal-open'); // For scroll run
                            $('#successMsg_modal1').modal('hide');

                        }, 1500);
                    });
                };
                $scope.noDeleteBtn = function () {
                    $('#highlight' + taskId).css("background-color", "");
                }
            };
        };


        //$scope.resetEditPopup = function(){
        //    
        //        $('#studentsReset6').click();
        //        $("#tasktype3").change();
        //        $("#day3").change();
        //        $("#mnth3").change();
        //        $("#year3").change();
        //        $("#status_right_content2").css("display", "none");
        //        $("#preloader_right_content2").css("display", "none");
        //        document.getElementById("editPopupClose").disabled = false;
        //        
        //        $('.studentListInEditPopupCheckbox').attr('checked', "false");
        //        $('.studentListInEditPopupCheckbox').prop('checked', false);
        //        $('#remember3').attr('checked', "false");
        //        $('#remember3').prop('checked', false);
        //        
        //        $(".file_attachment_class3").each(function(){
        //            var file_attachment_id = $.trim($(this).attr('id')).replace('file_attachment3','');
        //           
        //            if(($('#individual_file_size3'+file_attachment_id).val()==0) ||
        //               ($('#individual_file_size3'+file_attachment_id).val()=='') ||
        //               ($('#individual_file_size3'+file_attachment_id).val()==undefined) ||
        //               ($('#individual_file_size3'+file_attachment_id).val()=='undefined'))
        //            {
        //                    $('#attachmentDivNew'+file_attachment_id).remove();
        //            }
        //        });
        //        
        //        $scope.tasktypeErr3 = "";
        //        $scope.tasktitleErr3 = "";
        //        $scope.taskdescErr3 = "";
        //        $scope.dateErr3 = "";
        //};

        /*********************************TASK DESCRIPTION POP UP & EDIT TASK POP UP ends************************/



    };

    /*DELETE BUTTON CLICK IN TASK DESCRIPTION POP UP*/
    $scope.deleteModalOpen = function (taskId) {
        //$('#highlight'+taskId).css({"background-color": "rgb(221, 244, 250)"});
        $('#highlight' + taskId).css("background-color", "#DDF4FA");


        /*********************************DELETE TASK POP UP begins***********************************************/
        $scope.taskDelete = function () {
               
            homeService.deleteTaskResponse(access_token, taskId, function (response) {
       
                if (response == true) {
                         
                    $scope.successMsg1 = 'Task successfully deleted';
                   $('#successMsg1').click();

                    
      
                    setTimeout(function () {
                        var displayStartDate = getOnlyCookie("weekStartDate");
                        var displayEndDate = getOnlyCookie("weekEndDate");
                                //console.log(convertDate(getOnlyCookie("weekStartDate")));
                                //console.log(convertDate(getOnlyCookie("weekEndDate")));
                        var displayStartDatesplit = displayStartDate.split("-");
                        var startyear = displayStartDatesplit[0];
                        var startmonth = displayStartDatesplit[1];
                        var startdate =  displayStartDatesplit[2];
                        if (startmonth <= 9) {
                                startmonth = "0"+startmonth;
                        }
                        if (startdate <= 9) {
                                startdate = "0"+startdate;
                        }
                        
                        var displayEndDate = displayEndDate.split("-");
                        var endyear = displayEndDate[0];
                        var endmonth = displayEndDate[1];
                        var enddate =  displayEndDate[2];
                        if (endmonth <= 9) {
                                endmonth = "0"+endmonth;
                        }
                        if (enddate <= 9) {
                                enddate = "0"+enddate;
                        }
                                var startfullDate = startyear+"-"+startmonth+"-"+startdate;
                                var endfullDate = endyear+"-"+endmonth+"-"+enddate;

                                //var Finalstartdate = displayStartDate+"T00:00:00";
                                //var Finalenddate = displayEndDate+"T00:00:00";
                                //console.log("Finalstartdate"+Finalstartdate);
                                //console.log("Finalenddate"+Finalenddate);
                        $scope.selectWeek(startfullDate,endfullDate);
                        //$scope.selectWeek("2016-12-26T00:00:00","2017-01-01T00:00:00");
                    }, 500);
                } else {
     
                    $scope.successMsg1 = 'Task not deleted';
                    $('#successMsg1').click();
                }

                setTimeout(function () {
                    $('.modal-backdrop').hide(); // for black background
                    $('body').removeClass('modal-open'); // For scroll run
                    //$('#successMsg_modal1').css({'display':'none'});
                     $('#successMsg_modal1').modal('hide');
              
                }, 1500);
            });
        };
        $scope.noDeleteBtn = function () {
            $('#highlight' + taskId).css("background-color", "");
        }
        /*********************************DELETE TASK POP UP ends***********************************************/
    };
    /*********************************MY TASK SECTION ends****************************************************************/

    /*TASK TYPE LIST*/
    homeService.taskListResponse(access_token, function (response) {
        $scope.taskList = response;

        setTimeout(function () {
            initDropdown();
        }, 200);
    });

    /*** SETTINGS ***/
    $scope.settings = function () {

        $(window).scrollTop(0);
        $("#status_right_content8").css("display", "none");
        $("#preloader_right_content8").css("display", "none");

        $("#status_right_content").css("display", "none");
        $("#preloader_right_content").css("display", "none");

        $("#status_right_content5").css("display", "none");
        $("#preloader_right_content5").css("display", "none");

        /*SETTINGS EMAIL NOTIFICATION*/
        $scope.email_notification = function () {

            homeService.email_notification(access_token, function (response) {
                $('#query').val('');
                $('#adddiv4').html('');
                $('#fileNum4').val(0);
                $('#file_size4').val(0);
                $("#query").attr("placeholder", "Please enter query information").removeClass('red_place');
                //console.log('email ______');
                //console.log(response.EmailsEnabled);
                //$("#f-option").attr('checked', "false");
                //$("#s-option").attr('checked', "false");

                $("#f-option").attr('checked', "false");
                $('#s-option').attr('checked', "false");
                $('#f-option').prop('checked', false);
                $('#s-option').prop('checked', false);
                if (response.status == true) {
                    if (response.EmailsEnabled == true) {
                        $("#f-option").attr('checked', "true");
                        $('#f-option').prop('checked', true);
                    } else if (response.EmailsEnabled == false) {
                        $('#s-option').attr('checked', "true");
                        $('#s-option').prop('checked', true);
                    } else if (response.EmailsEnabled == undefined) {
                        $("#f-option").attr('checked', "false");
                        $('#s-option').attr('checked', "false");
                        $('#f-option').prop('checked', false);
                        $('#s-option').prop('checked', false);
                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {
                    $("#f-option").attr('checked', "false");
                    $('#s-option').attr('checked', "false");
                    $('#f-option').prop('checked', false);
                    $('#s-option').prop('checked', false);
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                } else {
                    $scope.radio_status = false;
                }

            });
        };
        $scope.email_notification();


        $scope.comingSoon = function () {
            $scope.successMsg1 = 'Coming soon';
            $('#successMsg1').click();
            setTimeout(function () {
                $('.modal-backdrop').hide(); // for black background
                $('body').removeClass('modal-open'); // For scroll run
                $('#successMsg_modal1').modal('hide');
            }, 2000);
        };
        $scope.reset_change_pwd = function () {
            $('#currentPwd').val('');
            $('#newPwd').val('');
            $('#retypeNewPwd').val('');
            $("#currentPwd").attr("placeholder", "Current Password").removeClass('red_place');
            $("#newPwd").attr("placeholder", "New Password").removeClass('red_place');
            $("#retypeNewPwd").attr("placeholder", "Re-type New Password").removeClass('red_place');
        }
        $scope.on_off_btn = function (val) {

            if (val == '0') {
                //on button
                var status = false;
                //$("#s-option").prop('checked', true);
                //$("#f-option").prop('checked', false);

            } else if (val == '1') {
                //off button
                var status = true;
                //$("#f-option").prop('checked', true);
                //$("#s-option").prop('checked', false);
            }

            homeService.email_notification_update(access_token, status, function (response) {
                //console.log('email notification_____________________________');
                //console.log(response);
                if (response.status) {
                    if (response == true) {
                        if (val == '0') {
                            //on button
                            $("#s-option").prop('checked', true);
                            $("#f-option").prop('checked', false);

                        } else if (val == '1') {
                            //off button
                            $("#f-option").prop('checked', true);
                            $("#s-option").prop('checked', false);
                        }
                    } else {
                        if (val == '0') {
                            //on button
                            $("#f-option").prop('checked', true);
                            $("#s-option").prop('checked', false);

                        } else if (val == '1') {
                            //off button
                            $("#s-option").prop('checked', true);
                            $("#f-option").prop('checked', false);
                        }
                    }
                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {
                    $("#confy1").click();
                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                }
            });
        };

        /*SETTINGS CHANGE PASSWORD*/
        $scope.change_pwd = function () {
            $('#settings_close').click();
            /*change pwd submit*/
            $("#currentPwd").focus(function () {
                $("#currentPwd").attr("placeholder", "Current Password").removeClass('red_place');
            });
            $("#newPwd").focus(function () {
                $("#newPwd").attr("placeholder", "New Password").removeClass('red_place');
            });
            $("#retypeNewPwd").focus(function () {
                $("#retypeNewPwd").attr("placeholder", "Re-type New Password").removeClass('red_place');
            });

            $scope.change_pwd_submit = function () {
                var currentPwd = $.trim($('#currentPwd').val());
                var newPwd = $.trim($('#newPwd').val());
                var retypeNewPwd = $.trim($('#retypeNewPwd').val());

                var error = 0;
                if (currentPwd == '') {
                    $('#currentPwd').val('');
                    $scope.errorclass1 = "red_place";
                    $("#currentPwd").attr("placeholder", "Please enter current password").addClass('red_place');
                    error++;
                    return false;
                } else if (currentPwd.length < 6) {
                    $('#currentPwd').val('');
                    $scope.errorclass1 = "red_place";
                    $("#currentPwd").attr("placeholder", "Minimum 6 characters required").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $scope.errorclass1 = "";
                    $("#currentPwd").attr("placeholder", "Current Password").removeClass('red_place');
                }

                if (newPwd == '') {
                    $('#newPwd').val('');
                    $scope.errorclass2 = "red_place";
                    $("#newPwd").attr("placeholder", "Please enter new password").addClass('red_place');
                    error++;
                    return false;
                } else if (newPwd.length < 6) {
                    $('#newPwd').val('');
                    $scope.errorclass2 = "red_place";
                    $("#newPwd").attr("placeholder", "Minimum 6 characters required").addClass('red_place');
                    error++;
                    return false;
                } else if (newPwd == currentPwd) {
                    //$("#confy1").click();
                    //$scope.msg = 'New password must be different to current password.';
                    $('#successMsg1').click();
                    $scope.successMsg1 = 'New password must be different to current password.';
                    $('#newPwd').val('');
                    $('#retypeNewPwd').val('');
                    $scope.errorclass2 = "";
                    $("#newPwd").attr("placeholder", "New Password").removeClass('red_place');
                    $("#retypeNewPwd").attr("placeholder", "Re-type New Password").removeClass('red_place');
                    setTimeout(function () {
                        $('.modal-backdrop').hide();
                        $('body').removeClass('modal-open');
                        $('#successMsg_modal1').modal('hide');

                    }, 1500);
                    error++;
                    return false;
                } else {
                    $scope.errorclass2 = "";
                    $("#newPwd").attr("placeholder", "New Password").removeClass('red_place');
                }

                if (retypeNewPwd == '') {
                    $('#retypeNewPwd').val('');
                    $scope.errorclass3 = "red_place";
                    $("#retypeNewPwd").attr("placeholder", "Please enter new password").addClass('red_place');
                    error++;
                    return false;
                } else if (retypeNewPwd.length < 6) {
                    $('#retypeNewPwd').val('');
                    $scope.errorclass3 = "red_place";
                    $("#retypeNewPwd").attr("placeholder", "Minimum 6 characters required").addClass('red_place');
                    error++;
                    return false;
                } else if (newPwd != retypeNewPwd) {
                    $('#retypeNewPwd').val('');
                    $scope.errorclass3 = "red_place";
                    $("#retypeNewPwd").attr("placeholder", "Password Mismatch").addClass('red_place');
                    error++;
                    return false;
                } else {
                    $scope.errorclass3 = "";
                    $("#retypeNewPwd").attr("placeholder", "Re-type New Password").removeClass('red_place');
                }

                if (error == 0) {
                    homeService.change_pwd_Response(access_token, currentPwd, newPwd, function (response) {
                        //console.log('CHANGE PASSWORD CTRL ===>>>' + response.status);
                        console.log(response);
                        if (response.status == 'success') {

                            $scope.successMsg1 = 'Password Change Successful';
                            $('#successMsg1').click();
                            $("#change_pwd_close").click();

                        }
                        else if (response.status == 'fail') {
                            $scope.successMsg1 = 'Password Change Unsuccessful';
                            $('#successMsg1').click();
                            $('#change_pwd_close').click();
                        }
                        else if (response.msg == "ERR_INTERNET_DISCONNECTED") {
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';

                        } else if (response.Message == "ERROR_INCORRECT_CURRENTPASSWORD") {

                            $scope.successMsg1 = 'You have entered incorrect current password.';
                            $('#successMsg1').click();

                            $('#currentPwd').val('');
                            $('#newPwd').val('');
                            $('#retypeNewPwd').val('');
                            $scope.errorclass1 = "";
                            $scope.errorclass2 = "";
                            $scope.errorclass3 = "";
                            $("#currentPwd").attr("placeholder", "Current Password").removeClass('red_place');
                            $("#newPwd").attr("placeholder", "New Password").removeClass('red_place');
                            $("#retypeNewPwd").attr("placeholder", "Re-type New Password").removeClass('red_place');

                        } 
                        else {
                            $('#change_pwd_close').click();
                            $scope.successMsg1 = 'Password Change Unsuccessful';
                            $('#successMsg1').click();
                        }
                        //############ Added On 16.02.17 for change password Start Here
                        if(response.Message != "ERROR_INCORRECT_CURRENTPASSWORD") {
                                setTimeout(function () {
                                    $('.modal-backdrop').hide();
                                    $('body').removeClass('modal-open');
                                    // $('#successMsg_modal1').modal('hide');
                                }, 3000);
                        }
                        setTimeout(function () {                    // Hide the successMsg_modal1 for all
                                    $('#successMsg_modal1').modal('hide');
                        }, 3000);
                        //############ Added On 16.02.17 for change password Ends Here
                        
                    });
                }
            }
        };

        /*SETTINGS : CONTACT US FILE UPLOAD*/
        var dynamicId = 0;
        $scope.attach4 = function () {
            var fileNum = parseInt($('#fileNum4').val());
            if (fileNum < 4) {
                fileNum = fileNum + 1;
                $('#fileNum4').val(fileNum);
                dynamicId++;

                $('#adddiv4').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentContactUs' + (dynamicId - 1) + '"><div class="pdf_left attachmentContactUs w3attach"><input id="file_attachment4' + (dynamicId - 1) + '" type="file" class="upload file_attachment_class4" style="cursor: pointer;opacity: 0;position: absolute;" onclick="file_upload4(' + (dynamicId - 1) + ');" /><label class="file_div attc" for="file_attachment4' + (dynamicId - 1) + '"><a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span4' + (dynamicId - 1) + '">Choose file..</span></a></label></div><span onclick="removeAttachmentContactUs(' + (dynamicId - 1) + ');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span><input type="hidden" id="individual_file_size4' + (dynamicId - 1) + '" value="0" class="indiFsize4"></div>');

                $("#file_attachment4" + (dynamicId - 1)).click();
            } else {
                document.getElementById('fileUploadErrMsg').innerHTML = "Maximum 4 attachments are permitted";
                $("#fileErr").click();
            }

            if (fileNum == 1) {
                $('#attach_pic4').css("display", "none");
                $('#add_more4').css("display", "block");
            }
        };

        /*ON SUBMIT*/
        $scope.contact_us_submit = function () {
            $("#query").mousedown(function () {
                $("#query").attr("placeholder", "Please enter query information").removeClass('red_place');
            });
            var description = $('#query').val();
            var tot_file_size = $('#file_size4').val();

            var error = 0;
            if ($('#query').val().toString().trim() == '') {
                $('#query').val('');
                $("#query").attr("placeholder", "Please enter query details").addClass('red_place');
                error++;
                return false;
            } else {
                $("#query").attr("placeholder", "Please enter query details").removeClass('red_place');
            }

            if (error == 0) {
                document.getElementById("contact_us_submit").disabled = true;
                document.getElementById("settings_close").disabled = true;
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content9").css("display", "block");
                $("#preloader_right_content9").css("display", "block");

                var nothing = "";
                var k = 0;
                $(".file_attachment_class4").each(function () {

                    var file_attachment_id = $.trim($(this).attr('id')).replace("file_attachment4", "");

                    if (($('#individual_file_size4' + file_attachment_id).val() != 0) &&
                       ($('#individual_file_size4' + file_attachment_id).val() != '') &&
                       ($('#individual_file_size4' + file_attachment_id).val() != undefined) &&
                       ($('#individual_file_size4' + file_attachment_id).val() != 'undefined')) {
                        k++;
                    }
                });

                if (k != 0) {
                    homeService.fileUploadContactUs(access_token, function (fileUploadResponse) {
                        //console.log("CTRL RESPONSE");
                        //console.log(fileUploadResponse.response);
                        $scope.fileUploadResponse = fileUploadResponse.msg;
                        if (fileUploadResponse.status == true) {
                            $scope.fileUploadResponse = fileUploadResponse.response;

                            homeService.submitContactUsResponse(access_token, description, fileUploadResponse, function (response) {
                                //console.log("setTaskResponse");
                                //console.log(response);
                                document.getElementById("contact_us_submit").disabled = false;
                                document.getElementById("settings_close").disabled = false;

                                if (response.status == true) {
                                    if (response.data == true) {
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content9").fadeOut();
                                        $("#preloader_right_content9").delay(200).fadeOut("slow");

                                        $scope.successMsg1 = 'Your query has been submitted to the InvolvEd support team';
                                        $('#successMsg1').click();
                                        $('#query').html('');
                                        $('#query').val('');
                                        $("#query").attr("placeholder", "Please enter query information");
                                        $('#adddiv4').html('');
                                        $('#fileNum4').val(0);
                                        $('#file_size4').val(0);
                                        //$("#taskCreateReset").click();
                                    } else {
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content9").fadeOut();
                                        $("#preloader_right_content9").delay(200).fadeOut("slow");
                                        //$('#query').val('');
                                        //$('#adddiv4').html('');
                                        //$('#fileNum4').val(0);
                                        //$('#file_size4').val(0);
                                        $scope.successMsg1 = 'Your query has not been submitted to the InvolvEd support team';
                                        $('#successMsg1').click();
                                        //$("#taskCreateReset").click();
                                    }
                                } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content9").fadeOut();
                                    $("#preloader_right_content9").delay(200).fadeOut("slow");

                                    $("#confy1").click();
                                    $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                    document.getElementById("settings_close").disabled = false;

                                } else {
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content9").fadeOut();
                                    $("#preloader_right_content9").delay(200).fadeOut("slow");
                                    $('#query').html('');
                                    $('#query').val('');
                                    $("#query").attr("placeholder", "Please enter query information");
                                    $('#adddiv4').html('');
                                    $('#fileNum4').val(0);
                                    $('#file_size4').val(0);
                                    $scope.successMsg1 = 'Your query has not been submitted to the InvolvEd support team';
                                    $('#successMsg1').click();

                                }
                                setTimeout(function () {
                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#successMsg_modal1').modal('hide');
                                }, 1500);
                            });
                        } else if (fileUploadResponse.msg == "ERR_INTERNET_DISCONNECTED") {
                            $(window).scrollTop(0);
                            $("#status_right_content9").fadeOut();
                            $("#preloader_right_content9").delay(200).fadeOut("slow");
                            document.getElementById("contact_us_submit").disabled = false;
                            //$scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $('#msg_text').html('Server failed to respond. Please check your internet connection.');
                            $("#confy1").click();

                        }
                    });
                } else {
                    var fileUploadResponse = null;
                    homeService.submitContactUsResponse(access_token, description, fileUploadResponse, function (response) {
                        //console.log("submitContactUsResponse");
                        //console.log(response);
                        document.getElementById("contact_us_submit").disabled = false;
                        document.getElementById("settings_close").disabled = false;
                        if (response.status == true) {
                            if (response.data == true) {
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content9").fadeOut();
                                $("#preloader_right_content9").delay(200).fadeOut("slow");

                                $('#query').val('');
                                $("#query").attr("placeholder", "Please enter query information");
                                $('#adddiv4').html('');
                                $('#fileNum4').val(0);
                                $('#file_size4').val(0);
                                $scope.successMsg1 = 'Your query has been submitted to the InvolvEd support team';
                                $('#successMsg1').click();
                            } else {
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content9").fadeOut();
                                $("#preloader_right_content9").delay(200).fadeOut("slow");
                                //$('#query').val('');
                                //$('#adddiv4').html('');
                                //$('#fileNum4').val(0);
                                //$('#file_size4').val(0);
                                $scope.successMsg1 = 'Your query has not been submitted to the InvolvEd support team';
                                $('#successMsg1').click();
                            }
                        } else if (response.msg == "ERR_INTERNET_DISCONNECTED") {
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content9").fadeOut();
                            $("#preloader_right_content9").delay(200).fadeOut("slow");

                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        } else {
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content9").fadeOut();
                            $("#preloader_right_content9").delay(200).fadeOut("slow");
                            //$('#query').val('');
                            //$('#adddiv4').html('');
                            //$('#fileNum4').val(0);
                            //$('#file_size4').val(0);
                            $scope.successMsg1 = 'Your query has not been submitted to the InvolvEd support team';
                            $('#successMsg1').click();
                        }
                        setTimeout(function () {
                            $('.modal-backdrop').hide(); // for black background
                            $('body').removeClass('modal-open'); // For scroll run
                            $('#successMsg_modal1').modal('hide');
                        }, 1500);
                    });
                }
            }
        };
    };

    function convertStringToDate(dateString) {
        var dateParts = dateString.split('-');
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    }

    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    }
   
   $scope.dtdrp =function(){
    //alert('call');
    $('#week_drp').toggle();
        
    $timeout(function(){
        $('#mCSB_7_container').click();
    },200);        
    
   }
   
$("body").click
(
  function(e)
  {
    console.log(e.target.className);

    if($(e.target).hasClass('user_box') || $(e.target).hasClass('user_box1')){
        $(".week_drp").show();
    }else if(!$(e.target).hasClass('mCSB_container') && !$(e.target).hasClass('dropdown-toggle') )
   // if(e.target.className != "wk_picker" && e.target.className != 'custome_cursor')
    {
      $(".week_drp").hide();
    }else{
        $(".week_drp").toggle();
    }
  }
);

    /*LOGOUT*/
    $scope.logout = function () {
        removeItem("access_token");
        removeItem("userid");
        // removeItem("teacherId");
        removeItem("classId");
        removeItem("weekEndDate");
        removeItem("weekStartDate");

        removeItem("firstWeekRangeEndDate");
        removeItem("firstWeekRangeStartDate");
        removeItem("lastWeekRangeEndDate");
        removeItem("lastWeekRangeStartDate");

        removeItem("tab");
        $('.modal-backdrop').hide();
        $location.path("/login");
        //var URL = base_url + 'login';
        //window.location = URL;
    };


    //$scope.multiple_file_upload = function(){
    //    file_attachment1
    //}



});




