import './libs/polyfill.js';
import { mvJs } from './config/';

// libray content
import { popupController } from './class/library/Popup';
import { tooltipController } from './class/library/Tooltip';
import { selectmenuController } from './class/library/Selectmenu';
import { accordionController } from './class/library/Accordion.js';
import { tabController } from './class/library/Tab.js';
import { topButtonController } from './class/library/TopButton.js';
import { scrollMenuController } from './class/library/ScrollMenu.js';
import { dataTextController } from './class/library/DataText.js';
import { customSwiperController } from './class/library/CustomSwiper.js';
import { stickyController } from './class/content/Sticky.js';
import { checkboxListController } from './class/content/CheckboxList.js';
import { motionController } from './class/content/MotionItems';
import { overViewController } from './class/content/OverView';
import { bgMotionController } from './class/content/BgMotion.js';
import { fixedSlideController } from './class/content/FixedSlide.js';
import { greenInnovationController } from './class/content/GreenInnovation.js';
import { gnbLayoutController } from './class/content/GnbLayout';
import { scrollSlideController } from './class/content/ScrollSlide.js';
import { bgFullController } from './class/content/BgFull.js';
import { growthSubmainController } from './class/content/GrowthSubmain.js';
import { growthStickyController } from './class/content/GrowthSticky.js';
import { mainGateController } from './class/content/MainGate.js';

// babel seting
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const selector = {
  swiper          : '.swiper',
  popup           : '[data-popup-id]',
  toolTip         : '.tooltip',
  select          : '.select-wrap > select',
  accordion       : '.accordion',
  tab             : '.js-tab',
  topButton       : '.btn-top',
  scrollMenu      : '.scroll-menu',
  dataText        : '[data-text]',
  sticky          : '.dashboard-sticky',
  checkboxList    : '.checkbox-list',
  keyVisualFull   : 'div.submain-keyvisual',
  motionItems     : '.motion-item',
  overView        : 'div.overview',
  bgMotionItem    : '.bg-motion-item',
  fixedSlide      : '.fixed-slide',
  greenInnovation : '.green-innovation',
  gnblayout       : 'header.header',
  scrollSlide     : '.scroll-slide',
  bgFull          : '.bg-full',
  // main           : '.container--main',
  main            : '.main',
  growthSubmain   : '.growth-submain',
  // growthText      : '.growth-text',
  growthSticky    : '.growth-sticky'
};

const hander = {
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

    bgMotionController.init(selector.bgMotionItem);
    fixedSlideController.init(selector.fixedSlide);
    greenInnovationController.init(selector.greenInnovation);

    stickyController.init(selector.sticky);
    checkboxListController.init(selector.checkboxList);
    overViewController.init(selector.overView);
    motionController.keyVisual.init(selector.keyVisualFull);
    gnbLayoutController.init(selector.gnblayout);
    scrollSlideController.init(selector.scrollSlide);

    //mainController.init(selector.main);
    mainGateController.init(selector.main);

    motionController.init(selector.motionItems);
    bgFullController.init(selector.bgFull);

    growthSubmainController.init(selector.growthSubmain);
    // growthTextController.init(selector.growthText);
    growthStickyController.init(selector.growthSticky);
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
mvJs.common.init = hander.contentReady;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hander.contentReady);
} else {
  hander.contentReady();
}

document.addEventListener('load', hander.contentLoad);