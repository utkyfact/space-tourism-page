document.addEventListener('DOMContentLoaded', function () {

    const wrapper = document.getElementById('wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.nav-container');
    const originalContent = wrapper.innerHTML;

    function initializePageSpecificFunctionality() {

        // Destination sayfası navigasyonu
        const destNavLinks = document.querySelectorAll('.destination-nav-link');
        destNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                destNavLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Technology sayfası butonları
        const changeTechnology = document.querySelectorAll('.change-technology-link');
        changeTechnology.forEach(link => {
            link.addEventListener('click', function () {
                changeTechnology.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });


        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const crews = data.crew;


                updateCrewInfo(0, crews);
                updateActiveDot(0);
            })
            .catch(error => console.log('Veri çekme hatası: ', error));

        function updateCrewInfo(index, crews) {
            const crew = crews[index];

            const roleElement = document.getElementById('crew-role');
            const nameElement = document.getElementById('crew-name');
            const bioElement = document.getElementById('crew-bio');
            const imgElement = document.getElementById('crew-img');

            // Crew bilgilerini güncelleme
            roleElement.textContent = crew.role;
            nameElement.textContent = crew.name;
            bioElement.textContent = crew.bio;
            imgElement.src = crew.images.png;
        }

        const dots = document.querySelectorAll('.dot');
        // Noktalara tıklayınca crew üyesini güncelleme
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                fetch('data.json')
                    .then(response => response.json())
                    .then(data => {
                        const crews = data.crew;
                        updateCrewInfo(index, crews);
                        updateActiveDot(index);
                    })
                    .catch(error => console.log('Veri çekme hatası: ', error));
            });
        });




        // Aktif noktayı güncelleme
        function updateActiveDot(activeIndex) {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function loadContent(url) {
        if (url === 'home') {
            wrapper.innerHTML = originalContent;
            initializePageSpecificFunctionality();
        } else {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    wrapper.innerHTML = data;
                    initializePageSpecificFunctionality();
                })
                .catch(error => console.error('Fetch hatası:', error));
        }
    }

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

            // Nav linklerinin aktif durumunu güncelle
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            // Hamburger menüyü kapatma
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
        });

        // window.addEventListener('resize', function (x) {
        //     updateBackground();
        //     console.log(x)
        // });
        
        // function updateBackground() {
        //     const windowWidth = window.innerWidth;
        //     const bodyImage = document.body.style.backgroundImage

            
        // }
        // window.onload = updateBackground;

    });

    // Hamburger menü
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
    });


    initializePageSpecificFunctionality();
});








