postApp.service('homeService', function ($http) {
    var service = {};

    service.bookDemoSubmit = function (name, job_title, email, contact_no, school, postcode, date, callback) {
        $http({
            method: 'POST',
            url: api_base_url + 'api/contactus/bookdemo',
            data:
                {
                    "Name": name,
                    "JobTitle": job_title,
                    "Email": email,
                    "PhoneNo": contact_no,
                    "SchoolName": school,
                    "SchoolAddress": postcode,
                    "BookedDate": date
                },
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        }).success(function (data, status, headers, config) {
            //console.log('BOOK A DEMO RESPONSE ===>>>' + data);
            data.status = true;
            callback(data);
        }).error(function (data, status, headers, config) {
            //data.status=false;
            callback(data);
        });
    };

    return service;
});