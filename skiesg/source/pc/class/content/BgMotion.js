import { root } from '../../config';
import gsap, { ScrollTrigger, TweenLite} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class BgMotion {
  /**
   * Create a BgMotion
   * @class BgMotion
   * @param {Element} target - 생성 타겟
   * @description bg-motion-item 클래스가 있는 영역 모션
   */
  constructor(target) {
    const el = {
      target      :   target
    };

    const bind = () => {
      methods.buildMotion();
    };

    const unbind = () => {
      TweenLite.killTweensOf(el.target);
    };

    const init = () => {
      bind();
    };

    /**
   * @function reInit
   * @memberof BgMotion
   * @description BgMotion 인스턴스 재생성
   */
    const reInit = () => {
      unbind();
      bind();
    };

    const methods = {
      buildMotion: () => {
        ScrollTrigger.create({
          trigger: el.target,
          start: 'top bottom',
          end: 'top bottom',
          onEnter: () => {
            gsap.fromTo(el.target, {backgroundSize: '160% 160%'}, { duration: 2,
              backgroundSize: '100% 100%'});
          }
        });
      }
    };

    init();

    this.reInit = reInit;
  }
}

export const bgMotionController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new BgMotion(el));
      }
    });
  }
};