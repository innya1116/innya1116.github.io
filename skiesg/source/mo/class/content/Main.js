import { mvJs, root } from '../../config';
import { utils } from '../../libs/utils';
import gsap, { ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class Main {
  /**
   * Create a Main
   * @class Main
   * @param {Element} target - 생성 타겟
   * @description 메인페이지 스크립트
   */
  constructor(target) {
    const el = {
      target,
      about           : null,
      slideContainer  : null,
      slideWrap       : null,
      slides          : null,
      indicator       : null,
      buttons         : null,
      green           : null,
      greenSlide      : null
    };

    const selector = {
      about           : '.about-esg',
      slideContainer  : '.vertical-slide-container',
      slideWrap       : '.vertical-slide-wrap',
      slide           : '.vertical-slide',
      indicator       : '.indicator',
      button          : '.indicator a',
      green           : '.green',
      greenSlide      : '.green-slide'
    };

    const handler = {
      /**
       * @callback event
       * @memberof Main
       * @description button 영역 is-active 클래스 추가
      */
      clickBtn: event => {
        event.preventDefault();
        let idx = utils.getIndex(event.currentTarget);
        method.setActiveBtn(idx);
      },
      resize: () => {
        ScrollTrigger.refresh();
      }
    };

    const bind = () => {
      window.addEventListener('resize', handler.resize);

      if (el.slideContainer) {
        method.buildMotion();
      }
      if (el.green) {
        method.scrollClass();
      }
      if (el.about) {
        method.lockScroll();
      }
      if (el.buttons) {
        el.buttons.forEach(element => {
          element.addEventListener('click', handler.clickBtn);
        });
      }

    };

    const unbind = () => {
      window.removeEventListener('resize', handler.resize);
    };

    const setProperty = () => {
      el.about = el.target.querySelector(selector.about);
      el.slideContainer = el.target.querySelector(selector.slideContainer);
      el.slideWrap = el.target.querySelector(selector.slideWrap);
      el.slides = el.target.querySelectorAll(selector.slide);
      el.indicator = el.target.querySelector(selector.indicator);
      el.buttons = el.target.querySelectorAll(selector.button);
      el.green = el.target.querySelector(selector.green);
      el.greenSlide = el.target.querySelector(selector.greenSlide);
    };

    const init = () => {
      setProperty();
      bind();

      // el.slideContainer.classList.add('motion-on');
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

    let check = true;

    const method = {
      //slideContainer 영역이 화면에 보이면 motion-on 클래스 추가(한번 추가되면 삭제되지 않음)
      buildMotion: () => {
      //   let hKv = el.slideContainer.clientHeight;
      //   ScrollTrigger.create({
      //     trigger: el.slideContainer,
      //     start: `top-=${hKv} center`,
      //     onEnter: () => {
      //       //
      //       // console.log(el.slideContainer);
      //       // gsap.to('')
      //       el.slideContainer.classList.add('motion-on');
      //       gsap.to(el.slideContainer, {
      //         scale: 1,
      //         duration: 0.5
      //       });
      //     }
      //   });
      },

      /* div.about-esg 영역 top 포지션이 0이 되면 body scroll 막히고, div.vertical-slide-container 동작 */
      lockScroll: () => {
        ScrollTrigger.create({
          trigger: '.about-esg',
          pin: '.about-esg',
          start: 'top top',
          end: '+=150%',

          onEnter: () => {
            if (check) {
              //
              // console.log('==========-------------- xxx ');
              el.slideContainer.classList.add('motion-on');
              // gsap.to(el.slideContainer, {
              //   scale: 1,
              //   duration: 0.5
              // });

              ScrollTrigger.sort();
              ScrollTrigger.refresh();
              check = false;
            }
          },

          onUpdate: (self) => {
            let idx = Math.floor(self.progress/1 * 3);
            if (idx === 3) {
              idx = 2;
            }
            method.setActiveBtn(idx);
          }
        });
      },
      // scroll해서 div.green-slide 영역의 top 포지션 0이 되면, is-fixed 클래스 추가
      scrollClass : () => {
        const hLast = el.greenSlide.querySelector('.green-slide__area:last-child').offsetHeight;
        ScrollTrigger.create({
          trigger: el.green,
          start: 'top top',
          end: `bottom-=${hLast} top`,
          onEnter: () => {
            el.greenSlide.classList.add('is-fixed');
          },
          onLeave : () => {
            el.greenSlide.classList.remove('is-fixed');
            el.greenSlide.classList.add('slide-up');
          },
          onEnterBack: () => {
            el.greenSlide.classList.add('is-fixed');
            el.greenSlide.classList.remove('slide-up');
          },
          onLeaveBack : () => {
            el.greenSlide.classList.remove('is-fixed');
            el.greenSlide.classList.remove('slide-up');
          }
        });

        ScrollTrigger.create({
          trigger: el.green,
          start: 'top top',
          end: 'bottom top',
          onLeave: () => {
            el.greenSlide.classList.remove('slide-up');
          },
          onEnterBack: () => {
            el.greenSlide.classList.add('slide-up');
          }
        });
      },
      // div.vertical-slide / div.indicator > button: is-active 클래스 추가하여 활성화 필요
      setActiveBtn : (index) => {
        el.slides.forEach((element, idx) => {
          idx === index ? element.classList.add('is-active') : element.classList.remove('is-active');
          idx !== index ? element.classList.add('is-inactive') : element.classList.remove('is-inactive');
        });
        el.buttons.forEach((element, idx) => {
          idx === index ? element.classList.add('is-active') : element.classList.remove('is-active');
        });
      }
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
 * @description Main 활성화
*/
mvJs.main = {};
/**
 * @param {String} selector - element selector
 * @memberof main
 * @function init
 * @description Main 인스턴스 생성
**/
mvJs.main.init = mainController.init;