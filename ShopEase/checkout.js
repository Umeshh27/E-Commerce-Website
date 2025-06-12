// Checkout functionality
let currentStep = 1;
let orderData = {
    shipping: {},
    payment: {},
    items: []
};

// Sample cart items for demonstration
const sampleCartItems = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 299.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"
    }
];

// Initialize checkout
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateOrderSummary();
    setupEventListeners();
    formatCardInputs();
});

// Load cart items
function loadCartItems() {
    // In a real application, this would load from localStorage or API
    orderData.items = sampleCartItems;
    renderOrderItems();
}

// Render order items in summary
function renderOrderItems() {
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = '';
    
    orderData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${item.image}')"></div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        summaryItems.appendChild(itemElement);
    });
}

// Update order summary totals
function updateOrderSummary() {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = getShippingCost();
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingCost').textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Get shipping cost based on selected method
function getShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (!selectedShipping) return 0;
    
    switch (selectedShipping.value) {
        case 'express': return 9.99;
        case 'overnight': return 19.99;
        default: return 0;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Shipping method change
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
    
    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentForm);
    });
}

// Toggle payment form based on selected method
function togglePaymentForm() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const creditCardForm = document.getElementById('creditCardForm');
    
    if (selectedMethod === 'creditCard') {
        creditCardForm.style.display = 'block';
    } else {
        creditCardForm.style.display = 'none';
    }
}

// Format card inputs
function formatCardInputs() {
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Expiry date formatting
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // CVV formatting
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// Navigate to next step
function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        currentStep++;
        updateStepDisplay();
        
        if (currentStep === 3) {
            populateReviewSection();
        }
    }
}

// Navigate to previous step
function prevStep() {
    currentStep--;
    updateStepDisplay();
}

// Update step display
function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide sections
    document.querySelectorAll('.checkout-section-card').forEach(section => {
        section.classList.add('hidden');
    });
    
    const sections = ['shippingSection', 'paymentSection', 'reviewSection'];
    document.getElementById(sections[currentStep - 1]).classList.remove('hidden');
}

// Validate current step
function validateCurrentStep() {
    if (currentStep === 1) {
        return validateShippingForm();
    } else if (currentStep === 2) {
        return validatePaymentForm();
    }
    return true;
}

// Validate shipping form
function validateShippingForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'warning');
            element.focus();
            return false;
        }
    }
    
    // Email validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'warning');
        return false;
    }
    
    return true;
}

// Validate payment form
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedMethod === 'creditCard') {
        const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        
        for (let field of requiredFields) {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'warning');
                element.focus();
                return false;
            }
        }
        
        // Card number validation (basic)
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            showNotification('Please enter a valid card number.', 'warning');
            return false;
        }
        
        // CVV validation
        const cvv = document.getElementById('cvv').value;
        if (cvv.length < 3 || cvv.length > 4) {
            showNotification('Please enter a valid CVV.', 'warning');
            return false;
        }
    }
    
    return true;
}

// Save current step data
function saveCurrentStepData() {
    if (currentStep === 1) {
        orderData.shipping = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            method: document.querySelector('input[name="shipping"]:checked').value
        };
    } else if (currentStep === 2) {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        orderData.payment = {
            method: paymentMethod
        };
        
        if (paymentMethod === 'creditCard') {
            orderData.payment.cardNumber = document.getElementById('cardNumber').value;
            orderData.payment.expiryDate = document.getElementById('expiryDate').value;
            orderData.payment.cardName = document.getElementById('cardName').value;
        }
    }
}

// Populate review section
function populateReviewSection() {
    // Shipping review
    const shippingReview = document.getElementById('shippingReview');
    const shipping = orderData.shipping;
    const shippingMethodNames = {
        'standard': 'Standard Shipping (5-7 days)',
        'express': 'Express Shipping (2-3 days)',
        'overnight': 'Overnight Shipping (1 day)'
    };
    
    shippingReview.innerHTML = `
        <p><strong>${shipping.firstName} ${shipping.lastName}</strong></p>
        <p>${shipping.address}</p>
        <p>${shipping.city}, ${shipping.state} ${shipping.zipCode}</p>
        <p>Phone: ${shipping.phone}</p>
        <p>Email: ${shipping.email}</p>
        <p>Shipping: ${shippingMethodNames[shipping.method]}</p>
    `;
    
    // Payment review
    const paymentReview = document.getElementById('paymentReview');
    const payment = orderData.payment;
    
    if (payment.method === 'creditCard') {
        const maskedCard = payment.cardNumber.replace(/\d(?=\d{4})/g, '*');
        paymentReview.innerHTML = `
            <p><strong>Credit Card</strong></p>
            <p>${maskedCard}</p>
            <p>${payment.cardName}</p>
        `;
    } else {
        paymentReview.innerHTML = `
            <p><strong>${payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</strong></p>
        `;
    }
}

// Edit section
function editSection(section) {
    if (section === 'shipping') {
        currentStep = 1;
    } else if (section === 'payment') {
        currentStep = 2;
    }
    updateStepDisplay();
}

// Apply promo code
function applyPromo() {
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
    
    if (promoCode === 'SAVE10') {
        showNotification('Promo code applied! 10% discount added.', 'success');
        // In a real application, you would apply the discount here
    } else if (promoCode === '') {
        showNotification('Please enter a promo code.', 'warning');
    } else {
        showNotification('Invalid promo code.', 'warning');
    }
}

// Place order
function placeOrder() {
    // Simulate order processing
    showNotification('Processing your order...', 'info');
    
    setTimeout(() => {
        showNotification('Order placed successfully! You will receive a confirmation email shortly.', 'success');
        
        // Redirect to success page or home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

