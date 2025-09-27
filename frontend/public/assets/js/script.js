/* 
Name                 : CuraPanel - Free Tailwind CSS Healthcare Admin Dashboard Template
Author               : TemplateRise
Url                  : https://www.templaterise.com/template/curapanel-free-tailwind-css-healthcare-admin-dashboard-template 
*/


// Initialize Lucide icons
lucide.createIcons();

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  const theme = html.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// Sidebar toggle functionality
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");

function toggleSidebar() {
  sidebar.classList.toggle("active");
  sidebarOverlay.classList.toggle("active");
}

if(sidebarToggle && sidebarClose && sidebarOverlay){
  sidebarToggle.addEventListener("click", toggleSidebar);
  sidebarClose.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", toggleSidebar);
}


// Notification dropdown functionality
const notificationBtn = document.getElementById("notification-btn");
const notificationDropdown = document.getElementById("notification-dropdown");

if (notificationBtn) {
  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle("hidden");
    settingsDropdown.classList.add("hidden");
  });
}

// Settings dropdown functionality
const settingsBtn = document.getElementById("settings-btn");
const settingsDropdown = document.getElementById("settings-dropdown");
if (settingsBtn) {
  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsDropdown.classList.toggle("hidden");
    notificationDropdown.classList.add("hidden");
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (
    !notificationBtn.contains(e.target) &&
    !notificationDropdown.contains(e.target)
  ) {
    notificationDropdown.classList.add("hidden");
  }
  if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
    settingsDropdown.classList.add("hidden");
  }
});

// Mobile search functionality
const mobileSearchBtn = document.getElementById("mobile-search-btn");
const mobileSearchContainer = document.getElementById("mobile-search-container");

if (mobileSearchBtn && mobileSearchContainer) {
  // Toggle on button click
  mobileSearchBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent immediate outside click
    mobileSearchContainer.classList.toggle("hidden");
  });

  // Hide when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileSearchContainer.contains(e.target) &&
      !mobileSearchBtn.contains(e.target)
    ) {
      mobileSearchContainer.classList.add("hidden");
    }
  });
}

document.querySelectorAll(".dropdown-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const submenu = button.nextElementSibling;
    submenu.classList.toggle("hidden");
    const icon = button.querySelector("i[data-lucide='chevron-down']");
    icon.classList.toggle("rotate-180");
  });
});

// Chart initialization and configuration
let patientFlowChart, revenueChart;

function initCharts() {
  const isDarkMode = html.classList.contains("dark");
  const textColor = isDarkMode ? "#E5E7EB" : "#374151";
  const gridColor = isDarkMode
    ? "rgba(75, 85, 99, 0.3)"
    : "rgba(209, 213, 219, 0.8)";

  // Patient Flow Chart

  const patientFlowEl = document.getElementById("patientFlowChart");

  if (patientFlowEl) {
      const patientFlowCtx = patientFlowEl.getContext("2d");
      patientFlowChart = new Chart(patientFlowCtx, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "New Patients",
              data: [120, 145, 138, 190, 210, 235, 260, 245, 280, 300, 320, 350],
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              tension: 0.4,
              fill: true,
              borderWidth: 2,
            },
            {
              label: "Returning Patients",
              data: [85, 95, 110, 105, 125, 140, 160, 180, 195, 210, 230, 250],
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.4,
              fill: true,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: textColor,
                font: {
                  family: "Manrope, system-ui, sans-serif",
                },
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                font: {
                  family: "Manrope, system-ui, sans-serif",
                },
              },
            },
            y: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                font: {
                  family: "Manrope, system-ui, sans-serif",
                },
              },
            },
          },
        },
      });
  }



  // Revenue Analysis Chart


  const revenueEl = document.getElementById("revenueChart");
  if (revenueEl) {
    const revenueCtx = revenueEl.getContext("2d");
     revenueChart = new Chart(revenueCtx, {
      type: "bar",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Insurance",
            data: [1250000, 1350000, 1420000, 1580000],
            backgroundColor: "rgba(79, 70, 229, 0.7)",
            borderColor: "#4F46E5",
            borderWidth: 1,
          },
          {
            label: "Out-of-Pocket",
            data: [450000, 520000, 580000, 620000],
            backgroundColor: "rgba(139, 92, 246, 0.7)",
            borderColor: "#8B5CF6",
            borderWidth: 1,
          },
          {
            label: "Government",
            data: [850000, 920000, 980000, 1050000],
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "#10B981",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: textColor,
              font: {
                family: "Manrope, system-ui, sans-serif",
              },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label + ": $" + context.raw.toLocaleString()
                );
              },
            },
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                family: "Manrope, system-ui, sans-serif",
              },
            },
          },
          y: {
            stacked: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              callback: function (value) {
                return "$" + (value / 1000000).toFixed(1) + "M";
              },
              font: {
                family: "Manrope, system-ui, sans-serif",
              },
            },
          },
        },
      },
    });
  }
}

