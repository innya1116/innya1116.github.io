import { root } from '../../config';
import gsap, { ScrollTrigger} from 'gsap/all';
import { utils } from '../../libs/utils';

gsap.registerPlugin(ScrollTrigger);

class FixedSlide {
  /**
   * Create a FixedSlide
   * @class FixedSlide
   * @param {Element} target - 생성 타겟
   * @description FixedSlide 영역 스크립트
   */
  constructor(target) {
    const el = {
      target      :   target,
      contents    :   null,
      indicator   :   null,
      anchors     :   null,
      slides      :   null
    };

    const selector = {
      content     :   '.fixed-text__esg div[class*="-contents"]',
      indicator   :   '.indicator',
      anchors     :   'a',
      slides      :   'div[id^="thinkGreen"]'
    };

    const handler = {
      /**
       * @callback linkClick
       * @memberof FixedSlide
       * @description 앵커 영역으로 스크롤 이동 및 is-active 클래스 추가
      */
      linkClick: event => {
        event.preventDefault();
        el.anchors.forEach((element, idx) => {
          if (element === event.currentTarget) {
            utils.tweenScroll.go(el.slides[idx].offsetTop + window.innerHeight, 1, () => {});
          }
        });
        //utils.tweenScroll.go(el.slides[utils.getIndex(event.target.closest('a'))].offsetTop + window.innerHeight, 1);
      },
      resize: () => {
        ScrollTrigger.getById('slide').kill();
        ScrollTrigger.getById('slideUp').kill();
        el.slides.forEach((element, idx) => {
          ScrollTrigger.getById('slides' + idx).kill();
        });
        methods.buildMotion();
        methods.setContentMotion();
      }
    };

    const bind = () => {
      methods.buildMotion();
      methods.setContentMotion();

      if (el.anchors) {
        el.anchors.forEach(element => {
          element.addEventListener('click', handler.linkClick);
        });
      }
      window.addEventListener('resize', handler.resize);
    };

    const unbind = () => {
      ScrollTrigger.getById('slide').kill();
      ScrollTrigger.getById('slideUp').kill();
      el.slides.forEach((element, idx) => {
        ScrollTrigger.getById('slides' + idx).kill();
      });

      if (el.anchors) {
        el.anchors.forEach(element => {
          element.removeEventListener('click', handler.linkClick);
        });
      }
      window.removeEventListener('resize', handler.resize);
    };

    const setProperty = () => {
      el.contents = el.target.querySelectorAll(selector.content);
      el.indicator = el.target.querySelector(selector.indicator);      
      if (el.indicator) {
        el.anchors = el.indicator.querySelectorAll(selector.anchors);
      }
      el.slides = el.target.querySelectorAll(selector.slides);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof FixedSlide
   * @description FixedSlide 인스턴스 재생성
   */  
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    const methods = {
      // div.fixed-slide 영역 is-fixed 클래스 추가, 삭제
      buildMotion: () => {
        const hLast = el.slides[el.slides.length-1].offsetHeight;
        ScrollTrigger.create({
          id: 'slide',
          trigger: el.target,
          start: 'top top',
          end: `bottom-=${hLast} top`,
          onEnter: () => {
            el.target.classList.add('is-fixed');
          },
          onLeave : () => {
            el.target.classList.remove('is-fixed');
            el.target.classList.add('slide-up');
          },
          onEnterBack: () => {
            el.target.classList.add('is-fixed');
            el.target.classList.remove('slide-up');
          },
          onLeaveBack : () => {
            el.target.classList.remove('is-fixed');
            el.target.classList.remove('slide-up');
          }
        });

        ScrollTrigger.create({
          id: 'slideUp',
          trigger: el.target,
          start: 'top top',
          end: 'bottom top',
          onLeave: () => {
            el.target.classList.remove('slide-up');
          },
          onEnterBack: () => {
            el.target.classList.add('slide-up');
          }
        });
      },
      //div#thinkGreen 영역이 화면의 center 이상 스크롤 되면 indicator, contents에 is--active 클래스 추가, 삭제
      setContentMotion: () => {
        if (!el.slides) {
          return;
        }
        el.slides.forEach((element, idx) => {
          ScrollTrigger.create({
            id: 'slides' + idx,
            trigger: element,
            start: window.innerHeight * 0.9 + ' 91%',
            end: window.innerHeight * 0.9 + ' 89%',
            onEnter: () => {
              el.contents.forEach((elem, indx) => {
                indx === idx ? elem.classList.add('is-active') : elem.classList.remove('is-active');
              });
              el.anchors.forEach((link, indx) => {
                indx === idx ? link.classList.add('is-active') : link.classList.remove('is-active');
              });
            },
            onEnterBack: () => {
              // console.log('enter back ');
              el.contents.forEach((elem, indx) => {
                indx === idx ? elem.classList.add('is-active') : elem.classList.remove('is-active');
              });
              el.anchors.forEach((link, indx) => {
                indx === idx ? link.classList.add('is-active') : link.classList.remove('is-active');
              });
            }
          });
        });
      }
    };
    
    init();

    this.reInit = reInit;
  }
}

export const fixedSlideController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new FixedSlide(el));
      }
    });
  }
};