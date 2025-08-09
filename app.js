// 页面加载完成后执行
// 版本: 1.0.5 (全新创建)
document.addEventListener('DOMContentLoaded', async () => {
    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        });
    }

    // 移动端菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // 关闭移动菜单
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // 加载推荐插件 (仅在有对应容器的页面执行)
            try {
                const featuredContainer = document.getElementById('featured-plugins');
                if (featuredContainer) {
                    const featuredPlugins = await dataLoader.getFeaturedPlugins();
                    await renderFeaturedPlugins(featuredPlugins);
                }
            } catch (error) {
                console.error('加载推荐插件失败:', error);
                const featuredContainer = document.getElementById('featured-plugins');
                if (featuredContainer) {
                    showError('featured-plugins', '加载推荐插件失败');
                }
            }

    // 加载作者列表
    try {
        const authors = await dataLoader.getAllAuthors();
        if (document.getElementById('authors-container')) {
            renderAuthors(authors);
        }
    } catch (error) {
        console.error('加载作者列表失败:', error);
        showError('authors-container', '加载作者列表失败');
    }

    // 加载团队成员
    try {
        const teamMembers = await dataLoader.getTeamMembers();
        if (document.getElementById('team-members')) {
            renderTeamMembers(teamMembers);
        }
    } catch (error) {
        console.error('加载团队成员失败:', error);
        showError('team-members', '加载团队成员失败');
    }

    // 加载友情链接
    try {
        const friendLinks = await dataLoader.getFriendLinks();
        if (document.getElementById('links-container')) {
            renderFriendLinks(friendLinks);
        }
    } catch (error) {
        console.error('加载友情链接失败:', error);
        showError('friend-links', '加载友情链接失败');
    }

    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', async () => {
            await performSearch();
        });

        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                await performSearch();
            }
        });
    }
});

/**
 * 渲染推荐插件
 * @param {Array} plugins - 插件列表
 */
async function renderFeaturedPlugins(plugins) {
    const container = document.getElementById('featured-plugins');
    container.innerHTML = '';

    if (plugins.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">暂无推荐插件</p>';
        return;
    }

    for (const plugin of plugins) {
        const pluginCard = document.createElement('div');
        pluginCard.className = 'plugin-card bg-white rounded-lg shadow-md overflow-hidden fade-in';

        // 获取作者信息
        let authorName = '未知作者';
        let authorAvatar = '/img/ys.jpg';
        if (plugin.authorId) {
            const author = await dataLoader.getAuthorById(plugin.authorId);
            if (author) {
                authorName = author.name;
                authorAvatar = author.avatar || authorAvatar;
            }
        }

        pluginCard.innerHTML = `
            <div class="p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas ${plugin.icon || 'fa-puzzle-piece'} text-indigo-600"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${plugin.name}</h3>
                        <div class="flex items-center mt-1">
                            <div class="star-rating mr-2">
                                ${generateStarRating(plugin.rating || 0)}
                            </div>
                            <span class="text-sm text-gray-500">(${plugin.reviews || 0})</span>
                        </div>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${plugin.description}</p>
                <div class="flex flex-wrap mb-4">
                    ${plugin.tags ? plugin.tags.map(tag => `
                        <span class="tag bg-indigo-100 text-indigo-800">${tag}</span>
                    `).join('') : ''}
                </div>
                <div class="flex justify-between items-center mt-6">
                    <div class="flex items-center">
                        <img src="${authorAvatar}" alt="作者头像" class="w-8 h-8 rounded-full mr-2">
                        <span class="text-sm text-gray-600">${authorName}</span>
                    </div>
                    <a href="${plugin.githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                        <i class="fab fa-github mr-1"></i> GitHub
                    </a>
                </div>
            </div>
        `;
        container.appendChild(pluginCard);
    }
}

/**
 * 渲染作者列表
 * @param {Array} authors - 作者列表
 */
