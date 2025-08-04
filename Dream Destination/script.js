// Dream Destination Interactive Travel Wishlist App (Improved)

let wishlist = [];
let moodBoards = {};
let currentCountry = null;

const countryData = [
    {"name": "France", "flag": "🇫🇷", "description": "Home to the Eiffel Tower, world-class cuisine, and romantic countryside. Experience art, culture, and joie de vivre."},
    {"name": "Japan", "flag": "🇯🇵", "description": "Land of ancient traditions and modern innovation. Discover cherry blossoms, temples, and cutting-edge technology."},
    {"name": "Italy", "flag": "🇮🇹", "description": "Birthplace of Renaissance art, delicious pasta, and stunning coastlines. From Rome to Venice, la dolce vita awaits."},
    {"name": "Thailand", "flag": "🇹🇭", "description": "Tropical paradise with golden temples, pristine beaches, and incredible street food. The Land of Smiles beckons."},
    {"name": "Australia", "flag": "🇦🇺", "description": "Diverse landscapes from the Outback to the Great Barrier Reef. Adventure and unique wildlife around every corner."},
    {"name": "Brazil", "flag": "🇧🇷", "description": "Vibrant culture, Amazon rainforest, and beautiful beaches. Samba, soccer, and spectacular natural wonders."},
    {"name": "Iceland", "flag": "🇮🇸", "description": "Land of fire and ice with geysers, waterfalls, and Northern Lights. Dramatic landscapes and pure wilderness."},
    {"name": "Morocco", "flag": "🇲🇦", "description": "Exotic markets, desert adventures, and architectural wonders. Experience the magic of North African culture."},
    {"name": "New Zealand", "flag": "🇳🇿", "description": "Adventure capital with fjords, mountains, and hobbit holes. Pure natural beauty and adrenaline-pumping activities."},
    {"name": "India", "flag": "🇮🇳", "description": "Incredible diversity of culture, cuisine, and landscapes. From the Taj Mahal to Kerala backwaters."},
    {"name": "Greece", "flag": "🇬🇷", "description": "Ancient history meets island paradise. Blue-domed churches, crystal waters, and Mediterranean charm."},
    {"name": "Norway", "flag": "🇳🇴", "description": "Fjords, midnight sun, and Northern Lights. Stunning natural beauty and Viking heritage."},
    {"name": "Peru", "flag": "🇵🇪", "description": "Home to Machu Picchu and rich Incan heritage. Diverse landscapes from Amazon to Andes."},
    {"name": "South Africa", "flag": "🇿🇦", "description": "Safari adventures, wine regions, and stunning coastlines. Rainbow nation with incredible wildlife."},
    {"name": "Canada", "flag": "🇨🇦", "description": "Vast wilderness, friendly people, and diverse cities. From Rockies to Maritime provinces."}
];

const moodBoardElements = {
    beaches: ["🏖 Sandy shores", "🌊 Crystal waters", "🏄‍♀ Water sports", "🌅 Sunset views"],
    mountains: ["⛰ Peaks", "🏔 Snow caps", "🚵‍♂ Hiking trails", "🦅 Wildlife"],
    cities: ["🏙 Skylines", "🚇 Metro systems", "🍽 Restaurants", "🎭 Entertainment"],
    culture: ["🏛 Architecture", "🎨 Art galleries", "🎵 Music venues", "📚 Museums"],
    nature: ["🌳 Forests", "🦋 Wildlife", "🌸 Flora", "🏞 National parks"]
};

const worldMapEl = document.getElementById('worldMap');
const wishlistContentEl = document.getElementById('wishlistContent');
const emptyStateEl = document.getElementById('emptyState');
const searchInputEl = document.getElementById('searchInput');
const sortSelectEl = document.getElementById('sortSelect');
const clearWishlistBtn = document.getElementById('clearWishlistBtn');
const countryModal = document.getElementById('countryModal');
const moodBoardModal = document.getElementById('moodBoardModal');
const toastContainer = document.getElementById('toastContainer');

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderWorldMap();
    renderWishlist();
    setupEventListeners();
});

