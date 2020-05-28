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

        //is Token Valid?
        ajax("api/Account/UserInfo", "GET",
            function (data) {
                showAppPage();
            },
            function () {
                showLoginPage();
            }
        )
    }
    function showAppPage() {
        $(".only-logged-in").show();
        $(".only-logged-out").hide();
        $(".page").hide();
        ajax("api/Notes/List", "GET",
            function (data) {
                for (var i = 0; i < data.length; i++) {
                    var a = $('<a/>').addClass("list-group-item list-group-item-action show-note")
                        .attr("href", "#")
                        .text(data[i].Title)
                        .prop('note', data[i]);
                    $("#notes").append(a);
                }

                $("#page-app").show();
            },
            function () {
                
            }
        )
       
    }
    function showLoginPage() {
        $(".only-logged-in").hide();
        $(".only-logged-out").show();
        $(".page").hide();
        //retrieve notes
        $("#page-login").show();
    }
    function getAuthHeader() {
        return { Authorization: "Bearer " + getloginData().access_token };
    }
    function ajax(url,type, successFunc, errorFunc) {
        $.ajax({
            url: apiUrl + url,
            type: type,
            headers: getAuthHeader(),
            success: successFunc,
            error: errorFunc
        })
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
    $("body").on("click",".show-note", function (e) {
        e.preventDefault();
        var note = this.note;
        $('#noteContent').val(note.Content);
        $('#noteTitle').val(note.Title);
    })
    //Commands
    checkLogin();
})
