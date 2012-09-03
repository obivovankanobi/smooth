(function( $ ) {
    var Smooth = $.fn.smooth = function(styleMap, settingsArgument) {
        var self = this
            , promise = $.Deferred()
            , settings = $.extend(true, {}, {
                duration: 500,
                easing: "linear"
            }, settingsArgument);

        if (Smooth.settings.mode == Smooth.MODE_JQUERY) {
            $.extend(true, settings, {
                complete: function() {
                    promise.resolve();
                }
            });
            $.fn.animate.apply(this, [styleMap, settings]);
        } else {
            //fixing easing CSS3-jQuery difference
            if ("swing" == settings.easing) {
                settings.easing = "ease";
            }

            var property = ""
                , transitionMap = {};

            for (var i in styleMap) {
                if (property) {
                    property += ",";
                }
                property += i;
            }

            //todo: cut prefixes depend on browser
            for (var i=0; i < Smooth.TRANSITION_PREFIXES.length; i++) {
                var prefix = Smooth.TRANSITION_PREFIXES[i];
                transitionMap[prefix + "transition-property"] = property;
                transitionMap[prefix + "transition-duration"] = (settings.duration / 1000) + " s";
                transitionMap[prefix + "transition-timing-function"] = settings.easing;
            }

            this.css(transitionMap);
            this.css(styleMap);

            setTimeout(function() {
                promise.resolve();
            }, settings.duration);

            //todo: clear styles
            //todo: release  complete function
        }

        promise.done(function() {
            if (settingsArgument && settingsArgument.complete && settingsArgument.complete instanceof Function) {
                settingsArgument.complete.apply(self, []);
            }
        });
        
        return promise;
    };
    $.extend(Smooth, {
        MODE_JQUERY: "jquery",
        MODE_CSS: "css",

        TRANSITION_PREFIXES: ["", "-o-", "-moz-", "-webkit-"],
        settings:{
            mode: "css"
        },

        configure: function(settings) {
            $.extend(true, this.settings, settings);
        },

        init: function() {
            this.configure({
                mode: ($.browser.ie) ? this.MODE_JQUERY : this.MODE_CSS
            });
        }
    });
    Smooth.configure();
})( jQuery );