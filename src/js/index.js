import "../css/styles.css";
import "../assets/vendors/bootstrap/css/bootstrap.min.css"
import "../assets/vendors/bootstrap/js/bootstrap.bundle.js"

/* Modal JS */

const ourModal = document.getElementById('ourModal');
const modalButton = document.getElementById('modal-btn');
const close = document.getElementsByClassName("close")[0];

modalButton.addEventListener('click', function() {
    ourModal.style.display = "block;";
  })
  close.addEventListener('click', function() {
    ourModal.style.display = "none;";
  })