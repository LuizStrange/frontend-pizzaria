import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";

import { AuthTokenErrors } from "./errors/AuthTokenErrors";
import { signOut } from "../contexts/AuthContext";


export function SetupApiCliente(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status == 401) {
            // Qualquer erro 401 (nao autorizado) devemos deslogar o usuarios
            if( typeof window !== undefined) {
                // Chama a função para deslogar
                signOut();
            } else {
                return Promise.reject(new AuthTokenErrors())
            }
        }

        return Promise.reject(error);
    })

    return api;
}