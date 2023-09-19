// 
//#2021.05.31
//[OP002-14702] [UX/PUB] [myT] (O-2105-016-01) T월드(웹/앱) 유선 해지 신청 프로세스 변경 

//#2019.10.22
//2019.10.22 웹접근성 수정

//#2019.09.16
//2019.09.16 웹접근성 수정

//#2019.09.03
//[OP002-3723][myT] [UX/PUB] (O-1909-013-01) myT 유선 설치장소 변경 시, 설치희망일자 달력 미노출 오류 수정

//#2019.07.17
//2019.07.17 웹접근성 수정

//#2017.12.11
//[#5510] [myT] 17년 통신과금서비스 고도화 프로젝트 개발 요청 (요건추가) - 원복처리됨


//#2017.08.21
// [#5306] [myT] 설치장소 변경 신청 화면 캘린더 오류 수정 (요건추가)

//#2017.08.04
//[#5269] [공통] 8/10일 웹접근성 적용 공통파일 배포 (오류수정)


// #2017.06.09
// [웹접근성] #myT WA
/*
$(document).ready(function(){
	$.setIdAndHeadersToTables();
});
*/
/*
배포버젼 17.01.10
*/
//17.01.10 [#4730] [myT]사용량그래프가노출되지않는에러 (요건추가)

//http://code.jquery.com/jquery-1.11.3.min.js

// 2016.03.23 수정
//114 수정 hdrs 가 널인경우에 ie7에서 에러 발생 해서 if문을 걸었다.

// 2016.04.20 $.fn.calendarInit setCurrentDate 추가

// 2016.04.29
// $.fn.calendarInit setCurrentDate > setDate 변경
// $.fn.calendarInit setToday 수정

// 2016.07.11
// prevYear, nextYear 추가

// 2016.08.05
// commonJs.Jessture 이벤트 변경

// 2016.08.11
// getToday 추가

// 2016.09.30
// 선택된 날짜에 title="선택" 삽입 추가

