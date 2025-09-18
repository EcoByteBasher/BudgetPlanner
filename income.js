import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderIncome(container) {
  const key = 'income';  // short name only
  container.innerHTML = `
    <form id="incomeForm" class="form-section" key="${key}">
      ${field('Primary employment 1', 'primary1', key)}
      ${field('Primary employment 2', 'primary2', key)}
      ${field('Casual employment 1', 'secondary1', key)}
      ${field('Casual employment 2', 'secondary2', key)}
      ${field('Savings', 'savings', key)}
      ${field('Investments', 'investments', key)}
      ${field('Gifts', 'gifts', key)}
      ${field('Pension', 'pension', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter NET amounts received, in whole pounds.</p>
    </form>
  `;

  const form = document.getElementById('incomeForm');

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

