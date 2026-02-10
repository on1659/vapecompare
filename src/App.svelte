<script>
  import { products, brands, flavors, types, getLowestPrice, getSortedSellers } from './data.js';

  let selectedType = $state('');
  let selectedBrands = $state([]);
  let selectedFlavors = $state([]);
  let sortBy = $state('price');
  let showFilters = $state(false);
  let selectedProduct = $state(null);
  let skipPush = false;

  // Parse hash: #/product/ID or empty (main page)
  function parseHash() {
    const hash = window.location.hash;
    const m = hash.match(/^#\/product\/(\d+)/);
    if (m) {
      const p = products.find(x => x.id === +m[1]);
      if (p) { selectedProduct = p; return; }
    }
    selectedProduct = null;
  }

  // Parse query params for filters
  function loadFilters() {
    const params = new URLSearchParams(window.location.search);
    selectedType = params.get('type') || '';
    selectedBrands = params.get('brands') ? params.get('brands').split(',') : [];
    selectedFlavors = params.get('flavors') ? params.get('flavors').split(',') : [];
    sortBy = params.get('sort') || 'price';
  }

  function buildFilterQS() {
    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (selectedBrands.length) params.set('brands', selectedBrands.join(','));
    if (selectedFlavors.length) params.set('flavors', selectedFlavors.join(','));
    if (sortBy !== 'price') params.set('sort', sortBy);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }

  function pushFilterURL() {
    if (skipPush) { skipPush = false; return; }
    const url = window.location.pathname + buildFilterQS();
    window.history.pushState({}, '', url);
  }

  function goToProduct(p) {
    selectedProduct = p;
    window.history.pushState({}, '', window.location.pathname + buildFilterQS() + '#/product/' + p.id);
  }

  function goBack() {
    window.history.back();
  }

  // Init
  loadFilters();
  parseHash();

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      skipPush = true;
      loadFilters();
      parseHash();
    });
  }

  function toggleArray(arr, val) {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  let filtered = $derived.by(() => {
    let list = products.filter(p => {
      if (selectedType && p.type !== selectedType) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedFlavors.length && !selectedFlavors.includes(p.flavor)) return false;
      return true;
    });
    list.sort((a, b) => {
      switch (sortBy) {
        case 'price': return getLowestPrice(a) - getLowestPrice(b);
        case 'sellers': return b.sellers.length - a.sellers.length;
        case 'name': return a.name.localeCompare(b.name, 'ko');
        case 'brand': return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name, 'ko');
        default: return 0;
      }
    });
    return list;
  });

  $effect(() => {
    selectedType; selectedBrands; selectedFlavors; sortBy;
    pushFilterURL();
  });

  function clearAll() { selectedType = ''; selectedBrands = []; selectedFlavors = []; }
  function setType(t) { selectedType = selectedType === t ? '' : t; }
  function toggleBrand(b) { selectedBrands = toggleArray(selectedBrands, b); }
  function toggleFlavor(f) { selectedFlavors = toggleArray(selectedFlavors, f); }
  let hasFilters = $derived(selectedType || selectedBrands.length || selectedFlavors.length);
</script>

<header>
  <div class="header-inner" onclick={() => { selectedProduct = null; window.history.pushState({}, '', window.location.pathname + buildFilterQS()); }} style="cursor:pointer">
    <h1>🌬️ VapeCompare</h1>
    <p>전자담배 액상 최저가 비교</p>
  </div>
</header>

