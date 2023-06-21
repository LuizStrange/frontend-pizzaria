import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/Home.module.scss'
import logoimg from '../../../public/logo.svg'
import Link from 'next/link';
import { toast } from 'react-toastify';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/input';
import { FormEvent, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Signup() {
    const { SignUp } = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignUp(event: FormEvent) {
        event.preventDefault();

        if(name === '' || email === '' || password === '') {
            toast.info("Preencha os campos em branco.")
            return;
        }
    
        setLoading(true)

        let data = {
            name,
            email,
            password
        }

        await SignUp(data)
        setLoading(false)
    }
    return (
        <>
        <Head>
            <title>Faça o cadastro agora!</title>
        </Head>

        <div className={styles.containerCenter}>
            <Image src={logoimg} alt='Logo'></Image>

            <div className={styles.login}>
                <h1>Cadastro</h1>
                <form onSubmit={handleSignUp}>
                    <Input type="text" placeholder='Digite seu nome' value={name} onChange={(e) => setName(e.target.value)} />
                    <Input type="text" placeholder='Digite seu email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder='Digite sua senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Button loading={loading} type='submit'>Cadastrar</Button>
                </form>

                <Link href="/" className={styles.text}>
                    Já tem uma conta? Faça login.
                </Link>
            </div>

        </div>
    </>
    )
}