(function ($, window)
{

//class값에 tableJs가 있는 테이블만 값세팅.(param값이 없을 시)
//적용할 table class값 변경 시 param에 class명을 넘김.
//코딩 시 th/td 구분 및 scope, colspan, rowspan 값을 정확히 세팅.
//코딩 시 th에 id값을 넣으면 그 값으로 세팅됨.
//table에 headers,id 삽입
	$.setIdAndHeadersToTables=function(param){
		var prefixId="tb"// id = prefixId-tbIdx-thIdx
		var tbIdx=0;

		var str = 'table.'+param;
		if(!param){
			str = 'table.tableJs';
		}

		$(str).each(function (){
			//--- set id --------------------------------------
			var thIdx=0;
			$(this).find("th").each(function (){
				if(!this.id||this.id=="") this.id=prefixId+"-"+tbIdx+"-"+thIdx;
				thIdx++;
			});
			//-------------------------------------------------

			//--- count row&column ----------------------------
			var rowCnt=$(this).find("tr").length;
			var colCnt=0;
			$(this).find("tr:eq(0)").children().each(function(){
				var colspan=$(this).attr("colspan");
				if(colspan) colCnt+=Number(colspan);
				else colCnt++;
			});
			//-------------------------------------------------

			//--- 초기화 table array ----------------------------
			var tableArr=new Array(rowCnt);
			for(var i=0;i<rowCnt;i++) tableArr[i]=new Array(colCnt);
			//-------------------------------------------------

			//--- set tableElement to array -------------------
			var row=0;
			$(this).find("tr").each(function(){
				var col=0;
				$(this).children().each(function(){
					var rs=$(this).attr("rowspan");
					var cs=$(this).attr("colspan");

					for(var i=col;i<colCnt;i++){
						if(!tableArr[row][i]){
							col=i;
							break;
						}
					}

					if(rs && cs){
						for(var i=0;i<Number(rs);i++) {
							for(var j=0;j<Number(cs);j++) {
								tableArr[row+i][col+j]=this;
							}
						}
						col+=(Number(cs)-1);
					}
					else if(rs){
						for(var i=0;i<Number(rs);i++) {
							tableArr[row+i][col]=this;
						}
					}else if(cs){
						for(var i=0;i<Number(cs);i++) {
							tableArr[row][col+i]=this;
						}
						col+=(Number(cs)-1);
					}else{
						tableArr[row][col]=this;
					}

					col++;
				});
				row++;
			});
			//-------------------------------------------------

			//--- set headers ---------------------------------
			var setHeaders=function(id,scp,i,j){
				var arrIndexOf=function(arr,str){//ie7 array에서 indexOf 작동안함.
					for(var i=0;i<arr.length;i++){
						if(arr[i]==str) return true;
					}
					return false;
				};
				if(scp&&scp.indexOf("row")==0){
					for(var k=j+1;k<colCnt;k++) {
						if( tableArr[i][k] ){
							if(tableArr[i][k].tagName=="TH" || tableArr[i][k].tagName=="th") {
								var childScp=$(tableArr[i][k]).attr("scope");
								if(childScp&&childScp.indexOf("row")==-1) {
									setHeaders(id+" "+tableArr[i][k].id,childScp,i,k); //재귀
								}
								continue;
							}
						}
						var hdrs=$(tableArr[i][k]).attr("headers");
						var idArr=id.split(" ");

						for(var x=0;x<idArr.length;x++)
						{
							// 수정 hdrs 가 널인경우에 ie7에서 에러 발생 해서 if문을 걸었다.
							if( hdrs )
							{
								if(hdrs && arrIndexOf(hdrs.split(" "),idArr[x])){
									continue;
								}
								if(hdrs==""|| !hdrs) {
									hdrs=idArr[x];
									$(tableArr[i][k]).attr("headers",hdrs);
								}
								else {
									hdrs+=" "+idArr[x];
									$(tableArr[i][k]).attr("headers",hdrs);
								}
							}

						}
					}
				}else if(scp&&scp.indexOf("col")==0){
					for(var k=i+1;k<rowCnt;k++) {
						if(tableArr[k][j].tagName=="TH" || tableArr[k][j].tagName=="th") {
							var childScp=$(tableArr[k][j]).attr("scope");
							if(childScp&&childScp.indexOf("col")==-1) {
								setHeaders(id+" "+tableArr[k][j].id,childScp,k,j); //재귀
							}
							continue;
						}

						var hdrs=$(tableArr[k][j]).attr("headers");
						var idArr=id.split(" ");

						for(var x=0;x<idArr.length;x++){
							//if(hdrs && hdrs.split(" ").indexOf(idArr[x])!=-1) continue;
							if(hdrs && arrIndexOf(hdrs.split(" "),idArr[x])) continue;

							if(hdrs==""|| !hdrs) {
								hdrs=idArr[x];
								$(tableArr[k][j]).attr("headers",hdrs);
							}
							else {
								hdrs+=" "+idArr[x];
								$(tableArr[k][j]).attr("headers",hdrs);
							}
						}
					}
				}
			};

			for(var i=0;i<rowCnt;i++){
				for(var j=0;j<colCnt;j++){
					if( tableArr[i][j] ){
						if(tableArr[i][j].tagName=="TH" || tableArr[i][j].tagName=="th") {
							setHeaders(tableArr[i][j].id,$(tableArr[i][j]).attr("scope"),i,j);
						}
					}
				}
			}
			//-------------------------------------------------

			tbIdx++;
		});
	};

})(cmnJquery, window);


/**
 @author		:
 @version	:
 @since		:

 $.fn.calendarInit({
		target : 지정 요소 다음에 일자가 표시되는 테이블이 생성된다
		start 	: { year : 2015 , month : 1, day : 1 },
		current : { year : 2016 , month : 1, day : 10 },
		end 	: { year : 2017 , month : 8, day : 1 } })	:	캘린더 생성 함수 option으로 시작값 현재값 마지막 값이 들어간다.
 first													:	option의 시작값 일로 이동
 end														:	option의 마지막 일로 이동
 prev													:	option의 현재의 이전달 이동
 next													:	option의 현재의 다음달 이동
 setVisible((true&false))								:	달력의 표시 여부를 설정(true,false)
 getVisible() return (true&false)						:	달력의 표시 여부를 리턴(true,false)
 **/

