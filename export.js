const exportBtn = document.getElementById('export-csv');
const clearBtn = document.getElementById('clear-data');

exportBtn.addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('speedTestData')) || [];

  if (!data.length) {
    alert('No data to export.');
    return;
  }

  // Use PapaParse to convert to CSV
  const csv = Papa.unparse(data);

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'internet_speed_data.csv';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all saved data?')) {
    localStorage.removeItem('speedTestData');
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  }
});

