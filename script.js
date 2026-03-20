let allProducts = [];
let siteData = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });
});

async function fetchData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
        allProducts = siteData.products;
        
        applySiteConfig(siteData.siteConfig);
        renderCategories(siteData.categories);
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error cargando los datos:', error);
    }
}

function applySiteConfig(config) {
    // Ribbon / Marquee
    const ribbon = document.getElementById('announcement-ribbon');
    if (config.ribbon && config.ribbon.enabled) {
        ribbon.classList.remove('hidden');
        ribbon.className = `${config.ribbon.backgroundColor} ${config.ribbon.textColor} overflow-hidden whitespace-nowrap py-2 relative flex`;
        const content = `${config.ribbon.text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `;
        document.getElementById('ribbon-content').innerHTML = content.repeat(5);
        document.getElementById('ribbon-content-clone').innerHTML = content.repeat(5);
    }

    // Logo & Names
    document.getElementById('logo').src = config.logo;
    document.getElementById('footer-logo').src = config.logo;
    document.getElementById('site-name').textContent = config.name;
    document.getElementById('footer-site-name').textContent = config.name;
    document.title = `Catálogo - ${config.name}`;

    // Hero
    document.getElementById('hero-title').textContent = config.hero.title;
    document.getElementById('hero-subtitle').textContent = config.hero.subtitle;

    // Social Links
    const socialLinksDesktop = document.getElementById('social-links-desktop');
    const socialLinksFooter = document.getElementById('social-links-footer');
    const whatsappFloat = document.getElementById('whatsapp-float');

    const socialIcons = {
        whatsapp: 'fab fa-whatsapp',
        instagram: 'fab fa-instagram',
        facebook: 'fab fa-facebook',
        tiktok: 'fab fa-tiktok'
    };

    // Clear existing
    socialLinksDesktop.innerHTML = '';
    socialLinksFooter.innerHTML = '';

    Object.keys(config.social).forEach(key => {
        if (!config.social[key]) return;

        let url = config.social[key];
        if (key === 'whatsapp') {
            url = `https://wa.me/${config.social[key].replace(/\D/g, '')}`;
            whatsappFloat.href = url;
        }

        // Desktop links (icon + text)
        const desktopLink = document.createElement('a');
        desktopLink.href = url;
        desktopLink.target = '_blank';
        desktopLink.className = 'text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2';
        desktopLink.innerHTML = `<i class="${socialIcons[key]} text-xl"></i><span class="capitalize">${key}</span>`;
        socialLinksDesktop.appendChild(desktopLink);

        // Footer icons
        const footerLink = document.createElement('a');
        footerLink.href = url;
        footerLink.target = '_blank';
        footerLink.className = 'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all';
        footerLink.innerHTML = `<i class="${socialIcons[key]} text-lg"></i>`;
        socialLinksFooter.appendChild(footerLink);
    });
}

function renderCategories(categories) {
    const container = document.getElementById('category-filters');
    // Keep the "All" button
    const allBtn = container.querySelector('button');
    container.innerHTML = '';
    container.appendChild(allBtn);

    categories.forEach(categoryObj => {
        const categoryName = categoryObj.name;
        const btn = document.createElement('button');
        btn.className = 'px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-all';
        btn.textContent = categoryName;
        btn.onclick = () => filterCategory(categoryName);
        container.appendChild(btn);
    });
}

