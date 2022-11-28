new Swiper(".swiper", {
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },
   slidesPerView: 2.55,
   loop: true,

   breakpoints: {
      2400: {
         spaceBetween: 0,
         slidesPerView: 2.8,
      },
      2000: {
         spaceBetween: 300,
         slidesPerView: 2.8,
      },
      1700: {
         spaceBetween: 500,
         slidesPerView: 2.8,
      },
      1500: {
         spaceBetween: 300,
         slidesPerView: 2.4,
      },
      1200: {
         spaceBetween: 300,
         slidesPerView: 2,
      },
      100: {
         spaceBetween: 30,
         slidesPerView: 1.3,
      },
   }
});

const btn = document.querySelector(".video__btn");
const img = document.querySelector(".video__img")
const content = document.querySelector(".video__content")
const video = document.querySelector(".video__self")
const burger = document.querySelector(".header__burger")
const headerNav = document.querySelector(".header__nav")
const hidden = document.querySelector(".hidden")

burger.addEventListener("click", function () {
   burger.classList.toggle("active");
   headerNav.classList.toggle("active");
   hidden.classList.toggle("active");
});

content.onclick = function () {
   if (video.paused) {
      img.classList.add("none")
      content.classList.remove("video__overlay")
      btn.classList.add("none")
      video.play();
   }
   else {
      video.pause();
      btn.classList.remove("none")
      content.classList.add("video__overlay")
   }
}