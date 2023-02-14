import { mvJs, root } from '../../config';

class CheckboxList {
  /**
   * Create a CheckboxList
   * @class CheckboxList
   * @param {Element} target - 생성 타겟
   * @description 체크박스 리스트
   */
  constructor(target) {
    const el = {
      listWrap   :   target,
      button     :   null,
      list       :   null,
      listItem   :   null,
      titleSpan  :   null
    };

    const selector = {
      button     :   '.checkbox-list__btn',
      list       :   '.checkbox-list__items',
      item       :   '.checkbox-list__items .checkbox',
      titleSpan  :   '.checkbox-list__btn span',
      checkbox   :   'input[type=checkbox]:checked'
    };

    const className = {
      open       :    'checkbox-list--open'
    };

    // 최소 1개 년 최대 선택 3개 년
    const selectMax = 3;
    const selectMin = 1;
    let selectedItems = [];    

    const handler = {
      /**
       * @callback toggleList
       * @memberof CheckboxList
       * @description 버튼을 클릭하여 체크박스 리스트가 열리면 checkbox-list--open 클래스 추가/삭제
      */
      toggleList: () => {
        method.toggle();
      },
      change: (evt) => {

        // 최소 1개 년
        if (selectedItems.length === selectMin && !evt.target.checked) {
          evt.target.checked = true;
          return;
        }

        //최대 선택 3개 년
        if (selectedItems.length === selectMax && evt.target.checked) {
          evt.target.checked = false;
          return;
        }
        
        method.manageSelectedItems();
      },
      documentClick : (evt) => {
        if (el.listWrap.contains(evt.target)) {
          return;
        }
        method.close();
      }
    };

    const bind = () => {
      el.button.addEventListener('click', handler.toggleList);
      [... el.listItem].forEach(element => {
        let checkboxEl = element.querySelector('[type=checkbox]');
        checkboxEl.addEventListener('change', handler.change);
      });
      document.addEventListener('click', handler.documentClick);
    };

    const unbind = () => {
      el.button.removeEventListener('click', handler.toggleList);
      [... el.listItem].forEach(element => {
        let checkboxEl = element.querySelector('[type=checkbox]');
        checkboxEl.removeEventListener('change', handler.change);
      });
      document.removeEventListener('click', handler.documentClick);
    };

    const setProperty = () => {
      el.button = el.listWrap.querySelector(selector.button);
      el.list = el.listWrap.querySelector(selector.list);
      el.listItem = el.listWrap.querySelectorAll(selector.item);
      el.titleSpan = el.listWrap.querySelector(selector.titleSpan);
    };

    const init = () => {

      setProperty();

      bind();

      method.manageSelectedItems();

    };

    /**
   * @function reInit
   * @memberof CheckboxList
   * @description CheckboxList 인스턴스 재생성
   */  
    const reInit = () => {

      unbind();

      setProperty();

      bind();

      method.manageSelectedItems();
      
    };

    const method = {
      toggle : () => {
        el.listWrap.classList.contains(className.open) ? method.close() : method.open();
      },
      open : () => {
        el.listWrap.classList.add(className.open);
        el.button.setAttribute('aria-expanded', true);
        el.list.setAttribute('aria-hidden', false);
      },
      close : () => {
        el.listWrap.classList.remove(className.open);
        el.button.setAttribute('aria-expanded', false);
        el.list.setAttribute('aria-hidden', true);
      },
      manageSelectedItems : () => {
        selectedItems = [];

        let checkedCheckboxes = el.list.querySelectorAll(selector.checkbox);
        for (const item of checkedCheckboxes) {
          let checkboxValue = parseInt(item.nextElementSibling.textContent);
          selectedItems.push(checkboxValue);
        }

        selectedItems.sort((a, b) => a - b);

        method.changeSpan();
      },
      changeSpan : () => {

        let range = [];
        let rangeStr = '';

        for (let i = 0; i < selectedItems.length; i++) {
          let elem = selectedItems[i];
          let nextElem = selectedItems[i+1];
          
          if (elem + 1 !== nextElem) {
            if (rangeStr !== '') {
              rangeStr = rangeStr + elem;
              range.push(rangeStr);
              rangeStr = '';
            } else {
              range.push(elem);
            }
            continue;
          }
          
          if (rangeStr === '') {
            rangeStr = elem + ' ~ ';
          }
        }

        el.titleSpan.innerText = range.join(', ');
      }
    };
    
    init();

    this.reInit = reInit;
  }
}

export const checkboxListController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new CheckboxList(el));
      }
    });
  }
};

/**
 * @namespace checkboxList
 * @alias mvJS.checkboxList
 * @memberof mvJs
 * @description CheckboxList 활성화
*/
mvJs.checkboxList = {};
/**
 * @param {String} selector - element selector
 * @memberof checkboxList
 * @function init
 * @description CheckboxList 인스턴스 생성
**/
mvJs.checkboxList.init = checkboxListController.init;