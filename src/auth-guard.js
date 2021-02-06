export default (to, from, next) => {
  if (!localStorage.getItem("user")) {
    next("/sign-in")
  } else {
    next()
  }
}
