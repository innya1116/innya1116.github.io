import './libs/polyfill.js';
import { mvJs } from './config/';

// libray content
import { popupController } from './class/library/Popup';
import { tooltipController } from './class/library/Tooltip';
import { selectmenuController } from './class/library/Selectmenu';
import { accordionController } from './class/library/Accordion';
import { tabController } from './class/library/Tab';
import { topButtonController } from './class/library/TopButton';
import { scrollMenuController } from './class/library/ScrollMenu';
import { dataTextController } from './class/library/DataText';
import { customSwiperController } from './class/library/CustomSwiper';
import { datepickerController } from './class/library/Datepicker';
import { gnbLayoutController } from './class/content/GnbLayout';
import { fixedSlideController } from './class/content/FixedSlide.js';
import { greenInnovationController } from './class/content/GreenInnovation.js';
import { bgFullController } from './class/content/BgFull.js';
import { bgMotionController } from './class/content/BgMotion.js';
import { motionController } from './class/content/MotionItems';
import { scrollSlideController } from './class/content/ScrollSlide.js';
import { stickyController } from './class/content/Sticky.js';
import { popupViewController } from './class/content/PopupView.js';
import { checkboxListController } from './class/content/CheckboxList.js';
import { mainController } from './class/content/Main.js';

// babel seting
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const selector = {
  swiper        : '.swiper',
  popup         : '[data-popup-id]',
  toolTip       : '.tooltip',
  select        : '.select-wrap > select',
  accordion     : '.accordion',
  tab           : '.js-tab',
  topButton     : '.btn-top',
  scrollMenu    : '.scroll-menu',
  dataText      : '[data-text]',
  datepicker    : '.datepickerInner',
  gnblayout     : 'header.header',
  bgFull        : '.bg-full',
  bgMotionItem  : '.bg-motion-item',
  motionItems   : '.motion-item',
  scrollSlide   : '.scroll-slide',
  fixedSlide    : '.fixed-slide',
  greenInnovation : '.green-innovation',
  keyVisualFull : 'div.submain-keyvisual',
  sticky        : '.dashboard-sticky',
  popupView     : '.popup--view-options .popup__wrap',
  checkboxList  : '.checkbox-list',
  main          : '.container--main'
};

const handler = {
  contentReady() {
    dataTextController.init(selector.dataText);

    popupController.controller(selector.popup);
    
    selectmenuController.init(selector.select);

    tooltipController.init(selector.toolTip);

    accordionController.init(selector.accordion);

    tabController.init(selector.tab);

    topButtonController.init(selector.topButton);

    scrollMenuController.init(selector.scrollMenu);

    customSwiperController.init(selector.swiper);

    datepickerController.init(selector.datepicker);

    gnbLayoutController.init(selector.gnblayout);
    
    fixedSlideController.init(selector.fixedSlide);

    greenInnovationController.init(selector.greenInnovation);

    scrollSlideController.init(selector.scrollSlide);

    mainController.init(selector.main);

    bgMotionController.init(selector.bgMotionItem);

    motionController.init(selector.motionItems);

    motionController.keyVisual.init(selector.keyVisualFull);

    bgFullController.init(selector.bgFull);

    stickyController.init(selector.sticky);

    popupViewController.init(selector.popupView);

    checkboxListController.init(selector.checkboxList);
    
  },

  contentLoad() {
    
  }
};

/**
 * @function init
 * @alias common.init
 * @memberof common
 * @description 전체 스크립트 재 설정
 */ 

mvJs.common = {};
mvJs.common.init = handler.contentReady;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handler.contentReady);
} else {
  handler.contentReady();
}

document.addEventListener('load', handler.contentLoad);