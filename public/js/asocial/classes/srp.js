function SRP(login, password) {

  var N = new BigInteger("eeaf0ab9adb38dd69c33f80afa8fc5e86072618775ff3c0b9ea2314c9c256576d674df7496ea81d3383b4813d692c6e0e0d5d8e250b98be48e495c1d6089dad15dc7d7b46154d6b6ce8ef4ad69b15d4982559b297bcf1885c529f566660e57ec68edbc3c05726cc02fd4cbf4976eaa9afd5138fe8376435b9fc61d2fc0eb06e3", 16);
  var g = new BigInteger("2");
  var k = new BigInteger("e61280ff3ebfd61c049dd01abc0c067b76854d0827e94ad8da08d7b0108a1942", 16);
  
  var rng = new SecureRandom();
  
  var aNum = null;
  var A = null;
  var S = null;
  var K = null;
  var M = null;
  var M2 = null;
  var authenticated = false;

  this.calcA = function() {
    aNum = new BigInteger(32, rng);
    A = g.modPow(aNum, N);
  };
  
  this.getA = function () {
    return A;
  }
  
  this.calcA();
  
  this.calcV = function(salt) {
    
    var x = this.calcX(salt);
    var v = g.modPow(x, N);
    
    return v;
    
  }

  this.calcX = function(salt) {
    
    var shex = new BigInteger(salt).toString(16);
    var spad = shex.length % 2 != 0 ? '0' : '';
    
    var Xhex = sha256(spad + shex + sha256(login + ":" + password));
    var Xint = new BigInteger(new BigInteger(Xhex, 16).toString());
    
    return Xint;
  };
  
  this.calcM = function(salt, Bstr)
  {
    
    var B = new BigInteger(Bstr);
    var u = this.calcU(A, B);
    var xNum = this.calcX(salt);

    var bnk = B.add(N.multiply(k));
    var gxn = k.multiply(g.modPow(xNum, N));
    var term1 = bnk.subtract(gxn).mod(N);
    var term2 = xNum.multiply(u).add(aNum);
    var ssc = term1.modPow(term2, N);
    
    return ssc;

  };
  
  this.calcU = function(A, B) {
    
    var aahex = A.toString(16);
    var bbhex = B.toString(16);
    
    var apad = 256 - aahex.length + 1;
    var bpad = 256 - bbhex.length + 1;
    
    var hashin = Array(apad).join("0") + aahex +
                 Array(bpad).join("0") + bbhex;

    var u = new BigInteger(sha256(hashin), 16);
    
    return u;
  }

  function sha256(s) {
    
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(s));
    
  }

};