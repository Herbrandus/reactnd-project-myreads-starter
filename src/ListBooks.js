import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired
  }

  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  /* Function to change the shelf of a selected book
   * Uses the book id also set to the select-element
   * to perform the change
   *
   */
  changeShelf = (bookId) => {

  	// Get the value of the new selected shelf
  	let newShelf = document.getElementById(bookId).value

  	// Copy the books array for manipulation before updating
  	let booksCopy = this.props.books

	// Get the accompanying key of the book with the given id
  	let targetKey
  	booksCopy.forEach((book, key) => {
  		console.log(key)
  		if (book.id === bookId)
  			targetKey = key
  	})

  	// Get the book out of the copied books array using the key
	let targetBook = {...booksCopy[targetKey]}

  	console.log('current shelf: ' + targetBook.shelf)

  	// Before we change, check if the selected shelf isn't the current one
  	if (targetBook.shelf == newShelf) {

  		// Set the new shelf for the selected book
	  	targetBook.shelf = newShelf

	  	console.log('new shelf: ' + targetBook.shelf)

	  	// Update copied Books array
	  	booksCopy[targetKey] = targetBook

	  	// Call the BooksAPI method to update the Books array
	  	BooksAPI.update(this.props.books).then(books => {
	      this.setState(state => ({
	        books: booksCopy
	      }))
	    })
  	}

  }

  render() {
    const { books } = this.props
    const { query } = this.state

    if (books.length) {

    	let showBooks
	    if (query) {
	      const match = new RegExp(escapeRegExp(query), 'i')
	      showBooks = books.filter((book) => match.test(book.name))
	    } else {
	      showBooks = books
	    }

	    showBooks.sort(sortBy('name'))

	    /* <input
	            className='search-contacts'
	            type='text'
	            placeholder='Search contacts'
	            value={query}
	            onChange={(event) => this.updateQuery(event.target.value)}
	          /> */

	    // filter for each shelf
	    const currReading = books.filter((book) => book.shelf === 'currentlyReading')
	    const wantToRead = books.filter((book) => book.shelf === 'wantToRead')
	    const haveRead = books.filter((book) => book.shelf === 'read')

	    // put shelves in array with title for easy mapping during render
	    const shelves = [
	    	{ 	id: 'shelf1',
	    		title: 'Currently Reading',
	    		books: currReading
	    	},
	    	{ 	id: 'shelf2',
	    		title: 'Want to Read',
	    		books: wantToRead
	    	},
	    	{ 	id: 'shelf3',
	    		title: 'Read',
	    		books: haveRead
	    	}
	    ]

	    return (
	      <div>
	          {shelves.map((shelf) => (
				<div key={shelf.id} className="bookshelf">
					<h2>{shelf.title}</h2>
					<div className="bookshelf-books">
						<ol className="books-grid">
						{shelf.books.map((book) => (
							<li key={book.id}>
								<div className="book">
									<div className="book-top">
										<div className="book-cover" style={{
							                width: 128,
							                height: 193,
							                backgroundImage: `url(${book.imageLinks.smallThumbnail})`
							              }}/>
							              <div className="book-shelf-changer">
											<select id={book.id} onChange={(value) => this.changeShelf(book.id) }>
												<option value="move" disabled>Move to...</option>
												<option value="currentlyReading">Currently Reading</option>
												<option value="wantToRead">Want To Read</option>
												<option value="read">Read</option>
												<option value="none">None</option>
											</select>
							              </div>
									</div>
									<div className="book-title">{book.title}</div>
									<div className="book-authors">
										{ book.authors.join(', ') }
									</div>
								</div>
							</li>
						))}
						</ol>
					</div>
				</div>
	          ))}
	      </div>
	    )

	} else {

		return (
			<div className="loadingAnim">
				<img width="30" height="30" src="/icons/loading.gif" alt="loading" />
				<p>Loading...</p>
			</div>)
	}
  }
}

export default ListBooks
