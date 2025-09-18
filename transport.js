import { field, loadPageData, populateForm, collect, savePageData } from './utils.js';

export function renderTransport(container) {
  const key = 'transport';
  container.innerHTML = `
    <form id="transportForm" class="form-section">
      ${field('Car finance', 'car_finance', key)}
      ${field('Car tax', 'car_tax', key)}
      ${field('Car insurance', 'car_insurance', key)}
      ${field('Car MoT', 'car_mot', key)}
      ${field('Breakdown insurance', 'breakdown', key)}
      ${field('Fuel', 'fuel', key)}
      ${field('Servicing & maintenance', 'servicing', key)}
      ${field('Parking', 'parking', key)}
      ${field('Rail fares', 'rail', key)}
      ${field('Taxis', 'taxis', key)}
      ${field('Bus/tram/ferry', 'bus', key)}
      ${field('Cycle maintenance', 'cycle', key)}
      ${field('Other', 'other', key)}
      <p class="note small">Please enter whole pounds only.</p>
    </form>
  `;

  const form = document.getElementById('transportForm');

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

