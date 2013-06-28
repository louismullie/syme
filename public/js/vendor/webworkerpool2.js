function WorkerPool2(url, size) {

    this.url = url;
    this.size = size;

    this.callbacks = {};
    this.contexts = {};

    this.jobs = [];
    this.pending = [];
    this.workers = [];
    this.active = 0;
    //this.channels = {};

    for(i = 0; i < this.size; i++) {
      this.pending[i] = 0;
    }

    this.createWorkers = function () {

      var _this = this;
      
      for (var n = 0; n < this.size; n += 1) {

        var worker = new Worker(this.url);
        
        //this.channels[n] = {};
        
        //for (var o = 0; o < this.size; o += 1) {
        //  if (n == 0) continue;
        //  this.channels[o].push(new MessageChannel()); 
        //}
        
        worker.onmessage = function (msg) {

          var context = _this.contexts[msg.data.id];
          var callback = _this.callbacks[msg.data.id];
          
          callback.call(context, msg.data);
          
          delete context;
          delete callback;
          delete msg;
          
          _this.active--;
          _this.nextJob();

        };

        this.workers.push(worker);

      }

    };

    this.createWorkers();

    this.queueJob = function(job, callback, context) {

      if (!job.id)
        job.id = Math.random()*Math.exp(40).toString();
        
      this.jobs.push(job);
      this.callbacks[job.id] = callback || function () {};
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
        //  job, this.channels[minIndex]);
      }

    };

}