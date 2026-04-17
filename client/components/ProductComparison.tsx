import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getComparePrices } from '../apis/products'
import { PriceComparisonData } from '../../models/products'

function ProductComparison() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['compare', searchTerm],
    queryFn: () => getComparePrices(searchTerm),
  })

  // Helper to get class for logo placeholder based on supermarket name
  const getLogoClass = (name: string) => {
    const n = name.toLowerCase().replace(/[\s']/g, '')
    if (n.includes('woolworths')) return 'logo-woolworths'
    if (n.includes('newworld')) return 'logo-newworld'
    if (n.includes('paknsave')) return 'logo-paknsave'
    return ''
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a product (e.g. Apple, Milk)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content-layout">
        <div className="map-sidebar">
          <div className="map-container">
            <h3>Supermarket Locations</h3>
            <iframe
              title="Auckland Supermarkets Map"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY_PLACEHOLDER&q=supermarkets+in+Auckland&center=-36.8485,174.7633&zoom=10`}
            ></iframe>
            <div className="map-overlay-info">
              <p>📍 Showing stores in Auckland</p>
            </div>
          </div>
        </div>

        <div className="product-results">
          {isLoading && <p>Searching for best prices...</p>}
          {isError && <p>Error: {error.message}</p>}

          <div className="product-list">
            {products?.map((item: PriceComparisonData, index: number) => (
              <div
                key={index}
                className={`product-card ${index === 0 ? 'cheapest' : ''}`}
              >
                <div className="logo-container">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.supermarket_name}
                      className="supermarket-logo"
                      onError={(e) => {
                        // Fallback to text if image fails
                        ;(e.target as any).style.display = 'none'
                        ;(e.target as any).nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <div
                    className={`logo-placeholder ${getLogoClass(
                      item.supermarket_name,
                    )}`}
                    style={{ display: item.logo_url ? 'none' : 'block' }}
                  >
                    {item.supermarket_name}
                  </div>
                </div>

                <div className="product-info">
                  <h3>{item.product_name}</h3>
                  <p>Sold at {item.supermarket_name}</p>
                  {item.address && (
                    <p className="address">
                      <span className="address-icon">📍</span> {item.address}
                    </p>
                  )}
                </div>

                <div className="price-container">
                  <span className="price">${item.price.toFixed(2)}</span>
                  {index === 0 && (
                    <span className="cheapest-badge">Best Price!</span>
                  )}
                </div>
              </div>
            ))}
            {products?.length === 0 && searchTerm && (
              <div className="search-container" style={{ textAlign: 'center' }}>
                <p>No products found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductComparison
