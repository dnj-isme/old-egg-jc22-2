import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import Topbar from '@/components/shop/topbar/topbar';
import { Button, Comp } from '@/components/component';

import style from "./create.module.scss"
import { Category, getAllCategory, Product, Spec } from '@/model/product';
import uploadImage from '@/controller/FileUploader';
import { From } from '@/database/api';

interface Props {
  categories: Category[]
}

export async function getServerSideProps() {

  const res = await getAllCategory()

  let props: Props = {
    categories: []
  }

  if(res) props.categories = res

  return {
    props
  }
}

export default function Insert(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<undefined | number>()
  const [stock, setStock] = useState<undefined | number>()
  const [category, setCategory] = useState('')
  const [files, setFiles] = useState<FileList | null>()

  const [keys, setKeys] = useState<string[]>([''])
  const [values, setValues] = useState<string[]>([''])
  const [rowsCount, setRowsCount] = useState(1)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault()
    let error = false;

    let data: Spec[] = new Array()

    if(name == "") {
      ShowNotification("danger", "Error", "Product Name cannot be empty!")
      error = true
    }

    if(!(price && price > 0)) {
      ShowNotification("danger", "Error", "Product price must more than 0$!")
      error = true
    }

    if(!files) {
      ShowNotification("danger", "Error", "You must input product image(s)")
      error = true
    }
    else {
      for(let i = 0; i < files.length; i++) {
        const file = files[i]
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if(!validImageTypes.includes(file.type)) {
          ShowNotification("danger", "Error", "Uploaded file must in image format!")
          error = true;
          break;
        }
      }
    }

    if(!(stock && stock > 0)) {
      ShowNotification("danger", "Error", "Product stock must more than 0!")
      error = true
    }

    if(category == "") {
      ShowNotification("danger", "Error", "Choose Product Category!")
      error = true
    }

    let len = Math.max(keys.length, values.length)
    for(let i = 0; i < len; i++) {
      const key_empty = !keys[i]
      const val_empty = !values[i]
      if(key_empty != val_empty) {
        ShowNotification("danger", "Error", "The Spec keys and values must be filled in the same row")
        error = true
        break
      }
      data.push({key: keys[i], value: values[i]});
    }

    
    if(!error && price && stock) {
      const activeAccount = await Auth.getActiveAccount()
  
      if(!activeAccount) {
        if(global.debug) {
          ShowNotification("danger", "Error", "Error Occured!!!")
          console.log(activeAccount);
        }
        else {
          alert("Your Account has logged out, try sign in again")
        }
        return
      }
  
      const account_id = activeAccount.id

      let imageLinks: string[] = []

      if(files)
      for(let i = 0; i < files.length; i++) {
        const res = await uploadImage(files[i], "products")

        if(res.success) {
          imageLinks.push(res.data)
        }
        else {
          NotificationTemplate.Error()
        }
      }

      let newProduct: Product = {
        category_id: category,
        description: description,
        discount: 0,
        product_name: name,
        product_price: price,
        product_stock: stock,
        product_specs: data,
        store_id: account_id,
        image_links: imageLinks
      }
      console.log(newProduct);
      const res = await From.Rest.fetchData("/product", "POST", newProduct, Auth.getToken())
      if(res.success) {
        NotificationTemplate.Success()
        router.back()
      }
      else {
        NotificationTemplate.Error()
        console.error(res);
      }
    }
  }

  function changeKey(idx: number, value: string): void {
    let data = keys;
    data[idx] = value;
    setKeys(data)
  }

  function changeValue(idx: number, value: string): void {
    let data = values;
    data[idx] = value;
    setValues(data)
  }

  function addRow(e: FormEvent) {
    e.preventDefault()
    const newSize = rowsCount + 1
    setRowsCount(newSize)
    keys[newSize - 1] = values[newSize - 1] = ""
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
      MustBusiness
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <div>
            <Navbar changeTheme={changeTheme}/>
            <Topbar />
          </div>
          <div className={style.content}>
            <form onSubmit={handleCreateProduct}>
              <div className={style.header}>
                <Comp.H1>Create Product</Comp.H1>
                <Button.Blue onClick={_ => router.back()}>Back</Button.Blue>
              </div>
              <div className={style.form}>
                <div>
                  <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name"/>
                </div>
                <div>
                  <input type="number" name="price" id="price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Set Price" min={0} step={0.01}/>
                </div>
                <div>
                  <input type="number" name="stock" id="stock" value={stock} onChange={e => setStock(parseInt(e.target.value))} placeholder="Set Stock" min={0}/>
                </div>
                <div>
                  {/* <input type="text" name="description" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"/> */}
                  <textarea name="description" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={8} />
                </div>
                <div>
                  <select className={style.select} onChange={e => setCategory(e.target.value)}>
                    <option value="" defaultChecked>[Select Category]</option>
                    {props.categories.map(category => (
                      <option value={category.id}>{category.category_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="file" style={{color: theme.textColor}}>Poduct Image</label> <br />
                  <input type="file" style={{color: theme.textColor}} multiple onChange={e => setFiles(e.target.files)} />
                </div>
                <div>
                  <table className={style.table}>
                    <thead>
                      <tr>
                        <td style={{color: theme.textColor}} className={style.key}>Key</td>
                        <td style={{color: theme.textColor}} className={style.value}>Value</td>
                      </tr>
                    </thead>
                    <tbody> 
                      {Array.apply(null, Array(rowsCount)).map((val, idx) => (
                        <tr>
                          <td><input type="text" onChange={e => changeKey(idx, e.target.value)}/></td>
                          <td><input type="text" onChange={e => changeValue(idx, e.target.value)}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button.Blue onClick={addRow}>Add Row</Button.Blue>
                </div>
                <div>
                  <button className={style.submit} type="submit">Save</button>
                </div>
              </div>
            </form>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}