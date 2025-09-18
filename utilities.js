import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderUtilities(container) {
  const key = 'utilities';
  container.innerHTML = `
    <form id="utilitiesForm" class="form-section">
      ${field('Gas & Electric', 'gas_electric', key)}
      ${field('Water & Sewerage', 'water', key)}
      ${field('Broadband & Phone', 'broadband', key)}
      ${field('Mobile 1', 'mobile1', key)}
      ${field('Mobile 2', 'mobile2', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('utilitiesForm');

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

