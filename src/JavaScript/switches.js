var isPublic = false;
(function() {
    $(document).ready(function() {
        $('.switch-input2').on('change', function() {
            var isChecked = $(this).is(':checked');
            if (isChecked) {
                clearInterval();
                isPublic = true;
            } else {
                clearInterval();
                isPublic = false;
            }
        });
    });
})();