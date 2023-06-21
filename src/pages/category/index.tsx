import { FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '../../components/header';

import { SetupApiCliente } from '../../Services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '../../utils/canSSRAuth';

export default function Category() {
    const [nome, setNome] = useState('');

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if(nome === '') {
            return;
        }

        const apiClient = SetupApiCliente();
        await apiClient.post('/category', {
            name: nome
        })

        toast.success("Categoria cadastrada com sucesso!")
        setNome('');
    }

    return (
        <>
        <Head>
            <title>Nova Categoria - Sujeito pizzaria</title>
        </Head>
        <div>
            <Header />


            <main className={styles.container}>
                <h1>Cadastrar categorias</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input type="text" className={styles.input} placeholder='Digite o nome para a categoria...' value={nome} onChange={(e) => setNome(e.target.value)}/>

                    <button className={styles.buttonAdd} type='submit'>Cadastrar</button>
                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})