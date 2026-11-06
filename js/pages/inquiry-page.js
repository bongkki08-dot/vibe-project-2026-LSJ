import { boardService } from "../data/board-service.js";
import { ADMIN_UID } from "../data/firebase/admin-constants.js";
import { auth, onAuthStateChanged } from "../data/firebase/firebase-config.js";

const inquiryForm = document.querySelector("[data-inquiry-form]");
const inquiryList = document.querySelector("[data-inquiry-list]");

if (inquiryForm && inquiryList) {
  const state = { inquiries: [], expandedId: null, user: null, isAdmin: false };
  const submitButton = inquiryForm.querySelector('[type="submit"]');
  const formMessage = document.querySelector("[data-inquiry-form-message]");
  const loginMessage = document.querySelector("[data-inquiry-login-message]");
  const listMessage = document.querySelector("[data-inquiry-list-message]");

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "-";
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  }

  function cell(text, className = "") {
    const element = document.createElement("td");
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function canView(inquiry) {
    return !inquiry.isPrivate || state.isAdmin || inquiry.author?.id === state.user?.uid;
  }

  function isOwner(inquiry) {
    return inquiry.author?.id === state.user?.uid;
  }

  function actionButton(label, className, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
  }

  function answerBlock(inquiry) {
    const wrapper = document.createElement("div");
    wrapper.className = "inquiry-answer";
    if (inquiry.answer?.content) {
      const title = document.createElement("strong");
      title.className = "inquiry-answer__title";
      title.textContent = "답변";
      const content = document.createElement("p");
      content.className = "inquiry-answer__content";
      content.textContent = inquiry.answer.content;
      const meta = document.createElement("small");
      meta.textContent = `${inquiry.answer.author?.name || "관리자"} · ${formatDate(inquiry.answer.createdAt)}`;
      wrapper.append(title, content, meta);
      return wrapper;
    }
    if (!state.isAdmin) return wrapper;

    const form = document.createElement("form");
    form.className = "inquiry-answer-form";
    form.innerHTML = `<label>답변 작성</label><textarea rows="5" maxlength="10000" required placeholder="답변 내용을 입력해 주세요."></textarea><div class="inquiry-answer-form__actions"><p class="inquiry-form__message"></p><button class="board-search__submit" type="submit">답변 등록</button></div>`;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const textarea = form.querySelector("textarea");
      const submit = form.querySelector('[type="submit"]');
      const message = form.querySelector(".inquiry-form__message");
      const content = textarea.value.trim();
      if (!content) return;
      submit.disabled = true;
      message.textContent = "답변 등록 중입니다.";
      try {
        const answer = await boardService.answerInquiry(inquiry.id, {
          author: { id: state.user.uid, name: state.user.displayName || state.user.email || "관리자" },
          content,
        });
        inquiry.answer = answer;
        render();
      } catch (error) {
        console.error("Failed to answer inquiry.", error);
        message.textContent = "답변 등록에 실패했습니다.";
        submit.disabled = false;
      }
    });
    wrapper.append(form);
    return wrapper;
  }

  function editBlock(inquiry) {
    if (!isOwner(inquiry)) return null;
    const form = document.createElement("form");
    form.className = "inquiry-edit-form";
    form.innerHTML = `<label>문의 수정</label><select name="questionType" required><option value="배송문의">배송문의</option><option value="계정문의">계정문의</option><option value="교환/환불">교환/환불</option><option value="시스템오류">시스템오류</option><option value="기타">기타</option></select><input name="title" type="text" maxlength="200" required><textarea name="content" rows="6" maxlength="10000" required></textarea><label class="inquiry-form__private"><input name="isPrivate" type="checkbox"><span>비공개 문의</span></label><div class="inquiry-answer-form__actions"><p class="inquiry-form__message"></p><button class="board-search__submit" type="submit">수정 저장</button></div>`;
    form.elements.questionType.value = inquiry.questionType || "기타";
    form.elements.title.value = inquiry.title || "";
    form.elements.content.value = inquiry.content || "";
    form.elements.isPrivate.checked = Boolean(inquiry.isPrivate);
    form.hidden = true;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const changes = { questionType: data.get("questionType"), title: data.get("title").trim(), content: data.get("content").trim(), isPrivate: data.get("isPrivate") === "on" };
      if (!changes.title || !changes.content) return;
      const save = form.querySelector('[type="submit"]');
      save.disabled = true;
      try {
        Object.assign(inquiry, await boardService.updateInquiry(inquiry.id, changes));
        render();
      } catch (error) {
        console.error("Failed to update inquiry.", error);
        form.querySelector(".inquiry-form__message").textContent = "수정에 실패했습니다.";
        save.disabled = false;
      }
    });
    return form;
  }

  function detailRow(inquiry) {
    const row = document.createElement("tr");
    row.className = "board-detail inquiry-detail";
    const detail = document.createElement("td");
    detail.colSpan = 6;
    if (!canView(inquiry)) {
      detail.textContent = "비공개 문의입니다. 작성자와 관리자만 내용을 확인할 수 있습니다.";
      row.append(detail);
      return row;
    }

    const question = document.createElement("div");
    question.className = "inquiry-question";
    const title = document.createElement("strong");
    title.textContent = inquiry.title;
    const content = document.createElement("p");
    content.textContent = inquiry.content;
    question.append(title, content);
    detail.append(question, answerBlock(inquiry));

    const edit = editBlock(inquiry);
    if (edit) {
      const actions = document.createElement("div");
      actions.className = "inquiry-detail__actions";
      actions.append(
        actionButton("수정", "inquiry-detail__action", () => { edit.hidden = !edit.hidden; }),
        actionButton("삭제", "inquiry-detail__action inquiry-detail__action--delete", async () => {
          if (!window.confirm("이 문의를 삭제할까요?")) return;
          await boardService.deleteInquiry(inquiry.id);
          state.expandedId = null;
          await loadInquiries();
        })
      );
      detail.append(actions, edit);
    }
    row.append(detail);
    return row;
  }

  function render() {
    inquiryList.replaceChildren();
    if (state.inquiries.length === 0) {
      const row = document.createElement("tr");
      const empty = cell("등록된 문의가 없습니다.", "board-state");
      empty.colSpan = 6;
      row.append(empty);
      inquiryList.append(row);
      return;
    }
    state.inquiries.forEach((inquiry, index) => {
      const row = document.createElement("tr");
      row.className = "board-table__row board-table__row--inquiry";
      row.append(cell(String(state.inquiries.length - index), "board-table__number"));
      const titleCell = document.createElement("td");
      titleCell.className = "board-table__title";
      const title = document.createElement("button");
      title.type = "button";
      title.className = "board-title-button";
      title.textContent = `${inquiry.isPrivate ? "🔒 " : ""}${inquiry.title}`;
      title.setAttribute("aria-expanded", String(state.expandedId === inquiry.id));
      title.addEventListener("click", () => { state.expandedId = state.expandedId === inquiry.id ? null : inquiry.id; render(); });
      titleCell.append(title);
      row.append(titleCell, cell(inquiry.questionType || "기타", "board-table__question-type"), cell(inquiry.author?.name || "작성자", "board-table__author"), cell(formatDate(inquiry.createdAt), "board-table__date"), cell(inquiry.answer?.content ? "답변완료" : "답변대기", "board-table__status"));
      inquiryList.append(row);
      if (state.expandedId === inquiry.id) inquiryList.append(detailRow(inquiry));
    });
  }

  async function loadInquiries() {
    try {
      state.inquiries = await boardService.getInquiries();
      listMessage.textContent = "";
      listMessage.classList.remove("board-state--error");
      render();
    } catch (error) {
      console.error("Failed to load inquiries.", error);
      listMessage.textContent = "문의 목록을 불러오지 못했습니다.";
      listMessage.classList.add("board-state--error");
    }
  }

  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return;
    const data = new FormData(inquiryForm);
    const questionType = data.get("questionType");
    const title = data.get("title").trim();
    const content = data.get("content").trim();
    if (!questionType || !title || !content) {
      formMessage.textContent = "질문 유형, 제목, 내용을 모두 입력해 주세요.";
      formMessage.classList.add("board-state--error");
      return;
    }
    submitButton.disabled = true;
    formMessage.textContent = "문의 등록 중입니다.";
    try {
      await boardService.createInquiry({ author: { id: state.user.uid, name: state.user.displayName || state.user.email || "회원" }, title, content, questionType, isPrivate: data.get("isPrivate") === "on" });
      inquiryForm.reset();
      formMessage.textContent = "문의가 등록되었습니다.";
      state.expandedId = null;
      await loadInquiries();
    } catch (error) {
      console.error("Failed to create inquiry.", error);
      formMessage.textContent = "문의 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      formMessage.classList.add("board-state--error");
    } finally {
      submitButton.disabled = false;
    }
  });

  onAuthStateChanged(auth, (user) => {
    state.user = user;
    state.isAdmin = user?.uid === ADMIN_UID;
    inquiryForm.hidden = !user;
    loginMessage.hidden = Boolean(user);
    render();
  });

  loadInquiries();
}
