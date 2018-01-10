import { AdminGuiError } from "../errors/admin-gui.error";

export interface Alert {
    date: Date,
    component: string,
    title: string,
    details?: string,
    error?: Error
}