{#if selectedProduct}
  <!-- 상세 페이지 -->
  {@const p = selectedProduct}
  {@const sellers = getSortedSellers(p)}
  {@const lowest = sellers[0].price}
  <main>
    <button class="back-btn" onclick={goBack}>← 목록으로</button>

    <div class="detail">
      <div class="detail-header">
        <div class="detail-badges">
          <span class="type-badge" class:dl={p.type === 'DL'}>{p.type === 'DL' ? '폐호흡(DL)' : '입호흡(MTL)'}</span>
        </div>
        <h2>{p.name}</h2>
        <p class="detail-brand">{p.brand}</p>
        <div class="detail-specs">
          <span>🎨 {p.flavor}</span>
          <span>💨 {p.nic}mg</span>
          <span>🏪 {sellers.length}개 판매처</span>
        </div>
        <div class="detail-lowest">
          최저가 <strong>{lowest.toLocaleString()}원</strong>
        </div>
      </div>

      <div class="sellers-section">
        <h3>판매처 가격 비교</h3>
        <div class="sellers-list">
          {#each sellers as seller, i}
            <div class="seller-row" class:best={i === 0}>
              <div class="seller-rank">{i + 1}</div>
              <div class="seller-info">
                <span class="seller-name">
                  {seller.shop}
                  {#if i === 0}<span class="best-badge">최저가</span>{/if}
                </span>
                <span class="seller-shipping">
                  배송비: {seller.shipping === 0 ? '무료' : seller.shipping.toLocaleString() + '원'}
                </span>
              </div>
              <div class="seller-price">
                <strong>{seller.price.toLocaleString()}원</strong>
                {#if seller.shipping > 0}
                  <span class="total-price">총 {(seller.price + seller.shipping).toLocaleString()}원</span>
                {/if}
              </div>
              <a class="buy-btn" href={seller.url} target="_blank" rel="noopener noreferrer">구매하기</a>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>

{:else}
  <!-- 메인 리스트 -->
  <main>
    <div class="toolbar">
      <button class="filter-toggle" onclick={() => showFilters = !showFilters}>
        {showFilters ? '✕ 닫기' : '☰ 필터'}
        {#if hasFilters}<span class="badge">!</span>{/if}
      </button>
      <div class="sort-group">
        <label>정렬:</label>
        <select bind:value={sortBy}>
          <option value="price">최저가순</option>
          <option value="sellers">판매처 많은순</option>
          <option value="name">이름순</option>
          <option value="brand">브랜드순</option>
        </select>
      </div>
      <span class="count">{filtered.length}개 결과</span>
    </div>

    {#if hasFilters}
      <div class="active-filters">
        {#if selectedType}
          <span class="tag" onclick={() => setType(selectedType)}>
            {selectedType === 'DL' ? '폐호흡' : '입호흡'} ✕
          </span>
        {/if}
        {#each selectedBrands as b}
          <span class="tag" onclick={() => toggleBrand(b)}>{b} ✕</span>
        {/each}
        {#each selectedFlavors as f}
          <span class="tag" onclick={() => toggleFlavor(f)}>{f} ✕</span>
        {/each}
        <button class="tag clear" onclick={clearAll}>전체 초기화</button>
      </div>
    {/if}

    <div class="layout" class:filters-open={showFilters}>
      <aside class="filters" class:open={showFilters}>
        <div class="filter-header">
          <h2>필터</h2>
          <button class="close-btn" onclick={() => showFilters = false}>✕</button>
        </div>
        <div class="filter-section">
          <h3>흡입방식</h3>
          <div class="chips">
            {#each types as t}
              <button class="chip" class:active={selectedType === t} onclick={() => setType(t)}>
                {t === 'DL' ? '🫁 폐호흡(DL)' : '👄 입호흡(MTL)'}
              </button>
            {/each}
          </div>
        </div>
        <div class="filter-section">
          <h3>브랜드</h3>
          <div class="chips">
            {#each brands as b}
              <button class="chip" class:active={selectedBrands.includes(b)} onclick={() => toggleBrand(b)}>{b}</button>
            {/each}
          </div>
        </div>
        <div class="filter-section">
          <h3>맛 카테고리</h3>
          <div class="chips">
            {#each flavors as f}
              <button class="chip" class:active={selectedFlavors.includes(f)} onclick={() => toggleFlavor(f)}>{f}</button>
            {/each}
          </div>
        </div>
        {#if hasFilters}
          <button class="clear-btn" onclick={clearAll}>필터 초기화</button>
        {/if}
        <button class="apply-btn" onclick={() => showFilters = false}>{filtered.length}개 결과 보기</button>
      </aside>

      <div class="grid">
        {#each filtered as p (p.id)}
          {@const low = getLowestPrice(p)}
          <div class="card" onclick={() => goToProduct(p)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && goToProduct(p)}>
            <div class="card-top">
              <span class="type-badge" class:dl={p.type === 'DL'}>{p.type}</span>
              <span class="seller-count">{p.sellers.length}개 판매처</span>
            </div>
            <h2>{p.name}</h2>
            <p class="brand">{p.brand}</p>
            <p class="flavor">{p.flavor} · {p.nic}mg</p>
            <div class="price-row">
              <span class="sale">최저가 {low.toLocaleString()}원</span>
            </div>
            <span class="compare-link">가격비교 →</span>
          </div>
        {:else}
          <div class="empty">조건에 맞는 제품이 없습니다.</div>
        {/each}
      </div>
    </div>
  </main>
{/if}

<style>
  header {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    padding: 2rem 1.5rem;
    text-align: center;
  }
  h1 { font-size: 1.8rem; font-weight: 800; }
  header p { color: rgba(255,255,255,0.8); margin-top: 0.3rem; }

  main { max-width: 1200px; margin: 0 auto; padding: 1rem; }

  /* Back button */
  .back-btn {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); padding: 0.5rem 1rem; border-radius: 8px;
    cursor: pointer; font-size: 0.9rem; margin-bottom: 1rem;
    transition: background 0.15s;
  }
  .back-btn:hover { background: var(--border); }

  /* Detail page */
  .detail { max-width: 800px; margin: 0 auto; }
  .detail-header {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1rem;
  }
  .detail-badges { margin-bottom: 0.75rem; }
  .detail-header h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.3rem; }
  .detail-brand { color: var(--accent2); font-size: 0.95rem; font-weight: 500; margin-bottom: 0.75rem; }
  .detail-specs { display: flex; gap: 1rem; color: var(--text2); font-size: 0.85rem; flex-wrap: wrap; }
  .detail-lowest {
    margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);
    font-size: 1.1rem; color: var(--text2);
  }
  .detail-lowest strong { color: var(--green); font-size: 1.4rem; }

  .sellers-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; }
  .sellers-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .seller-row {
    display: flex; align-items: center; gap: 1rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1rem 1.25rem;
    transition: border-color 0.15s;
  }
  .seller-row.best { border-color: var(--green); background: rgba(0, 206, 158, 0.05); }
  .seller-rank {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--surface2); color: var(--text2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
  }
  .seller-row.best .seller-rank { background: var(--green); color: #fff; }
  .seller-info { flex: 1; min-width: 0; }
  .seller-name { display: block; font-weight: 600; font-size: 0.95rem; }
  .best-badge {
    display: inline-block; background: var(--green); color: #fff;
    font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 4px;
    margin-left: 0.4rem; font-weight: 700; vertical-align: middle;
  }
  .seller-shipping { display: block; color: var(--text2); font-size: 0.8rem; margin-top: 0.15rem; }
  .seller-price { text-align: right; flex-shrink: 0; }
  .seller-price strong { font-size: 1.1rem; color: var(--text); display: block; }
  .total-price { font-size: 0.75rem; color: var(--text2); }
  .buy-btn {
    background: var(--accent); color: #fff; border: none;
    padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;
    font-size: 0.85rem; font-weight: 600; text-decoration: none;
    white-space: nowrap; flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .buy-btn:hover { opacity: 0.85; }

  /* Toolbar */
  .toolbar {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.75rem 0; flex-wrap: wrap;
  }
  .filter-toggle {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); padding: 0.5rem 1rem; border-radius: 8px;
    cursor: pointer; position: relative; font-size: 0.9rem;
  }
  .badge {
    position: absolute; top: -4px; right: -4px;
    background: var(--red); color: #fff; border-radius: 50%;
    width: 16px; height: 16px; font-size: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .sort-group { display: flex; align-items: center; gap: 0.5rem; }
  .sort-group label { color: var(--text2); font-size: 0.85rem; }
  .sort-group select {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border);
    padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.85rem;
  }
  .count { color: var(--text2); font-size: 0.85rem; margin-left: auto; }

  .active-filters { display: flex; flex-wrap: wrap; gap: 0.4rem; padding-bottom: 0.75rem; }
  .tag {
    background: var(--accent); color: #fff;
    padding: 0.25rem 0.6rem; border-radius: 16px;
    font-size: 0.78rem; cursor: pointer; border: none;
    transition: opacity 0.15s;
  }
  .tag:hover { opacity: 0.8; }
  .tag.clear { background: none; border: 1px solid var(--red); color: var(--red); }

  .layout { display: flex; gap: 1.5rem; }
  .filters { width: 260px; flex-shrink: 0; display: none; }
  .filters.open { display: block; }
  .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .filter-header h2 { font-size: 1.1rem; font-weight: 700; }
  .close-btn { background: none; border: none; color: var(--text2); font-size: 1.3rem; cursor: pointer; display: none; }
  .filter-section { margin-bottom: 1.25rem; }
  .filter-section h3 { font-size: 0.8rem; text-transform: uppercase; color: var(--text2); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text2); padding: 0.35rem 0.7rem; border-radius: 20px;
    cursor: pointer; font-size: 0.8rem; transition: all 0.15s;
  }
  .chip:hover { border-color: var(--accent2); color: var(--text); }
  .chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .clear-btn {
    background: none; border: 1px solid var(--red); color: var(--red);
    padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; margin-top: 0.5rem; width: 100%;
  }
  .apply-btn {
    display: none; background: var(--accent); color: #fff; border: none;
    padding: 0.75rem; border-radius: 10px; cursor: pointer;
    font-size: 1rem; font-weight: 600; margin-top: 1rem; width: 100%;
  }

  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem; align-content: start;
  }
  .card {
    display: block; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem;
    transition: transform 0.15s, border-color 0.15s;
    cursor: pointer;
  }
  .card:hover { transform: translateY(-2px); border-color: var(--accent2); }
  .card-top { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
  .type-badge {
    background: var(--surface2); color: var(--text2);
    padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
  }
  .type-badge.dl { background: #2d3436; color: var(--accent2); }
  .seller-count { color: var(--text2); font-size: 0.75rem; }
  .card h2 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem; }
  .brand { color: var(--accent2); font-size: 0.85rem; font-weight: 500; }
  .flavor { color: var(--text2); font-size: 0.8rem; margin: 0.25rem 0 0.75rem; }
  .price-row { display: flex; align-items: baseline; gap: 0.5rem; }
  .sale { color: var(--green); font-size: 1.15rem; font-weight: 700; }
  .compare-link {
    display: inline-block; margin-top: 0.75rem;
    color: var(--accent); font-size: 0.85rem; font-weight: 600;
  }
  .card:hover .compare-link { text-decoration: underline; }
  .empty { grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text2); font-size: 1.1rem; }

  @media (max-width: 768px) {
    .filters {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg); z-index: 100; padding: 1.5rem;
      overflow-y: auto; width: 100%;
    }
    .close-btn { display: block; }
    .apply-btn { display: block; }
    .layout { flex-direction: column; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    .seller-row { flex-wrap: wrap; gap: 0.5rem; }
    .seller-price { text-align: left; }
    .buy-btn { width: 100%; text-align: center; }
  }
</style>
