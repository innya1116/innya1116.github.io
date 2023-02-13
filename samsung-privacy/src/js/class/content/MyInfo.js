import { mvJs, root } from '../../config';
import { utils } from '../../libs/utils';

export class GuidePop {
  constructor(target) {
    const el = {
      pop: null,
      btnClose: null
    };

    const selector = {
      pop: target,
      btnClose: '.local-site-guide-popup__close'
    };

    const setProperty = () => {
      el.pop = document.querySelector(selector.pop);
      if (el.pop) {
        el.btnClose = el.pop.querySelector(selector.btnClose);
      }
    };

    const handler = {
      btnClick: event => {
        if (!el.pop) {
          return;
        }

        el.pop.style.display = 'none';
      }
    };

    const bind = () => {
      if (el.btnClose) {
        utils.addDynamicEventListener('body', 'click', target + ' ' + selector.btnClose, handler.btnClick);
      }
    };

    const init = () => {
      setProperty();
      bind();
    };

    init();
  }
}

class ServiceApp {
  /**
   * Create a ServiceApp
   * @class ServiceApp
   * @param {Element} target - 생성 타겟
   */
  constructor(target) {
    let mousePos = { 
        left: 0, 
        // mouse left position
        x: 0, 
        // mouse moved position
        dx: 0, 
        // select-bar__selected-items translateX size  
        transform: 0 }, 
      // select-bar__selected-items real width
      totalWidth = 0,
      selectedBarItems = [];

    const el = {
      target,
      checkboxAll: null,
      checkboxAllText: null,
      checkboxes: null,
      selectBarCounter: null,
      selectBarBody: null,
      selectBarBodyClose: null,
      selectBar: null,
      selectBarClose: null,
      selectBarItems: null,
      selectLeftBtn: null,
      selectRightBtn: null
    };

    let rtl = false;

    const selector = {
      checkboxAll: '.service-app__all-check input',
      checkboxAllText: '.service-app__all-check .checkbox__label strong',
      checkboxes: '.service-app__list input',
      selectBarCounter: '.select-bar__counter em',
      selectBarBody: '.service-app__select-bar.select-bar',
      selectBarBodyClose: '.select-bar__close',
      selectBar: '.select-bar__scroll-wrap .select-bar__selected-items',
      selectBarClose: '.select-bar__close',
      selectBarItems: '.select-bar__item button',
      selectLeftBtn: '.select-bar__prev-btn',
      selectRightBtn: '.select-bar__next-btn'
    };

    const setProperty = () => {
      el.checkboxAll = target.querySelector(selector.checkboxAll);
      el.checkboxAllText = target.querySelector(selector.checkboxAllText);
      el.checkboxes = target.querySelectorAll(selector.checkboxes);
      el.selectBarCounter = target.querySelector(selector.selectBarCounter);
      el.selectBar = target.querySelector(selector.selectBar);
      el.selectBarBody = target.querySelector(selector.selectBarBody);
      el.selectBarClose = target.querySelector(selector.selectBarClose);
      el.selectBarBodyClose = el.selectBarBody.querySelector(selector.selectBarBodyClose);
      el.selectLeftBtn = target.querySelector(selector.selectLeftBtn);
      el.selectRightBtn = target.querySelector(selector.selectRightBtn);
      rtl = document.documentElement.getAttribute('dir') === 'rtl';
    };

    const methods = {
      clearSelectedItems: () => {
        el.checkboxes.forEach(eleme => {
          eleme.checked = false;
        });
        selectedBarItems = [];
        methods.checkedCounter();
      },
      calcVw: (v) => {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        return (v * w) / 100;
      },
      checkButtonsEnable: () => {
        if (totalWidth > el.selectBar.clientWidth) {
          var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
          el.selectLeftBtn.disabled = false;
          el.selectRightBtn.disabled = false;

          if (matrix.m41 >= 0) {
            el.selectLeftBtn.disabled = true;
          }

          if (matrix.m41 <= el.selectBar.clientWidth - totalWidth) {
            el.selectRightBtn.disabled = true;
          }

          if (matrix.m41 < el.selectBar.clientWidth - totalWidth) {
            el.selectBar.style.transform = 'translateX(' + (totalWidth - el.selectBar.clientWidth) * -1 + 'px)';
            el.selectRightBtn.disabled = true;
          }

        } else {
          el.selectLeftBtn.disabled = true;
          el.selectRightBtn.disabled = true;
          el.selectBar.style.transform = 'translateX(0px)';
        }
      },
      /**
       * @memberof ServiceApp
       * @function checkedCounter
       * @description count and make select-bar__item
       */
      checkedCounter: () => {
        let barItems = '', photo, title;
        selectedBarItems.forEach((element, idx) => {
          photo = element.closest('.service-app__item').querySelector('.service-app-info i').outerHTML;
          title = element.closest('.service-app__item').querySelector('.service-app-info .service-app-info__title span').textContent;
          if (photo && title) {
            barItems += `<div class="select-bar__item">
            <div class="select-bar__item-inner">
              <span class="icon-svc-xs">${photo}</span>
              <strong class="select-bar__item-title">${title}</strong>
              <button class="select-bar__item-deselection" checkbox-idx="${element.id}" current-idx="${idx}">
                <svg class="icon" focusable="false" aria-label="deselection">
                  <use href="../images/sprite-svg.svg#delete"></use>
                </svg>
              </button>
            </div>
          </div>`;
          }
        });

        el.checkboxAllText.textContent = selectedBarItems.length;
        el.selectBarCounter.textContent = selectedBarItems.length > 9 ? selectedBarItems.length : '0' + selectedBarItems.length;
        totalWidth = 0;
        if (selectedBarItems.length > 0) {

          if (el.selectBarBody) {
            el.selectBarBody.classList.add('is-open');
          }

          el.selectBar.innerHTML = barItems;

          if (el.selectBar) {
            el.selectBarItems = el.selectBar.querySelectorAll(selector.selectBarItems);
            let marginLeft = 8;
            if (!utils.isPc()) {
              marginLeft = methods.calcVw(2.2);
            }

            el.selectBarItems.forEach((el, index) => {
              totalWidth += index > 0 ? el.closest('.select-bar__item-inner').clientWidth + marginLeft: el.closest('.select-bar__item-inner').clientWidth;
              el.removeEventListener('click', handler.selectBarItemClick);
              el.addEventListener('click', handler.selectBarItemClick);
              const textEl = el.closest('.select-bar__item-inner').querySelector('strong');
              if (textEl) {
                textEl.style.userSelect = 'none';
              }
            });
          }

          methods.checkButtonsEnable();
        
        } else {
          if (el.selectBarBody) {
            el.checkboxAll.checked = false;
            el.selectBarBody.classList.remove('is-open');
          }
        }
      }
    };  

    const handler = {
      resize: event => {
        if (!el.selectBarItems) {
          el.selectBarItems = el.selectBar.querySelectorAll(selector.selectBarItems);
        }
        totalWidth = 0;
        let marginLeft = 8;
        if (!utils.isPc()) {
          marginLeft = methods.calcVw(2.2);
        }
        el.selectBarItems.forEach((eleme, index) => {
          totalWidth += index > 0 ? eleme.closest('.select-bar__item-inner').clientWidth + marginLeft : eleme.closest('.select-bar__item-inner').clientWidth;
        });
        methods.checkButtonsEnable();
        el.selectBar.removeEventListener('mousedown', handler.barMouseDown);
        el.selectBar.removeEventListener('touchstart', handler.touchDown);
        // if (utils.isPc()) {
        //   el.selectBar.addEventListener('mousedown', handler.barMouseDown);
        // } else {
        //   el.selectBar.addEventListener('touchstart', handler.touchDown, { passive: true});
        // }
        el.selectBar.addEventListener('mousedown', handler.barMouseDown);
        el.selectBar.addEventListener('touchstart', handler.touchDown, { passive: true});
      },
      /**
       * @memberof ServiceApp
       * @param {object} event click event 
       * @function selectLeftBtnClick 
       * @description control select-bar items translateX
       */
      selectLeftBtnClick: event => {
        if (totalWidth > el.selectBar.clientWidth) {
          el.selectBar.style.transition = '.3s';
          var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
          if (!rtl) {
            if (matrix.m41 < 0) {
              const transX = Math.abs(matrix.m41); let calcX = 0, selX = 0, selected = false;
              if (utils.isPc()) {
                el.selectBarItems.forEach((eleme, idx) => {
                  calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + 8: eleme.closest('.select-bar__item-inner').clientWidth;
                  if (calcX < transX) {
                    if (!selected) {
                      selX = calcX;
                    } else {
                      selected = true;
                    }
                  }
                });
    
                let newTransX = selX * -1;
                if (newTransX >= 0) {          
                  el.selectBar.style.transform = 'translateX(0px)';
                  el.selectLeftBtn.disabled = true;
                } else {
                  el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
                }
              } else {
                let moTransX = transX - el.selectBar.clientWidth / 2;
                let leftMargin = methods.calcVw(2.2);
                el.selectBarItems.forEach((eleme, idx) => {
                  calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + leftMargin: eleme.closest('.select-bar__item-inner').clientWidth;
                  let end = calcX;
                  let start = calcX - eleme.closest('.select-bar__item-inner').clientWidth;
                  if (start < moTransX < end && !selected && moTransX < calcX) {
                    selected = true;
                    if (idx <= el.selectBarItems.length) {
                      if (idx === 0) {
                        el.selectBar.style.transform = 'translateX(' + 0 + 'px)';
                        el.selectLeftBtn.disabled = true;
                      } else {
                        selX = calcX - (el.selectBarItems[idx].closest('.select-bar__item-inner').clientWidth - (leftMargin * 2));
                        // - 
                        el.selectBar.style.transform = 'translateX(' + (selX * -1) + 'px)';
                      }
                    }
                  }
                });
              }
              el.selectRightBtn.disabled = false;
            } else {
              el.selectLeftBtn.disabled = true;
            }
          } else {
            if (matrix.m41 > 0) {
              const transX = Math.abs(matrix.m41); let calcX = 0, selX = 0, selected = false;
              if (utils.isPc()) {
                el.selectBarItems.forEach((eleme, idx) => {
                  calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + 8: eleme.closest('.select-bar__item-inner').clientWidth;
                  if (calcX < transX) {
                    if (!selected) {
                      selX = calcX;
                    } else {
                      selected = true;
                    }
                  }
                });
    
                let newTransX = selX * 1;
                if (newTransX <= 0) {          
                  el.selectBar.style.transform = 'translateX(0px)';
                  el.selectLeftBtn.disabled = true;
                } else {
                  el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
                }
              } else {
                let moTransX = transX - el.selectBar.clientWidth / 2;
                let leftMargin = methods.calcVw(2.2);
                el.selectBarItems.forEach((eleme, idx) => {
                  calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + leftMargin: eleme.closest('.select-bar__item-inner').clientWidth;
                  let end = calcX;
                  let start = calcX - eleme.closest('.select-bar__item-inner').clientWidth;
                  if (start < moTransX < end && !selected && moTransX < calcX) {
                    selected = true;
                    if (idx <= el.selectBarItems.length) {
                      if (idx === 0) {
                        el.selectBar.style.transform = 'translateX(' + 0 + 'px)';
                        el.selectLeftBtn.disabled = true;
                      } else {
                        selX = calcX - (el.selectBarItems[idx].closest('.select-bar__item-inner').clientWidth - (leftMargin * 2));
                        // - 
                        if (!rtl) {
                          el.selectBar.style.transform = 'translateX(' + (selX * -1) + 'px)';
                        } else {
                          el.selectBar.style.transform = 'translateX(' + (selX * 1) + 'px)';
                        }
                      }
                    }
                  }
                });
              }
              el.selectRightBtn.disabled = false;
            } else {
              el.selectLeftBtn.disabled = true;
            }
          }
        }
      },
      /**
       * @memberof ServiceApp
       * @param {object} event click event 
       * @function selectRightBtnClick 
       * @description control select-bar items translateX
       */
      selectRightBtnClick: event => {
        if (totalWidth > el.selectBar.clientWidth) {
          el.selectBar.style.transition = '.3s';
          var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
          
          const transX = el.selectBar.clientWidth + Math.abs(matrix.m41);
          let calcX = 0, selX = 0, selected = false;
          if (utils.isPc()) {
            el.selectBarItems.forEach((eleme, idx) => {
              calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + 8: eleme.closest('.select-bar__item-inner').clientWidth;
              if (calcX > transX) {
                if (!selected) {
                  selX = calcX;
                  selected = true;
                }
              }
            });

            let newTransX;
            if (!rtl) {
              newTransX = el.selectBar.clientWidth - selX;
            } else {
              newTransX = selX - el.selectBar.clientWidth;
            }
            if (!rtl) {
              if (newTransX <= el.selectBar.clientWidth - totalWidth) {

                el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
                el.selectRightBtn.disabled = true;
  
              } else {
  
                el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
  
              }
              el.selectLeftBtn.disabled = false;
            } else {
              if (newTransX >= totalWidth - el.selectBar.clientWidth) {

                el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
                el.selectRightBtn.disabled = true;
  
              } else {
  
                el.selectBar.style.transform = 'translateX(' + newTransX + 'px)';
  
              }
              el.selectLeftBtn.disabled = false;
            }

          } else {
            let moTransX = transX - el.selectBar.clientWidth / 2;
            let leftMargin = methods.calcVw(2.2);
            el.selectBarItems.forEach((eleme, idx) => {
              calcX += idx > 0? eleme.closest('.select-bar__item-inner').clientWidth + leftMargin: eleme.closest('.select-bar__item-inner').clientWidth;
              let end = calcX;
              let start = calcX - eleme.closest('.select-bar__item-inner').clientWidth;
              if (start < moTransX < end && !selected && moTransX < calcX) {
                selected = true;
                if (idx + 1 <= el.selectBarItems.length) {
                  if (idx + 1 === el.selectBarItems.length - 1) {
                    if (!rtl) {
                      el.selectBar.style.transform = 'translateX(' + (calcX * -1) + 'px)';
                    } else {
                      el.selectBar.style.transform = 'translateX(' + (calcX * 1) + 'px)';
                    }
                    el.selectRightBtn.disabled = true;
                  } else {
                    selX = calcX + el.selectBarItems[idx + 1].closest('.select-bar__item-inner').clientWidth - (el.selectBarItems[idx + 1].closest('.select-bar__item-inner').clientWidth - (leftMargin * 2));
                    // - 
                    if (!rtl) {
                      el.selectBar.style.transform = 'translateX(' + (selX * -1) + 'px)';
                    } else {
                      el.selectBar.style.transform = 'translateX(' + (selX * 1) + 'px)';
                    }
                  }
                }
              }
            });

            el.selectLeftBtn.disabled = false;
          }
        }
      },
      barMouseDown: event => {
        el.selectBar.removeEventListener('touchstart', handler.touchDown);
          
        if (totalWidth > el.selectBar.clientWidth) {
          var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);

          el.selectBar.style.transition = '.0s';
          mousePos = { left: el.target.scrollLeft, x: event.clientX, dx: 0, transform: matrix.m41 };
          document.addEventListener('mousemove', handler.barMouseMove);
          document.addEventListener('mouseup', handler.barMouseUp);
        }
      },
      touchDown: event => {
        el.selectBar.removeEventListener('mousedown', handler.barMouseDown);

        if (totalWidth > el.selectBar.clientWidth) {
          var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
          el.selectBar.style.transition = '.0s';
          
          mousePos = { left: el.target.scrollLeft, x: event.changedTouches[0].clientX, dx: 0, transform: matrix.m41 };
          document.addEventListener('touchmove', handler.touchMove);
          document.addEventListener('touchend', handler.touchEnd);
        }
      },
      touchMove: event => {
        mousePos.dx = event.changedTouches[0].clientX - mousePos.x;
        el.selectBar.style.transform = 'translateX(' + ((mousePos.transform + mousePos.dx)) + 'px)';
      },
      barMouseMove: event => {
        mousePos.dx = event.clientX - mousePos.x;
        el.selectBar.style.transform = 'translateX(' + ((mousePos.transform + mousePos.dx)) + 'px)';
      },
      touchEnd: event => {
        var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
        el.selectLeftBtn.disabled = false;
        el.selectRightBtn.disabled = false;

        if (totalWidth > el.selectBar.clientWidth) {
          el.selectBar.style.transition = '.3s';
          if (!rtl) {
            if (matrix.m41 > 0) {          
              el.selectBar.style.transform = 'translateX(0px)';
              el.selectLeftBtn.disabled = true;
            }
  
            if (matrix.m41 < el.selectBar.clientWidth - totalWidth) {
              el.selectBar.style.transform = 'translateX(' + (totalWidth - el.selectBar.clientWidth) * -1 + 'px)';
              el.selectRightBtn.disabled = true;
            }
  
            mousePos.matrix = matrix.m41;
          } else {
            if (matrix.m41 < 0) {          
              el.selectBar.style.transform = 'translateX(0px)';
              el.selectLeftBtn.disabled = true;
            }

            if (matrix.m41 > totalWidth - el.selectBar.clientWidth) {
              el.selectBar.style.transform = 'translateX(' + (totalWidth - el.selectBar.clientWidth) + 'px)';
              el.selectRightBtn.disabled = true;
            }

            mousePos.matrix = matrix.m41;
          }
        }

        document.removeEventListener('touchmove', handler.touchMove);
        document.removeEventListener('touchend', handler.touchEnd);
      },
      barMouseUp: event => {
        // eslint-disable-next-line no-var
        var matrix = new WebKitCSSMatrix(window.getComputedStyle(el.selectBar).transform);
        el.selectLeftBtn.disabled = false;
        el.selectRightBtn.disabled = false;

        if (totalWidth > el.selectBar.clientWidth) {
          el.selectBar.style.transition = '.3s';
          if (!rtl) {
            if (matrix.m41 > 0) {          
              el.selectBar.style.transform = 'translateX(0px)';
              el.selectLeftBtn.disabled = true;
            }
  
            if (matrix.m41 < el.selectBar.clientWidth - totalWidth) {
              el.selectBar.style.transform = 'translateX(' + (totalWidth - el.selectBar.clientWidth) * -1 + 'px)';
              el.selectRightBtn.disabled = true;
            }
  
            mousePos.matrix = matrix.m41;
          } else {
            if (matrix.m41 < 0) {          
              el.selectBar.style.transform = 'translateX(0px)';
              el.selectLeftBtn.disabled = true;
            }

            if (matrix.m41 > totalWidth - el.selectBar.clientWidth) {
              el.selectBar.style.transform = 'translateX(' + (totalWidth - el.selectBar.clientWidth) + 'px)';
              el.selectRightBtn.disabled = true;
            }

            mousePos.matrix = matrix.m41;
          }

        }

        document.removeEventListener('mousemove', handler.barMouseMove);
        document.removeEventListener('mouseup', handler.barMouseUp);
      },
      selectBarCloseClick: event => {
        if (el.selectBarBody) {
          el.selectBarBody.classList.remove('is-open');
          methods.clearSelectedItems();
        }
      },
      selectBarItemClick: event => {
        const idx = event.currentTarget.getAttribute('checkbox-idx');
        el.checkboxes.forEach((element, index) => {
          if (element.id == idx) { element.checked = false; }
        });

        selectedBarItems.splice(event.currentTarget.getAttribute('current-idx'), 1);
        methods.checkedCounter();
      },
      checkAllClicked: event => {
        const elem = event.currentTarget;
        if (elem.checked) {
          el.checkboxes.forEach(eleme => {
            if (!eleme.disabled) {
              // eleme.checked = true;
              if (!selectedBarItems.includes(eleme)) {
                eleme.checked = true;
                selectedBarItems.push(eleme);
              }
            }
          });
        } else {
          el.checkboxes.forEach(eleme => {
            eleme.checked = false;
          });
          selectedBarItems = [];
        }
        methods.checkedCounter();
      },
      checkboxClicked: event => {
        if (event.currentTarget.checked) {
          if (!selectedBarItems.includes(event.currentTarget)) {
            selectedBarItems.push(event.currentTarget);
          }
        } else {
          selectedBarItems.forEach((eleme, idx) => {
            if (eleme == event.currentTarget) {
              selectedBarItems.splice(idx, 1);
            }
          });
        }

        methods.checkedCounter();
      }
    };

