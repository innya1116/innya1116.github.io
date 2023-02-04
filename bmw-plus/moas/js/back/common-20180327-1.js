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



 팝업
 commonJs.popShow($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 show			   ex) commonJs.popShow($('#lyAutoLogin'));
 commonJs.popClose($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 hide			   ex) commonJs.popClose($('#lyDateSelect'));

 //2017.07.25추가
 commonJs.event.on('swipeComplete',function(event,index){	//스와이프 완료

 });
 commonJs.event.on('menuClose',function(){		//메뉴닫기

 })

**/
(function($,window){

	this.commonJs = {};

	var doc;
	var MENU_CLOSE = 'menuClose';
	var SWIPE_COMPLETE = 'swipeComplete';
	var win;
	var ANIMATE_SPEED = 500;
	var ANIMATE_EASING = 'easeOutQuad';
	var lyDim = $('div.lyDim');
	var close = $('button.btnClose,.btnBox,.btnL');
	var popupSlide = null;

//	var autoLogin = $('#autoLogin');
	var wWidth = 0;
	var wHeight = 0;
	commonJs.event = $({});
	commonJs.selectBoxInit = function(target)
	{
		var select = new SelectBox(target);
		target.data('select',select);
	}
	function SelectBox(target)
	{
		var selectbox = target.parent();
		var selectlength = selectbox.length;
		var	selectboxOption = target.find('option');
		var	title = 0;
		var	allSelectBox = $('.selectBox');
		target.hide();
		for( var i = 0  ; i < selectboxOption.length ; i++ )
		{
			if(selectboxOption.eq(i).attr('selected'))
			{
				title = target.find('option:selected').text();
		   	 	break;
			}
			else
			{
				title = selectbox.find('select').attr('title');
			}
		}
		if(selectbox.hasClass('disabled'))
		{
			target.before('<button type="button"  class="selectedOpt" disabled>'+title+'</button>')
		}
		else
		{
			target.before('<button type="button"  class="selectedOpt">'+title+'</button>')
		}
		target.before('<div class="selOptWrap"><ul class="selectList"></ul></div>');
		for( var i = 0 ; i<selectlength ; i++ )
		{
			target.eq(i).children().clone().appendTo(selectbox.eq(i).find('ul.selectList'));
		}
		var selOptWrap = selectbox.children('div.selOptWrap');
		var selectedOpt = selectbox.children('button.selectedOpt');
		selOptWrap.find('option:selected').contents().unwrap().wrap('<li class="on"><button type="button"></button><li>');
		selOptWrap.find('option:disabled').contents().unwrap().wrap('<li><button type="button" disabled></button><li>');
		selOptWrap.find('option').contents().unwrap().wrap('<li><button type="button"></button><li>');
		function selectBoxClose(e)
		{
			if(!($(e.target).closest(selectedOpt).length) &&  (e.type == 'click'))
			{
				selectbox.removeClass('on');
			}
			else if(!$(e.target).closest(selOptWrap).length)
			{
				if(!$(e.target).siblings('div.selOptWrap').length)
				{
					selectbox.removeClass('on');
				}
			}
		}
		selectbox.off('click').on('click',function()///////////////////// selectbox on,off
		{
			var _this = $(this);
			if(_this.hasClass('on'))
			{
				selectbox.removeClass('on');
				doc.off('touchstart , mousedown, click');
			}
			else
			{
				allSelectBox.removeClass('on');
				_this.addClass('on');
				doc.off('touchstart , mousedown, click').on('touchstart , mousedown, click',function(e)
				{
					selectBoxClose(e);
				});
			}
			var selecton = $('.selectBox.on');
			selecton.find('li').off('click').on('click',function()
			{
				var _this = $(this);
				var title = _this.children().text();
				_this.siblings().removeClass('on')
				_this.addClass('on');
				selecton.children('button').attr('title','선택된 항목').text(title);
				_this.closest(selectbox).children('select').trigger('selectbox.select',[_this.index(), _this.text()]);
			});
		});
		var _this = this;
		var selectList = selectbox.find('ul.selectList button:button');
		_this.remove = function()
		{
			selOptWrap.remove();
			selectedOpt.remove();
		}
		_this.listDisabled = function(arr)
		{
			var	len = arr.length;
			for(var i=0;i<len;i++)
			{
				selectList.eq(arr[i]).attr('disabled','disabled');
			}
		}
		_this.listEnabled = function(arr)
		{
			var	len = arr.length;
			for(var i = 0;i<len;i++)
			{
				selectList.eq(arr[i]).removeAttr('disabled');
			}
		}
		_this.listAllDisabled = function()
		{
			selectList.attr('disabled','disabled');
		}
		_this.listAllEnabled = function()
		{
			selectList.removeAttr('disabled');
		}
		_this.boxDisabled = function()
		{
			selectedOpt.attr('disabled','disabled');
			selectbox.addClass('disabled');
		}
		_this.boxEnabled = function()
		{
			selectedOpt.removeAttr('disabled');
			selectbox.removeClass('disabled');
		}
		_this.listChange = function(index,text)
		{
			selectbox.find('li:eq('+index+')').children().text(text);
		}
		_this.listRemove = function(index)
		{
			selectbox.find('li:eq('+index+')').remove();
		}
	}
	function Jessture( obj )
	{
		var target = obj.target;
		var cont = obj.content;
		var startX = 0;
		var startY = 0;
		var _this = $(this);
		var RIGHT = this.RIGHT = 'jsRight';
		var LEFT = this.LEFT = 'jsLeft';
		var thisTarget = 0;
		var marginLeft = 0;
		var total = cont.children().length;
		var cThis = this;
		cThis.cnt = 0;
		var w = target.width();
		var limit = 50;
		var body = $('body');
		var targetLeft = target.offset().left;
		var time = 0;
		target.on('click' , function(e)
		{
			body.off('touchmove , mousemove',moveH);
			body.off('touchend , mouseup' , endH );

			if(!mCheck)
			{
				e.preventDefault();
			}
		});
		target.on('touchstart , mousedown' , startH );

		// private function
		var mCheck = false;
		var dx = 0;
		function startH(e)
		{
			mCheck = true;
			if( $(e.target).filter('input').length == 0)
			{
//						e.preventDefault();
			}
			if(e.type == 'mousedown')
			{
				// input 필드 체크
				startX = e.pageX;
				startY = e.pageY;
			}
			else
			{
				startX = e.originalEvent.touches[0].pageX;
				startY = e.originalEvent.touches[0].pageY;
			}
			if(cont.is(':animated'))
			{
				return
			}
			check();
			body.on('touchmove , mousemove', moveH);
			body.on('touchend , mouseup' , endH );
		}
		var ch = false;
		function moveH(e)
		{
			mCheck = false;
			// console.log('move-- ',e.type);
			ch = true;
			var endX = 0;
			var endY = 0;
			endX = e.pageX-targetLeft;
			// e.preventDefault();
			if(e.type != 'mousemove')
			{
				endX = e.originalEvent.touches[0].pageX-targetLeft;
				endY = e.originalEvent.touches[0].pageY;
			}
		}
		function endH(e)
		{
			if(!ch)
			{
				return
			}
			ch =false;
			var endX = 0;
			// e.preventDefault();
			if(e.originalEvent.changedTouches)
			{
			//if(!e.originalEvent.touches){
				endX = Number(e.originalEvent.changedTouches[0].pageX);
			}
			else
			{
				endX = Number(e.pageX);
			}
		if( Math.abs(startX - endX) > 40){}
			if(startX < endX && limit < endX-startX)
			{
				cThis.next(false);
			}
			else if(startX > endX && -limit > endX-startX)
			{
				cThis.prev(false);
			}
			startX = 0;
			body.off( 'touchmove , mousemove' , moveH);
			body.off('touchend , mouseup' , endH );
		}
		function check()
		{
			var cn = parseInt( cont.css('margin-left') );
//					console.log(cn);
//					marginLeft = (cThis.cnt*-w)-w;
//					cont.css('margin-left',(marginLeft+cn)+'px');
			dx = cont.offset().left-startX;
		}
		function evtClear()
		{
			body.off( 'touchmove , mousemove' , moveH);
			body.off('touchend , mouseup' , endH );
		}
		// method
		this.on = function( evt , func)
		{
			_this.on(evt , func );
		};
		this.resize = function()
		{
			w = target.width();
			targetLeft = target.offset().left;
		};
		this.next = function(ch)
		{
			if( ch !== false)
			{
				check();
			}
			cThis.cnt--;
			if(cThis.cnt<0)
			{
				cThis.cnt = 0;
			}
			_this.trigger( RIGHT);
		};
		this.prev = function(ch)
		{
			if( ch !== false)
			{
				check();
			}
			cThis.cnt++;
			if(cThis.cnt>total-1)
			{
				cThis.cnt = total-1;
			}
			evtClear();
			_this.trigger( LEFT);
		};
	};
	commonJs.selectBoxRemove  = function(target)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.remove();
	}
	commonJs.selectBoxListDisabled = function(target,arr)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listDisabled(arr);
	}
	commonJs.selectBoxListEnabled = function(target,arr)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listEnabled(arr);
	}
	commonJs.selectBoxListAllDisabled = function(target)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listAllDisabled();
	}
	commonJs.selectBoxListAllEnabled = function(target)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listAllEnabled();
	}
	commonJs.selectBoxDisabled = function(target)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.boxDisabled();
	}
	commonJs.selectBoxEnabled = function(target)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.boxEnabled();
	}
	commonJs.selectBoxListChange = function(target,index,text)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listChange(index,text);
	}
	commonJs.selectBoxListRemove = function(target,index)
	{
		target = selectSearch(target);
		var ins = target.data('select');
		ins.listRemove(index);
	}
	commonJs.popShow = function(target)
	{
//		if(target.find('.lyWrap').length)
//		{
//			if(target.attr('id')=='lyAutoLogin')
//			{
//				autoLogin.prop('checked',true).attr('checked',true);
//			}
//			target.show();
//		}
//		else
//		{
			target.show();
			lyDim.show();
//		}
		commonJs.popClose(target);
	}
	commonJs.popClose = function(target)
	{
		// target.find('.btnClose,.btnBox,.btnL').off('click').on('click',function(e)
		target.find('.btnClose,.btnL').off('click').on('click',function(e)
		{
			e.preventDefault();
			lyDim.hide();
			target.hide();
//			if(target.attr('id')=='lyAutoLogin')
//			{
//				autoLogin.prop('checked',false).attr('checked',false);
//			}
		});
	}
	function  selectSearch(target)
	{
		if(target.children('select').length)
		{
			return target.children('select');
		}
		else
		{
			return target;
		}
	}
	function form()
	{
		doc.find('div.wrapInp').each(function()
		{
			var _this = $(this);
			_this.children('input').focusout(function() ////////////////// input
			{
				var _this = $(this);
				if(_this.val())
				{
					_this.parent().addClass('on');
				}
				else
				{
					_this.parent().removeClass('on');
				}
			});
		})
		doc.find('select').each(function() //////////////////////////////////////// selectBox
		{
			commonJs.selectBoxInit( $(this) );
		});
		$('div.allCheck').find('input:checkbox').on('click',function() ///////////////////// checkbox,radiobox 전체 선택
		{
			var id = $(this).attr('id');
			var	checkbox = $('#'+id).parents('div.allChkWrap').find(':checkbox');
				//radiobox = $('#'+id).parents('.allChkWrap');
			if($('#'+id).is(':checked'))
			{
				//radiobox.find('.tR').find('input:even').click()
				checkbox.prop('checked',true).attr('checked',true);
			}
			else
			{
				//radiobox.find('.tR').find('input:odd').click()
				checkbox.prop('checked',false).attr('checked',false);
			}
		});

		doc.on('change','input:checkbox,input:radio',function()
		{
			var _this = $(this);
			if(_this.is(':checked'))
			{
				_this.prop('checked',true).attr('checked',true);
			}
			else
			{
				_this.prop('checked',false).attr('checked',false);
			}
		});

		doc.on('change','input:radio',function()  //////////////// checkbox,radiobox 개별 선택
		{
			var _this = $(this);
			var name = _this.attr('name');
			var arr = doc.find('input:radio[name='+name+']');
			$.each(arr,function(idx)
			{
				var n = $(arr[idx]);
				doc.find('#'+n.attr('id')).prop('checked',false).attr('checked',false);
			});
			doc.find('#'+_this.attr('id')).prop('checked',true).attr('checked',true);
			var id = _this.parents('div.allChkWrap').children('div.allCheck').find('input:checkbox').attr('id');
			var	targetId = $('#'+id);
			var	target = targetId.parents('div.allChkWrap').find('.tR');
//			var	//radiolength = $('#'+id).parents('.allChkWrap').find('input[id$=1]').length;
			var	radiolength = target.find('input:even').length;
//			var	//radiovalue = $('#'+id).parents('.allChkWrap').find('input[id$=1]:checked').length;
			var	radiovalue = target.find('input:even:checked').length;
			if(radiovalue==radiolength)
			{
				targetId.prop('checked',true);
			}
			else
			{
				targetId.prop('checked',false);
			}
		});
		doc.on('change','input:checkbox',function()
		{
			var id = $(this).parents('div.allChkWrap').children('div.allCheck').find('input:checkbox').attr('id');
			var	targetId = $('#'+id);
			var	target = targetId.parents('div.allChkWrap');
			target.find('input:checkbox').not('#'+id).off().on('click',function()
			{
				var checklength = target.find('input:checkbox').not('#'+id).length;
				var	checkvalue = target.find('input:checkbox:checked').not('#'+id).length;
				if(checkvalue==checklength)
				{
					targetId.prop('checked',true);
				}
				else
				{
					targetId.prop('checked',false);
				}
			});
		});
	}
	function popup()
	{
		var windowh = win.height();
		var	lyDateSelect = $('#lyDateSelect');
		var	popTit = lyDateSelect.find('.popTit').innerHeight();
		var	login = $('.layerOpen');
		var	dateInput = $('#dateSelect');
//		var	lyAutoLogin = $('#lyAutoLogin');
//		var	poph = lyAutoLogin.height();
		var	calendarWrap = lyDateSelect.find('div.calendarWrap');
		var	buttonCalendarWrap = $('.calendarWrap').children('button.btnCalendar,input');
		var	lyDateSelectBox = lyDateSelect.find('div.selectBox');
//		var	loginPopup = $('div.lyDim,#lyAutoLogin');
		var	timeOption = lyDateSelect.find('.timeOption');
		var fixedBtn = $('div.fixedBtn');
		doc.find(lyDateSelect).each(function()
		{
			var _this = $(this);
			_this.find('button.btnClose').off().on('click',function() ////////// 캘린더 X버튼
			{
				_this.hide();
				lyDateSelectBox.removeClass('on');
				fixedBtn.css('display','block')
			});
			buttonCalendarWrap.on('click',function()// 캘린더
			{
				fixedBtn.css('display','none')
				var getdate = dateInput.data('enabledDays');

				if (getdate != undefined && getdate != null && getdate.length == 0)
				{
					return false;
				}
				timeOption.attr('title', '시간 선택').html('<option value="">시간 선택</option>');

				commonJs.selectBoxRemove(timeOption);
				commonJs.selectBoxInit(timeOption);
				commonJs.selectBoxDisabled(timeOption);

				lyDateSelect.show();
				lyDateSelect.find('img').remove(); // 더미 이미지 삭제
				calendarWrap.datepicker(
				{
					dateFormat:'yy-mm-dd',                                                                     // 날짜 format 설정
					dayNamesMin :['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'],                           // 요일 이름 설정
					monthNamesShort :['01','02','03','04','05','06','07','08','09','10','11','12'],            // 월 이름 설정 ( changeMonth가 true일 때 )
					monthNames:['01','02','03','04','05','06','07','08','09','10','11','12'],                  // 월 이름 설정 ( changeMonth가 false일 때 )
					showMonthAfterYear:true,                                                                   // 월과 년의 위치를 변경한다.
//					minDate:'+2D',                                                                             // 최소 date 값 설정
//					maxDate:'+2D+3W',  																			// 최대 date 값 설정
					minDate : getdate[0],
					maxDate : getdate[ getdate.length - 1 ],
					beforeShowDay: function(date)
					{
//						var getdate = dateInput.data('disableDay'),
//							changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date),
//							day = date.getDay();
//
//						return [day !== 6 && getdate.indexOf(changeFormat) === -1, ''];

						var changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date),
							day = date.getDay();
						return [getdate.indexOf(changeFormat) > -1, ''];
					},
					onSelect : function(dateText, inst)
					{
						commonJs.selectBoxListAllEnabled(lyDateSelectBox);
						lyDateSelect.trigger('dateSelected', [dateText]);
						var title = lyDateSelectBox.children('select').attr('title');
						lyDateSelectBox.children('button').text(title);
						fixedBtn.css('display','block')
					}
				});
				// 현재 활성화된 날짜를 찾아 그 중 첫번째 날짜로 default 값 변경
//				calendarWrap.datepicker('setDate', (function() {
//					var getElem = $('[data-handler="selectDay"]').first(),
//						year = parseInt(getElem.attr('data-year'), 10),
//						month = parseInt(getElem.attr('data-month'), 10)+1,
//						day = parseInt(getElem.text(), 10);
//
//					return [year, month, day].join('-');
//					// [2017, 6, 27] = 2017.6.27
//				}()));
				lyDateSelect.find('.btnL').off('click').on('click',function(e) ///////// 확인 버튼
				{
					e.preventDefault();
					if (timeOption.val() == '')
					{
						if (Message && Message.alert)
						{
							lyDateSelect.hide();
							Message.alert('예약 시간을 선택해 주세요.', function()
							{
								lyDateSelect.show()
							});
						}
						return false;
					}
					timeOption.trigger('timeSelected');
					var getDatepicker = calendarWrap.datepicker({ dateFormat: 'dd.mm.yy' }).val();
					var timeText = lyDateSelect.find('button.selectedOpt').text() !== '시간 선택' ? lyDateSelect.find('button.selectedOpt').text() : '';
					var resultText = getDatepicker + ' ' + timeText;
					dateInput.val(resultText);
					lyDateSelect.hide();
					lyDateSelectBox.removeClass('on');
					fixedBtn.css('display','block')
				});
			});
		});
		var	lycalendar = $('#lyStartDay,#lyEndDay');
		var	calendar = $('div.calendarWrap');
		var	calendarCol2 = $('div.calendarCol2');
		var	minDate = '+2D';
		var	maxDate = '+3W';
		doc.find(lycalendar).each(function()
		{
			var _this = $(this);
			_this.find('button.btnClose').on('click',function() ////////// 캘린더 X버튼
			{
				lycalendar.hide();
				fixedBtn.css('display','block')
			});
			calendarCol2.find(calendar).on('click',function() // 캘린더
			{
				fixedBtn.css('display','none')
				var _this = $(this).find('button.btnCalendar'),
					showTarget = _this.closest(calendar).index('.calendarWrap'),
					calendarShow = $('.layerPop.fullType.dateSelect:eq('+showTarget+')'),
					getId = calendarShow.attr('id');
				calendarShow.show();
				calendarShow.find('div.calendarWrap.inPage').datepicker(
				{
					dateFormat:'yy-mm-dd',                                                                     // 날짜 format 설정
					dayNamesMin :['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'],                           // 요일 이름 설정
					monthNamesShort :['01','02','03','04','05','06','07','08','09','10','11','12'],            // 월 이름 설정 ( changeMonth가 true일 때 )
					monthNames:['01','02','03','04','05','06','07','08','09','10','11','12'],                  // 월 이름 설정 ( changeMonth가 false일 때 )
					showMonthAfterYear:true,                                                                   // 월과 년의 위치를 변경한다.
					minDate: minDate,                                                                             // 최소 date 값 설정
					maxDate: maxDate,                                                                             // 최대 date 값 설정
					beforeShowDay: function(date)
					{
						var getdate = _this.siblings('input').data('disableDay');
						var	changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date);
						var	day = date.getDay();

						return [day !== 6 && getdate.indexOf(changeFormat) === -1, ''];

//						var disableDay = dateInput.data('disableDay'),
//							enableDay = dateInput.data('enableDay'),
//
//							changeFormat = jQuery.datepicker.formatDate('yy-mm-dd', date),
//							day = date.getDay();
//
//	                    console.log(changeFormat);
//						if (disableDay) {
//							return [day !== 6 && disableDay.indexOf(changeFormat) === -1, ''];
//	                    } else if (enableDay) {
//	                        if (enableDay.indexOf(changeFormat) !== -1) {
//	                            return [true, "","Available"];
//	                        } else {
//	                            return [false,"","unAvailable"];
//	                        }
//						}
					},
					onSelect : function(dateText)
					{
						var dateLy = calendarShow.siblings('.dateSelect');
						var	getShowDate = calendarShow.find('div.calendarWrap.inPage').datepicker('getDate');
						_this.siblings('input').val(dateText)
						lycalendar.hide();
						if(dateLy.length > 0) {

							if(getId === 'lyStartDay')
							{
								minDate = getShowDate;
							}
							else
							{
								maxDate = getShowDate;
							}
						}
						fixedBtn.css('display','block')
					}
				});
				if(getId === 'lyEndDay')
				{
					$('.dateSelect#lyEndDay').find('div.calendarWrap.inPage').datepicker('option', 'minDate',minDate);
				}
				else
				{
					$('.dateSelect#lyStartDay').find('div.calendarWrap.inPage').datepicker('option', 'maxDate',maxDate);
				}

			});
		});
