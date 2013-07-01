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
          
          console.log('[Crypto API] Crypto.' +
            msg.data.debug + ' returned: ', msg.data.result);
          
          callback.call(context, msg.data.result);
          
          delete context; delete callback; delete msg;
         
          _this.active--; _this.nextJob();

        };

        this.workers.push(worker);

      }

    };

    this.createWorkers();
    
    this.broadcastJob = function (job) {
      
      if (!job.id)
        job.id = Math.random()*Math.exp(40).toString();

      for (var i = 0; i < this.workers.length; i++ ) {
        this.workers[i].postMessage(job);
      }
      
      this.callbacks[job.id] = function () {};
      
    };

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
      
      var job = this.jobs.pop();

      //var minIndex = Math.floor(Math.random() * (this.size + 1));
      
      //alert(minIndex);
      
      if (job) {
        //this.pending[0]++;
        this.active++;
        this.workers[0].postMessage(job);
        //  job, this.channels[minIndex]);
      }

    };

}