// Banco de Dados de Produtos
const shopDB = [
    { id: 1, name: "Pistache Emerald", price: 245.0, cat: "Elite", img: "img/pistache.webp" },
    { id: 2, name: "Salted Caramel Noir", price: 189.0, cat: "Classic", img: "img/salted.jpg" },
    { id: 3, name: "Ruby Blossom", price: 210.0, cat: "Elite", img: "img/ruby.webp" },
    { id: 4, name: "Dark Truffle Gold", price: 320.0, cat: "Elite", img: "img/dark_truffle.webp" },
    { id: 5, name: "Hazelnut Gianduja", price: 155.0, cat: "Classic", img: "img/hazelnut.webp" },
    { id: 6, name: "White Velvet", price: 175.0, cat: "Classic", img: "img/white_velvet.webp" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];


const router = {
    home: () => `
        <header class="hero-editorial">
            <div class="hero-info">
                <div class="badge" style="color: var(--gold); font-weight: 800; letter-spacing: 2px; margin-bottom: 10px;">COLLECTION 2026</div>
                <h1>The Art of <span>Easter</span>.</h1>
                <p>Experience the finest cacao selection curated by master chocolatiers for a sophisticated palate.</p>
                <button class="btn-main-dark" onclick="navigateTo('shop')">Explore Shop <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="hero-img-frame">
                <img src="img/marca.jpg" alt="Hero">
            </div>
            <audio autoplay loop controls>
  <source src="audio/Elegant Jazz - Good morning mood with Jazz Cafe - Cheerful Jazz &  Bossa Nova for the best mood - The Best Relaxing Jazz Music (youtube).mp3" type="audio/mp3">
  Seu navegador não suporta a reprodução de áudio.
    </audio>
        </header>
        <section style="padding: 100px 8%;">
            <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 40px;">Featured Masterpieces</h2>
            <div class="product-grid" id="home-grid"></div>
        </section>
    `,
    shop: () => `
        <div class="shop-container">
            <h1 style="font-family: var(--font-serif); font-size: 3rem;">The Boutique</h1>
            <div class="tag-list">
                <button onclick="filterShop('all')" class="tag active">All Flavors</button>
                <button onclick="filterShop('Elite')" class="tag">Elite Series</button>
                <button onclick="filterShop('Classic')" class="tag">Classic Selection</button>
            </div>
            <div class="product-grid" id="main-grid"></div>
        </div>
                    <audio autoplay loop controls>
  <source src="audio/Elegant Jazz - Good morning mood with Jazz Cafe - Cheerful Jazz &  Bossa Nova for the best mood - The Best Relaxing Jazz Music (youtube).mp3" type="audio/mp3">
  Seu navegador não suporta a reprodução de áudio.
    </audio>
    `,
    about: () => `
        <section style="padding: 150px 8%; text-align: center;">
            <h1 style="font-family: var(--font-serif); font-size: 4rem; margin-bottom: 20px;">Our Heritage</h1>
            <p style="max-width: 700px; margin: 0 auto; line-height: 1.8; color: var(--text-muted);">
                Since 1924, Golden Easter has defined the standards of haute chocolaterie. 
                Using only the rarest Criollo beans and traditional stone-grinding methods, 
                we create an experience that transcends taste.
            </p>
                <video controls width="250">
  <source src="img/anuncio.mp4" type="video/mp4" />


                 style="width: 100%; height: 500px; object-fit: cover; border-radius: 30px; margin-top: 60px;">
        </video>
                 </section>
    `
};

function navigateTo(page) {
    const main = document.getElementById('app-content');
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    main.style.opacity = '0';
    setTimeout(() => {
        main.innerHTML = router[page] ? router[page]() : router['home']();
        if(page === 'home' || !page) renderProducts('home-grid', 3);
        if(page === 'shop') renderProducts('main-grid');
        main.style.opacity = '1';
    }, 400);
}


function renderProducts(target, limit = null, list = shopDB) {
    const grid = document.getElementById(target);
    if(!grid) return;
    
    const items = limit ? list.slice(0, limit) : list;
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="img-box">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="card-info">
                <small style="color: var(--gold); font-weight: 700;">${p.cat}</small>
                <h3 style="margin: 5px 0;">${p.name}</h3>
                <div class="price-tag">R$ ${p.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${p.id})">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `).join('');
}

function filterShop(category) {
    const buttons = document.querySelectorAll('.tag');
    buttons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    const filtered = category === 'all' ? shopDB : shopDB.filter(p => p.cat === category);
    renderProducts('main-grid', null, filtered);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filtered = shopDB.filter(p => p.name.toLowerCase().includes(query));
    if(document.getElementById('main-grid')) {
        renderProducts('main-grid', null, filtered);
    } else {
        navigateTo('shop');
        setTimeout(() => renderProducts('main-grid', null, filtered), 500);
    }
}


function addToCart(id) {
    const product = shopDB.find(p => p.id === id);
    cart.push(product);
    updateCart();
    showToast(`${product.name} added to bag`);
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('items-qty').innerText = `(${cart.length})`;
    
    const list = document.getElementById('cart-items-list');
    let total = 0;
    
    if(cart.length === 0) {
        list.innerHTML = `<p style="text-align:center; margin-top:50px; color:var(--text-muted);">Your bag is empty</p>`;
    } else {
        list.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item">
                    <img src="${item.img}">
                    <div style="flex:1">
                        <h4 style="font-size:0.9rem">${item.name}</h4>
                        <p style="color:var(--gold); font-weight:700">R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
    document.getElementById('cart-total').innerText = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
}


function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${msg}`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


document.getElementById('theme-toggle').onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};


window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const bar = document.querySelector('.loader-bar');
    bar.style.width = '100%';
    
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            navigateTo('home');
            updateCart();
        }, 800);
    }, 1500);
};

function getPascoaGoldAd() {
    const ads = [
        { t: "Oferta Imperial", d: "Use o cupom GOLD20 para 20% de desconto em toda linha Elite.", b: "Comprar Agora" },
        { t: "Frete Premium", d: "Entrega refrigerada grátis para pedidos acima de R$ 500.", b: "Ver Detalhes" },
        { t: "Edição Limitada", d: "Conheça o novo Dark Truffle Gold com flocos de ouro 24k.", b: "Descobrir" }
    ];
    const ad = ads[Math.floor(Math.random() * ads.length)];
    return `
        <div class="pascoa-ad-banner">
            <div class="ad-content">
                <small>ANÚNCIO PÁSCOA GOLD</small>
                <h4>${ad.t}</h4>
                <p>${ad.d}</p>
            </div>
            <button class="btn-ad" onclick="navigateTo('shop')">${ad.b}</button>
        </div>
    `;
}

router.recipes = () => `
    <header class="recipe-hero">
        <h1 style="font-family: var(--font-serif); font-size: 3.5rem;">Culinária de Ouro</h1>
        <p>Aprenda a criar sobremesas dignas de realeza com nossos chocolates.</p>
                    <audio autoplay loop controls>
  <source src="audio/Elegant Jazz - Good morning mood with Jazz Cafe - Cheerful Jazz &  Bossa Nova for the best mood - The Best Relaxing Jazz Music (youtube).mp3" type="audio/mp3">
  Seu navegador não suporta a reprodução de áudio.
    </audio>
    </header>
    
    ${getPascoaGoldAd()} <div class="recipe-grid">
        <div class="recipe-card">
            <img src="img/fondue.jpg" alt="Fondue">
            <div class="recipe-content">
                <span class="recipe-tag">Dificuldade: Média</span>
                <h3>Fondue de Pistache Emerald</h3>
                <p>Um mergulho sedoso usando nosso blend de pistache e chocolate branco.</p>
                <button class="tag" style="margin-top:15px">Ver Receita</button>
            </div>
        </div>
        <div class="recipe-card">
            <img src="img/mousse.jpg" alt="Mousse">
            <div class="recipe-content">
                <span class="recipe-tag">Dificuldade: Fácil</span>
                <h3>Mousse Noir 85%</h3>
                <p>Aerado, intenso e finalizado com cristais de flor de sal.</p>
                <button class="tag" style="margin-top:15px">Ver Receita</button>
            </div>
        </div>
    </div>
    
</div>
    ${getPascoaGoldAd()} `;


function navigateTo(page) {
    const main = document.getElementById('app-content');
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    main.style.opacity = '0';
    setTimeout(() => {
        let content = router[page] ? router[page]() : router['home']();
        
      
        if (page !== 'recipes') {
            content += getPascoaGoldAd();
        }

        main.innerHTML = content;

        if(page === 'home' || !page) renderProducts('home-grid', 3);
        if(page === 'shop') renderProducts('main-grid');
        
        main.style.opacity = '1';
    }, 400);
}

const recipeDetails = {
    pistache: {
        title: "Fondue de Pistache Emerald",
        ingredients: ["400g de chocolate branco nobre", "1 caixinha de creme de leite (200g)"," 2 colheres de sopa de pasta de pistache (de preferência 100% pura)."],
        steps: " Derreta o chocolate branco em banho-maria ou no micro-ondas (30 em 30 segundos). Adicione o creme de leite aquecido e misture bem até obter uma ganache lisa."
    },
    mousse: {
        title: "Mousse Noir 85%",
        ingredients: ["Chocolate Amargo 85%: ~200g (derretido)","Ovos: 4 a 6 unidades (claras em neve e gemas)","Manteiga (opcional): ~80g-100g para cremosidade","Açúcar/Adoçante (opcional): 30g-50g (para equilibrar o amargor do 85%)","Pitada de Sal: Essencial para destacar o sabor do cacau."],
        steps: "Derreta o chocolate noir 85%.Incorpore as gemas ao chocolate derretido.Bata as claras em neve com uma pitada de sal.Incorpore as claras delicadamente.Leve à geladeira por 2 a 3 horas"
    }
};


function openRecipe(id) {
    const data = recipeDetails[id];
    
    let overlay = document.querySelector('.recipe-overlay');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'recipe-overlay';
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
        <div class="recipe-modal">
            <span class="close-recipe" onclick="closeRecipe()">&times;</span>
            <h1 style="font-family: var(--font-serif); color: var(--gold);">${data.title}</h1>
            <hr style="margin: 20px 0; opacity: 0.2">
            <h3>Ingredientes</h3>
            <ul style="margin: 15px 20px;">
                ${data.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h3 style="margin-top: 20px;">Modo de Preparo</h3>
            <p style="margin-top: 10px; line-height: 1.8;">${data.steps}</p>
        </div>
    `;
    
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function closeRecipe() {
    document.querySelector('.recipe-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}


router.recipes = () => `
    <header class="recipe-hero">
        <h1 style="font-family: var(--font-serif); font-size: 3.5rem;">Culinária de Ouro</h1>
        <p>Aprenda a criar sobremesas dignas de realeza.</p>
    </header>
                <audio autoplay loop controls>
  <source src="audio/Elegant Jazz - Good morning mood with Jazz Cafe - Cheerful Jazz &  Bossa Nova for the best mood - The Best Relaxing Jazz Music (youtube).mp3" type="audio/mp3">
  Seu navegador não suporta a reprodução de áudio.
    </audio>
    <div class="recipe-grid">
        <div class="recipe-card">
            <img src="img/fondue.jpg">
            <div class="recipe-content">
                <span class="recipe-tag">Dificuldade: Média</span>
                <h3>Fondue de Pistache Emerald</h3>
                <button class="tag" style="margin-top:15px" onclick="openRecipe('pistache')">Ver Receita</button>
            </div>
        </div>
        <div class="recipe-card">
            <img src="img/mousse.jpg">
            <div class="recipe-content">
                <span class="recipe-tag">Dificuldade: Fácil</span>
                <h3>Mousse Noir 85%</h3>
                <button class="tag" style="margin-top:15px" onclick="openRecipe('mousse')">Ver Receita</button>
            </div>
        </div>
    </div>
    <div class="download-container">
    <button class="btn-gold-download" onclick="downloadRecipes()">
        <span class="icon"><i class="fa-solid fa-file-pdf"></i></span>
        <span class="text">Baixar Guia de Receitas d'Or</span>
        <div class="shimmer"></div>
    </button>
    ${getPascoaGoldAd()}
`;

function processCheckout() {
    if (cart.length === 0) {
        showToast("Seu carrinho está vazio!");
        return;
    }

    const btn = document.querySelector('.btn-checkout-gold');
    const originalText = btn.innerText;
    
    
    btn.innerText = "Processando...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    setTimeout(() => {
       
        showToast("Pedido realizado com sucesso!");
        
        
        cart = [];
        updateCart();
        
       
        setTimeout(() => {
            toggleCart();
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
            
           
            navigateTo('home');
        }, 500);
    }, 2000);
}
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filtered = shopDB.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.cat.toLowerCase().includes(query)
    );

    if (!document.getElementById('main-grid')) {
        navigateTo('shop');
        
        setTimeout(() => renderProducts('main-grid', null, filtered), 100);
    } else {
        renderProducts('main-grid', null, filtered);
    }
}


window.onload = () => {
    // Verifica tema salvo ou define dark como padrão se preferir
    const savedTheme = localStorage.getItem('theme') || 'dark'; 
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    
    const bar = document.querySelector('.loader-bar');
    if(bar) bar.style.width = '100%';
    
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.transform = 'translateY(-100%)'; // Efeito de deslize para cima
            setTimeout(() => {
                loader.style.display = 'none';
                navigateTo('home');
                updateCart();
            }, 800);
        }
    }, 1500);
};
function downloadRecipes() {
    const btn = document.querySelector('.btn-gold-download');
    const originalContent = btn.innerHTML;

    // Feedback visual de "preparando"
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Preparando PDF...</span>`;
    btn.style.pointerEvents = 'none';

    setTimeout(() => {

        window.location.href = 'img/receita.pdf'
        showToast("Seu Guia de Receitas está sendo baixado!");
        btn.innerHTML = originalContent;
        btn.style.pointerEvents = 'auto';
        

        console.log("Download iniciado: Receitas_Golden_Easter_2026.pdf");
    }, 1500);
}