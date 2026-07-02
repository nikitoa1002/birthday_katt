// ========================================
// 1. МУЗЫКА (SweetAlert2 — каждый раз заново)
// ========================================
window.addEventListener('load', () => {
    Swal.fire({
        title: 'Хочешь, чтобы на фоне играла музыка?',
        icon: 'warning',
        showCancelButton: true,
        iconColor: '#FFB7C5',
        confirmButtonColor: '#FFB7C5',
        cancelButtonColor: '#FF6B6B',
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.setItem('musicEnabled', 'true');
            document.querySelector('.song').play();
        } else {
            sessionStorage.setItem('musicEnabled', 'false');
        }
    });
});

// ========================================
// 2. ОСНОВНАЯ ЛОГИКА (при загрузке DOM)
// ========================================
document.addEventListener('DOMContentLoaded', function () {

    // --- 2.1 Обратный отсчёт ДО дня рождения ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        function updateCountdown() {
            const now = new Date();
            const birthYear = 2011;
            const birthMonth = 6;
            const birthDay = 7;

            let birthdayThisYear = new Date(now.getFullYear(), birthMonth, birthDay);
            if (now > birthdayThisYear) {
                birthdayThisYear = new Date(now.getFullYear() + 1, birthMonth, birthDay);
            }

            let diff = birthdayThisYear - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            const nextAge = birthdayThisYear.getFullYear() - birthYear;

            countdownElement.innerHTML = `
                <div style="font-size: 20px; opacity: 0.9; margin-bottom: 8px;">
                    До ${nextAge}-летия осталось:
                </div>
                <div style="font-size: 32px; font-weight: 600; letter-spacing: 2px;">
                    ${days}д ${hours}ч ${minutes}м ${seconds}с
                </div>
            `;
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- 2.2 AOS ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- 2.3 Hall of Fame Scroller ---
    const scroller = document.getElementById('hall-of-fame-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        const card = scroller.querySelector('.snap-center');
        if (card) {
            const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);
            scrollRightBtn.addEventListener('click', () => {
                scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
            scrollLeftBtn.addEventListener('click', () => {
                scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }
    }

    // --- 2.4 Video Uploader ---
    const videoUploadInput = document.getElementById('video-upload');
    const videoPlayer = document.getElementById('video-player');
    const videoUploadLabel = document.getElementById('video-upload-label');
    if (videoUploadInput && videoPlayer && videoUploadLabel) {
        videoUploadLabel.addEventListener('click', () => videoUploadInput.click());
        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                videoPlayer.src = videoURL;
                videoPlayer.classList.remove('hidden');
                videoUploadLabel.classList.add('hidden');
                videoPlayer.play();
            }
        });
    }

    // --- 2.5 Sakura Petal Animation ---
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let petals = [];
        const numPetals = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Petal() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.w = 25 + Math.random() * 15;
            this.h = 20 + Math.random() * 10;
            this.opacity = this.w / 40;
            this.flip = Math.random();
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flipSpeed = Math.random() * 0.03;
        }
        Petal.prototype.draw = function () {
            if (this.y > canvas.height || this.x > canvas.width) {
                this.x = -this.w;
                this.y = Math.random() * canvas.height * 2 - canvas.height;
                this.xSpeed = 1.5 + Math.random() * 2;
                this.ySpeed = 1 + Math.random() * 1;
                this.flip = Math.random();
            }
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
            ctx.bezierCurveTo(this.x, this.y + this.h, this.x - this.w / 2, this.y, this.x, this.y);
            ctx.closePath();
            ctx.fillStyle = '#FFB7C5';
            ctx.fill();
        };
        Petal.prototype.update = function () {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.flip += this.flipSpeed;
            this.draw();
        };

        function createPetals() {
            petals = [];
            for (let i = 0; i < numPetals; i++) {
                petals.push(new Petal());
            }
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(petal => petal.update());
            requestAnimationFrame(animate);
        }
        createPetals();
        animate();
    }

    // --- 2.6 СЛАЙДЕР КАРТОЧЕК ДРУЗЕЙ ---
    const slides = document.querySelectorAll('.friend-card');
    const leftBtn = document.getElementById('slide-left');
    const rightBtn = document.getElementById('slide-right');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
        });
    }

    function nextSlide() {
        if (slides.length === 0) return;
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    function prevSlide() {
        if (slides.length === 0) return;
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    if (slides.length > 0) showSlide(0);

    if (leftBtn && rightBtn) {
        rightBtn.addEventListener('click', nextSlide);
        leftBtn.addEventListener('click', prevSlide);
        if (slides.length <= 1) {
            leftBtn.style.display = 'none';
            rightBtn.style.display = 'none';
        }
    }

    const container = document.getElementById('slider-container');
    let startX = 0;
    let isDragging = false;
    if (container && slides.length > 1) {
        container.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        container.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    });

    // --- 2.7 Замазанные ответы ---
    document.querySelectorAll('.qa-item').forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('open');
        });
    });

    // --- 2.8 СКРОЛЛ С ФОТО КАТИ ---
    const photoScroller = document.getElementById('photo-scroller');
    const photoLeftBtn = document.getElementById('scroll-left-btn');
    const photoRightBtn = document.getElementById('scroll-right-btn');
    if (photoScroller && photoLeftBtn && photoRightBtn) {
        const card = photoScroller.querySelector('.snap-center');
        if (card) {
            const cardWidth = card.offsetWidth + 24;
            photoRightBtn.addEventListener('click', () => {
                photoScroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
            photoLeftBtn.addEventListener('click', () => {
                photoScroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }
    }

    // --- 2.9 МОДАЛЬНОЕ ОКНО ---
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    let currentPhotoIndex = 0;
    let photoItems = [];
    let touchStartX_modal = 0;
    let touchEndX_modal = 0;

    function initPhotoModal() {
        photoItems = [];
        document.querySelectorAll('a[data-lightbox="kate"]').forEach((link, index) => {
            photoItems.push({
                src: link.getAttribute('href'),
                title: link.getAttribute('data-title') || 'Фото'
            });
            link.addEventListener('click', function (e) {
                e.preventDefault();
                currentPhotoIndex = index;
                openModal(currentPhotoIndex);
            });
        });
    }

    function openModal(index) {
        if (photoItems.length === 0) return;
        modal.classList.add('active');
        showPhoto(index);
        document.body.style.overflow = 'hidden';
    }

    function showPhoto(index) {
        const item = photoItems[index];
        modalImage.src = item.src;
        modalCaption.textContent = item.title;
        modalCounter.textContent = `${index + 1} / ${photoItems.length}`;
        currentPhotoIndex = index;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevPhoto() {
        if (photoItems.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + photoItems.length) % photoItems.length;
        showPhoto(currentPhotoIndex);
    }
    function nextPhoto() {
        if (photoItems.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % photoItems.length;
        showPhoto(currentPhotoIndex);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalPrev) modalPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
    if (modalNext) modalNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
    });

    if (modal) {
        modal.addEventListener('touchstart', function (e) {
            touchStartX_modal = e.changedTouches[0].screenX;
        }, { passive: true });
        modal.addEventListener('touchend', function (e) {
            touchEndX_modal = e.changedTouches[0].screenX;
            const diff = touchStartX_modal - touchEndX_modal;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextPhoto() : prevPhoto();
            }
        }, { passive: true });
    }

    initPhotoModal();

    // ========================================
    // 3. АНИМАЦИОННЫЙ БЛОК
    // ========================================

    let animationStarted = false;
    let audioFadeInterval = null;

    function startAnimation() {
        if (animationStarted) return;
        animationStarted = true;

        // --- Проверяем выбор в sessionStorage ---
        const musicEnabled = sessionStorage.getItem('musicEnabled');
        const audio = document.querySelector('.song');

        if (musicEnabled === 'true' && audio) {
            if (!audio.paused) {
                const fadeStep = 0.05;
                const fadeInterval = 50;
                audioFadeInterval = setInterval(() => {
                    if (audio.volume > fadeStep) {
                        audio.volume = Math.max(0, audio.volume - fadeStep);
                    } else {
                        audio.volume = 0;
                        clearInterval(audioFadeInterval);
                        audioFadeInterval = null;
                        audio.currentTime = 0;
                        audio.volume = 1;
                        audio.play().catch(() => { });
                    }
                }, fadeInterval);
            } else {
                audio.currentTime = 0;
                audio.volume = 1;
                audio.play().catch(() => { });
            }
        }

        animationTimeline();
    }

    function checkIfScrolledToBottom() {
        const pageHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        const offset = 500;

        if (scrollPosition >= pageHeight - offset && !animationStarted) {
            startAnimation();
        }
    }

    setTimeout(checkIfScrolledToBottom, 300);
    window.addEventListener('scroll', checkIfScrolledToBottom, { passive: true });
    window.addEventListener('resize', checkIfScrolledToBottom, { passive: true });

    // ========================================
    // 4. АНИМАЦИОННАЯ ШКАЛА
    // ========================================

    function animationTimeline() {
        const textBoxChars = document.querySelector('.birthday-animation-section .anim-hbd-chatbox');
        const hbd = document.querySelector('.birthday-animation-section .anim-wish-hbd');

        if (textBoxChars) {
            textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
                .split("")
                .join("</span><span>")}</span>`;
        }
        if (hbd) {
            hbd.innerHTML = `<span>${hbd.innerHTML
                .split("")
                .join("</span><span>")}</span>`;
        }

        const ideaTextTrans = {
            opacity: 0,
            y: -20,
            rotationX: 5,
            skewX: "15deg"
        };
        const ideaTextTransLeave = {
            opacity: 0,
            y: 20,
            rotationY: 5,
            skewX: "-15deg"
        };

        const tl = new TimelineMax();

        tl.to(".birthday-animation-section .anim-wrap", 0.6, { visibility: "visible" })
            .from(".birthday-animation-section .anim-one", 0.7, { opacity: 0, y: 10 })
            .from(".birthday-animation-section .anim-two", 0.4, { opacity: 0, y: 10 })
            .to(".birthday-animation-section .anim-one", 0.7, { opacity: 0, y: 10 }, "+=3.5")
            .to(".birthday-animation-section .anim-two", 0.7, { opacity: 0, y: 10 }, "-=1")
            .from(".birthday-animation-section .anim-three", 0.7, { opacity: 0, y: 10 })
            .to(".birthday-animation-section .anim-three", 0.7, { opacity: 0, y: 10 }, "+=3")
            .from(".birthday-animation-section .anim-four", 0.7, { scale: 0.2, opacity: 0 })
            .from(".birthday-animation-section .anim-fake-btn", 0.3, { scale: 0.2, opacity: 0 })
            .staggerTo(".birthday-animation-section .anim-hbd-chatbox span", 1.5, { visibility: "visible" }, 0.05)
            .to(".birthday-animation-section .anim-fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" }, "+=4")
            .to(".birthday-animation-section .anim-four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=1")
            .from(".birthday-animation-section .anim-idea-1", 0.7, ideaTextTrans)
            .to(".birthday-animation-section .anim-idea-1", 0.7, ideaTextTransLeave, "+=2.5")
            .from(".birthday-animation-section .anim-idea-2", 0.7, ideaTextTrans)
            .to(".birthday-animation-section .anim-idea-2", 0.7, ideaTextTransLeave, "+=2.5")
            .from(".birthday-animation-section .anim-idea-3", 0.7, ideaTextTrans)
            .to(".birthday-animation-section .anim-idea-3 strong", 0.5, { scale: 1.2, x: 10, backgroundColor: "rgb(21, 161, 237)", color: "#fff" })
            .to(".birthday-animation-section .anim-idea-3", 0.7, ideaTextTransLeave, "+=2.5")
            .from(".birthday-animation-section .anim-idea-4", 0.7, ideaTextTrans)
            .to(".birthday-animation-section .anim-idea-4", 0.7, ideaTextTransLeave, "+=2.5")
            .from(".birthday-animation-section .anim-idea-5", 0.7, { rotationX: 15, rotationZ: -10, skewY: "-5deg", y: 50, z: 10, opacity: 0 }, "+=1.5")
            .to(".birthday-animation-section .anim-idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=1.4")
            .to(".birthday-animation-section .anim-idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")
            .staggerFrom(".birthday-animation-section .anim-idea-6 span", 0.8, { scale: 3, opacity: 0, rotation: 15, ease: Expo.easeOut }, 0.2)
            .staggerTo(".birthday-animation-section .anim-idea-6 span", 0.8, { scale: 3, opacity: 0, rotation: -15, ease: Expo.easeOut }, 0.2, "+=1.5")
            .staggerFromTo(".birthday-animation-section .anim-baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000 }, 0.2)
            .from(".birthday-animation-section .anim-profile-picture", 0.5, { scale: 3.5, opacity: 0, x: 25, y: -25, rotationZ: -45 }, "-=2")
            .from(".birthday-animation-section .anim-hat", 0.5, { x: -100, y: 350, rotation: -180, opacity: 0 })
            .staggerFrom(".birthday-animation-section .anim-wish-hbd span", 0.7, { opacity: 0, y: -50, rotation: 150, skewX: "30deg", ease: Elastic.easeOut.config(1, 0.5) }, 0.1)
            .staggerFromTo(".birthday-animation-section .anim-wish-hbd span", 0.7, { scale: 1.4, rotationY: 150 }, { scale: 1, rotationY: 0, color: "#ff69b4", ease: Expo.easeOut }, 0.1, "party")
            .from(".birthday-animation-section .anim-wish-text", 0.5, { opacity: 0, y: 10, skewX: "-15deg" }, "party")
            .staggerTo(".birthday-animation-section .anim-eight svg", 1.5, { visibility: "visible", opacity: 0, scale: 60, repeat: 3, repeatDelay: 1.4, ease: "power2.out" }, 0.3)
            .to(".birthday-animation-section .anim-six", 0.5, { opacity: 0, y: 30, zIndex: "-1" })
            .staggerFrom(".birthday-animation-section .anim-nine p", 1, ideaTextTrans, 1.2)
            .to(".birthday-animation-section .anim-last-smile", 0.5, { rotation: 90 }, "+=1");

        const replyBtn = document.getElementById("replay");
        if (replyBtn) {
            replyBtn.addEventListener("click", () => {
                tl.restart();
            });
        }
    }

}); // конец DOMContentLoaded