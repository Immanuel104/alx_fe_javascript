// Array to store quotes with their categories
let quotes = [];

// Load quotes from local storage on page load
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Initial quotes if none are in local storage
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don't let yesterday take up too much of today.", category: "Life" },
      { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
    ];
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote and store it in session storage
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Get a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Update the DOM to display the quote
  quoteDisplay.innerHTML = <p>"${randomQuote.text}" - Category: ${randomQuote.category}</p>;

  // Store the last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Display the last viewed quote if available from session storage
function displayLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const quote = JSON.parse(lastViewedQuote);
    quoteDisplay.innerHTML = <p>"${quote.text}" - Category: ${quote.category}</p>;
  }
}

// Function to add a new quote dynamically and save to local storage
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes(); // Save the updated quotes array to local storage
    
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert("New quote added successfully!");
  } else {
    alert("Please fill in both the quote and category.");
  }
}

// Function to export quotes to JSON file
function exportToJson() {
  const jsonQuotes = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON
  const blob = new Blob([jsonQuotes], { type: 'application/json' }); // Create a Blob object from the JSON
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  const link = document.createElement('a'); // Create a temporary link element
  link.href = url;
  link.download = 'quotes.json'; // Set the file name for the download
  link.click(); // Programmatically click the link to start the download
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result); // Parse the uploaded JSON file
    quotes.push(...importedQuotes); // Add the imported quotes to the existing array
    saveQuotes(); // Save the updated quotes array to local storage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]); // Read the uploaded file as text
}

// Event listeners for buttons
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJson);

// Load quotes and display the last viewed quote on page load
loadQuotes();
displayLastViewedQuote();
