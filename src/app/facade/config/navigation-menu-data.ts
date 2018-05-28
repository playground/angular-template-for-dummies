import { NavigationGroup } from "../domain/navigation-group";

// TODO: Split by modules

export const NAVIGATION_MENU_DATA: NavigationGroup[] = [{
    icon: "pie_chart",
    name: "Dashboards",
    items: [{
        routerLink: "dashboard",
        name: "Overview"
    }, {
        routerLink: "under-construction",
        name: "Summary"
    }]
}, {
    icon: "tune",
    name: "Configuration",
    items: [{
        routerLink: "under-construction",
        name: "Application Configuration"
    }]
}, {
    icon: "favorite_border",
    name: "Service Health",
    items: [{
        routerLink: "under-construction",
        name: "Service Health 1"
    }, {
        routerLink: "under-construction",
        name: "Service Health 2"
    }]
}, {
    icon: "view_comfy",
    name: "Grid Engines",
    items: [{
        routerLink: "under-construction",
        name: "Grid Engines Pool 1"
    }, {
        routerLink: "under-construction",
        name: "Grid Engines Pool 2"
    }]
}, {
    icon: "directions_run",
    name: "Active Resources",
    items: [{
        routerLink: "under-construction",
        name: "Active Resources 1"
    }, {
        routerLink: "under-construction",
        name: "Active Resources 2"
    }]
}, {
    icon: "delete_sweep",
    name: "Data Cleanup",
    items: [{
        routerLink: "under-construction",
        name: "Data Cleanup 1"
    }, {
        routerLink: "under-construction",
        name: "Data Cleanup 2"
    }]
}, {
    icon: "storage",
    name: "Storage Utilization",
    items: [{
        routerLink: "under-construction",
        name: "Storage Utilization 1"
    }, {
        routerLink: "under-construction",
        name: "Storage Utilization 2"
    }]
}

];