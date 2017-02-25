//
function warn(mess) {
    alert(mess);
    return false;
}
//
function sendQuery(form, event) {
    event.preventDefault();
    if (!$('#q-select').find('input:radio:checked').length) {
        return warn('Select a query type');
    }
    var $form = $(form),
        query = $form.find('#q-text')[0].value,
        method = $form.find('input:radio:checked')[0].value,
        // radio_get = $('#radio-get')[0],
        radio_post = $('#radio-post')[0],
        radio_patch = $('#radio-patch')[0],
        // radio_delete = $('#radio-delete')[0],
        $informer = $('#sending'),
        $informer_fail = $('#fail');

    if (query) query = '/' + query;

    var config = {
        headers:{
            authorization: 'token b3632544-c7e4-469e-84ee-ae28b1c51b62'
        },
        method: method,
        url: 'https://jsonbin.org/srgg6701' + query,
        beforeSend: function () {
            $informer.removeClass('hidden');
            $informer_fail.addClass('hidden');
        }
    };
    if (radio_post.checked || radio_patch.checked) config.data = JSON.parse($('#q-data')[0].value);

    console.log({form: form, query: query, config: config});
    $.ajax(config).done(function (data) {
        console.log('data=>', data);
    }).fail(function(){
        $informer_fail.removeClass('hidden');
    }).always(function(){
        $informer.addClass('hidden');
    });
}

$(function () {
    var $radios = $('#q-select').find('input:radio'),
        $textarea = $('#q-data');
    $radios.on('click', function () {
        console.log({'this.value=>': this.value, $textarea:$textarea});
        $textarea[(this.value == 'post' || this.value == 'patch') ? 'removeClass' : 'addClass']('hidden');
    });
});