let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don't let yesterday take up too much of today.", category: "Life" },
      { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
    ];
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  localStorage.setItem('selectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = "${quote.text}" - Category: ${quote.category};
    quoteDisplay.appendChild(quoteElement);
  });
}

function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("New quote added successfully!");
  } else {
    alert("Please fill in both the quote and category.");
  }
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById('quoteDisplay').innerHTML = <p>"${randomQuote.text}" - Category: ${randomQuote.category}</p>;
}

function exportToJson() {
  const jsonQuotes = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonQuotes], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download =
