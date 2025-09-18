import { field, loadPageData, populateForm, enableAutoSave } from './utils.js';

export function renderPage(container, page) {
  const key = page.toLowerCase();

  container.innerHTML = `
    <form id="pageForm" key="${key}">
      ${field('Item 1', 'item1', key)}
      ${field('Item 2', 'item2', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = container.querySelector('#pageForm');

  // Pre-populate from storage
  const saved = loadPageData(key);
  if (saved) populateForm(form, saved);

  // Enable auto-save for this fallback page
  enableAutoSave(form, key);
}

