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

  topPadding();
  window.addEventListener('resize', topPadding);

  // 2depth 활성화 링크를 1depth 메뉴 링크 값으로 변경
  if(document.querySelector('.nav-depth2')) {
    const fileName = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("/") + 30).replace('.html','').replace('-en', '');

    if(fileName) {
      const koGuideLink = document.querySelector('.nav-depth1 > a:first-child');
      const enGuideLink = document.querySelector('.nav-depth1 > a:nth-child(2)');
      koGuideLink.setAttribute('href', './' + fileName + '.html');
      enGuideLink.setAttribute('href', './' + fileName + '-en.html');
    }
  }
};