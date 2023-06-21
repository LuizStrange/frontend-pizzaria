import { Inter } from '@next/font/google';
import {useContext, FormEvent, useState} from 'react'
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../styles/Home.module.scss'
import logoimg from '../../public/logo.svg'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { canSSRGuest } from '../utils/canSSRGuest';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';

import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if(email === '' || password === '') {
      toast.info("Preencha os campos em branco.")
      return;
  }

    setLoading(true)

    let data = {
      email,
      password
    }
    await signIn(data)
    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>
      <div  className={styles.containerCenter}>
        <Image src={logoimg} alt="Logo Sujeito Pizzaria" priority={false}/>

      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <Input placeholder='Digite seu email...'type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <Input placeholder='Digite sua senha...' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button loading={loading} type='submit'>Acessar</Button>
        </form>

        <Link href="/signup" className={styles.text}>
          Não possui uma conta? Cadastre-se
        </Link>
        
      </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  
  return {
    props: {}
  }
})