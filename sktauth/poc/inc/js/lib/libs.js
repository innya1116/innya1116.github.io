// 
//#2021.05.31
//[OP002-14702] [UX/PUB] [myT] (O-2105-016-01) T����(��/��) ���� ���� ��û ���μ��� ���� 

//#2019.10.22
//2019.10.22 �����ټ� ����

//#2019.09.16
//2019.09.16 �����ټ� ����

//#2019.09.03
//[OP002-3723][myT] [UX/PUB] (O-1909-013-01) myT ���� ��ġ��� ���� ��, ��ġ������� �޷� �̳��� ���� ����

//#2019.07.17
//2019.07.17 �����ټ� ����

//#2017.12.11
//[#5510] [myT] 17�� ��Ű��ݼ��� ��ȭ ������Ʈ ���� ��û (����߰�) - ����ó����


//#2017.08.21
// [#5306] [myT] ��ġ��� ���� ��û ȭ�� Ķ���� ���� ���� (����߰�)

//#2017.08.04
//[#5269] [����] 8/10�� �����ټ� ���� �������� ���� (��������)


// #2017.06.09
// [�����ټ�] #myT WA
/*
$(document).ready(function(){
	$.setIdAndHeadersToTables();
});
*/
/*
�������� 17.01.10
*/
//17.01.10 [#4730] [myT]��뷮�׷�������������ʴ¿��� (����߰�)

//http://code.jquery.com/jquery-1.11.3.min.js

// 2016.03.23 ����
//114 ���� hdrs �� ���ΰ�쿡 ie7���� ���� �߻� �ؼ� if���� �ɾ���.

// 2016.04.20 $.fn.calendarInit setCurrentDate �߰�

// 2016.04.29
// $.fn.calendarInit setCurrentDate > setDate ����
// $.fn.calendarInit setToday ����

// 2016.07.11
// prevYear, nextYear �߰�

// 2016.08.05
// commonJs.Jessture �̺�Ʈ ����

// 2016.08.11
// getToday �߰�

// 2016.09.30
// ���õ� ��¥�� title="����" ���� �߰�

(function ($, window)
{

//class���� tableJs�� �ִ� ���̺� ������.(param���� ���� ��)
//������ table class�� ���� �� param�� class���� �ѱ�.
//�ڵ� �� th/td ���� �� scope, colspan, rowspan ���� ��Ȯ�� ����.
//�ڵ� �� th�� id���� ������ �� ������ ���õ�.
//table�� headers,id ����
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

			//--- �ʱ�ȭ table array ----------------------------
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
				var arrIndexOf=function(arr,str){//ie7 array���� indexOf �۵�����.
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
									setHeaders(id+" "+tableArr[i][k].id,childScp,i,k); //���
								}
								continue;
							}
						}
						var hdrs=$(tableArr[i][k]).attr("headers");
						var idArr=id.split(" ");

						for(var x=0;x<idArr.length;x++)
						{
							// ���� hdrs �� ���ΰ�쿡 ie7���� ���� �߻� �ؼ� if���� �ɾ���.
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
								setHeaders(id+" "+tableArr[k][j].id,childScp,k,j); //���
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
		target : ���� ��� ������ ���ڰ� ǥ�õǴ� ���̺��� �����ȴ�
		start 	: { year : 2015 , month : 1, day : 1 },
		current : { year : 2016 , month : 1, day : 10 },
		end 	: { year : 2017 , month : 8, day : 1 } })	:	Ķ���� ���� �Լ� option���� ���۰� ���簪 ������ ���� ����.
 first													:	option�� ���۰� �Ϸ� �̵�
 end														:	option�� ������ �Ϸ� �̵�
 prev													:	option�� ������ ������ �̵�
 next													:	option�� ������ ������ �̵�
 setVisible((true&false))								:	�޷��� ǥ�� ���θ� ����(true,false)
 getVisible() return (true&false)						:	�޷��� ǥ�� ���θ� ����(true,false)
 **/

