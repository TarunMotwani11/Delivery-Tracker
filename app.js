// Application Data
let appData = {
  users: [
    {"id": 1, "name": "Admin", "email": "admin@petshop.com", "password": "admin123", "role": "admin"},
    {"id": 2, "name": "John Driver", "email": "john@delivery.com", "password": "driver123", "role": "driver"},
    {"id": 3, "name": "Sara Driver", "email": "sara@delivery.com", "password": "driver123", "role": "driver"}
  ],
  dealers: [
    {"id": 1, "name": "Pet Paradise Store", "address": "45 Main Street, Downtown", "phone": "+91-9876543210", "dateAdded": "2024-01-15"},
    {"id": 2, "name": "Happy Paws Retail", "address": "78 Park Avenue, Suburbs", "phone": "+91-9876543211", "dateAdded": "2024-02-20"},
    {"id": 3, "name": "Animal Care Center", "address": "123 Medical Road, City Center", "phone": "+91-9876543212", "dateAdded": "2024-03-10"},
    {"id": 4, "name": "Pet World Express", "address": "56 Commerce Street, Mall Area", "phone": "+91-9876543213", "dateAdded": "2024-04-05"},
    {"id": 5, "name": "Furry Friends Shop", "address": "89 Residential Block, East Side", "phone": "+91-9876543214", "dateAdded": "2024-05-12"}
  ],
  products: [
    {"id": 1, "name": "Dog Medicine", "defaultPrice": 200, "category": "Medicine"},
    {"id": 2, "name": "Cat Food Premium", "defaultPrice": 350, "category": "Food"},
    {"id": 3, "name": "Dog Collar Leather", "defaultPrice": 150, "category": "Accessories"},
    {"id": 4, "name": "Bird Seeds Mix", "defaultPrice": 80, "category": "Food"},
    {"id": 5, "name": "Fish Tank Cleaner", "defaultPrice": 120, "category": "Accessories"},
    {"id": 6, "name": "Pet Vitamins", "defaultPrice": 180, "category": "Medicine"},
    {"id": 7, "name": "Dog Shampoo", "defaultPrice": 95, "category": "Grooming"},
    {"id": 8, "name": "Cat Litter Premium", "defaultPrice": 250, "category": "Accessories"}
  ],
  deliveries: [
    {"id": 1, "dealerId": 1, "productIds": [1, 6], "agreedPrice": 370, "deliveryAddress": "45 Main Street, Downtown", "date": "2024-07-30", "status": "delivered", "assignedTo": "John Driver", "notes": "Delivered successfully"},
    {"id": 2, "dealerId": 2, "productIds": [2], "agreedPrice": 340, "deliveryAddress": "78 Park Avenue, Suburbs", "date": "2024-07-31", "status": "pending", "assignedTo": "Sara Driver", "notes": ""},
    {"id": 3, "dealerId": 3, "productIds": [3, 7], "agreedPrice": 240, "deliveryAddress": "123 Medical Road, City Center", "date": "2024-08-01", "status": "in-progress", "assignedTo": "John Driver", "notes": "Out for delivery"},
    {"id": 4, "dealerId": 4, "productIds": [4, 5], "agreedPrice": 190, "deliveryAddress": "56 Commerce Street, Mall Area", "date": "2024-08-01", "status": "pending", "assignedTo": "Sara Driver", "notes": ""},
    {"id": 5, "dealerId": 1, "productIds": [8], "agreedPrice": 240, "deliveryAddress": "45 Main Street, Downtown", "date": "2024-07-28", "status": "delivered", "assignedTo": "John Driver", "notes": "Repeat customer"}
  ]
};

// Current user state
let currentUser = null;
let currentView = 'overview';
let editingDealer = null;
let editingProduct = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized');
  initializeApp();
});

function initializeApp() {
  // Show login screen by default
  showScreen('login-screen');
  
  // Bind event listeners
  bindLoginEvents();
  bindAdminEvents();
  bindDriverEvents();
  bindModalEvents();
  
  console.log('All event listeners bound');
}

