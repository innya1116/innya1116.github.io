/**
 * jquery.mask.js
 * @version: v1.14.16
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at github.com/igorescobar/jQuery-Mask-Plugin
 *
 * Copyright (c) 2012 Igor Escobar http://igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* jshint maxcomplexity:17 */
/* global define */

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
(function (factory, jQuery, Zepto) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof Meteor === 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }
})(
    function ($) {
        'use strict';

        var Mask = function (el, mask, options) {
            var p = {
                invalid: [],
                getCaret: function () {
                    try {
                        var sel,
                            pos = 0,
                            ctrl = el.get(0),
                            dSel = document.selection,
                            cSelStart = ctrl.selectionStart;

                        // IE Support
                        if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                            sel = dSel.createRange();
                            sel.moveStart('character', -p.val().length);
                            pos = sel.text.length;
                        }
                        // Firefox support
                        else if (cSelStart || cSelStart === '0') {
                            pos = cSelStart;
                        }

                        return pos;
                    } catch (e) {}
                },
                setCaret: function (pos) {
                    try {
                        if (el.is(':focus')) {
                            var range,
                                ctrl = el.get(0);

                            // Firefox, WebKit, etc..
                            if (ctrl.setSelectionRange) {
                                ctrl.setSelectionRange(pos, pos);
                            } else {
                                // IE
                                range = ctrl.createTextRange();
                                range.collapse(true);
                                range.moveEnd('character', pos);
                                range.moveStart('character', pos);
                                range.select();
                            }
                        }
                    } catch (e) {}
                },
                events: function () {
                    el.on('keydown.mask', function (e) {
                        el.data('mask-keycode', e.keyCode || e.which);
                        el.data('mask-previus-value', el.val());
                        el.data('mask-previus-caret-pos', p.getCaret());
                        p.maskDigitPosMapOld = p.maskDigitPosMap;
                    })
                        .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                        .on('paste.mask drop.mask', function () {
                            setTimeout(function () {
                                el.keydown().keyup();
                            }, 100);
                        })
                        .on('change.mask', function () {
                            el.data('changed', true);
                        })
                        .on('blur.mask', function () {
                            if (oldValue !== p.val() && !el.data('changed')) {
                                el.trigger('change');
                            }
                            el.data('changed', false);
                        })
                        // it's very important that this callback remains in this position
                        // otherwhise oldValue it's going to work buggy
                        .on('blur.mask', function () {
                            oldValue = p.val();
                        })
                        // select all text on focus
                        .on('focus.mask', function (e) {
                            if (options.selectOnFocus === true) {
                                $(e.target).select();
                            }
                        })
                        // clear the value if it not complete the mask
                        .on('focusout.mask', function () {
                            if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                                p.val('');
                            }
                        });
                },
                getRegexMask: function () {
                    var maskChunks = [],
                        translation,
                        pattern,
                        optional,
                        recursive,
                        oRecursive,
                        r;

                    for (var i = 0; i < mask.length; i++) {
                        translation = jMask.translation[mask.charAt(i)];

                        if (translation) {
                            pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                            optional = translation.optional;
                            recursive = translation.recursive;

                            if (recursive) {
                                maskChunks.push(mask.charAt(i));
                                oRecursive = { digit: mask.charAt(i), pattern: pattern };
                            } else {
                                maskChunks.push(!optional && !recursive ? pattern : pattern + '?');
                            }
                        } else {
                            maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                        }
                    }

                    r = maskChunks.join('');

                    if (oRecursive) {
                        r = r
                            .replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                            .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                    }

                    return new RegExp(r);
                },
                destroyEvents: function () {
                    el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
                },
                val: function (v) {
                    var isInput = el.is('input'),
                        method = isInput ? 'val' : 'text',
                        r;

                    if (arguments.length > 0) {
                        if (el[method]() !== v) {
                            el[method](v);
                        }
                        r = el;
                    } else {
                        r = el[method]();
                    }

                    return r;
                },
                calculateCaretPosition: function (oldVal) {
                    var newVal = p.getMasked(),
                        caretPosNew = p.getCaret();
                    if (oldVal !== newVal) {
                        var caretPosOld = el.data('mask-previus-caret-pos') || 0,
                            newValL = newVal.length,
                            oldValL = oldVal.length,
                            maskDigitsBeforeCaret = 0,
                            maskDigitsAfterCaret = 0,
                            maskDigitsBeforeCaretAll = 0,
                            maskDigitsBeforeCaretAllOld = 0,
                            i = 0;

                        for (i = caretPosNew; i < newValL; i++) {
                            if (!p.maskDigitPosMap[i]) {
                                break;
                            }
                            maskDigitsAfterCaret++;
                        }

                        for (i = caretPosNew - 1; i >= 0; i--) {
                            if (!p.maskDigitPosMap[i]) {
                                break;
                            }
                            maskDigitsBeforeCaret++;
                        }

                        for (i = caretPosNew - 1; i >= 0; i--) {
                            if (p.maskDigitPosMap[i]) {
                                maskDigitsBeforeCaretAll++;
                            }
                        }

                        for (i = caretPosOld - 1; i >= 0; i--) {
                            if (p.maskDigitPosMapOld[i]) {
                                maskDigitsBeforeCaretAllOld++;
                            }
                        }

                        // if the cursor is at the end keep it there
                        if (caretPosNew > oldValL) {
                            caretPosNew = newValL * 10;
                        } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
                            if (!p.maskDigitPosMapOld[caretPosNew]) {
                                var caretPos = caretPosNew;
                                caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll;
                                caretPosNew -= maskDigitsBeforeCaret;
                                if (p.maskDigitPosMap[caretPosNew]) {
                                    caretPosNew = caretPos;
                                }
                            }
                        } else if (caretPosNew > caretPosOld) {
                            caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld;
                            caretPosNew += maskDigitsAfterCaret;
                        }
                    }
                    return caretPosNew;
                },
                behaviour: function (e) {
                    e = e || window.event;
                    p.invalid = [];

                    var keyCode = el.data('mask-keycode');

                    if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                        var newVal = p.getMasked(),
                            caretPos = p.getCaret(),
                            oldVal = el.data('mask-previus-value') || '';

                        // this is a compensation to devices/browsers that don't compensate
                        // caret positioning the right way
                        setTimeout(function () {
                            p.setCaret(p.calculateCaretPosition(oldVal));
                        }, $.jMaskGlobals.keyStrokeCompensation);

                        p.val(newVal);
                        p.setCaret(caretPos);
                        return p.callbacks(e);
                    }
                },
                getMasked: function (skipMaskChars, val) {
                    var buf = [],
                        value = val === undefined ? p.val() : val + '',
                        m = 0,
                        maskLen = mask.length,
                        v = 0,
                        valLen = value.length,
                        offset = 1,
                        addMethod = 'push',
                        resetPos = -1,
                        maskDigitCount = 0,
                        maskDigitPosArr = [],
                        lastMaskChar,
                        check;

                    if (options.reverse) {
                        addMethod = 'unshift';
                        offset = -1;
                        lastMaskChar = 0;
                        m = maskLen - 1;
                        v = valLen - 1;
                        check = function () {
                            return m > -1 && v > -1;
                        };
                    } else {
                        lastMaskChar = maskLen - 1;
                        check = function () {
                            return m < maskLen && v < valLen;
                        };
                    }

                    var lastUntranslatedMaskChar;
                    while (check()) {
                        var maskDigit = mask.charAt(m),
                            valDigit = value.charAt(v),
                            translation = jMask.translation[maskDigit];

                        if (translation) {
                            if (valDigit.match(translation.pattern)) {
                                buf[addMethod](valDigit);
                                if (translation.recursive) {
                                    if (resetPos === -1) {
                                        resetPos = m;
                                    } else if (m === lastMaskChar && m !== resetPos) {
                                        m = resetPos - offset;
                                    }

                                    if (lastMaskChar === resetPos) {
                                        m -= offset;
                                    }
                                }
                                m += offset;
                            } else if (valDigit === lastUntranslatedMaskChar) {
                                // matched the last untranslated (raw) mask character that we encountered
                                // likely an insert offset the mask character from the last entry; fall
                                // through and only increment v
                                maskDigitCount--;
                                lastUntranslatedMaskChar = undefined;
                            } else if (translation.optional) {
                                m += offset;
                                v -= offset;
                            } else if (translation.fallback) {
                                buf[addMethod](translation.fallback);
                                m += offset;
                                v -= offset;
                            } else {
                                p.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                            }
                            v += offset;
                        } else {
                            if (!skipMaskChars) {
                                buf[addMethod](maskDigit);
                            }

                            if (valDigit === maskDigit) {
                                maskDigitPosArr.push(v);
                                v += offset;
                            } else {
                                lastUntranslatedMaskChar = maskDigit;
                                maskDigitPosArr.push(v + maskDigitCount);
                                maskDigitCount++;
                            }

                            m += offset;
                        }
                    }

                    var lastMaskCharDigit = mask.charAt(lastMaskChar);
                    if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                        buf.push(lastMaskCharDigit);
                    }

                    var newVal = buf.join('');
                    p.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen);
                    return newVal;
                },
                mapMaskdigitPositions: function (newVal, maskDigitPosArr, valLen) {
                    var maskDiff = options.reverse ? newVal.length - valLen : 0;
                    p.maskDigitPosMap = {};
                    for (var i = 0; i < maskDigitPosArr.length; i++) {
                        p.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1;
                    }
                },
                callbacks: function (e) {
                    var val = p.val(),
                        changed = val !== oldValue,
                        defaultArgs = [val, e, el, options],
                        callback = function (name, criteria, args) {
                            if (typeof options[name] === 'function' && criteria) {
                                options[name].apply(this, args);
                            }
                        };

                    callback('onChange', changed === true, defaultArgs);
                    callback('onKeyPress', changed === true, defaultArgs);
                    callback('onComplete', val.length === mask.length, defaultArgs);
                    callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
                },
            };

            el = $(el);
            var jMask = this,
                oldValue = p.val(),
                regexMask;

            mask = typeof mask === 'function' ? mask(p.val(), undefined, el, options) : mask;

            // public methods
            jMask.mask = mask;
            jMask.options = options;
            jMask.remove = function () {
                var caret = p.getCaret();
                if (jMask.options.placeholder) {
                    el.removeAttr('placeholder');
                }
                if (el.data('mask-maxlength')) {
                    el.removeAttr('maxlength');
                }
                p.destroyEvents();
                p.val(jMask.getCleanVal());
                p.setCaret(caret);
                return el;
            };

            // get value without mask
            jMask.getCleanVal = function () {
                return p.getMasked(true);
            };

            // get masked value without the value being in the input or element
            jMask.getMaskedVal = function (val) {
                return p.getMasked(false, val);
            };

            jMask.init = function (onlyMask) {
                onlyMask = onlyMask || false;
                options = options || {};

                jMask.clearIfNotMatch = $.jMaskGlobals.clearIfNotMatch;
                jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
                jMask.translation = $.extend({}, $.jMaskGlobals.translation, options.translation);

                jMask = $.extend(true, {}, jMask, options);

                regexMask = p.getRegexMask();

                if (onlyMask) {
                    p.events();
                    p.val(p.getMasked());
                } else {
                    if (options.placeholder) {
                        el.attr('placeholder', options.placeholder);
                    }

                    // this is necessary, otherwise if the user submit the form
                    // and then press the "back" button, the autocomplete will erase
                    // the data. Works fine on IE9+, FF, Opera, Safari.
                    if (el.data('mask')) {
                        el.attr('autocomplete', 'off');
                    }

                    // detect if is necessary let the user type freely.
                    // for is a lot faster than forEach.
                    for (var i = 0, maxlength = true; i < mask.length; i++) {
                        var translation = jMask.translation[mask.charAt(i)];
                        if (translation && translation.recursive) {
                            maxlength = false;
                            break;
                        }
                    }

                    if (maxlength) {
                        el.attr('maxlength', mask.length).data('mask-maxlength', true);
                    }

                    p.destroyEvents();
                    p.events();

                    var caret = p.getCaret();
                    p.val(p.getMasked());
                    p.setCaret(caret);
                }
            };

            jMask.init(!el.is('input'));
        };

        $.maskWatchers = {};
        var HTMLAttributes = function () {
                var input = $(this),
                    options = {},
                    prefix = 'data-mask-',
                    mask = input.attr('data-mask');

                if (input.attr(prefix + 'reverse')) {
                    options.reverse = true;
                }

                if (input.attr(prefix + 'clearifnotmatch')) {
                    options.clearIfNotMatch = true;
                }

                if (input.attr(prefix + 'selectonfocus') === 'true') {
                    options.selectOnFocus = true;
                }

                if (notSameMaskObject(input, mask, options)) {
                    return input.data('mask', new Mask(this, mask, options));
                }
            },
            notSameMaskObject = function (field, mask, options) {
                options = options || {};
                var maskObject = $(field).data('mask'),
                    stringify = JSON.stringify,
                    value = $(field).val() || $(field).text();
                try {
                    if (typeof mask === 'function') {
                        mask = mask(value);
                    }
                    return (
                        typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask
                    );
                } catch (e) {}
            },
            eventSupported = function (eventName) {
                var el = document.createElement('div'),
                    isSupported;

                eventName = 'on' + eventName;
                isSupported = eventName in el;

                if (!isSupported) {
                    el.setAttribute(eventName, 'return;');
                    isSupported = typeof el[eventName] === 'function';
                }
                el = null;

                return isSupported;
            };

        $.fn.mask = function (mask, options) {
            options = options || {};
            var selector = this.selector,
                globals = $.jMaskGlobals,
                interval = globals.watchInterval,
                watchInputs = options.watchInputs || globals.watchInputs,
                maskFunction = function () {
                    if (notSameMaskObject(this, mask, options)) {
                        return $(this).data('mask', new Mask(this, mask, options));
                    }
                };

            $(this).each(maskFunction);

            if (selector && selector !== '' && watchInputs) {
                clearInterval($.maskWatchers[selector]);
                $.maskWatchers[selector] = setInterval(function () {
                    $(document).find(selector).each(maskFunction);
                }, interval);
            }
            return this;
        };

        $.fn.masked = function (val) {
            return this.data('mask').getMaskedVal(val);
        };

        $.fn.unmask = function () {
            clearInterval($.maskWatchers[this.selector]);
            delete $.maskWatchers[this.selector];
            return this.each(function () {
                var dataMask = $(this).data('mask');
                if (dataMask) {
                    dataMask.remove().removeData('mask');
                }
            });
        };

        $.fn.cleanVal = function () {
            return this.data('mask').getCleanVal();
        };

        $.applyDataMask = function (selector) {
            selector = selector || $.jMaskGlobals.maskElements;
            var $selector = selector instanceof $ ? selector : $(selector);
            $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
        };

        var globals = {
            maskElements: 'input,td,span,div',
            dataMaskAttr: '[data-mask]',
            dataMask: true,
            watchInterval: 300,
            watchInputs: true,
            keyStrokeCompensation: 10,
            // old versions of chrome dont work great with input event
            useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
            watchDataMask: false,
            byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
            translation: {
                0: { pattern: /\d/ },
                9: { pattern: /\d/, optional: true },
                '#': { pattern: /\d/, recursive: true },
                A: { pattern: /[a-zA-Z0-9]/ },
                S: { pattern: /[a-zA-Z]/ },
            },
        };

        $.jMaskGlobals = $.jMaskGlobals || {};
        globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

        // looking for inputs with data-mask attribute
        if (globals.dataMask) {
            $.applyDataMask();
        }

        setInterval(function () {
            if ($.jMaskGlobals.watchDataMask) {
                $.applyDataMask();
            }
        }, globals.watchInterval);
    },
    window.jQuery,
    window.Zepto
);

