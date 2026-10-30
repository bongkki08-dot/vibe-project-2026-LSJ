# Frontend PRD: The Lab by Blanc Doux E-Commerce UI

## 1. Tech Stack & Architecture
- **Core:** HTML5, CSS3 (Tailwind CSS / SCSS), Vanilla JavaScript (ES6+) 또는 컴포넌트 기반 구조
- **Layout System:** CSS Grid & Flexbox, Mobile-first Media Queries
- **Breakpoints:**
  - Mobile: `max-width: 767px` (Base: 390px)
  - Tablet: `768px ~ 1023px` (Base: 1024px)
  - Desktop: `1024px 이상` (Base: 1440px)

## 2. Component Specifications
### [C-01] Header / GNB
- **상태:** Sticky Header (스크롤 시 상단 고정, 그림자 효과 추가)
- **인터랙션:** 모바일 환경에서 햄버거 메뉴 클릭 시 슬라이드인(Slide-in) 내비게이션 드로어(Drawer) 활성화.

### [C-02] Hero Banner Carousel
- **기능:** 자동 롤링 및 좌우 인디케이터 터치/클릭 슬라이드.
- **성능:** 이미지 Lazy Loading 적용 및 부드러운 CSS Transition 구현.

### [C-03] Product Grid & Card
- **구성:** 이미지, 상품명, 소비자가(취소선), 할인가(포인트 컬러 적용), 할인율 뱃지, 장바구니 아이콘 버튼.
- **반응형:** Desktop 4열, Tablet 2~3열, Mobile 2열 그리드 배치 (`gap: 16px ~ 24px`).

## 3. Design Tokens & Styling Rules
- **Primary Color:** Clean White (`#FFFFFF`), Deep Minimal Navy/Black (`#111111`) for typography, Brand Accent Blue (`#2B6CB0` / 신뢰감 주는 수분 블루 톤).
- **Typography:** Pretendard / Sans-serif 계열, 깔끔하고 정돈된 자간과 행간 유지.
- **UI 감성:** 여백을 살린 미니멀하고 정제된 편집 디자인 스타일 (과한 장식 배제, 정렬과 그리드 완성도 집중).