import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderPersonal(container) {
  const key = 'personal';
  container.innerHTML = `
    <form id="personalForm" class="form-section">
      ${field('Clothes/Shoes', 'clothes', key)}
      ${field('Hair & beauty', 'hair', key)}
      ${field('Dentist', 'dentist', key)}
      ${field('Optician', 'optician', key)}
      ${field('Charity', 'charity', key)}
      ${field('Cards & Gifts', 'cards', key)}
      ${field('Gambling', 'gambling', key)}
      ${field('Smoking', 'smoking', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('personalForm');

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

