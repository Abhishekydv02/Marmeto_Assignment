document.addEventListener("DOMContentLoaded", function () {
    fetchData('Men');
    fetchData('Women');
    fetchData('Kids');

    // Add event listeners to tabs after fetching data
    document.getElementById('menTabBtn').addEventListener('click', () => changeTab('Men'));
    document.getElementById('womenTabBtn').addEventListener('click', () => changeTab('Women'));
    document.getElementById('kidsTabBtn').addEventListener('click', () => changeTab('Kids'));
});

function changeTab(tabName) {
    const tabs = ['Men', 'Women', 'Kids'];

    tabs.forEach(tab => {
        const tabContent = document.getElementById(`${tab.toLowerCase()}Tab`);
        const tabBtn = document.querySelector(`.${tab.toLowerCase()}-tab-button`);

        if (tab.toLowerCase() === tabName.toLowerCase()) {
            tabContent.style.display = 'block';
            tabBtn.classList.add('active');
        } else {
            tabContent.style.display = 'none';
            tabBtn.classList.remove('active');
        }
    });
}

async function fetchData(category) {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const categoryData = data.categories.find(cat => cat.category_name === category);

        if (categoryData) {
            const products = categoryData.category_products;

            const tabContent = document.getElementById(`${category.toLowerCase()}Tab`);
            tabContent.innerHTML = ''; // Clear previous content

            products.forEach(product => {
                const discount = calculateDiscount(product.price, product.compare_at_price);
                const productCard = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}" class="product-image">
                        <div class="badge">${product.badge_text || ''}</div>
                        <h3>${product.title}</h3>
                        <p>Vendor: ${product.vendor}</p>
                        <p>Price: $${product.price}</p>
                        <p>Compare at price: $${product.compare_at_price}</p>
                        <p>Discount: ${discount}% off</p>
                        <button class="button-add-to-cart">Add to Cart</button>
                    </div>
                `;
                tabContent.innerHTML += productCard;
            });
        } else {
            console.error(`No data found for category: ${category}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function calculateDiscount(price, compareAtPrice) {
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return discount.toFixed(2);
}
