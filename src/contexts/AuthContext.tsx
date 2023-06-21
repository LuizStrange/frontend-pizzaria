import { createContext, ReactNode, useState, useEffect } from 'react';
import {destroyCookie, setCookie, parseCookies} from 'nookies';
import Router from 'next/router'
import { api } from "../Services/apiClient";
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    SignUp: (credentials: SignUpProps) => Promise<void>
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try{
        destroyCookie(undefined, "@nextauth.token")
        Router.push('/')
    } catch {
        toast.error("Erro ao deslogar!")
    }
}

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user; // !! = quer dizer que vai transformar em boolean.

    useEffect(() => {
        const { "@nextauth.token": token} = parseCookies();

        if(token) {
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                // se deu erro, deslogar o user:
                signOut();
            })
        }
    }, [])

    async function signIn({email, password}: SignInProps) {
        try{
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token } = response.data;

            setCookie(undefined, "@nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // vai expirar em 1 mes
                path: '/' // vai em caminhar para todos!
            })

            setUser({
                id,
                name,
                email
            })

            //passar para proximas requisições o nosso token:
            api.defaults.headers['Authorization'] = `Bearer ${token}`
        
            //
            toast.success("Logado com sucesso!")
            //Redirecionar para a pagina:
            Router.push('/dashboard')
        }catch(err){
            toast.error("Erro ao acessar!")
            console.log("Error ao acessar ", err)
        }
    }

    async function SignUp({name, email, password}: SignUpProps) {
        try{
            const response = await api.post("/users", {
                name,
                email,
                password
            })

            toast.success("CADASTRADO COM SUCESSO!")

            Router.push('/')
        } catch(err) {
            toast.error("Erro ao cadastrar!")
            console.log("Erro ao cadastrar: ", err)
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, SignUp}}>
            {children}
        </AuthContext.Provider>
    )
}