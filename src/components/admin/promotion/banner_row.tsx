import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { Banner } from '@/model/banner';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import style from "./banner.module.scss"

export interface BannerRowParams {
  idx: number,
  data: Banner
}

export default function BannerRow(props: BannerRowParams) {
  const theme = useContext(ThemeContext)

  // TODO: Your useState starts here...
  const [edit, setEdit] = useState(false)
  const [changed, setChanged] = useState(false)

  const [current, setCurrent] = useState(props.data)

  const [label, setLabel] = useState(current.label)
  const [src, setSrc] = useState(current.src)
  const [link, setLink] = useState(current.link)
  const [status, setStatus] = useState(current.status)
  const [deleted, setDeleted] = useState(false)

  // TODO: Your hooks starts here...

  // TODO: Your custom logic starts here...
  async function handleSave(e: MouseEvent) {
    e.preventDefault();
    const result = await From.Rest.fetchData("/admin/banner", "PATCH", {
      id: current.id,
      label,
      src,
      link,
      status
    }, Auth.getToken())
    if(result.success) {
      setCurrent({
        id: current.id,
        label,
        src,
        link,
        status
      })
      setEdit(false)
      setChanged(false)
      ShowNotification("success", "Data Updated!", "Data is saved successfully!")
    }
    else {
      NotificationTemplate.Error()
    }
  }
  
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    setEdit(true)
  }
  
  async function handleDelete(e: MouseEvent) {
    e.preventDefault();
    // ShowNotification("info", "In Progress", "Deleting data is in progress...")
    const res = await From.Rest.fetchData("/admin/banner", "DELETE", {
      id: current.id
    }, Auth.getToken())
    if(res.success) {
      setDeleted(true)
      ShowNotification("success", "Data deleted!", "Data is deleted successfully!")
    }
    else {
      NotificationTemplate.Error()
      console.error(res.raw)
    }
  }

  function handleCancel(e: MouseEvent) {
    e.preventDefault()
    setEdit(false)
    setLabel(current.label)
    setSrc(current.src)
    setLink(current.link)
    setStatus(current.status)
  }

  function changeLabel(value: string): void {
    setChanged(true)
    setLabel(value)
  }
  
  function changeSrc(value: string): void {
    setChanged(true)
    setSrc(value)
  }
  
  function changeLink(value: string): void {
    setChanged(true)
    setLink(value)
  }
  
  function changeStatus(value: string): void {
    setChanged(true)
    setStatus(value)
  }

  // TODO: Your React Element starts here...
  if(deleted) return null
  else return (
    <tr key={current.id}>
      <td>
        <Comp.P>{props.idx + 1}</Comp.P>
      </td>
      <td>
        {
          edit ?
          <input type="text" name="label" id="label" value={label} onChange={e => changeLabel(e.target.value)}/>
          :
            <Comp.P>{current.label}</Comp.P>
        }
      </td>
      <td>
        {
          edit ?
            // <textarea name="src" id="src" value={src} onChange={e => changeSrc(e.target.value)}/>
            <input type="url" name="src" id="src" value={src} onChange={e => changeSrc(e.target.value)}/>
          :
            <Button.Green onClick={_ => window.open(current.src, "_blank")}>View Image</Button.Green>
        }
      </td>
      <td>
        {
          edit ?
            // <textarea name='link' id='src' value={link} onChange={e => changeLink(e.target.value)}/>
            <input type="url" name="link" id="link" value={link} onChange={e => changeLink(e.target.value)}/>
           :
            current.link === "" ? null : 
            <Button.Green onClick={_ => window.open(current.link, "_blank")}>View Target</Button.Green>
          }
      </td>
      <td>
        {
          edit ?
            <select value={status} onChange={e => changeStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          :
            <Comp.P>{current.status}</Comp.P>
        }
      </td>
      <td>
        <>{changed ? <Button.Save onClick={handleSave} /> : null}</>
        <>{edit?<Button.Cancel onClick={handleCancel} />:<Button.Edit onClick={handleEdit} />}</>
        <Button.Delete onClick={handleDelete} />
      </td>
    </tr>
  )
}