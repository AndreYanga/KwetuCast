document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Controle de navegação entre seções
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Atualizar botões de navegação
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Atualizar seções de conteúdo
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Parar a rádio se estiver tocando e mudar para outra seção
            if (sectionId !== 'radio' && radio) {
                radio.stop();
            }
        });
    });
    
    // ========== SEÇÃO DE VÍDEOS ==========
    const video = document.getElementById('main-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playOverlayBtn = document.querySelector('.play-overlay-btn');
    const posterOverlay = document.querySelector('.poster-overlay');
    const videoContainer = document.querySelector('.video-container');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const prevMediaBtn = document.getElementById('prev-media');
    const nextMediaBtn = document.getElementById('next-media');
    const videoTitle = document.querySelector('.video-info h1');
    const videoViews = document.querySelector('.video-meta .views');
    const videoDate = document.querySelector('.video-meta .date');
    const videoLikes = document.querySelector('.video-meta .likes');
    
    // Lista de vídeos
    const videoList = [
        {
            title: "Nerú Americano - Spider-Man (feat. Careca Vaidoso)",
            src: "assets/videos/neru.mp4",
            poster: "assets/posters/neru.jpg",
            views: "2.3M",
            date: "1 ano atrás",
            likes: "125K",
            duration: "3:45"
        },
        {
            title: "C4 Pedro - Céu",
            src: "assets/videos/c4pedro.mp4",
            poster: "assets/posters/c4pedro.jpg",
            views: "1.9M",
            date: "8 meses atrás",
            likes: "98K",
            duration: "4:12"
        },
        {
            title: "Yola Semedo - Volta Amor",
            src: "assets/videos/yola.mp4",
            poster: "assets/posters/yola.jpg",
            views: "3.1M",
            date: "2 anos atrás",
            likes: "215K",
            duration: "3:58"
        }
    ];
    
    let currentVideoIndex = 0;
    
    // Carrega o vídeo atual
    function loadVideo(index) {
        const videoData = videoList[index];
        
        // Atualizar a interface
        document.querySelector('.poster-image').src = videoData.poster;
        posterOverlay.style.display = 'flex';
        
        videoTitle.textContent = videoData.title;
        videoViews.innerHTML = '<i class="fas fa-eye"></i> ' + videoData.views;
        videoDate.innerHTML = '<i class="far fa-calendar-alt"></i> ' + videoData.date;
        videoLikes.innerHTML = '<i class="fas fa-heart"></i> ' + videoData.likes;
        
        // Atualizar playlist
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[index].classList.add('active');
        
        currentVideoIndex = index;
    }
    
    // Reproduz o vídeo atual
    function playCurrentVideo() {
        const videoData = videoList[currentVideoIndex];
        video.src = videoData.src;
        video.load();
        
        video.oncanplay = function() {
            posterOverlay.style.display = 'none';
            video.play().catch(e => console.log("Autoplay prevented:", e));
        };
    }
    
    // Event listeners para vídeos
    playOverlayBtn.addEventListener('click', playCurrentVideo);
    
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            if (video.src === '') {
                playCurrentVideo();
            } else {
                video.play();
            }
        } else {
            video.pause();
        }
    });
    
    video.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        videoContainer.classList.remove('paused');
    });
    
    video.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        videoContainer.classList.add('paused');
    });
    
    video.addEventListener('ended', function() {
        // Auto-play next video
        nextMediaBtn.click();
    });
    
    // Navegação entre vídeos
    prevMediaBtn.addEventListener('click', function() {
        currentVideoIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
        loadVideo(currentVideoIndex);
    });
    
    nextMediaBtn.addEventListener('click', function() {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        loadVideo(currentVideoIndex);
    });
    
    // Seleção de vídeo na playlist
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadVideo(index);
        });
    });
    
    // ========== SEÇÃO DE MÚSICAS ========== //
    const audioPlayer = {
        audio: new Audio(),
        currentTrack: 0,
        isPlaying: false,
        tracks: [
            {
                title: "Nerú Americano - Spider-Man",
                artist: "Feat. Careca Vaidoso",
                src: "assets/audio/neru.m4a",
                cover: "assets/posters/neru.jpg",
                duration: "3:45"
            },
            {
                title: "C4 Pedro - Céu",
                artist: "Álbum: The Gentleman",
                src: "assets/audio/c4pedro.m4a",
                cover: "assets/posters/c4pedro.jpg",
                duration: "4:12"
            },
            {
                title: "Yola Semedo - Volta Amor",
                artist: "Álbum: Minha Essência",
                src: "assets/audio/yola.m4a",
                cover: "assets/posters/yola.jpg",
                duration: "3:58"
            }
        ],
        
        init: function() {
            this.ui = {
                playBtn: document.getElementById('audio-play'),
                prevBtn: document.getElementById('audio-prev'),
                nextBtn: document.getElementById('audio-next'),
                progressBar: document.getElementById('audio-progress-bar'),
                currentTime: document.getElementById('audio-current-time'),
                duration: document.getElementById('audio-duration'),
                title: document.getElementById('audio-title'),
                artist: document.getElementById('audio-artist'),
                cover: document.getElementById('audio-cover'),
                volumeControl: document.getElementById('volume-control'),
                audioItems: document.querySelectorAll('.audio-item')
            };
            
            this.setupEventListeners();
            this.loadTrack(this.currentTrack);
        },
        
        setupEventListeners: function() {

            this.ui.playBtn.addEventListener('click', () => this.togglePlay());
            this.ui.prevBtn.addEventListener('click', () => this.prevTrack());
            this.ui.nextBtn.addEventListener('click', () => this.nextTrack());
            this.ui.progressBar.addEventListener('input', () => this.seek());
          this.ui.volumeControl.addEventListener('input', () => this.setVolume());
            
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.nextTrack());
            this.audio.addEventListener('loadedmetadata', () => {
                this.ui.duration.textContent = this.formatTime(this.audio.duration);
            });
            
            this.ui.audioItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.currentTrack = index;
                    this.loadTrack(this.currentTrack);
                    if (this.isPlaying) {
                        this.audio.play();
                    }
                });
            });
        },
        
        loadTrack: function(index) {
            const track = this.tracks[index];
            this.audio.src = track.src;
            this.ui.title.textContent = track.title;
            this.ui.artist.textContent = track.artist;
            this.ui.cover.src = track.cover;
            this.ui.duration.textContent = track.duration;
            
            // Atualizar playlist
            this.ui.audioItems.forEach(item => item.classList.remove('active'));
            this.ui.audioItems[index].classList.add('active');
        },
        
        togglePlay: function() {
            if (this.audio.paused) {
                this.audio.play();
                this.ui.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.isPlaying = true;
            } else {
                this.audio.pause();
                this.ui.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.isPlaying = false;
            }
        },
        
        prevTrack: function() {
            this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
            this.loadTrack(this.currentTrack);
            if (this.isPlaying) {
                this.audio.play();
            }
        },
        
        nextTrack: function() {
            this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
            this.loadTrack(this.currentTrack);
            if (this.isPlaying) {
                this.audio.play();
            }
        },
        
        updateProgress: function() {
            const currentTime = this.audio.currentTime;
            const duration = this.audio.duration;
            
            if (!isNaN(duration)) {
                this.ui.progressBar.value = (currentTime / duration) * 100;
                this.ui.currentTime.textContent = this.formatTime(currentTime);
            }
        },
        
        seek: function() {
            const seekTime = (this.ui.progressBar.value / 100) * this.audio.duration;
            this.audio.currentTime = seekTime;
        },
        
        setVolume: function() {
            this.audio.volume = this.ui.volumeControl.value / 100;
        },
        
        formatTime: function(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    };
    
    audioPlayer.init();
    
    // ========== SEÇÃO DE RÁDIO ==========

