import s from './FilterSidebar.module.css'

const TYPES = [
  { value: 'DL', label: '폐호흡 (DL)' },
  { value: 'MTL', label: '입호흡 (MTL)' },
]

export default function FilterSidebar({ filters, brands, flavors, onToggle, onClear, onClose }) {
  const Section = ({ title, items, filterKey }) => (
    <div className={s.section}>
      <h3 className={s.sectionTitle}>{title}</h3>
      <div className={s.options}>
        {items.map(item => {
          const val = typeof item === 'string' ? item : item.value
          const label = typeof item === 'string' ? item : item.label
          const active = filters[filterKey].includes(val)
          return (
            <button
              key={val}
              className={`${s.chip} ${active ? s.chipActive : ''}`}
              onClick={() => onToggle(filterKey, val)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )

  const activeCount = filters.types.length + filters.brands.length + filters.flavors.length

  return (
    <div className={s.filter}>
      <div className={s.head}>
        <h2 className={s.title}>필터</h2>
        <div className={s.headActions}>
          {activeCount > 0 && <button className={s.clearBtn} onClick={onClear}>초기화</button>}
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
      </div>
      <Section title="흡입 방식" items={TYPES} filterKey="types" />
      <Section title="브랜드" items={brands} filterKey="brands" />
      <Section title="맛" items={flavors} filterKey="flavors" />
    </div>
  )
}
