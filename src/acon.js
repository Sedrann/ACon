var Acon = {
    init: function (sentences, selector) {
        _this = this;
        _this.animDuration = 300;
        _this.animDelay = 0;

        if(!selector){
            selector = ".acon-container";
        }
        container = document.querySelector(selector);
        container.innerHTML = '';

        Acon.createSentences(sentences);
    },
    createSentences: function (sentences) {
        for (let i = 0; i < sentences.length; i++) {
            let iDirection = 'bottom',
                fDirection = 'bottom',
                text = document.createElement('div'),
                sentence, timeToRead, words, readDelay;

            text.id = 'sentence-' + [i];
            text.addEventListener('animationend', function () { Acon.destroySentence(this) }, false);

            if (sentences[i].constructor === Array) {
                sentence = sentences[i][0];

                for (let o = 1; o < sentences[i].length; o++) {
                    if (typeof sentences[i][o] == 'number') {
                        timeToRead = sentences[i][o];
                    } else if (/\(.*\)/.test(sentences[i][o])){
                        text.addEventListener('animationstart', function () { Acon.initCustomFunction(sentences[i][o], this) }, false);
                    }
                    else {
                        iDirection = sentences[i][o];
                    }
                }
                
            } else {
                sentence = sentences[i];
            }
            
            text.innerHTML = sentence;

            if (sentences[i + 1] && sentences[i + 1].constructor === Array) {
                for (let o = 1; o < sentences[i + 1].length; o++) {
                    if (typeof sentences[i + 1][o] !== 'number' && !/\(.*\)/.test(sentences[i + 1][o])) {
                        fDirection = sentences[i + 1][1];
                    }
                }
               
            }
            
            if (!timeToRead) {
                words = sentence.split(' ').length;
                timeToRead = words * 300;
                if (timeToRead < 2000) {
                    timeToRead = 2000;
                }
            }
            readDelay = timeToRead + _this.animDuration + _this.animDelay;

            if (i + 1 != sentences.length) {
                text.setAttribute('style', 'animation: i-' + iDirection + ' ' + _this.animDuration + 'ms ' + _this.animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards, f-' + fDirection + ' ' + _this.animDuration + 'ms ' + readDelay + 'ms cubic-bezier(.74,.24,1,.72) forwards;');
            } else {
                text.setAttribute('style', 'animation: i-' + iDirection + ' ' + _this.animDuration + 'ms ' + _this.animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards');
            }
            container.appendChild(text);
            _this.animDelay = readDelay + _this.animDuration;
        }
    },
    destroySentence: function (el) {
        if (el.classList.contains('active')) {
            el.parentElement.removeChild(el);
        } else {
            el.classList.add('active');
        }
    },
    initCustomFunction: function (userDefinedFunction, el) {
        if (!el.classList.contains('active')){
            var tmpFunc = new Function(userDefinedFunction);
            tmpFunc();;
        }
    }
}