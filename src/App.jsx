import { useState, useMemo } from 'react'
import products from './data/products.json'
import FilterSidebar from './components/FilterSidebar.jsx'
import ProductCard from './components/ProductCard.jsx'
import s from './App.module.css'

const SORT_OPTIONS = [
  { value: 'priceAsc', label: '가격 낮은순' },
  { value: 'priceDesc', label: '가격 높은순' },
  { value: 'discountDesc', label: '할인율 높은순' },
  { value: 'name', label: '이름순' },
  { value: 'brand', label: '브랜드순' },
]

export default function App() {
  const [filters, setFilters] = useState({ types: [], brands: [], flavors: [] })
  const [sort, setSort] = useState('priceAsc')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const brands = [...new Set(products.map(p => p.brand))].sort()
  const flavors = [...new Set(products.map(p => p.flavor))].sort()

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (filters.types.length && !filters.types.includes(p.type)) return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      if (filters.flavors.length && !filters.flavors.includes(p.flavor)) return false
      return true
    })

    const getPrice = p => p.salePrice ?? p.price
    const getDiscount = p => p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0

    list.sort((a, b) => {
      switch (sort) {
        case 'priceAsc': return getPrice(a) - getPrice(b)
        case 'priceDesc': return getPrice(b) - getPrice(a)
        case 'discountDesc': return getDiscount(b) - getDiscount(a)
        case 'name': return a.name.localeCompare(b.name, 'ko')
        case 'brand': return a.brand.localeCompare(b.brand, 'ko') || a.name.localeCompare(b.name, 'ko')
        default: return 0
      }
    })
    return list
  }, [filters, sort])

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const clearFilters = () => setFilters({ types: [], brands: [], flavors: [] })
  const activeCount = filters.types.length + filters.brands.length + filters.flavors.length

  return (
    <div className={s.layout}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <h1 className={s.logo}>💨 VapeCompare</h1>
          <p className={s.tagline}>전자담배 액상 비교</p>
        </div>
      </header>

      <div className={s.content}>
        <button className={s.filterToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
          🔍 필터 {activeCount > 0 && <span className={s.badge}>{activeCount}</span>}
        </button>

        <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
          <FilterSidebar
            filters={filters}
            brands={brands}
            flavors={flavors}
            onToggle={toggleFilter}
            onClear={clearFilters}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        <main className={s.main}>
          <div className={s.toolbar}>
            <span className={s.count}>{filtered.length}개 상품</span>
            <select className={s.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className={s.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && <p className={s.empty}>조건에 맞는 상품이 없습니다.</p>}
        </main>
      </div>

      {sidebarOpen && <div className={s.overlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
