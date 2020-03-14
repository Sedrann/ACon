# acon

Script that animates sentences.
[See an example](https://codepen.io/sedran/pen/aQPbwz)

## Usage

Add the class "acon-container" to your element and initialize the script passing the sentences as an option.

```html
<div class="acon-container"></div>
```

```javascript
var mySentences =  [
  { 
    text: 'Animate sentences'
  },
  { 
    text: 'This is a test'
  },
  { 
    text: 'Still a test'
  }
]

acon.init({sentences: mySentences})
```

## Options

### Selector
Specifies the css selector of the element where the sentences will be animated. If there's no selector the default will be the class "acon-container"
```javascript
acon.init({
  sentences: mySentences,
  selector: '#myDiv'
})
```

### Time
The time that each sentence is shown is calculated by the number of words it has, the minimum time is 1000ms.
You can specify a time for each sentence adding the value of the timeToRead key in milliseconds.

```javascript
var mySentences =  [
  {
    text: 'Time to read 500',
    timeToRead: 500,
  }
]
```

### Direction
By default all sentences will fade in from bottom to middle and then fade out from middle to top. 
Override the default behaviour by writing the direction (top/bottom/right/left) in the iDirection key.

```javascript
var mySentences =  [
  {
    text: 'Fade from top',
    iDirection: 'top'
  },
]
```

### Custom functions
A sentence can trigger a function when the fade in animation ends. Specify the function with the function key.
```javascript
var mySentences =  [
  {
    text: 'Invoke custom function',
    function: 'changeBackgroundColor("#cecece")'
  },
]
```

### Animate by
Specify how sentences should be animated ( by sentence, by words o letters)
```javascript
var mySentences =  [
  {
    text: 'Animate each word',
    animateBy: 'words'
  },
]
```


## License
[MIT](https://choosealicense.com/licenses/mit/)
