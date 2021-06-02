var inputs = document.querySelectorAll('#search-form input');
$.fn.extend({
  getData: function() {
    return $(this).find('input').filter(function(index, element) {
      return $(element).val() != '';
    }).serialize();
  },
})

inputs.forEach((input) => input.addEventListener('input', e => populate()))

async function populate() {
  var form = document.getElementById('search-form'),
    table_content = document.querySelector('.mdc-data-table__content'),
    data = $(form).getData();
  try {
    var result = await $.ajax({
      url: '/customer/index',
      type: 'POST',
      data: data
    });
  } catch (e) {
    console.log(e);
    return e;
  } finally {
    table_content.innerHTML = result;
  }
}

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
