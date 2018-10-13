import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import sortBy from 'sort-by'
import ListBooks from './ListBooks'
import ShowBook from './ShowBook'
import SearchBooks from './SearchBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  
  state = {
    books: [],
    newBookMessageActive: false,
    newBookMessage: 'The book is added to your shelves!'
  }

  // Get all books with the BooksAPI
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }


  // method for changing the shelf of a book
  changeBookShelf = (targetBook, newShelf, addedNewBook) => {

    // Call the BooksAPI method to update the Books array
    BooksAPI.update(targetBook, newShelf)
    .then(response => {
      
      /* response is returned as an object with shelves containing the books, 
       * seperated with three keys
       * I need to get all the books as objects in one array */

      // loop over response object
      for (let item in response) {
        // loop over array in each object item
        response[item].forEach((elem, index) => {
          // change value of each array item to object of book
          let newBook = this.state.books.find(book => {
            if (book.id === elem) {
              // if current book is the same as the target book to change shelf
              // first edit the shelf property before returning
              if (book.id === targetBook.id) {
                book.shelf = newShelf
              }
              return book
            }
          })

          if (newBook === undefined)
            newBook = targetBook

          response[item][index] = newBook
        })
      } // end loop
      
      let newBooks = []

      // loop over new object and put all new object items in 1 array
      for (let books in response) {
        response[books].forEach(elem => newBooks.push(elem))
      }
      
      // use new array to update the state
      this.setState(state => ({
        books: newBooks
      }))

      if (addedNewBook) {

        // if the book was not on your shelves yet, show a message
        // to confirm that it was added succesfully

        this.setState(state => ({
          newBookMessageActive: true
        }))

        setTimeout(() => {
          this.setState(state => ({
            newBookMessageActive: false
          }))
        }, 6000)
      }

    })

  }


  render() {

    // set title
    document.title = 'My Books | BestReads'

    return (
      <div className="app">
        <div className="list-books">
          <div className="list-books-title">
            <h1>Best<span>Reads</span></h1>
          </div>            
        </div>
        <Route exact path="/" render={() => (
          <div>
            <ListBooks 
              books={this.state.books}
              onChangeShelf={(book, shelf, addedNewBook) => {
                this.changeBookShelf(book, shelf, addedNewBook)
              }}
            />
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
        <Route exact path='/books/:book' render={(book) => (
          <ShowBook
            bookUrl={book}
            allBooks={this.state.books}
            onChangeShelf={(book, shelf, addedNewBook) => {
              this.changeBookShelf(book, shelf, addedNewBook)
            }}
          />
        )}/>
        <Route exact path='/search' render={() => (
          <SearchBooks
            addedBooks={this.state.books}
            onAddBook={(book, shelf, addedNewBook) => {
              this.changeBookShelf(book, shelf, addedNewBook)
            }}
          />
        )}/>
        { this.state.newBookMessageActive && <div className="book-message">{this.state.newBookMessage}</div> }
      </div>
    )
  }
}

export default BooksApp
