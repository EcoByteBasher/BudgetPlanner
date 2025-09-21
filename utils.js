// --- Key handling ---
function pageKey(name) {
  return `bp_page_${name}`;
}

// --- Save a page's data (always pass short name, e.g. 'income') ---
export function savePageData(name, data) {
  const key = pageKey(name);
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Load a page's data ---
export function loadPageData(name) {
  const key = pageKey(name);
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

// --- Load all pages, return object keyed by short name ---
export function loadAllPages() {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('bp_page_')) {
      const short = k.replace(/^bp_page_/, '');
      try {
        out[short] = JSON.parse(localStorage.getItem(k));
      } catch {
        out[short] = null;
      }
    }
  }
  return out;
}

// --- Write full store into storage (store keyed by shortKey) ---
export function writeStoreToLocalStorage(store) {
  for (const [shortKey, data] of Object.entries(store)) {
    savePageData(shortKey, data);
  }
}

// --- Totals calculation ---
export function calculateTotals(allData) {
  let annualIncome = 0,
      annualExpense = 0;

  for (const [key, data] of Object.entries(allData)) {
    if (!data) continue;
    for (const [field, value] of Object.entries(data)) {
      if (field.endsWith('_freq')) continue;
      const freq = data[field + '_freq'] || 'monthly';
      const amount = Number(value) || 0;
      const annual = freq === 'monthly' ? amount * 12 : amount;

      if (key === 'income') {
        annualIncome += annual;
      } else {
        annualExpense += annual;
      }
    }
  }
  return { annualIncome, annualExpense };
}

// --- Sync all visible forms back to storage ---
export function syncAllPagesToStorage() {
  document.querySelectorAll('form[key]').forEach(form => {
    const shortKey = form.getAttribute('key');
    if (!shortKey) return;
    const data = collect(form);
    savePageData(shortKey, data);
  });
}

// --- Export CSV: full dataset ---
export function exportToCSV(allData) {
  let rows = [['Category', 'Field', 'Amount', 'Frequency']];
  for (const [key, data] of Object.entries(allData)) {
    if (!data) continue;
    for (const [field, value] of Object.entries(data)) {
      if (field.endsWith('_freq')) continue;
      const freq = data[field + '_freq'] || 'monthly';
      rows.push([key, field, value, freq]);
    }
  }
  return rows.map(r => r.join(',')).join('\n');
}

// --- Import CSV: clear & overwrite all ---
// --- CSV parser: returns an object keyed by shortKey (no bp_page_ prefix) ---
export function parseCSVToStore(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length <= 1) {
    throw new Error("CSV is empty");
  }

  // ✅ Check header
  const header = lines.shift().split(',').map(s => s.trim());
  const expected = ['Category', 'Field', 'Amount', 'Frequency'];
  if (header.length !== expected.length || !expected.every((h, i) => h === header[i])) {
    throw new Error("Invalid CSV header");
  }

  const store = {};
  for (const raw of lines) {
    if (!raw.trim()) continue;
    const parts = raw.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    const [catRaw, field, valRaw, freqRaw] = parts;

    if (!catRaw.startsWith('bp_page_') && !['income','housing','utilities','transport','finance','domestic','pets','social','personal'].includes(catRaw)) {
      throw new Error(`Invalid category: ${catRaw}`);
    }

    const short = catRaw.replace(/^bp_page_/, '');
    if (!store[short]) store[short] = {};

    const val = parseInt((valRaw || '').trim(), 10);
    store[short][field] = Number.isNaN(val) ? 0 : val;

    const freq = (freqRaw || 'monthly').trim().toLowerCase();
    store[short][field + '_freq'] = freq === 'annually' ? 'annually' : 'monthly';
  }
  return store;
}

export function showSavedMessage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

// --- Field renderer (shortKey ensures correct pre-fill) ---
export function field(labelText, name, shortKey = null) {
  let saved = {};
  if (shortKey) {
    const raw = localStorage.getItem(pageKey(shortKey));
    if (raw) saved = JSON.parse(raw);
  }

  const value = saved[name] ?? '';
  const freq = saved[name + '_freq'] || 'monthly';

  return `
    <div class="field-row">
      <div class="field-label">
        <label for="${name}">${labelText}</label>
      </div>
      <div class="field-input">
        <input type="number" id="${name}" name="${name}" min="0" placeholder="0" value="${value}">
      </div>
      <div class="field-freq">
        <label><input type="radio" name="${name}_freq" value="monthly" ${freq === 'monthly' ? 'checked' : ''}>Monthly</label>
        <label><input type="radio" name="${name}_freq" value="annually" ${freq === 'annually' ? 'checked' : ''}>Annually</label>
      </div>
    </div>
  `;
}

// --- Auto-save behaviour for a form ---
export function enableAutoSave(form, key) {
  if (!form) return;

  const save = () => {
    // Respect global suspend flag to avoid race conditions during import/restore
    if (window.__suspendAutoSave) return;
    const data = collect(form);
    savePageData(key, data);
  };

  // Attach listeners (they'll be no-ops while suspended)
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', save);
    input.addEventListener('change', save);
  });
}

// --- Collect values from inputs ---
export function collect(form) {
  const out = {};
  form.querySelectorAll('input').forEach(i => {
    if (!i.name) return;
    if (i.type === 'radio') {
      if (i.checked) out[i.name] = i.value;
    } else {
      out[i.name] = i.value ? Math.max(0, Math.floor(i.value)) : 0;
    }
  });
  return out;
}

// --- Populate form with existing data ---
export function populateForm(form, data) {
  if (!form || !data) return;
  for (const [k, v] of Object.entries(data)) {
    const els = form.querySelectorAll(`[name="${k}"]`);
    if (!els.length) continue;
    els.forEach(el => {
      if (el.type === 'radio') {
        el.checked = (el.value === v);
      } else {
        el.value = v;
      }
    });
  }
}

