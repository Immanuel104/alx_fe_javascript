// Array to store quotes with their categories
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Life" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Get a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Update the DOM to display the quote
  quoteDisplay.innerHTML = <p>"${randomQuote.text}" - Category: ${randomQuote.category}</p>;
}

// Function to add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  // Check if both inputs are provided
  if (quoteText && quoteCategory) {
    // Add the new quote to the quotes array
    quotes.push({ text: quoteText, category: quoteCategory });
    
    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    alert("New quote added successfully!");
  } else {
    alert("Please fill in both the quote and category.");
  }
}

// Event listeners for the buttons
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);

// Display a quote when the page loads
showRandomQuote();
