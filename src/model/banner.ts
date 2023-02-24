

export interface Banner {
  id: string,
  src: string,
  link: string,
  label: string,
  status: "active" | "disabled" | string
}