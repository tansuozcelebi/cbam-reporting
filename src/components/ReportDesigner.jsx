import React, { useState, useRef } from 'react';
import { Download, Mail, X, Settings, Palette, Type, Image as ImageIcon, BarChart3 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';

const ReportDesigner = ({ isOpen, onClose, data, t }) => {
  const [reportConfig, setReportConfig] = useState({
    title: 'CBAM Carbon Footprint Report',
    includeLogo: true,
    includeCharts: true,
    includeDetails: true,
    includeMonthlyBreakdown: true,
    colorScheme: 'teal',
    fontSize: 'medium',
    layout: 'portrait'
  });

  const [emailConfig, setEmailConfig] = useState({
    recipientEmail: '',
    subject: 'CBAM Carbon Footprint Report',
    message: 'Please find attached your CBAM carbon footprint report.',
    sendCopy: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const reportRef = useRef();

  const colorSchemes = {
    teal: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' },
    blue: { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa' },
    green: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80' },
    red: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' }
  };

  const fontSizes = {
    small: { title: '18px', heading: '14px', body: '11px' },
    medium: { title: '24px', heading: '16px', body: '12px' },
    large: { title: '30px', heading: '18px', body: '14px' }
  };

  const generatePreview = () => {
    const scheme = colorSchemes[reportConfig.colorScheme];
    const fonts = fontSizes[reportConfig.fontSize];

    return (
      <div 
        ref={reportRef}
        className="bg-white p-8 max-w-4xl mx-auto"
        style={{ 
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          lineHeight: '1.5',
          fontSize: fonts.body
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          {reportConfig.includeLogo && (
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 100 100">
                <path d="M20 20 L20 80 Q20 85 25 85 L30 85 Q35 85 35 80 L35 40 Q35 35 40 35 L45 35" 
                      stroke={scheme.primary} strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M30 20 L30 80 Q30 85 35 85 L40 85 Q45 85 45 80 L45 40 Q45 35 50 35 L55 35" 
                      stroke={scheme.primary} strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M40 20 L40 80 Q40 85 45 85 L50 85 Q55 85 55 80 L55 40 Q55 35 60 35 L65 35" 
                      stroke={scheme.primary} strokeWidth="6" fill="none" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="font-bold" style={{ fontSize: fonts.heading, color: scheme.primary }}>KREA</div>
                <div style={{ fontSize: fonts.body, color: '#6b7280' }}>Carbon Footprint Analysis</div>
              </div>
            </div>
          )}
          <div className="text-right">
            <h1 className="font-bold" style={{ fontSize: fonts.title, color: scheme.primary }}>
              {reportConfig.title}
            </h1>
            <p style={{ fontSize: fonts.body, color: '#6b7280', marginTop: '4px' }}>
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="font-bold mb-4" style={{ fontSize: fonts.heading, color: scheme.secondary }}>
            Executive Summary
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 rounded" style={{ backgroundColor: scheme.primary + '10' }}>
              <div className="font-bold" style={{ fontSize: fonts.heading, color: scheme.primary }}>
                {data.totalEmissions?.toFixed(2) || '0.00'}
              </div>
              <div style={{ fontSize: fonts.body, color: '#6b7280' }}>Total Emissions (tCO₂e)</div>
            </div>
            <div className="text-center p-4 rounded" style={{ backgroundColor: scheme.secondary + '10' }}>
              <div className="font-bold" style={{ fontSize: fonts.heading, color: scheme.secondary }}>
                {data.mainCategory?.name || 'N/A'}
              </div>
              <div style={{ fontSize: fonts.body, color: '#6b7280' }}>Main Category</div>
            </div>
            <div className="text-center p-4 rounded" style={{ backgroundColor: scheme.accent + '10' }}>
              <div className="font-bold" style={{ fontSize: fonts.heading, color: scheme.accent }}>
                {data.totalEntries || '0'}
              </div>
              <div style={{ fontSize: fonts.body, color: '#6b7280' }}>Data Points</div>
            </div>
          </div>
        </div>

        {/* Scope Analysis */}
        {reportConfig.includeDetails && (
          <div className="mb-8">
            <h2 className="font-bold mb-4" style={{ fontSize: fonts.heading, color: scheme.secondary }}>
              Scope Analysis
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.primary }}></div>
                  <span className="font-medium" style={{ fontSize: fonts.body }}>Scope 1</span>
                </div>
                <div className="font-bold" style={{ fontSize: fonts.heading }}>{data.scope1Emissions?.toFixed(2) || '0.00'} tCO₂e</div>
                <div style={{ fontSize: fonts.body, color: '#6b7280' }}>({data.scope1Percentage || '0'}%)</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.secondary }}></div>
                  <span className="font-medium" style={{ fontSize: fonts.body }}>Scope 2</span>
                </div>
                <div className="font-bold" style={{ fontSize: fonts.heading }}>{data.scope2Emissions?.toFixed(2) || '0.00'} tCO₂e</div>
                <div style={{ fontSize: fonts.body, color: '#6b7280' }}>({data.scope2Percentage || '0'}%)</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.accent }}></div>
                  <span className="font-medium" style={{ fontSize: fonts.body }}>Scope 3</span>
                </div>
                <div className="font-bold" style={{ fontSize: fonts.heading }}>{data.scope3Emissions?.toFixed(2) || '0.00'} tCO₂e</div>
                <div style={{ fontSize: fonts.body, color: '#6b7280' }}>({data.scope3Percentage || '0'}%)</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {reportConfig.includeDetails && (
          <div className="mb-8">
            <h2 className="font-bold mb-4" style={{ fontSize: fonts.heading, color: scheme.secondary }}>
              Category Breakdown
            </h2>
            <div className="space-y-3">
              {data.categoryEmissions?.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span style={{ fontSize: fonts.body }}>{cat.name}</span>
                  <span className="font-medium" style={{ fontSize: fonts.body }}>{cat.fullValue} tCO₂e</span>
                </div>
              )) || <div style={{ fontSize: fonts.body }}>No category data available</div>}
            </div>
          </div>
        )}

        {/* Monthly Breakdown Table */}
        {reportConfig.includeMonthlyBreakdown && (
          <div className="mb-8">
            <h2 className="font-bold mb-4" style={{ fontSize: fonts.heading, color: scheme.secondary }}>
              Monthly Emissions Breakdown
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead style={{ backgroundColor: scheme.primary + '10' }}>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left" style={{ fontSize: fonts.body }}>Month</th>
                  <th className="border border-gray-300 px-4 py-2 text-right" style={{ fontSize: fonts.body }}>Emissions (tCO₂e)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right" style={{ fontSize: fonts.body }}>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyData?.map((month, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-4 py-2" style={{ fontSize: fonts.body }}>{month.month}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right" style={{ fontSize: fonts.body }}>{month.emissions}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right" style={{ fontSize: fonts.body }}>
                      {data.totalEmissions > 0 ? ((parseFloat(month.emissions) / data.totalEmissions) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                )) || <tr><td colSpan="3" className="border border-gray-300 px-4 py-2 text-center" style={{ fontSize: fonts.body }}>No monthly data available</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center" style={{ fontSize: fonts.body, color: '#6b7280' }}>
          <p>This report was generated by KREA CBAM Reporting Tool</p>
          <p>For more information, visit www.krea.com</p>
        </div>
      </div>
    );
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: reportConfig.layout,
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = reportConfig.layout === 'portrait' ? 210 : 297;
      const pageHeight = reportConfig.layout === 'portrait' ? 297 : 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`CBAM_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!emailConfig.recipientEmail) {
      alert('Please enter recipient email address');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate PDF first
      const element = reportRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: reportConfig.layout,
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = reportConfig.layout === 'portrait' ? 210 : 297;
      const pageHeight = reportConfig.layout === 'portrait' ? 297 : 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Convert PDF to base64
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      // Email configuration (you'll need to set up EmailJS service)
      const templateParams = {
        to_email: emailConfig.recipientEmail,
        subject: emailConfig.subject,
        message: emailConfig.message,
        attachment: pdfBase64,
        from_name: 'KREA CBAM Reporting'
      };

      // Note: You'll need to configure EmailJS with your service ID, template ID, and user ID
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID');

      alert('Email would be sent (EmailJS configuration needed)');
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Report Designer</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar - Configuration */}
          <div className="w-80 p-6 border-r bg-gray-50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings size={18} />
              Report Configuration
            </h3>

            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportConfig.title}
                  onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Layout</label>
                <select
                  value={reportConfig.layout}
                  onChange={(e) => setReportConfig({...reportConfig, layout: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Palette size={16} />
                  Color Scheme
                </label>
                <select
                  value={reportConfig.colorScheme}
                  onChange={(e) => setReportConfig({...reportConfig, colorScheme: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="teal">Teal</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Type size={16} />
                  Font Size
                </label>
                <select
                  value={reportConfig.fontSize}
                  onChange={(e) => setReportConfig({...reportConfig, fontSize: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Include Options */}
            <h4 className="font-medium mt-6 mb-3">Include in Report</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeLogo}
                  onChange={(e) => setReportConfig({...reportConfig, includeLogo: e.target.checked})}
                />
                <ImageIcon size={16} />
                <span className="text-sm">Company Logo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
                />
                <BarChart3 size={16} />
                <span className="text-sm">Charts & Graphs</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({...reportConfig, includeDetails: e.target.checked})}
                />
                <span className="text-sm">Detailed Analysis</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeMonthlyBreakdown}
                  onChange={(e) => setReportConfig({...reportConfig, includeMonthlyBreakdown: e.target.checked})}
                />
                <span className="text-sm">Monthly Breakdown</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download size={18} />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send via Email
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-6 bg-gray-100">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[70vh]">
              {generatePreview()}
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail size={18} />
                Send Report via Email
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient Email *</label>
                  <input
                    type="email"
                    value={emailConfig.recipientEmail}
                    onChange={(e) => setEmailConfig({...emailConfig, recipientEmail: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailConfig.subject}
                    onChange={(e) => setEmailConfig({...emailConfig, subject: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    value={emailConfig.message}
                    onChange={(e) => setEmailConfig({...emailConfig, message: e.target.value})}
                    className="w-full p-2 border rounded-lg h-20 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  {isGenerating ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDesigner;