// Sidebar state
let isCollapsed = false;
let chats = [];

// Toggle sidebar 
toggleBtn.addEventListener('click', () => {
  isCollapsed = !isCollapsed;
  if (isCollapsed) {
    // Slide sidebar out
    sidebar.classList.add('sidebar-collapsed');
    // Move toggle button to the left
    toggleBtn.style.left = '0px';
    // Change icon to chevron_right
    toggleBtn.querySelector('.material-icons').textContent = 'chevron_right';
    // Expand chat fully
    chatWindow.classList.remove('ml-[250px]');
    chatWindow.classList.add('ml-0');
  } else {
    // Slide sidebar back
    sidebar.classList.remove('sidebar-collapsed');
    // Move toggle button near the sidebar
    toggleBtn.style.left = '210px';
    // Change icon to chevron_left
    toggleBtn.querySelector('.material-icons').textContent = 'chevron_left';
    // Restore chat margin
    chatWindow.classList.remove('ml-0');
    chatWindow.classList.add('ml-[250px]');
  }
});

// Filter chat history
searchInput.addEventListener('input', () => {
  filterChatHistory(searchInput.value);
});

function filterChatHistory(searchTerm) {
  const filtered = searchTerm
    ? chats.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : chats;
  historyList.innerHTML = '';
  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state', 'text-center', 'text-gray-500', 'mt-10');
    emptyState.textContent = searchTerm
      ? 'No matching chats found'
      : 'No chat history available';
    historyList.appendChild(emptyState);
    return;
  }
  filtered.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.classList.add(
      'border-b',
      'border-gray-200',
      'py-2',
      'cursor-pointer',
      'hover:bg-gray-100',
      'transition-all'
    );
    chatItem.textContent = chat.title;
    chatItem.dataset.id = chat.id;
    chatItem.addEventListener('click', () => loadChat(chat.id));
    historyList.appendChild(chatItem);
  });
}

function updateChatHistoryUI() {
  historyList.innerHTML = '';
  if (chats.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state', 'text-center', 'text-gray-500', 'mt-10');
    emptyState.textContent = 'No chat history available';
    historyList.appendChild(emptyState);
    return;
  }
  chats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.classList.add(
      'border-b',
      'border-gray-200',
      'py-2',
      'cursor-pointer',
      'hover:bg-gray-100',
      'transition-all'
    );
    chatItem.textContent = chat.title;
    chatItem.dataset.id = chat.id;
    chatItem.addEventListener('click', () => loadChat(chat.id));
    historyList.appendChild(chatItem);
  });
}

function addChatToHistory(firstMessage) {
  const chatId = Date.now().toString();
  const newChat = {
    id: chatId,
    title: firstMessage.length > 25
      ? firstMessage.substring(0, 25) + '...'
      : firstMessage,
    timestamp: new Date()
  };
  chats.unshift(newChat);
  updateChatHistoryUI();
}
