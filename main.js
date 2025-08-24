        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding content
                const targetId = button.dataset.tab;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
        // Smooth scrolling for navigation
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
        
        // Active navigation link
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'linear-gradient(135deg, var(--primary-800), var(--primary-900))';
            } else {
                navbar.style.background = 'linear-gradient(135deg, var(--primary-700), var(--primary-800))';
            }
        });
        
        // Clone marquee content for continuous scrolling
        const marquee = document.querySelector('.marquee');
        if (marquee) {
            const marqueeContent = marquee.innerHTML;
            marquee.innerHTML += marqueeContent;
        }
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);
        
        // Observe service items
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => observer.observe(item));
        
       // Booking Modal Functionality (WhatsApp + Email)
        const bookingModal = document.getElementById('bookingModal'); // Updated ID
        const modalServiceName = document.getElementById('modalServiceName');
        const modalServicePrice = document.getElementById('modalServicePrice');
        const modalMessage = document.getElementById('modalMessage');
        const whatsappLink = document.getElementById('whatsappLink');
        const emailLink = document.getElementById('emailLink'); // New email link
        const modalClose = document.querySelector('.modal-close');
        const modalCancel = document.querySelector('.modal-btn-cancel');

        // Add click event to all service items
        document.querySelectorAll('.service-item, .service-item-list').forEach(item => {
            // Check if the item has the required data attributes
            if (item.dataset.service) {
                item.style.cursor = 'pointer';
                
                item.addEventListener('click', () => {
                    const service = item.dataset.service;
                    const price = item.dataset.price;
                    const message = item.dataset.message;
                    
                    // Update modal content
                    modalServiceName.textContent = service;
                    modalServicePrice.textContent = price;
                    modalMessage.textContent = 'Choose your preferred booking method below.';
                    
                    // Set WhatsApp link
                    const encodedWhatsAppMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/2349077357013?text=${encodedWhatsAppMessage}`;
                    whatsappLink.href = whatsappUrl;
                    whatsappLink.target = '_blank';
                    
                    // Set Email link
                    const emailSubject = encodeURIComponent(`Service Booking: ${service}`);
                    const emailBody = [
                    `Hello SIR.RICHQRD,`,
                    ``,
                    `I am interested in booking the following service:`,
                    ``,
                    `Service: ${service}`,
                    `Price: ${price}`,
                    ``,
                    message.replace(/Hi! I'd like to book|Hi! I'd like to signup for this Package|Hi! I'd like to discuss|Please provide more details about/g, '').trim(),
                    ``,
                    `Please provide me with:`,
                    `- Available dates and times`,
                    `- Location details`,
                    `- Any preparation requirements`,
                    `- Payment information`,
                    ``,
                    `My preferred contact method: write your contact here "WhatsApp/Email/Phone"`,
                    `Alternative contact: "WhatsApp number or phone number" (if applicable)`,
                    ``,
                    `Thank you for your time. I look forward to hearing from you soon.`,
                    ``,
                    `Best regards`
                    ].join("%0A");

                    const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sir.richqrd@gmail.com&su=${emailSubject}&body=${emailBody}`;
                    emailLink.href = emailUrl;
                    emailLink.target = '_blank';
                    
                    // Debug logs
                    console.log('WhatsApp URL:', whatsappUrl);
                    console.log('Email URL:', emailUrl);
                    
                    // Show modal
                    bookingModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        });

        // Enhanced WhatsApp click handler
        if (whatsappLink) {
            whatsappLink.addEventListener('click', function(e) {
                e.preventDefault();
                const currentUrl = this.href;
                
                console.log('WhatsApp link clicked. URL:', currentUrl);
                
                if (currentUrl && currentUrl !== '#' && currentUrl !== window.location.href + '#') {
                    try {
                        const newWindow = window.open(currentUrl, '_blank');
                        
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            console.log('Window.open failed, trying location.href');
                            window.location.href = currentUrl;
                        } else {
                            console.log('WhatsApp opened successfully');
                        }
                        
                        setTimeout(() => {
                            closeBookingModal();
                        }, 500);
                        
                    } catch (error) {
                        console.error('Error opening WhatsApp:', error);
                        window.location.href = currentUrl;
                    }
                }
            });
        }

        // Email click handler
        if (emailLink) {
            emailLink.addEventListener('click', function(e) {
                console.log('Email link clicked. URL:', this.href);
                
                // Let the default mailto: behavior work
                // Close modal after a short delay
                setTimeout(() => {
                    closeBookingModal();
                }, 500);
            });
        }

        // Close modal function
        function closeBookingModal() {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close modal events
        if (modalClose) modalClose.addEventListener('click', closeBookingModal);
        if (modalCancel) modalCancel.addEventListener('click', closeBookingModal);
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
        });

        // Featured section tab functionality - CORRECTED VERSION
        const featuredTabButtons = document.querySelectorAll('.featured-tab-button');
        const featuredTabPanels = document.querySelectorAll('.featured-tab-panel');

        console.log('Featured tab buttons:', featuredTabButtons.length);
        console.log('Featured tab panels:', featuredTabPanels.length);

        featuredTabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                console.log('Featured tab clicked:', button.dataset.featuredTab);
                
                // Remove active class from all tabs
                featuredTabButtons.forEach(btn => btn.classList.remove('active'));
                featuredTabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding panel
                const targetId = button.dataset.featuredTab;
                const targetPanel = document.getElementById(targetId);
                
                console.log('Target ID:', targetId);
                console.log('Target panel:', targetPanel);
                
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('Panel activated successfully');
                } else {
                    console.error('Panel not found for ID:', targetId);
                }
            });
        });
        
        // 3. Mobile Menu Functionality
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
        
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            });
        });
