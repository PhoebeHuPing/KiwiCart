import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getComparePrices } from '../apis/products'
import StoreMap from './StoreMap'
import { PriceComparisonData } from '../../models/products'

interface GroupedProduct {
  product_name: string
  image_url: string
  options: PriceComparisonData[]
}

function ProductComparison() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [showDropdown, setShowDropdown] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['compare', debouncedSearchTerm],
    queryFn: () => getComparePrices(debouncedSearchTerm),
    // REMOVED: enabled: debouncedSearchTerm.length > 0,
  })

  // 将平铺的商品数组按名字分组
  const groupedProducts = products?.reduce((acc: GroupedProduct[], current) => {
    const existingProduct = acc.find(
      (p) => p.product_name === current.product_name,
    )

    if (existingProduct) {
      existingProduct.options.push(current)
      existingProduct.options.sort((a, b) => a.price - b.price)
    } else {
      acc.push({
        product_name: current.product_name,
        image_url: current.image_url,
        options: [current],
      })
    }
    return acc
  }, [])

  const trendingCategories = [
    { name: 'Milk', icon: '🥛' },
    { name: 'Bread', icon: '🍞' },
    { name: 'Eggs', icon: '🥚' },
    { name: 'Butter', icon: '🧈' },
    { name: 'Apples', icon: '🍎' },
  ]

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-kiwi/20 transition-all relative">
            <span className="text-2xl ml-2">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg outline-none placeholder:text-gray-400"
              placeholder="Search for a product (e.g. Milk, Bread, Steak)..."
              value={searchTerm}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                ;(setSearchTerm(e.target.value), setShowDropdown(true))
              }}
            />

            {isLoading && (
              <div className="w-6 h-6 border-2 border-kiwi border-t-transparent rounded-full animate-spin"></div>
            )}

            {showDropdown && searchTerm.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-kiwi border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500 font-medium">
                      Comparing prices from supermarkets...
                    </p>
                  </div>
                ) : products?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No products found for {searchTerm}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {products?.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors border-none bg-transparent"
                        onClick={() => {
                          setSearchTerm(item.product_name)
                          setShowDropdown(false)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-kiwi-dark line-clamp-1">
                              {item.product_name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <img
                                src={item.logo_url}
                                alt=""
                                className="w-3 h-3 object-contain"
                              />
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                {item.supermarket_name}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-price text-lg">
                            ${item.price.toFixed(2)}
                          </p>
                          {index === 0 && (
                            <span className="text-[9px] bg-kiwi text-white px-1.5 py-0.5 rounded font-bold uppercase">
                              Cheapest
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    <div className="p-2 bg-gray-50 text-center">
                      <button
                        className="text-[10px] font-black text-kiwi tracking-widest uppercase hover:underline"
                        onClick={() => setShowDropdown(false)}
                      >
                        View All Results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 点击外部关闭下拉框的遮罩 */}
          {showDropdown && (
            <div
              role="button"
              aria-label="Close dropdown"
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setShowDropdown(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' || e.key === 'Enter') {
                  setShowDropdown(false)
                }
              }}
            ></div>
          )}

          {/* 热门分类快捷标签 */}
          <div className="flex flex-wrap gap-2">
            {trendingCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSearchTerm(cat.name)}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 border border-gray-100 hover:border-kiwi hover:text-kiwi transition-all shadow-sm flex items-center gap-2"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 左侧结果列表 */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-kiwi-dark mb-4 flex items-center gap-2">
              {debouncedSearchTerm ? (
                <>
                  <span className="text-xl">🔎</span> Results for &quot;
                  {debouncedSearchTerm}&quot;
                </>
              ) : (
                <>
                  <span className="text-xl">🔥</span> Daily Essentials
                </>
              )}
            </h2>

            {isError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                ⚠️ Error: {error.message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {groupedProducts?.map(
                (group: GroupedProduct, groupIdx: number) => {
                  const isExpanded = expandedIndex === groupIdx
                  const bestOption = group.options[0]

                  return (
                    <div
                      key={groupIdx}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all"
                    >
                      {/* 商品头部（点击触发展开/收起） */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : groupIdx)
                        }
                        className="w-full flex flex-col sm:flex-row items-center gap-8 p-6 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="w-40 h-40 flex-shrink-0 bg-gray-50 rounded-2xl p-4 shadow-inner">
                          <img
                            src={group.image_url}
                            alt=""
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-kiwi-dark">
                            {group.product_name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Available at {group.options.length} supermarkets
                          </p>
                        </div>

                        <div className="flex flex-col items-center sm:items-end gap-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Best Price
                          </span>
                          <span className="text-2xl font-black text-price">
                            ${bestOption.price.toFixed(2)}
                          </span>
                          <div
                            className={`text-kiwi transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          >
                            ▼
                          </div>
                        </div>
                      </button>

                      {/* 下拉展开的价格对比区域 */}
                      {isExpanded && (
                        <div className="bg-gray-50/50 border-t border-gray-100 p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Live Price Comparison
                          </p>

                          {group.options.map(
                            (option: PriceComparisonData, optIdx: number) => (
                              <div
                                key={optIdx}
                                className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-kiwi/30 transition-all"
                              >
                                <div className="flex items-center gap-6">
                                  {/* 进一步放大的 Logo：w-20 (80px) */}
                                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center p-1">
                                    <img
                                      src={option.logo_url}
                                      alt={option.supermarket_name}
                                      className="w-full h-full object-contain filter drop-shadow-sm"
                                    />
                                  </div>

                                  <div>
                                    <p className="font-black text-xl text-kiwi-dark tracking-tight">
                                      {option.supermarket_name}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                      <span className="text-xs">📍</span>{' '}
                                      {option.address}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <span className="text-2xl font-black text-kiwi-dark">
                                      ${option.price.toFixed(2)}
                                    </span>
                                    {optIdx === 0 && (
                                      <p className="text-[9px] text-kiwi font-bold uppercase tracking-tighter">
                                        Best Choice
                                      </p>
                                    )}
                                  </div>

                                  {/* 精致的 SELECT 按钮 */}
                                  <button className="bg-kiwi-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-kiwi hover:scale-105 transition-all shadow-sm">
                                    SELECT
                                  </button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )
                },
              )}

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
                <StoreMap />
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
