import { mvJs, root } from '../../config';
import gsap, { ScrollTrigger, TweenLite} from 'gsap/all';
import { utils } from '../../libs/utils';

gsap.registerPlugin(ScrollTrigger);

class OverView {
  constructor(target) {
    const el = {
      target,
      enviroments: null,
      indicator: null,
      anchors: null,
      esgChart: null,
      overviewSocial: null
    };

    const selector = {
      enviroments: '.overview__environment',
      indicator: '.overview__indicator',
      anchors: 'a',
      esgChart: '.overview__chart',
      overviewSocial: '.overview__social'
    };
    //overview__indicator--fi xed

    const setProperty = () => {
      el.enviroments = el.target.querySelectorAll(selector.enviroments);
      el.indicator = el.target.querySelector(selector.indicator);
      el.esgChart = el.target.querySelectorAll(selector.esgChart);
      if (el.indicator) {
        el.anchors = el.indicator.querySelectorAll(selector.anchors);
        el.anchors.forEach(elm => {
          elm.style.transition = '.3s';
        });
      }

      el.overviewSocial = el.target.querySelector(selector.overviewSocial);
    };

    const methods = {
      chartTrigger: () => {
        el.esgChart.forEach(element => {
          const currElm = element.querySelector('.overview__object');

          if (currElm) {
            gsap.set(element, { y: 100,
              opacity: 0 });

            ScrollTrigger.create({
              trigger: element,
              start: 'top bottom',
              end: 'bottom 15%',
              onEnter: () => {
                gsap.to(element, { y: 0,
                  opacity: 1,
                  duration: root.tweenSpeed});
                // currElm.classList.add('motion-on');
              },
              onEnterBack: () => {
                // currElm.classList.add('motion-on');
              },
              onLeave: () => {
                gsap.to(element, { y: 0,
                  opacity: 1,
                  duration: root.tweenSpeed});

                // currElm.classList.remove('motion-on');
              },
              onLeaveBack: () => {
                gsap.to(element, { y: 100,
                  opacity: 0 });
                // currElm.classList.remove('motion-on');
              }
            });

            ScrollTrigger.create({
              trigger: element,
              start: 'bottom bottom',
              end: 'bottom top',
              onEnter: () => {
                currElm.classList.add('motion-on');
              },
              onEnterBack: () => {
                currElm.classList.add('motion-on');
              },
              onLeave: () => {
                currElm.classList.remove('motion-on');
              },
              onLeaveBack: () => {
                currElm.classList.remove('motion-on');
              }
            });


          }
        });
      },
      setFirstEnviroment: (currElm, env) => {
        gsap.set(currElm, {
          y: 100,
          opacity: 0
        });

        ScrollTrigger.create({
          trigger: currElm,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            gsap.to(currElm, {
              y: 0,
              opacity: 1,
              duration: root.tweenSpeed
            });

            gsap.to(env, {
              y: 0,
              opacity: 1,
              duration: root.tweenSpeed
            });
          },
          onLeaveBack: () => {
            gsap.set(currElm, {
              y: 100,
              opacity: 0
            });
          }
        });
      },
      setEnviromentCustom: () => {
        if (!el.enviroments) {
          return;
        }

        el.enviroments.forEach((element) => {
          // if (index === 0) {
          //   const currElm = element.closest('.contents').querySelector('.overview__text');
          //   if (currElm) {
          //     methods.setFirstEnviroment(currElm, element);
          //   }
          // }
          gsap.set(element, {
            y: 100,
            opacity: 0
          });
        });
      },
      setEnviromentMotion: () => {
        if (!el.enviroments) {
          return;
        }

        el.enviroments.forEach((element, idx) => {
          ScrollTrigger.create({
            trigger: element,
            start: 'top 70%',
            end: 'bottom 100%',
            onEnter: () => {
              el.indicator.classList.add('overview__indicator--fixed');
              el.anchors.forEach((link, indx) => {
                indx === idx ? link.classList.add('is-active') : link.classList.remove('is-active');
              });

              // if (idx > 0) {
              //   gsap.to(element, {
              //     y: 0,
              //     opacity: 1,
              //     duration: root.tweenSpeed
              //   });
              // }
              gsap.to(element, {
                y: 0,
                opacity: 1,
                duration: root.tweenSpeed
              });
            },
            onEnterBack: () => {
              el.indicator.classList.add('overview__indicator--fixed');
              el.anchors.forEach((link, indx) => {
                indx === idx ? link.classList.add('is-active') : link.classList.remove('is-active');
              });
            },
            onLeave: () => {
              idx === el.enviroments.length - 1 ? el.indicator.classList.remove('overview__indicator--fixed') : null;
            },
            onLeaveBack: () => {
              idx === 0 ? el.indicator.classList.remove('overview__indicator--fixed') : null;
              gsap.set(element, {
                y: 100,
                opacity: 0
              });
            }
          });
        });
      },
      setGraphMotion: () => {
        const li = el.overviewSocial.querySelectorAll('li');
        if (li) {
          li.forEach(eleme => {
            TweenLite.killTweensOf(eleme);
            ScrollTrigger.create({
              trigger: eleme,
              start: '70% bottom',
              onEnter: () => {
                const progress = eleme.querySelectorAll('div.overview__graph span');
                if (progress) {
                  progress.forEach(elm => {
                    elm.style.width = elm.getAttribute('data-per') + '%';
                  });
                }
              },
              onLeaveBack: () => {
                const progress = eleme.querySelectorAll('div.overview__graph span');
                if (progress) {
                  progress.forEach(elm => {
                    elm.style.width = '0%';
                  });
                }
              }
            });
          });
        }
      }
    };

