/**
 * Turns a list of images into an animation by showing the images in sequence
 * (like a GIF)
 * Ted Olsen 2013
 *
 * Include _animateFrames.scss
 *
 * Sample html:
     <ul class="animate">
         <li>1</li>
         <li>2</li>
         <li>3</li>
         <li>4</li>
     </ul>
 *
 * Sample js:
     $('ul.my_animation').animateFrames();
     $('ul.my_animation').animateFrames('animate', {delay: [1000, 300, 300, 300]});
 *
 *
 * Settings: defaults
 * min_delay: 100
 * Do not allow a delay smaller than this
 *
 * standard_delay: 300
 * Default delay for frames with none specified
 *
 * delay: []
 * Array of delays for each frame
 *
 * animate_mode: detect
 * Choose css style to apply when animating.
 * "modern" uses opacity to hide/show frames, which is compatible with css transitions and easing.
 * "legacy" mode uses display: block/none, and can't use transitions.
 * Custom modes are possible by setting this value to any string and making a CSS class "animate-<mode string>"
 *
 */
jQuery.fn.animateFrames = function(method, a_settings) {
    var default_method = 'animate',
        default_settings = {
            min_delay: 100,
            standard_delay: 300,
            delay: [],
            animate_mode: 'detect'
        },
        settings = false,
        $ul = this,
        $start_frame,
        $current_index = 0;

    var methods = {
        usage: function () {
            // count slides, make sure <ul> is ready to animate
        },
        animate: function () {
            methods.usage();

            // Mark first frame for reset
            if(typeof $start_frame == 'undefined' || $start_frame[0].tagName != 'LI') {
                $start_frame = $($ul.find('li')[0]);
                $start_frame.addClass('start-frame');
            }

            if(settings.animate_mode == "detect") {
                settings.animate_mode = methods.detectAnimateMode();
            }
            $ul.addClass('animate-' + settings.animate_mode);

            methods.activateSlide(0);
            methods.updateDelays();
            methods.updateTimeout();
            $ul.trigger('start');
        },
        detectAnimateMode: function () {
            // Simple opacity detection
            $test = $('<div/>');
            $test.css('opacity', 0.5);
            return (0.5 == $test[0].style.opacity) ? 'modern' : 'legacy';
        },
        updateTimeout: function () {
            var the_delay =  Math.max($active_slide.data('delay'), settings.min_delay);
            methods.clearTimeout();
            $ul.data('timeout', window.setTimeout(methods.tick, the_delay));
        },
        clearTimeout: function () {
            clearTimeout($ul.data('timeout'));
        },
        tick: function () {
            if(typeof $ul.data('paused') == "undefined" || !$ul.data('paused')) {
                methods.rotateImage();
            }
            methods.updateTimeout();
        },
        updateDelays: function () {
            $slides = $ul.find('> li');

            if(settings.delay.length > 0) {
                if(settings.delay.length != $slides.length) {
                    throw new AnimateUsageException('Delays specified, but number of delays (' + settings.delay.length + ') ' +
                        'does not match number of images (' + $slides.length + ')');
                }
            }

            $.each($slides, function(index, ele) {
                if(typeof settings.delay[index] != "undefined")
                    $(ele).data('delay', settings.delay[index]);
                else if(typeof $(ele).data('delay') != "undefined")
                    $(ele).data('delay', settings.delay[index]);
                else
                    $(ele).data('delay', settings.standard_delay);
            });
        },
        // Move slide from front to end of queue
        rotateImage: function () {
            if(++$current_index >= $slides.length)
                $current_index = 0;

            return methods.activateSlide($current_index);
        },
        activateSlide: function (index) {
            $slides.removeClass('active-slide');
            $active_slide = $($slides[index]);
            $active_slide.addClass('active-slide');
            return $active_slide;
        },
        pause: function () {
            $ul.data('paused', 1);
        },
        unpause: function () {
            $ul.data('paused', 0);
        },
        stop: function () {
            methods.clearTimeout();
            $ul.trigger('stop');
        },
        reset: function () {
            methods.activateSlide($active_slide.index());
        }
    };

    // Refresh data stored on elements
    var $slides = $ul.find('> li'),
        $active_slide = $($slides[0]);

    // Parameter method is optional, if first arg is object treat as settings
    if(typeof method == 'object') {
        settings = method;
        method = default_method;
    }
    if(typeof method == "undefined") {
        method = default_method;
    }

    // Get settings, default, plus element settings, plus arguments
    settings = $.extend(default_settings, $ul.data('animate-settings'));
    settings = $.extend(settings, a_settings);

    // Execute method
    if(methods.hasOwnProperty(method)) {
        methods[method]();
    }
    else {
        throw new AnimateUsageException('Method ' + method + ' unknown.')
    }

    if($ul[0].tagName != 'UL') {
        throw new AnimateUsageException('Usable only on <ul> lists of images');
    }

    $ul.data('animate-settings', settings);
    $ul.removeClass('animate');
    $ul.addClass('animate-done');
};
function AnimateUsageException (msg) {
    this.value = -1;
    this.message = 'jquery.animateFrames usage error';
    if("" + msg != "")
        this.message += ": " + msg;

    this.toString = function() {
        return this.message
    };
}

$(document).on('ready', function() {
   $.each($('ul.animate'), function() {
       $(this).animateFrames();
   });
});