function setupEventListeners() {
    searchInputEl.addEventListener('input', renderWishlist);
    sortSelectEl.addEventListener('change', renderWishlist);
    clearWishlistBtn.addEventListener('click', clearWishlist);

    document.getElementById('closeCountryModal').addEventListener('click', () => closeModal('countryModal'));
    document.getElementById('closeMoodBoardModal').addEventListener('click', () => closeModal('moodBoardModal'));

    countryModal.addEventListener('click', (e) => { if (e.target === countryModal) closeModal('countryModal'); });
    moodBoardModal.addEventListener('click', (e) => { if (e.target === moodBoardModal) closeModal('moodBoardModal'); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal('countryModal');
            closeModal('moodBoardModal');
        }
    });
}

function renderWorldMap() {
    worldMapEl.innerHTML = '';

    countryData.forEach((country, index) => {
        const countryEl = document.createElement('div');
        countryEl.className = `country-card ${isInWishlist(country.name) ? 'in-wishlist' : ''}`;
        countryEl.innerHTML = `
            <div class="country-flag">${country.flag}</div>
            <div class="country-name">${country.name}</div>
        `;

        countryEl.addEventListener('click', () => showCountryDetails(country));
        worldMapEl.appendChild(countryEl);
        countryEl.style.animationDelay = `${index * 0.05}s`;
        countryEl.classList.add('animate-fade-in-up');
    });
}

function showCountryDetails(country) {
    currentCountry = country;

    const isInList = isInWishlist(country.name);
    const hasMoodBoard = moodBoards[country.name];

    const modalContent = document.getElementById('countryModalContent');
    modalContent.innerHTML = '';

    const flagEl = document.createElement('div');
    flagEl.className = 'country-modal-flag';
    flagEl.textContent = country.flag;

    const nameEl = document.createElement('h2');
    nameEl.className = 'country-modal-name';
    nameEl.textContent = country.name;

    const descEl = document.createElement('p');
    descEl.className = 'country-modal-description';
    descEl.textContent = country.description;

    const actionsEl = document.createElement('div');
    actionsEl.className = 'country-modal-actions';

    const addRemoveBtn = document.createElement('button');
    addRemoveBtn.className = isInList ? 'btn btn--danger' : 'btn btn--primary';
    addRemoveBtn.innerHTML = isInList ? '<i class="fas fa-heart-broken"></i> Remove from Wishlist' : '<i class="fas fa-heart"></i> Add to Wishlist';
    addRemoveBtn.addEventListener('click', () => {
        if (isInList) {
            removeFromWishlist(country.name);
        } else {
            addToWishlist(country.name);
        }
    });

    const moodBoardBtn = document.createElement('button');
    moodBoardBtn.className = 'btn btn--outline';
    moodBoardBtn.innerHTML = `<i class="fas fa-palette"></i> ${hasMoodBoard ? 'View' : 'Create'} Mood Board`;
    moodBoardBtn.addEventListener('click', () => openMoodBoard(country.name));

    actionsEl.appendChild(addRemoveBtn);
    actionsEl.appendChild(moodBoardBtn);

    modalContent.appendChild(flagEl);
    modalContent.appendChild(nameEl);
    modalContent.appendChild(descEl);
    modalContent.appendChild(actionsEl);

    openModal('countryModal');
}

function isInWishlist(countryName) {
    return wishlist.some(item => item.name === countryName);
}

function addToWishlist(countryName) {
    if (isInWishlist(countryName)) return;
    const country = countryData.find(c => c.name === countryName);
    wishlist.push({...country, dateAdded: new Date().toISOString()});
    saveData();
    renderWorldMap();
    renderWishlist();
    closeModal('countryModal');
    showToast(`${countryName} added to your wishlist!`, 'success');
}

