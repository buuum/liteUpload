(function($) {
  var ajaxQueue;
  ajaxQueue = $({});
  $.ajaxQueue = function(ajaxOpts) {
    var dfd, doRequest, jqXHR, promise;
    jqXHR = void 0;
    dfd = $.Deferred();
    promise = dfd.promise();
    doRequest = function(next) {
      jqXHR = $.ajax(ajaxOpts).done(dfd.resolve).fail(dfd.reject).error(dfd.promise).then(next, next);
    };
    ajaxQueue.queue(doRequest);
    promise.abort = function(statusText) {
      var index, queue;
      if (jqXHR) {
        return jqXHR.abort(statusText);
      }
      queue = ajaxQueue.queue();
      index = $.inArray(doRequest, queue);
      if (index > -1) {
        queue.splice(index, 1);
      }
      dfd.rejectWith(ajaxOpts.context || ajaxOpts, [promise, statusText, '']);
      return promise;
    };
    return promise;
  };
})(jQuery);