    const bind = () => {
      methods.clearSelectedItems();
      if (el.checkboxAll) {
        el.checkboxAll.addEventListener('click', handler.checkAllClicked);
      }
      if (el.checkboxes) {
        el.checkboxes.forEach(element => {
          element.checked = false;
          element.addEventListener('click', handler.checkboxClicked);
        });
      }

      if (el.selectBarBodyClose) {
        el.selectBarBodyClose.addEventListener('click', handler.selectBarCloseClick);
      }
      methods.checkedCounter();

      if (el.selectBar) {
        el.selectBar.style.transform = 'translateX(0px)';
        // if (utils.isPc()) {
        //   el.selectBar.addEventListener('mousedown', handler.barMouseDown);
        // } else {
        //   el.selectBar.addEventListener('touchstart', handler.touchDown, { passive: true});
        // }
        el.selectBar.addEventListener('mousedown', handler.barMouseDown);
        el.selectBar.addEventListener('touchstart', handler.touchDown, { passive: true});
      }

      if (el.selectLeftBtn) {
        el.selectLeftBtn.addEventListener('click', handler.selectLeftBtnClick);
      }

      if (el.selectRightBtn) {
        el.selectRightBtn.addEventListener('click', handler.selectRightBtnClick);
      }

      window.addEventListener('resize', handler.resize);
      el.selectBar.draggable = false;
    };

