import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderHousing(container) {
  const key = 'housing';
  container.innerHTML = `
    <form id="housingForm" class="form-section">
      ${field('Mortgage / Rent', 'mortgage', key)}
      ${field('Council Tax', 'council_tax', key)}
      ${field('Insurance', 'insurance', key)}
      ${field('Maintenance', 'maintenance', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('housingForm');

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

