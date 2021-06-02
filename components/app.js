import {
  MDCDialog
} from '@material/dialog';
import {
  MDCTextField
} from '@material/textfield';

// Initialize MDCDialog on HTMLElement
const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

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
  var data = $(form_update_customer).getData();
  console.log(data);
  await doAjax('/customer/update', 'POST', data);
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