    const unbind = function() {
      if (el.checkboxAll) {
        el.checkboxAll.removeEventListener('click', handler.checkAllClicked);
      }

      if (el.checkboxes) {
        el.checkboxes.forEach(element => {
          element.removeEventListener('click', handler.checkboxClicked);
        });
      }

      if (el.selectBarBodyClose) {
        el.selectBarBodyClose.removeEventListener('click', handler.selectBarCloseClick);
      }

      if (el.selectBar) {
        el.selectBar.removeEventListener('mousedown', handler.barMouseDown);
        el.selectBar.removeEventListener('touchstart', handler.touchDown);
      }

      if (el.selectLeftBtn) {
        el.selectLeftBtn.removeEventListener('click', handler.selectLeftBtnClick);
      }

      if (el.selectRightBtn) {
        el.selectRightBtn.removeEventListener('click', handler.selectRightBtnClick);
      }
      window.removeEventListener('resize', handler.resize);
    };

    const init = () => {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof ServiceApp
   * @description 재생성
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

export const ServiceAppController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new ServiceApp(el));
      }
    });
  }
};

/**
 * @namespace serviceapp
 * @alias mvJS.serviceapp
 * @memberof mvJs
 * @description 툴팁 제어
 */
mvJs.serviceapp = {};

/**
  * @param {String} selector - element selector
  * @memberof serviceapp
  * @function init
 **/
mvJs.serviceapp.init = ServiceAppController.init;