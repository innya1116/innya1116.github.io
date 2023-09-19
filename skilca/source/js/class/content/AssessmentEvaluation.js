import { mvJs, root } from '../../config';
import gsap, {Power1} from 'gsap/all';

class AssessmentEvaluation {
  /**
    * Create a AssessmentEvaluation
    * @class AssessmentEvaluation
    * @param {Element} target - 생성 타겟
    * @description AssessmentEvaluation 활성화 class
  */
  constructor(target) {
    const el = {
      target            :   target,
      assessmentSteps   :   null
    };

    const selector = {
      assessmentSteps  :   '.assessment-step'
    };

    const handler = {
      /**
       * @callback btnClick
       * @memberof AssessmentEvaluation
       * @description assessment step 오픈
      */
      btnClick: () => {
        stepOpen();
      }
    };

    // div.assessment-step에 is-expand 클래스가 추가될 경우 slidedown으로 열리는 모션
    const stepOpen = () => {
      let contentEl = target.querySelector('.assessment-step__contents');

      gsap.set(contentEl, {
        autoAlpha: 1,
        height: 'auto',
        paddingBottom : 35
      });
      gsap.from(contentEl, 0.5, {
        height: 0,
        padding: 0,
        ease: Power1.out
      });

      el.target.classList.add('is-expand');
      el.target.classList.remove('is-collapse');
      contentEl.style.paddingBottom = '35px';
    };

    // div.assessment-step에 is-expand 클래스를 is-collapse로 변경하고 내용은 slideup 되도록 하는 함수
    const stepClose = () => {
      let contentEl = el.target.querySelector('.assessment-step__contents');
      let rect = contentEl.getBoundingClientRect().height;

      gsap.timeline({defaults: {duration: 0.5}})
        .fromTo(contentEl, {height: rect}, {
          height: 0,
          paddingBottom: 0,
          ease: Power1.out,
          duration: 0.5
        })
        .add(() => {
          el.target.classList.add('is-collapse');
          el.target.classList.remove('is-expand');
        }, '>+0.1');
    };

    const bind = () => {
      const child = target.querySelector('.assessment-step__selected-data');
      if (child) {
        child.addEventListener('click', handler.btnClick);
      }
    };

    const unbind = () => {

    };

    const setProperty = () => {
      el.assessmentSteps = document.querySelectorAll(selector.assessmentSteps);
    };

    const init = () => {

      setProperty();

      bind();

    };

    /**
     * @function reInit
     * @memberof AssessmentEvaluation
     * @description AssessmentEvaluation 인스턴스 재생성
    */  
    const reInit = () => {

      unbind();

      setProperty();

      bind();

    };

    init();

    this.reInit = reInit;
    this.stepClose = stepClose;
    this.stepOpen = stepOpen;
  }
}

export const assessmentEvaluationController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);

      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new AssessmentEvaluation(el));
      }
    });
  },

  /**
   * @method assessmentStepClose
   * @param {String} selector - element id
   * @memberof AssessmentEvaluation
   * @description assessment step을 닫을 애니메이션 호출할 함수
   */
  assessmentStepClose: (id) => {
    let el = document.getElementById(id);
    const obj = root.weakMap.get(el);
    obj.stepClose();
  },

  /**
   * @method assessmentStepOpen
   * @param {String} selector - element id
   * @memberof AssessmentEvaluation
   * @description step을 열릴 애니메이션 호출할 함수
   */
  assessmentStepOpen: (id) => {
    let el = document.getElementById(id);
    const obj = root.weakMap.get(el);
    obj.stepOpen();
  }
};

/**
 * @namespace assessmentEvaluation
 * @alias mvJS.assessmentEvaluation
 * @memberof mvJs
 * @description assessmentEvaluation step 열리고 닫히는 기능 활성화
 */
mvJs.assessmentEvaluation = {};

/**
  * @param {String} selector - element id
  * @memberof assessmentEvaluation
  * @function init
  * @description  AssessmentEvaluation 인스턴스 생성
 **/
mvJs.assessmentEvaluation.init = assessmentEvaluationController.init;

/**
  * @param {String} selector - element id
  * @memberof assessmentEvaluation
  * @function stepClose
  * @description  assessment step 닫기
 **/
mvJs.assessmentEvaluation.stepClose = assessmentEvaluationController.assessmentStepClose;

/**
  * @param {String} selector - element id
  * @memberof assessmentEvaluation
  * @function stepOpen
  * @description  assessment step 열기
 **/
mvJs.assessmentEvaluation.stepOpen = assessmentEvaluationController.assessmentStepOpen;
