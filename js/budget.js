// =========================
// Budget
// =========================

let budget = {
    income: 0,
    period: "monthly",
    categories: []
};

function createBudget(income, period) {
    budget.income = Number(income);
    budget.period = period;
    budget.categories = [];

    saveBudget();
}

function addCategory(name, amount) {
    let category = {
        id: Date.now() + Math.random(),
        name: name,
        amount: Number(amount)
    };

    budget.categories.push(category);

    saveBudget();
}

function getTotalBudget() {
    let total = 0;

    budget.categories.forEach(function (category) {
        total += category.amount;
    });

    return total;
}

function getRemainingIncome() {
    return budget.income - getTotalBudget();
}

function getBudgetInfo() {
    return {
        income: budget.income,
        period: budget.period,
        totalBudget: getTotalBudget(),
        remaining: getRemainingIncome(),
        categories: budget.categories
    };
}
