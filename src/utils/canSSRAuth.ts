import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenErrors } from "../Services/errors/AuthTokenErrors";

// função para paginas que apenas os users logado pode ter acesso:
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies["@nextauth.token"];

        if(!token) {
            return {
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(ctx);
        } catch(err) {
            if(err instanceof AuthTokenErrors) {
                destroyCookie(ctx, "@nextauth.token");

                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }
    }
}