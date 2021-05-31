$(document).ready(function() {
  hamburger();
  autoGenUserPin();
  helpModal();
  var searchForm = new ajaxForm();
  ajax();
  activeLinks();
  formBuilder();
  datePicker();
  calendarInit();
  autoComplete();
  disableAutofill();
})

function disableAutofill() {
  $('input').on('focus', function(obj) { // disable autofill
    $('input').removeAttr('autocomplete');
    $(this).attr('autocomplete', 'new-password');
  })
}

function datePicker() {
  $('.datepicker').datepicker({
    dateFormat: 'yy-mm-dd'
  });
}

class ajaxForm {
  constructor(form, columns, tbody, input, row, table) {
    if (!$('.form-ajax').length)
      return;
    this.form = $('.form-ajax');
    this.input = this.form.find('input, select');
    this.columns = this.form.data('columns').split(' ');
    this.tbody = this.form.find('tbody');
    this.row = '<tr>';
    this.input.on('input change', () => {
      this.populate();
    }).trigger('input');
    // this.table = $('table').tableExport();
    this.table = TableExport(document.getElementsByTagName("table"), {
      headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
      footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
      formats: ["xlsx", "csv", "txt"], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
      filename: "id", // (id, String), filename for the downloaded file, (default: 'id')
      bootstrap: true, // (Boolean), style buttons using bootstrap, (default: true)
      exportButtons: false, // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
      position: "bottom", // (top, bottom), position of the caption element relative to table, (default: 'bottom')
      ignoreRows: null, // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
      ignoreCols: null, // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
      trimWhitespace: true, // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
      RTL: false, // (Boolean), set direction of the worksheet to right-to-left (default: false)
      sheetname: "id" // (id, String), sheet name for the exported spreadsheet, (default: 'id')
    });
  }

  populate() {
    var search = $.get(this.form.attr('action'), this.form.getData() + '&form_submitted=1', 'json');
    search.done((data) => {
      this.tbody.html('');
      $.each(this.parseData(data), (i, item) => {
        this.appendRow(item, this.columns);
      });
      this.table.reset();
      $('table').trigger('click');
    })
  }

  parseData(data) {
    try {
      var data = $.parseJSON(data);
    } catch (e) {
      return;
    }
    return data;
  }

  appendRow(item, columns) {
    this.row = '<tr>';
    $.each(columns, (index, value) => {
      var keys = value.split('.');
      if (keys.length > 1) { // if column has '.' in it, dig into array
        var td = item;
        for (var i = 0; i < keys.length; i++) {
          if (typeof td[keys[i]] === 'undefined' || td[keys[i]] === null) {
            td = 'N/A';
            break;
          } else
            td = td[keys[i]];
        }
      } else
        td = item[value];
      if (/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/.test(td)) // test for 24 hour time
        td = this.regTime(td); // convert to regular time if this is the case
      this.row += '<td>' + td + '</td>';
    });
    this.row += '</tr>';
    this.tbody.append(this.row)
  }

  regTime(time) {
    var hr = time.split(':')[0],
      mn = time.split(':')[1],
      mer = ' AM',
      hr = typeof hr.split(' ')[1] === 'undefined' ? hr : hr.split(' ')[1];
    if (hr > 12) {
      hr -= 12;
      mer = ' PM';
    }
    if (hr[0] == '0') {
      hr = hr.substr(1);
    }
    var result = hr + ':' + mn + mer;
    return result;
  }

}

function formBuilder() {
  $container = $('#builder');
  if ($container.length) {
    var options = {
      disableFields: ['autocomplete', 'file', 'hidden'],
      disabledActionButtons: ['data'],
      onSave: function(formData) {
        var data = formBuilder.formData;
        // var data = formBuilder.actions.getData('json', true);
        var title = $("#form-title").val();
        ajaxFormBuild(data, title);
      },
    };
    var formBuilder = $container.formBuilder(options);
  }
}

function ajaxFormBuild(jsonData, title) {
  $.ajax({
    type: 'POST',
    url: '/form/create',
    data: ({
      'data': jsonData,
      'title': title,
      'form_submitted': 1
    }),
    success: function(response) {},
    error: function(request, status, error) {},
    complete: function() {
      setTimeout(function() {
        $('.overlay').html('');
      }, 1500);
    }
  });

}

function ajax() {
  barba.init({
    transitions: [{
      name: 'legacy',
      leave: function(data) {
        var done = this.async();
        TweenMax.to(data.current.container, .3, {
          opacity: 0,
          onComplete: done,
        });
      },
      enter: function(data) {
        var done = this.async();
        TweenMax.from(data.next.container, .3, {
          opacity: 0,
          onComplete: function() {
            done();
            loadViaAjax();
          }
        });
      },
    }, ],
  });
}

