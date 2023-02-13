import { mvJs, root } from '../../config';
import gsap, { ScrollTrigger, TweenLite} from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

class Main {
  /**
   * Create a Main
   * @class Main
   * @param {Element} target - 생성 타겟
   * @description main영역 스크립트
   */
  constructor(target) {
    const el = {
      target      :   target,
      gnb         :   null,
      motions     :   null
    };

    const selector = {
      gnb         :   '.gnb',
      motion      :   '.motion'
    };

    const handler = {
      /**
       * @callback winScroll
       * @memberof Main
       * @description 스크롤 하여 클래스 추가/제거
      */
      winScroll: (evt) => {
        //스크롤 top 값이 0인 경우에만 gnb--transparent 클래스 추가
        let scrollWin = evt.currentTarget.pageYOffset;
        scrollWin <= 0 ? el.gnb.classList.add('gnb--transparent') : el.gnb.classList.remove('gnb--transparent');
      }
    };

    const bind = () => {
      methods.setMotionClass();
      window.addEventListener('scroll', handler.winScroll);
    };

    const unbind = () => {

      if (el.motions) {
        el.motions.forEach(element => {
          TweenLite.killTweensOf(element);
        });
      }

      window.removeEventListener('scroll', handler.winScroll);
    };

    const setProperty = () => {
      el.gnb = document.querySelector(selector.gnb);
      el.motions = el.target.querySelectorAll(selector.motion);
    };

    const methods = {
      //스크롤 하여 div.motion 영역 전체가 화면에 보이면 motion--on 클래스 추가
      setMotionClass: () => {
        el.motions.forEach(element => {
          if (element) {
            gsap.to(element, {
              delay: 2,
              scrollTrigger: {
                trigger: element,
                start: 'bottom bottom',
                end: 'bottom center',
                scrub: 3,
                onEnter: () => {
                  element.classList.add('motion--on');
                }
              }
            });
          }
        });
      }
    };

    const init = () => {

      setProperty();

      bind();

    };

    /**
   * @function reInit
   * @memberof Main
   * @description Main 인스턴스 재생성
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

export const mainController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new Main(el));
      }
    });
  }
};

/**
 * @namespace main
 * @alias mvJS.main
 * @memberof mvJs
 * @description Main 영역 활성화
*/
mvJs.main = {};
/**
 * @param {String} selector - element selector
 * @memberof main
 * @function init
 * @description Main 인스턴스 생성
**/
mvJs.main.init = mainController.init;