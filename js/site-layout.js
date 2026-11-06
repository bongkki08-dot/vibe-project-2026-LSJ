(function mountSiteLayout() {
  const isSubPage = window.location.pathname.includes("/pages/");
  const root = isSubPage ? "../" : "./";

  const headerMarkup = `
    <header class="site-header" data-site-header data-site-layout-generated="header">
      <div class="promotion-bar" data-promotion>
        <div class="inner-box promotion-bar__inner">
          <div class="promotion-bar__message">
            <p>카톡 플친 추가 시 3,000원 지급!</p>
            <button class="promotion-bar__close" type="button" aria-label="혜택 안내 닫기" data-promotion-close>
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="inner-box site-header__inner">
        <nav class="site-header__navigation partition" aria-label="주 메뉴">
          <div class="site-header__part site-header__part--left">
            <button class="icon-button" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="side-menu-dialog" data-side-menu-open>
              <span class="icon icon--menu" aria-hidden="true"></span>
            </button>
          </div>
          <a class="site-header__logo" href="${root}index.html" aria-label="더랩 바이 블랑두 홈">
            <img src="${root}images/used/dt_f631045ff291ac1837e3489ba8180401.png" alt="더랩 바이 블랑두">
          </a>
          <div class="site-header__part site-header__part--right">
            <a class="icon-button" href="#board-search" aria-label="검색">
              <span class="icon icon--search" aria-hidden="true"></span>
            </a>
            <span class="site-header__auth-welcome" data-auth-welcome hidden></span>
            <span class="site-header__auth-slot">
              <span class="site-header__account-area">
                <button class="icon-button site-header__account" type="button" aria-label="계정 메뉴" aria-expanded="false">
                <span class="icon icon--account" aria-hidden="true"></span>
                </button>
                <span class="site-header__account-menu">
                  <a href="${root}pages/login.html" data-auth-login>Login</a>
                  <a href="${root}pages/signup.html" data-auth-signup>Register</a>
                  <a href="${root}pages/cart.html">Order</a>
                  <a href="#recent-view">Recent View</a>
                  <a href="#wish-list">Wish List</a>
                  <button type="button" data-auth-logout hidden>Logout</button>
                </span>
              </span>
            </span>
            <a class="icon-button icon-button--bag" href="${root}pages/cart.html" aria-label="장바구니">
              <span class="icon icon--bag" aria-hidden="true"></span>
              <span class="cart-badge" hidden>0</span>
            </a>
          </div>
        </nav>
      </div>
    </header>

    <div class="side-menu-layer" data-side-menu data-site-layout-generated="side-menu" hidden>
      <button class="side-menu-backdrop" type="button" aria-label="메뉴 닫기" tabindex="-1" data-side-menu-backdrop></button>
      <aside class="side-menu" id="side-menu-dialog" role="dialog" aria-modal="true" aria-labelledby="side-menu-title" aria-hidden="true" inert data-side-menu-panel>
        <div class="side-menu__header">
          <div class="side-menu__account">
            <p class="side-menu__title" id="side-menu-title">로그인 후 이용하세요</p>
            <p class="side-menu__title" data-auth-user-name hidden></p>
            <p class="side-menu__description">회원가입 후 다양한 혜택 받아가세요</p>
            <div class="side-menu__account-actions">
              <a class="side-menu__login" href="${root}pages/login.html" data-auth-login>로그인</a>
              <a class="side-menu__signup" href="${root}pages/signup.html" data-auth-signup>회원가입</a>
              <button class="side-menu__signup" type="button" data-auth-logout hidden>로그아웃</button>
            </div>
          </div>
          <button class="side-menu__close" type="button" aria-label="메뉴 닫기" data-side-menu-close><span aria-hidden="true"></span></button>
        </div>
        <nav class="side-menu__content" aria-label="사이트 메뉴">
          <ul class="side-menu__categories">
            <li class="side-menu__category">
              <button class="side-menu__accordion" type="button" aria-expanded="true" aria-controls="side-menu-brand" data-menu-accordion><span>BRAND</span><span class="side-menu__chevron" aria-hidden="true"></span></button>
              <ul class="side-menu__subcategories" id="side-menu-brand">
                <li><a href="${root}index.html#story">STORY</a></li><li><a href="${root}index.html#mission">MISSION</a></li><li><a href="${root}index.html#product">PRODUCT</a></li><li><a href="${root}index.html#membership">MEMBERSHIP</a></li>
              </ul>
            </li>
            <li class="side-menu__category">
              <button class="side-menu__accordion" type="button" aria-expanded="true" aria-controls="side-menu-all" data-menu-accordion><span>ALL</span><span class="side-menu__chevron" aria-hidden="true"></span></button>
              <ul class="side-menu__subcategories" id="side-menu-all">
                <li><a href="${root}index.html#toner-mist">토너/미스트</a></li><li><a href="${root}index.html#serum-ampoule">세럼/앰플</a></li><li><a href="${root}index.html#lotion-cream">로션/크림</a></li><li><a href="${root}index.html#pad-mask">패드/마스크</a></li><li><a href="${root}index.html#cleansing">클렌징</a></li><li><a href="${root}index.html#makeup-suncare">메이크업/선케어</a></li><li><a href="${root}index.html#sets">세트상품</a></li>
              </ul>
            </li>
            <li class="side-menu__category"><a class="side-menu__standalone" href="${root}index.html#best">베스트</a></li>
            <li class="side-menu__category">
              <button class="side-menu__accordion" type="button" aria-expanded="true" aria-controls="side-menu-lines" data-menu-accordion><span>라인별 제품</span><span class="side-menu__chevron" aria-hidden="true"></span></button>
              <ul class="side-menu__subcategories" id="side-menu-lines">
                <li><a href="${root}index.html#oligo-hyaluronic">올리고 히알루론산 (수분)</a></li><li><a href="${root}index.html#green-flavonoid">그린 플라보노이드 (진정)</a></li><li><a href="${root}index.html#prebiotic-cera">프리바이오틱세라 (장벽)</a></li><li><a href="${root}index.html#expert-rue">엑스퍼트루 (탄력/미백)</a></li><li><a href="${root}index.html#blue-clay">블루클레이 (모공)</a></li>
              </ul>
            </li>
            <li class="side-menu__category"><a class="side-menu__standalone" href="${root}index.html#events">이벤트</a></li>
          </ul>
          <div class="side-menu__community"><h2>COMMUNITY</h2><ul><li><a href="${root}pages/notice.html">공지사항</a></li><li><a href="${root}pages/faq.html">자주 묻는 질문</a></li><li><a href="${root}pages/inquiry.html">1:1 문의</a></li></ul></div>
          <section class="side-menu__customer" aria-labelledby="side-menu-customer-title"><h2 id="side-menu-customer-title">CUSTOMER CENTER</h2><ul><li><span>주문조회</span></li><li><span>최근 본 상품</span></li><li><span>장바구니</span></li></ul></section>
        </nav>
      </aside>
    </div>`;

  const footerMarkup = `
    <footer class="site-footer" data-site-layout-generated="footer">
      <div class="inner-box site-footer__inner">
        <section class="site-footer__customer" aria-labelledby="footer-customer-title"><h2 class="site-footer__section-title" id="footer-customer-title">CUSTOMER CENTER</h2><a class="site-footer__phone" href="tel:02-544-5996">02-544-5996</a><p class="site-footer__hours"><span>MON-FRI 10:00-18:00</span><span>LUNCH 12:00-13:00</span><span>SAT,SUN,HOLIDAY OFF</span></p><p class="site-footer__bank">BANK ACCOUNT</p></section>
        <div class="site-footer__business"><nav class="site-footer__social" aria-label="SNS"><a href="https://pf.kakao.com/" target="_blank" rel="noreferrer">Kakao</a><a href="https://www.instagram.com/thelabbyblancdoux/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer">Youtube</a></nav><div class="site-footer__company"><p>상호명 : 주식회사 에런케이 대표 : 경호빈 전화 : 02-544-5996</p><p>주소 : 06123 서울 강남구 봉은사로4길 21 사업자 등록번호 : 790-81-01251</p><p>통신판매업 신고번호 : 제 2019-서울강남-04901호 [사업자정보확인] 개인정보보호책임자 : 조유진(cs@blancdoux.com)</p></div><p class="site-footer__copyright">Copyright © 더랩바이블랑두. All Rights Reserved. Hosting by Cafe24 Corp.</p><div class="site-footer__links"><span>FAMILY MALL</span><a href="${root}index.html#brand-about-title">브랜드</a><span>이용약관</span><span>개인정보처리방침</span><span>이용안내</span></div></div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML("beforeend", headerMarkup);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("header.site-header, .side-menu-layer, footer.site-footer").forEach((element) => {
      if (!element.dataset.siteLayoutGenerated) element.remove();
    });
    document.body.insertAdjacentHTML("beforeend", footerMarkup);
    document.documentElement.dataset.siteLayoutReady = "true";
  }, { once: true });
})();
