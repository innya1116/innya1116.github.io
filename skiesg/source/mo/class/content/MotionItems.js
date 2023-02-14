import { mvJs, root } from '../../config';
import gsap, { ScrollTrigger, TweenLite} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class KeyVisualFull {
  constructor(target) {
    const el = {
      target,
      motionItem: null,
      header: null,
      tabIcon: null
    };

    const selector = {
      motionItem: '.motion-item',
      header: 'header.header',
      tabIcon: 'div.icon-tab'
    };

    const setProperty = () => {
      el.motionItem = target.querySelectorAll(selector.motionItem);
      el.header = document.querySelector(selector.header);
      el.tabIcon = document.querySelector(selector.tabIcon);
    };

    const methods = {
      buildMotion: () => {        
        gsap.fromTo(target, {backgroundSize: '125% 125%'}, { duration: 1.5, 
          backgroundSize: '100% 100%'});

        if (!el.motionItem) {
          return;
        }

        el.motionItem.forEach(eleme => {
          let obj = root.weakMap.get(eleme);
          if (!obj) {
            root.weakMap.set(eleme, new MotionItem(eleme));
          }
        });
  

        if (el.tabIcon) {
          ScrollTrigger.create({
            trigger: el.target,
            start: 'bottom top',
            onEnter: () => {
              el.tabIcon.classList.add('icon-tab--fixed');
            },
            onEnterBack: () => {
              el.tabIcon.classList.remove('icon-tab--fixed');
            }
          });
        }
      }
    };

    const bind = () => {
      methods.buildMotion();
      if (el.header) {
        el.header.classList.add('header--transparent');
      }
    };
    const unbind = () => {
      el.motionItem.forEach(eleme => {
        TweenLite.killTweensOf(eleme);
      });
    };

    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    const init = () => {
      setProperty();
      bind();
    };

    init();

    this.reInit = reInit;
  }
}

class MotionItem {
  constructor(target) {
    const el = {
      target
    };
    // eslint-disable-next-line no-unused-vars
    const selector = {};
    const setProperty = () => {};
    let motion;
    const methods = {
      setMotion: () => {
        let fixed = el.target.closest('.fixed-slide');
        if (!fixed) {
          fixed = el.target.closest('.green-slide');
        }
        if (fixed) {
          if (window.scrollY > 0) {
            if (fixed.classList.contains('is-fixed')) {
              motion = ScrollTrigger.create({
                trigger: el.target,
                start: 'top +=' + window.scrollY + ' bottom',
                end: 'bottom +=' + window.scrollY + ' top',
                onEnter: () => {
                  gsap.to(el.target, { 
                    y: 0, 
                    opacity: 1, 
                    duration: root.tweenSpeed 
                  });
                },
                onLeaveBack: () => {
                  gsap.set(el.target, {
                    y: 100,
                    opacity: 0 
                  });
                }
              });
            } else {
              const top = window.scrollY + el.target.getBoundingClientRect().top;
              motion = ScrollTrigger.create({
                trigger: el.target,
                start: 'top +=' + top + ' bottom',
                end: 'bottom +=' + top + ' top',
                onEnter: () => {
                  gsap.to(el.target, { 
                    y: 0, 
                    opacity: 1, 
                    duration: root.tweenSpeed 
                  });
                },
                onLeaveBack: () => {
                  gsap.set(el.target, {
                    y: 100,
                    opacity: 0 
                  });
                }
              });
            }
          } else {
            motion = ScrollTrigger.create({
              trigger: el.target,
              start: 'top bottom',
              end: 'bottom top',
              onEnter: () => {
                gsap.to(el.target, { 
                  y: 0, 
                  opacity: 1, 
                  duration: root.tweenSpeed 
                });
              },
              onLeaveBack: () => {
                gsap.set(el.target, {
                  y: 100,
                  opacity: 0 
                });
              }
            });
          }
          
        } else {
          motion = ScrollTrigger.create({
            trigger: el.target,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => {
              gsap.to(el.target, { 
                y: 0, 
                opacity: 1, 
                duration: root.tweenSpeed 
              });
              // gsap.fromTo(el.target, { y: 100, opacity: 0 }, { y: 0, opacity: 100, duration: root.tweenSpeed});
            },
            onLeaveBack: () => {
              gsap.set(el.target, {
                y: 100,
                opacity: 0 
              });
            }
          });
        }

        gsap.set(el.target, {
          y: 100,
          opacity: 0,
          display: () => {
            const types = ['em', 'span'];
            if (types.includes(el.target.tagName.toLowerCase())) {
              return 'block';
            }
          }
        });

      }
    };

    const handler = {
      resize: () => {
        unbind();
        methods.setMotion();
      }
    };
    const bind = () => {
      if (el.target) {
        methods.setMotion();
        window.addEventListener('resize', handler.resize);
      }
    };

    const unbind = () => {
      // TweenLite.killTweensOf(el.target);
      motion.kill();
    };

    const init = ()=> {
      setProperty();
      bind();
    };
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    init();
    this.reInit = reInit;
  }
}

export const motionController = {
  init: (selector) => {
    motionController.motionItem.init(selector);
  },

  keyVisual: {
    init: (selector) => {
      [... document.querySelectorAll(selector)].forEach((el) => {
        const obj = root.weakMap.get(el);
  
        if (obj) {
          obj.reInit();
        } else {
          root.weakMap.set(el, new KeyVisualFull(el));
        }
      });
    }
  },
  motionItem: {
    init: (selector) => {
      [... document.querySelectorAll(selector)].forEach((el, index) => {
        let obj, para;
        obj = root.weakMap.get(el);
        if (obj) {
          if (el.classList.contains('bg-motion-item')) {
            para = document.createElement('div');
            para.appendChild(el.cloneNode(true));
            para.setAttribute('motion-item-parent', index);
            obj = root.weakMap.get(para);
            if (!obj) {
              root.weakMap.set(para, new MotionItem(el));
            } else {
              obj.reInit();
            }
          } else {
            obj.reInit();
          }
        } else {
          root.weakMap.set(el, new MotionItem(el));
        }
      });
    }
  }
};

/**
 * @namespace motionitems
 * @alias mvJS.motionitems
 * @memberof mvJs
 * @description 툴팁 제어
 */
mvJs.motionitems = {};
/**
  * @param {String} selector - element selector
  * @memberof overview
  * @function init
 **/
mvJs.motionitems.init = motionController.init;
mvJs.motionitems.keyVisualInit = motionController.keyVisual.init;