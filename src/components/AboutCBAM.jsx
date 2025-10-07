import React, { useContext } from 'react';
import { BookOpen, ExternalLink, Calendar, Target, Building2, Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { AppContext } from '../App';

const AboutCBAM = () => {
  const { t } = useContext(AppContext);

  const sectionStyle = "mb-8 bg-white rounded-lg shadow-sm p-6";
  const titleStyle = "text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2";
  const subtitleStyle = "text-xl font-semibold text-gray-700 mb-3 mt-6";
  const paragraphStyle = "text-gray-600 mb-4 leading-relaxed";
  const listStyle = "list-disc list-inside text-gray-600 mb-4 space-y-2";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <BookOpen className="text-blue-600" size={32} />
          <div className="flex flex-col">
            <span>About Carbon Border Adjustment Mechanism (CBAM)</span>
            <span className="text-2xl text-gray-600 font-medium">Reporting for EU Exports</span>
          </div>
        </h1>
        <p className="text-gray-600 mb-8 text-sm">{t.aboutCBAMDescription}</p>
      </div>

      {/* Section 1: What is CBAM */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <Target className="text-green-600" size={24} />
          {t.whatIsCBAM}
        </h2>
        <p className={paragraphStyle}>
          {t.cbamDefinition}
        </p>
        <p className={paragraphStyle}>
          {t.cbamPurpose}
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800 mb-2">{t.keyObjectives}</h3>
          <ul className={listStyle}>
            <li>{t.objective1}</li>
            <li>{t.objective2}</li>
            <li>{t.objective3}</li>
          </ul>
        </div>
      </div>

      {/* Section 2: Covered Sectors */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <Building2 className="text-orange-600" size={24} />
          {t.coveredSectors}
        </h2>
        <p className={paragraphStyle}>
          {t.sectorsIntro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">{t.initialSectors}</h4>
            <ul className={listStyle}>
              <li>{t.sector1}</li>
              <li>{t.sector2}</li>
              <li>{t.sector3}</li>
              <li>{t.sector4}</li>
              <li>{t.sector5}</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">{t.plannedExpansion}</h4>
            <ul className={listStyle}>
              <li>{t.expansion1}</li>
              <li>{t.expansion2}</li>
              <li>{t.expansion3}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: How CBAM Works */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <Leaf className="text-green-600" size={24} />
          {t.howCBAMWorks}
        </h2>
        <p className={paragraphStyle}>
          {t.cbamMechanism}
        </p>
        
        <h3 className={subtitleStyle}>{t.cbamCertificates}</h3>
        <p className={paragraphStyle}>
          {t.certificatesExplanation}
        </p>

        <h3 className={subtitleStyle}>{t.carbonContent}</h3>
        <p className={paragraphStyle}>
          {t.carbonContentExplanation}
        </p>

        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            {t.importantNote}
          </h4>
          <p className="text-yellow-700">{t.priceCalculation}</p>
        </div>
      </div>

      {/* Section 4: Implementation Timeline */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <Calendar className="text-purple-600" size={24} />
          {t.implementationTimeline}
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold text-gray-800">{t.transitionalPeriod}</h4>
              <p className="text-gray-600">{t.transitionalDetails}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold text-gray-800">{t.fullImplementation}</h4>
              <p className="text-gray-600">{t.fullImplementationDetails}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold text-gray-800">{t.futureExpansion}</h4>
              <p className="text-gray-600">{t.futureExpansionDetails}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Reporting Requirements */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <CheckCircle className="text-blue-600" size={24} />
          {t.reportingRequirements}
        </h2>
        <p className={paragraphStyle}>
          {t.reportingIntro}
        </p>
        
        <h3 className={subtitleStyle}>{t.requiredInformation}</h3>
        <ul className={listStyle}>
          <li>{t.requirement1}</li>
          <li>{t.requirement2}</li>
          <li>{t.requirement3}</li>
          <li>{t.requirement4}</li>
          <li>{t.requirement5}</li>
        </ul>

        <h3 className={subtitleStyle}>{t.reportingFrequency}</h3>
        <p className={paragraphStyle}>
          {t.frequencyDetails}
        </p>
      </div>

      {/* Section 6: Climate Goals */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <Target className="text-green-600" size={24} />
          {t.climateGoals}
        </h2>
        <p className={paragraphStyle}>
          {t.climateGoalsIntro}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="font-bold text-2xl text-green-600">55%</h4>
            <p className="text-gray-700">{t.emissionReduction2030}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="font-bold text-2xl text-blue-600">2050</h4>
            <p className="text-gray-700">{t.climatNeutrality}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="font-bold text-2xl text-purple-600">€1T</h4>
            <p className="text-gray-700">{t.greenDealInvestment}</p>
          </div>
        </div>
      </div>

      {/* Section 7: References */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>
          <ExternalLink className="text-gray-600" size={24} />
          {t.references}
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800">{t.officialEULegislation}</h4>
            <a 
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R0956" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {t.cbamRegulation}
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-800">{t.euCommissionCBAM}</h4>
            <a 
              href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {t.commissionWebsite}
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-800">{t.europeanGreenDeal}</h4>
            <a 
              href="https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {t.greenDealWebsite}
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-gray-800">{t.etsInformation}</h4>
            <a 
              href="https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets_en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {t.etsWebsite}
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-gray-800">{t.academicResources}</h4>
            <a 
              href="https://en.wikipedia.org/wiki/Carbon_border_adjustment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {t.wikipediaCBAM}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">{t.disclaimerTitle}</h4>
        <p className="text-gray-600 text-sm">{t.disclaimerText}</p>
      </div>
    </div>
  );
};

export default AboutCBAM;