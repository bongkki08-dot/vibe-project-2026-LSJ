import { boardService } from "../data/board-service.js";
import { ADMIN_UID } from "../data/firebase/admin-constants.js";
import { auth, onAuthStateChanged } from "../data/firebase/firebase-config.js";

const boardElement = document.querySelector("[data-board-type]");
const boardList = document.querySelector("[data-board-list]");

if (boardElement && boardList) {
  const boardType = boardElement.dataset.boardType;
  const isFaq = boardType === "faq";
  const pageSize = 10;
  const state = {
    posts: [],
    category: "all",
    query: "",
    period: "all",
    page: 1,
    expandedId: null,
  };

  const searchForm = document.querySelector("[data-board-search]");
  const searchPeriod = searchForm.elements.period;
  const searchQuery = searchForm.elements.query;
  const pageNumbers = document.querySelector("[data-page-numbers]");
  const previousButton = document.querySelector("[data-page-previous]");
  const nextButton = document.querySelector("[data-page-next]");
  const stateMessage = document.querySelector("[data-board-state]");
  const writeButton = document.querySelector("[data-admin-write]");
  const writeForm = document.querySelector("[data-board-write-form]");
  const writeCancelButton = document.querySelector("[data-board-write-cancel]");
  const writeMessage = document.querySelector("[data-board-write-message]");
  let adminUser = null;

  function getFilteredPosts() {
    const query = state.query.trim().toLocaleLowerCase("ko");
    const cutoff = getDateCutoff(state.period);

    return state.posts
      .filter((post) => {
        if (post.boardType !== boardType) return false;
        if (isFaq && state.category !== "all" && post.category !== state.category) {
          return false;
        }
        if (query && !post.title.toLocaleLowerCase("ko").includes(query)) return false;
        if (cutoff && new Date(post.createdAt) < cutoff) return false;
        return true;
      })
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }

  function getDateCutoff(period) {
    if (period === "all") return null;

    const daysByPeriod = {
      week: 7,
      month: 30,
      "three-months": 90,
      "six-months": 180,
      year: 365,
    };
    const days = daysByPeriod[period];
    if (!days) return null;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return cutoff;
  }

  function createCell(text, className = "") {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = text;
    return cell;
  }

  function createPostRow(post, number) {
    const row = document.createElement("tr");
    row.className = `board-table__row board-table__row--${boardType}`;
    row.append(createCell(String(number), "board-table__number"));

    const titleCell = document.createElement("td");
    titleCell.className = "board-table__title";
    if (isFaq) {
      const questionTitle = post.title.startsWith("[")
        ? post.title
        : `[${post.category}] ${post.title}`;
      titleCell.textContent = `Q. ${questionTitle}`;
    } else {
      const titleButton = document.createElement("button");
      titleButton.className = "board-title-button";
      titleButton.type = "button";
      titleButton.textContent = post.title;
      titleButton.setAttribute("aria-expanded", String(state.expandedId === post.id));
      titleButton.addEventListener("click", () => {
        state.expandedId = state.expandedId === post.id ? null : post.id;
        render();
      });
      titleCell.append(titleButton);
    }
    row.append(titleCell);

    if (isFaq) {
      row.append(createCell(post.category, "board-table__category"));
      row.append(createCell(post.author.name, "board-table__author"));
    } else {
      row.append(createCell(post.author.name, "board-table__author"));
      row.append(createCell(post.createdAt.slice(0, 10), "board-table__date"));
    }

    const rows = [row];
    if (!isFaq && state.expandedId === post.id) {
      const detailRow = document.createElement("tr");
      detailRow.className = "board-detail";
      const detailCell = document.createElement("td");
      detailCell.colSpan = 4;
      detailCell.textContent = post.content || "상세 내용이 등록되지 않았습니다.";
      detailRow.append(detailCell);
      rows.push(detailRow);
    }

    return rows;
  }

  function render() {
    const posts = getFilteredPosts();
    const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * pageSize;
    const pagePosts = posts.slice(start, start + pageSize);
    const totalCount = posts.length;

    boardList.replaceChildren();

    if (pagePosts.length === 0) {
      const emptyRow = document.createElement("tr");
      const emptyCell = createCell("검색 결과가 없습니다.", "board-state");
      emptyCell.colSpan = 4;
      emptyRow.append(emptyCell);
      boardList.append(emptyRow);
    } else {
      pagePosts.forEach((post, index) => {
        const number = totalCount - start - index;
        boardList.append(...createPostRow(post, number));
      });
    }

    pageNumbers.replaceChildren();
    for (let page = 1; page <= totalPages; page += 1) {
      const pageButton = document.createElement("button");
      pageButton.className = "board-pagination__page";
      pageButton.type = "button";
      pageButton.textContent = String(page);
      if (page === state.page) {
        pageButton.setAttribute("aria-current", "page");
      }
      pageButton.addEventListener("click", () => {
        state.page = page;
        state.expandedId = null;
        render();
      });
      pageNumbers.append(pageButton);
    }
    previousButton.disabled = state.page <= 1;
    nextButton.disabled = state.page >= totalPages;
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = searchQuery.value;
    state.period = searchPeriod.value;
    state.page = 1;
    state.expandedId = null;
    render();
  });

  if (isFaq) {
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;
        state.page = 1;
        document.querySelectorAll("[data-category]").forEach((tab) => {
          const isActive = tab === button;
          tab.classList.toggle("is-active", isActive);
          tab.setAttribute("aria-pressed", String(isActive));
        });
        render();
      });
    });
  }

  previousButton.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    render();
  });

  nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(getFilteredPosts().length / pageSize);
    if (state.page >= totalPages) return;
    state.page += 1;
    render();
  });

  writeButton?.addEventListener("click", () => {
    writeForm.hidden = false;
    writeMessage.textContent = "";
    writeForm.elements.title.focus();
  });

  writeCancelButton?.addEventListener("click", () => {
    writeForm.reset();
    writeForm.hidden = true;
    writeMessage.textContent = "";
  });

  writeForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!adminUser) return;

    const title = writeForm.elements.title.value.trim();
    const content = writeForm.elements.content.value.trim();
    if (!title || !content) {
      writeMessage.textContent = "제목과 내용을 입력해 주세요.";
      return;
    }

    const submitButton = writeForm.querySelector("[type=submit]");
    submitButton.disabled = true;
    writeMessage.textContent = "등록 중입니다.";

    try {
      const post = await boardService.create({
        author: {
          id: adminUser.uid,
          name: adminUser.displayName || adminUser.email || "관리자",
        },
        boardType,
        content,
        title,
      });
      state.posts.unshift(post);
      state.page = 1;
      state.expandedId = null;
      render();
      writeForm.reset();
      writeForm.hidden = true;
      writeMessage.textContent = "등록되었습니다.";
    } catch (error) {
      console.error("Failed to create board post.", error);
      writeMessage.textContent = "글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    } finally {
      submitButton.disabled = false;
    }
  });

  onAuthStateChanged(auth, (user) => {
    adminUser = user?.uid === ADMIN_UID ? user : null;
    if (writeButton) writeButton.hidden = !adminUser;
    if (!adminUser && writeForm) {
      writeForm.reset();
      writeForm.hidden = true;
    }
  });

  async function initializeBoard() {
    try {
      await boardService.initialize();
      state.posts = await boardService.getAll();
      render();
    } catch (error) {
      console.error("Failed to load board posts.", error);
      stateMessage.textContent = "게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
      stateMessage.classList.add("board-state--error");
    }
  }

  initializeBoard();
}
