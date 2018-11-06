"use strict";

$(document).ready(function() {
     request_list();
});

// Из формы в array
function getFormData(form){
    var unindexed_array = $(`${form}`).serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

// Сохраненное состояние
const saveState = {
    onFocusTableId:0,   // Выделения при нажатии
    filterSelect:0,     // Значение фильтра
    data:{}
}

// Обновление списка
const listUpdate = (data = saveState.data) => {
    saveState.data = data;
    $("div#root").empty();
    hiddenForms();
    if (data.length != 0) {
        $("#root").append(`
            <table id='root_table'>
                <tr>
                    <th>Имя</th>
                    <th>Тип</th>
                    <th>Номер потребителя</th>
                </tr>
            </table>
        `)
        data.forEach((customer) => {
            if (saveState.filterSelect == customer.type || saveState.filterSelect == 0){
                $("#root_table").append(`
                    <tr id='customer_id_${customer.id}' class="table_tr-noactive" onclick="openEditForm(${customer.id})">
                        <td id='customer_name_${customer.id}' class="customer_name" >
                            <p>${customer.name}</p>
                        </td>
                        <td id='customer_type_${customer.id}' class="customer_type" title="${(customer.type == 1) ? "Физическое лицо" : "Юридическое лицо"}">
                            <p class="ta_center">${(customer.type == 1) ? "Ф" : "Ю"}</p>
                        </td>
                        <td id='customer_number_${customer.id}' class="customer_number" >
                            <p class="ta_center">${customer.number}</p>
                        </td>
                    </tr>
                `);
            };
        })
        requestNewId();

        // <span onclick="deleteCustomer(${customer.id})"> X </span>

    } else if (data.length == 0){
        $("#root").append(`
            <p class="empty_table">
                Таблица пуста
            </p>
        `)
        idUpdate(1);
    }
}
// Запрос списка потребителей из базы
const request_list = () => {
    // Для работы с fakeAPI - Begin
    var obj = fakeAPI_RequestList()
    listUpdate(obj);
    // Для работы с fakeAPI - End

    // Для работы с сервером - Begin
    // $.ajax({
    //     url: "/request_list/",
    //     type: 'GET',
    //     success: function(data) {
    //         var obj = JSON.parse(data.content);
    //         listUpdate(obj);
    //     },
    // });
    // Для работы с сервером - End
}




// Фильтрация таблицы
$('#controlPanelFilterSelect').change(function(){
    var value = $(this).val();
    saveState.filterSelect = value;
    listUpdate();
});




// Добавление нового потребителя
$('#submitAddButton').click(function(event){
    event.preventDefault();
    // Для работы с fakeAPI - Begin
    var formData = getFormData("#addCustomer");
    fakeBASE.push({
        id:formData.customer_id,
        name:formData.customer_name,
        type:formData.customer_type,
        number:formData.customer_number
    });
    request_list();
    // Для работы с fakeAPI - End

    // Для работы с сервером - Begin
    // $.ajax({
    //     url: '/add_new_customer/',
    //     type: 'post',
    //     dataType: 'json',
    //     data: $('#addCustomer').serialize(),
    //     success: function(data) {
    //         var obj = JSON.parse(data.content);
    //         listUpdate(obj);
    //     },
    // });
    // Для работы с сервером - End
});

// Удаление потребителя из базы
const deleteCustomer = (id) => {
    // Для работы с fakeAPI - Begin
    var newFakeBASE = [];
    fakeBASE.forEach((customer) => {
        if (customer.id != id){
            newFakeBASE.push(customer);
        }
    });
    fakeBASE = newFakeBASE;
    request_list();
    // Для работы с fakeAPI - End

    // Для работы с сервером - Begin
    // $.ajax({
    //     url: "/delete_customer/"+id,
    //     type: 'GET',
    //     success: function(data) {
    //         var obj = JSON.parse(data.content);
    //         listUpdate(obj);
    //     },
    // });
    // Для работы с сервером - End
}

// Обновление ID в input
const idUpdate = (data) => {
    $('#addCustomer #customer_id').val(data);
}

// Запрос ID
const requestNewId = () => {
    // Для работы с fakeAPI - Begin
    var max_id = 0;
    fakeBASE.forEach((customer) => {
        if (customer.id > max_id) {
            max_id = customer.id;
        }
    })
    idUpdate(+max_id+1);
    // Для работы с fakeAPI - End

    // Для работы с сервером - Begin
    // $.ajax({
    //     url: "/request_new_id/",
    //     type: 'GET',
    //     success: function(data) {
    //         var obj = JSON.parse(data.content);
    //         idUpdate(obj);
    //     },
    // });
    // Для работы с сервером - End
}

// Открытие формы редактирования нового потребителя
const openEditForm = (id) =>  {
    hiddenForms();
    $("#editCustomer #customer_id").val( id );
    $("#editCustomer #customer_name").val(
        $(`#customer_name_${id} p`).html()
    );
    $("#editCustomer #customer_number").val(
        $(`#customer_number_${id} p`).html()
    );
    $("#editCustomer select").val(
        ($(`#customer_type_${id} p`).html() == "Ф") ? 1 : 2
    );
    $("#delCustomerButton").attr("onclick",`deleteCustomer(${id})`);
    // Сохраняем ID для выделения и отмены выделения в таблице
    saveState.onFocusTableId = id;
    // Выделение в таблице
    $(`#customer_id_${id}`).attr("class","table_tr-active");

    $("#editCustomer").css("display","block");
}

// Сохранение изменений в форме редактирования
$('#submitEditButton').click(function(event){
    event.preventDefault();
    // Для работы с fakeAPI - Begin
    var formData = getFormData("#editCustomer");
    fakeBASE.forEach((customer) => {
        if (customer.id == +formData.customer_id) {
            customer.name = formData.customer_name
            customer.type = formData.customer_type
            customer.number = formData.customer_number
        }
    })
    request_list();
    // Для работы с fakeAPI - End

    // Для работы с сервером - Begin
    // $.ajax({
    //     url: '/edit_customer/',
    //     type: 'post',
    //     dataType: 'json',
    //     data: $('#editCustomer').serialize(),
    //     success: function(data) {
    //         var obj = JSON.parse(data.content);
    //         listUpdate(obj);
    //     },
    // });
    // Для работы с сервером - End
});


// Открытие формы добавления нового потребителя
const showFormAddNewCustomer = () => {
    hiddenForms();
    $("#addCustomer").css("display","block");
}

// Скрытие форм при нажатии кнопки Отмена
const hiddenForms = () => {
    $(`#customer_id_${saveState.onFocusTableId}`).attr("class","table_tr-noactive");
    saveState.onFocusTableId = 0;
    $(".control_panel_form").css("display","none");
    $("#customer_name, #customer_number").val('');
    $("#addCustomer select").val(1);
}

// Клик на кнопках Отмена
$('.hidden_forms').click(function(event){
    event.preventDefault();
    hiddenForms();
});
