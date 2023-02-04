/**
 팝업
 commonJs.popShow($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 show			   ex) commonJs.popShow($('#lyAutoLogin'));
 commonJs.popClose($(셀렉터 표현식)) 	 셀렉터 표현식의 팝업창을 hide			   ex) commonJs.popClose($('#lyDateSelect'));
**/
/**
 캘린더
	//	commonJs.calendarDateSelect(셀렉터 표현식,날짜배열[시작일,종료일])	
	//	셀렉터 표현식 대상의 시작일과 종료일 날자를 바꾼다. 시작일input과 종료일input 둘다에 적용해 주어야 한다.
	//	ex) commonJs.calendarDateSelect($('.btnCalendar:eq(0)'),['2017-08-15','2017-08-30']);
	//	ex) commonJs.calendarDateSelect($('.btnCalendar:eq(1)'),['2017-08-15','2017-08-30']);

	//	commonJs.allDateDisabled(셀렉터 표현식) 		 
	//	셀렉터 표현식 대상의 모든 날짜를 Disabled 시킨다. 시작일input과 종료일input 둘다에 적용해 주어야 한다.
	//	ex) commonJs.allDateDisabled($('.btnCalendar:eq(0)'));
	//	ex) commonJs.allDateDisabled($('.btnCalendar:eq(1)'));

	//	commonJs.allDateEnabled(셀렉터 표현식) 		 
	//	셀렉터 표현식 대상의 모든 날짜를 Enabled 시킨다. 시작일input과 종료일input 둘다에 적용해 주어야 한다.
	//	ex) commonJs.allDateEnabled($('.btnCalendar:eq(0)'));
	//	ex) commonJs.allDateEnabled($('.btnCalendar:eq(1)'));
**/
(function($,document){
	
	this.commonJs = {};

	// 컨텐츠 영역 최소높이값
	var snbH = $('.snb').height();
	$('.contents').css('min-height',snbH);
	
	var doc;
	var win;

	commonJs.popShow = function(target){
		
		$('.lyDim').show();
		target.show();

		winH = $(window).height();
		popH = target.height();
		if(winH>=popH+60){
			target.css({
				top:(winH/2)-(popH/2)
			});
			target.removeClass('pAbs');
		}else{
			target.css({top:30+'px'});
			target.addClass('pAbs');
		}

		$(window).resize(function(){
			winH = $(window).height();
			popH = target.height();
			if(winH>=popH+60){
				target.css({
					top:(winH/2)-(popH/2)
				});
				target.removeClass('pAbs');
			}else{
				target.css({top:30+'px'});
				target.addClass('pAbs');
			}
		})

		$('.lyClose')	.click(function(e){
			$('.lyDim').hide();
			target.hide();

			e.preventDefault();
		})
	}
	commonJs.popClose = function(target){
		$('.lyDim').hide();
		target.hide();
	}
	commonJs.calendarDateSelect = function(terget,dateArr)
	{	
		var _thisInput = terget.prev('input');
		_thisInput.data('selectMinDate',dateArr[0]);
		_thisInput.data('selectMaxDate',dateArr[1]);
	}
	commonJs.allDateDisabled = function(terget)
	{
		var _thisInput = terget.prev('input');
		_thisInput.data('selectMaxDate','null');
		_thisInput.data('selectMinDate','null');
	}
	commonJs.allDateEnabled = function(terget)
	{
		var _thisInput = terget.prev('input');
		_thisInput.data('selectMaxDate','');
		_thisInput.data('selectMinDate','');
	}
	function calendar()
	{
		var toDay = $.datepicker.formatDate('yy-mm-dd', new Date());
		$('.btnCalendar').each(function()
		{
			var _this = $(this);
			var _thisInput = _this.prev('input');
			_thisInput.val(toDay);
			_this.on('click',function()
			{
	//			var minDate = _thisInput.data('minDate') || _thisInput.data('selectMinDate');
	//			var maxDate = _thisInput.data('maxDate') || _thisInput.data('selectMaxDate');
				var minDate = _thisInput.data('selectMinDate') || _thisInput.data('minDate');
				var maxDate = _thisInput.data('selectMaxDate') || _thisInput.data('maxDate');
				if(_thisInput.hasClass('hasDatepicker'))
				{
					setTimeout(function(){ _thisInput.datepicker( "destroy" ); },120);	
				}
				else
				{
					_thisInput.datepicker(
					{
						dateFormat:'yy-mm-dd',                                                                    	 // 날짜 format 설정
						monthNamesShort :['01','02','03','04','05','06','07','08','09','10','11','12'],           	 // 월 이름 설정 ( changeMonth가 true일 때 )
						monthNames:['01','02','03','04','05','06','07','08','09','10','11','12'],                 	 // 월 이름 설정 ( changeMonth가 false일 때 )
						showMonthAfterYear:true,                                                                   	// 월과 년의 위치를 변경한다.
						minDate: minDate,                                                                             // 최소 date 값 설정
						maxDate: maxDate, // 최대 date 값 설정
						onSelect: function(date)
						{
							var _this = $(this);
							if(_this.nextAll('input').length)
							{
								if(_thisInput.data('selectMinDate'))
								{
									_this.nextAll('input').data('selectMinDate',date);	
								}
								else
								{
									_this.nextAll('input').data('minDate',date);	
								}
							}
							else if(_this.prevAll('input').length)
							{
								if(_thisInput.data('selectMaxDate'))
								{
									_this.prevAll('input').data('selectMaxDate',date);	
								}
								else
								{
									_this.prevAll('input').data('maxDate',date);	
								}
							}
						},
						onClose: function()
						{
							setTimeout(function(){ _thisInput.datepicker( "destroy" ); },220);	
						}
					});
					_thisInput.datepicker("show");
				}
			});
		});
	}
	$(function()
	{
		calendar();
	});
	
})(jQuery,document)