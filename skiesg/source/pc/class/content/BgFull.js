import { mvJs, root } from '../../config';
import gsap, { ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class BgFull {
  /**
   * Create a BgFull
   * @class BgFull
   * @param {Element} target - 생성 타겟
   * @description .bg-full 영역에서만 header--transparent 클래스 추가
   */
  constructor(target) {
    const el = {
      target,
      header: null
    };

    const selector = {
      header: 'header.header'
    };

    const handler = {
      resize: () => {
        unbind();
        method.buildMotion();
      },
      scroll: () => {
        const top = el.target.getBoundingClientRect().top;
        if (top <= el.target.clientHeight * -1) {
          el.header.classList.remove('header--transparent');
        } else if (top <= el.header.clientHeight) {
          el.header.classList.add('header--transparent');
        }
      }
    };

    let motion;

    const bind = () => {
      handler.scroll();
      window.addEventListener('scroll', handler.scroll);
    };

    const unbind = () => {
      motion.kill();
    };

    const setProperty = () => {
      el.header = document.querySelector(selector.header);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof BgFull
   * @description BgFull 인스턴스 재생성
   */
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    const method = {
      buildMotion: () => {
        if (!el.header) {
          return;
        }

        let clientH = 0;
        if (el.target.classList.contains('vertical-slide-container')) {
          clientH = el.target.clientHeight;
        }

        motion = ScrollTrigger.create({
          trigger: el.target,
          start: `top-=${clientH} top`,
          end: 'bottom top',
          scrub : true,
          onEnter: () => {
            el.header.classList.add('header--transparent');
          },
          onLeave: () => {
            el.header.classList.remove('header--transparent');
          },
          onEnterBack: () => {
            el.header.classList.add('header--transparent');
          },
          onLeaveBack: () => {
            if (window.pageYOffset > 0) {
              el.header.classList.remove('header--transparent');
            }
          }
        });
      }
    };

    init();

    this.reInit = reInit;
  }
}

export const bgFullController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el, index) => {

      let obj, para;
      obj = root.weakMap.get(el);
      if (obj) {
        if (el.classList.contains('submain-keyvisual') ||
            el.classList.contains('bg-motion-item') ||
            el.classList.contains('motion-on')
        ) {
          para = document.createElement('div');
          para.appendChild(el.cloneNode(true));
          para.setAttribute('bg-full-parent', index);
          obj = root.weakMap.get(para);
          if (!obj) {
            root.weakMap.set(para, new BgFull(el));
          } else {
            obj.reInit();
          }
        } else {
          obj.reInit();
        }
      } else {
        root.weakMap.set(el, new BgFull(el));
      }
    });
  }
};

/**
 * @namespace bgFull
 * @alias mvJS.bgFull
 * @memberof mvJs
 * @description BgFull 활성화
*/
mvJs.bgFull = {};
/**
 * @param {String} selector - element selector
 * @memberof bgFull
 * @function init
 * @description BgFull 인스턴스 생성
**/
mvJs.bgFull.init = bgFullController.init;