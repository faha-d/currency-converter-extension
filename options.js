const currencies = [
  "USD","EUR","INR","GBP","JPY",
  "AUD","CAD","CHF","CNY","NZD"
];

const select = document.getElementById("defaultBase");

currencies.forEach(currency => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  select.appendChild(option);
});

// Load saved setting
chrome.storage.sync.get(["defaultBase"], result => {
  if (result.defaultBase) {
    select.value = result.defaultBase;
  }
});

// Save setting
document.getElementById("saveBtn")
  .addEventListener("click", () => {
    chrome.storage.sync.set({
      defaultBase: select.value
    });
    alert("Saved!");
});