import { root } from '../../config';
import { utils } from '../../libs/utils';
import { popupController } from '../../class/library/Popup';
// PerfectScrollbar
import PerfectScrollbar from 'perfect-scrollbar';


//  Accordion  생성
export const popupExtendController = {
  init: () => {
    const open = popupController.open;
    popupController.open = (selector) => {
      const el = document.querySelector(selector);
      if (!el) {
        return;
      }

      const scrollY = el.querySelector('.scroll-area');
      const scrollX = el.querySelector('.scroll-x');

      if (scrollX) {
        // if (!utils.isPc()) {
        //   return;
        // }

        if (utils.isPc()) {
          const obj = root.weakMap.get(scrollX);
          if (obj) {
            if (obj.x) {
              obj.x.update();
            } else {

              if (obj.x) {
                obj.x.destroy();
              }
              obj.x = new PerfectScrollbar(scrollX);
            }
          } else {
            root.weakMap.set(scrollX, {x: new PerfectScrollbar(scrollX)});
          }
        }
      }

      if (scrollY) {
        // if (!utils.isPc()) {
        //   return;
        // }
        if (utils.isPc()) {
          const obj = root.weakMap.get(scrollY);
          if (obj) {
            if (obj.y) {
              obj.y.update();
            } else {

              if (obj.y) {
                obj.y.destroy();
              }
              
              obj.y = new PerfectScrollbar(scrollY);
            }
          } else {
            root.weakMap.set(scrollY, {y: new PerfectScrollbar(scrollY)});
          }
        }
      }

      open(selector);
    };
  }
};