(function ($, window)
{
	// var str =
	// '<table summary="일,월,화,수,목,금,토 등 달력정보를 확인하실 수 있습니다.">'+
	// 	'<caption>달력 정보</caption>'+
	// 	'<colgroup>'+
	// 		'<col style="width:15%">'+
	// 		'<col style="width:14%">'+
	// 		'<col style="width:14%">'+
	// 		'<col style="width:*;">'+
	// 		'<col style="width:14%">'+
	// 		'<col style="width:14%">'+
	// 		'<col style="width:15%">'+
	// 	'</colgroup>'+
	// 	'<thead>'+
	// 		'<tr>'+
	// 			'<th scope="col">일</th>'+
	// 			'<th scope="col">월</th>'+
	// 			'<th scope="col">화</th>'+
	// 			'<th scope="col">수</th>'+
	// 			'<th scope="col">목</th>'+
	// 			'<th scope="col">금</th>'+
	// 			'<th scope="col">토</th>'+
	// 		'</tr>'+
	// 	'</thead>'+
	// 	'<tbody>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 		'<tr>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 			'<td></td>'+
	// 		'</tr>'+
	// 	'</tbody>'+
	// '</table>';

	function str(order){ //#myT WA
		var str = '<table summary="일,월,화,수,목,금,토 등 ' + order +' 달력정보를 확인하실 수 있습니다.">'+
			'<caption>'+ order +' 달력 정보</caption>'+
			'<colgroup>'+
			'<col style="width:15%">'+
			'<col style="width:14%">'+
			'<col style="width:14%">'+
			'<col style="width:*;">'+
			'<col style="width:14%">'+
			'<col style="width:14%">'+
			'<col style="width:15%">'+
			'</colgroup>'+
			'<thead>'+
			'<tr>'+
			'<th scope="col">일</th>'+
			'<th scope="col">월</th>'+
			'<th scope="col">화</th>'+
			'<th scope="col">수</th>'+
			'<th scope="col">목</th>'+
			'<th scope="col">금</th>'+
			'<th scope="col">토</th>'+
			'</tr>'+
			'</thead>'+
			'<tbody>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'<tr>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'<td></td>'+
			'</tr>'+
			'</tbody>'+
			'</table>';

		return str;
	}

	$.fn.calendarInit = function( _option )
	{
		var cal = this;
		var calendar = this.closest('.calendar');
		var calIdx = calendar.attr("data-val"); //#myT WA
		var topInfo = this.children('.calTop');
		var month = topInfo.children('P');
		var btn = this.children('.btn');
		var _std = '';
		var _etd = '';
		var defaults = {
			target		: 	null,
			year		: 	null ,
			month		: 	null,
			start 	: {  }, 		//달력 시작일
			current : {},		//달력 현재일
			end 	: {},
			selectedDay : [], // 2021.05.31
			isLimit : false // 2021.05.31
		};

		// 2021.05.31 추가 START
		if (calendar.attr("data-selected-day") !== undefined && calendar.attr("data-selected-day") !== '') {
			_option.selectedDay = calendar.attr("data-selected-day").split(',');
			_option.isLimit = true;
			_std = _option.selectedDay[0];
			_etd = _option.selectedDay[_option.selectedDay.length - 1];

			_option.start.year = parseInt(_std.substring(0, 4), 10);
			_option.start.month = parseInt(_std.substring(4, 6), 10);
			_option.start.day = parseInt(_std.substring(6, 8), 10);

			_option.end.year = parseInt(_etd.substring(0, 4), 10);
			_option.end.month = parseInt(_etd.substring(4, 6), 10);
			_option.end.day = parseInt(_etd.substring(6, 8), 10);

			calendar.find('.btn.clearfix > .today').remove();
			calendar.find('.btn.clearfix > .close').css({'width' : '100%'});
		}
		// 2021.05.31 추가 END

		var option = $.extend(defaults, _option);
		var _cy = option.current.year;		//	현재 년도
		var _cm = option.current.month;		//	현재 달
		var _cd = option.current.day;		//	현재 일
		var _ty = _cy;
		var _tm = _cm;
		var _td = _cd;

		var _sy , _sm , _sd = null;
		if( option.start ){
			_sy = option.start.year;		//	시작 년도
			_sm = option.start.month;		//	시작 달
			_sd = option.start.day;			//	시작 일
		}
		var _ey , _em , _ed = null;
		if( option.end ){
			_ey = option.end.year;			//	마지막 년도
			_em = option.end.month;			//	마지막 달
			_ed = option.end.day;			//	마지막 일
		}

		var _today = 0;
		var year 	= option.year;
		var month = option.month;
		var _target = option.target;
		//#myT WA
		if (calIdx == "cal-idx0") {
			_target.after(str('시작일'));
		} else if (calIdx == "cal-idx1") {
			_target.after(str('종료일'));
		} else {
			_target.after(str('')); // [OP002-3723][myT] [UX/PUB] (O-1909-013-01) myT 유선 설치장소 변경 시, 설치희망일자 달력 미노출 오류 수정
		}

		// if( _target ){
		// 	_target.after(str);
		// }

		//_target.after(str).trigger('create');
		//$(this).children().eq(1).after(str);
		var calView = function( y , m , day)
		{
			_cy = y;
			_cm = m;

			var tt = topInfo.children('P');
			year.html( _cy );
			month.html( _cm );


			var d1 = (y+(y-y%4)/4-(y-y%100)/100+(y-y%400)/400+m*2+(m*5-m*5%9)/9-(m<3?y%4||y%100==0&&y%400?2:3:4))%7;
			cal.find('tbody>tr').each(function()
			{
				$(this).find('td').each(function(c)
				{
					if($(this).hasClass('today')){
						_today = $(this).text();
						$(this).removeClass('today');
					}
					$(this).empty();
				});
			});

			var row = 0;
			var column = 0;
			for (var i = 0; i < 42; i++)
			{
				column++;
				if (i%7==0){
					row++;
				}
				if( column > 7){
					column = 1;
				}
				if (i < d1 || i >= d1+(m*9-m*9%8)/8%2+(m==2?y%4||y%100==0&&y%400?28:29:30)){}
				else
				{
					var d = (i+1-d1);
					cal.find('tbody>tr:eq('+(row-1)+')').each(function()
					{
						var cc = $(this).find('td:eq('+(column-1)+')');
						// 2021.05.31 변경 START
						if (option.isLimit) {
							if (option.selectedDay.indexOf(''.concat(y, _numCheck(m), _numCheck(d))) !== -1) {
								if (option.selectedDay[0] == y + _numCheck(m) + _numCheck(d)) {
									_checkToday(cc);
									cc.empty();
									cc.html('<a href="#" title="선택됨">' + d + '</a>');
								} else {
									cc.empty();
									cc.html('<a href="#" title="">' + d + '</a>');
								}
							} else {
								cc.empty();
								cc.html(d);
							}
						} else {
							// today 설정을 어떻게 하냐에 따라 달라짐?
							if (d == day) {
								_checkToday(cc);
								//tClass = false;
								//cc.addClass('today');
								cc.empty();
								cc.html('<a href="#" title="선택됨">' + d + '</a>'); // 2019.10.22 웹접근성 수정
							} else {
								cc.empty();
								cc.html('<a href="#" title="">' + d + '</a>'); // 2019.10.22 웹접근성 수정
							}
						}
						// 2021.05.31 변경 END

						var a = cc.children('a');
						a.unbind().bind( 'click' , function( e )
						{
							cal.trigger('select',
								[{
									year	:	_cy,
									month	:	_cm,
									day		:	$(this).parent().text()
								}]);
							_checkToday($(this).parent());
							e.preventDefault();
							//e.stopPropagation();
						});
					});
				}
			}
		};

		var _setDate=function( to ){
			_cy = to.year;
			_cm = to.month;
			_cd = to.day;
			calView(_cy, _cm, _cd);
		};

		var _checkToday = function( to )
		{
			if( _today ){
				$(_today).removeClass('today');
				$(_today).find('a').attr('title','');
			}
			_today = to;
			to.addClass('today');
			to.find('a').attr('title','선택됨'); // 2019.09.16 웹접근성 수정
			//to.focus();
		};

		var _setVisible = function( value )
		{
			var str = 'block';
			if( !value ){
				str = 'none';
			}
			cal.css({
				'display' : str,
				'z-index':1000
			});
		};

		var _getVisible = function()
		{
			return (cal.css('display')=='block')?true:false;
		};

		var _first = function()
		{
			if( option.start ){
				calView(_sy , _sm , _sd);
			}
		};

		var _end = function()
		{
			if( option.end ){
				calView( _ey , _em , _ed);
			}
		};

		var _prev = function()
		{
			if( Number(String(_sy)+String(_numCheck(_sm))) != Number(String(_cy)+String(_numCheck(_cm))) || !option.start )
			{
				_cm--;
				if( _cm < 1 ){
					_cm = 12;
					_cy--;
				}
				calView( _cy , _cm , 1);
			}
		};

		var _next = function()
		{
			if( Number(String(_ey)+String(_numCheck(_em))) > Number(String(_cy)+""+String(_numCheck(_cm))) || !option.end )
			{
				_cm++;
				if( _cm > 12 ){
					_cm = 1;
					_cy++;
				}
				calView( _cy , _cm , 1);
			}
		};

		var _prevYear = function()
		{
			if( option.start ){
				_cy--;
				if(_cy<_sy||_cm<_sm){
					_cy=_sy;
					_cm=_sm;
				}
				calView( _cy , _cm , 1);

			}
		};

		var _nextYear = function()
		{
			if( option.end ){
				_cy++;
				if(_cy>_ey||_cm>_em){
					_cy=_ey;
					_cm=_em;
				}
				calView( _cy , _cm , 1);
			}
		};

		function _numCheck(n)
		{
			return (String(n).length > 1)? n : '0'+n;
		};

		var _todayfunc = function( )
		{
			calView( _ty , _tm , _td);
		};

		var _setStartDay = function( option )
		{
			_sy = option.year;			//	시작 년도
			_sm = option.month;		//	시작 달
			_sd = option.day;			//	시작 일
		};

		var _setEndDay = function( option )
		{
			_ey = option.year;			//	마지막 년도
			_em = option.month;		//	마지막 달
			_ed = option.day;			//	마지막 일
		};

		var _setToday = function( option )
		{
			_ty = option.year;			//오늘 년도
			_tm = option.month;			//오늘 달
			_td = option.day;			//오늘 일
			_todayfunc();
		};

		var _setup = function( _option )
		{
			option = $.extend( option, _option );
			_setStartDay( option.start );
			_setEndDay( option.end );
			_setToday( option.current );
		};

		//var inter;
		//cal.focusin( function()
		//{
		//	if( !_getVisible())
		//	{
		//		_setVisible(true);
		//	}
		//	if(inter){
		//		clearInterval(inter);
		//	}
		//});
		//cal.focusout( function()
		//{
		//	inter = setInterval( function()
		//	{
		//		_setVisible(false);
		//		cal.trigger('FOCUSOUT');
		//		clearInterval(inter);
		//	},1);
		//});

		// 2021.05.31 변경 START
		if (option.isLimit) {
			calView( _sy , _sm , _sd);
		} else {
			calView( _cy , _cm , _cd);
		}
		// 2021.05.31 변경 END

		_setVisible(true);

		return{
			first			:	_first,
			end				:	_end,
			prev			:	_prev,
			next			:	_next,
			prevYear 		: 	_prevYear,
			nextYear 		: 	_nextYear,
			setVisible		:	_setVisible,
			getVisible		:	_getVisible,
			setStartDay 	: 	_setStartDay,
			setEndDay 		: 	_setEndDay,
			setToday 		: 	_setToday,
			setDate  		: 	_setDate,
			setup 			: 	_setup,
			today			:	_todayfunc,
			EVENTS			:	{
				SELECT		:	'select',
				FOCUSIN		: 	'FOCUSIN',
				FOCUSOUT	: 	'FOCUSOUT'
			},
			bind 			: function( event , func )
			{
				cal.bind(event , func);
			},
			getToday		: function(){
				return {
					year:_ty,
					month:_tm,
					day:_td
				};
			}
		};
	};
})
(cmnJquery, window);

