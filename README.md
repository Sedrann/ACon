# Acon

Script that animates arrays of sentences inside an alement.
[See an example](https://codepen.io/sedran/pen/aQPbwz)

## Usage

Create an array of sencentes, add the class "acon-container" to the element and initialize the script

```html
<div class="acon-container"></div>
```

```javascript
var array =  [
    'Animate sentences',
    'This is a test',
    'Array test'
]

Acon.init(array);
```

## Options

### Selector
The init function accepts a second parameter which specifies the selector of the element where the sentences will be animated.
If there's no selector the default will be the class "acon-container"
```javascript
Acon.init(array,"#myDiv");
```
### Time
The time that each sentence is shown is calculated by the number of words it has, the minimum time is 2000ms.
Specify a time by adding the number in milliseconds inside the array.

```javascript
var array =  [
    ['Custom time is 5s', 5000],
    'This is a test',
    'Array test'
]
```
### Direction
By default all sentences will fade in from bottom to middle and then fade out from middle to top. 
Override the default behaviour by writing the direction a sentence should fade inside the array

```javascript
var array =  [
    ['Custom time is 5s', 5000],
    ['This sentence will fade in from the top', 'top'],
    'Array test'
]
```

### Custom functions
A sentence can trigger a function when the fade in animation ends. Specify the function inside the array using the name of the
function and both parenthesis.
```javascript
var array =  [
    ['Custom time is 5s', 5000],
    ['This sentence will fade in from the top', 'top'],
    ['Trigger function', 'changeBackgroundColor("#cecece")']
]
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
