# AGENTS.md — 사이트 특화 규칙 (타겟: https://blancdoux.com/ · 더랩 바이 블랑두)

> 이 문서는 AGENTS.md의 **일반 규칙 위에 덮어쓰는 사이트 전용 섹션**이다.
> 일반 규칙과 충돌하면 이 문서가 우선한다. 디자인(박스 크기·글자·색상)은 타겟 사이트와 동일하게, 내부 레이아웃은 아래 레이아웃 규칙으로 새로 구성한다.
> 표기: `[확정]` = 제공된 HTML/CSS에서 직접 확인 / `[실측]` = 저장된 페이지의 계산값(viewport 1905px 기준)에서 역산 / `[미확인]` = 제공 파일에 없음, 임의 값 금지.

---

## 1. 레이아웃 규칙 (타겟 사이트와 다르게 적용하는 부분)

### 1-1. 박스 구조: 겉박스 > 속박스 > 파티션 박스
- 단순화된 3단 구조만 사용한다. 사이트 원본의 `xx-wrap > xx-container > xx-content` 3중 래퍼는 쓰지 않는다.

| 단계 | 역할 | 클래스/태그 |
|---|---|---|
| 겉박스 | 페이지 전체 뼈대 | `header`, `main > section`, `footer` |
| 속박스 | 폭 제한 + 중앙정렬 | `.inner-box` |
| 파티션 박스 | 가로/세로 영역 분할 | flex 박스 (이름은 의미 기반, 예: `.part-left`) |

### 1-2. 겉박스 전체 구조
```html
<header>...</header>
<main>
  <section>...</section>
  <section>...</section>
</main>
<footer>...</footer>
```
- `header`, `main`, `footer`는 페이지당 1개. `main` 안에는 `section`만 둔다.
- 각 `section` 안에 `.inner-box` 1개 → 그 안에 파티션 박스.

### 1-3. 속박스(.inner-box)
- 이름은 반드시 `.inner-box`로 일원화한다. (`.container`, `.wrap`, `.width1600` 등 금지)
- `max-width` 적용 + 중앙정렬 (`margin-inline: auto`), `box-sizing: border-box`.
- max-width는 사이트 값을 따르되, 사이트에 값이 없으면 `1920px`.
- 섹션 종류별 max-width 값은 아래 2-1 표를 따른다.

### 1-4. 파티션 박스
- 기본은 `display: flex`.
- 내용이 줄바꿈되어야 하면 `flex-wrap: wrap`을 적용한다.
- 파티션 박스를 Grid로 만들지 않는다. 필요하면 파티션 **안쪽의 내용박스**에만 `display: grid`를 쓴다.
  - 예) 상품 4열 목록: 파티션(flex) > 내용박스 `ul.prd-list` (grid 4열)

```css
.inner-box{ width:100%; max-width:1920px; margin-inline:auto; box-sizing:border-box; }
.partition{ display:flex; flex-wrap:wrap; }   /* 줄바꿈 필요 시에만 wrap */
```

### 1-5. 원본 구조 → 새 구조 매핑 (참고)
| 원본 영역 | 원본 클래스 | 새 구조 |
|---|---|---|
| 헤더 | `header.header05 > .h-wrap > .h-container > .h-content > .h-t(.h-l / .h-c / .h-r)` | `header > .inner-box > 파티션 3개` (좌: 메뉴버튼 / 중: 로고 / 우: 검색·계정·장바구니) |
| 상단 띠배너 | `.top-banner-*` (세로 swiper, 닫기 버튼) | `header` 맨 위 `section` 성격의 띠 (선택) |
| 메인 섹션들 | `section.section_margin_top > .xx-wrap > .xx-container > .xx-content` | `main > section > .inner-box` |
| 푸터 | `footer > .f-wrap > .f-container > .f-content > .f-t(.f-l / .f-r) / .f-b` | `footer > .inner-box > 파티션 2개` (좌: 고객센터·계좌 / 우: SNS·회사정보·카피라이트·링크) |

---

## 2. 박스 규칙 (사이트 수치)

