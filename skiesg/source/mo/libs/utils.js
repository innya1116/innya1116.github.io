const dynamicListenerHandlers = [];
const getConditionalCallback = (selector, callback) => {
  return function(e) {
    if (e.target && e.target.matches(selector)) {
      e.delegatedTarget = e.target;
      callback.apply(this, arguments);
      return;
    }
    // Not clicked directly, check bubble path
    let path = event.path || (event.composedPath && event.composedPath());
    if (!path) {
      return;
    }
    for (let i = 0; i < path.length; ++i) {
      let el = path[i];
      if (el.matches(selector)) {
        // Call callback for all elements on the path that match the selector
        e.delegatedTarget = el;
        callback.apply(this, arguments);  
      }
      // We reached parent node, stop
      if (el === e.currentTarget) {
        return;
      }
    }
  };
};
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
  },

  addDynamicEventListener(rootSelector, eventType, selector, callback, options) {
    let rootElement = document.body;
    if (rootSelector !== 'body') {
      rootElement = document.querySelector(rootSelector);
    }

    let cb = getConditionalCallback(selector, callback);    
    rootElement.addEventListener(eventType, cb, options);

    if (!dynamicListenerHandlers[selector + ' ' + eventType]) {
      dynamicListenerHandlers[selector + ' ' + eventType] = cb;
    }
  },

  removeDynamicEventListener(rootSelector, eventType, selector) {    
    let handler = dynamicListenerHandlers[`${selector} ${eventType}`];

    let rootElement = document.body;
    if (rootSelector !== 'body') {
      rootElement = document.querySelector(rootSelector);
    }

    rootElement.removeEventListener(eventType, handler);
  },

  leftPad(value) {
    if (value >= 10) {
      return value;
    }

    return `0${value}`;
  },

  toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = utils.leftPad(source.getMonth() + 1);
    const day = utils.leftPad(source.getDate());

    return [year, month, day].join(delimiter);
  }
};