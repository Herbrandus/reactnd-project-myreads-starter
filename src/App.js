import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  
  state = {
    books: [],
    showSearchPage: false,
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  changeBookShelf = (targetBook, newShelf) => {

    console.log('new shelf: ', newShelf)

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
           let newBook = this.state.books.find(book => book.id === elem)
          response[item][index] = newBook
        })
      } // end loop
      
      let newBooks = []

      // loop over new object and put all new object items in 1 array
      for (let books in response) {
        response[books].forEach(elem => newBooks.push(elem))
      }     
      
      console.log('new books: ', newBooks)

      // use new array to update the state
      this.setState(state => ({
        books: newBooks
      }))

    })

  }
  
  /**
   * TODO: Instead of using this state variable to keep track of which page
   * we're on, use the URL in the browser's address bar. This will ensure that
   * users can use the browser's back and forward buttons to navigate between
   * pages, as well as provide a good URL they can bookmark and share.
   */

  render() {

    const { query } = this.state
    
    return (
      <div className="app">
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>            
        </div>
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder=""/>
                <input
                  className='search-books-input'
                  type='text'
                  placeholder='Search by title or author'
                  value={query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div>
            <div className="list-books-content">
              <Route exact path="/" render={() => (
                <ListBooks 
                  books={this.state.books}
                  onChangeShelf={(book, shelf) => {
                    this.changeBookShelf(book, shelf)
                  }}
                />
              )}/>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
