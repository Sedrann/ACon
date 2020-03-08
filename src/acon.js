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
    if (options.parsedSentences[index + 1] && options.parsedSentences[index + 1].options.iDirection) {
      fDirection = options.parsedSentences[index + 1].options.iDirection
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
   * Return formated users or default options
   * @private
   * @param {String} sentence
   * @param {Number} index
   * @param {Array} options
   * @returns {Object}  
   */

  var getOptions = (sentence, sentenceOptions) => {
    let optionsObject = {}

    if (sentenceOptions) {
      // Loop through options
      for (let i = 0; i < sentenceOptions.length; i++) {
        if (typeof sentenceOptions[i] === 'number') {
          // If type of option is number store time to read
          optionsObject.timeToRead = sentenceOptions[i]
        } else if (/\(.*\)/.test(sentenceOptions[i])) {
          // If option contains () store custom function
          optionsObject.function = sentenceOptions[i]
        } else if (['bottom','top','right','left'].includes(sentenceOptions[i])){
          // Store initial direction
          optionsObject.iDirection = sentenceOptions[i]
        } else {
          // Store animate by
          optionsObject.animateBy = sentenceOptions[i]
        }
      }
    }

    // Use default options if some option was not defined
    if (!optionsObject.iDirection) optionsObject.iDirection = options.direction
    if (!optionsObject.function) optionsObject.function = false
    if (!optionsObject.timeToRead) optionsObject.timeToRead = timeToRead(sentence)
    if (!optionsObject.animateBy) optionsObject.animateBy = options.animateBy
    
    return optionsObject
  }


  /**
   * Loop all parsedSentences and create the text element
   * @private
  */

  var create = () => {
    for (let i in options.parsedSentences) {
      let cSentence = options.parsedSentences[i]

      // Create text element and add its content
      let text = document.createElement('div')
      // Check animate by option and invoke functions
      if (cSentence.animateBy === 'sentence') {
        text.innerHTML = cSentence.sentence
      } else if (cSentence.animateBy === 'words') {
        text.innerHTML = splitWords(cSentence.sentence)
      } else {
        text.innerHTML = splitChars(cSentence.sentence)
      }

      // Animation listeners: end invokes destroy method / start invoke custom function if defined
      text.addEventListener('animationend', function () { destroySentence(this) }, false)
      if (cSentence.function) {
        text.addEventListener('animationstart', function () { initCustomFn(cSentence.function, this) }, false)
      }
      
      // Get fDirection
      cSentence.options.fDirection = fDirection(Number(i))

      // Sums up the time to read, the animation duration and the current delay (starts at 0)
      options.readDelay = cSentence.options.timeToRead + options.animDuration + options.animDelay

      // Check if next sentence exist or not and add corresponding animation
      if (options.parsedSentences[Number(i) + 1]) {
        text.setAttribute('style', `animation: i-${cSentence.options.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards, f-${cSentence.options.fDirection} ${options.animDuration}ms ${options.readDelay}ms cubic-bezier(.74,.24,1,.72) forwards`)
      } else {
        text.setAttribute('style', `animation: i-${cSentence.options.iDirection} ${options.animDuration}ms ${options.animDelay}ms cubic-bezier(0,.18,.12,.68) forwards`)
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

    // Loop sentences and transform Array into object
    options.parsedSentences = {}
    for (let i = 0; i < options.sentences.length; i++) {
      // Check if sentence contains options
      if (Array.isArray(options.sentences[i])) {
        var sentence = options.sentences[i][0]
        var sentenceOptions = getOptions(sentence, options.sentences[i].slice(1))
      } else {
        var sentence = options.sentences[i]
        var sentenceOptions = getOptions(sentence)
      }

      options.parsedSentences[i] = {
        sentence: sentence,
        options: sentenceOptions
      }
    }

    // TODO: check performance for looping twice
    create()
  }

  return acon
})