import { root } from '../../config';
import gsap, { ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class ScrollSlide {
  /**
   * Create a ScrollSlide
   * @class ScrollSlide
   * @param {Element} target - 생성 타겟
   * @description ScrollSlide 영역 스크립트
   */
  constructor(target) {
    const el = {
      target      :   target,
      contents    :   null,
      slides      :   null
    };

    const selector = {
      content     :   '.slide-text .slide-text__item:not(.slide-text__item--growth)',
      slides      :   '.slide-image .slide-image__item'
    };

    const handler = {
      resize: () => {
        el.slides.forEach((element, idx) => {
          ScrollTrigger.getById('slides' + idx).kill();
        });
        methods.setContentMotion();
      }      
    };

    const bind = () => {
      methods.scrollClass();
      methods.setContentMotion();

      window.addEventListener('resize', handler.resize);
    };

    const unbind = () => {
      el.slides.forEach((element, idx) => {
        ScrollTrigger.getById('slides' + idx).kill();
      });
      window.removeEventListener('resize', handler.resize);
    };

    const setProperty = () => {
      el.contents = el.target.querySelectorAll(selector.content);
      el.slides = el.target.querySelectorAll(selector.slides);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof ScrollSlide
   * @description ScrollSlide 인스턴스 재생성
   */  
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    const methods = {
      //스크롤 될 때, div.slide-image__item--g 영역의 top이 0이 되면 is-active 클래스 추가
      setContentMotion: () => {
        if (!el.slides) {
          return;
        }
        let growthEl = el.target.querySelector('.slide-text__item--growth');
        el.slides.forEach((element, idx) => {
          ScrollTrigger.create({
            id: 'slides' + idx,
            trigger: element,
            start: 'top top',
            end: 'bottom top',
            scrub:1,
            onEnter: () => {
              growthEl.style.opacity = 0;
              growthEl.classList.remove('is-active');
              
              el.contents.forEach((elem, indx) => {                
                indx === idx ? elem.classList.add('is-active') : elem.classList.remove('is-active');
              });
            },
            onLeave : () => {
              el.contents[idx].classList.add('slide-up');
            },
            onEnterBack: () => {
              el.contents.forEach((elem, indx) => {
                indx === idx ? elem.classList.add('is-active') : elem.classList.remove('is-active');
                el.contents[idx].classList.contains('slide-up') ? el.contents[idx].classList.remove('slide-up') : null;
              });
            },
            onLeaveBack : () => {
              if (idx === 0) {
                growthEl.style.opacity = 1;
                growthEl.classList.add('is-active');
                el.contents[idx].classList.remove('slide-up');
                el.contents[idx].classList.remove('is-active');
              }
            }
          });
        });
      },
      /*
        div.scroll-slide 영역의 bottom 포지션이 0 이상이 되면 is-fixed 클래스 삭제 및 slide-up 클래스 추가
        div.scroll-slide 영역이 화면밖으로 없어지면 slide-up 클래스 삭제
      */
      scrollClass : () => {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        ScrollTrigger.create({
          trigger: el.target,
          start: 'top top',
          end: `bottom-=${vh} top`,
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
          }
        });
      }
    };
    
    init();

    this.reInit = reInit;
  }
}

export const scrollSlideController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new ScrollSlide(el));
      }
    });
  }
};