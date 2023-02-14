import { root } from '../../config';
import gsap, { ScrollTrigger, TweenLite} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class GreenInnovation {
  /**
   * Create a GreenInnovation
   * @class GreenInnovation
   * @param {Element} target - 생성 타겟
   * @description green-innovation 영역
   */
  constructor(target) {
    const el = {
      target : target,
      kv : null
    };

    const selector = {
      kv : '.green-innovation-kv'
    };

    const bind = () => {
      methods.buildMotion();
    };

    const unbind = () => {
      TweenLite.killTweensOf(el.target);
    };

    const setProperty = () => {
      el.kv = el.target.querySelector(selector.kv);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof GreenInnovation
   * @description GreenInnovation 인스턴스 재생성
   */  
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    const methods = {
      //green-innovation-kv 영역이 화면에 나타나면 motion-on 클래스 추가
      buildMotion: () => {
        let hKv = el.kv.clientHeight;
        ScrollTrigger.create({
          trigger: el.kv,
          start: `top-=${hKv} bottom`,
          onEnter: () => {
            el.kv.classList.add('motion-on');
          }
        });
      }
    };
    
    init();

    this.reInit = reInit;
  }
}

export const greenInnovationController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GreenInnovation(el));
      }
    });
  }
};