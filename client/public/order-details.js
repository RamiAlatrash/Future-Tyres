document.addEventListener("DOMContentLoaded", function() {
    const mockOrderData = {
        '#1035': {
            id: '#1035',
            customer: 'David Miller',
            email: 'david.miller@example.com',
            phone: '(111) 222-3333',
            status: 'shipped',
            items: [
                { name: 'Michelin Primacy 4', sku: 'TY-MP4-205', price: 150.00, qty: 3, total: 450.00 }
            ],
            subtotal: 450.00,
            shipping: 0.00,
            total: 450.00,
            date: '2023-10-27',
            tracking: 'TRK12345678',
            shippingAddress: '123 Shipping Ln, City, State, 12345',
            billingAddress: '123 Billing Rd, City, State, 12345',
            timeline: [
                { icon: 'bx-package', text: 'Order was placed', time: 'Oct 27, 2023, 10:00 AM' },
                { icon: 'bx-credit-card', text: 'Payment was confirmed', time: 'Oct 27, 2023, 10:05 AM' },
                { icon: 'bx-trip', text: 'Order was shipped', time: 'Oct 27, 2023, 4:30 PM' }
            ]
        },
        // Add more mock data for other orders as needed
    };

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const order = mockOrderData[orderId] || { status: 'Not Found', timeline: [], items: [] };

    // Populate header
    document.getElementById('order-id-header').textContent = `Order ${order.id || 'N/A'}`;
    const statusBadge = document.getElementById('order-status-badge');
    statusBadge.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    statusBadge.className = `status ${order.status}`;

    // Populate tracking info
    const trackingInfo = document.getElementById('tracking-info');
    if (order.tracking) {
        trackingInfo.innerHTML = `<p>Tracking #: <a href="#">${order.tracking}</a></p>`;
    } else {
        trackingInfo.innerHTML = `<p>No tracking information available.</p>`;
    }

    // Populate items table
    const itemsTbody = document.getElementById('order-items-tbody');
    itemsTbody.innerHTML = '';
    order.items.forEach(item => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.sku}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>$${item.total.toFixed(2)}</td>
        </tr>`;
        itemsTbody.innerHTML += row;
    });

    // Populate summary
    document.getElementById('subtotal').textContent = `$${(order.subtotal || 0).toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${(order.shipping || 0).toFixed(2)}`;
    document.getElementById('total').textContent = `$${(order.total || 0).toFixed(2)}`;

    // Populate customer info
    document.getElementById('customer-name').textContent = order.customer || 'N/A';
    document.getElementById('customer-email').textContent = order.email || 'N/A';
    document.getElementById('customer-phone').textContent = order.phone || 'N/A';
    document.getElementById('shipping-address').innerHTML = (order.shippingAddress || 'N/A').replace(/, /g, '<br>');
    document.getElementById('billing-address').innerHTML = (order.billingAddress || 'N/A').replace(/, /g, '<br>');

    // Populate timeline
    const timelineContainer = document.getElementById('order-timeline');
    timelineContainer.innerHTML = '';
    order.timeline.forEach(event => {
        const item = `<div class="timeline-item">
            <div class="timeline-icon"><i class='bx ${event.icon}'></i></div>
            <div class="timeline-content">
                <p>${event.text}</p>
                <span>${event.time}</span>
            </div>
        </div>`;
        timelineContainer.innerHTML += item;
    });
}); 