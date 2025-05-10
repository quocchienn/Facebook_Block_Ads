// facebook_ad_block.js
(function () {
    // Danh sách domain quảng cáo
    const adDomains = [
        'ads.facebook.com',
        'graph.facebook.com',
        'an.facebook.com',
        'connect.facebook.net',
        'fbcdn.net',
        'facebook.com',
        'fb.com',
        'fb.me',
        'facebook.net',
        'creative.ak.fbcdn.net',
        'fbcdn-creative-a.akamaihd.net',
        'ad.doubleclick.net',
        'ads-api.facebook.com',
        'pixel.facebook.com',
        'analytics.facebook.com',
        'events.facebook.com',
        'adsmanager.facebook.com',
        'meta.com',
        'metapixel.com'
    ];

    // Từ khóa quảng cáo trong URL
    const adKeywords = [
        'ads_',
        'sponsored',
        'promoted',
        'ad_',
        'advert',
        'marketing',
        'business',
        'adsmanager',
        'tr?',
        'video_ad',
        'ad_break',
        'sponsored_video',
        'vpa_',
        'vpl_',
        'ad_library',
        'admanager',
        'pixel'
    ];

    // Hàm kiểm tra URL có chứa quảng cáo không
    function isAdRequest(url, host) {
        // Kiểm tra domain
        if (adDomains.some(domain => host.includes(domain))) {
            return true;
        }

        // Kiểm tra từ khóa quảng cáo trong URL
        if (adKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
            return true;
        }

        // Kiểm tra các mẫu cụ thể
        if (/https?:\/\/.*\.facebook\.com\/v[0-9]+\.[0-9]+\/ads/.test(url)) {
            return true;
        }
        if (/https?:\/\/.*\.fbcdn\.net\/.*(video_|vpa_|vpl_|ad_break)/.test(url)) {
            return true;
        }
        if (/https?:\/\/.*\.akamaihd\.net\/.*(fbcdn|ad_|video_ad)/.test(url)) {
            return true;
        }

        return false;
    }

    // Xử lý yêu cầu
    let url = $request.url;
    let host = $request.hostname;

    if (isAdRequest(url, host)) {
        $done({ response: { status: 403, body: '' } }); // Chặn yêu cầu
    } else {
        $done({}); // Cho phép yêu cầu
    }
})();