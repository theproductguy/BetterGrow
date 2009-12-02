/******************************************************************************************************

	jQuery.BetterGrow

	Author Jeremy Horn
	Version 1.0
	Date: 1/2/2011

	Copyright (c) 2009 Jeremy Horn- jeremydhorn(at)gmail(dot)c0m | http://tpgblog.com
	Dual licensed under MIT and GPL.

	DESCRIPTION
		Many things grow, but few grow better when they BetterGrow.
		 
		BetterGrow is a customizable jQuery plugin for enabling the improved, dynamic expansion of a 
		textarea.  
		
		When the text within the target textarea exceeds the initial textarea height
		the textarea increases its height sufficiently to accommodate the new text.
		
		When the text within the target textarea decreases sufficient to allow for a lesser 
		height, and the height is greater than the minimum textarea height or initial textarea 
		height, then the textarea height is reduced to the minimum height required to display the 
		text within while not obscuring the visibility or requiring a scrollbar to view any of 
		the text.

		BetterGrow supports pre-existing text within the textarea.

		BY DEFAULT
		 - initial textarea height is set to 26px (aka minimum textarea height)
		 - no event handling enabled
	
	IMPLEMENTATION

		$('.textareas').BetterGrow();
		$('#textarea7, #textarea8').BetterGrow({ / * OPTIONS * / });

		note: textarea MUST reside within an encapsulating / wrapping DIV to work
		
	COMPATIBILITY

		Tested in FF3.5, IE7
		With jQuery 1.4

		** Width of textarea must be EXPLICITLY set to function normally in IE **

	METHOD(S)
		When initialized the textarea object and its parent DIV have their attributes adjusted.
			
			The DIV should add no size to the textarea object or region.  DIV height is 
			automatically set to AUTO.
		
			The textarea's overflow is set to HIDDEN and the WIDTH is set to the current
			WIDTH. (i.e. WIDTH of textarea must be defined to work in IE)
			
		If the DIV is missing, the plugin will attempt to wrap the textarea in a new DIV.  It
		is recommended that all targeted textareas are wrapped in a DIV before calling BetterGrow
		to avoid unexpected behavior.
		
		If the textarea already has text within it when BetterGrow is initialized the textarea's
		height is automatically adjusted to fit the text (if a height greater than the initial 
		height is needed to present the text unobscured).
		
	CUSTOMIZATION

		BetterGrow(<OPTIONS>)
		e.g. $('.ta1').BetterGrow({initial_height:100px});

		initial_height:		minimum height in pixels for the textarea
		
							if the textarea is EMPTY, this is the initial height
		
		on_enter:			callback function to call when ENTER is pressed within
							the target textarea(s)
		
		do_not_enter:		if true, and on_enter is NOT NULL, 
								then 	the ENTER event DOES NOT CASCADE / pass-through
										to the text area
							if false, and on_enter is NOT NULL,
								then	the ENTER event will trigger the calling of 
										on_enter() and be reflected within the textarea
										(i.e. the textarea displays the submitted ENTER(S))

		EXAMPLE	OPTIONS = 
			{
				initial_height: 50px,
				on_enter:		function() {
									submit_form();
								},
				do_not_enter:	false
			};

	MORE

		For more details about BetterGrow, its implementation, usage, and examples, go to:
		http://tpgblog.com/bettergrow/

******************************************************************************************************/

(function($) {

	/**********************************************************************************

		FUNCTION
			BetterGrow

		DESCRIPTION
			BetterGrow method constructor
			
			allows for customization of initial_height (minimum height) and ENTER event
			behavior
			
				e.g. $(something).BetterGrow();

	**********************************************************************************/
	$.fn.BetterGrow = function(options) {
		var curr_this;
		var c_settings;

		// check for new & valid options
		if ((typeof options == 'object') || (options == undefined)) {
			// then update the settings [destructive]
			c_settings = $.extend({}, $.fn.BetterGrow.settings, options);
			
			// process all provided objects
			return this.each(function() {
			    var $this = $(this);

				// wonder if people would prefer this or a setting that would conditionally wrap the div 
				//
				// perform basic check for required DIV wrapper
				if ($this.parent('div').length == 0) {
					$this.wrap('<div style="border:0; padding:0; margin:0"></div>');
				}
 
				// reset textfield content
				// reset heights (these calls, right here, may be unnecessary -- brainstorm use cases
				set_height($this, c_settings.initial_height);

				// enable or update exapandability limits
				make_better($this, c_settings);
				
				// if textarea has overflowing text in it already, be sure to adjust height ASAP
				$this.keydown();
			});
		}
		
		return this;
	};


	/**********************************************************************************

		FUNCTION
			BetterGrow.settings

		DESCRIPTION
			publically accessible data stucture containing the initial_height and 
			event handling specifications for BetterGrow
			
			can be directly accessed by	'$.fn.BetterGrow.settings = ... ;'

	**********************************************************************************/
	$.fn.BetterGrow.settings = {
		initial_height: 26,		// specified in pixels
		on_enter:		null, 	// callback function; if specified, this is called when enter is pressed
		do_not_enter:	true 	// if true and on_enter is not null then enter event does not cascade / pass-through to textarea
		// no_div: true  // if true, NEVER wrap the content in a div, but if div not present do nothing; if false, ALWAYS wrap in  div -- maybe future RELEASE -- let's see feedback
	};


	//////////////////////////////////////////////////////////////////////////////////

	// private functions and settings

	/**********************************************************************************

		FUNCTION
			set_height
	
		DESCRIPTION
			sets the height of the passed in object
	
		PRE
			the_object exists
			min_height contains valid value
	
		POST
			the_object's height is set to new height
	
	**********************************************************************************/
	function set_height(the_object, min_height) {
		the_object.height(min_height);
	}


	/**********************************************************************************

		FUNCTION
			make_better
	
		DESCRIPTION
			assigns the key events to the textarea object
	
			both keyup and keydown are required to catch 'edge' cases [e.g. pressing 'ENTER']
	
		PRE
			the_object exists
			the_object is a textarea (NOT REQUIRED -- just needs to support the 'height' characteristic)
			min_height >= 0
			
		POST
			keyup and keydown events are assigned to the_object
	
	**********************************************************************************/
	function make_better(the_object, settings) {
		var min_height = settings.initial_height;

		// initialize parent DIV
		the_object.parent().css('height','auto');
		
		// hide the scrollbars while growing [hide the ugly]
		the_object.css('overflow','hidden');

		// cleanup bound events
		the_object.unbind('keydown');
		the_object.unbind('keyup');
		
		// bind key events
		the_object.keydown( function(e) { 
			textarea_grow_some(the_object, min_height);
	
			if (e.keyCode == 13 /* ENTER */) {

				// if on_enter EXISTS and enter pressed, override default behavior
				if (settings.on_enter != null) {
					settings.on_enter();
					
					if (settings.do_not_enter) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				}
			}
		});
		
		the_object.keyup  ( function() { 
			textarea_grow_some(the_object, min_height) 
		} );  /* important for catching ENTER */
	}

	/**********************************************************************************

		FUNCTION
			textarea_grow_some
	
		DESCRIPTION
			on first run
				determine how to measure the height of the textarea [browser specific]
			
			determine whether or not the content of the text area is 
				<= min_heigh, 
					THEN set to min_height
	
				grown larger than current height, 
					THEN readjust height to the container's scrollheight
	
		PRE
			obj (textarea) exists
			obj (textarea) has initial minimum height set
	
		POST
			height of obj is no smaller than min_height 
			and is just large enough to contain all of the content within without
			any associated textarea scrollbars
	
	**********************************************************************************/
	function textarea_grow_some(obj, min_height){
		var curr_height;
		var curr_scroll_height;
		
		// do the math
		if (!textarea_grow_some.browser_calc){
			//browser.whoami
			textarea_grow_some.browser_calc = $.browser.msie || $.browser.safari;

			//does padding matter?
			textarea_grow_some.padding_calc = textarea_grow_some.browser_calc ?
				(	parseInt(obj.css('padding-top')) +
					parseInt(obj.css('padding-bottom'))		) : 0;
		}
	 
		curr_height = obj.height();
	 
		if (curr_height > min_height) {
			obj.parent().css('height', obj.height() + 'px' );
	 
			//set the height to zero to get the real content height
			obj.height(0);
		}
	 
		curr_scroll_height = obj.get(0).scrollHeight - textarea_grow_some.padding_calc;
	
		// apply the math
		if (curr_scroll_height > min_height) {
			obj.height(curr_scroll_height);
		} else if (curr_height > min_height) {
			obj.height(min_height);
		}
	 
	 	// restore initial height setting on parent DIV
		obj.parent().css('height', 'auto');
	}

})(jQuery);
