import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Tab = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tab'
  const VERSION             = '4.0.0-alpha.6'
  const DATA_KEY            = 'bs.tab'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150
  // boosted mod
  const ARROW_LEFT_KEYCODE  = 37 // KeyboardEvent.which value for left arrow key
  const ARROW_UP_KEYCODE    = 38 // KeyboardEvent.which value for up arrow key
  const ARROW_RIGHT_KEYCODE = 39 // KeyboardEvent.which value for right arrow key
  const ARROW_DOWN_KEYCODE  = 40 // KeyboardEvent.which value for down arrow key
  const RANDOM_NUMBER       = 1000
  // end mod

  const Event = {
    HIDE           : `hide${EVENT_KEY}`,
    HIDDEN         : `hidden${EVENT_KEY}`,
    SHOW           : `show${EVENT_KEY}`,
    SHOWN          : `shown${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DROPDOWN_MENU : 'dropdown-menu',
    ACTIVE        : 'active',
    DISABLED      : 'disabled',
    FADE          : 'fade',
    SHOW          : 'show'
  }

  const Selector = {
    DROPDOWN              : '.dropdown',
    NAV_LIST_GROUP        : '.nav, .list-group',
    ACTIVE                : '.active',
    DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    // Boosted mod
    ACTIVE_CHILD          : '> .nav-item > .active, > .active, > .dropdown > .dropdown-menu > .nav-item > .active, > .dropdown > .dropdown-menu > .active',
    // end mod
    DROPDOWN_TOGGLE       : '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD : '> .dropdown-menu .active'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    show() {
      if (this._element.parentNode &&
          this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
          $(this._element).hasClass(ClassName.ACTIVE) ||
          $(this._element).hasClass(ClassName.DISABLED)) {
        return
      }

      let target
      let previous
      const listElement = $(this._element).closest(Selector.NAV_LIST_GROUP)[0]
      const selector    = Util.getSelectorFromElement(this._element)

      if (listElement) {
        previous = $.makeArray($(listElement).find(Selector.ACTIVE))
        previous = previous[previous.length - 1]
      }

      const hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      })

      const showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      })

      if (previous) {
        $(previous).trigger(hideEvent)
      }

      $(this._element).trigger(showEvent)

      if (showEvent.isDefaultPrevented() ||
         hideEvent.isDefaultPrevented()) {
        return
      }

      if (selector) {
        target = $(selector)[0]
      }

      this._activate(
        this._element,
        listElement
      )

      const complete = () => {
        const hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: this._element
        })

        const shownEvent = $.Event(Event.SHOWN, {
          relatedTarget: previous
        })

        $(previous).trigger(hiddenEvent)
        $(this._element).trigger(shownEvent)
      }

      if (target) {
        this._activate(target, target.parentNode, complete)
      } else {
        complete()
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }
    // Boosted mod
    static _keydown(e) {
      let $this = $(this)
      const Items = $this.closest('ul[role=tablist] ').find('[role=tab]:visible')
      let index
      const k = e.which || e.keyCode
      $this = $(this)
      if (!/(ARROW_LEFT_KEYCODE|ARROW_UP_KEYCODE|ARROW_RIGHT_KEYCODE|ARROW_DOWN_KEYCODE)/.test(k)) {
        return
      }
      index = Items.index(Items.filter(':focus'))

      if (k === ARROW_UP_KEYCODE || k === ARROW_LEFT_KEYCODE) {
        index--
      } // up & left
      if (k === ARROW_RIGHT_KEYCODE || k === ARROW_DOWN_KEYCODE) {
        index++
      } // down & right

      if (index < 0) {
        index = Items.length - 1
      }
      if (index === Items.length) {
        index = 0
      }
      const nextTab = Items.eq(index)
      if (nextTab.attr('role') === 'tab') {
        nextTab.tab('show').trigger('focus')
      }

      e.preventDefault()
      e.stopPropagation()
    }
    // end mod
    // private

    _activate(element, container, callback) {
      const active          = $(container).find(Selector.ACTIVE)[0]
      const isTransitioning = callback
        && Util.supportsTransitionEnd()
        && (active && $(active).hasClass(ClassName.FADE))

      const complete = () => this._transitionComplete(
        element,
        active,
        isTransitioning,
        callback
      )

      // Boosted mod
      $(container).find('.nav-link').attr({
        tabIndex : '-1',
        'aria-selected' : false
      })
      $(container).find('.tab-pane').attr({
        'aria-hidden' : true,
        tabIndex : '-1'
      })
      // end mod

      if (active && isTransitioning) {
        $(active)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        complete()
      }

      if (active) {
        $(active).removeClass(ClassName.SHOW)
      }
    }

    _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE)

        const dropdownChild = $(active.parentNode).find(
          Selector.DROPDOWN_ACTIVE_CHILD
        )[0]

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE)
        }

        active.setAttribute('aria-expanded', false)
      }

      $(element).addClass(ClassName.ACTIVE)
      element.setAttribute('aria-expanded', true)
      // Boosted mod
      $(element).filter('.nav-link.active').attr({
        tabIndex : '0',
        'aria-selected' : true
      })
      $(element).filter('.tab-pane.active').attr({
        'aria-hidden' : false,
        tabIndex : '0'
      })
      // end mod

      if (isTransitioning) {
        Util.reflow(element)
        $(element).addClass(ClassName.SHOW)
      } else {
        $(element).removeClass(ClassName.FADE)
      }

      if (element.parentNode &&
          $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

        const dropdownElement = $(element).closest(Selector.DROPDOWN)[0]
        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE)
        }

        element.setAttribute('aria-expanded', true)
      }

      if (callback) {
        callback()
      }
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this)
        let data    = $this.data(DATA_KEY)

        if (!data) {
          data = new Tab(this)
          $this.data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
          }
          data[config]()
        }
      })
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault()
      Tab._jQueryInterface.call($(this), 'show')
    })

  // Boosted mod
  $(document)
    .on('keydown.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (event) {
      if (!/(ARROW_UP_KEYCODE|ARROW_DOWN_KEYCODE|ARROW_RIGHT_KEYCODE|ARROW_LEFT_KEYCODE)/.test(event.which)) {
        return
      }
      event.preventDefault()
      Tab._keydown.call($(this), event)
    })
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
    return `${prefix || 'ui-id'}-${Math.floor(Math.random() * RANDOM_NUMBER + 1)}`
  }

  const $tablists = $('.nav-tabs, .nav-pills')
  const $tabs = $tablists.find('[data-toggle="tab"], [data-toggle="pill"]')

  $tabs.each(function () {
    const tabpanel = $($(this).attr('href'))
    const $tab = $(this)
    const $tablist = $tab.closest('.nav-tabs, .nav-pills')
    const $li = $tab.parent('li')
    const tabid = $tab.attr('id') || uniqueId('ui-tab')

    $tab.attr('id', tabid)
    // put role tab, presentation and tablist only if there's at least one tabpanel
    if (tabpanel) {
      $tab.attr('role', 'tab')
      $tablist.attr('role', 'tablist')
      $li.attr('role', 'presentation')
    }

    if ($tab.hasClass('active')) {
      $tab.attr({
        tabIndex : '0',
        'aria-selected' : 'true',
        'aria-controls': $tab.attr('href').substr(1)
      })
      tabpanel.attr({
        role : 'tabpanel',
        tabIndex : '0',
        'aria-hidden' : 'false',
        'aria-labelledby':tabid
      })
    } else {
      $tab.attr({
        tabIndex : '-1',
        'aria-selected' : 'false',
        'aria-controls': $tab.attr('href').substr(1)
      })
      tabpanel.attr({
        role : 'tabpanel',
        tabIndex : '-1',
        'aria-hidden' : 'true',
        'aria-labelledby':tabid
      })
    }
  })
  // end mod

  $.fn[NAME]             = Tab._jQueryInterface
  $.fn[NAME].Constructor = Tab
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tab._jQueryInterface
  }

  return Tab

})(jQuery)

export default Tab
