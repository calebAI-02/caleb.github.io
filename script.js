document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate skill bars on scroll
    const skillSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-level');
    
    const animateSkillBars = () => {
        const sectionPos = skillSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        
        if(sectionPos < screenPos) {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            window.removeEventListener('scroll', animateSkillBars);
        }
    };

    window.addEventListener('scroll', animateSkillBars);

    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });

    // Add click event to "Learn More" buttons
    const buttons = document.querySelectorAll('.btn-more');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This feature is coming soon!');
        });
    });

    // Music player functionality
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const songTitle = document.getElementById('song-title');
    const artist = document.getElementById('artist');
    const albumCover = document.getElementById('album-cover');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const volumeSlider = document.getElementById('volume-slider');

    let isPlaying = false;
    let currentSongIndex = 0;
    let audio = new Audio();

    const songs = [
        { title: "红色高跟鞋", artist: "蔡健雅", coverImage: "spi.png", audioSrc: "music/红色高跟鞋.mp3" },
        { title: "七里香", artist: "周杰伦", coverImage: "111.png", audioSrc: "music/七里香.mp3" },
        { title: "平凡之路", artist: "朴树", coverImage: "222.png", audioSrc: "music/平凡之路.mp3" },
        { title: "光年之外", artist: "G.E.M.邓紫棋", coverImage: "333.png", audioSrc: "music/光年之外.mp3" }
    ];

    function updateSongInfo() {
        songTitle.textContent = songs[currentSongIndex].title;
        artist.textContent = songs[currentSongIndex].artist;
        albumCover.src = songs[currentSongIndex].coverImage || 'default_cover.jpg';
        audio.src = songs[currentSongIndex].audioSrc;
        
        // 重置进度条和时间显示
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
        
        // 当音频加载完成后更新总时间
        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
        });
    }

    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateSongInfo();
        if (isPlaying) playSong();
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSongInfo();
        if (isPlaying) playSong();
    });

    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    function updateProgress() {
        const { duration, currentTime } = audio;
        if (isNaN(duration)) return;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audio.volume = volume;
    });

    // Initialize the first song
    updateSongInfo();

    // Playlist functionality
    function updatePlaylist() {
        const playlistElement = document.getElementById('playlist-items');
        playlistElement.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                updateSongInfo();
                playSong();
            });
            playlistElement.appendChild(li);
        });
    }

    updatePlaylist();

    // Music stats
    let totalListeningTime = 0;
    const favoriteGenres = ['Pop', 'Rock', 'Classical', 'Jazz', 'Electronic'];
    let currentFavoriteGenreIndex = 0;
    let currentMostPlayedArtistIndex = 0;

    function updateMusicStats() {
        totalListeningTime += 1;
        document.getElementById('total-listening-time').textContent = totalListeningTime;
        
        currentFavoriteGenreIndex = (currentFavoriteGenreIndex + 1) % favoriteGenres.length;
        document.getElementById('favorite-genre').textContent = favoriteGenres[currentFavoriteGenreIndex];
        
        currentMostPlayedArtistIndex = (currentMostPlayedArtistIndex + 1) % songs.length;
        document.getElementById('most-played-artist').textContent = songs[currentMostPlayedArtistIndex].artist;

        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleTimeString();
    }

    updateMusicStats();

    // Update stats every 10 seconds
    setInterval(updateMusicStats, 10000);

    // 添加音频结束事件监听器
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSongInfo();
        playSong();
    });

    // 添加技能圆环动画
    const skillCircles = document.querySelectorAll('.skill-circle');
    
    const animateSkillCircles = () => {
        skillCircles.forEach(circle => {
            const progress = circle.querySelector('.progress');
            const percent = circle.dataset.percent;
            const radius = progress.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            
            progress.style.strokeDasharray = `${circumference} ${circumference}`;
            progress.style.strokeDashoffset = circumference;
            
            setTimeout(() => {
                progress.style.strokeDashoffset = offset;
            }, 100);
        });
    };

    // 在页面加载时执行动画
    animateSkillCircles();

    // 如果您想在滚动到技能部分时触发动画，可以使用以下代码
    const skillsSection = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillCircles();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
});
