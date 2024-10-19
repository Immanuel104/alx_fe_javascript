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

// Fetch quotes from a simulated server
function fetchQuotesFromServer() {
  return fetch('https://jsonplaceholder.typicode.com/posts') // Example server endpoint
    .then(response => response.json())
    .then(serverQuotes => {
      return serverQuotes.map(quote => ({
        text: quote.title,
        category: "Fetched",
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
