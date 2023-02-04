/**

셀렉트박스
디자인 셀렉트는 문서가 로드 되었을때 .selectBox > select 태그를 만나면 적용 되도록 되어 있습니다.(셀렉트 박스를 생성할때는 .slectBox아래에 select를 생성후 selectInit 함수를 호출합니다.)
실제 셀렉트박스에 대한 제어는 원본  .selectBox > select 및 option 값을 토대로 디자인셀렉트가 변경되니
기본셀렉트를 제어한다고 생각하면 됩니다.

* 이벤트 등록   moas>guide>form.html 참조
현재 클릭한 selectBox의 선택한 요소의 index, text 값을 출력
$('#test1').on('selectbox.select',function(e,index,text){
	console.log('index ', index,' text ', text);
})
$('#test2').on('selectbox.select',function(e,index,text){
	console.log('index ', index,' text ', text);
})

* 셀렉트 박스 제어 함수 ( 기본셀렉트를 지정해서 사용합니다. )

 commonJs.selectBoxInit(셀렉터 표현식); 									 .selectBox>select를 잡아 설정되어 있는 디자인 셀렉트로 바꿔준다 ex) commonJs.selectBoxInit($('select:eq(0)'));
 commonJs.selectBoxRemove($(셀렉터 표현식))								 선택된 select의 부모 .selectBox의 디자인 셀렉트를 삭제		   ex) commonJs.selectBoxRemove($('select:eq(0)'));
 commonJs.selectBoxListDisabled($(셀렉터 표현식),해당 인덱스 배열);	  	     selectList안 option항목들에 disabled 처리				    ex) commonJs.selectBoxListDisabled($('select:eq(0)'),[1,2,3])
 commonJs.selectBoxListEnabled($(셀렉터 표현식),해당 인덱스 배열);		     selectList안 option항목들에 enabled 처리 				    ex) commonJs.selectBoxListEnabled($('select:eq(0)'),[1,2,3])
 commonJs.selectBoxDisabled($(셀렉터 표현식));						  	  selectbox 자체를 disabled 처리 					  	  ex) commonJs.selectBoxDisabled($('select:eq(0)'))
 commonJs.selectBoxEnabled($(셀렉터 표현식)); 							  selectbox 자체를 enabled 처리				 			  ex) commonJs.selectBoxEnabled($('select:eq(0)'))
 commonJs.selectBoxListAllDisabled($(셀렉터 표현식)) 						  selectList안 option항목전체를 disabled					  ex) commonJs.selectBoxListAllDisabled($('select:eq(0)'))
 commonJs.selectBoxListAllEnabled($(셀렉터 표현식))						  selectList안 option항목전체를 enaabled					  ex) commonJs.selectBoxListAllEnaabled($('select:eq(0)'))
 commonJs.selectBoxListChange($(셀렉터 표현식),바꿀 인덱스 번호,'바뀌는 내용')  selectList안 해당되는 인덱스 번호 button의 텍스트를 바꾼다.   ex) commonJs.selectBoxListChange($('select:eq(0)'),0,'option5');
 commonJs.selectBoxListRemove($(셀렉터 표현식),바꿀 인덱스 번호)				 selectList안 해당되는 인덱스 번호 li를 삭제한다.  		   ex) commonJs.selectBoxListRemove($('select:eq(0)'),0);
 commonJs.selectBoxReverseOn($(셀렉터 표현식))							  selectbox의 reverse 클래스를 추가하여 여는 방향을 변경		ex) commonJs.selectBoxReverseOn($('select:eq(0)'));
 commonJs.selectBoxReverseOff($(셀렉터 표현식))							  selectbox의 reverse 클래스를 삭제하여 여는 방향을 변경		ex) commonJs.selectBoxReverseOff($('select:eq(0)'));
 commonJs.popupResize(); 												  popup창을 화면의 중앙으로 맞춘다. ex) commonJs.popupResize();



 팝업
 commonJs.popShow($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 show			   ex) commonJs.popShow($('#lyAutoLogin'));
 commonJs.popClose($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 hide			   ex) commonJs.popClose($('#lyDateSelect'));

 마이페이지 쿠폰
 commonJs.couponInit() // 쿠폰 슬라이드 초기화 ex)commonJs.couponInit();
 commonJs.couponMove($(셀렉터 표현식),이동할 인덱스,애니메이션 속도) // target 쿠폰 슬라이드 move	ex)commonJs.couponMove(target,idx,speed);
                                                                  commonJs.couponMove($('.slide.coupon ul').eq(0),2,200);
                                                                  
스크롤 제어
 commonJs.scrollLock() // 배경 스크롤 막기 ex)commonJs.scrollLock();
 commonJs.scrollUnLock() // 배경 스크롤 막기 해제 ex)commonJs.scrollUnLock();
**/
(function($, window) {

  this.commonJs = {};

  var doc;
  var body;
  var MENU_CLOSE = 'menuClose';
  var SWIPE_COMPLETE = 'swipeComplete';
  var win;
  var ANIMATE_SPEED = 500;
  var ANIMATE_EASING = 'easeOutQuad';
  var lyDim = $('div.lyDim');
  var close = $('.popClose,.btnL.bGray,.btnL');
  var wWidth = 0;
  var wHeight = 0;
  commonJs.event = $({});
  commonJs.selectBoxInit = function(target) {
    var select = new SelectBox(target);
    target.data('select', select);
  }

  function SelectBox(target) {
    var selectbox = target.parent();
    var selectlength = selectbox.length;
    var selectboxOption = target.find('option');
    var title = 0;
    var allSelectBox = $('[class^=selType]');
    target.hide();
    for (var i = 0; i < selectboxOption.length; i++) {
      if (selectboxOption.eq(i).attr('selected')) {
        title = target.find('option:selected').text();
        break;
      } else {
        title = selectbox.find('select').attr('title');
      }
    }
    if (selectbox.hasClass('disabled')) {
      target.before('<button type="button"  class="selectedOpt" disabled>' + title + '</button>');
    } else {
      target.before('<button type="button"  class="selectedOpt">' + title + '</button>');
    }

    target.before('<div class="selOptWrap"><ul class="selectList"></ul></div>');

    for (var i = 0; i < selectlength; i++) {
      target.eq(i).children().clone().appendTo(selectbox.eq(i).find('ul.selectList'));
    }
    var selOptWrap = selectbox.find('div.selOptWrap');
    var selectedOpt = selectbox.children('button.selectedOpt');
    selOptWrap.find('option:selected').contents().unwrap().wrap('<li class="on"><button type="button"></button><li>');
    selOptWrap.find('option:disabled').contents().unwrap().wrap('<li><button type="button" disabled></button><li>');
    selOptWrap.find('option').contents().unwrap().wrap('<li><button type="button"></button><li>');

    function selectBoxClose(e) {
      var eventTarget = $(e.target);
      if (!(eventTarget.closest(selectedOpt).length) && (e.type == 'click')) {
        selectbox.removeClass('on');
      } else if (!eventTarget.closest(selOptWrap).length) {
        if (!eventTarget.siblings(selOptWrap).length) {
          selectbox.removeClass('on');
        }
      }
    }
    selectbox.off('click').on('click', function() ///////////////////// selectbox
      {
        var _this = $(this);
        if (_this.hasClass('on')) {
          _this.removeClass('on');
        } else {
          allSelectBox.removeClass('on');
          _this.addClass('on');
          doc.off('touchstart , mousedown, click').on('touchstart , mousedown, click', function(e) {
            selectBoxClose(e);
          });
        }
        var selecton = $('[class^=selType].on')
        selecton.find('li').off('click').on('click', function() {
          var _this = $(this);
          var title = _this.children().text();
          _this.siblings().removeClass('on')
          _this.addClass('on');
          selecton.children('button').attr('title', '선택된 항목').text(title);
          _this.closest(selectbox).children('select').trigger('selectbox.select', [_this.index(), _this.text()]);
        })
      })
    var _this = this;
    var selectList = selectbox.find('ul.selectList button:button');
    _this.remove = function() {
      selOptWrap.remove();
      selectedOpt.remove();
    }
    _this.listDisabled = function(arr) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        selectList.eq(arr[i]).attr('disabled', 'disabled');
      }
    }
    _this.listEnabled = function(arr) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        selectList.eq(arr[i]).removeAttr('disabled');
      }
    }
    _this.listAllDisabled = function() {
      selectList.attr('disabled', 'disabled');
    }
    _this.listAllEnabled = function() {
      selectList.removeAttr('disabled');
    }
    _this.boxDisabled = function() {
      selectedOpt.attr('disabled', 'disabled');
      selectbox.addClass('disabled');
    }
    _this.boxEnabled = function() {
      selectedOpt.removeAttr('disabled');
      selectbox.removeClass('disabled');
    }
    _this.reverseOn = function() {
      selectbox.addClass('reverse');
    }
    _this.reverseOff = function() {
      selectbox.removeClass('reverse');
    }
    _this.listChange = function(index, text) {
      selectbox.find('li:eq(' + index + ')').children().text(text);
    }
    _this.listRemove = function(index) {
      selectbox.find('li:eq(' + index + ')').remove();
    }
  }

  function Jessture(obj) {
    var target = obj.target;
    var cont = obj.content;
    var startX = 0;
    var startY = 0;
    var _this = $(this);
    var RIGHT = this.RIGHT = 'jsRight';
    var LEFT = this.LEFT = 'jsLeft';
    var thisTarget = 0;
    var marginLeft = 0;
    var total = cont.children().length - 2;
    var cThis = this;
    cThis.cnt = 0;
    var w = target.width();
    var limit = 50;
    var body = $('body');
    var targetLeft = target.offset().left;
    var time = 0;

    target.off('click.evt').on('click.evt' , function(e){
      body.off('touchmove , mousemove', moveH);
      body.off('touchend , mouseup', endH);

      if (!mCheck) {
        e.preventDefault();
      }
    });
    target.on('touchstart , mousedown', startH);
    // private function
    var mCheck = false;
    var dx = 0;

    function startH(e) {
      mCheck = true;
      if ($(e.target).filter('input').length == 0) {
        e.preventDefault();
      }
      if (e.type == 'mousedown') {
        // input 필드 체크
        startX = e.pageX;
        startY = e.pageY;
      } else {
        startX = e.originalEvent.touches[0].pageX;
        startY = e.originalEvent.touches[0].pageY;
      }
      if (cont.is(':animated')) {
        return
      }
      // ch = false;
      check();
      // console.log('-- chekc --');
      // var cn = parseInt( cont.css('margin-left') )%w;
      // marginLeft = (cThis.cnt*-w)-w;
      // cont.css('margin-left',(marginLeft+cn)+'px');
      // dx = cont.offset().left-startX;
      body.on('touchmove , mousemove', moveH);
      body.on('touchend , mouseup', endH);
    }
    var ch = false;

    function moveH(e) {
      mCheck = false;
      // console.log('move-- ',e.type);
      ch = true;
      var endX = 0;
      var endY = 0;
      endX = e.pageX - targetLeft;
      // e.preventDefault();
      if (e.type != 'mousemove') {
        endX = e.originalEvent.touches[0].pageX - targetLeft;
        endY = e.originalEvent.touches[0].pageY;
      }
      cont.css('margin-left', (endX + dx) + 'px');
    }

    function endH(e) {
      if (!ch) {
        return
      }
      ch = false;
      var endX = 0;
      // e.preventDefault();
      if (e.originalEvent.changedTouches) {
        //if(!e.originalEvent.touches){
        endX = Number(e.originalEvent.changedTouches[0].pageX);
      } else {
        endX = Number(e.pageX);
      }
      if (Math.abs(startX - endX) > 40) {}
      if (startX < endX && limit < endX - startX) {
        cThis.next(false);

      } else if (startX > endX && -limit > endX - startX) {
        cThis.prev(false);
      } else {
        cont.stop().animate({
          'margin-left': marginLeft
        }, ANIMATE_SPEED, ANIMATE_EASING);
      }
      startX = 0;
      body.off('touchmove , mousemove', moveH);
      body.off('touchend , mouseup', endH);
    }

    function check() {
      var cn = parseInt(cont.css('margin-left')) % w;
      marginLeft = (cThis.cnt * -w) - w;
      cont.css('margin-left', (marginLeft + cn) + 'px');
      dx = cont.offset().left - startX;
    }

    function evtClear() {
      body.off('touchmove , mousemove', moveH);
      body.off('touchend , mouseup', endH);
    }
    // method
    this.on = function(evt, func) {
      _this.on(evt, func);
    };
    this.resize = function() {
      w = target.width();
      targetLeft = target.offset().left;
    };
    this.next = function(ch) {
      if (ch !== false) {
        check();
      }
      cThis.cnt--;
      if (cThis.cnt < 0) {
        cThis.cnt = total - 1;
      }
      evtClear();
      _this.trigger(RIGHT);
    };
    this.prev = function(ch) {
      if (ch !== false) {
        check();
      }
      cThis.cnt++;
      if (cThis.cnt > total - 1) {
        cThis.cnt = 0;
      }
      evtClear();
      _this.trigger(LEFT);
    };
    this.navMove = function(onIdx, _thisIdx) {
      if (onIdx < _thisIdx) {
        if (ch !== false) {
          check();
        }
        cThis.cnt += (_thisIdx - onIdx);
        if (cThis.cnt > total - 1) {
          cThis.cnt = 0;
        }
        evtClear();
        _this.trigger(LEFT);
      } else if (onIdx > _thisIdx) {
        if (ch !== false) {
          check();
        }
        cThis.cnt -= (onIdx - _thisIdx);
        if (cThis.cnt < 0) {
          cThis.cnt = total - 1;
        }
        evtClear();
        _this.trigger(RIGHT);
      } else {
        return false;
      }
    };
  };
  commonJs.selectBoxRemove = function(target) {
    var ins = target.data('select');
    ins.remove();
  }
  commonJs.selectBoxListDisabled = function(target, arr) {
    var ins = target.data('select');
    ins.listDisabled(arr);
  }
  commonJs.selectBoxListEnabled = function(target, arr) {
    var ins = target.data('select');
    ins.listEnabled(arr);
  }
  commonJs.selectBoxListAllDisabled = function(target) {
    var ins = target.data('select');
    ins.listAllDisabled();
  }
  commonJs.selectBoxListAllEnabled = function(target) {
    var ins = target.data('select');
    ins.listAllEnabled();
  }
  commonJs.selectBoxDisabled = function(target) {
    var ins = target.data('select');
    ins.boxDisabled();
  }
  commonJs.selectBoxEnabled = function(target) {
    var ins = target.data('select');
    ins.boxEnabled();
  }
  commonJs.selectBoxReverseOn = function(target) {
    var ins = target.data('select');
    ins.reverseOn();
  }
  commonJs.selectBoxReverseOff = function(target) {
    var ins = target.data('select');
    ins.reverseOff();
  }
  commonJs.selectBoxListChange = function(target, index, text) {
    var ins = target.data('select');
    ins.listChange(index, text);
  }
  commonJs.selectBoxListRemove = function(target, index) {
    var ins = target.data('select');
    ins.listRemove(index);
  }
  commonJs.popShow = function(target) {
    lyDim.show();
    target.show();
    var scrollTop = $(window).scrollTop();
    // body.css({position:'fixed',width:'100%',overflow:'hidden',marginTop:-scrollTop});
    setTimeout(function(){
      var size = target.height();
      resizeLayerPopup(target,size);
    },25);
    if(target.find('.popDeptTimeConfirm').length || target.find('.popReturnTimeConfirm').length){
    	target.find('.popClose').off('click.cal').on('click.cal',function(){
    		target.hide();
    		lyDim.hide();
    		commonJs.scrollUnLock();
    	});
    }else if (!target.hasClass('no-event')) {
      commonJs.popClose(target);
    }else{
      target.find('.btnL,.popClose').off('click.popShow').on('click.popShow',function(){
        setTimeout(function(){
          if(doc.find('.layerPop:visible').length == 0){
            commonJs.scrollUnLock();
          }
        },25);
      });
    }
    commonJs.scrollLock();
  }
  commonJs.popClose = function(target) {
    target.find(close).off('click.popClose').on('click.popClose', function(e) {
      var scrollTop = -parseInt(body.css('margin-top'));
      var $this = $(this);
			// body.css({position:'',width:'',overflow:'',marginTop:''});
      if($this.text() == '확인' || $this.text() == '닫기' || $this.text() == '취소'){
    	  e.preventDefault();
        if ($('.layerPop:visible').length < 2) {
          //lyDim.hide();
        }
        target.hide();
        target.css('height','');
      }
      // win.scrollTop(scrollTop);
      setTimeout(function(){
          if(doc.find('.layerPop:visible').length == 0){
            commonJs.scrollUnLock();
            lyDim.hide();
          }
        },25);
    });
  }
  commonJs.scrollLock = function(){
	  if($('body').css('position') == 'fixed'){
		  return false;
	  }
    body.css({position:'fixed',width:'100%',overflow:'hidden',marginTop:-win.scrollTop()});
    doc.find('.stickyWrap').each(function(){
      $(this).addClass('scrollLock')
    });
  }
  commonJs.scrollUnLock = function(){
    var scrollTop = -parseInt(body.css('margin-top'));
		body.css({position:'',width:'',overflow:'',marginTop:''});
	    win.scrollTop(scrollTop);
	    doc.find('.stickyWrap').each(function(){
      $(this).removeClass('scrollLock')
    });
  }
  function form() {
    $('select').each(function() {
      commonJs.selectBoxInit($(this));
    })
    var allChkWrap = $('div.allChkWrap');
    
    doc.on('click','.allCheck input:checkbox',function() ///////////////////// checkbox,radiobox 전체 선택
      {
        var id = $(this).attr('id');
        var checkbox = $('#' + id).parents('div.allChkWrap').find(':checkbox');
        //radiobox = $('#'+id).parents('.allChkWrap');
        if ($('#' + id).is(':checked')) {
          //radiobox.find('.tR').find('input:even').click()
          checkbox.prop('checked', true).attr('checked', true);
        } else {
          //radiobox.find('.tR').find('input:odd').click()
          checkbox.prop('checked', false).attr('checked', false);
        }
      });
    doc.on('change', 'input:checkbox,input:radio', function() {
      var _this = $(this);
      if (_this.is(':checked')) {
        _this.prop('checked', true).attr('checked', true);

      } else {
        _this.prop('checked', false).attr('checked', false);
      }
    })
    doc.on('change', 'input:radio', function() //////////////// checkbox,radiobox 개별 선택
      {
        var _this = $(this);
        var name = _this.attr('name');
        var arr = doc.find('input:radio[name=' + name + ']');
        $.each(arr, function(idx) {
          var n = $(arr[idx]);
          doc.find('#' + n.attr('id')).prop('checked', false).attr('checked', false);

        });
        doc.find('#' + _this.attr('id')).prop('checked', true).attr('checked', true);
        var id = _this.parents(allChkWrap).children('div.allCheck').find('input:checkbox').attr('id');
        var targetId = $('#' + id);
        var target = targetId.parents(allChkWrap).find('.tR');
        //radiolength = $('#'+id).parents('.allChkWrap').find('input[id$=1]').length,
        var radiolength = target.find('input:even').length;
        //radiovalue = $('#'+id).parents('.allChkWrap').find('input[id$=1]:checked').length;
        var radiovalue = target.find('input:even:checked').length;
        if (radiovalue == radiolength) {
          targetId.prop('checked', true);
        } else {
          targetId.prop('checked', false);
        }
      });
    doc.on('change', 'input:checkbox', function() {
      var id = $(this).parents(allChkWrap).children('.allCheck').find('input:checkbox').attr('id');
      var targetId = $('#' + id);
      var target = targetId.parents('div.allChkWrap');
      var targetCheckBox = target.find('input:checkbox');
      targetCheckBox.not('#' + id).off().on('click', function() {
        var checklength = targetCheckBox.not('#' + id).length;
        var checkvalue = target.find('input:checkbox:checked').not('#' + id).length;
        if (checkvalue == checklength) {
          targetId.prop('checked', true);
        } else {
          targetId.prop('checked', false);
        }
      });
    });
  }

  function calendar() {
    var windowh = win.height();
    var layerPopH = 0;
    var lyDim = $('div.lyDim');
    var dateInput = $('#dateSelect');
    var lyDateSelect = $('#lyDateSelect');
    var calendarWrap = lyDateSelect.find('div.calendar');
    var calendar = $('.calendarWrap').find('button.btnCalendar,input');

  //   lyDateSelect.each(function() {
  //     calendar.on('click', function() // 캘린더
  //       {
  //         commonJs.popShow(lyDateSelect);
  //         layerPopH = lyDateSelect.height();
  //         calendarWrap.datepicker({
  //           dateFormat: 'yy-mm-dd', // 날짜 format 설정
  //           dayNamesMin: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'], // 요일 이름 설정
  //           monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월 이름 설정 ( changeMonth가 true일 때 )
  //           monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월 이름 설정 ( changeMonth가 false일 때 )
  //           showMonthAfterYear: true, // 월과 년의 위치를 변경한다.
  //           minDate: '+2D', // 최소 date 값 설정
  //           maxDate: '+3W', // 최대 date 값 설정
  //           beforeShowDay: function(date) {
  //             var getdate = dateInput.data('disableDay');
  //             var changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date);
  //             var day = date.getDay();

  //             return [day !== 6 && getdate.indexOf(changeFormat) === -1, ''];
  //           },
  //           onSelect: function(dateText, inst) {
  //             lyDateSelect.trigger('dateSelected', [dateText]);
  //             //						var title = lyDateSelectBox.children('select').attr('title');
  //             //						lyDateSelectBox.children('button').text(title);
  //           }
  //         });
  //         // 현재 활성화된 날짜를 찾아 그 중 첫번째 날짜로 default 값 변경
  //         calendarWrap.datepicker('setDate', (function() {
  //           var getElem = $('[data-handler="selectDay"]').first();
  //           var year = parseInt(getElem.attr('data-year'), 10);
  //           var month = parseInt(getElem.attr('data-month'), 10) + 1;
  //           var day = parseInt(getElem.text(), 10);
  //           return [year, month, day].join('-');
  //           // [2017, 6, 27] = 2017.6.27
  //         }()));
  //         lyDateSelect.find('a.btnL').on('click', function(e) ///////// 확인 버튼
  //           {
  //             e.preventDefault();
  //             var getDatepicker = calendarWrap.datepicker({
  //               dateFormat: 'dd-mm-yy'
  //             }).val();
  //             var timeText = lyDateSelect.find('button.selectedOpt').text() !== '시간 선택' ? lyDateSelect.find('button.selectedOpt').text() : '';
  //             var resultText = getDatepicker + ' ' + timeText;
  //             dateInput.val(resultText);
  //             lyDateSelect.find('.popClose').click();
  //           });
  //       });
  //   });
  //   $('#lyStartDateSelect').each(function() {
  //     var windowh = win.height(); //위치 조절
  //     var layerPopH = 0;
  //     var lycalendar = $('#lyStartDateSelect,#lyEndDateSelect');
  //     var calendar = $('div.calendarWrap.col2');
  //     var lyStartDateSelect = $(this);
  //     var lyEndDateSelect = $('#lyEndDateSelect');
  //     var lyDim = $('div.lyDim');
  //     var minDate = '+2D';
  //     var maxDate = '+3W';

  //     calendar.find('button.btnCalendar,input').off('click').on('click', function() // 캘린더
  //       {
  //         var _this = $(this).parent().children('button.btnCalendar');
  //         var	showTarget = _this.closest('.calendarWrap').index('.calendarWrap');
  //         if(showTarget == 0) /////////////////////// start
  //         {
  //           var calendarShow = lyStartDateSelect;
  //         }
  //         else  	//////////////////////// end
  //         {
  //           var calendarShow = lyEndDateSelect;
  //         }
  //         var _thiscalendar = calendarShow.find('div.calendar');
  //         var getId = calendarShow.attr('id');
  //         commonJs.popShow(calendarShow);
  //         _thiscalendar.datepicker({
  //           dateFormat: 'yy-mm-dd', // 날짜 format 설정
  //           dayNamesMin: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'], // 요일 이름 설정
  //           monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월 이름 설정 ( changeMonth가 true일 때 )
  //           monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월 이름 설정 ( changeMonth가 false일 때 )
  //           showMonthAfterYear: true, // 월과 년의 위치를 변경한다.
  //           minDate: minDate, // 최소 date 값 설정
  //           maxDate: maxDate, // 최대 date 값 설정
  //           beforeShowDay: function(date) {
  //             var getdate = _this.siblings('input').data('disableDay');
  //             var changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date);
  //             var day = date.getDay();
  //             return [day !== 6 && getdate.indexOf(changeFormat) === -1, ''];
  //           },
  //         });
  //         calendarShow.find('a.btnL').off('click').on('click',function(e) ///////// 확인 버튼
  //         {
  //           e.preventDefault();
  //           var	calendarWrap = calendarShow.find('div.calendar');
  //           var getDatepicker = calendarWrap.datepicker({ dateFormat: 'dd-mm-yy' }).val();
  //           var	timeText = calendarShow.find('button.selectedOpt').text() !== '시간 선택' ? calendarShow.find('button.selectedOpt').text() : '';
  //           var	resultText = getDatepicker + ' ' + timeText;
  //           _this.siblings('input').val(resultText);
  //           calendarShow.find('.popClose').click();
  //           var getShowDate = _thiscalendar.datepicker('getDate');
  //           if(calendarShow.length > 0){
  //             if(calendarShow.attr('id') == 'lyStartDateSelect'){
  //               minDate = getShowDate;
  //             }else{
  //               maxDate = getShowDate;
  //             }
  //           }
  //         });
  //         if (getId === 'lyEndDateSelect') {
  //           _thiscalendar.datepicker('option', 'minDate', minDate);
  //         } else {
  //           _thiscalendar.datepicker('option', 'maxDate', maxDate);
  //         }
  //       });
  //   });
  //   // $('.calendarWrap').find('button.btnCalendar').each(function() {
  //   //   var target = $(this);
  //   //   target.trigger('click');
  //   // });
    doc.find('.layerPop').each(function(){
        var target = $(this);
        target.find('.popClose').trigger('click');
    });
  }
  
  function resizeLayerPopup(target,size)
	{
		$(window).off('resize.pop').on('resize.pop', function () {
			var targetHeight = size || target.height();
			var windowHeight = $(window).height();
      var marginTop = -parseInt(body.css('margin-top'));
      var scrollTop = win.scrollTop();
      // if(marginTop  == 0){
      //   scrollTop=0;
      // }
			if( windowHeight < targetHeight + 120 ){
				target.css({top : 60+scrollTop, position : 'absolute', marginTop : 0});
			}else{
				target.css({top : "50%", position : 'fixed', marginTop : -(targetHeight/2)})
      }
			if(size && (target.attr('id') == 'lyrentpop')){
				if(size+120 > windowHeight){
					target.css({overflowY:'scroll',height:windowHeight-120});
				}else{
					target.css({overflowY:'',height:''});
				}
			}
		});
		$(window).trigger('resize');
	}

  function jsTab() {
    doc.find('div.tabType1.jsTab').each(function() {
      var _this = $(this);
      _this.find('li').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        var index = _this.index();
        var _thistabCont = $('div.rightCon').find('div.tabCont').eq(index);
        if (!_this.hasClass('on')) {
          _this.siblings('li').removeClass('on')
          _this.addClass('on');
          _thistabCont.siblings('div.tabCont').css('display', 'none');
          _thistabCont.css('display', 'block');
        }
      });
    });
  }

  function tgl() //토글 슬라이드
  {
    var tglWrap = $('.tglWrap');
    //		tglWrap.find('.tglBtn').stop().on('click',function()
    tglWrap.on('click', '.tglBtn', function() /////////////////////////////////////////////////////*2017/08/22 수정*/
      {
        var _this = $(this);
        var tgl = _this.closest('li.tgl');
        var tglBtnHeight = _this.outerHeight();
        tglConHeight = tgl.find('div.tglCon').outerHeight();
        if (tgl.hasClass('on')) {
          tgl.stop().animate({
            height: tglBtnHeight
          }, ANIMATE_SPEED - 200, ANIMATE_EASING, function() {
            tgl.removeClass('on');
          });
        } else {
          tgl.stop().animate({
            height: tglConHeight + tglBtnHeight
          }, ANIMATE_SPEED - 200, ANIMATE_EASING)
          tgl.addClass('on');
        }
      });
  }

  function setNavigation(){
		$('nav.gnb>ul>li').css('overflow', 'hidden');
		var menu = $('.hdWrap .gnb ul');
		var act = false;
		var setActive = function($this) {
			var li = $this.parent();
      li.addClass('on jqActive');
			li.parent().parent().parent().addClass('on jqActive');
			act = true;
		};
	
		var initActive = function() {
			var _pathname = location.pathname;
			var _search = location.search;
			// var _href = location.href;
			// _href = _pathname + _search;
			var _href = _pathname + _search;
			//
			if (_pathname == '' || _pathname == '/' || _pathname == '/bmw') {
				menu.find('> li').eq(0).addClass('on jqActive');
			} else  if (_pathname == '/bmw/user/app/regist') {
				menu.find('> li').eq(1).addClass('on jqActive');
			} else {
				var target = menu.find('a[href="' + _href + '"]');
				if (target.length > 0) {
					setActive(target);
					return false;
				}
				menu.find('[data-href-map]').each(function() {
					var $this = $(this);
					var map = $this.data('hrefMap');
					var arr = map.split(',');
					for (var i = 0; i < arr.length; i++) {
						if (_href.indexOf(arr[i]) > -1) {
							setActive($this);
							return false;
						}
					}
				});
			}
		};
		initActive();
  };
  function common() {
    setNavigation();
    var hdWrapHeight = $('div.hdWrap').height();
    var _thisTarget = $('nav.gnb>ul>li').children('a');
    _thisTarget.on('click', function(e) {
      e.preventDefault();
      var _this = $(this);
      var _thisLi = _this.parents('li');
      var depth2M = _this.siblings('div.depth2M');
      var hdWrap = _this.closest('div.hdWrap');
      var btnClose = hdWrap.find('a.btnClose');
      var _thisDepthHeight = depth2M.outerHeight();
      var closeEvent = function () {
				hdWrap.stop().animate({height:hdWrapHeight},ANIMATE_SPEED-200,ANIMATE_EASING);
				_thisLi.removeClass('on');
				hdWrap.removeClass('on')
				btnClose.css('display','none');
				
				// setNavi
				$('.jqActive').addClass('on');
				$('nav.gnb>ul>li').css('overflow', 'hidden');
			};

			
			if (_thisLi.hasClass('on') && $('nav.gnb>ul>li').css('overflow') != 'hidden') {
				_thisLi.siblings('li').removeClass('on');
				_this.blur();
				closeEvent();
				return false;
			}

			// setNavi
			$('nav.gnb>ul>li').css('overflow', 'visible');
      hdWrap.addClass('on')
      _thisLi.siblings('li').removeClass('on');
      _thisLi.addClass('on');
      if (depth2M.length) {
        btnClose.css('display', 'block');
      } else {
        btnClose.css('display', 'none');
        _thisDepthHeight = 0;
      }
      btnClose.off().on('click', closeEvent);
      hdWrap.stop().animate({
        height: hdWrapHeight + _thisDepthHeight
      }, ANIMATE_SPEED - 200, ANIMATE_EASING);
    });
    var menuHeight = 0;
    var stickyWrap = $('aside.stickyWrap');
    var linkList = stickyWrap.find('div.linkList').children('a');

    function stickyWrapMenu() {
      if(stickyWrap.hasClass('scrollLock')){
        return false;
      }
      if (doc.scrollTop() > menuHeight) {
        stickyWrap.css('display', 'block');
      } else {
        stickyWrap.css('display', 'none');
      }
    }
    doc.on('scroll', function() {
      menuHeight = $('div.hdWrap').closest('header').height();
      doc.trigger('stickyClose');
      stickyWrapMenu();
    });
    doc.ready(function(){
			stickyWrapMenu();
		});
    linkList.on('click', function(e) {
      e.preventDefault();
      var _this = $(this);
      var _thisLinkList = _this.parents('div.linkList');
      var linkBtnSize = _this.outerHeight();
      var linkListSize = 0;
      doc.off('stickyClose').on('stickyClose', function() {
        _thisLinkList.animate({
          height: linkBtnSize
        }, ANIMATE_SPEED - 200, ANIMATE_EASING, function() {
          _thisLinkList.removeClass('on');
        });
        doc.off('stickyClose')
      });
      if (_thisLinkList.hasClass('on')) {
        doc.trigger('stickyClose');
      } else {
        _thisLinkList.addClass('on');
        linkListSize = _thisLinkList.find('ul').outerHeight();
        _thisLinkList.animate({
          height: linkBtnSize + linkListSize
        }, ANIMATE_SPEED - 200, ANIMATE_EASING);
      }
    });
    var fmsite = $('div.fmSite');
    var _thisFmsite = fmsite.children('a');
    var fmsiteUl = fmsite.find('ul');
    var paddingBottom = parseInt(fmsiteUl.css('paddingBottom'));
    var fmsiteSize = fmsiteUl.height();
    _thisFmsite.on('click', function(e) {
      e.preventDefault();
      var _this = $(this);
      var fmsite = _this.parents('div.fmSite');
      var _thisUl = fmsite.find('ul');
      if (fmsite.hasClass('on')) {
        _thisUl.stop().animate({
          height: 0,
          paddingBottom: 0
        }, ANIMATE_SPEED - 200, ANIMATE_EASING, function() {
          fmsite.removeClass('on');
        });
      } else {
        _thisUl.height(0);
        fmsite.addClass('on');
        _thisUl.stop().animate({
          height: fmsiteSize,
          paddingBottom: paddingBottom
        }, ANIMATE_SPEED - 200, ANIMATE_EASING);
      }
    });
  }

  function slider() {
    var slider = $('div.slider');
    slider.each(function() {
      var _this = $(this);
      var _cont = _this.find('ul.sliderWrap');
      var _thisMSlider = _this.closest('div.mSlider');
      var sCon = _this.find('li.sCon');
      sCon.first().clone().appendTo(sCon.parent()); // 맨앞,뒤 클론 생성
      sCon.last().clone().prependTo(sCon.parent());
      var _thissCon = _this.find('li.sCon');
      var sConLength = _thissCon.length; // 클론 생성뒤 클론 개수 까지 계산
      var _thisNavWrap = _this.find('div.navWrap');
      var _thisNav = _this.find('div.sliderNav').find('a');
      var sliderLength = _thisNav.length; //nav 개수
      var wW = 0;
      var _thisMargin = 1;
      var minWidth = 0;
      if (sCon.length == 1) {
        _this.addClass('only');
        resizeH();
        resize.on('resize', resizeH)
        return true;
      } else if (sConLength > sliderLength) {
        var addLength = sConLength - sliderLength - 2
        for (var i = 1; i < addLength + 1; i++) {
          var nextNumber = +_thisNav.last().text() + 1
          _thisNavWrap.append('<a href="#">' + nextNumber + '</a>');
        }
      } else if (sConLength < sliderLength) {
        var removeLength = sliderLength - sConLength
        for (var i = 1; i < removeLength + 1; i++) {
          _thisNavWrap.children().last().remove();
        }
      }
      if (_thisMSlider.length) {
        resize.on('resize', resizeH)
      }
      resizeH();

      function resizeH() /////////////////화면 전환시
      {
        if (wW > 0) {
          _thisMargin = -parseInt(_cont.css('marginLeft')) / wW;
        }

        if (_thisMSlider.length) {
          var min = 1185;
          wW = $(window).width();
          if (wW < min) {
            wW = min;
          }
        } else {
          wW = sCon.width();
        }
        _thissCon.css('width', wW + 'px');
        _cont.css({
          'margin-left': -wW * _thisMargin + 'px',
          'width': ((wW * sConLength) + 100) + 'px'
        });
        _this.css('width', wW + 'px');
      }

      var slide = new Jessture({
        target: _this,
        content: _cont
      });
      var type = _thisMSlider.length;
      var mainCheck = (_thisMSlider.length > 0) ? true : false;
      var total = _cont.children().length - 2;
      resize.on('resize', function() {
        slide.resize();
        stop();
        sliderTimer();
      });
      slide.on(slide.RIGHT, move);
      slide.on(slide.LEFT, move);
      _this.find('button.btnPrev').on('click', function() {
        slide.next();
      });
      _this.find('button.btnNext').on('click', function() {
        slide.prev();
      });
      _this.find('div.navWrap>a').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        var onIdx = _this.parent().children('.on').index();
        var _thisIdx = _this.index();
        slide.navMove(onIdx, _thisIdx);
      });
      var timer = 0;

      function sliderTimer() {
        timer = setInterval(slide.prev, 5000);
      }

      function stop() {
        clearInterval(timer);
      }
      sliderTimer();
      _this.on('touchstart , mousedown', function() {
        stop();
      });
      _this.on('touchend , mouseup', function() {
        sliderTimer();
      });

      function move(evt) {
        stop();
        var p = (-wW * slide.cnt) - wW;
        var _thisNav = _this.find('div.navWrap>a');
        _thisNav.removeClass('on');
        _thisNav.eq(slide.cnt).addClass('on')
        if (evt.type == 'jsLeft') {
          if (slide.cnt == 0) {
            p = (-wW * total) - wW;
          }
        } else {
          if (slide.cnt == total - 1) {
            p = 0;
          }
        }
        _cont.stop().animate({
          'margin-left': p + 'px'
        }, ANIMATE_SPEED - 300, ANIMATE_EASING);
        sliderTimer();
      }
    });
  }
  /*2017/9/04추가 oas/html/ownersguide_light_info.html fixedtab 스크롤시 페이지 상단에 붙이기*/
  function fixedTab() {
    var _thisScrollTop = 0;
    var stickyHeight = $('.stickyMenu').height() || 0;
    var html = $('html');
    doc.find('.fixedTab').each(function() {
      var _this = $(this);
      var wrap = _this.find('ul');
      var con = wrap.children('li');
      var conArea = _this.siblings('.contArea');
      var lightInfo = conArea.children('.lightInfo');
      var defaultTop = _this.position().top;
      var tabTop = defaultTop + _this.height();
      doc.scroll(function() {
        if(html.is(':animated')){return false;}
        var on = wrap.children('.on');
        var idx = lightInfo.eq(on.index());
        var next = idx.next();
        var prev = idx.prev();
        _thisScrollTop = doc.scrollTop();
        if (_thisScrollTop > tabTop) {
          _this.css({
            position: 'fixed',
            top: stickyHeight + 'px'
          })
        } else {
          _this.css({
            position: 'absolute',
            top: defaultTop + 'px'
          })
        }
        if(!next.length){}else
				if((next.offset().top-_this.outerHeight(true)-20) < _thisScrollTop){
					on.removeClass('on').next().addClass('on')
				}
				if(!prev.length){}else
				if((prev.offset().top-_this.outerHeight(true)-20) > _thisScrollTop){
					on.removeClass('on').prev().addClass('on')
				}
				if(win.scrollTop() == (doc.height() - win.height())){
					con.last().addClass('on').siblings('li').removeClass('on');
				}
      });
    });
    doc.trigger('scroll');
  }

	/* 2018/07/04 추가. */
	function PopupSlide(){
    var slider = this;
    var layerPop = $('#lyExpire');
		var slideCon = layerPop.find('.slideCon');
    var navList = layerPop.find('.slideNav>a');
    var slideUl = layerPop.find('.slideCon>ul:eq(0)');
    var listLength = slideUl.children('li').length;
    var btnPrev = slideCon.children('button').eq(0);
    var btnNext = slideCon.children('button').eq(1);
    var btnClose = layerPop.find('.txtClose');
    var btnPopClose = layerPop.find('button.popClose');
    var lydim = $('.lyDim');
    var btnTxt = ['다음' ,'닫기'];
    var defTxt = '다음';
    var listW = 350;
    var cnt = 0;

    (listLength>1)?defTxt=btnTxt[0]:defTxt = btnTxt[1];
		btnClose.text(defTxt);

		var pFunctions = {
			swipeLeft : function(){
        if(cnt<=0){
          return;
        }
        cnt--;
        slideUl.stop().animate({
          'margin-left': cnt*-listW + 'px'
        }, 400 , 'easeInOutQuint');
        pFunctions.setNav();
			},
      swipeRight : function(){
        if(cnt > listLength-2){
          return;
        }
        cnt++;
        slideUl.stop().animate({
          'margin-left': cnt*-listW + 'px'
        }, 400 ,'easeInOutQuint');
        pFunctions.setNav();
      },
      setNav : function(){
        navList.eq(cnt).addClass('on').siblings().removeClass('on');
        if(cnt==listLength-1){
          btnClose.text(btnTxt[1]);
        }else{
          btnClose.text(btnTxt[0]);
        }
      },
      closeOrNext : function(){
        if(btnClose.text()==btnTxt[1]){
          pFunctions.closePopup();
        }else{
          pFunctions.swipeRight();
        }
      },
      closePopup : function(){
        lydim.hide();
        layerPop.hide();
        cnt = 0;
        btnClose.text(defTxt);
        navList.eq(0).addClass('on').siblings().removeClass('on');
        slideUl.css('margin-left','0px');
      },
      navClickH: function(){
				if(listLength==1){
					return;
				}
				var $this = $(this);
				var clickedIdx = navList.index($this);
				pFunctions.gotoSlide(clickedIdx);
				$this.addClass('on').siblings().removeClass('on');
				cnt = clickedIdx;
				pFunctions.setNav(clickedIdx);
			},
			gotoSlide : function(idx){
				slideUl.stop().animate({
          'margin-left': idx*-listW + 'px'
        }, 400 ,'easeInOutQuint');
			}
		}

		btnPrev.on('click' , pFunctions.swipeLeft);
		btnNext.on('click' , pFunctions.swipeRight);
    btnClose.on('click' , pFunctions.closeOrNext);
    btnPopClose.on('click' , pFunctions.closePopup);
    navList.on('click' , pFunctions.navClickH);

	}

  // 추가 1125~1183
  function Banner() {
    var banner = this;
    var target = $('div.slide');
    if( target.length == 0 || target.hasClass('coupon')){
      return;
    }
    var el = {
      slide: target,
      slideCont: target.find('>div.slideWrap>ul'),
      next: target.find('button.btn_next'),
      prev: target.find('button.btn_prev'),
    }
    var option = {
      idx: 0,
      width: (el.slideCont.find('li:eq(0)').width() + 19) * 2,
      TOTAL: el.slideCont.find('li').length
    }

    // method
    banner.move = function(idx) {
      el.slideCont.stop().animate({
        'marginLeft': -option.width * idx
      }, 200)
    }

    //event binding
    banner.bindEvent = function() {
      var handler = function(evt) {
        evt.preventDefault();
        el.slideCont = $(evt.target).siblings('div.slideWrap').children('ul'); // this
        option.TOTAL = el.slideCont.find('li').length / 2; //length
        var idx = el.slideCont.data('idx') || 0;
        var value = ($(evt.target).attr('class') == 'btn_next') ? true : false;
        var margin = -parseInt(el.slideCont.css('margin-left'));
        if (value) {
          // next
          if (margin < option.width * (option.TOTAL - 1)) {
            idx++
          }
          // if( option.idx < option.TOTAL-1 ){
          // 	option.idx++;
          // 	banner.move(option.idx);
          //  }
        } else {
          // prev
          if (margin >= option.width) {
            idx--;
          }
          // if( option.idx > 0 ){
          // 	option.idx--;
          // 	banner.move(option.idx);
          // }
        }
        // console.log( value );
        banner.move(idx);
        el.slideCont.data('idx', idx);
      }
      el.next.on('click', handler);
      el.prev.on('click', handler);
    }
    // initialized
    banner.init = function() {
      banner.bindEvent();
      // console.log('init');
    }
    banner.init();
  }


  /* 2019 03 29 */
	//http://bmwoas.magnumvint.com:81/oas/html/mybmw_tab1.html#
	function CouponSlide(){
		var coupon = this;
		coupon.init = function(){
			$('.slide.coupon').each(function(){
				var slideCoupon = $(this);
				var wrap = slideCoupon.children('.slideWrap');
				var ul = wrap.children('ul');
				var cont = ul.children('li');
				var width = cont.width();
				var length  = cont.length;
        var idx = Math.floor(-parseInt(ul.css('margin-left')) / width);
        slideCoupon.data('idx',idx);
				slideCoupon.off('click').on('click','button',function(e){
					e.preventDefault();
					var _this = $(this);
					var idxData = slideCoupon.data('idx');
					if(_this.hasClass('btn_next')){
						if(idxData == length-1){return false}
						slideCoupon.data('idx',idxData+1);
					}else{
						if(idxData == 0){return false}
						slideCoupon.data('idx',idxData-1);
					}
					coupon.move(ul,slideCoupon.data('idx'),400);
				});
			});
		}
		coupon.move = function(target,idx,speed){
      target.stop().animate({marginLeft:-((target.children('li').width()+17)*idx)},speed);
      target.closest('.slide.coupon').data('idx',idx);
		}
		coupon.init();
	}
  /* 2019 03 29 */
  
  $(function() {
    doc = $(document);
    win = $(window);
    body = $('body');
    resize = $({});
    win.on('resize', resizeH);
    resizeH()

    function resizeH() {
      wWidth = win.width();
      wHeight = win.height();
      resize.trigger('resize');
    }
    form();
    calendar();
    jsTab();
    tgl();
    common();
    slider();
    fixedTab();
		new PopupSlide();
    new Banner(); //추가
    var coupon = new CouponSlide(); //추가 2019-03-29
		commonJs.couponInit = coupon.init; // 쿠폰 슬라이드 초기화
		commonJs.couponMove = coupon.move; // target 쿠폰 슬라이드 move
    $(window).on('load', function() {
      // console.log('xxx');
      // resizeH();
    });
  });

})(jQuery, window)