function filterCategory(category) {
    const buttons = document.querySelectorAll('#category-filters button');
    buttons.forEach(btn => {
        if (btn.textContent === category || (category === 'all' && btn.textContent === 'Todos')) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        }
    });

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative';
        
        // Status Badge
        let statusBadge = '';
        let grayscaleClass = '';
        let pointerEventsClass = '';
        
        if (product.status === 'nuevo') {
            statusBadge = `<span class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10 uppercase tracking-wider">Nuevo</span>`;
        } else if (product.status === 'agotado') {
            statusBadge = `<span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10 uppercase tracking-wider">Agotado</span>`;
            grayscaleClass = 'grayscale opacity-75';
            pointerEventsClass = 'pointer-events-none opacity-50';
        }

        card.innerHTML = `
            ${statusBadge}
            <div class="relative h-64 overflow-hidden bg-gray-100 ${grayscaleClass}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                    ${product.category}
                </span>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-bold text-lg mb-2 line-clamp-1 text-gray-800">${product.name}</h3>
                <p class="text-gray-500 text-xs mb-4 line-clamp-2 flex-grow">${product.description}</p>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-4 space-y-4 border border-gray-100 ${pointerEventsClass}">
                    <!-- Opciones de Pedido -->
                    <div class="space-y-3">
                        <label class="flex items-center justify-between cursor-pointer group">
                            <div class="flex items-center">
                                <input type="radio" name="mode-${product.id}" value="menor" checked 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    onchange="handleModeChange(${product.id}, 'menor')">
                                <span class="ml-2 text-[11px] font-bold text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Por Menor</span>
                            </div>
                            <span class="text-lg font-bold text-blue-600 tracking-tight">S/. ${product.priceRetail}</span>
                        </label>

                        <label class="flex items-center justify-between cursor-pointer group">
                            <div class="flex items-center">
                                <input type="radio" name="mode-${product.id}" value="mayor" 
                                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    onchange="handleModeChange(${product.id}, 'mayor')">
                                <div class="ml-2 flex flex-col">
                                    <span class="text-[11px] font-bold text-gray-600 uppercase group-hover:text-green-600 transition-colors">Por Mayor</span>
                                    <span class="text-[8px] font-bold text-green-700">3+ UNIDADES</span>
                                </div>
                            </div>
                            <span class="text-lg font-bold text-green-600 tracking-tight">S/. ${product.priceWholesale}</span>
                        </label>
                    </div>

                    <!-- Selector de Cantidad -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span class="text-[11px] font-bold text-gray-400 uppercase">Cantidad:</span>
                        <div class="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button onclick="changeQty(${product.id}, -1)" class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors">-</button>
                            <input type="number" id="qty-${product.id}" value="1" min="1" readonly
                                class="w-10 text-center text-sm font-bold border-none focus:ring-0 bg-white">
                            <button onclick="changeQty(${product.id}, 1)" class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors">+</button>
                        </div>
                    </div>
                </div>

                <div class="mt-auto ${pointerEventsClass}">
                    <button onclick="sendOrder(${product.id})" 
                       class="w-full flex items-center justify-center bg-black text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all uppercase text-xs tracking-widest shadow-lg hover:shadow-black/20">
                        <i class="fab fa-whatsapp mr-2 text-lg"></i> Realizar Pedido
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global functions for interactions
function handleModeChange(id, mode) {
    const qtyInput = document.getElementById(`qty-${id}`);
    if (mode === 'mayor' && parseInt(qtyInput.value) < 3) {
        qtyInput.value = 3;
    } else if (mode === 'menor' && parseInt(qtyInput.value) >= 3) {
        // Optional: Reset to 1 if coming from wholesale? 
        // Better leave it or just ensure min 1.
    }
}

function changeQty(id, delta) {
    const qtyInput = document.getElementById(`qty-${id}`);
    const mode = document.querySelector(`input[name="mode-${id}"]:checked`).value;
    let newQty = parseInt(qtyInput.value) + delta;
    
    const minQty = (mode === 'mayor') ? 3 : 1;
    if (newQty < minQty) newQty = minQty;
    
    qtyInput.value = newQty;
}

function sendOrder(id) {
    const product = allProducts.find(p => p.id === id);
    const mode = document.querySelector(`input[name="mode-${id}"]:checked`).value;
    const qty = document.getElementById(`qty-${id}`).value;
    const price = mode === 'mayor' ? product.priceWholesale : product.priceRetail;
    const total = (parseFloat(price) * parseInt(qty)).toFixed(2);
    
    const whatsappNumber = siteData.siteConfig.social.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
        `Hola EDUX IMPORT, deseo realizar un pedido del siguiente producto:\n\n` +
        `📦 Producto: ${product.name}\n` +
        `🏷️ Tipo: Por ${mode === 'mayor' ? 'MAYOR' : 'MENOR'}\n` +
        `🔢 Cantidad: ${qty}\n` +
        `💰 Precio unit: S/. ${price}\n` +
        `💵 Total aprox: S/. ${total}\n\n` +
        `Por favor, confírmenme disponibilidad.`
    );
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

