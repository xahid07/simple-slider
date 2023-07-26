const ___ = (parent,element) => parent.querySelector(element);
const ____ = (parent,element) => parent.querySelectorAll(element);
class PTSlider {
     'use strict';
     constructor(e) {
          const a = this;
          Object.assign(a,{
                    e:e,
                    wraper: ___(document,e),
                    slider:'',
                    items:[],
                    itemCount:0,
                    lastMargin:0,
                    sliderWidth:0,
                    viewWidth:0,
                    navigationBullet:'',
                    navigatorArea:0,
                    last_transform_value:0,
                    minNavWidth:0,
                    slidingLength:0,
                    SlidingAbs:0,
                    navMovingArea:0,
                    startX:0,
                    offsetX:0,
                    newX:0,
                    lastAbs:0,
                    newAbs:0,
                    navLength:0,
                    lastX:0,
                    newPlacement:0,
                    navLengthAbs:0,
                    minDistance:10,
               }
          )
          a.wraper.classList.add('pt_slider_wraper');
          a.wraper.firstElementChild.classList.add('pt_slider');
          a.slider = ___(a.wraper,'.pt_slider');
          a.items = ____(a.slider,'.slider_item');
          a.itemCount = a.items.length;
          a.lastMargin = parseInt(getComputedStyle(a.items[a.itemCount - 1]).getPropertyValue('margin-right'));
          a.sliderWidth = a.slider.scrollWidth + a.lastMargin;
          a.viewWidth = a.slider.offsetWidth;
          // =====================================================
          // Slider action close due to not being lengthy enough...
          if (a.sliderWidth - a.lastMargin <= a.viewWidth) return false;
          // =====================================================
          a.init();
     }
     #creatingProgressBar = ()=>{
          const a=this;
          a.last_transform_value = a.sliderWidth - a.viewWidth;
          if(!___(a.wraper,'.pt_slider_navigator')){
               const tempContainer = document.createElement('div');
               const htmlSinppet = '<div class="pt_slider_navigator"><div class="navigator_bullet"></div></div>';
               tempContainer.innerHTML = htmlSinppet;
               while (tempContainer.firstChild) {
                    a.wraper.appendChild(tempContainer.firstChild);
               }
          }
          a.navigationBullet = ___(a.wraper,'.navigator_bullet');
          a.navigatorArea = ___(a.wraper,'.pt_slider_navigator').clientWidth;
     }
     #calculation = ()=>{
          const a = this;
          a.minNavWidth = Math.round((a.viewWidth / (a.sliderWidth)) * 100);
          a.navigationBullet.style.setProperty('width',`${a.minNavWidth}px`);
          a.slidingLength = Math.round(-a.last_transform_value);
          a.SlidingAbs = Math.abs(a.slidingLength);
          a.navMovingArea = a.navigatorArea - a.minNavWidth;
     }
     // Function to handle dragging
     #dragSlider = (e) => {
          const a = this;
          a.newX = (a.offsetX + e.clientX - a.startX) || (a.offsetX + e.touches && e.touches[0].clientX - a.startX);
          a.lastAbs = Math.abs(a.lastX); 
          a.newAbs = Math.abs(a.newX);
          const checkValue = a.lastAbs > a.newAbs ? a.lastAbs - a.newAbs : a.newAbs - a.lastAbs;
          if (checkValue > a.minDistance) {
               a.navLength = Math.round(a.newPlacement + a.newX);
               a.slider.style.setProperty('--x-exis', a.navLength + 'px');
               a.navLengthAbs = Math.abs(a.navLength);
               if (a.navLength <= 0 && a.navLengthAbs <= a.SlidingAbs) {
                    const navWidth = Math.round(a.navLengthAbs * a.navMovingArea / a.SlidingAbs + a.minNavWidth);
                    a.navigationBullet.style.setProperty('width', navWidth + 'px');
               }
          }
     }
     #eventStartFunc = (e)=>{
          const a = this;
          a.startX = e.clientX || e.touches && e.touches[0].clientX;
               a.offsetX = parseInt(getComputedStyle(this.slider).getPropertyValue('left'));
               document.addEventListener('mousemove', a.#dragSlider);
               document.addEventListener('touchmove', a.#dragSlider);
     }
     #eventEndFunct = (e) => {
          const a = this;
          a.lastX = a.newX;
               a.newPlacement = parseInt(getComputedStyle(a.slider).getPropertyValue('--x-exis'));
               if (a.newPlacement > 0) {
                    a.slider.style.setProperty('--x-exis', '0px');
                    a.newPlacement = a.lastX = 0;
               } else if (a.newPlacement < a.slidingLength) {
                    a.slider.style.setProperty('--x-exis', a.slidingLength + 'px');
                    a.newPlacement = a.lastX = a.slidingLength;
               }
               document.removeEventListener('mousemove', a.#dragSlider);
               document.removeEventListener('touchmove', a.#dragSlider);
     }
     #mouseDownEvent = ()=>{
          const a = this;
          a.slider.addEventListener('mousedown', a.#eventStartFunc);
     }
     #touchStartEvent = () => {
          const a = this;
          a.slider.addEventListener('touchstart', a.#eventStartFunc);
     }
     #mouseUpEvent = ()=>{
          const a = this;
          document.addEventListener('mouseup', a.#eventEndFunct);
     }
     #mouseEndEvent = () => {
          const a = this;
          document.addEventListener('touchend', a.#eventEndFunct);
     }
     init() {
          const a = this;
          a.#creatingProgressBar();
          a.#calculation();
          a.#mouseDownEvent();
          a.#touchStartEvent();
          a.#mouseUpEvent();
          a.#mouseEndEvent();
     }
}
