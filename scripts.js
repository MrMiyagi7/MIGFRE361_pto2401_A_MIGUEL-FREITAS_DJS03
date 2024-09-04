import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1;
let matches = books;

const elements = {
  dataListItems: document.querySelector("[data-list-items]"),
  dataSearchGenres: document.querySelector("[data-search-genres]"),
  dataSearchAuthors: document.querySelector("[data-search-authors]"),
  dataSettingTheme: document.querySelector("[data-settings-theme]"),
  dataListBtn: document.querySelector("[data-list-button]"),
  dataSearchCancel: document.querySelector("[data-search-cancel]"),
  dataSearchOverlay: document.querySelector("[data-search-overlay]"),
  dataSettingCancel: document.querySelector("[data-settings-cancel]"),
  dataSettingOverlay: document.querySelector("[data-settings-overlay]"),
  dataHeaderSearch: document.querySelector("[data-header-search]"),
  dataSearchTitle: document.querySelector("[data-search-title]"),
  dataHeaderSettings: document.querySelector("[data-header-settings]"),
  dataListClose: document.querySelector("[data-list-close]"),
  activeData: document.querySelector("[data-list-active]"),
  dataListBlur: document.querySelector("[data-list-blur]"),
  dataListImg: document.querySelector("[data-list-image]"),
  dataListTitle: document.querySelector("[data-list-title]"),
  dataListSubtitle: document.querySelector("[data-list-subtitle]"),
  dataListDescription: document.querySelector("[data-list-description]"),
};

const starting = document.createDocumentFragment();

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
          <img
              class="preview__image"
              src="${image}"
          />

          <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${authors[author]}</div>
          </div>
      `;

  starting.appendChild(element);
}

elements.dataListItems.appendChild(starting);

// Creating option list of genres
const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement("option");
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
}

elements.dataSearchGenres.appendChild(genreHtml);

// Creating option list of authors
const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}

elements.dataSearchAuthors.appendChild(authorsHtml);

// Logic for light and dark mode user browser settings
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  elements.dataSettingTheme.value = "night";
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
} else {
  elements.dataSettingTheme.value = "day";
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
}

// Displays show more button
elements.dataListBtn.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;

// Disables show more button
elements.dataListBtn.disabled = matches.length - page * BOOKS_PER_PAGE > 0;

// change the content of the show more button
elements.dataListBtn.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;

// cancel search button EventListner
elements.dataSearchCancel.addEventListener("click", () => {
  elements.dataSearchOverlay.open = false;
});

// cancel settings Eventlistner

elements.dataSettingCancel.addEventListener("click", () => {
  elements.dataSettingOverlay.open = false;
});
// open search module
elements.dataHeaderSearch.addEventListener("click", () => {
  elements.dataSearchOverlay.open = true;
  elements.dataSearchTitle.focus();
});

// Open setting module

elements.dataHeaderSettings.addEventListener("click", () => {
  elements.dataSettingOverlay.open = true;
});

// close book module
elements.dataListClose.addEventListener("click", () => {
  elements.activeData.open = false;
});

// logic for light and dark selection (manual)
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }

    elements.dataSettingOverlay.open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    // Logic to filter book by genre
    for (const book of books) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    // Logic to see if there are results and display an appropriate message if none
    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    elements.dataListItems.innerHTML = "";
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);

      element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

      newItems.appendChild(element);
    }

    elements.dataListItems.appendChild(newItems);
    elements.dataListBtn.disabled = matches.length - page * BOOKS_PER_PAGE < 1;

    elements.dataListBtn.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    elements.dataSearchOverlay.open = false;
  });

// logic that shows more results upon show more button click
elements.dataListBtn.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  elements.dataListItems.appendChild(fragment);
  page += 1;
});

elements.dataListItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of books) {
        if (result) break;
        if (singleBook.id === node?.dataset?.preview) result = singleBook;
      }

      active = result;
    }
  }
  // Logic to render active book details on open book module
  if (active) {
    elements.activeData.open = true;
    elements.dataListBlur.src = active.image;
    elements.dataListImg.src = active.image;
    elements.dataListTitle.innerText = active.title;
    elements.dataListSubtitle.innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    elements.dataListDescription.innerText = active.description;
  }
});
