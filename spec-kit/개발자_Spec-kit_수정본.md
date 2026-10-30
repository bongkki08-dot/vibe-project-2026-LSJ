# Spec-Kit: Developer Specification
**기준 환경:** Vanilla HTML / CSS / JavaScript (프레임워크 및 빌드 도구는 별도 승인 없이는 사용하지 않음)  
**문서 목적:** 디자이너 명세와 사용자 요구사항을 안정적이고 유지보수 가능한 코드로 구현한다.

> 프로젝트별 요구사항, 기존 코드 구조, 제공된 에셋이 이 문서와 다를 경우 임의로 덮어쓰지 않는다. 충돌 내용을 먼저 알리고 확인이 필요한 사항은 질문 또는 가정 목록으로 분리한다.

## 1. 역할과 구현 원칙

1. 구현 전에 요구사항, 디자이너 Spec-kit, 화면 자료, 기존 코드를 확인한다.
2. 작업 범위와 변경 파일을 먼저 정리한다. 규모가 큰 작업은 구현 계획을 제시한 뒤 진행한다.
3. 디자이너가 정의한 색상·타이포그래피·간격·컴포넌트 규칙을 임의로 변경하지 않는다.
4. 요구사항에 없는 기능, 라이브러리, 외부 서비스, 데이터 구조를 임의로 추가하지 않는다.
5. 불명확한 동작은 임의로 확정하지 말고 질문한다. 진행을 위해 가정이 필요하면 가정을 명시한다.
6. 기존 기능과 레이아웃을 보존하고, 요청된 범위에 필요한 최소 변경을 우선한다.
7. 구현 완료를 주장하기 전에 가능한 범위에서 실제 브라우저 동작과 반응형을 확인한다.

## 2. Project Architecture & Directory Structure

아래 구조는 소규모 Vanilla 프로젝트의 기본안이다. 페이지 수와 기능 규모에 따라 조정하되, 파일을 과도하게 쪼개거나 하나의 파일에 모든 코드를 집중하지 않는다.

```text
/
├── index.html
├── pages/                    # 추가 페이지가 있을 때
├── css/
│   ├── reset.css
│   ├── variables.css         # Designer Spec-kit tokens
│   ├── base.css              # 기본 요소 및 공통 규칙
│   ├── layout.css            # Header, Footer, Grid
│   ├── components/
│   │   ├── header.css
│   │   ├── product-card.css
│   │   ├── carousel.css
│   │   └── modal.css
│   └── style.css             # CSS import entry
├── js/
│   ├── main.js               # 초기화 및 페이지 진입점
│   ├── components/
│   │   ├── carousel.js
│   │   ├── drawer.js
│   │   └── tab.js
│   └── utils/
│       ├── dom.js
│       └── storage.js
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

- 실제 프로젝트에 없는 폴더나 파일을 구조만 맞추기 위해 무조건 생성하지 않는다.
- CSS 로딩 순서는 `reset → variables → base → layout → components`를 기본으로 한다.
- ES Modules를 사용한다면 HTML에 `<script type="module" src="./js/main.js"></script>`로 연결한다.
- 모듈을 사용하는 개발 환경에서 로컬 서버가 필요할 수 있음을 고려한다. 파일을 `file://`로 직접 열어 테스트하지 않는다.

## 3. HTML Standards

1. 의미에 맞는 시맨틱 요소(`header`, `nav`, `main`, `section`, `article`, `footer`, `button`)를 사용한다.
2. 페이지에는 명확한 제목 계층을 유지한다. 제목 태그를 스타일 목적으로 선택하지 않는다.
3. 클릭 동작은 기본적으로 `<button>`, 페이지 이동은 `<a>`를 사용한다.
4. 모든 입력에는 연결된 `<label>` 또는 접근 가능한 이름을 제공한다.
5. 이미지의 목적에 맞는 `alt`를 제공한다. 장식 이미지는 `alt=""`를 사용한다.
6. 폼, 버튼, 링크에 기본 동작과 접근성 속성이 필요한지 확인한다.
7. ID는 문서 내에서 고유해야 한다.

## 4. CSS Architecture & Naming

### 4.1 BEM Naming

클래스명은 BEM을 기본으로 하되, 프로젝트 기존 규칙이 있다면 일관성을 우선한다.

- Block: `.product-card`
- Element: `.product-card__image`
- Modifier: `.product-card--discounted`

