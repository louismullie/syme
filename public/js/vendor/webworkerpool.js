function WorkerPool(url, size, callback) {

    this.url = url;
    this.size = size;

    this.callback = callback;
    this.contexts = {};

    this.jobs = [];
    this.pending = [];
    this.workers = [];
    this.active = 0;

    for(i = 0; i < this.size; i++) {
      this.pending[i] = 0;
    }

    this.createWorkers = function () {

      var _this = this;

      for (var n = 0; n < this.size; n += 1) {

        var worker = new Worker(this.url);

        worker.onmessage = function (msg) {

          var context = _this.contexts[msg.data.id];
          _this.callback.call(context, msg);
          _this.active--;
          _this.nextJob();

        };

        this.workers.push(worker);

      }

    };

    this.createWorkers();

    console.log(this.workers);

    this.queueJob = function(job, context) {

      this.jobs.push(job);
      this.contexts[job.id] = context;

      if (this.active < this.size) {
        this.nextJob();
      }

    };

    this.nextJob = function() {

      var minValue = 0, minIndex = 0;

      // Find worker with smallest queue.
      for (var i = 0; i < this.size; i++) {

        if (this.pending[i] <= minValue) {
          minValue = this.pending[i];
          minIndex = i;
        }

      }

      var job = this.jobs.pop();

      if (job) {
        this.active++;
        this.workers[minIndex].postMessage(job);
      }


    };

}