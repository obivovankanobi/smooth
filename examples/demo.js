$(function() {
    $("#mode").text($.fn.smooth.settings.mode);
});

function setMode(mode) {
    $.fn.smooth.configure({
        mode: mode
    });
    $("#mode").text($.fn.smooth.settings.mode);
}

function reset() {
    $("#subject").css({
        "transition":""
    });

    $("#subject").css({
        transform: "",
        opacity: ""
    });
}

function skewAndFade() {
    $("#subject").smooth({
        opacity: 0.2,
        transform:"matrix(1, 0, -0.5, 1, 0, 0)"
    },{
        duration: 1000,
        easing: "swing"
    })
        .done(function() {
            return;
            $("#target").smooth({
                height: 300,
                opacity: 1
            });
        })
}

function skewThenFade() {
    $("#subject").smooth({
        transform:"matrix(1, 0, -0.5, 1, 0, 0)"
    })
        .done(function() {
            $("#subject").smooth({
                opacity: 0.2
            });
        })
}