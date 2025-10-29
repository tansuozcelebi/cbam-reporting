import { useEffect } from 'react';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image = 'https://cbam.fabus.app/krea-logo.jpg',
  url 
}) => {
  // Get current path from window location instead of useLocation
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  };

  const currentUrl = url || `https://cbam.fabus.app${getCurrentPath()}`;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | CBAM Reporting System | KREA`;
    }

    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (ogTitle && title) {
      ogTitle.setAttribute('content', `${title} | CBAM Reporting System | KREA`);
    }
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description);
    }
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    }
    if (ogImage) {
      ogImage.setAttribute('content', image);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    const twitterImage = document.querySelector('meta[property="twitter:image"]');

    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', `${title} | CBAM Reporting System | KREA`);
    }
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description);
    }
    if (twitterUrl) {
      twitterUrl.setAttribute('content', currentUrl);
    }
    if (twitterImage) {
      twitterImage.setAttribute('content', image);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    }

  }, [title, description, keywords, image, currentUrl]);

  return null;
};

export default SEOHead;