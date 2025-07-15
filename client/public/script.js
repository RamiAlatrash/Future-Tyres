// Check login status
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location.href = '/admin/login';
}

document.addEventListener("DOMContentLoaded", function() {
    // Logout
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        profileDetails.addEventListener('click', function() {
            sessionStorage.removeItem('loggedIn');
            window.location.href = '/admin/login';
        });
    }

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".sidebarBtn");
    if (sidebarBtn) {
        sidebarBtn.onclick = function() {
            sidebar.classList.toggle("active");
        }
    }

    // Sales Overview Chart (Line Chart)
    const salesCtx = document.getElementById('salesOverviewChart');
    if (salesCtx) {
        new Chart(salesCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 3000, 5000, 2300, 3100, 4000, 3500, 4800, 4200, 5500, 6000, 5300, 5800],
                    borderColor: '#11101D',
                    backgroundColor: 'rgba(17, 16, 29, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Order Status Overview Chart (Pie Chart)
    const orderCtx = document.getElementById('orderStatusChart');
    if (orderCtx) {
        new Chart(orderCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
                datasets: [{
                    label: 'Order Status',
                    data: [120, 250, 400, 600, 50],
                    backgroundColor: [
                        '#ffc107',
                        '#007bff',
                        '#17a2b8',
                        '#28a745',
                        '#dc3545'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Order Status' },
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Analytics Page Charts ---
    // Safely register the datalabels plugin only if it has been loaded
    // if (typeof ChartDataLabels !== 'undefined') {
    //     Chart.register(ChartDataLabels);
    // }

    // Order Status Distribution (for Analytics page)
    const analyticsOrderStatusCtx = document.getElementById('analyticsOrderStatusChart');
    if (analyticsOrderStatusCtx) {
        new Chart(analyticsOrderStatusCtx, {
            type: 'pie',
            data: {
                labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
                datasets: [{
                    data: [120, 250, 400, 600, 50],
                    backgroundColor: ['#ffc107', '#007bff', '#17a2b8', '#28a745', '#dc3545'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Order Status' },
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // Revenue by Product Category
    const revenueByCategoryCtx = document.getElementById('revenueByCategoryChart');
    if (revenueByCategoryCtx) {
        new Chart(revenueByCategoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['SUV Tyres', 'Batteries', 'LED Lights', 'Oils'],
                datasets: [{
                    data: [300000, 85000, 40000, 25000],
                    backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Categories' },
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: $${data.datasets[0].data[i]/1000}k`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // Sales by Payment Method
    const salesByPaymentCtx = document.getElementById('salesByPaymentMethodChart');
    if (salesByPaymentCtx) {
        new Chart(salesByPaymentCtx, {
            type: 'bar',
            data: {
                labels: ['Cash', 'Credit Card', 'Online', 'Corporate'],
                datasets: [{
                    label: 'Number of Sales',
                    data: [400, 1200, 800, 150],
                    backgroundColor: '#11101D',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Customer Type Breakdown
    const customerTypeCtx = document.getElementById('customerTypeChart');
    if (customerTypeCtx) {
        new Chart(customerTypeCtx, {
            type: 'pie',
            data: {
                labels: ['New Customers', 'Returning Customers'],
                datasets: [{
                    data: [350, 1250],
                    backgroundColor: ['#6f42c1', '#007bff'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Customer Types' },
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // Inventory Stock Levels by Category
    const inventoryLevelsCtx = document.getElementById('inventoryLevelsChart');
    if (inventoryLevelsCtx) {
        new Chart(inventoryLevelsCtx, {
            type: 'bar',
            data: {
                labels: ['Tyres', 'Accessories', 'Electronics', 'Fluids'],
                datasets: [{
                    label: 'Stock Level',
                    data: [8000, 3500, 1200, 1800],
                    backgroundColor: '#28a745',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Revenue by Region
    const revenueByRegionCtx = document.getElementById('revenueByRegionChart');
    if (revenueByRegionCtx) {
        new Chart(revenueByRegionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Online Store'],
                datasets: [{
                    data: [250000, 150000, 90000, 60000],
                    backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#20c997'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Regions' },
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: $${data.datasets[0].data[i]/1000}k`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // Expenses Breakdown
    const expensesCtx = document.getElementById('expensesChart');
    if (expensesCtx) {
        new Chart(expensesCtx, {
            type: 'pie',
            data: {
                labels: ['Marketing', 'Salaries', 'Inventory', 'Shipping'],
                datasets: [{
                    data: [50000, 120000, 250000, 35000],
                    backgroundColor: ['#17a2b8', '#6610f2', '#e83e8c', '#fd7e14'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Expenses' },
                        labels: {
                             generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: $${data.datasets[0].data[i]/1000}k`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }

    // Product Sales Share
    const productSalesShareCtx = document.getElementById('productSalesShareChart');
    if (productSalesShareCtx) {
        new Chart(productSalesShareCtx, {
            type: 'doughnut',
            data: {
                labels: ['Michelin Primacy 4', 'Goodyear Eagle F1', 'Bridgestone Turanza', 'Other'],
                datasets: [{
                    data: [25, 20, 15, 40],
                    backgroundColor: ['#007bff', '#28a745', '#17a2b8', '#6c757d'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        title: { display: true, text: 'Product Share' },
                         labels: {
                             generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    index: i
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += `${context.parsed}%`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Returns by Reason
    const returnsByReasonCtx = document.getElementById('returnsByReasonChart');
    if (returnsByReasonCtx) {
        new Chart(returnsByReasonCtx, {
            type: 'bar',
            data: {
                labels: ['Damaged', 'Wrong Item', 'Late Delivery', 'Changed Mind'],
                datasets: [{
                    label: 'Number of Returns',
                    data: [15, 25, 8, 30],
                    backgroundColor: '#dc3545',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Enhanced Email Modal Logic
    const emailModal = document.getElementById('emailModal');
    if (emailModal) { // Only run if the modal exists on the page
        const openModalBtn = document.getElementById('openEmailModalBtn');
        const closeModalBtn = emailModal.querySelector('.close-button');
        const sendEmailBtn = document.getElementById('sendEmailBtn');
        
        // Recipient fields
        const sendToAllCheckbox = document.getElementById('sendToAll');
        const manualRecipientFields = document.getElementById('manualRecipientFields');
        const recipientInput = document.getElementById('recipientInput');
        const recipientTagsContainer = document.getElementById('recipient-tags');
        const manualEmailsInput = document.getElementById('manualEmails');
        const autocompleteResults = document.getElementById('autocomplete-results');

        // New elements for UI refinement
        const recipientInputContainer = document.querySelector('.recipient-input-container');
        const addManualEmailBtn = document.getElementById('addManualEmailBtn');
        const manualEmailInputContainer = document.getElementById('manualEmailInputContainer');

        let allCustomerEmails = [];
        let selectedRecipients = new Set();
        
        // Initialize Quill Editor
        const quill = new Quill('#emailEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'link'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                ]
            }
        });

        function getCustomerEmailsFromTable() {
            const emailCells = document.querySelectorAll('.customers-table tbody tr td:nth-child(3)');
            return Array.from(emailCells).map(cell => cell.textContent.trim());
        }

        function renderTags() {
            recipientTagsContainer.innerHTML = '';
            selectedRecipients.forEach(email => {
                const tag = document.createElement('span');
                tag.className = 'recipient-tag';
                tag.textContent = email;
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-tag';
                removeBtn.innerHTML = '&times;';
                removeBtn.onclick = () => {
                    selectedRecipients.delete(email);
                    renderTags();
                };
                tag.appendChild(removeBtn);
                recipientTagsContainer.appendChild(tag);
            });
        }

        function showAutocomplete(query) {
            autocompleteResults.innerHTML = '';
            if (!query) return;

            const filteredEmails = allCustomerEmails.filter(email => 
                email.toLowerCase().includes(query.toLowerCase()) && !selectedRecipients.has(email)
            );

            filteredEmails.slice(0, 5).forEach(email => { // Show top 5 matches
                const div = document.createElement('div');
                div.textContent = email;
                div.onclick = () => {
                    selectedRecipients.add(email);
                    renderTags();
                    recipientInput.value = '';
                    autocompleteResults.innerHTML = '';
                };
                autocompleteResults.appendChild(div);
            });
        }

        if (recipientInputContainer) {
            recipientInputContainer.addEventListener('click', () => recipientInput.focus());
        }

        if (recipientInput) {
            recipientInput.addEventListener('keyup', (e) => showAutocomplete(e.target.value));
        }

        if (sendToAllCheckbox) {
            sendToAllCheckbox.addEventListener('change', function() {
                manualRecipientFields.style.display = this.checked ? 'none' : 'block';
            });
        }

        if (addManualEmailBtn) {
            addManualEmailBtn.addEventListener('click', () => {
                const isVisible = manualEmailInputContainer.style.display === 'block';
                manualEmailInputContainer.style.display = isVisible ? 'none' : 'block';
            });
        }

        if (openModalBtn) {
            openModalBtn.onclick = function() {
                allCustomerEmails = getCustomerEmailsFromTable();
                emailModal.style.display = 'block';
            }
        }

        if (closeModalBtn) {
            closeModalBtn.onclick = function() {
                emailModal.style.display = 'none';
                manualEmailInputContainer.style.display = 'none'; // Reset UI state
            }
        }

        window.addEventListener('click', function(event) {
            if (event.target == emailModal) {
                emailModal.style.display = 'none';
                manualEmailInputContainer.style.display = 'none'; // Reset UI state
            }
        });

        function sendAdvertisementEmail(recipients, subject, message) {
            console.log("Sending email...");
            console.log("Recipients:", recipients);
            console.log("Subject:", subject);
            console.log("Message Content:", message);

            if ((recipients.sendToAll || recipients.list.length > 0) && subject && message.length > 10) { // Simple validation
                alert('Advertisement email sent successfully!');
                return true;
            } else {
                alert('Error: Please specify recipients, a subject, and a message.');
                return false;
            }
        }

        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', function() {
                const subject = document.getElementById('emailSubject').value;
                const message = quill.root.innerHTML;
                
                let finalRecipients = {
                    sendToAll: sendToAllCheckbox.checked,
                    list: []
                };

                if (!sendToAllCheckbox.checked) {
                    const manualEmails = manualEmailsInput.value.split(',')
                        .map(e => e.trim())
                        .filter(e => e);
                    finalRecipients.list = [...new Set([...selectedRecipients, ...manualEmails])];
                }

                if (sendAdvertisementEmail(finalRecipients, subject, message)) {
                    emailModal.style.display = 'none';
                    // Reset form
                    selectedRecipients.clear();
                    renderTags();
                    manualEmailsInput.value = '';
                    recipientInput.value = '';
                    document.getElementById('emailSubject').value = '';
                    quill.setContents([]);
                    sendToAllCheckbox.checked = false;
                    manualRecipientFields.style.display = 'block';
                    manualEmailInputContainer.style.display = 'none'; // Reset UI state
                }
            });
        }
    }

    // Order Status Filtering Logic
    const filterButtons = document.querySelectorAll('.order-status-bar .status-btn');
    const orderRows = document.querySelectorAll('.orders-table tbody tr');

    if (filterButtons.length > 0 && orderRows.length > 0) {
        // Set "All" as active by default
        filterButtons.forEach(button => {
            if (button.dataset.status === 'all') {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });


        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const selectedStatus = this.dataset.status;

                // Filter rows
                orderRows.forEach(row => {
                    if (selectedStatus === 'all' || row.dataset.status === selectedStatus) {
                        row.style.display = ''; // Show row
                    } else {
                        row.style.display = 'none'; // Hide row
                    }
                });
            });
        });
    }

    // Product Import Modal Logic
    const importModal = document.getElementById('importModal');
    if (importModal) {
        const openBtn = document.getElementById('openImportModalBtn');
        const closeBtn = importModal.querySelector('.close-button');
        const uploadBtn = document.getElementById('uploadCsvBtn');
        const fileInput = document.getElementById('csvFile');

        openBtn.onclick = () => {
            importModal.style.display = 'block';
        };

        closeBtn.onclick = () => {
            importModal.style.display = 'none';
        };

        window.addEventListener('click', (event) => {
            if (event.target == importModal) {
                importModal.style.display = 'none';
            }
        });
        
        uploadBtn.onclick = () => {
            if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                return;
            }
            const file = fileInput.files[0];
            console.log(`Simulating upload for: ${file.name}`);
            // In a real application, you would parse the CSV here
            // and update the product table.
            alert(`Successfully imported products from ${file.name}!`);
            importModal.style.display = 'none';
            fileInput.value = ''; // Reset the input
        };
    }

    // Add Product Modal Logic
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
        const openBtn = document.getElementById('openAddProductModalBtn');
        const closeBtn = addProductModal.querySelector('.close-button');
        const addProductForm = document.getElementById('addProductForm');
        
        openBtn.onclick = () => {
            addProductModal.style.display = 'block';
        };

        closeBtn.onclick = () => {
            addProductModal.style.display = 'none';
        };

        window.addEventListener('click', (event) => {
            if (event.target == addProductModal) {
                addProductModal.style.display = 'none';
            }
        });

        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('productName').value;
            const description = document.getElementById('productDescription').value;
            const category = document.getElementById('productCategory').value;
            const location = document.getElementById('productLocation').value;
            const sku = document.getElementById('productSku').value;
            const stock = document.getElementById('productStock').value;
            const price = parseFloat(document.getElementById('productPrice').value).toFixed(2);
            const status = document.getElementById('productStatus').value;
            const images = document.getElementById('productImages').value ? 1 : 0; // Simple check for now

            const tableBody = document.querySelector('.products-table tbody');
            const newRow = document.createElement('tr');
            
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${description}</td>
                <td>${category}</td>
                <td>${location}</td>
                <td>${sku}</td>
                <td>${stock}</td>
                <td>$${price}</td>
                <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                <td>${images}</td>
                <td>
                    <button class="action-btn edit"><i class='bx bx-edit'></i></button>
                    <button class="action-btn delete"><i class='bx bx-trash'></i></button>
                </td>
            `;
            
            tableBody.appendChild(newRow);
            
            addProductModal.style.display = 'none';
            addProductForm.reset();
        });
    }

    // Category filtering logic
    const categoryFilterInput = document.getElementById('categoryFilterInput');
    if(categoryFilterInput) {
        categoryFilterInput.addEventListener('keyup', function() {
            const filterValue = this.value.toLowerCase();
            const productRows = document.querySelectorAll('.products-table tbody tr');

            productRows.forEach(row => {
                const categoryCell = row.querySelector('td:nth-child(3)');
                if (categoryCell) {
                    const categoryText = categoryCell.textContent.toLowerCase();
                    if (categoryText.includes(filterValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Location filtering logic for inventory page
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            const selectedLocation = this.value;
            const inventoryRows = document.querySelectorAll('.inventory-table tbody tr');

            inventoryRows.forEach(row => {
                const locationCell = row.querySelector('td:nth-child(5)'); // 5th cell is Location
                if (locationCell) {
                    if (selectedLocation === 'all' || locationCell.textContent === selectedLocation) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Product Deletion Logic
    const productsTable = document.querySelector('.products-table');
    if (productsTable) {
        productsTable.addEventListener('click', function(event) {
            const deleteButton = event.target.closest('.action-btn.delete');
            if (deleteButton) {
                const productRow = deleteButton.closest('tr');
                const productName = productRow.querySelector('td').textContent.trim();

                if (confirm(`Are you sure you want to delete the product "${productName}"?`)) {
                    productRow.remove();
                    console.log(`Product "${productName}" removed from the table.`);
                }
            }
        });
    }
}); 