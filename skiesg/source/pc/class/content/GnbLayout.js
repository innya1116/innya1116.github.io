import {mvJs, root} from '../../config';
import gsap from 'gsap';

class GnbLayout {
  /**
     * Create a GnbLayout
     * @class GnbLayout
     * @param {Element} target - 생성 타겟
     */
  constructor(target) {
    const el = {
      target,
      doc: document,
      button: null,
      menuCnt: null,
      menudepthLink: null,
      menuDepthList: null,
      headTparent: false,
      menu: null,
      focus: null,
      counter: 0,
      isLocked: false,
      request: null,
      focused: false
    };

    let focusElArr = [];
    let depth2MenuItem;
    let depth2MenuItemMtop;
    let depth2MenuItemMgrid;
    let defaultActive = [];
    let defaultMenuItem = [];

    const selector = {
      button: '.gnb__menu-btn',
      menuCnt: '.menu-container',
      menudepthLink: '.menu__1depth',
      menuDepthList: '.menu__2depth',
      headTparent: 'header--transparent',
      menu: '.menu',
      focus: 'a, input, button, [tabindex]'
    };

    const className = {
      btnClick: 'is-gnb-open',
      depthMenuItem: 'is-open',
      menu2depth: 'is-active'
    };

    let page = { scrolled: 0 };

    const setProperty = () => {
      el.button = el.target.querySelector(selector.button);
      el.menuCnt = el.target.querySelector(selector.menuCnt);
      el.menudepthLink = el.target.querySelectorAll(selector.menudepthLink);
      el.menuDepthList = el.target.querySelectorAll(selector.menuDepthList);
      el.menu = el.target.querySelector(selector.menu);
      el.target.setAttribute('tabindex', 0);

      el.focus = el.target.querySelectorAll(selector.focus);
      focusElArr = [... el.focus];
      focusElArr.unshift(el.target);
      const element = focusElArr.splice(2, 6);
      element.splice(1, 4);
      focusElArr = focusElArr.concat(element);
      focusElArr.forEach((elm, idx) => {
        elm.setAttribute('data-idx', idx);
      });

      [...el.menudepthLink].forEach((element) => {
        element.classList.contains(className.depthMenuItem) ? defaultActive.push(element) : null;
      });
      defaultActive.forEach((element) => {
        if (element.children[1] && element.children[1].children) {
          [...element.children[1].children].forEach((el) => {
            el.classList.contains(className.menu2depth) ? defaultMenuItem.push(el) : null;
          });
        }
      });
    };

    const methods = {
      toggle: () => {
        el.target.classList.contains(className.btnClick) ? methods.close() : methods.open();
      },
      open: () => {        
        page.scrolled = window.pageYOffset;
        el.request = document.activeElement;
        el.target.focus();
        el.doc.addEventListener('keydown', handler.keydown);

        el.target.classList.add(className.btnClick);
        el.target.classList.contains(selector.headTparent) ? el.headTparent = true : el.headTparent = false;
        el.headTparent ? null : el.target.classList.add(selector.headTparent);
        el.button.setAttribute('aria-expanded', true);
        el.button.firstElementChild.innerHTML = 'Close Menu';
        el.menuCnt.setAttribute('aria-hidden', false);
        el.target.parentElement.parentElement.style.overflow = 'hidden';
        gsap.fromTo(el.menuCnt, {opacity: 0.8}, {duration: 0.3,
          opacity: 1});

        [...el.menuDepthList].forEach(elm => {
          [...elm.children].forEach(element => {
            element.offsetHeight ? depth2MenuItem = element.offsetHeight : null;
          });
          depth2MenuItemMtop = getComputedStyle(elm.children[0], null).getPropertyValue('margin-top');
          depth2MenuItemMtop = parseInt(depth2MenuItemMtop.match(/\d/g).join(''));
          depth2MenuItemMgrid = getComputedStyle(elm.children[1], null).getPropertyValue('margin-top');
          depth2MenuItemMgrid = parseInt(depth2MenuItemMgrid.match(/\d/g).join(''));
        });  

        if (defaultActive.length !== 0) {
          defaultActive.forEach(el=>{
            
            if (el.children[1] && el.children[1].children) {
              
              el.classList.add(className.depthMenuItem);
  
              let detailHeight = 0;
          
              if (el && el.children && el.children[1] && el) {
                [...el.children[1].children].forEach(() => {
                  detailHeight = detailHeight + depth2MenuItem + depth2MenuItemMgrid;
                });
              }
          
              detailHeight = detailHeight + depth2MenuItemMtop - depth2MenuItemMgrid;
  
              if (el && el.children && el.children[1] && el) {
                el.children[1].style.height = detailHeight + 'px';
              }

              if (defaultMenuItem.length !== 0) {
                defaultMenuItem.forEach(el=>{
                  el.classList.add(className.menu2depth);
                });
              }  
            }
          });   
        } else {
          [...el.menudepthLink].forEach((element) => {
            element.classList.remove(className.depthMenuItem);
            element.children[1].style.height = 0;
          });
        }
      },
      close: () => {
        el.target.classList.remove(className.btnClick);
        el.button.setAttribute('aria-expanded', false);
        el.button.firstElementChild.innerHTML = 'View Menu';
        el.menuCnt.setAttribute('aria-hidden', true);
        el.target.parentElement.parentElement.style.overflow = '';
        el.headTparent ? null : el.target.classList.remove(selector.headTparent);

        el.doc.removeEventListener('keydown', handler.keydown);
        el.request.focus();
        el.request = null;

        window.scrollTo(0, page.scrolled);

        [...el.menudepthLink].forEach((element) => {
          element.classList.remove(className.depthMenuItem);
          element.children[1].style.height = 0;
        });

      },
      slideMenu: async(focusedMenu) => {
        let detailHeight = 0;
        [...el.menudepthLink].forEach((element) => {
          element.classList.remove(className.depthMenuItem);
          element.querySelector('ul').style.height = 0;
        });
        focusedMenu.classList.add(className.depthMenuItem);
        
        if (focusedMenu && focusedMenu.children && focusedMenu.children[1] && focusedMenu) {
          [...focusedMenu.children[1].children].forEach(() => {
            detailHeight = detailHeight + depth2MenuItem + depth2MenuItemMgrid;
          });
        }
        
        detailHeight = detailHeight + depth2MenuItemMtop - depth2MenuItemMgrid;

        focusedMenu.children[1].style.height = detailHeight +'px';
        defaultActive.forEach((element) => {
          if (element === focusedMenu && defaultMenuItem.length !== 0) {
            defaultMenuItem.forEach(el=>{
              el.classList.add(className.menu2depth);
            });
          }
        });
      },
      subMenuActive: (activeSubItem) => {
        activeSubItem.classList.add(className.menu2depth);
      },
      subMenuNotActive: (notActiveSubItem) => {
        notActiveSubItem.classList.remove(className.menu2depth);
      }
    };
    const handler = {
      toggleList: () => {
        methods.toggle();
      },
      depthMenuOpen: (event) => {
        el.focused = true;
        let focusedMenu = event.currentTarget;
        methods.slideMenu(focusedMenu);
      },
      depthMenuClose: () => {
        el.focused = false;
      },
      depthMenu2Active: (event) => {
        let activeSubItem = event.currentTarget;
        methods.subMenuActive(activeSubItem);
      },
      depthMenu2NotActive: (event) => {
        let notActiveSubItem = event.currentTarget;
        methods.subMenuNotActive(notActiveSubItem);
      },
      menuNotActive: () => {
        setTimeout(() => {
          if (!el.focused) {

            [...el.menudepthLink].forEach((element) => {
              element.classList.remove(className.depthMenuItem);
              element.children[1].style.height = 0;
            });
          }

        }, 1000);
      },
      keydown: (evt) => {
        /**
        * @callback keydown
        * @memberof GnbLayout
        * @description  tabindex를 제어하기 위함
        */
        if (evt.keyCode !== 9) {
          return;
        }

        let idx = parseInt(document.activeElement.getAttribute('data-idx'));

        if (evt.shiftKey) {
          idx -= 1;
          if (idx < 0) {
            idx = focusElArr.length -1;
          }

        } else {
          idx += 1;

          if (idx >= focusElArr.length) {
            idx = 0;
          }
        }

        focusElArr[idx].focus();

        evt.preventDefault();        
      }
    };

    const bind = () => {
      if (el.button) {
        el.button.addEventListener('click', handler.toggleList);
      }
      [...el.menudepthLink].forEach((element) => {
        element.addEventListener('mouseenter', handler.depthMenuOpen);
        element.addEventListener('focusin', handler.depthMenuOpen);
        element.addEventListener('mouseout', handler.depthMenuClose);
        element.addEventListener('focusout', handler.depthMenuClose);
      });
      [...el.menuDepthList].forEach((element) => {
        [...element.children].forEach((element) => {
          element.addEventListener('mouseover', handler.depthMenu2Active);
          element.addEventListener('focusin', handler.depthMenu2Active);
          element.addEventListener('mouseout', handler.depthMenu2NotActive);
          element.addEventListener('focusout', handler.depthMenu2NotActive);
        });
      });
      if (el.menu) {
        el.menu.addEventListener('mouseleave', handler.menuNotActive);
        el.menu.addEventListener('focusout', handler.menuNotActive);
      }
    };

    const unbind = () => {
      if (el.button) {
        el.button.removeEventListener('click', handler.toggleList);
      }
      [...el.menudepthLink].forEach((element) => {
        element.removeEventListener('mouseover', handler.depthMenuOpen);
        element.removeEventListener('focusin', handler.depthMenuOpen);
        element.removeEventListener('mouseout', handler.depthMenuClose);
        element.removeEventListener('focusout', handler.depthMenuClose);
      });
      [...el.menuDepthList].forEach((element) => {
        [...element.children].forEach((element) => {
          element.removeEventListener('mouseover', handler.depthMenu2Active);
          element.removeEventListener('focusin', handler.depthMenu2Active);
          element.removeEventListener('mouseout', handler.depthMenu2NotActive);
          element.removeEventListener('focusout', handler.depthMenu2NotActive);
        });
      });
      if (el.menu) {
        el.menu.removeEventListener('mouseleave', handler.menuNotActive);
        el.menu.removeEventListener('focusout', handler.menuNotActive);
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

export const gnbLayoutController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new GnbLayout(el));
      }
    });
  }
};

/**
 * @namespace gnblayout
 * @alias mvJS.gnblayout
 * @memberof mvJs
 * @description 툴팁 제어
 */
mvJs.gnblayout = {};
/**
 * @param {String} selector - element selector
 * @memberof gnblayout
 * @function init
 **/
mvJs.gnblayout.init = gnbLayoutController.init;