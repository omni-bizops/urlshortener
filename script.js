class URLShortener {
    constructor() {
        this.urls = this.loadFromStorage();
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayRecentLinks();
    }

    bindEvents() {
        const shortenBtn = document.getElementById('shortenBtn');
        const urlInput = document.getElementById('urlInput');
        const copyBtn = document.getElementById('copyBtn');
        const downloadQrBtn = document.getElementById('downloadQrBtn');

        shortenBtn.addEventListener('click', () => this.shortenURL());
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.shortenURL();
        });
        copyBtn.addEventListener('click', () => this.copyToClipboard());
        downloadQrBtn.addEventListener('click', () => this.downloadQRCode());
    }

    generateShortCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async shortenURL() {
        const urlInput = document.getElementById('urlInput');
        const originalUrl = urlInput.value.trim();
        const shortenBtn = document.getElementById('shortenBtn');
        const resultDiv = document.getElementById('result');
        const errorDiv = document.getElementById('error');

        // Hide previous results
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        // Validate URL
        if (!originalUrl) {
            this.showError('Bitte gib eine URL ein.');
            return;
        }

        if (!this.isValidURL(originalUrl)) {
            this.showError('Bitte gib eine gültige URL ein (z.B. https://www.example.com)');
            return;
        }

        // Show loading state
        shortenBtn.classList.add('loading');
        shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verkürze...';

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Generate short code
            let shortCode;
            do {
                shortCode = this.generateShortCode();
            } while (this.urls.some(url => url.shortCode === shortCode));

            // Create short URL
            const shortUrl = `${window.location.origin}${window.location.pathname}#${shortCode}`;

            // Save to storage
            const urlData = {
                originalUrl,
                shortUrl,
                shortCode,
                createdAt: new Date().toISOString(),
                clicks: 0
            };

            this.urls.unshift(urlData);
            this.saveToStorage();

            // Display result
            this.showResult(shortUrl);
            this.displayRecentLinks();

            // Clear input
            urlInput.value = '';

        } catch (error) {
            this.showError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        } finally {
            // Reset button
            shortenBtn.classList.remove('loading');
            shortenBtn.innerHTML = '<i class="fas fa-cut"></i> Verkürzen';
        }
    }

    showResult(shortUrl) {
        const resultDiv = document.getElementById('result');
        const shortUrlInput = document.getElementById('shortUrl');
        const qrCodeDiv = document.getElementById('qrCode');

        shortUrlInput.value = shortUrl;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('success-animation');

        // Generate QR Code
        qrCodeDiv.innerHTML = '';
        new QRCode(qrCodeDiv, {
            text: shortUrl,
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Remove animation class after animation completes
        setTimeout(() => {
            resultDiv.classList.remove('success-animation');
        }, 600);
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async copyToClipboard() {
        const shortUrlInput = document.getElementById('shortUrl');
        const copyBtn = document.getElementById('copyBtn');

        try {
            await navigator.clipboard.writeText(shortUrlInput.value);
            
            // Show success feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);

        } catch (err) {
            // Fallback for older browsers
            shortUrlInput.select();
            document.execCommand('copy');
            
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '#28a745';
            }, 2000);
        }
    }

    downloadQRCode() {
        const qrCodeDiv = document.getElementById('qrCode');
        const canvas = qrCodeDiv.querySelector('canvas');
        
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    }

    displayRecentLinks() {
        const recentLinksDiv = document.getElementById('recentLinks');
        
        if (this.urls.length === 0) {
            recentLinksDiv.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Noch keine Links verkürzt</p>';
            return;
        }

        const linksHTML = this.urls.slice(0, 10).map(url => `
            <div class="link-item">
                <div class="link-info">
                    <div class="original-url">${this.truncateUrl(url.originalUrl, 50)}</div>
                    <div class="short-url">${url.shortUrl}</div>
                </div>
                <div class="link-actions">
                    <button onclick="urlShortener.copyLink('${url.shortUrl}')" title="Link kopieren">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="urlShortener.deleteLink('${url.shortCode}')" title="Link löschen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        recentLinksDiv.innerHTML = linksHTML;
    }

    truncateUrl(url, maxLength) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    }

    async copyLink(shortUrl) {
        try {
            await navigator.clipboard.writeText(shortUrl);
            this.showToast('Link kopiert!');
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shortUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Link kopiert!');
        }
    }

    deleteLink(shortCode) {
        if (confirm('Möchtest du diesen Link wirklich löschen?')) {
            this.urls = this.urls.filter(url => url.shortCode !== shortCode);
            this.saveToStorage();
            this.displayRecentLinks();
            this.showToast('Link gelöscht!');
        }
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('urlShortenerData', JSON.stringify(this.urls));
    }

    loadFromStorage() {
        const data = localStorage.getItem('urlShortenerData');
        return data ? JSON.parse(data) : [];
    }

    // Handle URL redirection
    handleRedirect() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const urlData = this.urls.find(url => url.shortCode === hash);
            if (urlData) {
                // Increment click count
                urlData.clicks++;
                this.saveToStorage();
                
                // Redirect to original URL
                window.location.href = urlData.originalUrl;
            } else {
                this.showError('Link nicht gefunden oder abgelaufen.');
            }
        }
    }
}

// Initialize the app
const urlShortener = new URLShortener();

// Handle redirects on page load
document.addEventListener('DOMContentLoaded', () => {
    urlShortener.handleRedirect();
});

// Handle redirects on hash change
window.addEventListener('hashchange', () => {
    urlShortener.handleRedirect();
});

// Add some fun features
document.addEventListener('DOMContentLoaded', () => {
    // Add typing animation to subtitle
    const subtitle = document.querySelector('.subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
    
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}); 