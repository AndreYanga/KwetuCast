
$(document).ready(function () {
    const video = $('#main-video')[0];
    const playPauseBtn = $('#play-pause-btn');
    const playOverlayBtn = $('.play-overlay-btn');
    const posterOverlay = $('.poster-overlay');
    const videoContainer = $('.video-container');
    const playlistItems = $('.playlist-item');
    const prevMediaBtn = $('#prev-media');
    const nextMediaBtn = $('#next-media');

    const mediaList = [
        {
            title: "Nerú Americano - Mama é Baixinha",
            src: "assets/videos/neru.mp4",
            poster: "assets/posters/neru.jpg",
            views: "2.3M",
            date: "1 ano atrás"
        },
        {
            title: "C4 Pedro - Céu",
            src: "assets/videos/c4pedro.mp4",
            poster: "assets/posters/c4pedro.jpg",
            views: "1.9M",
            date: "8 meses atrás"
        },
        {
            title: "Yola Semedo - Volta Amor",
            src: "assets/videos/yola.mp4",
            poster: "assets/posters/yola.jpg",
            views: "3.1M",
            date: "2 anos atrás"
        }
    ];

    let currentMediaIndex = 0;

    function loadMedia(index) {
        const media = mediaList[index];
        video.src = '';
        video.poster = '';
        $('.poster-image').attr('src', media.poster);
        $('.poster-overlay').show();

        $('.video-info h1').text(media.title);
        $('.video-meta .views').html('<i class="fas fa-eye"></i> ' + media.views);
        $('.video-meta .date').html('<i class="far fa-calendar-alt"></i> ' + media.date);

        playlistItems.removeClass('active');
        playlistItems.eq(index).addClass('active');

        currentMediaIndex = index;
    }

    playOverlayBtn.on('click', function () {
        const media = mediaList[currentMediaIndex];
        video.src = media.src;
        $('.poster-overlay').fadeOut();
        video.play();
    });

    playPauseBtn.on('click', function () {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    video.onplay = () => playPauseBtn.html('<i class="fas fa-pause"></i>');
    video.onpause = () => playPauseBtn.html('<i class="fas fa-play"></i>');

    playlistItems.on('click', function () {
        const index = $(this).index();
        loadMedia(index);
    });

    prevMediaBtn.on('click', function () {
        currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
        loadMedia(currentMediaIndex);
    });

    nextMediaBtn.on('click', function () {
        currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
        loadMedia(currentMediaIndex);
    });

    loadMedia(0);
});
