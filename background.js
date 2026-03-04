const API_KEY = "d4967305c2e36fe3af325389";
const CACHE_DURATION = 60 * 60 * 1000; 

async function fetchRates(baseCurrency) {
  const currentDate = Date.now();

  const storage = await chrome.storage.local.get([baseCurrency]);
  const cachedData = storage[baseCurrency];

  if (cachedData && currentDate - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.rates;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`,
    );

    const data = await response.json();

    if (data.result === "success") {
      const rates = data.conversion_rates;

      await chrome.storage.local.set({
        [baseCurrency]: {
          rates,
          timestamp: currentDate,
        },
      });

      return rates;
    } else {
      throw new Error("API returned failure");
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_RATES") {
    fetchRates(request.base)
      .then((rates) => sendResponse({ success: true, rates }))
      .catch((error) => sendResponse({ success: false }));

    return true;
  }
});
