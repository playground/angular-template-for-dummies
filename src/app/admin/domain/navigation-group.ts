import { NavigationItem } from "./navigation-item";

export interface NavigationGroup {
    icon: string;
    name: string;
    items: NavigationItem[];
}