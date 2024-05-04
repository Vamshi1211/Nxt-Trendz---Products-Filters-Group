import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const viewsConstants = {
  initial: 'initial',
  inProgress: 'IN_PROGRESS',
  noProducts: 'NO_PRODUCTS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryId: '',
    ratingId: '',
    views: viewsConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchInput, categoryId, ratingId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&&category=${categoryId}&&title_search=${searchInput}&&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({views: viewsConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeSearch = (searchInput, eventKeyValue) => {
    this.setState({searchInput})
    if (eventKeyValue === 'Enter') {
      this.setState({searchInput}, this.getProducts)
    }
  }

  changeByCategory = categoryId => {
    this.setState({categoryId}, this.getProducts)
  }

  onRatingChange = ratingId => {
    this.setState({ratingId}, this.getProducts)
  }

  onClearFilters = () => {
    this.setState(
      {searchInput: '', categoryId: '', ratingId: ''},
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View

    return (
      <>
        {productsList.length === 0 ? (
          <div className="no-products-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="products failure"
              className="no-products-image"
            />
            <h1 className="no-products-heading">No Products Found</h1>
            <p className="no-found-des">
              We could not find any products, Try other filters
            </p>
          </div>
        ) : (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getViews = () => {
    const {views} = this.state

    switch (views) {
      case viewsConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderProductsList()
    }
  }

  // TODO: Add failure view
  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="failure-heading">OOPs! Something Went Wrong</h1>
      <p className="failure-des">
        We are having some trouble for processing tour request.Please try
        again..
      </p>
    </div>
  )

  render() {
    const {isLoading, categoryId, ratingId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          onChangeSearch={this.onChangeSearch}
          categoryOptions={categoryOptions}
          changeByCategory={this.changeByCategory}
          categoryIdValue={categoryId}
          ratingsList={ratingsList}
          onRatingChange={this.onRatingChange}
          ratingIdValue={ratingId}
          onClearFilters={this.onClearFilters}
          searchInputValue={searchInput}
        />

        {isLoading ? this.renderLoader() : this.getViews()}
      </div>
    )
  }
}

export default AllProductsSection
