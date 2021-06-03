import {
  MDCDialog
} from '@material/dialog';
import {
  MDCTextField
} from '@material/textfield';
import {
  MDCSnackbar
} from '@material/snackbar';

// Phone number input
var telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(function(input) {
  input.addEventListener('input', function(e) {
    var length = e.target.value.length,
      value = e.target.value;
    if (length == 3 | length == 7 && e.data != null)
      e.target.value = value + '-';
    if (e.data == null && value.slice(-1) == '-' || isNaN(e.data) && e.target.value.length != 12)
      e.target.value = value.slice(0, -1);
  })
});

// Initialize MDCDialog on HTMLElement
const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

// Notification window
var snackbarEl = document.querySelector('.mdc-snackbar');
console.log(snackbarEl);
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));

function openSnackBar(text) {
  snackbar.labelText = text;
  snackbar.open();
}

// Same as above but for text fields
var text_fields = document.querySelectorAll('.mdc-text-field');
text_fields.forEach(function(text_field_el) {
  var text_field = new MDCTextField(text_field_el);
})
var inputs = document.querySelectorAll('#search-form input'),
  add_customer_button = document.getElementById('open-add-customer-dialog');
add_customer_button.addEventListener('click', (e) => dialog.open());

// Extended jQuery function for serializing form data
$.fn.extend({
  getData: function() {
    return $(this).find('input, select, textarea').filter(function(index, element) {
      return $(element).val() != '';
    }).serialize();
  },
})

// Keeps user from having to press a submit button when changing search values
inputs.forEach((input) => input.addEventListener('input', e => populate()))

// Method to change table data based on search input
async function populate() {
  var form = document.getElementById('search-form'),
    table_content = document.querySelector('.mdc-data-table__content'),
    data = $(form).getData();
  try {
    var result = await doAjax('/customer/index', 'POST', data);
  } catch (e) {
    console.log(e);
    return e;
  } finally {
    table_content.innerHTML = result;
  }
}

// Indicators for what direction the table is being sorted and by what value
var sort_headers = document.querySelectorAll('.mdc-data-table__header-cell');
sort_headers.forEach(function(header) {
  header.addEventListener('click', function(e) {
    var sortInput = document.getElementById(this.dataset.sortInput),
      icon = this.querySelector('i');
    switch (sortInput.value) {
      case '':
        icon.classList.remove('fa-sort');
        icon.classList.add('fa-sort-down');
        sortInput.value = 'asc';
        break;
      case 'asc':
        icon.classList.remove('fa-sort-down');
        icon.classList.add('fa-sort-up');
        sortInput.value = 'desc';
        break;
      case 'desc':
        icon.classList.remove('fa-sort-up');
        icon.classList.add('fa-sort');
        sortInput.value = '';
        break;
    }
    populate();
  })
})

// Event listener that submits new data for customer on the pop up modal
var submit_button = document.querySelector('.submit-button'),
  form_update_customer = document.querySelector('.form-update-customer');
submit_button.addEventListener('click', async function(e) {
  if (!formIsValid(form_update_customer)) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  var data = $(form_update_customer).getData();
  await doAjax('/customer/update', 'POST', data);
  openSnackBar('Customer was successfully updated.');
  populate();
})

// Simplify requests to server side with this method
async function doAjax(url, type, data) {
  var result = await $.ajax({
    url: url,
    type: type,
    data: data
  });
  return result;
}

// We're using an asynchronous method for submitting data so use this to check validity before sending
let formIsValid = (form) => {
  let result = 1,
    fields = form.querySelectorAll('input, select, radio, textarea');
  fields.forEach((field) => {
    if (!field.checkValidity()) {
      result = 0;
    }
  })
  if (!result)
    openSnackBar('Form has missing or invalid values, please check again before submitting');
  return result;
}
