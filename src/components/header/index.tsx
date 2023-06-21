import Link from 'next/link';
import styles from './styles.module.scss';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { FiLogOut } from 'react-icons/fi'

export function Header() {
    const { signOut } = useContext(AuthContext);
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <img src="/logo.svg" alt="logo"  width={190} height={60}/>
                </Link>

                <nav className={styles.menuNav}>
                    <Link href="/category">
                        Categoria
                    </Link>
                    <Link href="/product">
                        Cardápio
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#FFF' size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}