import { mvJs, root } from '../../config';

class Gateway {
  /**
   * Create a Gateway
   * @class Gateway
   * @param {Element} target - 생성 타겟
   * @description Gateway 메뉴 활성화 class
   */
  constructor(target) {
    const el = {
      target        :   target,
      gatewayMenu   :   null,
      gatewayLinks  :   null,
      activeLink    :   null
    };

    const selector = {
      gatewayMenu   :   '.gateway__menu',
      gatewayLinks  :   '.gateway__link',
      activeLink    :   '.expand'
    };

    const className = {
      monitoring    :   'gateway__link--monitoring',
      assessment    :   'gateway__link--assessment'
    };

    const handler = {
      /**
       * @callback mouseEnter
       * @memberof Gateway
       * @description hover 시 .expand 추가, 나머지 a.gateway__link .reduce 추가
      */
      mouseEnter: (evt) => {        
        [...el.gatewayLinks].forEach(element => {
          if (element === evt.target) {
            element.classList.add('expand');
            element.classList.remove('reduce');
          } else {
            element.classList.remove('expand');
            element.classList.add('reduce');
          }
          method.setMenuClass();
        });
      },
      mouseLeave: (evt) => {
        [...el.gatewayLinks].forEach(element => {
          if (element === evt.target) {
            element.classList.add('reduce');
            element.classList.remove('expand');
          } else {
            element.classList.remove('reduce');
            element.classList.add('expand');
          }
        });
      },
      mouseLeaveFromTarget: () => {
        [...el.gatewayLinks].forEach(element => {        
          element.classList.remove('expand');
          element.classList.remove('reduce');
        });
        el.gatewayMenu.classList.remove('left');
        el.gatewayMenu.classList.remove('right');
      }
    };

    const bind = () => {
      [...el.gatewayLinks].forEach(element => {
        element.addEventListener('mouseenter', handler.mouseEnter);
        element.addEventListener('mouseleave', handler.mouseLeave);
      });
      el.target.addEventListener('mouseleave', handler.mouseLeaveFromTarget);
    };

    const unbind = () => {
      [...el.gatewayLinks].forEach(element => {
        element.removeEventListener('mouseenter', handler.mouseEnter);
        element.removeEventListener('mouseleave', handler.mouseLeave);
      });
    };

    const setProperty = () => {      
      el.gatewayMenu = el.target.querySelector(selector.gatewayMenu);
      el.gatewayLinks = el.target.querySelectorAll(selector.gatewayLinks);
      el.activeLink = el.target.querySelector(selector.activeLink);
    };

    
    const method = {
      //div.gateway__menu 위치에 left/right 클래스가 추가/제거
      setMenuClass: () => {
        el.activeLink = el.target.querySelector(selector.activeLink);
        if (el.activeLink) {
          el.activeLink.classList.contains(className.monitoring) ? (el.gatewayMenu.classList.add('left'), el.gatewayMenu.classList.remove('right')) : (el.gatewayMenu.classList.add('right'), el.gatewayMenu.classList.remove('left'));
        }
      }
    };

    const init = () => {

      setProperty();

      bind();

    };

    /**
   * @function reInit
   * @memberof Gateway
   * @description Gateway 인스턴스 재생성
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

export const gatewayController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new Gateway(el));
      }
    });
  }
};

/**
 * @namespace gateway
 * @alias mvJS.gateway
 * @memberof mvJs
 * @description Gateway 메뉴 활성화
 */
mvJs.gateway = {};
/**
 * @param {String} selector - element selector
 * @memberof gateway
 * @function init
 * @description Gateway 인스턴스 생성
**/
mvJs.gateway.init = gatewayController.init;