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
        
        // 设置音频属性
        audio.volume = 0.5;
        audio.loop = false;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('音乐播放成功');
            }).catch(error => {
                console.log('需要用户交互才能播放音乐:', error);
                
                // 检查是否已存在提示窗口
                const existingHint = document.querySelector('.music-hint');
                if (!existingHint) {
                    const hint = document.createElement('div');
                    hint.className = 'music-hint';  // 添加类名以便于选择
                    hint.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 1000;
                    `;
                    hint.textContent = '点击页面任意位置开始播放音乐';
                    document.body.appendChild(hint);
                    
                    // 点击任意位置移除提示并播放音乐
                    document.addEventListener('click', function removeHintAndPlay() {
                        const hint = document.querySelector('.music-hint');
                        if (hint) {
                            hint.remove();
                        }
                        if (audio.paused) {
                            playMusic();
                        }
                        document.removeEventListener('click', removeHintAndPlay);
                    }, { once: true });
                }
            });
        }
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
