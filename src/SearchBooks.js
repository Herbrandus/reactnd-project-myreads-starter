import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'

class SearchBooks extends Component {

	state = {
		query: '',
		didUpdate: false,
		results: []
	}

	updateQuery = (query) => {
		this.setState({ query: query.trim() })
		if (query !== '') {
	  		BooksAPI.search(query).then((books) => {
	  			if (books.length) {
	  				this.setState({ results: books })
	  			}
	  		}).catch((error) => {
	  			console.log(error)
	  		})
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
		if (this.state.results.length > 0) 
			this.state.didUpdate = true
	}

  	render() {

  		// set title
	  	document.title = 'Search books | BestReads'	  	

	  	const { query, results } = this.state

	  	/*
			NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
	  	*/

	  	if (this.state.didUpdate) {

	  		console.log(results[0].authors)
	  		this.state.didUpdate = false

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
									{ book.authors.join(', ') }
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