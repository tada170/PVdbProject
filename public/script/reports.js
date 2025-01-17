window.onload = async () => {
    try {
        const response = await fetch('/reports');
        if (!response.ok) {
            throw new Error('Failed to fetch product statistics');
        }

        const data = await response.json();


        const tbody = document.querySelector('#product-table tbody');
        tbody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data[0].TotalNumberOfProducts || 'N/A'}</td>
            <td>${data[0].CategoryWithMostProducts || 'N/A'}</td>
            <td>${data[0].MostExpensiveProduct || 'N/A'}</td>
        `;

        tbody.appendChild(row);
    } catch (error) {
        console.error('Error fetching product statistics:', error);

        // Zobrazení chybové zprávy
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = 'Error loading product statistics. Please try again later.';
        messageContainer.style.color = 'red';
    }
};