// Screen Management
function showScreen(screenId) {
  const screens = ['login-screen', 'admin-dashboard', 'driver-dashboard'];
  screens.forEach(screen => {
    const element = document.getElementById(screen);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    console.log('Showing screen:', screenId);
  }
}

function showView(viewId) {
  const views = ['overview-view', 'dealers-view', 'products-view', 'deliveries-view', 'add-delivery-view'];
  views.forEach(view => {
    const element = document.getElementById(view);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.remove('hidden');
  }
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const targetNav = document.querySelector(`[data-view="${viewId.replace('-view', '')}"]`);
  if (targetNav) {
    targetNav.classList.add('active');
  }
  
  currentView = viewId;
  console.log('Showing view:', viewId);
}

// Login Events
function bindLoginEvents() {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const driverLogoutBtn = document.getElementById('driver-logout-btn');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('Login form event bound');
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  if (driverLogoutBtn) {
    driverLogoutBtn.addEventListener('click', handleLogout);
  }
}

function handleLogin(e) {
  e.preventDefault();
  console.log('Login form submitted');
  
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const errorDiv = document.getElementById('login-error');
  
  if (!emailField || !passwordField) {
    console.error('Email or password field not found');
    return;
  }
  
  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  
  console.log('Login attempt:', email);
  
  // Clear previous error
  if (errorDiv) {
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
  }
  
  // Validate input
  if (!email || !password) {
    showLoginError('Please enter both email and password');
    return;
  }
  
  // Find user
  const user = appData.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('Login successful for:', user.name);
    currentUser = user;
    
    if (user.role === 'admin') {
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = user.name;
      }
      showScreen('admin-dashboard');
      showView('overview-view');
      loadOverviewData();
    } else if (user.role === 'driver') {
      const driverNameElement = document.getElementById('driver-name');
      if (driverNameElement) {
        driverNameElement.textContent = user.name;
      }
      showScreen('driver-dashboard');
      loadDriverDeliveries();
    }
  } else {
    console.log('Login failed - invalid credentials');
    showLoginError('Invalid email or password. Please check your credentials.');
  }
}

function showLoginError(message) {
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }
}

function handleLogout() {
  console.log('Logging out');
  currentUser = null;
  showScreen('login-screen');
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.reset();
  }
  
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

// Admin Events
function bindAdminEvents() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const view = this.dataset.view;
      showView(view + '-view');
      
      // Load data for specific views
      switch(view) {
        case 'overview':
          loadOverviewData();
          break;
        case 'dealers':
          loadDealersData();
          break;
        case 'products':
          loadProductsData();
          break;
        case 'deliveries':
          loadDeliveriesData();
          break;
        case 'add-delivery':
          loadAddDeliveryForm();
          break;
      }
    });
  });
  
  // Add buttons
  const addDealerBtn = document.getElementById('add-dealer-btn');
  const addProductBtn = document.getElementById('add-product-btn');
  
  if (addDealerBtn) {
    addDealerBtn.addEventListener('click', () => openDealerModal());
  }
  
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => openProductModal());
  }
  
  // Forms
  const addDeliveryForm = document.getElementById('add-delivery-form');
  const cancelDeliveryBtn = document.getElementById('cancel-delivery');
  
  if (addDeliveryForm) {
    addDeliveryForm.addEventListener('submit', handleAddDelivery);
  }
  
  if (cancelDeliveryBtn) {
    cancelDeliveryBtn.addEventListener('click', () => showView('deliveries-view'));
  }
  
  // Filters
  const deliverySearch = document.getElementById('delivery-search');
  const statusFilter = document.getElementById('status-filter');
  
  if (deliverySearch) {
    deliverySearch.addEventListener('input', filterDeliveries);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', filterDeliveries);
  }
}

// Overview Data
function loadOverviewData() {
  const totalDealers = appData.dealers.length;
  const pendingDeliveries = appData.deliveries.filter(d => d.status === 'pending').length;
  const today = '2024-08-01'; // Using current date from the scenario
  const completedToday = appData.deliveries.filter(d => d.status === 'delivered' && d.date === today).length;
  const totalRevenue = appData.deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.agreedPrice, 0);
  
  const elements = {
    'total-dealers': totalDealers,
    'pending-deliveries': pendingDeliveries,
    'completed-today': completedToday,
    'total-revenue': `₹${totalRevenue.toLocaleString()}`
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
  
  loadRecentDeliveries();
}

function loadRecentDeliveries() {
  const recentDeliveries = appData.deliveries.slice(-5).reverse();
  const container = document.getElementById('recent-deliveries-list');
  
  if (container) {
    container.innerHTML = recentDeliveries.map(delivery => {
      const dealer = appData.dealers.find(d => d.id === delivery.dealerId);
      const products = delivery.productIds.map(id => 
        appData.products.find(p => p.id === id)?.name
      ).join(', ');
      
      return `
        <div class="recent-delivery-item">
          <div class="recent-delivery-info">
            <h4>${dealer?.name || 'Unknown Dealer'}</h4>
            <p>${products}</p>
          </div>
          <div class="recent-delivery-price">₹${delivery.agreedPrice}</div>
          <div class="status-pill ${delivery.status}">${delivery.status}</div>
        </div>
      `;
    }).join('');
  }
}

