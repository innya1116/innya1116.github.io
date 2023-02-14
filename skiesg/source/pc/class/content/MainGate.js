import { mvJs, root } from '../../config';

class MainGate {
  /**
   * Create a MainGate
   * @class MainGate
   * @param {Element} target - 생성 타겟
   * @description MainGate 메뉴 활성화 class
   */
  constructor(target) {
    const el = {
      target        :   target,
      mainGate      :   null,
      mainLinks     :   null,
      activeLink    :   null
    };

    const selector = {
      mainGate      : '.main-gate',
      mainLinks     : '.main-gate__item',
      activeLink    : '.is-expand'
    };

    const className = {
      growth        :   'main-gate__item--growth',
      esgdata       :   'main-gate__item--esgdata'
    };

    const handler = {
      /**
       * @callback enter
       * @memberof MainGate
       * @description hover 되는 항목, is-expand 클래스 추가 다른 항목 is-shrink 클래스 추가
      */
      enter: (evt) => {        
        [...el.mainLinks].forEach(element => {
          if (element === evt.target) {
            element.classList.add('is-expand');
            element.classList.remove('is-shrink');
          } else {
            element.classList.remove('is-expand');
            element.classList.add('is-shrink');
          }
          method.setMenuClass();
        });
      },
      leave: (evt) => {
        [...el.mainLinks].forEach(element => {
          if (element === evt.target) {
            element.classList.add('is-shrink');
            element.classList.remove('is-expand');
          } else {
            element.classList.remove('is-shrink');
            element.classList.add('is-expand');
          }
        });

      },
      leaveFromTarget: () => {
        [...el.mainLinks].forEach(element => {        
          element.classList.remove('is-expand');
          element.classList.remove('is-shrink');
        });
        el.mainGate.classList.remove('is-left-expand');
        el.mainGate.classList.remove('is-right-expand');

        // evt.type === 'focusout' && evt.target.classList.contains(className.esgdata) ? document.querySelector('.esg-logo>a').focus() : null;
      }
    };

    const bind = () => {
      [...el.mainLinks].forEach(element => {
        element.addEventListener('mouseenter', handler.enter);
        element.addEventListener('mouseleave', handler.leave);
        element.addEventListener('focusin', handler.enter);
        element.addEventListener('focusout', handler.leave);
      });
      el.target.addEventListener('mouseleave', handler.leaveFromTarget);
      el.target.addEventListener('focusout', handler.leaveFromTarget);
    };

    const unbind = () => {
      [...el.mainLinks].forEach(element => {
        element.removeEventListener('mouseenter', handler.enter);
        element.removeEventListener('mouseleave', handler.leave);
        element.removeEventListener('focusin', handler.enter);
        element.removeEventListener('focusout', handler.leave);
      });
      el.target.removeEventListener('mouseleave', handler.leaveFromTarget);
      el.target.removeEventListener('focusout', handler.leaveFromTarget);
    };

    const setProperty = () => {      
      el.mainGate = el.target.querySelector(selector.mainGate);
      el.mainLinks = el.target.querySelectorAll(selector.mainLinks);
      el.activeLink = el.target.querySelector(selector.activeLink);
    };

    
    const method = {
      setMenuClass: () => {
        el.activeLink = el.target.querySelector(selector.activeLink);
        if (el.activeLink) {
          el.activeLink.classList.contains(className.growth) ? (el.mainGate.classList.add('is-left-expand'), el.mainGate.classList.remove('is-right-expand')) : (el.mainGate.classList.add('is-right-expand'), el.mainGate.classList.remove('is-left-expand'));
        }
      }
    };

    const init = () => {

      setProperty();

      bind();

    };

    /**
   * @function reInit
   * @memberof MainGate
   * @description MainGate 인스턴스 재생성
   */  
    const reInit = () => {

      unbind();

      setProperty();

      bind();
      
    };
    
    init();

    this.reInit = reInit;
  }
}

export const mainGateController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new MainGate(el));
      }
    });
  }
};

/**
 * @namespace mainGate
 * @alias mvJS.mainGate
 * @memberof mvJs
 * @description MainGate 메뉴 활성화
 */
mvJs.mainGate = {};
/**
 * @param {String} selector - element selector
 * @memberof mainGate
 * @function init
 * @description MainGate 인스턴스 생성
**/
mvJs.mainGate.init = mainGateController.init;