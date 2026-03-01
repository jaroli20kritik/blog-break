const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5041/api'
    : 'https://blog-break-api.onrender.com/api';
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5041'
    : 'https://blog-break-api.onrender.com';
let allPosts = [];

function resolveImageUrl(url) {
    if (!url) return 'https://via.placeholder.com/800x450';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('postsGrid');
    const postDetail = document.getElementById('postDetail');

    if (postsGrid) {
        fetchPosts();
    }

    if (postDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            fetchPostDetail(postId);
        } else {
            postDetail.innerHTML = '<p>Post not found.</p>';
        }
    }

    // Admin Access Logic
    const mainLogo = document.getElementById('mainLogo');
    const adminLink = document.getElementById('adminHeaderLink');
    let logoClicks = 0;

    // Deactivate on Refresh
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        sessionStorage.removeItem('adminMode');
    }

    // Check if Admin Mode is active in this session
    if (sessionStorage.getItem('adminMode') === 'active') {
        if (adminLink) adminLink.style.display = 'inline-block';
    } else {
        if (adminLink) adminLink.style.display = 'none';
    }

    if (mainLogo) {
        let navTimer;

        mainLogo.addEventListener('click', (e) => {
            // Check if we are currently on the index.html page
            const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            if (isIndexPage) {
                // On index page, NEVER redirect anywhere. 
                // Just use the logo as a pure 5-click button.
                e.preventDefault();

                // If already active, nothing more to do
                if (sessionStorage.getItem('adminMode') === 'active') return;

                logoClicks++;
                clearTimeout(navTimer);

                if (logoClicks >= 5) {
                    sessionStorage.setItem('adminMode', 'active');
                    if (adminLink) {
                        adminLink.style.display = 'flex';
                        adminLink.style.opacity = '0';
                        setTimeout(() => adminLink.style.opacity = '1', 10);
                    }
                    showToast('Admin Mode Activated 🛠️');
                    logoClicks = 0;
                } else {
                    navTimer = setTimeout(() => {
                        logoClicks = 0;
                    }, 400);
                }
            } else {
                // If we are ON ANOTHER PAGE (like admin.html or post.html), 
                // clicking the logo should still let you go back to index.html
                // We don't prevent default here.
            }
        });
    }

    // Reset Admin visibility on "Go Back"
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            sessionStorage.removeItem('adminMode');
        });
    });

    // Scroll Effects


    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const backToTop = document.getElementById('backToTop');
        const progress = document.getElementById('readingProgress');

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('show');
        }

        // Reading Progress
        if (progress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progress.style.width = scrolled + "%";
        }
    });

    const btt = document.getElementById('backToTop');
    if (btt) {
        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Intersection Observer for Reveal
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    window.revealObserver = observer;
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function showSkeletons() {
    const grid = document.getElementById('postsGrid');
    const featured = document.getElementById('featuredPost');
    if (!grid) return;

    if (featured) {
        featured.innerHTML = `<div class="featured-card skeleton" style="min-height: 500px;"></div>`;
    }

    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="post-card skeleton" style="height: 420px; border-radius: var(--border-radius);"></div>
    `).join('');
}


async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        allPosts = await response.json();
        renderPosts(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        document.getElementById('postsGrid').innerHTML = '<p>Oops! Something went wrong while loading the posts.</p>';
    }
}

let currentCategory = 'All';
let searchQuery = '';

function handleSearch(query) {
    searchQuery = query.toLowerCase();
    applyFilters();
}

function filterByCategory(category) {
    currentCategory = category;
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(category) || (category === 'All' && btn.innerText.includes('All')));
    });

    applyFilters();
}

function applyFilters() {
    let filtered = allPosts;

    if (currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.summary.toLowerCase().includes(searchQuery) ||
            p.content.toLowerCase().includes(searchQuery)
        );
    }

    renderPosts(filtered);
}

function renderPosts(posts) {
    const featuredContainer = document.getElementById('featuredPost');
    const grid = document.getElementById('postsGrid');

    if (posts.length === 0) {
        if (featuredContainer) featuredContainer.innerHTML = '';
        grid.innerHTML = '<p>No insights found matching your criteria.</p>';
        return;
    }

    // Only show featured if viewing 'All' and have posts
    if (currentCategory === 'All' && !searchQuery && featuredContainer) {
        const featured = posts[0];
        const rest = posts.slice(1);

        featuredContainer.innerHTML = `
            <div class="featured-card reveal" onclick="location.href='post.html?id=${featured.id}'">
                <div class="featured-image-wrapper">
                    <img src="${resolveImageUrl(featured.imageUrl)}" alt="${featured.title}">
                </div>
                <div class="featured-content">
                    <span class="post-category">${featured.category}</span>
                    <h2>${featured.title}</h2>
                    <p>${featured.summary}</p>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
                        <span style="font-weight: 600; color: var(--text-muted); font-size: 0.9rem;">${new Date(featured.publishedDate).toLocaleDateString()}</span>
                        <span style="font-weight: 800; color: var(--accent); letter-spacing: 1px; font-size: 0.8rem; text-transform: uppercase;">Discover Story →</span>
                    </div>
                </div>
            </div>
        `;
        renderGrid(rest);
    } else {
        if (featuredContainer) featuredContainer.innerHTML = '';
        renderGrid(posts);
    }
}

function renderGrid(posts) {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;

    grid.innerHTML = posts.map(post => `
        <article class="post-card reveal" onclick="location.href='post.html?id=${post.id}'">
            <div class="post-card-inner">
                <div class="post-card-front">
                    <img src="${resolveImageUrl(post.imageUrl)}" alt="${post.title}">
                    <div class="post-card-front-overlay">
                        <span class="post-category" style="background: var(--accent); color: #fff; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 700; margin-bottom: 0.8rem; display: inline-block;">${post.category}</span>
                        <h2 style="font-size: 1.4rem; font-weight: 700;">${post.title}</h2>
                    </div>
                </div>
                <div class="post-card-back">
                    <span class="post-category">${post.category}</span>
                    <div>
                        <h3>${post.title}</h3>
                        <p>${post.summary}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                        <span>${new Date(post.publishedDate).toLocaleDateString()}</span>
                        <span>Read More →</span>
                    </div>
                </div>
            </div>
        </article>
    `).join('');



    // Re-observe new elements
    if (window.revealObserver) {
        document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
    }
}


async function fetchPostDetail(id) {
    try {
        const response = await fetch(`${API_URL}/posts/${id}`);
        const post = await response.json();
        renderPostDetail(post);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        document.getElementById('postDetail').innerHTML = '<p>Error loading post.</p>';
    }
}

function renderPostDetail(post) {
    const detail = document.getElementById('postDetail');
    const headerContainer = document.getElementById('postHeader');
    if (!detail) return;

    document.title = `${post.title} | Newbreak Blog`;

    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="post-detail-header">
                <img src="${resolveImageUrl(post.imageUrl)}" class="post-detail-header-bg" alt="${post.title}">
                <div class="post-detail-header-content reveal">
                    <span class="post-category">${post.category}</span>
                    <h1>${post.title}</h1>
                    <div class="post-detail-meta">
                        Published on ${new Date(post.publishedDate).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `;
    }

    detail.classList.remove('loading');
    detail.className = 'post-main-container';
    detail.innerHTML = `
        <div class="post-body reveal">
            ${post.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
        </div>
    `;

    // Re-observe new elements
    if (window.revealObserver) {
        document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
    }
}
