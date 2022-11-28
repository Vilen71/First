new Swiper(".image-slider", {
   // Стрелки
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
   },

   // Навигация
   // Буллиты, текущее положение
   pagination: {
      el: '.swiper-pagination',
      // type: 'bullets', // по умолчанию
      // clickable: true,
      // dynamicBullets: true,
      // // Кастомные буллиты
      // renderBullet: function (index, className) {
      //    return '<span class="' + className + '">' + (index + 1) + '</span>';
      // }

      // Фракция
      // type: 'fraction',
      // // Кастомная фракция
      // renderFraction: function (currentClass, totalClass) {
      //    return 'Фото <span class= "' + currentClass + '"></span>' +
      //       ' из ' +
      //       '<span class="' + totalClass + '"></span >';
      // }
      // ПрогрессБар
      type: 'fraction',
   },

   scrollbar: {
      el: '.swiper-scrollbar',
      //Возможность перетаскивать скролл
      draggable: true,
   },

   //Перетаскивания на пк
   simulateTouch: true,
   //Чувствительность
   touchRatio: 1,
   //Угол срабатывания свайпа/перетаскивания
   touchAngle: 45,
   //Курсор перетаскивания
   grabCursor: false,
   //Переключение слайда кликом на него
   slideToClickedSlide: true,

   keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: true,
   },
   mousewheel: {
      sensevity: 50,
      eventsTarget: ".image-slider",
   },
   slidesPerView: 1,

   spaceBetween: 10,

   slidesPerGroup: 1,

   centeredSlides: true,

   loop: true,

   effect: 'swiper',
});