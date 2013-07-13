function WorkerPool2(url, size) {

    this.url = url;
    this.size = size;

    this.callbacks = {};
    this.contexts = {};

    this.jobs = [];
    this.pending = [];
    this.workers = [];
    this.schedule = {};
    this.counters = {};
    
    this.active = 0;
    //this.channels = {};

    for(i = 0; i < this.size; i++) {
      this.pending[i] = 0;
    }

    this.createWorkers = function () {

      var _this = this;

      for (var n = 0; n <= this.size; n += 1) {

        var worker = new Worker(this.url);

        //this.channels[n] = {};

        //for (var o = 0; o < this.size; o += 1) {
        //  if (n == 0) continue;
        //  this.channels[o].push(new MessageChannel());
        //}

        worker.onmessage = function (msg) {

          var context = _this.contexts[msg.data.id];
          var callback = _this.callbacks[msg.data.id];

          callback.call(context, msg.data.result);

          delete context; delete callback; delete msg;

          _this.active--; _this.nextJob();

        };

        this.workers.push(worker);

      }

    };

    this.createWorkers();

    this.broadcastJob = function (job, callback) {
      
      var _this = this;
      
      if (!job.id)
        job.id = Math.random()*Math.exp(40).toString();

      for (var i = 0; i < this.workers.length; i++ ) {
        this.workers[i].postMessage(job);
      }

      this.counters[job.id] = this.size;
      
      this.callbacks[job.id] = function () {
        
        _this.counters[job.id]--;
        
        if (_this.counters[job.id] == 0)
          callback();
          
      };

    };

    this.queueJob = function(job, callback, context) {

      if (!job.id)
        job.id = Math.random()*Math.exp(40).toString();

      this.jobs.push(job);
      this.callbacks[job.id] = callback || function () {};
      this.contexts[job.id] = context;
      
      var workerId = Math.floor(Math.random() * (this.size));
      
      this.schedule[job.id] = workerId;
      
      if (this.active < this.size) {
        this.nextJob();
      }
      
      return workerId;

    };

    this.scatterJob = function(job) {
      
      var fn = job.fn;
      
      delete job.fn;
      
      for (var n = 0; n <= this.size; n += 1) {
        job.params = fn();
        this.sendJob(n, job);
      }
      
    };
    
    this.sendJob = function (workerIndex, job, callback) {
      
      if (!job.id)
        job.id = Math.random()*Math.exp(40).toString();
      
      this.callbacks[job.id] = callback || function () {};
      this.contexts[job.id] = undefined;

      this.workers[workerIndex].postMessage(job);
      
    };
    
    this.nextJob = function() {

      var minValue = 0, minIndex = 0;

      var job = this.jobs.pop();

      if (job) {
        var index = this.schedule[job.id];
        this.active++;
        this.workers[index].postMessage(job);
      }
    
    };

}