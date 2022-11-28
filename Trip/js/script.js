new Swiper(".swiper", {
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },

   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   },

   keyboard: {
      enabled: true,
   },

   centeredSlides: true,
   slidesPerGroup: 1,
   slidesPerView: 3,
   initialSlide: 1,

   breakpoints: {
      320: {
         spaceBetween: -25,
         slidesPerView: 1,
      },
      500: {
         spaceBetween: -95,
         slidesPerView: 1,
      },
      550: {
         spaceBetween: 0,
         slidesPerView: 3.2,
      },
      800: {
         slidesPerView: 3,
         spaceBetween: 40,
      },
      900: {
         spaceBetween: 5,
      },
      1000: {
         spaceBetween: 20,
      },
   },

});

const body = document.documentElement;

const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".header__menu");
const header = document.querySelector(".header");

burger.onclick = function () {
   header.classList.toggle("header-active");
   burger.classList.toggle("active");
   menu.classList.toggle("active");
   body.classList.toggle("lock");
};