    const handler = {
      linkClick: event => {
        el.anchors.forEach((eleme, idx) => {
          if (eleme === event.currentTarget) {
            // if (idx === 0) {
            //   event.currentTarget.classList.add('is-active');
            //   utils.tweenScroll.go(window.innerHeight + 100, 1, () => {});
            // } else {
            //   event.currentTarget.classList.add('is-active');
            //   utils.tweenScroll.go(el.enviroments[idx].offsetTop + window.innerHeight, 1, () => {});
            // }
            event.currentTarget.classList.add('is-active');
            utils.tweenScroll.go(el.enviroments[idx].offsetTop + window.innerHeight, 1, () => {});
          } else {
            eleme.classList.remove('is-active');
          }
        });
      }
    };

    const bind = () => {
      // methods.setEnviromentCustom();
      methods.setEnviromentMotion();
      methods.chartTrigger();
      if (el.anchors) {
        el.anchors.forEach(eleme => {
          eleme.addEventListener('click', handler.linkClick);
        });
      }

      if (el.overviewSocial) {
        methods.setGraphMotion();
      }
    };

    const unbind = () => {
      if (el.enviroments) {
        el.enviroments.forEach((element, index) => {
          TweenLite.killTweensOf(element);
          if (index === 0) {
            const currElm = element.closest('.contents').querySelector('.overview__text');
            TweenLite.killTweensOf(currElm);
          }
        });
      }

      if (el.esgChart) {
        el.esgChart.forEach(element => {
          TweenLite.killTweensOf(element);
        });
      }

      if (el.anchors) {
        el.anchors.forEach(eleme => {
          eleme.removeEventListener('click', handler.linkClick);
        });
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


export const overViewController = {
  init: (selector) => {
    [... document.querySelectorAll(selector)].forEach((el) => {
      const obj = root.weakMap.get(el);
      if (obj) {
        obj.reInit();
      } else {
        root.weakMap.set(el, new OverView(el));
      }
    });
  }
};

/**
 * @namespace overview
 * @alias mvJS.overview
 * @memberof mvJs
 * @description 툴팁 제어
 */
mvJs.overview = {};
/**
   * @param {String} selector - element selector
   * @memberof overview
   * @function init
  **/
mvJs.overview.init = overViewController.init;