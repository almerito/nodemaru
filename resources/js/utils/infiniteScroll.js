/**
 * Reusable Infinite Scroll Helper
 * @param {HTMLElement} listContainer - The element containing the list items
 * @param {HTMLElement} scrollContainer - The element that is scrollable (often the modal body)
 * @param {HTMLElement} loadingElement - The loader element to show/hide
 * @param {string} apiUrl - The URL to fetch data from
 * @param {function} renderItem - Callback to render a single item (returns HTML string)
 * @param {object} options - Optional config (limit, sort, etc.)
 */
export function setupInfiniteScroll(listContainer, scrollContainer, loadingElement, apiUrl, renderItem, options = {}) {
    let currentPage = 1;
    let isLoading = false;
    let hasMore = true;

    const loadData = () => {
        if (isLoading || !hasMore) return;
        isLoading = true;

        // Show loader if it's the first page or if explicitly requested
        if (loadingElement) loadingElement.style.display = 'block';

        const url = new URL(apiUrl, window.location.origin);
        url.searchParams.append('page', currentPage);
        // Append extra options if any
        if (options.params) {
            Object.keys(options.params).forEach(key => url.searchParams.append(key, options.params[key]));
        }

        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const items = data.data; // Assuming Laravel paginate structure

                if (items.length > 0) {
                    items.forEach(item => {
                        const html = renderItem(item);
                        // Create a temporary container to convert string to DOM nodes
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        while (tempDiv.firstChild) {
                            // Correctly insert before the loading element if it's inside the container, otherwise just append
                            if (loadingElement && listContainer.contains(loadingElement)) {
                                listContainer.insertBefore(tempDiv.firstChild, loadingElement);
                            } else {
                                listContainer.appendChild(tempDiv.firstChild);
                            }
                        }
                    });
                    currentPage++;
                    hasMore = data.next_page_url !== null;
                } else {
                    hasMore = false;
                }
            })
            .catch(error => {
                console.error('Error loading data:', error);
                // Optionally show error message in UI
            })
            .finally(() => {
                isLoading = false;
                if (loadingElement) loadingElement.style.display = 'none';
            });
    };

    // Scroll Event Listener
    scrollContainer.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        // Trigger when close to bottom (e.g., 50px threshold)
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            loadData();
        }
    });

    // Initial Load
    loadData();

    // Reset function to be returned if needed for cleanup or modal reopen
    return () => {
        currentPage = 1;
        hasMore = true;
        // Clear current items except loader? Maybe user handles outside
    };
}
