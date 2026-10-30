// =========================
// 1. DOM Elements
// =========================

let budgetForm = document.getElementById("budget-form");
let categoriesContainer = document.getElementById("categories-container");
let addCategoryBtn = document.getElementById("add-category-btn");
let clearBudgetBtn = document.getElementById("clear-budget-btn");

let expenseForm = document.getElementById("expense-form");
let expenseName = document.getElementById("expense-name");
let expenseAmount = document.getElementById("expense-amount");
let expenseCategory = document.getElementById("expense-category");

let incomeValue = document.getElementById("income-value");
let budgetValue = document.getElementById("budget-value");
let expensesValue = document.getElementById("expenses-value");
let remainingValue = document.getElementById("remaining-value");

let expensesList = document.getElementById("expenses-list");
let clearAllDataBtn = document.getElementById("clear-all-data-btn");
// Debt Elements
let totalDebtValue = document.getElementById("total-debt-value");
let debtsList = document.getElementById("debts-list");

let debtPaymentForm = document.getElementById("debt-payment-form");
let debtPaymentCategory = document.getElementById("debt-payment-category");
let debtPaymentAmount = document.getElementById("debt-payment-amount");

let budgetChart = null;
let categoryChart = null;


// =========================
// 2. Helpers
// =========================

function formatMoney(value) {
    return value.toLocaleString("ar-EG") + " ج.م";
}


// =========================
// 3. Category Inputs
// =========================

function createCategoryInput() {
    let categoryDiv = document.createElement("div");

    categoryDiv.className = "category-input";

    categoryDiv.innerHTML = `
        <input
            type="text"
            class="category-name"
            placeholder="اسم البند، مثل الطعام"
            required
        >

        <input
            type="number"
            class="category-amount"
            placeholder="المبلغ بالجنيه"
            min="0"
            required
        >

        <button type="button" class="remove-category-btn">
            حذف
        </button>
    `;

    categoriesContainer.appendChild(categoryDiv);
}

addCategoryBtn.addEventListener("click", function () {
    createCategoryInput();
});

categoriesContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-category-btn")) {

        let categoryInputs = categoriesContainer.querySelectorAll(".category-input");

        if (categoryInputs.length > 1) {
            event.target.parentElement.remove();
        } else {
            categoryInputs[0].querySelectorAll("input").forEach(function (input) {
                input.value = "";
            });
        }
    }
});


// =========================
// 4. Clear Budget Form
// =========================

clearBudgetBtn.addEventListener("click", function () {
    budgetForm.reset();
    categoriesContainer.innerHTML = "";
    createCategoryInput();
});


// =========================
// 5. Update Dashboard
// =========================

function updateDashboard() {

    let totalBudget = getTotalBudget();
    let totalExpenses = getTotalExpenses();
    let remaining = totalBudget - totalExpenses;

    incomeValue.textContent = formatMoney(budget.income);
    budgetValue.textContent = formatMoney(totalBudget);
    expensesValue.textContent = formatMoney(totalExpenses);
    remainingValue.textContent = formatMoney(remaining);

    renderDebts();
    renderCharts();
}


// =========================
// 6. Create Budget
// =========================

budgetForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let income = Number(document.getElementById("income").value);
    let period = document.getElementById("period").value;

    let categoryInputs = categoriesContainer.querySelectorAll(".category-input");

    let categoriesData = [];
    let total = 0;

    categoryInputs.forEach(function (categoryInput) {

        let name = categoryInput.querySelector(".category-name").value.trim();
        let amount = Number(categoryInput.querySelector(".category-amount").value);

        if (name === "") {
            return;
        }

        categoriesData.push({
            name: name,
            amount: amount
        });

        total += amount;

    });

    if (categoriesData.length === 0) {
        alert("من فضلك أضف بند واحد على الأقل.");
        return;
    }

    if (total > income) {
        alert("مجموع البنود لا يمكن أن يزيد عن إجمالي الدخل.");
        return;
    }

    createBudget(income, period);

    categoriesData.forEach(function (category) {
        addCategory(category.name, category.amount);
    });

    // ابدأ الميزانية الجديدة بدون مصروفات قديمة
    clearExpenses();

    renderCategoryOptions();
    renderExpenses();
    updateDashboard();

    alert("تم إنشاء الميزانية بنجاح!");

});


// =========================
// 7. Category Options
// =========================

