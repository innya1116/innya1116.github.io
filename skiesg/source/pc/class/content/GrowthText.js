import { root } from '../../config';
import { utils } from '../../libs/utils';

class GrowthText {
  /**
   * Create a GrowthText
   * @class GrowthText
   * @param {Element} target - 생성 타겟
   * @description 마우스 스크롤 이벤트 발생 시 motion-on 클래스 추가 및 2.5초 동안 마우스 스크롤 이벤트 막기
   */
  constructor(target) {
    const el = {
      target : target
    };

    const duration = 2500;

    const handler = {
      scroll: (event) => {        
        if (utils.scrollObj.lock && event.target.closest && event.target.closest('.growth-keyvisual')) {
          event.preventDefault();
          event.stopPropagation();

          if (el.target.classList.contains('motion-on')) {
            return;
          }

          el.target.classList.add('motion-on');
          setTimeout(() => utils.wheelControl.unLock(), duration);
          
          return;
        }
      }
    };

    const bind = () => {
      const wrapper = utils.scrollObj.wrapper;
      wrapper.addEventListener('mousewheel', handler.scroll);
      wrapper.addEventListener('wheel', handler.scroll);
      window.addEventListener('DOMMouseScroll', handler.scroll);
      window.addEventListener('scroll', handler.scroll);
      utils.wheelControl.lock();
    };

    const unbind = () => {
      const wrapper = utils.scrollObj.wrapper;
      wrapper.removeEventListener('mousewheel', handler.scroll);
      wrapper.removeEventListener('wheel', handler.scroll);
      window.removeEventListener('DOMMouseScroll', handler.scroll);
      window.removeEventListener('scroll', handler.scroll);
      utils.wheelControl.unLock();
    };

    const init = () => {
      bind();
    };

    /**
   * @function reInit
   * @memberof GrowthText
   * @description GrowthText 인스턴스 재생성
   */  
    const reInit = () => {
      unbind();
      bind();
    };
    
    init();

    this.reInit = reInit;
  }
}

export const growthTextController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GrowthText(el));
      }
    });
  }
};