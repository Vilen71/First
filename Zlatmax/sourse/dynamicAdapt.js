export class DynamicAdapt {
   constructor(type) {
      this.type = type
   }

   init() {
      // массив объектов
      this.оbjects = []
      this.daClassname = '_dynamic_adapt_'
      // массив DOM-элементов
      this.nodes = [...document.querySelectorAll('[data-da]')]

      // наполнение оbjects объктами
      this.nodes.forEach((node) => {
         const data = node.dataset.da.trim()
         const dataArray = data.split(',')
         const оbject = {}
         оbject.element = node
         оbject.parent = node.parentNode
         оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
         оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
         оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
         оbject.index = this.indexInParent(оbject.parent, оbject.element)
         this.оbjects.push(оbject)
      })

      this.arraySort(this.оbjects)

      // массив уникальных медиа-запросов
      this.mediaQueries = this.оbjects
         .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
         .filter((item, index, self) => self.indexOf(item) === index)

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      this.mediaQueries.forEach((media) => {
         const mediaSplit = media.split(',')
         const matchMedia = window.matchMedia(mediaSplit[0])
         const mediaBreakpoint = mediaSplit[1]

         // массив объектов с подходящим брейкпоинтом
         const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
         matchMedia.addEventListener('change', () => {
            this.mediaHandler(matchMedia, оbjectsFilter)
         })
         this.mediaHandler(matchMedia, оbjectsFilter)
      })
   }

   // Основная функция
   mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches) {
         оbjects.forEach((оbject) => {
            // оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination)
         })
      } else {
         оbjects.forEach(({ parent, element, index }) => {
            if (element.classList.contains(this.daClassname)) {
               this.moveBack(parent, element, index)
            }
         })
      }
   }

   // Функция перемещения
   moveTo(place, element, destination) {
      element.classList.add(this.daClassname)
      if (place === 'last' || place >= destination.children.length) {
         destination.append(element)
         return
      }
      if (place === 'first') {
         destination.prepend(element)
         return
      }
      destination.children[place].before(element)
   }

   // Функция возврата
   moveBack(parent, element, index) {
      element.classList.remove(this.daClassname)
      if (parent.children[index] !== undefined) {
         parent.children[index].before(element)
      } else {
         parent.append(element)
      }
   }

   // Функция получения индекса внутри родителя
   indexInParent(parent, element) {
      return [...parent.children].indexOf(element)
   }

   // Функция сортировки массива по breakpoint и place
   // по возрастанию для this.type = min
   // по убыванию для this.type = max
   arraySort(arr) {
      if (this.type === 'min') {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0
               }
               if (a.place === 'first' || b.place === 'last') {
                  return -1
               }
               if (a.place === 'last' || b.place === 'first') {
                  return 1
               }
               return 0
            }
            return a.breakpoint - b.breakpoint
         })
      } else {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0
               }
               if (a.place === 'first' || b.place === 'last') {
                  return 1
               }
               if (a.place === 'last' || b.place === 'first') {
                  return -1
               }
               return 0
            }
            return b.breakpoint - a.breakpoint
         })
         return
      }
   }
}

export function useDynamicAdapt(type = 'max') {
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