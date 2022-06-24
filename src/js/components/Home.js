import {templates, select, classNames} from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initActions();
  }
  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homePage();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.order = document.querySelector(select.containerOf.orderOnline);
    thisHome.dom.book = document.querySelector(select.containerOf.bookATable);
  }
  initActions() {
    const thisHome = this;
    thisHome.homeLinks = document.querySelectorAll(select.nav.homeLinks);
    thisHome.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.navLinks = document.querySelectorAll(select.nav.links);

    for (let homeLink of thisHome.homeLinks) {
      homeLink.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisHome.activatePage(id);
      });
    }


  }
  activatePage(id) {
    const thisHome = this;
    for(let page of thisHome.pages) {
      page.classList.toggle(classNames.pages.active, page.id == id);
    }
    for(let link of thisHome.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + id
      );
    }
    window.location.hash = '#/' + id;
  }
}

export default Home;