### 2-1. 폭 / 패딩 / 마진 / 간격
| 항목 | 값 | 근거 |
|---|---|---|
| 콘텐츠 최대폭 (메인 섹션 대부분) | `max-width: 1600px` | `[확정]` 클래스 `.width1600` 사용 (13곳) |
| 아이콘 배너 섹션 | 클래스명은 `.width1400` | `[확정]` 클래스 존재, `[미확인]` 실제 CSS 값 |
| 좌우 패딩 | `padding-inline: 48px` | `[실측]` 3분할 슬라이드(493.333px×3 + 간격 12px×2)가 합 **1504px** → 1600 − 1504 = 96 → 좌우 48px씩 |
| 콘텐츠 실제 내부폭 | **1504px** (1600px 컨테이너 기준) | `[실측]` |
| 섹션 간 세로 간격 | 클래스 `.section_margin_top` 사용 | `[확정]` 클래스 존재, `[미확인]` 값 → 임시 `margin-top: 80px`, **검증 필요** |
| 헤더 | `[미확인]` 높이 / 패딩 | 사이트 CSS 미제공. 헤더 좌우 패딩은 `.padding-lr`와 동일 규칙으로 맞춘다 |
| 푸터 | `[미확인]` | 같음 |

> 아이콘 배너(`.width1400`) 주의: 실측 슬라이드 폭 288.167px, 간격 16px을 5개씩 보여주면 합이 1504.8px로 1600 컨테이너와 같다. 즉 `.width1400`의 실제 max-width가 1400이 아닐 수 있다. 원본 CSS 확인 전에는 **1600과 동일하게 처리**한다.

### 2-2. 슬라이더/카드 간격
| 요소 | 규격 | 근거 |
|---|---|---|
| 메인 히어로 슬라이드 | 가로 100% (실측 1905px), 높이 913px (viewport 높이 948px 기준) | `[실측]` 5장 반복, 자동 슬라이드, 하단 pagination + 좌우 화살표 |
| 아이콘 배너 슬라이드 | 1장 288.167px, 간격 16px, 5개 표시 | `[실측]` 총 7장 |
| 상품 배너 슬라이드 | 1장 493.333px, 간격 12px, 3개 표시 | `[실측]` 총 3장 |
| 상품 목록 | 4열 (`.prdList.grid4`) | `[확정]` 탭당 4개 노출 + "More View" 버튼 |

### 2-3. 상품 카드 구조
```html
<li>
  <div class="prd-box">
    <div class="thumbnail">
      <div class="prdImg">  <!-- 이미지 2장(기본/호버용) + .promotion 뱃지 -->
    </div>
    <div class="description">
      <div class="name">상품명</div>
      <ul> 소비자가(취소선) / 판매가 + .sale_box(할인율%) </ul>
    </div>
  </div>
</li>
```
- 상품 링크 이미지 hover: `opacity: .5` `[확정]`
- 이미지 2장 중 2번째는 호버 시 노출되는 구성(썸네일 2장) `[확정 구조]`, 전환 효과 값 `[미확인]`

### 2-4. 인터랙션 수치
- 햄버거 → X 아이콘 애니메이션: `transition: 600ms cubic-bezier(0.4, 0, 0.2, 1)` `[확정]`
- 로딩 오버레이: `position: fixed; inset 50%; 배경 #fff; z-index: 1000000` `[확정]`

---

## 3. 글자 규칙

### 3-1. 확정된 값 (상품 영역 인라인 스타일)
| 용도 | font-size | weight | 색상 | 비고 |
|---|---|---|---|---|
| 상품명 | 13px | normal | `#000000` | `[확정]` |
| 소비자가(정가) | 12px | normal | `#555555` | `text-decoration: line-through` `[확정]` |
| 판매가 | 12px | bold | `#008BCC` | `[확정]` |
| 할인율 (`.sale_box`) | `[미확인]` | | | 판매가 옆 "24%" |
| 섹션 제목 (h2 "NEW & BEST") | `[미확인]` | | `#404040` | 색상만 확인 `[확정]` |
| 섹션 부제 | `[미확인]` | | `#666666` | 색상만 확인 |
| 탭 메뉴 (전체/추천/베스트/세트) | `[미확인]` | | | |

