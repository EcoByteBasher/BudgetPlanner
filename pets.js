import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderPets(container) {
  const key = 'pets';
  container.innerHTML = `
    <form id="petsForm" class="form-section">
      ${field('Food', 'food', key)}
      ${field('Equipment', 'equipment', key)}
      ${field("Vet's bills", 'vet', key)}
      ${field('Insurance', 'insurance', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('petsForm');

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

