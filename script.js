/* ============================================
   CHARBHUJA COTTON — Scripts V3
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Preloader
    window.addEventListener('load', () => {
        setTimeout(() => document.getElementById('preloader').classList.add('loaded'), 120);
    });

    // Navbar
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile Nav
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active Section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                });
            }
        });
    });

    // Render content instantly (no scroll-triggered reveal)
    document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('visible'));

    // Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let countersStarted = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                statNumbers.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2200;
                    const step = target / (duration / 16);
                    let current = 0;
                    const update = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.3 });
    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) counterObserver.observe(statsStrip);

    // Gallery Filter
    const galleryOpenBtn = document.getElementById('galleryOpenBtn');
    const galleryPanel = document.getElementById('galleryPanel');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const applyGalleryFilter = (filter) => {
        galleryItems.forEach((item) => {
            const show = item.classList.contains(filter);
            if (show) {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'none';
            } else {
                item.classList.add('hidden');
            }
        });
    };

    const hydrateGallery = () => {
        galleryItems.forEach((item) => {
            const img = item.querySelector('img');
            if (img && img.dataset.src && img.getAttribute('src') !== img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    };

    galleryOpenBtn.addEventListener('click', () => {
        const isOpen = galleryPanel.classList.toggle('active');
        galleryOpenBtn.setAttribute('aria-expanded', String(isOpen));
        galleryPanel.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen) {
            hydrateGallery();
            applyGalleryFilter(document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'product-img');
            galleryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyGalleryFilter(btn.getAttribute('data-filter'));
        });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let lightboxIndex = 0;
    function getVisibleItems() { return Array.from(galleryItems).filter(item => !item.classList.contains('hidden')); }
    function openLightbox(index) {
        lightboxIndex = index;
        const items = getVisibleItems();
        const img = items[lightboxIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    function navigateLightbox(dir) {
        const items = getVisibleItems();
        lightboxIndex = (lightboxIndex + dir + items.length) % items.length;
        const img = items[lightboxIndex].querySelector('img');
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 200);
    }
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const items = getVisibleItems();
            openLightbox(items.indexOf(item));
        });
    });
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Contact Form
    document.getElementById('contact-form').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const name = data.get('name');
        const phone = data.get('phone');
        const message = data.get('message');
        const email = data.get('email');
        if (!name || !phone || !message) { showNotification('Please fill in all required fields.', 'error'); return; }
        if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) { showNotification('Please enter a valid phone number.', 'error'); return; }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('Please enter a valid email.', 'error'); return; }
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            btn.innerHTML = original;
            btn.disabled = false;
        }, 1500);
    });

    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const el = document.createElement('div');
        el.className = 'notification';
        el.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;margin-left:auto;">&times;</button>`;
        Object.assign(el.style, {
            position: 'fixed', top: '24px', right: '24px',
            maxWidth: '380px', padding: '16px 20px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', gap: '10px',
            zIndex: '10000', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem',
            background: type === 'success' ? '#D63384' : '#dc3545',
            color: '#fff', animation: 'fadeUp 0.4s ease'
        });
        document.body.appendChild(el);
        setTimeout(() => { if (el.parentElement) el.remove(); }, 5000);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 10, behavior: 'smooth' });
            }
        });
    });
});
