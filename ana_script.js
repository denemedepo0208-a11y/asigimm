document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const audio = document.getElementById('background-audio');
    const contentWrapper = document.getElementById('content-wrapper');

    startButton.addEventListener('click', () => {
        // Butonu yavaşça yok et
        startButton.style.transition = 'opacity 1s';
        startButton.style.opacity = '0';
        
        // Müziği başlat
        audio.play().catch(error => console.log("Müzik başlatılamadı:", error));

        // 4 saniye bekleme süresi (siyah ekran)
        setTimeout(() => {
            startButton.style.display = 'none'; // Butonu tamamen kaldır
            loadBookshelf();
        }, 4000);
    });

    function loadBookshelf() {
        // Kitaplığı göster
        const kitaplikContainer = document.querySelector('.kitaplik-container');
        if (kitaplikContainer) {
            kitaplikContainer.style.display = 'flex';
        }

        // Arka planı değiştir
        document.body.style.backgroundImage = 'url("image.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundColor = 'transparent';
    }
});