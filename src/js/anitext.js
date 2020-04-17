(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root)
    })
  } else if (typeof exports === 'object') {
    module.exports = factory(root)
  } else {
    root.anitext = factory(root)
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
  'use strict'

  // Variables
  var anitext = {}
  var options

  var defaults = {
    selector: '.anitext-container',
    minTimeToRead: 1000,
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

  var destroySentence = (event) => {
    if (event.target.classList.contains('active') || event.target.classList.contains('active') && event.target.nextSibling === null) {
      event.target.parentElement.removeChild(event.target)
    } else if (event.target.matches('div')) {
      event.target.classList.add('active')
    } else {
      event.target.parentElement.classList.add('active')
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
      var tmpFunc = new Function(fn)
      tmpFunc()
    }
  }


  /**
   * Calculate the time to read sentence
   * @param {String} sentence 
   * @returns {Number} ms
   */

  var timeToRead = (string) => {
    // Ensure value is a string before split
    let ttr = String(string).split(" ").length * 300
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
    return sentence.replace(/[a-zA-ZÀ-ÿ\d\u00f1\u00d1\!¡@#$´%^¨&*()_+\-=\[\]{}~;':"\\|,.<>\/?]|\s/g, '<span>$&</span>')
  }


  /**
  * Wrap each word in a span
  * @private
  * @param {String} sentence the string to transform
  * @returns {String} The input splitted by words
  */

  var splitWords = (sentence) => {
    return sentence.replace(/[a-zA-ZÀ-ÿ\d\u00f1\u00d1\!¡@#$´%^¨&*()_+\-=\[\]{}~;':"\\|,.<>\/?]+|\s/g, '<span>$&</span>')
  }


  /**
   * Update sentence options with defaults
   * @private
   * @param {Object} sentence
   */

  var setDefaults = sentence => {
    //TODO: improve conditionals
    if (!sentence.iDirection) {
      sentence.iDirection = options.direction
    } else if (!/bottom|top|right|left/.test(sentence.iDirection)) {
      console.warn(`anitext: using default iDirection. (invalid value: ${sentence.direction})`)
      sentence.iDirection = options.direction
    }

    if (!sentence.timeToRead) { 
      sentence.timeToRead = timeToRead(sentence.text)
    } else if (!(sentence.timeToRead >= 0)) {
      console.warn(`anitext: using default timeToRead. (invalid value: ${sentence.timeToRead})`)
      sentence.timeToRead = timeToRead(sentence.text)
    }

    if (!sentence.animateBy) {
      sentence.animateBy = options.animateBy
    } else if (!/sentence|words|chars/.test(sentence.animateBy)) {
      console.warn(`anitext: using default animateBy. (invalid value: ${sentence.animateBy})`)
      sentence.animateBy = options.animateBy
    }

    if (!sentence.function) sentence.function = false
  }

  /**
   * Add animation style to every child node
   * @private
   * @param {Object} sentence
   * @param {Node} parentElement contains the child nodes
   */

  var animateNodes = (sentence, parentElement) => {
    parentElement.classList.add('word')
    let childs = Array.prototype.slice.call(parentElement.childNodes)
    let wordDelay = options.animDelay
    childs.forEach(function(word, index) {
      word.setAttribute('style', `animation: i-${sentence.iDirection} ${options.animDuration}ms ${wordDelay}ms cubic-bezier(0,.18,.12,.68) forwards`)
      wordDelay = options.animDelay + (sentence.timeToRead / childs.length -1 ) * (index + 1)
    })
  }

  /**
   * Loop all parsedSentences and create the text element
   * @private
  */

  var create = () => {
    if (!options.sentences) {
      console.error('anitext: No defined sentences were found')
    }

    for (let i in options.sentences) {
      let cSentence = options.sentences[i]

      // 
      if (!cSentence.text) {
        console.warn(`anitext: skipped sentence: ${Number(i) + 1} (text is undefined)`)
        continue
      }

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
      text.addEventListener('animationend', function () { destroySentence(event) }, false)
      if (cSentence.function) {
        text.addEventListener('animationstart', function () { initCustomFn(cSentence.function, this) }, false)
      }
      
      // Get fDirection
      cSentence.fDirection = fDirection(Number(i))

      // Sums up the time to read, the animation duration and the current delay (starts at 0)
      options.readDelay = Number(cSentence.timeToRead) + options.animDuration + options.animDelay

      // Check if next sentence exist or not and add corresponding animation
      if (options.sentences[Number(i) + 1]) {
        if (cSentence.animateBy === 'sentence') {
          text.setAttribute('style', `animation: i-${cSentence.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards, f-${cSentence.fDirection} ${options.animDuration}ms ${options.readDelay}ms cubic-bezier(.74,.24,1,.72) forwards`)
        } else {
          animateNodes(cSentence, text)
          text.setAttribute('style', `animation: f-${cSentence.fDirection} ${options.animDuration}ms ${options.readDelay}ms cubic-bezier(.74,.24,1,.72) forwards`)
        }
      } else {
        if (cSentence.animateBy === 'sentence') {
          text.setAttribute('style', `animation: i-${cSentence.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards`)
        } else {
          animateNodes(cSentence, text)
        }

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

  anitext.destroy = () => {
    document.querySelector(options.selector).innerHTML = ''
  }

  
  /**
   * Initialize plugin
   * @public
   * @param {Object} options User options
   */

  anitext.init = function (customOptions) {
    // Update options
    options = { ...defaults, ...customOptions }

    // Destroy previous animations
    anitext.destroy()

    // Create sentences
    create()
  }

  return anitext
})