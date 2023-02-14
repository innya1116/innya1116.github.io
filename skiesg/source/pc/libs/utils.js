import { gsap, Power2 } from 'gsap/all';

export const utils = {
  tweenScroll: {
    pos: 0,
    go: (pos, speed, complete = null) => {
      utils.tweenScroll.pos = window.pageYOffset;
      gsap.killTweensOf(utils.tweenScroll);

      gsap.to(utils.tweenScroll, speed, {
        pos: pos,
        ease: Power2.easeOut,
        overwrite: true,
        onUpdate: () => {
          window.scrollTo(0, utils.tweenScroll.pos);
        },
        onComplete: () => {
          window.scrollTo(0, utils.tweenScroll.pos);
          
          if (complete) {
            complete();
          }
        }
      });
    }
  },
  getIndex(el) {
    if (!el.parentNode) {
      return -1;
    }
    let list = el.parentNode.children;
  
    if (!list) {
      return -1;
    }
    
    let indexof = [].indexOf;

    let len = list.length;
  
    if (indexof) {
      return indexof.call(list, el);
    }

    for (let i = 0; i < len; ++i) {
      if (el === list[i]) {
        return i;
      }
    }
    
    return -1;
  },
  
  trigger(el, event, otions = null) {
    const evt = otions ? new CustomEvent(event, otions) : new CustomEvent(event);
    el.dispatchEvent(evt);
  },
  /**
   * @alias utils.isMobile
   * @param {Boolean} value - true: Mobile, false: PC
   * @description 화면 사이즈가 아닌 device 체크
   */
  isDeviceMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * @description 스크롤 제어 관련 오브젝트
   */
  wheelControl: {
    lock: () => {
      utils.scrollObj.lock = true;
    },

    unLock: () => {
      utils.scrollObj.lock = false;
    },

    init: () => {
      // console.log('wheel control init ');
      utils.wheelControl.bind();
    },

    bind: () => {
      const wrapper = utils.scrollObj.wrapper;
      wrapper.addEventListener('mousewheel', utils.wheelControl.handler.scroll, false);
      wrapper.addEventListener('wheel', utils.wheelControl.handler.scroll, false);

      window.addEventListener('DOMMouseScroll', utils.wheelControl.handler.scroll, false);
      window.addEventListener('scroll', utils.wheelControl.handler.scroll, false);
    },

    unBind: () => {
      const wrapper = utils.scrollObj.wrapper;
      wrapper.removeEventListener('mousewheel', utils.wheelControl.handler.scroll, false);
      wrapper.removeEventListener('wheel', utils.wheelControl.handler.scroll, false);

      window.addEventListener('DOMMouseScroll', utils.wheelControl.handler.scroll, false);
      window.removeEventListener('scroll', utils.wheelControl.handler.scroll, false);
    },

    handler: {
      scroll: event => {
        if (utils.scrollObj.lock) {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (gsap.getTweensOf(utils.tweenScroll).length) {
            scrollTop = utils.tweenScroll.pos;
          }

          window.scrollTo(0, scrollTop);

          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
    }
  },

  setAttributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  },

  isPc() {
    let value = false;
    const moSize = 767;
    if (moSize < window.innerWidth) {
      value = true;
    }
    return value;
  },

  keyCode: {
    ENTER: 13,
    SPACE: 32,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  }
};