function removeFromWishlist(countryName) {
    wishlist = wishlist.filter(item => item.name !== countryName);
    saveData();
    renderWorldMap();
    renderWishlist();
    closeModal('countryModal');
    showToast(`${countryName} removed from your wishlist.`, 'warning');
}

function clearWishlist() {
    if (!wishlist.length) return;
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        moodBoards = {};
        saveData();
        renderWorldMap();
        renderWishlist();
        showToast('Wishlist cleared.', 'warning');
    }
}

function renderWishlist() {
    if (!wishlist.length) {
        wishlistContentEl.innerHTML = '';
        wishlistContentEl.appendChild(emptyStateEl);
        emptyStateEl.style.display = 'block';
        return;
    }

    emptyStateEl.style.display = 'none';

    let filtered = [...wishlist];

    const searchTerm = searchInputEl.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm));
    }

    const sortBy = sortSelectEl.value;
    if (sortBy === 'name') {
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
        filtered.sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    wishlistContentEl.innerHTML = filtered.map((item, index) => {
        const hasMood = moodBoards[item.name];
        return `
        <div class="wishlist-item animate-slide-in-right" style="animation-delay: ${index * 0.1}s">
            <div class="wishlist-item__header">
                <div class="wishlist-item__info">
                    <h4>${item.flag} ${item.name}</h4>
                    <div class="wishlist-item__date">Added ${formatDate(item.dateAdded)}</div>
                </div>
            </div>
            <p class="wishlist-item__description">${item.description}</p>
            <div class="wishlist-item__actions">
                <button class="btn btn--primary btn--sm mood-board-btn" data-country="${item.name}">
                    <i class="fas fa-palette"></i> ${hasMood ? 'View' : 'Create'} Mood Board
                </button>
                <button class="btn btn--danger btn--sm remove-btn" data-country="${item.name}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>`;
    }).join('');

    // Attach event listeners to newly created buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromWishlist(btn.dataset.country));
    });
    document.querySelectorAll('.mood-board-btn').forEach(btn => {
        btn.addEventListener('click', () => openMoodBoard(btn.dataset.country));
    });
}

function openMoodBoard(countryName) {
    currentCountry = countryData.find(c => c.name === countryName);
    const country = currentCountry;

    if (!moodBoards[countryName]) {
        moodBoards[countryName] = {
            items: Array(9).fill(null),
            notes: '',
            colors: generateCountryColors(countryName)
        };
    }

    const moodBoard = moodBoards[countryName];
    const sampleElements = getSampleMoodBoardElements(countryName);

    document.getElementById('moodBoardTitle').textContent = `${country.flag} ${country.name} Mood Board`;

    const moodBoardContent = document.getElementById('moodBoardContent');
    moodBoardContent.innerHTML = `
        <div class="mood-board-grid">
            ${moodBoard.items.map((item, index) => `
                <div class="mood-board-item ${item ? 'filled' : ''}" data-index="${index}">
                    ${item || sampleElements[index] || '+ Add'}
                </div>
            `).join('')}
        </div>
        <div class="mood-board-sidebar">
            <div class="mood-board-section">
                <h4>🎨 Color Palette</h4>
                <div class="color-palette">
                    ${moodBoard.colors.map(color => `
                        <div class="color-swatch" style="background-color: ${color}"></div>
                    `).join('')}
                </div>
            </div>
            <div class="mood-board-section">
                <h4>📝 Travel Notes</h4>
                <textarea 
                    class="notes-area" 
                    placeholder="Write your thoughts, plans, and dreams about ${country.name}..."
                >${moodBoard.notes}</textarea>
            </div>
            <div class="mood-board-section">
                <button class="btn btn--primary" id="saveMoodBoardBtn">
                    <i class="fas fa-save"></i> Save Mood Board
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    moodBoardContent.querySelectorAll('.mood-board-item').forEach(itemEl => {
        itemEl.addEventListener('click', () => {
            const idx = parseInt(itemEl.dataset.index);
            fillMoodBoardItem(idx);
        });
    });

    const notesEl = moodBoardContent.querySelector('.notes-area');
    notesEl.addEventListener('input', () => updateMoodBoardNotes(countryName, notesEl.value));

    document.getElementById('saveMoodBoardBtn').addEventListener('click', () => saveMoodBoard(countryName));

    openModal('moodBoardModal');
    closeModal('countryModal');
}

function getSampleMoodBoardElements(countryName) {
    const elements = [];
    const themes = Object.keys(moodBoardElements);
    themes.forEach(theme => {
        const themeElements = moodBoardElements[theme];
        elements.push(...themeElements.slice(0, 2));
    });
    return elements.slice(0, 9);
}

function fillMoodBoardItem(index) {
    if (!currentCountry) return;
    const countryName = currentCountry.name;
    const sampleElements = getSampleMoodBoardElements(countryName);
    if (!moodBoards[countryName].items[index]) {
        moodBoards[countryName].items[index] = sampleElements[index] || `✨ ${countryName} Memory`;
        openMoodBoard(countryName);
    }
}

function updateMoodBoardNotes(countryName, notes) {
    if (moodBoards[countryName]) {
        moodBoards[countryName].notes = notes;
    }
}

function saveMoodBoard(countryName) {
    saveData();
    showToast(`Mood board for ${countryName} saved!`, 'success');
    renderWishlist();
}

function generateCountryColors(countryName) {
    const colorThemes = {
        'France': ['#1e3a8a', '#dc2626', '#ffffff', '#f59e0b'],
        'Japan': ['#dc2626', '#ffffff', '#f97316', '#10b981'],
        'Italy': ['#059669', '#ffffff', '#dc2626', '#f59e0b'],
        'Thailand': ['#f59e0b', '#dc2626', '#0ea5e9', '#10b981'],
        'Australia': ['#0ea5e9', '#f59e0b', '#10b981', '#dc2626'],
        'Brazil': ['#10b981', '#f59e0b', '#0ea5e9', '#dc2626'],
        'Iceland': ['#0ea5e9', '#ffffff', '#6b7280', '#10b981'],
        'Morocco': ['#f59e0b', '#dc2626', '#10b981', '#8b5cf6'],
        'New Zealand': ['#10b981', '#0ea5e9', '#6b7280', '#f59e0b'],
        'India': ['#f59e0b', '#dc2626', '#10b981', '#8b5cf6'],
        'Greece': ['#0ea5e9', '#ffffff', '#f59e0b', '#10b981'],
        'Norway': ['#0ea5e9', '#dc2626', '#ffffff', '#6b7280'],
        'Peru': ['#f59e0b', '#dc2626', '#10b981', '#8b5cf6'],
        'South Africa': ['#f59e0b', '#10b981', '#dc2626', '#0ea5e9'],
        'Canada': ['#dc2626', '#ffffff', '#10b981', '#0ea5e9']
    };
    return colorThemes[countryName] || ['#0ea5e9', '#10b981', '#f59e0b', '#dc2626'];
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    toast.innerHTML = `
        <i class="${icons[type]} toast__icon"></i>
        <span class="toast__message">${message}</span>
        <button class="toast__close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'today';
    if (diffDays === 2) return '1 day ago';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
}

function saveData() {
    try {
        localStorage.setItem('dreamDestination_wishlist', JSON.stringify(wishlist));
        localStorage.setItem('dreamDestination_moodBoards', JSON.stringify(moodBoards));
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('Error saving data. Please try again.', 'error');
    }
}

function loadData() {
    try {
        const savedWishlist = localStorage.getItem('dreamDestination_wishlist');
        const savedMoodBoards = localStorage.getItem('dreamDestination_moodBoards');
        if (savedWishlist) {
            wishlist = JSON.parse(savedWishlist);
        }
        if (savedMoodBoards) {
            moodBoards = JSON.parse(savedMoodBoards);
        }
    } catch (e) {
        console.error('Error loading data:', e);
        wishlist = [];
        moodBoards = {};
    }
}