import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'

class SearchBooks extends Component {

	static propTypes = {
	    addedBooks: PropTypes.array.isRequired
	 }

	state = {
		query: '',
		didUpdate: false,
		results: []
	}

	updateQuery = (query) => {
		this.setState({ query: query.trim() })
		if (query !== '') {
	  		BooksAPI.search(query).then((foundBooks) => {
	  			if (foundBooks.length) {
	  				this.setState({ results: foundBooks })
	  			}
	  		}).catch((error) => {
	  			console.log(error)
	  		})
	  	} else {
	  		this.clearQuery()
	  	}
	}

	clearQuery = () => {
		this.setState({ query: '' })
		this.setState({ results: [] })
	}

	/*
	if (this.props.onChangeShelf) {
		this.props.onChangeShelf(targetBook, newShelf)
	}
	*/

	componentDidMount() {
		// instant focus on search input field after component has loaded
		this.searchInput.focus()
	}


	componentDidUpdate() {
		this.state.didUpdate = true
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
		let books = this.state.results

		// get the book that should have its shelf changed
		let targetBook = books.find(e => e.id === bookId)

		// Before we change, check if the selected shelf isn't the current one
		if (targetBook.shelf !== newShelf) {

			// if the book is not on a shelf, or has 'shelf' undefined, set it to its new shelf
			if (targetBook.shelf === undefined || targetBook.shelf === 'none') {
				targetBook.shelf = newShelf
			}

			// call onChangeShelf function in App.js
		  	if (this.props.onAddBook) {
				this.props.onAddBook(targetBook, newShelf)
			}
		}

	}


  	render() {

  		// set title
	  	document.title = 'Search books | BestReads'	  	

	  	let { addedBooks } = this.props
	  	const { query, results } = this.state

	  	/*
			NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
	  	*/

	  	if (this.state.didUpdate) {

	  		this.state.didUpdate = false

	  		results.map(book => {
	  			
	  			let match = addedBooks.find(addedBook => addedBook.id === book.id)

	  			if (match) {
	  				book.shelf = match.shelf
	  			}

	  			if (book.shelf === undefined) {
	  				book.shelf = 'none'
	  			}
	  		})

	  		console.log(results)

		    return (
		    	<div className="search-books">
			        <div className="search-books-bar">
			          <Link className="close-search" to="/">Close</Link>
			          <div className="search-books-input-wrapper">               
			            <input
			              className='search-books-input'
			              ref={(input) => { this.searchInput = input }}
			              type='text'
			              placeholder='Search by title or author'
			              value={query}
			              onChange={(event) => this.updateQuery(event.target.value)}
			            />
			          </div>
			        </div>
			        <div className="search-books-results">
			          <ol className="books-grid">
			          {results.map((book) => (
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
									{ book.authors && book.authors.join(', ') }
								</div>
							</div>
						</li>
			          ))}
			          </ol>
			        </div>
			    </div>
		    )
		} else {

			return (
				<div className="search-books">
			        <div className="search-books-bar">
			          <Link className="close-search" to="/">Close</Link>
			          <div className="search-books-input-wrapper">               
			            <input
			              className='search-books-input'
			              ref={(input) => { this.searchInput = input }}
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
			)
		} 
  	}

}

export default SearchBooks