// commonJs
(function ($, window)
{
	var commonJs;
	var doc = $(window.document);

	if( !window.commonJs )
	{
		window.commonJs = {};
	}
	commonJs = window.commonJs;

	// 원형 차트 /poc/myt/MY1.2.2.1.html
	commonJs.pieChart = function( target , cn , total )
	{
		var cGraph = $(target).children('.cGraph');
		var h = 0;

		if( cGraph.css('height') ){
			var h = Number(cGraph.css('height').replace('px',''));
		}

		var t = 100-((cn/total)*100);
		var n = Math.floor(-h * Math.floor(t))+h;

		if( cn == 0){
			$(target).children('.max').css('display','block');
		}
		if( cn == total ){
			n = 0;
		}
		//17.01.10 [#4730] [myT]사용량그래프가노출되지않는에러 (요건추가)
		if( n > 0 ){
			n = 0;
		}
		cGraph.css({'background-position':'0px '+n+'px'});
	};

	//콤마찍기
	function numberFormat(num)
	{
		var pattern = /(-?[0-9]+)([0-9]{3})/;
		while(pattern.test(num)) {
			num = num.replace(pattern,"$1,$2");
		}
		return num;
	}

	//콤마제거
	function unNumberFormat(num)
	{
		return (num.replace(/\,/g,""));
	}

	// 막대그래프 myt/MY1.2.5.1T.html
	var imgArr = [];
	// 패턴 경로
	imgArr[0] = '/poc/img/myt/graph_pattern_1.png';
	imgArr[1] = '/poc/img/myt/graph_pattern_2.png';
	imgArr[2] = '/poc/img/myt/graph_pattern_3.png';
	imgArr[3] = '/poc/img/myt/graph_pattern_4.png';
	imgArr[4] = '/poc/img/myt/graph_pattern_5.png';
	imgArr[5] = '/poc/img/myt/graph_pattern_6.png';
	imgArr[6] = '/poc/img/myt/graph_pattern_1.png';
	imgArr[7] = '/poc/img/myt/graph_pattern_2.png';
	imgArr[8] = '/poc/img/myt/graph_pattern_3.png';
	imgArr[9] = '/poc/img/myt/graph_pattern_4.png';
	imgArr[10] = '/poc/img/myt/graph_pattern_5.png';
	imgArr[11] = '/poc/img/myt/graph_pattern_6.png';

	commonJs.useListChart = function(  arr )
	{
		if( !document.createElement('canvas').getContext ) {
			// 캔버스 사용 가능
			return;
		}
		var limit = arguments[1];
		var textH = 30;
		if( limit ){
			textH = -135;
		}
		var obj = {};
		for( var i = 0; i<arr.length; i++)
		{
			obj['m'+i] = new Image();
			obj['m'+i].src = imgArr[i];
			obj['m'+i].onload = endF;
		}
		// 이미지로드 및 로드 완료후 실행
		var cc = 0;
		function endF(){
			cc++;
			if( cc == arr.length){
				drawStart();
			}
		}

		var target =$(document).find(".graphArea");
		var can = target[0];
		var context = can.getContext("2d");

		// 초기화
		context.clearRect(0, 0, can.width, can.height);
		function drawShape(ctx, xoff, yoff , th, tw, num)
		{
			xoff = xoff - mtx;


			yoff = yoff - mty;
			context.beginPath();
			context.fillStyle = '#333333';
			context.fill();
			context.font="bold 14px Malgun Gothic";
			context.textAlign = 'center';

			context.fillText(numberFormat( String(tw) )+"원",xoff+205, (curveMax-th)+textH , 100);
			// 데이터가 0이면 그리지 않는다.
			if( th == 0){
				//return;
			}

			// th는 차트의 높이값을 변수로 받아서 변화 시키며 기존 커브 계산값에 추가

			/*
            // 12월 버전 상용 배포 전 원복됨.
            var _mx=144;
              ctx.moveTo(118 + xoff, 501 + yoff);
              ctx.bezierCurveTo(_mx + xoff, 501 + yoff, _mx + xoff, _mx + yoff+(curveMax-th), 173 + xoff, _mx + yoff+(curveMax-th));
              ctx.bezierCurveTo(228 + xoff, _mx + yoff+(curveMax-th), 204 + xoff, 501 + yoff, 252 + xoff, 501 + yoff);
            context.fillStyle=context.createPattern( obj['m'+num] , "repeat");
            context.fill();
            */
			ctx.moveTo(118 + xoff, 501 + yoff);
			ctx.bezierCurveTo(144 + xoff, 501 + yoff, 144 + xoff, 144 + yoff+(curveMax-th), 203 + xoff, 144 + yoff+(curveMax-th));
			ctx.bezierCurveTo(258 + xoff, 144 + yoff+(curveMax-th), 264 + xoff, 501 + yoff, 282 + xoff, 501 + yoff);
			context.fillStyle=context.createPattern( obj['m'+num] , "repeat");
			context.fill();
		}
		//#원본 var mtx = 90;
		var mtx = 90;
		var mty = 94;
		// 기획쪽에서 애기하길 금액은 50만원을 넘길수 없다고 함
		var maxPoint = 500000;
		// 곡선이 그려지는 높이의 최대치가 360이다 이값을 기준으로 계산이 이루어진다.
		var curveMax = 360;

		function drawStart()
		{
			for( var i = 0; i<arr.length; i++ )
			{
				var won = arr[i];
				//var tmax = 257;
				var tmp = 0;
				if( won <= 100000){
					tmp = ((won/100000)*257);
				}else if( won <= 300000 ){
					// 차트의 눈금간 간격을 계산하기 위해서 값을 뺀다 (전체 비율이 다름)
					won -=100000;
					tmp = ((won/200000)*52)+257;
					won += 100000;
					// 차트에 표시되는 금액때문에 뺀 금액을 다시 더해준다. (전체 비율이 다름)
				}else{
					won -=300000;
					tmp = ((won/200000)*52)+307;
					won +=300000;
				}
				if( target.hasClass('type2') )
				{
					mty = 264;
					tmp = (won/limit)*207;
				}
				//#원본 drawShape(context,(i*170),0,tmp,won,i);
				// 12개월 drawShape(context,(i*90),0,tmp,won,i);
				drawShape(context,(i*170),0,tmp,won,i);
			}
		}
	};

	/*
	// common graph 추가
	$.fn.pieChart = function( cn , total)
	{
		var cGraph = $(this).children('.cGraph');
		var t = 100-((cn/total)*100);
		var n = Math.floor(-200 * Math.floor(t))+200;

		if( cn == 0){
			$(this).children('.max').css('display','block');
		}
		cGraph.css({'background-position':'0px '+n+'px'});
	};
	*/

	//----------------------
	commonJs.Jessture = function( target )
	{
		var startX = 0;
		var startY = 0;
		var _this = $(this);
		var RIGHT = this.RIGHT = 'jsRight';
		var LEFT = this.LEFT = 'jsLeft';

		target.bind('touchstart , mousedown' , function(e)
		{
			if(e.type == 'mousedown'){
				// input 필드 체크
				if( $(e.target).filter('input').length == 0){
					e.preventDefault();
				}
				startX = e.pageX;
				startY = e.pageY;
			}else{
				startX = e.originalEvent.touches[0].pageX;
				startY = e.originalEvent.touches[0].pageY;
			}
		});

		target.bind( 'touchmove , mousemove' , function(e)
		{
			var endX = 0;
			var endY = 0;

			if(e.type != 'mousemove')
			{
				endX = e.originalEvent.touches[0].pageX;
				endY = e.originalEvent.touches[0].pageY;
			}
			if( Math.abs(startX - endX)>Math.abs(startY - endY) )
			{
				e.preventDefault();
			}
		});

		target.bind('touchend , mouseup' , function(e)
		{
			var endX = 0;
			if(e.type == 'mouseup'){
				//if(!e.originalEvent.touches){
				endX = Number(e.pageX);
				e.preventDefault();
			}else{
				endX = Number(e.originalEvent.changedTouches[0].pageX);
			}

			if( Math.abs(startX - endX) > 70)
			{
				if(startX < endX)
				{
					_this.trigger( RIGHT );
				}else{
					_this.trigger( LEFT );
				}
			}
			startX = 0;
		});

		this.bind = function( evt , func)
		{
			_this.bind(evt , func );
		};
	};


})(cmnJquery, window);
