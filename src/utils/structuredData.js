// Structured Data for CBAM Pages
export const getCBAMStructuredData = (pageType, additionalData = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CBAM Reporting System",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "description": "Professional Carbon Border Adjustment Mechanism (CBAM) reporting system for EU exports",
    "url": "https://cbam.fabus.app",
    "author": {
      "@type": "Organization",
      "name": "KREA",
      "url": "https://cbam.fabus.app"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  const pageSpecificData = {
    dashboard: {
      "@type": ["WebApplication", "SoftwareApplication"],
      "featureList": [
        "Carbon Emissions Tracking",
        "CBAM Compliance Monitoring", 
        "EU Export Reporting",
        "Multi-language Support"
      ]
    },
    aboutCBAM: {
      "@type": ["WebPage", "FAQPage"],
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is CBAM?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Carbon Border Adjustment Mechanism (CBAM) is an EU regulation to prevent carbon leakage and promote global climate action."
            }
          },
          {
            "@type": "Question", 
            "name": "Which sectors are affected by CBAM?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CBAM covers cement, iron and steel, aluminum, fertilizers, electricity, and hydrogen sectors."
            }
          }
        ]
      }
    },
    input: {
      "@type": "WebApplication",
      "potentialAction": {
        "@type": "UseAction",
        "name": "Track Carbon Emissions",
        "description": "Input and track carbon emissions data for CBAM compliance"
      }
    }
  };

  return {
    ...baseData,
    ...pageSpecificData[pageType],
    ...additionalData
  };
};

// Insert structured data into page
export const insertStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};