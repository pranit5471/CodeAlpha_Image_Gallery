// Gallery data
const galleryData = [
    { id: 1, title: "Mountain Sunrise", category: "nature", seed: "mountain1" },
    { id: 2, title: "Ocean Waves", category: "nature", seed: "ocean1" },
    { id: 3, title: "Forest Path", category: "nature", seed: "forest1" },
    { id: 4, title: "Desert Dunes", category: "nature", seed: "desert1" },
    { id: 5, title: "Modern Building", category: "architecture", seed: "building1" },
    { id: 6, title: "Ancient Temple", category: "architecture", seed: "temple1" },
    { id: 7, title: "City Skyline", category: "architecture", seed: "city1" },
    { id: 8, title: "Bridge View", category: "architecture", seed: "bridge1" },
    { id: 9, title: "Portrait Smile", category: "people", seed: "portrait1" },
    { id: 10, title: "Street Life", category: "people", seed: "street1" },
    { id: 11, title: "Family Time", category: "people", seed: "family1" },
    { id: 12, title: "Dancer", category: "people", seed: "dancer1" },
    { id: 13, title: "Wild Cat", category: "animals", seed: "cat1" },
    { id: 14, title: "Ocean Life", category: "animals", seed: "fish1" },
    { id: 15, title: "Bird Flight", category: "animals", seed: "bird1" },
    { id: 16, title: "Forest Animals", category: "animals", seed: "deer1" },
    { id: 17, title: "Gourmet Dish", category: "food", seed: "food1" },
    { id: 18, title: "Fresh Fruits", category: "food", seed: "fruits1" },
    { id: 19, title: "Coffee Time", category: "food", seed: "coffee1" },
    { id: 20, title: "Bakery", category: "food", seed: "bakery1" }
];

// DOM elements
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [];

// Initialize gallery
function initGallery() {
    renderGallery(galleryData);
    attachEventListeners();
}

// Render gallery items
function renderGallery(images) {
    galleryGrid.innerHTML = '';
    images.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        galleryGrid.appendChild(galleryItem);
    });
}

// Create gallery item element
function createGalleryItem(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.category = item.category;
    div.dataset.index = index;
    
    div.innerHTML = `
        <img src="https://picsum.photos/seed/${item.seed}/400/300.jpg" alt="${item.title}" loading="lazy">
        <div class="item-overlay">
            <h3 class="item-title">${item.title}</h3>
            <p class="item-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
        </div>
    `;
    
    // Add click event for lightbox
    div.addEventListener('click', () => openLightbox(index));
    
    return div;
}

// Filter gallery
function filterGallery(category) {
    currentFilter = category;
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
        if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
            // Add stagger animation
            setTimeout(() => {
                item.style.animationDelay = `${index * 0.05}s`;
            }, 10);
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Update filtered images array for lightbox navigation
    filteredImages = galleryData.filter(item => 
        category === 'all' || item.category === category
    );
}

// Open lightbox
function openLightbox(index) {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    const clickedItem = visibleItems.find(item => parseInt(item.dataset.index) === index);
    
    if (clickedItem) {
        currentImageIndex = visibleItems.indexOf(clickedItem);
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Update lightbox content
function updateLightboxContent() {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    const currentItem = visibleItems[currentImageIndex];
    const itemData = galleryData[parseInt(currentItem.dataset.index)];
    
    lightboxImage.src = currentItem.querySelector('img').src.replace('/400/300', '/800/600');
    lightboxTitle.textContent = itemData.title;
    lightboxCategory.textContent = itemData.category.charAt(0).toUpperCase() + itemData.category.slice(1);
}

// Navigate lightbox
function navigateLightbox(direction) {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
    }
    
    updateLightboxContent();
}

// Attach event listeners
function attachEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGallery(btn.dataset.category);
        });
    });
    
    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    navigateLightbox('next');
                    break;
            }
        }
    });
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);