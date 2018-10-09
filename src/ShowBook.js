import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'

class ShowBook extends Component {
  static propTypes = {
    allBooks: PropTypes.array.isRequired,
    bookUrl: PropTypes.object.isRequired
  }

  state: {
    thisBook: []
  }

  /* Function to change the shelf of a selected book
   * Uses the book id also set to the select-element
   * to perform the change
   *
   */
  changeShelf = (bookId, newShelf) => {

  	// Copy the books array for manipulation before updating
  	let booksCopy = this.props.allBooks

  	// get the book that should have its shelf changed
  	let targetBook = booksCopy.find(e => e.id === bookId)

  	// Before we change, check if the selected shelf isn't the current one
  	if (targetBook.shelf !== newShelf) {

  		// call onChangeShelf function in App.js
	  	if (this.props.onChangeShelf) {
			this.props.onChangeShelf(targetBook, newShelf)
		  }
  	}

  }

  render() {
    const { allBooks, bookUrl } = this.props

    if (allBooks.length) {

      if (bookUrl.match.params.book) {

        const thisBook = allBooks.find(book => {
          let convertTitle = book.title.replace(/ /g, '-').toLowerCase()
          if (convertTitle === bookUrl.match.params.book) {
            return book
          }
        })

        console.log(thisBook)

        return (
            <article className="showBook">
              <div className="bookshelf">
                <h2>
                  <Link className="close-search" to="/">Close</Link>
                  {thisBook.title}
                </h2>
                { thisBook.subtitle ? <h3 className="subTitle">{thisBook.subtitle}</h3>: ''}
              </div>
              <img src={thisBook.imageLinks.thumbnail} alt={thisBook.title} />
              <div className="book-authors">
                { thisBook.authors.join(', ') }
              </div>
              <p className="bookDescription">{thisBook.description}</p>
              <nav className={thisBook.shelf}>
                <strong>Add to shelf:</strong>
                <button className="toShelf wantToRead" onClick={this.changeShelf(thisBook.id, 'wantToRead')}>Want To Read</button>
                <button className="toShelf currentlyReading" onClick={this.changeShelf(thisBook.id, 'currentlyReading')}>Currently Reading</button>
                <button className="toShelf read" onClick={this.changeShelf(thisBook.id, 'read')}>Read</button>
              </nav>
              <Link className="back" to="/">Back to overview</Link>
            </article>
          )
      }

    } else {
      
      // show loading animation when data is not ready yet
      return (
        <div className="loadingAnim">
          <img width="30" height="30" src="/icons/loading.gif" alt="loading" />
          <p>Loading...</p>
        </div>)
    }
  }
}

export default ShowBook