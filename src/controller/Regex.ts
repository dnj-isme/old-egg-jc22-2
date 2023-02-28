export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
export const passwordRegex = {
  capital: /[A-Z]/,
  regular: /[a-z]/,
  number: /[0-9]/,
  symbol: /[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]/,
  length: /^.{8,30}$/,
  all: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]).{8,30}$/
}

export const phoneRegex = /^(0|\+)[1-9]\d{8,}$/