function renderAuthors(authors) {
    const container = document.getElementById('authors-container');
    container.innerHTML = '';

    if (authors.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">暂无作者数据</p>';
        return;
    }

    authors.forEach(author => {
        const authorCard = document.createElement('div');
        authorCard.className = 'author-card bg-white rounded-lg shadow-md p-6 text-center fade-in cursor-pointer hover:shadow-lg transition-shadow';
        authorCard.setAttribute('data-author-id', author.id);
        authorCard.innerHTML = `
            <img src="${author.avatar || '/img/ys.jpg'}" alt="${author.name}" class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-1">${author.name}</h3>
            <p class="text-gray-500 text-sm mb-3">${author.bio || '暂无简介'}</p>
            <div class="flex justify-center space-x-3 mb-4">
                ${author.github ? `<a href="${author.github}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-github text-xl"></i></a>` : ''}
                ${author.twitter ? `<a href="${author.twitter}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-twitter text-xl"></i></a>` : ''}
            </div>
            <p class="text-sm text-gray-600 mb-2">插件数量: ${author.pluginCount || 0}</p>
            <button class="view-author-details bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors" data-author-id="${author.id}">
                查看详情
            </button>
        `;
        container.appendChild(authorCard);
    });

    // 添加作者卡片点击事件
    document.querySelectorAll('.author-card, .view-author-details').forEach(element => {
        element.addEventListener('click', async (e) => {
            // 防止事件冒泡导致重复触发
            e.stopPropagation();
            const authorId = e.currentTarget.getAttribute('data-author-id') || e.target.closest('.author-card')?.getAttribute('data-author-id');
            if (authorId) {
                try {
                    // 显示加载状态
                    document.getElementById('author-detail').classList.remove('hidden');
                    document.getElementById('author-info').innerHTML = '<div class="text-center py-16"><i class="fas fa-spinner text-4xl text-gray-400 mb-4 animate-spin"></i><p class="text-gray-500">加载作者详情中...</p></div>';
                    document.getElementById('author-plugins-container').innerHTML = '<div class="text-center py-16"><i class="fas fa-spinner text-4xl text-gray-400 mb-4 animate-spin"></i><p class="text-gray-500">加载插件列表中...</p></div>';

                    // 滚动到详情区域
                    document.getElementById('author-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // 获取作者详情和插件
                    const author = authors.find(a => a.id === authorId);
                    const authorPlugins = await dataLoader.getPluginsByAuthor(authorId);

                    // 渲染作者详情
                    renderAuthorDetails(author);
                    // 渲染作者插件
                    await renderAuthorPlugins(authorPlugins);
                } catch (error) {
                    console.error('加载作者详情失败:', error);
                    showError('author-info', '加载作者详情失败');
                    showError('author-plugins-container', '加载插件列表失败');
                }
            }
        });
    });
}

/**
 * 渲染作者详情
 * @param {Object} author - 作者对象
 */
function renderAuthorDetails(author) {
    if (!author) return;

    // 确保元素存在后再设置属性
    const titleElement = document.getElementById('author-detail-title');
    if (titleElement) {
        titleElement.textContent = `${author.name}的详情`;
    }

    const avatarElement = document.getElementById('author-avatar');
    if (avatarElement) {
        avatarElement.src = author.avatar || '/img/ys.jpg';
        avatarElement.alt = author.name;
    }

    const nameElement = document.getElementById('author-name');
    if (nameElement) {
        nameElement.textContent = author.name;
    }

    const bioElement = document.getElementById('author-bio');
    if (bioElement) {
        bioElement.textContent = author.bio || '暂无简介';
    }

    const githubElement = document.getElementById('author-github');
    if (githubElement) {
        githubElement.href = author.github || '#';
    }

    const twitterElement = document.getElementById('author-twitter');
    if (twitterElement) {
        twitterElement.href = author.twitter || '#';
    }

    const pluginCountElement = document.getElementById('author-plugin-count');
    if (pluginCountElement) {
        pluginCountElement.textContent = `插件数量: ${author.pluginCount || 0}`;
    }
}

/**
 * 渲染作者插件
 * @param {Array} plugins - 插件列表
 */
async function renderAuthorPlugins(plugins) {
    const container = document.getElementById('author-plugins-container');
    container.innerHTML = '';

    if (plugins.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">该作者暂无插件</p>';
        return;
    }

    for (const plugin of plugins) {
        const pluginCard = document.createElement('div');
        pluginCard.className = 'plugin-card bg-white rounded-lg shadow-md overflow-hidden fade-in';

        // 获取作者信息
        let authorName = '未知作者';
        let authorAvatar = 'https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff';
        if (plugin.authorId) {
            const author = await dataLoader.getAuthorById(plugin.authorId);
            if (author) {
                authorName = author.name;
                authorAvatar = author.avatar || authorAvatar;
            }
        }

        pluginCard.innerHTML = `
            <div class="p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas ${plugin.icon || 'fa-puzzle-piece'} text-indigo-600"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${plugin.name}</h3>
                        <div class="flex items-center mt-1">
                            <div class="star-rating mr-2">
                                ${generateStarRating(plugin.rating || 0)}
                            </div>
                            <span class="text-sm text-gray-500">(${plugin.reviews || 0})</span>
                        </div>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${plugin.description}</p>
                <div class="flex flex-wrap mb-4">
                    ${plugin.tags ? plugin.tags.map(tag => `
                        <span class="tag bg-indigo-100 text-indigo-800">${tag}</span>
                    `).join('') : ''}
                </div>
                <div class="flex justify-between items-center mt-6">
                    <div class="flex items-center">
                        <img src="${authorAvatar}" alt="作者头像" class="w-8 h-8 rounded-full mr-2">
                        <span class="text-sm text-gray-600">${authorName}</span>
                    </div>
                    <a href="${plugin.githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                        <i class="fab fa-github mr-1"></i> GitHub 仓库
                    </a>
                </div>
            </div>
        `;
        container.appendChild(pluginCard);
    }
}

/**
 * 渲染团队成员
 * @param {Array} members - 团队成员列表
 */
function renderTeamMembers(members) {
    const container = document.getElementById('team-members');
    container.innerHTML = '';

    if (members.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">暂无团队成员数据</p>';
        return;
    }

    members.forEach(member => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card bg-white rounded-lg shadow-md p-6 text-center fade-in';
        teamCard.innerHTML = `
            <img src="${member.avatar || '/img/ys.jpg'}" alt="${member.name}" class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-1">${member.name}</h3>
            <p class="text-indigo-600 font-medium mb-3">${member.role}</p>
            <p class="text-gray-600 text-sm mb-4">${member.bio || '暂无简介'}</p>
            <div class="flex justify-center space-x-3">
                ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-github text-xl"></i></a>` : ''}
                ${member.twitter ? `<a href="${member.twitter}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-twitter text-xl"></i></a>` : ''}
                ${member.email ? `<a href="mailto:${member.email}" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fas fa-envelope text-xl"></i></a>` : ''}
            </div>
        `;
        container.appendChild(teamCard);
    });
}

/**
 * 渲染友情链接
 * @param {Array} links - 友情链接列表
 * @param {HTMLElement} container - 容器元素（可选）
 */
function renderFriendLinks(links, container = null) {
    // 如果没有提供容器，尝试获取默认容器
    if (!container) {
        container = document.getElementById('friend-links') || document.getElementById('links-container');
        if (!container) return;
    }

    container.innerHTML = '';

    if (links.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">暂无友情链接</p>';
        return;
    }

    links.forEach(link => {
        const linkItem = document.createElement('a');
        linkItem.href = link.url;
        linkItem.target = '_blank';
        linkItem.rel = 'noopener noreferrer';
        linkItem.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow';
        linkItem.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="${link.icon || 'fas fa-link'} text-indigo-600 mr-3 text-xl"></i>
                    <span class="font-medium text-gray-800">${link.name}</span>
                </div>
                <i class="fas fa-external-link-alt text-gray-400"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">${link.description || ''}</p>
        `;
        container.appendChild(linkItem);
    });
}

