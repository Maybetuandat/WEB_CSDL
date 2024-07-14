window.addEventListener('DOMContentLoaded', function() {
    function checkOrientation() {
        if (window.innerWidth < 1024 && window.innerWidth < window.innerHeight) {
            // alert("Vui lòng quay ngang màn hình để có trải nghiệm tốt nhất.")
            if (!sessionStorage.getItem('alertShown')) {
                alert('Vui lòng quay ngang màn hình để có trải nghiệm tốt nhất.');
                sessionStorage.setItem('alertShown', 'true');
            }
        }
    } 
    checkOrientation();
});
