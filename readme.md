LiteUpload - Simple jquery upload file
======================================

## Install

### Bower

Buuum is available on Bower and can be installed using:

```
bower install liteupload
```

### Simple usage

```html
<html>
<head>
    <title>liteUplaod</title>
    <script src="https://code.jquery.com/jquery-2.2.3.min.js" crossorigin="anonymous"></script>
    <script src="../liteupload/js/ajaxqueu.js"></script>
    <script src="../liteupload/js/liteupload.js"></script>

    <script>
        $(function () {
            $('.liteupload').liteUpload({
                script: 'upload.php',
                onClick: function (button) {
                    console.log('click button');
                    return true;
                },
                onBefore: function (button) {
                    console.log('before');
                },
                onSelectFiles: function (files) {
                    $('.listuploads').html('<ul></ul>');
                    for (var i = 0; i < files.length; i++) {
                        // get item
                        file = files[i];
                        console.log(file);
                        $('.listuploads').find('ul').eq(0).append('<li>' + file.name + '</li>');
                    }
                    $('#totaluploads').html(files.length);
                    return true;
                },
                onProgress: function (percent, fileactual, filetotal) {
                    console.log(percent, fileactual, filetotal);
                },
                onEnd: function (button) {
                    console.log('end');
                },
                onSuccess: function (response, fileactual, button) {
                    console.log(fileactual);
                    $('#countuploads').html(fileactual);
                    $('.listuploads').find('ul li').eq(fileactual - 1).append('<strong>'+response.msg+'</strong>');
                    console.log(response);
                    console.log(button);
                }
            });
        });
    </script>

</head>
<body>

<form action="#" method="post">

    <div id="count">
    <span id="countuploads"></span> / <span id="totaluploads"></span>
    </div>

    <input type="file" name="uploadfile" class="liteupload" multiple="multiple"/>
    <a href="#">ENVIAR</a>
    <input type="hidden" name="url" value="">

    <input type="file" name="uploadfile" class="liteupload" multiple="multiple"/>
    <a href="#">ENVIAR</a>

    <input type="file" name="uploadfile" class="liteupload" multiple="multiple"/>
    <a href="#">ENVIAR</a>

    <div class="listuploads">

    </div>

</form>


</body>
</html>
```

```php
<?php


$salida = [
    'error' => false,
    'msg' => 'upload'
];


$image_name = $_POST['name_image'];
move_uploaded_file($_FILES[$image_name]['tmp_name'][0], $_FILES[$image_name]['name'][0]);

echo json_encode($salida);
```