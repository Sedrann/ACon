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
    minTimeToRead: 2000,
    direction: 'bottom',
    animDuration: 300,
    readDelay: 0,
    animDelay: 0,
    animateBy: 'sentence'
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
   * Calculate the time to read sentence
   * @param {String} sentence 
   * @returns {Number} ms
   */

  var timeToRead = (string) => {
    let ttr = string.split(" ").length * 300;
    ttr = (ttr > options.minTimeToRead)? ttr : options.minTimeToRead
    return  ttr
  }


  /**
  * Get the final direction of the current sentence
  * @param {Number} index
  * @returns {String} direction
  */

  var fDirection = (index) => {
    var fDirection
    // Check if next sentence exist and if it contains a defined direction
    if (options.sentences[index + 1] && options.sentences[index + 1].iDirection) {
      fDirection = options.sentences[index + 1].iDirection
    } else {
      fDirection = options.direction
    }

    return fDirection
  }


  /**
  * Wrap each letter in a span
  * @private
  * @param {String} sentence the string to transform
  * @returns {String} The input splitted by letters
  */

  var splitChars = (sentence) => {
    return sentence.replace(/\w|\s/g, "<span>$&</span>")
  }


  /**
  * Wrap each word in a span
  * @private
  * @param {String} sentence the string to transform
  * @returns {String} The input splitted by words
  */

  var splitWords = (sentence) => {
    return sentence.replace(/\w+|\s/g, "<span>$&</span>")
  }


  /**
   * Update sentence options with defaults
   * @private
   * @param {Object} sentence
   */

  var setDefaults = sentence => {
    if (!sentence.iDirection) sentence.iDirection = options.direction;
    if (!sentence.function) sentence.function = false;
    if (!sentence.timeToRead) sentence.timeToRead = timeToRead(sentence.text);
    if (!sentence.animateBy) sentence.animateBy = options.animateBy;
  };


  /**
   * Loop all parsedSentences and create the text element
   * @private
  */

  var create = () => {
    for (let i in options.sentences) {
      let cSentence = options.sentences[i]
      
      // Set defaults options if some option is missing
      setDefaults(cSentence)

      // Create text element and add its content
      let text = document.createElement('div')
      // Check animate by option and invoke functions
      if (cSentence.animateBy === 'sentence') {
        text.innerHTML = cSentence.text
      } else if (cSentence.animateBy === 'words') {
        text.innerHTML = splitWords(cSentence.text)
      } else {
        text.innerHTML = splitChars(cSentence.text)
      }

      // Animation listeners: end invokes destroy method / start invoke custom function if defined
      text.addEventListener('animationend', function () { destroySentence(this) }, false)
      if (cSentence.function) {
        text.addEventListener('animationstart', function () { initCustomFn(cSentence.function, this) }, false)
      }
      
      // Get fDirection
      cSentence.fDirection = fDirection(Number(i))

      // Sums up the time to read, the animation duration and the current delay (starts at 0)
      options.readDelay = cSentence.timeToRead + options.animDuration + options.animDelay

      // Check if next sentence exist or not and add corresponding animation
      if (options.sentences[Number(i) + 1]) {
        text.setAttribute('style', `animation: i-${cSentence.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards, f-${cSentence.fDirection} ${options.animDuration}ms ${options.readDelay}ms cubic-bezier(.74,.24,1,.72) forwards`)
      } else {
        text.setAttribute('style', `animation: i-${cSentence.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards`)
      }

      // Append text element to parent container
      let container = document.querySelector(options.selector)
      container.appendChild(text)

      // Increases the animation delay for the next sentence
      options.animDelay = options.readDelay + options.animDuration
    }
  }


  /**
   * Remove every element inside container
   * @public
   */

  acon.destroy = () => {
    document.querySelector(options.selector).innerHTML = ''
  }

  
  /**
   * Initialize plugin
   * @public
   * @param {Object} options User options
   */

  acon.init = function (customOptions) {
    // Update options
    options = { ...defaults, ...customOptions }

    // Destroy previous animations
    acon.destroy()

    // Create sentences
    create()
  }

  return acon
})