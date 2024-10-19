let quotes = [];

// Load initial quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add a new quote (from the user interface)
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory,
      id: Date.now() // Unique ID based on timestamp
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes(); // Reapply filters to show the new quote
  }
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = "${randomQuote.text}" - ${randomQuote.category};
}

// Populate the category dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Unique categories
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  // Update the quote display (this example just shows the first matching quote)
  if (filteredQuotes.length > 0) {
    document.getElementById('quoteDisplay').innerText = "${filteredQuotes[0].text}" - ${filteredQuotes[0].category};
  } else {
    document.getElementById('quoteDisplay').innerText = "No quotes available for this category.";
  }
}

// Syncing with Server (New Feature)
function fetchQuotesFromServer() {
  return fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(serverQuotes => {
      return serverQuotes.map(quote => ({
        text: quote.title,
        category: "Fetched", // Example category for server quotes
        id: quote.id
      }));
    });
}

// Sync local and server quotes, resolving conflicts
function syncWithServerQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  let conflicts = [];

  const mergedQuotes = serverQuotes.map(serverQuote => {
    const localMatch = localQuotes.find(localQuote => localQuote.id === serverQuote.id);
    
    if (localMatch && localMatch.text !== serverQuote.text) {
      conflicts.push({ local: localMatch, server: serverQuote });
    }
    return serverQuote;
  }).concat(localQuotes.filter(localQuote => {
    return !serverQuotes.some(serverQuote => serverQuote.id === localQuote.id);
  }));

  if (conflicts.length > 0) {
    notifyUserOfConflicts(conflicts);
  }

  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  populateCategories();
  filterQuotes();
}

// Notify users of conflicts
function notifyUserOfConflicts(conflicts) {
  const conflictMessage = conflicts.map(conflict => `
    Conflict for quote ID ${conflict.local.id}:
    Local: "${conflict.local.text}"
    Server: "${conflict.server.text}"
  `).join('\n');
  
  alert(Conflict detected:\n${conflictMessage}\nServer data was used to resolve conflicts.);
}

// Periodic syncing with server
setInterval(() => {
  fetchQuotesFromServer().then(serverQuotes => {
    syncWithServerQuotes(serverQuotes);
  });
}, 30000); // Sync every 30 seconds

// Initialize the app
loadQuotes();
populateCategories();
filterQuotes();