```html
<article class="product-card">
  <div class="product-card__image-wrapper">
    <img
      src="./assets/images/product.jpg"
      alt="블루클레이 토너"
      class="product-card__image"
      loading="lazy"
      decoding="async"
    >
    <span class="badge badge--sale">BEST</span>
  </div>
  <div class="product-card__content">
    <h3 class="product-card__title">올리고 히알루론산 5000 토너</h3>
  </div>
</article>
```

### 4.2 Styling Rules

- 디자이너 문서의 토큰을 `variables.css`에 반영하고 컴포넌트에서 재사용한다.
- 전역 선택자와 과도하게 구체적인 선택자를 피한다.
- ID 선택자를 일반적인 스타일링 용도로 사용하지 않는다.
- 인라인 스타일은 런타임 계산 등 필요한 경우에만 사용한다.
- `!important`는 원칙적으로 사용하지 않는다. 불가피하면 이유를 남긴다.
- 상태는 `.is-active`, `.is-open`, `.is-disabled` 등 일관된 상태 클래스로 표현할 수 있다.
- JavaScript 동작 선택자는 `data-*` 속성으로 분리하고, 스타일 클래스와 역할을 혼용하지 않는다.
- 반응형은 콘텐츠가 자연스럽게 재배치되도록 구현하며 불필요한 고정 너비·높이를 피한다.

## 5. JavaScript Standards

### 5.1 Modules & Initialization

- ES Modules를 사용해 기능별 책임을 분리한다.
- 각 컴포넌트는 초기화 함수와 필요한 공개 인터페이스를 제공한다.
- DOM 요소가 없는 페이지에서도 초기화 코드가 오류를 내지 않도록 방어한다.
- 전역 변수와 전역 함수 생성을 피한다.

```javascript
// js/main.js
import { initTabSystem } from "./components/tab.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabSystem();
});
```

### 5.2 Event Handling & DOM Manipulation

- 반복되는 리스트에는 적절한 경우 이벤트 위임을 사용한다.
- 이벤트 대상은 `closest()`로 확인하고, 해당 컴포넌트 범위 안에 있는지 검증한다.
- DOM 변경은 필요한 부분만 수행한다.
- 사용자 입력을 `innerHTML`에 직접 삽입하지 않는다. 텍스트는 `textContent`를 우선 사용한다.
- 이벤트 리스너가 중복 등록되지 않도록 초기화 흐름을 관리한다.

### 5.3 Correct Tab Component Example

```javascript
// js/components/tab.js
export function initTabSystem() {
  const containers = document.querySelectorAll(
    '[data-component="tab-container"]'
  );

  containers.forEach((container) => {
    if (container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";

    container.addEventListener("click", (event) => {
      const targetTab = event.target.closest("[data-tab-target]");
      if (!targetTab || !container.contains(targetTab)) return;

      const targetId = targetTab.dataset.tabTarget;
      const targetPanel = container.querySelector(
        `[data-tab-panel="${CSS.escape(targetId)}"]`
      );

      if (!targetPanel) return;

      container.querySelectorAll("[data-tab-target]").forEach((tab) => {
        const selected = tab === targetTab;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });

      container.querySelectorAll("[data-tab-panel]").forEach((panel) => {
        const selected = panel === targetPanel;
        panel.classList.toggle("is-active", selected);
        panel.hidden = !selected;
      });
    });
  });
}
```

탭 마크업은 `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-controls`, `aria-labelledby` 등 접근성 관계를 함께 정의한다. 위 예시는 클릭 동작의 기본 패턴이며, 완전한 탭 키보드 패턴이 필요한 경우 방향키 이동도 구현한다.

## 6. Responsive Implementation

- Designer Spec-kit의 브레이크포인트를 기준으로 구현한다.
- 기본 기준: Mobile `0–767px`, Tablet `768–1023px`, Desktop `1024px+`.
- 브레이크포인트 경계에서 레이아웃이 비거나 겹치지 않도록 한다.
- 최소 320px, 390px, 768px, 1024px, 1440px 폭에서 확인한다. 프로젝트 타깃에 따라 추가한다.
- 모바일 내비게이션, 이미지 크롭, 카드 열 수, 여백, 타이포그래피 등 컴포넌트별 변화 규칙을 반영한다.
- 가로 스크롤이 의도치 않게 발생하지 않는지 확인한다.
- 반응형 수정 시 데스크톱·태블릿·모바일의 기존 동작이 깨지지 않는지 함께 검수한다.

## 7. Interaction & Accessibility

