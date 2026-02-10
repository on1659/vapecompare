const shops = {
  jg: { name: '쥬스고릴라', base: 'https://juicegorilla.com/product/' },
  bj: { name: '배달의쥬스', base: 'https://smartstore.naver.com/delivery_juice/' },
  vs: { name: '베이프쏘', base: 'https://vapesso.co.kr/' },
  sm: { name: '스무디액상', base: 'https://smartstore.naver.com/smoothievape/' },
  js: { name: '전담성지', base: 'https://jundamsungji.com/product/' },
};

function s(shopKey, slug, price, shipping = 0) {
  const sh = shops[shopKey];
  return { shop: sh.name, price, shipping, url: sh.base + slug };
}

export const products = [
  { id: 1, name: '체리 콜라 블라스트', brand: 'CloudVape', type: 'DL', flavor: '콜라맛', nic: 3, sellers: [
    s('jg', 'cherry-cola', 14400), s('bj', 'cherry-cola', 14900, 2500), s('vs', 'cherry-cola', 15200, 3000), s('sm', 'cherry-cola', 15500, 2500),
  ]},
  { id: 2, name: '블루베리 아이스', brand: 'VaporKing', type: 'MTL', flavor: '과일맛', nic: 12, sellers: [
    s('bj', 'blueberry-ice', 12000), s('jg', 'blueberry-ice', 12300, 2500), s('js', 'blueberry-ice', 12800, 3000),
  ]},
  { id: 3, name: '망고 패션후르츠', brand: 'CloudVape', type: 'DL', flavor: '과일맛', nic: 3, sellers: [
    s('jg', 'mango-passion', 15000), s('vs', 'mango-passion', 15400, 2500), s('sm', 'mango-passion', 15800, 2500), s('js', 'mango-passion', 16200, 3000), s('bj', 'mango-passion', 16500),
  ]},
  { id: 4, name: '클래식 멘솔', brand: 'FrostLab', type: 'MTL', flavor: '멘솔맛', nic: 12, sellers: [
    s('vs', 'classic-menthol', 12600), s('jg', 'classic-menthol', 12900, 2500), s('bj', 'classic-menthol', 13200), s('sm', 'classic-menthol', 13500, 2500),
  ]},
  { id: 5, name: '바닐라 커스터드', brand: 'SweetCloud', type: 'DL', flavor: '디저트맛', nic: 3, sellers: [
    s('sm', 'vanilla-custard', 17600), s('jg', 'vanilla-custard', 17900, 2500), s('vs', 'vanilla-custard', 18200, 3000), s('bj', 'vanilla-custard', 18500),
  ]},
  { id: 6, name: '레몬 소다', brand: 'FizzVape', type: 'DL', flavor: '소다맛', nic: 6, sellers: [
    s('jg', 'lemon-soda', 11200), s('js', 'lemon-soda', 11500, 2500), s('bj', 'lemon-soda', 11900), s('vs', 'lemon-soda', 12200, 3000), s('sm', 'lemon-soda', 12500, 2500),
  ]},
  { id: 7, name: '피치 아이스티', brand: 'BrewVape', type: 'MTL', flavor: '음료맛', nic: 9, sellers: [
    s('bj', 'peach-icetea', 13600), s('jg', 'peach-icetea', 13900, 2500), s('vs', 'peach-icetea', 14200),
  ]},
  { id: 8, name: '더블 에스프레소', brand: 'BrewVape', type: 'MTL', flavor: '음료맛', nic: 12, sellers: [
    s('jg', 'double-espresso', 15200), s('sm', 'double-espresso', 15500, 2500), s('js', 'double-espresso', 15800, 3000), s('bj', 'double-espresso', 16100),
  ]},
  { id: 9, name: '스트로베리 치즈케이크', brand: 'SweetCloud', type: 'DL', flavor: '디저트맛', nic: 3, sellers: [
    s('vs', 'strawberry-cheesecake', 18400), s('jg', 'strawberry-cheesecake', 18700, 2500), s('bj', 'strawberry-cheesecake', 19000),
  ]},
  { id: 10, name: '프로즌 그레이프', brand: 'FrostLab', type: 'DL', flavor: '과일맛', nic: 3, sellers: [
    s('jg', 'frozen-grape', 14400), s('bj', 'frozen-grape', 14700, 2500), s('sm', 'frozen-grape', 15000, 2500), s('js', 'frozen-grape', 15300, 3000),
  ]},
  { id: 11, name: '코카콜라 바닐라', brand: 'FizzVape', type: 'MTL', flavor: '콜라맛', nic: 9, sellers: [
    s('sm', 'cola-vanilla', 12800), s('jg', 'cola-vanilla', 13100, 2500), s('vs', 'cola-vanilla', 13400, 3000), s('bj', 'cola-vanilla', 13700),
  ]},
  { id: 12, name: '버지니아 골드', brand: 'LeafTone', type: 'MTL', flavor: '담배맛', nic: 18, sellers: [
    s('js', 'virginia-gold', 18900), s('jg', 'virginia-gold', 19200, 2500), s('bj', 'virginia-gold', 19500),
  ]},
  { id: 13, name: '아이스 멘솔 블라스트', brand: 'FrostLab', type: 'DL', flavor: '멘솔맛', nic: 3, sellers: [
    s('jg', 'ice-menthol-blast', 10500), s('bj', 'ice-menthol-blast', 10800, 2500), s('vs', 'ice-menthol-blast', 11100, 3000), s('sm', 'ice-menthol-blast', 11400, 2500), s('js', 'ice-menthol-blast', 11700),
  ]},
  { id: 14, name: '크림 브륄레', brand: 'SweetCloud', type: 'MTL', flavor: '디저트맛', nic: 12, sellers: [
    s('vs', 'creme-brulee', 19200), s('sm', 'creme-brulee', 19500, 2500), s('jg', 'creme-brulee', 19800, 2500),
  ]},
  { id: 15, name: '그린애플 소다', brand: 'FizzVape', type: 'DL', flavor: '소다맛', nic: 6, sellers: [
    s('jg', 'greenapple-soda', 13600), s('bj', 'greenapple-soda', 13900, 2500), s('js', 'greenapple-soda', 14200, 3000), s('vs', 'greenapple-soda', 14500),
  ]},
  { id: 16, name: '워터멜론 캔디', brand: 'CloudVape', type: 'DL', flavor: '과일맛', nic: 3, sellers: [
    s('bj', 'watermelon-candy', 13600), s('jg', 'watermelon-candy', 13900, 2500), s('sm', 'watermelon-candy', 14200, 2500),
  ]},
  { id: 17, name: '캐러멜 마키아토', brand: 'BrewVape', type: 'MTL', flavor: '음료맛', nic: 9, sellers: [
    s('jg', 'caramel-macchiato', 16000), s('vs', 'caramel-macchiato', 16300, 3000), s('bj', 'caramel-macchiato', 16600), s('sm', 'caramel-macchiato', 16900, 2500),
  ]},
  { id: 18, name: '터키쉬 블렌드', brand: 'LeafTone', type: 'MTL', flavor: '담배맛', nic: 18, sellers: [
    s('js', 'turkish-blend', 17600), s('jg', 'turkish-blend', 17900, 2500), s('bj', 'turkish-blend', 18200), s('vs', 'turkish-blend', 18500, 3000),
  ]},
  { id: 19, name: '라즈베리 레모네이드', brand: 'FizzVape', type: 'DL', flavor: '소다맛', nic: 3, sellers: [
    s('jg', 'raspberry-lemonade', 11900), s('sm', 'raspberry-lemonade', 12200, 2500), s('bj', 'raspberry-lemonade', 12500), s('js', 'raspberry-lemonade', 12800, 3000), s('vs', 'raspberry-lemonade', 13100),
  ]},
  { id: 20, name: '패션후르츠 아이스', brand: 'FrostLab', type: 'MTL', flavor: '과일맛', nic: 12, sellers: [
    s('vs', 'passionfruit-ice', 14400), s('jg', 'passionfruit-ice', 14700, 2500), s('bj', 'passionfruit-ice', 15000),
  ]},
  { id: 21, name: '초콜릿 하젤넛', brand: 'SweetCloud', type: 'DL', flavor: '디저트맛', nic: 3, sellers: [
    s('sm', 'choco-hazelnut', 20000), s('jg', 'choco-hazelnut', 20300, 2500), s('vs', 'choco-hazelnut', 20600, 3000), s('bj', 'choco-hazelnut', 20900),
  ]},
  { id: 22, name: '콜라 아이스', brand: 'FizzVape', type: 'DL', flavor: '콜라맛', nic: 6, sellers: [
    s('jg', 'cola-ice', 12000), s('bj', 'cola-ice', 12300, 2500), s('js', 'cola-ice', 12600, 3000),
  ]},
  { id: 23, name: '유칼립투스 민트', brand: 'FrostLab', type: 'MTL', flavor: '멘솔맛', nic: 12, sellers: [
    s('bj', 'eucalyptus-mint', 11200), s('jg', 'eucalyptus-mint', 11500, 2500), s('vs', 'eucalyptus-mint', 11800, 3000), s('sm', 'eucalyptus-mint', 12100, 2500),
  ]},
  { id: 24, name: '라떼 바닐라', brand: 'BrewVape', type: 'MTL', flavor: '음료맛', nic: 9, sellers: [
    s('jg', 'latte-vanilla', 14400), s('sm', 'latte-vanilla', 14700, 2500), s('bj', 'latte-vanilla', 15000), s('vs', 'latte-vanilla', 15300, 3000),
  ]},
  { id: 25, name: '시가렛 RY4', brand: 'LeafTone', type: 'MTL', flavor: '담배맛', nic: 18, sellers: [
    s('js', 'cigarette-ry4', 16000), s('jg', 'cigarette-ry4', 16300, 2500), s('bj', 'cigarette-ry4', 16600),
  ]},
  { id: 26, name: '트로피칼 믹스', brand: 'CloudVape', type: 'DL', flavor: '과일맛', nic: 3, sellers: [
    s('jg', 'tropical-mix', 13300), s('bj', 'tropical-mix', 13600, 2500), s('vs', 'tropical-mix', 13900, 3000), s('sm', 'tropical-mix', 14200, 2500), s('js', 'tropical-mix', 14500),
  ]},
  { id: 27, name: '민트 초코', brand: 'SweetCloud', type: 'MTL', flavor: '디저트맛', nic: 9, sellers: [
    s('sm', 'mint-choco', 16800), s('jg', 'mint-choco', 17100, 2500), s('bj', 'mint-choco', 17400),
  ]},
  { id: 28, name: '진저에일 라임', brand: 'FizzVape', type: 'DL', flavor: '소다맛', nic: 6, sellers: [
    s('jg', 'ginger-lime', 12800), s('vs', 'ginger-lime', 13100, 3000), s('bj', 'ginger-lime', 13400), s('js', 'ginger-lime', 13700, 2500),
  ]},
  { id: 29, name: '파이프 토바코', brand: 'LeafTone', type: 'MTL', flavor: '담배맛', nic: 18, sellers: [
    s('js', 'pipe-tobacco', 18400), s('jg', 'pipe-tobacco', 18700, 2500), s('vs', 'pipe-tobacco', 19000, 3000), s('bj', 'pipe-tobacco', 19300),
  ]},
  { id: 30, name: '키위 스트로베리', brand: 'VaporKing', type: 'DL', flavor: '과일맛', nic: 3, sellers: [
    s('jg', 'kiwi-strawberry', 11900), s('bj', 'kiwi-strawberry', 12200, 2500), s('sm', 'kiwi-strawberry', 12500, 2500), s('vs', 'kiwi-strawberry', 12800, 3000), s('js', 'kiwi-strawberry', 13100),
  ]},
];

export function getLowestPrice(product) {
  return Math.min(...product.sellers.map(s => s.price));
}

export function getSortedSellers(product) {
  return [...product.sellers].sort((a, b) => a.price - b.price);
}

export const brands = [...new Set(products.map(p => p.brand))].sort();
export const flavors = [...new Set(products.map(p => p.flavor))].sort();
export const types = ['DL', 'MTL'];
