document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');
    const audio = document.getElementById('bgMusic');
    const totalSongs = 8;
    let currentSong = 0;

    // 加载sitemap
    loadSitemap();

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

    // 初始化AI聊天组件
    initAiChat();
});

// 添加AI聊天相关函数
function initAiChat() {
    const chatContainer = document.getElementById('ai-chat-container');
    
    // 添加点击外部收起功能
    document.addEventListener('click', function(e) {
        // 如果对话框是展开状态，且点击位置不在对话框内
        if (!chatContainer.classList.contains('collapsed') && 
            !chatContainer.contains(e.target)) {
            toggleChat();
        }
    });
    
    // 阻止对话框内的点击事件冒泡
    chatContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 只在展开状态时创建聊天界面
    function createChatInterface() {
        const chatHtml = `
            <div class="chat-header">
                <div class="header-left">
                    <img class="model-avatar" src="https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg" alt="Qwen">
                    <h3>大语言模型</h3>
                </div>
                <div class="chat-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="chat-welcome">
                <div class="welcome-icon">
                    <img src="https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg" alt="Qwen">
                </div>
                <h4>大语言模型</h4>
                <p class="welcome-desc">选择模型并开始对话</p>
                <div class="suggestion-buttons">
                    <button class="suggestion-btn">你好，测试一下对话</button>
                    <button class="suggestion-btn">帮我写一段代码</button>
                    <button class="suggestion-btn">解释一个概念</button>
                    <button class="suggestion-btn">分析一个问题</button>
                </div>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-area">
                <textarea placeholder="输入消息..." rows="1"></textarea>
                <button class="send-btn">发送</button>
            </div>
        `;
        
        chatContainer.innerHTML = chatHtml;
        
        // 获取元素
        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('.send-btn');
        const closeButton = chatContainer.querySelector('.chat-close');
        
        // 添加消息到界面
        function addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = content;
            
            if (type === 'user') {
                avatar.innerHTML = 'You';
                messageDiv.appendChild(messageContent);
                messageDiv.appendChild(avatar);
            } else {
                avatar.innerHTML = `<img src="https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg" alt="Qwen">`;
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
            }
            
            // 确保消息区域可见
            const chatWelcome = chatContainer.querySelector('.chat-welcome');
            const chatMessages = chatContainer.querySelector('.chat-messages');
            
            if (chatWelcome) {
                chatWelcome.style.display = 'none';
            }
            if (chatMessages) {
                chatMessages.style.display = 'block';
            }
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // 添加API相关配置
        const API_CONFIG = {
            baseUrl: 'https://api.siliconflow.cn/v1',
            apiKey: 'sk-hyeudoewxhrzksdcsfbyzkprbocvedmdhydzzmmpuohxxphs',
            model: 'Qwen/Qwen2.5-Coder-7B-Instruct'
        };

        // 修改sendMessage函数
        function sendMessage() {
            const message = textarea.value.trim();
            if (!message) return;
            
            // 添加用户消息到界面
            addMessage(message, 'user');
            textarea.value = '';
            
            // 调用API发送请求
            callChatAPI(message);
        }
        
        // 添加API调用函数
        async function callChatAPI(userMessage) {
            try {
                const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_CONFIG.apiKey}`
                    },
                    body: JSON.stringify({
                        model: API_CONFIG.model,
                        messages: [
                            {
                                role: 'system',
                                content: `你是Qwen2.5-Coder-7B-Instruct，一个由阿里云发布的代码特定大语言模型。
                                        你现在被嵌入在一个网页中，作为用户的AI助手。
                                        你需要：
                                        1. 始终使用中文与用户交流
                                        2. 专注于帮助用户解决编程相关问题
                                        3. 提供清晰、准确的代码示例和解释
                                        4. 友好耐心地回答用户的问题
                                        5. 如果用户的问题超出你的能力范围，要诚实地告诉用户
                                        6. 在合适的时候主动询问用户是否需要更多帮助或解释`
                            },
                            {
                                role: 'user',
                                content: userMessage
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 2048,
                        stream: true,
                        top_p: 0.95,
                        frequency_penalty: 0,
                        presence_penalty: 0
                    })
                });

                // 详细的错误处理
                if (!response.ok) {
                    let errorMessage = '请求失败';
                    try {
                        const errorData = await response.json();
                        console.error('API错误详情:', errorData); // 添加详细日志
                        errorMessage = errorData.error?.message || errorData.message || `API请求失败(${response.status})`;
                    } catch (e) {
                        errorMessage = `API请求失败: HTTP ${response.status} ${response.statusText}`;
                    }
                    
                    addErrorMessage(errorMessage);
                    throw new Error(errorMessage);
                }

                // 处理流式响应
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let aiResponse = '';
                let messageDiv = null;

                while (true) {
                    try {
                        const {value, done} = await reader.read();
                        if (done) break;
                        
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') continue;
                                
                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices[0]?.delta?.content || '';
                                    
                                    if (!messageDiv) {
                                        messageDiv = createMessageElement();
                                    }
                                    
                                    if (content) {
                                        aiResponse += content;
                                        const messageContent = messageDiv.querySelector('.message-content');
                                        if (messageContent) {
                                            messageContent.textContent = aiResponse;
                                            messageContent.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                        }
                                    }
                                } catch (e) {
                                    console.error('解析响应数据失败:', e, data);
                                }
                            }
                        }
                    } catch (streamError) {
                        console.error('读取响应流时出错:', streamError);
                        addErrorMessage('读取响应时出错,请重试');
                        break;
                    }
                }
            } catch (error) {
                console.error('API调用失败:', error);
                addErrorMessage(error.message);
            }
        }
        
        // 修改createMessageElement函数
        function createMessageElement() {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai';
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.innerHTML = `<img src="https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg" alt="Qwen">`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            
            // 确保消息区域可见
            const chatWelcome = chatContainer.querySelector('.chat-welcome');
            const chatMessages = chatContainer.querySelector('.chat-messages');
            
            if (chatWelcome) {
                chatWelcome.style.display = 'none';
            }
            if (chatMessages) {
                chatMessages.style.display = 'block';
                chatMessages.appendChild(messageDiv);
            }
            
            return messageDiv;
        }
        
        // 添加错误消息
        function addErrorMessage(errorText) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message error';
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content error';
            messageContent.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${errorText}</span>
            `;
            
            messageDiv.appendChild(messageContent);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // 绑定发送消息事件
        sendButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡
            sendMessage();
        });
        
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation(); // 阻止冒泡
                sendMessage();
            }
        });
        
        // 阻止输入框点击事件冒泡
        textarea.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // 添加关闭按钮事件
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleChat();
        });
        
        // 添加建议按钮点击事件
        const suggestionBtns = chatContainer.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const message = btn.textContent;
                textarea.value = message;
                sendMessage();
                // 发送后隐藏欢迎页面
                chatContainer.querySelector('.chat-welcome').style.display = 'none';
                chatContainer.querySelector('.chat-messages').style.display = 'block';
            });
        });

        // 添加sitemap相关功能
        function getSitemapInfo() {
            if (window.sitemapData) {
                const currentPath = window.location.pathname;
                const currentUrl = window.location.href;
                
                // 查找当前页面在sitemap中的信息
                const pageInfo = window.sitemapData.find(item => {
                    return currentUrl.includes(item.loc) || item.loc.includes(currentPath);
                });
                
                if (pageInfo) {
                    return `当前页面最后更新时间: ${pageInfo.lastmod}`;
                }
            }
            return '';
        }

        // 在欢迎消息中添加sitemap信息
        function addWelcomeMessage() {
            const sitemapInfo = getSitemapInfo();
            if (sitemapInfo) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message system';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        ${sitemapInfo}
                    </div>
                `;
                messagesContainer.appendChild(messageDiv);
            }
        }

        // 在显示欢迎页面时调用
        if (chatContainer.querySelector('.chat-welcome')) {
            addWelcomeMessage();
        }
    }
    
    // 切换展开/收起状态
    function toggleChat() {
        const isCollapsed = chatContainer.classList.toggle('collapsed');
        if (!isCollapsed) {
            // 展开时创建聊天界面
            createChatInterface();
        } else {
            // 收起时恢复切换按钮
            chatContainer.innerHTML = '<div class="chat-toggle-btn"><i class="fas fa-comments"></i></div>';
        }
    }
    
    // 绑定切换事件
    chatContainer.addEventListener('click', function(e) {
        if (chatContainer.classList.contains('collapsed') || e.target.closest('.chat-toggle-btn')) {
            toggleChat();
        }
    });
}

// 修改loadSitemap函数
async function loadSitemap() {
    try {
        // 检查是否在本地开发环境
        const isLocalDev = window.location.protocol === 'file:';
        
        if (isLocalDev) {
            // 本地开发环境使用硬编码的数据
            window.sitemapData = [
                {
                    loc: 'https://h2o-me.github.io/thw/index.html',
                    lastmod: '2024-01-29',
                    changefreq: 'weekly',
                    priority: '1.0'
                },
                {
                    loc: 'https://h2o-me.github.io/thw/index.html#section2',
                    lastmod: '2024-01-29',
                    changefreq: 'monthly',
                    priority: '0.8'
                },
                {
                    loc: 'https://h2o-me.github.io/thw/index.html#section3',
                    lastmod: '2024-01-29',
                    changefreq: 'weekly',
                    priority: '0.9'
                }
            ];
            console.log('Using local sitemap data');
        } else {
            // 生产环境从服务器获取sitemap
            const response = await fetch('sitemap.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const urls = xmlDoc.getElementsByTagName('url');
            const sitemapData = [];
            
            for (let url of urls) {
                const urlData = {
                    loc: url.getElementsByTagName('loc')[0]?.textContent,
                    lastmod: url.getElementsByTagName('lastmod')[0]?.textContent,
                    changefreq: url.getElementsByTagName('changefreq')[0]?.textContent,
                    priority: url.getElementsByTagName('priority')[0]?.textContent
                };
                sitemapData.push(urlData);
            }
            
            window.sitemapData = sitemapData;
            console.log('Sitemap loaded from server');
        }
        
        console.log('Sitemap data:', window.sitemapData);
        
    } catch (error) {
        console.error('Error loading sitemap:', error);
        // 设置一个默认值，确保不会完全失败
        window.sitemapData = [{
            loc: window.location.href,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '1.0'
        }];
    }
}
