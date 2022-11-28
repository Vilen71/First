const btn = document.querySelector(".phones-header__arrow");
const list = document.querySelector(".phones-header__list");
const body = document.querySelector("body");
const style = getComputedStyle(list)

document.addEventListener("click", menu);

function menu(e) {

   if (e.target === btn) {
      if (list.style.maxHeight) {
         list.style = 0;
         btn.classList.remove("active")
         // console.log(style.maxHeight);
      }
      else {
         list.style.maxHeight = list.scrollHeight + 'px';
         list.style.padding = '10px 0 10px 10px';
         btn.classList.add("active")
         // console.log(list.style.maxHeight);
      };
   }

   if (!e.target.closest(".phones-header__arrow") && !e.target.closest(".phones-header__list") && !e.target.closest(".phones-header__phone")) {
      list.style = null;
   }

}


document.addEventListener("click", documentActions);

const menuBlocks = document.querySelectorAll(".sub-menu-catalog__block");
if (menuBlocks.length) {
   menuBlocks.forEach(menuBlock => {
      const menuBlockItems = menuBlock.querySelectorAll(".sub-menu-catalog__category").length;
      menuBlock.classList.add(`sub-menu-catalog__block_${menuBlockItems}`)
   });
}

function documentActions(e) {
   const targetElement = e.target;
   if (targetElement.closest('[data-parent]')) {
      const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
      const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
      const catalogMenu = document.querySelector(".catalog-header");
      if (subMenu) {
         const activeLink = document.querySelector("._sub-menu-active");
         const activeBlock = document.querySelector("._sub-menu-open");
      }
      targetElement.classList.toggle('_sub-menu-active');

   } else {
      console.log("Нет такого подменю");
   }
   e.preventDefault();
}

const burger = document.querySelector(".menu__burger");
const menuBurger = document.querySelector(".menu__body");
const logo = document.querySelector(".menu__logo-copy");
const login = document.querySelector(".menu__login");

burger.addEventListener("click", function () {
   menuBurger.classList.toggle("active");
   login.classList.toggle("active");
   body.classList.toggle("lock");
});


new Swiper(".swiper", {
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   },

   spaceBetween: 50,
});


//================================================

function useDynamicAdapt(type = 'max') {
   const className = '_dynamic_adapt_'
   const attrName = 'data-da'

   /** @type {dNode[]} */
   const dNodes = getDNodes()

   /** @type {dMediaQuery[]} */
   const dMediaQueries = getDMediaQueries(dNodes)

   dMediaQueries.forEach((dMediaQuery) => {
      const matchMedia = window.matchMedia(dMediaQuery.query)
      // массив объектов с подходящим брейкпоинтом
      const filteredDNodes = dNodes.filter(({ breakpoint }) => breakpoint === dMediaQuery.breakpoint)
      const mediaHandler = getMediaHandler(matchMedia, filteredDNodes)
      matchMedia.addEventListener('change', mediaHandler)

      mediaHandler()
   })

   function getDNodes() {
      const result = []
      const elements = [...document.querySelectorAll(`[${attrName}]`)]

      elements.forEach((element) => {
         const attr = element.getAttribute(attrName)
         const [toSelector, breakpoint, order] = attr.split(',').map((val) => val.trim())

         const to = document.querySelector(toSelector)

         if (to) {
            result.push({
               parent: element.parentElement,
               element,
               to,
               breakpoint: breakpoint ?? '767',
               order: order !== undefined ? (isNumber(order) ? Number(order) : order) : 'last',
               index: -1,
            })
         }
      })

      return sortDNodes(result)
   }

   /**
    * @param {dNode} items
    * @returns {dMediaQuery[]}
    */
   function getDMediaQueries(items) {
      const uniqItems = [...new Set(items.map(({ breakpoint }) => `(${type}-width: ${breakpoint}px),${breakpoint}`))]

      return uniqItems.map((item) => {
         const [query, breakpoint] = item.split(',')

         return { query, breakpoint }
      })
   }

   /**
    * @param {MediaQueryList} matchMedia
    * @param {dNodes} items
    */
   function getMediaHandler(matchMedia, items) {
      return function mediaHandler() {
         if (matchMedia.matches) {
            items.forEach((item) => {
               moveTo(item)
            })

            items.reverse()
         } else {
            items.forEach((item) => {
               if (item.element.classList.contains(className)) {
                  moveBack(item)
               }
            })

            items.reverse()
         }
      }
   }

   /**
    * @param {dNode} dNode
    */
   function moveTo(dNode) {
      const { to, element, order } = dNode
      dNode.index = getIndexInParent(dNode.element, dNode.element.parentElement)
      element.classList.add(className)

      if (order === 'last' || order >= to.children.length) {
         to.append(element)

         return
      }

      if (order === 'first') {
         to.prepend(element)

         return
      }

      to.children[order].before(element)
   }

   /**
    * @param {dNode} dNode
    */
   function moveBack(dNode) {
      const { parent, element, index } = dNode
      element.classList.remove(className)

      if (index >= 0 && parent.children[index]) {
         parent.children[index].before(element)
      } else {
         parent.append(element)
      }
   }

   /**
    * @param {HTMLElement} element
    * @param {HTMLElement} parent
    */
   function getIndexInParent(element, parent) {
      return [...parent.children].indexOf(element)
   }

   /**
    * Функция сортировки массива по breakpoint и order
    * по возрастанию для type = min
    * по убыванию для type = max
    *
    * @param {dNode[]} items
    */
   function sortDNodes(items) {
      const isMin = type === 'min' ? 1 : 0

      return [...items].sort((a, b) => {
         if (a.breakpoint === b.breakpoint) {
            if (a.order === b.order) {
               return 0
            }

            if (a.order === 'first' || b.order === 'last') {
               return -1 * isMin
            }

            if (a.order === 'last' || b.order === 'first') {
               return 1 * isMin
            }

            return 0
         }

         return (a.breakpoint - b.breakpoint) * isMin
      })
   }

   function isNumber(value) {
      return !isNaN(value)
   }
}
useDynamicAdapt()