const dom = (function dom() {
  function append(element, content) {
    element.insertAdjacentHTML('beforeend', content);
  }

  function render(element, content) {
    element.innerHTML = content;
  }

  function getElement(element, target) {
    return element.querySelector(target);
  }

  function addClass(element, theClass) {
    element.classList.add(theClass);
  }
  function removeClass(element, theClass) {
    element.classList.remove(theClass);
  }

  function setEventHandler(selector, event, handler) {
    const items = [...document.querySelectorAll(selector)];
    items.forEach((item) => {
      item.addEventListener(event, handler);
    });
  }

  return {
    append,
    render,
    getElement,
    addClass,
    removeClass,
    setEventHandler,
  };
}());


export default dom;