//		$('#lyStartDay').find('.calendarWrap.inPage').datepicker('setDate', (function() {
//
//                var getElem = $('[data-handler="selectDay"]').first(),
//                    year = parseInt(getElem.attr('data-year'), 10),
//                    month = parseInt(getElem.attr('data-month'), 10)+1,
//                    day = parseInt(getElem.text(), 10);
//
//                return [year, month, day].join('.');
//					// [2017, 6, 27] = 2017.6.27
//			}()));
//		$('#lyEndDay').find('.calendarWrap.inPage').datepicker('setDate', (function() {
//
//				var getElem = $('[data-handler="selectDay"]').last(),
//					year = parseInt(getElem.attr('data-year'), 10),
//					month = parseInt(getElem.attr('data-month'), 10)+1,
//					day = parseInt(getElem.text(), 10);
//
//				return [year, month, day].join('.');
//				// [2017, 6, 27] = 2017.6.27
//			}()));
		(function()
		{
			var $range = $('.range-datepicker');
			var	$min =  $range.find('.min');
			var	$max = $range.find('.max');
			// from datepicker
			$min.on('change', function()
			{
				$max.datepicker('option', 'maxDate', $(this).datepicker('getDate'));
			});

			// to datepicker
			$max.on('change', function()
			{
				$min.datepicker('option', 'minDate', $(this).datepicker('getDate'));
			});
		}());
