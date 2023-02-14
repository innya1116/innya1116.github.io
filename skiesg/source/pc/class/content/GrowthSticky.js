import { mvJs, root } from '../../config';

class GrowthSticky {
  /**
   * Create a GrowthSticky
   * @class GrowthSticky
   * @param {Element} target - 생성 타겟
   * @description Growth Sticky 영역 스크롤 시 클래스 추가
   */
  constructor(target) {
    const el = {
      target      :   target
    };

    const handler = {
      /**
       * @callback setScrollClass
       * @memberof GrowthSticky
       * @description .growth-sticky--scroll 클래스 추가/삭제
      */
      setScrollClass: () => {
        let distanceFromViewport = el.target.getBoundingClientRect().top;

        distanceFromViewport < 80 ? el.target.classList.add('growth-sticky--scroll') : el.target.classList.remove('growth-sticky--scroll');
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

      handler.setScrollClass();

    };

    /**
   * @function reInit
   * @memberof GrowthSticky
   * @description GrowthSticky 인스턴스 재생성
   */
    const reInit = () => {

      unbind();

      bind();

      handler.setScrollClass();

    };

    init();

    this.reInit = reInit;
  }
}

export const growthStickyController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GrowthSticky(el));
      }
    });
  }
};

/**
 * @namespace growthSticky
 * @alias mvJS.growthSticky
 * @memberof mvJs
 * @description GrowthSticky 영역 활성화
*/
mvJs.growthSticky = {};
/**
 * @param {String} selector - element selector
 * @memberof growthSticky
 * @function init
 * @description GrowthSticky 인스턴스 생성
**/
mvJs.growthSticky.init = growthStickyController.init;