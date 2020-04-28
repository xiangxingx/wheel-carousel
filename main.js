class Carousel {
  constructor(root, animation) {
    this.root = root
    this.animation = animation
    this.imgs = Array.from(this.root.querySelectorAll('.carousel .images > a'))
    this.dots = Array.from(this.root.querySelectorAll('.actions .dots > span'))
    this.dotContainer = this.root.querySelector('.dots')
    this.previous = this.root.querySelector('.previous')
    this.next = this.root.querySelector('.next')

    this.band()
  }
  get index() {
    return this.dots.indexOf(this.root.querySelector('.dots .active'))
  }
  get preIndex() {
    return (this.index - 1 + this.imgs.length) % this.imgs.length
  }
  get nextIndex() {
    return (this.index + 1) % this.imgs.length
  }

  band() {
    this.dotContainer.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'SPAN') {
        let targetIndex = this.dots.indexOf(ev.target)
        this.setView(this.index, targetIndex)
        this.setDot(targetIndex)
      }
    })
    this.previous.addEventListener('click', () => {
      this.setView(this.index, this.preIndex)
      this.setDot(this.preIndex)
    })
    this.next.addEventListener('click', () => {
      this.setView(this.index, this.nextIndex)
      this.setDot(this.nextIndex)
    })
  }

  setView(index, nextIndex) {
    let that = this
    function setImage() {
      that.imgs.forEach(img => { img.style.zIndex = 0 })
      that.imgs[nextIndex].style.zIndex = 10
      console.log('finish')
    }
    if (typeof this.animation === 'function') {
      this.animation(this.imgs[index], this.imgs[nextIndex], setImage)
    } else {
      setImage()
    }
  }

  setDot(index) {
    this.dots.forEach(dot => { dot.classList.remove('active') })
    this.dots[index].classList.add('active')
  }
}

const Animation = {
  fade: function () {
    return function (fromNode, toNode, callBack) {
      let opacityFrom = 1
      let opacityTo = 0
      fromNode.style.zIndex = 10
      toNode.style.zIndex = 9
      function fromAnimation() {
        if (opacityFrom > 0) {
          opacityFrom -= 0.04
          fromNode.style.opacity = opacityFrom
          requestAnimationFrame(fromAnimation)
        } else {
          fromNode.style.opacity = 0
        }
      }
      function toAnimation() {
        if (opacityTo < 1) {
          opacityTo += 0.04
          toNode.style.opacity = opacityTo
          requestAnimationFrame(toAnimation)
        } else {
          toNode.style.opacity = 1
          fromNode.style.opacity = 1
          callBack()
        }
      }
      fromAnimation()
      toAnimation()
    }
  },
  slide: function () {
    return function (fromNode, toNode, callBack) {
      let nodeWidth = parseInt(getComputedStyle(fromNode).width)
      let offsetX = nodeWidth
      let offSetFrom = 0
      let offSetTo = 0
      fromNode.style.zIndex = 10
      toNode.style.zIndex = 10
      toNode.style.left = nodeWidth + 'px'

      let nodes = Array.from(fromNode.parentNode.querySelectorAll('a'))
      let fromIndex = nodes.indexOf(fromNode) + 1
      let toIndex = nodes.indexOf(toNode) + 1

      function fromAnimation() {
        if (offSetFrom < offsetX) {
          offSetFrom += 25
          if (fromIndex < toIndex) {
            fromNode.style.left = (-offSetFrom) + 'px'
          } else {
            fromNode.style.left = offSetFrom + 'px'
          }
          requestAnimationFrame(fromAnimation)
        }
      }
      function toAnimation() {
        if (offSetTo < offsetX) {
          offSetTo += 25
          if (fromIndex < toIndex) {
            toNode.style.left = (nodeWidth - offSetTo) + 'px'
          } else {
            toNode.style.left = -(nodeWidth - offSetTo) + 'px'
          }
          requestAnimationFrame(toAnimation)
        } else {
          callBack()
          fromNode.style.left = 0
          toNode.style.left = 0
        }
      }
      fromAnimation()
      toAnimation()
    }
  },
  zoom: function () {
    const css = (node, styles) => Object.entries(styles).forEach(([key, value]) => node.style[key] = value)
    return function (fromNode, toNode, callBack) {
      css(fromNode, {
        zIndex: 10,
        transition: `all 0.3s`,
        transform: `scale(5)`,
        opacity: 0
      })
      css(toNode, {
        zIndex: 9
      })
      setTimeout(() => {
        css(fromNode, {
          transition: 'none',
          transform: `none`,
          opacity: 1
        })
        callBack()
      }, 500)
    }
  }
}

const rootNode = document.querySelector('.carousel')
const carousel = new Carousel(rootNode, Animation.fade())

let selects = document.querySelector('#selects')
selects.addEventListener('click', (ev) => {
  carousel.animation = Animation[ev.target.name]()
  Array.from(selects.children).forEach((select) => {
    select.classList.remove('active')
  })
  ev.target.classList.add('active')
})