function updateChartsForTheme() {
  const isDarkMode = html.classList.contains("dark");
  const textColor = isDarkMode ? "#E5E7EB" : "#374151";
  const gridColor = isDarkMode
    ? "rgba(75, 85, 99, 0.3)"
    : "rgba(209, 213, 219, 0.8)";

  // Update Patient Flow Chart
  patientFlowChart.options.plugins.legend.labels.color = textColor;
  patientFlowChart.options.plugins.tooltip.backgroundColor = isDarkMode
    ? "#1F2937"
    : "#FFFFFF";
  patientFlowChart.options.plugins.tooltip.titleColor = textColor;
  patientFlowChart.options.plugins.tooltip.bodyColor = textColor;
  patientFlowChart.options.plugins.tooltip.borderColor = gridColor;
  patientFlowChart.options.scales.x.grid.color = gridColor;
  patientFlowChart.options.scales.x.ticks.color = textColor;
  patientFlowChart.options.scales.y.grid.color = gridColor;
  patientFlowChart.options.scales.y.ticks.color = textColor;
  patientFlowChart.update();

  // Update Revenue Chart
  revenueChart.options.plugins.legend.labels.color = textColor;
  revenueChart.options.plugins.tooltip.backgroundColor = isDarkMode
    ? "#1F2937"
    : "#FFFFFF";
  revenueChart.options.plugins.tooltip.titleColor = textColor;
  revenueChart.options.plugins.tooltip.bodyColor = textColor;
  revenueChart.options.plugins.tooltip.borderColor = gridColor;
  revenueChart.options.scales.x.grid.color = gridColor;
  revenueChart.options.scales.x.ticks.color = textColor;
  revenueChart.options.scales.y.grid.color = gridColor;
  revenueChart.options.scales.y.ticks.color = textColor;
  revenueChart.update();
}

// Initialize charts when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initCharts();
});

function openCreateInvoiceModal() {
  Modal.show("createInvoiceModal");

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  document.querySelector('input[name="invoiceDate"]').value = today;
  document.querySelector('input[name="dueDate"]').value = dueDate
    .toISOString()
    .split("T")[0];

  calculateInvoiceTotal();
}

function closeInvoiceDetailsModal() {
  Modal.hide("invoiceDetailsModal");
}

function viewInvoice(invoiceId) {
  Modal.show("invoiceDetailsModal");
  lucide.createIcons();
}

function addInvoiceItem() {
  const itemsList = document.getElementById("invoiceItemsList");
  const newItem = document.createElement("div");
  newItem.className =
    "invoice-item grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800";
  newItem.innerHTML = `
                <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body">Service/Item Description</label>
                    <input type="text" name="itemDescription[]" placeholder="e.g., Blood Test" 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none">
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body">Quantity</label>
                    <input type="number" name="itemQuantity[]" value="1" min="1" 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none">
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body">Unit Price</label>
                    <input type="number" name="itemPrice[]" step="0.01" placeholder="0.00" 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none">
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body">Total</label>
                    <input type="text" readonly 
                        className="item-total w-full px-3 py-2 border border-gray-200 dark:border-gray-700 
                            rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-body focus:outline-none" 
                        value="$0.00">
                </div>
                <div className="md:col-span-1 flex items-end">
                    <button type="button" onclick="removeInvoiceItem(this)" 
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none">
                        <i data-lucide="trash-2" className="w-4 h-4"></i>
                    </button>
                </div>
            `;
  itemsList.appendChild(newItem);
  lucide.createIcons();

  // Add event listeners for calculation
  const quantityInput = newItem.querySelector('input[name="itemQuantity[]"]');
  const priceInput = newItem.querySelector('input[name="itemPrice[]"]');

  quantityInput.addEventListener("input", calculateInvoiceTotal);
  priceInput.addEventListener("input", calculateInvoiceTotal);

  // Trigger calculation immediately after adding
  calculateInvoiceTotal();
}

function removeInvoiceItem(button) {
  button.closest(".invoice-item").remove();
  calculateInvoiceTotal();
}

function calculateInvoiceTotal() {
  const items = document.querySelectorAll(".invoice-item");
  let subtotal = 0;

  items.forEach((item) => {
    const quantity =
      parseFloat(item.querySelector('input[name="itemQuantity[]"]').value) || 0;
    const price =
      parseFloat(item.querySelector('input[name="itemPrice[]"]').value) || 0;
    const total = quantity * price;

    item.querySelector(".item-total").value = `$${total.toFixed(2)}`;
    subtotal += total;
  });

  const discountAmount =
    parseFloat(document.getElementById("discountAmount").value) || 0;
  const discountType = document.getElementById("discountType").value;

  let discount = 0;
  if (discountType === "percent") {
    discount = subtotal * (discountAmount / 100);
  } else {
    discount = discountAmount;
  }

  const taxRate = 0.085; // 8.5%
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  document.getElementById("invoiceSubtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("invoiceTax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("invoiceTotal").textContent = `$${total.toFixed(2)}`;
}
