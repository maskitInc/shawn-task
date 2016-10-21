$(document).ready(function() {

});

var currentDataFile;

var table = $('#myTable').DataTable();

$('.files-list li a').on('click', function(e) {
    $('.grid_descr').text($(this).text());
    currentDataFile = $(this).attr('data-link');
    createTable();
    e.preventDefault();
});

function createTable() {

    table.destroy();
    $('#example').empty();
    var cols = [],
        dataBase,
        jqxhr = $.ajax('data/' + currentDataFile + '.json').done(function() {

            dataBase = JSON.parse(jqxhr.responseText);

            var keys = Object.keys(dataBase['data'][0]);

            keys.forEach(function(k) {
                cols.push({
                    title: '<div class="col_title">' + k + '</div>',
                    data: k
                });
            });

            cols.push({
                title: '<div class="col_title settings_col">Settings</div>'
            });

            var targetNum,
                disableSortWord;

            if (currentDataFile === 'one') {
                disableSortWord = "source";
                targetNum = keys.indexOf(disableSortWord);
            } else {
                disableSortWord = "requested_amount";
                targetNum = keys.indexOf(disableSortWord);
            }

            //initialize DataTables
            table = $('#example').DataTable({
                columns: cols,
                columnDefs: [{
                    targets: [0],
                    render: function(data) {
                        return '<a href="/test_link?id={' + data + '}">' + data + '</a>';
                    }
                }, {
                    targets: targetNum,
                    orderable: false
                }, {
                    targets: [-1],
                    orderable: false,
                    data: null,
                    className: "btns_set",
                    mRender: function(data) {
                      return '<a class="btn btn-default" href="#' + data + '" aria-label="Edit"><i class="fa fa-pencil" aria-hidden="true"></i></a>' + '<a class="btn btn-default" href="#/' + data + '" aria-label="Show"><i class="fa fa-eye" aria-hidden="true"></i></a>' + '<a class="btn btn-default" href="#/' + data + '" aria-label="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
                    }
                }],
                drawCallback: function(settings) {
                    var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
                    var tablesInfo = $(this).closest('.dataTables_wrapper').find('.dataTables_info').parent();

                    if (this.api().page.info().pages > 1 === true) {
                        pagination.show();
                        tablesInfo.removeClass('centered');
                    } else {
                        pagination.hide();
                        tablesInfo.addClass('centered');
                    }
                }
            });

            //add data and draw
            $('#example').parent().addClass('compactStyle table-responsive');
            table.rows.add(dataBase['data']).draw();

        });
};