- 모든 기능은 마우스뿐 아니라 키보드로도 사용할 수 있어야 한다.
- 포커스 표시를 제거하지 않는다.
- 메뉴·모달·드로어는 열기/닫기, ESC, 바깥 영역 클릭, 포커스 이동 및 복귀를 고려한다.
- 토글 상태는 `aria-expanded`, 선택 상태는 `aria-selected` 등 적절한 ARIA 속성으로 전달한다.
- 버튼의 비활성 상태는 실제 `disabled` 속성과 시각적 상태를 일치시킨다.
- 모션은 과도하게 사용하지 않고 `prefers-reduced-motion`을 고려한다.
- 오류와 성공 메시지는 화면 및 보조기술에서 인지할 수 있게 제공한다.

## 8. Performance & Asset Optimization

- 화면 아래쪽의 콘텐츠 이미지에는 필요에 따라 `loading="lazy"`를 적용한다.
- 첫 화면의 핵심 이미지에는 무조건 lazy loading을 적용하지 않는다. 필요하면 우선순위를 지정한다.
- 이미지에는 적절한 크기와 포맷을 사용하고, 레이아웃 이동을 줄이도록 `width`/`height` 또는 `aspect-ratio`를 지정한다.
- `decoding="async"`는 일반 콘텐츠 이미지에 사용할 수 있다.
- 스크롤·리사이즈 이벤트에서 반복적인 레이아웃 계산을 피한다. 필요한 경우 `requestAnimationFrame`, debounce 또는 throttle을 사용한다.
- 사용하지 않는 라이브러리와 중복 코드를 추가하지 않는다.

## 9. Error Handling & Security

- DOM 요소, 데이터, 외부 리소스가 없거나 실패하는 경우를 고려한다.
- 콘솔 오류와 불필요한 경고를 남기지 않는다.
- 사용자 입력은 검증하고, HTML로 삽입할 때 XSS 위험을 방지한다.
- API 키, 비밀번호, 비밀 토큰을 프론트엔드 코드에 저장하지 않는다.
- 외부 링크를 새 창으로 열 때 필요한 보안 속성을 적용한다.
- 백엔드/API가 요구사항에 포함되지 않았다면 임의로 가정해 구현하지 말고 필요한 연결 정보를 확인한다.

## 10. Testing & Completion Criteria

작업 완료 전 다음 항목을 확인한다.

- [ ] 요청된 페이지·섹션·콘텐츠가 누락되지 않았다.
- [ ] 디자이너 명세의 색상, 글꼴, 간격, 크기, 정렬을 반영했다.
- [ ] 버튼·링크·탭·모달·드로어 등 명시된 인터랙션이 실제로 동작한다.
- [ ] 320 / 390 / 768 / 1024 / 1440px에서 주요 레이아웃을 확인했다.
- [ ] 키보드 포커스와 기본 접근성을 확인했다.
- [ ] 이미지 경로와 폰트 경로가 유효하다.
- [ ] 브라우저 콘솔에 새 오류가 없다.
- [ ] 기존 기능과 화면을 불필요하게 변경하지 않았다.

검증하지 못한 항목은 완료했다고 단정하지 말고, 미검증 항목과 이유를 보고한다.

## 11. Vibe Coding Workflow

1. **Analyze:** 요청, 첨부 자료, 기존 파일, 디자이너 Spec-kit을 확인한다.
2. **Clarify:** 모호하거나 서로 충돌하는 요구사항을 질문한다. 필요한 가정은 명시한다.
3. **Plan:** 수정 대상 파일, 구현 순서, 영향 범위를 간단히 제시한다.
4. **Implement:** 요청 범위에 맞춰 작은 단위로 구현한다.
5. **Verify:** 실제 코드와 화면을 확인하고 반응형·인터랙션·콘솔 오류를 점검한다.
6. **Report:** 변경 파일, 구현 내용, 검증 결과, 미해결 사항을 정리한다.

### 작업 보고 형식

- 변경한 파일:
- 주요 변경 사항:
- 테스트한 화면 크기 및 동작:
- 확인된 문제 또는 미검증 항목:
- 추가 확인이 필요한 사항:

## 12. Conflict Priority

규칙이 충돌할 때는 다음 순서로 판단한다.

1. 사용자가 현재 작업에서 명시한 요구사항 및 승인된 변경사항
2. 프로젝트의 확정된 기획서·화면 설계서·에셋
3. Designer Spec-kit
4. Developer Spec-kit의 일반 구현 규칙
5. 개발자의 임의 판단

상위 기준을 적용해도 해결되지 않는 충돌은 임의로 선택하지 말고 사용자에게 확인한다.
