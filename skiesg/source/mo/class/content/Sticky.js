import { mvJs, root } from '../../config';

class Sticky {
  /**
   * Create a Sticky
   * @class Sticky
   * @param {Element} target - 생성 타겟
   * @description Sticky 영역 스크롤 시 클래스 추가
   */
  constructor(target) {
    const el = {
      target      :   target
    };

    const handler = {
      /**
       * @callback setScrollClass
       * @memberof Sticky
       * @description .dashboard-sticky--scroll 클래스 추가/삭제
      */
      setScrollClass: () => {
        let distanceFromViewport = el.target.getBoundingClientRect().top;
        distanceFromViewport < 0 ? el.target.classList.add('dashboard-sticky--scroll') : el.target.classList.remove('dashboard-sticky--scroll');
      }
    };

    const bind = () => {
      window.addEventListener('scroll', handler.setScrollClass);
    };

    const unbind = () => {
      window.removeEventListener('scroll', handler.setScrollClass);
    };

    const init = () => {

      bind();

    };

    /**
   * @function reInit
   * @memberof Sticky
   * @description Sticky 인스턴스 재생성
   */  
    const reInit = () => {

      unbind();

      bind();
      
    };
    
    init();

    this.reInit = reInit;
  }
}

export const stickyController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new Sticky(el));
      }
    });
  }
};

/**
 * @namespace sticky
 * @alias mvJS.sticky
 * @memberof mvJs
 * @description Sticky 영역 활성화
*/
mvJs.sticky = {};
/**
 * @param {String} selector - element selector
 * @memberof sticky
 * @function init
 * @description Sticky 인스턴스 생성
**/
mvJs.sticky.init = stickyController.init;