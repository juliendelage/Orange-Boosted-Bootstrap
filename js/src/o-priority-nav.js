/**
 * --------------------------------------------------------------------------
 * Boosted (v4.0.0-alpha.6.1): o-priority-nav.js
 * Licensed under MIT (https://github.com/Orange-OpenSource/Orange-Boosted-Bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const PriorityNav = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'prioritynav'
  const VERSION = '4.0.0-alpha.6.1'
  const DATA_KEY = 'bs.prioritynav'
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  const RESIZE_DURATION = 500

  const Event = {
    RESIZE: 'resize',
    FOCUS: 'focus'
  }

  const ClassName = {
    PRIORITY: 'priority',
    HIDE: 'sr-only'
  }

  const Selector = {
    NAV_ELEMENTS: 'li:not(\'.overflow-nav\')',
    FIRST_ELEMENT: 'li:first',
    PRIORITY_ELEMENT: '.priority'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class PriorityNav {

    constructor(element, config) {
      this._element = element
      this._config = config

      if($(element).is('ul')) {
        this._$menu = $(element)
      } else {
        this._$menu = $(element).find('ul').first()
      }
      this._$allNavElements = this._$menu.find(Selector.NAV_ELEMENTS)
      this._bindUIActions()
      this._setupMenu()
    }

    // getters

    static get VERSION() {
      return VERSION
    }

    // public

    // private

    _setupMenu() {
      const $allNavElements = this._$allNavElements

      // Checking top position of first item (sometimes changes)
      const firstPos = this._$menu.find(Selector.FIRST_ELEMENT).position()

      // Empty collection in which to put menu items to move
      let $wrappedElements = $()

      // Used to snag the previous menu item in addition to ones that have wrapped
      let first = true

      // Loop through all the nav items...
      this._$allNavElements.each(function (i) {
        const $elm = $(this)

        // ...in which to find wrapped elements
        const pos = $elm.position()

        if (pos.top !== firstPos.top) {

          // If element is wrapped, add it to set
          $wrappedElements = $wrappedElements.add($elm)

          // Add the previous one too, if first
          if (first) {
            $wrappedElements = $wrappedElements.add($allNavElements.eq(i - 1))
            first = false
          }
        }
      })

      if ($wrappedElements.length) {

        // Clone set before altering
        const newSet = $wrappedElements.clone()

        // Hide ones that we're moving
        $wrappedElements.addClass(ClassName.HIDE)
        $wrappedElements.find('.nav-link').attr('tabindex', -1)

        // Add wrapped elements to dropdown
        this._$menu.find('.overflow-nav-list').append(newSet)

        // Show new menu
        this._$menu.find('.overflow-nav').addClass('show-inline-block')

        // Make overflow visible again so dropdown can be seen.
        this._$menu.find('.o-nav-local').css('overflow', 'visible')

        // Check if menu doesn't overflow after process
        if(this._$menu.find('.overflow-nav').position().top !== firstPos.top) {
          const $item = $(this._element).find('.' + ClassName.HIDE).first().prev()
          const $itemDuplicate = $item.clone()

          $item.addClass(ClassName.HIDE)
          $item.find('.nav-link').attr('tabindex', -1)

          this._$menu.find('.overflow-nav-list').prepend($itemDuplicate)
        }
      }

      //hide menu from AT
      this._$menu.find('.overflow-nav').attr('aria-hidden', true)

    }

    _tearDown() {
      this._$menu.find('.overflow-nav-list').empty()
      this._$menu.find('.overflow-nav').removeClass('show-inline-block')
      this._$allNavElements.removeClass(ClassName.HIDE)
      this._$allNavElements.find('.nav-link').attr('tabindex', 0)
    }

    _bindUIActions() {
      $(window).on(Event.RESIZE, () => {
        this._$menu.addClass('resizing')

        setTimeout(() => {
          this._tearDown()
          this._setupMenu()
          this._$menu.removeClass('resizing')
        }, RESIZE_DURATION)
      })

      this._$menu.find('.overflow-nav .dropdown-toggle').on(Event.FOCUS, (e) => {
        $(e.target).dropdown('toggle')
      })
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this)

        let data       = $element.data(DATA_KEY)

        if (!data) {
          data = new PriorityNav(this, config)
          $element.data(DATA_KEY, data)
        }

        if (typeof config !== 'undefined' && config) {
          if (typeof config !== 'string' || !/^[.#].*/.test(config)) {
            throw new Error(`Selector "${config}" is not supported`)
          }
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = PriorityNav._jQueryInterface
  $.fn[NAME].Constructor = PriorityNav
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return PriorityNav._jQueryInterface
  }

  return PriorityNav

})(jQuery)

export default PriorityNav
