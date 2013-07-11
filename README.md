animateFrames
=============

Turns a list of images into an animation by showing the images in sequence
(like a GIF)

Include _animateFrames.scss

Sample html:
------------

    <ul class="animate">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>


Sample js:
----------

     $('ul.my_animation').animateFrames();
     $('ul.my_animation').animateFrames('animate', {delay: [1000, 300, 300, 300]});
     
Settings: defaults
------------------
####min_delay####
default: `100`

Do not allow a delay smaller than this

####standard_delay####
default:`300`

Default delay for frames with none specified

####delay####
default: `[]`

Array of delays for each frame

####animate_mode####
default: `detect`

Choose css style to apply when animating.<br/>
`modern` uses opacity to hide/show frames, which is compatible with css transitions and easing.<br/>
`legacy` mode uses `display: block`/`none`, and can't use transitions.<br/>
Custom modes are possible by setting this value to any string and making a CSS class `animate-<mode string>`




Ted Olsen 2013
