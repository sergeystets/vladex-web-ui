export default (to, from, next) => {
  if (!localStorage.getItem("user")) {
    next("/sing-in")
  } else {
    next()
  }
}
