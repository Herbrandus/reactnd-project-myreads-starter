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

  	console.log('book id: ', bookId)

  	console.log('new shelf:', newShelf)

  	// Copy the books array for manipulation before updating
  	let booksCopy = this.props.books

  	let targetBook = booksCopy.find(e => e.id == bookId)


  	console.log('current shelf: ', targetBook)

  	// Before we change, check if the selected shelf isn't the current one
  	if (targetBook.shelf != newShelf) {

	  	if (this.props.onChangeShelf) {
			this.props.onChangeShelf(targetBook, newShelf)
		}
  	}

  }

  render() {
    const { books } = this.props
    const { query } = this.state

    if (books.length) {

    	console.log(books)

    	let showBooks
	    if (query) {
	      const match = new RegExp(escapeRegExp(query), 'i')
	      showBooks = books.filter((book) => match.test(book.name))
	    } else {
	      showBooks = books
	    }

	    showBooks.sort(sortBy('name'))	    

	    // filter for each shelf
	    const currReading = books.filter((book) => book.shelf === 'currentlyReading')
	    const wantToRead = books.filter((book) => book.shelf === 'wantToRead')
	    const haveRead = books.filter((book) => book.shelf === 'read')

	    // put shelves in array with title for easy mapping during render
	    const shelves = [
	    	{ 	id: 'shelf1',
	    		value: 'currentlyReading',
	    		title: 'Currently Reading',
	    		books: currReading
	    	},
	    	{ 	id: 'shelf2',
	    		value: 'wantToRead',
	    		title: 'Want to Read',
	    		books: wantToRead
	    	},
	    	{ 	id: 'shelf3',
	    		value: 'read',
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
											<select 
												id={book.id} 
												onChange={(value) => this.changeShelf(book.id) }
												defaultValue={book.shelf}
											>
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
