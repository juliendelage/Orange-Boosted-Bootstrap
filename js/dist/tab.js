var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tab = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'tab';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.tab';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;
  // boosted mod
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key
  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
  var RANDOM_NUMBER = 1000;
  // end mod

  var Event = {
    HIDE: 'hide' + EVENT_KEY,
    HIDDEN: 'hidden' + EVENT_KEY,
    SHOW: 'show' + EVENT_KEY,
    SHOWN: 'shown' + EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
  };

  var ClassName = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };

  var Selector = {
    A: 'a',
    LI: 'li',
    DROPDOWN: '.dropdown',
    LIST: 'ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)',
    FADE_CHILD: '> .nav-item .fade, > .fade',
    ACTIVE: '.active',
    ACTIVE_CHILD: '> .nav-item > .active, > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab = function () {
    function Tab(element) {
      _classCallCheck(this, Tab);

      this._element = element;
    }

    // getters

    // public

    Tab.prototype.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName.ACTIVE) || $(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var target = void 0;
      var previous = void 0;
      var listElement = $(this._element).closest(Selector.LIST)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        previous = $.makeArray($(listElement).find(Selector.ACTIVE));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      });

      var showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: _this._element
        });

        var shownEvent = $.Event(Event.SHOWN, {
          relatedTarget: previous
        });

        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    Tab.prototype.dispose = function dispose() {
      $.removeClass(this._element, DATA_KEY);
      this._element = null;
    };
    // Boosted mod


    Tab._keydown = function _keydown(e) {
      var $this = $(this);
      var Items = $this.closest('ul[role=tablist] ').find('[role=tab]:visible');
      var index = void 0;
      var k = e.which || e.keyCode;
      $this = $(this);
      if (!/(ARROW_LEFT_KEYCODE|ARROW_UP_KEYCODE|ARROW_RIGHT_KEYCODE|ARROW_DOWN_KEYCODE)/.test(k)) {
        return;
      }
      index = Items.index(Items.filter(':focus'));

      if (k === ARROW_UP_KEYCODE || k === ARROW_LEFT_KEYCODE) {
        index--;
      } // up & left
      if (k === ARROW_RIGHT_KEYCODE || k === ARROW_DOWN_KEYCODE) {
        index++;
      } // down & right

      if (index < 0) {
        index = Items.length - 1;
      }
      if (index === Items.length) {
        index = 0;
      }
      var nextTab = Items.eq(index);
      if (nextTab.attr('role') === 'tab') {
        nextTab.tab('show').trigger('focus');
      }

      e.preventDefault();
      e.stopPropagation();
    };
    // end mod
    // private

    Tab.prototype._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var active = $(container).find(Selector.ACTIVE_CHILD)[0];
      var isTransitioning = callback && Util.supportsTransitionEnd() && (active && $(active).hasClass(ClassName.FADE) || Boolean($(container).find(Selector.FADE_CHILD)[0]));

      var complete = function complete() {
        return _this2._transitionComplete(element, active, isTransitioning, callback);
      };

      // Boosted mod
      $(container).find('.nav-link').attr({
        tabIndex: '-1',
        'aria-selected': false
      });
      $(container).find('.tab-pane').attr({
        'aria-hidden': true,
        tabIndex: '-1'
      });
      // end mod

      if (active && isTransitioning) {
        $(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      if (active) {
        $(active).removeClass(ClassName.SHOW);
      }
    };

    Tab.prototype._transitionComplete = function _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE);

        var dropdownChild = $(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE);
        }

        active.setAttribute('aria-expanded', false);
      }

      $(element).addClass(ClassName.ACTIVE);
      element.setAttribute('aria-expanded', true);
      // Boosted mod
      $(element).filter('.nav-link.active').attr({
        tabIndex: '0',
        'aria-selected': true
      });
      $(element).filter('.tab-pane.active').attr({
        'aria-hidden': false,
        tabIndex: '0'
      });
      // end mod

      if (isTransitioning) {
        Util.reflow(element);
        $(element).addClass(ClassName.SHOW);
      } else {
        $(element).removeClass(ClassName.FADE);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

        var dropdownElement = $(element).closest(Selector.DROPDOWN)[0];
        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    };

    // static

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }]);

    return Tab;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();
    Tab._jQueryInterface.call($(this), 'show');
  });

  // Boosted mod
  $(document).on('keydown.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (event) {
    if (!/(ARROW_UP_KEYCODE|ARROW_DOWN_KEYCODE|ARROW_RIGHT_KEYCODE|ARROW_LEFT_KEYCODE)/.test(event.which)) {
      return;
    }
    event.preventDefault();
    Tab._keydown.call($(this), event);
  });
  // end mod
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  // Boosted mod
  // ajout de l'accesibilité
  // ===============================

  function uniqueId(prefix) {
    return (prefix || 'ui-id') + '-' + Math.floor(Math.random() * RANDOM_NUMBER + 1);
  }

  var $tablists = $('.nav-tabs, .nav-pills');
  var $tabs = $tablists.find('[data-toggle="tab"], [data-toggle="pill"]');

  $tabs.each(function () {
    var tabpanel = $($(this).attr('href'));
    var $tab = $(this);
    var $tablist = $tab.closest('.nav-tabs, .nav-pills');
    var $li = $tab.parent('li');
    var tabid = $tab.attr('id') || uniqueId('ui-tab');

    $tab.attr('id', tabid);
    // put role tab, presentation and tablist only if there's at least one tabpanel
    if (tabpanel) {
      $tab.attr('role', 'tab');
      $tablist.attr('role', 'tablist');
      $li.attr('role', 'presentation');
    }

    if ($tab.hasClass('active')) {
      $tab.attr({
        tabIndex: '0',
        'aria-selected': 'true',
        'aria-controls': $tab.attr('href').substr(1)
      });
      tabpanel.attr({
        role: 'tabpanel',
        tabIndex: '0',
        'aria-hidden': 'false',
        'aria-labelledby': tabid
      });
    } else {
      $tab.attr({
        tabIndex: '-1',
        'aria-selected': 'false',
        'aria-controls': $tab.attr('href').substr(1)
      });
      tabpanel.attr({
        role: 'tabpanel',
        tabIndex: '-1',
        'aria-hidden': 'true',
        'aria-labelledby': tabid
      });
    }
  });
  // end mod

  $.fn[NAME] = Tab._jQueryInterface;
  $.fn[NAME].Constructor = Tab;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;
}(jQuery);
//# sourceMappingURL=tab.js.map
