/**
 * Smooth.js v0.1 
 * small js library for CSS3 transitions with fallback to $.animate in case of IE
 * http://github.com/alevkon/smooth/
 *
 * Copyright 2011, Alexey Konyshev alevkon@gmail.com
 * MIT license
 */
(function( $ ) {
    var Smooth = $.fn.smooth = function(styleMapArgument, settingsArgument) {
        var self = this
            , styleMap = {}
            , promise = $.Deferred()
            , settings = $.extend(true, {}, {
                duration: 500,
                easing: "linear"
            }, settingsArgument);

        for (var i in styleMapArgument) {
            styleMap[i] = styleMapArgument[i];
        }

        if (Smooth.settings.mode == Smooth.MODE_JQUERY) {
            $.extend(true, settings, {
                complete: function() {
                    promise.resolve();
                }
            });

            if (styleMap.transform) {
                var transformMap = {};
                for (var i=0; i < Smooth.TRANSITION_PREFIXES.length; i++) {
                    var prefix = Smooth.TRANSITION_PREFIXES[i];
                    transformMap[prefix + "transform"] = styleMap.transform;
                }
                this.css(transformMap);
            }

            this.animate(styleMap, settings);
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

            if (styleMap.transform) {
                for (var i=0; i < Smooth.TRANSITION_PREFIXES.length; i++) {
                    var prefix = Smooth.TRANSITION_PREFIXES[i];
                    styleMap[prefix + "transform"] = styleMap.transform;
                }
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

        TRANSITION_PREFIXES: ["", "-o-", "-moz-", "-webkit-", "-ms-"],
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