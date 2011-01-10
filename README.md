# BetterGrow: a jQuery plugin

## Description

Many things grow, but few grow better when they BetterGrow.
		 
BetterGrow is a customizable jQuery plugin for enabling the improved, dynamic expansion of a textarea.  

When the text within the target textarea exceeds the initial textarea height the textarea increases its height sufficiently to accommodate the new text.

When the text within the target textarea decreases sufficient to allow for a lesser height, and the height is greater than the minimum textarea height or initial textarea height, then the textarea height is reduced to the minimum height required to display the text within while not obscuring the visibility or requiring a scrollbar to view any of the text.  BetterGrow supports pre-existing text within the textarea.

## Defaults
- initial textarea height is set to 26px (aka minimum textarea height)
- no event handling enabled
	
## Implementation

    $('.textareas').BetterGrow();
    $('#textarea7, #textarea8').BetterGrow({ / * OPTIONS * / });

note: textarea MUST reside within an encapsulating / wrapping DIV to work

## Compatibility

- Tested in FF3.5, IE7
- With jQuery 1.4
- ** Width of textarea must be EXPLICITLY set to function normally in IE **

## Method(s)
When initialized the textarea object and its parent DIV have their attributes adjusted.

The DIV should add no size to the textarea object or region.  DIV height is automatically set to AUTO.

The textarea's overflow is set to HIDDEN and the WIDTH is set to the current WIDTH. (i.e. WIDTH of textarea must be defined to work in IE)

If the DIV is missing, the plugin will attempt to wrap the textarea in a new DIV.  It is recommended that all targeted textareas are wrapped in a DIV before calling BetterGrow to avoid unexpected behavior.

If the textarea already has text within it when BetterGrow is initialized the textarea's height is automatically adjusted to fit the text (if a height greater than the initial height is needed to present the text unobscured).

## Customization

BetterGrow(<OPTIONS>), i.e.

    $('.ta1').BetterGrow({initial_height:100px});

- initial_height: minimum height in pixels for the textarea, if the textarea is EMPTY, this is the initial height
- max_height: the maximum height, in pixels, that the textarea will grow, afterwhich it becomes overflow:auto;
- on_enter: callback function to call when ENTER is pressed within the target textarea(s)
- do_not_enter: if true, and on_enter is NOT NULL, then the ENTER event DOES NOT CASCADE / pass-through to the text area.  if false, and on_enter is NOT NULL, then the ENTER event will trigger the calling of on_enter() and be reflected within the textarea (i.e. the textarea displays the submitted ENTER(S))

### EXAMPLE
    OPTIONS = 
      {
        initial_height: 50px,
        on_enter: function() { submit_form(); },
        do_not_enter: false
      };

## Get the skinny

For more details about BetterGrow, its implementation, usage, and examples, go to the [BetterGrow](http://tpgblog.com/BetterGrow/) site.

## Contributors

[Jeremy Horn](http://tpgblog.com): original author
[Steven Harman](http://stevenharman.net): max_height option

## Other

dual licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php) and [GPL License](http://opensource.org/licenses/gpl-3.0.html)

Copyright (c) 2009 Jeremy Horn- jeremydhorn(at)gmail(dot)c0m

