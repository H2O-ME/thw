document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');
    const audio = document.getElementById('bgMusic');
    const totalSongs = 8;
    let currentSong = 0;

    // 检查滚动位置的函数
    function checkScroll() {
        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - windowHeight/2 &&
                scrollPosition < sectionTop + sectionHeight - windowHeight/2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // 随机获取歌曲编号
    function getRandomSong() {
        let newSong;
        do {
            newSong = Math.floor(Math.random() * totalSongs) + 1;
        } while (newSong === currentSong && totalSongs > 1);
        return newSong;
    }

    // 播放音乐
    function playMusic() {
        currentSong = getRandomSong();
        audio.src = `https://h2o-me.github.io/thw/music/${currentSong}.mp3`;
        audio.play().catch(error => {
            console.log('自动播放失败:', error);
        });
    }

    // 初始化所有事件监听器
    function initializeEventListeners() {
        // 音乐播放结束事件
        audio.addEventListener('ended', playMusic);

        // 滚动事件
        container.addEventListener('scroll', checkScroll);

        // 用户交互后播放音乐
        document.addEventListener('click', function() {
            if (audio.paused) {
                playMusic();
            }
        }, { once: true });
    }

    // 初始化
    container.style.scrollBehavior = 'smooth';
    checkScroll();
    initializeEventListeners();
    playMusic();

    // 向下滚动按钮事件
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            const nextSection = document.querySelector('#section2');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
