import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderFinance(container) {
  const key = 'finance';
  container.innerHTML = `
    <form id="financeForm" class="form-section">
      ${field('Bank charges', 'bank_charges', key)}
      ${field('Loan repayments', 'loan_repayments', key)}
      ${field('Credit card charges', 'credit_card', key)}
      ${field('Taxes (non-PAYE)', 'taxes', key)}
      ${field('Savings deposits', 'savings', key)}
      ${field('SIPP deposits', 'sipp', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('financeForm');

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

