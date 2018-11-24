var Acon = {
    init: function (sentences, selector) {
        let animDuration = 300;
        var container = document.querySelector(selector);
        container.innerHTML = '';

        var animDelay = 0;
        for (let i = 0; i < sentences.length; i++) {

            let userOptions, text, sentence, timeToRead, words, readDelay, direction;

            if (sentences[i].constructor === Array) {
                userOptions = true;
                for (let o = 1; o < sentences[i].length; o++) {

                }
            }

            text = document.createElement('div');
            text.addEventListener('animationend', function () { Acon.destroySentence(this) }, false);

            if (userOptions) {
                sentence = sentences[i][0];
            } else {
                sentence = sentences[i];
            }

            text.id = 'sentence-' + [i];
            text.innerHTML = sentence;

            timeToRead;
            words = sentence.split(' ').length;
            timeToRead = words * 300;
            if (timeToRead < 2000) {
                timeToRead = 2000;
            }
            readDelay = timeToRead + animDuration + animDelay;

            if (i + 1 != sentences.length) {
                text.setAttribute('style', 'animation: a-bm ' + animDuration + 'ms ' + animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards, a-mt ' + animDuration + 'ms ' + readDelay + 'ms cubic-bezier(.74,.24,1,.72) forwards;');
            } else {
                text.setAttribute('style', 'animation: a-bm  ' + animDuration + 'ms ' + animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards');
            }
            container.appendChild(text);
            animDelay = readDelay + animDuration;
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
    'Hello',
    'This is a test',
    'Lalalala',
    'Still a test',
    'Ok',
    'Bye'
]
