/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  ('use strict');
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      book: '.books-list',
      image: '.book_image',
      filters: '.filters',
    },
  };
  const templates = {
    book: Handlebars.compile(
      document.querySelector(select.templateOf.book).innerHTML
    ),
  };
  class Book {
    constructor() {
      const thisBook = this;
      thisBook.initData();
      thisBook.getElements();
      thisBook.render();
      thisBook.initActions();
    }
    getElements() {
      const thisBook = this;
      thisBook.dom = {};
      thisBook.dom.book = document.querySelector(select.containerOf.book);
      thisBook.dom.filters = document.querySelector(select.containerOf.filters);
    }
    initData() {
      const thisBook = this;
      thisBook.data = dataSource.books;
      thisBook.favoriteBooks = [];
      thisBook.filters = [];
    }
    render() {
      const thisBook = this;
      for (let book of thisBook.data) {
        const ratingBgc = thisBook.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        book.ratingWidth = ratingWidth;
        book.ratingBgc = ratingBgc;
        /*generate HTML based on template*/
        const generatedHTML = templates.book(book);
        /*create element using utils.createElementFromHTML*/
        thisBook.element = utils.createDOMFromHTML(generatedHTML);
        /*find book list container*/
        thisBook.bookList = document.querySelector(select.containerOf.book);
        /*add book to list*/
        thisBook.bookList.appendChild(thisBook.element);
        console.log('thisBookList', thisBook.bookList);
      }
    }

    initActions() {
      const thisBook = this;

      thisBook.dom.book.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const clickedBook = event.target.offsetParent;
        const bookId = clickedBook.getAttribute('data-id');

        if (thisBook.favoriteBooks.includes(bookId)) {
          console.log('bookclicked', clickedBook);
          console.log('bookid', bookId);

          clickedBook.classList.remove('favorite');

          thisBook.favoriteBooks.splice(bookId, 1);
          //thisBook.favoriteBooks.pop(bookId);
          console.log('favoriteArray', thisBook.favoriteBooks);
        } else {
          clickedBook.classList.add('favorite');
          thisBook.favoriteBooks.push(bookId);
          console.log('favoriteArray', thisBook.favoriteBooks);
        }
      });
      thisBook.dom.filters.addEventListener('click', function (event) {
        let clickedFilter = event.target;
        if (
          clickedFilter.tagName == 'INPUT' &&
          clickedFilter.type == 'checkbox' &&
          clickedFilter.name == 'filter'
        ) {
          if (clickedFilter.checked) {
            thisBook.filters.push(clickedFilter.value);
            console.log('favArray', thisBook.filters);
          } else {
            const value = thisBook.filters.indexOf(clickedFilter.value);
            thisBook.filters.splice(value, 1);
            console.log('favArray', thisBook.filters);
          }
        }
        thisBook.filterBooks();
      });
    }
    filterBooks() {
      const thisBook = this;
      for (let book of thisBook.data) {
        const filteredBook = document.querySelector(
          '.book__image[data-id="' + book.id + '"]'
        );
        let shouldBeHidden = false;
        for (const filter of thisBook.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden == true) {
          filteredBook.classList.add('hidden');
        } else {
          filteredBook.classList.remove('hidden');
        }
      }
    }
    determineRatingBgc(rating) {
      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }

  const app = new Book();
  console.log('app', app);
}
