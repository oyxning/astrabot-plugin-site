// 数据加载器
class DataLoader {
    constructor() {
        this.basePath = 'data';
        this.dataCache = {};
    }

    /**
     * 加载JSON数据文件
     * @param {string} fileName - 文件名（不含.json扩展名）
     * @returns {Promise<Object>} 解析后的数据
     */
    async loadData(fileName) {
        // 检查缓存
        if (this.dataCache[fileName]) {
            return this.dataCache[fileName];
        }

        try {
            const response = await fetch(`${this.basePath}/${fileName}.json`);
            if (!response.ok) {
                throw new Error(`无法加载数据文件: ${fileName}.json`);
            }
            const data = await response.json();
            this.dataCache[fileName] = data;
            return data;
        } catch (error) {
            console.error('数据加载错误:', error);
            // 返回空数据结构以避免页面崩溃
            return this.getEmptyDataStructure(fileName);
        }
    }

    /**
     * 获取空的数据结构
     * @param {string} fileName - 文件名
     * @returns {Object} 空数据结构
     */
    getEmptyDataStructure(fileName) {
        switch (fileName) {
            case 'plugins':
                return { featured: [], all: [] };
            case 'authors':
                return [];
            case 'team':
                return [];
            case 'links':
                return [];
            default:
                return {};
        }
    }

    /**
     * 按作者获取插件
     * @param {string} authorId - 作者ID
     * @returns {Promise<Array>} 插件列表
     */
    async getPluginsByAuthor(authorId) {
        const plugins = await this.loadData('plugins');
        return plugins.all.filter(plugin => plugin.authorId === authorId);
    }

    /**
     * 获取推荐插件
     * @returns {Promise<Array>} 推荐插件列表
     */
    async getFeaturedPlugins() {
        const plugins = await this.loadData('plugins');
        return plugins.featured;
    }

    /**
     * 获取所有作者
     * @returns {Promise<Array>} 作者列表
     */
    async getAllAuthors() {
        return this.loadData('authors');
    }

    /**
     * 根据ID获取作者
     * @param {string} authorId - 作者ID
     * @returns {Promise<Object|null>} 作者对象或null
     */
    async getAuthorById(authorId) {
        const authors = await this.loadData('authors');
        return authors.find(author => author.id === authorId) || null;
    }

    /**
     * 获取团队成员
     * @returns {Promise<Array>} 团队成员列表
     */
    async getTeamMembers() {
        return this.loadData('team');
    }

    /**
     * 获取友情链接
     * @returns {Promise<Array>} 友情链接列表
     */
    async getFriendLinks() {
        return this.loadData('links');
    }
}

// 创建数据加载器实例
const dataLoader = new DataLoader();