//		lyAutoLogin.each(function() ////자동 로그인
//		{
//			var autoLogin = $(this);
//			login.children('input:checkbox,button').on('click',function()
//			{
//				commonJs.popShow(autoLogin);
//			});
//		});
		doc.find('section.layerPop').not('.dateSelect').each(function()
		{
			var target = $(this);
			var show = $('.layerOpen,[onclick*=popShow]')
			var popCon = target.find('div.popCon');
			var popTit = target.find('.popTit');
			var layerPoph = target.height();
			var lyCon = target.find('.lyCon');
			resize.on('resize',resizeH)
			function resizeH()
			{
				layerPoph = target.height();
				if(target.css('display') == 'block')
				{
					if(target.hasClass('fullType'))
					{
						var _thisPopTit = popTit.innerHeight();
						popCon.height(wHeight-_thisPopTit);
					}
					else
					{
						target.css({ top:(wHeight/2)-(layerPoph/2) });
					}
				}
			}
			/**20180521 수정**/
			resizeH();
			show.on('click',function()
			{
				resizeH();
			});
			/**20180521 수정**/
		});
		doc.find('section.dateSelect').each(function()
		{
			var target = $(this);
			var popCon = target.find('div.popCon');
			var popTit = target.find('.popTit');
			var show = $('.calendarWrap');
			resize.on('resize',resizeH)
			resizeH();
			function resizeH()
			{
				if(target.css('display') == 'block')
				{
					var _thisPopTit = popTit.innerHeight();
					popCon.height(wHeight-_thisPopTit);
				}
			}
			show.on('click',function()
			{
				var _thisPopTit = popTit.innerHeight();
				popCon.height(wHeight-_thisPopTit);
			});
		});
	}
