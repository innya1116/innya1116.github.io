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
            popupEl: 'div.authPopup',
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
    common.el.win.load(common.handler.load);
    // common.el.win.load(common.handler.load);

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
            authPop: '.popup.authPopup ',
            selectNumFrm: '.auth_numberSelector',
            btnBottom: '.popBottom .authBtnL',
            frmJumin: '.residentNumber input',
            authInPop: '.popup.authPopup .inPop',
        },
        methodes: {
            checkFrmSmsBtn: function (_val, _maxLength, _$btnBtm) {
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
        },
        handler: {
            keyupFrmNJumin1: function (e) {
                var $this = $(e.currentTarget);
                var strJumin1 = $this.val().length;

                // 성별 라디오 인풋에서  backspace 키 입력 시 포커스 자동이동 막기
                if (strJumin1 >= 6 && e.keyCode != 9 && e.keyCode != 16) {
                    $this.closest('.input').nextAll('.genderSelection').find('input').eq(0).focus();
                }
            },
            keyupCheckBtnAuth: function (e) {
                var isSetInpVal = true;

                var $inpPopInpTxt = $(e.currentTarget).closest('.inPop').find('input[type=text]');
                $inpPopInpTxt.each(function () {
                    if ($(this).val().length === 0) {
                        isSetInpVal = false;
                        return false;
                    }
                });

                var $inpPopInpCheckBox = $(e.currentTarget).closest('.inPop').find('input[type=checkbox]');
                $inpPopInpCheckBox.each(function () {
                    if (!$(this).prop('checked') && $(this).closest('.mvnoCheck').length === 0) {
                        isSetInpVal = false;
                        return false;
                    }
                });

                var $inpPopInpRd = $(e.currentTarget).closest('.inPop').find('input[type=radio]');
                var cntCheckInpRd = 0;

                $inpPopInpRd.each(function () {
                    if ($(this).prop('checked')) {
                        cntCheckInpRd++;
                    }
                });

                var oRadioName = [];
                $('input[type=radio]').each(function () {
                    oRadioName.push($(this).attr('name'));
                });
                oRadioName = $.unique(oRadioName);

                if (cntCheckInpRd !== oRadioName.length) {
                    isSetInpVal = false;
                }

                if (isSetInpVal) {
                    $('.popup.authPopup .rArea > button').attr('disabled', false);
                } else {
                    $('.popup.authPopup .rArea > button').attr('disabled', true);
                }
            },
        },
        bind: function () {
            // [법정생년월일 입력] 법정생년월일 입력 후 성별 라디오 인풋으로 포커스 이동
            // $(sendFrmSms.selector.authPop).find(sendFrmSms.selector.frmJumin).eq(0).unbind('keyup.frmJumin1').bind('keyup.frmJumin1', $.proxy(this.handler.keyupFrmNJumin1, this));
        },
        CheckBtnAuth: function () {
            // .inPop  > 내부 input 입력 값 모두 체크 되어 있을 경우 button 활성화
            $(sendFrmSms.selector.authInPop)
                .find('input[type=text]')
                .unbind('keyup.checkBtnAuth')
                .bind('keyup.checkBtnAuth', $.proxy(this.handler.keyupCheckBtnAuth, this));

            $(sendFrmSms.selector.authInPop)
                .find('input[type=checkbox], input[type=radio]')
                .unbind('click.checkBtnAuth')
                .bind('click.checkBtnAuth', $.proxy(this.handler.keyupCheckBtnAuth, this));
        },
        init: function () {
            this.bind();
        },
    };

    var etc = {
        el: {},
        selector: {
            inpDash: 'input.inpCellNumber',
            allAgreeInp: '.checkAll input',
            subAgreeInp: '.checkbox:not(.checkAll) input',
            inpNumber: '.input input.inpNumber',
        },
        methodes: {
            setStyleInp: function () {
                //div.input > button.btnDel CSS 추가
                etc.methodes.setCssBtnDel();
            },
            setCssBtnDel: function () {
                // button.btnDel css right 값 설정 : div.rightBox가 있으면 rightBox width값 + 16 / 없으면 0
                var $rightBox;
                $('.input button.btnDel').each(function () {
                    // $(this).css('right')
                    $rightBox = $(this).parent().find('.rightBox');
                    if ($rightBox.length > 0 && $rightBox.is(':visible')) {
                        $(this).css('right', $rightBox.width() + 16);
                    } else {
                        $(this).css('right', 0);
                    }
                });
            },
        },
        handler: {
            addDashVal: function (e) {
                var $this = $(this);

                // .input.editable 경우 삭제 시 전체  값 삭제
                if ($this.parent().hasClass('editable') && e.keyCode === 8) {
                    $(this).siblings('.cancel').trigger('click');
                }
                $(this).val(
                    $(this)
                        .val()
                        .replace(/[^0-9]/g, '')
                        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
                        .replace('--', '-')
                );
            },
            focusInpCl: function (e) {
                var $this = $(this);

                if ($this.prop('readonly') || $this.closest('.input').hasClass('editable')) {
                    return;
                }
                //입력 내용 삭제 버튼 활성화
                if ($(this).val() == '') {
                    $this.siblings('button.btnDel').hide();
                } else {
                    $this.siblings('button.btnDel').show();
                }
            },
            focusOutInpCl: function (e) {
                var $this = $(this);

                if ($this.prop('readonly') || $this.closest('.input').hasClass('editable')) {
                    return;
                }

                var target = e.relatedTarget;
                if (target === null) {
                    target = document.activeElement;
                }

                //입력 내용 삭제 버튼 숨김
                setTimeout(function () {
                    if ($this.siblings('button.btnDel').is(':visible') && !$(target).hasClass('btnDel')) {
                        $this.siblings('button.btnDel').hide();
                    }
                }, 0); //취소 버튼 click 이벤트가 먼저 실행 된 후 설정 해야 함
            },
            keydownBtnCancel: function (e) {
                var $this = $(this);
                if (e.keyCode === 9 && e.shiftKey === false && !$this.parent('.input').hasClass('editable')) {
                    setTimeout(function () {
                        $this.hide();
                    }, 0); //ie11에서  취소 버튼에서 탭으로 다음 영역 이동시 포커스 잃어 시간 둠
                }
            },
            clickBtnAcco: function (e) {
                var $this = $(this);
                $this.closest('.accoBox').toggleClass('open');

                //팝업 높이 변경 될 경우 scroll 클래스 체크
                common.el.win.trigger('resize.pop');
            },
            changeAllAgreeInp: function (e) {
                var $allAgreeInp = $(e.currentTarget);
                var $subAgreeInp = $allAgreeInp.closest('.checkAll').siblings('.accoList').find('input');
                if ($allAgreeInp.is(':checked')) {
                    $subAgreeInp.each(function () {
                        if (!$(this).is(':checked')) {
                            $(this).prop('checked', true);
                            $(this).attr('checked', true);
                            $(this).parent().addClass('checked');
                        }
                    });
                } else {
                    $subAgreeInp.each(function () {
                        if ($(this).is(':checked')) {
                            $(this).prop('checked', false);
                            $(this).attr('checked', false);
                            $(this).parent().removeClass('checked');
                        }
                    });
                }
            },
            changeSubAgreeInp: function (e) {
                var $subAgreeWrap = $(e.currentTarget).closest('.accoList');
                var subAgreeCnt = $subAgreeWrap.find('input').length;
                var subAgreeCheckCnt = $subAgreeWrap.find('input:checked').length;
                var allAgreeInp = $subAgreeWrap.siblings('.checkAll').find('input');
                if (subAgreeCnt === subAgreeCheckCnt) {
                    allAgreeInp.prop('checked', true);
                    allAgreeInp.attr('checked', true);
                    allAgreeInp.parent().addClass('checked');
                } else {
                    allAgreeInp.prop('checked', false);
                    allAgreeInp.attr('checked', false);
                    allAgreeInp.parent().removeClass('checked');
                }
            },
            keyupInpNum: function (e) {
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
            $(etc.selector.inpDash).each(function () {
                var $this = $(this);
                $this.unbind('keyup.inpDash').bind('keyup.inpDash', $.proxy(etc.handler.addDashVal, this));
            });

            //input class가 .inpNumber 인 경우 숫자만 입력
            $(etc.selector.inpNumber)
                .not(etc.selector.frmPhoneNum)
                .each(function () {
                    var $this = $(this);
                    $this.unbind('keyup.inpNum').bind('keyup.inpNum', $.proxy(etc.handler.keyupInpNum, this));
                });

            // widget.js 모바일 내용
            // input 내용 입력시 삭제 버튼 활성화
            $('.input > input').each(function () {
                var bt = $(this).parent().find('.btnDel'),
                    field = $(this),
                    label = $(this).siblings('label.placeholder');
                if (field.val() == '' || field.attr('readonly')) {
                    bt.hide();
                    label.show();
                } else {
                    bt.show();
                    label.hide();
                }
                bt.click(function (e) {
                    //@텍스트 삭제 버튼 수정
                    var $this = $(this);
                    if ($this.hasClass('stop-bubble') == true) {
                        e.stopPropagation(); //@2019-03-12 stop-bubble 클래스 추가 ( 체크박스안에 삭제 버튼이 있는 경우 )
                    }
                    field.val('').focus();
                    bt.hide();
                    label.show();
                });
                field.keyup(function () {
                    if ($(this).val() == '') {
                        bt.hide();
                        label.show();
                    } else {
                        bt.show();
                        label.hide();
                    }
                });

                //input 삭제 버튼 >  focusin 시 활성화
                field.focusin(etc.handler.focusInpCl);

                //input 삭제 버튼 >  focusout 시 활성화
                field.blur(etc.handler.focusOutInpCl);

                //input 삭제 버튼 > 탭이동 focusout 시 버튼 비활설화
                bt.keydown(etc.handler.keydownBtnCancel);
            });

            //아코디언
            $('.accoBox .accoTit button').unbind('click.btnAcco').bind('click.btnAcco', etc.handler.clickBtnAcco);

            //전체동의 버튼 클릭 시 하위 동의 체크
            $(etc.selector.allAgreeInp)
                .unbind('change.allAgreeInp')
                .bind('change.allAgreeInp', $.proxy(etc.handler.changeAllAgreeInp, this));

            //하위 동의 체크 시 모두 체크 되어 있으면 전체동의 체크
            $(etc.selector.subAgreeInp)
                .unbind('change.subAgreeInp')
                .bind('change.subAgreeInp', $.proxy(etc.handler.changeSubAgreeInp, this));
        },
        init: function () {
            this.methodes.setStyleInp();
            this.bind();
        },
    };

    var popup = {
        basic: {
            el: {
                popLayer: '.authPopup',
                popInner: '.authPopupInner',
            },
            show: function () {},
            hide: function () {},
            methodes: {
                setClScrollpopLayer: function () {
                    $(popup.basic.el.popInner).each(function () {
                        if ($(this).height() >= 615) {
                            $(this).closest(popup.basic.el.popLayer).addClass('scroll');
                        } else {
                            $(this).closest(popup.basic.el.popLayer).removeClass('scroll');
                        }
                    });
                },
            },
            handler: {
                resizePop: function (e) {
                    //.authPopupInner 높이가 615 이상일 경우 div.authPopup 영역에 scroll 클래스 추가
                    popup.basic.methodes.setClScrollpopLayer();
                },
            },
            bind: function () {
                //화면 사이즈 변경 시 div.authPopup scroll 클래스 체크
                common.el.win.unbind('resize.pop').bind('resize.pop', $.proxy(popup.basic.handler.resizePop, this));
            },
            setProperty: function ($el) {
                this.popEl = $el;
                this.popEl.popInner = this.popEl.find(this.el.popInner);
            },
            init: function ($el) {
                this.setProperty($el);
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
