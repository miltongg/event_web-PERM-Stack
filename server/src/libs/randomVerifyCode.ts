export default function randomVerifyCode() {
  const possible = "0123456789abcdefghijklmnopqrstuvwxyz";
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return random
}