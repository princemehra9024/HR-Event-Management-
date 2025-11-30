// ==================== FAQ GALLERY WITH IMAGE LIGHTBOX ====================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== VARIABLES ====================
    const galleryCards = document.querySelectorAll('.gallery-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const scrollTopBtn = document.getElementById('scrollTop');
    const navbar = document.querySelector('.navbar-custom');
    
    // Lightbox elements
    const faqLightbox = document.getElementById('faqLightbox');
    const faqLightboxImage = document.getElementById('faqLightboxImage');
    const faqLightboxTitle = document.getElementById('faqLightboxTitle');
    const faqLightboxCategory = document.getElementById('faqLightboxCategory');
    const closeFaqLightbox = document.getElementById('closeFaqLightbox');
    const prevFaqImage = document.getElementById('prevFaqImage');
    const nextFaqImage = document.getElementById('nextFaqImage');
    const faqCurrentIndex = document.getElementById('faqCurrentIndex');
    const faqTotalImages = document.getElementById('faqTotalImages');
    
    let currentImageIndex = 0;
    let faqImages = [];
    
    // ==================== COLLECT FAQ IMAGES DATA ====================
    document.querySelectorAll('.card-image').forEach((cardImage, index) => {
        faqImages.push({
            src: cardImage.getAttribute('data-img'),
            title: cardImage.getAttribute('data-title'),
            category: cardImage.getAttribute('data-cat'),
            index: index
        });
    });
    
    faqTotalImages.textContent = faqImages.length;
    
    // ==================== IMAGE CLICK TO OPEN LIGHTBOX ====================
    document.querySelectorAll('.card-image').forEach((cardImage) => {
        cardImage.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.parentElement.getAttribute('data-index'));
            openFaqLightbox(index);
        });
    });
    
    function openFaqLightbox(index) {
        currentImageIndex = index;
        updateFaqLightboxImage();
        faqLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateFaqLightboxImage() {
        const data = faqImages[currentImageIndex];
        faqLightboxImage.src = data.src;
        faqLightboxTitle.textContent = data.title;
        faqLightboxCategory.textContent = data.category;
        faqCurrentIndex.textContent = currentImageIndex + 1;
        
        // Reset animation
        faqLightboxImage.style.animation = 'none';
        setTimeout(() => {
            faqLightboxImage.style.animation = 'zoomIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
    }
    
    // ==================== CLOSE LIGHTBOX ====================
    function closeFaqLightboxModal() {
        faqLightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeFaqLightbox.addEventListener('click', closeFaqLightboxModal);
    
    // Close on overlay click
    document.querySelector('.faq-lightbox .lightbox-overlay').addEventListener('click', closeFaqLightboxModal);
    
    // ==================== LIGHTBOX NAVIGATION ====================
    function showNextFaqImage() {
        currentImageIndex = (currentImageIndex + 1) % faqImages.length;
        updateFaqLightboxImage();
    }
    
    function showPrevFaqImage() {
        currentImageIndex = (currentImageIndex - 1 + faqImages.length) % faqImages.length;
        updateFaqLightboxImage();
    }
    
    nextFaqImage.addEventListener('click', showNextFaqImage);
    prevFaqImage.addEventListener('click', showPrevFaqImage);
    
    // ==================== KEYBOARD NAVIGATION FOR LIGHTBOX ====================
    document.addEventListener('keydown', function(e) {
        if (!faqLightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeFaqLightboxModal();
        } else if (e.key === 'ArrowRight') {
            showNextFaqImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevFaqImage();
        }
    });
    
    // ==================== TOUCH/SWIPE SUPPORT FOR LIGHTBOX ====================
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    const lightboxContent = document.querySelector('.faq-lightbox .lightbox-content');
    
    if (lightboxContent) {
        lightboxContent.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        lightboxContent.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const horizontalSwipe = touchEndX - touchStartX;
        const verticalSwipe = Math.abs(touchEndY - touchStartY);
        
        if (Math.abs(horizontalSwipe) > swipeThreshold && verticalSwipe < 100) {
            if (horizontalSwipe > 0) {
                showPrevFaqImage();
            } else {
                showNextFaqImage();
            }
        }
    }
    
    // ==================== MOUSE DRAG SUPPORT (Desktop) ====================
    let isDragging = false;
    let startX = 0;
    
    if (lightboxContent) {
        lightboxContent.addEventListener('mousedown', function(e) {
            if (e.target.closest('.lightbox-prev') || 
                e.target.closest('.lightbox-next') || 
                e.target.closest('.lightbox-close')) {
                return;
            }
            isDragging = true;
            startX = e.clientX;
            lightboxContent.style.cursor = 'grabbing';
        });
        
        lightboxContent.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        lightboxContent.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            isDragging = false;
            lightboxContent.style.cursor = 'grab';
            
            const endX = e.clientX;
            const diff = endX - startX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showPrevFaqImage();
                } else {
                    showNextFaqImage();
                }
            }
        });
        
        lightboxContent.addEventListener('mouseleave', function() {
            if (isDragging) {
                isDragging = false;
                lightboxContent.style.cursor = 'grab';
            }
        });
    }
    
    // ==================== GALLERY CARD TOGGLE (Click on Content) ====================
    galleryCards.forEach(card => {
        const cardContent = card.querySelector('.card-content');
        
        cardContent.addEventListener('click', function(e) {
            // Prevent toggling if clicking inside answer
            if (e.target.closest('.card-answer')) {
                return;
            }
            
            // Close all other cards
            galleryCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Toggle current card
            card.classList.toggle('active');
            
            // Smooth scroll to card if opening
            if (card.classList.contains('active')) {
                setTimeout(() => {
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    });
    
    // ==================== CATEGORY FILTER ====================
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            galleryCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                // Close all cards first
                card.classList.remove('active');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show card with stagger animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = `fadeInScale 0.6s ease ${index * 0.1}s both`;
                    }, 10);
                } else {
                    // Hide card
                    card.style.animation = 'fadeOutScale 0.4s ease both';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });
    
    // ==================== SCROLL TO TOP ====================
    window.addEventListener('scroll', function() {
        // Show/hide scroll top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all gallery cards
    galleryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
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
    
    // ==================== COUNTER ANIMATION ====================
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
    
    // Animate counters when in view
    const counters = document.querySelectorAll('.counter-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // ==================== MOBILE MENU CLOSE ON LINK CLICK ====================
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // ==================== PRELOAD ADJACENT IMAGES ====================
    function preloadAdjacentImages() {
        const nextIndex = (currentImageIndex + 1) % faqImages.length;
        const prevIndex = (currentImageIndex - 1 + faqImages.length) % faqImages.length;
        
        const nextImg = new Image();
        nextImg.src = faqImages[nextIndex].src;
        
        const prevImg = new Image();
        prevImg.src = faqImages[prevIndex].src;
    }
    
    // Preload when lightbox opens
    if (faqLightbox) {
        faqLightbox.addEventListener('transitionend', function() {
            if (faqLightbox.classList.contains('active')) {
                preloadAdjacentImages();
            }
        });
    }
    
    // ==================== LOADING ANIMATION ====================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
});

// ==================== CUSTOM ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    body.loaded {
        animation: fadeIn 0.5s ease;
    }
`;
document.head.appendChild(style);