function helpModal() {
  $('body').on('click', '.modal-trigger', function(e) {
    e.preventDefault();
    dataModal = $(this).attr("data-modal");
    $.getJSON('/resources/json/help.json', function(data) {
      $modal_body = $('body #help-modal .modal-body');
      $('body #help-modal .modal-body p').remove();
      $.each(data, function(key, val) {
        if (key == dataModal) {
          $('.modal-header h1').html(val['header']);
          $.each(val['paragraphs'], function(key, val) {
            $('<p>' + val + '</p>').insertBefore('br.modal-breakline');
          })
        }
      })
    })
    $('#help-modal').css("display", "block");
    // $("body").css({"overflow-y": "hidden"}); //Prevent double scrollbar.
  });

  // $(".close-modal, .modal-sandbox").click(function() {
  $('body').on('click', '.close-modal, .modal-sandbox', function() {
    $(".modal").css("display", "none");
    // $("body").css({"overflow-y": "auto"}); //Prevent double scrollbar.
  });
}
$.fn.extend({
  getData: function() {
    return $(this).find('input, select').filter(function(index, element) {
      return $(element).val() != '';
    }).serialize();
  }
})

function autoGenUserPin() {
  $('body').on('input', '.user-pin--input', function(e) {
    $that = $(this);
    $alert = $(this).siblings('.alert');
    if ($(this).val().length >= 4) {
      var pin_exists = $.post('/users/getpin', {
        value: $that.val()
      });
      $alert.removeClass('hidden');
      pin_exists.done(function(data) {
        if (data == 0)
          $alert.text('This pin is not in use.').removeClass('alert-danger').addClass('alert-success');
        else
          $alert.text('This pin is in use.').removeClass('alert-success').addClass('alert-danger');
      })
    }
  })
  $('body').on('click', '.user-pin--button', function(e) {
    var promise = ajaxGet(e, $(this));
    $alert = $(this).siblings('.alert');
    promise.done(function(data) {
      $alert.text('This pin is not in use.').removeClass('alert-danger').addClass('alert-success');
      $('#user_pin').val(data);
    })
  })
}


function ajaxGet(e, $obj) {
  e.preventDefault();
  e.stopPropagation();
  return $.get($obj.attr('href'));
}

function hamburger() {
  $('body').on('click', function(e) {
    $target = $(e.target);
    if ($target.parents('.hamburger').length)
      $('.hamburger, .side-nav, .overlay').toggleClass('is-active');
    else
      $('.hamburger, .side-nav, .overlay').removeClass('is-active');
  })
}

function activeLinks() {
  $('body').on('click', '.nav-item, jquery-accordion-menu-header li', function() {
    if ($(this).is('.nav-item')) {
      $('.nav-item').removeClass('active');
      $(this).addClass('active');
    } else if ($(this).is('.jquery-accordion-menu-header li')) {
      $('.jquery-accordion-menu-header li').removeClass('active');
      $(this).addClass('active');
    }
  })
}

function calendarInit(events = '') {
  if (!$('#calendar').length)
    return
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid'],
    defaultView: 'dayGridMonth',
    defaultDate: '2019-04-07',
    selectable: true,
    editable: true,
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events
  });
  calendar.render();
}


function autoComplete() {
  if (!$('.typeahead').length)
    return;
  var search = $.get('/clients/getall', 'form_submitted=1', 'json');
  var parsed = ''
  search.done((data) => {
    try {
      parsed = $.parseJSON(data);
    } catch (e) {
      return;
    }
    typeahead(parsed);
  })
  return parsed;
}

function typeahead(json) {
  var bl = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: json
  });
  bl.initialize();
  $('.typeahead').typeahead(
    null, {
      name: 'stocks',
      displayKey: 'name',
      source: bl.ttAdapter()
    }).on('typeahead:selected', function(event, data) {
    $('.typeahead').val(data.id);
    var search = $.get('/schedules/calendar', 'get_schedules=1&id=' + data.id, 'json');
    var parsed = ''
    search.done((scheduleJson) => {
      try {
        parsed = $.parseJSON(scheduleJson);
        $('#calendar').html('');
        calendarInit(calendarize(parsed));
      } catch (e) {
        return;
      }

    })
  });
}

function calendarize(data) {
  var schedulesJson = [];
  for (var value in data) {
    var user_name = '';
    if (typeof data[value]['user'] === 'undefined' || data[value]['user'] === null)
      user_name = 'Unscheduled';
    else
      user_name = data[value]['user']['display_name']
    schedulesJson.push({
      'title': user_name,
      'start': data[value]['shift_date'] + 'T' + data[value]['shift_start'],
      'end': data[value]['shift_date'] + 'T' + data[value]['shift_end']
    })
  }
  return schedulesJson;
}

function loadViaAjax() {
  formBuilder();
  var searchForm = new ajaxForm();
  calendarInit();
  disableAutofill();
  datePicker();
  autoComplete();
}
