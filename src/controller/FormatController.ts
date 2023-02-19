export const EmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
const regex = {
  // thix regex checks wheter the password has:
  // at least 6 characters,
  // at least has 1 uppercase letter,
  // at least has 1 number,
  // at least has 1 non-unicode caracters 
  // doesn't include special characters
  strict: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]{6,}$/,
 
  // thix regex checks wheter the password has:
  // at least has 1 letter,
  // at least has 1 number,
  // doesn't include special characters
  // can include non-unicode caracters 
  relaxed: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]{6,}$/
}

export const PasswordRegex = regex.relaxed