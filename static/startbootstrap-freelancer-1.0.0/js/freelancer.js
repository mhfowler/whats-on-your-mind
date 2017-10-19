/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


$( document ).ready(function() {

     // csrf protect
    /* csrf protection */
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $(".include-checkbox").click(function(e) {
        var name = $(this).val();
        var chapterLink = $(".chapter-link[href^='#" + name + "']");
        var howMany = parseInt($(".how-many").html());
        var obfuscationWrapper = $(".obfuscation-wrapper[data-name='" + name + "']");
        if ($(this).is(":checked")) {
            howMany += 1;
            chapterLink.addClass("selected");
            obfuscationWrapper.show();
        }
        else {
            howMany -= 1;
            chapterLink.removeClass("selected");
            obfuscationWrapper.hide();
        }
        $(".how-many").html(howMany);
    });

    $(".initial-publish-btn").click(function(e) {
        e.preventDefault();
        var initialPublishButton = $(this);
        initialPublishButton.hide();
        var confirmPublishButton = $(".confirm-publish-btn");
        confirmPublishButton.show();
        $(".really-publish").show();
        $(".instructions-text").hide();
    });

    $(".confirm-publish-btn").click(function(e) {
        e.preventDefault();
        var checkedValues = $('.include-checkbox:checked').map(function() {
            return this.value;
        }).get();
        var obfuscationMap = {};
        $.each(checkedValues, function(i,name) {
            var obfuscationInput = $(".obfuscation-input[data-name='" + name + "']");
            var new_name = obfuscationInput.val();
            obfuscationMap[name] = new_name;
        });
        var jsonValues = JSON.stringify(obfuscationMap);
        var origUsername = $("input.orig-username").val();
        var aliasUsername = $("input.alias-username").val();
        $.post("/publish_texts/", {
            include: jsonValues,
            current_url: window.location.pathname,
            orig_username: origUsername,
            alias_username: aliasUsername
        },function(data) {
            alert("success");
        });

    })

});