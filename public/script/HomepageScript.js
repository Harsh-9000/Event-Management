// Venue Swiper
var swiper = new Swiper(".venueSwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    autoplay: { delay: 3000 },
    centeredSlide: "true",
    grabCursor: "true",
    fade: "true",
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },

        520: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 3,
        },

        1000: {
            slidesPerView: 4,
        }
    },
});

// Vendor Swiper
var swiper = new Swiper(".vendorSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    centeredSlide: "true",
    grabCursor: "true",
    fade: "true",
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },

        520: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 3,
        }
    }
});

// Testimonials Swiper
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: true,
    }
});

// Scroll Effect
window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.hidden');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        var revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('show');
        }
    }
};

// Navbar
