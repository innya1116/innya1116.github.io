// import './libs/polyfill.js';
import { mvJs } from './config/';


// libray content
import { popupController } from './class/library/Popup';
import { popupExtendController } from './class/content/popupExtend';

import { tooltipController } from './class/library/Tooltip';
// import { selectmenuController } from './class/library/Selectmenu';
import { accordionController } from './class/library/Accordion.js';
import { tabController } from './class/library/Tab.js';
import { topButtonController } from './class/library/TopButton.js';
import { scrollMenuController } from './class/library/ScrollMenu.js';
import { dataTextController } from './class/library/DataText.js';
import { customSwiperController } from './class/library/CustomSwiper.js';
import { GuidePop, ServiceAppController } from './class/content/MyInfo.js';
import { mainController } from './class/content/Main';
import { gnbBarController } from './class/content/GnbBar';
import { ttsController } from './class/content/Tts';

// content
import {commonAreaController} from './class/content/CommonArea';
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
  guidePop      : '.myinfo .local-site-guide-popup',
  serviceApp    : '.myinfo .service-app',
  main          : '.main',
  gnbBar        : 'nav.gnb',
  tts           : '.tts-btn'
};

const hander = {
  contentReady() {
    dataTextController.init(selector.dataText);

    popupController.controller(selector.popup);
    popupExtendController.init();

    // selectmenuController.init(selector.select);

    tooltipController.init(selector.toolTip);

    accordionController.init(selector.accordion);

    tabController.init(selector.tab);

    topButtonController.init(selector.topButton);

    scrollMenuController.init(selector.scrollMenu);

    customSwiperController.init(selector.swiper);
    new GuidePop(selector.guidePop);
    ServiceAppController.init(selector.serviceApp);
    gnbBarController.init(selector.gnbBar);
    // console.log('--- ready ');
    // content init
    commonAreaController.init(document);

    mainController.init(selector.main);

    ttsController.init(selector.tts);
  },

  contentLoad() {
    commonAreaController.load(document);
  }
};

/**
 * @function init
 * @alias common.init
 * @memberof common
 * @description 전체 스크립트 재 설정
 */ 

/*
 
*/ 

mvJs.common = {};
mvJs.common.init = hander.contentReady;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hander.contentReady);
} else {
  hander.contentReady();
}

window.addEventListener('load', hander.contentLoad);