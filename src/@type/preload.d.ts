import {API} from "../Electron/preload";
declare global {
    interface Window {
        api:typeof API
}}