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


// =========================
// Debts and Payments
// =========================

let debtPayments = [];

// تسجيل عملية سداد
function addDebtPayment(amount, categoryId) {
    let payment = {
        id: Date.now() + Math.random(),
        amount: Number(amount),
        categoryId: Number(categoryId),
        date: new Date().toISOString()
    };

    debtPayments.push(payment);
    saveDebtPayments();
}

// إجمالي ما تم سداده لبند معين
function getCategoryPayments(categoryId) {
    let total = 0;

    debtPayments.forEach(function (payment) {
        if (payment.categoryId === Number(categoryId)) {
            total += payment.amount;
        }
    });

    return total;
}

// الدين المتبقي لبند معين
function getCategoryDebt(categoryId) {
    let category = budget.categories.find(function (item) {
        return item.id === Number(categoryId);
    });

    if (!category) {
        return 0;
    }

    let debt = getCategoryExpenses(categoryId) - category.amount;
    let paid = getCategoryPayments(categoryId);

    return Math.max(0, debt - paid);
}

// إجمالي الديون
function getTotalDebt() {
    let total = 0;

    budget.categories.forEach(function (category) {
        total += getCategoryDebt(category.id);
    });

    return total;
}

// مسح عمليات السداد
function clearDebtPayments() {
    debtPayments = [];
    saveDebtPayments();
}

