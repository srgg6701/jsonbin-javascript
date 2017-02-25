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
    var userData = getLocalUserData(),
        $form = $(form),
        query = $form.find('#q-text')[0].value,
        method = $form.find('input:radio:checked')[0].value,
        // radio_get = $('#radio-get')[0],
        radio_post = $('#radio-post')[0],
        radio_patch = $('#radio-patch')[0],
        // radio_delete = $('#radio-delete')[0],
        $informer_console = $('#informer-console'),
        $informer_sending = $('#informer-sending'),
        $informer_fail = $('#informer-fail');

    if (query) query = '/' + query;

    var config = {
        headers:{
            authorization: 'token ' + userData.jsonbin_api_key
        },
        method: method,
        url: 'https://jsonbin.org/' + userData.jsonbin_user_name + query,
        beforeSend: function () {
            $informer_sending.removeClass('hidden');
            $informer_fail.addClass('hidden');
            $informer_console.addClass('hidden');
        }
    };
    if (radio_post.checked || radio_patch.checked) {
        var dataValue = $('#q-data')[0].value;
        if(!dataValue){
            warn('You should set data to be sent');
            return false;
        }
        config.data = JSON.parse(dataValue);
    }

    console.log({form: form, query: query, config: config});
    $.ajax(config).done(function (data) {
        console.log('data=>', data);
        $informer_console.removeClass('hidden');
    }).fail(function(){
        $informer_fail.removeClass('hidden');
        $informer_console.addClass('hidden');
    }).always(function(){
        $informer_sending.addClass('hidden');
    });
}

function getLocalUserData(){
    return {
        jsonbin_api_key:localStorage.getItem('jsonbin_api_key'), 
        jsonbin_user_name:localStorage.getItem('jsonbin_user_name')
    };
}

$(function () {
    // check localStorage
    var userData = getLocalUserData(),
        $restForm = $('#rest-form'),
        $storageForm = $('#storage-form');
    
    if(!userData.jsonbin_api_key || !userData.jsonbin_user_name){
        //
        $storageForm.removeClass('hidden');
    }else{
        $restForm.removeClass('hidden');
    }

    $('#btn-store-user-data').on('click', function (event){
        event.preventDefault();
        var $form = $('#storage-form'),
            userName = $form.find('#user_name').val(),
            apiKey = $form.find('#api_key').val();
        if(!userName || !apiKey){
            warn('You should point out both User name and API key!');
            return false;
        }else{
            localStorage.setItem('jsonbin_user_name', userName);
            localStorage.setItem('jsonbin_api_key', apiKey);
            $restForm.removeClass('hidden');
            $storageForm.remove();
        }
    });
    
    var $radios = $('#q-select').find('input:radio'),
        $textarea = $('#q-data');
    $radios.on('click', function () {
        console.log({'this.value=>': this.value, $textarea:$textarea});
        $textarea[(this.value == 'post' || this.value == 'patch') ? 'removeClass' : 'addClass']('hidden');
    });
});