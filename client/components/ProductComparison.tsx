import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getComparePrices } from '../apis/products'
import { PriceComparisonData } from '../../models/products'

function ProductComparison() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['compare', debouncedSearchTerm],
    queryFn: () => getComparePrices(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
  })

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-kiwi/20 transition-all mb-8">
          <span className="text-2xl ml-2">🔍</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg outline-none placeholder:text-gray-400"
            placeholder="Search for a product (e.g. Milk, Bread, Steak)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && (
            <div className="w-6 h-6 border-2 border-kiwi border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 左侧结果列表 */}
          <div className="lg:col-span-2 space-y-4">
            {isError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                ⚠️ Error: {error.message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {products?.map((item: PriceComparisonData, index: number) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm border-l-4 transition-all hover:shadow-md ${
                    index === 0
                      ? 'border-kiwi bg-kiwi-light/20'
                      : 'border-transparent hover:border-kiwi/30'
                  }`}
                >
                  {/* 商品图片容器 */}
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
                      <img
                        src={item.logo_url}
                        alt={item.supermarket_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* 商品详情 */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {item.supermarket_name}
                    </span>
                    <h3 className="text-xl font-bold text-kiwi-dark leading-tight mt-1">
                      {item.product_name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1">
                      <span className="text-xs">📍</span> {item.address}
                    </p>
                  </div>

                  {/* 价格与标签 */}
                  <div className="flex flex-col items-center sm:items-end min-w-[120px]">
                    <span className="text-3xl font-black text-price">
                      ${item.price.toFixed(2)}
                    </span>
                    {index === 0 && (
                      <span className="mt-2 bg-kiwi text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Cheapest
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* 空结果提示 */}
              {!isLoading && products?.length === 0 && debouncedSearchTerm && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="text-5xl mb-4 text-center">🥝</div>
                  <h3 className="text-xl font-bold text-kiwi-dark">
                    No products found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    We couldn&apos;t find {debouncedSearchTerm}. <br />
                    Try searching for something else!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 右侧地图侧边栏 */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-kiwi-dark mb-4 flex items-center gap-2">
                <span className="text-xl">🗺️</span> Nearby Stores
              </h3>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
                {/* 暂时占位的地图提示 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Interactive Map Coming Soon!
                  </p>
                  <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest">
                    Auckland Area
                  </p>
                </div>
              </div>
            </div>

            {/* AI 购物建议小挂件（预留位） */}
            <div className="bg-kiwi/5 rounded-2xl p-6 border border-kiwi/10">
              <h4 className="text-kiwi font-bold text-sm uppercase tracking-wider mb-2">
                Kiwi Insight
              </h4>
              <p className="text-sm text-kiwi-dark/70 italic">
                Milk prices in Auckland CBD have dropped by 5% this week. Keep
                an eye on New World specials!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductComparison
