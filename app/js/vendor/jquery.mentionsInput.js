/*
 * Mentions Input
 * Version ???
 * Originally by: Kenneth Auchenberg (git @auchenberg)
 * Original version: 1.0.2
 * Edited by: Christophe Marois (git @christophemarois)
 *
 * Requires underscore.js
 *
 * License: MIT License - http://www.opensource.org/licenses/mit-license.php
 */

(function ($, _, undefined) {

  // Settings
  var KEY = { BACKSPACE : 8, TAB : 9, RETURN : 13, ESC : 27, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40, COMMA : 188, SPACE : 32, HOME : 36, END : 35 }; // Keys "enum"
  var defaultSettings = {
    triggerChar   : ' ',
    onDataRequest : $.noop,
    minChars      : 3,
    showAvatars   : true,
    elastic       : true,
    classes       : {
      autoCompleteItemActive : "active"
    },
    templates     : {
      wrapper                    : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<div class=\"mentions-input-box\"></div>';}return __p;},
      autocompleteList           : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<div class=\"mentions-autocomplete-list\"></div>';}return __p;},
      autocompleteListItem       : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<li data-ref-id=\"'+((__t=( id ))==null?'':__t)+'\" data-ref-type=\"'+((__t=( type ))==null?'':__t)+'\" data-display=\"'+((__t=( display ))==null?'':__t)+'\">'+((__t=( content ))==null?'':__t)+'</li>';}return __p;},
      autocompleteListItemAvatar : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<img src=\"'+((__t=( avatar ))==null?'':__t)+'\" />';}return __p;},
      autocompleteListItemIcon   : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<div class=\"icon '+((__t=( icon ))==null?'':__t)+'\"></div>';}return __p;},
      mentionsOverlay            : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<div class=\"mentions\"><div></div></div>';}return __p;},
      mentionItemSyntax          : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='['+((__t=( value ))==null?'':__t)+']('+((__t=( type ))==null?'':__t)+':'+((__t=( id ))==null?'':__t)+')';}return __p;},
      mentionItemHighlight       : function(obj){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};with(obj||{}){__p+='<strong><span>'+((__t=( value ))==null?'':__t)+'</span></strong>';}return __p;}
    }
  };

  var utils = {
    highlightTerm    : function (value, term) {
      if (!term && !term.length) {
        return value;
      }
      return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
    },
    setCaratPosition : function (domNode, caretPos) {
      if (domNode.createTextRange) {
        var range = domNode.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (domNode.selectionStart) {
          domNode.focus();
          domNode.setSelectionRange(caretPos, caretPos);
        } else {
          domNode.focus();
        }
      }
    },
    rtrim: function(string) {
      return string.replace(/\s+$/,"");
    }
  };

  var MentionsInput = function (settings) {

    // Initialize variables

    var domInput, $inputBox, $inputWrapper, $autocompleteList, $wrapperBox, $mentionsOverlay, $activeAutoCompleteItem;
    var mentionsCollection = [];
    var autocompleteItemCollection = {};
    var inputBuffer = [];
    var currentDataQuery;

    // Get settings

    settings = $.extend(true, {}, defaultSettings, settings );

    function initTextarea() {

      $inputBox = $(domInput);

      if ($inputBox.attr('data-mentions-input') == 'true')
        return;

      $inputWrapper = $inputBox.parent();
      $wrapperBox = $(settings.templates.wrapper());
      $inputBox.wrapAll($wrapperBox);
      $wrapperBox = $inputWrapper.find('> div');

      $inputBox.attr('data-mentions-input', 'true');
      $inputBox.bind('keydown', onInputBoxKeyDown);
      $inputBox.bind('keypress', onInputBoxKeyPress);
      $inputBox.bind('input', onInputBoxInput);
      $inputBox.bind('click', onInputBoxClick);
      $inputBox.bind('blur', onInputBoxBlur);

      // Elastic textareas, internal setting for the Dispora guys
      if( settings.elastic ) {
        $inputBox.autogrow();
      }

    }

    function initAutocomplete() {
      $autocompleteList = $(settings.templates.autocompleteList());
      $autocompleteList.appendTo($wrapperBox);
      $autocompleteList.delegate('li', 'mousedown', onAutoCompleteItemClick);
    }

    function initMentionsOverlay() {
      $mentionsOverlay = $(settings.templates.mentionsOverlay());
      $mentionsOverlay.prependTo($wrapperBox);
    }

    function updateValues() {
      var syntaxMessage = getInputBoxValue();

      _.each(mentionsCollection, function (mention) {

        // Default mention type to 'id'
        mention.type = mention.type || 'id';

        var textSyntax = settings.templates.mentionItemSyntax(mention);
        syntaxMessage = syntaxMessage.replace(mention.value, textSyntax);

      });

      var mentionText = _.escape(syntaxMessage);

      _.each(mentionsCollection, function (mention) {

        // Default mention type to 'id'
        mention.type = mention.type || 'id';

        var formattedMention = _.extend({}, mention, {value: _.escape(mention.value)});
        var textSyntax = settings.templates.mentionItemSyntax(formattedMention);
        var textHighlight = settings.templates.mentionItemHighlight(formattedMention);

        mentionText = mentionText.replace(textSyntax, textHighlight);

      });

      mentionText = mentionText.replace(/\n/g, '<br />');
      mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

      $inputBox.data('messageText', syntaxMessage);
      $mentionsOverlay.find('div').html(mentionText);
    }

    function resetBuffer() {
      inputBuffer = [];
    }

    function updateMentionsCollection() {
      var inputText = getInputBoxValue();

      mentionsCollection = _.reject(mentionsCollection, function (mention, index) {
        return !mention.value || inputText.indexOf(mention.value) == -1;
      });
      mentionsCollection = _.compact(mentionsCollection);
    }

    function addMention(mention) {

      var currentMessage = getInputBoxValue();

      // Using a regex to figure out positions
      var regex = new RegExp("\\" + settings.triggerChar + currentDataQuery, "gi");
      regex.exec(currentMessage);

      var startCaretPosition = regex.lastIndex - currentDataQuery.length - 1;
      var currentCaretPosition = regex.lastIndex;

      var start = currentMessage.substr(0, startCaretPosition);
      var end = currentMessage.substr(currentCaretPosition, currentMessage.length);
      var startEndIndex = (start + mention.value).length + 1;

      mentionsCollection.push(mention);

      // Cleaning before inserting the value, otherwise auto-complete would be triggered with "old" inputbuffer
      resetBuffer();
      currentDataQuery = '';
      hideAutoComplete();

      // Mentions & syntax message
      var updatedMessageText = start + ' ' + mention.value + end;
      $inputBox.val(updatedMessageText);
      updateValues();

      // Set correct focus and selection
      $inputBox.focus();
      utils.setCaratPosition($inputBox[0], startEndIndex);
    }

    function getInputBoxValue() {
      return $.trim($inputBox.val());
    }

    function onAutoCompleteItemClick(e) {
      var elmTarget = $(this);
      var mention = autocompleteItemCollection[elmTarget.attr('data-uid')];

      addMention(mention);

      return false;
    }

    function onInputBoxClick(e) {
      resetBuffer();
    }

    function onInputBoxBlur(e) {
      hideAutoComplete();
    }

    function onInputBoxInput(e) {
      updateValues();
      updateMentionsCollection();

      var triggerCharIndex = _.lastIndexOf(inputBuffer, settings.triggerChar);
      if (triggerCharIndex > -1) {
        currentDataQuery = inputBuffer.slice(triggerCharIndex + 1).join('');
        currentDataQuery = utils.rtrim(currentDataQuery);

        _.defer(_.bind(doSearch, this, currentDataQuery));
      }
    }

    function onInputBoxKeyPress(e) {
      if(e.keyCode !== KEY.BACKSPACE) {
        var typedValue = String.fromCharCode(e.which || e.keyCode);
        inputBuffer.push(typedValue);
      }
    }

    function onInputBoxKeyDown(e) {

      // This also matches HOME/END on OSX which is CMD+LEFT, CMD+RIGHT
      if (e.keyCode == KEY.LEFT || e.keyCode == KEY.RIGHT || e.keyCode == KEY.HOME || e.keyCode == KEY.END) {
        // Defer execution to ensure carat pos has changed after HOME/END keys
        _.defer(resetBuffer);

        // IE9 doesn't fire the oninput event when backspace or delete is pressed. This causes the highlighting
        // to stay on the screen whenever backspace is pressed after a highlighed word. This is simply a hack
        // to force updateValues() to fire when backspace/delete is pressed in IE9.
        if (navigator.userAgent.indexOf("MSIE 9") > -1) {
          _.defer(updateValues);
        }

        return;
      }

      if (e.keyCode == KEY.BACKSPACE) {
        inputBuffer = inputBuffer.slice(0, -1 + inputBuffer.length); // Can't use splice, not available in IE
        return;
      }

      if (!$autocompleteList.is(':visible')) {
        return true;
      }

      switch (e.keyCode) {
        case KEY.UP:
        case KEY.DOWN:
          var elmCurrentAutoCompleteItem = null;
          if (e.keyCode == KEY.DOWN) {
            if ($activeAutoCompleteItem && $activeAutoCompleteItem.length) {
              elmCurrentAutoCompleteItem = $activeAutoCompleteItem.next();
            } else {
              elmCurrentAutoCompleteItem = $autocompleteList.find('li').first();
            }
          } else {
            elmCurrentAutoCompleteItem = $($activeAutoCompleteItem).prev();
          }

          if (elmCurrentAutoCompleteItem.length) {
            selectAutoCompleteItem(elmCurrentAutoCompleteItem);
          }

          return false;

        case KEY.RETURN:
        case KEY.TAB:
          if ($activeAutoCompleteItem && $activeAutoCompleteItem.length) {
            $activeAutoCompleteItem.trigger('mousedown');
            return false;
          }

          break;
      }

      return true;
    }

    function hideAutoComplete() {
      $activeAutoCompleteItem = null;
      $autocompleteList.empty().hide();
    }

    function selectAutoCompleteItem(elmItem) {
      elmItem.addClass(settings.classes.autoCompleteItemActive);
      elmItem.siblings().removeClass(settings.classes.autoCompleteItemActive);

      $activeAutoCompleteItem = elmItem;
    }

    function populateDropdown(query, results) {
      $autocompleteList.show();

      // Filter items that has already been mentioned
      var mentionValues = _.pluck(mentionsCollection, 'value');
      results = _.reject(results, function (item) {
        return _.include(mentionValues, item.name);
      });

      if (!results.length) {
        hideAutoComplete();
        return;
      }

      $autocompleteList.empty();
      var elmDropDownList = $("<ul>").appendTo($autocompleteList).hide();

      _.each(results, function (item, index) {
        var itemUid = _.uniqueId('mention_');

        autocompleteItemCollection[itemUid] = _.extend({}, item, {value: item.name});

        var elmListItem = $(settings.templates.autocompleteListItem({
          'id'      : _.escape(item.id),
          'display' : _.escape(item.name),
          'type'    : _.escape(item.type),
          'content' : utils.highlightTerm(_.escape((item.name)), query)
        })).attr('data-uid', itemUid);

        if (index === 0) {
          selectAutoCompleteItem(elmListItem);
        }

        if (settings.showAvatars) {
          var elmIcon;

          if (item.avatar) {
            elmIcon = $(settings.templates.autocompleteListItemAvatar({ avatar : item.avatar }));
          } else {
            elmIcon = $(settings.templates.autocompleteListItemIcon({ icon : item.icon }));
          }
          elmIcon.prependTo(elmListItem);
        }
        elmListItem = elmListItem.appendTo(elmDropDownList);
      });

      $autocompleteList.show();
      elmDropDownList.show();
    }

    function doSearch(query) {
      if (query && query.length && query.length >= settings.minChars) {
        settings.onDataRequest.call(this, 'search', query, function (responseData) {
          populateDropdown(query, responseData);
        });
      } else {
        hideAutoComplete();
      }
    }

    function resetInput() {
      $inputBox.val('');
      mentionsCollection = [];
      updateValues();
    }

    // Public methods
    return {
      init : function (domTarget) {

        domInput = domTarget;

        initTextarea();
        initAutocomplete();
        initMentionsOverlay();
        resetInput();

        if( settings.prefillMention ) {
          addMention( settings.prefillMention );
        }

      },

      val : function (callback) {
        if (!_.isFunction(callback)) {
          return;
        }

        var value = mentionsCollection.length ? $inputBox.data('messageText') : getInputBoxValue();
        callback.call(this, value);
      },

      reset : function () {
        resetInput();
      },

      getMentions : function (callback) {
        if (!_.isFunction(callback)) {
          return;
        }

        callback.call(this, mentionsCollection);
      }
    };
  };

  $.fn.mentionsInput = function (method, settings) {

    // Store arguments to use them inside the each loop
    var outerArguments = arguments;

    // If first argument is an object, it's in fact
    // the 'settings' argument. Shift it left.
    if (typeof method === 'object' || !method)
      settings = method;

    this.filter('textarea').each(function () {

      // If mentionsInput hasn't been initialized on the current
      // element, instanciate it in the 'mentionsInput' DOM data
      var instance = $.data(this, 'mentionsInput') ||
        $.data(this, 'mentionsInput', new MentionsInput(settings));

      if (_.isFunction(instance[method])) {
        // If 'method' is a function, call it with every argument
        // following it as the function arguments
        return instance[method].apply(this, Array.prototype.slice.call(outerArguments, 1));

      } else if (typeof method === 'object' || !method) {
        // If method is in fact the 'settings' argument, call the
        // 'init' function, as settings has already been passed to it.
        return instance.init.call(this, this);

      } else {
        // If first argument is nor a function, nor an object,
        // throw an error.
        $.error('Method ' + method + ' does not exist');
      }

    });

    return this;

  };

})(jQuery, _);