//	function reservation() ////하단 고정 버튼
//	{
//		$('div.fixedBtn').each(function()
//		{
//			var foot 	= $('footer');
//			var _this 	= $(this);
//			var contain = $('.container');
//			var h 		= contain.height();
//			var fh 		= _this.height();
//			var btnTop = $('.btnTop');
//			btnTop.addClass('type2');
//			$('.tabType1').find('li').on('click',function()
//			{
//				setTimeout(function()
//				{
//					if( $('.fixedBtn').offset().top>=foot.offset().top )
//					{
//						_this.css('position','relative');
//						btnTop.removeClass('type2');
//					}
//					else
//					{
//						_this.css('position','fixed');
//						btnTop.addClass('type2');
//					}
//				}, 15);
//			})
//			doc.on('scroll',function()
//			{
//				if( ($('body').scrollTop()+win.outerHeight())>=foot.offset().top + fh)
//				{
//					_this.css('position','relative');
//					btnTop.removeClass('type2');
//				}
//				else if(($('body').scrollTop()+win.outerHeight())<=foot.offset().top)
//				{
//					_this.css('position','fixed');
//					btnTop.addClass('type2');
//				}
//			}).trigger('scroll');
//		});
//	}
	function etc()
	{
		doc.find('div.tglWrap').each(function()///////////ToggleList
		{
			var _this = $(this);
//			_this.find('li.tgl button.tglBtn').on('click',function()/////////////////////////////////////////////////////*2017/08/22 수정*/
			_this.on('click','.tgl .tglBtn',function()
			{
				var _this = $(this);
				_this.parents('.tgl').toggleClass('on');
			});
		})
		$('.extendBox').children('button.btnExtend').on('click',function()///////////////ExtendBox
		{
			var _this = $(this);
			var	extendBox = _this.parent();
			if(extendBox.hasClass('on'))
			{
				_this.text('펼쳐보기');
				extendBox.removeClass('on');
			}
			else
			{
				_this.text('접어두기');
				extendBox.addClass('on');
			}
		});
	}
	function slider()
	{
		var slider = $('div.slider');
		slider.each(function()
		{
			var _this = $(this);
			var sCon = _this.find('.sCon');
			var sConLength = sCon.length;
			var _cont = _this.find('.sliderWrap');
			var slideLength = _this.find('.sliderWrap').children().length;
			var total = _cont.children().length;
			if(_this.find('.sliderNav').length)
			{
				var _this = $(this);
				_this.find('span').remove();
				for( var i = 0 ; i<slideLength ; i++ )
				{
					_this.find('.navWrap').append('<span>'+i+'');
				}
				_this.find('span').eq(0).addClass('on');
			}
			if(sConLength == 1)// 09/22 scon이 1개일때 버튼 막기
			{
				_this.find('.btnPrev').addClass('none');
				_this.find('.btnNext').addClass('none');
			}
			else
			{
				_this.find('.btnPrev').addClass('none');
			}
			var _thisSpan = _this.find('span');
			var sConWidth = sCon.width();
			var sConPadding = sConWidth - sCon.innerWidth();
			var wW = win.width();
			var _thisMargin = 0;

			_this.css({'width':wW})
			sCon.css({'width':sConWidth,float:'left'})
			_cont.css({'width':((sConWidth*slideLength)+100)+'px'});

			resize.on('resize',resizeH);
			resizeH();
			function resizeH()  	/////////////////화면 전환시
			{
				if(_this.hasClass('linkSlider'))
				{
					var _thiswW = win.width();
					_this.css({left:(_thiswW/2)-(wW/2)})
				}
				else
				{
					var _thiswW = win.width();
					var _thissCon = _thiswW + sConPadding;
					if(wW < _thiswW)
					{
						_thisMargin = -parseInt(_cont.css('marginLeft')) / wW;
					}
					else
					{
						_thisMargin = -parseInt(_cont.css('marginLeft')) / (_this.find('.sCon').width()-sConPadding);
					}

					//2018.04.28 수정 start
					if( !_this.hasClass('noReisze') ){
						_this.css({'width':_thiswW})
						sCon.css({'width':_thissCon,float:'left'})
						_cont.css({'margin-left':-_thiswW*_thisMargin+'px','width':((_thiswW*slideLength)+100)+'px'});
					}else{
						_this.css({'width':''});
						sCon.css({'width':_this.parent().width(),float:'left'})
					}
					//2018.04.28 수정 end

					sConWidth = _thiswW;
				}
			}
			var slide = new Jessture({
				target:_this,
				content:_cont
			});
			resize.on('resize',function()
			{
				slide.resize();

			});
			slide.on(slide.RIGHT,move );
			slide.on(slide.LEFT,move );
			_this.find('button.btnPrev').on('click',function()
			{
				slide.next();
			});
			_this.find('button.btnNext').on('click',function()
			{
				slide.prev();
			});

			function move(evt)
			{
				var p = (-sConWidth*slide.cnt);
				var _thisNav = _this.find('div.navWrap>a');
				_thisNav.removeClass('on');
				_thisNav.eq(slide.cnt).addClass('on')
				if(sConLength > 1)// 09/22 scon이 1개일때 버튼 막기
				{
					if(evt.type=='jsLeft')
					{
						_this.find('.btnPrev').removeClass('none');
						if(slide.cnt == total -1)
						{
							_this.find('.btnNext').addClass('none');
						}
					}
					else
					{
						_this.find('.btnNext').removeClass('none');
						if(slide.cnt == 0)
						{
							_this.find('.btnPrev').addClass('none');
						}
					}
				}
				if(_this.find('.sliderNav').length)
				{
					_thisSpan.removeClass('on');
					_thisSpan.eq(slide.cnt).addClass('on');
				}
				//2018.04.28 수정 start
				if( !_this.hasClass('noReisze') ){
					_cont.stop().animate({'margin-left':p+'px'},ANIMATE_SPEED-300,ANIMATE_EASING);
				}else{
					_cont.stop().animate({'margin-left':-(_this.parent().width()*slide.cnt)+'px'},ANIMATE_SPEED-300,ANIMATE_EASING);
				}
				//2018.04.28 수정 end
			}
		});
	}
	function fullDown()/////////전체 메뉴
	{
		doc.find('button.btnMenu').each(function()
		{
			var startX = 0;
			var endX = 0;
			var totalMenu = $('div.totalMenu');
			totalMenu.bind('touchstart , mousedown' , function(e)
			{
				if(e.type == 'mousedown'){
					// input 필드 체크
					if( $(e.target).filter('input').length == 0)
					{
						e.preventDefault();
					}
					startX = e.pageX;
				}
				else
				{
					startX = e.originalEvent.touches[0].pageX;
				}
			});
			totalMenu.on('touchend , mouseup' , function(e)
			{
				if(e.type == 'mouseup')
				{
				//if(!e.originalEvent.touches){
					endX = Number(e.pageX);
					e.preventDefault();
				}
				else
				{
					endX = e.originalEvent.changedTouches[0].pageX;
				}
				if(startX > endX && startX-endX > 50)
				{
					wrap.removeClass('noScroll');
					totalMenu.animate({'margin-left':0+'px'},ANIMATE_SPEED,ANIMATE_EASING);
				}
			});
			var _this = $(this);
			var	totalMenu = _this.siblings('div.totalMenu');
			var	totalMenuLeft = parseInt(totalMenu.css('left'));
			var	wrap = _this.parents('div.wrap');
			doc.find('.btnMenu').each(function()
			{
				var _this = $(this);
				resize.on('resize',resizeH)
				resizeH();
				function resizeH()
				{
					if(wrap.hasClass('noScroll'))
					{
						totalMenu.height(wHeight);
						totalMenu.css('margin-left',wWidth);
					}
				}
				_this.on('click',function()
				{
					totalMenu.height(wHeight);

				})
			})
			_this.on('click',function()
			{
				wrap.addClass('noScroll');
				totalMenu.animate({'margin-left':totalMenu.width()+'px'},ANIMATE_SPEED,ANIMATE_EASING);
				totalMenu.find('button.btnClose').off().on('click',function()
				{
					commonJs.event.trigger(MENU_CLOSE);
					wrap.removeClass('noScroll');
					totalMenu.stop().animate({'margin-left':'0px'},ANIMATE_SPEED,ANIMATE_EASING,function()
					{
						commonJs.event.trigger(SWIPE_COMPLETE);
					});
				});
			});
		});
		$('.menuWrap').find('li.depth > a').on('click',function(e)
		{
			var _this = $(this).parent();
			var	aHeight = _this.children('a').innerHeight();
			var	submenuHeight = _this.children('.submenu').innerHeight();
			var	windowH = win.height();
			var	userInfo = $('.userInfo');
			var	totalMenu = $('.totalMenu');

			if(_this.hasClass('on'))
			{
				_this.stop().animate({height:aHeight},ANIMATE_SPEED,ANIMATE_EASING,function()
				{
					_this.removeClass('on');
				});
			}
			else
			{
				var old = totalMenu.scrollTop();
				var top = _this.offset().top;
				var h = _this.height();
				_this.animate({height:submenuHeight+aHeight},ANIMATE_SPEED,ANIMATE_EASING);
				totalMenu.animate({scrollTop:(old+top)+'px'},ANIMATE_SPEED,ANIMATE_EASING);
				_this.addClass('on');
			}
		});
	}
	function board()
	{
		var inpSearch = $('div.inpSearch');
		var	delKwd = $('button.delKwd');
		doc.find('div.inpSearch button.delKwd').each(function()
		{
			inpSearch.find('input').on('input',function()
			{
				var _this = $(this);
				var	_thisDelKwd = _this.siblings('button.delKwd');
				if(_this.val())
				{
					_thisDelKwd.css('display','block');
				}
				else
				{
					_thisDelKwd.css('display','none');
				}
				delKwd.off().on('click',function()
				{
					_this.val('');
					_thisDelKwd.css('display','none');
				});
			});
		});
	}
	/*2017/8/28추가 moas/html/main.html NEWS 롤링*/
	/*2017/8/29 수정*/
	function news()
	{
		doc.find('dl.mNews').each(function()
		{
			var mNews = $(this);
			var mNewsUl = mNews.find('dd>ul');
			var mNewsLi = mNewsUl.children('li');
			var liHeight = -mNewsLi.height();
				mNewsLi.first().clone().appendTo(mNewsLi.parent()); //클론 생성
				mNewsUl.css({position:'relative',overflow:'visible'});
			mNewsLi = mNewsUl.children('li');
			var lilength = mNewsLi.length-1;
			mNewsLi.eq(lilength).removeClass('on');
			setInterval(function()
			{
				var _thisOn = mNewsUl.children('li.on');
				var top = (_thisOn.index()+1) * liHeight;
				_thisOn.next('li').addClass('on').siblings('li').removeClass('on');
				mNewsUl.animate({top:top+'px'},ANIMATE_SPEED,ANIMATE_EASING,function()
				{
					if(mNewsLi.eq(lilength).hasClass('on'))
					{
						mNewsLi.eq(lilength).removeClass('on');
						mNewsLi.eq(0).addClass('on');
						mNewsUl.css({top:''})
					}
				});
			},3000);
		});

	}

	/* 2018/07/04 추가. */
	function PopupSlide(){
    var _this = this;
    var layerPop = $('#lyExpire');
		var slideCon = layerPop.find('.slideCon');
		var btnPrev = slideCon.children('button').eq(0);
		var btnNext = slideCon.children('button').eq(1);
    var navList = layerPop.find('.sliderNav>.navWrap>span');
    var slideUl = layerPop.find('.slideCon>ul:eq(0)');
    var listLength = slideUl.children('li').length;

    var btnClose = layerPop.find('.btnBox>span:eq(1)>a');
    var lydim = $('.lyDim');

    var btnTxt = ['다음' ,'닫기'];
		var defTxt = '다음';
		var slideW = parseInt(slideCon.css('width'));
    var listW = (slideW==null||slideW==0)?320:slideW;
    var cnt = 0;

		slideUl.css('width' , '2800px');

		(listLength>1)?defTxt=btnTxt[0]:defTxt = btnTxt[1];
		btnClose.text(defTxt);
		var publicFunctions=  {
			resize : _this.resize = function(){
				/*20180716 수정 start*/
				slideW = parseInt($('#lyExpire').find('.slideCon').css('width'));
				/*20180716 수정 end*/
				listW = (slideW==null||slideW==0)?320:slideW;
				slideUl.css('margin-left' , cnt*-listW+'px');
				slideUl.children('li').each(function(idx, item){
					$(item).css('width' , listW);
				})
			}
		}

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
					btnNext.addClass('none').siblings().removeClass('none');
        }else{
					if(cnt==0){
						btnPrev.addClass('none').siblings().removeClass('none');
					}else{
						btnPrev.removeClass('none');
					}
          btnClose.text(btnTxt[0]);
        }
      },
      closeOrNext : function(e){
				e.stopPropagation();
        if(btnClose.text()==btnTxt[1]){
          pFunctions.closePopup();
        }else{
          pFunctions.swipeRight();
        }
      },
      closePopup : function(){
        lydim.hide();
        layerPop.hide();
				btnPrev.addClass('none');
				btnNext.removeClass('none');
				cnt = 0;
        btnClose.text(defTxt);
        navList.eq(0).addClass('on').siblings().removeClass('on');
        slideUl.css('margin-left','0px');
      }
		}

		btnPrev.on('click' , pFunctions.swipeLeft);
		btnNext.on('click' , pFunctions.swipeRight);
    btnClose.on('click' , pFunctions.closeOrNext);

	}


	$(function()
	{
		doc = $(document);
		win = $(window);
		resize = $({});
		win.on('resize',resizeH);
		resizeH()
		function resizeH()
		{
			if(popupSlide==null){
				popupSlide = new PopupSlide();
			}
			popupSlide.resize();

			wWidth = win.width();
			wHeight = win.height();
			resize.trigger('resize');
		}
		form();
		popup();
		etc();
		slider();
		// reservation();
		fullDown();
		board();
		news();
		// commonJs.event.on('swipeComplete',function(evt,idx){
		// 	console.log('main ',idx);
		// })
	})

})(jQuery,window)
