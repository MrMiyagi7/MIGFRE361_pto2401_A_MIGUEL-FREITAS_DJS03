# DJS03 Project Brief: Book Connect - Abstractions

## Overview

The Book Preview Application is a JavaScript-based web app that displays a list of books with options for filtering by genre and author. Users can view book previews, manage themes, and search for books using various filters. The application provides a responsive and user-friendly interface.

## Features

Book Previews: Displays a list of books with preview images, titles, and authors.
Search and Filter: Allows users to filter books by genre, author, and search term.
Theme Management: Supports light and dark themes based on user preferences.
Pagination: Implements a "Show more" button to load additional book previews.
Responsive Design: Ensures that the app is usable on different devices.

## Setup

1. Clone the Repository:
   git clone https://github.com/your-username/book-preview-app.git

2. Navigate to the Project Directory:
   cd book-preview-app

3. Install Dependencies: If applicable, install any dependencies required for your project. (Note: This project does not have specific dependencies listed.)

4. Open the Application: Open index.html in a web browser to view the application.

## File Structure

- index.html: The main HTML file that includes the structure of the application.
- styles.css: Contains the CSS styles for the application.
- script.js: The main JavaScript file that includes the application logic.

## JavaScript Code Breakdown

### Variables and DOM Elements

- page: Keeps track of the current page for pagination.
- matches: Stores the current list of books based on the applied filters.
- elements: An object that holds references to various DOM elements used throughout the application.

## Functions

- displayPreviews(filteredBooks):

  - Displays book previews based on the filtered list.
  - Updates the DOM with the book previews and adds event listeners for each preview.

- createOptions(data, firstOptionText, firstOptionValue):

  - Creates HTML <option> elements for genres and authors dropdowns.
  - Appends these options to the respective select elements.

- setTheme(theme):

  - Applies the selected theme (light or dark) to the application.
  - Updates the theme in the settings form.

- filterPreviews():

  - Filters the list of books based on the selected genre, author, and search term.
  - Updates the displayed previews and handles cases where no results are found.

- updateShowMoreButton(remainingBooks):

  - Updates the "Show more" button text and disables it when there are no more books to display.

- toggleNoResultsMessage(show):
  -Shows or hides the "No results found" message based on the result length.

- openActiveBook(active):
  - Displays detailed information about the selected book in a modal view.

## Event Listeners

- Search Form Submission:

  - Triggers the filterPreviews function and updates the book list based on the search criteria.

- "Show more" Button Click:

  - Loads additional book previews and updates the button state.

- Theme Settings Form Submission:

  - Updates the application theme based on user selection.

- Various UI Controls:
  - Opens and closes modals for search, settings, and book details.
