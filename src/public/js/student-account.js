// const { getHasPermission } = require("../../services/permission.service");
// const bcrypt = require('bcrypt')

function openPopUp(id) {


    var details = document.getElementById(id);
    details.style.display = 'block';
}

function closePopUp(id) {
    var details = document.getElementById(id);

    document.getElementById('msv').value = ""
    document.getElementById('name').value = ""
    document.getElementById('class').value = ""
    document.getElementById('email').value = ""
    document.getElementById('password').value = ""

    document.getElementById('edit-msv').value = ""
    document.getElementById('edit-name').value = ""
    document.getElementById('edit-class').value = ""
    document.getElementById('edit-email').value = ""
    document.getElementById('edit-password').value = ""


    details.style.display = 'none';
}

async function submitForm(id) {
    // //console.log("hello")
    var details = document.getElementById(id);


    var formData = {
        msv: document.getElementById('msv').value,
        name: document.getElementById('name').value,
        class: document.getElementById('class').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    if (!formData.msv || !formData.name || !formData.class || !formData.email || !formData.password) {
        showAlert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    details.style.display = 'none';

    await fetch('/api/new-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.statusCode === 409) {
                showAlert('Mã sinh viên đã tồn tại!')
            }
            else if (response.statusCode === 400) {
                showAlert('Mật khẩu tối thiểu 9 ký tự')
            }
            return response.json();
        })
        .then(data => {
            // Xử lý phản hồi từ backend nếu cần
            window.location.href = "/admin/account";
            //console.log(data);
        })
        .catch(error => {
            console.error('There was an error with the fetch operation:', error);
            showAlert("Đã xảy ra lỗi khi thêm tài khoản!")
        });

    // Ngăn chặn form submit mặc định
    return false;
}


async function deleteAccount(id) {

    try {

        const response = await fetch('/api/delete-student/${id}', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data)
        if (data.status === 200) {
            window.location.href = "/admin/account";
        } else {
            showAlert('Xóa không thành công!')
        }
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu xóa:', error);
        showAlert('Đã xảy ra lỗi khi xóa tài khoản!')
    }
}

function confirmDeleteAccount(itemId) {
    var confirmed = confirm("Bạn có chắc chắn muốn xóa tài khoản này không?");
    if (confirmed) {
        deleteAccount(itemId);
    }
}

async function getStudentData(id, msv, role) {

    var details = document.getElementById(id);
    details.style.display = 'block';
    var url = '/api/get-student/' + msv;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            var student = data.data[0];

            // var password = student.MatKhau;

            document.getElementById('edit-msv').value = student.MSV
            document.getElementById('edit-name').value = student.Ten
            document.getElementById('edit-class').value = student.Lop
            document.getElementById('edit-email').value = student.Email
            document.getElementById('edit-password').value = ""

            // //console.log(data.data[0]);
        })
        .catch(error => {
            console.error('There was an error with the fetch operation:', error);
        });
}


function finishEdit(id) {
    var details = document.getElementById(id);


    var formData = {
        name: document.getElementById('edit-name').value,
        class: document.getElementById('edit-class').value,
        email: document.getElementById('edit-email').value,
        password: document.getElementById('edit-password').value
    };
    //console.log(formData);

    if (!formData.name || !formData.class || !formData.email || !formData.password) {
        showAlert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    var url = '/api/update-student/' + document.getElementById('edit-msv').value
    //console.log(url);
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.statusCode === 409) {
                showAlert('Mã sinh viên đã tồn tại!')
            }
            else if (response.statusCode === 400) {
                showAlert('Mật khẩu tối thiểu 9 ký tự')
            }
            return response.json();
        })
        .then(data => {
            window.location.href = "/admin/account";
            // Xử lý phản hồi từ backend nếu cần
            //console.log(data);
        })
        .catch(error => {
            showAlert("Đã xảy ra lỗi khi cập nhật tài khoản!")
            console.error('There was an error with the fetch operation:', error);
        });

    details.style.display = 'none';

}

async function handleFile(event) {

    const input = event.target;

    if (input.files.length === 0) {
        console.log('No file selected.');
        return;
    }

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = async function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            // console.log('File data:', data);

            const workbook = XLSX.read(data, { type: 'array' });
            // console.log('Workbook:', workbook);

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // console.log('Worksheet:', worksheet);

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // console.log('JSON Data:', jsonData);

            if (jsonData.length === 0) {
                console.log('No data found in sheet.');
                return;
            }

            // const firstColumnData = jsonData.map(row => row[0]).filter(cell => cell !== undefined);
            const fiveColumnsData = jsonData.map(row => ({
                MSV: row[0],
                Ten: row[2] + ' ' + row[3],
                Lop: row[4],
                TaiKhoan: row[0],
                MatKhau: row[0],
                // ThoiGian: null,
                // AccessToken: null
            })).filter(row => row.MSV !== undefined);

            console.log('Five Columns Data:', fiveColumnsData);

            await fetchNewAccApi(fiveColumnsData);
            // reloadPage()
        } catch (error) {
            console.error('Error processing file:', error);
        }
    };

    reader.onerror = function (error) {
        console.error('FileReader error:', error);
    };

    reader.readAsArrayBuffer(file);
}

function reloadPage() {
    window.location.href = "/admin/account";
}


async function fetchNewAccApi(accList) {
    try {
        console.log("loading")
        const response = await fetch('/api/new-student-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accList)
        });

        if (!response.ok) {
            showAlert('Đã xảy ra lỗi khi thêm tài khoản!');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            console.log(response.status);
        }

        reloadPage();
    } catch (error) {
        showAlert('Đã xảy ra lỗi khi thêm tài khoản!');
        console.error('Error fetching new account API:', error);
    }
}
