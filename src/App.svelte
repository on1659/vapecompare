<script>
  import { products, brands, flavors, types } from './data.js';

  let selectedType = $state('');
  let selectedBrands = $state([]);
  let selectedFlavors = $state([]);
  let sortBy = $state('price');
  let showFilters = $state(false);

  function toggleArray(arr, val) {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  function discountRate(p) {
    return Math.round((1 - p.discountPrice / p.price) * 100);
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
        case 'price': return a.discountPrice - b.discountPrice;
        case 'discount': return discountRate(b) - discountRate(a);
        case 'name': return a.name.localeCompare(b.name, 'ko');
        case 'brand': return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name, 'ko');
        default: return 0;
      }
    });

    return list;
  });

  function clearAll() {
    selectedType = '';
    selectedBrands = [];
    selectedFlavors = [];
  }

  let hasFilters = $derived(selectedType || selectedBrands.length || selectedFlavors.length);
</script>

<header>
  <div class="header-inner">
    <h1>🌬️ VapeCompare</h1>
    <p>전자담배 액상 비교</p>
  </div>
</header>

<main>
  <div class="toolbar">
    <button class="filter-toggle" onclick={() => showFilters = !showFilters}>
      {showFilters ? '✕ 필터 닫기' : '☰ 필터'}
      {#if hasFilters}<span class="badge">!</span>{/if}
    </button>
    <div class="sort-group">
      <label>정렬:</label>
      <select bind:value={sortBy}>
        <option value="price">가격순</option>
        <option value="discount">할인율순</option>
        <option value="name">이름순</option>
        <option value="brand">브랜드순</option>
      </select>
    </div>
    <span class="count">{filtered.length}개 결과</span>
  </div>

  <div class="layout" class:filters-open={showFilters}>
    <aside class="filters" class:open={showFilters}>
      <div class="filter-section">
        <h3>흡입방식</h3>
        <div class="chips">
          {#each types as t}
            <button
              class="chip"
              class:active={selectedType === t}
              onclick={() => selectedType = selectedType === t ? '' : t}
            >
              {t === 'DL' ? '🫁 폐호흡(DL)' : '👄 입호흡(MTL)'}
            </button>
          {/each}
        </div>
      </div>

      <div class="filter-section">
        <h3>브랜드</h3>
        <div class="chips">
          {#each brands as b}
            <button
              class="chip"
              class:active={selectedBrands.includes(b)}
              onclick={() => selectedBrands = toggleArray(selectedBrands, b)}
            >{b}</button>
          {/each}
        </div>
      </div>

      <div class="filter-section">
        <h3>맛 카테고리</h3>
        <div class="chips">
          {#each flavors as f}
            <button
              class="chip"
              class:active={selectedFlavors.includes(f)}
              onclick={() => selectedFlavors = toggleArray(selectedFlavors, f)}
            >{f}</button>
          {/each}
        </div>
      </div>

      {#if hasFilters}
        <button class="clear-btn" onclick={clearAll}>필터 초기화</button>
      {/if}
    </aside>

    <div class="grid">
      {#each filtered as p (p.id)}
        <div class="card">
          <div class="card-top">
            <span class="type-badge" class:dl={p.type === 'DL'}>{p.type}</span>
            <span class="discount-badge">-{discountRate(p)}%</span>
          </div>
          <h2>{p.name}</h2>
          <p class="brand">{p.brand}</p>
          <p class="flavor">{p.flavor} · {p.nic}mg</p>
          <div class="price-row">
            <span class="original">{p.price.toLocaleString()}원</span>
            <span class="sale">{p.discountPrice.toLocaleString()}원</span>
          </div>
        </div>
      {:else}
        <div class="empty">조건에 맞는 제품이 없습니다.</div>
      {/each}
    </div>
  </div>
</main>

<style>
  header {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    padding: 2rem 1.5rem;
    text-align: center;
  }
  h1 { font-size: 1.8rem; font-weight: 800; }
  header p { color: rgba(255,255,255,0.8); margin-top: 0.3rem; }

  main { max-width: 1200px; margin: 0 auto; padding: 1rem; }

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

  .layout { display: flex; gap: 1.5rem; }

  .filters {
    width: 240px; flex-shrink: 0;
    display: none;
  }
  .filters.open { display: block; }

  .filter-section { margin-bottom: 1.25rem; }
  .filter-section h3 {
    font-size: 0.8rem; text-transform: uppercase; color: var(--text2);
    margin-bottom: 0.5rem; letter-spacing: 0.05em;
  }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text2); padding: 0.35rem 0.7rem; border-radius: 20px;
    cursor: pointer; font-size: 0.8rem; transition: all 0.15s;
  }
  .chip:hover { border-color: var(--accent2); color: var(--text); }
  .chip.active {
    background: var(--accent); border-color: var(--accent);
    color: #fff;
  }
  .clear-btn {
    background: none; border: 1px solid var(--red); color: var(--red);
    padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer;
    font-size: 0.8rem; margin-top: 0.5rem;
  }

  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    align-content: start;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem;
    transition: transform 0.15s, border-color 0.15s;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: var(--accent2);
  }
  .card-top {
    display: flex; justify-content: space-between; margin-bottom: 0.75rem;
  }
  .type-badge {
    background: var(--surface2); color: var(--text2);
    padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
  }
  .type-badge.dl { background: #2d3436; color: var(--accent2); }
  .discount-badge {
    background: rgba(225, 112, 85, 0.15); color: var(--red);
    padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
  }
  .card h2 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem; }
  .brand { color: var(--accent2); font-size: 0.85rem; font-weight: 500; }
  .flavor { color: var(--text2); font-size: 0.8rem; margin: 0.25rem 0 0.75rem; }
  .price-row { display: flex; align-items: baseline; gap: 0.5rem; }
  .original {
    color: var(--text2); text-decoration: line-through; font-size: 0.85rem;
  }
  .sale {
    color: var(--green); font-size: 1.15rem; font-weight: 700;
  }

  .empty {
    grid-column: 1 / -1; text-align: center; padding: 3rem;
    color: var(--text2); font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .filters {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg); z-index: 100; padding: 1.5rem;
      overflow-y: auto; width: 100%;
    }
    .layout { flex-direction: column; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  }
</style>
