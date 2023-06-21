import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/header";
import { FiUpload } from "react-icons/fi";
import { SetupApiCliente } from "../../Services/api";
import { toast } from "react-toastify";

type itemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: itemProps[];
}

export default function Product({categoryList}: CategoryProps){
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [AvatarUrl, SetAvatarUrl] = useState('');
    const [ImageAvatar, SetImageAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setcategorySelected] = useState(0);

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.files) {
            return
        }

        const image = e.target.files[0];

        if(!image) {
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png') {
            SetImageAvatar(image);
            SetAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    function handleChangeCategory(event) {
        setcategorySelected(event.target.value)
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try{
            const data = new FormData();

            if(name === '' || price === '' || description === '' || ImageAvatar === null) {
                toast.error("Preencha todos os campos!")
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', ImageAvatar);

            const apiClient = SetupApiCliente();

            await apiClient.post('/products', data);

            toast.success("Produto cadastrado com sucesso!")
        }catch(err){
            console.log(err)
            toast.error("Ops! Erro ao cadastrar...")
        }

        setName('');
        setPrice('');
        setDescription('');
        SetImageAvatar(null);
        SetAvatarUrl('');
    }

    return (
        <>
            <Head>
                <title>Novo Produto - Sujeito pizzaria</title>
            </Head>

            <div>
                <Header></Header>

                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#fff" />
                            </span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>

                            { AvatarUrl && (
                                <img className={styles.preview} src={AvatarUrl} alt="Foto Do Produto" width={250} height={250}/>
                            )}
                        </label>
                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index) => {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input type="text" placeholder="Digite o nome do produto..." className={styles.input} value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="text" placeholder="Preço do produto..." className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)}/>
                        <textarea placeholder="Descreva seu produto..." className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)}/>

                        <button className={styles.buttonAdd} type="submit">Cadastrar</button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = SetupApiCliente(ctx);

    const response = await apiClient.get('/category');
    return {
        props: {
            categoryList: response.data
        }
    }
})