(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root)
    })
  } else if (typeof exports === 'object') {
    module.exports = factory(root)
  } else {
    root.acon = factory(root)
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
  'use strict';

  // Variables
  var acon = {}
  var options

  var defaults = {
    selector: '.acon-container',
    delay: 0,
    animDuration: 300,
    animDelay: 0
  }


  // Methods

  /**
   * Remove sentence once its no longer visible
   * @private
   * @param {Node} element el to remove
   */

  var destroySentence = (el) => {
    if (el.classList.contains('active')) {
      el.parentElement.removeChild(el)
    } else {
      el.classList.add('active')
    }
  }

  /**
   * Invoke custom function
   * @private
   * @param {Node} element
   * @param {String} function
   */

  var initCustomFn = (fn, el) => {
    if (!el.classList.contains("active")) {
      var tmpFunc = new Function(fn);
      tmpFunc()
    }
  }

  /**
   * Loop array an create all sentences
   * @private
   * @param {Array} sentences
  */

  var create = (sentences) => {
    for (let i = 0; i < sentences.length; i++) {
      let iDirection = 'bottom'
      let fDirection = 'bottom'
      let text = document.createElement('div')
      let sentence, timeToRead, words, readDelay

      text.id = 'sentence-' + [i]
      text.addEventListener('animationend', function () { destroySentence(this) }, false)

      if (sentences[i].constructor === Array) {
        sentence = sentences[i][0]

        for (let o = 1; o < sentences[i].length; o++) {
          if (typeof sentences[i][o] == 'number') {
            timeToRead = sentences[i][o]
          } else if (/\(.*\)/.test(sentences[i][o])) {
            text.addEventListener('animationstart', function () { initCustomFn(sentences[i][o], this) }, false)
          }
          else {
            iDirection = sentences[i][o]
          }
        }

      } else {
        sentence = sentences[i]
      }

      text.innerHTML = sentence

      if (sentences[i + 1] && sentences[i + 1].constructor === Array) {
        for (let o = 1; o < sentences[i + 1].length; o++) {
          if (typeof sentences[i + 1][o] !== 'number' && !/\(.*\)/.test(sentences[i + 1][o])) {
            fDirection = sentences[i + 1][1]
          }
        }

      }

      if (!timeToRead) {
        words = sentence.split(' ').length
        timeToRead = words * 300
        if (timeToRead < 2000) {
          timeToRead = 2000
        }
      }
      readDelay = timeToRead + options.animDuration + options.animDelay
      if (i + 1 != sentences.length) {
        text.setAttribute('style', 'animation: i-' + iDirection + ' ' + options.animDuration + 'ms ' + options.animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards, f-' + fDirection + ' ' + options.animDuration + 'ms ' + readDelay + 'ms cubic-bezier(.74,.24,1,.72) forwards;')
      } else {
        text.setAttribute('style', 'animation: i-' + iDirection + ' ' + options.animDuration + 'ms ' + options.animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards');
      }

      var container = document.querySelector(options.selector);
      container.appendChild(text)
      options.animDelay = readDelay + options.animDuration
    }
  }

  /**
   * Initialize plugin
   * @public
   * @param {Array} sentences
   * @param {Object} options User options
   */

  acon.init = function (sentences, customOptions) {
    // Update options
    options = { ...defaults, ...customOptions }

    // Create sentences
    create(sentences)
  }

  return acon
})