### 3-2. 미확인 항목 (원본 CSS 없음 → 임의 값 금지)
- `font-family`: 제공된 CSS/HTML 어디에도 지정 없음. 웹폰트 링크 없음 (bootstrap-icons 폰트만 사용).
  - 값 확인 전 임시 기본값: `font-family: "Pretendard", "Noto Sans KR", sans-serif;` → **반드시 검증 후 교체**.
- 본문 `line-height`, `letter-spacing`, 제목/메뉴/푸터 글자 크기: 미확인.
- 규칙: 위 미확인 값은 사이트 CSS(`optimizer.php`, `optimizer_user.php`)를 받은 뒤 채운다. 그 전에는 CSS 변수로 분리해 한 곳에서만 수정되게 만든다.

```css
:root{
  --fs-prd-name: 13px;
  --fs-prd-price: 12px;
  --fs-title: ;      /* 미확인 */
  --fs-body: ;       /* 미확인 */
  --ff-base: ;       /* 미확인 */
}
```

---

## 4. 색상 규칙

### 4-1. 확정된 팔레트
| 토큰 | 값 | 용도 | 근거 |
|---|---|---|---|
| `--c-text` | `#404040` | 기본 글자, 제목, 탭 버튼 테두리/글자 (118회 사용) | `[확정]` |
| `--c-text-sub` | `#555555` | 보조 글자, 소비자가 취소선 (92회) | `[확정]` |
| `--c-text-mute` | `#666666` | 섹션 부제 | `[확정]` |
| `--c-black` | `#000000` | 상품명 | `[확정]` |
| `--c-white` | `#ffffff` | 배경, 반전 글자 | `[확정]` |
| `--c-accent` | `#008BCC` | 판매가 강조 (파랑) | `[확정]` |
| `--c-brand-blue` | `#3168a8` | "About us" 버튼 (배경 `#3168a8` + 글자 `#fff`, 호버/반전은 반대로) | `[확정]` |

### 4-2. 버튼 규칙
- 기본형: 글자 `#404040`, 배경 `#ffffff`, 테두리 `#404040`
- 반전형(활성/선택): 글자 `#ffffff`, 배경 `#404040`, 테두리 `#404040` (탭 활성 상태 `.act`에 해당)
- 브랜드 버튼: 배경 `#3168a8`, 글자 `#ffffff` ↔ 반전 시 배경 `#ffffff`, 글자 `#3168a8`

### 4-3. 규칙
- 팔레트 외 색을 임의로 추가하지 않는다. 필요하면 먼저 이 표에 추가한다.
- 배경은 흰색(`#fff`) 기준이며, 섹션별 배경색은 `[미확인]`(히어로/배너는 이미지 배경).

---

## 5. 페이지 섹션 순서 (홈 기준, 참고)
1. 상단 띠배너 (닫기 버튼, 세로 슬라이드)
2. 헤더 (메뉴 / 로고 / 검색·계정·장바구니)
3. 메인 히어로 슬라이드 (5장, 자동재생, pagination+화살표)
4. 아이콘 배너 슬라이드
5. NEW & BEST — 탭(전체/추천/베스트/세트) + 상품 4열 + More View
6. 상품 배너 슬라이드 (3장)
7. 그리드 배너 슬라이드
8. 비디오 배너
9. 링크 슬라이드 배너 (브랜드 소개 문구 + About us 버튼)
10. 인스타그램 피드
11. 푸터 (고객센터·계좌 / SNS·회사정보·카피라이트·이용약관 링크)

---

## 6. 남은 확인 목록 (원본 CSS 필요)
- `optimizer.php`, `optimizer_user.php` — 저장 폴더(`더랩 바이 블랑두_files/`)에 있으나 zip에 포함되지 않음. 이 두 파일에 폭/패딩/마진/폰트/색상 대부분이 있다.
- 필요 값: `.width1600 / .width1400 / .padding-lr / .section_margin_top` 실제 CSS, 헤더 높이, 폰트 패밀리, 제목·메뉴·푸터 글자 크기, 반응형 breakpoint.
