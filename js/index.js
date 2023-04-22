
$(document).ready(function () {
    $("#btnModal").click(() => {
        $("#myModal").modal();
    })
})

function formatToJson(preData) {
    postData = {};
    preData.split('&').forEach(function (keyValue) {
        var pair = keyValue.split('=');
        postData[pair[0]] = pair[1];
    });
    return postData;
}

function isValidForm(txtMa, txtMK, date) {
    var regex = [/BN-\d{5}$/, /.{6,}/];
    var inputDate = new Date(date);
    var isValid = true;

    if (!regex[0].test(txtMa)) {
        $("#error-message-txtMa").text("Mã bệnh nhân phải có định dạng BN-YYYYY (YYYYY là 5 chữ số). Vd: BN-12345");
        isValid = false;
    } else {
        $("#error-message-txtMa").text("")
    }
    if (!regex[1].test(txtMK)) {
        $("#error-message-txtMK").text("Mật khẩu phải chưa ít nhất 6 kí tự");
        isValid = false;
    } else {
        $("#error-message-txtMK").text("")
    }
    if (inputDate <= new Date()) {
        $("#error-message-date").text("Ngày khám phải lớn hơn ngày đặt lịch");
        isValid = false;
    } else {
        $("#error-message-date").text("")
    }
    return isValid;
}

$(document).ready(function () {
    $("#myModal form").submit(function (event) {
        event.preventDefault();

        var formData = $(this).serialize(); // Get data from Form
        try { // Get previous stt
            var stt = $('tbody tr:last-child td:first-child').text();
        } catch {
            var stt = 0;
        }

        // Format the data from the Form
        var dataObj = formatToJson(formData);

        // Check the Form is correct
        if (!isValidForm(dataObj['txtMa'], dataObj['txtMK'], dataObj['date'])) {
            return;
        }

        // Add fee
        var total = 0;
        $("input[type='checkbox']").each(function () {
            if ($(this).prop("checked")) {
                total += 500000;
            }
        });

        // Append patient into table
        console.log(dataObj['txtMa'], dataObj['txtMK'], dataObj)
        var newRow = `<tr>
                        <td>${++stt}</td>
                        <td>${dataObj['txtMa']}</td>
                        <td>${decodeURIComponent(dataObj['txtMK'])}</td>
                        <td>${new Date(dataObj['date']).toLocaleDateString('en-GB')}</td>
                        <td>${total}</td>
                        <td>${$('#sel1 option:selected').text()}</td>
                      </tr>`;
        $('table tbody').append(newRow);

        // Reset form
        $('#myForm')[0].reset();
        // Hide modal
        $('#myModal').modal('hide');

        // Notify form changed
        $("#success-alert").show();
        setTimeout(function () {
            $("#success-alert").animate({ opacity: '0' }, 1000, function () {
                $(this).css("opacity", '')
                $(this).hide();
            });
        }, 3000);
    });
});