/**
 * 生成星级评分
 * @param {number} rating - 评分（0-5）
 * @returns {string} HTML字符串
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

/**
 * 显示错误信息
 * @param {string} containerId - 容器ID
 * @param {string} message - 错误信息
 */
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded col-span-full">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
    } else {
        console.error(`Error container not found: ${containerId}`);
    }
}

/**
 * 执行搜索
 */
async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        // 如果搜索框为空，重新加载推荐插件
        try {
            const featuredPlugins = await dataLoader.getFeaturedPlugins();
            renderFeaturedPlugins(featuredPlugins);
            document.querySelector('#featured h2').textContent = '推荐插件';
        } catch (error) {
            console.error('加载推荐插件失败:', error);
            showError('featured-plugins', '加载推荐插件失败');
        }
        return;
    }

    try {
        // 搜索插件
        const plugins = await dataLoader.loadData('plugins');
        const searchResults = plugins.all.filter(plugin => 
            plugin.name.toLowerCase().includes(searchTerm) || 
            plugin.description.toLowerCase().includes(searchTerm) || 
            (plugin.tags && plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );

        // 滚动到插件区域
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 渲染搜索结果
        renderFeaturedPlugins(searchResults);
        document.querySelector('#featured h2').textContent = `搜索结果: ${searchTerm}`;
    } catch (error) {
        console.error('搜索插件失败:', error);
        showError('featured-plugins', '搜索插件失败');
    }
}