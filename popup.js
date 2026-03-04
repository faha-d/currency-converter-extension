const currencies = [
  "USD",
  "EUR",
  "INR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "NZD",
];

const baseSelect = document.getElementById("baseCurrency");
const currencyList = document.getElementById("currencyList");
const resultsDiv = document.getElementById("results");

// Populate base dropdown
currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  baseSelect.appendChild(option);
});

// Populate target checkboxes
currencies.forEach((currency) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <label>
      <input type="checkbox" value="${currency}" />
      ${currency}
    </label>
  `;
  currencyList.appendChild(div);
});

document.getElementById("convertBtn").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);

  const base = baseSelect.value;

  const selected = [
    ...document.querySelectorAll("input[type='checkbox']:checked"),
  ].map((cb) => cb.value);

  if (!amount || selected.length === 0) {
    alert("Enter amount and select currencies");
    return;
  }

  chrome.runtime.sendMessage({ type: "GET_RATES", base }, (response) => {
    if (!response.success) {
      resultsDiv.innerHTML = "Error fetching rates";
      return;
    }

    const rates = response.rates;
    resultsDiv.innerHTML = "";

    selected.forEach((currency) => {
      if (rates[currency]) {
        const converted = (amount * rates[currency]).toFixed(2);

        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
      <span>${currency}</span>
      <span>${converted}</span>
    `;

        resultsDiv.appendChild(card);
      }
    });
  });
});
