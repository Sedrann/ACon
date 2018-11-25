var Acon = {
    init: function (sentences, selector) {
        _this = this;
        _this.animDuration = 300;
        _this.animDelay = 0;
        container = document.querySelector(selector);
        container.innerHTML = '';

        Acon.createSentences(sentences);
    },
    createSentences: function (sentences) {
        for (let i = 0; i < sentences.length; i++) {
            let iDirection = 'bottom',
                fDirection = 'bottom',
                text, sentence, timeToRead, words, readDelay;

            if (sentences[i].constructor === Array) {
                sentence = sentences[i][0];
                iDirection = sentences[i][1];
            } else {
                sentence = sentences[i];
            }

            if (sentences[i + 1] && sentences[i + 1].constructor === Array) {
                fDirection = sentences[i + 1][1];
            }

            text = document.createElement('div');
            text.addEventListener('animationend', function () { Acon.destroySentence(this) }, false);

            text.id = 'sentence-' + [i];
            text.innerHTML = sentence;

            timeToRead;
            words = sentence.split(' ').length;
            timeToRead = words * 300;
            if (timeToRead < 2000) {
                timeToRead = 2000;
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
    }
}

var test =  [
    ['Hello', 'bottom', 3000],
    ['Text from top','top'],
    'Default text',
    'Still a test',
    ['Text from left','left'],
    'Last sentece'
]
