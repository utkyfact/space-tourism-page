document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.nav-container');
    const originalContent = wrapper.innerHTML;
    
    let cachedData = null;
    
    async function fetchAndCacheData() {
        if (cachedData) return cachedData;
        try {
            const response = await fetch('data.json');
            cachedData = await response.json();
            return cachedData;
        } catch (error) {
            console.error('Data fetching error:', error);
            return null;
        }
    }

    function setupHamburgerMenu() {
        if (!hamburger || !navContainer) return;
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }

    // Crew sayfası fonksiyonu
    async function setupCrewNavigation() {
        const dots = document.querySelectorAll('.dot');
        if (!dots.length) return;

        const data = await fetchAndCacheData();
        if (!data) return;

        const crews = data.crew;

        function updateCrewInfo(index) {
            const crew = crews[index];
            const elements = {
                role: document.getElementById('crew-role'),
                name: document.getElementById('crew-name'),
                bio: document.getElementById('crew-bio'),
                img: document.getElementById('crew-img')
            };

            if (elements.role) elements.role.textContent = crew.role;
            if (elements.name) elements.name.textContent = crew.name;
            if (elements.bio) elements.bio.textContent = crew.bio;
            if (elements.img) elements.img.src = crew.images.png;
        }

        function updateActiveDot(activeIndex) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        // İlk crew üyesini göster
        updateCrewInfo(0);
        updateActiveDot(0);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCrewInfo(index);
                updateActiveDot(index);
            });
        });
    }

    // Technology sayfası fonksiyonu
    async function setupTechnologyNavigation() {
        const techLinks = document.querySelectorAll('.change-technology-link');
        if (!techLinks.length) return;

        const data = await fetchAndCacheData();
        if (!data) return;

        const technologies = data.technology;

        function updateTechnologyInfo(index) {
            const tech = technologies[index];
            const elements = {
                img: document.querySelector('.technology-img img'),
                title: document.querySelector('.technology-info-title'),
                desc: document.querySelector('.technology-description')
            };

            const isPortrait = window.innerWidth >= 768;
            const imagePath = isPortrait ? tech.images.portrait : tech.images.landscape;

            if (elements.img) {
                elements.img.src = imagePath;
                elements.img.alt = tech.name;
            }
            if (elements.title) elements.title.textContent = tech.name;
            if (elements.desc) elements.desc.textContent = tech.description;
        }

        // İlk teknoloji bilgisini göster
        updateTechnologyInfo(0);
        techLinks[0].classList.add('active');

        techLinks.forEach((link, index) => {
            link.addEventListener('click', () => {
                techLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                updateTechnologyInfo(index);
            });
        });

        // Responsive image handling
        window.addEventListener('resize', () => {
            const currentActive = Array.from(techLinks).findIndex(link => 
                link.classList.contains('active')
            );
            updateTechnologyInfo(currentActive);
        });
    }

    async function setupDestinationNavigation() {
        const destNavLinks = document.querySelectorAll('.destination-nav-link');
        if (!destNavLinks.length) return;

        const data = await fetchAndCacheData();
        if (!data) return;

        const elements = {
            planetImg: document.querySelector('.planet-img img'),
            title: document.querySelector('.destination-info-title'),
            desc: document.querySelector('.destination-description'),
            distance: document.querySelector('.distance p:last-child'),
            travelTime: document.querySelector('.travel-time p:last-child')
        };

        function updateDestination(planetData) {
            if (!planetData || !elements.planetImg) return;
            
            elements.planetImg.src = planetData.images.webp;
            elements.planetImg.alt = planetData.name;
            elements.title.textContent = planetData.name;
            elements.desc.textContent = planetData.description;
            elements.distance.textContent = planetData.distance;
            elements.travelTime.textContent = planetData.travel;
        }

        destNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                destNavLinks.forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');

                const planetName = e.target.textContent.toLowerCase();
                const planetData = data.destinations.find(dest => 
                    dest.name.toLowerCase() === planetName
                );
                
                updateDestination(planetData);
            });
        });

        // Initialize with Moon
        updateDestination(data.destinations[0]);
        destNavLinks[0].classList.add('active');
    }

    async function loadContent(url) {
        try {
            wrapper.style.opacity = '0.6';
            
            let content;
            if (url === 'home') {
                content = originalContent;
            } else {
                const response = await fetch(url);
                content = await response.text();
            }

            wrapper.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 200));
            
            wrapper.innerHTML = content;
            
            setupHamburgerMenu();
            if (url.includes('destination')) {
                await setupDestinationNavigation();
            } else if (url.includes('crew')) {
                await setupCrewNavigation();
            } else if (url.includes('technology')) {
                await setupTechnologyNavigation();
            }

            wrapper.style.opacity = '1';
            
        } catch (error) {
            console.error('Content loading error:', error);
            wrapper.innerHTML = '<p>Error loading content. Please try again.</p>';
        }
    }

    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', async function(event) {
            event.preventDefault();
            
            const routes = {
                'nav-home': { url: 'home', bg: '/assets/home/background-home-desktop.jpg' },
                'nav-dest': { url: '/destination.html', bg: '/assets/destination/background-destination-desktop.jpg' },
                'nav-crew': { url: '/crew.html', bg: '/assets/crew/background-crew-desktop.jpg' },
                'nav-tech': { url: '/technology.html', bg: '/assets/technology/background-technology-desktop.jpg' }
            };

            const route = routes[this.id];
            if (!route) return;

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            document.body.style.backgroundImage = `url('${route.bg}')`;

            if (hamburger && navContainer) {
                hamburger.classList.remove('active');
                navContainer.classList.remove('active');
            }

            await loadContent(route.url);
        });
    });

    // Initial setup
    setupHamburgerMenu();
    fetchAndCacheData();
});
