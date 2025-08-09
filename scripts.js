// 页面加载完成后执行
// 版本: 1.0.4 (添加DOM元素存在性检查)
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

    // 加载推荐插件
    try {
        const featuredPlugins = await dataLoader.getFeaturedPlugins();
        if (document.getElementById('featured-plugins')) {
            renderFeaturedPlugins(featuredPlugins);
        }
    } catch (error) {
        console.error('加载推荐插件失败:', error);
        showError('featured-plugins', '加载推荐插件失败');
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
        if (document.getElementById('friend-links')) {
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
function renderFeaturedPlugins(plugins) {
    const container = document.getElementById('featured-plugins');
    container.innerHTML = '';

    if (plugins.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">暂无推荐插件</p>';
        return;
    }

    plugins.forEach(plugin => {
        const pluginCard = document.createElement('div');
        pluginCard.className = 'plugin-card bg-white rounded-lg shadow-md overflow-hidden fade-in';
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
                        <img src="${plugin.authorAvatar || 'https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff'}" alt="作者头像" class="w-8 h-8 rounded-full mr-2">
                        <span class="text-sm text-gray-600">${plugin.authorName || '未知作者'}</span>
                    </div>
                    <a href="${plugin.githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                        <i class="fab fa-github mr-1"></i> GitHub
                    </a>
                </div>
            </div>
        `;
        container.appendChild(pluginCard);
    });
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
        authorCard.className = 'author-card bg-white rounded-lg shadow-md p-6 text-center fade-in';
        authorCard.innerHTML = `
            <img src="${author.avatar || 'https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff'}" alt="${author.name}" class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-sm">
            <h3 class="text-xl font-semibold text-gray-800 mb-1">${author.name}</h3>
            <p class="text-gray-500 text-sm mb-3">${author.bio || '暂无简介'}</p>
            <div class="flex justify-center space-x-3 mb-4">
                ${author.github ? `<a href="${author.github}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-github text-xl"></i></a>` : ''}
                ${author.twitter ? `<a href="${author.twitter}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors"><i class="fab fa-twitter text-xl"></i></a>` : ''}
            </div>
            <p class="text-sm text-gray-600 mb-2">插件数量: ${author.pluginCount || 0}</p>
            <button class="view-author-plugins bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors" data-author-id="${author.id}">
                查看插件
            </button>
        `;
        container.appendChild(authorCard);
    });

    // 添加作者插件查看按钮事件
    document.querySelectorAll('.view-author-plugins').forEach(button => {
        button.addEventListener('click', async (e) => {
            const authorId = e.currentTarget.getAttribute('data-author-id');
            try {
                const authorPlugins = await dataLoader.getPluginsByAuthor(authorId);
                // 滚动到插件区域
                document.getElementById('featured').scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 渲染作者的插件
                renderFeaturedPlugins(authorPlugins);
                // 更新标题
                const author = authors.find(a => a.id === authorId);
                document.querySelector('#featured h2').textContent = `${author ? author.name : '该作者'}的插件`;
            } catch (error) {
                console.error('加载作者插件失败:', error);
                showError('featured-plugins', '加载作者插件失败');
            }
        });
    });
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
            <img src="${member.avatar || 'https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff'}" alt="${member.name}" class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-sm">
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
 */
function renderFriendLinks(links) {
    const container = document.getElementById('friend-links');
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
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            ${link.icon ? `<i class="${link.icon} mr-2"></i>` : ''}
            ${link.name}
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