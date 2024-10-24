document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.nav-container');
    const originalContent = wrapper.innerHTML;

    // Hamburger menü ayarları
    function setupHamburgerMenu() {
        if (hamburger && navContainer) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('active');
                navContainer.classList.toggle('active');
            });
        }
    }

    // Crew sayfası fonksiyonları
    function setupCrewNavigation() {
        const dots = document.querySelectorAll('.dot');

        function updateCrewInfo(index, crews) {
            const crew = crews[index];

            const roleElement = document.getElementById('crew-role');
            const nameElement = document.getElementById('crew-name');
            const bioElement = document.getElementById('crew-bio');
            const imgElement = document.getElementById('crew-img');

            // Crew bilgilerini güncelleme
            if (roleElement) roleElement.textContent = crew.role;
            if (nameElement) nameElement.textContent = crew.name;
            if (bioElement) bioElement.textContent = crew.bio;
            if (imgElement) imgElement.src = crew.images.png;
        }

        function updateActiveDot(activeIndex) {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (dots.length > 0) {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const crews = data.crew;
                    // İlk crew üyesini göster
                    updateCrewInfo(0, crews);
                    updateActiveDot(0);

                    // Noktalara tıklama eventi
                    dots.forEach((dot, index) => {
                        dot.addEventListener('click', () => {
                            updateCrewInfo(index, crews);
                            updateActiveDot(index);
                        });
                    });
                })
                .catch(error => console.log('Veri çekme hatası: ', error));
        }
    }

    // Destination sayfası navigasyonu
    function setupDestinationNavigation() {
        const destNavLinks = document.querySelectorAll('.destination-nav-link');
        const planetImg = document.querySelector('.planet-img img');
        const destinationTitle = document.querySelector('.destination-info-title');
        const destinationDesc = document.querySelector('.destination-description');
        const distanceValue = document.querySelector('.distance p:last-child');
        const travelTimeValue = document.querySelector('.travel-time p:last-child');

        if (destNavLinks.length > 0) {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const destinations = data.destinations;

                    destNavLinks.forEach(link => {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();

                            // Aktif link'i güncelle
                            destNavLinks.forEach(link => link.classList.remove('active'));
                            this.classList.add('active');

                            // Tıklanan gezegenin adını al
                            const planetName = this.textContent.toLowerCase();

                            // Data.json'dan ilgili gezegen verisini bul
                            const planetData = destinations.find(dest =>
                                dest.name.toLowerCase() === planetName
                            );

                            if (planetData) {
                                // Görseli güncelle
                                planetImg.src = planetData.images.webp;
                                planetImg.alt = planetData.name;

                                // Başlığı güncelle
                                destinationTitle.textContent = planetData.name;

                                // Açıklamayı güncelle
                                destinationDesc.textContent = planetData.description;

                                // Mesafe bilgisini güncelle
                                distanceValue.textContent = planetData.distance;

                                // Seyahat süresini güncelle
                                travelTimeValue.textContent = planetData.travel;
                            }
                        });
                    });

                    // Sayfa ilk yüklendiğinde Moon'u göster
                    const moonData = destinations.find(dest =>
                        dest.name.toLowerCase() === 'moon'
                    );

                    if (moonData) {
                        planetImg.src = moonData.images.webp;
                        planetImg.alt = moonData.name;
                        destinationTitle.textContent = moonData.name;
                        destinationDesc.textContent = moonData.description;
                        distanceValue.textContent = moonData.distance;
                        travelTimeValue.textContent = moonData.travel;
                        destNavLinks[0].classList.add('active');
                    }
                })
                .catch(error => console.error('Veri yükleme hatası:', error));
        };
    };



    function initializePageSpecificFunctionality() {
        // Ana navigasyon linkleri
        navLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const clickedLinkId = this.id;
                let url;
                switch (clickedLinkId) {
                    case 'nav-home':
                        document.body.style.backgroundImage = "url('/assets/home/background-home-desktop.jpg')";
                        url = 'home';
                        break;
                    case 'nav-dest':
                        document.body.style.backgroundImage = "url('/assets/destination/background-destination-desktop.jpg')";
                        url = '/destination.html';
                        break;
                    case 'nav-crew':
                        document.body.style.backgroundImage = "url('/assets/crew/background-crew-desktop.jpg')";
                        url = '/crew.html';
                        break;
                    case 'nav-tech':
                        document.body.style.backgroundImage = "url('/assets/technology/background-technology-desktop.jpg')";
                        url = '/technology.html';
                        break;
                    default:
                        console.log('Geçersiz link');
                        return;
                }
                loadContent(url);

                // Nav linklerinin aktif durumunu güncelleme
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Hamburger menüyü kapatma
                hamburger.classList.remove('active');
                navContainer.classList.remove('active');
            });
        });

        // İçerik yükleme fonksiyonu
        function loadContent(url) {
            if (url === 'home') {
                wrapper.innerHTML = originalContent;
                initializePageSpecificFunctionality();
                setupHamburgerMenu();
            } else {
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        wrapper.innerHTML = data;
                        initializePageSpecificFunctionality();
                        setupHamburgerMenu();
                        // Sayfa spesifik initialize işlemleri
                        if (url === '/destination.html') {
                            setupDestinationNavigation();
                            setupHamburgerMenu();
                        } else if (url === '/crew.html') {
                            setupCrewNavigation();
                            setupHamburgerMenu();
                        }
                    })
                    .catch(error => console.error('Fetch hatası:', error));
            }
        }

        // Technology sayfası fonksiyonları
        function setupTechnologyNavigation() {
            const techLinks = document.querySelectorAll('.change-technology-link');
            const techImg = document.querySelector('.technology-img img');
            const techTitle = document.querySelector('.technology-info-title');
            const techDesc = document.querySelector('.technology-description');

            if (techLinks.length > 0) {
                fetch('data.json')
                    .then(response => response.json())
                    .then(data => {
                        const technologies = data.technology;

                        // İlk teknoloji bilgisi
                        updateTechnologyInfo(0, technologies);
                        techLinks[0].classList.add('active');

                        // Link'lere tıklama eventi
                        techLinks.forEach((link, index) => {
                            link.addEventListener('click', () => {
                                // Aktif link'i güncelleme
                                techLinks.forEach(link => link.classList.remove('active'));
                                link.classList.add('active');

                                // Teknoloji bilgilerini güncelleme
                                updateTechnologyInfo(index, technologies);
                            });
                        });
                    })
                    .catch(error => console.error('Teknoloji verisi yükleme hatası:', error));
            }
        }

        function updateTechnologyInfo(index, technologies) {
            const tech = technologies[index];
            const techImg = document.querySelector('.technology-img img');
            const techTitle = document.querySelector('.technology-info-title');
            const techDesc = document.querySelector('.technology-description');

            // Responsive tasarım bölümü
            const isPortrait = window.innerWidth >= 768;
            const imagePath = isPortrait ? tech.images.portrait : tech.images.landscape;

            techImg.src = imagePath;
            techImg.alt = tech.name;
            techTitle.textContent = tech.name;
            techDesc.textContent = tech.description;
        }


        // Sayfa spesifik kontrolleri
        if (document.querySelector('.destination-container')) {
            setupDestinationNavigation();
        }
        if (document.querySelector('.dot')) {
            setupCrewNavigation();
        }
        if (document.querySelector('.technology-container')) {
            setupTechnologyNavigation();
        }
    };

    // İlk yüklemede hamburger menüyü ve sayfa fonksiyonlarını başlatma
    setupHamburgerMenu();
    initializePageSpecificFunctionality();
});
