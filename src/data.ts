export type Trend = 'up' | 'down' | 'stable';
export type RiskLevel = 'low' | 'medium' | 'high';

export const apps = [
  {
    name: 'AI Subscription',
    category: 'Productivity',
    iconType: 'subscription-grid',
    regions: [
      { regionCode: 'US', regionName: 'United States', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'USD', trend: 'stable' as Trend, updatedAtLabel: 'Updated just now', riskLevel: 'low' as RiskLevel },
      { regionCode: 'JP', regionName: 'Japan', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'JPY', trend: 'down' as Trend, updatedAtLabel: 'Updated 2m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'TR', regionName: 'Türkiye', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'TRY', trend: 'down' as Trend, updatedAtLabel: 'Updated 5m ago', riskLevel: 'medium' as RiskLevel },
      { regionCode: 'BR', regionName: 'Brazil', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'BRL', trend: 'up' as Trend, updatedAtLabel: 'Updated 7m ago', riskLevel: 'medium' as RiskLevel },
      { regionCode: 'IN', regionName: 'India', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'INR', trend: 'stable' as Trend, updatedAtLabel: 'Updated 9m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'GB', regionName: 'United Kingdom', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'GBP', trend: 'stable' as Trend, updatedAtLabel: 'Updated 11m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'CA', regionName: 'Canada', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'CAD', trend: 'stable' as Trend, updatedAtLabel: 'Updated 13m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'DE', regionName: 'Germany', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'EUR', trend: 'up' as Trend, updatedAtLabel: 'Updated 15m ago', riskLevel: 'medium' as RiskLevel },
      { regionCode: 'KR', regionName: 'South Korea', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'KRW', trend: 'down' as Trend, updatedAtLabel: 'Updated 17m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'AU', regionName: 'Australia', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'AUD', trend: 'stable' as Trend, updatedAtLabel: 'Updated 19m ago', riskLevel: 'low' as RiskLevel },
      { regionCode: 'SG', regionName: 'Singapore', localPriceLabel: 'Sample price', convertedPriceValue: 0, currency: 'SGD', trend: 'down' as Trend, updatedAtLabel: 'Updated 21m ago', riskLevel: 'low' as RiskLevel },
    ],
  },
];

export const history = [42, 40, 41, 37, 34, 36, 33, 35, 31, 32, 29, 30].map((value, index) => ({ date: `M${index + 1}`, value }));

export const rankings = [
  { rank: 1, regionName: 'Japan', categoryAdvantage: 'Stable billing', advantageLabel: 'Best value' },
  { rank: 2, regionName: 'Singapore', categoryAdvantage: 'Fast updates', advantageLabel: 'Clean signal' },
  { rank: 3, regionName: 'India', categoryAdvantage: 'Lower entry', advantageLabel: 'Good option' },
  { rank: 4, regionName: 'South Korea', categoryAdvantage: 'Trend dip', advantageLabel: 'Watch list' },
  { rank: 5, regionName: 'Türkiye', categoryAdvantage: 'Flexible plan', advantageLabel: 'Risk check' },
];

export const aiRecommendation = {
  appName: 'AI Subscription',
  recommendedRegion: 'Japan',
  reasons: ['Price advantage', 'Historical trend', 'Risk reminder'],
};

export const subtitles = [
  { start: 0, end: 90, text: '你以为订阅价格是固定的？其实完全不是。' },
  { start: 90, end: 180, text: '但大多数人，只看到一个价格。' },
  { start: 180, end: 300, text: '全球 App Store 订阅价格，一屏对比。' },
  { start: 300, end: 390, text: '每次打开，都是新的地区信号。' },
  { start: 390, end: 480, text: '不只看现在，还能看到过去。' },
  { start: 480, end: 600, text: '不同国家，也有不同订阅优势。' },
  { start: 600, end: 690, text: 'AI 给出购买前的判断依据。' },
  { start: 690, end: 780, text: '同一个订阅，你可能一直买贵了。' },
  { start: 780, end: 900, text: '查一下你正在用的订阅。app-card-price.tnt-pub.com' },
];
