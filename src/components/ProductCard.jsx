import s from './ProductCard.module.css'

const fmt = n => n.toLocaleString('ko-KR') + '원'

export default function ProductCard({ product: p }) {
  const discount = p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0
  const displayPrice = p.salePrice ?? p.price

  return (
    <div className={s.card}>
      <div className={s.imgArea}>
        <span className={s.typeTag}>{p.type === 'DL' ? '폐호흡' : '입호흡'}</span>
        {discount > 0 && <span className={s.discountBadge}>-{discount}%</span>}
        <div className={s.placeholder}>💧</div>
      </div>
      <div className={s.body}>
        <span className={s.brand}>{p.brand}</span>
        <h3 className={s.name}>{p.name}</h3>
        <p className={s.desc}>{p.description}</p>
        <div className={s.meta}>
          <span className={s.metaItem}>{p.flavor}</span>
          <span className={s.metaItem}>{p.nicotine}mg</span>
          <span className={s.metaItem}>{p.volume}ml</span>
        </div>
        <div className={s.priceRow}>
          {p.salePrice ? (
            <>
              <span className={s.originalPrice}>{fmt(p.price)}</span>
              <span className={s.salePrice}>{fmt(p.salePrice)}</span>
            </>
          ) : (
            <span className={s.price}>{fmt(p.price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
