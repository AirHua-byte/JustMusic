export default store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem('setting', JSON.stringify(state.settings));
    localStorage.setItem('data', JSON.stringify(state.data));
  })
}