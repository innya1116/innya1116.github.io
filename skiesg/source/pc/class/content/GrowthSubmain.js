import { mvJs, root } from '../../config';

class GrowthSubmain {
  /**
   * Create a GrowthSubmain
   * @class GrowthSubmain
   * @param {Element} target - 생성 타겟
   * @description Growth Submain Header 영역 스크롤 시 클래스 추가
   */
  constructor(target) {
    const el = {
      target : target,
      header : null
    };

    const selector = {
      header : 'header.header'
    }

    const handler = {
      /**
       * @callback setScrollClass
       * @memberof GrowthSubmain
       * @description .header--transparent 클래스 추가/삭제
      */
      setScrollClass: () => {
        let scrollWin = window.pageYOffset;

        scrollWin > 0 ? el.header.classList.remove('header--transparent') : el.header.classList.add('header--transparent');
      }
    };

    const bind = () => {
      window.addEventListener('scroll', handler.setScrollClass);
    };

    const unbind = () => {
      window.removeEventListener('scroll', handler.setScrollClass);
    };

    const setProperty = () => {
      el.header = document.querySelector(selector.header);
    };

    const init = () => {
      setProperty();
      bind();
      handler.setScrollClass();
    };

    /**
   * @function reInit
   * @memberof GrowthSubmain
   * @description GrowthSubmain 인스턴스 재생성
   */
    const reInit = () => {
      unbind();
      setProperty();
      bind();
      handler.setScrollClass();
    };

    init();
    this.reInit = reInit;
  }
}

export const growthSubmainController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GrowthSubmain(el));
      }
    });
  }
};

/**
 * @namespace growthSubmain
 * @alias mvJS.growthSubmain
 * @memberof mvJs
 * @description GrowthSubmain 영역 활성화
*/
mvJs.growthSubmain = {};
/**
 * @param {String} selector - element selector
 * @memberof growthSubmain
 * @function init
 * @description GrowthSubmain 인스턴스 생성
**/
mvJs.growthSubmain.init = growthSubmainController.init;