function renderCategoryOptions() {

    expenseCategory.innerHTML = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "اختر البند";

    expenseCategory.appendChild(defaultOption);

    budget.categories.forEach(function (category) {

        let option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        expenseCategory.appendChild(option);

    });

}


// =========================
// Debt Display
// =========================

function renderDebts() {

    debtsList.innerHTML = "";
    debtPaymentCategory.innerHTML = '<option value="">اختر البند</option>';

    let totalDebt = getTotalDebt();

    totalDebtValue.textContent = formatMoney(totalDebt);

    let hasDebts = false;

    budget.categories.forEach(function (category) {

        let debt = getCategoryDebt(category.id);

        if (debt <= 0) {
            return;
        }

        hasDebts = true;

        // عرض الدين
        let debtItem = document.createElement("div");
        debtItem.className = "debt-item";

        let details = document.createElement("div");

        let name = document.createElement("h4");
        name.textContent = category.name;

        let description = document.createElement("p");
        description.textContent =
            "المبلغ المخصص: " + formatMoney(category.amount);

        details.appendChild(name);
        details.appendChild(description);

        let amount = document.createElement("strong");
        amount.textContent = formatMoney(debt);

        debtItem.appendChild(details);
        debtItem.appendChild(amount);

        debtsList.appendChild(debtItem);

        // إضافة البند لقائمة السداد
        let option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;

        debtPaymentCategory.appendChild(option);

    });

    if (!hasDebts) {
        let message = document.createElement("p");
        message.className = "debt-empty";
        message.textContent = "ممتاز! لا توجد ديون مستحقة حاليًا.";

        debtsList.appendChild(message);
    }
}



// =========================
// Debt Payment
// =========================

debtPaymentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let categoryId = Number(debtPaymentCategory.value);
    let amount = Number(debtPaymentAmount.value);

    if (!categoryId || amount <= 0) {
        alert("من فضلك اختر بندًا واكتب مبلغ سداد صحيحًا.");
        return;
    }

    let currentDebt = getCategoryDebt(categoryId);

    if (currentDebt <= 0) {
        alert("هذا البند ليس عليه ديون.");
        return;
    }

    if (amount > currentDebt) {
        alert("مبلغ السداد أكبر من الدين المتبقي.");
        return;
    }

    addDebtPayment(amount, categoryId);

    debtPaymentForm.reset();

    updateDashboard();

    alert("تم تسجيل السداد بنجاح!");
});

// =========================
// 8. Add Expense
// =========================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let name = expenseName.value.trim();
    let amount = Number(expenseAmount.value);
    let categoryId = Number(expenseCategory.value);

    if (budget.categories.length === 0) {
        alert("من فضلك أنشئ الميزانية أولاً.");
        return;
    }

    if (name === "" || amount <= 0) {
        alert("من فضلك اكتب اسم المصروف ومبلغاً أكبر من صفر.");
        return;
    }

    let selectedCategory = budget.categories.find(function (category) {
        return category.id === categoryId;
    });

    if (!selectedCategory) {
        alert("من فضلك اختر بنداً صحيحاً.");
        return;
    }

    addExpense(name, amount, categoryId);

    expenseForm.reset();

    renderExpenses();
    updateDashboard();

});


// =========================
// 9. Render Expenses
// =========================

function renderExpenses() {

    expensesList.innerHTML = "";

    if (expenses.length === 0) {

        let emptyMessage = document.createElement("p");
        emptyMessage.textContent = "لا توجد مصروفات بعد.";

        expensesList.appendChild(emptyMessage);

        return;
    }

    expenses.slice().reverse().forEach(function (expense) {

        let category = budget.categories.find(function (item) {
            return item.id === expense.categoryId;
        });

        let expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";

        let details = document.createElement("div");

        let name = document.createElement("h4");
        name.textContent = expense.name;

        let categoryName = document.createElement("p");
        categoryName.textContent = category ? category.name : "بند غير معروف";

        details.appendChild(name);
        details.appendChild(categoryName);

        let amount = document.createElement("strong");
        amount.textContent = formatMoney(expense.amount);

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-expense";
        deleteBtn.textContent = "حذف";
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", function () {
            deleteExpense(expense.id);
            renderExpenses();
            updateDashboard();
        });

        expenseItem.appendChild(details);
        expenseItem.appendChild(amount);
        expenseItem.appendChild(deleteBtn);

        expensesList.appendChild(expenseItem);

    });

}


