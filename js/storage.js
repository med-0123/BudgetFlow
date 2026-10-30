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
