import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { Banner } from '@/model/banner';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';

export interface BannerRowParams {
  idx: number,
  data: Banner
}

export default function BannerRow(props: BannerRowParams) {
  // TODO: Your useState starts here...
  const [edit, setEdit] = useState(false)
  const [changed, setChanged] = useState(false)

  const [newLabel, setNewLabel] = useState(props.data.label)
  const [src, setSrc] = useState(props.data.src)
  const [link, setLink] = useState(props.data.link)
  const [status, setStatus] = useState(props.data.status)

  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme

  // TODO: Your custom logic starts here...
  function handleSave(e: MouseEvent) {
    e.preventDefault();
    // hellow 
  }
  
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    setEdit(true)
  }
  
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    
  }

  function handleCancel(e: MouseEvent) {
    e.preventDefault()
    setEdit(false)
    setNewLabel(props.data.label)
  }

  function changeLabel(value: string): void {
    setChanged(true)
    let updated = cache
    updated.label = value
    setCache(updated)
  }
  
  function changeSrc(value: string): void {
    setChanged(true)
    let updated = cache
    updated.src = value
    setCache(updated)
  }
  
  function changeLink(value: string): void {
    setChanged(true)
    let updated = cache
    updated.link = value
    setCache(updated)
  }
  
  function changeStatus(value: string): void {
    setChanged(true)
    let updated = cache
    updated.status = value
    setCache(updated)
  }

  // TODO: Your React Element starts here...
  return (
    <tr key={props.data.id}>
      <td>
        <Comp.P>{props.idx}</Comp.P>
      </td>
      <td>
        {
          edit ?
            <input type="text" name="label" id="label" value={cache.label} onChange={e => changeLabel(e.target.value)}/>
          :
            <p>{props.data.label}</p>
        }
      </td>
      <td>
        {
          edit ?
            <input type="url" name="src" id="src" value={cache.src} onChange={e => changeSrc(e.target.value)}/>
          :
            <p>{props.data.src}</p>
        }
      </td>
      <td>
        {
          edit ?
           <input type="url" name="link" id="src" value={cache.link} onChange={e => changeLink(e.target.value)}/>
          :
            <p>{props.data.link}</p>
        }
      </td>
      <td>
        {
          edit ?
            <select value={props.data.status} onChange={e => changeStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          :
            <p>{props.data.status}</p>
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