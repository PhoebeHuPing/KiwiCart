import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getComparePrices } from '../apis/products'
import { PriceComparisonData } from '../../models/products'

function ProductComparison() {
  const [searchTerm, setSearchTerm] = useState('')
  // Debounce the search term by 500ms
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['compare', debouncedSearchTerm],
    queryFn: () => getComparePrices(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0, // Only search if there is a term
  })

  return (
    <div className="comparison-container">
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a product (e.g. Milk, Bread, Steak)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <div className="spinner-inline"></div>}
      </div>

      <div className="content-layout">
        <div className="product-results">
          {isError && <p className="error-message">Error: {error.message}</p>}

          <div className="product-list">
            {products?.map((item: PriceComparisonData, index: number) => (
              <div
                key={index}
                className={`product-card ${index === 0 ? 'best-deal' : ''}`}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={item.image_url} 
                    alt={item.product_name} 
                    className="product-img"
                    loading="lazy"
                  />
                  <div className="supermarket-badge">
                    <img src={item.logo_url} alt={item.supermarket_name} />
                  </div>
                </div>

                <div className="product-details">
                  <span className="brand-name">{item.supermarket_name}</span>
                  <h3>{item.product_name}</h3>
                  <p className="location">📍 {item.address}</p>
                </div>

                <div className="price-tag">
                  <span className="amount">${item.price.toFixed(2)}</span>
                  {index === 0 && <span className="winner-label">CHEAPEST</span>}
                </div>
              </div>
            ))}
            
            {!isLoading && products?.length === 0 && debouncedSearchTerm && (
              <div className="no-results">
                <p>No products found for "{debouncedSearchTerm}"</p>
                <p>Try searching for something else!</p>
              </div>
            )}
          </div>
        </div>

        <div className="map-sidebar">
          <div className="sticky-map">
            <h3>Nearby Stores</h3>
            <iframe
              title="Auckland Map"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '16px' }}
              src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=supermarkets+in+Auckland`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductComparison
