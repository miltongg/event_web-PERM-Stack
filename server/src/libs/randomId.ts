export default function randomId() {
  const possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let random = '';
  for (let i = 0; i < 10; i++) {
    random += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  
  return random
}