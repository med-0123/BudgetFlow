// =========================
// Storage (localStorage)
// =========================

function saveBudget() {
    localStorage.setItem("budget", JSON.stringify(budget));
}

function loadBudget() {
    let savedBudget = localStorage.getItem("budget");

    if (savedBudget) {
        budget = JSON.parse(savedBudget);
    }
}

function deleteBudget() {
    localStorage.removeItem("budget");

    budget = {
        income: 0,
        period: "monthly",
        categories: []
    };
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
    let savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
}



// =========================
// Debt Payments Storage
// =========================

function saveDebtPayments() {
    localStorage.setItem("debtPayments", JSON.stringify(debtPayments));
}

function loadDebtPayments() {
    let savedPayments = localStorage.getItem("debtPayments");

    if (savedPayments) {
        debtPayments = JSON.parse(savedPayments);
    }
}
