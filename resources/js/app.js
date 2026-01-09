import './bootstrap';
import '../css/app.scss';

// Expose Bootstrap globally
import * as bootstrap from 'bootstrap';
import { setupInfiniteScroll } from './utils/infiniteScroll.js';

window.bootstrap = bootstrap;
window.setupInfiniteScroll = setupInfiniteScroll;
import toastr from 'toastr';

// Initialize NodeGraph Editor
import { createEditor } from './editor';
import { setupNodeSelector } from './node_selector';
import { setupSettingsModal } from './settings_modal';
import { setupSceneManager } from './scene_manager';
import { setupPersistence } from './persistence_manager';
import { setupHydraLayer } from './hydra_layer';
import './runtime_helpers'; // Hydra runtime helpers (global)

// Import local images so Vite processes them
import.meta.glob([
    '../images/**',
]); // This tells Vite to handle all images in resources/images
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "timeOut": "3000"
};

// Expose toastr globally for system nodes
window.toastr = toastr;

window.addEventListener('scroll', () => {
    // Scroll event logic if needed
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('node_graph');
    if (container) {
        const graph = createEditor(container);

        // Setup Node Selector
        setupNodeSelector(graph);

        // Setup Settings Modal
        setupSettingsModal(graph);

        // Setup Scenes Manager
        setupSceneManager(graph);

        // Setup Persistence
        setupPersistence(graph);

        // ============================================
        // Hydra Canvas Layer
        // ============================================
        setupHydraLayer(graph);
    }

    // Global Fix for Bootstrap 5.3 Modal ARIA Warning
    // The issue: Bootstrap sets aria-hidden="true" on modal close while focus is still inside.
    // Solution: Use the 'inert' attribute instead, which properly prevents focus AND removes the warning.
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hide.bs.modal', () => {
            // Blur any focused element inside before hiding
            if (document.activeElement && modal.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        });

        modal.addEventListener('hidden.bs.modal', () => {
            // After fully hidden, set inert and remove aria-hidden
            modal.inert = true;
            modal.removeAttribute('aria-hidden');
        });

        modal.addEventListener('show.bs.modal', () => {
            // Before showing, remove inert
            modal.inert = false;
            modal.removeAttribute('aria-hidden');
        });
    });

    // Auth Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            axios.post('/login', formData)
                .then(response => {
                    if (response.data.success) {
                        toastr.success('Login successful! Reloading...'); // Changed alert to toastr
                        setTimeout(() => window.location.reload(), 1000); // Added setTimeout
                    }
                })
                .catch(error => {
                    console.error(error);
                    toastr.error('Login failed. Please check your credentials.'); // Changed alert to toastr
                });
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            axios.post('/register', formData)
                .then(response => {
                    if (response.data.success) {
                        toastr.success('Registration successful! Reloading...'); // Changed alert to toastr
                        setTimeout(() => window.location.reload(), 1000); // Added setTimeout
                    }
                })
                .catch(error => {
                    console.error(error);
                    toastr.error('Registration failed. Please try again.'); // Changed alert to toastr
                });
        });
    }

    // Profile Logic
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            axios.post('/profile/update', formData)
                .then(response => {
                    if (response.data.success) {
                        toastr.success('Profile updated successfully!'); // Changed alert to toastr
                        setTimeout(() => window.location.reload(), 1000); // Added setTimeout
                    }
                })
                .catch(error => {
                    console.error(error);
                    let msg = 'Profile update failed.';
                    if (error.response && error.response.data && error.response.data.errors) {
                        msg += '<br>' + Object.values(error.response.data.errors).flat().join('<br>'); // Changed \n to <br>
                    }
                    toastr.error(msg); // Changed alert to toastr
                });
        });
    }

    // Logout Logic
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            axios.post('/logout')
                .then(response => {
                    if (response.data.success) {
                        toastr.info('Logged out successfully.');
                        setTimeout(() => window.location.reload(), 500);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    // Changelog Logic
    const changelogModal = document.getElementById('changelogModal');
    if (changelogModal) {
        const container = document.getElementById('changelogContainer');
        const loading = document.getElementById('changelogLoading');

        changelogModal.addEventListener('show.bs.modal', () => {
            container.innerHTML = '';
            container.appendChild(loading);

            setupInfiniteScroll(
                container,
                changelogModal.querySelector('.modal-body'),
                loading,
                '/changelogs',
                (item) => {
                    const date = new Date(item.created_at).toLocaleDateString();
                    return `
                        <div class="card bg-secondary bg-opacity-10 border-secondary mb-3">
                            <div class="card-header border-secondary d-flex justify-content-between align-items-center">
                                <h6 class="mb-0 text-info">v${item.version}</h6>
                                <small class="text-muted">${date}</small>
                            </div>
                            <div class="card-body">
                                <div class="card-text text-white small">${item.content}</div>
                            </div>
                        </div>
                    `;
                }
            );
        });
    }

    // ============================================
    // Notification System Logic
    // ============================================
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');

    window.fetchNotifications = function () {
        axios.get('/notifications/unread')
            .then(res => {
                const { count, messages } = res.data;

                // Update Badge
                if (notificationBadge) {
                    notificationBadge.innerText = count;
                    notificationBadge.style.display = count > 0 ? 'inline-block' : 'none';
                }

                // Update List
                if (notificationList) {
                    if (messages.length === 0) {
                        notificationList.innerHTML = '<li class="p-3 text-center text-muted small">No messages history</li>';
                    } else {
                        notificationList.innerHTML = messages.map(msg => {
                            // Define styles based on read status
                            const bgClass = msg.is_read ? 'bg-dark opacity-75' : 'bg-secondary bg-opacity-25';
                            const titleClass = msg.is_read ? 'text-muted' : 'text-info fw-bold';
                            const textClass = msg.is_read ? 'text-muted small' : 'text-white small';
                            const borderClass = msg.is_read ? 'border-secondary' : 'border-info';

                            // Unread Indicator dot
                            const indicator = !msg.is_read ? '<span class="position-absolute top-0 start-0 translate-middle p-1 bg-info border border-light rounded-circle" style="left: 10px !important; top: 15px !important;"></span>' : '';

                            return `
                            <a href="#" class="list-group-item list-group-item-action ${bgClass} text-white border-bottom ${borderClass} border-0 p-3 position-relative" 
                               style="transition: background 0.2s;"
                               onclick="window.markNotificationRead(${msg.id}, '${msg.link || ''}')">
                                ${indicator}
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1 ${titleClass}">${msg.title}</h6>
                                    <small class="${textClass}" style="opacity: 0.7; font-size: 0.7em">${new Date(msg.created_at).toLocaleDateString()}</small>
                                </div>
                                <p class="mb-1 ${textClass}">${msg.message}</p>
                            </a>
                        `}).join('');
                    }
                }
            })
            .catch(err => console.error("Notification Fetch Error", err));
    };

    window.markNotificationRead = function (id, link) {
        axios.post(`/notifications/${id}/read`)
            .then(() => {
                // Refresh list
                window.fetchNotifications();
                // Redirect if link exists
                if (link && link !== 'null' && link !== 'undefined') {
                    window.open(link, '_blank');
                }
            })
            .catch(err => console.error("Notification Read Error", err));
    };

    window.markAllNotificationsRead = function () {
        axios.post('/notifications/read-all')
            .then(() => {
                window.fetchNotifications();
                toastr.success('All messages marked as read');
            })
            .catch(err => console.error("Notification Mark All Error", err));
    };

    // Initial Fetch & Poll
    if (notificationBadge) { // Only if logged in (element exists)
        window.fetchNotifications();
        // Poll every 60 seconds
        setInterval(window.fetchNotifications, 60000);
    }
});
