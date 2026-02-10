<script>
  let query = $state('전자담배 액상');
  let sortBy = $state('sim');
  let items = $state([]);
  let loading = $state(false);
  let selectedItem = $state(null);
  let searchInput = $state('');

  // 카테고리 퀵 필터
  const quickFilters = [
    { label: '🫁 폐호흡', query: '전자담배 액상 폐호흡' },
    { label: '👄 입호흡', query: '전자담배 액상 입호흡' },
    { label: '🍋 소다맛', query: '전자담배 액상 소다' },
    { label: '🥤 콜라맛', query: '전자담배 액상 콜라' },
    { label: '🍑 과일맛', query: '전자담배 액상 과일' },
    { label: '🧊 멘솔', query: '전자담배 액상 멘솔' },
    { label: '🍰 디저트', query: '전자담배 액상 디저트' },
    { label: '☕ 음료', query: '전자담배 액상 음료' },
    { label: '🚬 담배맛', query: '전자담배 액상 담배맛' },
  ];

  let activeFilter = $state('');

  async function search(q = query) {
    loading = true;
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}&display=40&sort=${sortBy}`);
      const data = await res.json();
      items = data.items || [];
    } catch (e) {
      console.error(e);
      items = [];
    }
    loading = false;
  }

  function handleSearch(e) {
    e.preventDefault();
    query = searchInput || '전자담배 액상';
    activeFilter = '';
    search(query);
    // URL 업데이트
    const params = new URLSearchParams();
    params.set('q', query);
    if (sortBy !== 'sim') params.set('sort', sortBy);
    window.history.pushState({}, '', '?' + params.toString());
  }

  function applyFilter(f) {
    activeFilter = activeFilter === f.query ? '' : f.query;
    const q = activeFilter || '전자담배 액상';
    query = q;
    searchInput = '';
    search(q);
    const params = new URLSearchParams();
    params.set('q', q);
    window.history.pushState({}, '', '?' + params.toString());
  }

  function changeSort(newSort) {
    sortBy = newSort;
    search(query);
  }

  function selectItem(item) {
    selectedItem = item;
    window.history.pushState({ detail: true }, '', '#/detail');
  }

  function goBack() {
    selectedItem = null;
    window.history.back();
  }

  // 초기 로드
  function init() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      query = q;
      searchInput = q === '전자담배 액상' ? '' : q;
    }
    const s = params.get('sort');
    if (s) sortBy = s;

    if (window.location.hash === '#/detail' && !selectedItem) {
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
    search(query);
  }

  init();

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      if (selectedItem && window.location.hash !== '#/detail') {
        selectedItem = null;
      }
    });
  }

  function formatPrice(n) {
    return n ? n.toLocaleString() + '원' : '';
  }
</script>

{#if selectedItem}
  <!-- 상세 페이지 -->
  <header>
    <div class="header-inner detail-header">
      <button class="back-btn" onclick={goBack}>← 뒤로</button>
      <h1>🌬️ VapeCompare</h1>
    </div>
  </header>
  <main class="detail-page">
    <div class="detail-card">
      {#if selectedItem.image}
        <img src={selectedItem.image} alt={selectedItem.title} class="detail-img" />
      {/if}
      <div class="detail-info">
        <h2>{selectedItem.title}</h2>
        {#if selectedItem.brand}
          <p class="detail-brand">{selectedItem.brand}</p>
        {/if}
        <p class="detail-meta">
          {selectedItem.mallName}
          {#if selectedItem.category3} · {selectedItem.category3}{/if}
        </p>
        <div class="detail-price">
          <span class="big-price">{formatPrice(selectedItem.lprice)}</span>
          {#if selectedItem.hprice}
            <span class="high-price">~{formatPrice(selectedItem.hprice)}</span>
          {/if}
        </div>
        <a class="detail-buy-btn" href={selectedItem.link} target="_blank" rel="noopener noreferrer">
          {selectedItem.mallName}에서 구매하기 →
        </a>
      </div>
    </div>

    <!-- 같은 제품 다른 판매처 검색 -->
    <div class="related-section">
      <h3>🔍 다른 판매처에서 비교하기</h3>
      <a class="compare-link" href={`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(selectedItem.title)}&sort=price_asc`} target="_blank" rel="noopener noreferrer">
        네이버 쇼핑에서 최저가 검색 →
      </a>
    </div>
  </main>

{:else}
  <!-- 메인 페이지 -->
  <header>
    <div class="header-inner">
      <h1>🌬️ VapeCompare</h1>
      <p>전자담배 액상 실시간 가격비교</p>
    </div>
  </header>

  <main>
    <form class="search-bar" onsubmit={handleSearch}>
      <input
        type="text"
        bind:value={searchInput}
        placeholder="액상 검색 (브랜드, 맛, 이름...)"
      />
      <button type="submit">🔍</button>
    </form>

    <div class="quick-filters">
      {#each quickFilters as f}
        <button
          class="chip"
          class:active={activeFilter === f.query}
          onclick={() => applyFilter(f)}
        >{f.label}</button>
      {/each}
    </div>

    <div class="toolbar">
      <span class="count">{items.length}개 결과</span>
      <div class="sort-group">
        <label>정렬:</label>
        <select value={sortBy} onchange={(e) => changeSort(e.target.value)}>
          <option value="sim">관련도순</option>
          <option value="asc">가격 낮은순</option>
          <option value="desc">가격 높은순</option>
          <option value="date">최신순</option>
        </select>
      </div>
    </div>

    {#if loading}
      <div class="loading">검색 중...</div>
    {:else}
      <div class="grid">
        {#each items as item (item.productId)}
          <button class="card" onclick={() => selectItem(item)}>
            {#if item.image}
              <img src={item.image} alt={item.title} class="card-img" />
            {/if}
            <div class="card-body">
              <h2>{item.title}</h2>
              <p class="mall">{item.mallName}</p>
              {#if item.brand}
                <p class="brand">{item.brand}</p>
              {/if}
              <div class="price-row">
                <span class="price">{formatPrice(item.lprice)}</span>
                {#if item.hprice}
                  <span class="hprice">~{formatPrice(item.hprice)}</span>
                {/if}
              </div>
            </div>
          </button>
        {:else}
          <div class="empty">검색 결과가 없습니다.</div>
        {/each}
      </div>
    {/if}
  </main>
{/if}

<style>
  header {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    padding: 1.5rem;
    text-align: center;
  }
  h1 { font-size: 1.6rem; font-weight: 800; }
  header p { color: rgba(255,255,255,0.8); margin-top: 0.2rem; font-size: 0.9rem; }

  .detail-header {
    display: flex; align-items: center; gap: 1rem;
    text-align: left;
  }
  .back-btn {
    background: rgba(255,255,255,0.2); border: none; color: #fff;
    padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;
    font-size: 0.9rem; white-space: nowrap;
  }

  main { max-width: 1000px; margin: 0 auto; padding: 1rem; }

  /* 검색바 */
  .search-bar {
    display: flex; gap: 0.5rem; margin-bottom: 1rem;
  }
  .search-bar input {
    flex: 1; padding: 0.75rem 1rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 1rem;
  }
  .search-bar input::placeholder { color: var(--text2); }
  .search-bar button {
    background: var(--accent); border: none; color: #fff;
    padding: 0.75rem 1.2rem; border-radius: 10px; cursor: pointer;
    font-size: 1.1rem;
  }

  /* 퀵 필터 */
  .quick-filters {
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    margin-bottom: 1rem;
  }
  .chip {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text2); padding: 0.4rem 0.8rem; border-radius: 20px;
    cursor: pointer; font-size: 0.82rem; transition: all 0.15s;
  }
  .chip:hover { border-color: var(--accent2); color: var(--text); }
  .chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.5rem 0; margin-bottom: 0.5rem;
  }
  .count { color: var(--text2); font-size: 0.85rem; }
  .sort-group { display: flex; align-items: center; gap: 0.5rem; }
  .sort-group label { color: var(--text2); font-size: 0.85rem; }
  .sort-group select {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border);
    padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.85rem;
  }

  .loading {
    text-align: center; padding: 3rem; color: var(--text2); font-size: 1.1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    cursor: pointer; transition: transform 0.15s, border-color 0.15s;
    text-align: left; width: 100%; padding: 0;
    color: inherit;
  }
  .card:hover { transform: translateY(-2px); border-color: var(--accent2); }

  .card-img {
    width: 100%; aspect-ratio: 1; object-fit: cover;
    background: var(--surface2);
  }
  .card-body { padding: 0.75rem; }
  .card h2 {
    font-size: 0.88rem; font-weight: 600;
    line-height: 1.3; margin-bottom: 0.4rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .mall { color: var(--accent2); font-size: 0.78rem; margin-bottom: 0.15rem; }
  .brand { color: var(--text2); font-size: 0.75rem; margin-bottom: 0.4rem; }
  .price-row { display: flex; align-items: baseline; gap: 0.4rem; }
  .price { color: var(--green); font-size: 1.05rem; font-weight: 700; }
  .hprice { color: var(--text2); font-size: 0.8rem; }

  .empty {
    grid-column: 1 / -1; text-align: center; padding: 3rem;
    color: var(--text2);
  }

  /* 상세 페이지 */
  .detail-page { padding-top: 1.5rem; }
  .detail-card {
    display: flex; gap: 1.5rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem;
  }
  .detail-img {
    width: 200px; height: 200px; object-fit: cover; border-radius: 10px;
    background: var(--surface2); flex-shrink: 0;
  }
  .detail-info { flex: 1; }
  .detail-info h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
  .detail-brand { color: var(--accent2); font-size: 0.9rem; margin-bottom: 0.25rem; }
  .detail-meta { color: var(--text2); font-size: 0.85rem; margin-bottom: 1rem; }
  .detail-price { margin-bottom: 1rem; }
  .big-price { color: var(--green); font-size: 1.5rem; font-weight: 700; }
  .high-price { color: var(--text2); font-size: 0.9rem; margin-left: 0.5rem; }

  .detail-buy-btn {
    display: inline-block;
    background: var(--accent); color: #fff; text-decoration: none;
    padding: 0.75rem 1.5rem; border-radius: 10px;
    font-weight: 600; font-size: 1rem;
    transition: opacity 0.15s;
  }
  .detail-buy-btn:hover { opacity: 0.85; }

  .related-section {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem;
  }
  .related-section h3 { font-size: 1rem; margin-bottom: 0.75rem; }
  .compare-link {
    color: var(--accent); font-weight: 600; text-decoration: none;
    font-size: 0.95rem;
  }
  .compare-link:hover { text-decoration: underline; }

  @media (max-width: 600px) {
    .detail-card { flex-direction: column; }
    .detail-img { width: 100%; height: auto; aspect-ratio: 1; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
    .card-body { padding: 0.5rem; }
    .card h2 { font-size: 0.8rem; }
  }
</style>
