import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1;
let matches = books;

// Object to store DOM element
// Object name = DOM name : DOM element
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

// Funtion that displays previews and adds event listners for active books
function displayPreviews() {
  const starting = document.createDocumentFragment();
  for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
    const { author, id, image, title } = book;
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
    element.addEventListener("click", () => {
      openActiveBook(book);
    });

    starting.appendChild(element);
  }

  elements.dataListItems.appendChild(starting);
}

// Funtion that sorts and displays search options
function createOptions(data, firstOptionText, firstOptionValue) {
  const fragment = document.createDocumentFragment();

  const firstElement = document.createElement("option");
  firstElement.value = firstOptionValue;
  firstElement.innerText = firstOptionText;
  fragment.appendChild(firstElement);

  for (const [id, name] of Object.entries(data)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }
  return fragment;
}

// Usage for genres
const genreHtml = createOptions(genres, "All Generes", "any");
elements.dataSearchGenres.appendChild(genreHtml);

// Usage for Authors
const authorsHtml = createOptions(authors, "All Authors", "any");
elements.dataSearchAuthors.appendChild(authorsHtml);

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

// Function to render active book details on open book module

function openActiveBook(active) {
  elements.activeData.open = true;
  elements.dataListBlur.src = active.image;
  elements.dataListImg.src = active.image;
  elements.dataListTitle.innerText = active.title;
  elements.dataListSubtitle.innerText = `${authors[active.author]} (${new Date(
    active.published
  ).getFullYear()})`;
  elements.dataListDescription.innerText = active.description;
}

// Displays preview content on page load
document.addEventListener("DOMContentLoaded", () => {
  displayPreviews();
});
