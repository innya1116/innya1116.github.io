import { mvJs, root } from '../../config';

class PopupView {
  /**
   * Create a PopupView
   * @class PopupView
   * @param {Element} target - 생성 타겟
   * @description div.popup--view-options 팝업 내의 선택된 input값 적용
   */
  constructor(target) {
    const el = {
      target     :   target,
      title      :   null,
      button     :   null,
      ocList     :   null,
      fieldList  :   null,
      checkbox   :   null,
      popClose   :   null,
      popConfirm :   null
    };

    const selector = {
      title      :   '.page-title',
      button     :   '.page-title-wrap a',
      ocList     :   '[name=dashboard-oc]',
      fieldList  :   '[name=dashboard-field]',      
      checkbox   :   '.checkbox-list__btn span',
      popClose   :   '.btn--cancel',
      popConfirm :   '.btn--confirm'
    };

    let selectedCheckbox;
    let selectedOc;
    let selectedField;
    let popupId;

    const handler = {
      /**
       * @callback clickConfirm
       * @memberof PopupView
       * @description 확인 버튼 클릭 시 선택된 input값 h1.page-title에 적용
      */
      clickConfirm: () => {
        method.manageSelectedItems();
        handler.closePopup();
      },
      closePopup: () => {
        mvJs.popup.close(`#${popupId}`);
      }
    };

    const bind = () => {
      el.popConfirm.addEventListener('click', handler.clickConfirm);
      el.popClose.addEventListener('click', handler.closePopup);
    };

    const unbind = () => {
      el.popConfirm.removeEventListener('click', handler.clickConfirm);
      el.popClose.removeEventListener('click', handler.closePopup);
    };

    const setProperty = () => {
      el.title = document.querySelector(selector.title);
      el.button = document.querySelector(selector.button);
      el.ocList = el.target.querySelectorAll(selector.ocList);
      el.fieldList = el.target.querySelectorAll(selector.fieldList);
      el.checkbox = el.target.querySelector(selector.checkbox);
      el.popConfirm = el.target.querySelector(selector.popConfirm);
      el.popClose = el.target.querySelector(selector.popClose);
      popupId = el.button.getAttribute('data-popup-id');
    };

    const init = () => {

      setProperty();

      bind();

      method.manageSelectedItems();

    };

    /**
   * @function reInit
   * @memberof PopupView
   * @description PopupView 인스턴스 재생성
   */  
    const reInit = () => {

      unbind();

      setProperty();

      bind();

      method.manageSelectedItems();
      
    };

    const method = {
      manageSelectedItems : () => {
        method.getCheckVal();

        el.title.innerText = '';

        let selectedOne = el.target.querySelector(`${selector.ocList}:checked`).id;
        selectedOc = el.target.querySelector(`label[for=${selectedOne}]`).textContent;

        let selectedTwo = el.target.querySelector(`${selector.fieldList}:checked`).id;
        selectedField = el.target.querySelector(`label[for=${selectedTwo}]`).textContent;

        el.title.innerText += selectedCheckbox;
        el.title.innerText += ` / ${selectedOc}`;
        el.title.innerText += ` / ${selectedField}`;
      },
      getCheckVal : () => {
        let elemStr = el.target.querySelector(selector.checkbox).textContent;
        const reg = new RegExp(/\d+/g);
        elemStr = elemStr.split(' ');
        selectedCheckbox = '';
        elemStr.forEach(elem => {
          let str = '';
          reg.test(elem) ? str = '\'' + (reg.test(elem), elem.substring(2)) : str = elem;
          selectedCheckbox += str;
        });

        selectedCheckbox = selectedCheckbox.replace('~', '-');
      }
    };
    
    init();

    this.reInit = reInit;
  }
}

export const popupViewController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new PopupView(el));
      }
    });
  }
};

/**
 * @namespace popupView
 * @alias mvJS.popupView
 * @memberof mvJs
 * @description PopupView 활성화
*/
mvJs.popupView = {};
/**
 * @param {String} selector - element selector
 * @memberof popupView
 * @function init
 * @description PopupView 인스턴스 생성
**/
mvJs.popupView.init = popupViewController.init;