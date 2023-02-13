import { mvJs, root } from '../../config';

class GnbBar {
  /**
   * Create a GnbBar
   * @class GnbBar
   * @param {Element} target - 생성 타겟
   */
  constructor(target) {
    const el = {
      target,
      depth1Menu     : null,
      pcProfileBtn   : null,
      mobileMenu     : null,
      gnbCloseBtn    : null,
      gnbMobileAarea : null,
      gnb2depthMenu  : null,
      moDepth1Menu   : null
    };

    const selector = {
      depth1Menu     : '.gnb-1depth-wrap .gnb-1depth__menu',
      pcProfileBtn   : '.my-info__btn',
      mobileMenu     : '.gnb-mobile-menu__btn',
      gnbCloseBtn    : 'button.gnb__close',
      gnbMobileAarea : 'div.gnb-mobile-area',
      gnb2depthMenu  : 'li.gnb-2depth__menu',
      moDepth1Menu   : '.gnb-menu--mobile .gnb-1depth__menu'
    };
    const MO_WIDTH = 768;

    const setProperty = () => {
      el.depth1Menu = target.querySelectorAll(selector.depth1Menu);
      el.pcProfileBtn = target.querySelector(selector.pcProfileBtn);
      el.mobileMenu = target.querySelector(selector.mobileMenu);
      el.gnbCloseBtn = target.querySelector(selector.gnbCloseBtn);
      el.gnbMobileAarea = target.querySelector(selector.gnbMobileAarea);
      el.gnb2depthMenu = target.querySelectorAll(selector.gnb2depthMenu);
      el.moDepth1Menu = target.querySelectorAll(selector.moDepth1Menu);
    };

    const methods = {
      moEvents: () => {
        if (el.mobileMenu) {
          el.mobileMenu.addEventListener('click', handler.mobileMenuClick);
        }

        if (el.gnbCloseBtn) {
          el.gnbCloseBtn.addEventListener('click', handler.gnbCloseBtnClick);
        }

        // if (el.moDepth1Menu) {
        //   el.moDepth1Menu.forEach(eleme => {
        //     eleme.addEventListener('click', handler.moDepth1Click);
        //   });
        // }
      },
      pcEvents: () => {
        if (el.depth1Menu) {
          // console.log(el.depth1Menu);
          el.depth1Menu.forEach(eleme => {
            eleme.addEventListener('mouseenter', handler.depthFocused);
            // eleme.addEventListener('mouseleave', handler.depthUnFocus);
            eleme.addEventListener('focusin', handler.depthFocused);
            // eleme.addEventListener('focusout', handler.depthUnFocus);
          });
        }

        if (el.pcProfileBtn) {
          el.pcProfileBtn.addEventListener('click', handler.pcProfileBtnClick);
        }
        el.target.addEventListener('mouseenter', handler.innerFocus);
        el.target.addEventListener('mouseleave', handler.outFocus);
      }
    };
    const handler = {
      moveFocus: event => {
        const currElm = document.elementFromPoint(event.clientX, event.clientY);
        const classNames = ['gnb', 'gnb__inner', 'gnb__logo'];
        classNames.forEach(name => {
          if (currElm.classList.contains(name)) {
            el.depth1Menu.forEach(element => {
              element.classList.remove('is-open');
              // element.classList.remove('is-active');
            });    
            el.target.classList.remove('gnb--desktop-open');
          }
        });
      },
      innerFocus: event => {
        event.currentTarget.addEventListener('mousemove', handler.moveFocus, {passive: true});
      },
      outFocus: event => {
        el.depth1Menu.forEach(element => {
          element.classList.remove('is-open');
        });

        el.target.classList.remove('gnb--desktop-open');

        event.currentTarget.removeEventListener('mousemove', handler.moveFocus);

        //desktop gnb 영역에서 gnb-1depth__menu > a / button.my-info__btn 에 hover, focus 인 경우 gnb--desktop-open 클래스 삭제
        document.querySelector('.main') ? el.target.classList.remove('gnb--desktop-open') : '';
      },
      gnbCloseBtnClick: () => {
        el.target.classList.remove('gnb--mobile-open');
        document.body.style.overflowY = 'auto';
        if (el.gnbMobileAarea) {
          el.gnbMobileAarea.setAttribute('aria-hidden', true);
        }
      },
      mobileMenuClick: () => {
        el.target.classList.add('gnb--mobile-open');
        document.body.style.overflowY = 'hidden';
        if (el.gnbMobileAarea) {
          el.gnbMobileAarea.setAttribute('aria-hidden', false);
        }
      },
      depthFocused : event => {
        if (event.target.classList.contains('gnb-2depth-wrap, gnb-2depth-inner')) {
          return;
        }
        event.currentTarget.classList.add('is-open');
        // event.currentTarget.classList.add('is-active');
        el.target.classList.add('gnb--desktop-open');

        el.depth1Menu.forEach(element => {
          element !== event.currentTarget ? (element.classList.remove('is-open')) : null;
        });

        //desktop gnb 영역에서 gnb-1depth__menu > a / button.my-info__btn 에 hover, focus 인 경우 gnb--desktop-open 클래스 추가
        document.querySelector('.main') ? el.target.classList.add('gnb--desktop-open') : '';
      },
      resize: () => {
        unbind();
        
        if (window.innerWidth >= MO_WIDTH) {
          methods.pcEvents();
        } else {
          methods.moEvents();
        }
      },
      pcProfileBtnClick: event => {
        const stat = event.currentTarget.getAttribute('aria-expanded');
        let pop = event.currentTarget.closest('div.after-login').querySelector('.my-info__details');
        if (!pop) {
          return;
        }
        stat === 'true' ? (event.currentTarget.setAttribute('aria-expanded', false), pop.setAttribute('aria-hidden', true)) : (event.currentTarget.setAttribute('aria-expanded', true), pop.setAttribute('aria-hidden', false));
      }
    };

    const bind = () => {
      window.addEventListener('resize', handler.resize);
      if (window.innerWidth > MO_WIDTH) {
        methods.pcEvents();
      } else {
        methods.moEvents();
      }
    };
    const unbind = () => {
      if (el.depth1Menu) {
        el.depth1Menu.forEach(eleme => {
          eleme.removeEventListener('mouseenter', handler.depthFocused);
          eleme.removeEventListener('focusin', handler.depthFocused);
        });
      }

      if (el.pcProfileBtn) {
        el.pcProfileBtn.removeEventListener('click', handler.pcProfileBtnClick);
      }

      if (el.mobileMenu) {
        el.mobileMenu.removeEventListener('click', handler.mobileMenuClick);
      }

      if (el.gnbCloseBtn) {
        el.gnbCloseBtn.removeEventListener('click', handler.gnbCloseBtnClick);
      }
    };

    const init = () => {
      setProperty();
      bind();
    };
    const reInit = () => {
      unbind();
      setProperty();
      bind();
    };

    init();
    this.reInit = reInit;
  }
}


export const gnbBarController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GnbBar(el));
      }
    });
  }
};

/**
 * @namespace gnbbar
 * @alias mvJS.gnbbar
 * @memberof mvJs
 * @description 툴팁 제어
 */
mvJs.gnbbar = {};
/**
  * @param {String} selector - element selector
  * @memberof gnbbar
  * @function init
 **/
mvJs.gnbbar.init = gnbBarController.init;