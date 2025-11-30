// ==================== GALLERY DATA ====================
const galleryData = [
    {
        src: './img/15.jpg',
        category: 'weddings',
        title: 'Royal Wedding Setup',
        description: 'Elegant decoration with royal theme',
        icon: 'fa-heart'
    },
    {
        src: './img/R.jpg',
        category: 'corporate',
        title: 'Corporate Conference',
        description: 'Professional business event setup',
        icon: 'fa-briefcase'
    },
    {
        src: './img/5.jpg',
        category: 'parties',
        title: 'Grand Reception',
        description: 'Luxury reception party arrangement',
        icon: 'fa-glass-cheers'
    },
    {
        src: './img/4.jpg',
        category: 'decorations',
        title: 'Elegant Theme Décor',
        description: 'Beautiful themed decoration design',
        icon: 'fa-star'
    },
    {
        src: './img/images.jpg',
        category: 'weddings',
        title: 'Traditional Wedding',
        description: 'Classic wedding ceremony setup',
        icon: 'fa-heart'
    },
    {
        src: './img/OIP (1).jpg',
        category: 'venues',
        title: 'Premium Venue',
        description: 'Luxury event venue arrangement',
        icon: 'fa-building'
    },
    {
        src: './img/2.jpg',
        category: 'parties',
        title: 'Birthday Celebration',
        description: 'Fun birthday party decoration',
        icon: 'fa-glass-cheers'
    },
    {
        src: './img/images (1).jpg',
        category: 'decorations',
        title: 'Floral Arrangements',
        description: 'Premium floral decoration setup',
        icon: 'fa-star'
    },
    {
        src: './img/1.jpg',
        category: 'weddings',
        title: 'Wedding Stage Setup',
        description: 'Beautiful wedding stage decoration',
        icon: 'fa-heart'
    },
    {
        src: './img/3.jpg',
        category: 'corporate',
        title: 'Business Conference',
        description: 'Professional conference setup',
        icon: 'fa-briefcase'
    },
    {
        src: './img/15.jpg',
        category: 'parties',
        title: 'Cocktail Evening',
        description: 'Elegant cocktail party setup',
        icon: 'fa-glass-cheers'
    },
    {
        src: './img/5.jpg',
        category: 'venues',
        title: 'Luxury Banquet Hall',
        description: 'Premium banquet hall decoration',
        icon: 'fa-building'
    }
];

// ==================== DOM ELEMENTS ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const closeLightbox = document.getElementById('closeLightbox');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');
const currentIndexEl = document.getElementById('currentIndex');
const totalImagesEl = document.getElementById('totalImages');
const thumbnailsContainer = document.getElementById('lightboxThumbnails');
const scrollTopBtn = document.getElementById('scrollTop');

let currentImageIndex = 0;

// ==================== FILTER FUNCTIONALITY ====================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ==================== LIGHTBOX FUNCTIONALITY ====================

// Generate thumbnails
function generateThumbnails() {
    thumbnailsContainer.innerHTML = '';
    galleryData.forEach((item, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item';
        if (index === currentImageIndex) thumb.classList.add('active');
        thumb.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
        thumb.addEventListener('click', () => showImage(index));
        thumbnailsContainer.appendChild(thumb);
    });
}

// Show image in lightbox
function showImage(index) {
    currentImageIndex = index;
    const data = galleryData[index];
    
    // Show loader
    const loader = document.querySelector('.lightbox-loader');
    if (loader) loader.style.display = 'block';
    
    // Update image
    lightboxImage.onload = function() {
        if (loader) loader.style.display = 'none';
    };
    
    lightboxImage.src = data.src;
    lightboxCategory.innerHTML = `<i class="fas ${data.icon}"></i> ${capitalizeFirst(data.category)}`;
    lightboxTitle.textContent = data.title;
    lightboxDescription.textContent = data.description;
    currentIndexEl.textContent = index + 1;
    totalImagesEl.textContent = galleryData.length;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Open lightbox
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        currentImageIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        showImage(index);
        generateThumbnails();
        
        // Animate lightbox entrance
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    });
});

// Close lightbox
function closeLightboxFunction() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }, 300);
}

closeLightbox.addEventListener('click', closeLightboxFunction);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightboxFunction();
    }
});

// Navigation
prevImage.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    showImage(currentImageIndex);
});

nextImage.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    showImage(currentImageIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
        showImage(currentImageIndex);
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryData.length;
        showImage(currentImageIndex);
    } else if (e.key === 'Escape') {
        closeLightboxFunction();
    }
});

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        updateCounter();
    });
}

// Trigger counter on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

const statsSection = document.querySelector('.hero-stats-modern');
if (statsSection) statsObserver.observe(statsSection);

// ==================== SCROLL TO TOP ====================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar-custom');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== SMOOTH SCROLL FOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== LAZY LOADING IMAGES ====================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

document.querySelectorAll('.gallery-image img').forEach(img => {
    imageObserver.observe(img);
});

// ==================== PRELOADER (OPTIONAL) ====================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ==================== GALLERY ITEM ANIMATION ON SCROLL ====================
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    galleryObserver.observe(item);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🎉 HR Event Management Gallery 🎉', 'color: #4A90E2; font-size: 24px; font-weight: bold;');
console.log('%c✨ Super Attractive Gallery with Modern Design ✨', 'color: #FFD700; font-size: 16px;');
console.log('%cDesigned by: Rifat Hasan 💙', 'color: #F4A261; font-size: 14px;');
