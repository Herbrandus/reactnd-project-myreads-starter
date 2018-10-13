# BestReads Project

## Table of Contents

* [Instructions](#instructions)
* [How the app works](#how-the-app-works)
* [Search](#search)
* [Create React App](#create-react-app)
* [Contributing](#contributing)

This is a small app to keep track of what books to read, what books you are currently reading and what books you have already read. You can search for new books and add them to your list.

## Instructions

To install this app first run `npm install` to install all dependencies.
The additional React libraries used for this app are `react-router-dom`, `prop-types` and `sort-by`.
This app uses `BooksAPI.js` to get the books you're looking for.

## How the app works

The app works with three lists and a search function. It shows the lists by default; one for books you are currently reading, one list for the books you want to read and one for books you have already read. You can click each book for more information. Each book has an option to change the book's shelf or to remove it from all shelves. When searching for other books, you can add the found books to a shelf of your choice in the same way.

## Seach

`BooksAPI.js` uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contributing

This is a finished project for a Udacity Front End Web Development assignment. Contributions are not necessary, but if you see possible improvements, just send me a message!