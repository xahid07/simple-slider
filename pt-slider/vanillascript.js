class PTSlider {
     constructor(e) {
          this.e = e;
          PTSlider.init(this.e)
     }
     static init(e) {
          const wraper = document.querySelector(e);
          wraper.classList.add('pt_slider_wraper');
          wraper.firstElementChild.classList.add('pt_slider');
          // const wraperId=wraper.getAttribute('id');
          const slider = wraper.querySelector('.pt_slider');
          const items = slider.querySelectorAll('.slider_item');
          const itemCount = items.length;
          const lastMargin = parseInt(getComputedStyle(items[itemCount - 1]).getPropertyValue('margin-right'));
          const sliderWidth = slider.scrollWidth + lastMargin;
          const viewWidth = slider.offsetWidth;

          // Slider action close due to not being lengthy enough...
          if (sliderWidth - lastMargin <= viewWidth) return false;
          const last_transform_value = sliderWidth - viewWidth;
          console.log(!wraper.querySelector('.pt_slider_navigator'))
          if(!wraper.querySelector('.pt_slider_navigator')){
               const tempContainer = document.createElement('div');
               const htmlSinppet = '<div class="pt_slider_navigator"><div class="navigator_bullet"></div></div>';
               tempContainer.innerHTML = htmlSinppet;
               while (tempContainer.firstChild) {
                    wraper.appendChild(tempContainer.firstChild);
               }
          }
          console.log('last_transform_value :>> ', last_transform_value);
          const navigationBullet = wraper.querySelector('.navigator_bullet');
          const navigatorArea = wraper.querySelector('.pt_slider_navigator').clientWidth;
          let itemLength = 0;
          const itemObj = [];
          items.forEach((item, i) => {
               item.setAttribute('data-index', i);
               const itemWidth = item.offsetWidth;
               // const transformLength=Math.round(itemWidth);
               const styles = getComputedStyle(item);
               const m_l = parseInt(styles.getPropertyValue('margin-left'));
               const m_r = parseInt(styles.getPropertyValue('margin-right'));
               const m_t = parseInt(styles.getPropertyValue('margin-top'));
               const m_b = parseInt(styles.getPropertyValue('margin-bottom'));
               const tempObj = {
                    'index': i,
                    'm-l': m_l,
                    'm-r': m_r,
                    'm-t': m_t,
                    'm-b': m_b,
                    'itemWidth': itemWidth,
                    'innerText': item.textContent.trim(),
                    'transform': last_transform_value < itemLength ? -last_transform_value : -itemLength
               }
               itemLength += itemWidth + m_l + m_r;
               itemObj.push(tempObj);
          })
          console.log('itemObj :>> ', itemObj);
          const minNavWidth = Math.round((viewWidth / (sliderWidth)) * 100);
          navigationBullet.style.setProperty('width',`${minNavWidth}px`);
          const slidingLength = Math.round(itemObj[itemCount - 1].transform);
          const SlidingAbs = Math.abs(slidingLength);
          const navMovingArea = navigatorArea - minNavWidth;


          let startX, offsetX, newX, lastAbs, newAbs, navLength, lastX = 0, newPlacement = 0, navLengthAbs = 0, minDistance = 10;
          slider.addEventListener('mousedown', function (e) {
               startX = e.clientX;
               // offsetX = parseInt(this.css('left'), 10);
               offsetX = parseInt(getComputedStyle(this).getPropertyValue('left'));
               document.addEventListener('mousemove', dragSlider);
          });

          // Add mouseup event listener
          document.addEventListener('mouseup', function () {
               // Remove the mousemove event listener
               lastX = newX;
               newPlacement = parseInt(getComputedStyle(slider).getPropertyValue('--x-exis'));
               if (newPlacement > 0) {
                    slider.style.setProperty('--x-exis', '0px');
                    newPlacement = lastX = 0;
               } else if (newPlacement < slidingLength) {
                    slider.style.setProperty('--x-exis', slidingLength + 'px');
                    newPlacement = lastX = slidingLength;
               }

               document.removeEventListener('mousemove', dragSlider);
          });

          // Function to handle dragging
          function dragSlider(e) {
               // if(navMovingArea<0){navigationBullet.hide();return false}
               newX = offsetX + e.clientX - startX;
               lastAbs = Math.abs(lastX); newAbs = Math.abs(newX);
               const checkValue = lastAbs > newAbs ? lastAbs - newAbs : newAbs - lastAbs;
               if (checkValue > minDistance) {
                    navLength = Math.round(newPlacement + newX);
                    slider.style.setProperty('--x-exis', navLength + 'px');
                    navLengthAbs = Math.abs(navLength);
                    if (navLength <= 0 && navLengthAbs <= SlidingAbs) {
                         const navWidth = Math.round(navLengthAbs * navMovingArea / SlidingAbs + minNavWidth);
                         navigationBullet.style.setProperty('width', navWidth + 'px');
                    }
                    // console.log('newX :>> ', minNavWidth);
               }
          }
     }
}