(function ($, window)
{
	// var str =
	// '<table summary="��,��,ȭ,��,��,��,�� �� �޷������� Ȯ���Ͻ� �� �ֽ��ϴ�.">'+
	// 	'<caption>�޷� ����</caption>'+
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
	// 			'<th scope="col">��</th>'+
	// 			'<th scope="col">��</th>'+
	// 			'<th scope="col">ȭ</th>'+
	// 			'<th scope="col">��</th>'+
	// 			'<th scope="col">��</th>'+
	// 			'<th scope="col">��</th>'+
	// 			'<th scope="col">��</th>'+
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
		var str = '<table summary="��,��,ȭ,��,��,��,�� �� ' + order +' �޷������� Ȯ���Ͻ� �� �ֽ��ϴ�.">'+
			'<caption>'+ order +' �޷� ����</caption>'+
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
			'<th scope="col">��</th>'+
			'<th scope="col">��</th>'+
			'<th scope="col">ȭ</th>'+
			'<th scope="col">��</th>'+
			'<th scope="col">��</th>'+
			'<th scope="col">��</th>'+
			'<th scope="col">��</th>'+
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
			start 	: {  }, 		//�޷� ������
			current : {},		//�޷� ������
			end 	: {},
			selectedDay : [], // 2021.05.31
			isLimit : false // 2021.05.31
		};

		// 2021.05.31 �߰� START
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
		// 2021.05.31 �߰� END

		var option = $.extend(defaults, _option);
		var _cy = option.current.year;		//	���� �⵵
		var _cm = option.current.month;		//	���� ��
		var _cd = option.current.day;		//	���� ��
		var _ty = _cy;
		var _tm = _cm;
		var _td = _cd;

		var _sy , _sm , _sd = null;
		if( option.start ){
			_sy = option.start.year;		//	���� �⵵
			_sm = option.start.month;		//	���� ��
			_sd = option.start.day;			//	���� ��
		}
		var _ey , _em , _ed = null;
		if( option.end ){
			_ey = option.end.year;			//	������ �⵵
			_em = option.end.month;			//	������ ��
			_ed = option.end.day;			//	������ ��
		}

		var _today = 0;
		var year 	= option.year;
		var month = option.month;
		var _target = option.target;
		//#myT WA
		if (calIdx == "cal-idx0") {
			_target.after(str('������'));
		} else if (calIdx == "cal-idx1") {
			_target.after(str('������'));
		} else {
			_target.after(str('')); // [OP002-3723][myT] [UX/PUB] (O-1909-013-01) myT ���� ��ġ��� ���� ��, ��ġ������� �޷� �̳��� ���� ����
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
						// 2021.05.31 ���� START
						if (option.isLimit) {
							if (option.selectedDay.indexOf(''.concat(y, _numCheck(m), _numCheck(d))) !== -1) {
								if (option.selectedDay[0] == y + _numCheck(m) + _numCheck(d)) {
									_checkToday(cc);
									cc.empty();
									cc.html('<a href="#" title="���õ�">' + d + '</a>');
								} else {
									cc.empty();
									cc.html('<a href="#" title="">' + d + '</a>');
								}
							} else {
								cc.empty();
								cc.html(d);
							}
						} else {
							// today ������ ��� �ϳĿ� ���� �޶���?
							if (d == day) {
								_checkToday(cc);
								//tClass = false;
								//cc.addClass('today');
								cc.empty();
								cc.html('<a href="#" title="���õ�">' + d + '</a>'); // 2019.10.22 �����ټ� ����
							} else {
								cc.empty();
								cc.html('<a href="#" title="">' + d + '</a>'); // 2019.10.22 �����ټ� ����
							}
						}
						// 2021.05.31 ���� END

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
			to.find('a').attr('title','���õ�'); // 2019.09.16 �����ټ� ����
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
			_sy = option.year;			//	���� �⵵
			_sm = option.month;		//	���� ��
			_sd = option.day;			//	���� ��
		};

		var _setEndDay = function( option )
		{
			_ey = option.year;			//	������ �⵵
			_em = option.month;		//	������ ��
			_ed = option.day;			//	������ ��
		};

		var _setToday = function( option )
		{
			_ty = option.year;			//���� �⵵
			_tm = option.month;			//���� ��
			_td = option.day;			//���� ��
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

		// 2021.05.31 ���� START
		if (option.isLimit) {
			calView( _sy , _sm , _sd);
		} else {
			calView( _cy , _cm , _cd);
		}
		// 2021.05.31 ���� END

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

	// ���� ��Ʈ /poc/myt/MY1.2.2.1.html
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
		//17.01.10 [#4730] [myT]��뷮�׷�������������ʴ¿��� (����߰�)
		if( n > 0 ){
			n = 0;
		}
		cGraph.css({'background-position':'0px '+n+'px'});
	};

	//�޸����
	function numberFormat(num)
	{
		var pattern = /(-?[0-9]+)([0-9]{3})/;
		while(pattern.test(num)) {
			num = num.replace(pattern,"$1,$2");
		}
		return num;
	}

	//�޸�����
	function unNumberFormat(num)
	{
		return (num.replace(/\,/g,""));
	}

	// ����׷��� myt/MY1.2.5.1T.html
	var imgArr = [];
	// ���� ���
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
			// ĵ���� ��� ����
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
		// �̹����ε� �� �ε� �Ϸ��� ����
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

		// �ʱ�ȭ
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

			context.fillText(numberFormat( String(tw) )+"��",xoff+205, (curveMax-th)+textH , 100);
			// �����Ͱ� 0�̸� �׸��� �ʴ´�.
			if( th == 0){
				//return;
			}

			// th�� ��Ʈ�� ���̰��� ������ �޾Ƽ� ��ȭ ��Ű�� ���� Ŀ�� ��갪�� �߰�

			/*
            // 12�� ���� ��� ���� �� ������.
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
		//#���� var mtx = 90;
		var mtx = 90;
		var mty = 94;
		// ��ȹ�ʿ��� �ֱ��ϱ� �ݾ��� 50������ �ѱ�� ���ٰ� ��
		var maxPoint = 500000;
		// ��� �׷����� ������ �ִ�ġ�� 360�̴� �̰��� �������� ����� �̷������.
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
					// ��Ʈ�� ���ݰ� ������ ����ϱ� ���ؼ� ���� ���� (��ü ������ �ٸ�)
					won -=100000;
					tmp = ((won/200000)*52)+257;
					won += 100000;
					// ��Ʈ�� ǥ�õǴ� �ݾ׶����� �� �ݾ��� �ٽ� �����ش�. (��ü ������ �ٸ�)
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
				//#���� drawShape(context,(i*170),0,tmp,won,i);
				// 12���� drawShape(context,(i*90),0,tmp,won,i);
				drawShape(context,(i*170),0,tmp,won,i);
			}
		}
	};

	/*
	// common graph �߰�
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
				// input �ʵ� üũ
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
