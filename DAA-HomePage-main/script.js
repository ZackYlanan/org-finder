document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners(); //  sets up search, dropdown, buttons
  const orgs = await fetchOrganizations(); // fetches all organization data from the backend
  initializeFilters(orgs); // extracts unique classification and department values to build filter buttons
  renderTable(orgs); // displays the initial list of organizations in a table
});

async function fetchOrganizations(params = {}) { // Fetches organizations from our express server
  const query = new URLSearchParams({
    search: params.search || '',
    classification: params.classification || '',
    department: params.department || ''
  }).toString();

  const res = await fetch(`/organizations?${query}`);
  return res.json();
}

// quicksort manual implementation

function quicksort(array, key) {
  if(array.length <=1) return array;

  const pivot = array[array.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < array.length - 1; i++) {
    if(array[i][key].toLowerCase() < pivot[key].toLowerCase()) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }

  return[...quicksort(left, key), pivot, ...quicksort(right, key)];
}

function renderTable(orgs, sortKey = null, sortOrder = 'asc') {
  const tbody = document.getElementById('organizations-table-body');
  tbody.innerHTML = '';

  if (sortKey) {
    orgs = quicksort(orgs, sortKey);
    if (sortOrder === 'desc') orgs.reverse();
  }

  if (orgs.length === 0) { // Displays a message if there are no results.
    tbody.innerHTML = '<tr><td colspan="6">No results found.</td></tr>';
    return;
  }

  orgs.forEach(org => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${org.controlNumber}</td>
      <td>${org.name}</td>
      <td>${org.classification}</td>
      <td>${org.department}</td>
      <td>${org.branch}</td>
      <td>${org.type}</td>
    `;
    tbody.appendChild(row);
  });
}

// Dynamically creates filter buttons for each unique classification and department.
function initializeFilters(orgs) {
  const classifications = [...new Set(orgs.map(o => o.classification))];
  const departments = [...new Set(orgs.map(o => o.department))];

  const classContainer = document.getElementById('classification-filters');
  const deptContainer = document.getElementById('department-filters');

  classifications.forEach(classification => {
    const btn = document.createElement('button');
    btn.classList.add('filter-btn', 'classification');
    btn.textContent = classification;
    btn.dataset.value = classification;
    classContainer.appendChild(btn);
  });

  departments.forEach(dept => {
    const btn = document.createElement('button');
    btn.classList.add('filter-btn', 'department');
    btn.textContent = dept;
    btn.dataset.value = dept;
    deptContainer.appendChild(btn);
  });

  setupDynamicListeners();
}

// Connects UI interactions
function setupEventListeners() {
  document.getElementById('search-input').addEventListener('input', applyFilters); // Typing in the search bar
  document.getElementById('sort-select').addEventListener('change', applyFilters); // Changing the sort dropdown
  document.getElementById('clear-filters').addEventListener('click', () => { // Clear all button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('search-input').value = '';
    document.getElementById('sort-select').value = 'default';
    fetchOrganizations().then(renderTable);
  });
}

function setupDynamicListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.classList.contains('classification') ? 'classification' : 'department';
      document.querySelectorAll(`.filter-btn.${group}`).forEach(b => b.classList.remove('active'));
      btn.classList.toggle('active');
      applyFilters();
    });
  });
}

/*
async function applyFilters() {
  const classification = document.querySelector('.filter-btn.classification.active')?.dataset.value || '';
  const department = document.querySelector('.filter-btn.department.active')?.dataset.value || '';
  const search = document.getElementById('search-input').value.trim();
  const sortValue = document.getElementById('sort-select').value;

  let sortKey = null;
  let sortOrder = 'asc';

  if (sortValue !== 'default') {
    sortKey = sortValue.includes('name') ? 'name' : sortValue;
    sortOrder = sortValue.endsWith('-desc') ? 'desc' : 'asc';
  }

  const orgs = await fetchOrganizations({ search, classification, department });
  renderTable(orgs, sortKey, sortOrder);
}*/

//LINEAR SEARCH ALGORITHM
function linearSearchFilter(orgs, search, classification, department) {
  // This function performs a linear search to filter organizations
  return orgs.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());
    const matchesClassification = !classification || org.classification === classification;
    const matchesDepartment = !department || org.department === department;
    return matchesSearch && matchesClassification && matchesDepartment;
  });
}


//try with console.log
async function applyFilters() {
  const classification = document.querySelector('.filter-btn.classification.active')?.dataset.value || '';
  const department = document.querySelector('.filter-btn.department.active')?.dataset.value || '';
  const search = document.getElementById('search-input').value.trim();
  const sort = document.getElementById('sort-select').value;

  const allOrgs = await fetchOrganizations();

  // LINEAR SEARCH: Filtering
  const filtered = linearSearchFilter(allOrgs, search, classification, department);

  const sortBy = sort.includes('name') ? 'name' : sort;
  const sortOrder = sort.endsWith('-desc') ? 'desc' : 'asc';

  let sortedOrgs = filtered;
  if (sortBy !== 'default') {
    sortedOrgs = quicksort(filtered, sortBy);
    if (sortOrder === 'desc') sortedOrgs.reverse();
  }

  console.log("After sorting:", sortedOrgs);

  // Only pass the array, not sortKey/sortOrder, since it's already sorted
  renderTable(sortedOrgs);
}