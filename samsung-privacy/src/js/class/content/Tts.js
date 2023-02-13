import { root } from '../../config';

class Tts {
  constructor(target) {
    const el = {
      btn: target
      // area: null
    };

    const speechMsg = new SpeechSynthesisUtterance();
    // 속도: 0.1 ~ 10      
    speechMsg.rate = 1;
    // 음높이: 0 ~ 2
    speechMsg.pitch =1; 
    speechMsg.lang = 'en-US';

    let label = '';
    let targetId = '';
    let textArr = [];
    let current = 0;
    let total = 0;

    // eslint-disable-next-line no-unused-vars
    const selector = {};

    const handler = {
      /**
       * @callback btnClick
       * @memberof Tts
       * @description tts 버튼 클릭
       */
      btnClick: () => {  
        current = 0;
        method.speak(textArr[0]);
      },

      /**
       * @callback btnClick
       * @memberof Tts
       * @description tts 버튼 클릭
       */
      speechEnd: () => {
        if (total === 0) {
          el.btn.disabled = false;
          return;
        }

        current++;
        if (current < total) {
          method.speak(textArr[current]);
        } else {
          current = 0;
          el.btn.disabled = false;
        }
      }
    };
    
    const method = {
      speak(text) {
        console.log(el.btn);
        el.btn.disabled = true;

        window.speechSynthesis.cancel();

        speechMsg.text = text;

        window.speechSynthesis.speak(speechMsg);
      }
    };

    const bind = function() {
      el.btn.addEventListener('click', handler.btnClick);

      speechMsg.addEventListener('end', handler.speechEnd);
    };

    const unbind = function() {
      el.btn.removeEventListener('click', handler.btnClick);

      speechMsg.removeEventListener('end', handler.speechEnd);
    };

    const setProperty = function() {
      label = el.btn.dataset.label;
      if (label) {
        textArr.push(label);
      }

      targetId = el.btn.dataset.targetId;
      if (targetId) {
        const tarr = targetId.split(' ');

        tarr.forEach((id) => {
          textArr.push(document.querySelector(`#${id}`).textContent);
        });

        total = tarr.length;
      }
    };

    const init = function() {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof Tts
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

export const ttsController = {
  init: (selector) => {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);
      
      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new Tts(el));
      }
    });
  }
};