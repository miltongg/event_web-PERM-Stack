import {webApi} from "../helpers/animeApi";

const decodeToken = async (token: string) => {
  
  try {
    const {data} = await webApi.get('/token', {
      headers: {
        "Content-Type": "application/json",
        token
      },
    })

    return data
    
  } catch (error: any) {
    localStorage.removeItem('token')
    location.reload()
    console.log(error)
  }
  
}

export default decodeToken;