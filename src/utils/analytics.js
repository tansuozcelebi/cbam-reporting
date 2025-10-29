// Google Analytics 4 (GA4) Integration
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 tracking ID

// Page view tracking
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track CBAM specific events
export const trackCBAMEvent = (eventName, data = {}) => {
  event({
    action: eventName,
    category: 'CBAM',
    label: data.label || '',
    value: data.value || 0,
  });
};

// Track form submissions
export const trackFormSubmission = (formType) => {
  trackCBAMEvent('form_submission', { label: formType });
};

// Track report downloads
export const trackReportDownload = (reportType) => {
  trackCBAMEvent('report_download', { label: reportType });
};

// Track page engagement
export const trackPageEngagement = (page, timeSpent) => {
  trackCBAMEvent('page_engagement', { 
    label: page, 
    value: timeSpent 
  });
};