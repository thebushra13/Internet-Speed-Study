const recentTestsTbody = document.getElementById('recent-tests');

function updateRecentTests(data) {
  // Show latest 10 entries, most recent first
  const recentEntries = data.slice(-10).reverse();

  recentTestsTbody.innerHTML = recentEntries
    .map(
      ({
        location,
        timeOfDay,
        download,
        upload,
        isp,
        notes,
      }) => `
    <tr>
      <td class="py-2 px-3 border border-gray-300">${location}</td>
      <td class="py-2 px-3 border border-gray-300">${timeOfDay}</td>
      <td class="py-2 px-3 border border-gray-300">${download.toFixed(2)}</td>
      <td class="py-2 px-3 border border-gray-300">${upload.toFixed(2)}</td>
      <td class="py-2 px-3 border border-gray-300">${isp}</td>
      <td class="py-2 px-3 border border-gray-300">${notes || ''}</td>
    </tr>
  `
    )
    .join('');
}

// Initial update on page load
window.addEventListener('load', () => {
  const data = JSON.parse(localStorage.getItem('speedTestData')) || [];
  updateRecentTests(data);
});

// Listen for data updates
window.addEventListener('dataUpdated', () => {
  const data = JSON.parse(localStorage.getItem('speedTestData')) || [];
  updateRecentTests(data);
});
