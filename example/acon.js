var Acon = {
    init: function (sentences, selector) {
        var animDuration = 300,
            container = document.querySelector(selector),
            animDelay = 0;

        container.innerHTML = '';

        for (let i = 0; i < sentences.length; i++) {
            let direction = 'bottom';
            let text, sentence, timeToRead, words, readDelay;

            if (sentences[i].constructor === Array) {
                sentence = sentences[i][0]
                direction = sentences[i][1]
            } else {
                sentence = sentences[i];
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
            readDelay = timeToRead + animDuration + animDelay;

            if (i + 1 != sentences.length) {
                text.setAttribute('style', 'animation: i-' + direction + ' ' + animDuration + 'ms ' + animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards, a-mt ' + animDuration + 'ms ' + readDelay + 'ms cubic-bezier(.74,.24,1,.72) forwards;');
            } else {
                text.setAttribute('style', 'animation: i-' + direction + ' ' + animDuration + 'ms ' + animDelay + 'ms cubic-bezier(0,.18,.12,.68) forwards');
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
    ['Hello', 'bottom', 3000],
    ['Text from top','top'],
    'Default text',
    'Still a test',
    ['Text from left','left'],
    'Last sentece'
]
