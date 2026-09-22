/**
 * Advertising & Monetization Configuration
 *
 * As the site owner, configure your Google AdSense or advertising network credentials here.
 * Once your Publisher ID and Slot IDs are added, real ads will be displayed to free users.
 * Subscribed users ('pro', 'business', 'enterprise') will automatically enjoy an ad-free experience.
 */

export const ADS_CONFIG = {
  // Your Google AdSense Publisher ID (e.g. 'ca-pub-1234567890123456')
  // Get this from: https://www.google.com/adsense/ -> Account -> Settings -> Account info
  adClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',

  // Individual Ad Unit Slot IDs created in your Google AdSense Dashboard:
  // (AdSense -> Ads -> By ad unit -> Display ads)
  slots: {
    leftSkyscraper: process.env.NEXT_PUBLIC_ADS_SLOT_LEFT || '',
    rightSkyscraper: process.env.NEXT_PUBLIC_ADS_SLOT_RIGHT || '',
    bottomLeaderboard: process.env.NEXT_PUBLIC_ADS_SLOT_BOTTOM || '',
  },

  // Toggle ads globally (true = enabled, false = disabled)
  enabled: true,
};
