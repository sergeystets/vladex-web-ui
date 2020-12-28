export default (to, from, next) => {
  if ((to.fullPath === "/login" || to.fullPath === "/login/otp") && localStorage.getItem("user")) {
    next('/')
  } else if (
      // user is authenticated
      localStorage.getItem("user") ||
      // user is not authenticated
      (!localStorage.getItem("user") &&
          // and
          (
              // he goes from login to login/otp
              (from.fullPath === "/login" && to.fullPath === "/login/otp") ||
              // or back to login from login/otp
              (to.fullPath === "/login" && from.fullPath === "/login/otp") ||
              // or he simply goes to a login page
              to.fullPath === "/login")
      )) {
    next()
  } else {
    next('/login')
  }
}
