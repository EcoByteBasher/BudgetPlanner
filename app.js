import { renderIncome } from './income.js';
import { renderPage } from './page.js';
import { renderHousing } from './housing.js';
import { renderUtilities } from './utilities.js';
import { renderTransport } from './transport.js';
import { renderFinance } from './finance.js';
import { renderDomestic } from './domestic.js';
import { renderPets } from './pets.js';
import { renderSocial } from './social.js';
import {
  loadAllPages,
  calculateTotals,
  exportToCSV,
  showSavedMessage,
  syncAllPagesToStorage,
  parseCSVToStore,
  writeStoreToLocalStorage
} from './utils.js';

function router() {
  const hash = location.hash.replace('#', '') || 'income';
  const container = document.getElementById('app');

  // Highlight active tab
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('href') === '#' + hash);
  });

  if (hash === 'income') renderIncome(container);
  else if (hash === 'housing') renderHousing(container);
  else if (hash === 'utilities') renderUtilities(container);
  else if (hash === 'transport') renderTransport(container);
  else if (hash === 'finance') renderFinance(container);
  else if (hash === 'domestic') renderDomestic(container);
  else if (hash === 'pets') renderPets(container);
  else if (hash === 'social') renderSocial(container);
  else renderPage(container, hash);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function runCalc() {
  // Sync visible forms first
  syncAllPagesToStorage();

  const allData = loadAllPages();
  const { annualIncome, annualExpense } = calculateTotals(allData);
  const monthlyIncome = Math.round(annualIncome / 12);
  const monthlyExpense = Math.round(annualExpense / 12);
  const annualNet = annualIncome - annualExpense;
  const monthlyNet = Math.round(annualNet / 12);

  const netRow = document.querySelector('.result-row.net');
  const surplusLabel = document.getElementById('surplusLabel');

  document.getElementById('annualIncome').textContent = formatGBP(annualIncome);
  document.getElementById('monthlyIncome').textContent = `(${formatGBP(monthlyIncome)} / month)`;
  document.getElementById('annualExp').textContent = formatGBP(annualExpense);
  document.getElementById('monthlyExp').textContent = `(${formatGBP(monthlyExpense)} / month)`;
  document.getElementById('annualNet').textContent = formatGBP(annualNet);
  document.getElementById('monthlyNet').textContent = `(${formatGBP(monthlyNet)} / month)`;

  if (netRow) {
    netRow.classList.toggle('surplus', annualNet >= 0);
    netRow.classList.toggle('deficit', annualNet < 0);

    if (surplusLabel) {
      surplusLabel.textContent = annualNet >= 0 ? 'surplus' : 'deficit';
    }
  }
}

function formatGBP(value) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const formatted = absValue.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return isNegative ? '-' + formatted : formatted;
}

document.getElementById('calculateBtn').addEventListener('click', runCalc);
window.addEventListener('load', runCalc);

document.getElementById('exportBtn').addEventListener('click', () => {
  syncAllPagesToStorage();
  const allData = loadAllPages();
  const csv = exportToCSV(allData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `budget_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = async evt => {
    try {
      // Suspend auto-save so listeners don't clobber storage during restore
      window.__suspendAutoSave = true;

      // Parse CSV to an in-memory store
      const parsedStore = parseCSVToStore(evt.target.result);
      console.log('Import parsedStore:', parsedStore);

      // Clear all existing bp_page_* keys (full overwrite semantics)
      const toClear = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('bp_page_')) toClear.push(k);
      }
      toClear.forEach(k => localStorage.removeItem(k));

      // Write the imported store into storage (savePageData prefixes keys)
      writeStoreToLocalStorage(parsedStore);

      // Re-render current page(s) from storage
      router();

      // allow browser to paint and renderers to populate forms, then resume auto-save
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.__suspendAutoSave = false;
          // Recalculate and show confirmation
          runCalc();
          showSavedMessage('importMsg');
        });
      });
    } catch (err) {
      console.error('Import failed:', err);
      window.__suspendAutoSave = false;
      alert('Import failed — possibly wrong file format');
    } finally {
      // clear the file input so the same file can be re-chosen if needed
      e.target.value = '';
    }
  };

  reader.readAsText(file);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm("Are you sure you want to reset all data?")) return;

  // Clear all bp_page_* keys
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('bp_page_')) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  // Reset fields to defaults
  document.querySelectorAll('input[type="number"]').forEach(inp => inp.value = "");
  document.querySelectorAll('input[type="radio"][value="monthly"]').forEach(r => r.checked = true);

  // Refresh page + recalc
  router();
  runCalc();
});