// Dealers Management
function loadDealersData() {
  const tbody = document.getElementById('dealers-table-body');
  if (tbody) {
    tbody.innerHTML = appData.dealers.map(dealer => `
      <tr>
        <td>${dealer.name}</td>
        <td>${dealer.address}</td>
        <td>${dealer.phone}</td>
        <td>${formatDate(dealer.dateAdded)}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editDealer(${dealer.id})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteDealer(${dealer.id})">Delete</button>
          <button class="action-btn view-btn" onclick="viewDealerHistory(${dealer.id})">History</button>
        </td>
      </tr>
    `).join('');
  }
}

function editDealer(id) {
  const dealer = appData.dealers.find(d => d.id === id);
  if (dealer) {
    editingDealer = dealer;
    openDealerModal(dealer);
  }
}

function deleteDealer(id) {
  if (confirm('Are you sure you want to delete this dealer?')) {
    appData.dealers = appData.dealers.filter(d => d.id !== id);
    loadDealersData();
  }
}

function viewDealerHistory(id) {
  const dealer = appData.dealers.find(d => d.id === id);
  const dealerDeliveries = appData.deliveries.filter(d => d.dealerId === id);
  
  if (dealer) {
    alert(`${dealer.name} - Order History:\n\n${dealerDeliveries.map(d => 
      `Date: ${d.date}, Price: ₹${d.agreedPrice}, Status: ${d.status}`
    ).join('\n')}`);
  }
}

