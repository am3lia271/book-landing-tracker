document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('book-form');
    const tableBody = document.getElementById('book-table-body');
    const totalLoansEl = document.getElementById('total-loans');
    const overdueLoansEl = document.getElementById('overdue-loans');

    let books = JSON.parse(localStorage.getItem('books')) || [];

    function saveAndRender() {
        localStorage.setItem('books', JSON.stringify(books));
        render();
    }

    function render() {
        tableBody.innerHTML = '';
        let total = books.length;
        let overdueCount = 0;
        const today = new Date().toISOString().split('T')[0];

        books.forEach((book, index) => {
            const isOverdue = book.dueDate < today && book.status !== 'Returned';
            if (isOverdue) overdueCount++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-3 font-medium text-gray-900">${escapeHtml(book.title)}</td>
                <td class="p-3 text-gray-600">${escapeHtml(book.author)}</td>
                <td class="p-3 text-gray-600">${escapeHtml(book.borrower)}</td>
                <td class="p-3 text-gray-600">${book.dueDate}</td>
                <td class="p-3 text-gray-600">${escapeHtml(book.genre)}</td>
                <td class="p-3">
                    <span class="px-2 py-1 rounded text-xs font-semibold ${
                        book.status === 'Returned' ? 'bg-green-100 text-green-800' :
                        isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }">
                        ${book.status === 'Returned' ? 'Returned' : (isOverdue ? 'Overdue' : 'Active')}
                    </span>
                </td>
                <td class="p-3 space-x-2">
                    <button onclick="toggleStatus(${index})" class="text-indigo-600 hover:underline text-xs font-medium">Toggle Status</button>
                    <button onclick="deleteBook(${index})" class="text-red-600 hover:underline text-xs font-medium">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        totalLoansEl.textContent = total;
        overdueLoansEl.textContent = overdueCount;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            borrower: document.getElementById('borrower').value,
            dueDate: document.getElementById('dueDate').value,
            genre: document.getElementById('genre').value,
            status: 'Active'
        };

        books.push(newBook);
        form.reset();
        saveAndRender();
    });

    window.toggleStatus = function(index) {
        books[index].status = books[index].status === 'Returned' ? 'Active' : 'Returned';
        saveAndRender();
    }

    window.deleteBook = function(index) {
        books.splice(index, 1);
        saveAndRender();
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    render();
});
