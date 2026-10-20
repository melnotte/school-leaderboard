const base = () => `${window.location.origin}${window.location.pathname}`

export const globalLink = () => base()
export const groupLink = (token) => `${base()}#/g/${token}`
export const studentLink = (token) => `${base()}#/s/${token}`