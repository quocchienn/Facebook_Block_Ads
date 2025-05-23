/*
 * Facebook Ad Blocker JavaScript
 * Loại bỏ quảng cáo Facebook trên các trang web
 */

// Chặn Facebook tracking scripts
(function() {
    'use strict';
    
    // Chặn Facebook SDK
    if (window.FB) {
        delete window.FB;
    }
    
    // Chặn fbq (Facebook Pixel)
    if (window.fbq) {
        window.fbq = function() {};
        window._fbq = function() {};
    }
    
    // Chặn gtag Facebook
    if (window.gtag) {
        const originalGtag = window.gtag;
        window.gtag = function() {
            const args = Array.prototype.slice.call(arguments);
            if (args[0] === 'config' && args[1] && args[1].includes('facebook')) {
                return;
            }
            return originalGtag.apply(this, arguments);
        };
    }
    
    // Loại bỏ Facebook elements
    function removeFacebookElements() {
        const selectors = [
            // Facebook Like buttons
            '.fb-like',
            '.fb-share-button',
            '.fb-send',
            '.fb-comments',
            '.fb-activity-feed',
            '.fb-recommendations',
            '.fb-like-box',
            '.fb-facepile',
            '.fb-page',
            
            // Facebook iframes
            'iframe[src*="facebook.com"]',
            'iframe[src*="fbcdn.net"]',
            'iframe[src*="connect.facebook.net"]',
            
            // Facebook scripts
            'script[src*="facebook.com"]',
            'script[src*="fbcdn.net"]',
            'script[src*="connect.facebook.net"]',
            
            // Facebook divs
            'div[id*="fb"]',
            'div[class*="fb-"]',
            'div[data-href*="facebook.com"]',
            
            // Sponsored content (nội dung được tài trợ)
            '[data-testid="sponsored_label"]',
            '[aria-label*="Sponsored"]',
            'span:contains("Sponsored")',
            
            // Facebook tracking pixels
            'img[src*="facebook.com/tr"]',
            'img[src*="facebook.com/px"]',
            'noscript img[src*="facebook.com"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });
        
        // Xóa các thẻ có chứa từ khóa Facebook
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const className = element.className;
            const id = element.id;
            
            if (typeof className === 'string' && (
                className.includes('facebook') ||
                className.includes('fb-') ||
                className.includes('fbcdn')
            )) {
                element.style.display = 'none !important';
            }
            
            if (typeof id === 'string' && (
                id.includes('facebook') ||
                id.includes('fb-') ||
                id.includes('fbcdn')
            )) {
                element.style.display = 'none !important';
            }
        });
    }
    
    // Chặn network requests đến Facebook
    function blockFacebookRequests() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest.prototype.open;
        
        // Chặn fetch requests
        window.fetch = function() {
            const url = arguments[0];
            if (typeof url === 'string' && (
                url.includes('facebook.com') ||
                url.includes('fbcdn.net') ||
                url.includes('fbsbx.com') ||
                url.includes('connect.facebook.net')
            )) {
                return Promise.reject(new Error('Blocked Facebook request'));
            }
            return originalFetch.apply(this, arguments);
        };
        
        // Chặn XMLHttpRequest
        window.XMLHttpRequest.prototype.open = function() {
            const url = arguments[1];
            if (typeof url === 'string' && (
                url.includes('facebook.com') ||
                url.includes('fbcdn.net') ||
                url.includes('fbsbx.com') ||
                url.includes('connect.facebook.net')
            )) {
                return;
            }
            return originalXHR.apply(this, arguments);
        };
    }
    
    // Loại bỏ Facebook cookies
    function removeFacebookCookies() {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (name.includes('fb') || name.includes('facebook')) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
        });
    }
    
    // CSS để ẩn các element Facebook
    function addBlockingCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ẩn Facebook elements */
            .fb-like,
            .fb-share-button,
            .fb-send,
            .fb-comments,
            .fb-activity-feed,
            .fb-recommendations,
            .fb-like-box,
            .fb-facepile,
            .fb-page,
            iframe[src*="facebook.com"],
            iframe[src*="fbcdn.net"],
            iframe[src*="connect.facebook.net"],
            script[src*="facebook.com"],
            script[src*="fbcdn.net"],
            [data-testid="sponsored_label"],
            [aria-label*="Sponsored"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                position: absolute !important;
                left: -9999px !important;
            }
            
            /* Ẩn quảng cáo được tài trợ */
            *[class*="sponsored"],
            *[id*="sponsored"],
            *[data-*="sponsored"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Chạy các hàm chặn
    function initializeBlocker() {
        removeFacebookElements();
        blockFacebookRequests();
        removeFacebookCookies();
        addBlockingCSS();
    }
    
    // Chạy ngay lập tức
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlocker);
    } else {
        initializeBlocker();
    }
    
    // Chạy lại khi có thay đổi DOM
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        
        if (shouldCheck) {
            setTimeout(removeFacebookElements, 100);
        }
    });
    
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // Chạy định kỳ để đảm bảo
    setInterval(removeFacebookElements, 2000);
    
})();

// Response modification
let body = $response.body;

if (body) {
    // Loại bỏ Facebook tracking code
    body = body.replace(/<script[^>]*facebook[^>]*>[\s\S]*?<\/script>/gi, '');
    body = body.replace(/<script[^>]*fbcdn[^>]*>[\s\S]*?<\/script>/gi, '');
    body = body.replace(/<script[^>]*connect\.facebook[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Loại bỏ Facebook pixel
    body = body.replace(/fbq\s*\([^)]*\)/g, '');
    body = body.replace(/_fbq\s*\([^)]*\)/g, '');
    
    // Loại bỏ Facebook SDK
    body = body.replace(/FB\.init\s*\([^)]*\)/g, '');
    body = body.replace(/window\.fbAsyncInit\s*=\s*function[^}]*}/g, '');
    
    // Loại bỏ các thẻ Facebook
    body = body.replace(/<div[^>]*fb-[^>]*>[\s\S]*?<\/div>/gi, '');
    body = body.replace(/<iframe[^>]*facebook[^>]*>[\s\S]*?<\/iframe>/gi, '');
    
    $done({body});
} else {
    $done({});
}