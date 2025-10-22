document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTLERİ SEÇME ---
    const baslangicEkrani = document.querySelector('.baslangic-ekrani');
    const startButton = document.getElementById('startButton');
    const audio = document.getElementById('background-audio');
    const sifreEkrani = document.querySelector('.sifre-ekrani');
    const sifreInput = document.getElementById('sifreInput');
    const sifreButton = document.getElementById('sifreButton');
    const hataMesaji = document.querySelector('.hata-mesaji');
    const DOGRU_SIFRE = '0208';
    const container = document.querySelector('.kitaplik-container');
    const bookshelf = document.querySelector('.bookshelf');
    const allBooksOnShelf = document.querySelectorAll('.book');
    const readingView = document.querySelector('.reading-view');
    const readingPanel = document.querySelector('.reading-panel');
    const closeButton = document.querySelector('.close-reading-view');
    const screenFadeOverlay = document.getElementById('screen-fade-overlay');
    const finalTypingContainer = document.getElementById('final-typing-container');
    const finalPhotoContainer = document.getElementById('final-photo-container');

    // --- BAŞLANGIÇ VE ŞİFRE MANTIĞI ---
    startButton.addEventListener('click', () => {
        audio.volume = 0.5;
        audio.play().catch(error => console.log("Müzik başlatılamadı:", error));
        
        sifreEkrani.classList.add('visible');
        sifreInput.focus();
    });

    sifreButton.addEventListener('click', sifreyiKontrolEt);
    sifreInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') sifreyiKontrolEt();
    });

    function sifreyiKontrolEt() {
        if (sifreInput.value === DOGRU_SIFRE) {
            deneyimiBaslat();
        } else {
            hataMesaji.textContent = 'Yanlış şifre, tekrar dene.';
            sifreInput.classList.add('error');
            setTimeout(() => {
                sifreInput.classList.remove('error');
                hataMesaji.textContent = '';
            }, 1500);
            sifreInput.value = '';
        }
    }

    function deneyimiBaslat() {
        sifreEkrani.style.display = 'none';
        baslangicEkrani.style.opacity = '0';
        setTimeout(() => {
            baslangicEkrani.style.display = 'none';
            container.classList.add('visible');
            createHearts();
        }, 1000); 
    }
    
    function createHearts() {
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 15 + 's';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            document.body.appendChild(heart);
        }
    }
    
    const bookMessages = {
        1: { photo: 'foto1.jpg', message: 'Seninle tanıştığım ilk günüm herşeyim olacağını biliyordum' },
        2: { photo: 'foto2.jpg', message: 'Her gün, seni daha çok sevmenin mümkün olduğunu öğreniyorum.' },
        3: { photo: 'foto3.jpg', message: 'Sen benim en güzel şiirim, en derin hislerimsin.' },
        4: { photo: 'foto4.jpg', message: 'Seninle geçen her an, hayatımın en değerli hazinesi.' },
        5: { photo: 'foto5.jpg', message: 'Sen benim mutlu sonum, yeni başlangıcımsın.' }
    };

    const bookContents = {
        1: `
            <div class="page page-1 active"><h1>Bu fotoğrafı attığında altına ne yazmıştın ?</h1></p><div class="question"><button class="answer-btn" data-correct="false">A) Ben Bir Matematiğim</button><button class="answer-btn" data-correct="true">B) Ben Bir Tabelayım</button><button class="answer-btn" data-correct="false">C) Özledim</button></div></div>
            <div class="page page-2"><h1>Doğru Bildin...</h1><p>Tarih sorucaktım zorlamak istemedim :) Konuşmayı kesmiştik o zaman ben bir tabelayım yazman bile kim haksız kim haklı hepsi Puuf oldu senden asla vazgeçemiyordumm</p><button class="go-to-next-page-btn">Sonraki Sayfa</button></div>
            <div class="page page-3"><h2>Bir Adım Daha...</h2><p>Hadi geç bakalım bir sonraki kitapa.</p><button class="next-book-btn">Sıradaki Kitabı Aç</button></div>`,
        2: `
            <div class="page page-1 active"><h1>resimlerr</h1><p>O gün gecelere kadar çizimlerine bakmıştımm. Resimlerine aşık olmuştumm Peki bana çizmeni istediğim resim hangisiydi?</p><div class="question"><button class="answer-btn" data-correct="true">A) "Tweety"</button><button class="answer-btn" data-correct="false">B) "Dalinin Civcivi"</button><button class="answer-btn" data-correct="false">C) "Bugs Bunny 🥕"</button></div></div>
            <div class="page page-2"><h1>Cüzdanımın tek gözünde hala çizimin duruyorr</h1><p>benim için sen ve senin verdiğin herşey çok değerli sevgilim</p><button class="go-to-next-page-btn">Sonraki Sayfa</button></div>
            <div class="page page-3"><h2>Devam Edelim Mi?</h2><p>Bİ sonraki kitaba ne dersin?</p><button class="next-book-btn">Sıradaki Kitabı Aç</button></div>`,
        3: `
             <div class="page page-1 active"><p>Resimde Gördüğün buluşma ilk buluşmamız yavrumm peki o gün 17 dakika yüriyerek gittiğimi park nereseydi ?</p><div class="question"><button class="answer-btn" data-correct="false">A) "Kurtuluş Park"</button><button class="answer-btn" data-correct="true">B) "Güven Park"</button><button class="answer-btn" data-correct="false">C) "Seyran Park"</button></div></div>
            <div class="page page-2"><h1>Sonsuz Kez...</h1><p>Evet... Defalarca, usanmadan, kalbimin en derininden seviyorumm seni. sen benim herşeyimsinn</p><button class="go-to-next-page-btn">Sonraki Sayfa</button></div>
            <div class="page page-3"><h2>Yeni Bir Sayfa</h2><p>Gel, birlikte yeni bir başlangıç yapalım. Bir sonraki kitapta seni bekliyorum.</p><button class="next-book-btn">Sıradaki Kitabı Aç</button></div>`,
        4: `
            <div class="page page-1 active"><h1>Seninle</h1><p>Aramızdaki o kötü mesafeyi sıfırlamak istiyorum. Bu hikayenin sonunda ne olalım?</p><div class="question"><button class="answer-btn" data-correct="false">A) "İki yabancı"</button><button class="answer-btn" data-correct="true">B) "Biz"</button><button class="answer-btn" data-correct="false">C) "Sadece arkadaş"</button></div></div>
            <div class="page page-2"><h1>Tek İsteğim...</h1><p>Tek isteğim, hayalim ve geleceğim bu: BİZ olmak. Her şeye yeniden başlamak.</p><button class="go-to-next-page-btn">Sonraki Sayfa</button></div>
            <div class="page page-3"><h2>Son Kitap</h2><p>Sana hazırladığım son bir sürpriz var. Lütfen son kitabı açmadan önce biraz bekle daha sana anlatamadığım tüm anılarımızı aklından geçir.</p><button class="next-book-btn">Sonra sıradaki kitabı aç</button></div>`,
        5: `
            <div class="page page-1 active video-container-page">
                <video controls autoplay>
                    <source src="video.mp4" type="video/mp4">
                    Tarayıcın videoyu desteklemiyor.
                </video>
            </div>`
    };

    let audioFadeInterval;
    // DÜZELTME: Fonksiyon artık bir "callback" alabiliyor.
    function fadeAudio(direction, callback) {
        clearInterval(audioFadeInterval);
        const targetVolume = direction === 'out' ? 0 : 0.5;
        const startVolume = audio.volume;
        const duration = 1500;
        let currentTime = 0;
        
        // Eğer zaten çalmaya çalışmıyorsa ve sesi açıyorsak, önce çal
        if (direction === 'in' && audio.paused) {
            audio.play().catch(e => {});
        }

        audioFadeInterval = setInterval(() => {
            currentTime += 50;
            const newVolume = startVolume + (targetVolume - startVolume) * (currentTime / duration);
            audio.volume = Math.max(0, Math.min(0.5, newVolume));

            if (currentTime >= duration) {
                clearInterval(audioFadeInterval);
                if (targetVolume === 0) audio.pause();
                // İşlem bittiğinde callback'i çalıştır (varsa)
                if (callback) callback();
            }
        }, 50);
    }

    allBooksOnShelf.forEach(book => {
        book.addEventListener('click', () => {
            if (book.classList.contains('locked')) {
                book.classList.add('shake');
                setTimeout(() => book.classList.remove('shake'), 500);
                return;
            }
            openBook(book.dataset.bookId);
        });
    });

    function openBook(bookId) {
        if (bookId === '5') {
            screenFadeOverlay.classList.add('visible'); // Önce ekranı karart
            
            // DÜZELTME: Müziği kıs ve bittiğinde videoyu başlat
            fadeAudio('out', () => {
                // Bu kod, sadece müzik tamamen durduğunda çalışır
                readingPanel.innerHTML = bookContents[bookId];
                container.classList.add('reading-mode');
                const video = readingPanel.querySelector('video');
                if (video) {
                    video.play(); // autoplay'e ek olarak manuel başlatma daha güvenilirdir
                    video.addEventListener('ended', handleVideoEnd);
                }
            });
        } else {
            showPhotoAndMessage(bookId);
            readingPanel.innerHTML = bookContents[bookId];
            container.classList.add('reading-mode');
            attachButtonListeners(bookId);
        }
    }
    
    function handleVideoEnd() {
        readingView.style.opacity = '0';
        readingView.style.pointerEvents = 'none';
        setTimeout(() => {
            finalTypingContainer.classList.add('visible');
            startTypingAnimation("Tek İsteğim.\nTek Arzum.\nHayatım Aklımdaki Ve \nKalbimdeki tek kişi oldun\nherzaman seni seviyorumm", "final-typing-text", 150);
        }, 1000);
    }
    
    function startTypingAnimation(text, elementId, speed) {
        const textElement = document.getElementById(elementId);
        let charIndex = 0;
        textElement.innerHTML = ''; 
        const typingInterval = setInterval(() => {
            if (charIndex < text.length) {
                const char = text.charAt(charIndex);
                 if (char === '\n') {
                    textElement.appendChild(document.createElement('br'));
                } else {
                    const span = document.createElement('span');
                    span.className = 'typed-char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    textElement.appendChild(span);
                    setTimeout(() => span.classList.add('glow'), 10);
                    setTimeout(() => span.classList.remove('glow'), 250);
                }
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    finalTypingContainer.style.opacity = '0';
                    finalPhotoContainer.classList.add('visible');
                }, 2000);
            }
        }, speed);
    }

    function showPhotoAndMessage(bookId) {
        const oldBox = document.querySelector('.message-box');
        if (oldBox) oldBox.remove();
        const content = bookMessages[bookId];
        if (!content) return;
        document.body.classList.add('blur-active');
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = `<div class="photo-container"><img src="${content.photo}" alt="Fotoğraf"></div><div class="message">${content.message}</div>`;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
                document.body.classList.remove('blur-active');
                setTimeout(() => messageBox.remove(), 500);
            }, 4000);
        }, 100);
    }

    function attachButtonListeners(bookId) {
        const answerButtons = readingPanel.querySelectorAll('.answer-btn');
        const nextPageButtons = readingPanel.querySelectorAll('.go-to-next-page-btn');
        const nextBookButton = readingPanel.querySelector('.next-book-btn');
        answerButtons.forEach(button => button.addEventListener('click', () => handleAnswer(button, answerButtons)));
        nextPageButtons.forEach(button => button.addEventListener('click', () => goToNextPage()));
        if (nextBookButton) { nextBookButton.addEventListener('click', () => unlockNextBook(parseInt(bookId))); }
    }
    
    function handleAnswer(clickedButton, allButtons) {
        allButtons.forEach(btn => btn.disabled = true);
        if (clickedButton.dataset.correct === 'true') {
            clickedButton.style.backgroundColor = '#4CAF50';
            clickedButton.style.color = 'white';
            setTimeout(() => goToNextPage(), 1000);
        } else {
            clickedButton.style.backgroundColor = '#ff4444';
            clickedButton.style.color = 'white';
            setTimeout(() => {
                clickedButton.style.backgroundColor = '';
                clickedButton.style.color = '';
                allButtons.forEach(btn => btn.disabled = false);
            }, 1000);
        }
    }

    function goToNextPage() {
        const currentPage = readingPanel.querySelector('.page.active');
        const nextPage = currentPage.nextElementSibling;
        if (nextPage && nextPage.classList.contains('page')) {
            currentPage.classList.remove('active');
            nextPage.classList.add('active');
        }
    }
    
    function unlockNextBook(unlockedBookId) {
        closeBook();
        const nextBookId = unlockedBookId + 1;
        const nextBook = bookshelf.querySelector(`.book[data-book-id='${nextBookId}']`);
        if (nextBook) {
            nextBook.classList.remove('locked');
        }
    }
    
    function closeBook() {
        if (screenFadeOverlay.classList.contains('visible')) {
            fadeAudio('in'); // Videoyu kapatırken müziği geri aç
        }
        document.body.classList.remove('blur-active');
        container.classList.remove('reading-mode');
        screenFadeOverlay.classList.remove('visible');
    }

    closeButton.addEventListener('click', closeBook);
});
