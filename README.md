# DJS03 Project Brief: Book Connect - Abstractions

# Web Components Documentation

## Overview

This README provides a comprehensive guide to the web components used in our application. It covers the process of creating the components, challenges faced, and instructions on how to use these components within the app. Additionally, it suggests three other components that could be converted into web components for better modularity.

## Web Components Created

### 1. BookPreview Component

Purpose:
The book-preview component is used to display a preview of a book, including its title, author, and image.

### Implementation Details:

- The component is defined as a custom HTML element <book-preview>.
- It uses attributes and slots to pass and display the book's data.
- The data-preview-id attribute holds the book's ID.
- The image-src attribute holds the URL of the book's image.
- Slots are used to display the title and author inside the component.

### Usage:

<book-preview
data-preview-id="book-id"
image-src="image-url"

> <span slot="title">Book Title</span> > <span slot="author">Author Name</span> > </book-preview>

### Challenges:

- Loading Variables: Ensuring that the attributes and slots are properly set and accessed within the component.
- Callback Function Timing: Implementing event listeners and callbacks to ensure that the component functions correctly after rendering. This was resolved by ensuring that the event listeners are added after the component is fully rendered.

### 2. Filter and Search Components

### Purpose:

These components handle filtering and searching functionality for the book list.

### Implementation Details:

- The filter options (genres and authors) are dynamically created using the createOptions function.
- The search functionality is tied to the submit event of the search form, triggering the filterPreviews function.

### Usage:

<form data-search-form>
  <select data-search-genres></select>
  <select data-search-authors></select>
  <input type="text" data-search-title />
  <button type="submit">Search</button>
</form>

### 3. Theme Settings Component

### Purpose:

This component allows users to switch between light and dark themes.

### Implementation Details:

- The setTheme function applies the selected theme by updating CSS custom properties.
- The theme is saved and applied based on user preferences and system settings.

### Usage:

<form data-settings-form>
  <select data-settings-theme>
    <option value="day">Day</option>
    <option value="night">Night</option>
  </select>
  <button type="submit">Apply Theme</button>
</form>

#### Challenges and Solutions

1. Loading Variables:

-Challenge: Variables and attributes needed to be dynamically loaded and updated.

- Solution: Used appropriate methods to ensure variables are correctly set and accessed. Ensured that attributes were properly assigned and updated in the custom element.

2. Callback Function Timing:

- Challenge: Ensuring that event listeners and callbacks functioned correctly after rendering.
- Solution: Added event listeners after the component was fully rendered, and used lifecycle hooks or state management to handle timing issues.

3. Dynamic Content Handling:

- Challenge: Handling dynamic content and updates within the custom components.
- Solution: Used document fragments and efficient DOM manipulation techniques to manage and update the content smoothly.

### Future Components

Here are three additional components that could be converted into web components:

#### Pagination Controls:

Purpose: Manage pagination for the book list, allowing users to navigate between pages.

#### Notification Banner:

Purpose: Display notifications or messages to users, such as success or error messages.

#### User Profile Widget:

Purpose: Display user profile information and settings in a modular way.

## Conclusion

By creating modular web components, we have improved the structure and maintainability of our application. Each component is designed to handle specific functionality, making the codebase more organized and easier to manage. The challenges faced were addressed through careful implementation and testing, ensuring that the components work seamlessly within the app.
