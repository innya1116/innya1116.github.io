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

                //��Ÿ
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
        //�� show
        dimmedShow: function () {
            var dimmed = $(common.selector.dimmed);
        },
        //�� hide
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

                // ���� ���� ��ǲ����  backspace Ű �Է� �� ��Ŀ�� �ڵ��̵� ����
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
            // [����������� �Է�] ����������� �Է� �� ���� ���� ��ǲ���� ��Ŀ�� �̵�
            // $(sendFrmSms.selector.authPop).find(sendFrmSms.selector.frmJumin).eq(0).unbind('keyup.frmJumin1').bind('keyup.frmJumin1', $.proxy(this.handler.keyupFrmNJumin1, this));
        },
        CheckBtnAuth: function () {
            // .inPop  > ���� input �Է� �� ��� üũ �Ǿ� ���� ��� button Ȱ��ȭ
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
                //div.input > button.btnDel CSS �߰�
                etc.methodes.setCssBtnDel();
            },
            setCssBtnDel: function () {
                // button.btnDel css right �� ���� : div.rightBox�� ������ rightBox width�� + 16 / ������ 0
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

                // .input.editable ��� ���� �� ��ü  �� ����
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
                //�Է� ���� ���� ��ư Ȱ��ȭ
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

                //�Է� ���� ���� ��ư ����
                setTimeout(function () {
                    if ($this.siblings('button.btnDel').is(':visible') && !$(target).hasClass('btnDel')) {
                        $this.siblings('button.btnDel').hide();
                    }
                }, 0); //��� ��ư click �̺�Ʈ�� ���� ���� �� �� ���� �ؾ� ��
            },
            keydownBtnCancel: function (e) {
                var $this = $(this);
                if (e.keyCode === 9 && e.shiftKey === false && !$this.parent('.input').hasClass('editable')) {
                    setTimeout(function () {
                        $this.hide();
                    }, 0); //ie11����  ��� ��ư���� ������ ���� ���� �̵��� ��Ŀ�� �Ҿ� �ð� ��
                }
            },
            clickBtnAcco: function (e) {
                var $this = $(this);
                $this.closest('.accoBox').toggleClass('open');

                //�˾� ���� ���� �� ��� scroll Ŭ���� üũ
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
            // �޴��� ��ȣ �Է� �� �ڵ����� dash(-) �Է�
            $(etc.selector.inpDash).each(function () {
                var $this = $(this);
                $this.unbind('keyup.inpDash').bind('keyup.inpDash', $.proxy(etc.handler.addDashVal, this));
            });

            //input class�� .inpNumber �� ��� ���ڸ� �Է�
            $(etc.selector.inpNumber)
                .not(etc.selector.frmPhoneNum)
                .each(function () {
                    var $this = $(this);
                    $this.unbind('keyup.inpNum').bind('keyup.inpNum', $.proxy(etc.handler.keyupInpNum, this));
                });

            // widget.js ����� ����
            // input ���� �Է½� ���� ��ư Ȱ��ȭ
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
                    //@�ؽ�Ʈ ���� ��ư ����
                    var $this = $(this);
                    if ($this.hasClass('stop-bubble') == true) {
                        e.stopPropagation(); //@2019-03-12 stop-bubble Ŭ���� �߰� ( üũ�ڽ��ȿ� ���� ��ư�� �ִ� ��� )
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

                //input ���� ��ư >  focusin �� Ȱ��ȭ
                field.focusin(etc.handler.focusInpCl);

                //input ���� ��ư >  focusout �� Ȱ��ȭ
                field.blur(etc.handler.focusOutInpCl);

                //input ���� ��ư > ���̵� focusout �� ��ư ��Ȱ��ȭ
                bt.keydown(etc.handler.keydownBtnCancel);
            });

            //���ڵ��
            $('.accoBox .accoTit button').unbind('click.btnAcco').bind('click.btnAcco', etc.handler.clickBtnAcco);

            //��ü���� ��ư Ŭ�� �� ���� ���� üũ
            $(etc.selector.allAgreeInp)
                .unbind('change.allAgreeInp')
                .bind('change.allAgreeInp', $.proxy(etc.handler.changeAllAgreeInp, this));

            //���� ���� üũ �� ��� üũ �Ǿ� ������ ��ü���� üũ
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
                    //.authPopupInner ���̰� 615 �̻��� ��� div.authPopup ������ scroll Ŭ���� �߰�
                    popup.basic.methodes.setClScrollpopLayer();
                },
            },
            bind: function () {
                //ȭ�� ������ ���� �� div.authPopup scroll Ŭ���� üũ
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
        // js �ʱ�ȭ
        init: common.handler.ready,
        utils: {
            //window ��ũ�� ��Ȱ��ȭ
            scrollDisabled: utils.scrollDisabled,
            //window ��ũ�� Ȱ��ȭ
            scrollEnabled: utils.scrollEnabled,
            dimmedShow: utils.dimmedShow,
            dimmedHide: utils.dimmedHide,
            sendFrmSms: sendFrmSms,
        },
    };

    window.mvJs = mvJs;
})(window.jQuery, window);
