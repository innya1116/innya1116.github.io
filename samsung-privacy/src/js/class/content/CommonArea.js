import { root } from '../../config';
import { utils } from '../../libs/utils';
// PerfectScrollbar
import PerfectScrollbar from 'perfect-scrollbar';

class CommonArea {
  /**
   * Create a CommonArea
   * @class CommonArea
   * @param {Element} target - 생성 타겟
   * @description accordion 생성
   */
  constructor(target) {
    let timeout = 0;
    let scrollArr = [];
    const contentFixedWidth = 'width=768';
    const contentDeviceWidth = 'width=device-width,initial-scale=1.0,minimum-scale=1.0';

    // eslint-disable-next-line no-unused-vars
    const el = { doc: target};

    // eslint-disable-next-line no-unused-vars
    const selector = {};

    const hander = {
      resize: () => {
        if (utils.isPc()) {
          scrollArr.forEach((element) => {
            const obj = root.weakMap.get(element);
            const eY = element.classList.contains('scroll-area');
            const ex = element.classList.contains('scroll-x');

            if (utils.isPc()) {
              if (ex) {
                if (!obj) {
                  root.weakMap.set(element, {x: new PerfectScrollbar(element)});
                } else {
                  if (obj.x) {
                    obj.x.update();
                  } else {
                    if (obj.x) {
                      obj.x.destroy();
                    }

                    obj.x = new PerfectScrollbar(element);
                    root.weakMap.set(element, obj);
                  }
                }
              }
              
              if (eY) {
                if (!obj) {
                  root.weakMap.set(element, {y: new PerfectScrollbar(element)});
                } else {
                  if (obj.y) {
                    obj.y.update();
                  } else {
                    if (obj.y) {
                      obj.y.destroy();
                    }

                    obj.y = new PerfectScrollbar(element);
                    root.weakMap.set(element, obj);
                  }
                }
              }
            }            
          });
        } else {
          scrollArr.forEach((element) => {
            const obj = root.weakMap.get(element);

            if (!obj) {
              return;
            }

            if (obj.x) {
              obj.x.destroy();
              obj.x = null;
            } 
    
            if (obj.y) {
              obj.y.destroy();
              obj.y = null;
            }

            root.weakMap.set(element, obj);
          });
        }
      },

      setResponsive: () => {
        const el = document.querySelector('meta[name="viewport"]');
        const content = el.getAttribute('content');
        hander.resize();

        if (window.outerWidth < 768 && window.outerWidth > 534 || window.outerWidth > window.outerHeight &&(window.outerWidth >= 768 && window.innerWidth < 768)) {
          if (content !== contentFixedWidth) {
            el.setAttribute('content', contentFixedWidth);
            timeout = 0;
            
            requestAnimationFrame(() => hander.checkResize(true));
          }
        } else if (!(window.outerWidth > window.outerHeight && content === contentFixedWidth)) {
          if (content !== contentDeviceWidth) {

            el.setAttribute('content', contentDeviceWidth);
            timeout = 0;

            requestAnimationFrame(() => hander.checkResize(false));
          }
        }
      },

      checkResize: (isFixed) => {
        if (isFixed) {
          if (timeout > 60 || window.innerWidth === 768) {
            utils.trigger(window.document, 'resize');
  
          } else {
            timeout++;
            requestAnimationFrame(() => hander.checkResize(isFixed));
          }
        } else {
          if (timeout > 60 || window.innerWidth !== 768) {
            utils.trigger(window.document, 'resize');
  
          } else {
            timeout++;
            requestAnimationFrame(() => hander.checkResize(isFixed));
          }
        }
      },

      checkOuterWidth: (width) => {
        if (window.outerWidth !== width || timeout >= 120) {
          hander.setResponsive();
        } else {
          timeout++;
          width = window.outerWidth;
          requestAnimationFrame(() => hander.checkOuterWidth(width));
        }
      },

      orientationchange() {
        timeout = 0;
        hander.checkOuterWidth(window.outerWidth);
      }
    };

    const setProperty = () => {
      // scroll-y
      [... document.querySelectorAll('.scroll-area')].forEach(element => {
        scrollArr.push(element);
      });
  
      // scroll-x
      [... document.querySelectorAll('.scroll-x')].forEach(element => {
        scrollArr.push(element);
      });
    };

    const bind = () => {
      window.addEventListener('resize', hander.setResponsive);
      window.addEventListener('orientationchange', hander.orientationchange);
    };

    const unbind = () => {
      window.removeEventListener('resize', hander.setResponsive);
      window.removeEventListener('orientationchange', hander.orientationchange);
    };
    
    const init = () => {
      setProperty();

      bind();
    };

    const reInit = () => {
      unbind();

      scrollArr = [];

      setProperty();

      bind();
    };

    const load = () => {
      scrollArr.forEach((element) => {
        const obj = root.weakMap.get(element);

        if (!obj) {
          return;
        }

        if (obj.x) {
          obj.x.update();
        }

        if (obj.y) {
          obj.y.update();
        }
      });
    };

    init();

    this.load = load;
    this.reInit = reInit;
  }
}

//  Accordion  생성
export const commonAreaController = {
  init: (target) => {
    const obj = root.weakMap.get(target);

    if (obj) {
      obj.reInit();
    } else {
      root.weakMap.set(target, new CommonArea(target));
    }

  },

  load: (target) => {
    root.weakMap.get(target).load();
  }
};