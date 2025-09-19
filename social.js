import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderSocial(container) {
  const key = 'social';
  container.innerHTML = `
    <form id="socialForm" class="form-section">
      ${field('Holidays', 'holidays', key)}
      ${field('Eating out/Takeaways', 'eating_out', key)}
      ${field('Leisure/Entertainment', 'leisure', key)}
      ${field('Clubs/Societies', 'clubs', key)}
      ${field('Voluntary work', 'volunteering', key)}
      ${field('Entertaining', 'entertaining', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('socialForm');

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