const radioStations = [
    {
        name: "Radio Mais",
        frequency: "99.1 FM",
        country: "Angola",
        streamUrl: "https://radios.justweb.pt/8050/stream/?1685627470876"
    },
    {
        name: "Radio Escola",
        frequency: "81.4 FM",
        country: "Angola",
        streamUrl: "https://radios.justweb.pt/8050/stream/?1685627470876"
    },
    {
        name: "Radio Lac",
        frequency: "89.9 FM",
        country: "Angola",
        streamUrl: "https://radios.vpn.sapo.pt/AO/radio14.mp3?1685629053605"
    }
];

const radio = {
    audio: null, // Será inicializado quando necessário
    currentStation: null,
    isPlaying: false,
    stations: document.querySelectorAll('.station'),
    
    init: function() {
        // Inicializa o elemento de áudio apenas quando necessário
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        this.stations.forEach((station, index) => {
            station.addEventListener('click', () => {
                if (this.currentStation === index && this.isPlaying) {
                    this.stop();
                } else {
                    this.play(index);
                }
            });
        });
    },
    
    play: function(index) {
        // Primeiro, pare a reprodução atual se estiver tocando
        this.stop();
        
        // Crie uma nova instância do elemento de áudio
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous"; // Importante para streams de rádio
        
        // Configurações para melhor compatibilidade com streams
        this.audio.preload = "none";
        this.audio.autoplay = true;
        
        // Tente reproduzir a nova estação
        try {
            this.currentStation = index;
            this.audio.src = radioStations[index].streamUrl;
            
            // Configurar eventos
            this.audio.oncanplay = () => {
                this.isPlaying = true;
                this.updateUI();
            };
            
            this.audio.onerror = (error) => {
                console.error("Erro ao reproduzir rádio:", error);
                this.stop();
                alert("Não foi possível conectar à rádio. Verifique sua conexão ou tente outra estação.");
            };
            
            // Iniciar reprodução
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Autoplay prevented:", error);
                    // Mostrar instruções para o usuário
                    alert("Por favor, clique no botão de play para iniciar a rádio. Alguns navegadores bloqueiam reprodução automática.");
                });
            }
        } catch (error) {
            console.error("Erro ao configurar rádio:", error);
            this.stop();
            alert("Ocorreu um erro ao tentar reproduzir a rádio.");
        }
    },
    
    stop: function() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = "";
            this.audio = null;
        }
        this.isPlaying = false;
        this.updateUI();
    },
    
    updateUI: function() {
        this.stations.forEach((station, index) => {
            if (index === this.currentStation && this.isPlaying) {
                station.classList.add('active');
                
                // Ativar indicadores visuais
                const liveIndicator = station.querySelector('.live');
                const playingIndicator = station.querySelector('.playing');
                
                if (liveIndicator) liveIndicator.style.opacity = '1';
                if (playingIndicator) playingIndicator.style.display = 'flex';
            } else {
                station.classList.remove('active');
                
                // Desativar indicadores visuais
                const liveIndicator = station.querySelector('.live');
                const playingIndicator = station.querySelector('.playing');
                
                if (liveIndicator) liveIndicator.style.opacity = '0';
                if (playingIndicator) playingIndicator.style.display = 'none';
            }
        });
    }
};

// Inicializar a rádio quando o DOM estiver carregado
//document.addEventListener('DOMContentLoaded', function() {
    radio.init();
//});
    
    // Carregar o primeiro vídeo
    loadVideo(0);
});