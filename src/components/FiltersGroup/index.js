import {BsSearch} from 'react-icons/bs'
import './index.css'

const CategoryItem = props => {
  const {eachItemValue, onClickButton, buttonClass} = props
  const {name, categoryId} = eachItemValue

  const onChangeCategory = () => {
    onClickButton(categoryId)
  }

  const activeButton = buttonClass ? 'active-btn' : ''

  return (
    <p
      className={`category-item ${activeButton}`}
      id={categoryId}
      onClick={onChangeCategory}
    >
      {name}
    </p>
  )
}

const RatingItem = props => {
  const {eachRatingValue, onRatingClicked, isRating} = props
  const {ratingId, imageUrl} = eachRatingValue

  const ratingClicked = () => {
    onRatingClicked(ratingId)
  }

  const activeRatingButton = isRating ? 'active-btn' : ''

  return (
    <button type="button" className="rating-button" onClick={ratingClicked}>
      <img src={imageUrl} alt={`rating ${ratingId}`} className="rating-image" />
      <p className={`rating-text ${activeRatingButton}`}>& up</p>
    </button>
  )
}

const FiltersGroup = props => {
  const {
    onChangeSearch,
    categoryOptions,
    changeByCategory,
    categoryIdValue,
    ratingsList,
    onRatingChange,
    ratingIdValue,
    onClearFilters,
    searchInputValue,
  } = props

  const onchangeSearchInput = event => {
    onChangeSearch(event.target.value, event.key)
  }

  const categoryItemClicked = categoryId => {
    changeByCategory(categoryId)
  }

  const onRatingClicked = ratingId => {
    onRatingChange(ratingId)
  }

  const onFilterClicked = () => {
    onClearFilters()
  }

  return (
    <div className="filters-group-container">
      {/* <h1>Filters Group</h1> */}
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={searchInputValue}
          onChange={onchangeSearchInput}
          onKeyDown={onchangeSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
      <div className="category-items-container">
        <h1 className="category-heading">Category</h1>
        {categoryOptions.map(eachItem => (
          <CategoryItem
            key={eachItem.categoryId}
            eachItemValue={eachItem}
            onClickButton={categoryItemClicked}
            buttonClass={categoryIdValue === eachItem.categoryId}
          />
        ))}
      </div>
      <div className="rating-list-container">
        {ratingsList.map(eachItem => (
          <RatingItem
            eachRatingValue={eachItem}
            key={eachItem.ratingId}
            onRatingClicked={onRatingClicked}
            isRating={ratingIdValue === eachItem.ratingId}
          />
        ))}
      </div>
      <div className="filter-button-container">
        <button
          type="button"
          className="filter-button"
          onClick={onFilterClicked}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
