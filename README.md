# JS slider for [SamsonPHP](http://samsonphp.com) framework

> Generic javascript carousel slider

The content of slider must be located in ```< class="sjs-slider">``` element, wrapped by parent element:

```html
<div class="sliderContainer">
    <ul class="sjs-slider">
        <li class="sjs-slide">slide1</li>
        <li class="sjs-slide">slide2</li>
        <li class="sjs-slide">slide3</li>
    </ul>
</div>
```

## Module adding 

For module adding:

```js
sliderContainer.slider();
```

For switched elements in your html-code should be set classes **arrow-left** for the left and **arrow-right** for the right.

## Module options

The module has a list of parameters which could be set while adding

* **leftButton** – explicitly indicate switch to the left
* **rightButton** – explicitly indicate switch to the right
* **autoScroll** – automatic scrolling
* **num** – the number of displayed elements

## The width and number of slides 

Module defines width of slide on the basis of general width of parent ```< class="sjs-slider">``` element and number
of displayed elements (parameter num). The width of the slide will be divided equally into a number
of displayed elements. Therefore you should exactly set width of a block **sliderContainer** in styles.  

## Example

If you want to add in project slider composed of two arrows and view-port from 4 slides with width 252px then:

html
```html
<div class="arrow-left"></div>
<div class="sliderContainer">
    <ul class="sjs-slider">
        <li class="sjs-slide">slide1</li>
        <li class="sjs-slide">slide2</li>
        <li class="sjs-slide">slide3</li>
        <li class="sjs-slide">slide4</li>
        <li class="sjs-slide">slide5</li>
    </ul>
</div>
<div class="arrow-left"></div>
```
css
```css
.sliderContainer {
  text-align: center;
  overflow: hidden;
  width: 1008px;
}
.sliderContainer li {
  overflow: hidden;
}
```
js
```js
s('.sliderContainer').pageInit(function(sliderContainer){
    sliderContainer.slider({
        num : 4
    });
});
```