// Gallery Lightbox Functionality
const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const currentIndexSpan = document.getElementById('currentIndex');
        const totalImagesSpan = document.getElementById('totalImages');

        let currentImageIndex = 0;
        let galleryImages = [];
        let isGalleryInitialized = false;

        // Initialize gallery - Updated to work with your existing gallery structure
        function initializeGallery() {
            // Only initialize once to avoid duplicate event listeners
            if (isGalleryInitialized) return;
            
            // Target your specific gallery structure in the Featured section
            const galleryItems = document.querySelectorAll('#gallery .gallery-grid .gallery-item');
            
            if (galleryItems.length === 0) {
                console.log('No gallery items found');
                return;
            }
            
            galleryImages = Array.from(galleryItems).map(item => {
                const img = item.querySelector('img');
                return {
                    src: img.src,
                    alt: img.alt || 'Gallery image'
                };
            });
            
            if (totalImagesSpan) {
                totalImagesSpan.textContent = galleryImages.length;
            }
            
            // Add click event to each gallery item
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
                
                // Add pointer cursor to indicate clickable
                item.style.cursor = 'pointer';
            });
            
            isGalleryInitialized = true;
            console.log(`Gallery initialized with ${galleryImages.length} images`);
        }

       // Initialize gallery when DOM is loaded and featured tabs are set up
        function setupGalleryInitialization() {
            // Wait a bit for all elements to be ready
            setTimeout(() => {
                // Check if gallery tab is currently visible
                const galleryPanel = document.getElementById('gallery');
                if (galleryPanel && galleryPanel.classList.contains('active')) {
                    initializeGallery();
                }
            }, 200);
        }

        // Enhanced featured tab functionality with gallery initialization
        featuredTabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                console.log('Featured tab clicked:', button.dataset.featuredTab);
                
                // Remove active class from all tabs
                featuredTabButtons.forEach(btn => btn.classList.remove('active'));
                featuredTabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding panel
                const targetId = button.dataset.featuredTab;
                const targetPanel = document.getElementById(targetId);
                
                console.log('Target ID:', targetId);
                console.log('Target panel:', targetPanel);
                
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('Panel activated successfully');
                    
                    // Initialize gallery if gallery tab is clicked
                    if (targetId === 'gallery') {
                        setTimeout(() => {
                            initializeGallery();
                        }, 100);
                    }
                } else {
                    console.error('Panel not found for ID:', targetId);
                }
            });
        });

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', setupGalleryInitialization);
        
        
        // Set the target date (change this to your desired date)
        const targetDate = new Date("October 23, 2026 09:00:00").getTime();
        const countdownElement = document.getElementById("countdown");

        // Maximum values for progress calculation
        const maxValues = {
            days: 365,
            hours: 24,
            minutes: 60,
            seconds: 60
        };

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = '<div class="event-started">EVENT STARTED!</div>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const timeUnits = [
                { value: days, label: 'Days', max: maxValues.days },
                { value: hours, label: 'Hours', max: maxValues.hours },
                { value: minutes, label: 'Minutes', max: maxValues.minutes },
                { value: seconds, label: 'Seconds', max: maxValues.seconds }
            ];

            let html = '';
            timeUnits.forEach(unit => {
                const progress = (unit.value / unit.max) * 360;
                const displayValue = unit.value.toString().padStart(2, '0');
                
                html += `
                    <div class="time-unit">
                        <div class="circle-container">
                            <div class="circle-bg"></div>
                            <div class="circle-progress" style="transform: rotate(${progress - 90}deg);"></div>
                            <div class="time-value">${displayValue}</div>
                        </div>
                        <div class="time-label">${unit.label}</div>
                    </div>
                `;
            });

            countdownElement.innerHTML = html;
        }

        // Update countdown immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").then(() => {
                console.log("Service Worker Registered!");
            });
        }
