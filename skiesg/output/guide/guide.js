"use strict";

// ie foreach 사용 오류
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

window.onload = function () {
  // header 높이값을 구해서 페이지 여백 조절
  var guideContArea = document.querySelector('.guide-content');

  function topPadding() {
    var headerHeight = document.querySelector('.guide-header').clientHeight;
    guideContArea.style.paddingTop = headerHeight + 'px';
  }

  // .guide-tit2 갯수 및 명칭으로 .nav-depth2 생성
  var guideSections = document.querySelectorAll('.guide-section');
  var anchorTarget = document.querySelectorAll('.guide-section > .guide-tit2');
  var anchorNavList = document.querySelector('.nav-depth2');

  for (var i = 0; i < anchorTarget.length; i++) {
    guideSections[i].id = 'anchor-' + i;
    var anchorA = document.createElement('a');
    var anchorText = document.createTextNode(anchorTarget[i].innerText);
    anchorA.href = 'javascript:;';
    anchorA.classList.add('anchor-' + i);
    anchorA.appendChild(anchorText);
    anchorNavList.appendChild(anchorA);


    // nav 생성 후 첫번째 항목에 on 클래스 추가
    if (i == 0) {
      anchorA.classList.add('on');
    }
  }

  topPadding();
  window.addEventListener('resize', topPadding);

  // nav 메뉴 클릭 시 해당 영역으로 이동
  var anchorList = anchorNavList.querySelectorAll('a');
  anchorList.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      var moveTop = guideSections[idx].offsetTop - 219;
      window.scrollTo(0, moveTop);
    });
  });

  // scroll 시 영역에 맞는 nav 메뉴 활성화
  window.onscroll = function () {
    var current = "";
    guideSections.forEach(function (section) {
      var sectionTop = section.offsetTop;

      if (window.pageYOffset >= sectionTop - 220) {
        current = section.getAttribute("id");
      }
    });

    anchorList.forEach(function (item) {
      var hasClass = item.classList.contains(current);

      if (!hasClass) {
        item.classList.remove('on');
      } else {
        item.classList.add('on');
      }
    });
  };
};