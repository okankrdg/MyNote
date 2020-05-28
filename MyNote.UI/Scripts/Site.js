$(function () {
    //Globals
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    var apiUrl = 'https://localhost:44339/';
    //Funcitons
    function checkLogin() {
        var loginData = getloginData();
        if (!loginData || !loginData.access_token) {
            showLoginPage();
            return;
        }

        //Token geçerli mi?
        $.ajax({
            url: apiUrl + "api/Account/UserInfo",
            type:"Get",
            headers: { Authorization: "Bearer " + loginData.access_token },
            success: function (data) {
                console.log(data);
                showAppPage();
            },
            error: function () {
                showLoginPage();
            }
        })
       
    }
    function showAppPage() {
        $(".only-logged-in").show();
        $(".only-logged-out").hide();
        $(".page").hide();
        $("#page-app").show();
    }
    function showLoginPage() {
        $(".only-logged-in").hide();
        $(".only-logged-out").show();
        $(".page").hide();
        $("#page-login").show();
    }
    function getloginData() {
      
        var json = sessionStorage["login"] || localStorage["login"]
        if (json) {
            try {
                return JSON.parse(json);
            } catch (e) {
                return null;
            }
           
        }
        return null;
        
    }
    function success(message) {
        $(".tab-pane.active .message").removeClass("alert-danger").addClass("alert-success").text(message).show();
    }
    function error(modelState,loginerror) {
        if (modelState) {
            var errors = [];
            for (var prop in modelState) {
                for (var i = 0; i < modelState[prop].length; i++) {
                    errors.push(modelState[prop][i]);
                }
            }
        }
        var ul = $("<ul/>")
        for (var i = 0; i < errors.length; i++) {
            ul.append($("<li/>").text(errors[i]));
            $(".tab-pane.active .message").removeClass("alert-success").addClass("alert-danger").html(ul).show();
        }
    }
    function resetLoginForms() {
        $('.message').hide();
        $("#login form").each(function () {
            this.reset();
        })
    }
    function loginError(errorMessage) {
        $(".tab-pane.active .message").removeClass("alert-success").addClass("alert-danger").text(errorMessage).show();
    }
    $('#signupform').submit(function (event) {
        event.preventDefault();
        var formdata = $(this).serialize();
        $.post(apiUrl + "api/Account/Register", formdata, function (data) {
            resetLoginForms();
            success("created successfully");
        }).fail(function (xhr) {
            error(null,xhr.responseJSON.ModelState);
        })
    });
    $('#signinform').submit(function (event) {
        event.preventDefault();
        var formdata = $(this).serialize();
        $.post(apiUrl + "Token", formdata, function (data) {
            var datastr = JSON.stringify(data);
            if ($("#signinrememberme").prop("checked")) {
                sessionStorage.removeItem("login");
                localStorage["login"] = datastr;
            }
            else {
                localStorage.removeItem("login");
                sessionStorage["login"] = datastr;
            }
            resetLoginForms();
            success("You have been Token successfullly created. Now you are being redirected..");

            setTimeout(function () {
                resetLoginForms();
                showAppPage()
            },1000)
        }).fail(function (xhr) {
            loginError(xhr.responseJSON.error_description)
        })
    });
    $('#login a[data-toggle="pill"]').on('shown.hidden.bs.tab', function (e) {
        $('#login form').each(function () {
            this.reset();
        })
        resetLoginForms();
    });
    $('.navbar-login a').click(function (e) {
        e.preventDefault();
        var href = $(this).attr("href");
        $('#pills-tab a[href="' + href + '"]').tab('show')
    })
    $('#btnLogout').click(function (e) {
        e.preventDefault();
        sessionStorage.removeItem("login");
        localStorage.removeItem("login");
        showLoginPage();
    });
    //Commands
    checkLogin();
})
