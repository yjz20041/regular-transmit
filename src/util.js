const id = 0;
const uid = () => {
  id++;
  return new Date().getTime() + id;
}

module.exports = {
  uid
}