
import AddChild from "./views/AddChild.js";
import AddMoney from "./views/AddMoney.js";
import Restrictions from "./views/Restrictions.js";
import Transactions from "./views/Transactions.js";
import Refund from "./views/Refund.js";


const dashboardRoutes = [
  {
    path: "/addChild",
    name: "Add Child",
    icon: "fas fa-plus",
    component: AddChild,
    layout: "/admin",
  },
  {
    path: "/addMoney",
    name: "Add Money",
    icon: "fas fa-piggy-bank",
    component: AddMoney,
    layout: "/admin",
  },
  {
    path: "/restrictions",
    name: "Update Restrictions",
    icon: "fas fa-edit",
    component: Restrictions,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "View Transactions",
    icon: "fas fa-list-ul",
    component: Transactions,
    layout: "/admin",
  },
  {
    path: "/refund",
    name: "Refund",
    icon: "fas fa-money-bill",
    component: Refund,
    layout: "/admin",
  },
  
];

export default dashboardRoutes;
