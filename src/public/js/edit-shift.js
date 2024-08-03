async function editShiftSubmit() {
    const form = document.getElementById('edit-shift-form');

    event.preventDefault();

    // Lấy dữ liệu từ form
    const formData = new FormData(form);
    const data = {
        MaCaThi: formData.get('id'),
        MaBaiThi: formData.get('test'),
        start: formData.get('start'),
        end: formData.get('end')
    };

    console.log('Form Data:', data);


    await fetch('/admin/shift/api/edit-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            if (result.status == 200) {
                alert('Cập nhật thành công!');
                window.location.href = '/admin/shift';
            }
            else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }


        })
        .catch(error => {
            // console.error('Error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        });
}

async function createShiftSubmit() {
    const form = document.getElementById('new-shift-form');


    event.preventDefault();

    const formData = new FormData(form);


    const test = formData.get('test');
    const start = formData.get('start');
    const end = formData.get('end');


    const formatDateTimeToISO = (datetime) => {

        if (!datetime) return null;

        const date = new Date(datetime);
        return date.toISOString();
    };

    const startISO = formatDateTimeToISO(start);
    const endISO = formatDateTimeToISO(end);

    const data = {
        MaBaiThi: test,
        start: startISO,
        end: endISO
    };

    console.log('Form Data:', data);


    await fetch('/admin/shift/api/new-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            // console.log('Success:', result);
            if (result.status == 200) {
                alert('Cập nhật thành công!');
                window.location.href = '/admin/shift';
            }
            else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }


        })
        .catch(error => {
            // console.error('Error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        });
}

function shiftCancel() {
    window.location.href = '/admin/shift';
}