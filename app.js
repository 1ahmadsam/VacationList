//event listeners
window.onload = function () {
  document.querySelector('#vacation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    if (country === '' || city === '') {
      document.getElementById('result').innerHTML = showDialog(
        'warning',
        'enter in the information correctly'
      );
    } else {
      document.getElementById('result').innerHTML = showDialog(
        'success',
        'nice job'
      );
    }
    console.log('hello:', country, city);
  });
};

/**
 *  display success or error message depending on inpout values
 */
function showDialog(dialogType, text) {
  let dialog;
  switch (dialogType) {
    case 'warning':
      dialog = "<div class='alert alert-warning'>";
      break;
    case 'success':
      dialog = "<div class='alert alert-success'>";
      break;
  }
  dialog += text;
  dialog += '</div>';
  return dialog;
}
