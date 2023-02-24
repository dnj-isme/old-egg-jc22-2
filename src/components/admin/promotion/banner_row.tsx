import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification from '@/controller/NotificationController';
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

  const [label, setLabel] = useState(props.data.label)
  const [src, setSrc] = useState(props.data.src)
  const [link, setLink] = useState(props.data.link)
  const [status, setStatus] = useState(props.data.status)

  // TODO: Your hooks starts here...

  // TODO: Your custom logic starts here...
  async function handleSave(e: MouseEvent) {
    e.preventDefault();
    const result = await From.Rest.fetchData("/admin/banner/update", "PATCH", {
      id: props.data.id,
      label,
      src,
      link,
      status
    }, Auth.getToken())
    console.log(status);
    
  }
  
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    setEdit(true)
  }
  
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    ShowNotification("info", "In Progress", "Deleting data is in progress...")
  }

  function handleCancel(e: MouseEvent) {
    e.preventDefault()
    setEdit(false)
    setLabel(props.data.label)
    setSrc(props.data.src)
    setLink(props.data.link)
    setStatus(props.data.status)
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
  return (
    <tr key={props.data.id}>
      <td>
        <Comp.P>{props.idx + 1}</Comp.P>
      </td>
      <td>
        {
          edit ?
          <input type="text" name="label" id="label" value={label} onChange={e => changeLabel(e.target.value)}/>
          :
            <Comp.P>{props.data.label}</Comp.P>
        }
      </td>
      <td>
        {
          edit ?
            <textarea name="src" id="src" value={src} onChange={e => changeSrc(e.target.value)}/>
          :
            <button onClick={_ => window.open(props.data.src, "_blank")}>View Image</button>
        }
      </td>
      <td>
        {
          edit ?
          //  <input type="url" name="link" id="src" value={link} onChange={e => changeLink(e.target.value)}/>
            <textarea name='link' id='src' value={link} onChange={e => changeLink(e.target.value)} style={{"color": theme.textColor}}/>
          :
            props.data.link === "" ? null : 
            <button onClick={_ => window.open(props.data.link, "_blank")}>View Target</button>
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
            <Comp.P>{props.data.status}</Comp.P>
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