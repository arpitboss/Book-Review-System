/**
 * Creating pagination for API responses
 * @param {Object} req - Express request object
 * @param {Number} total - Total number of items
 * @param {Number} limit - Items per page
 * @param {Number} page - Current page number
 * @param {String} route - Base route for pagination links
 * @returns {Object} - Pagination object with links and metadata
 */
exports.getPagination = (req, total, limit, page, route) => {
    const baseUrl = `${req.protocol}://${req.get('host')}${route}`;
    const queryString = { ...req.query };

    // Removing pagination params from query string for reuse
    delete queryString.page;
    delete queryString.limit;

    // Converting query params to string
    const queryParams = Object.keys(queryString)
        .map(key => `${key}=${queryString[key]}`)
        .join('&');

    // Calculating pagination values
    const lastPage = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit - 1, total - 1);

    // Building pagination object
    const pagination = {
        total,
        current_page: page,
        items_per_page: limit,
        total_pages: lastPage,
        first_page: 1,
        last_page: lastPage,
        first_item: startIndex + 1,
        last_item: total > 0 ? endIndex + 1 : 0
    };

    // Adding pagination links
    pagination.links = {
        first: `${baseUrl}?${queryParams ? queryParams + '&' : ''}page=1&limit=${limit}`,
        last: `${baseUrl}?${queryParams ? queryParams + '&' : ''}page=${lastPage}&limit=${limit}`
    };

    if (page > 1) {
        pagination.links.prev = `${baseUrl}?${queryParams ? queryParams + '&' : ''}page=${page - 1}&limit=${limit}`;
    }

    if (page < lastPage) {
        pagination.links.next = `${baseUrl}?${queryParams ? queryParams + '&' : ''}page=${page + 1}&limit=${limit}`;
    }

    return pagination;
};