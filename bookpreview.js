// BookPreview.js
export class BookPreview extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const preview = document.createElement("button");
    preview.classList.add("preview");
    preview.setAttribute("data-preview", this.getAttribute("data-preview-id"));

    preview.innerHTML = `
          <style>
            /* Component-specific styles */
          </style>
          <img class="preview__image" src="${this.getAttribute(
            "image-src"
          )}" alt="Book Image">
          <div class="preview__info">
            <h3 class="preview__title"><slot name="title"></slot></h3>
            <div class="preview__author"><slot name="author"></slot></div>
          </div>
      `;

    shadow.appendChild(preview);
  }
}
