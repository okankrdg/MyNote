$(function () {
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    var apiUrl = 'https://localhost:44339/';

    function isLoggedIn() {
        //todo: sessionstorage ve localstorage den bilgiler çekilecek
        //login ise uygulmayı aç
        //login değilse login/register sayfasını göster
    }
    function loginData() {
        //todo: sessionstorage ve localstorage den bilgiler çekilecek
        //login ise uygulmayı aç
        //login değilse login/register sayfasını göster
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
    $('.navbar-login a').click(function () {
        var href = $(this).attr("href");
        $('#pills-tab a[href="' + href + '"]').tab('show')
    })
})