/**
 * auth.js
 * @version: v1
 * @author MV
 */

(function ($, window) {
    var common = {
        el: {
            doc: $(document),
            win: $(window),
            body: null,
        },
        selector: {
            body: 'body',
            html: 'html',
            bh: 'body, html',
            header: '#wrapper > header',
            footer: 'footer',
            dimmed: '.dimmed',
            popupEl: 'div.auth-popup',
        },
        handler: {
            ready: function () {
                common.el.body = $(common.selector.body);

                common.el.doc.find(common.selector.popupEl).each(function (idx, el) {
                    popup.basic.init($(el));
                });

                //기타
                etc.init();

                //sms
                sendFrmSms.init();

                common.el.win.trigger('scroll');
                common.el.win.trigger('resize');
            },
            load: function () {},
        },
    };

    // window ready event
    // $(document).on('DOMContentLoaded', common.handler.ready);
    common.el.doc.ready(common.handler.ready);

    // window load event
    // string: single quotation
    common.el.win.on('load', common.handler.load);

    // project util object
    var utils = {
        scrollDisabled: function () {
            common.el.body.css('overflow', 'hidden');
        },
        scrollEnabled: function () {
            common.el.body.css('overflow', '');
        },
        //딤 show
        dimmedShow: function () {
            var dimmed = $(common.selector.dimmed);
        },
        //딤 hide
        dimmedHide: function () {
            var dimmed = $(common.selector.dimmed);
        },
    };

    var sendFrmSms = {
        el: {},
        selector: {
            authPop: '.popup.auth-popup',
            inp: '.input > input',
            stepFrmScrollWrap: '.popup-page',
            stepFrm: '.auth-container.auth-step-contents',
            frmItem: '[data-type=step-contents]',
            frmName: '.input__name',
            frmJumin: '.resident-number input',
            frmPhoneNum: '.input__phone-number',
            frmBtnStep: '.btn-floating',
            frmTit: '.auth-header__title',
            btnStepName: '[data-type="step-name"]',
            btnStepSecurity: '[data-type="step-security-text"]',
            btnStepPhone: '[data-type="step-phone-number"]',
            btnCancel: 'button.cancel',
            selectNumFrm: '.auth-select-number',
            birthDay: '[aria-labelledby=auth-birthday-label]',
            rdInpGender: '.gender-selection input',
            inpCaptcah: '.captcha-box  input',
            rdInpAgency: '.agency-selection input[type=radio]',
        },
        methodes: {
            checkFrmSmsBtn: function (_val, _maxLength, _$btnBtm) {
                var val = Number(_val);
                var maxLength = Number(_maxLength);
                var $btnBtm = _$btnBtm;
                var $btnWrap = $btnBtm.parent('.auth-bottom-fixed__area');

                if (val >= maxLength) {
                    $btnBtm.removeClass('disabled');
                    $btnBtm.attr('disabled', false);
                } else {
                    $btnBtm.addClass('disabled');
                    $btnBtm.attr('disabled', true);
                }
            },
        },
        handler: {
            keyupFrmName: function (e) {
                var cntStr = $(e.currentTarget).val().length;
                if ($(sendFrmSms.selector.stepFrm).attr('data-step') === '0') {
                    sendFrmSms.handler.checkFrmBtn(cntStr, 2, $('[data-type=step-name]'));
                }
            },
            clickBtnFrmName: function (e) {
                this.goNextStep(1);
            },
            keyupBirthDay: function (e) {
                var strJumin2 = $(e.currentTarget).val().length;

                var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
                var inpStep = $(sendFrmSms.selector.frmItem).index($(e.currentTarget).closest(sendFrmSms.selector.frmItem));

                var maxLength = Number($(e.currentTarget).attr('maxlength'));

                //성별 버튼 클릭 후 법정 생년 월일 입력 시 다음 단계로 이동
                if (
                    strJumin2 >= maxLength &&
                    dataStep == inpStep &&
                    $(sendFrmSms.selector.stepFrm).find(sendFrmSms.selector.rdInpGender).filter(':checked').length > 0
                ) {
                    $(sendFrmSms.selector.stepFrm).find(sendFrmSms.selector.rdInpGender).filter(':checked').trigger('click');
                }
            },
            clickRdInpGender: function (e) {
                var $rdInp = $(e.currentTarget);
                $rdInp.closest('.input-radio').addClass('checked');
                $rdInp.attr('checked', true);

                $rdInp.closest('.input-radio').siblings('.input-radio').removeClass('checked');
                $rdInp.closest('.input-radio').siblings('.input-radio').find('input').removeAttr('checked');

                var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
                var inpStep = $(sendFrmSms.selector.frmItem).index($(e.currentTarget).closest(sendFrmSms.selector.frmItem));

                //법정 생년월일 입력 안 할 경우 다음 단계로 이동 안함
                var maxLength = Number($rdInp.closest('.inputbox').find(sendFrmSms.selector.birthDay).attr('maxlength'));
                if ($(sendFrmSms.selector.stepFrm).find(sendFrmSms.selector.birthDay).val().length < maxLength) {
                    return;
                }

                if (dataStep == inpStep) {
                    this.goNextStep(inpStep + 1);
                }
            },
            keyupFrmCaptchaNum: function (e) {
                var cntStr = $(e.currentTarget).val().length;

                var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
                var inpStep = $(sendFrmSms.selector.frmItem).index($(e.currentTarget).closest(sendFrmSms.selector.frmItem));

                //해당 단계에서 입력 하는 경우
                if (dataStep == inpStep) {
                    sendFrmSms.handler.checkFrmBtn(cntStr, 5, $('[data-type=step-security-text]'));
                }
            },
            keyupFrmPhone: function (e) {
                var cntStr = $(e.currentTarget).val().replace(/-/g, '');

                sendFrmSms.handler.checkFrmBtn(cntStr.length, 10, $('[data-type=step-phone-number]'));
            },
            clickBtnFCancel: function (e) {
                var $btn = $(e.currentTarget);
                $btn.siblings('input').val('');
                $btn.siblings('input').trigger('keyup');
            },
            clickRdInpAgency: function (e) {
                var $rdInp = $(e.currentTarget);
                $rdInp.closest('.input-radio').addClass('checked');
                $rdInp.attr('checked', true);

                $rdInp.closest('.input-radio').siblings('.input-radio').removeClass('checked');
                $rdInp.closest('.input-radio').siblings('.input-radio').find('input').removeAttr('checked');
            },

            focusinStepCont: function (e) {
                var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
                var inpStep = $(sendFrmSms.selector.frmItem).index($(e.currentTarget).closest(sendFrmSms.selector.frmItem));

                var stepCur = $(sendFrmSms.selector.frmItem).eq(dataStep);
                var btnName = stepCur.attr('class').split(' ');

                $.each(btnName, function (index, val) {
                    if (val.indexOf('step-') >= 0) {
                        btnName = val;
                    }
                });

                var $btnBtm = $('[data-type=' + btnName + ']');

                //현재 step 컨텐츠의 input 에 포커스 갈 경우에만 하위 버튼 활성화
                if ($btnBtm && inpStep == dataStep) {
                    $btnBtm.removeClass('none');
                }

                //하단 버튼 스타일 재 정의 (버튼이 none 아닐 경우에만 div.popup-page에 has-floating 클래스 추가)
                popup.basic.methodes.setStyleBtmPop();
            },
            focusoutStepCont: function (e) {
                var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
                var $inp = $(sendFrmSms.selector.frmItem).eq(dataStep).find('input:not([type="checkbox"], [type="radio"])'); //현재 step의 input

                var stepCur = $(sendFrmSms.selector.frmItem).eq(dataStep);
                var btnName = stepCur.attr('class').split(' ');

                $.each(btnName, function (index, val) {
                    if (val.indexOf('step-') >= 0) {
                        btnName = val;
                    }
                });

                var $btnBtm = $('[data-type=' + btnName + ']');

                //포커스 아웃 시현재 step input 값이 없을 경우 하위 버튼 비활성화
                if ($btnBtm && $inp.val().length === 0) {
                    $btnBtm.addClass('none');
                }

                //하단 버튼 스타일 재 정의 (버튼이 none 아닐 경우에만 div.popup-page에 has-floating 클래스 추가)
                popup.basic.methodes.setStyleBtmPop();
            },

            checkFrmBtn: function (_val, _maxLength, _$btnBtm) {
                var val = Number(_val);
                var maxLength = Number(_maxLength);
                var $btnBtm = _$btnBtm;
                var $btnWrap = $btnBtm.parent('.auth-bottom-fixed__area');

                if (val >= maxLength) {
                    $btnBtm.attr('disabled', false);
                } else {
                    $btnBtm.attr('disabled', true);
                }
            },
            focusinInpPop: function (e) {
                var $inp = $(e.currentTarget);
                var $popPage = $(e.currentTarget).closest('.popup-page');
                if (
                    !$popPage.hasClass('has-floating') ||
                    $inp.prop('readonly') ||
                    $inp.attr('type') === 'radio' ||
                    $inp.attr('type') === 'checkbox'
                ) {
                    return;
                }

                var filter = 'win16|win32|win64|mac|macintel';
                if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
                    setTimeout(function () {
                        $popPage.addClass('keypad-on');
                    }, 0);
                }
            },
            focusoutInpPop: function (e) {
                var $popPage = $(e.currentTarget).closest('.popup-page.keypad-on');
                if ($popPage.length > 0) {
                    setTimeout(function () {
                        $popPage.removeClass('keypad-on');
                    }, 0);
                }
            },
            touchmoveInpPop: function (e) {
                if (
                    /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
                    e.target.tagName !== 'INPUT' &&
                    document.activeElement &&
                    document.activeElement.tagName === 'INPUT' &&
                    $(document.activeElement).closest('.auth-popup').length > 0
                ) {
                    document.activeElement.blur();
                }
            },
        },
        bind: function () {
            /*
                SMS3-step.html
            */

            // stepFrm > 이름 입력 시 하단 버튼 활성화 여부 체크
            if ($(sendFrmSms.selector.stepFrm).length > 0) {
                // [이름 입력]  2글자 이상 시 활성화 버튼 출력
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.frmName)
                    .off('keyup.frmName')
                    .on('keyup.frmName', $.proxy(this.handler.keyupFrmName, this));

                // [이름 입력]  하단 '다음으로' 버튼 클릭 시  법정 생년월일 입력 항목 이동
                $(sendFrmSms.selector.authPop)
                    .find(sendFrmSms.selector.btnStepName)
                    .off('click.btnNextStep')
                    .on('click.btnNextStep', $.proxy(this.handler.clickBtnFrmName, this));

                // [법정 생년월일 입력] 성별 선택 되어 있을 경우 법정생년월일 maxlength 입력 완료 시 다음 단계로 이동(보안문자 입력 또는 휴대폰 입력)
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.birthDay)
                    .off('keyup.birthDay')
                    .on('keyup.birthDay', $.proxy(this.handler.keyupBirthDay, this));

                // [성별 선택] 성별 선택 후 다음 단계로 이동(보안문자 입력 또는 휴대폰 입력)
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.rdInpGender)
                    .off('click.rdInpGender')
                    .on('click.rdInpGender', $.proxy(this.handler.clickRdInpGender, this));

                // [보안문자 입력] > 보안문자 입력시 5글자 이상 시 활성화 버튼 출력
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.inpCaptcah)
                    .off('keyup.frmCaptchaNum')
                    .on('keyup.frmCaptchaNum', $.proxy(this.handler.keyupFrmCaptchaNum, this));

                // [휴대폰번호 입력] > 휴대폰 번호 입력시 10글자 이상 시 활성화 버튼 출력
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.frmPhoneNum)
                    .off('keyup.frmPhoneNum')
                    .on('keyup.frmPhoneNum', $.proxy(this.handler.keyupFrmPhone, this));
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.frmPhoneNum)
                    .off('focusin.frmPhoneNum')
                    .on('focusin.frmPhoneNum', $.proxy(this.handler.keyupFrmPhone, this));

                //입력 인풋 삭제 버튼 클릭 시 내용 삭제, 하단 버튼 비활성화
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.btnCancel)
                    .off('click.btnCancel')
                    .on('click.btnCancel', $.proxy(this.handler.clickBtnFCancel, this));

                // [휴대폰번호 입력] > 통신사 선택 input[type=radio] 클래스 checked 추가
                $(sendFrmSms.selector.stepFrm)
                    .find(sendFrmSms.selector.rdInpAgency)
                    .off('click.rdInpAgency')
                    .on('click.rdInpAgency', $.proxy(this.handler.clickRdInpAgency, this));

                var oSelf = this;
                $('[data-type="step-contents"]').each(function (idx) {
                    //입력 인풋 포커스 시 하위 버튼 활성화
                    $(this)
                        .find('input:not([type="checkbox"], [type="radio"])')
                        .eq(0)
                        .off('focusin.inpStepCont')
                        .on('focusin.inpStepCont', $.proxy(oSelf.handler.focusinStepCont, this));
                    //입력 인풋 포커스 아웃 시 하위 버튼 비 활성화
                    $(this)
                        .find('input:not([type="checkbox"], [type="radio"])')
                        .eq(0)
                        .off('focusout.inpStepCont')
                        .on('focusout.inpStepCont', $.proxy(oSelf.handler.focusoutStepCont, this));
                });
            }

            //div.popup-page.has-floating 경우, 키패드 올라 올때 .popup-page 에 keypad-on 클래스 추가
            $(sendFrmSms.selector.authPop)
                .find(sendFrmSms.selector.stepFrmScrollWrap)
                .off('focusin.inpPop')
                .on('focusin.inpPop', 'input', $.proxy(this.handler.focusinInpPop, this));

            //키패드 내려 갈 때 .popup-page 에 keypad-on 클래스 삭제
            $(sendFrmSms.selector.authPop)
                .find(sendFrmSms.selector.stepFrmScrollWrap)
                .off('focusout.inpPop')
                .on('focusout.inpPop', 'input', $.proxy(this.handler.focusoutInpPop, this));

            //[IOS].popup-page > input 영역 밖에서 touchmove 할 경우 포커스 삭제
            $(sendFrmSms.selector.authPop).off('touchmove.inpPop').on('touchmove.inpPop', $.proxy(this.handler.touchmoveInpPop, this));
        },
        goNextStep: function (stepNum, _$focusEl) {
            $(sendFrmSms.selector.stepFrm).attr('data-step', stepNum);

            $(sendFrmSms.selector.frmTit).addClass('none');

            $(sendFrmSms.selector.frmTit).eq(stepNum).removeClass('none');

            $(sendFrmSms.selector.frmItem).eq(stepNum).removeClass('none');

            //하단 버튼 감추기
            $(sendFrmSms.selector.authPop).find(sendFrmSms.selector.frmBtnStep).addClass('none');
            $(sendFrmSms.selector.authPop).find(sendFrmSms.selector.frmBtnStep).attr('disabled', true);

            //내용 변경 시 팝업 높이 재 계산
            popup.basic.methodes.setStyleBtmPop();

            //포커스 맨위로 이동
            $(sendFrmSms.selector.stepFrm).closest(sendFrmSms.selector.stepFrmScrollWrap).scrollTop(0);

            //포커스 이동
            var $focusEl;
            if (_$focusEl) {
                $focusEl = _$focusEl;
            } else {
                //영역 내 포커스 가능 첫번째 요소
                $focusEl = $(sendFrmSms.selector.frmItem).eq(stepNum).find('input:not([readonly]),[tabindex=0],a,button').eq(0);
            }
            if ($focusEl && $focusEl.length > 0) {
                var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

                if (varUA.indexOf('android') > -1) {
                    //안드로이드 일 경우
                    //프로세싱 버튼 클릭 시 goNextStep() 실행 후 focusoutInpPop() 실행 되어 포커스 잃지 않도록 시간 차이 두고 포커스 이동
                    setTimeout(function () {
                        $focusEl.focus();
                    }, 100);
                } else {
                    $focusEl.focus();
                }
            }

            //알뜰 폰 경우 휴대폰 입력 단계에서 구매 문구 활성화
            var phoneStep = $(sendFrmSms.selector.frmItem).index(
                $(etc.selector.authPop).find(etc.selector.frmPhoneNum).closest(sendFrmSms.selector.frmItem)
            );
            if (
                $(sendFrmSms.selector.authPop).find('.mvno-check') &&
                $(sendFrmSms.selector.authPop).find('.mvno-check:visible').length > 0 &&
                stepNum === phoneStep
            ) {
                $('[data-type=mvno-info]').removeClass('none');
            }
        },
        setProperty: function () {
            var dataStep = $(sendFrmSms.selector.stepFrm).attr('data-step');
            if (dataStep === undefined) {
                $(sendFrmSms.selector.stepFrm).attr('data-step', $('.auth-header__title').index($('.auth-header__title').not('.none')));
            }
        },
        init: function () {
            this.setProperty();
            this.bind();
        },
    };

    var etc = {
        el: {},
        selector: {
            authPop: '.popup.auth-popup',
            inp: '.input > input',
            inpDash: 'input.input__phone-number',
            stepFrm: '.auth-container.auth-step-contents',
            frmName: '.input__name',
            frmJumin: '.resident-number input',
            frmPhoneNum: '.input__phone-number',
            frmBtnStep: '.btn-floating',
            frmTit: '.auth-header__title',
            frmCont: '.auth-step-contents .inputbox--auth',
            btnCancel: 'button.cancel',
            allAgreeInp: '.auth-terms__check-all input',
            subAgreeInp: '.acco-cover input',
            inpTypeTel: '.input input[type="tel"]',
            accoBtn: '.acco-btn',
        },
        methodes: {
            setStyleInp: function () {
                //div.input > button.btnDel CSS 추가
                etc.methodes.setCssBtnDel();
            },
            setCssBtnDel: function () {
                // button.btnDel css right 값 설정 : div.input__right 있으면 .input__right width값 + 12 / 없으면 0
                var $rightBox;
                $(etc.selector.authPop)
                    .find('.input button.cancel')
                    .each(function () {
                        // $(this).css('right')
                        $rightBox = $(this).siblings('.input__right:not(.none)');
                        if ($rightBox.length > 0) {
                            $(this).css('right', $rightBox.width() + 12);
                        } else {
                            $(this).css('right', 0);
                        }

                        //input 버튼 옆 cancel 버튼 숨김/ .input에 editable클래스 있을 경우 예외 처리
                        var btnCancel = $(this);
                        setTimeout(function () {
                            if (!btnCancel.parent('.input').hasClass('editable')) {
                                btnCancel.css('display', 'none');
                            }
                        }, 0);
                    });
            },
        },
        handler: {
            focusInpCl: function (e) {
                var $this = $(this);

                if ($this.prop('readonly') || $this.closest('.input').hasClass('editable')) {
                    return;
                }
                $this.parent('.input').addClass('focus');
                $this.parent('.input').focus();

                //입력 내용 삭제 버튼 활성화
                if ($(this).val() == '') {
                    $this.siblings('button.cancel').hide();
                } else {
                    $this.siblings('button.cancel').show();
                }
            },
            focusOutInpCl: function (e) {
                var $this = $(e.currentTarget);

                if ($this.prop('readonly') || $this.closest('.input').hasClass('editable')) {
                    return;
                }

                $this.parent('.input').removeClass('focus');

                var target = e.relatedTarget;
                if (target === null) {
                    target = document.activeElement;
                }

                //입력 내용 삭제 버튼 숨김
                setTimeout(function () {
                    if ($this.siblings('button.cancel').is(':visible') && !$(target).hasClass('cancel')) {
                        $this.siblings('button.cancel').hide();
                    }
                }, 0); //취소 버튼 click 이벤트가 먼저 실행 된 후 설정 해야 함
            },
            addDashVal: function (e) {
                var $this = $(this);

                // .input.editable 경우 삭제 시 전체  값 삭제
                if ($this.parent().hasClass('editable') && e.keyCode === 8) {
                    $(this).siblings('.cancel').trigger('click');
                }

                if ($this.data('mask') == undefined) {
                    $(this).val(
                        $(this)
                            .val()
                            .replace(/[^0-9]/g, '')
                            .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
                            .replace('--', '-')
                    );
                    $this.mask('000-0000-0000');
                }
            },
            keydownBtnCancel: function (e) {
                var $this = $(e.currentTarget);

                if (!$this.closest('.input').hasClass('editable') && e.keyCode === 9 && e.shiftKey === false) {
                    setTimeout(function () {
                        $this.hide();
                    }, 0); //ie11에서 취소 버튼에서 탭으로 다음 영역 이동시 포커스 잃어 시간 둠
                }
            },
            changeAllAgreeInp: function (e) {
                var $allAgreeInp = $(e.currentTarget);
                var $subAgreeInp = $allAgreeInp.closest('div').siblings('.acco-cover').find('input');
                if ($allAgreeInp.prop('checked')) {
                    $subAgreeInp.prop('checked', true);
                } else {
                    $subAgreeInp.prop('checked', false);
                }
            },
            changeSubAgreeInp: function (e) {
                var $subAgreeWrap = $(e.currentTarget).closest('.acco-cover');
                var subAgreeCnt = $subAgreeWrap.find('input').length;
                var subAgreeCheckCnt = $subAgreeWrap.find('input:checked').length;
                var allAgreeInp = $subAgreeWrap.siblings('.auth-terms__check-all').find('input');
                if (subAgreeCnt === subAgreeCheckCnt) {
                    allAgreeInp.prop('checked', true);
                } else {
                    allAgreeInp.prop('checked', false);
                }
            },
            clickAccoBtn: function (e) {
                //아코디언 버튼 클릭 시 토글 기능 widgets.js 에서 제어중, 해당 함수 완료 후 팝업 높이 계산
                setTimeout(function () {
                    common.el.win.trigger('resize.pop');
                }, 0);
            },
            keyupInpTel: function (e) {
                var $this = $(this);
                $(this).val(
                    $(this)
                        .val()
                        .replace(/[^0-9]/g, '')
                );
            },
        },
        bind: function () {
            // 휴대폰 번호 입력 시 자동으로 dash(-) 입력
            $(etc.selector.authPop)
                .find(etc.selector.frmPhoneNum)
                .each(function () {
                    var $this = $(this);
                    $this.off('keyup.inpDash').on('keyup.inpDash', $.proxy(etc.handler.addDashVal, this));
                });

            //input type="tel" 입력시 숫자만 입력
            $(etc.selector.authPop)
                .find(etc.selector.inpTypeTel)
                .not(etc.selector.frmPhoneNum)
                .each(function () {
                    var $this = $(this);
                    $this.off('keyup.inptel').on('keyup.inptel', $.proxy(etc.handler.keyupInpTel, this));
                });

            $(etc.selector.authPop)
                .find(etc.selector.inp)
                .each(function () {
                    var $this = $(this);

                    //input 포커스인 경우 focus 클래스 추가
                    $this.off('focusin.inp').on('focusin.inp', etc.handler.focusInpCl);

                    //input 포커스아웃 경우 focus 클래스 삭제
                    $this.off('focusout.inp').on('focusout.inp', $.proxy(etc.handler.focusOutInpCl, this));
                });

            //탭키로 이동하여 input 취소버튼 focusout 시 버튼 숨김
            $(etc.selector.authPop)
                .find(etc.selector.btnCancel)
                .off('keydown.btnCancel')
                .on('keydown.btnCancel', $.proxy(etc.handler.keydownBtnCancel, this));

            //전체동의 버튼 클릭 시 하위 동의 체크
            $(etc.selector.authPop)
                .find(etc.selector.allAgreeInp)
                .off('change.allAgreeInp')
                .on('change.allAgreeInp', $.proxy(etc.handler.changeAllAgreeInp, this));

            //하위 동의 체크 시 모두 체크 되어 있으면 전체동의 체크
            $(etc.selector.authPop)
                .find(etc.selector.subAgreeInp)
                .off('change.subAgreeInp')
                .on('change.subAgreeInp', $.proxy(etc.handler.changeSubAgreeInp, this));

            //아코디언 클릭 후 팝업 높이에 따른  div.popup-page 클래스 제어
            $(etc.selector.authPop)
                .find(etc.selector.accoBtn)
                .off('click.accoBtn')
                .on('click.accoBtn', $.proxy(etc.handler.clickAccoBtn, this));
        },
        init: function () {
            this.methodes.setStyleInp();
            this.bind();
        },
    };

    var popup = {
        basic: {
            el: {
                authPop: '.popup.auth-popup',
                popLayer: '.popup-page',
                popInner: '.auth-popup__inner',
                layCont: '',
                scroll: '',
                popBtmFix: '.auth-bottom-fixed',
            },

            show: function () {},
            hide: function () {},
            methodes: {
                setStyleBtmPop: function () {
                    // .auth-popup__inner 높이   > .popup-page 높이  경우
                    // div.popup-page에 is-scroll 클래스 추가
                    var $popPage = $(popup.basic.el.authPop).find(popup.basic.el.popLayer);
                    var $popInner = $popPage.find(popup.basic.el.popInner);

                    // div.popup-page.is-scroll 경우  div.auth-bottom-fixed 영역에 버튼이 있을때 has-floating 클래스 추가
                    if ($(popup.basic.el.authPop).find(popup.basic.el.popBtmFix).find('button').not('.none').length > 0) {
                        $popPage.addClass('has-floating');
                    } else {
                        $popPage.removeClass('has-floating');
                    }

                    if (parseInt($popInner.outerHeight(true)) > parseInt($popPage.outerHeight(true))) {
                        $popPage.addClass('is-scroll');
                    } else {
                        $popPage.removeClass('is-scroll');
                    }
                },
            },
            handler: {
                //.popup-page style 설정
                resizePop: function ($el) {
                    //팝업 없을 경우
                    if (this.$authPop.length === 0 || this.$authPop.is(':visible') === false) {
                        return;
                    }
                    //리사이즈 시 하단 버튼 스타일 설정
                    popup.basic.methodes.setStyleBtmPop();
                },
            },
            bind: function () {
                var oSelf = this;

                //화면 사이즈 변경 시 .popup-page 높이 적용, 하단 버튼 고정 여부 체크
                //안드로이드 에서 키패드 열릴 경우 아래 이벤트 발생
                common.el.win.off('resize.pop').on('resize.pop', $.proxy(oSelf.handler.resizePop, this));
            },
            setProperty: function ($el) {
                this.$authPop = $(popup.basic.el.authPop);
                this.popEl = $el;
                this.popEl.popLayer = this.popEl.find(this.el.popLayer);
                this.popEl.popInner = this.popEl.find(this.el.popInner);
                this.popEl.popBtmFix = this.popEl.find(this.el.popBtmFix);
            },
            init: function ($el) {
                this.setProperty($el);

                //화면 로딩이 완료 되지 않아 높이 계산이 안됨
                setTimeout(function () {
                    common.el.win.trigger('resize');
                }, 0);

                this.bind();
            },
        },
    };

    // mvJs interface
    var mvJs = {
        // js 초기화
        init: common.handler.ready,
        utils: {
            //window 스크롤 비활성화
            scrollDisabled: utils.scrollDisabled,
            //window 스크롤 활성화
            scrollEnabled: utils.scrollEnabled,
            dimmedShow: utils.dimmedShow,
            dimmedHide: utils.dimmedHide,
            sendFrmSms: sendFrmSms,
        },
    };

    window.mvJs = mvJs;
})(window.jQuery, window);
