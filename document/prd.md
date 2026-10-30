# 전체 PRD: 더랩바이블랑두 벤치마킹 이커머스 반응형 웹사이트
**(The Lab by Blanc Doux Clone & Redesign PRD)**

---

## 1. 프로젝트 개요 (Overview)

### 1.1 프로젝트명
- **더랩바이블랑두 벤치마킹 이커머스 반응형 웹사이트** *(The Lab by Blanc Doux Clone & Redesign)*

### 1.2 프로젝트 목표
- 민감성 스킨케어 브랜드 **'더랩바이블랑두'**의 브랜드 철학(*"성분 과몰입, 효능 초집착"*)을 시각적으로 구현.
- 모바일, 태블릿, 데스크톱 등 다양한 디바이스 환경에서 끊김 없이 정교하게 작동하는 **고성능 이커머스 Web Front-End Interface** 구축.
- 미니멀하고 클린한 편집 디자인적 요소와 직관적인 UX를 접목하여 높은 구매 전환율(CVR)을 유도.

### 1.3 타겟 디바이스 및 레이아웃 스펙
- **Desktop Grid:** `1440px` 이상 (최대 컨테이너 폭: `1280px`)
- **Tablet Grid:** `768px` ~ `1023px` (기준 뷰포트: `1024px`)
- **Mobile Grid:** `390px` ~ `767px` (Mobile-First responsive base)

---

## 2. 핵심 기능 요구사항 (Core Functional Requirements)

### 2.1 글로벌 내비게이션 (GNB & LNB)
1. **상단 브랜드 GNB 헤더:**
   - 브랜드 로고 (클릭 시 메인 홈 이동).
   - 카테고리 메뉴 (토너/미스트, 세럼/앰플, 로션/크림, 패드/마스크, 클렌징, 세트 등).
   - 유저 퀵 메뉴: 검색 아이콘(통합 검색 모달), 마이페이지/로그인, 장바구니(장바구니 수량 뱃지 포함), 최근 본 상품.
   - 글로벌 배송 안내 및 국가/언어 변경 인터랙션 버튼.
2. **반응형 모바일 드로어 (Drawer Menu):**
   - 모바일 환경 화면 좌측/우측에서 슬라이드인되는 햄버거 메뉴 UI.
   - 아코디언 스타일의 카테고리 분류 및 대입 메뉴 노출.

### 2.2 메인 홈 화면 (Landing Page)
1. **히어로 프로모션 배너 (Hero Carousel):**
   - 주력 라인업(예: 블루클레이, 올리고 히알루론산 등) 브랜드 스토리 중심의 풀-비주얼 스와이퍼 배너.
   - 자동 롤링, 일시정지, 좌우 인디케이터 및 커스텀 페이지네이션.
2. **탭 기반 상품 큐레이션 섹션:**
   - [추천] / [베스트] / [세트] 카테고리 탭 토글 기능.
   - 탭 클릭 시 리렌더링 없이 부드러운 Fade-in transition 적용.
3. **브랜드 미션 & 성분 스토리텔링 섹션:**
   - "성분 과몰입, 효능 초집착" 브랜드 키비주얼 카드 및 텍스트 블록 레이아웃.
4. **소셜 피드 & 고객 리뷰 갤러리:**
   - 인스타그램 스타일의 실사용 후기 카드 슬라이더 및 별점 리뷰 UI.

### 2.3 상품 목록 및 상세 페이지 (PLP & PDP)
1. **상품 목록 페이지 (PLP - Product Listing Page):**
   - 카테고리별 필터링(인기순, 신상품순, 낮은 가격순, 높은 가격순).
   - 상품 카드 UI: 상품 대표 이미지, Hover 시 2차 서브 이미지 전환, 뱃지(NEW, BEST, SALE), 상품명, 정가(취소선), 할인가, 할인율(%), Quick Add to Cart 버튼.
2. **상품 상세 페이지 (PDP - Product Detail Page):**
   - 좌측: 대형 상품 이미지 갤러리 및 썸네일 네비게이션.
   - 우측: 상품 기본 정보, 옵션 선택 dropdown, 수량 변경 UI, 총 가격 계산, 바로구매 / 장바구니 담기 고정 Sticky CTA 바.
   - 하단: 상세 성분 정보, 사용 방법, 탭 메뉴(상세정보 / 리뷰 / Q&A / 배송·환불 안내).

### 2.4 글로벌 및 부가 기능
1. **World Shipping 모달 (국가/언어/통화 선택):**
   - 글로벌 고객을 위한 언어 선택(KR / EN) 및 배송 가능 국가 체크 팝업.
2. **고객센터 & 브랜드 하단 푸터 (Footer):**
   - 사업자 등록 정보, CS Center 안내 및 운영시간, SNS 채널 링크, 이용약관/개인정보처리방침 modal 연결.

---

## 3. 상세 컴포넌트 및 페이지 구조

```
├── [GNB / Header]
│   ├── Top Promo Banner Bar
│   ├── Brand Logo
│   ├── Navigation Menu (Dropdown / Hover State)
│   └── User Utilities (Search, Cart, Auth, Global Language)
├── [Main Home Page]
│   ├── Section 01: Hero Carousel Banner
│   ├── Section 02: Product Tab Curation (Best / Recommended / Set)
│   ├── Section 03: Ingredient Storytelling Section (Brand Identity)
│   ├── Section 04: Promo Banner & Event Showcase
│   └── Section 05: Real Customer Reviews & Instagram Feed
├── [Product Component System]
│   ├── Product Card (Grid / Slider Layout)
│   ├── Discount Tag / Badge Pill
│   ├── Quick Cart Modal
│   └── Toast Notification System
└── [Footer]
    ├── Customer Service Info
    ├── Footer Navigation & Legal Notice
    └── Social & Family Site Dropdown
```

---

## 4. 비기능적 요구사항 (Non-Functional Requirements)

### 4.1 성능 (Performance)
- **Fast First Contentful Paint (FCP):** 이미지 최적화(WebP/AVIF 포맷 추천) 및 Lazy Loading 적용으로 초기 로딩 속도 최적화.
- **Smooth Animation:** CSS Transition 및 Transform 기반 애니메이션으로 60fps 유지.

### 4.2 접근성 및 UX (Accessibility & UI)
- **Semantic Markup:** HTML5 태그 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) 명확히 구분 사용.
- **Color Contrast:** 가독성을 위해 배경색 대비 텍스트 명암비 minimum 4.5:1 준수.
- **Focus State:** 키보드 네비게이션(Tab키) 지원 및 focus ring 스타일 가시성 확보.

### 4.3 반응형 스펙 & 레이아웃 브레이크포인트
- **Mobile First Approach:** 기본 스타일을 모바일 기준으로 작성 후, Media Query (`@media (min-width: ... )`)로 확장.
  - `Mobile`: `< 768px` (2열 상품 그리드, 햄버거 메뉴)
  - `Tablet`: `768px ~ 1023px` (3열 상품 그리드)
  - `Desktop`: `>= 1024px` (4열 상품 그리드, Full GNB Dropdown Menu)