// =========================
// 10. Charts
// =========================

// يعرض رسالة "لا توجد بيانات" بدل الرسم الفاضي
function setEmptyState(canvas, isEmpty) {

    let container = canvas.parentElement;
    let message = container.querySelector(".empty-chart");

    if (isEmpty) {
        canvas.style.display = "none";

        if (!message) {
            message = document.createElement("div");
            message.className = "empty-chart";
            message.textContent = "لا توجد بيانات لعرضها بعد";
            container.appendChild(message);
        }
    } else {
        canvas.style.display = "";

        if (message) {
            message.remove();
        }
    }

}

function renderCharts() {

    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        return;
    }

    let budgetCanvas = document.getElementById("budget-chart");
    let categoryCanvas = document.getElementById("category-chart");

    if (!budgetCanvas || !categoryCanvas) {
        console.error("Chart canvas elements were not found.");
        return;
    }

    Chart.defaults.font.family = "'Cairo', sans-serif";
    Chart.defaults.color = "#7b887e";

    // ---------- Chart 1: Budget vs Expenses ----------

    if (budgetChart) {
        budgetChart.destroy();
        budgetChart = null;
    }

    let hasBudget = budget.categories.length > 0;

    setEmptyState(budgetCanvas, !hasBudget);

    if (hasBudget) {

        let categoryNames = budget.categories.map(function (category) {
            return category.name;
        });

        let plannedAmounts = budget.categories.map(function (category) {
            return category.amount;
        });

        let actualAmounts = budget.categories.map(function (category) {
            return getCategoryExpenses(category.id);
        });

        budgetChart = new Chart(budgetCanvas, {

            type: "bar",

            data: {
                labels: categoryNames,

                datasets: [
                    {
                        label: "الميزانية المخططة",
                        data: plannedAmounts,
                        backgroundColor: "#668b72",
                        borderRadius: 6
                    },
                    {
                        label: "المصروف الفعلي",
                        data: actualAmounts,
                        backgroundColor: "#d65b5b",
                        borderRadius: 6
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        rtl: true,
                        labels: {
                            color: "#26352b",
                            usePointStyle: true
                        }
                    }
                },

                scales: {
                    x: {
                        ticks: { color: "#7b887e" },
                        grid: { display: false }
                    },

                    y: {
                        beginAtZero: true,
                        ticks: { color: "#7b887e" },
                        grid: { color: "#e6eae3" }
                    }
                }
            }

        });

    }

    // ---------- Chart 2: Expenses Distribution ----------

    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }

    let expenseCategories = budget.categories.filter(function (category) {
        return getCategoryExpenses(category.id) > 0;
    });

    let hasExpenses = expenseCategories.length > 0;

    setEmptyState(categoryCanvas, !hasExpenses);

    if (hasExpenses) {

        let distributionNames = expenseCategories.map(function (category) {
            return category.name;
        });

        let distributionAmounts = expenseCategories.map(function (category) {
            return getCategoryExpenses(category.id);
        });

        categoryChart = new Chart(categoryCanvas, {

            type: "doughnut",

            data: {
                labels: distributionNames,

                datasets: [
                    {
                        data: distributionAmounts,

                        backgroundColor: [
                            "#668b72",
                            "#d9a441",
                            "#d65b5b",
                            "#5b9bd6",
                            "#8e7cc3",
                            "#4d9b6a"
                        ],

                        borderWidth: 2,
                        borderColor: "#ffffff"
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom",
                        rtl: true,
                        labels: {
                            color: "#26352b",
                            usePointStyle: true
                        }
                    }
                }
            }

        });

    }

}


// =========================
// 11. Clear All Data
// =========================

clearAllDataBtn.addEventListener("click", function () {

    let confirmation = confirm(
        "هل أنت متأكد من حذف جميع البيانات؟ سيتم حذف الميزانية والمصروفات نهائيًا."
    );

    if (confirmation) {

        deleteBudget();
        clearExpenses();
        clearDebtPayments();

        budgetForm.reset();
        expenseForm.reset();

        categoriesContainer.innerHTML = "";
        createCategoryInput();

        renderCategoryOptions();
        renderExpenses();
        updateDashboard();

        alert("تم حذف جميع البيانات بنجاح.");
    }

});


// =========================
// 12. Load Saved Data
// =========================
loadBudget();
loadExpenses();
loadDebtPayments();

renderCategoryOptions();
renderExpenses();
updateDashboard();