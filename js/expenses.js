// =========================
// Expenses
// =========================

let expenses = [];

function addExpense(name, amount, categoryId) {
    let expense = {
        id: Date.now() + Math.random(),
        name: name,
        amount: Number(amount),
        categoryId: Number(categoryId),
        date: new Date().toISOString()
    };

    expenses.push(expense);

    saveExpenses();
}

function getTotalExpenses() {
    let total = 0;

    expenses.forEach(function (expense) {
        total += expense.amount;
    });

    return total;
}

function getExpenses() {
    return expenses;
}

function deleteExpense(id) {
    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();
}

function clearExpenses() {
    expenses = [];
    saveExpenses();
}

function getCategoryExpenses(categoryId) {
    let total = 0;

    expenses.forEach(function (expense) {
        if (expense.categoryId === Number(categoryId)) {
            total += expense.amount;
        }
    });

    return total;
}
