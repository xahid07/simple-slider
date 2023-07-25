jQuery(function($){
    const wraper=$('.slider-wraper');
    wraper.find('ul').addClass('pt-slider');
    // wraper.children().first().addClass('pt-slider');
    const wraperId=wraper.attr('id');
    const slider=$('.pt-slider',`#${wraperId}`);
    const items=slider.find('.slider_item');
    const itemCount=items.length;
    const sliderWidth=slider.get(0).scrollWidth;
    const viewWidth=slider.width();
    const last_transform_value=sliderWidth - viewWidth + (itemCount / 2);
    const navigationBullet=$('.pt-slider-navigator .navigator-bullet',`#${wraperId}`);
    const navigatorArea=$('.pt-slider-navigator').width();

    // console.log('sliderWidth :>> ', sliderWidth,last_transform_value);

    let itemLength=0;
    const itemObj=[];
    items.each((i,t)=>{
        const item=$(t);
        item.attr('data-index',i);
        const itemWidth=Number(item.outerWidth().toFixed(3));
        // const transformLength=Math.round(itemWidth);
        const m_l=parseInt(item.css('margin-left'));
        const m_r=parseInt(item.css('margin-right'));
        const m_t=parseInt(item.css('margin-top'));
        const m_b=parseInt(item.css('margin-bottom'));
        // console.log('transformLength :>> ', transformLength,itemWidth);
        const tempObj={
            'index'     :i,
            'm-l'       :m_l,
            'm-r'       :m_r,
            'm-t'       :m_t,
            'm-b'       :m_b,
            'itemWidth' :itemWidth,
            'innerText' :item.text(),
            'transform' :last_transform_value<itemLength?-last_transform_value:-Number(itemLength.toFixed(3))
        }
        itemLength+=itemWidth+m_l+m_r;
        itemObj.push(tempObj);
    })
    const minNavWidth = Math.round((viewWidth/sliderWidth)*100);
    navigationBullet.css('width',`${minNavWidth}px`);
    // const fullNavWidth = navigationBullet.width();
    const slidingLength = itemObj[itemCount-1].transform;
    const SlidingAbs=Math.abs(slidingLength);
    const navMovingArea=navigatorArea-minNavWidth;
    // console.log('itemLength :>> ',viewWidth,'last_transform_value :>> ',last_transform_value,'minNavWidth :>> ',minNavWidth, 'navigatorArea :>> ',navigatorArea,'navMovingArea :>> ',navMovingArea);


      
      ////////////////////////////////////////////////////////////////
      let startX, offsetX,newX,lastAbs,newAbs,navLength,lastX=0,newPlacement=0,navLengthAbs=0;
      // Minimum distance required for a swipe gesture
      let minDistance = 10;
      slider.on('mousedown', function(e) {
        startX = e.clientX;
        offsetX = parseInt(slider.css('left'), 10);
        // console.log(startX, offsetX);
        // if (newX>minDistance)
        $(document).on('mousemove', dragSlider);
      });

      // Add mouseup event listener
      $(document).on('mouseup', function() {
        // Remove the mousemove event listener
        lastX = newX;
        newPlacement=parseInt(slider.css('--x-exis'),10);
        if (newPlacement>0){
          slider.css('--x-exis','0px');
          newPlacement=lastX=0;
        }else if (newPlacement<slidingLength){
          slider.css('--x-exis',slidingLength+'px');
          newPlacement=lastX=slidingLength;
        }

        $(document).off('mousemove', dragSlider);
      });

      // Function to handle dragging
      function dragSlider(e) {
        // if(navMovingArea<0){navigationBullet.hide();return false}
        newX = offsetX + e.clientX - startX;
        lastAbs=Math.abs(lastX);newAbs=Math.abs(newX);
        const checkValue=lastAbs>newAbs?lastAbs-newAbs:newAbs-lastAbs;
        if (checkValue>minDistance){
          navLength=newPlacement+newX;
          slider.css('--x-exis',navLength+'px');
          navLengthAbs=Math.abs(navLength);
          if(navLength<=0 && navLengthAbs<=SlidingAbs){
            const navWidth = Math.round(navLengthAbs*navMovingArea/SlidingAbs+minNavWidth);
            navigationBullet.css('width',navWidth+'px');
          }
          // console.log('newX :>> ', minNavWidth);
        }
      }
})                 