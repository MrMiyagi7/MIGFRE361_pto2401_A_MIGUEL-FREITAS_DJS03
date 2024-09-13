import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { BookPreview } from "./bookpreview.js";

let page = 1;
let matches = books;

// Object to store DOM element
// Object name = DOM name : DOM element
const elements = {
  dataListItems: document.querySelector("[data-list-items]"),
  dataSearchForm: document.querySelector("[data-search-form]"),
  dataSearchGenres: document.querySelector("[data-search-genres]"),
  dataSearchAuthors: document.querySelector("[data-search-authors]"),
  dataSettingTheme: document.querySelector("[data-settings-theme]"),
  dataListBtn: document.querySelector("[data-list-button]"),
  dataSearchCancel: document.querySelector("[data-search-cancel]"),
  dataSearchOverlay: document.querySelector("[data-search-overlay]"),
  dataSettingsForm: document.querySelector("[data-settings-form]"),
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
  noResultMsg: document.querySelector("[data-list-message]"),
};

// Funtion that displays previews and adds event listners for active books
function displayPreviews(filteredBooks) {
  const starting = document.createDocumentFragment();

  for (const book of filteredBooks.slice(0, BOOKS_PER_PAGE)) {
    const { author, id, image, title } = book;

    // Create the custom element
    const element = document.createElement("book-preview");

    // Set the attributes and slots
    element.setAttribute("data-preview-id", id); // for the preview
    element.setAttribute("image-src", image); // pass the image URL

    // Use slots to pass the title and author
    element.innerHTML = `
      <span slot="title">${title}</span>
      <span slot="author">${authors[author]}</span>
    `;

    // Add an event listener to open the active book
    element.addEventListener("click", () => {
      openActiveBook(book);
    });

    starting.appendChild(element);
  }

  elements.dataListItems.innerHTML = "";
  elements.dataListItems.appendChild(starting);
}
displayPreviews(matches);

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

function setTheme(theme) {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }

  // Update the theme selection in the settings form
  elements.dataSettingTheme.value = theme;
}

const preferredTheme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";

setTheme(preferredTheme);

elements.dataSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  setTheme(theme);

  elements.dataSettingOverlay.open = false;
});

// Displays show more button
elements.dataListBtn.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;

// Disables show more button
elements.dataListBtn.disabled = matches.length - page * BOOKS_PER_PAGE < 0;

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

function filterPreviews() {
  const selectedGenre = elements.dataSearchGenres.value;
  const selectedAuthors = elements.dataSearchAuthors.value;
  const searchTerm = elements.dataSearchTitle.value.trim().toLowerCase();

  const filteredBooks = matches.filter((book) => {
    const matchesGenre =
      selectedGenre === "any" || book.genres.includes(selectedGenre);
    const matchesAuthor =
      selectedAuthors === "any" || book.author === selectedAuthors;
    const matcheSearch =
      book.title.toLowerCase().includes(searchTerm) ||
      authors[book.author].toLowerCase().includes(searchTerm);

    return matchesGenre && matchesAuthor && matcheSearch;
  });
  matches = filteredBooks;
  page = 1;
  displayPreviews(filteredBooks);

  toggleNoResutlsMessage(filteredBooks.length < 1);

  const remainingBooks = filteredBooks.length - page * BOOKS_PER_PAGE;
  updateShowMoreButton(remainingBooks);
}

function updateShowMoreButton(remainingBooks) {
  elements.dataListBtn.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      remainingBooks > 0 ? remainingBooks : 0
    })</span>
  `;
  elements.dataListBtn.disabled = remainingBooks <= 0;
}
elements.dataSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterPreviews();
  window.scrollTo({ top: 0, behavior: "smooth" });
  elements.dataSearchOverlay.open = false;
});

function toggleNoResutlsMessage(show) {
  if (show) {
    elements.noResultMsg.classList.add("list__message_show");
  } else {
    elements.noResultMsg.classList.remove("list__message_show");
  }
}

elements.dataListBtn.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const bookPreview = document.createElement("book-preview");
    bookPreview.setAttribute("data-preview-id", id);
    bookPreview.setAttribute("image-src", image);

    // Use slots to set the title and author
    bookPreview.innerHTML = `
      <span slot="title">${title}</span>
      <span slot="author">${authors[author]}</span>
    `;

    // Add an event listener to handle click events
    bookPreview.addEventListener("click", () => {
      openActiveBook({ author, id, image, title });
    });

    fragment.appendChild(bookPreview);
  }

  elements.dataListItems.appendChild(fragment);

  // Increment the page count
  page += 1;

  // Update the "Show more" button using the new function
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  updateShowMoreButton(remainingBooks);
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
