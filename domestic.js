import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderDomestic(container) {
  const key = 'domestic';
  container.innerHTML = `
    <form id="domesticForm" class="form-section">
      ${field('Food shopping', 'food', key)}
      ${field('Household shopping', 'household', key)}
      ${field('Gardening', 'gardening', key)}
      ${field('Window cleaning', 'window_cleaning', key)}
      ${field('TV licence', 'tv_licence', key)}
      ${field('Streaming services', 'streaming', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('domesticForm');

  // Load previously saved data and THEN attach auto-save
  const data = loadPageData(key);
  populateForm(form, data);

  // Re-attach auto-save after populate
  form.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      savePageData(key, collect(form));
    });
    inp.addEventListener('change', () => {
      savePageData(key, collect(form));
    });
  });
}

