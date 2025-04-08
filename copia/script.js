$(document).ready(function () {
    // Elementos DOM
    const video = $('#main-video')[0];
    const playPauseBtn = $('#play-pause-btn');
    const playOverlayBtn = $('.play-overlay-btn');
    const posterOverlay = $('.poster-overlay');
    const videoContainer = $('.video-container');
    const playlistItems = $('.playlist-item');
    const prevMediaBtn = $('#prev-media');
    const nextMediaBtn = $('#next-media');
    const videoTitle = $('.video-info h1');
    const videoViews = $('.video-meta .views');
    const videoDate = $('.video-meta .date');
    const videoLikes = $('.video-meta .likes');
    const progressBar = $('.progress-bar');
    const currentTimeDisplay = $('.current-time');
    const durationDisplay = $('.duration');
    const volumeControl = $('.volume-control');
    const volumeBtn = $('.volume-btn');

    // Lista de mídias
    const mediaList = [
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

    let currentMediaIndex = 0;
    let isDraggingProgress = false;
    let wasPlayingBeforeDrag = false;
    let isMuted = false;
    let lastVolume = 0.7;

    // Carrega a mídia atual
    function loadMedia(index) {
        const media = mediaList[index];
        
        // Resetar o vídeo
        video.src = '';
        video.poster = '';
        
        // Atualizar a interface
        $('.poster-image').attr('src', media.poster);
        posterOverlay.show();
        
        videoTitle.text(media.title);
        videoViews.html('<i class="fas fa-eye"></i> ' + media.views);
        videoDate.html('<i class="far fa-calendar-alt"></i> ' + media.date);
        videoLikes.html('<i class="fas fa-heart"></i> ' + media.likes);

        // Atualizar playlist
        playlistItems.removeClass('active');
        playlistItems.eq(index).addClass('active');
        
        // Atualizar a duração
        durationDisplay.text(media.duration);
        
        currentMediaIndex = index;
    }

    // Reproduz a mídia atual
    function playCurrentMedia() {
        const media = mediaList[currentMediaIndex];
        video.src = media.src;
        video.load();
        
        video.oncanplay = function() {
            posterOverlay.fadeOut();
            video.play().catch(e => console.log("Autoplay prevented:", e));
        };
    }

    // Atualiza o tempo atual e a barra de progresso
    function updateProgress() {
        if (!isDraggingProgress) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.css('width', percent + '%');
            currentTimeDisplay.text(formatTime(video.currentTime));
        }
    }

    // Formata o tempo em MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Event Listeners
    playOverlayBtn.on('click', playCurrentMedia);

    playPauseBtn.on('click', function () {
        if (video.paused) {
            if (video.src === '') {
                playCurrentMedia();
            } else {
                video.play();
            }
        } else {
            video.pause();
        }
    });

    video.addEventListener('play', () => {
        playPauseBtn.html('<i class="fas fa-pause"></i>');
        videoContainer.removeClass('paused');
    });

    video.addEventListener('pause', () => {
        playPauseBtn.html('<i class="fas fa-play"></i>');
        videoContainer.addClass('paused');
    });

    video.addEventListener('timeupdate', updateProgress);

    video.addEventListener('ended', function() {
        // Auto-play next video
        nextMediaBtn.trigger('click');
    });

    // Progress bar interaction
    $('.progress-container').on('click', function(e) {
        if (video.duration) {
            const percent = e.offsetX / $(this).width();
            video.currentTime = percent * video.duration;
        }
    });

    $('.progress-container').on('mousedown', function() {
        wasPlayingBeforeDrag = !video.paused;
        if (wasPlayingBeforeDrag) video.pause();
        isDraggingProgress = true;
    });

    $(document).on('mousemove', function(e) {
        if (isDraggingProgress) {
            const progressContainer = $('.progress-container');
            const containerOffset = progressContainer.offset().left;
            const containerWidth = progressContainer.width();
            let percent = (e.pageX - containerOffset) / containerWidth;
            
            percent = Math.max(0, Math.min(1, percent));
            progressBar.css('width', (percent * 100) + '%');
            currentTimeDisplay.text(formatTime(percent * video.duration));
        }
    });

    $(document).on('mouseup', function() {
        if (isDraggingProgress) {
            const percent = parseFloat(progressBar.css('width')) / 100;
            video.currentTime = percent * video.duration;
            isDraggingProgress = false;
            
            if (wasPlayingBeforeDrag) {
                video.play();
            }
        }
    });

    // Playlist interaction
    playlistItems.on('click', function () {
        const index = $(this).index();
        loadMedia(index);
    });

    // Navigation buttons
    prevMediaBtn.on('click', function () {
        currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
        loadMedia(currentMediaIndex);
    });

    nextMediaBtn.on('click', function () {
        currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
        loadMedia(currentMediaIndex);
    });

    // Volume control
    volumeBtn.on('click', function() {
        if (isMuted) {
            video.volume = lastVolume;
            volumeBtn.html('<i class="fas fa-volume-up"></i>');
            $('.volume-slider').val(lastVolume * 100);
        } else {
            lastVolume = video.volume;
            video.volume = 0;
            volumeBtn.html('<i class="fas fa-volume-mute"></i>');
            $('.volume-slider').val(0);
        }
        isMuted = !isMuted;
    });

    $('.volume-slider').on('input', function() {
        video.volume = $(this).val() / 100;
        if (video.volume > 0) {
            isMuted = false;
            lastVolume = video.volume;
            volumeBtn.html('<i class="fas fa-volume-up"></i>');
        }
    });

    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        if (!$(e.target).is('input, textarea')) {
            switch(e.keyCode) {
                case 32: // Space
                    e.preventDefault();
                    playPauseBtn.trigger('click');
                    break;
                case 37: // Left arrow
                    video.currentTime = Math.max(0, video.currentTime - 5);
                    break;
                case 39: // Right arrow
                    video.currentTime = Math.min(video.duration, video.currentTime + 5);
                    break;
                case 38: // Up arrow
                    video.volume = Math.min(1, video.volume + 0.1);
                    $('.volume-slider').val(video.volume * 100);
                    break;
                case 40: // Down arrow
                    video.volume = Math.max(0, video.volume - 0.1);
                    $('.volume-slider').val(video.volume * 100);
                    break;
                case 77: // M key
                    volumeBtn.trigger('click');
                    break;
            }
        }
    });

    // Inicialização
    video.volume = lastVolume;
    $('.volume-slider').val(lastVolume * 100);
    loadMedia(0);
});