// Products Management
function loadProductsData() {
  const tbody = document.getElementById('products-table-body');
  if (tbody) {
    tbody.innerHTML = appData.products.map(product => `
      <tr>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₹${product.defaultPrice}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }
}

function editProduct(id) {
  const product = appData.products.find(p => p.id === id);
  if (product) {
    editingProduct = product;
    openProductModal(product);
  }
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    appData.products = appData.products.filter(p => p.id !== id);
    loadProductsData();
  }
}

// Deliveries Management
function loadDeliveriesData() {
  renderDeliveries(appData.deliveries);
}

function renderDeliveries(deliveries) {
  const tbody = document.getElementById('deliveries-table-body');
  if (tbody) {
    tbody.innerHTML = deliveries.map(delivery => {
      const dealer = appData.dealers.find(d => d.id === delivery.dealerId);
      const products = delivery.productIds.map(id => 
        appData.products.find(p => p.id === id)?.name
      ).join(', ');
      
      return `
        <tr>
          <td>#${delivery.id}</td>
          <td>${dealer?.name || 'Unknown'}</td>
          <td>${products}</td>
          <td>₹${delivery.agreedPrice}</td>
          <td>${formatDate(delivery.date)}</td>
          <td><span class="status-pill ${delivery.status}">${delivery.status}</span></td>
          <td>${delivery.assignedTo}</td>
        </tr>
      `;
    }).join('');
  }
}

function filterDeliveries() {
  const searchField = document.getElementById('delivery-search');
  const statusField = document.getElementById('status-filter');
  
  const searchTerm = searchField ? searchField.value.toLowerCase() : '';
  const statusFilter = statusField ? statusField.value : '';
  
  let filteredDeliveries = appData.deliveries;
  
  if (searchTerm) {
    filteredDeliveries = filteredDeliveries.filter(delivery => {
      const dealer = appData.dealers.find(d => d.id === delivery.dealerId);
      const products = delivery.productIds.map(id => 
        appData.products.find(p => p.id === id)?.name
      ).join(' ');
      
      return dealer?.name.toLowerCase().includes(searchTerm) ||
             products.toLowerCase().includes(searchTerm) ||
             delivery.assignedTo.toLowerCase().includes(searchTerm);
    });
  }
  
  if (statusFilter) {
    filteredDeliveries = filteredDeliveries.filter(d => d.status === statusFilter);
  }
  
  renderDeliveries(filteredDeliveries);
}

// Add Delivery Form
function loadAddDeliveryForm() {
  const dealerSelect = document.getElementById('delivery-dealer');
  const driverSelect = document.getElementById('assigned-driver');
  const productsContainer = document.getElementById('products-selection');
  
  if (dealerSelect) {
    // Populate dealers
    dealerSelect.innerHTML = '<option value="">Choose dealer...</option>' +
      appData.dealers.map(dealer => 
        `<option value="${dealer.id}">${dealer.name}</option>`
      ).join('');
    
    // Auto-fill address when dealer is selected
    dealerSelect.addEventListener('change', function() {
      const dealer = appData.dealers.find(d => d.id == this.value);
      const addressField = document.getElementById('delivery-address');
      if (dealer && addressField) {
        addressField.value = dealer.address;
      }
    });
  }
  
  if (driverSelect) {
    // Populate drivers
    const drivers = appData.users.filter(u => u.role === 'driver');
    driverSelect.innerHTML = '<option value="">Choose driver...</option>' +
      drivers.map(driver => 
        `<option value="${driver.name}">${driver.name}</option>`
      ).join('');
  }
  
  if (productsContainer) {
    // Populate products
    productsContainer.innerHTML = appData.products.map(product => `
      <div class="product-option">
        <input type="checkbox" id="product-${product.id}" name="products" value="${product.id}">
        <label for="product-${product.id}">${product.name} (₹${product.defaultPrice})</label>
      </div>
    `).join('');
    
    // Calculate total price when products are selected
    document.querySelectorAll('input[name="products"]').forEach(checkbox => {
      checkbox.addEventListener('change', calculateTotalPrice);
    });
  }
  
  // Set today's date as default
  const deliveryDateField = document.getElementById('delivery-date');
  if (deliveryDateField) {
    deliveryDateField.value = '2024-08-01'; // Using current date from scenario
  }
}

function calculateTotalPrice() {
  const selectedProducts = document.querySelectorAll('input[name="products"]:checked');
  let total = 0;
  
  selectedProducts.forEach(checkbox => {
    const product = appData.products.find(p => p.id == checkbox.value);
    if (product) {
      total += product.defaultPrice;
    }
  });
  
  const priceField = document.getElementById('agreed-price');
  if (priceField) {
    priceField.value = total;
  }
}

function handleAddDelivery(e) {
  e.preventDefault();
  
  const dealerField = document.getElementById('delivery-dealer');
  const selectedProducts = Array.from(document.querySelectorAll('input[name="products"]:checked'))
    .map(cb => parseInt(cb.value));
  const priceField = document.getElementById('agreed-price');
  const addressField = document.getElementById('delivery-address');
  const dateField = document.getElementById('delivery-date');
  const driverField = document.getElementById('assigned-driver');
  
  const dealerId = dealerField ? parseInt(dealerField.value) : null;
  const agreedPrice = priceField ? parseInt(priceField.value) : null;
  const deliveryAddress = addressField ? addressField.value : '';
  const deliveryDate = dateField ? dateField.value : '';
  const assignedDriver = driverField ? driverField.value : '';
  
  if (!dealerId || selectedProducts.length === 0 || !agreedPrice || !deliveryAddress || !deliveryDate || !assignedDriver) {
    alert('Please fill in all required fields');
    return;
  }
  
  const newDelivery = {
    id: Math.max(...appData.deliveries.map(d => d.id)) + 1,
    dealerId,
    productIds: selectedProducts,
    agreedPrice,
    deliveryAddress,
    date: deliveryDate,
    status: 'pending',
    assignedTo: assignedDriver,
    notes: ''
  };
  
  appData.deliveries.push(newDelivery);
  
  alert('Delivery created successfully!');
  document.getElementById('add-delivery-form').reset();
  showView('deliveries-view');
  loadDeliveriesData();
}

// Driver Events
function bindDriverEvents() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      loadDriverDeliveries(filter);
    });
  });
}

function loadDriverDeliveries(filter = 'today') {
  if (!currentUser) return;
  
  let deliveries = appData.deliveries.filter(d => d.assignedTo === currentUser.name);
  
  const today = '2024-08-01'; // Using current date from scenario
  
  switch(filter) {
    case 'today':
      deliveries = deliveries.filter(d => d.date === today);
      break;
    case 'pending':
      deliveries = deliveries.filter(d => d.status === 'pending' || d.status === 'in-progress');
      break;
    case 'all':
      // No additional filtering
      break;
  }
  
  renderDriverDeliveries(deliveries);
}

function renderDriverDeliveries(deliveries) {
  const container = document.getElementById('driver-deliveries');
  
  if (!container) return;
  
  if (deliveries.length === 0) {
    container.innerHTML = '<p class="text-center">No deliveries found</p>';
    return;
  }
  
  container.innerHTML = deliveries.map(delivery => {
    const dealer = appData.dealers.find(d => d.id === delivery.dealerId);
    const products = delivery.productIds.map(id => 
      appData.products.find(p => p.id === id)?.name
    ).join(', ');
    
    return `
      <div class="delivery-card">
        <div class="delivery-header">
          <div class="delivery-id">#${delivery.id}</div>
          <div class="status-pill ${delivery.status}">${delivery.status}</div>
        </div>
        <div class="delivery-info">
          <h3>${dealer?.name || 'Unknown Dealer'}</h3>
          <p><strong>Products:</strong> ${products}</p>
          <p><strong>Address:</strong> ${delivery.deliveryAddress}</p>
          <p><strong>Date:</strong> ${formatDate(delivery.date)}</p>
          <div class="delivery-price">₹${delivery.agreedPrice}</div>
        </div>
        <div class="delivery-actions">
          <button class="btn copy-address-btn" onclick="copyAddress('${delivery.deliveryAddress.replace(/'/g, "\\'")}')">
            Copy Address
          </button>
          ${delivery.status !== 'delivered' ? 
            `<button class="btn mark-delivered-btn" onclick="markDelivered(${delivery.id})">
              Mark Delivered
            </button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function copyAddress(address) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(address).then(() => {
      alert('Address copied to clipboard!');
    }).catch(() => {
      alert('Could not copy address');
    });
  } else {
    alert('Address: ' + address);
  }
}

function markDelivered(deliveryId) {
  if (confirm('Mark this delivery as completed?')) {
    const delivery = appData.deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      delivery.status = 'delivered';
      delivery.notes = 'Delivered by driver';
      const activeFilter = document.querySelector('.filter-btn.active');
      const filter = activeFilter ? activeFilter.dataset.filter : 'today';
      loadDriverDeliveries(filter);
    }
  }
}

// Modal Events
function bindModalEvents() {
  // Close modal buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  
  // Modal backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModals();
      }
    });
  });
  
  // Forms
  const dealerForm = document.getElementById('dealer-form');
  const productForm = document.getElementById('product-form');
  
  if (dealerForm) {
    dealerForm.addEventListener('submit', handleDealerForm);
  }
  
  if (productForm) {
    productForm.addEventListener('submit', handleProductForm);
  }
}

function openDealerModal(dealer = null) {
  const modal = document.getElementById('dealer-modal');
  const title = document.getElementById('dealer-modal-title');
  const form = document.getElementById('dealer-form');
  
  if (!modal || !title || !form) return;
  
  if (dealer) {
    title.textContent = 'Edit Dealer';
    document.getElementById('dealer-name').value = dealer.name;
    document.getElementById('dealer-address').value = dealer.address;
    document.getElementById('dealer-phone').value = dealer.phone;
  } else {
    title.textContent = 'Add Dealer';
    form.reset();
  }
  
  modal.classList.remove('hidden');
}

function openProductModal(product = null) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');
  
  if (!modal || !title || !form) return;
  
  if (product) {
    title.textContent = 'Edit Product';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.defaultPrice;
  } else {
    title.textContent = 'Add Product';
    form.reset();
  }
  
  modal.classList.remove('hidden');
}

function closeModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
  editingDealer = null;
  editingProduct = null;
}

function handleDealerForm(e) {
  e.preventDefault();
  
  const nameField = document.getElementById('dealer-name');
  const addressField = document.getElementById('dealer-address');
  const phoneField = document.getElementById('dealer-phone');
  
  const name = nameField ? nameField.value : '';
  const address = addressField ? addressField.value : '';
  const phone = phoneField ? phoneField.value : '';
  
  if (editingDealer) {
    // Update existing dealer
    editingDealer.name = name;
    editingDealer.address = address;
    editingDealer.phone = phone;
  } else {
    // Add new dealer
    const newDealer = {
      id: Math.max(...appData.dealers.map(d => d.id)) + 1,
      name,
      address,
      phone,
      dateAdded: '2024-08-01' // Using current date from scenario
    };
    appData.dealers.push(newDealer);
  }
  
  closeModals();
  loadDealersData();
}

function handleProductForm(e) {
  e.preventDefault();
  
  const nameField = document.getElementById('product-name');
  const categoryField = document.getElementById('product-category');
  const priceField = document.getElementById('product-price');
  
  const name = nameField ? nameField.value : '';
  const category = categoryField ? categoryField.value : '';
  const defaultPrice = priceField ? parseInt(priceField.value) : 0;
  
  if (editingProduct) {
    // Update existing product
    editingProduct.name = name;
    editingProduct.category = category;
    editingProduct.defaultPrice = defaultPrice;
  } else {
    // Add new product
    const newProduct = {
      id: Math.max(...appData.products.map(p => p.id)) + 1,
      name,
      category,
      defaultPrice
    };
    appData.products.push(newProduct);
  }
  
  closeModals();
  loadProductsData();
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Global functions for inline event handlers
window.editDealer = editDealer;
window.deleteDealer = deleteDealer;
window.viewDealerHistory = viewDealerHistory;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.copyAddress = copyAddress;
window.markDelivered = markDelivered;