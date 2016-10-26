$.fn.liteUpload = function(userOptions) {
  var checkFiles, defaults, options, progressHandlingFunction;
  defaults = {
    script: null,
    maxSize: null,
    minSize: null,
    allowedFileTypes: null,
    onClick: function(button) {
      return true;
    },
    onBefore: function(button) {},
    onSelectFiles: function(files) {
      return true;
    },
    onProgress: function(percent, fileactual, filetotal) {},
    onEnd: function(button) {},
    onSuccess: function(response, fileactual, button) {},
    onFail: function(jqXHR, button) {},
    onError: function(jqXHR, button) {}
  };
  options = $.extend(defaults, userOptions);
  progressHandlingFunction = function(e) {
    var percent;
    if (e.lengthComputable) {
      percent = Number((e.loaded * 100 / e.total).toFixed(2));
      options.onProgress(percent, options.fileActual, options.fileTotal);
      if (options.fileActual === options.fileTotal) {
        options.onEnd(options.button);
      }
    }
  };
  this.each(function(i) {
    var $this, button;
    $this = $(this);
    if ($this.css('position') !== 'absolute' && $this.css('visibility') !== 'hidden') {
      $this.css('position', 'absolute');
      $this.css('visibility', 'hidden');
      button = $this.next('a');
      button.on('click', function(e) {
        e.preventDefault();
        if (options.onClick($(this))) {
          $(this).prev('input[type="file"]').trigger('click');
        }
      });
    }
  });
  checkFiles = function(files) {
    var file, i;
    i = 0;
    while (i < files.length) {
      file = files[i];
      if (options.maxSize) {
        if (file.size > options.maxSize * 1024) {
          return 'max size exceded';
        }
      }
      if (options.minSize) {
        if (file.size < options.minSize * 1024) {
          return 'min is ' + options.minSize * 1024;
        }
      }
      i++;
    }
  };
  this.change(function() {
    var $this, button, file, formData, i;
    $this = $(this);
    options.fileActual = 0;
    options.fileTotal = 0;
    button = $this.next('a');
    options.button = button;
    options.onBefore(button);
    if (!options.onSelectFiles(this.files)) {
      return;
    }
    checkFiles(this.files);
    options.fileActual = 1;
    i = 0;
    while (i < this.files.length) {
      options.fileTotal++;
      formData = new FormData;
      file = this.files[i];
      formData.append($this.attr('name') + '[]', file);
      formData.append('name_image', this.name);
      formData.append('position', i);
      $.ajaxQueue({
        url: options.script,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        xhr: function() {
          var myXhr;
          myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
            myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
          }
          return myXhr;
        },
        cache: false,
        success: function(response) {
          options.onSuccess(response, options.fileActual, button);
          options.fileActual++;
        },
        fail: function(jqXHR) {
          options.onFail(jqXHR, button);
        },
        error: function(jqXHR) {
          options.onError(jqXHR.statusText, button);
        }
      });
      i += 1;
    }
  });
};
