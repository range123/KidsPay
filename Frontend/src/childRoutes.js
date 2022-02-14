
import ViewBalance from "./views/ViewBalance.js";
import Pay from "./views/Pay.js";



const dashboardRoutes = [
  {
    path: "/viewBalance",
    name: "View Balance",
    icon: "nc-icon nc-chart-pie-35",
    component: ViewBalance,
    layout: "/child",
  },
  {
    path: "/pay",
    name: "Pay",
    icon: "nc-icon nc-circle-09",
    component: Pay,
    layout: "/child",
  },
 
  
];

export default dashboardRoutes;
