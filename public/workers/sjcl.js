"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
if(typeof module!="undefined"&&module.exports)module.exports=sjcl;
sjcl.cipher.aes=function(a){this.i[0][0][0]||this.B();var b,c,d,e,f=this.i[0][4],g=this.i[1];b=a.length;var h=1;if(b!==4&&b!==6&&b!==8)throw new sjcl.exception.invalid("invalid aes key size");this.a=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(a%b===0||b===8&&a%b===4){c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255];if(a%b===0){c=c<<8^c>>>24^h<<24;h=h<<1^(h>>7)*283}}d[a]=d[a-b]^c}for(b=0;a;b++,a--){c=d[b&3?a:a-4];e[b]=a<=4||b<4?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^
g[3][f[c&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(a){return this.K(a,0)},decrypt:function(a){return this.K(a,1)},i:[[[],[],[],[],[]],[[],[],[],[],[]]],B:function(){var a=this.i[0],b=this.i[1],c=a[4],d=b[4],e,f,g,h=[],i=[],j,k,l,m;for(e=0;e<0x100;e++)i[(h[e]=e<<1^(e>>7)*283)^e]=e;for(f=g=0;!c[f];f^=j||1,g=i[g]||1){l=g^g<<1^g<<2^g<<3^g<<4;l=l>>8^l&255^99;c[f]=l;d[l]=f;k=h[e=h[j=h[f]]];m=k*0x1010101^e*0x10001^j*0x101^f*0x1010100;k=h[l]*0x101^l*0x1010100;for(e=0;e<4;e++){a[e][f]=k=k<<24^k>>>8;b[e][l]=m=m<<24^m>>>8}}for(e=
0;e<5;e++){a[e]=a[e].slice(0);b[e]=b[e].slice(0)}},K:function(a,b){if(a.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var c=this.a[b],d=a[0]^c[0],e=a[b?3:1]^c[1],f=a[2]^c[2];a=a[b?1:3]^c[3];var g,h,i,j=c.length/4-2,k,l=4,m=[0,0,0,0];g=this.i[b];var n=g[0],o=g[1],p=g[2],q=g[3],r=g[4];for(k=0;k<j;k++){g=n[d>>>24]^o[e>>16&255]^p[f>>8&255]^q[a&255]^c[l];h=n[e>>>24]^o[f>>16&255]^p[a>>8&255]^q[d&255]^c[l+1];i=n[f>>>24]^o[a>>16&255]^p[d>>8&255]^q[e&255]^c[l+2];a=n[a>>>24]^o[d>>16&
255]^p[e>>8&255]^q[f&255]^c[l+3];l+=4;d=g;e=h;f=i}for(k=0;k<4;k++){m[b?3&-k:k]=r[d>>>24]<<24^r[e>>16&255]<<16^r[f>>8&255]<<8^r[a&255]^c[l++];g=d;d=e;e=f;f=a;a=g}return m}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.Q(a.slice(b/32),32-(b&31)).slice(1);return c===undefined?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(a.length===0||b.length===0)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return d===32?a.concat(b):sjcl.bitArray.Q(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;
if(b===0)return 0;return(b-1)*32+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(a.length*32<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;if(c>0&&b)a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1);return a},partial:function(a,b,c){if(a===32)return b;return(c?b|0:b<<32-a)+a*0x10000000000},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=
a[d]^b[d];return c===0},Q:function(a,b,c,d){var e;e=0;if(d===undefined)d=[];for(;b>=32;b-=32){d.push(c);c=0}if(b===0)return d.concat(a);for(e=0;e<a.length;e++){d.push(c|a[e]>>>b);c=a[e]<<32-b}e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,b+a>32?c:d.pop(),1));return d},j:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b+=String.fromCharCode(e>>>24);e<<=8}return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a.charCodeAt(c);if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,d*4)}};
sjcl.codec.base64={H:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.H,g=0,h=sjcl.bitArray.bitLength(a);if(c)f=f.substr(0,62)+"-_";for(c=0;d.length*6<h;){d+=f.charAt((g^a[c]>>>e)>>>26);if(e<6){g=a[c]<<6-e;e+=26;c++}else{g<<=6;e-=6}}for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d=0,e=sjcl.codec.base64.H,f=0,g;if(b)e=e.substr(0,62)+"-_";for(b=0;b<a.length;b++){g=e.indexOf(a.charAt(b));
if(g<0)throw new sjcl.exception.invalid("this isn't base64!");if(d>26){d-=26;c.push(f^g>>>d);f=g<<32-d}else{d+=6;f^=g<<32-d}}d&56&&c.push(sjcl.bitArray.partial(d&56,f,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.a[0]||this.B();if(a){this.p=a.p.slice(0);this.k=a.k.slice(0);this.f=a.f}else this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.p=this.O.slice(0);this.k=[];this.f=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.k=sjcl.bitArray.concat(this.k,a);b=this.f;a=this.f=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.G(c.splice(0,16));return this},finalize:function(){var a,b=this.k,c=this.p;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.f/
4294967296));for(b.push(this.f|0);b.length;)this.G(b.splice(0,16));this.reset();return c},O:[],a:[],B:function(){function a(e){return(e-Math.floor(e))*0x100000000|0}var b=0,c=2,d;a:for(;b<64;c++){for(d=2;d*d<=c;d++)if(c%d===0)continue a;if(b<8)this.O[b]=a(Math.pow(c,0.5));this.a[b]=a(Math.pow(c,1/3));b++}},G:function(a){var b,c,d=a.slice(0),e=this.p,f=this.a,g=e[0],h=e[1],i=e[2],j=e[3],k=e[4],l=e[5],m=e[6],n=e[7];for(a=0;a<64;a++){if(a<16)b=d[a];else{b=d[a+1&15];c=d[a+14&15];b=d[a&15]=(b>>>7^b>>>18^
b>>>3^b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0}b=b+n+(k>>>6^k>>>11^k>>>25^k<<26^k<<21^k<<7)+(m^k&(l^m))+f[a];n=m;m=l;l=k;k=j+b|0;j=i;i=h;h=g;g=b+(h&i^j&(h^i))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0}e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+i|0;e[3]=e[3]+j|0;e[4]=e[4]+k|0;e[5]=e[5]+l|0;e[6]=e[6]+m|0;e[7]=e[7]+n|0}};
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,i=h.bitLength(c)/8,j=h.bitLength(g)/8;e=e||64;d=d||[];if(i<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;f<4&&j>>>8*f;f++);if(f<15-i)f=15-i;c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.J(a,b,c,d,e,f);g=sjcl.mode.ccm.l(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),i=f.clamp(b,h-e),j=f.bitSlice(b,
h-e);h=(h-e)/8;if(g<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;b<4&&h>>>8*b;b++);if(b<15-g)b=15-g;c=f.clamp(c,8*(15-b));i=sjcl.mode.ccm.l(a,i,c,j,e,b);a=sjcl.mode.ccm.J(a,i.data,c,d,e,b);if(!f.equal(i.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");return i.data},J:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,i=h.j;e/=8;if(e%2||e<4||e>16)throw new sjcl.exception.invalid("ccm: invalid tag length");if(d.length>0xffffffff||b.length>0xffffffff)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;if(c<=65279)g=[h.partial(16,c)];else if(c<=0xffffffff)g=h.concat([h.partial(16,65534)],[c]);g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(i(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(i(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,e*8)},l:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.j;var i=b.length,j=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!i)return{tag:d,data:[]};for(g=0;g<i;g+=4){c[3]++;e=a.encrypt(c);b[g]^=e[0];b[g+1]^=e[1];b[g+2]^=e[2];b[g+3]^=e[3]}return{tag:d,data:h.clamp(b,j)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.D,i=sjcl.bitArray,j=i.j,k=[0,0,0,0];c=h(a.encrypt(c));var l,m=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4){l=b.slice(g,g+4);k=j(k,l);m=m.concat(j(c,a.encrypt(j(c,l))));c=h(c)}l=b.slice(g);b=i.bitLength(l);g=a.encrypt(j(c,[0,0,0,b]));l=i.clamp(j(l.concat([0,0,0]),g),b);k=j(k,j(l.concat([0,0,0]),g));k=a.encrypt(j(k,j(c,h(c))));
if(d.length)k=j(k,f?d:sjcl.mode.ocb2.pmac(a,d));return m.concat(i.concat(l,i.clamp(k,e)))},decrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.D,h=sjcl.bitArray,i=h.j,j=[0,0,0,0],k=g(a.encrypt(c)),l,m,n=sjcl.bitArray.bitLength(b)-e,o=[];d=d||[];for(c=0;c+4<n/32;c+=4){l=i(k,a.decrypt(i(k,b.slice(c,c+4))));j=i(j,l);o=o.concat(l);k=g(k)}m=n-c*32;l=a.encrypt(i(k,[0,0,0,m]));l=i(l,h.clamp(b.slice(c),
m).concat([0,0,0]));j=i(j,l);j=a.encrypt(i(j,i(k,g(k))));if(d.length)j=i(j,f?d:sjcl.mode.ocb2.pmac(a,d));if(!h.equal(h.clamp(j,e),h.bitSlice(b,n)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return o.concat(h.clamp(l,m))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.D,e=sjcl.bitArray,f=e.j,g=[0,0,0,0],h=a.encrypt([0,0,0,0]);h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4){h=d(h);g=f(g,a.encrypt(f(h,b.slice(c,c+4))))}b=b.slice(c);if(e.bitLength(b)<128){h=f(h,d(h));b=e.concat(b,[2147483648|0,0,
0,0])}g=f(g,b);return a.encrypt(f(d(f(h,d(h))),g))},D:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^(a[0]>>>31)*135]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;e=e||128;d=d||[];a=sjcl.mode.gcm.l(true,a,f,d,c,e);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];if(e<=h){b=g.bitSlice(f,h-e);f=g.bitSlice(f,0,h-e)}else{b=f;f=[]}a=sjcl.mode.gcm.l(false,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return a.data},T:function(a,b){var c,d,e,f,g=sjcl.bitArray.j;
d=[0,0,0,0];e=b.slice(0);for(b=0;b<128;b++){if(c=(a[Math.floor(b/32)]&1<<31-b%32)!==0)d=g(d,e);f=(e[3]&1)!==0;for(c=3;c>0;c--)e[c]=e[c]>>>1|(e[c-1]&1)<<31;e[0]>>>=1;if(f)e[0]^=-0x1f000000}return d},e:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4){b[0]^=0xffffffff&c[d];b[1]^=0xffffffff&c[d+1];b[2]^=0xffffffff&c[d+2];b[3]^=0xffffffff&c[d+3];b=sjcl.mode.gcm.T(b,a)}return b},l:function(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o=sjcl.bitArray;l=c.length;m=o.bitLength(c);n=o.bitLength(d);h=o.bitLength(e);
g=b.encrypt([0,0,0,0]);if(h===96){e=e.slice(0);e=o.concat(e,[1])}else{e=sjcl.mode.gcm.e(g,[0,0,0,0],e);e=sjcl.mode.gcm.e(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff])}h=sjcl.mode.gcm.e(g,[0,0,0,0],d);k=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.e(g,h,c));for(j=0;j<l;j+=4){k[3]++;i=b.encrypt(k);c[j]^=i[0];c[j+1]^=i[1];c[j+2]^=i[2];c[j+3]^=i[3]}c=o.clamp(c,m);if(a)d=sjcl.mode.gcm.e(g,h,c);a=[Math.floor(n/0x100000000),n&0xffffffff,Math.floor(m/0x100000000),m&0xffffffff];d=sjcl.mode.gcm.e(g,d,a);i=
b.encrypt(e);d[0]^=i[0];d[1]^=i[1];d[2]^=i[2];d[3]^=i[3];return{tag:o.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.N=b=b||sjcl.hash.sha256;var c=[[],[]],d=b.prototype.blockSize/32;this.n=[new b,new b];if(a.length>d)a=b.hash(a);for(b=0;b<d;b++){c[0][b]=a[b]^909522486;c[1][b]=a[b]^1549556828}this.n[0].update(c[0]);this.n[1].update(c[1])};sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){a=(new this.N(this.n[0])).update(a).finalize();return(new this.N(this.n[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(d<0||c<0)throw sjcl.exception.invalid("invalid params to pbkdf2");if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,i,j=[],k=sjcl.bitArray;for(i=1;32*j.length<(d||1);i++){e=f=a.encrypt(k.concat(b,[i]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}j=j.concat(e)}if(d)j=k.clamp(j,d);return j};
sjcl.random={randomWords:function(a,b){var c=[];b=this.isReady(b);var d;if(b===0)throw new sjcl.exception.notReady("generator isn't seeded");else b&2&&this.W(!(b&1));for(b=0;b<a;b+=4){(b+1)%0x10000===0&&this.M();d=this.A();c.push(d[0],d[1],d[2],d[3])}this.M();return c.slice(0,a)},setDefaultParanoia:function(a){this.w=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.s[c],h=this.isReady(),i=0;d=this.I[c];if(d===undefined)d=this.I[c]=this.S++;if(g===undefined)g=this.s[c]=
0;this.s[c]=(this.s[c]+1)%this.b.length;switch(typeof a){case "number":if(b===undefined)b=1;this.b[g].update([d,this.z++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if(c==="[object Uint32Array]"){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{if(c!=="[object Array]")i=1;for(c=0;c<a.length&&!i;c++)if(typeof a[c]!="number")i=1}if(!i){if(b===undefined)for(c=b=0;c<a.length;c++)for(e=a[c];e>0;){b++;e>>>=1}this.b[g].update([d,this.z++,2,b,f,a.length].concat(a))}break;case "string":if(b===
undefined)b=a.length;this.b[g].update([d,this.z++,3,b,f,a.length]);this.b[g].update(a);break;default:i=1}if(i)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.g+=b;if(h===0){this.isReady()!==0&&this.L("seeded",Math.max(this.h,this.g));this.L("progress",this.getProgress())}},isReady:function(a){a=this.F[a!==undefined?a:this.w];return this.h&&this.h>=a?this.m[0]>80&&(new Date).valueOf()>this.P?3:1:this.g>=a?2:0},getProgress:function(a){a=
this.F[a?a:this.w];return this.h>=a?1:this.g>a?1:this.g/a},startCollectors:function(){if(!this.o){if(window.addEventListener){window.addEventListener("load",this.q,false);window.addEventListener("mousemove",this.r,false)}else if(document.attachEvent){document.attachEvent("onload",this.q);document.attachEvent("onmousemove",this.r)}else throw new sjcl.exception.bug("can't attach event");this.o=true}},stopCollectors:function(){if(this.o){if(window.removeEventListener){window.removeEventListener("load",
this.q,false);window.removeEventListener("mousemove",this.r,false)}else if(window.detachEvent){window.detachEvent("onload",this.q);window.detachEvent("onmousemove",this.r)}this.o=false}},addEventListener:function(a,b){this.t[a][this.R++]=b},removeEventListener:function(a,b){var c;a=this.t[a];var d=[];for(c in a)a.hasOwnProperty(c)&&a[c]===b&&d.push(c);for(b=0;b<d.length;b++){c=d[b];delete a[c]}},b:[new sjcl.hash.sha256],m:[0],C:0,s:{},z:0,I:{},S:0,h:0,g:0,P:0,a:[0,0,0,0,0,0,0,0],d:[0,0,0,0],u:undefined,
w:6,o:false,t:{progress:{},seeded:{}},R:0,F:[0,48,64,96,128,192,0x100,384,512,768,1024],A:function(){for(var a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}return this.u.encrypt(this.d)},M:function(){this.a=this.A().concat(this.A());this.u=new sjcl.cipher.aes(this.a)},V:function(a){this.a=sjcl.hash.sha256.hash(this.a.concat(a));this.u=new sjcl.cipher.aes(this.a);for(a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}},W:function(a){var b=[],c=0,d;this.P=b[0]=(new Date).valueOf()+3E4;for(d=
0;d<16;d++)b.push(Math.random()*0x100000000|0);for(d=0;d<this.b.length;d++){b=b.concat(this.b[d].finalize());c+=this.m[d];this.m[d]=0;if(!a&&this.C&1<<d)break}if(this.C>=1<<this.b.length){this.b.push(new sjcl.hash.sha256);this.m.push(0)}this.g-=c;if(c>this.h)this.h=c;this.C++;this.V(b)},r:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse")},q:function(){sjcl.random.addEntropy((new Date).valueOf(),2,"loadtime")},L:function(a,b){var c;a=sjcl.random.t[a];
var d=[];for(c in a)a.hasOwnProperty(c)&&d.push(a[c]);for(c=0;c<d.length;c++)d[c](b)}};try{var s=new Uint32Array(32);crypto.getRandomValues(s);sjcl.random.addEntropy(s,1024,"crypto['getRandomValues']")}catch(t){}
sjcl.json={defaults:{v:1,iter:1E3,ks:256,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.c({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.c(f,c);c=f.adata;if(typeof f.salt==="string")f.salt=sjcl.codec.base64.toBits(f.salt);if(typeof f.iv==="string")f.iv=sjcl.codec.base64.toBits(f.iv);if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||typeof a==="string"&&f.iter<=100||f.ts!==64&&f.ts!==96&&f.ts!==128||f.ks!==128&&f.ks!==192&&f.ks!==0x100||f.iv.length<
2||f.iv.length>4)throw new sjcl.exception.invalid("json encrypt: invalid parameters");if(typeof a==="string"){g=sjcl.misc.cachedPbkdf2(a,f);a=g.key.slice(0,f.ks/32);f.salt=g.salt}if(typeof b==="string")b=sjcl.codec.utf8String.toBits(b);if(typeof c==="string")c=sjcl.codec.utf8String.toBits(c);g=new sjcl.cipher[f.cipher](a);e.c(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return e.encode(f)},decrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.c(e.c(e.c({},e.defaults),e.decode(b)),
c,true);var f;c=b.adata;if(typeof b.salt==="string")b.salt=sjcl.codec.base64.toBits(b.salt);if(typeof b.iv==="string")b.iv=sjcl.codec.base64.toBits(b.iv);if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||typeof a==="string"&&b.iter<=100||b.ts!==64&&b.ts!==96&&b.ts!==128||b.ks!==128&&b.ks!==192&&b.ks!==0x100||!b.iv||b.iv.length<2||b.iv.length>4)throw new sjcl.exception.invalid("json decrypt: invalid parameters");if(typeof a==="string"){f=sjcl.misc.cachedPbkdf2(a,b);a=f.key.slice(0,b.ks/32);b.salt=f.salt}if(typeof c===
"string")c=sjcl.codec.utf8String.toBits(c);f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.c(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+
sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");b[d[2]]=
d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4])}return b},c:function(a,b,c){if(a===undefined)a={};if(b===undefined)return a;var d;for(d in b)if(b.hasOwnProperty(d)){if(c&&a[d]!==undefined&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},Y:function(a,b){var c={},d;for(d in a)if(a.hasOwnProperty(d)&&a[d]!==b[d])c[d]=a[d];return c},X:function(a,b){var c={},d;for(d=0;d<b.length;d++)if(a[b[d]]!==undefined)c[b[d]]=
a[b[d]];return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.U={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.U,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===undefined?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

/** @fileOverview Javascript SHA-512 implementation.
 *
 * This implementation was written for CryptoJS by Jeff Mott and adapted for
 * SJCL by Stefan Thomas.
 *
 * CryptoJS (c) 2009–2012 by Jeff Mott. All rights reserved.
 * Released with New BSD License
 *
 * @author Emily Stark
 * @author Mike Hamburg
 * @author Dan Boneh
 * @author Jeff Mott
 * @author Stefan Thomas
 */

/**
 * Context for a SHA-512 operation in progress.
 * @constructor
 * @class Secure Hash Algorithm, 512 bits.
 */
sjcl.hash.sha512 = function (hash) {
  if (!this._key[0]) { this._precompute(); }
  if (hash) {
    this._h = hash._h.slice(0);
    this._buffer = hash._buffer.slice(0);
    this._length = hash._length;
  } else {
    this.reset();
  }
};

/**
 * Hash a string or an array of words.
 * @static
 * @param {bitArray|String} data the data to hash.
 * @return {bitArray} The hash value, an array of 16 big-endian words.
 */
sjcl.hash.sha512.hash = function (data) {
  return (new sjcl.hash.sha512()).update(data).finalize();
};

sjcl.hash.sha512.prototype = {
  /**
   * The hash's block size, in bits.
   * @constant
   */
  blockSize: 1024,
   
  /**
   * Reset the hash state.
   * @return this
   */
  reset:function () {
    this._h = this._init.slice(0);
    this._buffer = [];
    this._length = 0;
    return this;
  },
  
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update: function (data) {
    if (typeof data === "string") {
      data = sjcl.codec.utf8String.toBits(data);
    }
    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
        ol = this._length,
        nl = this._length = ol + sjcl.bitArray.bitLength(data);
    for (i = 1024+ol & -1024; i <= nl; i+= 1024) {
      this._block(b.splice(0,32));
    }
    return this;
  },
  
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 16 big-endian words.
   */
  finalize:function () {
    var i, b = this._buffer, h = this._h;

    // Round out and push the buffer
    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1,1)]);

    // Round out the buffer to a multiple of 32 words, less the 4 length words.
    for (i = b.length + 4; i & 31; i++) {
      b.push(0);
    }

    // append the length
    b.push(0);
    b.push(0);
    b.push(Math.floor(this._length / 0x100000000));
    b.push(this._length | 0);

    while (b.length) {
      this._block(b.splice(0,32));
    }

    this.reset();
    return h;
  },

  /**
   * The SHA-512 initialization vector, to be precomputed.
   * @private
   */
  _init:[],

  /**
   * Least significant 24 bits of SHA512 initialization values.
   *
   * Javascript only has 53 bits of precision, so we compute the 40 most
   * significant bits and add the remaining 24 bits as constants.
   *
   * @private
   */
  _initr: [ 0xbcc908, 0xcaa73b, 0x94f82b, 0x1d36f1, 0xe682d1, 0x3e6c1f, 0x41bd6b, 0x7e2179 ],

  /*
  _init:
  [0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
   0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179],
  */

  /**
   * The SHA-512 hash key, to be precomputed.
   * @private
   */
  _key:[],

  /**
   * Least significant 24 bits of SHA512 key values.
   * @private
   */
  _keyr:
  [0x28ae22, 0xef65cd, 0x4d3b2f, 0x89dbbc, 0x48b538, 0x05d019, 0x194f9b, 0x6d8118,
   0x030242, 0x706fbe, 0xe4b28c, 0xffb4e2, 0x7b896f, 0x1696b1, 0xc71235, 0x692694,
   0xf14ad2, 0x4f25e3, 0x8cd5b5, 0xac9c65, 0x2b0275, 0xa6e483, 0x41fbd4, 0x1153b5,
   0x66dfab, 0xb43210, 0xfb213f, 0xef0ee4, 0xa88fc2, 0x0aa725, 0x03826f, 0x0e6e70,
   0xd22ffc, 0x26c926, 0xc42aed, 0x95b3df, 0xaf63de, 0x77b2a8, 0xedaee6, 0x82353b,
   0xf10364, 0x423001, 0xf89791, 0x54be30, 0xef5218, 0x65a910, 0x71202a, 0xbbd1b8,
   0xd2d0c8, 0x41ab53, 0x8eeb99, 0x9b48a8, 0xc95a63, 0x418acb, 0x63e373, 0xb2b8a3,
   0xefb2fc, 0x172f60, 0xf0ab72, 0x6439ec, 0x631e28, 0x82bde9, 0xc67915, 0x72532b,
   0x26619c, 0xc0c207, 0xe0eb1e, 0x6ed178, 0x176fba, 0xc898a6, 0xf90dae, 0x1c471b,
   0x047d84, 0xc72493, 0xc9bebc, 0x100d4c, 0x3e42b6, 0x657e2a, 0xd6faec, 0x475817],

  /*
  _key:
  [0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
   0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
   0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
   0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
   0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
   0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
   0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
   0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
   0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
   0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
   0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
   0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
   0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
   0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
   0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
   0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
   0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
   0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
   0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
   0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817],
  */

  /**
   * Function to precompute _init and _key.
   * @private
   */
  _precompute: function () {
    // XXX: This code is for precomputing the SHA256 constants, change for
    //      SHA512 and re-enable.
    var i = 0, prime = 2, factor;

    function frac(x)  { return (x-Math.floor(x)) * 0x100000000 | 0; }
    function frac2(x) { return (x-Math.floor(x)) * 0x10000000000 & 0xff; }

    outer: for (; i<80; prime++) {
      for (factor=2; factor*factor <= prime; factor++) {
        if (prime % factor === 0) {
          // not a prime
          continue outer;
        }
      }

      if (i<8) {
        this._init[i*2] = frac(Math.pow(prime, 1/2));
        this._init[i*2+1] = (frac2(Math.pow(prime, 1/2)) << 24) | this._initr[i];
      }
      this._key[i*2] = frac(Math.pow(prime, 1/3));
      this._key[i*2+1] = (frac2(Math.pow(prime, 1/3)) << 24) | this._keyr[i];
      i++;
    }
  },

  /**
   * Perform one cycle of SHA-512.
   * @param {bitArray} words one block of words.
   * @private
   */
  _block:function (words) {
    var i, wrh, wrl,
        w = words.slice(0),
        h = this._h,
        k = this._key,
        h0h = h[ 0], h0l = h[ 1], h1h = h[ 2], h1l = h[ 3],
        h2h = h[ 4], h2l = h[ 5], h3h = h[ 6], h3l = h[ 7],
        h4h = h[ 8], h4l = h[ 9], h5h = h[10], h5l = h[11],
        h6h = h[12], h6l = h[13], h7h = h[14], h7l = h[15];

    // Working variables
    var ah = h0h, al = h0l, bh = h1h, bl = h1l,
        ch = h2h, cl = h2l, dh = h3h, dl = h3l,
        eh = h4h, el = h4l, fh = h5h, fl = h5l,
        gh = h6h, gl = h6l, hh = h7h, hl = h7l;

    for (i=0; i<80; i++) {
      // load up the input word for this round
      if (i<16) {
        wrh = w[i * 2];
        wrl = w[i * 2 + 1];
      } else {
        // Gamma0
        var gamma0xh = w[(i-15) * 2];
        var gamma0xl = w[(i-15) * 2 + 1];
        var gamma0h =
          ((gamma0xl << 31) | (gamma0xh >>> 1)) ^
          ((gamma0xl << 24) | (gamma0xh >>> 8)) ^
           (gamma0xh >>> 7);
        var gamma0l =
          ((gamma0xh << 31) | (gamma0xl >>> 1)) ^
          ((gamma0xh << 24) | (gamma0xl >>> 8)) ^
          ((gamma0xh << 25) | (gamma0xl >>> 7));

        // Gamma1
        var gamma1xh = w[(i-2) * 2];
        var gamma1xl = w[(i-2) * 2 + 1];
        var gamma1h =
          ((gamma1xl << 13) | (gamma1xh >>> 19)) ^
          ((gamma1xh << 3)  | (gamma1xl >>> 29)) ^
           (gamma1xh >>> 6);
        var gamma1l =
          ((gamma1xh << 13) | (gamma1xl >>> 19)) ^
          ((gamma1xl << 3)  | (gamma1xh >>> 29)) ^
          ((gamma1xh << 26) | (gamma1xl >>> 6));

        // Shortcuts
        var wr7h = w[(i-7) * 2];
        var wr7l = w[(i-7) * 2 + 1];

        var wr16h = w[(i-16) * 2];
        var wr16l = w[(i-16) * 2 + 1];

        // W(round) = gamma0 + W(round - 7) + gamma1 + W(round - 16)
        wrl = gamma0l + wr7l;
        wrh = gamma0h + wr7h + ((wrl >>> 0) < (gamma0l >>> 0) ? 1 : 0);
        wrl += gamma1l;
        wrh += gamma1h + ((wrl >>> 0) < (gamma1l >>> 0) ? 1 : 0);
        wrl += wr16l;
        wrh += wr16h + ((wrl >>> 0) < (wr16l >>> 0) ? 1 : 0);
      }

      w[i*2]     = wrh |= 0;
      w[i*2 + 1] = wrl |= 0;

      // Ch
      var chh = (eh & fh) ^ (~eh & gh);
      var chl = (el & fl) ^ (~el & gl);

      // Maj
      var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
      var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

      // Sigma0
      var sigma0h = ((al << 4) | (ah >>> 28)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
      var sigma0l = ((ah << 4) | (al >>> 28)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));

      // Sigma1
      var sigma1h = ((el << 18) | (eh >>> 14)) ^ ((el << 14) | (eh >>> 18)) ^ ((eh << 23) | (el >>> 9));
      var sigma1l = ((eh << 18) | (el >>> 14)) ^ ((eh << 14) | (el >>> 18)) ^ ((el << 23) | (eh >>> 9));

      // K(round)
      var krh = k[i*2];
      var krl = k[i*2+1];

      // t1 = h + sigma1 + ch + K(round) + W(round)
      var t1l = hl + sigma1l;
      var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
      t1l += chl;
      t1h += chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
      t1l += krl;
      t1h += krh + ((t1l >>> 0) < (krl >>> 0) ? 1 : 0);
      t1l += wrl;
      t1h += wrh + ((t1l >>> 0) < (wrl >>> 0) ? 1 : 0);

      // t2 = sigma0 + maj
      var t2l = sigma0l + majl;
      var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

      // Update working variables
      hh = gh;
      hl = gl;
      gh = fh;
      gl = fl;
      fh = eh;
      fl = el;
      el = (dl + t1l) | 0;
      eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
      dh = ch;
      dl = cl;
      ch = bh;
      cl = bl;
      bh = ah;
      bl = al;
      al = (t1l + t2l) | 0;
      ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
    }

    // Intermediate hash
    h0l = h[1] = (h0l + al) | 0;
    h[0] = (h0h + ah + ((h0l >>> 0) < (al >>> 0) ? 1 : 0)) | 0;
    h1l = h[3] = (h1l + bl) | 0;
    h[2] = (h1h + bh + ((h1l >>> 0) < (bl >>> 0) ? 1 : 0)) | 0;
    h2l = h[5] = (h2l + cl) | 0;
    h[4] = (h2h + ch + ((h2l >>> 0) < (cl >>> 0) ? 1 : 0)) | 0;
    h3l = h[7] = (h3l + dl) | 0;
    h[6] = (h3h + dh + ((h3l >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
    h4l = h[9] = (h4l + el) | 0;
    h[8] = (h4h + eh + ((h4l >>> 0) < (el >>> 0) ? 1 : 0)) | 0;
    h5l = h[11] = (h5l + fl) | 0;
    h[10] = (h5h + fh + ((h5l >>> 0) < (fl >>> 0) ? 1 : 0)) | 0;
    h6l = h[13] = (h6l + gl) | 0;
    h[12] = (h6h + gh + ((h6l >>> 0) < (gl >>> 0) ? 1 : 0)) | 0;
    h7l = h[15] = (h7l + hl) | 0;
    h[14] = (h7h + hh + ((h7l >>> 0) < (hl >>> 0) ? 1 : 0)) | 0;
  }
};