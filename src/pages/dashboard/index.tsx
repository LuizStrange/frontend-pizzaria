import Head from "next/head"
import { useState } from "react"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { Header } from "../../components/header"
import styles from './styles.module.scss'
import { FiRefreshCcw } from "react-icons/fi"
import { SetupApiCliente } from "../../Services/api"
import Modal from 'react-modal'
import { ModalOrder } from "../../components/ModalOrder"

type OrderProps = {
    id: string;
    title: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        title: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard({ orders }: HomeProps){
    const [OrderList, setOrderList] = useState(orders || [])
    const [ modalItem, setModalItem ] = useState<OrderItemProps[]>();
    const [ modalVisible, setModalVisible ] = useState(false);


    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleFinishItem(id: string) {
        const apiClient = SetupApiCliente();
        await apiClient.put('/order/finish', {
            order_id: id,
        })

        const response = await apiClient.get('/orders');

        setOrderList(response.data);

        setModalVisible(false);
    }

    async function handleOpenModalView(id: string) {
        const apiClient = SetupApiCliente();

        const response = await apiClient.get('/order/detail', {
            params: {
                order_id: id,
            }
        })

        setModalItem(response.data);
        setModalVisible(true);
    }

    async function handleRefreshOrders() {
        const apiClient = SetupApiCliente();

        const response = await apiClient.get('/orders');
        setOrderList(response.data);
    }

    Modal.setAppElement("#__next")
    return (
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos: </h1>
                        <button onClick={handleRefreshOrders}>
                            <FiRefreshCcw size={25} color="#3fffa3"/>
                        </button>
                    </div>

                    <article className={styles.listOrders}>
                        {OrderList.length === 0 && (
                            <span className={styles.emptyList}>Nenhum pedido em aberto encontrado!🤔</span>
                        )}
                        {OrderList.map( item => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.title}</span>
                                </button>
                            </section>
                        ))}
                    </article>
                </main>

                { modalVisible && (
                    <ModalOrder isOpen={modalVisible} onRequestClose={handleCloseModal} order={modalItem} handleFinishOrder={handleFinishItem}/>
                )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = SetupApiCliente(ctx);

    const response = await apiClient.get('/orders');
    return {
        props: {
            orders: response.data
        }
    }
})