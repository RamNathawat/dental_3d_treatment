(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},t={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},n=`attached`,r=1e3,i=1001,a=1002,o=1003,s=1004,c=1005,l=1006,u=1007,d=1008,f=1009,p=1010,m=1011,h=1012,g=1013,_=1014,v=1015,y=1016,b=1017,x=1018,S=1020,C=35902,w=35899,T=1021,E=1022,D=1023,O=1026,k=1027,A=1028,j=1029,M=1030,N=1031,P=1033,F=33776,I=33777,L=33778,R=33779,z=35840,ee=35841,B=35842,te=35843,V=36196,H=37492,ne=37496,re=37488,ie=37489,ae=37490,oe=37491,se=37808,ce=37809,le=37810,ue=37811,de=37812,fe=37813,pe=37814,me=37815,he=37816,ge=37817,_e=37818,ve=37819,ye=37820,be=37821,xe=36492,U=36494,Se=36495,W=36283,Ce=36284,G=36285,we=36286,Te=2300,Ee=2301,K=2302,De=2303,Oe=2400,ke=2401,Ae=2402,je=2500,Me=3200,Ne=`srgb`,Pe=`srgb-linear`,Fe=`linear`,Ie=`srgb`,Le=7680,Re=35044,ze=2e3;function Be(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ve(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function He(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ue(){let e=He(`canvas`);return e.style.display=`block`,e}var We={};function Ge(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ke(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function q(...e){e=Ke(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function qe(...e){e=Ke(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Je(...e){let t=e.join(` `);t in We||(We[t]=!0,q(...e))}function Ye(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Xe={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Ze=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Qe=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),$e=1234567,et=Math.PI/180,tt=180/Math.PI;function nt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Qe[e&255]+Qe[e>>8&255]+Qe[e>>16&255]+Qe[e>>24&255]+`-`+Qe[t&255]+Qe[t>>8&255]+`-`+Qe[t>>16&15|64]+Qe[t>>24&255]+`-`+Qe[n&63|128]+Qe[n>>8&255]+`-`+Qe[n>>16&255]+Qe[n>>24&255]+Qe[r&255]+Qe[r>>8&255]+Qe[r>>16&255]+Qe[r>>24&255]).toLowerCase()}function rt(e,t,n){return Math.max(t,Math.min(n,e))}function it(e,t){return(e%t+t)%t}function at(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ot(e,t,n){return e===t?0:(n-e)/(t-e)}function st(e,t,n){return(1-n)*e+n*t}function ct(e,t,n,r){return st(e,t,1-Math.exp(-n*r))}function lt(e,t=1){return t-Math.abs(it(e,t*2)-t)}function ut(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function dt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function ft(e,t){return e+Math.floor(Math.random()*(t-e+1))}function pt(e,t){return e+Math.random()*(t-e)}function mt(e){return e*(.5-Math.random())}function ht(e){e!==void 0&&($e=e);let t=$e+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function gt(e){return e*et}function _t(e){return e*tt}function vt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function yt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function bt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function xt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:q(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function St(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Ct(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var wt={DEG2RAD:et,RAD2DEG:tt,generateUUID:nt,clamp:rt,euclideanModulo:it,mapLinear:at,inverseLerp:ot,lerp:st,damp:ct,pingpong:lt,smoothstep:ut,smootherstep:dt,randInt:ft,randFloat:pt,randFloatSpread:mt,seededRandom:ht,degToRad:gt,radToDeg:_t,isPowerOfTwo:vt,ceilPowerOfTwo:yt,floorPowerOfTwo:bt,setQuaternionFromProperEuler:xt,normalize:Ct,denormalize:St},J=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Tt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:q(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(rt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Y=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Et.copy(this).projectOnVector(e),this.sub(Et)}reflect(e){return this.sub(Et.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Et=new Y,Dt=new Tt,Ot=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Je(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(kt.makeScale(e,t)),this}rotate(e){return Je(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(kt.makeRotation(-e)),this}translate(e,t){return Je(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(kt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},kt=new Ot,At=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jt=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mt(){let e={enabled:!0,workingColorSpace:Pe,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Pt(e.r),e.g=Pt(e.g),e.b=Pt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ft(e.r),e.g=Ft(e.g),e.b=Ft(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Fe:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Je(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Je(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Pe]:{primaries:t,whitePoint:r,transfer:Fe,toXYZ:At,fromXYZ:jt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ne},outputColorSpaceConfig:{drawingBufferColorSpace:Ne}},[Ne]:{primaries:t,whitePoint:r,transfer:Ie,toXYZ:At,fromXYZ:jt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ne}}}),e}var Nt=Mt();function Pt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ft(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var It,Lt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{It===void 0&&(It=He(`canvas`)),It.width=e.width,It.height=e.height;let t=It.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=It}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=He(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Pt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Pt(t[e]/255)*255):t[e]=Pt(t[e]);return{data:t,width:e.width,height:e.height}}return q(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Rt=0,zt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Rt++}),this.uuid=nt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Bt(r[t].image)):e.push(Bt(r[t]))}else e=Bt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Bt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Lt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(q(`Texture: Unable to serialize Texture.`),{})}var Vt=0,Ht=new Y,Ut=class e extends Ze{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=i,a=i,o=l,s=d,c=D,u=f,p=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vt++}),this.uuid=nt(),this.name=``,this.source=new zt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.anisotropy=p,this.format=c,this.internalFormat=null,this.type=u,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ht).x}get height(){return this.source.getSize(Ht).y}get depth(){return this.source.getSize(Ht).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){q(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){q(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case r:e.x-=Math.floor(e.x);break;case i:e.x=e.x<0?0:1;break;case a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case r:e.y-=Math.floor(e.y);break;case i:e.y=e.y<0?0:1;break;case a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ut.DEFAULT_IMAGE=null,Ut.DEFAULT_MAPPING=300,Ut.DEFAULT_ANISOTROPY=1;var Wt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this.w=rt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this.w=rt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Gt=class extends Ze{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:l,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Wt(0,0,e,t),this.scissorTest=!1,this.viewport=new Wt(0,0,e,t),this.textures=[];let r=new Ut({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:l,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new zt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Kt=class extends Gt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},qt=class extends Ut{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=o,this.minFilter=o,this.wrapR=i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Jt=class extends Ut{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=o,this.minFilter=o,this.wrapR=i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Yt=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Xt.setFromMatrixColumn(e,0).length(),i=1/Xt.setFromMatrixColumn(e,1).length(),a=1/Xt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Qt,e,$t)}lookAt(e,t,n){let r=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),en.crossVectors(n,nn),en.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),en.crossVectors(n,nn)),en.normalize(),tn.crossVectors(nn,en),r[0]=en.x,r[4]=tn.x,r[8]=nn.x,r[1]=en.y,r[5]=tn.y,r[9]=nn.y,r[2]=en.z,r[6]=tn.z,r[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Xt.set(r[0],r[1],r[2]).length(),o=Xt.set(r[4],r[5],r[6]).length(),s=Xt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Zt.copy(this);let c=1/a,l=1/o,u=1/s;return Zt.elements[0]*=c,Zt.elements[1]*=c,Zt.elements[2]*=c,Zt.elements[4]*=l,Zt.elements[5]*=l,Zt.elements[6]*=l,Zt.elements[8]*=u,Zt.elements[9]*=u,Zt.elements[10]*=u,t.setFromRotationMatrix(Zt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=ze,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=ze,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Xt=new Y,Zt=new Yt,Qt=new Y(0,0,0),$t=new Y(1,1,1),en=new Y,tn=new Y,nn=new Y,rn=new Yt,an=new Tt,on=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-rt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-rt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(rt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:q(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return rn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return an.setFromEuler(this),this.setFromQuaternion(an,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER=`XYZ`;var sn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},cn=0,ln=new Y,un=new Tt,dn=new Yt,fn=new Y,pn=new Y,mn=new Y,hn=new Tt,gn=new Y(1,0,0),_n=new Y(0,1,0),vn=new Y(0,0,1),yn={type:`added`},bn={type:`removed`},xn={type:`childadded`,child:null},Sn={type:`childremoved`,child:null},Cn=class e extends Ze{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cn++}),this.uuid=nt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Y,n=new on,r=new Tt,i=new Y(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Yt},normalMatrix:{value:new Ot}}),this.matrix=new Yt,this.matrixWorld=new Yt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return un.setFromAxisAngle(e,t),this.quaternion.multiply(un),this}rotateOnWorldAxis(e,t){return un.setFromAxisAngle(e,t),this.quaternion.premultiply(un),this}rotateX(e){return this.rotateOnAxis(gn,e)}rotateY(e){return this.rotateOnAxis(_n,e)}rotateZ(e){return this.rotateOnAxis(vn,e)}translateOnAxis(e,t){return ln.copy(e).applyQuaternion(this.quaternion),this.position.add(ln.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gn,e)}translateY(e){return this.translateOnAxis(_n,e)}translateZ(e){return this.translateOnAxis(vn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fn.copy(e):fn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),pn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(pn,fn,this.up):dn.lookAt(fn,pn,this.up),this.quaternion.setFromRotationMatrix(dn),r&&(dn.extractRotation(r.matrixWorld),un.setFromRotationMatrix(dn),this.quaternion.premultiply(un.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(qe(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yn),xn.child=e,this.dispatchEvent(xn),xn.child=null):qe(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bn),Sn.child=e,this.dispatchEvent(Sn),Sn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yn),xn.child=e,this.dispatchEvent(xn),xn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pn,e,mn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pn,hn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Cn.DEFAULT_UP=new Y(0,1,0),Cn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wn=class extends Cn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Tn={type:`move`},En=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},kn={h:0,s:0,l:0};function An(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var X=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ne){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Nt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Nt.workingColorSpace){if(e=it(e,1),t=rt(t,0,1),n=rt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=An(i,r,e+1/3),this.g=An(i,r,e),this.b=An(i,r,e-1/3)}return Nt.colorSpaceToWorking(this,r),this}setStyle(e,t=Ne){function n(t){t!==void 0&&parseFloat(t)<1&&q(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:q(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);q(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ne){let n=Dn[e.toLowerCase()];return n===void 0?q(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pt(e.r),this.g=Pt(e.g),this.b=Pt(e.b),this}copyLinearToSRGB(e){return this.r=Ft(e.r),this.g=Ft(e.g),this.b=Ft(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ne){return Nt.workingToColorSpace(jn.copy(this),e),Math.round(rt(jn.r*255,0,255))*65536+Math.round(rt(jn.g*255,0,255))*256+Math.round(rt(jn.b*255,0,255))}getHexString(e=Ne){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Nt.workingColorSpace){Nt.workingToColorSpace(jn.copy(this),t);let n=jn.r,r=jn.g,i=jn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Nt.workingColorSpace){return Nt.workingToColorSpace(jn.copy(this),t),e.r=jn.r,e.g=jn.g,e.b=jn.b,e}getStyle(e=Ne){Nt.workingToColorSpace(jn.copy(this),e);let t=jn.r,n=jn.g,r=jn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(On),this.setHSL(On.h+e,On.s+t,On.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(On),e.getHSL(kn);let n=st(On.h,kn.h,t),r=st(On.s,kn.s,t),i=st(On.l,kn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jn=new X;X.NAMES=Dn;var Mn=class extends Cn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Nn=new Y,Pn=new Y,Fn=new Y,In=new Y,Ln=new Y,Rn=new Y,zn=new Y,Bn=new Y,Vn=new Y,Hn=new Y,Un=new Wt,Wn=new Wt,Gn=new Wt,Kn=class e{constructor(e=new Y,t=new Y,n=new Y){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Nn.subVectors(e,t),r.cross(Nn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Nn.subVectors(r,t),Pn.subVectors(n,t),Fn.subVectors(e,t);let a=Nn.dot(Nn),o=Nn.dot(Pn),s=Nn.dot(Fn),c=Pn.dot(Pn),l=Pn.dot(Fn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,In)!==null&&In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,In)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,In.x),s.addScaledVector(a,In.y),s.addScaledVector(o,In.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Un.setScalar(0),Wn.setScalar(0),Gn.setScalar(0),Un.fromBufferAttribute(e,t),Wn.fromBufferAttribute(e,n),Gn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Un,i.x),a.addScaledVector(Wn,i.y),a.addScaledVector(Gn,i.z),a}static isFrontFacing(e,t,n,r){return Nn.subVectors(n,t),Pn.subVectors(e,t),Nn.cross(Pn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),Nn.cross(Pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Ln.subVectors(r,n),Rn.subVectors(i,n),Bn.subVectors(e,n);let s=Ln.dot(Bn),c=Rn.dot(Bn);if(s<=0&&c<=0)return t.copy(n);Vn.subVectors(e,r);let l=Ln.dot(Vn),u=Rn.dot(Vn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Ln,a);Hn.subVectors(e,i);let f=Ln.dot(Hn),p=Rn.dot(Hn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Rn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return zn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(zn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Ln,a).addScaledVector(Rn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},qn=class{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Yn):Yn.fromBufferAttribute(r,t),Yn.applyMatrix4(e.matrixWorld),this.expandByPoint(Yn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Xn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Xn.copy(e.boundingBox)),Xn.applyMatrix4(e.matrixWorld),this.union(Xn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yn),Yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rr),ir.subVectors(this.max,rr),Zn.subVectors(e.a,rr),Qn.subVectors(e.b,rr),$n.subVectors(e.c,rr),er.subVectors(Qn,Zn),tr.subVectors($n,Qn),nr.subVectors(Zn,$n);let t=[0,-er.z,er.y,0,-tr.z,tr.y,0,-nr.z,nr.y,er.z,0,-er.x,tr.z,0,-tr.x,nr.z,0,-nr.x,-er.y,er.x,0,-tr.y,tr.x,0,-nr.y,nr.x,0];return!sr(t,Zn,Qn,$n,ir)||(t=[1,0,0,0,1,0,0,0,1],!sr(t,Zn,Qn,$n,ir))?!1:(ar.crossVectors(er,tr),t=[ar.x,ar.y,ar.z],sr(t,Zn,Qn,$n,ir))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Jn=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Yn=new Y,Xn=new qn,Zn=new Y,Qn=new Y,$n=new Y,er=new Y,tr=new Y,nr=new Y,rr=new Y,ir=new Y,ar=new Y,or=new Y;function sr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){or.fromArray(e,a);let o=i.x*Math.abs(or.x)+i.y*Math.abs(or.y)+i.z*Math.abs(or.z),s=t.dot(or),c=n.dot(or),l=r.dot(or);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var cr=new Y,lr=new J,ur=0,dr=class extends Ze{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ur++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Re,this.updateRanges=[],this.gpuType=v,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.applyMatrix3(e),this.setXY(t,lr.x,lr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)cr.fromBufferAttribute(this,t),cr.applyMatrix3(e),this.setXYZ(t,cr.x,cr.y,cr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)cr.fromBufferAttribute(this,t),cr.applyMatrix4(e),this.setXYZ(t,cr.x,cr.y,cr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)cr.fromBufferAttribute(this,t),cr.applyNormalMatrix(e),this.setXYZ(t,cr.x,cr.y,cr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)cr.fromBufferAttribute(this,t),cr.transformDirection(e),this.setXYZ(t,cr.x,cr.y,cr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=St(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=St(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=St(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=St(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=St(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array),i=Ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},fr=class extends dr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},pr=class extends dr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},mr=class extends dr{constructor(e,t,n){super(new Float32Array(e),t,n)}},hr=new qn,gr=new Y,_r=new Y,vr=class{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?hr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);let t=gr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(gr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(_r)),this.expandByPoint(gr.copy(e.center).sub(_r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},yr=0,br=new Yt,xr=new Cn,Sr=new Y,Cr=new qn,wr=new qn,Tr=new Y,Er=class e extends Ze{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yr++}),this.uuid=nt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Be(e)?pr:fr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Ot().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return br.makeRotationFromQuaternion(e),this.applyMatrix4(br),this}rotateX(e){return br.makeRotationX(e),this.applyMatrix4(br),this}rotateY(e){return br.makeRotationY(e),this.applyMatrix4(br),this}rotateZ(e){return br.makeRotationZ(e),this.applyMatrix4(br),this}translate(e,t,n){return br.makeTranslation(e,t,n),this.applyMatrix4(br),this}scale(e,t,n){return br.makeScale(e,t,n),this.applyMatrix4(br),this}lookAt(e){return xr.lookAt(e),xr.updateMatrix(),this.applyMatrix4(xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Sr).negate(),this.translate(Sr.x,Sr.y,Sr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new mr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&q(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Cr.setFromBufferAttribute(n),this.morphTargetsRelative?(Tr.addVectors(this.boundingBox.min,Cr.min),this.boundingBox.expandByPoint(Tr),Tr.addVectors(this.boundingBox.max,Cr.max),this.boundingBox.expandByPoint(Tr)):(this.boundingBox.expandByPoint(Cr.min),this.boundingBox.expandByPoint(Cr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Y,1/0);return}if(e){let n=this.boundingSphere.center;if(Cr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];wr.setFromBufferAttribute(n),this.morphTargetsRelative?(Tr.addVectors(Cr.min,wr.min),Cr.expandByPoint(Tr),Tr.addVectors(Cr.max,wr.max),Cr.expandByPoint(Tr)):(Cr.expandByPoint(wr.min),Cr.expandByPoint(wr.max))}Cr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Tr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Tr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Tr.fromBufferAttribute(a,t),o&&(Sr.fromBufferAttribute(e,t),Tr.add(Sr)),r=Math.max(r,n.distanceToSquared(Tr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&qe(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new dr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Y,s[e]=new Y;let c=new Y,l=new Y,u=new Y,d=new J,f=new J,p=new J,m=new Y,h=new Y;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Y,y=new Y,b=new Y,x=new Y;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new dr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Y,i=new Y,a=new Y,o=new Y,s=new Y,c=new Y,l=new Y,u=new Y;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Tr.fromBufferAttribute(e,t),Tr.normalize(),e.setXYZ(t,Tr.x,Tr.y,Tr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new dr(a,r,i)}if(this.index===null)return q(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Dr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Re,this.updateRanges=[],this.version=0,this.uuid=nt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Or=new Y,kr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Or.fromBufferAttribute(this,t),Or.applyMatrix4(e),this.setXYZ(t,Or.x,Or.y,Or.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Or.fromBufferAttribute(this,t),Or.applyNormalMatrix(e),this.setXYZ(t,Or.x,Or.y,Or.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Or.fromBufferAttribute(this,t),Or.transformDirection(e),this.setXYZ(t,Or.x,Or.y,Or.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=St(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=St(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=St(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=St(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=St(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),r=Ct(r,this.array),i=Ct(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Ge(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new dr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ge(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ar=new Y,jr=new Y,Mr=new Ot,Nr=class{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ar.subVectors(n,t).cross(jr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ar),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Mr.getNormalMatrix(e),r=this.coplanarPoint(Ar).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Pr=0,Fr=class extends Ze{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pr++}),this.uuid=nt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new X(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Le,this.stencilZFail=Le,this.stencilZPass=Le,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){q(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){q(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new X().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Nr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new J().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new J().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ir=new Y,Lr=new Y,Rr=new Y,zr=new Y,Br=class{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ir)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ir.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ir.copy(this.origin).addScaledVector(this.direction,t),Ir.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Lr.copy(e).add(t).multiplyScalar(.5),Rr.copy(t).sub(e).normalize(),zr.copy(this.origin).sub(Lr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Rr),o=zr.dot(this.direction),s=-zr.dot(Rr),c=zr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Lr).addScaledVector(Rr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ir.subVectors(e.center,this.origin);let n=Ir.dot(this.direction),r=Ir.dot(Ir)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ir)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,I=1/w,L=T-P*D,R=E-F*D,z=O-P*A,ee=k-F*A,B=j-P*N,te=M-F*N,V=B*ee-te*z,H=L*te-R*B,ne=z*R-ee*L;if(r){if(V<0||H<0||ne<0)return null}else if((V<0||H<0||ne<0)&&(V>0||H>0||ne>0))return null;let re=V+H+ne;if(re===0)return null;let ie=I*(V*D+H*A+ne*N);return(re>0?ie<0:ie>0)?null:this.at(ie/re,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Vr=class extends Fr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Hr=new Yt,Ur=new Br,Wr=new vr,Gr=new Y,Kr=new Y,qr=new Y,Jr=new Y,Yr=new Y,Xr=new Y,Zr=new Y,Qr=new Y,$r=class extends Cn{constructor(e=new Er,t=new Vr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Xr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Yr.fromBufferAttribute(s,e),a?Xr.addScaledVector(Yr,r):Xr.addScaledVector(Yr.sub(t),r))}t.add(Xr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(i),Ur.copy(e.ray).recast(e.near),!(Wr.containsPoint(Ur.origin)===!1&&(Ur.intersectSphere(Wr,Gr)===null||Ur.origin.distanceToSquared(Gr)>(e.far-e.near)**2))&&(Hr.copy(i).invert(),Ur.copy(e.ray).applyMatrix4(Hr),(n.boundingBox===null||Ur.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Ur)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ti(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ti(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ti(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ti(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ei(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Qr.copy(s),Qr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Qr);return l<n.near||l>n.far?null:{distance:l,point:Qr.clone(),object:e}}function ti(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Kr),e.getVertexPosition(c,qr),e.getVertexPosition(l,Jr);let u=ei(e,t,n,r,Kr,qr,Jr,Zr);if(u){let e=new Y;Kn.getBarycoord(Zr,Kr,qr,Jr,e),i&&(u.uv=Kn.getInterpolatedAttribute(i,s,c,l,e,new J)),a&&(u.uv1=Kn.getInterpolatedAttribute(a,s,c,l,e,new J)),o&&(u.normal=Kn.getInterpolatedAttribute(o,s,c,l,e,new Y),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Y,materialIndex:0};Kn.getNormal(Kr,qr,Jr,t.normal),u.face=t,u.barycoord=e}return u}var ni=new Wt,ri=new Wt,ii=new Wt,ai=new Wt,oi=new Yt,si=new Y,ci=new vr,li=new Yt,ui=new Br,di=class extends $r{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=n,this.bindMatrix=new Yt,this.bindMatrixInverse=new Yt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new qn),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,si),this.boundingBox.expandByPoint(si)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new vr),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,si),this.boundingSphere.expandByPoint(si)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ci.copy(this.boundingSphere),ci.applyMatrix4(r),e.ray.intersectsSphere(ci)!==!1&&(li.copy(r).invert(),ui.copy(e.ray).applyMatrix4(li),(this.boundingBox===null||ui.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,ui)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Wt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():q(`SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;ri.fromBufferAttribute(r.attributes.skinIndex,e),ii.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(ni.copy(t),t.set(0,0,0,0)):(ni.set(...t,1),t.set(0,0,0)),ni.applyMatrix4(this.bindMatrix);for(let e=0;e<4;e++){let r=ii.getComponent(e);if(r!==0){let i=ri.getComponent(e);oi.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(ai.copy(ni).applyMatrix4(oi),r)}}return t.isVector4&&(t.w=ni.w),t.applyMatrix4(this.bindMatrixInverse)}},fi=class extends Cn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},pi=class extends Ut{constructor(e=null,t=1,n=1,r,i,a,s,c,l=o,u=o,d,f){super(null,a,s,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},mi=new Yt,hi=new Yt,gi=class e{constructor(e=[],t=[]){this.uuid=nt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){q(`Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new Yt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new Yt;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:hi;mi.multiplyMatrices(i,t[r]),mi.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new pi(t,e,e,D,v);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(q(`Skeleton: No bone found with UUID:`,r),i=new fi),this.bones.push(i),this.boneInverses.push(new Yt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},_i=class extends dr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},vi=new Yt,yi=new Yt,bi=[],xi=new qn,Si=new Yt,Ci=new $r,wi=new vr,Ti=class extends $r{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _i(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Si)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new qn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vi),xi.copy(e.boundingBox).applyMatrix4(vi),this.boundingBox.union(xi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new vr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vi),wi.copy(e.boundingSphere).applyMatrix4(vi),this.boundingSphere.union(wi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ci.geometry=this.geometry,Ci.material=this.material,Ci.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wi.copy(this.boundingSphere),wi.applyMatrix4(n),e.ray.intersectsSphere(wi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,vi),yi.multiplyMatrices(n,vi),Ci.matrixWorld=yi,Ci.raycast(e,bi);for(let e=0,n=bi.length;e<n;e++){let n=bi[e];n.instanceId=i,n.object=this,t.push(n)}bi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new _i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new pi(new Float32Array(r*this.count),r,this.count,A,v));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ei=new vr,Di=new J(.5,.5),Oi=new Y,ki=class{constructor(e=new Nr,t=new Nr,n=new Nr,r=new Nr,i=new Nr,a=new Nr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ze,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(e){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476+Di.distanceTo(e.center),Ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Oi.x=r.normal.x>0?e.max.x:e.min.x,Oi.y=r.normal.y>0?e.max.y:e.min.y,Oi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Oi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ai=class extends Fr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new X(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ji=new Y,Mi=new Y,Ni=new Yt,Pi=new Br,Fi=new vr,Ii=new Y,Li=new Y,Ri=class extends Cn{constructor(e=new Er,t=new Ai){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)ji.fromBufferAttribute(t,e-1),Mi.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=ji.distanceTo(Mi);e.setAttribute(`lineDistance`,new mr(n,1))}else q(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fi.copy(n.boundingSphere),Fi.applyMatrix4(r),Fi.radius+=i,e.ray.intersectsSphere(Fi)===!1)return;Ni.copy(r).invert(),Pi.copy(e.ray).applyMatrix4(Ni);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=zi(this,e,Pi,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=zi(this,e,Pi,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=zi(this,e,Pi,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=zi(this,e,Pi,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function zi(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(ji.fromBufferAttribute(s,i),Mi.fromBufferAttribute(s,a),n.distanceSqToSegment(ji,Mi,Ii,Li)>r)return;Ii.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Ii);if(!(c<t.near||c>t.far))return{distance:c,point:Li.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Bi=new Y,Vi=new Y,Hi=class extends Ri{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Bi.fromBufferAttribute(t,e),Vi.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Bi.distanceTo(Vi);e.setAttribute(`lineDistance`,new mr(n,1))}else q(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Ui=class extends Ri{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},Wi=class extends Fr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new X(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Gi=new Yt,Ki=new Br,qi=new vr,Ji=new Y,Yi=class extends Cn{constructor(e=new Er,t=new Wi){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qi.copy(n.boundingSphere),qi.applyMatrix4(r),qi.radius+=i,e.ray.intersectsSphere(qi)===!1)return;Gi.copy(r).invert(),Ki.copy(e.ray).applyMatrix4(Gi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Ji.fromBufferAttribute(l,n),Xi(Ji,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Ji.fromBufferAttribute(l,a),Xi(Ji,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Xi(e,t,n,r,i,a,o){let s=Ki.distanceSqToPoint(e);if(s<n){let n=new Y;Ki.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Zi=class extends Ut{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qi=class extends Ut{constructor(e,t,n=_,r,i,a,s=o,c=o,l,u=O,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,a,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new zt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},$i=class extends Qi{constructor(e,t=_,n=301,r,i,a=o,s=o,c,l=O){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,i,a,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ea=class extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ta=class e extends Er{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new mr(c,3)),this.setAttribute(`normal`,new mr(l,3)),this.setAttribute(`uv`,new mr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Y;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function na(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=ra(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ua(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return aa(a,o,n,s,c,l,0),o}function ra(e,t,n,r,i){let a;if(i===Pa(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=ja(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=ja(i/r|0,e[i],e[i+1],a);return a&&Ca(a,a.next)&&(Ma(a),a=a.next),a}function ia(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Ca(n,n.next)||Sa(n.prev,n,n.next)===0)){if(Ma(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function aa(e,t,n,r,i,a,o){if(!e)return;!o&&a&&ha(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?sa(e,r,i,a):oa(e)){t.push(c.i,e.i,l.i),Ma(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=ca(ia(e),t),aa(e,t,n,r,i,a,2)):o===2&&la(e,t,n,r,i,a):aa(ia(e),t,n,r,i,a,1);break}}}function oa(e){let t=e.prev,n=e,r=e.next;if(Sa(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&ba(i,s,a,c,o,l,m.x,m.y)&&Sa(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function sa(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Sa(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=_a(p,m,t,n,r),v=_a(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ba(s,u,c,d,l,f,y.x,y.y)&&Sa(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ba(s,u,c,d,l,f,b.x,b.y)&&Sa(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ba(s,u,c,d,l,f,y.x,y.y)&&Sa(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ba(s,u,c,d,l,f,b.x,b.y)&&Sa(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function ca(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ca(r,i)&&wa(r,n,n.next,i)&&Oa(r,i)&&Oa(i,r)&&(t.push(r.i,n.i,i.i),Ma(n),Ma(n.next),n=e=i),n=n.next}while(n!==e);return ia(n)}function la(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&xa(o,e)){let s=Aa(o,e);o=ia(o,o.next),s=ia(s,s.next),aa(o,t,n,r,i,a,0),aa(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ua(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=ra(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(va(o))}i.sort(da);for(let e=0;e<i.length;e++)n=fa(i[e],n);return n}function da(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function fa(e,t){let n=pa(e,t);if(!n)return t;let r=Aa(n,e);return ia(r,r.next),ia(n,n.next)}function pa(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ca(e,n))return n;do{if(Ca(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&ya(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Oa(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&ma(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function ma(e,t){return Sa(e.prev,e,t.prev)<0&&Sa(t.next,e,e.next)<0}function ha(e,t,n,r){let i=e;do i.z===0&&(i.z=_a(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,ga(i)}function ga(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function _a(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function va(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function ya(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function ba(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&ya(e,t,n,r,i,a,o,s)}function xa(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Da(e,t)&&(Oa(e,t)&&Oa(t,e)&&ka(e,t)&&(Sa(e.prev,e,t.prev)||Sa(e,t.prev,t))||Ca(e,t)&&Sa(e.prev,e,e.next)>0&&Sa(t.prev,t,t.next)>0)}function Sa(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ca(e,t){return e.x===t.x&&e.y===t.y}function wa(e,t,n,r){let i=Ea(Sa(e,t,n)),a=Ea(Sa(e,t,r)),o=Ea(Sa(n,r,e)),s=Ea(Sa(n,r,t));return!!(i!==a&&o!==s||i===0&&Ta(e,n,t)||a===0&&Ta(e,r,t)||o===0&&Ta(n,e,r)||s===0&&Ta(n,t,r))}function Ta(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Ea(e){return e>0?1:e<0?-1:0}function Da(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&wa(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Oa(e,t){return Sa(e.prev,e,e.next)<0?Sa(e,t,e.next)>=0&&Sa(e,e.prev,t)>=0:Sa(e,t,e.prev)<0||Sa(e,e.next,t)<0}function ka(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Aa(e,t){let n=Na(e.i,e.x,e.y),r=Na(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function ja(e,t,n,r){let i=Na(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Ma(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Na(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Pa(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Fa=class{static triangulate(e,t,n=2){return na(e,t,n)}},Ia=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];La(e),Ra(n,e);let a=e.length;t.forEach(La);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Ra(n,t[e]);let o=Fa.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function La(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Ra(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var za=class e extends Er{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new mr(p,3)),this.setAttribute(`normal`,new mr(m,3)),this.setAttribute(`uv`,new mr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ba=class e extends Er{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new Y,p=new J;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new mr(s,3)),this.setAttribute(`normal`,new mr(c,3)),this.setAttribute(`uv`,new mr(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Va=class e extends Er{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new Y,d=new Y,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new mr(p,3)),this.setAttribute(`normal`,new mr(m,3)),this.setAttribute(`uv`,new mr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ha(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Wa(i))i.isRenderTargetTexture?(q(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Wa(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ua(e){let t={};for(let n=0;n<e.length;n++){let r=Ha(e[n]);for(let e in r)t[e]=r[e]}return t}function Wa(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ga(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ka(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Nt.workingColorSpace}var qa={clone:Ha,merge:Ua},Ja=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ya=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xa=class extends Fr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ja,this.fragmentShader=Ya,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ha(e.uniforms),this.uniformsGroups=Ga(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new X().setHex(r.value);break;case`v2`:this.uniforms[n].value=new J().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Y().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Wt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Ot().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Yt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Za=class extends Xa{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Qa=class extends Fr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new X(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$a=class extends Qa{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return rt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new X(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new X(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new X(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},eo=class extends Fr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},to=class extends Fr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Me,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},no=class extends Fr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ro(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function io(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function ao(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function oo(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function so(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push(...o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var co=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},lo=class extends co{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Oe,endingEnd:Oe}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case ke:i=e,o=2*t-n;break;case Ae:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case ke:a=e,s=2*n-t;break;case Ae:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},uo=class extends co{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},fo=class extends co{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},po=class extends co{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=go(n,t,g,y,r);i[p]=mo(x,o,_,b,m)}return i}};function mo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function ho(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function go(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=mo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=ho(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var _o=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ro(t,this.TimeBufferType),this.values=ro(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ro(e.times,Array),values:ro(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),io(e.settings)&&(n.settings={inTangents:ro(e.settings.inTangents,Array),outTangents:ro(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new lo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new po(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Te:t=this.InterpolantFactoryMethodDiscrete;break;case Ee:t=this.InterpolantFactoryMethodLinear;break;case K:t=this.InterpolantFactoryMethodSmooth;break;case De:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return q(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Te;case this.InterpolantFactoryMethodLinear:return Ee;case this.InterpolantFactoryMethodSmooth:return K;case this.InterpolantFactoryMethodBezier:return De}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;io(this.settings)&&(vo(this.settings.inTangents,e),vo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(qe(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(qe(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){qe(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){qe(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ve(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){qe(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===K,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,io(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function vo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}_o.prototype.ValueTypeName=``,_o.prototype.TimeBufferType=Float32Array,_o.prototype.ValueBufferType=Float32Array,_o.prototype.DefaultInterpolation=Ee;var yo=class extends _o{constructor(e,t,n){super(e,t,n)}};yo.prototype.ValueTypeName=`bool`,yo.prototype.ValueBufferType=Array,yo.prototype.DefaultInterpolation=Te,yo.prototype.InterpolantFactoryMethodLinear=void 0,yo.prototype.InterpolantFactoryMethodSmooth=void 0;var bo=class extends _o{constructor(e,t,n,r){super(e,t,n,r)}};bo.prototype.ValueTypeName=`color`;var xo=class extends _o{constructor(e,t,n,r){super(e,t,n,r)}};xo.prototype.ValueTypeName=`number`;var So=class extends co{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Tt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Co=class extends _o{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new So(this.times,this.values,this.getValueSize(),e)}};Co.prototype.ValueTypeName=`quaternion`,Co.prototype.InterpolantFactoryMethodSmooth=void 0;var wo=class extends _o{constructor(e,t,n){super(e,t,n)}};wo.prototype.ValueTypeName=`string`,wo.prototype.ValueBufferType=Array,wo.prototype.DefaultInterpolation=Te,wo.prototype.InterpolantFactoryMethodLinear=void 0,wo.prototype.InterpolantFactoryMethodSmooth=void 0;var To=class extends _o{constructor(e,t,n,r){super(e,t,n,r)}};To.prototype.ValueTypeName=`vector`;var Eo=class{constructor(e=``,t=-1,n=[],r=je){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=nt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(Oo(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i.userData=JSON.parse(e.userData||`{}`),i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let e=0,r=n.length;e!==r;++e)t.push(_o.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=ao(o);o=oo(o,1,c),s=oo(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new xo(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Do(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return xo;case`vector`:case`vector2`:case`vector3`:case`vector4`:return To;case`color`:return bo;case`quaternion`:return Co;case`bool`:case`boolean`:return yo;case`string`:return wo}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function Oo(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Do(e.type);if(e.times===void 0){let t=[],n=[];so(e.keys,t,n,`value`),e.times=t,e.values=n}let n;return n=t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e),io(e.settings)&&(n.settings={inTangents:ro(e.settings.inTangents,Float32Array),outTangents:ro(e.settings.outTangents,Float32Array)}),n}var ko={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Ao(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Ao(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Ao(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var jo=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Mo=class{constructor(e){this.manager=e===void 0?jo:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Mo.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var No={},Po=class extends Error{constructor(e,t){super(e),this.response=t}},Fo=class extends Mo{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=ko.get(`file:${e}`);if(i!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0);return}if(No[e]!==void 0){No[e].push({onLoad:t,onProgress:n,onError:r});return}No[e]=[],No[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&q(`FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=No[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new Po(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{ko.add(`file:${e}`,t);let n=No[e];delete No[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=No[e];if(n===void 0)throw this.manager.itemError(e),t;delete No[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Io=new WeakMap,Lo=class extends Mo{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=ko.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Io.get(a);e===void 0&&(e=[],Io.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=He(`img`);function s(){l(),t&&t(this);let n=Io.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Io.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),ko.remove(`image:${e}`);let n=Io.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Io.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ko.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Ro=class extends Mo{constructor(e){super(e)}load(e,t,n,r){let i=new Ut,a=new Lo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},zo=class extends Cn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new X(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Bo=class extends zo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new X(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Vo=new Yt,Ho=new Y,Uo=new Y,Wo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.mapType=f,this.map=null,this.mapPass=null,this.matrix=new Yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ki,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ho.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ho),Uo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Uo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Vo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Vo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Go=new Y,Ko=new Tt,qo=new Y,Jo=class extends Cn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Yt,this.projectionMatrix=new Yt,this.projectionMatrixInverse=new Yt,this.coordinateSystem=ze,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Go,Ko,qo),qo.x===1&&qo.y===1&&qo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Go,Ko,qo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Go,Ko,qo),qo.x===1&&qo.y===1&&qo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Go,Ko,qo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Yo=new Y,Xo=new J,Zo=new J,Qo=class extends Jo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=tt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(et*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return tt*2*Math.atan(Math.tan(et*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Yo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yo.x,Yo.y).multiplyScalar(-e/Yo.z),Yo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yo.x,Yo.y).multiplyScalar(-e/Yo.z)}getViewSize(e,t){return this.getViewBounds(e,Xo,Zo),t.subVectors(Zo,Xo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(et*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$o=class extends Wo{constructor(){super(new Qo(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=tt*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},es=class extends zo{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.target=new Cn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new $o}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},ts=class extends Wo{constructor(){super(new Qo(90,1,.5,500)),this.isPointLightShadow=!0}},ns=class extends zo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new ts}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},rs=class extends Jo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},is=class extends Wo{constructor(){super(new rs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},as=class extends zo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.target=new Cn,this.shadow=new is}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},os=class{static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},ss=new WeakMap,cs=class extends Mo{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&q(`ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&q(`ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=ko.get(`image-bitmap:${e}`);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{ss.has(a)===!0?(r&&r(ss.get(a)),i.manager.itemError(e),i.manager.itemEnd(e)):(t&&t(n),i.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,o.signal=typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign({},i.options,{colorSpaceConversion:`none`}))}).then(function(n){return ko.add(`image-bitmap:${e}`,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),ss.set(s,t),ko.remove(`image-bitmap:${e}`),i.manager.itemError(e),i.manager.itemEnd(e)});ko.add(`image-bitmap:${e}`,s),i.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},ls=-90,us=1,ds=class extends Cn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Qo(ls,us,e,t);r.layers=this.layers,this.add(r);let i=new Qo(ls,us,e,t);i.layers=this.layers,this.add(i);let a=new Qo(ls,us,e,t);a.layers=this.layers,this.add(a);let o=new Qo(ls,us,e,t);o.layers=this.layers,this.add(o);let s=new Qo(ls,us,e,t);s.layers=this.layers,this.add(s);let c=new Qo(ls,us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},fs=class extends Qo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ps=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=ms.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function ms(){this._document.hidden===!1&&this.reset()}var hs=`\\[\\]\\.:\\/`,gs=RegExp(`[\\[\\]\\.:\\/]`,`g`),_s=`[^\\[\\]\\.:\\/]`,vs=`[^`+hs.replace(`\\.`,``)+`]`,ys=`((?:WC+[\\/:])*)`.replace(`WC`,_s),bs=`(WCOD+)?`.replace(`WCOD`,vs),xs=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,_s),Ss=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,_s),Cs=RegExp(`^`+ys+bs+xs+Ss+`$`),ws=[`material`,`materials`,`bones`,`map`],Ts=class{constructor(e,t,n){let r=n||Es.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Es=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(gs,``)}static parseTrackName(e){let t=Cs.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ws.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){q(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){qe(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){qe(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){qe(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){qe(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){qe(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){qe(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){qe(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;qe(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){qe(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){qe(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Es.Composite=Ts,Es.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Es.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Es.prototype.GetterByBindingType=[Es.prototype._getValue_direct,Es.prototype._getValue_array,Es.prototype._getValue_arrayElement,Es.prototype._getValue_toArray],Es.prototype.SetterByBindingTypeAndVersioning=[[Es.prototype._setValue_direct,Es.prototype._setValue_direct_setNeedsUpdate,Es.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_array,Es.prototype._setValue_array_setNeedsUpdate,Es.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_arrayElement,Es.prototype._setValue_arrayElement_setNeedsUpdate,Es.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_fromArray,Es.prototype._setValue_fromArray_setNeedsUpdate,Es.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ds=new Yt,Os=class{constructor(e,t,n=0,r=1/0){this.ray=new Br(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new sn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):qe(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Ds.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ds),this}intersectObject(e,t=!0,n=[]){return As(e,this,n,t),n.sort(ks),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)As(e[r],this,n,t);return n.sort(ks),n}};function ks(e,t){return e.distance-t.distance}function As(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)As(r[e],t,n,!0)}}var js=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=rt(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(rt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var Ms=class extends Hi{constructor(e=10,t=10,n=4473924,r=8947848){n=new X(n),r=new X(r);let i=t/2,a=e/t,o=e/2,s=[],c=[];for(let e=0,l=0,u=-o;e<=t;e++,u+=a){s.push(-o,0,u,o,0,u),s.push(u,0,-o,u,0,o);let t=e===i?n:r;t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3}let l=new Er;l.setAttribute(`position`,new mr(s,3)),l.setAttribute(`color`,new mr(c,3));let u=new Ai({vertexColors:!0,toneMapped:!1});super(l,u),this.type=`GridHelper`}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},Ns=class extends Ze{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Ps(e,t,n,r){let i=Fs(r);switch(n){case T:return e*t;case A:return e*t/i.components*i.byteLength;case j:return e*t/i.components*i.byteLength;case M:return e*t*2/i.components*i.byteLength;case N:return e*t*2/i.components*i.byteLength;case E:return e*t*3/i.components*i.byteLength;case D:return e*t*4/i.components*i.byteLength;case P:return e*t*4/i.components*i.byteLength;case F:case I:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case L:case R:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ee:case te:return Math.max(e,16)*Math.max(t,8)/4;case z:case B:return Math.max(e,8)*Math.max(t,8)/2;case V:case H:case re:case ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ne:case ae:case oe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case se:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ce:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case le:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ue:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case de:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case fe:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case pe:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case me:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case he:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ge:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case _e:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case ve:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case ye:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case be:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case xe:case U:case Se:return Math.ceil(e/4)*Math.ceil(t/4)*16;case W:case Ce:return Math.ceil(e/4)*Math.ceil(t/4)*8;case G:case we:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Fs(e){switch(e){case f:case p:return{byteLength:1,components:1};case h:case m:case y:return{byteLength:2,components:1};case b:case x:return{byteLength:2,components:4};case _:case g:case v:return{byteLength:4,components:1};case C:case w:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?q(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Is(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ls(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Rs={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new X(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new X(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new X(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new X(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},zs={basic:{uniforms:Ua([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:Rs.meshbasic_vert,fragmentShader:Rs.meshbasic_frag},lambert:{uniforms:Ua([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new X(0)},envMapIntensity:{value:1}}]),vertexShader:Rs.meshlambert_vert,fragmentShader:Rs.meshlambert_frag},phong:{uniforms:Ua([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new X(0)},specular:{value:new X(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Rs.meshphong_vert,fragmentShader:Rs.meshphong_frag},standard:{uniforms:Ua([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new X(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Rs.meshphysical_vert,fragmentShader:Rs.meshphysical_frag},toon:{uniforms:Ua([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new X(0)}}]),vertexShader:Rs.meshtoon_vert,fragmentShader:Rs.meshtoon_frag},matcap:{uniforms:Ua([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:Rs.meshmatcap_vert,fragmentShader:Rs.meshmatcap_frag},points:{uniforms:Ua([Z.points,Z.fog]),vertexShader:Rs.points_vert,fragmentShader:Rs.points_frag},dashed:{uniforms:Ua([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Rs.linedashed_vert,fragmentShader:Rs.linedashed_frag},depth:{uniforms:Ua([Z.common,Z.displacementmap]),vertexShader:Rs.depth_vert,fragmentShader:Rs.depth_frag},normal:{uniforms:Ua([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:Rs.meshnormal_vert,fragmentShader:Rs.meshnormal_frag},sprite:{uniforms:Ua([Z.sprite,Z.fog]),vertexShader:Rs.sprite_vert,fragmentShader:Rs.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Rs.background_vert,fragmentShader:Rs.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Rs.backgroundCube_vert,fragmentShader:Rs.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Rs.cube_vert,fragmentShader:Rs.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Rs.equirect_vert,fragmentShader:Rs.equirect_frag},distance:{uniforms:Ua([Z.common,Z.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Rs.distance_vert,fragmentShader:Rs.distance_frag},shadow:{uniforms:Ua([Z.lights,Z.fog,{color:{value:new X(0)},opacity:{value:1}}]),vertexShader:Rs.shadow_vert,fragmentShader:Rs.shadow_frag}};zs.physical={uniforms:Ua([zs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new X(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new X(0)},specularColor:{value:new X(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Rs.meshphysical_vert,fragmentShader:Rs.meshphysical_frag};var Bs={r:0,b:0,g:0},Vs=new Yt,Hs=new Ot;Hs.set(-1,0,0,0,1,0,0,0,1);function Us(e,t,n,r,i,a){let o=new X(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new $r(new ta(1,1,1),new Xa({name:`BackgroundCubeMaterial`,uniforms:Ha(zs.backgroundCube.uniforms),vertexShader:zs.backgroundCube.vertexShader,fragmentShader:zs.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Vs.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Hs),l.material.toneMapped=Nt.getTransfer(i.colorSpace)!==Ie,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new $r(new za(2,2),new Xa({name:`BackgroundMaterial`,uniforms:Ha(zs.background.uniforms),vertexShader:zs.background.vertexShader,fragmentShader:zs.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Nt.getTransfer(i.colorSpace)!==Ie,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Bs,Ka(e)),n.buffers.color.setClear(Bs.r,Bs.g,Bs.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ws(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Gs(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ks(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(q(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&q(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function qs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Nr,s=new Ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Js=4,Ys=6,Xs=20,Zs=256,Qs=new rs,$s=new X,ec=null,tc=0,nc=0,rc=!1,ic=new Y,ac=new Y,oc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ic}=i;ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ec,tc,nc),this._renderer.xr.enabled=rc,e.scissorTest=!1,lc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:l,minFilter:l,generateMipmaps:!1,type:y,format:D,colorSpace:Pe,depthBuffer:!1},r=cc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=sc(r)),this._blurMaterial=dc(r,e,t),this._ggxMaterial=uc(r,e,t)}return r}_compileMaterial(e){let t=new $r(new Er,e);this._renderer.compile(t,Qs)}_sceneToCubeUV(e,t,n,r,i){let a=new Qo(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor($s),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $r(new ta,new Vr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy($s),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;lc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=pc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;lc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Qs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Js?n-d+Js:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,lc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Qs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,lc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Qs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];lc(t,3*l*(r>this._lodMax-Js?r-this._lodMax+Js:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Qs)}};function sc(e){let t=[],n=[],r=e,i=e-Js+1+Ys;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?ac.set(1,r,n):e===1?ac.set(-n,1,-r):e===2?ac.set(-n,r,1):e===3?ac.set(-1,r,-n):e===4?ac.set(-n,-1,r):ac.set(n,r,-1),ac.toArray(l,(e*6+t)*3)}}let u=new Er;u.setAttribute(`position`,new dr(c,3)),u.setAttribute(`outputDirection`,new dr(l,3)),n.push(new $r(u,null)),r>Js&&r--}return{lodMeshes:n,sizeLods:t}}function cc(e,t,n){let r=new Kt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function lc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function uc(e,t,n){return new Xa({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Zs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function dc(e,t,n){return new Xa({name:`SphericalGaussianBlur`,defines:{SAMPLES:Xs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function fc(){return new Xa({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function pc(){return new Xa({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var hc=class extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Zi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ta(5,5,5),i=new Xa({name:`CubemapFromEquirect`,uniforms:Ha(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new $r(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=l),new ds(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function gc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new hc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new oc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new oc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function _c(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Je(`WebGLRenderer: `+e+` extension not supported.`),t}}}function vc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?pr:fr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function yc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function bc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:qe(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function xc(e,t,n){let r=new WeakMap,i=new Wt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new qt(h,p,m,u);g.type=v,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new J(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Sc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Cc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function wc(e,t,n,r,i,a){let o=new Kt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Er;l.setAttribute(`position`,new mr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new mr([0,2,0,0,2,0],2));let u=new Za({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new $r(l,u),f=new rs(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,b=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Kt(t,n,{type:y,depthBuffer:!1,stencilBuffer:!1}),c=new Kt(t,n,{type:y,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Nt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Cc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Tc=new Ut,Ec=new Qi(1,1),Dc=new qt,Oc=new Jt,kc=new Zi,Ac=[],jc=[],Mc=new Float32Array(16),Nc=new Float32Array(9),Pc=new Float32Array(4);function Fc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ac[i];if(a===void 0&&(a=new Float32Array(i),Ac[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ic(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Lc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Rc(e,t){let n=jc[t];n===void 0&&(n=new Int32Array(t),jc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function zc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Bc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ic(n,t))return;e.uniform2fv(this.addr,t),Lc(n,t)}}function Vc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ic(n,t))return;e.uniform3fv(this.addr,t),Lc(n,t)}}function Hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ic(n,t))return;e.uniform4fv(this.addr,t),Lc(n,t)}}function Uc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ic(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Lc(n,t)}else{if(Ic(n,r))return;Pc.set(r),e.uniformMatrix2fv(this.addr,!1,Pc),Lc(n,r)}}function Wc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ic(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Lc(n,t)}else{if(Ic(n,r))return;Nc.set(r),e.uniformMatrix3fv(this.addr,!1,Nc),Lc(n,r)}}function Gc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ic(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Lc(n,t)}else{if(Ic(n,r))return;Mc.set(r),e.uniformMatrix4fv(this.addr,!1,Mc),Lc(n,r)}}function Kc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function qc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ic(n,t))return;e.uniform2iv(this.addr,t),Lc(n,t)}}function Jc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ic(n,t))return;e.uniform3iv(this.addr,t),Lc(n,t)}}function Yc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ic(n,t))return;e.uniform4iv(this.addr,t),Lc(n,t)}}function Xc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ic(n,t))return;e.uniform2uiv(this.addr,t),Lc(n,t)}}function Qc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ic(n,t))return;e.uniform3uiv(this.addr,t),Lc(n,t)}}function $c(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ic(n,t))return;e.uniform4uiv(this.addr,t),Lc(n,t)}}function el(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Ec.compareFunction=n.isReversedDepthBuffer()?518:515,a=Ec):a=Tc,n.setTexture2D(t||a,i)}function tl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Oc,i)}function nl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||kc,i)}function rl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Dc,i)}function il(e){switch(e){case 5126:return zc;case 35664:return Bc;case 35665:return Vc;case 35666:return Hc;case 35674:return Uc;case 35675:return Wc;case 35676:return Gc;case 5124:case 35670:return Kc;case 35667:case 35671:return qc;case 35668:case 35672:return Jc;case 35669:case 35673:return Yc;case 5125:return Xc;case 36294:return Zc;case 36295:return Qc;case 36296:return $c;case 35678:case 36198:case 36298:case 36306:case 35682:return el;case 35679:case 36299:case 36307:return tl;case 35680:case 36300:case 36308:case 36293:return nl;case 36289:case 36303:case 36311:case 36292:return rl}}function al(e,t){e.uniform1fv(this.addr,t)}function ol(e,t){let n=Fc(t,this.size,2);e.uniform2fv(this.addr,n)}function sl(e,t){let n=Fc(t,this.size,3);e.uniform3fv(this.addr,n)}function cl(e,t){let n=Fc(t,this.size,4);e.uniform4fv(this.addr,n)}function ll(e,t){let n=Fc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function ul(e,t){let n=Fc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function dl(e,t){let n=Fc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function fl(e,t){e.uniform1iv(this.addr,t)}function pl(e,t){e.uniform2iv(this.addr,t)}function ml(e,t){e.uniform3iv(this.addr,t)}function hl(e,t){e.uniform4iv(this.addr,t)}function gl(e,t){e.uniform1uiv(this.addr,t)}function _l(e,t){e.uniform2uiv(this.addr,t)}function vl(e,t){e.uniform3uiv(this.addr,t)}function yl(e,t){e.uniform4uiv(this.addr,t)}function bl(e,t,n){let r=this.cache,i=t.length,a=Rc(n,i);Ic(r,a)||(e.uniform1iv(this.addr,a),Lc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Ec:Tc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function xl(e,t,n){let r=this.cache,i=t.length,a=Rc(n,i);Ic(r,a)||(e.uniform1iv(this.addr,a),Lc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Oc,a[e])}function Sl(e,t,n){let r=this.cache,i=t.length,a=Rc(n,i);Ic(r,a)||(e.uniform1iv(this.addr,a),Lc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||kc,a[e])}function Cl(e,t,n){let r=this.cache,i=t.length,a=Rc(n,i);Ic(r,a)||(e.uniform1iv(this.addr,a),Lc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Dc,a[e])}function wl(e){switch(e){case 5126:return al;case 35664:return ol;case 35665:return sl;case 35666:return cl;case 35674:return ll;case 35675:return ul;case 35676:return dl;case 5124:case 35670:return fl;case 35667:case 35671:return pl;case 35668:case 35672:return ml;case 35669:case 35673:return hl;case 5125:return gl;case 36294:return _l;case 36295:return vl;case 36296:return yl;case 35678:case 36198:case 36298:case 36306:case 35682:return bl;case 35679:case 36299:case 36307:return xl;case 35680:case 36300:case 36308:case 36293:return Sl;case 36289:case 36303:case 36311:case 36292:return Cl}}var Tl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=il(t.type)}},El=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wl(t.type)}},Dl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ol=/(\w+)(\])?(\[|\.)?/g;function kl(e,t){e.seq.push(t),e.map[t.id]=t}function Al(e,t,n){let r=e.name,i=r.length;for(Ol.lastIndex=0;;){let a=Ol.exec(r),o=Ol.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){kl(n,l===void 0?new Tl(s,e,t):new El(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Dl(s),kl(n,e)),n=e}}}var jl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Al(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ml(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Nl=37297,Pl=0;function Fl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Il=new Ot;function Ll(e){Nt._getMatrix(Il,Nt.workingColorSpace,e);let t=`mat3( ${Il.elements.map(e=>e.toFixed(4))} )`;switch(Nt.getTransfer(e)){case Fe:return[t,`LinearTransferOETF`];case Ie:return[t,`sRGBTransferOETF`];default:return q(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Rl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Fl(e.getShaderSource(t),r)}return i}function zl(e,t){let n=Ll(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Bl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Vl(e,t){let n=Bl[t];return n===void 0?(q(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Hl=new Y;function Ul(){return Nt.getLuminanceCoefficients(Hl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Hl.x.toFixed(4)}, ${Hl.y.toFixed(4)}, ${Hl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Wl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ql).join(`
`)}function Gl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Kl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ql(e){return e!==``}function Jl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Xl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zl(e){return e.replace(Xl,$l)}var Ql=new Map;function $l(e,t){let n=Rs[t];if(n===void 0){let e=Ql.get(t);if(e!==void 0)n=Rs[e],q(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Zl(n)}var eu=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tu(e){return e.replace(eu,nu)}function nu(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ru(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var iu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function au(e){return iu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ou={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function su(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:ou[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var cu={302:`ENVMAP_MODE_REFRACTION`};function lu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:cu[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var uu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function du(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:uu[e.combine]||`ENVMAP_BLENDING_NONE`}function fu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function pu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=au(n),l=su(n),u=lu(n),d=du(n),f=fu(n),p=Wl(n),m=Gl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ql).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ql).join(`
`),_.length>0&&(_+=`
`)):(g=[ru(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ql).join(`
`),_=[ru(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Rs.tonemapping_pars_fragment,n.toneMapping===0?``:Vl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Rs.colorspace_pars_fragment,zl(`linearToOutputTexel`,n.outputColorSpace),Ul(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ql).join(`
`)),o=Zl(o),o=Jl(o,n),o=Yl(o,n),s=Zl(s),s=Jl(s,n),s=Yl(s,n),o=tu(o),s=tu(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Ml(i,i.VERTEX_SHADER,y),S=Ml(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Rl(i,x,`vertex`),n=Rl(i,S,`fragment`);qe(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):q(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new jl(i,h),T=Kl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Nl)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Pl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var mu=0,hu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new gu(e),t.set(e,n)),n}},gu=class{constructor(e){this.id=mu++,this.code=e,this.usedTimes=0}};function _u(e){return e===1030||e===37490||e===36285}function vu(e,t,n,r,i,a){let o=new sn,s=new hu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&q(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=zs[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,I=!!i.matcap,L=!!x,R=!!i.aoMap,z=!!i.lightMap,ee=!!i.bumpMap&&i.wireframe===!1,B=!!i.normalMap,te=!!i.displacementMap,V=!!i.emissiveMap,H=!!i.metalnessMap,ne=!!i.roughnessMap,re=i.anisotropy>0,ie=i.clearcoat>0,ae=i.dispersion>0,oe=i.retroreflectivity>0,se=i.iridescence>0,ce=i.sheen>0,le=i.transmission>0,ue=re&&!!i.anisotropyMap,de=ie&&!!i.clearcoatMap,fe=ie&&!!i.clearcoatNormalMap,pe=ie&&!!i.clearcoatRoughnessMap,me=se&&!!i.iridescenceMap,he=se&&!!i.iridescenceThicknessMap,ge=ce&&!!i.sheenColorMap,_e=ce&&!!i.sheenRoughnessMap,ve=!!i.specularMap,ye=!!i.specularColorMap,be=!!i.specularIntensityMap,xe=le&&!!i.transmissionMap,U=le&&!!i.thicknessMap,Se=!!i.gradientMap,W=!!i.alphaMap,Ce=i.alphaTest>0,G=!!i.alphaHash,we=!!i.extensions,Te=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Te=e.toneMapping);let Ee={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Nt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:I,envMap:L,envMapMode:L&&x.mapping,envMapCubeUVHeight:S,aoMap:R,lightMap:z,bumpMap:ee,normalMap:B,displacementMap:te,emissiveMap:V,normalMapObjectSpace:B&&i.normalMapType===1,normalMapTangentSpace:B&&i.normalMapType===0,packedNormalMap:B&&i.normalMapType===0&&_u(i.normalMap.format),metalnessMap:H,roughnessMap:ne,anisotropy:re,anisotropyMap:ue,clearcoat:ie,clearcoatMap:de,clearcoatNormalMap:fe,clearcoatRoughnessMap:pe,dispersion:ae,retroreflection:oe,iridescence:se,iridescenceMap:me,iridescenceThicknessMap:he,sheen:ce,sheenColorMap:ge,sheenRoughnessMap:_e,specularMap:ve,specularColorMap:ye,specularIntensityMap:be,transmission:le,transmissionMap:xe,thicknessMap:U,gradientMap:Se,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:W,alphaTest:Ce,alphaHash:G,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:R&&m(i.aoMap.channel),lightMapUv:z&&m(i.lightMap.channel),bumpMapUv:ee&&m(i.bumpMap.channel),normalMapUv:B&&m(i.normalMap.channel),displacementMapUv:te&&m(i.displacementMap.channel),emissiveMapUv:V&&m(i.emissiveMap.channel),metalnessMapUv:H&&m(i.metalnessMap.channel),roughnessMapUv:ne&&m(i.roughnessMap.channel),anisotropyMapUv:ue&&m(i.anisotropyMap.channel),clearcoatMapUv:de&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:fe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:he&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:_e&&m(i.sheenRoughnessMap.channel),specularMapUv:ve&&m(i.specularMap.channel),specularColorMapUv:ye&&m(i.specularColorMap.channel),specularIntensityMapUv:be&&m(i.specularIntensityMap.channel),transmissionMapUv:xe&&m(i.transmissionMap.channel),thicknessMapUv:U&&m(i.thicknessMap.channel),alphaMapUv:W&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(B||re),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||W),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&B===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Te,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&Nt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:V&&i.emissiveMap.isVideoTexture===!0&&Nt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:we&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(we&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=zs[t];n=qa.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new pu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function yu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function bu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function xu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Su(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||bu),r.length>1&&r.sort(t||xu),i.length>1&&i.sort(t||xu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Cu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Su,e.set(t,[i])):n>=r.length?(i=new Su,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function wu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new Y,color:new X};break;case`SpotLight`:n={position:new Y,direction:new Y,color:new X,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Y,color:new X,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Y,skyColor:new X,groundColor:new X};break;case`RectAreaLight`:n={color:new X,position:new Y,halfWidth:new Y,halfHeight:new Y}}return e[t.id]=n,n}}}function Tu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Eu=0;function Du(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ou(e){let t=new wu,n=Tu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Y);let i=new Y,a=new Yt,o=new Yt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Du);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Eu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function ku(e){let t=new Ou(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Au(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new ku(e),t.set(n,[a])):r>=i.length?(a=new ku(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var ju=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Nu=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],Pu=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],Fu=new Yt,Iu=new Y,Lu=new Y;function Ru(e,t,n){let r=new ki,i=new J,a=new J,s=new Wt,c=new to,u=new no,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new Xa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:ju,fragmentShader:Mu}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let g=new Er;g.setAttribute(`position`,new dr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new $r(g,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,c){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(q(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){q(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;i.copy(p.mapSize);let g=p.getFrameExtents();i.multiply(g),a.copy(p.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(a.x=Math.floor(f/g.x),i.x=a.x*g.x,p.mapSize.x=a.x),i.y>f&&(a.y=Math.floor(f/g.y),i.y=a.y*g.y,p.mapSize.y=a.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||h===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){q(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Kt(i.x,i.y,{format:M,type:y,minFilter:l,magFilter:l,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Qi(i.x,i.y,v),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=O,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o}else d.isPointLight?(p.map=new hc(i.x),p.map.depthTexture=new $i(i.x,_)):(p.map=new Kt(i.x,i.y),p.map.depthTexture=new Qi(i.x,i.y,_)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=O,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=l,p.map.depthTexture.magFilter=l):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==i.x||p.map.height!==i.y)&&p.map.setSize(i.x,i.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,c);for(let t=0;t<x;t++){let i=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Iu.setFromMatrixPosition(d.matrixWorld),e.position.copy(Iu),Lu.copy(e.position),Lu.add(Nu[t]),e.up.copy(Pu[t]),e.lookAt(Lu),e.updateMatrixWorld(),n.makeTranslation(-Iu.x,-Iu.y,-Iu.z),Fu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Fu,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);s.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),m.viewport(s)}r=p.getFrustum(t),T(n,c,i,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,c),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let a=t.update(b);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null?n.mapPass=new Kt(i.x,i.y,{format:M,type:y}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,b,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value.set(n.map.width,n.map.height),h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function zu(e,t){function n(){let t=!1,n=new Wt,r=null,i=new Wt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?H(e.DEPTH_TEST):ne(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Xe[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?H(e.STENCIL_TEST):ne(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let I=null,L={},R=e.getParameter(e.SCISSOR_BOX),z=e.getParameter(e.VIEWPORT),ee=new Wt().fromArray(R),B=new Wt().fromArray(z);function te(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let V={};V[e.TEXTURE_2D]=te(e.TEXTURE_2D,e.TEXTURE_2D,1),V[e.TEXTURE_CUBE_MAP]=te(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[e.TEXTURE_2D_ARRAY]=te(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),V[e.TEXTURE_3D]=te(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),H(e.DEPTH_TEST),o.setFunc(3),ue(!1),de(1),H(e.CULL_FACE),ce(0);function H(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ne(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function re(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ie(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ae(t){return h!==t&&(e.useProgram(t),h=t,!0)}let oe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};oe[103]=e.MIN,oe[104]=e.MAX;let se={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ce(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ne(e.BLEND),g=!1);return}if(g===!1&&(H(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:qe(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:qe(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:qe(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:qe(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(oe[n],oe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(se[r],se[i],se[o],se[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function le(t,n){t.side===2?ne(e.CULL_FACE):H(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ue(r),t.blending===1&&t.transparent===!1?ce(0):ce(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),pe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?H(e.SAMPLE_ALPHA_TO_COVERAGE):ne(e.SAMPLE_ALPHA_TO_COVERAGE)}function ue(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function de(t){t===0?ne(e.CULL_FACE):(H(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function fe(t){t!==k&&(N&&e.lineWidth(t),k=t)}function pe(t,n,r){t?(H(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ne(e.POLYGON_OFFSET_FILL)}function me(t){t?H(e.SCISSOR_TEST):ne(e.SCISSOR_TEST)}function he(t){t===void 0&&(t=e.TEXTURE0+M-1),I!==t&&(e.activeTexture(t),I=t)}function ge(t,n,r){r===void 0&&(r=I===null?e.TEXTURE0+M-1:I);let i=L[r];i===void 0&&(i={type:void 0,texture:void 0},L[r]=i),(i.type!==t||i.texture!==n)&&(I!==r&&(e.activeTexture(r),I=r),e.bindTexture(t,n||V[t]),i.type=t,i.texture=n)}function _e(){let t=L[I];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ve(){try{e.compressedTexImage2D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function ye(){try{e.compressedTexImage3D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function be(){try{e.texSubImage2D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function xe(){try{e.texSubImage3D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function U(){try{e.compressedTexSubImage2D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function Se(){try{e.compressedTexSubImage3D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function W(){try{e.texStorage2D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function Ce(){try{e.texStorage3D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function G(){try{e.texImage2D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function we(){try{e.texImage3D(...arguments)}catch(e){qe(`WebGLState:`,e)}}function Te(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ee(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function K(t){ee.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ee.copy(t))}function De(t){B.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),B.copy(t))}function Oe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ke(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ae(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},I=null,L={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee.set(0,0,e.canvas.width,e.canvas.height),B.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:H,disable:ne,bindFramebuffer:re,drawBuffers:ie,useProgram:ae,setBlending:ce,setMaterial:le,setFlipSided:ue,setCullFace:de,setLineWidth:fe,setPolygonOffset:pe,setScissorTest:me,activeTexture:he,bindTexture:ge,unbindTexture:_e,compressedTexImage2D:ve,compressedTexImage3D:ye,texImage2D:G,texImage3D:we,pixelStorei:Ee,getParameter:Te,updateUBOMapping:Oe,uniformBlockBinding:ke,texStorage2D:W,texStorage3D:Ce,texSubImage2D:be,texSubImage3D:xe,compressedTexSubImage2D:U,compressedTexSubImage3D:Se,scissor:K,viewport:De,reset:Ae}}function Bu(e,t,n,f,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new J,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):He(`canvas`)}function T(e,t,n){let r=1,i=Te(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),q(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&q(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function A(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];q(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||q(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Fe:Nt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function j(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,q(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function M(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function N(e){let t=e.target;t.removeEventListener(`dispose`,N),F(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function P(e){let t=e.target;t.removeEventListener(`dispose`,P),L(t)}function F(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&I(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function I(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=S.get(r);delete i[n.__cacheKey],h.memory.textures--}function L(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let R=0;function z(){R=0}function ee(){return R}function B(e){R=e}function te(){let e=R;return e>=p.maxTextures&&q(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),R+=1,e}function V(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function H(t,r){let i=f.get(t);if(t.isVideoTexture&&G(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&i.__version!==t.version){let e=t.image;if(e===null)q(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)q(`WebGLRenderer: Texture marked for update but image is incomplete`);else{fe(i,t,r);return}}else t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,i.__webglTexture,e.TEXTURE0+r)}function ne(t,r){let i=f.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version){fe(i,t,r);return}t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,i.__webglTexture,e.TEXTURE0+r)}function re(t,r){let i=f.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version){fe(i,t,r);return}n.bindTexture(e.TEXTURE_3D,i.__webglTexture,e.TEXTURE0+r)}function ie(t,r){let i=f.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&i.__version!==t.version){pe(i,t,r);return}n.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture,e.TEXTURE0+r)}let ae={[r]:e.REPEAT,[i]:e.CLAMP_TO_EDGE,[a]:e.MIRRORED_REPEAT},oe={[o]:e.NEAREST,[s]:e.NEAREST_MIPMAP_NEAREST,[c]:e.NEAREST_MIPMAP_LINEAR,[l]:e.LINEAR,[u]:e.LINEAR_MIPMAP_NEAREST,[d]:e.LINEAR_MIPMAP_LINEAR},se={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ce(n,r){if(r.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&q(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[r.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[r.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[r.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[r.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[r.minFilter]),r.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,se[r.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||f.get(r).__currentAnisotropy){let i=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,i.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,p.getMaxAnisotropy())),f.get(r).__currentAnisotropy=r.anisotropy}}}function le(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,N));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=V(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&I(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ue(e,t,n){return Math.floor(Math.floor(e/n)/t)}function de(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ue(n.start,r.width,4),c=ue(t.start,r.width,4);n.start<=i+1&&a===c&&ue(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function fe(t,r,i){let a=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(a=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(a=e.TEXTURE_3D);let o=le(t,r),s=r.source;n.bindTexture(a,t.__webglTexture,e.TEXTURE0+i);let c=f.get(s);if(s.version!==c.__version||o===!0){if(n.activeTexture(e.TEXTURE0+i),!(typeof ImageBitmap<`u`&&r.image instanceof ImageBitmap)){let t=Nt.getPrimaries(Nt.workingColorSpace),i=r.colorSpace===``?null:Nt.getPrimaries(r.colorSpace),a=r.colorSpace===``||t===i?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let t=T(r.image,!1,p.maxTextureSize);t=we(r,t);let l=m.convert(r.format,r.colorSpace),u=m.convert(r.type),d=A(r.internalFormat,l,u,r.normalized,r.colorSpace,r.isVideoTexture);ce(a,r);let f,h=r.mipmaps,g=r.isVideoTexture!==!0,_=c.__version===void 0||o===!0,v=s.dataReady,y=M(r,t);if(r.isDepthTexture)d=j(r.format===k,r.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,d,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,l,u,null));else if(r.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,r=h.length;t<r;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,l,u,f.data);r.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height),v&&de(r,t,l,u)):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,l,u,t.data)}else if(r.isCompressedTexture){if(r.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(f=h[i],r.format!==1023){if(l!==null){if(g){if(v){if(r.layerUpdates.size>0){let t=Ps(f.width,f.height,r.format,r.type);for(let a of r.layerUpdates){let r=f.data.subarray(a*t/f.data.BYTES_PER_ELEMENT,(a+1)*t/f.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,f.width,f.height,1,l,r)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,f.width,f.height,t.depth,l,f.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,d,f.width,f.height,t.depth,0,f.data,0,0)}else q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,f.width,f.height,t.depth,l,u,f.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,d,f.width,f.height,t.depth,0,l,u,f.data);r.layerUpdates.size>0&&r.clearLayerUpdates()}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)f=h[t],r.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,l,u,f.data):l===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,f.data):n.compressedTexImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,f.data)}}else if(r.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,t.width,t.height,t.depth),v){if(r.layerUpdates.size>0){let i=Ps(t.width,t.height,r.format,r.type);for(let a of r.layerUpdates){let r=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,l,u,r)}r.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,l,u,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,d,t.width,t.height,t.depth,0,l,u,t.data)}else if(r.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,d,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,l,u,t.data)):n.texImage3D(e.TEXTURE_3D,0,d,t.width,t.height,t.depth,0,l,u,t.data);else if(r.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height);else{let r=t.width,i=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,d,r,i,0,l,u,null),r>>=1,i>>=1}}}else if(r.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(r),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Te(h[0]);n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height)}for(let t=0,r=h.length;t<r;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,l,u,f):n.texImage2D(e.TEXTURE_2D,t,d,l,u,f);r.generateMipmaps=!1}else if(g){if(_){let r=Te(t);n.texStorage2D(e.TEXTURE_2D,y,d,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,l,u,t)}else n.texImage2D(e.TEXTURE_2D,0,d,l,u,t);E(r)&&D(a),c.__version=s.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function pe(t,r,i){if(r.image.length!==6)return;let a=le(t,r),o=r.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+i);let s=f.get(o);if(o.version!==s.__version||a===!0){n.activeTexture(e.TEXTURE0+i);let t=Nt.getPrimaries(Nt.workingColorSpace),c=r.colorSpace===``?null:Nt.getPrimaries(r.colorSpace),l=r.colorSpace===``||t===c?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=r.isCompressedTexture||r.image[0].isCompressedTexture,d=r.image[0]&&r.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!u&&!d?f[e]=T(r.image[e],!0,p.maxCubemapSize):f[e]=d?r.image[e].image:r.image[e],f[e]=we(r,f[e]);let h=f[0],g=m.convert(r.format,r.colorSpace),_=m.convert(r.type),v=A(r.internalFormat,g,_,r.normalized,r.colorSpace),y=r.isVideoTexture!==!0,b=s.__version===void 0||a===!0,x=o.dataReady,S=M(r,h);ce(e.TEXTURE_CUBE_MAP,r);let C;if(u){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let i=0;i<C.length;i++){let a=C[i];r.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,_,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,g,_,a.data):g===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,a.data)}}}else{if(C=r.mipmaps,y&&b){C.length>0&&S++;let t=Te(f[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(d){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(r)&&D(e.TEXTURE_CUBE_MAP),s.__version=o.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function me(t,r,i,a,o,s){let c=m.convert(i.format,i.colorSpace),l=m.convert(i.type),u=A(i.internalFormat,c,l,i.normalized,i.colorSpace),d=f.get(r),p=f.get(i);if(p.__renderTarget=r,!d.__hasExternalTextures){let t=Math.max(1,r.width>>s),i=Math.max(1,r.height>>s);o===e.TEXTURE_3D||o===e.TEXTURE_2D_ARRAY?n.texImage3D(o,s,u,t,i,r.depth,0,c,l,null):n.texImage2D(o,s,u,t,i,0,c,l,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ce(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,a,o,p.__webglTexture,0,W(r)):(o===e.TEXTURE_2D||o>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&o<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,a,o,p.__webglTexture,s),n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=j(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ce(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,W(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,W(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=A(a.internalFormat,o,s,a.normalized,a.colorSpace);Ce(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,W(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,W(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ge(t,r,i){let a=r.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let o=f.get(r.depthTexture);if(o.__renderTarget=r,(!o.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),a){if(o.__webglInit===void 0&&(o.__webglInit=!0,r.depthTexture.addEventListener(`dispose`,N)),o.__webglTexture===void 0){o.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),ce(e.TEXTURE_CUBE_MAP,r.depthTexture);let t=m.convert(r.depthTexture.format),i=m.convert(r.depthTexture.type),a;r.depthTexture.format===1026?a=e.DEPTH_COMPONENT24:r.depthTexture.format===1027&&(a=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,a,r.width,r.height,0,t,i,null)}}else H(r.depthTexture,0);let s=o.__webglTexture,c=W(r),l=a?e.TEXTURE_CUBE_MAP_POSITIVE_X+i:e.TEXTURE_2D,u=r.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===1026)Ce(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,l,s,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,u,l,s,0);else if(r.depthTexture.format===1027)Ce(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,l,s,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,u,l,s,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function _e(t){let r=f.get(t),i=t.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),e){let t=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),r.__depthDisposeCallback=t}r.__boundDepthTexture=e}if(t.depthTexture&&!r.__autoAllocateDepthBuffer){if(i)for(let e=0;e<6;e++)ge(r.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?ge(r.__webglFramebuffer[0],t,0):ge(r.__webglFramebuffer,t,0)}}else if(i){r.__webglDepthbuffer=[];for(let i=0;i<6;i++)if(n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[i]),r.__webglDepthbuffer[i]===void 0)r.__webglDepthbuffer[i]=e.createRenderbuffer(),he(r.__webglDepthbuffer[i],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=r.__webglDepthbuffer[i];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let i=t.texture.mipmaps;if(i&&i.length>0?n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),he(r.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,i)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ve(t,n,r){let i=f.get(t);n!==void 0&&me(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&_e(t)}function ye(t){let r=t.texture,i=f.get(t),a=f.get(r);t.addEventListener(`dispose`,P);let o=t.textures,s=t.isWebGLCubeRenderTarget===!0,c=o.length>1;if(c||(a.__webglTexture===void 0&&(a.__webglTexture=e.createTexture()),a.__version=r.version,h.memory.textures++),s){i.__webglFramebuffer=[];for(let t=0;t<6;t++)if(r.mipmaps&&r.mipmaps.length>0){i.__webglFramebuffer[t]=[];for(let n=0;n<r.mipmaps.length;n++)i.__webglFramebuffer[t][n]=e.createFramebuffer()}else i.__webglFramebuffer[t]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){i.__webglFramebuffer=[];for(let t=0;t<r.mipmaps.length;t++)i.__webglFramebuffer[t]=e.createFramebuffer()}else i.__webglFramebuffer=e.createFramebuffer();if(c)for(let t=0,n=o.length;t<n;t++){let n=f.get(o[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&Ce(t)===!1){i.__webglMultisampledFramebuffer=e.createFramebuffer(),i.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,i.__webglMultisampledFramebuffer);for(let n=0;n<o.length;n++){let r=o[n];i.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,i.__webglColorRenderbuffer[n]);let a=m.convert(r.format,r.colorSpace),s=m.convert(r.type),c=A(r.internalFormat,a,s,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),l=W(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,i.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(i.__webglDepthRenderbuffer=e.createRenderbuffer(),he(i.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(s){n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture),ce(e.TEXTURE_CUBE_MAP,r);for(let n=0;n<6;n++)if(r.mipmaps&&r.mipmaps.length>0)for(let a=0;a<r.mipmaps.length;a++)me(i.__webglFramebuffer[n][a],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a);else me(i.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(r)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(c){for(let r=0,a=o.length;r<a;r++){let a=o[r],s=f.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,s.__webglTexture),ce(c,a),me(i.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+r,c,0),E(a)&&D(c)}n.unbindTexture()}else{let o=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(o=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(o,a.__webglTexture),ce(o,r),r.mipmaps&&r.mipmaps.length>0)for(let n=0;n<r.mipmaps.length;n++)me(i.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,o,n);else me(i.__webglFramebuffer,t,r,e.COLOR_ATTACHMENT0,o,0);E(r)&&D(o),n.unbindTexture()}t.depthBuffer&&_e(t)}function be(e){let t=e.textures;for(let r=0,i=t.length;r<i;r++){let i=t[r];if(E(i)){let t=O(e),r=f.get(i).__webglTexture;n.bindTexture(t,r),D(t),n.unbindTexture()}}}let xe=[],U=[];function Se(t){if(t.samples>0){if(Ce(t)===!1){let r=t.textures,i=t.width,a=t.height,o=e.COLOR_BUFFER_BIT,s=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=f.get(t),l=r.length>1;if(l)for(let t=0;t<r.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,c.__webglMultisampledFramebuffer);let u=t.texture.mipmaps;u&&u.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer);for(let n=0;n<r.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(o|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(o|=e.STENCIL_BUFFER_BIT)),l){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,c.__webglColorRenderbuffer[n]);let t=f.get(r[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,i,a,0,0,i,a,o,e.NEAREST),_===!0&&(xe.length=0,U.length=0,xe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(xe.push(s),U.push(s),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,U)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,xe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),l)for(let t=0;t<r.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,c.__webglColorRenderbuffer[t]);let i=f.get(r[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,i,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function W(e){return Math.min(p.maxSamples,e.samples)}function Ce(e){let n=f.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function G(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function we(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Nt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&q(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):qe(`WebGLTextures: Unsupported texture color space:`,n)),t}function Te(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=te,this.resetTextureUnits=z,this.getTextureUnits=ee,this.setTextureUnits=B,this.setTexture2D=H,this.setTexture2DArray=ne,this.setTexture3D=re,this.setTextureCube=ie,this.rebindTextures=ve,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=me,this.useMultisampledRTT=Ce,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Vu(e,t){function n(n,r=``){let i,a=Nt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Hu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Wu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ea(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Xa({vertexShader:Hu,fragmentShader:Uu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new $r(new za(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Gu=class extends Ze{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,p=null,m=null,h=typeof XRWebGLBinding<`u`,g=new Wu,v={},y=t.getContextAttributes(),b=null,x=null,C=[],w=[],T=new J,E=null,A=null,j=new Qo;j.viewport=new Wt;let M=new Qo;M.viewport=new Wt;let N=[j,M],P=new fs,F=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getHandSpace()};function L(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function R(){r.removeEventListener(`select`,L),r.removeEventListener(`selectstart`,L),r.removeEventListener(`selectend`,L),r.removeEventListener(`squeeze`,L),r.removeEventListener(`squeezestart`,L),r.removeEventListener(`squeezeend`,L),r.removeEventListener(`end`,R),r.removeEventListener(`inputsourceschange`,z);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}F=null,I=null,g.reset();for(let e in v)delete v[e];if(e.setRenderTarget(b),p=null,d=null,u=null,r=null,x=null,ie.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),A!==null){let e=A.camera;e.fov=A.fov,e.zoom=A.zoom,e.updateProjectionMatrix(),A=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?p:d},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,L),r.addEventListener(`selectstart`,L),r.addEventListener(`selectend`,L),r.addEventListener(`squeeze`,L),r.addEventListener(`squeezestart`,L),r.addEventListener(`squeezeend`,L),r.addEventListener(`end`,R),r.addEventListener(`inputsourceschange`,z),y.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?k:O,a=y.stencil?S:_);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Kt(d.textureWidth,d.textureHeight,{format:D,type:f,depthTexture:new Qi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Kt(p.framebufferWidth,p.framebufferHeight,{format:D,type:f,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ie.setContext(r),ie.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function z(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let ee=new Y,B=new Y;function te(e,t,n){ee.setFromMatrixPosition(t.matrixWorld),B.setFromMatrixPosition(n.matrixWorld);let r=ee.distanceTo(B),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function V(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),P.near=M.near=j.near=t,P.far=M.far=j.far=n,(F!==P.near||I!==P.far)&&(r.updateRenderState({depthNear:P.near,depthFar:P.far}),F=P.near,I=P.far),P.layers.mask=e.layers.mask|6,j.layers.mask=P.layers.mask&-5,M.layers.mask=P.layers.mask&-3;let i=e.parent,a=P.cameras;V(P,i);for(let e=0;e<a.length;e++)V(a[e],i);a.length===2?te(P,j,M):P.projectionMatrix.copy(j.projectionMatrix),A===null&&e.isPerspectiveCamera&&(A={camera:e,fov:e.fov,zoom:e.zoom}),H(e,P,i)};function H(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=tt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(d!==null||p!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(P)},this.getCameraTexture=function(e){return v[e]};let ne=null;function re(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==P.cameras.length&&(P.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=N[n];o===void 0&&(o=new Qo,o.layers.enable(n),o.viewport=new Wt,N[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(P.matrix.copy(o.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),i===!0&&P.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new ea,v[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ne&&ne(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let ie=new Is;ie.setAnimationLoop(re),this.setAnimationLoop=function(e){ne=e},this.dispose=function(){}}},Ku=new Yt,qu=new Ot;qu.set(-1,0,0,0,1,0,0,0,1);function Ju(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ka(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ku.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(qu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Yu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return qe(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?q(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):q(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Xu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zu=null;function Qu(){return Zu===null&&(Zu=new pi(Xu,16,16,M,y),Zu.name=`DFG_LUT`,Zu.minFilter=l,Zu.magFilter=l,Zu.wrapS=i,Zu.wrapT=i,Zu.generateMipmaps=!1,Zu.needsUpdate=!0),Zu}var $u=class{constructor(e={}){let{canvas:t=Ue(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1,outputBufferType:m=f}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);g=n.getContextAttributes().alpha}else g=a;let v=m,C=new Set([P,N,j]),w=new Set([f,_,h,S,b,x]),T=new Uint32Array(4),E=new Int32Array(4),D=new Y,O=null,k=null,A=[],M=[],F=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,L=!1,R=null,z=null,ee=null,B=null;this._outputColorSpace=Ne;let te=0,V=0,H=null,ne=-1,re=null,ie=new Wt,ae=new Wt,oe=null,se=new X(0),ce=0,le=t.width,ue=t.height,de=1,fe=null,pe=null,me=new Wt(0,0,le,ue),he=new Wt(0,0,le,ue),ge=!1,_e=new ki,ve=!1,ye=!1,be=new Yt,xe=new Y,U=new Wt,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},W=!1;function Ce(){return H===null?de:1}let G=n;function we(e,n){return t.getContext(e,n)}let Te,Ee,K,De,Oe,ke,Ae,je,Me,Pe,Fe,Ie,Le,Re,Be,Ve,He,We,Ke,Je,Xe,Ze,Qe;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,tt,!1),t.addEventListener(`webglcontextrestored`,nt,!1),t.addEventListener(`webglcontextcreationerror`,rt,!1),G===null){let t=`webgl2`;if(G=we(t,e),G===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}$e()}catch(e){throw t.removeEventListener(`webglcontextlost`,tt,!1),t.removeEventListener(`webglcontextrestored`,nt,!1),t.removeEventListener(`webglcontextcreationerror`,rt,!1),qe(`WebGLRenderer: `+e.message),e}function $e(){Te=new _c(G),Te.init(),Xe=new Vu(G,Te),Ee=new Ks(G,Te,e,Xe),K=new zu(G,Te),Ee.reversedDepthBuffer&&p&&K.buffers.depth.setReversed(!0),z=G.createFramebuffer(),ee=G.createFramebuffer(),B=G.createFramebuffer(),De=new bc(G),Oe=new yu,ke=new Bu(G,Te,K,Oe,Ee,Xe,De),Ae=new gc(I),je=new Ls(G),Ze=new Ws(G,je),Me=new vc(G,je,De,Ze),Pe=new Sc(G,Me,je,Ze,De),We=new xc(G,Ee,ke),Be=new qs(Oe),Fe=new vu(I,Ae,Te,Ee,Ze,Be),Ie=new Ju(I,Oe),Le=new Cu,Re=new Au(Te),He=new Us(I,Ae,K,Pe,g,s),Ve=new Ru(I,Pe,Ee),Qe=new Yu(G,De,Ee,K),Ke=new Gs(G,Te,De),Je=new yc(G,Te,De),De.programs=Fe.programs,I.capabilities=Ee,I.extensions=Te,I.properties=Oe,I.renderLists=Le,I.shadowMap=Ve,I.state=K,I.info=De}v!==1009&&(F=new wc(v,t.width,t.height,o,r,i));let et=new Gu(I,G);this.xr=et,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(e){e!==void 0&&(de=e,this.setSize(le,ue,!1))},this.getSize=function(e){return e.set(le,ue)},this.setSize=function(e,n,r=!0){if(et.isPresenting){q(`WebGLRenderer: Can't change size while VR device is presenting.`);return}le=e,ue=n,t.width=Math.floor(e*de),t.height=Math.floor(n*de),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),F!==null&&F.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(le*de,ue*de).floor()},this.setDrawingBufferSize=function(e,n,r){le=e,ue=n,de=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(v===1009){qe(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){q(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}F.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(ie)},this.getViewport=function(e){return e.copy(me)},this.setViewport=function(e,t,n,r){e.isVector4?me.set(e.x,e.y,e.z,e.w):me.set(e,t,n,r),K.viewport(ie.copy(me).multiplyScalar(de).round())},this.getScissor=function(e){return e.copy(he)},this.setScissor=function(e,t,n,r){e.isVector4?he.set(e.x,e.y,e.z,e.w):he.set(e,t,n,r),K.scissor(ae.copy(he).multiplyScalar(de).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(e){K.setScissorTest(ge=e)},this.setOpaqueSort=function(e){fe=e},this.setTransparentSort=function(e){pe=e},this.getClearColor=function(e){return e.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor(...arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(H!==null){let t=H.texture.format;e=C.has(t)}if(e){let e=H.texture.type,t=w.has(e),n=He.getClearColor(),r=He.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,G.clearBufferuiv(G.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,G.clearBufferiv(G.COLOR,0,E))}else r|=G.COLOR_BUFFER_BIT}t&&(r|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&G.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),R=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,tt,!1),t.removeEventListener(`webglcontextrestored`,nt,!1),t.removeEventListener(`webglcontextcreationerror`,rt,!1),He.dispose(),Le.dispose(),Re.dispose(),Oe.dispose(),Ae.dispose(),Pe.dispose(),Ze.dispose(),Qe.dispose(),Fe.dispose(),et.dispose(),et.removeEventListener(`sessionstart`,ut),et.removeEventListener(`sessionend`,dt),ft.stop()};function tt(e){e.preventDefault(),Ge(`WebGLRenderer: Context Lost.`),L=!0}function nt(){Ge(`WebGLRenderer: Context Restored.`),L=!1;let e=De.autoReset,t=Ve.enabled,n=Ve.autoUpdate,r=Ve.needsUpdate,i=Ve.type;$e(),De.autoReset=e,Ve.enabled=t,Ve.autoUpdate=n,Ve.needsUpdate=r,Ve.type=i}function rt(e){qe(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function it(e){let t=e.target;t.removeEventListener(`dispose`,it),at(t)}function at(e){ot(e),Oe.remove(e)}function ot(e){let t=Oe.get(e).programs;t!==void 0&&(t.forEach(function(e){Fe.releaseProgram(e)}),e.isShaderMaterial&&Fe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Se);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=St(e,t,n,r,i);K.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Me.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ze.setup(i,r,s,n,c);let h,g=Ke;if(c!==null&&(h=je.get(c),g=Je,g.setIndex(h)),i.isMesh)r.wireframe===!0?(K.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(G.LINES)):g.setMode(G.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),K.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(G.LINES):i.isLineLoop?g.setMode(G.LINE_LOOP):g.setMode(G.LINE_STRIP)}else i.isPoints?g.setMode(G.POINTS):i.isSprite&&g.setMode(G.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?je.get(c).bytesPerElement:1,o=Oe.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(G,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function st(e,t,n,r){R!==null&&e.isNodeMaterial&&R.setObject(r,e),ve===!0&&Be.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,vt(e,t,r),e.side=0,e.needsUpdate=!0,vt(e,t,r),e.side=2):vt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),R!==null&&R.renderStart(e,t,n),k=Re.get(n),k.init(t),M.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights(),R!==null&&R.updateLights(k.state.lightsArray),ye=this.localClippingEnabled,ve=Be.init(this.clippingPlanes,ye),ve===!0&&Be.setGlobalState(this.clippingPlanes,t),R!==null&&Ve.render(k.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];st(o,n,t,e),r.add(o)}else st(i,n,t,e),r.add(i)}}),k=M.pop(),R!==null&&R.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=Oe.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ct=null;function lt(e){ct&&ct(e)}function ut(){ft.stop()}function dt(){ft.start()}let ft=new Is;ft.setAnimationLoop(lt),typeof self<`u`&&ft.setContext(self),this.setAnimationLoop=function(e){ct=e,et.setAnimationLoop(e),e===null?ft.stop():ft.start()},et.addEventListener(`sessionstart`,ut),et.addEventListener(`sessionend`,dt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){qe(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(L===!0)return;R!==null&&R.renderStart(e,t);let n=et.enabled===!0&&et.isPresenting===!0,r=F!==null&&(H===null||n)&&F.begin(I,H);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(et.cameraAutoUpdate===!0&&et.updateCamera(t),t=et.getCamera()),e.isScene===!0&&e.onBeforeRender(I,e,t,H),k=Re.get(e,M.length),k.init(t),k.state.textureUnits=ke.getTextureUnits(),M.push(k),be.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),_e.setFromProjectionMatrix(be,ze,t.reversedDepth),ye=this.localClippingEnabled,ve=Be.init(this.clippingPlanes,ye),O=Le.get(e,A.length),O.init(),A.push(O),et.enabled===!0&&et.isPresenting===!0){let e=I.xr.getDepthSensingMesh();e!==null&&pt(e,t,-1/0,I.sortObjects)}pt(e,t,0,I.sortObjects),O.finish(),R!==null&&R.updateLights(k.state.lightsArray),I.sortObjects===!0&&O.sort(fe,pe),W=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,W&&He.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ve===!0&&Be.beginShadows();let i=k.state.shadowsArray;if(Ve.render(i,e,t),ve===!0&&Be.endShadows(),(r&&F.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ht(n,r,e,a)}W&&He.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];mt(O,e,n,n.viewport)}}else r.length>0&&ht(n,r,e,t),W&&He.render(e),mt(O,e,t)}H!==null&&V===0&&(ke.updateMultisampleRenderTarget(H),ke.updateRenderTargetMipmap(H)),r&&F.end(I),e.isScene===!0&&e.onAfterRender(I,e,t),Ze.resetDefaultState(),ne=-1,re=null,M.pop(),M.length>0?(k=M[M.length-1],ke.setTextureUnits(k.state.textureUnits),ve===!0&&Be.setGlobalState(I.clippingPlanes,k.state.camera)):k=null,A.pop(),O=A.length>0?A[A.length-1]:null,R!==null&&R.renderEnd()};function pt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(_e)){r&&U.setFromMatrixPosition(e.matrixWorld).applyMatrix4(be);let i=Pe.update(e),a=e.material;a.visible&&O.push(e,i,a,n,U.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(_e))){let i=Pe.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),U.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),U.copy(e.boundingSphere.center)),U.applyMatrix4(e.matrixWorld).applyMatrix4(be)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,U.z,s,t)}}else a.visible&&O.push(e,i,a,n,U.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)pt(i[e],t,n,r)}function mt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),ve===!0&&Be.setGlobalState(I.clippingPlanes,n),r&&K.viewport(ie.copy(r)),i.length>0&&gt(i,t,n),a.length>0&&gt(a,t,n),o.length>0&&gt(o,t,n),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function ht(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new Kt(1,1,{generateMipmaps:!0,type:e?y:f,minFilter:d,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Nt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||ie;a.setSize(o.z*I.transmissionResolutionScale,o.w*I.transmissionResolutionScale);let s=I.getRenderTarget(),c=I.getActiveCubeFace(),l=I.getActiveMipmapLevel();I.setRenderTarget(a),I.getClearColor(se),ce=I.getClearAlpha(),ce<1&&I.setClearColor(16777215,.5),I.clear(),W&&He.render(n);let u=I.toneMapping;I.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),ve===!0&&Be.setGlobalState(I.clippingPlanes,r),gt(e,n,r),ke.updateMultisampleRenderTarget(a),ke.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,_t(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(ke.updateMultisampleRenderTarget(a),ke.updateRenderTargetMipmap(a))}I.setRenderTarget(s,c,l),I.setClearColor(se,ce),p!==void 0&&(r.viewport=p),I.toneMapping=u}function gt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&_t(o,t,n,s,l,c)}}function _t(e,t,n,r,i,a){R!==null&&i.isNodeMaterial&&R.setObject(e,i),e.onBeforeRender(I,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(I,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,I.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,I.renderBufferDirect(n,t,r,i,e,a),i.side=2):I.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(I,t,n,r,i,a)}function vt(e,t,n){t.isScene!==!0&&(t=Se);let r=Oe.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Fe.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Fe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ae.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,it),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return bt(e,s),d}else s.uniforms=Fe.getUniforms(e),R!==null&&e.isNodeMaterial&&R.build(e,n,s),e.onBeforeCompile(s,I),d=Fe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Be.uniform),bt(e,s),r.needsLights=wt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function yt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=jl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function bt(e,t){let n=Oe.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function xt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function St(e,t,n,r,i){t.isScene!==!0&&(t=Se),ke.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=H===null?I.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Nt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ae.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(h=I.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=Oe.get(r),y=k.state.lights;if(ve===!0&&(ye===!0||e!==re)){let t=e===re&&r.id===ne;Be.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Be.numPlanes||v.numIntersection!==Be.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=vt(r,t,i),R&&r.isNodeMaterial&&R.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(K.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ne&&(ne=r.id,C=!0),v.needsLights){let e=xt(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||re!==e){K.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(G,`projectionMatrix`,e.projectionMatrix),T.setValue(G,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(G,xe.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&T.setValue(G,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(G,`isOrthographic`,e.isOrthographicCamera===!0),re!==e&&(re=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(G,`sunShadowMap`,y.state.sunShadowMap,ke),y.state.directionalShadowMap.length>0&&T.setValue(G,`directionalShadowMap`,y.state.directionalShadowMap,ke),y.state.spotShadowMap.length>0&&T.setValue(G,`spotShadowMap`,y.state.spotShadowMap,ke),y.state.pointShadowMap.length>0&&T.setValue(G,`pointShadowMap`,y.state.pointShadowMap,ke)),i.isSkinnedMesh){T.setOptional(G,i,`bindMatrix`),T.setOptional(G,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(G,`boneTexture`,e.boneTexture,ke))}i.isBatchedMesh&&(T.setOptional(G,i,`batchingTexture`),T.setValue(G,`batchingTexture`,i._matricesTexture,ke),T.setOptional(G,i,`batchingIdTexture`),T.setValue(G,`batchingIdTexture`,i._indirectTexture,ke),T.setOptional(G,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(G,`batchingColorTexture`,i._colorsTexture,ke));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&We.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(G,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Qu()),C){if(T.setValue(G,`toneMappingExposure`,I.toneMappingExposure),v.needsLights&&Ct(E,w),a&&r.fog===!0&&Ie.refreshFogUniforms(E,a),Ie.refreshMaterialUniforms(E,r,de,ue,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}jl.upload(G,yt(v),E,ke)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(jl.upload(G,yt(v),E,ke),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(G,`center`,i.center),T.setValue(G,`modelViewMatrix`,i.modelViewMatrix),T.setValue(G,`normalMatrix`,i.normalMatrix),T.setValue(G,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Qe.update(n,x),Qe.bind(n,x)}}return x}function Ct(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function wt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return te},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(e,t,n){let r=Oe.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),Oe.get(e.texture).__webglTexture=t,Oe.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=Oe.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){H=e,te=t,V=n;let r=null,i=!1,a=!1;if(e){let o=Oe.get(e);if(o.__useDefaultFramebuffer!==void 0){K.bindFramebuffer(G.FRAMEBUFFER,o.__webglFramebuffer),ie.copy(e.viewport),ae.copy(e.scissor),oe=e.scissorTest,K.viewport(ie),K.scissor(ae),K.setScissorTest(oe),ne=-1;return}if(o.__webglFramebuffer===void 0)ke.setupRenderTarget(e);else if(o.__hasExternalTextures)ke.rebindTextures(e,Oe.get(e.texture).__webglTexture,Oe.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&Oe.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);ke.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=Oe.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&ke.useMultisampledRTT(e)===!1?Oe.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ie.copy(e.viewport),ae.copy(e.scissor),oe=e.scissorTest}else ie.copy(me).multiplyScalar(de).floor(),ae.copy(he).multiplyScalar(de).floor(),oe=ge;if(n!==0&&(r=z),K.bindFramebuffer(G.FRAMEBUFFER,r)&&K.drawBuffers(e,r),K.viewport(ie),K.scissor(ae),K.setScissorTest(oe),i){let r=Oe.get(e.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=Oe.get(e.textures[t]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=Oe.get(e.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,t.__webglTexture,n)}ne=-1};function J(e){let t=Oe.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=Oe.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){K.bindFramebuffer(G.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+s);let u=J(o);if(u.__formatReadable===!1){qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&G.readPixels(t,n,r,i,Xe.convert(c),Xe.convert(l),a)}finally{let e=H===null?null:Oe.get(H).__webglFramebuffer;K.bindFramebuffer(G.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=Oe.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){K.bindFramebuffer(G.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+s);let d=J(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,f),G.bufferData(G.PIXEL_PACK_BUFFER,a.byteLength,G.STREAM_READ),G.readPixels(t,n,r,i,Xe.convert(l),Xe.convert(u),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);let p=H===null?null:Oe.get(H).__webglFramebuffer;K.bindFramebuffer(G.FRAMEBUFFER,p);let m=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await Ye(G,m,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,f),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,a),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(f),G.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;ke.setTexture2D(e,0),G.copyTexSubImage2D(G.TEXTURE_2D,n,0,0,o,s,i,a),K.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Xe.convert(t.format),_=Xe.convert(t.type),v;t.isData3DTexture?(ke.setTexture3D(t,0),v=G.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(ke.setTexture2DArray(t,0),v=G.TEXTURE_2D_ARRAY):(ke.setTexture2D(t,0),v=G.TEXTURE_2D),K.activeTexture(G.TEXTURE0),K.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,t.flipY),K.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),K.pixelStorei(G.UNPACK_ALIGNMENT,t.unpackAlignment);let y=K.getParameter(G.UNPACK_ROW_LENGTH),b=K.getParameter(G.UNPACK_IMAGE_HEIGHT),x=K.getParameter(G.UNPACK_SKIP_PIXELS),S=K.getParameter(G.UNPACK_SKIP_ROWS),C=K.getParameter(G.UNPACK_SKIP_IMAGES);K.pixelStorei(G.UNPACK_ROW_LENGTH,h.width),K.pixelStorei(G.UNPACK_IMAGE_HEIGHT,h.height),K.pixelStorei(G.UNPACK_SKIP_PIXELS,l),K.pixelStorei(G.UNPACK_SKIP_ROWS,u),K.pixelStorei(G.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=Oe.get(e),r=Oe.get(t),h=Oe.get(n.__renderTarget),g=Oe.get(r.__renderTarget);K.bindFramebuffer(G.READ_FRAMEBUFFER,h.__webglFramebuffer),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Oe.get(e).__webglTexture,i,d+n),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Oe.get(t).__webglTexture,a,m+n)),G.blitFramebuffer(l,u,o,s,f,p,o,s,G.DEPTH_BUFFER_BIT,G.NEAREST);K.bindFramebuffer(G.READ_FRAMEBUFFER,null),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||Oe.has(e)){let n=Oe.get(e),r=Oe.get(t);K.bindFramebuffer(G.READ_FRAMEBUFFER,ee),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,B);for(let e=0;e<c;e++)w?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,n.__webglTexture,i),T?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,r.__webglTexture,a),i===0?T?G.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):G.copyTexSubImage2D(v,a,f,p,l,u,o,s):G.blitFramebuffer(l,u,o,s,f,p,o,s,G.COLOR_BUFFER_BIT,G.NEAREST);K.bindFramebuffer(G.READ_FRAMEBUFFER,null),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?G.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?G.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):G.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):G.texSubImage2D(G.TEXTURE_2D,a,f,p,o,s,g,_,h);K.pixelStorei(G.UNPACK_ROW_LENGTH,y),K.pixelStorei(G.UNPACK_IMAGE_HEIGHT,b),K.pixelStorei(G.UNPACK_SKIP_PIXELS,x),K.pixelStorei(G.UNPACK_SKIP_ROWS,S),K.pixelStorei(G.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&G.generateMipmap(v),K.unbindTexture()},this.initRenderTarget=function(e){Oe.get(e).__webglFramebuffer===void 0&&ke.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?ke.setTextureCube(e,0):e.isData3DTexture?ke.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?ke.setTexture2DArray(e,0):ke.setTexture2D(e,0),K.unbindTexture()},this.resetState=function(){te=0,V=0,H=null,K.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ze}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Nt._getUnpackColorSpace()}},ed={type:`change`},td={type:`start`},nd={type:`end`},rd=new Br,id=new Nr,ad=Math.cos(70*wt.DEG2RAD),od=new Y,sd=2*Math.PI,cd={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ld=1e-6,ud=class extends Ns{constructor(n,r=null){super(n,r),this.state=cd.NONE,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:e.ROTATE,MIDDLE:e.DOLLY,RIGHT:e.PAN},this.touches={ONE:t.ROTATE,TWO:t.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new Y,this._lastQuaternion=new Tt,this._lastTargetPosition=new Y,this._quat=new Tt().setFromUnitVectors(n.up,new Y(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new js,this._sphericalDelta=new js,this._scale=1,this._panOffset=new Y,this._rotateStart=new J,this._rotateEnd=new J,this._rotateDelta=new J,this._panStart=new J,this._panEnd=new J,this._panDelta=new J,this._dollyStart=new J,this._dollyEnd=new J,this._dollyDelta=new J,this._dollyDirection=new Y,this._mouse=new J,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=fd.bind(this),this._onPointerDown=dd.bind(this),this._onPointerUp=pd.bind(this),this._onContextMenu=bd.bind(this),this._onMouseWheel=gd.bind(this),this._onKeyDown=_d.bind(this),this._onTouchStart=vd.bind(this),this._onTouchMove=yd.bind(this),this._onMouseDown=md.bind(this),this._onMouseMove=hd.bind(this),this._interceptControlDown=xd.bind(this),this._interceptControlUp=Sd.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.state=cd.NONE,this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents();let e=this.domElement.getRootNode();e.removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),e.removeEventListener(`keyup`,this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction=``,this.domElement.style.cursor=`auto`}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ed),this.update(),this.state=cd.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;od.copy(t).sub(this.target),od.applyQuaternion(this._quat),this._spherical.setFromVector3(od),this.autoRotate&&this.state===cd.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=sd:n>Math.PI&&(n-=sd),r<-Math.PI?r+=sd:r>Math.PI&&(r-=sd),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(od.setFromSpherical(this._spherical),od.applyQuaternion(this._quatInverse),t.copy(this.target).add(od),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=od.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new Y(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new Y(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=od.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(rd.origin.copy(this.object.position),rd.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(rd.direction))<ad?this.object.lookAt(this.target):(id.setFromNormalAndCoplanarPoint(this.object.up,this.target),rd.intersectPlane(id,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>ld||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ld||this._lastTargetPosition.distanceToSquared(this.target)>ld?(this.dispatchEvent(ed),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?sd/60/60*this.autoRotateSpeed:sd/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){od.setFromMatrixColumn(t,0),od.multiplyScalar(-e),this._panOffset.add(od)}_panUp(e,t){this.screenSpacePanning===!0?od.setFromMatrixColumn(t,1):(od.setFromMatrixColumn(t,0),od.crossVectors(this.object.up,od)),od.multiplyScalar(e),this._panOffset.add(od)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;od.copy(r).sub(this.target);let i=od.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(sd*this._rotateDelta.x/t.clientHeight),this._rotateUp(sd*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(sd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-sd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(sd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-sd*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(sd*this._rotateDelta.x/t.clientHeight),this._rotateUp(sd*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new J,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function dd(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function fd(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function pd(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(nd),this.state=cd.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function md(t){let n;switch(t.button){case 0:n=this.mouseButtons.LEFT;break;case 1:n=this.mouseButtons.MIDDLE;break;case 2:n=this.mouseButtons.RIGHT;break;default:n=-1}switch(n){case e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=cd.DOLLY;break;case e.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=cd.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=cd.ROTATE}break;case e.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=cd.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=cd.PAN}break;default:this.state=cd.NONE}this.state!==cd.NONE&&this.dispatchEvent(td)}function hd(e){switch(this.state){case cd.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case cd.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case cd.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function gd(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===cd.NONE&&(e.preventDefault(),this.dispatchEvent(td),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(nd))}function _d(e){this.enabled!==!1&&this._handleKeyDown(e)}function vd(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case t.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=cd.TOUCH_ROTATE;break;case t.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=cd.TOUCH_PAN;break;default:this.state=cd.NONE}break;case 2:switch(this.touches.TWO){case t.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=cd.TOUCH_DOLLY_PAN;break;case t.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=cd.TOUCH_DOLLY_ROTATE;break;default:this.state=cd.NONE}break;default:this.state=cd.NONE}this.state!==cd.NONE&&this.dispatchEvent(td)}function yd(e){switch(this._trackPointer(e),this.state){case cd.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case cd.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case cd.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case cd.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=cd.NONE}}function bd(e){this.enabled!==!1&&e.preventDefault()}function xd(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Sd(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var Cd=class extends Mn{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new ta;e.deleteAttribute(`uv`);let t=new Qa({side:1}),n=new Qa,r=new ns(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new $r(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Ti(e,n,6),o=new Cn;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new $r(e,wd(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new $r(e,wd(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new $r(e,wd(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new $r(e,wd(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new $r(e,wd(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new $r(e,wd(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function wd(e){return new eo({color:0,emissive:16777215,emissiveIntensity:e})}var Td=class extends Mo{constructor(e){super(e)}load(e,t,n,r){let i=this,a=new Fo(this.manager);a.setPath(this.path),a.setResponseType(`arraybuffer`),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(n){try{t(i.parse(n))}catch(t){r?r(t):console.error(t),i.manager.itemError(e)}},n,r)}parse(e){function t(e){let t=new DataView(e);if(84+t.getUint32(80,!0)*50===t.byteLength)return!0;let r=[115,111,108,105,100];for(let e=0;e<5;e++)if(n(r,t,e))return!1;return!0}function n(e,t,n){for(let r=0,i=e.length;r<i;r++)if(e[r]!==t.getUint8(n+r))return!1;return!0}function r(e){let t=new DataView(e),n=t.getUint32(80,!0),r,i,a,o=!1,s,c,l,u,d;for(let e=0;e<70;e++)t.getUint32(e,!1)==1129270351&&t.getUint8(e+4)==82&&t.getUint8(e+5)==61&&(o=!0,s=new Float32Array(n*3*3),c=t.getUint8(e+6)/255,l=t.getUint8(e+7)/255,u=t.getUint8(e+8)/255,d=t.getUint8(e+9)/255);let f=new Er,p=new Float32Array(n*3*3),m=new Float32Array(n*3*3),h=new X;for(let e=0;e<n;e++){let n=84+e*50,d=t.getFloat32(n,!0),f=t.getFloat32(n+4,!0),g=t.getFloat32(n+8,!0);if(o){let e=t.getUint16(n+48,!0);e&32768?(r=c,i=l,a=u):(r=(e&31)/31,i=(e>>5&31)/31,a=(e>>10&31)/31)}for(let c=1;c<=3;c++){let l=n+c*12,u=e*3*3+(c-1)*3;p[u]=t.getFloat32(l,!0),p[u+1]=t.getFloat32(l+4,!0),p[u+2]=t.getFloat32(l+8,!0),m[u]=d,m[u+1]=f,m[u+2]=g,o&&(h.setRGB(r,i,a,Ne),s[u]=h.r,s[u+1]=h.g,s[u+2]=h.b)}}return f.setAttribute(`position`,new dr(p,3)),f.setAttribute(`normal`,new dr(m,3)),o&&(f.setAttribute(`color`,new dr(s,3)),f.hasColors=!0,f.alpha=d),f}function i(e){let t=new Er,n=/solid([\s\S]*?)endsolid/g,r=/facet([\s\S]*?)endfacet/g,i=/solid\s(.+)/,a=0,o=`[\\s]+([+-]?(?:\\d*)(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)`,s=RegExp(`vertex`+o+o+o,`g`),c=RegExp(`normal`+o+o+o,`g`),l=[],u=[],d=[],f=new Y,p,m=0,h=0,g=0;for(;(p=n.exec(e))!==null;){h=g;let e=p[0],n=(p=i.exec(e))===null?``:p[1];for(d.push(n);(p=r.exec(e))!==null;){let e=0,t=0,n=p[0];for(;(p=c.exec(n))!==null;)f.x=parseFloat(p[1]),f.y=parseFloat(p[2]),f.z=parseFloat(p[3]),t++;for(;(p=s.exec(n))!==null;)l.push(parseFloat(p[1]),parseFloat(p[2]),parseFloat(p[3])),u.push(f.x,f.y,f.z),e++,g++;t!==1&&console.error(`THREE.STLLoader: Something isn't right with the normal of face number `+a),e!==3&&console.error(`THREE.STLLoader: Something isn't right with the vertices of face number `+a),a++}let o=h,_=g-h;t.userData.groupNames=d,t.addGroup(o,_,m),m++}return t.setAttribute(`position`,new mr(l,3)),t.setAttribute(`normal`,new mr(u,3)),t}function a(e){return typeof e==`string`?e:new TextDecoder().decode(e)}function o(e){if(typeof e==`string`){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer||t}return e}let s=o(e);return t(s)?r(s):i(a(e))}};function Ed(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];t+=r.x*i.y-i.x*r.y}return t*.5}function Dd(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++){let o=n[i].x,s=n[i].y,c=n[a].x,l=n[a].y;s>t!=l>t&&e<(c-o)*(t-s)/(l-s||1e-12)+o&&(r=!r)}return r}function Od(e,t,n){let r=1/0;for(let i=0,a=n.length-1;i<n.length;a=i++){let o=n[a].x,s=n[a].y,c=n[i].x,l=n[i].y,u=c-o,d=l-s,f=u*u+d*d,p=f>1e-12?Math.max(0,Math.min(1,((e-o)*u+(t-s)*d)/f)):0,m=e-(o+p*u),h=t-(s+p*d),g=m*m+h*h;g<r&&(r=g)}return r}function kd(e,t,n,r=.04){return Dd(e,t,n)?!0:Od(e,t,n)<=r}function Ad(e,t,n){let r=Math.round(e*50)+32768,i=Math.round(t*50)+32768,a=Math.round(n*50)+32768;return(r*65536+i)*65536+a}function jd(e,t){let n=e.getAttribute(`position`);if(!n)return e;let r=e.getIndex(),i=Math.floor(r?r.count/3:n.count/3),a=new Map,o=new Map;function s(e,t){return e<t?`${e}_${t}`:`${t}_${e}`}let c=1/0,l=-1/0;for(let e=0;e<n.count;e++){let t=n.getY(e);t<c&&(c=t),t>l&&(l=t)}let u=t?l:c;for(let e=0;e<i;e++){let t=r?r.getX(e*3):e*3,i=r?r.getX(e*3+1):e*3+1,c=r?r.getX(e*3+2):e*3+2,l=n.getX(t),u=n.getY(t),d=n.getZ(t),f=n.getX(i),p=n.getY(i),m=n.getZ(i),h=n.getX(c),g=n.getY(c),_=n.getZ(c),v=[Ad(l,u,d),Ad(f,p,m),Ad(h,g,_)],y=[{x:l,y:u,z:d},{x:f,y:p,z:m},{x:h,y:g,z:_}];for(let e=0;e<3;e++){let t=v[e],n=v[(e+1)%3];if(t===n)continue;o.has(t)||o.set(t,y[e]),o.has(n)||o.set(n,y[(e+1)%3]);let r=s(t,n),i=a.get(r);i||(i={count:0,k1:t,k2:n},a.set(r,i)),i.count++}}let d=new Map;for(let e of a.values())e.count===1&&(d.has(e.k1)||d.set(e.k1,[]),d.has(e.k2)||d.set(e.k2,[]),d.get(e.k1).push(e.k2),d.get(e.k2).push(e.k1));if(d.size===0)return e;let f=new Set,p=[],m=[];function h(e,t){let n=[e],r=new Map([[e,0]]);for(;;){let e=n[n.length-1],i=d.get(e);if(!i)break;let a=null;for(let t of i){let n=s(e,t);if(!f.has(n)){a=t;break}}if(a===null)break;f.add(s(e,a));let o=r.get(a);if(o!==void 0){let e=n.slice(o);for(let e=o+1;e<n.length;e++)r.delete(n[e]);if(n.length=o+1,e.length>=3&&p.push(e),t&&n.length===1&&!d.get(a)?.some(e=>!f.has(s(a,e))))break}else r.set(a,n.length),n.push(a)}if(n.length>=3){let e=o.get(n[0]),t=o.get(n[n.length-1]);Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z)<1.5?p.push(n):m.push(n)}else n.length>=2&&m.push(n)}for(let[e,t]of d.entries())t.length%2==1&&t.some(t=>!f.has(s(e,t)))&&h(e,!1);for(let e of d.keys())d.get(e).some(t=>!f.has(s(e,t)))&&h(e,!0);for(;m.length>0;){let e=m.shift(),t=!0;for(;t;){t=!1;let n=o.get(e[0]),r=o.get(e[e.length-1]);if(e.length>=3&&Math.hypot(n.x-r.x,n.y-r.y,n.z-r.z)<2.5)break;let i=-1,a=2.5,s=!1;for(let e=0;e<m.length;e++){let t=m[e],n=o.get(t[0]),c=o.get(t[t.length-1]),l=Math.hypot(r.x-n.x,r.y-n.y,r.z-n.z),u=Math.hypot(r.x-c.x,r.y-c.y,r.z-c.z);l<a&&(a=l,i=e,s=!1),u<a&&(a=u,i=e,s=!0)}if(i>=0){let n=m.splice(i,1)[0];s&&n.reverse(),e.push(...n),t=!0}}if(e.length>=3){let t=o.get(e[0]),n=o.get(e[e.length-1]);Math.hypot(t.x-n.x,t.y-n.y,t.z-n.z)<2.5&&p.push(e)}}let g=[];for(let e of p){let n=1/0,r=-1/0,i=1/0,a=-1/0,s=1/0,c=-1/0;for(let t of e){let e=o.get(t);e.y<n&&(n=e.y),e.y>r&&(r=e.y),e.x<i&&(i=e.x),e.x>a&&(a=e.x),e.z<s&&(s=e.z),e.z>c&&(c=e.z)}let l=r-n,d=a-i,f=c-s,p=(t?Math.abs(r-u)<2.5:Math.abs(n-u)<2.5)&&l<=3.8;if(!p&&d>15&&f>15||!p&&l>3.8||!p&&d<1.2&&f<1.2)continue;let m=[],h=[];for(let t of e){let e=o.get(t);m.push(new J(e.x,e.z)),h.push(e)}if(m.length<3)continue;let _=Math.abs(Ed(m));_<.25||g.push({pts2D:m,pts3D:h,absArea:_,isBaseCut:p})}g.sort((e,t)=>t.absArea-e.absArea);let _=new Set,v=[];for(let e=0;e<g.length;e++){if(_.has(e))continue;let n=g[e],r=[],i=[...n.pts3D];for(let t=e+1;t<g.length;t++){if(_.has(t))continue;let e=g[t],a=0,o=Math.max(1,Math.floor(e.pts2D.length/5)),s=0;for(let t=0;t<e.pts2D.length;t+=o){s++;let r=e.pts2D[t];Dd(r.x,r.y,n.pts2D)&&a++}n.isBaseCut&&e.isBaseCut&&a===s&&(_.add(t),r.push(e.pts2D),i.push(...e.pts3D))}let a=Ia.triangulateShape(n.pts2D,r),o=t;for(let e of a){let t=e[0],a=e[1],s=e[2];if(t===void 0||a===void 0||s===void 0)continue;let c=i[t],l=i[a],u=i[s];if(!c||!l||!u)continue;let d=(l.z-c.z)*(u.x-c.x)-(l.x-c.x)*(u.z-c.z);if(o?d<0:d>0){let e=l;l=u,u=e}let f=(c.x+l.x+u.x)/3,p=(c.z+l.z+u.z)/3;if(!kd(f,p,n.pts2D,.0025))continue;let m=!1;for(let e of r)if(Dd(f,p,e)&&Od(f,p,e)>.0025){m=!0;break}m||v.push(c,l,u)}}if(v.length===0)return e;let y=n.array,b=new Float32Array(y.length+v.length*3);b.set(y,0);let x=y.length;for(let e of v)b[x++]=e.x,b[x++]=e.y,b[x++]=e.z;e.setAttribute(`position`,new mr(b,3));let S=e.getAttribute(`color`);if(S){let t=S.itemSize,n=S.array instanceof Uint8Array,r=S.array,i=n?new Uint8Array(r.length+v.length*t):new Float32Array(r.length+v.length*t);i.set(r,0);let a=r.length;for(let e=0;e<v.length;e++)n?(i[a++]=117,i[a++]=22,i[a++]=27,t===4&&(i[a++]=255)):(i[a++]=.46,i[a++]=.085,i[a++]=.105,t===4&&(i[a++]=1));e.setAttribute(`color`,new dr(i,t,n)),e.userData.baseColors=e.getAttribute(`color`).clone()}if(e.userData.pristinePositions&&(e.userData.pristinePositions=new Float32Array(b)),r){let t=r.array,n=new Uint32Array(t.length+v.length);n.set(t,0);let i=y.length/3;for(let e=0;e<v.length;e++)n[t.length+e]=i+e;e.setIndex(new dr(n,1))}return e.computeVertexNormals(),e.computeBoundingBox(),e.computeBoundingSphere(),e}function Md(e,t){let n=e.getAttribute(`position`);if(!n||n.count===0)return;let r=n.count,i=Math.floor(r/3),a=!0;typeof t==`string`?a=!t.toLowerCase().includes(`lower`):t&&typeof t.isUpper==`boolean`&&(a=t.isUpper),e.getAttribute(`normal`)||e.computeVertexNormals();let o=e.getAttribute(`normal`),s=.68,c=.61,l=.5,u=.46,d=.4,f=.32,p=.52,m=.095,h=.13,g=1/0,_=-1/0,v=1/0,y=-1/0,b=1/0,x=-1/0;for(let e=0;e<r;e+=4){let t=n.getX(e),r=n.getY(e),i=n.getZ(e);t<g&&(g=t),t>_&&(_=t),r<b&&(b=r),r>x&&(x=r),i<v&&(v=i),i>y&&(y=i)}let S=(g+_)/2,C=v-12,w=.95,T=new Float32Array(120);T.fill(a?1/0:-1/0);for(let e=0;e<r;e++){let t=n.getX(e),r=n.getY(e),i=n.getZ(e),o=Math.atan2(t-S,i-C),s=Math.max(0,Math.min(119,Math.floor((o+w)/(2*w)*120)));a?r<T[s]&&(T[s]=r):r>T[s]&&(T[s]=r)}let E=new Float32Array(120);for(let e=0;e<120;e++){let t=0,n=0;for(let r=-3;r<=3;r++){let i=e+r;if(i>=0&&i<120){let e=T[i];(a?e<1/0:e>-1/0)&&(t+=e,n++)}}E[e]=n>0?t/n:a?b:x}let D=new Float32Array(r*3),O=new Uint8Array(r);for(let e=0;e<r;e++){let t=n.getX(e),r=n.getY(e),i=n.getZ(e),g=o?o.getX(e):0,_=o?o.getY(e):0,v=o?o.getZ(e):0,y=t-S,b=i-C,x=Math.sqrt(y*y+b*b),T=x>0?y/x:0,k=x>0?b/x:1,A=-k,j=T,M=g*T+v*k,N=g*A+v*j,P=Math.abs(N),F=Math.atan2(y,b),I=E[Math.max(0,Math.min(119,Math.floor((F+w)/(2*w)*120)))],L=a?r-I:I-r,R=Math.abs(F),z=a?5.4:4.8;R>.22&&R<.46?z+=.55:R>=.46&&(z-=.55);let ee=Math.max(-.9,Math.min(.5,.4*Math.max(0,M)-.85*P**1.6)),B=z+ee,te=a?_:-_,V=L>z*.7?te*.45:0,H=L-B+V,ne=.35;if(H<-.35){let t=Math.max(0,Math.min(1,L/B)),n,r,i;if(t<.45){let e=t/.45;n=.82+-.05999999999999994*e,r=.79+-.08000000000000007*e,i=.72+-.08999999999999997*e}else{let e=(t-.45)/.55;n=.76+-.07999999999999996*e,r=.71+-.09999999999999998*e,i=.63+-.13*e}if(P>.4){let e=Math.min(.6,(P-.4)*1.5);n+=(u-n)*e,r+=(d-r)*e,i+=(f-i)*e}if(R>.28&&t<.4){let e=1-Math.abs(_);if(e>.2){let t=Math.min(.55,(e-.2)*1.6);n+=(u-n)*t,r+=(d-r)*t,i+=(f-i)*t}}D[e*3]=n,D[e*3+1]=r,D[e*3+2]=i,O[e]=0}else if(H>ne){let t=L-B,n=Math.max(0,Math.min(1,t/6)),r,i,a;if(n<.25){let e=n/.25;r=p+-.020000000000000018*e,i=m+-.009999999999999995*e,a=h+-.020000000000000004*e}else{let e=(n-.25)/.75;r=.5+-.015000000000000013*e,i=.085+-.010000000000000009*e,a=.11+-.015*e}D[e*3]=r,D[e*3+1]=i,D[e*3+2]=a,O[e]=1}else(H+ne)/(2*ne)<.5?(D[e*3]=s,D[e*3+1]=c,D[e*3+2]=l,O[e]=0):(D[e*3]=p,D[e*3+1]=m,D[e*3+2]=h,O[e]=1)}for(let e=0;e<i;e++){let t=e*3,n=t+1,r=t+2,i=O[t],a=O[n],o=O[r],u=i+a+o;if(u===2){let e=i===0?t:a===0?n:r;D[e*3]=p,D[e*3+1]=m,D[e*3+2]=h,O[e]=1}else if(u===1){let e=i===1?t:a===1?n:r;D[e*3]=s,D[e*3+1]=c,D[e*3+2]=l,O[e]=0}}e.setAttribute(`color`,new mr(D,3))}function Nd(e){return e instanceof Error?e.message:String(e)}function Pd(e){throw Error(`Unexpected value: ${JSON.stringify(e)}`)}var Fd=1e-5,Id=[`k1`,`k2`,`mean`,`gaussian`,`curvedness`,`sharpness`],Ld=2;function Rd(e){let t=new Map,n=e.map(e=>zd(e.bounds)),r=Math.min(...n),i=Math.max(...n),a=(i-r)/2;if(!(a>0)){for(let n of e)t.set(n.id,0);return t}let o=Math.min(...e.map(e=>e.bounds.min[Ld])),s=(Math.max(...e.map(e=>e.bounds.max[Ld]))-o)/2,c=(i+r)/2;for(let n of e){let e=zd(n.bounds)-c;t.set(n.id,e/a*s)}return t}function zd(e){return(e.min[Ld]+e.max[Ld])/2}[...Id];function Bd(e){return Math.min(Math.max(Math.round(e),0),6)}function Vd(e){return Math.min(Math.max(e,0),1)}var Hd=1.15,Ud=1,Wd={top:[0,0,1],bottom:[0,0,-1],front:[0,-1,0],back:[0,1,0],right:[1,0,0],left:[-1,0,0]},Gd=new Set([`top`,`bottom`,`left`,`right`]),Kd=[0,1,0],qd=[0,0,1],Jd=new Y(0,-1,.35).normalize();function Yd(e){let[t,n,r]=Wd[e],i=Gd.has(e)?Kd:qd;return{direction:new Y(t,n,r),up:new Y(...i)}}function Xd(e){return rf(nf(e))}function Zd(e){let{bounds:t,fov:n,aspect:r,direction:i}=e,a=nf(t),o=t.getCenter(new Y),s=a/2/Math.tan(n*Math.PI/360),c=s/Math.max(r,.1),l=Hd*Math.max(s,c);return{position:o.clone().addScaledVector(i.clone().normalize(),l),target:o,near:Math.max(l/100,.01),far:l*100,...rf(a)}}function Qd(e){let t=e.getSize(new Y),n=e.getCenter(new Y);return{scale:Math.max(t.x,t.y,Ud)/400,position:new Y(n.x,n.y,e.min.z)}}function $d(e){let{width:t,height:n,previous:r}=e;return t===0||n===0||ef(r,t,n)?null:{width:t,height:n,aspect:t/n}}function ef(e,t,n){return e!==null&&e.width===t&&e.height===n}function tf(e){let t=new qn;for(let n of e)n.visible&&t.expandByObject(n);return t.isEmpty()?null:t}function nf(e){let t=e.getSize(new Y);return Math.max(t.x,t.y,t.z,Ud)}function rf(e){return{minDistance:e/100,maxDistance:e*100}}function af(e,t){let n=t!==null&&t!==e.id;return{visible:e.visible&&!n,transparent:e.opacity<1,depthWrite:e.opacity>=1}}function of(e){let[t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g]=e;return[t,a,l,p,n,o,u,m,r,s,d,h,i,c,f,g]}function sf(e,t){let n=new Yt().makeTranslation(0,0,t);return e===null?n:n.multiply(new Yt().set(...of(e)))}function cf(e){e.mesh.material=e.material,e.geometry.userData.baseColors instanceof dr?(e.geometry.setAttribute(`color`,e.geometry.userData.baseColors.clone()),e.geometry.attributes.color.needsUpdate=!0):e.geometry.userData.preMeasureColors instanceof dr?(e.geometry.setAttribute(`color`,e.geometry.userData.preMeasureColors.clone()),e.geometry.attributes.color.needsUpdate=!0):e.geometry.deleteAttribute(`color`)}function lf(e,t){!e.geometry.userData.preMeasureColors&&e.geometry.getAttribute(`color`)&&(e.geometry.userData.preMeasureColors=e.geometry.getAttribute(`color`).clone()),e.geometry.setAttribute(`color`,new dr(t,3)),e.mesh.material=e.measuredMaterial}function uf(e,t,n){switch(t.kind){case`ignore`:return;case`measuring`:n(df(e,{state:`measuring`}));return;case`measured`:lf(e,t.colours),n(df(e,{state:`painted`,milliseconds:t.milliseconds,scalar:t.surface,range:t.range}));return;case`failed`:e.measured=!1,cf(e),n(df(e,{state:`failed`,reason:t.reason}));return;default:Pd(t)}}function df(e,t){return{...t,id:e.id,label:e.label}}var ff=1200,pf=.02,mf=16765286;function hf(){let e=new Va(1,16,12),t=new Vr({color:mf,transparent:!0,opacity:.95,depthTest:!1}),n=new $r(e,t);n.renderOrder=1,n.visible=!1;let r=null;return{object:n,flash:(e,t)=>{n.position.copy(e),n.scale.setScalar(t*pf),n.visible=!0,r!==null&&clearTimeout(r),r=setTimeout(()=>{n.visible=!1,r=null},ff)},dispose:()=>{r!==null&&clearTimeout(r),e.dispose(),t.dispose()}}}var gf=12;function _f(e,t){let n=null,r=null,i=()=>{n!==null&&clearTimeout(n),n=null,r=null};e.addEventListener(`pointerdown`,e=>{if(r!==null||!e.isPrimary||e.button!==0){i();return}let a={x:e.clientX,y:e.clientY};r={pointerId:e.pointerId,point:a},n=setTimeout(()=>{n=null,t.onLongPress(a)},500)}),window.addEventListener(`pointermove`,e=>{r!==null&&e.pointerId===r.pointerId&&vf(r.point,e)&&i()}),window.addEventListener(`pointerup`,i),window.addEventListener(`pointercancel`,i)}function vf(e,t){return Math.hypot(t.clientX-e.x,t.clientY-e.y)>gf}function yf(e,t){let n=null,r=!1;e.addEventListener(`pointerdown`,e=>{if(e.defaultPrevented||t.isLocked?.()){n=null;return}if(!e.isPrimary||e.button!==0){n=null;return}n===null&&(n={pointerId:e.pointerId,x:e.clientX,y:e.clientY})}),e.addEventListener(`pointermove`,e=>{if(t.isLocked?.()){n=null;return}if(n===null||e.pointerId!==n.pointerId)return;let i={x:e.clientX-n.x,y:e.clientY-n.y};n={...n,x:e.clientX,y:e.clientY},(i.x!==0||i.y!==0)&&(r=!0,t.onTurn(i))});let i=e=>{n!==null&&e.pointerId===n.pointerId&&(n=null,r&&t.onEnd(),r=!1)};e.addEventListener(`pointerup`,i),e.addEventListener(`pointercancel`,i)}var bf=Math.PI*2,xf=.001;function Sf(e,t){let n=bf/Math.max(t,1);return{yaw:-n*e.x,pitch:-n*e.y}}function Cf(e,t,n){let r=e.up.clone().normalize(),i=e.position.clone().sub(t),a=i.length(),o=i.dot(r),s=i.clone().addScaledVector(r,-o);if(a===0||s.lengthSq()===0)return;let c=s.clone().normalize(),l=new Y().crossVectors(r,c).normalize(),u=Math.acos(wf(o/a,-1,1)),d=wf(u+n.pitch,xf,Math.PI-xf);i.copy(c).multiplyScalar(a*Math.sin(d)).addScaledVector(r,a*Math.cos(d)),i.applyAxisAngle(r,n.yaw);let f=new Tt().setFromAxisAngle(l,d-u),p=new Tt().setFromAxisAngle(r,n.yaw);e.position.copy(t).add(i),e.quaternion.premultiply(f).premultiply(p),e.updateMatrixWorld()}function wf(e,t,n){return Math.min(Math.max(e,t),n)}function Tf(e){let{camera:t,surfaces:n,point:r,size:i}=e;if(i.width===0||i.height===0)return null;let a=new Os;a.setFromCamera(new J(r.x/i.width*2-1,-(r.y/i.height)*2+1),t);let[o]=a.intersectObjects(n.filter(e=>e.visible),!1);return o===void 0?null:o.point}function Ef(e){let{camera:t,surfaces:n,point:r,size:i}=e;if(i.width===0||i.height===0)return null;let a=new Os;a.setFromCamera(new J(r.x/i.width*2-1,-(r.y/i.height)*2+1),t);let[o]=a.intersectObjects(n.filter(e=>e.visible),!1);return o===void 0?null:{point:o.point,mesh:o.object}}function Df(e,t){switch(e.kind){case`measuring`:return{kind:`measuring`};case`failed`:return{kind:`failed`,reason:e.reason};case`painted`:return e.surface===t.surface&&e.smoothing===t.smoothing?{kind:`measured`,surface:e.surface,colours:e.colours,range:e.range,milliseconds:e.milliseconds}:{kind:`ignore`};default:return Pd(e)}}var Of=e=>{let t=new Worker(new URL(`/assets/curvature-worker-DQJjBNVp.js`,``+import.meta.url),{type:`module`});return t.addEventListener(`message`,t=>{e.received(t.data)}),t.addEventListener(`error`,t=>{e.broke(t.message===``?`the measuring worker stopped`:t.message)}),{postMessage:(e,n)=>t.postMessage(e,n??[]),terminate:()=>t.terminate()}};function kf(e=Of){let t=[],n=new Set,r=new Map,i=null,a=null;function o(e){for(let n of t)n(e)}function s(e){if(e.type===`measuring`){o({kind:`measuring`,id:e.id});return}n.delete(e.id),o(jf(e)),u(e.id)}function c(e){a=e;for(let t of n)o({kind:`failed`,id:t,reason:e});n.clear(),r.clear()}function l(t){if(a!==null){o({kind:`failed`,id:t.id,reason:a});return}let r=i??=e({received:s,broke:c});n.add(t.id);let l={type:`paint`,...t};r.postMessage(l,t.geometry===void 0?void 0:[t.geometry.positions.buffer])}function u(e){let t=r.get(e);t!==void 0&&(r.delete(e),l(t))}return{paint(e){if(n.has(e.id)){r.set(e.id,Af(r.get(e.id),e));return}l(e)},discard(){i?.terminate(),i=null,n.clear(),r.clear(),a=null},onEvent(e){t.push(e)},dispose(){i?.terminate(),i=null,n.clear(),r.clear(),t.length=0}}}function Af(e,t){let n=t.geometry??e?.geometry;return n===void 0?t:{...t,geometry:n}}function jf(e){switch(e.type){case`painted`:return{kind:`painted`,id:e.id,surface:e.surface,smoothing:e.smoothing,colours:e.colours,range:e.range,milliseconds:e.milliseconds};case`failed`:return{kind:`failed`,id:e.id,reason:e.reason};default:return Pd(e)}}function Mf(e){let t=0;for(let n of Array.from(e))t+=n.clientY;return t/Math.max(e.length,1)}function Nf(e,t){let n=null;e.addEventListener(`touchstart`,e=>{e.touches.length<2||(n=Mf(e.touches),t.setPanning(!1))}),e.addEventListener(`touchmove`,e=>{if(e.touches.length<2||n===null)return;let t=Mf(e.touches);window.scrollBy(0,n-t),n=t});let r=e=>{e.touches.length>=2||(n=null,t.setPanning(!0))};e.addEventListener(`touchend`,r),e.addEventListener(`touchcancel`,r)}var Pf=.5;function Ff(e){let t=0,n=0;return{add(r,i){if(t+=1,n+=r,n<e)return null;let a={fps:Math.round(t/n),...i()};return t=0,n=0,a}}}function If(e){let t=0;for(let n of e)n.mesh.visible&&(t+=n.triangles);return t}var Lf=15460320,Rf=40,zf=14209994,Bf=12762288,Vf=class{renderer;scene=new Mn;camera;controls;grid;roomEnvironment;environment;content=new wn;layers=new Map;resizeObserver;loader=new Td;orbitMarker=hf();timer=new ps;options;painter=kf();stats=Ff(Pf);isolatedId=null;separationFactor=0;lastSize=null;hoveredLayerId=null;hoverRafPending=!1;orbitCentre=new Y;canvas;isDisposed=!1;handleContextLost=e=>{e.preventDefault(),console.warn(`ThreeViewport: WebGL context lost. Rendering suspended.`);try{this.renderer.setAnimationLoop(null)}catch{}};handleContextRestored=()=>{if(!this.isDisposed){console.info(`ThreeViewport: WebGL context restored. Rebuilding GPU resources.`);try{this.roomEnvironment?.dispose(),this.environment?.dispose(),this.roomEnvironment=new Cd;let e=new oc(this.renderer);this.environment=e.fromScene(this.roomEnvironment,.04).texture,e.dispose(),this.scene.environment=this.environment,this.renderer.setAnimationLoop(this.render)}catch(e){console.warn(`ThreeViewport: Error restoring context resources:`,e)}}};constructor(e,t={}){this.options=t,this.canvas=e,e.addEventListener(`webglcontextlost`,this.handleContextLost,!1),e.addEventListener(`webglcontextrestored`,this.handleContextRestored,!1);let n;try{n=new $u({canvas:e,antialias:!0,alpha:t.transparentBackground??!1,powerPreference:`high-performance`})}catch(r){console.warn(`ThreeViewport: Primary WebGL context creation failed, retrying with fallback options:`,r);try{n=new $u({canvas:e,antialias:!1,alpha:t.transparentBackground??!1,powerPreference:`default`,precision:`mediump`})}catch(e){throw Error(`WebGL context could not be created: `+(e instanceof Error?e.message:String(e)))}}this.renderer=n,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=.78,this.camera=new Qo(45,1,.1,1e4),this.camera.up.set(0,0,1),this.camera.position.copy(Jd).multiplyScalar(200),t.transparentBackground||(this.scene.background=new X(Lf)),this.scene.add(this.content),this.scene.add(this.orbitMarker.object),this.addLights(),this.roomEnvironment=new Cd;let r=new oc(this.renderer);this.environment=r.fromScene(this.roomEnvironment,.04).texture,r.dispose(),this.scene.environment=this.environment,this.grid=new Ms(400,Rf,Bf,zf),this.grid.rotation.x=Math.PI/2,this.scene.add(this.grid);let i=typeof localStorage<`u`?localStorage.getItem(`dental_theme`):null;(i===`dark`||!i&&typeof window<`u`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches)&&this.setGridTheme(!0),this.controls=new ud(this.camera,e),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.screenSpacePanning=!0,this.controls.zoomToCursor=!0,this.controls.enableRotate=!1,this.controls.addEventListener(`end`,this.handleCameraSettled),e.style.touchAction=`none`,Nf(e,{setPanning:e=>{this.controls.enablePan=e}}),yf(e,{onTurn:e=>{this.isCameraLocked||this.turnCamera(e)},onEnd:()=>{this.handleCameraSettled()},isLocked:()=>this.isCameraLocked}),_f(e,{onLongPress:e=>{this.setOrbitCentreAt(e)}}),this.resizeObserver=new ResizeObserver(this.handleResize),this.resizeObserver.observe(e),this.handleResize(),this.painter.onEvent(this.handleSurface),t.onToothHover&&(e.addEventListener(`mousemove`,e=>{this.hoverRafPending||(this.hoverRafPending=!0,requestAnimationFrame(()=>{this.hoverRafPending=!1,this.handleHoverMove(e)}))}),e.addEventListener(`mouseleave`,()=>{this.hoveredLayerId!==null&&(this.hoveredLayerId=null,this.options.onToothHover?.(null))})),this.renderer.setAnimationLoop(this.render)}addLayer(e){let t;try{t=this.createLayer(e)}catch(e){return{ok:!1,reason:Nd(e)}}return this.layers.set(t.id,t),this.content.add(t.mesh),this.refreshSeparation(),{ok:!0}}geometryCache=new Map;createLayer(e){let t=e.geometry;if(!t){if(e.stl)t=this.geometryCache.get(e.stl),t||(t=jd(this.loader.parse(e.stl),!e.label.toLowerCase().includes(`lower`)),t.getAttribute(`color`)&&(t.userData.baseColors=t.getAttribute(`color`).clone()),t.computeVertexNormals(),t.computeBoundingBox(),this.geometryCache.set(e.stl,t));else throw Error(`Layer ${e.id} missing both geometry and stl buffer`)}e.colour===`anatomical`&&(t.getAttribute(`color`)||Md(t,e.label));let n=e.colour===`anatomical`,r=new $a({color:new X(n?`#ffffff`:e.colour),roughness:.35,metalness:.01,clearcoat:.42,clearcoatRoughness:.18,ior:1.5,envMapIntensity:.18,vertexColors:n&&!!t.getAttribute(`color`),side:2});n&&(r.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <lights_physical_fragment>`,`#include <lights_physical_fragment>
          #if defined( USE_COLOR )
            // Distinguish Gum vs Attachment vs Tooth Enamel:
            // Attachment: Deep contrast orange
            bool isAttachment = ((vColor.r > 0.75 && vColor.g > 0.16 && vColor.g < 0.55 && vColor.b < 0.18) || (vColor.r > 0.85 && vColor.g > 0.35 && vColor.g < 0.72 && vColor.b < 0.28));
            // Gum: rich vascular oral mucosa (r > 0.35, r - g > 0.10, not attachment)
            bool isGum = (!isAttachment && vColor.r > 0.35 && (vColor.r - vColor.g) > 0.10);

            if (isAttachment) {
              // Clinical composite resin engager / attachment finish (deep contrast, semi-gloss, clean reflections)
              material.roughness = 0.24;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.45;
                material.clearcoatRoughness = 0.15;
              #endif
            } else if (isGum) {
              // Moist biological oral mucosa (soft satin clearcoat to avoid white glare on scan micro-facets)
              material.roughness = 0.44;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.20;
                material.clearcoatRoughness = 0.34;
              #endif
            } else {
              // Glazed natural dental enamel
              material.roughness = 0.32;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.28;
                material.clearcoatRoughness = 0.20;
              #endif
              // Occlusal fissure & groove depth enhancement based on normal derivative curvature
              float crevice = clamp((length(dxy) - 0.04) * 1.8, 0.0, 0.42);
              material.diffuseColor *= (1.0 - crevice);
            }
          #endif
          `)});let i=new Vr({vertexColors:!0,toneMapped:!1,side:2}),a=new $r(t,r);return a.name=e.label,a.matrixAutoUpdate=!1,{id:e.id,label:e.label,colour:e.colour,mesh:a,geometry:t,material:r,measuredMaterial:i,triangles:Uf(t),bounds:Wf(t),separationOffset:0,visible:!0,opacity:1,transform:null,surface:`colour`,smoothing:2,measured:!1}}clearLayers(){for(let e of this.layers.values()){this.content.remove(e.mesh);let t=!1;for(let n of this.geometryCache.values())if(n===e.geometry){t=!0;break}t||e.geometry.dispose(),e.material.dispose(),e.measuredMaterial.dispose()}this.layers.clear(),this.isolatedId=null,this.hoveredLayerId=null,this.painter.discard()}removeLayer(e){let t=this.layers.get(e);if(!t)return;this.content.remove(t.mesh);let n=!1;for(let e of this.geometryCache.values())if(e===t.geometry){n=!0;break}n||t.geometry.dispose(),t.material.dispose(),t.measuredMaterial.dispose(),this.layers.delete(e),this.isolatedId===e&&(this.isolatedId=null),this.hoveredLayerId===e&&(this.hoveredLayerId=null)}getLayerGeometry(e){if(this.layers.has(e))return this.layers.get(e).geometry;let t=null;for(let[n,r]of this.layers.entries())if((n===e||n.startsWith(`${e}-`))&&(t=r,r.visible&&r.opacity>0))return r.geometry;return t?.geometry??null}getLayerMesh(e){if(this.layers.has(e))return this.layers.get(e).mesh;let t=null;for(let[n,r]of this.layers.entries())if((n===e||n.startsWith(`${e}-`))&&(t=r,r.visible&&r.opacity>0))return r.mesh;return t?.mesh??null}getThreeScene(){return this.scene}getThreeCamera(){return this.camera}getThreeRenderer(){return this.renderer}isCameraLocked=!1;getControls(){return this.controls}setCameraLocked(e){this.isCameraLocked=e,this.controls.enabled=!e}getCameraLocked(){return this.isCameraLocked}projectPoint(e,t){let n=this.lastSize?.width||this.renderer.domElement.clientWidth,r=this.lastSize?.height||this.renderer.domElement.clientHeight;if(n<=0||r<=0)return null;let i=new Y(e.x,e.y,e.z);if(t){let e=this.layers.get(t);e&&(e.mesh.updateWorldMatrix(!0,!1),i.applyMatrix4(e.mesh.matrixWorld))}i.project(this.camera);let a=i.z<1&&i.z>-1;return{x:(i.x*.5+.5)*n,y:(-i.y*.5+.5)*r,visible:a,depth:i.z}}setLayerGeometry(e,t){let n=this.layers.get(e);if(n){if(t.boundingBox||t.computeBoundingBox(),t.boundingSphere||t.computeBoundingSphere(),n.geometry=t,n.mesh.geometry=t,n.bounds=Wf(t),n.triangles=Uf(t),n.colour===`anatomical`){t.userData.baseColors instanceof dr&&!t.getAttribute(`color`)?t.setAttribute(`color`,t.userData.baseColors.clone()):t.getAttribute(`color`)||Md(t,n.label);let e=!!t.getAttribute(`color`);n.material.vertexColors!==e&&(n.material.vertexColors=e,n.material.needsUpdate=!0)}this.refreshSeparation()}}setLayerVisible(e,t){let n=this.layerFor(e);n.visible=t,this.applyLayerState(n)}setLayerOpacity(e,t){let n=this.layerFor(e);n.opacity=Vd(t),this.applyLayerState(n)}setLayerColour(e,t){let n=this.layerFor(e);if(n.colour=t,t===`anatomical`){let e=n.geometry.getAttribute(`position`)?.count;n.geometry.userData.baseColors instanceof dr&&n.geometry.userData.baseColors.count===e?(n.geometry.setAttribute(`color`,n.geometry.userData.baseColors.clone()),n.geometry.attributes.color.needsUpdate=!0):(!n.geometry.getAttribute(`color`)||n.geometry.getAttribute(`color`)?.count!==e)&&(Md(n.geometry,n.label),n.geometry.getAttribute(`color`)&&(n.geometry.userData.baseColors=n.geometry.getAttribute(`color`).clone())),n.material.vertexColors=!!n.geometry.getAttribute(`color`),n.material.color.set(`#ffffff`)}else t===`contacts`?(n.material.vertexColors=!!n.geometry.getAttribute(`color`),n.material.color.set(`#ffffff`)):(n.material.vertexColors=!1,n.material.color.set(t));n.material.needsUpdate=!0}setLayerTransform(e,t){let n=this.layerFor(e);n.transform=t,this.applyPlacement(n)}setLayerSurface(e,t){let n=this.layerFor(e);n.surface!==t&&(n.surface=t,this.refreshSurface(n))}setLayerSmoothing(e,t){let n=this.layerFor(e),r=Bd(t);n.smoothing!==r&&(n.smoothing=r,this.refreshSurface(n))}setSeparation(e){let t=Vd(e);if(t!==this.separationFactor){this.separationFactor=t;for(let e of this.layers.values())this.applyPlacement(e);this.pullBackToFit()}}isolate(e){this.isolatedId=e;for(let e of this.layers.values())this.applyLayerState(e)}fitAll(){let e=this.contentBounds();e!==null&&(this.frame(e,this.currentDirection()),this.syncGrid(e))}fitLayer(e){this.frame(new qn().setFromObject(this.layerFor(e).mesh),this.currentDirection())}setView(e){let t=Yd(e);this.camera.up.copy(t.up);let n=this.contentBounds();n!==null&&this.frame(n,t.direction)}setGridVisible(e){this.grid.visible=e}setGridTheme(e){let t=new X(e?3718648:Bf),n=new X(e?2569546:zf),r=this.grid.geometry.attributes.color,i=this.grid.geometry.attributes.position;if(r&&i){for(let e=0;e<r.count;e+=2){let a=i.getX(e),o=i.getZ(e),s=i.getX(e+1),c=i.getZ(e+1),l=Math.abs(a)<.001&&Math.abs(s)<.001||Math.abs(o)<.001&&Math.abs(c)<.001?t:n;r.setXYZ(e,l.r,l.g,l.b),r.setXYZ(e+1,l.r,l.g,l.b)}r.needsUpdate=!0}}setBackgroundColor(e){let t=new X(e);this.scene.background instanceof X?this.scene.background.copy(t):this.scene.background=t.clone();let n=.299*t.r+.587*t.g+.114*t.b;this.setGridTheme(n<.5)}setOrbitCentreAt(e){let{left:t,top:n,width:r,height:i}=this.renderer.domElement.getBoundingClientRect(),a=Tf({camera:this.camera,surfaces:[...this.layers.values()].map(e=>e.mesh),point:{x:e.x-t,y:e.y-n},size:{width:r,height:i}});return a!==null&&(this.orbitCentre.copy(a),this.markOrbitCentre(a),this.handleCameraSettled(),this.options.onOrbitCentre?.(),!0)}handleHoverMove(e){let{left:t,top:n,width:r,height:i}=this.renderer.domElement.getBoundingClientRect(),a=e.clientX-t,o=e.clientY-n,s=Ef({camera:this.camera,surfaces:[...this.layers.values()].map(e=>e.mesh),point:{x:a,y:o},size:{width:r,height:i}});if(s===null){this.hoveredLayerId!==null&&(this.hoveredLayerId=null,this.options.onToothHover?.(null));return}let c=null;for(let[e,t]of this.layers)if(t.mesh===s.mesh){c=e;break}c!==null&&(this.hoveredLayerId=c,this.options.onToothHover?.({layerId:c,canvasX:a,canvasY:o,hitPoint:{x:s.point.x,y:s.point.y,z:s.point.z}}))}getCamera(){let{x:e,y:t,z:n}=this.camera.position,{x:r,y:i,z:a}=this.controls.target,{x:o,y:s,z:c}=this.orbitCentre;return{position:[e,t,n],target:[r,i,a],orbitCentre:[o,s,c]}}setCamera(e){this.camera.position.set(...e.position),this.controls.target.set(...e.target),this.orbitCentre.set(...e.orbitCentre??e.target);let t=this.contentBounds();t!==null&&this.limitZoom(t),this.controls.update()}dispose(){if(!this.isDisposed){this.isDisposed=!0,this.canvas.removeEventListener(`webglcontextlost`,this.handleContextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.handleContextRestored);try{this.renderer.setAnimationLoop(null)}catch{}this.timer.dispose(),this.resizeObserver.disconnect(),this.controls.removeEventListener(`end`,this.handleCameraSettled),this.clearLayers(),this.painter.dispose(),this.orbitMarker.dispose(),this.grid.geometry.dispose(),this.grid.material.dispose();try{this.roomEnvironment.dispose()}catch{}try{this.environment.dispose()}catch{}this.controls.dispose();for(let e of this.geometryCache.values())try{e.dispose()}catch{}this.geometryCache.clear();try{typeof this.renderer.forceContextLoss==`function`&&this.renderer.forceContextLoss()}catch{}try{this.renderer.dispose()}catch{}}}setExposure(e){this.renderer.toneMappingExposure=Math.max(.2,Math.min(2,e))}getExposure(){return this.renderer.toneMappingExposure}addLights(){this.scene.add(new Bo(16775406,1316900,.14));let e=new as(16776178,.4);e.position.set(40,55,75),this.scene.add(e);let t=new as(15660287,.22);t.position.set(-45,45,65),this.scene.add(t);let n=new as(16777215,.2);n.position.set(0,85,20),this.scene.add(n);let r=new as(16118766,.16);r.position.set(-15,50,-70),this.scene.add(r);let i=new as(15594231,.06);i.position.set(0,-60,25),this.scene.add(i)}layerFor(e){let t=this.layers.get(e);if(t===void 0){for(let[t,n]of this.layers.entries())if(t===e||t.startsWith(`${e}-`))return n;throw Error(`No layer with id "${e}" has been added.`)}return t}refreshSeparation(){let e=Rd([...this.layers.values()].map(e=>({id:e.id,bounds:e.bounds})));for(let t of this.layers.values())t.separationOffset=e.get(t.id)??0,this.applyPlacement(t)}applyPlacement(e){e.mesh.matrix.copy(sf(e.transform,e.separationOffset*this.separationFactor)),e.mesh.matrixWorldNeedsUpdate=!0}applyLayerState(e){let t=af(e,this.isolatedId);e.mesh.visible=t.visible;for(let n of[e.material,e.measuredMaterial])n.opacity=e.opacity,n.transparent=t.transparent,n.depthWrite=t.depthWrite}refreshSurface(e){if(e.surface===`colour`)return cf(e);this.paint(e,e.surface)}paint(e,t){let n=!e.measured;e.measured=!0,this.painter.paint({id:e.id,surface:t,smoothing:e.smoothing,...this.geometryFor(e,n)})}geometryFor(e,t){return t?{geometry:{positions:Gf(e.geometry),tolerance:Kf(e.bounds)}}:{}}contentBounds(){return tf(this.content.children)}markOrbitCentre(e){let t=this.contentBounds();t!==null&&this.orbitMarker.flash(e,nf(t))}turnCamera(e){let t=this.camera.position.distanceTo(this.controls.target);Cf(this.camera,this.orbitCentre,Sf(e,this.renderer.domElement.clientHeight)),this.controls.target.copy(this.camera.position).addScaledVector(this.viewDirection(),t),this.controls.update()}viewDirection(){return this.camera.getWorldDirection(new Y)}pullBackToFit(){let e=this.contentBounds();e!==null&&this.frame(e,this.currentDirection())}frame(e,t){let n=Zd({bounds:e,fov:this.camera.fov,aspect:this.camera.aspect,direction:t});this.camera.position.copy(n.position),this.camera.near=n.near,this.camera.far=n.far,this.camera.updateProjectionMatrix(),this.controls.target.copy(n.target),this.controls.minDistance=n.minDistance,this.controls.maxDistance=n.maxDistance,this.orbitCentre.copy(n.target),this.controls.update(),this.handleCameraSettled()}limitZoom(e){let t=Xd(e);this.controls.minDistance=t.minDistance,this.controls.maxDistance=t.maxDistance}syncGrid(e){let t=Qd(e);this.grid.scale.setScalar(t.scale),this.grid.position.copy(t.position)}currentDirection(){let e=this.camera.position.clone().sub(this.controls.target);return e.lengthSq()===0?Jd.clone():e.normalize()}handleResize=()=>{let e=$d({width:this.renderer.domElement.clientWidth,height:this.renderer.domElement.clientHeight,previous:this.lastSize});e!==null&&(this.lastSize=e,this.renderer.setSize(e.width,e.height,!1),this.camera.aspect=e.aspect,this.camera.updateProjectionMatrix())};handleCameraSettled=()=>{this.options.onCameraSettled?.()};handleSurface=e=>{let t=this.layers.get(e.id);t!==void 0&&uf(t,Df(e,t),this.tell)};tell=e=>{this.options.onSurface?.(e)};render=e=>{if(this.isDisposed)return;try{let e=this.renderer.getContext();if(e&&typeof e.isContextLost==`function`&&e.isContextLost())return}catch{}this.timer.update(e);let t=this.timer.getDelta();this.controls.update(),this.renderer.render(this.scene,this.camera),this.reportStats(t)};reportStats(e){let t=this.stats.add(e,()=>this.drawnContent());t!==null&&this.options.onStats?.(t)}drawnContent(){return{visibleTriangles:If(this.layers.values()),drawCalls:this.renderer.info.render.calls}}};function Hf(e,t={}){return new Vf(e,t)}function Uf(e){let t=e.attributes.position;return t===void 0?0:Math.floor(t.count/3)}function Wf(e){let t=e.boundingBox;return t===null?{min:[0,0,0],max:[0,0,0]}:{min:[t.min.x,t.min.y,t.min.z],max:[t.max.x,t.max.y,t.max.z]}}function Gf(e){let t=e.getAttribute(`position`),n=new Float32Array(t.count*3);for(let e=0;e<t.count;e+=1)n[e*3]=t.getX(e),n[e*3+1]=t.getY(e),n[e*3+2]=t.getZ(e);return n}function Kf(e){return Math.hypot(e.max[0]-e.min[0],e.max[1]-e.min[1],e.max[2]-e.min[2])*Fd}var qf={caseId:`soumya-sarath`,patientName:`Soumya Sarath`,treatmentStages:[{id:`stage-01`,stageNumber:1,label:`Stage 1`,doctorOnly:!1,upper:{filename:`Soumya Sarath Upper jaw - 01 - Model.glb`,url:`/models/Soumya Sarath Upper jaw - 01 - Model.glb`},lower:{filename:`Soumya Sarath Lower jaw - 01 - Model.glb`,url:`/models/Soumya Sarath Lower jaw - 01 - Model.glb`}},{id:`stage-02`,stageNumber:2,label:`Stage 2`,doctorOnly:!1,upper:{filename:`Soumya Sarath Upper jaw - 02 - Model.glb`,url:`/models/Soumya Sarath Upper jaw - 02 - Model.glb`},lower:{filename:`Soumya Sarath Lower jaw - 02 - Model.glb`,url:`/models/Soumya Sarath Lower jaw - 02 - Model.glb`}}],templateStages:[{id:`template-01`,label:`Template (Doctor Reference)`,doctorOnly:!0,upper:{filename:`Soumya Sarath Upper jaw - 01 - Template.glb`,url:`/models/Soumya Sarath Upper jaw - 01 - Template.glb`},lower:{filename:`Soumya Sarath Lower jaw - 01 - Template.glb`,url:`/models/Soumya Sarath Lower jaw - 01 - Template.glb`}}],ipr:[{id:`ipr-1`,arch:`upper`,contact:`11-21`,toothA:11,toothB:21,stage:1,amountMm:.3},{id:`ipr-2`,arch:`lower`,contact:`41-31`,toothA:41,toothB:31,stage:1,amountMm:.2},{id:`ipr-3`,arch:`lower`,contact:`31-32`,toothA:31,toothB:32,stage:2,amountMm:.2}],doctorNotes:{doctorName:`Dr. Sarath Kumar`,clinicName:`Elite Orthodontics`,wearHoursPerDay:22,daysPerStage:10,general:`Wear aligners for a minimum of 20 to 22 hours per day. Only remove aligners when eating, drinking hot beverages, or brushing. Use chewies for 5 minutes after inserting aligners to seat them properly.`,stageRemarks:[{stage:1,note:`Initial attachment template bonding in clinic. Begin wearing aligner tray 1.`},{stage:2,note:`Perform 0.20 mm IPR at contact 31-32 before wearing aligner 2.`},{stage:5,note:`Mid-treatment progress evaluation. Verify tracking of anterior rotations.`},{stage:10,note:`Final stage review. Prepare for post-treatment retention scan.`}],updatedAt:`Nov 5, 2026`},ambiguities:[]};Array.from({length:10},(e,t)=>{let n=t+1,r=String(n).padStart(2,`0`),i=`Niya Priority Upper jaw - ${r} - Model.glb`,a=`Niya Priority Lower jaw - ${r} - Model.glb`;return{id:`stage-${r}`,stageNumber:n,label:`Stage ${n}`,doctorOnly:!1,upper:{filename:i,url:`/models/Ashina%20models/${encodeURIComponent(i)}?v=clean2`},lower:{filename:a,url:`/models/Ashina%20models/${encodeURIComponent(a)}?v=clean2`}}});var Jf=qf;Jf.treatmentStages.map(e=>({stage:e.stageNumber??1,label:e.label,upperUrl:e.upper?.url??``,lowerUrl:e.lower?.url??``})).length;function Yf(e,t=`dental-case`,n){let r=[],i=[];for(let t of e){let e=t.name,n=e.toLowerCase(),a=t.arch??null;if(!a){let t=n.includes(`upper`)||n.includes(`maxillary`)||n.includes(`_u_`)||n.includes(`_u.`)||n.startsWith(`u_`),i=n.includes(`lower`)||n.includes(`mandibular`)||n.includes(`_l_`)||n.includes(`_l.`)||n.startsWith(`l_`);if(t&&!i)a=`upper`;else if(i&&!t)a=`lower`;else{r.push(`Ambiguous arch for file "${e}": cannot definitively identify whether it is upper or lower jaw.`);continue}}let o=t.role??`treatment`;t.role||(o=n.includes(`template`)||n.includes(`reference`)||n.includes(`original`)||n.includes(`pre-op`)?`doctor-template`:`treatment`);let s=t.stageKey,c;if(!s){if(o===`doctor-template`){let t=e.match(/\b0*(\d+)\b/);s=t?`template-${t[1]}`:`template`}else{let t=e.match(/stage[_\s-]*(\d+)/i)??e.match(/step[_\s-]*(\d+)/i)??e.match(/-\s*0*(\d+)\s*-/)??e.match(/[_\s]0*(\d+)[_\s]/)??e.match(/(\d+)/);if(t?.[1])c=parseInt(t[1],10),s=`stage-${String(c).padStart(2,`0`)}`;else{r.push(`Ambiguous stage number for file "${e}": could not extract stage number from filename.`);continue}}}i.push({descriptor:t,arch:a,role:o,stageKey:s,stageNumber:c})}let a=new Map;for(let e of i){let t=a.get(e.stageKey);t||(t={role:e.role,stageNumber:e.stageNumber,uppers:[],lowers:[]},a.set(e.stageKey,t)),e.arch===`upper`?t.uppers.push(e):t.lowers.push(e)}let o=[],s=[];for(let[e,t]of a.entries()){let n=t.role===`doctor-template`?`Template (Doctor Reference)`:t.stageNumber===void 0?e:`Stage ${t.stageNumber}`;if(t.uppers.length===0){r.push(`Missing upper jaw model for ${n} (key: "${e}"). Lower model "${t.lowers[0]?.descriptor.name}" has no pair.`);continue}if(t.lowers.length===0){r.push(`Missing lower jaw model for ${n} (key: "${e}"). Upper model "${t.uppers[0]?.descriptor.name}" has no pair.`);continue}if(t.uppers.length>1){r.push(`Multiple upper jaw models for ${n}: [${t.uppers.map(e=>`"${e.descriptor.name}"`).join(`, `)}]. Explicit manifest mapping required.`);continue}if(t.lowers.length>1){r.push(`Multiple lower jaw models for ${n}: [${t.lowers.map(e=>`"${e.descriptor.name}"`).join(`, `)}]. Explicit manifest mapping required.`);continue}let i=t.uppers[0].descriptor,a=t.lowers[0].descriptor,c={id:e,stageNumber:t.stageNumber,label:n,doctorOnly:t.role===`doctor-template`,upper:{filename:i.name,url:i.url,file:i.file,sizeBytes:i.size},lower:{filename:a.name,url:a.url,file:a.file,sizeBytes:a.size}};t.role===`doctor-template`?s.push(c):o.push(c)}return o.sort((e,t)=>e.stageNumber!==void 0&&t.stageNumber!==void 0?e.stageNumber-t.stageNumber:e.id.localeCompare(t.id,void 0,{numeric:!0})),{caseId:t,patientName:n,treatmentStages:o,templateStages:s,ambiguities:r}}function Xf(e){let t=e.upperStageNumber,n=e.lowerStageNumber;if(t===void 0&&e.upper){let n=e.upper.filename||e.upper.url||``,r=n.match(/(?:upper|maxill)[\s_.-]*(?:jaw[\s_.-]*)?0*([1-9]\d*)/i)||n.match(/0*([1-9]\d*)[\s_.-]*(?:upper|maxill)/i)||n.match(/(?:jaw|model)[\s_.-]*0*([1-9]\d*)/i)||n.match(/0*([1-9]\d*)[\s_.-]*(?:model|glb|stl)/i);r&&r[1]?t=parseInt(r[1],10):e.stageNumber!==void 0&&(t=e.stageNumber)}if(n===void 0&&e.lower){let t=e.lower.filename||e.lower.url||``,r=t.match(/(?:lower|mandib)[\s_.-]*(?:jaw[\s_.-]*)?0*([1-9]\d*)/i)||t.match(/0*([1-9]\d*)[\s_.-]*(?:lower|mandib)/i)||t.match(/(?:jaw|model)[\s_.-]*0*([1-9]\d*)/i)||t.match(/0*([1-9]\d*)[\s_.-]*(?:model|glb|stl)/i);r&&r[1]?n=parseInt(r[1],10):e.stageNumber!==void 0&&(n=e.stageNumber)}return{upperNum:t,lowerNum:n,hasMismatch:t!==void 0&&n!==void 0&&t!==n}}function Zf(e,t){if(!e||!Array.isArray(e.treatmentStages)||e.treatmentStages.length===0)return e;let n=0,r=0,i=new Map,a=new Map;if(Array.isArray(t)&&t.length>0)for(let e of t){let t=/upper|maxill/i.test(e),o=/lower|mandib/i.test(e),s=e.match(/(?:upper|maxill|lower|mandib)[\s_.-]*(?:jaw[\s_.-]*)?0*([1-9]\d*)/i)||e.match(/(?:jaw|model|upper|lower)[\s_.-]*0*([1-9]\d*)/i)||e.match(/0*([1-9]\d*)[\s_.-]*(?:model|glb|stl)/i);if(s&&s[1]){let c=parseInt(s[1],10);t&&(c>n&&(n=c),i.set(c,e)),o&&(c>r&&(r=c),a.set(c,e))}}if(n===0||r===0)for(let t of e.treatmentStages){let{upperNum:e,lowerNum:i}=Xf(t);e&&e>n&&(n=e),i&&i>r&&(r=i)}let o=e.treatmentStages,s=o.some(e=>!!e.upper),c=o.some(e=>!!e.lower),l=!!e.patientName?.includes(`[Lower]`)&&!s,u=!!e.patientName?.includes(`[Upper]`)&&!c;s&&c&&(e.patientName&&=e.patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i,``).trim());let d=!l,f=!u;for(let t=0;t<o.length;t++){let s=o[t],c=s.stageNumber??t+1,p=s.upperStageNumber??c,m=s.lowerStageNumber??c;n>0&&r>0&&n!==r&&(n<r&&p>n&&(p=n),r<n&&m>r&&(m=r));let h=l?void 0:s.upper,g=u?void 0:s.lower,_=`https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${e.caseId}`;if(!h&&d&&i.size>0){let e=Math.min(c,n),t=i.get(e)||i.get(n);t&&(h={filename:t,url:`${_}/${encodeURIComponent(t)}`})}if(!g&&f&&a.size>0){let e=Math.min(c,r),t=a.get(e)||a.get(r);t&&(g={filename:t,url:`${_}/${encodeURIComponent(t)}`})}if(h&&p!==c){let e=String(p).padStart(2,`0`),t=h.filename.replace(/(?:Upper\s+jaw\s*-\s*)\d+(\s*-\s*Model\.(?:glb|stl))/i,`Upper jaw - ${e}$1`),n=h.url?h.url.replace(/(?:Upper(?:%20|\s)+jaw(?:%20|\s)*-(?:%20|\s)*)\d+((?:%20|\s)*-(?:%20|\s)*Model\.(?:glb|stl))/i,`Upper%20jaw%20-%20${e}$1`):void 0;h={...h,filename:t,url:n||h.url}}if(g&&m!==c){let e=String(m).padStart(2,`0`),t=g.filename.replace(/(?:Lower\s+jaw\s*-\s*)\d+(\s*-\s*Model\.(?:glb|stl))/i,`Lower jaw - ${e}$1`),n=g.url?g.url.replace(/(?:Lower(?:%20|\s)+jaw(?:%20|\s)*-(?:%20|\s)*)\d+((?:%20|\s)*-(?:%20|\s)*Model\.(?:glb|stl))/i,`Lower%20jaw%20-%20${e}$1`):void 0;g={...g,filename:t,url:n||g.url}}o[t]={...s,upperStageNumber:p,lowerStageNumber:m,upper:h,lower:g}}let p=!l&&o.some(e=>!!e.upper),m=!u&&o.some(e=>!!e.lower),h=l?`lower`:u?`upper`:p&&m?`both`:p?`upper`:`lower`;return e.hasUpper=p,e.hasLower=m,e.archType=h,e}function Qf(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Er,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=$f(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=$f(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function $f(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new dr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function ep(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=r?r.count:i.count,o=0,s=Object.keys(e.attributes),c={},l={},u=[],d=[`getX`,`getY`,`getZ`,`getW`],f=[`setX`,`setY`,`setZ`,`setW`];for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.attributes[n];c[n]=new r.constructor(new r.array.constructor(r.count*r.itemSize),r.itemSize,r.normalized);let i=e.morphAttributes[n];i&&(l[n]||(l[n]=[]),i.forEach((e,t)=>{let r=new e.array.constructor(e.count*e.itemSize);l[n][t]=new e.constructor(r,e.itemSize,e.normalized)}))}let p=t*.5,m=10**Math.log10(1/t),h=p*m;for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=`${Math.trunc(r[d[e]](i)*m+h)},`}if(a in n)u.push(n[a]);else{for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),a=e.morphAttributes[n],u=r.itemSize,p=c[n],m=l[n];for(let e=0;e<u;e++){let t=d[e],n=f[e];if(p[n](o,r[t](i)),a)for(let e=0,r=a.length;e<r;e++)m[e][n](o,a[e][t](i))}}n[a]=o,u.push(o),o++}}let g=e.clone();for(let t in e.attributes){let e=c[t];if(g.setAttribute(t,new e.constructor(e.array.slice(0,o*e.itemSize),e.itemSize,e.normalized)),t in l)for(let e=0;e<l[t].length;e++){let n=l[t][e];g.morphAttributes[t][e]=new n.constructor(n.array.slice(0,o*n.itemSize),n.itemSize,n.normalized)}}return g.setIndex(u),g}function tp(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));return i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`),e.setIndex(i),e.clearGroups(),e}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function np(e){let t=new Map,n=new Map,r=e.clone();return rp(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function rp(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)rp(e.children[r],t.children[r],n)}var ip=class extends Mo{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new dp(e)}),this.register(function(e){return new fp(e)}),this.register(function(e){return new xp(e)}),this.register(function(e){return new Sp(e)}),this.register(function(e){return new Cp(e)}),this.register(function(e){return new mp(e)}),this.register(function(e){return new hp(e)}),this.register(function(e){return new gp(e)}),this.register(function(e){return new _p(e)}),this.register(function(e){return new up(e)}),this.register(function(e){return new vp(e)}),this.register(function(e){return new pp(e)}),this.register(function(e){return new bp(e)}),this.register(function(e){return new yp(e)}),this.register(function(e){return new cp(e)}),this.register(function(e){return new wp(e,sp.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new wp(e,sp.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new Tp(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=os.extractUrlBase(e);a=os.resolveURL(t,this.path)}else a=os.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Fo(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===Ep){try{a[sp.KHR_BINARY_GLTF]=new kp(e)}catch(e){r&&r(e);return}i=JSON.parse(a[sp.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new tm(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case sp.KHR_MATERIALS_UNLIT:a[t]=new lp;break;case sp.KHR_DRACO_MESH_COMPRESSION:a[t]=new Ap(i,this.dracoLoader);break;case sp.KHR_TEXTURE_TRANSFORM:a[t]=new jp;break;case sp.KHR_MESH_QUANTIZATION:a[t]=new Mp;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function ap(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function op(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var sp={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},cp=class{constructor(e){this.parser=e,this.name=sp.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new X(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],Pe);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new as(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new ns(s),o.distance=c;break;case`spot`:o=new es(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),qp(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},lp=class{constructor(){this.name=sp.KHR_MATERIALS_UNLIT}getMaterialType(){return Vr}extendParams(e,t,n){let r=[];e.color=new X(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],Pe),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,Ne))}return Promise.all(r)}},up=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},dp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new J(e,e)}return Promise.all(r)}},fp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_DISPERSION}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},pp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},mp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_SHEEN}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new X(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],Pe)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,Ne)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(r)}},hp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},gp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_VOLUME}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new X().setRGB(i[0],i[1],i[2],Pe),Promise.all(r)}},_p=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_IOR}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);return n===null?Promise.resolve():(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3),Promise.resolve())}},vp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_SPECULAR}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let i=n.specularColorFactor||[1,1,1];return t.specularColor=new X().setRGB(i[0],i[1],i[2],Pe),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,Ne)),Promise.all(r)}},yp=class{constructor(e){this.parser=e,this.name=sp.EXT_MATERIALS_BUMP}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},bp=class{constructor(e){this.parser=e,this.name=sp.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return op(this.parser,e,this.name)===null?null:$a}extendMaterialParams(e,t){let n=op(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},xp=class{constructor(e){this.parser=e,this.name=sp.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Sp=class{constructor(e){this.parser=e,this.name=sp.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Cp=class{constructor(e){this.parser=e,this.name=sp.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},wp=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},Tp=class{constructor(e){this.name=sp.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==Ip.TRIANGLES&&e.mode!==Ip.TRIANGLE_STRIP&&e.mode!==Ip.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new Yt,n=new Y,a=new Tt,s=new Y(1,1,1),c=new Ti(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));let l=null;for(let e in o)if(e===`_COLOR_0`){let t=o[e];c.instanceColor=new _i(t.array,t.itemSize,t.normalized)}else if(e!==`TRANSLATION`&&e!==`ROTATION`&&e!==`SCALE`){if(l===null){let e=c.geometry;l=new Er,l.name=e.name;for(let t in e.attributes)l.setAttribute(t,e.attributes[t]);for(let t in e.morphAttributes)l.morphAttributes[t]=e.morphAttributes[t];e.index!==null&&l.setIndex(e.index),l.morphTargetsRelative=e.morphTargetsRelative;for(let t of e.groups)l.addGroup(t.start,t.count,t.materialIndex);e.boundingBox!==null&&(l.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(l.boundingSphere=e.boundingSphere.clone()),l.drawRange.start=e.drawRange.start,l.drawRange.count=e.drawRange.count,l.userData=Object.assign({},e.userData),c.geometry=l}let t=o[e];l.setAttribute(e,new _i(t.array,t.itemSize,t.normalized))}Cn.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},Ep=`glTF`,Dp=12,Op={JSON:1313821514,BIN:5130562},kp=class{constructor(e){this.name=sp.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Dp),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ep)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Dp,i=new DataView(e,Dp),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Op.JSON){let r=new Uint8Array(e,Dp+a,t);this.content=n.decode(r)}else if(r===Op.BIN){let n=Dp+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Ap=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=sp.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=Vp[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=Vp[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=Lp[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,Pe,n)})})}},jp=class{constructor(){this.name=sp.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let t=Math.cos(e.rotation),n=Math.sin(e.rotation);e.matrix.set(e.repeat.x*t,e.repeat.y*n,e.offset.x,-e.repeat.x*n,e.repeat.y*t,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Mp=class{constructor(){this.name=sp.KHR_MESH_QUANTIZATION}},Np=class extends co{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},Pp=new Tt,Fp=class extends Np{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return Pp.fromArray(i).normalize().toArray(i),i}},Ip={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Lp={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Rp={9728:o,9729:l,9984:s,9985:u,9986:c,9987:d},zp={33071:i,33648:a,10497:r},Bp={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Vp={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},Hp={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},Up={CUBICSPLINE:void 0,LINEAR:Ee,STEP:Te},Wp={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function Gp(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new Qa({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function Kp(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function qp(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function Jp(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function Yp(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function Xp(e){let t,n=e.extensions&&e.extensions[sp.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+Zp(n.attributes):e.indices+`:`+Zp(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+Zp(e.targets[n]);return t}function Zp(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function Qp(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function $p(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var em=new Yt,tm=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new ap,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new Ro(this.options.manager):new cs(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Fo(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return Kp(i,a,r),qp(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[sp.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(os.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=Bp[r.type],t=Lp[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new dr(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=Bp[r.type],o=Lp[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new Dr(f,u/s),t.cache.add(n,c)),p=new kr(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new dr(f,a,d);if(r.sparse!==void 0){let t=Bp.SCALAR,n=Lp[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new dr(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=Rp[n.magFilter]||1006,t.minFilter=Rp[n.minFilter]||1008,t.wrapS=zp[n.wrapS]||1e3,t.wrapT=zp[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new Ut(e);t.needsUpdate=!0,n(t)}),t.load(os.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),qp(e,a),e.userData.mimeType=a.mimeType||$p(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[sp.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[sp.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[sp.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new Wi,Fr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new Ai,Fr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return Qa}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[sp.KHR_MATERIALS_UNLIT]){let e=r[sp.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new X(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],Pe),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,Ne)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||Wp.OPAQUE;if(l===Wp.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===Wp.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==Vr&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new J(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==Vr&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==Vr){let e=i.emissiveFactor;o.emissive=new X().setRGB(e[0],e[1],e[2],Pe)}return i.emissiveTexture!==void 0&&a!==Vr&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,Ne)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),qp(n,i),t.associations.set(n,{materials:e}),i.extensions&&Kp(r,n,i),n})}createUniqueName(e){let t=Es.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[sp.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return rm(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=Xp(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[sp.KHR_DRACO_MESH_COMPRESSION]?i(o):rm(new Er,o,t),o.mode===Ip.TRIANGLE_STRIP?e=e.then(e=>tp(e,1)):o.mode===Ip.TRIANGLE_FAN&&(e=e.then(e=>tp(e,2))),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?Gp(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===Ip.TRIANGLES||u.mode===Ip.TRIANGLE_STRIP||u.mode===Ip.TRIANGLE_FAN||u.mode===void 0){let e=i.isSkinnedMesh===!0,t=l.hasAttribute(`skinIndex`)&&l.hasAttribute(`skinWeight`);e&&t===!1&&console.warn(`THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.`),d=e&&t?new di(l,f):new $r(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights()}else if(u.mode===Ip.LINES)d=new Hi(l,f);else if(u.mode===Ip.LINE_STRIP)d=new Ri(l,f);else if(u.mode===Ip.LINE_LOOP)d=new Ui(l,f);else if(u.mode===Ip.POINTS)d=new Yi(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&Yp(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),qp(d,i),u.extensions&&Kp(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&Kp(r,c[0],i),c[0];let l=new wn;i.extensions&&Kp(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn(`THREE.GLTFLoader: Missing camera parameters.`);return}return n.type===`perspective`?t=new Qo(wt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new rs(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),qp(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new Yt;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new gi(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new Eo(i,void 0,l);return qp(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,em)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new Y().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new fi:t.length>1?new wn:t.length===1?t[0]:new Cn,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),qp(o,i),i.extensions&&Kp(n,o,i),i.matrix!==void 0){let e=new Yt;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new wn;n.name&&(i.name=r.createUniqueName(n.name)),qp(i,n),n.extensions&&Kp(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(np(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof Fr||e instanceof Ut)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];function c(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}Hp[i.path]===Hp.weights?(c(e),e.isGroup&&e.children.forEach(c)):s.push(o);let l;switch(Hp[i.path]){case Hp.weights:l=xo;break;case Hp.rotation:l=Co;break;case Hp.translation:case Hp.scale:l=To;break;default:switch(n.itemSize){case 1:l=xo;break;default:l=To}}let u=r.interpolation===void 0?Ee:Up[r.interpolation],d=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new l(s[e]+`.`+Hp[i.path],t.array,d,u);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=Qp(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof Co?Fp:Np)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function nm(e,t,n){let r=t.attributes,i=new qn;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new Y(t[0],t[1],t[2]),new Y(a[0],a[1],a[2])),e.normalized){let t=Qp(Lp[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new Y,t=new Y;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=Qp(Lp[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new vr;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function rm(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=Vp[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return Nt.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Nt.workingColorSpace}" not supported.`),qp(e,t),nm(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:Jp(e,t.targets,n)})}function im(e){return new Promise((t,n)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>n(e.error)})}function am(e,t){let n,r=()=>{if(n)return n;let r=indexedDB.open(e);return r.onupgradeneeded=()=>r.result.createObjectStore(t),n=im(r),n.then(e=>{e.onclose=()=>n=void 0},()=>{n=void 0}),n};return(e,n)=>r().then(r=>n(r.transaction(t,e).objectStore(t)))}var om;function sm(){return om||=am(`keyval-store`,`keyval`),om}function cm(e,t=sm()){return t(`readonly`,t=>im(t.get(e)))}function lm(e,t,n=sm()){return n(`readwrite`,n=>(n.put(t,e),im(n.transaction)))}function um(e,t=sm()){return t(`readwrite`,t=>(e.forEach(e=>t.delete(e)),im(t.transaction)))}function dm(e,t){return e.openCursor().onsuccess=function(){this.result&&(t(this.result),this.result.continue())},im(e.transaction)}function fm(e=sm()){return e(`readonly`,e=>{if(e.getAllKeys)return im(e.getAllKeys());let t=[];return dm(e,e=>t.push(e.key)).then(()=>t)})}var pm=Uint8Array,mm=Uint16Array,hm=Int32Array,gm=new pm([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),_m=new pm([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),vm=new pm([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ym=function(e,t){for(var n=new mm(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new hm(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},bm=ym(gm,2),xm=bm.b,Sm=bm.r;xm[28]=258,Sm[258]=28;for(var Cm=ym(_m,0),wm=Cm.b,Tm=Cm.r,Em=new mm(32768),Dm=0;Dm<32768;++Dm){var Om=(Dm&43690)>>1|(Dm&21845)<<1;Om=(Om&52428)>>2|(Om&13107)<<2,Om=(Om&61680)>>4|(Om&3855)<<4,Em[Dm]=((Om&65280)>>8|(Om&255)<<8)>>1}for(var km=(function(e,t,n){for(var r=e.length,i=0,a=new mm(t);i<r;++i)e[i]&&++a[e[i]-1];var o=new mm(t);for(i=1;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new mm(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[Em[d]>>c]=l}else for(s=new mm(r),i=0;i<r;++i)e[i]&&(s[i]=Em[o[e[i]-1]++]>>15-e[i]);return s}),Am=new pm(288),Dm=0;Dm<144;++Dm)Am[Dm]=8;for(var Dm=144;Dm<256;++Dm)Am[Dm]=9;for(var Dm=256;Dm<280;++Dm)Am[Dm]=7;for(var Dm=280;Dm<288;++Dm)Am[Dm]=8;for(var jm=new pm(32),Dm=0;Dm<32;++Dm)jm[Dm]=5;var Mm=km(Am,9,0),Nm=km(Am,9,1),Pm=km(jm,5,0),Fm=km(jm,5,1),Im=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Lm=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},Rm=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},zm=function(e){return(e+7)/8|0},Bm=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new pm(e.subarray(t,n))},Vm=[`unexpected EOF`,`invalid block type`,`invalid length/literal`,`invalid distance`,`stream finished`,`no stream handler`,,`no callback`,`invalid UTF-8 data`,`extra field too long`,`date not in range 1980-2099`,`filename too long`,`stream finishing`,`invalid zip data`],Hm=function(e,t,n){var r=Error(t||Vm[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Hm),!n)throw r;return r},Um=function(e,t,n,r){var i=e.length,a=r?r.length:0;if(!i||t.f&&!t.l)return n||new pm(0);var o=!n,s=o||t.i!=2,c=t.i;o&&(n=new pm(i*3));var l=function(e){var t=n.length;if(e>t){var r=new pm(Math.max(t*2,e));r.set(n),n=r}},u=t.f||0,d=t.p||0,f=t.b||0,p=t.l,m=t.d,h=t.m,g=t.n,_=i*8;do{if(!p){u=Lm(e,d,1);var v=Lm(e,d+1,3);if(d+=3,!v){var y=zm(d)+4,b=e[y-4]|e[y-3]<<8,x=y+b;if(x>i){c&&Hm(0);break}s&&l(f+b),n.set(e.subarray(y,x),f),t.b=f+=b,t.p=d=x*8,t.f=u;continue}if(v==1)p=Nm,m=Fm,h=9,g=5;else if(v==2){var S=Lm(e,d,31)+257,C=Lm(e,d+10,15)+4,w=S+Lm(e,d+5,31)+1;d+=14;for(var T=new pm(w),E=new pm(19),D=0;D<C;++D)E[vm[D]]=Lm(e,d+D*3,7);d+=C*3;for(var O=Im(E),k=(1<<O)-1,A=km(E,O,1),D=0;D<w;){var j=A[Lm(e,d,k)];d+=j&15;var y=j>>4;if(y<16)T[D++]=y;else{var M=0,N=0;for(y==16?(N=3+Lm(e,d,3),d+=2,M=T[D-1]):y==17?(N=3+Lm(e,d,7),d+=3):y==18&&(N=11+Lm(e,d,127),d+=7);N--;)T[D++]=M}}var P=T.subarray(0,S),F=T.subarray(S);h=Im(P),g=Im(F),p=km(P,h,1),m=km(F,g,1)}else Hm(1);if(d>_){c&&Hm(0);break}}s&&l(f+131072);for(var I=(1<<h)-1,L=(1<<g)-1,R=d;;R=d){var M=p[Rm(e,d)&I],z=M>>4;if(d+=M&15,d>_){c&&Hm(0);break}if(M||Hm(2),z<256)n[f++]=z;else if(z==256){R=d,p=null;break}else{var ee=z-254;if(z>264){var D=z-257,B=gm[D];ee=Lm(e,d,(1<<B)-1)+xm[D],d+=B}var te=m[Rm(e,d)&L],V=te>>4;te||Hm(3),d+=te&15;var F=wm[V];if(V>3){var B=_m[V];F+=Rm(e,d)&(1<<B)-1,d+=B}if(d>_){c&&Hm(0);break}s&&l(f+131072);var H=f+ee;if(f<F){var ne=a-F,re=Math.min(F,H);for(ne+f<0&&Hm(3);f<re;++f)n[f]=r[ne+f]}for(;f<H;++f)n[f]=n[f-F]}}t.l=p,t.p=R,t.b=f,t.f=u,p&&(u=1,t.m=h,t.d=m,t.n=g)}while(!u);return f!=n.length&&o?Bm(n,0,f):n.subarray(0,f)},Wm=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},Gm=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Km=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var i=n.length,a=n.slice();if(!i)return{t:$m,l:0};if(i==1){var o=new pm(n[0].s+1);return o[n[0].s]=1,{t:o,l:1}}n.sort(function(e,t){return e.f-t.f}),n.push({s:-1,f:25001});var s=n[0],c=n[1],l=0,u=1,d=2;for(n[0]={s:-1,f:s.f+c.f,l:s,r:c};u!=i-1;)s=n[n[l].f<n[d].f?l++:d++],c=n[l!=u&&n[l].f<n[d].f?l++:d++],n[u++]={s:-1,f:s.f+c.f,l:s,r:c};for(var f=a[0].s,r=1;r<i;++r)a[r].s>f&&(f=a[r].s);var p=new mm(f+1),m=qm(n[u-1],p,0);if(m>t){var r=0,h=0,g=m-t,_=1<<g;for(a.sort(function(e,t){return p[t.s]-p[e.s]||e.f-t.f});r<i;++r){var v=a[r].s;if(p[v]>t)h+=_-(1<<m-p[v]),p[v]=t;else break}for(h>>=g;h>0;){var y=a[r].s;p[y]<t?h-=1<<t-p[y]++-1:++r}for(;r>=0&&h;--r){var b=a[r].s;p[b]==t&&(--p[b],++h)}m=t}return{t:new pm(p),l:m}},qm=function(e,t,n){return e.s==-1?Math.max(qm(e.l,t,n+1),qm(e.r,t,n+1)):t[e.s]=n},Jm=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new mm(++t),r=0,i=e[0],a=1,o=function(e){n[r++]=e},s=1;s<=t;++s)if(e[s]==i&&s!=t)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=e[s]}return{c:n.subarray(0,r),n:t}},Ym=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},Xm=function(e,t,n){var r=n.length,i=zm(t+2);e[i]=r&255,e[i+1]=r>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var a=0;a<r;++a)e[i+a+4]=n[a];return(i+4+r)*8},Zm=function(e,t,n,r,i,a,o,s,c,l,u){Wm(t,u++,n),++i[256];for(var d=Km(i,15),f=d.t,p=d.l,m=Km(a,15),h=m.t,g=m.l,_=Jm(f),v=_.c,y=_.n,b=Jm(h),x=b.c,S=b.n,C=new mm(19),w=0;w<v.length;++w)++C[v[w]&31];for(var w=0;w<x.length;++w)++C[x[w]&31];for(var T=Km(C,7),E=T.t,D=T.l,O=19;O>4&&!E[vm[O-1]];--O);var k=l+5<<3,A=Ym(i,Am)+Ym(a,jm)+o,j=Ym(i,f)+Ym(a,h)+o+14+3*O+Ym(C,E)+2*C[16]+3*C[17]+7*C[18];if(c>=0&&k<=A&&k<=j)return Xm(t,u,e.subarray(c,c+l));var M,N,P,F;if(Wm(t,u,1+(j<A)),u+=2,j<A){M=km(f,p,0),N=f,P=km(h,g,0),F=h;var I=km(E,D,0);Wm(t,u,y-257),Wm(t,u+5,S-1),Wm(t,u+10,O-4),u+=14;for(var w=0;w<O;++w)Wm(t,u+3*w,E[vm[w]]);u+=3*O;for(var L=[v,x],R=0;R<2;++R)for(var z=L[R],w=0;w<z.length;++w){var ee=z[w]&31;Wm(t,u,I[ee]),u+=E[ee],ee>15&&(Wm(t,u,z[w]>>5&127),u+=z[w]>>12)}}else M=Mm,N=Am,P=Pm,F=jm;for(var w=0;w<s;++w){var B=r[w];if(B>255){var ee=B>>18&31;Gm(t,u,M[ee+257]),u+=N[ee+257],ee>7&&(Wm(t,u,B>>23&31),u+=gm[ee]);var te=B&31;Gm(t,u,P[te]),u+=F[te],te>3&&(Gm(t,u,B>>5&8191),u+=_m[te])}else Gm(t,u,M[B]),u+=N[B]}return Gm(t,u,M[256]),u+N[256]},Qm=new hm([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),$m=new pm(0),eh=function(e,t,n,r,i,a){var o=a.z||e.length,s=new pm(r+o+5*(1+Math.ceil(o/7e3))+i),c=s.subarray(r,s.length-i),l=a.l,u=(a.r||0)&7;if(t){u&&(c[0]=a.r>>3);for(var d=Qm[t-1],f=d>>13,p=d&8191,m=(1<<n)-1,h=a.p||new mm(32768),g=a.h||new mm(m+1),_=Math.ceil(n/3),v=2*_,y=function(t){return(e[t]^e[t+1]<<_^e[t+2]<<v)&m},b=new hm(25e3),x=new mm(288),S=new mm(32),C=0,w=0,T=a.i||0,E=0,D=a.w||0,O=0;T+2<o;++T){var k=y(T),A=T&32767,j=g[k];if(h[A]=j,g[k]=A,D<=T){var M=o-T;if((C>7e3||E>24576)&&(M>423||!l)){u=Zm(e,c,0,b,x,S,w,E,O,T-O,u),E=C=w=0,O=T;for(var N=0;N<286;++N)x[N]=0;for(var N=0;N<30;++N)S[N]=0}var P=2,F=0,I=p,L=A-j&32767;if(M>2&&k==y(T-L))for(var R=Math.min(f,M)-1,z=Math.min(32767,T),ee=Math.min(258,M);L<=z&&--I&&A!=j;){if(e[T+P]==e[T+P-L]){for(var B=0;B<ee&&e[T+B]==e[T+B-L];++B);if(B>P){if(P=B,F=L,B>R)break;for(var te=Math.min(L,B-2),V=0,N=0;N<te;++N){var H=T-L+N&32767,ne=H-h[H]&32767;ne>V&&(V=ne,j=H)}}}A=j,j=h[A],L+=A-j&32767}if(F){b[E++]=268435456|Sm[P]<<18|Tm[F];var re=Sm[P]&31,ie=Tm[F]&31;w+=gm[re]+_m[ie],++x[257+re],++S[ie],D=T+P,++C}else b[E++]=e[T],++x[e[T]]}}for(T=Math.max(T,D);T<o;++T)b[E++]=e[T],++x[e[T]];u=Zm(e,c,l,b,x,S,w,E,O,T-O,u),l||(a.r=u&7|c[u/8|0]<<3,u-=7,a.h=g,a.p=h,a.i=T,a.w=D)}else{for(var T=a.w||0;T<o+l;T+=65535){var ae=T+65535;ae>=o&&(c[u/8|0]=l,ae=o),u=Xm(c,u+1,e.subarray(T,ae))}a.i=o}return Bm(s,0,r+zm(u)+i)},th=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),nh=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=th[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}},rh=function(e,t,n,r,i){if(!i&&(i={l:1},t.dictionary)){var a=t.dictionary.subarray(-32768),o=new pm(a.length+e.length);o.set(a),o.set(e,a.length),e=o,i.w=a.length}return eh(e,t.level==null?6:t.level,t.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,i)},ih=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},ah=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8},oh=function(e){(e[0]!=31||e[1]!=139||e[2]!=8)&&Hm(6,`invalid gzip data`);var t=e[3],n=10;t&4&&(n+=(e[10]|e[11]<<8)+2);for(var r=(t>>3&1)+(t>>4&1);r>0;r-=!e[n++]);return n+(t&2)},sh=function(e){var t=e.length;return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0};function ch(e,t){return rh(e,t||{},0,0)}function lh(e,t){var n=oh(e);return n+8>e.length&&Hm(6,`invalid gzip data`),Um(e.subarray(n,-8),{i:2},t&&t.out||new pm(sh(e)),t&&t.dictionary)}var uh=function(e,t,n,r){for(var i in e){var a=e[i],o=t+i,s=r;Array.isArray(a)&&(s=ih(r,a[1]),a=a[0]),ArrayBuffer.isView(a)?n[o]=[a,s]:(n[o+=`/`]=[new pm(0),s],uh(a,o,n,r))}},dh=typeof TextEncoder<`u`&&new TextEncoder,fh=typeof TextDecoder<`u`&&new TextDecoder;try{fh.decode($m,{stream:!0})}catch{}function ph(e,t){if(t){for(var n=new pm(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(dh)return dh.encode(e);for(var i=e.length,a=new pm(e.length+(e.length>>1)),o=0,s=function(e){a[o++]=e},r=0;r<i;++r){if(o+5>a.length){var c=new pm(o+8+(i-r<<1));c.set(a),a=c}var l=e.charCodeAt(r);l<128||t?s(l):l<2048?(s(192|l>>6),s(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++r)&1023,s(240|l>>18),s(128|l>>12&63),s(128|l>>6&63),s(128|l&63)):(s(224|l>>12),s(128|l>>6&63),s(128|l&63))}return Bm(a,0,o)}var mh=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&Hm(9),t+=r+4}return t},hh=function(e,t,n,r,i,a,o,s){var c=r.length,l=n.extra,u=s&&s.length,d=mh(l);ah(e,t,o==null?67324752:33639248),t+=4,o!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(a<0&&8),e[t++]=i&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var f=new Date(n.mtime==null?Date.now():n.mtime),p=f.getFullYear()-1980;if((p<0||p>119)&&Hm(10),ah(e,t,p<<25|f.getMonth()+1<<21|f.getDate()<<16|f.getHours()<<11|f.getMinutes()<<5|f.getSeconds()>>1),t+=4,a!=-1&&(ah(e,t,n.crc),ah(e,t+4,a<0?-a-2:a),ah(e,t+8,n.size)),ah(e,t+12,c),ah(e,t+14,d),t+=16,o!=null&&(ah(e,t,u),ah(e,t+6,n.attrs),ah(e,t+10,o),t+=14),e.set(r,t),t+=c,d)for(var m in l){var h=l[m],g=h.length;ah(e,t,+m),ah(e,t+2,g),e.set(h,t+4),t+=4+g}return u&&(e.set(s,t),t+=u),t},gh=function(e,t,n,r,i){ah(e,t,101010256),ah(e,t+8,n),ah(e,t+10,n),ah(e,t+12,r),ah(e,t+16,i)};function _h(e,t){t||={};var n={},r=[];uh(e,``,n,t);var i=0,a=0;for(var o in n){var s=n[o],c=s[0],l=s[1],u=l.level==0?0:8,d=ph(o),f=d.length,p=l.comment,m=p&&ph(p),h=m&&m.length,g=mh(l.extra);f>65535&&Hm(11);var _=u?ch(c,l):c,v=_.length,y=nh();y.p(c),r.push(ih(l,{size:c.length,crc:y.d(),c:_,f:d,m,u:f!=o.length||m&&p.length!=h,o:i,compression:u})),i+=30+f+g+v,a+=76+2*(f+g)+(h||0)+v}for(var b=new pm(a+22),x=i,S=a-i,C=0;C<r.length;++C){var d=r[C];hh(b,d.o,d,d.f,d.u,d.c.length);var w=30+d.f.length+mh(d.extra);b.set(d.c,d.o+w),hh(b,i,d,d.f,d.u,d.c.length,d.o,d.m),i+=16+w+(d.m?d.m.length:0)}return gh(b,i,r.length,S,x),b}var vh={1:`Central Incisor`,2:`Lateral Incisor`,3:`Canine`,4:`First Premolar`,5:`Second Premolar`,6:`First Molar`,7:`Second Molar`,8:`Third Molar`},yh={1:{label:`Upper Right (Q1)`,notationPrefix:`UR`,namePrefix:`Upper Right`},2:{label:`Upper Left (Q2)`,notationPrefix:`UL`,namePrefix:`Upper Left`},3:{label:`Lower Left (Q3)`,notationPrefix:`LL`,namePrefix:`Lower Left`},4:{label:`Lower Right (Q4)`,notationPrefix:`LR`,namePrefix:`Lower Right`}};function bh(e,t,n){let r=(n?n.maxX-n.minX:0)>30,i=n&&r?(n.minX+n.maxX)/2:t?1.97:1.25,a=n&&r?n.minZ:t?-12:-10,o=r?a-2:-12,s=e.x>i,c=Math.atan2(e.x-i,Math.max(.1,e.z-o)),l=Math.abs(c),u=1;u=t?l<.12?1:l<.24?2:l<.38?3:l<.5?4:l<.72?5:l<1.05?6:l<1.38?7:8:l<.1?1:l<.22?2:l<.35?3:l<.48?4:l<.65?5:l<1.15?6:l<1.4?7:8;let d=t?s?2:1:s?3:4,f=d*10+u,p=yh[d],m=vh[u];return{fdi:f,badge:`#${f}`,notation:`${p.notationPrefix}${u}`,quadrantLabel:p.label,fullName:`${p.namePrefix} ${m}`,arch:t?`Upper`:`Lower`,isUpper:t,position:u,quadrant:d}}function xh(e,t){let n=e.getAttribute(`position`);if(!n)return{};let r=n.count;if(r===0)return{};let i=1/0,a=-1/0,o=1/0,s=-1/0,c=1/0,l=-1/0,u=Math.max(1,Math.floor(r/5e4));for(let e=0;e<r;e+=u*4){let t=n.getX(e),r=n.getY(e),u=n.getZ(e);t<i&&(i=t),t>a&&(a=t),r<c&&(c=r),r>l&&(l=r),u<o&&(o=u),u>s&&(s=u)}let d=a-i>30,f=d?{minX:i,maxX:a,minZ:o,maxZ:s}:void 0,p=l-c,m=t?c+p*.45:l-p*.45,h=new Map;for(let e=0;e<r;e+=u){let r=n.getX(e),i=n.getY(e),a=n.getZ(e);if(d&&p>5&&(t?i>m:i<m))continue;let o=bh({x:r,y:i,z:a},t,f);h.has(o.fdi)||h.set(o.fdi,{count:0,xSum:0,ySum:0,zSum:0});let s=h.get(o.fdi);s.count++,s.xSum+=r,s.ySum+=i,s.zSum+=a}let g={};for(let[e,t]of h.entries()){let n=e%10==8,i=r<30?1:n?150:30;t.count>=i&&(g[e]=[t.xSum/t.count,t.ySum/t.count,t.zSum/t.count])}return g}function Sh(e,t){let n={};for(let[r,i]of Object.entries(e)){let e=Number(r),a=t[e];if(a){let t=a[0]-i[0],r=a[1]-i[1],o=a[2]-i[2];n[e]=Math.hypot(t,r,o)}else n[e]=0}return n}var Ch=[{fdi:18,sidePrefix:`(R)`,name:`Third Molar`},{fdi:17,sidePrefix:`(R)`,name:`Second Molar`},{fdi:16,sidePrefix:`(R)`,name:`First Molar`},{fdi:15,sidePrefix:`(R)`,name:`Second Premolar`},{fdi:14,sidePrefix:`(R)`,name:`First Premolar`},{fdi:13,sidePrefix:`(R)`,name:`Canine`},{fdi:12,sidePrefix:`(R)`,name:`Lateral Incisor`},{fdi:11,sidePrefix:`(R)`,name:`Central Incisor`},{fdi:21,sidePrefix:`(L)`,name:`Central Incisor`},{fdi:22,sidePrefix:`(L)`,name:`Lateral Incisor`},{fdi:23,sidePrefix:`(L)`,name:`Canine`},{fdi:24,sidePrefix:`(L)`,name:`First Premolar`},{fdi:25,sidePrefix:`(L)`,name:`Second Premolar`},{fdi:26,sidePrefix:`(L)`,name:`First Molar`},{fdi:27,sidePrefix:`(L)`,name:`Second Molar`},{fdi:28,sidePrefix:`(L)`,name:`Third Molar`}],wh=[{fdi:38,sidePrefix:`(L)`,name:`Third Molar`},{fdi:37,sidePrefix:`(L)`,name:`Second Molar`},{fdi:36,sidePrefix:`(L)`,name:`First Molar`},{fdi:35,sidePrefix:`(L)`,name:`Second Premolar`},{fdi:34,sidePrefix:`(L)`,name:`First Premolar`},{fdi:33,sidePrefix:`(L)`,name:`Canine`},{fdi:32,sidePrefix:`(L)`,name:`Lateral Incisor`},{fdi:31,sidePrefix:`(L)`,name:`Central Incisor`},{fdi:41,sidePrefix:`(R)`,name:`Central Incisor`},{fdi:42,sidePrefix:`(R)`,name:`Lateral Incisor`},{fdi:43,sidePrefix:`(R)`,name:`Canine`},{fdi:44,sidePrefix:`(R)`,name:`First Premolar`},{fdi:45,sidePrefix:`(R)`,name:`Second Premolar`},{fdi:46,sidePrefix:`(R)`,name:`First Molar`},{fdi:47,sidePrefix:`(R)`,name:`Second Molar`},{fdi:48,sidePrefix:`(R)`,name:`Third Molar`}];function Th(e,t){return(e?Ch:wh).map(n=>{let r=t?.[n.fdi]??0;return{fdi:n.fdi,sidePrefix:n.sidePrefix,toothName:n.name,fullLabel:`${n.sidePrefix} ${n.name}`,isUpper:e,displacementMm:r}})}var Eh=[{contact:`18-17`,toothA:18,toothB:17,label:`18 - 17 (UR8 - UR7)`,arch:`upper`},{contact:`17-16`,toothA:17,toothB:16,label:`17 - 16 (UR7 - UR6)`,arch:`upper`},{contact:`16-15`,toothA:16,toothB:15,label:`16 - 15 (UR6 - UR5)`,arch:`upper`},{contact:`15-14`,toothA:15,toothB:14,label:`15 - 14 (UR5 - UR4)`,arch:`upper`},{contact:`14-13`,toothA:14,toothB:13,label:`14 - 13 (UR4 - UR3)`,arch:`upper`},{contact:`13-12`,toothA:13,toothB:12,label:`13 - 12 (UR3 - UR2)`,arch:`upper`},{contact:`12-11`,toothA:12,toothB:11,label:`12 - 11 (UR2 - UR1)`,arch:`upper`},{contact:`11-21`,toothA:11,toothB:21,label:`11 - 21 (UR1 - UL1 / Midline)`,arch:`upper`},{contact:`21-22`,toothA:21,toothB:22,label:`21 - 22 (UL1 - UL2)`,arch:`upper`},{contact:`22-23`,toothA:22,toothB:23,label:`22 - 23 (UL2 - UL3)`,arch:`upper`},{contact:`23-24`,toothA:23,toothB:24,label:`23 - 24 (UL3 - UL4)`,arch:`upper`},{contact:`24-25`,toothA:24,toothB:25,label:`24 - 25 (UL4 - UL5)`,arch:`upper`},{contact:`25-26`,toothA:25,toothB:26,label:`25 - 26 (UL5 - UL6)`,arch:`upper`},{contact:`26-27`,toothA:26,toothB:27,label:`26 - 27 (UL6 - UL7)`,arch:`upper`},{contact:`27-28`,toothA:27,toothB:28,label:`27 - 28 (UL7 - UL8)`,arch:`upper`}],Dh=[{contact:`48-47`,toothA:48,toothB:47,label:`48 - 47 (LR8 - LR7)`,arch:`lower`},{contact:`47-46`,toothA:47,toothB:46,label:`47 - 46 (LR7 - LR6)`,arch:`lower`},{contact:`46-45`,toothA:46,toothB:45,label:`46 - 45 (LR6 - LR5)`,arch:`lower`},{contact:`45-44`,toothA:45,toothB:44,label:`45 - 44 (LR5 - LR4)`,arch:`lower`},{contact:`44-43`,toothA:44,toothB:43,label:`44 - 43 (LR4 - LR3)`,arch:`lower`},{contact:`43-42`,toothA:43,toothB:42,label:`43 - 42 (LR3 - LR2)`,arch:`lower`},{contact:`42-41`,toothA:42,toothB:41,label:`42 - 41 (LR2 - LR1)`,arch:`lower`},{contact:`41-31`,toothA:41,toothB:31,label:`41 - 31 (LR1 - LL1 / Midline)`,arch:`lower`},{contact:`31-32`,toothA:31,toothB:32,label:`31 - 32 (LL1 - LL2)`,arch:`lower`},{contact:`32-33`,toothA:32,toothB:33,label:`32 - 33 (LL2 - LL3)`,arch:`lower`},{contact:`33-34`,toothA:33,toothB:34,label:`33 - 34 (LL3 - LL4)`,arch:`lower`},{contact:`34-35`,toothA:34,toothB:35,label:`34 - 35 (LL4 - LL5)`,arch:`lower`},{contact:`35-36`,toothA:35,toothB:36,label:`35 - 36 (LL5 - LL6)`,arch:`lower`},{contact:`36-37`,toothA:36,toothB:37,label:`36 - 37 (LL6 - LL7)`,arch:`lower`},{contact:`37-38`,toothA:37,toothB:38,label:`37 - 38 (LL7 - LL8)`,arch:`lower`}];[...Eh,...Dh];function Oh(e,t,n,r){let i=e<30?n:r,a=i?.[e],o=i?.[t];return a&&o?[(a[0]+o[0])/2,(a[1]+o[1])/2,(a[2]+o[2])/2]:a?[a[0],a[1],a[2]]:o?[o[0],o[1],o[2]]:null}function kh(e){if(e&&e.byteLength>=2){let t=new Uint8Array(e);if(t[0]===31&&t[1]===139)try{let e=lh(t);return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}catch(e){console.warn(`Gzip decompression error, using raw buffer:`,e)}}return e}var Ah=!(typeof process<`u`&&{}.VITEST===`true`||typeof window<`u`&&`__VITEST__`in window)&&typeof window<`u`&&typeof indexedDB<`u`?am(`dental-models-db-v4`,`glb-cache`):null,jh=null,Mh=new Map,Nh=0;function Ph(){Mh.clear(),Nh=0,jh&&jh(0,0,0)}async function Fh(e,t){if(e){for(let n of Array.from(Yh.keys()))n.includes(e)&&(!t||!n.includes(`v=${t}`))&&(Yh.delete(n),Xh.delete(n));if(Ah)try{let n=await fm(Ah),r=[];for(let i of n)typeof i==`string`&&i.includes(e)&&(!t||!i.includes(`v=${t}`))&&r.push(i);r.length>0&&await um(r,Ah)}catch(e){console.warn(`Could not purge stale IndexedDB entries:`,e)}}}function Ih(e,t,n,r=!1){Mh.set(e,{loaded:t,total:n,completed:r});let i=0,a=0;for(let e of Mh.values())i+=e.loaded,a+=e.total;if(a>0){let e=Math.round(i/a*100),t=Math.min(100,Math.max(Nh,e));Nh=t,jh&&jh(i,a,t)}else jh&&jh(i,a,0)}function Lh(e){jh=e}var Rh=new Td,zh=null,Bh=null,Vh=null,Hh=null;function Uh(){return{upperStageNum:Vh,lowerStageNum:Hh}}async function Wh(e,t){let n=typeof e==`string`?e:e&&typeof e==`object`&&`url`in e?e.url:null;if(!n)return null;let r=decodeURIComponent(n),i=r.match(/(?:lower|mandib|upper|maxill)[\s_.-]*(?:jaw[\s_.-]*)?0*([1-9]\d*)/i)||r.match(/0*([1-9]\d*)[\s_.-]*(?:lower|mandib|upper|maxill)/i)||r.match(/(?:jaw|model)[\s_.-]*0*([1-9]\d*)/i)||r.match(/0*([1-9]\d*)[\s_.-]*(?:model|glb|stl)/i);if(!i||!i[1])return null;let a=parseInt(i[1],10);for(let e=a-1;e>=1;e--){let i=String(e).padStart(2,`0`),a=r;/(?:jaw|model|upper|lower|maxill|mandib)[\s_.-]*-[\s_.-]*0*[1-9]\d*/i.test(r)?a=r.replace(/((?:jaw|model|upper|lower|maxill|mandib)[\s_.-]*-[\s_.-]*)0*[1-9]\d*/i,`$1${i}`):/0*[1-9]\d*([\s_.-]*-[\s_.-]*(?:model|glb|stl))/i.test(r)&&(a=r.replace(/0*[1-9]\d*([\s_.-]*-[\s_.-]*(?:model|glb|stl))/i,`${i}$1`));let o=[a,encodeURI(a)];for(let r of o)try{let i=await ag(r,t);if(i.ok)return Jh(i.buffer)&&(Xh.set(n,i.buffer),Xh.set(r,i.buffer)),{buffer:i.buffer,stageNum:e}}catch{}}return null}async function Gh(e,t,n){if(!e&&!t)return{ok:!1,reason:`Stage must contain at least an Upper or Lower model.`};try{Ph();let[r,i]=await Promise.all([e?qh(e,`Upper jaw`,n):Promise.resolve(null),t?qh(t,`Lower jaw`,n):Promise.resolve(null)]),a=r&&r.ok?r.buffer:null,o=i&&i.ok?i.buffer:null;if(e&&r&&!r.ok){if(zh)console.info(`Upper jaw model held at stage ${Vh??`final`}.`),a=zh,typeof e==`object`&&`url`in e&&e.url&&Xh.set(e.url,zh);else{let t=await Wh(e,n);if(t)console.info(`Upper jaw model not found for this stage (holding upper arch at stage ${t.stageNum}).`),a=t.buffer,zh=t.buffer,Vh=t.stageNum,typeof e==`object`&&`url`in e&&e.url&&Xh.set(e.url,t.buffer);else if(!(i&&i.ok))return{ok:!1,reason:`Upper jaw: ${r.reason}`}}}if(t&&i&&!i.ok){if(Bh)console.info(`Lower jaw model held at stage ${Hh??`final`}.`),o=Bh,typeof t==`object`&&`url`in t&&t.url&&Xh.set(t.url,Bh);else{let e=await Wh(t,n);if(e)console.info(`Lower jaw model not found for this stage (holding lower arch at stage ${e.stageNum}).`),o=e.buffer,Bh=e.buffer,Hh=e.stageNum,typeof t==`object`&&`url`in t&&t.url&&Xh.set(t.url,e.buffer);else if(!(r&&r.ok))return{ok:!1,reason:`Lower jaw: ${i.reason}`}}}return a&&(zh=a),o&&(Bh=o),{ok:!0,models:{upperStl:a,lowerStl:o}}}catch(e){return e instanceof Error&&e.name===`AbortError`?{ok:!1,reason:`Load cancelled`}:{ok:!1,reason:e instanceof Error?e.message:String(e)}}}function Kh(e,t){e&&qh(e,`Upper jaw (prefetch)`),t&&qh(t,`Lower jaw (prefetch)`)}async function qh(e,t,n){if(n?.aborted)return{ok:!1,reason:`Load cancelled`};if(e instanceof Blob)try{return{ok:!0,buffer:kh(await e.arrayBuffer())}}catch(e){return{ok:!1,reason:`Could not read ${t} file: ${e instanceof Error?e.message:String(e)}`}}if(e instanceof ArrayBuffer)return{ok:!0,buffer:kh(e)};if(e instanceof Uint8Array)return{ok:!0,buffer:kh(e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength))};if(typeof e==`object`&&e&&`filename`in e){if(e.buffer){let t=e.buffer;if(t instanceof ArrayBuffer)return{ok:!0,buffer:kh(t)};if(t instanceof Uint8Array)return{ok:!0,buffer:kh(t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength))}}return e.file?qh(e.file,t,n):e.url?ag(e.url,n):{ok:!1,reason:`No file or URL provided for ${t} ("${e.filename}")`}}return typeof e==`string`?ag(e,n):{ok:!1,reason:`Invalid source specified for ${t}`}}function Jh(e){if(e.byteLength<4)return!1;if(new DataView(e).getUint32(0,!0)===1179937895)return!0;if(e.byteLength>=2){let t=new Uint8Array(e);if(t[0]===31&&t[1]===139)try{let e=lh(t);if(e.byteLength>=4)return new DataView(e.buffer,e.byteOffset,e.byteLength).getUint32(0,!0)===1179937895}catch{return!1}}return!1}var Yh=new Map,Xh=new Map,Zh=new Map;function Qh(e){eg(e),e.getAttribute(`normal`)||e.computeVertexNormals(),e.computeBoundingBox(),e.computeBoundingSphere();let t=e.getAttribute(`color`);if(!t)return;let n=t.array,r=e.getAttribute(`position`),i=e.getAttribute(`normal`),a=t.count,o=1/0,s=-1/0,c=1/0,l=-1/0,u=1/0,d=-1/0,f=0,p=0,m=0,h=0;for(let e=0;e<a;e++){let t=e*3,i=n[t],a=n[t+1],g=n[t+2],_=r?r.getY(e):0;if(!(i>.75&&a>.16&&a<.55&&g<.18||i>.85&&a>.35&&a<.72&&g<.28)&&(i>.35&&i-a>.08||i>.4&&a<.35&&g<.35?(m+=_,h++):(f+=_,p++),r)){let t=r.getX(e),n=r.getZ(e);t<o&&(o=t),t>s&&(s=t),_<c&&(c=_),_>l&&(l=_),n<u&&(u=n),n>d&&(d=n)}}let g=h>0&&p>0&&f/p<m/h,_=(o+s)/2,v=u-12,y=Math.max(1,l-c),b=.76,x=.71,S=.63,C=.5,w=.09,T=.12;for(let e=0;e<a;e++){let t=e*3,a=n[t],o=n[t+1],s=n[t+2];if(!(a>.75&&o>.16&&o<.55&&s<.18||a>.85&&o>.35&&o<.72&&s<.28)){if(o>.3&&o>a*1.2){n[t]=C,n[t+1]=w,n[t+2]=T;continue}if(a>.35&&a-o>.08||a>.4&&o<.35&&s<.35){n[t]=C,n[t+1]=w,n[t+2]=T;continue}if(r&&i){let a=r.getX(e),o=r.getY(e),s=r.getZ(e),u=i.getX(e),d=i.getY(e),f=i.getZ(e),p=a-_,m=s-v,h=Math.sqrt(p*p+m*m)||1,C=p/h,w=u*-(m/h)+f*C,T=Math.abs(w),E=Math.abs(Math.atan2(p,m)),D=g?Math.max(0,Math.min(1,(o-c)/(y*.55))):Math.max(0,Math.min(1,(l-o)/(y*.55))),O,k,A;if(D<.45){let e=D/.45;O=.82+-.05999999999999994*e,k=.79+-.08000000000000007*e,A=.72+-.08999999999999997*e}else{let e=(D-.45)/.55;O=b+-.07999999999999996*e,k=x+-.09999999999999998*e,A=S+-.13*e}let j=Math.max(0,Math.min(1,(T-.38)*2.2));if(E>.28&&D<.45){let e=1-Math.abs(d);if(e>.2){let t=Math.max(0,Math.min(1,(e-.2)*1.8));j=Math.max(j,t*.85)}}j>0&&(O+=(.46-O)*(j*.65),k+=(.4-k)*(j*.65),A+=(.32-A)*(j*.65)),n[t]=O,n[t+1]=k,n[t+2]=A}else n[t]=b,n[t+1]=x,n[t+2]=S}}t.needsUpdate=!0}function $h(e){let t=e.getAttribute(`position`);if(!t)return;let n=t.count;if(n===0)return;e.getAttribute(`normal`)||e.computeVertexNormals();let r=e.getAttribute(`normal`),i=e.getAttribute(`color`);if(!i||i.count!==n){let t=new Float32Array(n*3);e.setAttribute(`color`,new dr(t,3)),i=e.getAttribute(`color`)}let a=i.array;for(let e=0;e<n;e++){let t=e*3,n=1;if(r){let t=r.getZ(e),i=r.getY(e);n=.9+.14*Math.max(0,t)+.06*Math.max(0,i)}a[t]=Math.min(1,.88*n),a[t+1]=Math.min(1,.3*n),a[t+2]=Math.min(1,.04*n)}i.needsUpdate=!0}function eg(e){let t=e.getAttribute(`color`);if(!t||!t.isInterleavedBufferAttribute&&t.array instanceof Float32Array&&!t.normalized&&t.itemSize===3&&t.gpuType===void 0)return;let n=t.count,r=new Float32Array(n*3);for(let e=0;e<n;e++){let n=t.getX(e),i=t.getY(e),a=t.getZ(e);!t.normalized&&(n>1||i>1||a>1)&&(n/=255,i/=255,a/=255);let o=e*3;r[o]=Math.max(0,Math.min(1,n)),r[o+1]=Math.max(0,Math.min(1,i)),r[o+2]=Math.max(0,Math.min(1,a))}let i=new dr(r,3,!1);e.setAttribute(`color`,i)}function tg(e,t){let n=e.clone(),r=t.clone(),i=!!n.getIndex(),a=!!r.getIndex(),o=n,s=r;i!==a&&(o=o.toNonIndexed(),s=s.toNonIndexed()),o.getAttribute(`normal`)||o.computeVertexNormals(),s.getAttribute(`normal`)||s.computeVertexNormals(),eg(o),eg(s);let c=o.getAttribute(`color`),l=s.getAttribute(`color`);if(c&&!l){let e=s.getAttribute(`position`)?.count||0,t=new Float32Array(e*3);for(let n=0;n<e;n++)t[n*3]=.82,t[n*3+1]=.76,t[n*3+2]=.68;s.setAttribute(`color`,new dr(t,3,!1))}else if(!c&&l){let e=o.getAttribute(`position`)?.count||0,t=new Float32Array(e*3);for(let n=0;n<e;n++)t[n*3]=.82,t[n*3+1]=.76,t[n*3+2]=.68;o.setAttribute(`color`,new dr(t,3,!1))}for(let e of Object.keys(o.attributes))e!==`position`&&e!==`normal`&&e!==`color`&&o.deleteAttribute(e);for(let e of Object.keys(s.attributes))e!==`position`&&e!==`normal`&&e!==`color`&&s.deleteAttribute(e);return Qf([o,s],!1)||o}function ng(e){let t=e.getAttribute(`position`);if(!t)return e;let n=e.getIndex(),r=n?n.count/3:t.count/3,i=1/0,a=-1/0;for(let e=0;e<t.count;e++){let n=t.getY(e);n<i&&(i=n),n>a&&(a=n)}let o=[],s=!1;for(let e=0;e<r;e++){let r=n?n.getX(e*3):e*3,c=n?n.getX(e*3+1):e*3+1,l=n?n.getX(e*3+2):e*3+2,u=t.getX(r),d=t.getY(r),f=t.getZ(r),p=t.getX(c),m=t.getY(c),h=t.getZ(c),g=t.getX(l),_=t.getY(l),v=t.getZ(l),y=(d+m+_)/3,b=y-i<3.5||a-y<3.5,x=p-u,S=m-d,C=h-f,w=g-u,T=_-d,E=v-f,D=S*E-C*T,O=C*w-x*E,k=x*T-S*w,A=Math.hypot(D,O,k),j=A>1e-8&&Math.abs(O)/A>.72;if(b&&j||Math.abs(d-m)<.8&&Math.abs(m-_)<.8&&Math.abs(_-d)<.8){o.push(r,c,l);continue}let M=Math.hypot(u-p,d-m,f-h),N=Math.hypot(p-g,m-_,h-v),P=Math.hypot(g-u,_-d,v-f),F=Math.max(M,N,P),I=(u+p+g)/3,L=(f+h+v)/3;if(F>35||F>12&&Math.abs(I)<8&&L>-6&&L<16){s=!0;continue}o.push(r,c,l)}if(!s)return e;let c=e.clone();return c.setIndex(o),c.groups&&c.groups.length>0&&c.clearGroups(),c.computeVertexNormals(),e.userData?.baseColors&&(c.userData.baseColors=e.userData.baseColors.clone()),c}function rg(e,t){let n=ng(e);return n=jd(n,t),n.getAttribute(`color`)&&(n.userData.baseColors=n.getAttribute(`color`).clone()),n.computeVertexNormals(),n.computeBoundingBox(),n.computeBoundingSphere(),n}async function ig(e){let t=kh(e),n=await new ip().parseAsync(t,``),r=[],i=[];if(n.scene.updateMatrixWorld(!0),n.scene.traverse(e=>{if(e.isMesh){let t=e,n=t.geometry.clone();n.applyMatrix4(t.matrixWorld),eg(n),(e.name||``).toLowerCase().includes(`attachment`)?i.push(n):r.push(n)}}),r.length===0&&i.length===0)return null;if(r.forEach(eg),i.forEach(eg),i.length>0){let e=r.length===1?r[0]:Qf(r,!1)||r[0],t=i.length===1?i[0]:Qf(i,!1)||i[0];if(!e.getAttribute(`color`)){let t=e.getAttribute(`position`);if(t){let n=t.count,r=new Float32Array(n*3);for(let e=0;e<n;e++)r[e*3]=.76,r[e*3+1]=.71,r[e*3+2]=.63;e.setAttribute(`color`,new dr(r,3))}}Qh(e),$h(t);let n=tg(e,t);return n.getAttribute(`color`)&&(n.userData.baseColors=n.getAttribute(`color`).clone()),e.getAttribute(`color`)&&(e.userData.baseColors=e.getAttribute(`color`).clone()),{full:n,noAttachments:e,hasAttachments:!0}}let a=r.length===1?r[0]:Qf(r,!1)||r[0];Qh(a);let o=a;return o.getAttribute(`color`)&&(o.userData.baseColors=o.getAttribute(`color`).clone()),{full:o,noAttachments:o,hasAttachments:!1}}async function ag(e,t){if(t?.aborted){let e=Error(`The operation was aborted`);throw e.name=`AbortError`,e}let n=Yh.get(e);if(n)return{ok:!0,buffer:n};let r=Zh.get(e);if(r)return r;let i=(async()=>{if(Ah)try{let t=await cm(e,Ah);if(t&&t.byteLength>0){let n=kh(t);return Yh.set(e,n),Jh(n)&&Xh.set(e,n),Ih(e,t.byteLength,t.byteLength,!0),{ok:!0,buffer:n}}}catch{}try{let n=await fetch(e,{signal:t});if(!n.ok)return{ok:!1,reason:`HTTP ${n.status} fetching "${e}"`};let r,i=n.headers?.get?n.headers.get(`content-length`):null,a=i?parseInt(i,10):0;if(n.body&&typeof n.body.getReader==`function`&&a>0){let t=n.body.getReader(),i=[],o=0;for(;;){let{done:n,value:r}=await t.read();if(n)break;r&&(i.push(r),o+=r.length,Ih(e,o,a,!1))}Ih(e,o,a,!0);let s=new Uint8Array(o),c=0;for(let e of i)s.set(e,c),c+=e.length;r=s.buffer}else try{r=await n.arrayBuffer(),Ih(e,r.byteLength,a||r.byteLength,!0)}catch(e){if(e&&(e.name===`AbortError`||String(e).includes(`aborted`)))return{ok:!1,reason:`Fetch aborted`};throw e}Ah&&lm(e,r,Ah).catch(async e=>{if(e&&(e.name===`QuotaExceededError`||e.code===22))try{let e=await fm(Ah);e.length>10&&await um(e.slice(0,10),Ah)}catch{}});let o=kh(r);return Jh(o)&&Xh.set(e,o),Yh.set(e,o),{ok:!0,buffer:o}}catch(t){if(t instanceof Error&&t.name===`AbortError`)throw t;return{ok:!1,reason:`Network error fetching "${e}": ${t instanceof Error?t.message:String(t)}`}}finally{Zh.delete(e)}})();return Zh.set(e,i),i}var og=new Map,sg=new Map;function cg(e){return og.get(e)}function lg(e){return og.has(e)}var ug=null,dg=0;function fg(e){ug=e}function pg(){return og.size}function mg(){for(let e of og.values()){try{e.upper?.dispose()}catch{}try{e.upperNoAttachments?.dispose()}catch{}try{e.lower?.dispose()}catch{}try{e.lowerNoAttachments?.dispose()}catch{}}og.clear(),sg.clear(),_g=null,gg=[],Xh.clear(),Ph(),zh=null,Bh=null,Vh=null,Hh=null}async function hg(e,t){let n=og.get(e.id);if(n)return{ok:!0,geometries:n};let r=sg.get(e.id);if(r)return r;let i=(async()=>{try{let n=await Gh(e.upper,e.lower,t);if(!n.ok)return n;let r=e=>{if(e){if(typeof e==`object`&&e&&`url`in e&&e.url)return Xh.get(e.url);if(typeof e==`string`)return Xh.get(e)}},i=null,a=null,o=!1;if(e.upper&&n.models.upperStl){let t=r(e.upper);if(t){let e=await ig(t);e&&(i=e.full,a=e.noAttachments,o=e.hasAttachments)}if(!i){if(Jh(n.models.upperStl)){let e=await ig(n.models.upperStl);e&&(i=e.full,a=e.noAttachments,o=e.hasAttachments)}else{let t=Rh.parse(n.models.upperStl);t&&(i=t,i.computeVertexNormals(),i.getAttribute(`color`)||Md(i,e.upper.filename||`${e.label} - Upper`),Qh(i),i.getAttribute(`color`)&&(i.userData.baseColors=i.getAttribute(`color`).clone()),o=!1,a=i)}}i&&(i=rg(i,!0),a=a&&a!==i?rg(a,!0):i)}let s=null,c=null,l=!1;if(e.lower&&n.models.lowerStl){let t=r(e.lower);if(t){let e=await ig(t);e&&(s=e.full,c=e.noAttachments,l=e.hasAttachments)}if(!s){if(Jh(n.models.lowerStl)){let e=await ig(n.models.lowerStl);e&&(s=e.full,c=e.noAttachments,l=e.hasAttachments)}else{let t=Rh.parse(n.models.lowerStl);t&&(s=t,s.computeVertexNormals(),s.getAttribute(`color`)||Md(s,e.lower.filename||`${e.label} - Lower`),Qh(s),s.getAttribute(`color`)&&(s.userData.baseColors=s.getAttribute(`color`).clone()),l=!1,c=s)}}s&&(s=rg(s,!1),c=c&&c!==s?rg(c,!1):s)}if(!i&&!s)return{ok:!1,reason:`Could not parse geometry for either arch in this stage.`};let u=i?xh(i,!0):{},d=s?xh(s,!1):{},f={upper:i,lower:s,upperNoAttachments:a,lowerNoAttachments:c,hasAttachments:o||l,upperCentroids:u,lowerCentroids:d};return og.set(e.id,f),ug&&ug(e.id,og.size,dg),{ok:!0,geometries:f}}catch(e){return{ok:!1,reason:e instanceof Error?e.message:String(e)}}finally{sg.delete(e.id)}})();return sg.set(e.id,i),i}var gg=[],_g=null;function vg(e){if(og.has(e))return;let t=gg.find(t=>t.id===e);t&&hg(t)}function yg(e){for(let t=0;t<e.length;t++){let n=e[t];n&&vg(n)}}async function bg(e,t=12){if(e&&e.length!==0)return gg=e,dg=e.length,_g||(_g=(async()=>{try{let n=0,r=Math.min(t,e.length),i=Array.from({length:r},async()=>{for(;n<e.length;){let t=e[n++];if(t&&!og.has(t.id))try{await hg(t)}catch(e){console.warn(`Prewarm error on stage ${t.id}:`,e)}}});await Promise.allSettled(i)}finally{_g=null}})(),_g)}var xg=.6,Sg=160;function Cg(e,t){let n=e.getAttribute(`position`),r=t.getAttribute(`position`);if(!n||!r)return{heavyCount:0,mediumCount:0,lightCount:0};let i=new Float32Array(25600).fill(999),a=n.count;for(let e=0;e<a;e++){let t=n.getX(e),r=n.getY(e),a=n.getZ(e),o=Math.floor((t- -40)/xg),s=Math.floor((a- -25)/xg);if(o>=0&&o<Sg&&s>=0&&s<Sg){let e=s*Sg+o;r<i[e]&&(i[e]=r)}}let o=t.getAttribute(`color`);!t.userData.baseColors&&o&&(t.userData.baseColors=o.clone());let s=t.userData.baseColors||o,c=r.count,l=new Float32Array(c*3),u=.91,d=.88,f=.84;if(s&&s.count===c)for(let e=0;e<c*3;e++)l[e]=s.array[e];else for(let e=0;e<c;e++)l[e*3]=u,l[e*3+1]=d,l[e*3+2]=f;let p=0,m=0,h=0;for(let e=0;e<c;e++){let t=r.getX(e),n=r.getY(e),a=r.getZ(e),o=Math.floor((t- -40)/xg),s=Math.floor((a- -25)/xg);if(o>=0&&o<Sg&&s>=0&&s<Sg){let t=i[s*Sg+o];if(t<900){let r=Math.abs(t-n),i=e*3;r<=.25?(l[i]=.94,l[i+1]=.22,l[i+2]=.22,p++):r<=.6?(l[i]=.96,l[i+1]=.65,l[i+2]=.08,m++):r<=1&&(l[i]=.12,l[i+1]=.76,l[i+2]=.52,h++)}}}t.setAttribute(`color`,new dr(l,3)),t.attributes.color.needsUpdate=!0;let g=new Float32Array(25600).fill(-999);for(let e=0;e<c;e++){let t=r.getX(e),n=r.getY(e),i=r.getZ(e),a=Math.floor((t- -40)/xg),o=Math.floor((i- -25)/xg);if(a>=0&&a<Sg&&o>=0&&o<Sg){let e=o*Sg+a;n>g[e]&&(g[e]=n)}}let _=e.getAttribute(`color`);!e.userData.baseColors&&_&&(e.userData.baseColors=_.clone());let v=e.userData.baseColors||_,y=new Float32Array(a*3);if(v&&v.count===a)for(let e=0;e<a*3;e++)y[e]=v.array[e];else for(let e=0;e<a;e++)y[e*3]=u,y[e*3+1]=d,y[e*3+2]=f;for(let e=0;e<a;e++){let t=n.getX(e),r=n.getY(e),i=n.getZ(e),a=Math.floor((t- -40)/xg),o=Math.floor((i- -25)/xg);if(a>=0&&a<Sg&&o>=0&&o<Sg){let t=g[o*Sg+a];if(t>-900){let n=Math.abs(r-t),i=e*3;n<=.25?(y[i]=.94,y[i+1]=.22,y[i+2]=.22):n<=.6?(y[i]=.96,y[i+1]=.65,y[i+2]=.08):n<=1&&(y[i]=.12,y[i+1]=.76,y[i+2]=.52)}}}return e.setAttribute(`color`,new dr(y,3)),e.attributes.color.needsUpdate=!0,{heavyCount:p,mediumCount:m,lightCount:h}}function wg(e,t){if(e){let t=e.userData.baseColors;t instanceof dr&&(e.setAttribute(`color`,t.clone()),e.attributes.color.needsUpdate=!0)}if(t){let e=t.userData.baseColors;e instanceof dr&&(t.setAttribute(`color`,e.clone()),t.attributes.color.needsUpdate=!0)}}function Tg(e,t,n){return(e>1||t>1||n>1)&&(e/=255,t/=255,n/=255),!(e>.75&&t>.16&&t<.55&&n<.18||e>.85&&t>.35&&t<.72&&n<.28)&&(e>.35&&e-t>.08||e>.4&&t<.35&&n<.35)}function Eg(e,t){let n=new Y(0,t?-1:1,0),r=e.tiltX*Math.PI/180,i=e.tiltY*Math.PI/180,a=n.clone();return a.applyAxisAngle(new Y(1,0,0),r),a.applyAxisAngle(new Y(0,0,1),i),a.normalize()}function Dg(e,t,n,r,i,a,o,s,c,l,u){let d=new Y(0,i?-1:1,0),f=(a+o)*.5,p=l-12,m=new Float32Array(48),h=new Float32Array(48),g=new Float32Array(48),_=new Uint8Array(48);h.fill(i?1/0:-1/0);let v=Math.max(1,Math.floor(e.count/12e3));for(let t=0;t<e.count;t+=v){if(r&&n[t]===1)continue;let a=e.getX(t),o=e.getY(t),s=e.getZ(t),c=Math.atan2(a-f,s-p),l=Math.max(0,Math.min(47,Math.floor((c+1.15)/2.3*48)));(i?o<h[l]:o>h[l])&&(h[l]=o,m[l]=a,g[l]=s,_[l]=1)}let y=0,b=0,x=0,S=0;for(let e=0;e<48;e++)_[e]===1&&(b+=m[e],x+=h[e],S+=g[e],y++);let C=d.clone();if(y>=8){let e=b/y,t=x/y,n=S/y,r=0,a=0,o=0,s=0,c=0;for(let i=0;i<48;i++)if(_[i]===1){let l=m[i]-e,u=h[i]-t,d=g[i]-n;r+=l*l,a+=d*d,o+=l*d,s+=l*u,c+=d*u}let l=r*a-o*o;if(Math.abs(l)>=1e-4){let e=(s*a-c*o)/l,t=(r*c-o*s)/l,n=i?-1:1;C=new Y(-e*n,n,-t*n).normalize()}}let w=c-s,T=Math.max(1,Math.floor(e.count/5e3)),E=l+(u-l)*.62,D=[-12,-8,-4,0,4,8,12],O=C,k=1/0,A=new Y(1,0,0);for(let a of D){let o=C.clone().applyAxisAngle(A,a*Math.PI/180).normalize(),l=Math.max(-1,Math.min(1,o.dot(d)));if(Math.acos(l)>18*Math.PI/180)continue;let u=0,f=0;for(let a=0;a<e.count;a+=T){if(r&&n[a]===1)continue;let l=e.getY(a);if(w>14&&(i?l>c-2.5:l<s+2.5))continue;let d=t.getX(a)*o.x+t.getY(a)*o.y+t.getZ(a)*o.z;if(d<-.09){let t=-d-.09;e.getZ(a)>E?u+=t*t:f+=t*t}}let p=u*1.35+f+Math.abs(a)*.02;p<k&&(k=p,O=o)}return O}function Og(e){let t=e.getAttribute(`position`),n=t.count,r=e.userData.__ucSegCache;if(r&&r.count===n)return r;let i=(e.userData?.baseColors?.count===n?e.userData.baseColors:null)||e.getAttribute(`color`),a=new Float32Array(n),o=new Float32Array(n),s=new Float32Array(n),c=new Uint8Array(n),l=0,u=0;if(i&&i.count===n)for(let e=0;e<n;e++){let t=i.getX(e),n=i.getY(e),r=i.getZ(e);(t>1||n>1||r>1)&&(t/=255,n/=255,r/=255),a[e]=t,o[e]=n,s[e]=r,Tg(t,n,r)?(c[e]=1,l++):u++}else a.fill(.84),o.fill(.82),s.fill(.78);let d=l>0&&u>0,f=1/0,p=-1/0,m=1/0,h=-1/0,g=1/0,_=-1/0;for(let e=0;e<n;e++){let n=t.getX(e),r=t.getY(e),i=t.getZ(e);n<f&&(f=n),n>p&&(p=n),r<m&&(m=r),r>h&&(h=r),i<g&&(g=i),i>_&&(_=i)}let v=new Float32Array(n);if(v.fill(1/0),d){let e=1.6,r=.3,i=new Map,a=new Set,o=(e,t,n)=>((e+512)*1024+(t+512))*1024+(n+512);for(let s=0;s<n;s++)if(c[s]===1){let n=t.getX(s),c=t.getY(s),l=t.getZ(s),u=o(Math.round(n/r),Math.round(c/r),Math.round(l/r));if(a.has(u))continue;a.add(u);let d=o(Math.round(n/e),Math.round(c/e),Math.round(l/e)),f=i.get(d);f||(f=[],i.set(d,f)),f.push(s)}for(let r=0;r<n;r++){if(c[r]===1){v[r]=0;continue}let n=t.getX(r),a=t.getY(r),s=t.getZ(r),l=Math.round(n/e),u=Math.round(a/e),d=Math.round(s/e),f=16;for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++){let p=i.get(o(l+e,u+r,d+c));if(p)for(let e=0;e<p.length;e++){let r=p[e],i=n-t.getX(r),o=a-t.getY(r),c=s-t.getZ(r),l=i*i+o*o+c*c;l<f&&(f=l)}}if(f>2.5600000000000005)for(let e=-2;e<=2;e++)for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++){if(Math.abs(e)<=1&&Math.abs(r)<=1&&Math.abs(c)<=1)continue;let p=i.get(o(l+e,u+r,d+c));if(p)for(let e=0;e<p.length;e++){let r=p[e],i=n-t.getX(r),o=a-t.getY(r),c=s-t.getZ(r),l=i*i+o*o+c*c;l<f&&(f=l)}}f<16&&(v[r]=Math.sqrt(f))}}let y={count:n,baseR:a,baseG:o,baseB:s,isGumColor:c,hasToothGumSegmentation:d,distToGumMm:v,minX:f,maxX:p,minY:m,maxY:h,minZ:g,maxZ:_};return e.userData.__ucSegCache=y,y}function kg(e,t,n){let r=e.length,i=new Float32Array(r*3),a=Math.max(.08,n),{baseR:o,baseG:s,baseB:c}=t;for(let t=0;t<r;t++){let n=e[t],r=t*3;if(n<=.05)i[r]=o[t]*.8+.12,i[r+1]=s[t]*.8+.12,i[r+2]=c[t]*.8+.12;else if(n<=a){let e=(n-.05)/Math.max(.02,a-.05);i[r]=.98-e*.02,i[r+1]=.84-e*.24,i[r+2]=.14-e*.1}else{let e=Math.min(1,(n-a)/.55);i[r]=.98-e*.05,i[r+1]=.45-e*.31,i[r+2]=.09+e*.05}}return i}function Ag(e,t,n={x:0,y:t?-1:1,z:0,tiltX:0,tiltY:0},r=2,i=.25){let a=e.getAttribute(`position`);if(!a||a.count===0)return{depths:new Float32Array,heatmapColors:new Float32Array,maxDepthMm:0,avgDepthMm:0,undercutAreaMm2:0,undercutIndices:new Uint32Array};e.getAttribute(`normal`)||e.computeVertexNormals();let o=e.getAttribute(`normal`),s=a.count,c=e.getIndex(),l=Og(e),u=`${t?`U`:`L`}:${n.tiltX.toFixed(2)}:${n.tiltY.toFixed(2)}:${r.toFixed(2)}:${s}`,d=e.userData.__ucSurveyResult;if(d&&d.key===u)return{depths:d.depths,heatmapColors:kg(d.depths,l,i),maxDepthMm:d.maxDepthMm,avgDepthMm:d.avgDepthMm,undercutAreaMm2:d.undercutAreaMm2,undercutIndices:d.undercutIndices};let{isGumColor:f,hasToothGumSegmentation:p,distToGumMm:m,minX:h,maxX:g,minY:_,maxY:v,minZ:y,maxZ:b}=l,x=g-h,S=v-_,C=x>28,w;w=C&&Math.abs(n.tiltX)<.01&&Math.abs(n.tiltY)<.01?Dg(a,o,f,p,t,h,g,_,v,y,b):Eg(n,t);let T=-Math.sin(Math.max(4.5,r*2.5)*(Math.PI/180)),E=Math.tan(Math.PI/180*Math.max(0,r)),D=Math.abs(w.x)<.85?new Y(1,0,0):new Y(0,0,1),O=new Y().crossVectors(w,D).normalize(),k=new Y().crossVectors(w,O).normalize(),A=new Float32Array(s),j=new Float32Array(s),M=new Float32Array(s),N=1/0,P=-1/0,F=1/0,I=-1/0;for(let e=0;e<s;e++){let t=a.getX(e),n=a.getY(e),r=a.getZ(e),i=t*O.x+n*O.y+r*O.z,o=t*k.x+n*k.y+r*k.z,s=t*w.x+n*w.y+r*w.z;A[e]=i,j[e]=o,M[e]=s,i<N&&(N=i),i>P&&(P=i),o<F&&(F=o),o>I&&(I=o)}let L=new Uint8Array(s),R=S>14?p?2.1:2.6:.8;for(let e=0;e<s;e++){let n=a.getY(e),r=S>=10&&(t?n>=v-R:n<=_+R),i=p&&f[e]===1;(r||i)&&(L[e]=1)}let z=Math.max(.001,P-N),ee=Math.max(.001,I-F),B=.22,te=Math.max(24,Math.min(360,Math.ceil(z/B)+3)),V=Math.max(24,Math.min(360,Math.ceil(ee/B)+3)),H=.6,ne=.6,re=N-H,ie=F-ne,ae=(z+2*H)/(te-1),oe=(ee+2*ne)/(V-1),se=new Float32Array(te*V);se.fill(-1/0);let ce=Math.floor(c?c.count/3:s/3);for(let e=0;e<ce;e++){let t=c?c.getX(e*3):e*3,n=c?c.getX(e*3+1):e*3+1,r=c?c.getX(e*3+2):e*3+2;if(t>=s||n>=s||r>=s||L[t]===1&&L[n]===1&&L[r]===1)continue;let i=(A[t]-re)/ae,a=(A[n]-re)/ae,o=(A[r]-re)/ae,l=(j[t]-ie)/oe,u=(j[n]-ie)/oe,d=(j[r]-ie)/oe,f=Math.max(0,Math.floor(Math.min(i,a,o))),p=Math.min(te-1,Math.ceil(Math.max(i,a,o))),m=Math.max(0,Math.floor(Math.min(l,u,d))),h=Math.min(V-1,Math.ceil(Math.max(l,u,d)));if(p<f||h<m)continue;let g=(u-d)*(i-o)+(o-a)*(l-d),_=M[t],v=M[n],y=M[r];if(Math.abs(g)<1e-6){let e=Math.max(_,v,y),t=Math.max(0,Math.min(te-1,Math.round((i+a+o)/3))),n=Math.max(0,Math.min(V-1,Math.round((l+u+d)/3))),r=t*V+n;e>se[r]&&(se[r]=e);continue}let b=1/g;for(let e=f;e<=p;e++){let t=e-o,n=e*V;for(let e=m;e<=h;e++){let r=e-d,s=((u-d)*t+(o-a)*r)*b,c=((d-l)*t+(i-o)*r)*b,f=1-s-c;if(s>=-.001&&c>=-.001&&f>=-.001){let t=s*_+c*v+f*y;t>se[n+e]&&(se[n+e]=t)}}}}let le=[];for(let e=0;e<8;e++){let t=e*Math.PI/4;le.push([Math.cos(t),Math.sin(t)])}let ue=(e,t,n,r,i)=>{let a=.11,o=0,s=(se[Math.max(0,Math.min(te-1,Math.round((e-re)/ae)))*V+Math.max(0,Math.min(V-1,Math.round((t-ie)/oe)))]??n)-n;for(let c=a;c<=2.6;c+=a){let l=e+c*r,u=t+c*i,d=Math.round((l-re)/ae),f=Math.round((u-ie)/oe);if(d<0||d>=te||f<0||f>=V)return c;let p=se[d*V+f]-(n+.04+c*E);if(p<=0){let e=s-p,t=e>1e-4?Math.max(0,Math.min(1,s/e)):1;return o+a*t}o=c,s=p}return 2.5},de=new Float32Array(s),fe=[],pe=0,me=0,he=0,ge=new Y,_e=(h+g)*.5,ve=y-12;for(let e=0;e<s;e++){if(L[e]===1){de[e]=0;continue}ge.set(o.getX(e),o.getY(e),o.getZ(e));let t=ge.dot(w),n=A[e],r=j[e],i=M[e],s=Math.max(0,Math.min(te-1,Math.round((n-re)/ae))),c=Math.max(0,Math.min(V-1,Math.round((r-ie)/oe))),l=se[s*V+c],u=0;if(t<T&&l>i+.12){let t=ge.dot(O),o=ge.dot(k),s=Math.hypot(t,o);if(s>=.08)u=ue(n,r,i,t/s,o/s);else{let e=2.5;for(let t=0;t<le.length;t++){let[a,o]=le[t],s=ue(n,r,i,a,o);s<e&&(e=s)}u=e}if(p){let t=m[e],n=a.getX(e),r=a.getZ(e),i=n-_e,o=r-ve,s=Math.hypot(i,o),c=s>.001?(ge.x*i+ge.z*o)/s:0,l=C&&Math.abs(Math.atan2(i,o))<.55&&c>.25?2.05:u>.85?3.4:2.6,d=l*.68;if(t>=l)u=0;else if(t>d){let e=1-(t-d)/(l-d);u*=e}}u=Math.min(2.5,Math.max(0,u))}de[e]=u,u>.05&&(fe.push(e),u>pe&&(pe=u),me+=u,he++)}let ye=he>0?me/he:0,be=he*.065,xe={key:u,depths:de,maxDepthMm:Number(pe.toFixed(2)),avgDepthMm:Number(ye.toFixed(2)),undercutAreaMm2:Number(be.toFixed(1)),undercutIndices:new Uint32Array(fe)};return e.userData.__ucSurveyResult=xe,{depths:xe.depths,heatmapColors:kg(xe.depths,l,i),maxDepthMm:xe.maxDepthMm,avgDepthMm:xe.avgDepthMm,undercutAreaMm2:xe.undercutAreaMm2,undercutIndices:xe.undercutIndices}}function jg(e,t){let n=e.length;if(n===0||t<=.05)return new Float64Array(e);let r=Math.max(1,Math.ceil(t*3)),i=new Float64Array(2*r+1),a=0,o=1/(2*t*t);for(let e=-r;e<=r;e++){let t=Math.exp(-e*e*o);i[e+r]=t,a+=t}let s=new Float64Array(n);for(let t=0;t<n;t++){let o=0;for(let a=-r;a<=r;a++){let s=t+a<0?0:t+a>=n?n-1:t+a;o+=e[s]*i[a+r]}s[t]=o/a}return s}function Mg(e,t){if(e.length===0)return 0;let n=Float64Array.from(e).sort(),r=(n.length-1)*t,i=Math.floor(r),a=Math.min(n.length-1,i+1),o=r-i;return n[i]*(1-o)+n[a]*o}function Ng(e,t,n){let r=e.length;if(r===0)return 0;if(n<=e[0])return t[0];if(n>=e[r-1])return t[r-1];let i=0,a=r-1;for(;a-i>1;){let t=i+a>>1;e[t]<=n?i=t:a=t}let o=e[a]-e[i],s=o>1e-9?(n-e[i])/o:0;return t[i]*(1-s)+t[a]*s}function Pg(e,t){let n=e.getAttribute(`position`);if(!n||n.count===0)return[];e.getAttribute(`normal`)||e.computeVertexNormals();let r=t?-1:1,i=n.count,a=1/0,o=-1/0,s=1/0,c=-1/0,l=1/0,u=-1/0,d=Math.max(1,Math.floor(i/5e4));for(let e=0;e<i;e+=d){let t=n.getX(e),r=n.getY(e),i=n.getZ(e);t<a&&(a=t),t>o&&(o=t),r<s&&(s=r),r>c&&(c=r),i<l&&(l=i),i>u&&(u=i)}let f=c-s;if(!Number.isFinite(a)||f<=.001)return[];let p=(a+o)*.5,m=l-2,h=Math.max(1,Math.floor(i/45e3)),g=Math.ceil(i/h),_=new Float64Array(g),v=new Float64Array(g),y=new Float64Array(g),b=new Float64Array(g),x=0,S=l+Math.min(1.2,(u-l)*.06);for(let e=0;e<i;e+=h){let t=n.getX(e),i=n.getY(e),a=n.getZ(e);a<=S||(_[x]=t,v[x]=r*i,y[x]=a,b[x]=Math.atan2(t-p,a-m),x++)}if(x<24)return[];let C=2.7/72,w=[],T=[],E=[];for(let e=0;e<72;e++){let t=-1.35+e*C,n=t+C,r=.5*(t+n),i=[],a=[];for(let e=0;e<x;e++){let r=b[e];r>=t&&r<n&&(i.push(v[e]),a.push(e))}if(i.length<8)continue;let o=Mg(i,.98),s=[];for(let e=0;e<a.length;e++){let t=i[e];if(t<=o-.5&&t>=o-4.2){let t=a[e];s.push(Math.hypot(_[t]-p,y[t]-m))}}if(s.length<4){for(let e=0;e<a.length;e++)if(i[e]>=o-4.8){let t=a[e];s.push(Math.hypot(_[t]-p,y[t]-m))}}if(s.length<4)continue;let c=Mg(s,.08),l=Mg(s,.92);if(l-c>15)continue;let u=.5*(c+l);w.push(p+u*Math.sin(r)),T.push(Mg(i,.96)),E.push(m+u*Math.cos(r))}if(w.length<8){let e=t?s+Math.min(2.2,f*.2):c-Math.min(2.2,f*.2),n=t?e+2:e-2,r=t?[11,21]:[41,31];return[{id:`contact-01`,index:0,contactKey:`${r[0]}-${r[1]}`,label:`${r[0]} - ${r[1]}`,toothA:r[0],toothB:r[1],position:[parseFloat(p.toFixed(2)),parseFloat(e.toFixed(2)),parseFloat(u.toFixed(2))],normal:[1,0,0],clearanceMm:.35,spanMm:6.5,apexY:parseFloat(e.toFixed(2)),baseY:parseFloat(n.toFixed(2)),buccalWidthMm:2,lingualWidthMm:2.5}]}let D=jg(Float64Array.from(w),1.8),O=jg(Float64Array.from(T),1.8),k=jg(Float64Array.from(E),1.8),A=new Float64Array(D.length);for(let e=1;e<D.length;e++)A[e]=A[e-1]+Math.hypot(D[e]-D[e-1],k[e]-k[e-1]);let j=A[A.length-1];if(j<10)return[];let M=Math.min(1.5,j*.05),N=.3,P=Math.max(16,Math.floor((j-2*M)/N)+1),F=new Float64Array(P),I=new Float64Array(P),L=new Float64Array(P),R=new Float64Array(P);for(let e=0;e<P;e++){let t=M+e*N;F[e]=t,I[e]=Ng(A,D,t),L[e]=Ng(A,O,t),R[e]=Ng(A,k,t)}let z=new Float64Array(P),ee=new Float64Array(P),B=new Float64Array(P),te=new Float64Array(P);for(let e=0;e<P;e++){let t=Math.max(0,e-1),n=Math.min(P-1,e+1),r=I[n]-I[t],i=R[n]-R[t],a=Math.hypot(r,i)||1;r/=a,i/=a,z[e]=r,ee[e]=i;let o=-i,s=r;o*(I[e]-p)+s*(R[e]-m)<0&&(o=-o,s=-s),B[e]=o,te[e]=s}let V=new Float64Array(P),H=new Float64Array(P),ne=new Float64Array(P),re=new Float64Array(P),ie=new Float64Array(P);for(let e=0;e<P;e++){let t=I[e],n=R[e],r=L[e],i=z[e],a=ee[e],o=B[e],s=te[e],c=[],l=[],u=r-4,d=r-4;for(let e=0;e<x;e++){let f=_[e]-t;if(f>8||f<-8)continue;let p=y[e]-n;if(p>8||p<-8)continue;let m=f*i+p*a;if(m>.4||m<-.4)continue;let h=f*o+p*s,g=v[e];h>-5&&h<5&&l.push(g),g<=r-1&&g>=r-3.8&&h>-7.5&&h<7.5&&c.push(h),h>1.2&&h<5.5&&g>u?u=g:h<-1.2&&h>-5.5&&g>d&&(d=g)}ie[e]=l.length>=4?Mg(l,.98):r,c.length>=4?(V[e]=Mg(c,.95),H[e]=-Mg(c,.05)):(V[e]=3,H[e]=3),ne[e]=u,re[e]=d}let ae=new Float64Array(P),oe=new Float64Array(P),se=new Float64Array(P),ce=new Float64Array(P),le=new Float64Array(P),ue=jg(V,9),de=jg(V,1.2),fe=jg(H,9),pe=jg(H,1.2),me=jg(ne,8.5),he=jg(ne,1.2),ge=jg(re,8.5),_e=jg(re,1.2),ve=jg(ie,8),ye=jg(ie,1.1),be=new Float64Array(P),xe=new Float64Array(P),U=new Float64Array(P);for(let e=0;e<P;e++)ae[e]=ue[e]-de[e],oe[e]=fe[e]-pe[e],se[e]=me[e]-he[e],ce[e]=ge[e]-_e[e],le[e]=ve[e]-ye[e],be[e]=1.5*ae[e]+1*se[e]+.6*le[e],xe[e]=1.5*oe[e]+1*ce[e]+.6*le[e],U[e]=be[e]+xe[e];let Se=jg(U,1),W=-1/0;for(let e=0;e<P;e++)R[e]>W&&(W=R[e]);let Ce=Math.floor(P*.5),G=-1/0;for(let e=0;e<P;e++)if(R[e]>W-6&&Math.abs(I[e]-p)<5.8){let t=I[e]-p,n=Se[e]-.04*t*t;n>G&&(G=n,Ce=e)}let we=F[Ce],Te=t?[8.5,6.9,7.6,7,6.9,10.2]:[5.3,5.8,6.8,7.1,7.2,10.6],Ee=t?47.1:42.8,K=t?[{key:`12-11`,a:12,b:11,ant:!0,mol:!1},{key:`13-12`,a:13,b:12,ant:!0,mol:!1},{key:`14-13`,a:14,b:13,ant:!1,mol:!1},{key:`15-14`,a:15,b:14,ant:!1,mol:!1},{key:`16-15`,a:16,b:15,ant:!1,mol:!0},{key:`17-16`,a:17,b:16,ant:!1,mol:!0}]:[{key:`42-41`,a:42,b:41,ant:!0,mol:!1},{key:`43-42`,a:43,b:42,ant:!0,mol:!1},{key:`44-43`,a:44,b:43,ant:!1,mol:!1},{key:`45-44`,a:45,b:44,ant:!1,mol:!1},{key:`46-45`,a:46,b:45,ant:!1,mol:!0},{key:`47-46`,a:47,b:46,ant:!1,mol:!0}],De=t?[{key:`21-22`,a:21,b:22,ant:!0,mol:!1},{key:`22-23`,a:22,b:23,ant:!0,mol:!1},{key:`23-24`,a:23,b:24,ant:!1,mol:!1},{key:`24-25`,a:24,b:25,ant:!1,mol:!1},{key:`25-26`,a:25,b:26,ant:!1,mol:!0},{key:`26-27`,a:26,b:27,ant:!1,mol:!0}]:[{key:`31-32`,a:31,b:32,ant:!0,mol:!1},{key:`32-33`,a:32,b:33,ant:!0,mol:!1},{key:`33-34`,a:33,b:34,ant:!1,mol:!1},{key:`34-35`,a:34,b:35,ant:!1,mol:!1},{key:`35-36`,a:35,b:36,ant:!1,mol:!0},{key:`36-37`,a:36,b:37,ant:!1,mol:!0}],Oe=j>55?1.4:Math.min(2,j*.08),ke=F[0]+Oe,Ae=F[P-1]-Oe;function je(e,t){let n=F[e],r=0,i=0;for(let e=0;e<P;e++){let a=(F[e]-n)*t;a>=2&&a<=5.5&&(r+=de[e]+pe[e],i++)}return i>=4&&r/i>=8}function Me(e){let t=e===1?F[P-1]-we:we-F[0],n=j>55?Math.max(.92,Math.min(1.07,t/Ee)):Math.max(.4,t/Ee),r=[],i=we,a=(t,r,a,o=-1/0,s=-1/0,c=-1/0,l=-1/0)=>{let u=-1,d=-1/0;for(let f=0;f<P;f++){let p=F[f];if(p<ke||p>Ae)continue;let m=p-t;if(Math.abs(m)<=r){if(e===1&&p<i+3.6*Math.min(1,n)||e===-1&&p>i-3.6*Math.min(1,n)||a&&(ae[f]+oe[f]<=.12||Se[f]<=.35)||ae[f]<o||oe[f]<s||ae[f]+oe[f]<c||Se[f]<l)continue;let t=Se[f]-.055*m*m;t>d&&(d=t,u=f)}}return u};for(let t=0;t<Te.length;t++){if(t===5&&j>55){let t=a(i+6.7*n*e,1.8*n,!0,.45,.45,1.25,2.2);if(t>=0&&je(t,e)){let o=a(F[t]+10.6*n*e,3.2,!0,.35,.3,.9,1.6);o>=0&&je(o,e)&&(i=F[t],r.push({k:t,slotIdx:99}))}}let o=Te[t]*n,s=i+e*o;if(s<ke||s>Ae)break;let c=(t<2?2.8:t<5?2.2:3.2)*Math.min(1,n+.08),l=t===4?.11:.055,u=(t,r)=>{let a=-1,o=-1/0;for(let c=0;c<P;c++){let u=F[c];if(u<ke||u>Ae)continue;let d=u-s;if(Math.abs(d)<=t){if(e===1&&u<i+3.6*Math.min(1,n)||e===-1&&u>i-3.6*Math.min(1,n)||r&&(ae[c]+oe[c]<=.12||Se[c]<=.35))continue;let t=Se[c]-l*d*d;t>o&&(o=t,a=c)}}return a},d=u(c,t>=5);if(d<0&&t>=5&&(d=u(c+4.5,!0)),d<0)break;i=F[d],r.push({k:d,slotIdx:t})}if(r.length>0&&r[r.length-1].slotIdx===5&&j>55){let t=i+9.8*n*e;if(t>=ke+2&&t<=Ae-2){let n=a(t,3.2,!0,.35,.3,.9,1.6);n>=0&&(e===1?Ae-F[n]:F[n]-ke)>=2.2&&je(n,e)&&r.push({k:n,slotIdx:6})}}return r}let Ne=Me(-1),Pe=Me(1),Fe=t?[2.2,2.3,2.3,1.8,1.6,1.7,1.6,1.6]:[1.8,2,2.1,1.8,1.6,1.7,1.6,1.6];function Ie(e,n){return n===99?e===`right`?t?{key:`16p-15`,a:16,b:15,ant:!1,mol:!1}:{key:`46p-45`,a:46,b:45,ant:!1,mol:!1}:t?{key:`25-26p`,a:25,b:26,ant:!1,mol:!1}:{key:`35-36p`,a:35,b:36,ant:!1,mol:!1}:n===6?e===`right`?t?{key:`18-17`,a:18,b:17,ant:!1,mol:!0}:{key:`48-47`,a:48,b:47,ant:!1,mol:!0}:t?{key:`27-28`,a:27,b:28,ant:!1,mol:!0}:{key:`37-38`,a:37,b:38,ant:!1,mol:!0}:e===`right`?K[n]:De[n]}let Le=[];for(let e=Ne.length-1;e>=0;e--){let t=Ne[e],n=Ie(`right`,t.slotIdx),r=t.slotIdx===99?5:t.slotIdx+1;Le.push({key:n.key,label:`${n.a} - ${n.b}`,toothA:n.a,toothB:n.b,k:t.k,isAnterior:n.ant,isMolar:n.mol,dropMm:Fe[r]})}let Re=t?[11,21]:[41,31];Le.push({key:`${Re[0]}-${Re[1]}`,label:`${Re[0]} - ${Re[1]}`,toothA:Re[0],toothB:Re[1],k:Ce,isAnterior:!0,isMolar:!1,dropMm:Fe[0]});for(let e=0;e<Pe.length;e++){let t=Pe[e],n=Ie(`left`,t.slotIdx),r=t.slotIdx===99?5:t.slotIdx+1;Le.push({key:n.key,label:`${n.a} - ${n.b}`,toothA:n.a,toothB:n.b,k:t.k,isAnterior:n.ant,isMolar:n.mol,dropMm:Fe[r]})}let ze=[];for(let e=0;e<Le.length;e++){let n=Le[e],i=F[n.k],a=n.k,o=-1/0;for(let e=0;e<P;e++){let t=F[e]-i;if(Math.abs(t)<=1.5){let n=be[e]-.06*t*t;n>o&&(o=n,a=e)}}let s=n.k,c=-1/0;for(let e=0;e<P;e++){let t=F[e]-i;if(Math.abs(t)<=2){let n=xe[e]-.06*t*t;n>c&&(c=n,s=e)}}let l=Math.max(1.8,Math.min(4.2,de[a]*.72)),u=Math.max(1.8,Math.min(4.2,pe[s]*.72)),d=I[a]+B[a]*l,f=R[a]+te[a]*l,p=I[s]-B[s]*u,m=R[s]-te[s]*u,h=d-p,g=f-m,_=Math.hypot(h,g);_>1e-4?(h/=_,g/=_):(h=B[n.k],g=te[n.k]);let v=g,y=-h;v*z[n.k]+y*ee[n.k]<0&&(v=-v,y=-y);let b=.5*(d+p),x=.5*(f+m),S=r*ye[n.k],C=t?S+n.dropMm:S-n.dropMm,w=n.isAnterior?2.2:1.8,T=t?C+w:C-w,E=parseFloat(Math.max(1.4,Math.min(n.isAnterior?2.6:4.8,ue[n.k]*.92)).toFixed(2)),D=parseFloat(Math.max(1.8,Math.min(n.isAnterior?3.6:5.4,fe[n.k]*.92)).toFixed(2));ze.push({id:`contact-${String(e+1).padStart(2,`0`)}`,index:e,contactKey:n.key,label:n.label,toothA:n.toothA,toothB:n.toothB,position:[parseFloat(b.toFixed(2)),parseFloat(C.toFixed(2)),parseFloat(x.toFixed(2))],normal:[parseFloat(v.toFixed(4)),0,parseFloat(y.toFixed(4))],clearanceMm:.35,spanMm:parseFloat((n.isAnterior?6.5:8.5).toFixed(1)),apexY:parseFloat(C.toFixed(2)),baseY:parseFloat(T.toFixed(2)),buccalWidthMm:E,lingualWidthMm:D})}return ze}function Fg(e,t){let n=e.getAttribute(`position`);if(!n||n.count<12)return null;let r=e.getIndex(),i=Math.floor(r?r.count/3:n.count/3);if(i<=0)return null;let a=1/0,o=-1/0,s=1/0,c=-1/0,l=1/0,u=-1/0,d=n.count,f=Math.max(1,Math.floor(d/4e4));for(let e=0;e<d;e+=f){let t=n.getX(e),r=n.getY(e),i=n.getZ(e);t<a&&(a=t),t>o&&(o=t),r<s&&(s=r),r>c&&(c=r),i<l&&(l=i),i>u&&(u=i)}if(!Number.isFinite(a)||c-s<.001)return null;let p=c-s,m=t?c-p*.06:s+p*.06,h=new Float32Array(i*9),g=0;for(let e=0;e<i;e++){let i=r?r.getX(e*3):e*3,a=r?r.getX(e*3+1):e*3+1,o=r?r.getX(e*3+2):e*3+2,s=n.getX(i),c=n.getY(i),l=n.getZ(i),u=n.getX(a),d=n.getY(a),f=n.getZ(a),p=n.getX(o),_=n.getY(o),v=n.getZ(o);if(t){if(c>m&&d>m&&_>m&&Math.max((u-s)*(u-s)+(f-l)*(f-l),(p-u)*(p-u)+(v-f)*(v-f))>9)continue}else if(c<m&&d<m&&_<m&&Math.max((u-s)*(u-s)+(f-l)*(f-l),(p-u)*(p-u)+(v-f)*(v-f))>9)continue;let y=g*9;h[y]=s,h[y+1]=c,h[y+2]=l,h[y+3]=u,h[y+4]=d,h[y+5]=f,h[y+6]=p,h[y+7]=_,h[y+8]=v,g++}if(g<8)return null;let _=g===i?h:h.subarray(0,g*9),v=Math.max(1,o-a),y=Math.max(1,u-l),b=new Int32Array(256),x=new Int32Array(g);for(let e=0;e<g;e++){let t=e*9,n=(_[t]+_[t+3]+_[t+6])/3,r=(_[t+2]+_[t+5]+_[t+8])/3,i=Math.max(0,Math.min(15,Math.floor((n-a)/v*16))),o=Math.max(0,Math.min(15,Math.floor((r-l)/y*16)))*16+i;x[e]=o,b[o]=(b[o]??0)+1}let S=Array.from({length:256},(e,t)=>new Int32Array(b[t])),C=new Int32Array(256);for(let e=0;e<g;e++){let t=x[e],n=C[t];S[t][n]=e,C[t]=n+1}return{isUpper:t,triCount:g,triCoords:_,minX:a,maxX:o,minY:s,maxY:c,minZ:l,maxZ:u,midX:(a+o)*.5,focalZ:l-2,gridCols:16,gridRows:16,buckets:S}}function Ig(e){let t=e<0?0:e>1?1:e;return t*t*(3-2*t)}function Lg(e,t){if(e.length===0)return 0;let n=(e.length-1)*t,r=Math.floor(n),i=Math.min(e.length-1,r+1),a=n-r;return e[r]*(1-a)+e[i]*a}function Rg(e,t,n,r){if(r<=.05)return new Float64Array(e);let i=Math.max(1,Math.ceil(r*2.8)),a=new Float64Array(2*i+1),o=0,s=1/(2*r*r);for(let e=-i;e<=i;e++){let t=Math.exp(-e*e*s);a[e+i]=t,o+=t}for(let e=0;e<a.length;e++)a[e]=a[e]/o;let c=new Float64Array(t*n),l=new Float64Array(t*n);for(let r=0;r<t;r++){let t=r*n;for(let r=0;r<n;r++){let o=0;for(let s=-i;s<=i;s++){let c=r+s<0?0:r+s>=n?n-1:r+s;o+=e[t+c]*a[s+i]}c[t+r]=o}}for(let e=0;e<t;e++)for(let r=0;r<n;r++){let o=0;for(let s=-i;s<=i;s++){let l=e+s<0?0:e+s>=t?t-1:e+s;o+=c[l*n+r]*a[s+i]}l[e*n+r]=o}return l}function zg(e,t){let n=e.length,r=Math.max(1,Math.ceil(t*2.8)),i=new Float64Array(2*r+1),a=0,o=1/(2*t*t);for(let e=-r;e<=r;e++){let t=Math.exp(-e*e*o);i[e+r]=t,a+=t}let s=new Float64Array(n);for(let t=0;t<n;t++){let o=0;for(let a=-r;a<=r;a++){let s=t+a<0?0:t+a>=n?n-1:t+a;o+=e[s]*i[a+r]}s[t]=o/a}return s}function Bg(e,t,n,r,i,a,o,s){let c=Math.max(1,Math.ceil(a/r)),l=Math.max(1,Math.ceil(o/i)),u=(2*c+1)*(2*l+1),d=new Int32Array(u),f=new Int32Array(u),p=new Float64Array(u),m=0;for(let e=-c;e<=c;e++){let t=e*r/a,n=t*t;if(!(n>1))for(let t=-l;t<=l;t++){let r=t*i/o,a=n+r*r;a<=1&&(d[m]=e,f[m]=t,p[m]=s*(1-Math.sqrt(Math.max(0,1-a))),m++)}}let h=new Float64Array(t*n),g=new Float64Array(t*n);for(let r=0;r<t;r++)for(let i=0;i<n;i++){let a=-1e9;for(let o=0;o<m;o++){let s=r+d[o];if(s<0||s>=t)continue;let c=i+f[o];if(c<0||c>=n)continue;let l=e[s*n+c]-p[o];l>a&&(a=l)}h[r*n+i]=a}for(let e=0;e<t;e++)for(let r=0;r<n;r++){let i=1e9;for(let a=0;a<m;a++){let o=e+d[a];if(o<0||o>=t)continue;let s=r+f[a];if(s<0||s>=n)continue;let c=h[o*n+s]+p[a];c<i&&(i=c)}g[e*n+r]=i}return g}function Vg(e,t,n){let r=t.isUpper,i=r?-1:1,[a,o,s]=e.position,c=new Y(e.normal[0],0,e.normal[2]);c.lengthSq()<1e-6&&c.set(1,0,0),c.normalize();let l=new Y(-c.z,0,c.x).normalize(),u=new Y(a-t.midX,0,s-t.focalZ);l.dot(u)<0&&l.negate();let d=c.x,f=c.z,p=l.x,m=l.z,h=12.6,g=Math.max(1,t.maxX-t.minX),_=Math.max(1,t.maxZ-t.minZ),v=Math.max(0,Math.floor((a-h-t.minX)/g*t.gridCols)),y=Math.min(t.gridCols-1,Math.floor((a+h-t.minX)/g*t.gridCols)),b=Math.max(0,Math.floor((s-h-t.minZ)/_*t.gridRows)),x=Math.min(t.gridRows-1,Math.floor((s+h-t.minZ)/_*t.gridRows)),S=t.triCoords,C=[],w=[],T=[],E=[],D=[];for(let e=b;e<=x;e++)for(let n=v;n<=y;n++){let r=t.buckets[e*t.gridCols+n];for(let e=0;e<r.length;e++){let t=r[e]*9,n=S[t]-a,o=S[t+2]-s,c=S[t+3]-a,l=S[t+5]-s,u=S[t+6]-a,h=S[t+8]-s,g=n*d+o*f,_=n*p+o*m,v=c*d+l*f,y=c*p+l*m,b=u*d+h*f,x=u*p+h*m;if(Math.max(g,v,b)<-3.4||Math.min(g,v,b)>3.4||Math.max(_,y,x)<-11.5||Math.min(_,y,x)>9.5)continue;let E=i*S[t+1],O=i*S[t+4],k=i*S[t+7];C.push(g,v,b),w.push(_,y,x),T.push(E,O,k),Math.abs(g)<2.8&&D.push(E)}}let O=Math.floor(C.length/3);if(O<20||D.length<24)return null;let k=Lg(Float64Array.from(D).sort(),.985);for(let e=0;e<O;e++){let t=e*3,n=C[t];T[t]>k-5&&Math.abs(n)>.5&&Math.abs(n)<2.8&&E.push(w[t])}if(E.length<20)return null;let A=Float64Array.from(E).sort(),j=Lg(A,.025),M=Lg(A,.975),N=M-j;if(N<2.2)return null;let P=e.toothA>0&&e.toothB>0?Math.abs(e.toothA%10)<=3&&Math.abs(e.toothB%10)<=3:N<7.6,F=-2.85,I=j-1.25,L=M+.95,R=5.7/59,z=(L-I)/87,ee=k-9,B=new Float64Array(5280);B.fill(ee);for(let e=0;e<O;e++){let t=e*3,n=(C[t]-F)/R,r=(C[t+1]-F)/R,i=(C[t+2]-F)/R,a=(w[t]-I)/z,o=(w[t+1]-I)/z,s=(w[t+2]-I)/z,c=Math.max(0,Math.floor(Math.min(n,r,i))),l=Math.min(59,Math.ceil(Math.max(n,r,i))),u=Math.max(0,Math.floor(Math.min(a,o,s))),d=Math.min(87,Math.ceil(Math.max(a,o,s)));if(l<c||d<u)continue;let f=(o-s)*(n-i)+(i-r)*(a-s);if(Math.abs(f)<1e-7)continue;let p=1/f,m=T[t],h=T[t+1],g=T[t+2];for(let e=c;e<=l;e++){let t=e*88,c=e-i;for(let e=u;e<=d;e++){let l=e-s,u=((o-s)*c+(i-r)*l)*p,d=((s-a)*c+(n-i)*l)*p,f=1-u-d;if(u>=-.001&&d>=-.001&&f>=-.001){let n=u*m+d*h+f*g;n>B[t+e]&&(B[t+e]=n)}}}}let te=.5*(j+M),V=Rg(B,60,88,1),H=new Float64Array(88);for(let e=0;e<88;e++){let t=I+e*z,r=Math.min(1.2,Math.abs(2*(t-te)/Math.max(1,N))),i=n.isUserTuned?P?.35:.5:P?r<.7?.58+.22*r:.45:.65+.85*r,a=Math.max(0,Math.floor((-i-F)/R)),o=Math.min(59,Math.ceil((i-F)/R)),s=1/0,c=30;for(let t=a;t<=o;t++){let n=F+t*R,r=V[t*88+e]+Math.abs(n)*.04;r<s&&(s=r,c=t)}H[e]=F+c*R}let ne=zg(H,2.4),re=Math.max(.35,Math.min(1.65,(n.thicknessMm??.6)/.6)),ie=Bg(B,60,88,R,z,(P?2.65:2.25)*(.85+.15*re),(P?1.15:2.3)*(.85+.15*re),(P?1.35:2.15)*re),ae=new Float64Array(88);for(let e=0;e<88;e++){let t=ee,n=ne[e],r=P?.65:.75,i=P?2.7:2.4;for(let a=0;a<60;a++){let o=Math.abs(F+a*R-n);if(o>r&&o<i){let n=B[a*88+e];n>t&&(t=n)}}ae[e]=t}let oe=zg(ae,1.5),se=0;if(P){let e=0,t=0,n=0;for(let r=0;r<88;r++){let i=2*(I+r*z-te)/Math.max(1,N);if(i<-.15||i>.65)continue;let a=ne[r],o=Math.max(0,Math.min(59,Math.round((a-F)/R))),s=oe[r],c=B[o*88+r],l=s-1.35,u=2.4,d=2.4;for(let e=o;e>=0;e--)if(B[e*88+r]>=l){u=a-(F+e*R);break}for(let e=o;e<60;e++)if(B[e*88+r]>=l){d=F+e*R-a;break}e+=u+d,t+=Math.max(0,s-c),n++}if(n>0){let r=e/n,i=t/n;r>1.05&&i>2.2&&(se=Ig((r-1.05)/.55))}}let ce=r?-t.maxY:t.minY,le=Math.max(ce+1.5,k-(P?4.85:4.5)),ue=i*o,de=new Float64Array(5280);for(let e=0;e<88;e++){let t=I+e*z,r=2*(t-te)/Math.max(1,N),i=Ig(((P?r<0?.88:.98:r<0?1.04:.96)-Math.abs(r))/.22),a,o,s,c;if(P){let n=ne[e],i=Math.max(0,Math.min(59,Math.round((n-F)/R))),l=B[i*88+e],u=r<-.25?.95+.65*se:1.15+.85*se,d=Math.min(oe[e]-.85,Math.max(l+.45,oe[e]-1.15)),f=u;for(let t=i;t>=0;t--)if(B[t*88+e]>=d){f=Math.max(.48,n-(F+t*R)+.14);break}let p=u;for(let t=i;t<60;t++)if(B[t*88+e]>=d){p=Math.max(.48,F+t*R-n+.14);break}a=Math.min(u,f),o=Math.min(u,p),s=.2;let m=Math.exp(-(((t-(M-.5))/1.2)**2));c=.22+1.25*se+(.2+.15*se)*m}else{let e=Math.min(1,Math.abs(r)/.65)**1.8,t=.42+1.28*e;a=t,o=t,s=.26+.18*e,c=.36+1.78*Math.exp(-((r/.48)**2))}let l=oe[e]-c;n.isUserTuned&&(l=Math.min(l,ue+.15));let u=ne[e];for(let t=0;t<60;t++){let n=t*88+e,c=B[n];if(i<=1e-4||c<=ee+.5){de[n]=c-.05;continue}let d=F+t*R-u,f=Math.abs(d),p=d<0?a:o,m=c+Ig((p-f)/s)*Ig(((P&&se>.15&&Math.abs(r)<=.65&&f<=p*.85?Math.max(c,ie[n]):c)-le)/.85)*i*(Math.max(0,ie[n]-c)*re);m>l&&(m=l),m<c-.05&&(m=c-.05),de[n]=m}}let fe=Rg(de,60,88,1.25),pe=new Float64Array(5280),me=new Uint8Array(5280);for(let e=0;e<5280;e++){let t=B[e];if(t<=ee+.5){pe[e]=t-.05;continue}let n=Math.max(0,Math.min(1,(de[e]-t-.045)/.12)),r=(1-n)*(t-.04)+n*fe[e];pe[e]=r,r-t>.055&&(me[e]=1)}let he=new Uint8Array(5280),ge=new Int32Array(5280),_e=new Int32Array(5280),ve=0;for(let e=0;e<5280;e++){if(!me[e]||he[e])continue;let t=0,n=0,r=0,i=!1,a=0;for(he[e]=1,ge[n++]=e;t<n;){let e=ge[t++];_e[r++]=e;let o=Math.floor(e/88),s=e-o*88;Math.abs(F+o*R-ne[s])<1&&(i=!0);let c=I+s*z,l=Math.abs(2*(c-te)/Math.max(1,N));if(l>a&&(a=l),o>0){let t=e-88;me[t]&&!he[t]&&(he[t]=1,ge[n++]=t)}if(o<59){let t=e+88;me[t]&&!he[t]&&(he[t]=1,ge[n++]=t)}if(s>0){let t=e-1;me[t]&&!he[t]&&(he[t]=1,ge[n++]=t)}if(s<87){let t=e+1;me[t]&&!he[t]&&(he[t]=1,ge[n++]=t)}}if(!i||r<18||!(P||a>=.42))for(let e=0;e<r;e++){let t=_e[e];me[t]=0,pe[t]=B[t]-.05}else ve+=r}if(ve<18)return null;let ye=new Uint8Array(5280);for(let e=0;e<60;e++)for(let t=0;t<88;t++){let n=e*88+t;if(B[n]<=ee+.5)continue;if(me[n]){ye[n]=1;continue}let r=0;for(let n=-1;n<=1&&!r;n++){let i=e+n;if(!(i<0||i>=60))for(let e=-1;e<=1;e++){let n=t+e;if(n>=0&&n<88&&me[i*88+n]){r=1;break}}}ye[n]=r}let be=new Uint8Array(5133),xe=0;for(let e=0;e<59;e++)for(let t=0;t<87;t++)ye[e*88+t]&&ye[(e+1)*88+t]&&ye[e*88+(t+1)]&&ye[(e+1)*88+(t+1)]&&(be[e*87+t]=1,xe++);if(xe===0)return null;let U=new Float32Array(5280),Se=new Float32Array(5280),W=new Float32Array(5280),Ce=new Float32Array(5280);for(let e=0;e<60;e++){let t=F+e*R;for(let n=0;n<88;n++){let r=e*88+n;if(!ye[r])continue;let o=I+n*z;U[r]=a+t*d+o*p,W[r]=s+t*f+o*m;let c=pe[r],l=me[r]?Math.max(c-.45,Math.min(c-.04,B[r]-.1)):c-.02;Se[r]=i*c,Ce[r]=i*l}}let G=[];function we(e,t,n,r,i,a,o,s,c){G.push(e,t,n,r,i,a,o,s,c)}let Te=(d*m-f*p)*i<0;function Ee(e,t,n,r,i,a,o,s,c){Te?we(e,t,n,o,s,c,r,i,a):we(e,t,n,r,i,a,o,s,c)}for(let e=0;e<59;e++)for(let t=0;t<87;t++){if(!be[e*87+t])continue;let n=e*88+t,r=(e+1)*88+t,i=e*88+(t+1),a=(e+1)*88+(t+1);Ee(U[n],Se[n],W[n],U[r],Se[r],W[r],U[a],Se[a],W[a]),Ee(U[n],Se[n],W[n],U[a],Se[a],W[a],U[i],Se[i],W[i]),Ee(U[n],Ce[n],W[n],U[a],Ce[a],W[a],U[r],Ce[r],W[r]),Ee(U[n],Ce[n],W[n],U[i],Ce[i],W[i],U[a],Ce[a],W[a]),(e===0||!be[(e-1)*87+t])&&(Ee(U[n],Se[n],W[n],U[i],Se[i],W[i],U[i],Ce[i],W[i]),Ee(U[n],Se[n],W[n],U[i],Ce[i],W[i],U[n],Ce[n],W[n])),(e===58||!be[(e+1)*87+t])&&(Ee(U[r],Se[r],W[r],U[r],Ce[r],W[r],U[a],Ce[a],W[a]),Ee(U[r],Se[r],W[r],U[a],Ce[a],W[a],U[a],Se[a],W[a])),(t===0||!be[e*87+(t-1)])&&(Ee(U[n],Se[n],W[n],U[n],Ce[n],W[n],U[r],Ce[r],W[r]),Ee(U[n],Se[n],W[n],U[r],Ce[r],W[r],U[r],Se[r],W[r])),(t===86||!be[e*87+(t+1)])&&(Ee(U[i],Se[i],W[i],U[a],Se[a],W[a],U[a],Ce[a],W[a]),Ee(U[i],Se[i],W[i],U[a],Ce[a],W[a],U[i],Ce[i],W[i]))}let K=new Er;K.setAttribute(`position`,new dr(new Float32Array(G),3));let De=ep(K,.001);return De.computeVertexNormals(),De.toNonIndexed()}function Hg(e,t,n={}){let[r,i,a]=e.position,o=n.numVerticalSteps??16,s=n.concavityMm??.28,c=Math.max(.4,Math.min(1.6,(n.thicknessMm??.6)/.6)),l=Math.abs(e.toothA%10)<=3&&Math.abs(e.toothB%10)<=3,u=Math.abs(e.toothA%10)>=6||Math.abs(e.toothB%10)>=6,d=new Y(r,u?t?i+.35:i-.35:i,a),f=(l?.14:u?.24:.18)*c,p=(n.maxSpanMm??(l?.48:u?.85:.64))*c,m=e.buccalWidthMm&&e.buccalWidthMm>.5?e.buccalWidthMm:l?1.8:u?3.2:2.5,h=e.lingualWidthMm&&e.lingualWidthMm>.5?e.lingualWidthMm:l?2.6:u?4.4:3.4,g=n.maxBuccalDepthMm??Math.min(l?2:3.4,m*.88),_=n.maxLingualDepthMm??Math.min(l?2.8:4.6,h*.88),v=new Y(e.normal[0],0,e.normal[2]).normalize();v.lengthSq()<1e-4&&v.set(1,0,0);let y=new Y(-v.z,0,v.x).normalize(),b=new Y(r,0,a- -35).normalize();y.dot(b)<0&&y.negate();let x=y.clone().negate(),S=e.baseY!==void 0&&Math.abs(e.baseY-i)>1.2?Math.min(2.4,Math.max(1.6,Math.abs(e.baseY-i))):l?2.2:u?1.8:2,C=new Y(r,t?i+S:i-S,a),w=[];for(let e=0;e<=o;e++){let n=e/o,r=new Y().lerpVectors(d,C,n),i=f*.5+(p*.5-f*.5)*n**1.3,a=l?1.45+.55*n:1.85+.75*n,c=i*a,u=a*1.12*i,m=i+(c-i)*.42,h=i+(u-i)*.42,b=g*.72,S=_*.76,T=b+(g-b)*n**1.2,E=S+(_-S)*n**1.2,D=t?.2:-.2,O=1-n,k=T/Math.max(.5,g)*D*O*.8,A=E/Math.max(.5,_)*D*O*.8,j=Math.max(.12,T*.18)*(s/.25),M=Math.max(.12,E*.18)*(s/.25),N=r.clone().addScaledVector(v,-u).addScaledVector(x,E*.95);N.y+=A;let P=r.clone().addScaledVector(v,-h).addScaledVector(x,E*.5);P.y+=A*.5;let F=r.clone().addScaledVector(v,-i),I=r.clone().addScaledVector(v,-m).addScaledVector(y,T*.5);I.y+=k*.5;let L=r.clone().addScaledVector(v,-c).addScaledVector(y,T*.95);L.y+=k;let R=r.clone().addScaledVector(y,T*.95-j);R.y+=k;let z=r.clone().addScaledVector(v,c).addScaledVector(y,T*.95);z.y+=k;let ee=r.clone().addScaledVector(v,m).addScaledVector(y,T*.5);ee.y+=k*.5;let B=r.clone().addScaledVector(v,i),te=r.clone().addScaledVector(v,h).addScaledVector(x,E*.5);te.y+=A*.5;let V=r.clone().addScaledVector(v,u).addScaledVector(x,E*.95);V.y+=A;let H=r.clone().addScaledVector(x,E*.95-M);H.y+=A,w.push([N,P,F,I,L,R,z,ee,B,te,V,H])}let T=[];function E(e,t,n){T.push(e.x,e.y,e.z,t.x,t.y,t.z,n.x,n.y,n.z)}let D=w[0];for(let e=0;e<12;e++){let n=(e+1)%12;t?E(d,D[n],D[e]):E(d,D[e],D[n])}for(let e=0;e<o;e++){let n=w[e],r=w[e+1];for(let e=0;e<12;e++){let i=(e+1)%12,a=n[e],o=n[i],s=r[e],c=r[i];t?(E(a,o,c),E(a,c,s)):(E(a,c,o),E(a,s,c))}}let O=w[o];for(let e=0;e<12;e++){let n=(e+1)%12;t?E(C,O[e],O[n]):E(C,O[n],O[e])}let k=new Er;k.setAttribute(`position`,new dr(new Float32Array(T),3));let A=ep(k,.04);return A.computeVertexNormals(),A.toNonIndexed()}function Ug(e,t,n={}){let r=n.meshContext??(n.baseGeometry?Fg(n.baseGeometry,t):null);if(r){let t=Vg(e,r,n);if(t)return t}return Hg(e,t,n)}function Wg(e,t){let n=e.getAttribute(`position`),r=n.count,i=`${t?`U`:`L`}:${r}`,a=e.userData.__boPrecompute;if(a&&a.detectedKey===i)return a;let o=1/0,s=-1/0,c=1/0,l=-1/0,u=1/0,d=-1/0;for(let e=0;e<r;e+=4){let t=n.getX(e),r=n.getY(e),i=n.getZ(e);t<o&&(o=t),t>s&&(s=t),r<c&&(c=r),r>l&&(l=r),i<u&&(u=i),i>d&&(d=i)}let f=(o+s)*.5,p=u-12,m=.95,h=s-o>30,g=l-c,_=h?{minX:o,maxX:s,minZ:u,maxZ:d}:void 0,v=new Float32Array(120);v.fill(t?1/0:-1/0);for(let e=0;e<r;e++){let r=n.getX(e),i=n.getY(e),a=n.getZ(e),o=Math.atan2(r-f,a-p),s=Math.max(0,Math.min(119,Math.floor((o+m)/(2*m)*120)));(t?i<v[s]:i>v[s])&&(v[s]=i)}let y=new Float32Array(120);for(let e=0;e<120;e++){let n=0,r=0;for(let i=-3;i<=3;i++){let a=e+i;if(a>=0&&a<120){let e=v[a];(t?e<1/0:e>-1/0)&&(n+=e,r++)}}y[e]=r>0?n/r:t?c:l}let b=(e.userData?.baseColors instanceof dr&&e.userData.baseColors.count===r?e.userData.baseColors:null)||e.getAttribute(`color`),x=new Uint8Array(r),S=0,C=0;if(b&&b.count===r)for(let e=0;e<r;e++)Tg(b.getX(e),b.getY(e),b.getZ(e))?(x[e]=1,S++):C++;let w=Pg(e,t),T={count:r,minX:o,maxX:s,minY:c,maxY:l,minZ:u,maxZ:d,midX:f,focalZ:p,maxSpanAngle:m,isFullArch:h,modelHeight:g,archBounds:_,smoothPeak:y,isGumVertex:x,gumCount:S,toothCount:C,detectedKey:i,detected:w};return e.userData.__boPrecompute=T,T}function Gg(e,t){if(t.isCervicalBorder&&t.hasCervicalBorder!==void 0)return{isCervicalBorder:t.isCervicalBorder,hasCervicalBorder:t.hasCervicalBorder};let n=e.getAttribute(`position`),r=n.count,{isGumVertex:i,gumCount:a,toothCount:o}=t,s=new Uint8Array(r),c=!1;if(a>0&&o>0){let t=e.getIndex(),a=Math.floor(t?t.count/3:r/3);for(let e=0;e<a;e++){let n=t?t.getX(e*3):e*3,r=t?t.getX(e*3+1):e*3+1,a=t?t.getX(e*3+2):e*3+2,o=i[n]+i[r]+i[a];(o===1||o===2)&&(s[n]=2,s[r]=2,s[a]=2,c=!0)}if(!c){let e=.6,t=(e,t,n)=>((e+512)*1024+(t+512))*1024+(n+512),a=new Map,o=new Set;for(let s=0;s<r;s++)if(i[s]===0){let r=n.getX(s),i=n.getY(s),c=n.getZ(s),l=t(Math.round(r*5),Math.round(i*5),Math.round(c*5));if(o.has(l))continue;o.add(l);let u=t(Math.round(r/e),Math.round(i/e),Math.round(c/e)),d=a.get(u);d||(d=[],a.set(u,d)),d.push(s)}for(let o=0;o<r;o++)if(i[o]===1){let r=n.getX(o),i=n.getY(o),l=n.getZ(o),u=Math.round(r/e),d=Math.round(i/e),f=Math.round(l/e),p=!1;for(let e=-1;e<=1&&!p;e++)for(let m=-1;m<=1&&!p;m++)for(let h=-1;h<=1&&!p;h++){let g=a.get(t(u+e,d+m,f+h));if(g)for(let e=0;e<g.length;e++){let t=g[e],a=r-n.getX(t),u=i-n.getY(t),d=l-n.getZ(t);if(a*a+u*u+d*d<=.2025){s[o]=2,s[t]=2,c=!0,p=!0;break}}}}}if(c)for(let e=0;e<a;e++){let n=t?t.getX(e*3):e*3,r=t?t.getX(e*3+1):e*3+1,i=t?t.getX(e*3+2):e*3+2;(s[n]===2||s[r]===2||s[i]===2)&&(s[n]===0&&(s[n]=1),s[r]===0&&(s[r]=1),s[i]===0&&(s[i]=1))}}return t.isCervicalBorder=s,t.hasCervicalBorder=c,{isCervicalBorder:s,hasCervicalBorder:c}}function Kg(e,t,n){if(n.weldId&&n.weldCount!==void 0&&n.weldLockedGeom)return{weldId:n.weldId,weldCount:n.weldCount,weldLockedGeom:n.weldLockedGeom};let r=e.getAttribute(`position`),i=r.count,a=n.gumCount>0&&n.toothCount>0,o=new Int32Array(i),s=new Map,c=0;for(let e=0;e<i;e++){let t=Math.round(r.getX(e)*100)+32768,n=Math.round(r.getY(e)*100)+32768,i=Math.round(r.getZ(e)*100)+32768,a=(t*65536+n)*65536+i,l=s.get(a);l===void 0&&(l=c++,s.set(a,l)),o[e]=l}let l=new Uint8Array(c),{isGumVertex:u,modelHeight:d,minY:f,maxY:p}=n;for(let e=0;e<i;e++){let n=o[e],i=r.getY(e),s=d>12&&(t?i>=p-2.2:i<=f+2.2),c=a&&u[e]===1;(s||c)&&(l[n]=1)}return n.weldId=o,n.weldCount=c,n.weldLockedGeom=l,{weldId:o,weldCount:c,weldLockedGeom:l}}function qg(e,t,n,r=1,i=`stage-${String(r).padStart(2,`0`)}`,a,o){let s=e.getAttribute(`position`);if(!s||s.count===0)return{stageId:i,stageNumber:r,baseGeometry:e,waxGeometry:null,mergedGeometry:e.clone(),lastUpdated:Date.now()};e.getAttribute(`normal`)||e.computeVertexNormals();let c=e.getAttribute(`normal`),l=s.count,u=Ag(e,t,n.insertionAxis,n.undercut.draftAngleDeg,n.undercut.maxDepthMm),d=Wg(e,t),{minX:f,maxX:p,minY:m,maxY:h,minZ:g,maxZ:_,midX:v,focalZ:y,maxSpanAngle:b,isFullArch:x,modelHeight:S,archBounds:C,smoothPeak:w,detected:T}=d,E=T.filter(e=>!n.disabledContacts?.[e.contactKey]).map(e=>{let t=n.contactOverrides?.[e.contactKey],r=t?[t[0],t[1],t[2]]:e.position;return{contactKey:e.contactKey,label:e.label,toothA:e.toothA,toothB:e.toothB,spanMm:e.spanMm,contactPoint:r,normal:e.normal,apexY:t?r[1]:e.apexY,baseY:e.baseY,buccalWidthMm:e.buccalWidthMm,lingualWidthMm:e.lingualWidthMm,isSealed:!0,clearanceMm:e.clearanceMm}});if(n.customContacts&&n.customContacts.length>0)for(let e of n.customContacts){if(n.disabledContacts?.[e.key])continue;let r=n.contactOverrides?.[e.key],i=r?[r[0],r[1],r[2]]:e.position;E.push({contactKey:e.key,label:e.label||`Custom Contact (${e.key})`,toothA:0,toothB:0,spanMm:6.5,contactPoint:i,apexY:i[1],baseY:i[1]-(t?4:-4),buccalWidthMm:2,lingualWidthMm:2,isSealed:!0,clearanceMm:.35})}let D=new Float32Array,O=new Float32Array,k=new Float32Array,A=0;if(n.interproximal.enabled&&E.length>0){let r=n.singleGapFocusKey??`all`,i=n.interproximal.thicknessMm??.6,a=JSON.stringify({focusKey:r,selected:n.selectedContactKey??null,thicknessMm:i,disabled:n.disabledContacts??null,overrides:n.contactOverrides??null,custom:n.customContacts??null});if(d.wedgeCache&&d.wedgeCache.key===a)D=d.wedgeCache.positions,O=d.wedgeCache.normals,k=d.wedgeCache.colors,A=d.wedgeCache.sumVolume;else{let o=[];if(r===`all`||!r)o=E;else{let e=E.find(e=>e.contactKey===r);o=e?[e]:E}let s=new X(14171478),c=new X(16436245),l=Fg(e,t),u=[],f=[],p=[],m=0;for(let e of o){let a=(r&&r!==`all`?e.contactKey===r:n.selectedContactKey&&e.contactKey===n.selectedContactKey)?c:s,o=!!n.contactOverrides?.[e.contactKey],d={id:`contact-${e.contactKey}`,index:0,contactKey:e.contactKey,label:e.label,toothA:e.toothA,toothB:e.toothB,position:[e.contactPoint[0],e.contactPoint[1],e.contactPoint[2]],normal:e.normal??[1,0,0],clearanceMm:e.clearanceMm??.35,spanMm:e.spanMm,apexY:e.apexY,baseY:e.baseY,buccalWidthMm:e.buccalWidthMm,lingualWidthMm:e.lingualWidthMm},h=Math.abs(e.toothA%10)<=3&&Math.abs(e.toothB%10)<=3,g=Math.abs(e.toothA%10)>=6||Math.abs(e.toothB%10)>=6,_=Ug(d,t,{concavityMm:.25,maxSpanMm:h?.48:g?.85:.64,thicknessMm:i,meshContext:l,isUserTuned:o}),v=_.getAttribute(`position`),y=_.getAttribute(`normal`);if(v&&y){let t=v.array,n=y.array,r=new Float32Array(v.count*3);for(let e=0;e<v.count;e++)r[e*3]=a.r,r[e*3+1]=a.g,r[e*3+2]=a.b;u.push(t),f.push(n),p.push(r),m+=t.length;let i=Math.max(.8,e.spanMm*.18*(Math.abs(e.baseY-e.apexY)||2.8)*((e.buccalWidthMm||1.2)+(e.lingualWidthMm||1.2))*.18);A+=i}}D=new Float32Array(m),O=new Float32Array(m),k=new Float32Array(m);let h=0;for(let e=0;e<u.length;e++){let t=u[e];D.set(t,h),O.set(f[e],h),k.set(p[e],h),h+=t.length}d.wedgeCache={key:a,positions:D,normals:O,colors:k,sumVolume:A}}}let j=o?.skipMergedGeometry?null:e.clone(),M=j?j.getAttribute(`position`):null,N=n.gingival.enabled||n.undercut.enabled,P=!!(a&&a.size>0),F=new Float32Array,I=new Float32Array,L=new Float32Array;if((N||P)&&c){let r=n.gingival.enabled?Gg(e,d):null,i=new Float32Array(l),o=new Float32Array(l),f=new Float32Array(l),p=new Float32Array(l),g=new Uint8Array(l),_=null;if(n.undercut.enabled){let{weldId:r,weldCount:i,weldLockedGeom:a}=Kg(e,t,d),o=new Float32Array(i),c=new Uint16Array(i);for(let e=0;e<l;e++){let i=r[e];if(a[i]===1)continue;let l=u.depths[e]??0;if(l>n.undercut.maxDepthMm){let r=bh({x:s.getX(e),y:s.getY(e),z:s.getZ(e)},t,C).fdi;if(n.undercut.perTooth[r]!==!1){let t=Math.min(.75,(l-n.undercut.maxDepthMm)*.72);if(n.interproximal.enabled&&E.length>0){let n=s.getX(e),r=s.getZ(e);for(let e=0;e<E.length;e++){let i=E[e].contactPoint;if((n-i[0])*(n-i[0])+(r-i[2])*(r-i[2])<.65*.65){t=Math.min(t,.14);break}}}o[i]=(o[i]??0)+t}}c[i]=(c[i]??0)+1}let f=new Float32Array(i);for(let e=0;e<i;e++)a[e]===0&&c[e]>0&&(f[e]=o[e]/c[e]);let p=e.getIndex(),m=Math.floor(p?p.count/3:l/3),h=new Float32Array(i),g=new Float32Array(i),v=new Uint16Array(i);for(let e=0;e<4;e++){g.fill(0),v.fill(0);for(let e=0;e<m;e++){let t=p?p.getX(e*3):e*3,n=p?p.getX(e*3+1):e*3+1,i=p?p.getX(e*3+2):e*3+2,a=r[t],o=r[n],s=r[i],c=f[a],l=f[o],u=f[s];g[a]=(g[a]??0)+l+u,v[a]=(v[a]??0)+2,g[o]=(g[o]??0)+c+u,v[o]=(v[o]??0)+2,g[s]=(g[s]??0)+c+l,v[s]=(v[s]??0)+2}for(let e=0;e<i;e++)a[e]===1||v[e]===0?h[e]=0:h[e]=.45*f[e]+.55*(g[e]/v[e]);f.set(h)}_=new Float32Array(l);for(let e=0;e<l;e++){let t=r[e],n=a[t]===1?0:f[t];_[e]=n>=.032?n:0}}let T=new Y,D=new Y;for(let e=0;e<l;e++){let l=_?_[e]:0,u=r?r.hasCervicalBorder?r.isCervicalBorder[e]:1:0,d=a?a.get(e)?.[0]??0:0;if(l<=.025&&u===0&&d<=.025)continue;T.set(s.getX(e),s.getY(e),s.getZ(e)),D.set(c.getX(e),c.getY(e),c.getZ(e));let E=S>16&&(t?T.y>=h-1.8&&D.y>.65:T.y<=m+1.8&&D.y<-.65),O=S>12&&(t?T.y>=h-2.2:T.y<=m+2.2);if(E||O)continue;let k=T.x-v,A=T.z-y,j=Math.hypot(k,A),N=0,P=0,F=0,I=0,L=0;if(n.gingival.enabled&&u>0){let e=Math.atan2(k,A),i=w[Math.max(0,Math.min(119,Math.floor((e+b)/(2*b)*120)))],a=t?T.y-i:i-T.y;if(!(x&&(a<=1.2||a<=3.2&&(t?D.y<-.2:D.y>.2)))&&a>=2.2){let i=r.hasCervicalBorder?u:0;if(!r.hasCervicalBorder){let n=j>.001?(D.x*k+D.z*A)/j:0,r=t?5.4:4.8,o=Math.abs(e);o>.22&&o<.46?r+=.55:o>=.46&&(r-=.55);let s=Math.max(-.8,Math.min(.5,.4*Math.max(0,n))),c=r+s;a>=c-.45&&a<=c+.45&&(i=2)}if(i>0){let e=bh({x:T.x,y:T.y,z:T.z},t,C).fdi;if(!(n.gingival.excludeEdentulous&&e%10==8)){let e=i===2?1:.62,t=n.gingival.reliefMm*e;if(t>N){N=t,L=1;let e=Math.hypot(D.x,D.z);if(e<.15){let e=j>1e-4?1/j:1;P=k*e*t,I=A*e*t}else P=D.x/e*t,I=D.z/e*t}}}}}if(l>N){N=l,L=2;let e=Math.hypot(D.x,D.z);if(e>.15)P=D.x/e*l,I=D.z/e*l;else{let e=j>1e-4?1/j:1;P=k*e*l,I=A*e*l}F=0}if(d<-.002&&N>0){let e=Math.max(0,N+d);if(e<=.025)N=0,L=0,P=0,F=0,I=0;else{let t=e/N;N=e,P*=t,F*=t,I*=t}}else if(d>.025){let e=Math.min(2.5,d);P+=D.x*e,F+=D.y*e,I+=D.z*e,N=Math.min(2.5,Math.hypot(P,F,I)),L=3}N>.025&&(p[e]=N,i[e]=P,o[e]=F,f[e]=I,g[e]=L,M&&M.setXYZ(e,M.getX(e)+P,M.getY(e)+F,M.getZ(e)+I))}let O=new X(4906624),k=new X(5420793),N=new X(16096779),P=e.getIndex(),R=Math.floor(P?P.count/3:l/3),z=[];for(let e=0;e<R;e++){let t=P?P.getX(e*3):e*3,n=P?P.getX(e*3+1):e*3+1,r=P?P.getX(e*3+2):e*3+2,i=p[t],a=p[n],o=p[r];i<=.025&&a<=.025&&o<=.025||+(i>.025)+ +(a>.025)+ +(o>.025)==1&&Math.max(i,a,o)<.12||z.push(e)}if(z.length>0){F=new Float32Array(z.length*9),I=new Float32Array(z.length*9),L=new Float32Array(z.length*9);let e=0;for(let t=0;t<z.length;t++){let n=z[t],r=P?P.getX(n*3):n*3,a=P?P.getX(n*3+1):n*3+1,l=P?P.getX(n*3+2):n*3+2,u=g[r]===3||g[a]===3||g[l]===3?3:g[r]===2||g[a]===2||g[l]===2?2:1,d=u===3?N:u===2?k:O,m=[r,a,l];for(let t=0;t<3;t++){let n=m[t],r=c.getX(n),a=c.getY(n),l=c.getZ(n);p[n]>.025?(F[e]=s.getX(n)+i[n]+r*.02,F[e+1]=s.getY(n)+o[n]+a*.02,F[e+2]=s.getZ(n)+f[n]+l*.02):(F[e]=s.getX(n)-r*.03,F[e+1]=s.getY(n)-a*.03,F[e+2]=s.getZ(n)-l*.03),I[e]=r,I[e+1]=a,I[e+2]=l,L[e]=d.r,L[e+1]=d.g,L[e+2]=d.b,e+=3}}A+=z.length*.015}j&&M&&(M.needsUpdate=!0,j.computeVertexNormals())}let R=null,z=null,ee=0,B=D.length+F.length;if(B>0){let e=new Float32Array(B),t=new Float32Array(B),n=new Float32Array(B);D.length>0&&(e.set(D,0),t.set(O,0),n.set(k,0)),F.length>0&&(e.set(F,D.length),t.set(I,D.length),n.set(L,D.length)),R=new Er,R.setAttribute(`position`,new dr(e,3)),R.setAttribute(`normal`,new dr(t,3)),R.setAttribute(`color`,new dr(n,3));let r=1/0,i=-1/0,a=1/0,o=-1/0,s=1/0,c=-1/0;for(let t=0;t<e.length;t+=3){let n=e[t],l=e[t+1],u=e[t+2];n<r&&(r=n),n>i&&(i=n),l<a&&(a=l),l>o&&(o=l),u<s&&(s=u),u>c&&(c=u)}z={min:[parseFloat(r.toFixed(2)),parseFloat(a.toFixed(2)),parseFloat(s.toFixed(2))],max:[parseFloat(i.toFixed(2)),parseFloat(o.toFixed(2)),parseFloat(c.toFixed(2))]},ee=parseFloat(A.toFixed(1))}let te={modelBounds:{min:[parseFloat(f.toFixed(2)),parseFloat(m.toFixed(2)),parseFloat(g.toFixed(2))],max:[parseFloat(p.toFixed(2)),parseFloat(h.toFixed(2)),parseFloat(_.toFixed(2))]},waxBounds:z,totalContacts:E.length,sealedContacts:E.length,totalWaxVolumeMm3:ee,contacts:E},V=null;return!o?.skipMergedGeometry&&D.length>0&&(V=new Er,V.setAttribute(`position`,new dr(D,3)),V.setAttribute(`normal`,new dr(O,3))),{stageId:i,stageNumber:r,baseGeometry:e,waxGeometry:R,interproximalGeometry:V,mergedGeometry:j,survey:u,sculptDeltas:a,lastUpdated:Date.now(),fittingSummary:te}}var Jg=class{config={mode:`off`,radiusMm:3.5,strength:.5};scene;camera;domElement;targetMesh=null;secondaryMesh=null;baseGeometry=null;currentStageId=`stage-01`;activeDeltas=new Map;undoStack=[];redoStack=[];isSculptTabActive=!1;lastActiveBrush=`add`;altHeld=!1;shiftHeld=!1;orbitLocked=!1;cursorRing=null;raycaster=new Os;pointerPos=new J;isPointerDown=!1;hasStrokeModified=!1;strokeStrokeMode=`add`;onStrokeFinished;onOrbitLockChange;onConfigSync;onShortcutUndo;onShortcutRedo;constructor(e,t,n,r){this.scene=e,this.camera=t,this.domElement=n,typeof r==`function`?this.onStrokeFinished=r:r&&(this.onStrokeFinished=r.onStrokeFinished,this.onOrbitLockChange=r.onOrbitLockChange,this.onConfigSync=r.onConfigSync,this.onShortcutUndo=r.onShortcutUndo,this.onShortcutRedo=r.onShortcutRedo),this.createCursorRing(),this.bindEvents()}setSculptTabActive(e){this.isSculptTabActive=e,e?(this.syncCursorAppearance(),this.updateOrbitLock(this.shouldLockOrbitForAlt())):(this.altHeld=!1,this.shiftHeld=!1,this.cursorRing&&(this.cursorRing.visible=!1),this.updateOrbitLock(!1))}isAltQuickDrawActive(){return this.isSculptTabActive&&this.altHeld}getEffectiveMode(){return this.isPointerDown?this.shiftHeld?`smooth`:this.strokeStrokeMode:this.isSculptTabActive&&this.altHeld?this.shiftHeld?`smooth`:this.config.mode===`off`?this.lastActiveBrush:this.config.mode:this.config.mode===`off`?`off`:this.shiftHeld?`smooth`:this.config.mode}shouldLockOrbitForAlt(){return this.isPointerDown||this.isSculptTabActive&&this.altHeld}updateOrbitLock(e){this.orbitLocked!==e&&(this.orbitLocked=e,this.onOrbitLockChange?.(e))}syncCursorAppearance(){if(!this.cursorRing)return;let e=this.getEffectiveMode(),t=this.cursorRing.material;e===`add`?t.color.setHex(2278750):e===`remove`?t.color.setHex(15680580):e===`smooth`?t.color.setHex(3718648):t.color.setHex(16761095);let n=this.config.radiusMm;this.cursorRing.scale.set(n,n,n),e===`off`&&(this.cursorRing.visible=!1),this.domElement.style.cursor=e===`off`?`grab`:`crosshair`}setConfig(e){Object.assign(this.config,e),this.config.mode!==`off`&&(this.lastActiveBrush=this.config.mode),this.syncCursorAppearance(),this.onConfigSync?.(this.getConfig())}getConfig(){return{...this.config}}setTargetMesh(e,t=`stage-01`){this.targetMesh=e,this.currentStageId=t,e&&!this.baseGeometry&&(this.baseGeometry=e.geometry.clone())}setSecondaryMesh(e){this.secondaryMesh=e}setStageDeltas(e,t,n=!1){let r=e===this.currentStageId;this.currentStageId=e,this.activeDeltas=t?new Map(t):new Map,(!n||!r)&&(this.undoStack=[],this.redoStack=[])}getStageDeltas(){return new Map(this.activeDeltas)}clearAllDeltas(){return this.activeDeltas.size!==0&&(this.undoStack.push(new Map(this.activeDeltas)),this.undoStack.length>30&&this.undoStack.shift(),this.redoStack=[],this.activeDeltas.clear(),this.notifyStroke(!1),!0)}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}undo(){if(this.undoStack.length===0)return!1;let e=this.undoStack.pop();return this.redoStack.push(new Map(this.activeDeltas)),this.activeDeltas=e,this.notifyStroke(!1),!0}redo(){if(this.redoStack.length===0)return!1;let e=this.redoStack.pop();return this.undoStack.push(new Map(this.activeDeltas)),this.activeDeltas=e,this.notifyStroke(!1),!0}dispose(){this.updateOrbitLock(!1),this.unbindEvents(),this.cursorRing&&=(this.scene.remove(this.cursorRing),this.cursorRing.geometry.dispose(),this.cursorRing.material.dispose(),null)}createCursorRing(){let e=new Ba(.95,1,32).getAttribute(`position`),t=[];for(let n=0;n<e.count;n++)t.push(new Y(e.getX(n),e.getY(n),e.getZ(n)));let n=new Er().setFromPoints(t),r=new Ai({color:new X(2278750),depthTest:!1,transparent:!0,opacity:.9});this.cursorRing=new Ui(n,r),this.cursorRing.renderOrder=9999,this.cursorRing.visible=!1,this.scene.add(this.cursorRing)}onKeyDown=e=>{if(!this.isSculptTabActive)return;let t=e.target;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(e.key===`Alt`){this.altHeld||(this.altHeld=!0,this.syncCursorAppearance(),this.updateOrbitLock(!0));return}if(e.key===`Shift`){this.shiftHeld||(this.shiftHeld=!0,this.syncCursorAppearance());return}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()===`z`){e.preventDefault(),e.shiftKey?this.onShortcutRedo?this.onShortcutRedo():this.redo():this.onShortcutUndo?this.onShortcutUndo():this.undo();return}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()===`y`){e.preventDefault(),this.onShortcutRedo?this.onShortcutRedo():this.redo();return}if(e.key===`[`){let e=Math.max(1,Number((this.config.radiusMm-.5).toFixed(1)));this.setConfig({radiusMm:e});return}if(e.key===`]`){let e=Math.min(8,Number((this.config.radiusMm+.5).toFixed(1)));this.setConfig({radiusMm:e});return}e.key===`Escape`||e.key===`0`?this.setConfig({mode:`off`}):e.key===`1`?this.setConfig({mode:`add`}):e.key===`2`?this.setConfig({mode:`remove`}):e.key===`3`&&this.setConfig({mode:`smooth`})}};onKeyUp=e=>{e.key===`Alt`?(this.altHeld=!1,this.syncCursorAppearance(),this.isPointerDown||this.updateOrbitLock(!1)):e.key===`Shift`&&(this.shiftHeld=!1,this.syncCursorAppearance())};onWindowBlur=()=>{this.altHeld=!1,this.shiftHeld=!1,this.isPointerDown||(this.syncCursorAppearance(),this.updateOrbitLock(!1))};bindEvents(){this.onPointerMove=this.onPointerMove.bind(this),this.onPointerDown=this.onPointerDown.bind(this),this.onPointerUp=this.onPointerUp.bind(this),this.domElement.addEventListener(`pointermove`,this.onPointerMove,{capture:!0,passive:!1}),this.domElement.addEventListener(`pointerdown`,this.onPointerDown,{capture:!0,passive:!1}),window.addEventListener(`pointerup`,this.onPointerUp,{capture:!0}),window.addEventListener(`pointercancel`,this.onPointerUp,{capture:!0}),typeof window<`u`&&(window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`keyup`,this.onKeyUp),window.addEventListener(`blur`,this.onWindowBlur))}unbindEvents(){this.domElement.removeEventListener(`pointermove`,this.onPointerMove,{capture:!0}),this.domElement.removeEventListener(`pointerdown`,this.onPointerDown,{capture:!0}),window.removeEventListener(`pointerup`,this.onPointerUp,{capture:!0}),window.removeEventListener(`pointercancel`,this.onPointerUp,{capture:!0}),typeof window<`u`&&(window.removeEventListener(`keydown`,this.onKeyDown),window.removeEventListener(`keyup`,this.onKeyUp),window.removeEventListener(`blur`,this.onWindowBlur))}updatePointerCoord(e){let t=this.domElement.getBoundingClientRect();this.pointerPos.x=(e.clientX-t.left)/t.width*2-1,this.pointerPos.y=-((e.clientY-t.top)/t.height)*2+1}getRaycastTargets(){let e=[];return this.targetMesh&&this.targetMesh.visible&&e.push(this.targetMesh),this.secondaryMesh&&this.secondaryMesh.visible&&e.push(this.secondaryMesh),e}onPointerMove(e){this.isSculptTabActive&&(e.altKey!==this.altHeld||e.shiftKey!==this.shiftHeld)&&(this.altHeld=e.altKey,this.shiftHeld=e.shiftKey,this.syncCursorAppearance(),this.updateOrbitLock(this.shouldLockOrbitForAlt()));let t=this.getEffectiveMode();if(t===`off`||!this.targetMesh)return;this.isPointerDown&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()),this.updatePointerCoord(e),this.raycaster.setFromCamera(this.pointerPos,this.camera);let n=this.getRaycastTargets(),r=this.raycaster.intersectObjects(n,!1);if(r.length>0&&r[0]){let e=r[0];if(this.cursorRing){if(this.cursorRing.visible=!0,e.face){let t=e.object,n=e.face.normal.clone().transformDirection(t.matrixWorld).normalize();this.cursorRing.position.copy(e.point).addScaledVector(n,.08),this.cursorRing.quaternion.setFromUnitVectors(new Y(0,0,1),n)}else this.cursorRing.position.copy(e.point)}this.isPointerDown&&this.applyBrushStroke(e.point,t)}else this.cursorRing&&!this.isPointerDown&&(this.cursorRing.visible=!1)}onPointerDown(e){this.isSculptTabActive&&(this.altHeld=e.altKey,this.shiftHeld=e.shiftKey,this.syncCursorAppearance());let t=this.getEffectiveMode();if(t===`off`||!this.targetMesh||e.button!==0&&e.pointerType===`mouse`)return;this.updatePointerCoord(e),this.raycaster.setFromCamera(this.pointerPos,this.camera);let n=this.getRaycastTargets(),r=this.raycaster.intersectObjects(n,!1);if(r.length>0&&r[0]){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),this.strokeStrokeMode=t,this.updateOrbitLock(!0);try{this.domElement.setPointerCapture(e.pointerId)}catch{}this.undoStack.push(new Map(this.activeDeltas)),this.undoStack.length>30&&this.undoStack.shift(),this.redoStack=[],this.isPointerDown=!0,this.hasStrokeModified=!1,this.applyBrushStroke(r[0].point,t)}else this.altHeld&&(e.preventDefault(),e.stopPropagation(),this.updateOrbitLock(!0))}onPointerUp(e){if(this.isPointerDown){if(this.isPointerDown=!1,e)try{this.domElement.releasePointerCapture(e.pointerId)}catch{}this.updateOrbitLock(this.isSculptTabActive&&this.altHeld),this.syncCursorAppearance(),this.hasStrokeModified&&this.notifyStroke(!1)}}lastStrokeUpdateTime=0;applyBrushStroke(e,t){if(!this.targetMesh)return;let n=this.targetMesh.geometry.getAttribute(`position`);if(!n)return;let r=e.clone();this.targetMesh.worldToLocal(r);let i=this.config.radiusMm,a=i*i,o=this.config.strength,s=n.count,c=new Y,l=[],u=[],d=0;for(let e=0;e<s;e++){c.set(n.getX(e),n.getY(e),n.getZ(e));let t=c.distanceToSquared(r);if(t<=a){let n=Math.max(0,1-Math.sqrt(t)/i),r=n*n;l.push(e),u.push(r);let a=this.activeDeltas.get(e);d+=a?a[0]:0}}if(l.length===0)return;let f=d/l.length;for(let e=0;e<l.length;e++){let n=l[e],r=u[e],i=o*r*.08,a=this.activeDeltas.get(n)||[0,0,0];if(t===`add`)a[0]=Math.min(2.5,a[0]+i);else if(t===`remove`)a[0]=Math.max(-2.5,a[0]-i);else if(t===`smooth`){let e=o*r*.4;a[0]=a[0]*(1-e)+f*e}Math.abs(a[0])<.002?this.activeDeltas.delete(n):this.activeDeltas.set(n,a)}this.hasStrokeModified=!0;let p=typeof performance<`u`?performance.now():Date.now();p-this.lastStrokeUpdateTime>90&&(this.lastStrokeUpdateTime=p,this.notifyStroke(!0))}notifyStroke(e=!1){this.onStrokeFinished&&this.onStrokeFinished({stageId:this.currentStageId,affectedVerticesCount:this.activeDeltas.size,deltas:new Map(this.activeDeltas),isLivePreview:e})}},Yg=class{parse(e,t={}){t=Object.assign({binary:!1},t);let n=t.binary,r=[],i=0;e.traverse(function(e){if(e.isMesh){let t=e.geometry,n=t.index,a=t.getAttribute(`position`);i+=n===null?a.count/3:n.count/3,r.push({object3d:e,geometry:t})}});let a,o=80;if(n===!0){let e=i*2+i*3*4*4+80+4,t=new ArrayBuffer(e);a=new DataView(t),a.setUint32(o,i,!0),o+=4}else a=``,a+=`solid exported
`;let s=new Y,c=new Y,l=new Y,u=new Y,d=new Y,f=new Y;for(let e=0,t=r.length;e<t;e++){let t=r[e].object3d,n=r[e].geometry,i=n.index,a=n.getAttribute(`position`);if(i!==null)for(let e=0;e<i.count;e+=3)p(i.getX(e+0),i.getX(e+1),i.getX(e+2),a,t);else for(let e=0;e<a.count;e+=3)p(e+0,e+1,e+2,a,t)}return n===!1&&(a+=`endsolid exported
`),a;function p(e,t,r,i,u){s.fromBufferAttribute(i,e),c.fromBufferAttribute(i,t),l.fromBufferAttribute(i,r),u.isSkinnedMesh===!0&&(u.applyBoneTransform(e,s),u.applyBoneTransform(t,c),u.applyBoneTransform(r,l)),s.applyMatrix4(u.matrixWorld),c.applyMatrix4(u.matrixWorld),l.applyMatrix4(u.matrixWorld),m(s,c,l),h(s),h(c),h(l),n===!0?(a.setUint16(o,0,!0),o+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function m(e,t,r){u.subVectors(r,t),d.subVectors(e,t),u.cross(d).normalize(),f.copy(u).normalize(),n===!0?(a.setFloat32(o,f.x,!0),o+=4,a.setFloat32(o,f.y,!0),o+=4,a.setFloat32(o,f.z,!0),o+=4):(a+=`	facet normal `+f.x+` `+f.y+` `+f.z+`
`,a+=`		outer loop
`)}function h(e){n===!0?(a.setFloat32(o,e.x,!0),o+=4,a.setFloat32(o,e.y,!0),o+=4,a.setFloat32(o,e.z,!0),o+=4):a+=`			vertex `+e.x+` `+e.y+` `+e.z+`
`}}};function Xg(e,t){let n=e.clone();if(t.shrinkageScalePercent&&t.shrinkageScalePercent!==100){let e=t.shrinkageScalePercent/100;n.center(),n.scale(e,e,e)}return t.drainHoles&&t.drainHoles.length>0&&Zg(n,t.drainHoles),n.computeVertexNormals(),n}function Zg(e,t){let n=e.getAttribute(`position`);if(!n)return;e.computeBoundingBox();let r=e.boundingBox,i=n.count,a=new Y;for(let e of t){let t=new Y(...e.position),o=Math.max(.5,e.diameterMm/2),s=new Y(...e.normal);s.lengthSq()<1e-6&&s.set(0,1,0),s.normalize();let c=t.y;r&&(s.y<0&&r.max.y-t.y>4?c=r.max.y:s.y>0&&t.y-r.min.y>4&&(c=r.min.y));let l=5.5;for(let e=0;e<i;e++){a.set(n.getX(e),n.getY(e),n.getZ(e));let r=Math.abs(a.y-c);if(r>l)continue;let i=Math.hypot(a.x-t.x,a.z-t.z);if(i<=o*1.18){let t=Math.max(0,1-i/(o*1.18)),c=1-r/l,u=Math.min(3.5,t*2.8*c+(i<=o?.6:0));n.setXYZ(e,a.x-s.x*u,a.y-s.y*u,a.z-s.z*u)}}}n.needsUpdate=!0}function Qg(e,t=`dental_model`){let n=new Yg,r=new $r(e,new Vr);r.name=t;let i=n.parse(r,{binary:!0});return i instanceof DataView?new Uint8Array(i.buffer,i.byteOffset,i.byteLength):new Uint8Array(i)}function $g(e){let t=e.mergedGeometry||e.baseGeometry,n=e.interproximalGeometry;if(!n)return t;let r=n.getAttribute(`position`),i=n.getAttribute(`normal`);if(!r||r.count===0)return t;let a=t.getIndex()?t.toNonIndexed():t,o=a.getAttribute(`position`);if(!o)return t;let s=a.getAttribute(`normal`),c=o.count*3,l=r.count*3,u=new Float32Array(c+l);u.set(o.array,0),u.set(r.array,c);let d=new Float32Array(c+l);s&&s.count===o.count&&d.set(s.array,0),i&&i.count===r.count&&d.set(i.array,c);let f=new Er;return f.setAttribute(`position`,new dr(u,3)),f.setAttribute(`normal`,new dr(d,3)),(!s||s.count!==o.count||!i)&&f.computeVertexNormals(),f}function e_(e,t){let n=[],r=Math.min(3,Math.ceil(Math.sqrt(e.length))),i=0,a=0,o=0,s=0;for(let c of e){let e=Xg($g(c),t);e.computeBoundingBox();let l=e.boundingBox||new qn,u=l.max.x-l.min.x,d=l.max.z-l.min.z,f=new Y;l.getCenter(f),e.translate(-f.x,-l.min.y,-f.z),e.translate(a+u/2,0,o+d/2),n.push(e),s++,a+=u+6,d>i&&(i=d),s>=r&&(s=0,a=0,o+=i+6,i=0)}return n.length===0?null:Qf(n,!1)}async function t_(e,t,n,r,i){let a=e.replace(/[^a-zA-Z0-9_-]/g,`_`),o={},s=n.length;for(let e=0;e<s;e++){let c=n[e],l=`${a}_${t}_Stage_${String(c.stageNumber).padStart(2,`0`)}_Blocked.stl`;o[l]=Qg(Xg($g(c),r),l),i&&i(e+1,s)}let c=_h(o,{level:6});return new Blob([c],{type:`application/zip`})}function n_(e,t){let n=e instanceof Blob?e:new Blob([e]),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),setTimeout(()=>URL.revokeObjectURL(r),2e3)}function r_(e,t,n){let r=e.getAttribute(`position`);if(!r||r.count===0||n.length===0)return[];let i=r.count,a=[],o=0,s=0;for(let e of n)o+=e.position[0],s+=e.position[1];let c=o/n.length;for(let e of n){let[n,o,s]=e.position,l=new Y(n,o,s),u=new Y(e.normal[0],0,e.normal[2]).normalize();u.lengthSq()<1e-4&&u.set(1,0,0);let d=new Y(-u.z,0,u.x).normalize(),f=new Y(n-c,0,s);d.dot(f)<0&&d.negate();let p=d.clone().negate(),m=t?o+3.8:o-3.8,h=0,g=0;for(let e=0;e<i;e+=2){let i=r.getX(e),a=r.getY(e),c=r.getZ(e),l=i-n,u=c-s;if(Math.sqrt(l*l+u*u)<1.6){let e=t?a-o:o-a;e>=2&&e<=5.5&&(h+=a,g++)}}if(g>5){let e=h/g,n=Math.abs(e-o),r=Math.max(2.5,Math.min(4.8,n));m=t?o+r:o-r}let _=new Y(n+u.x*.1,m,s+u.z*.1),v=Math.abs(_.y-l.y),y=Math.abs(e.toothA%10)<=3&&Math.abs(e.toothB%10)<=3,b=Math.abs(e.toothA%10)>=6||Math.abs(e.toothB%10)>=6,x=y?.8:b?1.5:1.1,S=e.buccalWidthMm&&e.buccalWidthMm>0?e.buccalWidthMm:y?2.2:b?4.2:3.2,C=e.lingualWidthMm&&e.lingualWidthMm>0?e.lingualWidthMm:y?4.8:b?6.8:5.5,w=parseFloat((x*2).toFixed(1)),T=parseFloat((S+C).toFixed(1)),E=[],D=[],O=[],k=[];for(let e=0;e<=10;e++){let t=e/10,n=new Y().lerpVectors(l,_,t),r=x*Math.sqrt(t),i=S*Math.sin(t*Math.PI/2),a=C*Math.sin(t*Math.PI/2),o=n.clone().addScaledVector(u,-r).addScaledVector(d,i),s=n.clone().addScaledVector(u,-r).addScaledVector(p,a),c=n.clone().addScaledVector(u,r).addScaledVector(d,i),f=n.clone().addScaledVector(u,r).addScaledVector(p,a);E.push(o),D.push(c),O.push(s),k.push(f)}let A=[];A.push([l.x,l.y,l.z]);for(let e=1;e<=10;e++){let t=E[e];A.push([parseFloat(t.x.toFixed(2)),parseFloat(t.y.toFixed(2)),parseFloat(t.z.toFixed(2))])}for(let e=10;e>=1;e--){let t=D[e];A.push([parseFloat(t.x.toFixed(2)),parseFloat(t.y.toFixed(2)),parseFloat(t.z.toFixed(2))])}let j=[];j.push([l.x,l.y,l.z]);for(let e=1;e<=10;e++){let t=O[e];j.push([parseFloat(t.x.toFixed(2)),parseFloat(t.y.toFixed(2)),parseFloat(t.z.toFixed(2))])}for(let e=10;e>=1;e--){let t=k[e];j.push([parseFloat(t.x.toFixed(2)),parseFloat(t.y.toFixed(2)),parseFloat(t.z.toFixed(2))])}let M=[];for(let e of[3,6,10]){let t=E[e],n=O[e],r=D[e],i=k[e];M.push(t.x,t.y,t.z,n.x,n.y,n.z),M.push(r.x,r.y,r.z,i.x,i.y,i.z),e===10&&(M.push(t.x,t.y,t.z,r.x,r.y,r.z),M.push(n.x,n.y,n.z,i.x,i.y,i.z))}let N=[];for(let e=0;e<10;e++){let t=E[e],n=E[e+1],r=D[e],i=D[e+1];N.push(t.x,t.y,t.z,r.x,r.y,r.z,i.x,i.y,i.z,t.x,t.y,t.z,i.x,i.y,i.z,n.x,n.y,n.z);let a=O[e],o=O[e+1],s=k[e],c=k[e+1];N.push(a.x,a.y,a.z,s.x,s.y,s.z,c.x,c.y,c.z,a.x,a.y,a.z,c.x,c.y,c.z,o.x,o.y,o.z)}a.push({id:`silhouette-${e.contactKey}`,contactKey:e.contactKey,label:e.label,toothA:e.toothA,toothB:e.toothB,apex:[parseFloat(l.x.toFixed(2)),parseFloat(l.y.toFixed(2)),parseFloat(l.z.toFixed(2))],papillaBase:[parseFloat(_.x.toFixed(2)),parseFloat(_.y.toFixed(2)),parseFloat(_.z.toFixed(2))],heightMm:parseFloat(v.toFixed(1)),spanMm:w,depthMm:T,buccalWidthMm:parseFloat(S.toFixed(2)),lingualWidthMm:parseFloat(C.toFixed(2)),buccalLoop:A,lingualLoop:j,ribLines:M,ribbonTriangles:N})}return a}function i_(e,t=!1,n=!1){let r=new wn;r.name=`embrasure-${e.contactKey}`;let i=t?new X(16498468):n?new X(3718648):new X(440020),a=t?.35:n?.28:.16,o=new Er,s=[];for(let t of e.buccalLoop)s.push(t[0],t[1],t[2]);o.setAttribute(`position`,new dr(new Float32Array(s),3));let c=new Ai({color:i,linewidth:t?3:1.5,transparent:!0,opacity:t?.95:.75}),l=new Ui(o,c);l.renderOrder=30,r.add(l);let u=new Er,d=[];for(let t of e.lingualLoop)d.push(t[0],t[1],t[2]);u.setAttribute(`position`,new dr(new Float32Array(d),3));let f=new Ui(u,c);if(f.renderOrder=30,r.add(f),e.ribLines.length>0){let n=new Er;n.setAttribute(`position`,new dr(new Float32Array(e.ribLines),3));let a=new Hi(n,new Ai({color:i,linewidth:1,transparent:!0,opacity:t?.75:.45}));a.renderOrder=29,r.add(a)}if(e.ribbonTriangles.length>0){let t=new Er;t.setAttribute(`position`,new dr(new Float32Array(e.ribbonTriangles),3)),t.computeVertexNormals();let n=new $r(t,new Vr({color:i,transparent:!0,opacity:a,side:2,depthWrite:!1}));n.renderOrder=25,r.add(n)}return r}var a_=class{viewport;manifest;container=null;panelEl=null;dockEl=null;expandPillEl=null;isMinimized=!1;isUpper=!0;currentStageIndex=0;isBatchProcessing=!1;protocol={insertionAxis:{x:0,y:-1,z:0,tiltX:0,tiltY:0},interproximal:{enabled:!0,thicknessMm:.6,bridgeSpaces:!1},singleGapFocusKey:`all`,selectedContactKey:null,gingival:{enabled:!1,reliefMm:.3,excludeEdentulous:!0},undercut:{enabled:!1,maxDepthMm:.25,draftAngleDeg:2,perTooth:{}},printPrep:{shrinkageScalePercent:100.5,drainHoles:[]}};stageResults=new Map;stageSculptDeltas=new Map;threeScene=null;threeCamera=null;waxMesh=null;waxMaterial;sculptor=null;contactMarkersGroup=null;embrasureSilhouettesGroup=null;showEmbrasureSilhouettes=!1;showContactMarkers=!1;selectedContactKey=null;silhouettes=[];activeDraggedMarker=null;hoveredMarker=null;markerRaycaster=new Os;markerPointerPos=new J;onPointerMoveBound=null;onPointerDownBound=null;onPointerUpBound=null;onDblClickBound=null;activeTab=`blockout`;showHeatmap=!1;showWaxOverlay=!0;isPlaying=!1;playIntervalId=null;sliderDebounceId=null;onExitCallback;onStageChangeCallback;onArchChangeCallback;onTabChangeCallback;constructor(e){this.viewport=e.viewport,this.manifest=e.manifest,this.isUpper=!e.initialArch||e.initialArch===`upper`,this.currentStageIndex=e.initialStageIndex??0,this.onExitCallback=e.onExit,this.onStageChangeCallback=e.onStageChange,this.onArchChangeCallback=e.onArchChange,this.onTabChangeCallback=e.onTabChange,this.threeScene=this.viewport.getThreeScene?this.viewport.getThreeScene():null,this.threeCamera=this.viewport.getThreeCamera?this.viewport.getThreeCamera():null,this.waxMaterial=new $a({color:new X(16777215),vertexColors:!0,roughness:.3,metalness:.02,clearcoat:.38,clearcoatRoughness:.24,sheen:.16,sheenRoughness:.4,sheenColor:new X(16777215),transparent:!1,opacity:1,side:2,depthTest:!0,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2})}mount(e){this.container=e;try{this.initWaxMesh()}catch(e){console.warn(`initWaxMesh warning:`,e)}try{this.initSculptor()}catch(e){console.warn(`initSculptor warning:`,e)}try{this.initMarkerInteraction()}catch(e){console.warn(`initMarkerInteraction warning:`,e)}this.renderUI();try{this.loadCurrentStageBlockout()}catch(e){console.warn(`loadCurrentStageBlockout warning:`,e)}}unmount(){this.stopPlayback(),this.sliderDebounceId!==null&&(clearTimeout(this.sliderDebounceId),this.sliderDebounceId=null);let e=this.getCanvasDomElement();e&&(this.onPointerMoveBound&&e.removeEventListener(`pointermove`,this.onPointerMoveBound),this.onPointerDownBound&&e.removeEventListener(`pointerdown`,this.onPointerDownBound),this.onPointerUpBound&&(e.removeEventListener(`pointerup`,this.onPointerUpBound),e.removeEventListener(`pointercancel`,this.onPointerUpBound)),this.onDblClickBound&&e.removeEventListener(`dblclick`,this.onDblClickBound),e.style.cursor=`default`);let t=this.viewport.getControls?this.viewport.getControls():null;if(t&&(t.enabled=!0),this.sculptor&&=(this.sculptor.dispose(),null),this.waxMesh&&=(this.waxMesh.parent?this.waxMesh.parent.remove(this.waxMesh):this.threeScene&&this.threeScene.remove(this.waxMesh),this.waxMesh.geometry.dispose(),null),this.contactMarkersGroup){for(this.contactMarkersGroup.parent?this.contactMarkersGroup.parent.remove(this.contactMarkersGroup):this.threeScene&&this.threeScene.remove(this.contactMarkersGroup);this.contactMarkersGroup.children.length>0;){let e=this.contactMarkersGroup.children[0];this.contactMarkersGroup.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}this.contactMarkersGroup=null}if(this.embrasureSilhouettesGroup){for(this.embrasureSilhouettesGroup.parent?this.embrasureSilhouettesGroup.parent.remove(this.embrasureSilhouettesGroup):this.threeScene&&this.threeScene.remove(this.embrasureSilhouettesGroup);this.embrasureSilhouettesGroup.children.length>0;){let e=this.embrasureSilhouettesGroup.children[0];this.embrasureSilhouettesGroup.remove(e),e.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){let t=e.material;Array.isArray(t)?t.forEach(e=>e.dispose()):t.dispose()}})}this.embrasureSilhouettesGroup=null}this.panelEl&&this.panelEl.parentNode&&(this.panelEl.parentNode.removeChild(this.panelEl),this.panelEl=null),this.dockEl&&this.dockEl.parentNode&&(this.dockEl.parentNode.removeChild(this.dockEl),this.dockEl=null),this.expandPillEl&&this.expandPillEl.parentNode&&(this.expandPillEl.parentNode.removeChild(this.expandPillEl),this.expandPillEl=null),this.restoreBaseColors()}exit(){this.unmount(),this.onExitCallback&&this.onExitCallback()}setMinimized(e){this.isMinimized=e,this.panelEl?.classList.toggle(`bo-studio-panel--minimized`,e),this.expandPillEl&&this.expandPillEl.classList.toggle(`bo-expand-pill--visible`,e),this.dockEl?.classList.toggle(`bo-bottom-dock--centered`,e)}toggleMinimized(){return this.setMinimized(!this.isMinimized),this.isMinimized}isPanelMinimized(){return this.isMinimized}setActiveTab(e){this.activeTab=e,this.isMinimized&&this.setMinimized(!1),this.sculptor?.setSculptTabActive(e===`sculpt`),this.updateActiveTabPanes(),this.onTabChangeCallback&&this.onTabChangeCallback(e)}getActiveTab(){return this.activeTab}toggleWaxOverlay(e){return this.showWaxOverlay=typeof e==`boolean`?e:!this.showWaxOverlay,this.waxMesh&&(this.waxMesh.visible=this.showWaxOverlay),this.contactMarkersGroup&&(this.contactMarkersGroup.visible=this.showWaxOverlay&&this.showContactMarkers),this.embrasureSilhouettesGroup&&(this.embrasureSilhouettesGroup.visible=this.showWaxOverlay&&this.showEmbrasureSilhouettes),this.syncOverlayCheckboxes(),this.showWaxOverlay}toggleEmbrasureSilhouettes(e){return this.showEmbrasureSilhouettes=typeof e==`boolean`?e:!this.showEmbrasureSilhouettes,this.embrasureSilhouettesGroup&&(this.embrasureSilhouettesGroup.visible=this.showEmbrasureSilhouettes&&this.showWaxOverlay),this.syncOverlayCheckboxes(),this.showEmbrasureSilhouettes}toggleContactMarkers(e){return this.showContactMarkers=typeof e==`boolean`?e:!this.showContactMarkers,this.contactMarkersGroup&&(this.contactMarkersGroup.visible=this.showWaxOverlay&&this.showContactMarkers),this.syncOverlayCheckboxes(),this.showContactMarkers}selectContact(e){this.selectedContactKey=e,this.highlightActiveSilhouette(e),this.contactMarkersGroup&&this.contactMarkersGroup.children.forEach(t=>{let n=t;n.userData?.contactKey===e?(n.material.color.set(16436245),n.material.emissive.set(14251782)):(n.material.color.set(15040905),n.material.emissive.set(10305866))}),this.container?.querySelectorAll(`.bo-contact-row`).forEach(t=>{let n=t.getAttribute(`data-contact-key`)===e;t.style.background=n?`rgba(245, 158, 11, 0.18)`:``,t.style.borderLeft=n?`3px solid #facc15`:``});let t=this.container?.querySelector(`.bo-wax-focus-pill`);t&&this.protocol.singleGapFocusKey!==`all`&&e&&(t.innerHTML=`Active Focus: <strong style="color:#facc15;">${e}</strong> <span style="color:#64748b;">(Click any row or 3D sphere to inspect another gap)</span>`),this.protocol.selectedContactKey=e,this.protocol.singleGapFocusKey!==`all`&&e?this.protocol.singleGapFocusKey!==e&&(this.protocol.singleGapFocusKey=e,this.recomputeCurrentBlockout()):e&&this.recomputeCurrentBlockout()}highlightActiveSilhouette(e){this.embrasureSilhouettesGroup&&this.embrasureSilhouettesGroup.children.forEach(t=>{let n=t.name===`embrasure-${e}`,r=n?new X(16498468):new X(440020),i=n?.38:.16;t.traverse(e=>{if(e.isLine||e.isLineSegments){let t=e.material;t.color.copy(r),t.opacity=n?.95:.75}else if(e.isMesh){let t=e.material;t.color.copy(r),t.opacity=i}})})}toggleHeatmap(e){return this.showHeatmap=typeof e==`boolean`?e:!this.showHeatmap,this.loadCurrentStageBlockout(),this.syncOverlayCheckboxes(),this.showHeatmap}getArch(){return this.isUpper?`upper`:`lower`}getStageIndex(){return this.currentStageIndex}setArch(e){if(e===`upper`!==this.isUpper){if(this.isUpper=e===`upper`,this.protocol.singleGapFocusKey&&this.protocol.singleGapFocusKey!==`all`){let e=this.isUpper?`11-21`:`41-31`;this.selectedContactKey=e,this.protocol.selectedContactKey=e,this.protocol.singleGapFocusKey=e}else this.selectedContactKey=null,this.protocol.selectedContactKey=null;this.stopPlayback(),this.protocol.insertionAxis.y=this.isUpper?-1:1,this.stageResults.clear(),this.stageSculptDeltas.clear(),this.waxMesh&&this.waxMesh.parent&&this.waxMesh.parent.remove(this.waxMesh),this.contactMarkersGroup&&this.contactMarkersGroup.parent&&this.contactMarkersGroup.parent.remove(this.contactMarkersGroup),this.embrasureSilhouettesGroup&&this.embrasureSilhouettesGroup.parent&&this.embrasureSilhouettesGroup.parent.remove(this.embrasureSilhouettesGroup),this.onArchChangeCallback&&this.onArchChangeCallback(e),this.loadCurrentStageBlockout(),this.updateUI()}}setStageIndex(e){e!==this.currentStageIndex&&(this.currentStageIndex=e,this.loadCurrentStageBlockout(),this.updateUI(),this.onStageChangeCallback&&this.onStageChangeCallback(e))}initWaxMesh(){if(!this.threeScene)return;let e=new Er;this.waxMesh=new $r(e,this.waxMaterial),this.waxMesh.name=`digital-wax-overlay`,this.waxMesh.renderOrder=20,this.threeScene.add(this.waxMesh),this.sculptor?.setSecondaryMesh(this.waxMesh)}initSculptor(){if(!this.threeScene||!this.threeCamera||!this.container)return;let e=this.container.querySelector(`canvas`)||this.container;this.sculptor=new Jg(this.threeScene,this.threeCamera,e,{onStrokeFinished:e=>{this.stageSculptDeltas.set(this.currentStageIndex,e.deltas),this.recomputeCurrentBlockout(),this.updateUndoRedoButtons()},onOrbitLockChange:e=>{let t=this.viewport.getControls?this.viewport.getControls():null;t&&(t.enabled=!e);let n=this.panelEl?.querySelector(`.bo-sculpt-status-pill`);if(n&&this.sculptor){let e=this.sculptor.getEffectiveMode();n.textContent=this.sculptor.isAltQuickDrawActive()?`Alt Held: ${e===`smooth`?`Smoothing`:e===`remove`?`Carving`:`Quick Drawing`} (Camera Locked)`:e===`off`?`Mode: Orbit Camera (Hold Alt + Drag to Draw)`:`Active Brush: ${e===`add`?`+ Add Wax`:e===`remove`?`- Carve Wax`:`~ Smooth`} (Drag on Teeth)`}},onConfigSync:e=>{if(!this.panelEl)return;this.panelEl.querySelectorAll(`.bo-mode-btn`).forEach(t=>{t.classList.toggle(`bo-mode-btn--active`,t.dataset.mode===e.mode)});let t=this.panelEl.querySelector(`.bo-range-radius`),n=this.panelEl.querySelector(`.bo-val-radius`);t&&(t.value=String(e.radiusMm)),n&&(n.textContent=`${e.radiusMm.toFixed(1)} mm`);let r=this.panelEl.querySelector(`.bo-sculpt-status-pill`);r&&(r.textContent=e.mode===`off`?`Mode: Orbit Camera (Hold Alt + Drag to Draw)`:`Active Brush: ${e.mode===`add`?`+ Add Wax`:e.mode===`remove`?`- Carve Wax`:`~ Smooth`} (Drag on Teeth)`)},onShortcutUndo:()=>this.sculptor?.undo()?(this.updateUndoRedoButtons(),!0):!1,onShortcutRedo:()=>this.sculptor?.redo()?(this.updateUndoRedoButtons(),!0):!1}),this.sculptor.setSculptTabActive(this.activeTab===`sculpt`)}getLayerId(){return this.isUpper?`upper-arch`:`lower-arch`}getBaseGeometry(){if(!this.viewport.getLayerGeometry)return null;let e=this.viewport.getLayerGeometry(this.getLayerId());if(e){let t=e.getAttribute(`position`);t&&(!e.userData.pristinePositions||e.userData.pristinePositions.length!==t.array.length?e.userData.pristinePositions=new Float32Array(t.array):(t.array.set(e.userData.pristinePositions),t.needsUpdate=!0))}return e}reloadCurrentStage(){this.stageResults.delete(this.currentStageIndex),this.loadCurrentStageBlockout(),this.updateUI()}loadCurrentStageBlockout(){let e=this.getBaseGeometry();if(!e)return;let t=this.currentStageIndex+1,n=`stage-${String(t).padStart(2,`0`)}`,r=this.stageResults.get(this.currentStageIndex);if(!r){let i=this.stageSculptDeltas.get(this.currentStageIndex);r=qg(e,this.isUpper,this.protocol,t,n,i,{skipMergedGeometry:!0}),this.stageResults.set(this.currentStageIndex,r)}this.applyResultTo3D(r)}scheduleRecomputeDebounced(e=60){this.sliderDebounceId!==null&&clearTimeout(this.sliderDebounceId),this.sliderDebounceId=setTimeout(()=>{this.sliderDebounceId=null,this.recomputeCurrentBlockout()},e)}isWaxGeomCachedElsewhere(e){for(let t of this.stageResults.values())if(t.waxGeometry===e)return!0;return!1}recomputeCurrentBlockout(){let e=this.getBaseGeometry();if(!e)return;let t=this.currentStageIndex+1,n=`stage-${String(t).padStart(2,`0`)}`,r=this.stageSculptDeltas.get(this.currentStageIndex),i=qg(e,this.isUpper,this.protocol,t,n,r,{skipMergedGeometry:!0});this.stageResults.set(this.currentStageIndex,i),this.applyResultTo3D(i)}applyResultTo3D(e){let t=this.viewport.getLayerMesh?this.viewport.getLayerMesh(this.getLayerId()):null;t&&(t.visible=!0),this.waxMesh&&(t&&this.waxMesh.parent!==t&&(this.waxMesh.parent&&this.waxMesh.parent.remove(this.waxMesh),t.add(this.waxMesh),this.waxMesh.position.set(0,0,0),this.waxMesh.rotation.set(0,0,0),this.waxMesh.scale.set(1,1,1)),this.showWaxOverlay&&e.waxGeometry?(this.waxMesh.geometry!==e.waxGeometry&&!this.isWaxGeomCachedElsewhere(this.waxMesh.geometry)&&this.waxMesh.geometry.dispose(),this.waxMesh.geometry=e.waxGeometry,this.waxMesh.visible=!0):this.waxMesh.visible=!1),this.contactMarkersGroup||(this.contactMarkersGroup=new wn,this.contactMarkersGroup.name=`contact-markers-group`);let n=t||this.threeScene;for(n&&this.contactMarkersGroup.parent!==n&&(this.contactMarkersGroup.parent&&this.contactMarkersGroup.parent.remove(this.contactMarkersGroup),n.add(this.contactMarkersGroup),this.contactMarkersGroup.position.set(0,0,0),this.contactMarkersGroup.rotation.set(0,0,0),this.contactMarkersGroup.scale.set(1,1,1));this.contactMarkersGroup.children.length>0;){let e=this.contactMarkersGroup.children[0];this.contactMarkersGroup.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}if(this.showWaxOverlay&&e.fittingSummary?.contacts&&e.fittingSummary.contacts.length>0){let t=new Va(.24,16,16),n=this.selectedContactKey||(this.isUpper?`11-21`:`41-31`);for(let r of e.fittingSummary.contacts){let e=!!this.protocol.contactOverrides?.[r.contactKey],i=r.contactKey===n,a=new $r(t,new Qa({color:i?16436245:15040905,emissive:i?14251782:e?16007006:10305866,emissiveIntensity:i||e?1:.8,roughness:.2,metalness:.1}));a.position.set(r.contactPoint[0],r.contactPoint[1],r.contactPoint[2]),a.name=`contact-marker-${r.contactKey}`,a.userData={contactKey:r.contactKey,contact:r,isCustom:e},this.contactMarkersGroup.add(a)}this.contactMarkersGroup.visible=this.showWaxOverlay&&this.showContactMarkers}else this.contactMarkersGroup.visible=!1;for(this.embrasureSilhouettesGroup||(this.embrasureSilhouettesGroup=new wn,this.embrasureSilhouettesGroup.name=`embrasure-silhouettes-group`),n&&this.embrasureSilhouettesGroup.parent!==n&&(this.embrasureSilhouettesGroup.parent&&this.embrasureSilhouettesGroup.parent.remove(this.embrasureSilhouettesGroup),n.add(this.embrasureSilhouettesGroup),this.embrasureSilhouettesGroup.position.set(0,0,0),this.embrasureSilhouettesGroup.rotation.set(0,0,0),this.embrasureSilhouettesGroup.scale.set(1,1,1));this.embrasureSilhouettesGroup.children.length>0;){let e=this.embrasureSilhouettesGroup.children[0];this.embrasureSilhouettesGroup.remove(e),e.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){let t=e.material;Array.isArray(t)?t.forEach(e=>e.dispose()):t.dispose()}})}let r=this.getBaseGeometry();if(this.showWaxOverlay&&this.showEmbrasureSilhouettes&&r&&e.fittingSummary?.contacts&&e.fittingSummary.contacts.length>0){let t=e.fittingSummary.contacts.map((e,t)=>({id:`contact-${t+1}`,index:t,contactKey:e.contactKey,label:e.label,toothA:e.toothA,toothB:e.toothB,position:[e.contactPoint[0],e.contactPoint[1],e.contactPoint[2]],normal:[0,0,1],clearanceMm:e.clearanceMm??.35,spanMm:e.spanMm,apexY:e.apexY,baseY:e.baseY,buccalWidthMm:e.buccalWidthMm,lingualWidthMm:e.lingualWidthMm}));this.silhouettes=r_(r,this.isUpper,t);for(let e of this.silhouettes){let t=i_(e,e.contactKey===this.selectedContactKey,!1);this.embrasureSilhouettesGroup.add(t)}this.embrasureSilhouettesGroup.visible=!0}else this.embrasureSilhouettesGroup.visible=!1;r&&(this.showHeatmap&&e.survey?(r.setAttribute(`color`,new dr(e.survey.heatmapColors,3)),r.attributes.color&&(r.attributes.color.needsUpdate=!0),t&&t.material instanceof Qa&&(t.material.vertexColors=!0,t.material.needsUpdate=!0)):this.restoreBaseColors()),this.sculptor&&t&&(this.sculptor.setTargetMesh(t,e.stageId),this.sculptor.setSecondaryMesh(this.waxMesh),this.sculptor.setStageDeltas(e.stageId,e.sculptDeltas,!0)),this.updateMetricsDisplay(e)}restoreBaseColors(){let e=this.getBaseGeometry();if(!e)return;let t=e.getAttribute(`position`),n=t?t.count:0;if(e.userData.baseColors instanceof dr&&e.userData.baseColors.count===n)e.setAttribute(`color`,e.userData.baseColors.clone());else{let t=e.getAttribute(`color`);t&&t.count===n&&!this.showHeatmap?e.userData.baseColors=t.clone():(Md(e,this.isUpper?`Upper Jaw`:`Lower Jaw`),e.getAttribute(`color`)&&(e.userData.baseColors=e.getAttribute(`color`).clone()))}e.attributes.color&&(e.attributes.color.needsUpdate=!0);let r=this.viewport.getLayerMesh?this.viewport.getLayerMesh(this.getLayerId()):null;r&&(r.visible=!0,r.material instanceof Qa&&(r.material.vertexColors=!!e.getAttribute(`color`),r.material.needsUpdate=!0))}getCanvasDomElement(){return this.viewport.getThreeRenderer?this.viewport.getThreeRenderer().domElement:this.container?.querySelector(`canvas`)||this.container}initMarkerInteraction(){let e=this.getCanvasDomElement();e&&(this.onPointerMoveBound=e=>this.handleMarkerPointerMove(e),this.onPointerDownBound=e=>this.handleMarkerPointerDown(e),this.onPointerUpBound=e=>this.handleMarkerPointerUp(e),this.onDblClickBound=e=>this.handleMarkerDblClick(e),e.addEventListener(`pointermove`,this.onPointerMoveBound),e.addEventListener(`pointerdown`,this.onPointerDownBound),e.addEventListener(`pointerup`,this.onPointerUpBound),e.addEventListener(`pointercancel`,this.onPointerUpBound),e.addEventListener(`dblclick`,this.onDblClickBound))}updatePointerPos(e,t){let n=t.getBoundingClientRect();this.markerPointerPos.x=(e.clientX-n.left)/Math.max(1,n.width)*2-1,this.markerPointerPos.y=-((e.clientY-n.top)/Math.max(1,n.height)*2-1)}handleMarkerPointerMove(e){if(this.activeTab!==`blockout`||!this.showWaxOverlay)return;let t=this.getCanvasDomElement();if(!t)return;this.updatePointerPos(e,t);let n=this.viewport.getThreeCamera?this.viewport.getThreeCamera():this.threeCamera;if(n){if(this.markerRaycaster.setFromCamera(this.markerPointerPos,n),this.activeDraggedMarker){let e=this.viewport.getLayerMesh?this.viewport.getLayerMesh(this.getLayerId()):null;if(!e)return;let n=this.markerRaycaster.intersectObject(e,!1);if(n.length>0&&n[0]){let e=n[0].point.clone();this.activeDraggedMarker.parent&&this.activeDraggedMarker.parent.worldToLocal(e),this.activeDraggedMarker.position.copy(e),t.style.cursor=`grabbing`;let r=this.activeDraggedMarker.userData?.contactKey;r&&this.previewMarkerDragInTable(r,e.y)}}else{if(!this.contactMarkersGroup||!this.contactMarkersGroup.visible)return;let e=this.markerRaycaster.intersectObjects(this.contactMarkersGroup.children,!1);if(e.length>0&&e[0]){let n=e[0].object;this.hoveredMarker!==n&&(this.hoveredMarker&&this.hoveredMarker!==this.activeDraggedMarker&&(this.hoveredMarker.material.color.set(15040905),this.hoveredMarker.material.emissive.set(10305866)),this.hoveredMarker=n,n.material.color.set(16436245),n.material.emissive.set(14251782)),t.style.cursor=`grab`}else this.hoveredMarker&&this.hoveredMarker!==this.activeDraggedMarker&&(this.hoveredMarker.material.color.set(15040905),this.hoveredMarker.material.emissive.set(10305866),this.hoveredMarker=null),t.style.cursor===`grab`&&(t.style.cursor=`default`)}}}handleMarkerPointerDown(e){if(this.activeTab!==`blockout`||!this.showWaxOverlay)return;let t=this.getCanvasDomElement();if(!t)return;this.updatePointerPos(e,t);let n=this.viewport.getThreeCamera?this.viewport.getThreeCamera():this.threeCamera;if(!n||!this.contactMarkersGroup||!this.contactMarkersGroup.visible)return;this.markerRaycaster.setFromCamera(this.markerPointerPos,n);let r=this.markerRaycaster.intersectObjects(this.contactMarkersGroup.children,!1);if(r.length>0&&r[0]){let n=r[0].object;this.activeDraggedMarker=n;let i=n.userData?.contactKey;i&&this.selectContact(i),n.material.color.set(16750848),n.material.emissive.set(16733440),t.style.cursor=`grabbing`;let a=this.viewport.getControls?this.viewport.getControls():null;a&&(a.enabled=!1);try{t.setPointerCapture(e.pointerId)}catch{}e.preventDefault(),e.stopPropagation()}}handleMarkerPointerUp(e){if(!this.activeDraggedMarker)return;let t=this.getCanvasDomElement();try{t&&t.releasePointerCapture(e.pointerId)}catch{}let n=this.viewport.getControls?this.viewport.getControls():null;n&&(n.enabled=!0);let r=this.activeDraggedMarker.userData?.contactKey;if(r){let e=this.activeDraggedMarker.position,t=[parseFloat(e.x.toFixed(2)),parseFloat(e.y.toFixed(2)),parseFloat(e.z.toFixed(2))];this.protocol.contactOverrides||(this.protocol.contactOverrides={}),this.protocol.contactOverrides[r]=t,console.log(`%c[Clinical Blockout] Contact override saved: %c${r} %c-> [${t.join(`, `)}]`,`color: #e58189; font-weight: bold;`,`color: #facc15; font-weight: bold;`,`color: #fda4af;`),this.stageResults.clear(),this.recomputeCurrentBlockout()}t&&(t.style.cursor=`default`),this.activeDraggedMarker=null,this.hoveredMarker=null}handleMarkerDblClick(e){if(this.activeTab!==`blockout`||!this.showWaxOverlay)return;let t=this.getCanvasDomElement();if(!t)return;this.updatePointerPos(e,t);let n=this.viewport.getThreeCamera?this.viewport.getThreeCamera():this.threeCamera;if(!n||!this.contactMarkersGroup||!this.contactMarkersGroup.visible)return;this.markerRaycaster.setFromCamera(this.markerPointerPos,n);let r=this.markerRaycaster.intersectObjects(this.contactMarkersGroup.children,!1);if(r.length>0&&r[0]){let e=r[0].object.userData?.contactKey;e&&this.protocol.contactOverrides&&this.protocol.contactOverrides[e]&&(delete this.protocol.contactOverrides[e],console.log(`[Clinical Blockout] Reset contact override for ${e} to auto-detected position`),this.stageResults.clear(),this.recomputeCurrentBlockout())}}previewMarkerDragInTable(e,t){let n=this.container?.querySelector(`.bo-contact-row-${e}`);if(n){let e=n.querySelector(`.bo-contact-apex`);e&&(e.textContent=`${t.toFixed(1)}*`,e.style.color=`#facc15`);let r=n.querySelector(`.bo-contact-fit`);r&&(r.innerHTML=`<span style="color:#facc15;font-weight:600;">Moving...</span>`)}}async propagateToAllStages(){if(this.isBatchProcessing)return;this.isBatchProcessing=!0;let e=this.manifest.treatmentStages.length,t=this.container?.querySelectorAll(`.bo-propagate-progress`),n=this.container?.querySelectorAll(`.bo-progress-bar-fill`),r=this.container?.querySelectorAll(`.bo-progress-label`);t?.forEach(e=>{e.hidden=!1});try{for(let t=1;t<e;t++){let i=`${(t+1)/e*100}%`,a=`Processing Stage ${t+1} of ${e}...`;n?.forEach(e=>e.style.width=i),r?.forEach(e=>e.textContent=a),await new Promise(e=>setTimeout(e,40)),this.stageResults.delete(t)}r?.forEach(t=>{t.textContent=`✓ Protocol applied to all ${e} transitional stages!`}),setTimeout(()=>{t?.forEach(e=>{e.hidden=!0})},2500)}finally{this.isBatchProcessing=!1}}ensureMergedGeometry(e,t){let n=this.getBaseGeometry();if(!n||t&&t.mergedGeometry)return t;let r=qg(n,this.isUpper,this.protocol,e+1,`stage-${String(e+1).padStart(2,`0`)}`,this.stageSculptDeltas.get(e),{skipMergedGeometry:!1});return this.stageResults.set(e,r),r}async collectAllStageBlockoutsForExport(e){let t=[],n=this.manifest.treatmentStages.length,r=this.getBaseGeometry();if(!r)return t;let i=this.container?.querySelectorAll(`.bo-propagate-progress`),a=this.container?.querySelectorAll(`.bo-progress-bar-fill`),o=this.container?.querySelectorAll(`.bo-progress-label`);i?.forEach(e=>{e.hidden=!1});try{for(let i=0;i<n;i++){let s=`${(i+1)/n*100}%`;a?.forEach(e=>e.style.width=s),o?.forEach(t=>{t.textContent=`${e} Stage ${i+1} of ${n}...`}),await new Promise(e=>setTimeout(e,0));let c=this.stageResults.get(i);if(c&&c.mergedGeometry){t.push(c);continue}let l=i+1,u=`stage-${String(l).padStart(2,`0`)}`,d=this.stageSculptDeltas.get(i),f=null;if(i===this.currentStageIndex)f=r;else{let e=this.manifest.treatmentStages[i];if(e){let t=await hg(e);if(t.ok){let e=this.isUpper?t.geometries.upper:t.geometries.lower;e&&(f=e.clone())}}}let p=qg(f||r,this.isUpper,this.protocol,l,u,d,{skipMergedGeometry:!1});i===this.currentStageIndex&&this.stageResults.set(i,p),t.push(p)}o?.forEach(e=>{e.textContent=`✓ Ready: ${n} stages packaged cleanly!`}),setTimeout(()=>{i?.forEach(e=>{e.hidden=!0})},2200)}finally{}return t}async exportCurrentStageStl(){let e=this.ensureMergedGeometry(this.currentStageIndex,this.stageResults.get(this.currentStageIndex));if(!e)return;let t=Xg($g(e),this.protocol.printPrep),n=String(this.currentStageIndex+1).padStart(2,`0`),r=`${this.manifest.patientName??this.manifest.caseId}_${this.isUpper?`Upper`:`Lower`}_Stage_${n}_Blocked.stl`;n_(Qg(t,r),r)}async exportAllStagesZip(){if(!this.isBatchProcessing){this.isBatchProcessing=!0;try{let e=await this.collectAllStageBlockoutsForExport(`Generating STL`);if(e.length===0)return;let t=this.manifest.patientName??this.manifest.caseId;n_(await t_(t,this.isUpper?`Upper`:`Lower`,e,this.protocol.printPrep),`${t}_${this.isUpper?`Upper`:`Lower`}_All_Stages_Blocked_STLs.zip`)}finally{this.isBatchProcessing=!1}}}async exportNestedBuildPlateStl(){if(!this.isBatchProcessing){this.isBatchProcessing=!0;try{let e=await this.collectAllStageBlockoutsForExport(`Nesting`);if(e.length===0)return;let t=e_(e,this.protocol.printPrep);if(!t)return;let n=`${this.manifest.patientName??this.manifest.caseId}_${this.isUpper?`Upper`:`Lower`}_Nested_BuildPlate.stl`;n_(Qg(t,n),n)}finally{this.isBatchProcessing=!1}}}renderUI(){if(!this.container)return;this.panelEl?.remove(),this.dockEl?.remove(),this.expandPillEl?.remove();let e=this.selectedContactKey||(this.isUpper?`11-21`:`41-31`),t=this.protocol.singleGapFocusKey===`all`?`Showing full arch digital wax across all interproximal embrasures (Titan CAD standard).`:`Active Focus: <strong style="color:#ffe600;">`+e+`</strong> <span style="color:#64748b;">(Click any row or 3D sphere to inspect another gap)</span>`,n=document.createElement(`div`);n.className=`bo-studio-panel`,this.panelEl=n,n.innerHTML=`
      <div class="bo-header">
        <div class="bo-title-group">
          <h2 class="bo-title">Undercut &amp; Blockout Studio</h2>
          <span class="bo-panel-mode-label">Step 1: Undercut Survey &amp; Blockout</span>
        </div>
        <button type="button" class="bo-btn-minimize" title="Minimize Tools panel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="bo-metrics-strip">
        <div class="bo-metric" title="Maximum detected undercut depth">
          <span class="bo-metric-label">Max Undercut</span>
          <span class="bo-metric-val bo-metric-max">-</span>
        </div>
        <div class="bo-metric" title="Average retention depth across blocked areas">
          <span class="bo-metric-label">Avg Retention</span>
          <span class="bo-metric-val bo-metric-avg">-</span>
        </div>
        <div class="bo-metric" title="Total digital wax blockout area">
          <span class="bo-metric-label">Blockout Area</span>
          <span class="bo-metric-val bo-metric-area">-</span>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="bo-tab-body">
        <!-- TAB 1: BLOCKOUT CONFIG -->
        <div class="bo-pane bo-pane-blockout ${this.activeTab===`blockout`?``:`bo-pane--hidden`}">
          <!-- Collapsible 3D Wax Fit & Contact Inspector -->
          <details class="bo-section bo-fitting-details" style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 12px;">
            <summary style="font-weight: 600; font-size: 13px; color: #38bdf8; cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none;">
              <span>🔍 3D Model &amp; Contact Inspector</span>
              <span class="bo-fit-badge" style="font-size: 11px; background: #0284c7; color: white; padding: 2px 8px; border-radius: 10px; font-weight: 500;">Scanning...</span>
            </summary>
            <div style="margin-top: 10px; font-size: 12px; line-height: 1.5; color: #cbd5e1;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
                <div style="background: rgba(15, 23, 42, 0.7); padding: 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Model 3D Extents</div>
                  <div class="bo-model-bounds" style="font-family: monospace; font-size: 10px; color: #f8fafc; word-break: break-all;">-</div>
                </div>
                <div style="background: rgba(15, 23, 42, 0.7); padding: 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Wax 3D Extents</div>
                  <div class="bo-wax-bounds" style="font-family: monospace; font-size: 10px; color: #38bdf8; word-break: break-all;">-</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 5px 8px; background: rgba(15, 23, 42, 0.5); border-radius: 4px; margin-bottom: 8px; font-size: 11px;">
                <span>Wax Volume: <strong class="bo-wax-volume" style="color: #38bdf8;">- mm³</strong></span>
                <span>Interdental Fit: <strong class="bo-contacts-sealed" style="color: #4ade80;">- / -</strong></span>
              </div>
              <div style="max-height: 140px; overflow-y: auto; background: rgba(15, 23, 42, 0.85); border-radius: 4px; padding: 4px 6px; border: 1px solid rgba(255,255,255,0.08);">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; font-family: monospace;">
                  <thead>
                    <tr style="color: #94a3b8; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.12);">
                      <th style="padding: 2px 4px;">Contact</th>
                      <th style="padding: 2px 4px;">Span</th>
                      <th style="padding: 2px 4px;">Apex Y</th>
                      <th style="padding: 2px 4px;">Fit</th>
                    </tr>
                  </thead>
                  <tbody class="bo-contacts-table-body">
                    <tr><td colspan="4" style="text-align: center; color: #64748b; padding: 6px;">Analyzing contact fits...</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="bo-contacts-tip-container" style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; font-size: 10px; color: #94a3b8;">
                <span>💡 Drag spheres in 3D to tune • Dbl-click to reset</span>
                <button type="button" class="bo-btn-copy-coords" style="display: none; background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.3); color: #fde047; border-radius: 3px; font-size: 9px; padding: 2px 6px; cursor: pointer;">📋 Copy Coords</button>
              </div>
            </div>
          </details>

          <!-- Display Overlays -->
          <div class="bo-section bo-section-overlays">
            <h4 class="bo-section-title">Display Overlays</h4>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-wax" ${this.showWaxOverlay?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Clinical Digital Wax</span>
            </div>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-markers" ${this.showContactMarkers?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Contact Markers (Draggable)</span>
            </div>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-silhouettes" ${this.showEmbrasureSilhouettes?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Embrasure Silhouettes</span>
            </div>
          </div>

          <!-- Component 1: Interproximal Wax -->
          <div class="bo-section bo-section-interproximal">
            <div class="bo-section-header">
              <h4 class="bo-section-title">1. Interproximal Wax <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#D83D56;margin-left:5px;vertical-align:middle;" title="Interproximal Digital Wax"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-prox" ${this.protocol.interproximal.enabled?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Conformal wax filling embrasures between adjacent teeth.</p>

            <div style="margin: 8px 0;">
              <div style="display:flex; gap:6px; margin-bottom: 6px;">
                <button type="button" class="bo-btn-wax-mode bo-btn-wax-mode--all" style="flex:1; padding:6px 8px; font-size:11px; font-weight:600; border-radius:6px; cursor:pointer; transition:all 0.2s ease; border: 1px solid ${this.protocol.singleGapFocusKey===`all`?`#e58189`:`rgba(255,255,255,0.15)`}; background: ${this.protocol.singleGapFocusKey===`all`?`rgba(229,129,137,0.18)`:`rgba(255,255,255,0.05)`}; color: ${this.protocol.singleGapFocusKey===`all`?`#e58189`:`#94a3b8`};">
                  ★ Full Arch
                </button>
                <button type="button" class="bo-btn-wax-mode bo-btn-wax-mode--single" style="flex:1; padding:6px 8px; font-size:11px; font-weight:600; border-radius:6px; cursor:pointer; transition:all 0.2s ease; border: 1px solid ${this.protocol.singleGapFocusKey===`all`?`rgba(255,255,255,0.15)`:`#e58189`}; background: ${this.protocol.singleGapFocusKey===`all`?`rgba(255,255,255,0.05)`:`rgba(229,129,137,0.18)`}; color: ${this.protocol.singleGapFocusKey===`all`?`#94a3b8`:`#e58189`};">
                  Single Gap
                </button>
              </div>
              <div class="bo-wax-focus-pill" style="font-size:11px; color:#cbd5e1; padding:6px 8px; background:rgba(229,129,137,0.08); border-left:3px solid #e58189; border-radius:4px; line-height:1.4;">
                ${t}
              </div>
            </div>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Wax Thickness</span>
                <span class="bo-range-val bo-val-prox">${this.protocol.interproximal.thicknessMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-prox" min="0.1" max="1.5" step="0.05" value="${this.protocol.interproximal.thicknessMm}">
            </div>
          </div>

          <!-- Component 2: Gingival Line Relief -->
          <div class="bo-section bo-section-gingival">
            <div class="bo-section-header">
              <h4 class="bo-section-title">2. Gingival Margin Relief <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#4ade80;margin-left:5px;vertical-align:middle;" title="Gingival Margin Relief"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-ging" ${this.protocol.gingival.enabled?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Relieves cervical constriction along the tooth-gum CEJ boundary.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Margin Relief</span>
                <span class="bo-range-val bo-val-ging">${this.protocol.gingival.reliefMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-ging" min="0.1" max="0.8" step="0.05" value="${this.protocol.gingival.reliefMm}">
            </div>
          </div>

          <!-- Component 3: Dentition Undercut Blockout & Heatmap -->
          <div class="bo-section bo-section-undercut">
            <div class="bo-section-header">
              <h4 class="bo-section-title">3. Dentition Undercuts <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#38bdf8;margin-left:5px;vertical-align:middle;" title="Blue Undercut Blockout"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-uc" ${this.protocol.undercut.enabled?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Blocks retentive crown undercuts in blue along the draw path.</p>
            <div class="bo-toggle-row" style="margin-bottom: 8px;">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-heatmap" ${this.showHeatmap?`checked`:``}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Undercut Heatmap Overlay</span>
            </div>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Max Allowable Depth</span>
                <span class="bo-range-val bo-val-uc">${this.protocol.undercut.maxDepthMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-uc" min="0.00" max="1.00" step="0.05" value="${this.protocol.undercut.maxDepthMm}">
            </div>

            <!-- Interactive FDI Tooth Chart -->
            <div class="bo-tooth-chart">
              <div class="bo-chart-title">Tooth-by-Tooth Exclusions (FDI)</div>
              <div class="bo-tooth-grid bo-tooth-grid-quad1"></div>
              <div class="bo-tooth-grid bo-tooth-grid-quad2"></div>
            </div>
          </div>
        </div>

        <!-- TAB 2: DIGITAL WAX CARVER (SCULPT) -->
        <div class="bo-pane bo-pane-sculpt ${this.activeTab===`sculpt`?``:`bo-pane--hidden`}">
          <div class="bo-section">
            <h4 class="bo-section-title">Digital Wax Carver (Hot Spatula)</h4>
            <p class="bo-desc">Sculpt custom relief along tooth walls or hold <kbd>Alt</kbd> to draw without rotating the camera.</p>
            <div class="bo-brush-modes">
              <button type="button" class="bo-mode-btn bo-mode-btn--active" data-mode="off">Off (Rotate)</button>
              <button type="button" class="bo-mode-btn" data-mode="add">+ Add Wax</button>
              <button type="button" class="bo-mode-btn" data-mode="remove">- Carve Wax</button>
              <button type="button" class="bo-mode-btn" data-mode="smooth">~ Smooth</button>
            </div>

            <div class="bo-sculpt-status-pill">Mode: Orbit Camera (Hold Alt + Drag to Draw)</div>

            <div class="bo-sculpt-shortcuts">
              <span><kbd>Alt</kbd>+Drag Quick Draw</span>
              <span><kbd>Shift</kbd>+Drag Smooth</span>
              <span><kbd>[</kbd> / <kbd>]</kbd> Size</span>
              <span><kbd>⌘Z</kbd> Undo</span>
            </div>

            <div class="bo-range-group" style="margin-top: 12px;">
              <div class="bo-range-meta">
                <span>Brush Radius</span>
                <span class="bo-range-val bo-val-radius">3.5 mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-radius" min="1.0" max="8.0" step="0.5" value="3.5">
            </div>

            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Carving Strength</span>
                <span class="bo-range-val bo-val-strength">50%</span>
              </div>
              <input type="range" class="bo-range-input bo-range-strength" min="0.1" max="1.0" step="0.05" value="0.5">
            </div>

            <div class="bo-undo-row">
              <button type="button" class="bo-btn-undo" disabled>↶ Undo</button>
              <button type="button" class="bo-btn-redo" disabled>↷ Redo</button>
              <button type="button" class="bo-btn-clear-sculpt" disabled>Clear</button>
            </div>
          </div>
        </div>

        <!-- TAB 3: PRINT PREP & EXPORT -->
        <div class="bo-pane bo-pane-prep ${this.activeTab===`prep`?``:`bo-pane--hidden`}">
          <div class="bo-section">
            <h4 class="bo-section-title">Photopolymer Resin Shrinkage</h4>
            <p class="bo-desc">Scales models to compensate for 3D printer post-curing shrinkage.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Shrinkage Scale</span>
                <span class="bo-range-val bo-val-shrink">${this.protocol.printPrep.shrinkageScalePercent.toFixed(1)}%</span>
              </div>
              <input type="range" class="bo-range-input bo-range-shrink" min="100.0" max="102.0" step="0.1" value="${this.protocol.printPrep.shrinkageScalePercent}">
            </div>
          </div>

          <div class="bo-section">
            <h4 class="bo-section-title">Base Drainage &amp; Suction Holes</h4>
            <p class="bo-desc">Place hollow suction and drainage holes for vacuum thermoforming and resin drainage.</p>
            <button type="button" class="bo-btn-action bo-btn-add-hole">+ Add Standard Base Suction Holes</button>
            <div class="bo-holes-list"></div>
          </div>

          <div class="bo-section">
            <h4 class="bo-section-title">Export Slicing Files</h4>
            <div class="bo-export-btns">
              <button type="button" class="bo-btn-export bo-btn-export-stage">Download Current Stage STL</button>
              <button type="button" class="bo-btn-export bo-btn-export-all">Export All Stages (.ZIP STLs)</button>
              <button type="button" class="bo-btn-export bo-btn-export-nested">Export Single Nested Build-Plate STL</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Master Action CTA Footer (Pinned to Side Panel) -->
      <div class="bo-action-footer">
        <div class="bo-propagate-progress" hidden>
          <div class="bo-progress-label">Processing transitional models...</div>
          <div class="bo-progress-bar-bg">
            <div class="bo-progress-bar-fill" style="width: 0%"></div>
          </div>
        </div>
        <button type="button" class="bo-btn-propagate" title="Apply reference protocol across all transitional stages">
          <span>Apply to All Stages</span>
        </button>
      </div>
    `;let r=this.manifest.treatmentStages.length||1,i=document.createElement(`div`);i.className=`bo-bottom-dock`,this.dockEl=i,i.innerHTML=`
      <!-- Playback Control (Play / Pause) -->
      <div class="bo-dock-group bo-dock-playback">
        <button type="button" class="bo-dock-btn-play ${this.isPlaying?`bo-dock-btn-play--active`:``}" title="${this.isPlaying?`Pause treatment playback`:`Play treatment progression`}" aria-label="${this.isPlaying?`Pause`:`Play`}">
          ${this.getPlayPauseIconSvg(this.isPlaying)}
        </button>
      </div>

      <div class="bo-dock-divider"></div>

      <!-- Stage Timeline Stepper & Scrubber -->
      <div class="bo-dock-group bo-dock-timeline bo-dock-stepper">
        <button type="button" class="bo-dock-step-btn bo-dock-step-prev" title="Previous stage" ${this.currentStageIndex===0?`disabled`:``}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <input type="range" class="bo-dock-slider" min="0" max="${r-1}" step="1" value="${this.currentStageIndex}" title="Scrub through treatment stages">
        <button type="button" class="bo-dock-step-btn bo-dock-step-next" title="Next stage" ${this.currentStageIndex>=r-1?`disabled`:``}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <span class="bo-dock-stage-badge ${this.currentStageIndex===0?`bo-dock-stage-badge--ref`:``}">
          ${this.currentStageIndex===0?`★ Ref`:`Stage ${this.currentStageIndex+1}/${r}`}
        </span>
      </div>
    `;let a=document.createElement(`button`);a.type=`button`,a.className=`bo-expand-pill`,a.title=`Restore Tools Panel`,a.innerHTML=`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span>Tools</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `,a.addEventListener(`click`,()=>{this.setMinimized(!1)}),this.expandPillEl=a,this.container.appendChild(n),this.container.appendChild(i),this.container.appendChild(a),this.bindPanelEvents(),this.bindDockEvents(),this.renderToothChart()}renderToothChart(){if(!this.panelEl)return;let e=this.panelEl.querySelector(`.bo-tooth-grid-quad1`),t=this.panelEl.querySelector(`.bo-tooth-grid-quad2`);if(!e||!t)return;e.innerHTML=``,t.innerHTML=``;let n=this.isUpper?[18,17,16,15,14,13,12,11]:[48,47,46,45,44,43,42,41],r=this.isUpper?[21,22,23,24,25,26,27,28]:[31,32,33,34,35,36,37,38],i=e=>{let t=document.createElement(`button`);t.type=`button`;let n=this.protocol.undercut.perTooth[e]!==!1;return t.className=`bo-tooth-btn ${n?`bo-tooth-btn--active`:`bo-tooth-btn--disabled`}`,t.textContent=String(e),t.title=`Tooth ${e}: Click to toggle undercut blockout`,t.addEventListener(`click`,()=>{this.protocol.undercut.perTooth[e]=!n,this.renderToothChart(),this.recomputeCurrentBlockout()}),t};n.forEach(t=>e.appendChild(i(t))),r.forEach(e=>t.appendChild(i(e)))}bindPanelEvents(){if(!this.panelEl)return;this.panelEl.querySelector(`.bo-btn-minimize`)?.addEventListener(`click`,()=>{this.setMinimized(!0)}),this.panelEl.querySelectorAll(`.bo-pill-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.arch;this.setArch(t)})}),this.panelEl.querySelectorAll(`.bo-tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.tab;t&&this.setActiveTab(t)})});let e=this.panelEl.querySelector(`.bo-chk-wax`);e?.addEventListener(`change`,()=>{this.toggleWaxOverlay(e.checked)});let t=this.panelEl.querySelector(`.bo-chk-markers`);t?.addEventListener(`change`,()=>{this.toggleContactMarkers(t.checked)});let n=this.panelEl.querySelector(`.bo-chk-silhouettes`);n?.addEventListener(`change`,()=>{this.toggleEmbrasureSilhouettes(n.checked)});let r=this.panelEl.querySelector(`.bo-chk-heatmap`);r?.addEventListener(`change`,()=>{this.toggleHeatmap(r.checked)});let i=this.panelEl.querySelector(`.bo-chk-prox`);i?.addEventListener(`change`,()=>{this.protocol.interproximal.enabled=i.checked,this.recomputeCurrentBlockout()});let a=this.panelEl.querySelector(`.bo-btn-wax-mode--single`),o=this.panelEl.querySelector(`.bo-btn-wax-mode--all`);a?.addEventListener(`click`,()=>{this.protocol.singleGapFocusKey=this.selectedContactKey||(this.isUpper?`11-21`:`41-31`),this.recomputeCurrentBlockout(),this.renderUI()}),o?.addEventListener(`click`,()=>{this.protocol.singleGapFocusKey=`all`,this.recomputeCurrentBlockout(),this.renderUI()});let s=this.panelEl.querySelector(`.bo-range-prox`);s?.addEventListener(`input`,()=>{let e=parseFloat(s.value);this.protocol.interproximal.thicknessMm=e;let t=this.panelEl?.querySelector(`.bo-val-prox`);t&&(t.textContent=`${e.toFixed(2)} mm`),this.scheduleRecomputeDebounced()});let c=this.panelEl.querySelector(`.bo-chk-ging`);c?.addEventListener(`change`,()=>{this.protocol.gingival.enabled=c.checked,this.recomputeCurrentBlockout()});let l=this.panelEl.querySelector(`.bo-range-ging`);l?.addEventListener(`input`,()=>{let e=parseFloat(l.value);this.protocol.gingival.reliefMm=e;let t=this.panelEl?.querySelector(`.bo-val-ging`);t&&(t.textContent=`${e.toFixed(2)} mm`),this.scheduleRecomputeDebounced()});let u=this.panelEl.querySelector(`.bo-chk-uc`);u?.addEventListener(`change`,()=>{this.protocol.undercut.enabled=u.checked,this.recomputeCurrentBlockout()});let d=this.panelEl.querySelector(`.bo-range-uc`);d?.addEventListener(`input`,()=>{let e=parseFloat(d.value);this.protocol.undercut.maxDepthMm=e;let t=this.panelEl?.querySelector(`.bo-val-uc`);t&&(t.textContent=`${e.toFixed(2)} mm`),this.scheduleRecomputeDebounced()}),this.panelEl.querySelectorAll(`.bo-mode-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.mode;this.panelEl?.querySelectorAll(`.bo-mode-btn`).forEach(e=>e.classList.remove(`bo-mode-btn--active`)),e.classList.add(`bo-mode-btn--active`),this.sculptor&&this.sculptor.setConfig({mode:t})})});let f=this.panelEl.querySelector(`.bo-range-radius`);f?.addEventListener(`input`,()=>{let e=parseFloat(f.value),t=this.panelEl?.querySelector(`.bo-val-radius`);t&&(t.textContent=`${e.toFixed(1)} mm`),this.sculptor&&this.sculptor.setConfig({radiusMm:e})});let p=this.panelEl.querySelector(`.bo-range-strength`);p?.addEventListener(`input`,()=>{let e=parseFloat(p.value),t=this.panelEl?.querySelector(`.bo-val-strength`);t&&(t.textContent=`${Math.round(e*100)}%`),this.sculptor&&this.sculptor.setConfig({strength:e})}),this.panelEl.querySelector(`.bo-btn-undo`)?.addEventListener(`click`,()=>{this.sculptor?.undo()&&this.updateUndoRedoButtons()}),this.panelEl.querySelector(`.bo-btn-redo`)?.addEventListener(`click`,()=>{this.sculptor?.redo()&&this.updateUndoRedoButtons()}),this.panelEl.querySelector(`.bo-btn-clear-sculpt`)?.addEventListener(`click`,()=>{this.sculptor?.clearAllDeltas()&&this.updateUndoRedoButtons()});let m=this.panelEl.querySelector(`.bo-range-shrink`);m?.addEventListener(`input`,()=>{let e=parseFloat(m.value);this.protocol.printPrep.shrinkageScalePercent=e;let t=this.panelEl?.querySelector(`.bo-val-shrink`);t&&(t.textContent=`${e.toFixed(1)}%`)}),this.panelEl.querySelector(`.bo-btn-add-hole`)?.addEventListener(`click`,()=>{let e=this.getBaseGeometry(),t=18,n=this.isUpper?10:-8,r=-10,i=0;if(e){e.computeBoundingBox();let a=e.boundingBox;if(a){i=(a.min.x+a.max.x)*.5;let e=a.max.x-a.min.x,o=a.max.z-a.min.z;t=Math.max(10,Number((e*.25).toFixed(1))),n=Number((this.isUpper?a.max.y:a.min.y).toFixed(2)),r=Number((a.min.z+o*.28).toFixed(1))}}let a=[0,this.isUpper?-1:1,0];this.protocol.printPrep.drainHoles=[{id:`hole-left`,position:[Number((i-t).toFixed(1)),n,r],normal:a,diameterMm:3},{id:`hole-right`,position:[Number((i+t).toFixed(1)),n,r],normal:a,diameterMm:3}],this.renderHolesList(),this.recomputeCurrentBlockout()}),this.panelEl.querySelectorAll(`.bo-btn-copy-coords`).forEach(e=>{e.addEventListener(`click`,()=>{if(!this.protocol.contactOverrides||Object.keys(this.protocol.contactOverrides).length===0)return;let t=JSON.stringify(this.protocol.contactOverrides,null,2);navigator.clipboard&&(navigator.clipboard.writeText(t),e.textContent=`✓ Copied!`,setTimeout(()=>{e.textContent=`📋 Copy Coords`},2e3))})}),this.panelEl.querySelector(`.bo-btn-export-stage`)?.addEventListener(`click`,()=>this.exportCurrentStageStl()),this.panelEl.querySelector(`.bo-btn-export-all`)?.addEventListener(`click`,()=>this.exportAllStagesZip()),this.panelEl.querySelector(`.bo-btn-export-nested`)?.addEventListener(`click`,()=>this.exportNestedBuildPlateStl()),this.panelEl.querySelector(`.bo-btn-propagate`)?.addEventListener(`click`,()=>this.propagateToAllStages())}getPlayPauseIconSvg(e){return e?`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`:`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>`}togglePlayback(e){if(typeof e==`boolean`?e:!this.isPlaying){let e=this.manifest.treatmentStages.length||1;this.currentStageIndex>=e-1&&this.setStageIndex(0),this.isPlaying=!0,this.playIntervalId!==null&&clearInterval(this.playIntervalId),this.playIntervalId=setInterval(()=>{let e=this.manifest.treatmentStages.length||1;this.currentStageIndex<e-1?this.setStageIndex(this.currentStageIndex+1):this.stopPlayback()},900)}else this.stopPlayback();return this.syncPlaybackUI(),this.isPlaying}stopPlayback(){this.isPlaying=!1,this.playIntervalId!==null&&(clearInterval(this.playIntervalId),this.playIntervalId=null),this.syncPlaybackUI()}syncPlaybackUI(){let e=this.dockEl?.querySelector(`.bo-dock-btn-play`);e&&(e.classList.toggle(`bo-dock-btn-play--active`,this.isPlaying),e.title=this.isPlaying?`Pause treatment playback`:`Play treatment progression`,e.setAttribute(`aria-label`,this.isPlaying?`Pause`:`Play`),e.innerHTML=this.getPlayPauseIconSvg(this.isPlaying))}bindDockEvents(){if(!this.dockEl)return;this.dockEl.querySelector(`.bo-dock-btn-play`)?.addEventListener(`click`,()=>{this.togglePlayback()});let e=this.dockEl.querySelector(`.bo-dock-step-prev`),t=this.dockEl.querySelector(`.bo-dock-step-next`),n=this.dockEl.querySelector(`.bo-dock-slider`);e?.addEventListener(`click`,()=>{this.isPlaying&&this.stopPlayback(),this.currentStageIndex>0&&this.setStageIndex(this.currentStageIndex-1)}),t?.addEventListener(`click`,()=>{this.isPlaying&&this.stopPlayback();let e=this.manifest.treatmentStages.length;this.currentStageIndex<e-1&&this.setStageIndex(this.currentStageIndex+1)}),n?.addEventListener(`input`,()=>{this.isPlaying&&this.stopPlayback();let e=parseInt(n.value,10);isNaN(e)||this.setStageIndex(e)})}updateActiveTabPanes(){if(!this.panelEl)return;let e=this.panelEl.querySelector(`.bo-pane-blockout`),t=this.panelEl.querySelector(`.bo-pane-sculpt`),n=this.panelEl.querySelector(`.bo-pane-prep`),r=this.panelEl.querySelector(`.bo-panel-mode-label`);e?.classList.toggle(`bo-pane--hidden`,this.activeTab!==`blockout`),t?.classList.toggle(`bo-pane--hidden`,this.activeTab!==`sculpt`),n?.classList.toggle(`bo-pane--hidden`,this.activeTab!==`prep`),r&&(this.activeTab===`blockout`?r.textContent=`Step 1: Undercut Survey & Wax Blockout`:this.activeTab===`sculpt`?r.textContent=`Step 2: Digital Wax Carver (Hot Spatula)`:this.activeTab===`prep`&&(r.textContent=`Step 3: Print Prep, Drainage & STL Export`)),this.panelEl.querySelectorAll(`.bo-tab`).forEach(e=>{e.classList.toggle(`bo-tab--active`,e.dataset.tab===this.activeTab)})}syncOverlayCheckboxes(){(this.container?.querySelectorAll(`.bo-chk-wax`))?.forEach(e=>{e.checked=this.showWaxOverlay}),(this.container?.querySelectorAll(`.bo-chk-markers`))?.forEach(e=>{e.checked=this.showContactMarkers}),(this.container?.querySelectorAll(`.bo-chk-silhouettes`))?.forEach(e=>{e.checked=this.showEmbrasureSilhouettes}),(this.container?.querySelectorAll(`.bo-chk-heatmap`))?.forEach(e=>{e.checked=this.showHeatmap})}renderHolesList(){if(!this.panelEl)return;let e=this.panelEl.querySelector(`.bo-holes-list`);e&&(e.innerHTML=``,this.protocol.printPrep.drainHoles.forEach((t,n)=>{let r=document.createElement(`div`);r.className=`bo-hole-item`,r.innerHTML=`
        <span>Hole #${n+1} (${t.diameterMm.toFixed(1)} mm)</span>
        <button type="button" class="bo-hole-del">&times;</button>
      `,r.querySelector(`.bo-hole-del`)?.addEventListener(`click`,()=>{this.protocol.printPrep.drainHoles.splice(n,1),this.renderHolesList(),this.recomputeCurrentBlockout()}),e.appendChild(r)}))}updateMetricsDisplay(e){if(e.survey){let t=this.container?.querySelectorAll(`.bo-metric-max`),n=this.container?.querySelectorAll(`.bo-metric-avg`),r=this.container?.querySelectorAll(`.bo-metric-area`);t?.forEach(t=>{t.textContent=`${e.survey.maxDepthMm.toFixed(2)} mm`}),n?.forEach(t=>{t.textContent=`${e.survey.avgDepthMm.toFixed(2)} mm`}),r?.forEach(t=>{t.textContent=`${e.survey.undercutAreaMm2.toFixed(1)} mm²`})}if(e.fittingSummary){let t=e.fittingSummary,n=this.container?.querySelectorAll(`.bo-model-bounds`),r=this.container?.querySelectorAll(`.bo-wax-bounds`),i=this.container?.querySelectorAll(`.bo-wax-volume`),a=this.container?.querySelectorAll(`.bo-contacts-sealed`),o=this.container?.querySelectorAll(`.bo-fit-badge`),s=this.container?.querySelectorAll(`.bo-contacts-table-body`),c=t.modelBounds,l=`X:[${c.min[0].toFixed(1)}, ${c.max[0].toFixed(1)}] Y:[${c.min[1].toFixed(1)}, ${c.max[1].toFixed(1)}] Z:[${c.min[2].toFixed(1)}, ${c.max[2].toFixed(1)}]`;if(n?.forEach(e=>{e.textContent=l}),t.waxBounds){let e=t.waxBounds,n=`X:[${e.min[0].toFixed(1)}, ${e.max[0].toFixed(1)}] Y:[${e.min[1].toFixed(1)}, ${e.max[1].toFixed(1)}] Z:[${e.min[2].toFixed(1)}, ${e.max[2].toFixed(1)}]`;r?.forEach(e=>{e.textContent=n})}else r?.forEach(e=>{e.textContent=`None`});i?.forEach(e=>{e.textContent=`${t.totalWaxVolumeMm3.toFixed(1)} mm³`});let u=t.sealedContacts>=t.totalContacts&&t.totalContacts>0;if(a?.forEach(e=>{e.textContent=`${t.sealedContacts} / ${t.totalContacts} (${u?`100%`:Math.round(t.sealedContacts/Math.max(1,t.totalContacts)*100)+`%`})`}),o?.forEach(e=>{e.style.background=`#0284c7`,e.textContent=`✓ ${t.contacts.length} Contacts Found`}),s&&t.contacts.length>0){let e=t.contacts.map(e=>{let t=!!this.protocol.contactOverrides?.[e.contactKey],n=e.contactKey===this.selectedContactKey,r=this.silhouettes.find(t=>t.contactKey===e.contactKey),i=r?`<span style="color: ${n?`#fbbf24`:`#38bdf8`}; font-weight: 600;" title="Embrasure Silhouette: H=${r.heightMm}mm, W=${r.spanMm}mm, D=${r.depthMm}mm">${r.spanMm}mm <small style="color: #94a3b8; font-size: 8px;">(H:${r.heightMm})</small></span>`:`${e.spanMm.toFixed(1)}mm`,a=t?`<span style="color: #facc15; font-weight: 600;" title="User calibrated: [${e.contactPoint.map(e=>e.toFixed(1)).join(`, `)}]">★ Tuned</span>`:`<span style="color: #e58189;">✓ ${e.clearanceMm===void 0?`0.35mm`:e.clearanceMm.toFixed(2)+`mm`}</span>`;return`
            <tr class="bo-contact-row bo-contact-row-${e.contactKey}" data-contact-key="${e.contactKey}" style="cursor: pointer; transition: background 0.15s ease; border-bottom: 1px solid rgba(255,255,255,0.05); ${n?`background: rgba(56, 189, 248, 0.18); border-left: 3px solid #38bdf8;`:t?`background: rgba(250, 204, 21, 0.08);`:``}">
              <td style="padding: 2px 4px; color: ${n?`#38bdf8`:t?`#fde047`:`#f8fafc`}; font-weight: ${n?`700`:`normal`};" title="${e.label} (Click to inspect silhouette, drag sphere in 3D to tune)">${e.contactKey}${t?` ★`:``}</td>
              <td style="padding: 2px 4px;">${i}</td>
              <td class="bo-contact-apex" style="padding: 2px 4px; color: #38bdf8;">${e.apexY.toFixed(1)}</td>
              <td class="bo-contact-fit" style="padding: 2px 4px;">${a}</td>
            </tr>
          `}).join(``);s.forEach(t=>{t.innerHTML=e,t.querySelectorAll(`.bo-contact-row`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-contact-key`);t&&this.selectContact(t)})})})}let d=this.container?.querySelectorAll(`.bo-btn-copy-coords`),f=!!(this.protocol.contactOverrides&&Object.keys(this.protocol.contactOverrides).length>0);d?.forEach(e=>{e.style.display=f?`inline-block`:`none`})}}updateUndoRedoButtons(){if(!this.panelEl||!this.sculptor)return;let e=this.panelEl.querySelector(`.bo-btn-undo`),t=this.panelEl.querySelector(`.bo-btn-redo`),n=this.panelEl.querySelector(`.bo-btn-clear-sculpt`);e&&(e.disabled=!this.sculptor.canUndo()),t&&(t.disabled=!this.sculptor.canRedo()),n&&(n.disabled=this.sculptor.getStageDeltas().size===0)}updateUI(){let e=this.manifest.treatmentStages.length||1;if((this.container?.querySelectorAll(`.bo-stage-tag`))?.forEach(e=>{this.currentStageIndex===0?(e.className=`bo-stage-tag bo-stage-tag--ref`,e.textContent=`★ Stage 1 (Reference Model)`):(e.className=`bo-stage-tag`,e.textContent=`Transitional Model (Stage ${this.currentStageIndex+1})`)}),this.dockEl){let t=this.dockEl.querySelector(`.bo-dock-stage-badge`);t&&(this.currentStageIndex===0?(t.className=`bo-dock-stage-badge bo-dock-stage-badge--ref`,t.textContent=`★ Ref`):(t.className=`bo-dock-stage-badge`,t.textContent=`Stage ${this.currentStageIndex+1}/${e}`));let n=this.dockEl.querySelector(`.bo-dock-step-prev`),r=this.dockEl.querySelector(`.bo-dock-step-next`);n&&(n.disabled=this.currentStageIndex<=0),r&&(r.disabled=this.currentStageIndex>=e-1);let i=this.dockEl.querySelector(`.bo-dock-slider`);i&&(i.value=String(this.currentStageIndex))}this.container?.querySelectorAll(`.bo-pill-btn`).forEach(e=>{let t=e.dataset.arch===`upper`;e.classList.toggle(`bo-pill-btn--active`,t===this.isUpper)}),this.syncOverlayCheckboxes(),this.updateActiveTabPanes(),this.renderToothChart()}},o_=`upper-arch`,s_=`lower-arch`,c_=`anatomical`,l_=`anatomical`,u_=typeof process<`u`&&{}.VITEST===`true`||typeof window<`u`&&`__VITEST__`in window;function d_(e,t={}){let n=t.createViewport??Hf,r=t.autoplayIntervalMs??240,i=t.transitionDurationMs??0,a=Zf(t.caseManifest??Jf),o=a.treatmentStages.some(e=>!!e.upper),s=a.treatmentStages.some(e=>!!e.lower),c=o&&!s,l=!o&&s,u=t.initialMode===`blockout`||typeof window<`u`&&new URLSearchParams(window.location.search).get(`mode`)===`blockout`,d={manifest:a,currentIndex:-1,activeTemplateStage:null,loading:!1,error:null,upperVisible:!l,lowerVisible:u?!!l:!c,attachmentsVisible:!1,playbackSpeed:1,isPlaying:!1,contactsActive:!1,overlayActive:!1,overlayBlend:.5,iprActive:!1,notesOpen:!1,abortController:null,metricsPanelOpen:!1},f=`tv-ghost-upper`,p=`tv-ghost-lower`,m=`#38bdf8`,h=null,g=null,_=!1,v=`${o_}-0`,y=`${s_}-0`,b=null,x=null,S=null,C=0,w=t.autoLoad!==!1,T=null,E=null,D=null,O=null,k=null,A=null,j=document.createElement(`canvas`);j.className=`tv-canvas`;let M=n(j,{transparentBackground:!0,onStats:e=>{Vt.textContent=`${(e.visibleTriangles/1e6).toFixed(1)}M tri · ${e.fps} fps`},onToothHover:e=>{if(u||Pe){on.hidden=!0;return}if(!e){on.hidden=!0;return}let t=e.layerId.toLowerCase().includes(`upper`),n=M.getLayerGeometry?.(e.layerId),r;if(n){n.computeBoundingBox();let e=n.boundingBox;e&&(r={minX:e.min.x,maxX:e.max.x,minZ:e.min.z,maxZ:e.max.z})}let i=bh(e.hitPoint,t,r),a=`0.00 mm`;if(d.currentIndex>0){let e=(t?k:A)?.[i.fdi];e!==void 0&&(a=`${e.toFixed(2)} mm`)}Qt.textContent=i.badge,$t.textContent=i.notation,en.textContent=i.quadrantLabel,tn.textContent=i.fullName,nn.textContent=a;let o=cn.getBoundingClientRect(),s=j.getBoundingClientRect(),c=s.left-o.left+e.canvasX,l=s.top-o.top+e.canvasY,f=c-120,p=l-96-14;f<10&&(f=10),f+240>o.width-10&&(f=o.width-240-10),p<10&&(p=l+18),on.style.left=`${f}px`,on.style.top=`${p}px`,on.hidden=!1}});M.setGridVisible(!1);let N=document.createElement(`button`);N.type=`button`,N.className=`tv-arch-pill__btn`,N.textContent=`Lower`,N.title=`View Lower (Mandibular) arch only`,N.addEventListener(`click`,()=>fn(`lower`));let P=document.createElement(`button`);P.type=`button`,P.className=`tv-arch-pill__btn`,P.textContent=`Upper`,P.title=`View Upper (Maxillary) arch only`,P.addEventListener(`click`,()=>fn(`upper`));let F=document.createElement(`button`);F.type=`button`,F.className=`tv-arch-pill__btn tv-arch-pill__btn--active`,F.textContent=`Both`,F.title=`View Both arches`,F.addEventListener(`click`,()=>fn(`both`));let I=Q(`tv-arch-pill`,[N,P,F]),L=p_(`Upper Jaw`,()=>mn(),`tv-btn--toggle tv-btn--active tv-sr-only`),R=p_(`Lower Jaw`,()=>hn(),`tv-btn--toggle tv-btn--active tv-sr-only`),z=Q(`tv-graph-grid`);z.hidden=!0;let ee=$(`tv-movement-drawer__stage-badge`,`Stage 1 of 1`),B=Q(`tv-movement-list`),te=Q(`tv-movement-list`),V=p_(`✕`,e=>{e?.preventDefault(),e?.stopPropagation(),En(!1)},`tv-movement-drawer__close`);V.title=`Close tooth movements panel`,V.addEventListener(`pointerdown`,e=>{e.preventDefault(),e.stopPropagation(),En(!1)});let H=Q(`tv-movement-drawer`,[Q(`tv-movement-drawer__header`,[Q(`tv-movement-drawer__title-wrap`,[(()=>{let e=document.createElement(`h3`);return e.textContent=`Tooth Movements`,e})(),ee]),V]),Q(`tv-movement-content`,[Q(`tv-movement-section`,[Q(`tv-movement-section__header`,[$(`tv-movement-section__title`,`Upper Arch (Maxillary)`)]),B]),Q(`tv-movement-section`,[Q(`tv-movement-section__header`,[$(`tv-movement-section__title`,`Lower Arch (Mandibular)`)]),te])])]);H.hidden=!0,H.style.display=`none`,H.style.visibility=`hidden`;let ne=Q(`tv-notes-meta`),re=Q(`tv-notes-guidelines`),ie=Q(`tv-notes-general`),ae=Q(`tv-notes-stage-list`),oe=Q(`tv-notes-backdrop`);oe.hidden=!0,oe.style.display=`none`;let se=e=>{e?.preventDefault(),e?.stopPropagation(),kn(!1)};oe.addEventListener(`click`,se),oe.addEventListener(`pointerdown`,se);let ce=p_(`✕`,e=>{e?.preventDefault(),e?.stopPropagation(),kn(!1)},`tv-notes-drawer__close`);ce.title=`Close treatment plan and remarks`,ce.addEventListener(`pointerdown`,e=>{e.preventDefault(),e.stopPropagation(),kn(!1)});let le=Q(`tv-notes-drawer`,[Q(`tv-notes-drawer__header`,[Q(`tv-notes-drawer__title-wrap`,[(()=>{let e=document.createElement(`h3`);return e.textContent=`Treatment Plan & Remarks`,e})(),$(`tv-notes-drawer__sub`,`Treating Doctor Guidance`)]),ce]),Q(`tv-notes-content`,[ne,re,ie,Q(`tv-notes-section`,[Q(`tv-notes-section__header`,[$(`tv-notes-section__title`,`Stage-Specific Remarks`)]),ae])])]);le.hidden=!0,le.style.display=`none`,le.style.visibility=`hidden`;let ue=!1,de=typeof localStorage<`u`?localStorage.getItem(`dental_theme`):null;(de===`dark`||!de&&typeof window<`u`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches)&&(ue=!0);let fe=()=>{if(ue=!ue,ue){un.classList.add(`tv-app--dark`),typeof document<`u`&&(document.documentElement.classList.add(`dark`),document.documentElement.setAttribute(`data-theme`,`dark`)),pe.textContent=`Light`,pe.title=`Switch to Light Mode`,je.textContent=`Light`,je.title=`Switch to Light Mode`;try{localStorage.setItem(`dental_theme`,`dark`)}catch{}M.setBackgroundColor?.(988191)}else{un.classList.remove(`tv-app--dark`),typeof document<`u`&&(document.documentElement.classList.remove(`dark`),document.documentElement.setAttribute(`data-theme`,`light`)),pe.textContent=`Dark`,pe.title=`Switch to Dark Mode`,je.textContent=`Dark`,je.title=`Switch to Dark Mode`;try{localStorage.setItem(`dental_theme`,`light`)}catch{}M.setBackgroundColor?.(15460320)}},pe=p_(ue?`Light`:`Dark`,()=>fe(),`tv-btn--tool tv-btn--theme-toggle`);pe.title=ue?`Switch to Light Mode`:`Switch to Dark Mode`;let me=document.createElement(`a`);me.href=`/dashboard`,me.className=`tv-cad-top-bar__btn tv-cad-top-bar__btn--back`,me.title=`Return to Doctor Dashboard`,me.innerHTML=`
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
    <span>Dashboard</span>
  `;let he=p_(`3D Progression`,()=>Le(),`tv-cad-top-bar__btn tv-cad-top-bar__btn--progression`);he.title=`Switch back to 3D Treatment Progression timeline`;let ge=Q(`tv-cad-top-bar__chip`,[$(`tv-cad-top-bar__dot`,``),$(`tv-cad-top-bar__patient-name`,d.manifest.patientName??d.manifest.caseId)]),_e=document.createElement(`button`);_e.type=`button`,_e.className=`tv-cad-arch-btn tv-cad-arch-btn--active`,_e.textContent=`Upper Arch`,_e.title=`Switch to Upper Maxillary arch`,_e.addEventListener(`click`,()=>{Pe&&Pe.setArch(`upper`),Oe.classList.contains(`tv-cam-btn--active`)&&M.setView(`front`)});let ve=document.createElement(`button`);ve.type=`button`,ve.className=`tv-cad-arch-btn`,ve.textContent=`Lower Arch`,ve.title=`Switch to Lower Mandibular arch`,ve.addEventListener(`click`,()=>{Pe&&Pe.setArch(`lower`),Oe.classList.contains(`tv-cam-btn--active`)&&M.setView(`back`)});let ye=Q(`tv-cad-arch-pill`,[_e,ve]),be=document.createElement(`button`);be.type=`button`,be.className=`tv-cad-tab-btn tv-cad-tab-btn--active`,be.textContent=`1. Blockout`,be.title=`Step 1: Undercut Survey & Blockout Parameters`,be.addEventListener(`click`,()=>{Pe?.setActiveTab(`blockout`),W(`blockout`)});let xe=document.createElement(`button`);xe.type=`button`,xe.className=`tv-cad-tab-btn`,xe.textContent=`2. Wax Carver`,xe.title=`Step 2: 3D Digital Wax Sculptor & Carver`,xe.addEventListener(`click`,()=>{Pe?.setActiveTab(`sculpt`),W(`sculpt`)});let U=document.createElement(`button`);U.type=`button`,U.className=`tv-cad-tab-btn`,U.textContent=`3. Print Prep`,U.title=`Step 3: Resin Shrinkage, Drainage Holes & STL Export`,U.addEventListener(`click`,()=>{Pe?.setActiveTab(`prep`),W(`prep`)});let Se=Q(`tv-cad-tabs-pill`,[be,xe,U]);function W(e){be.classList.toggle(`tv-cad-tab-btn--active`,e===`blockout`),xe.classList.toggle(`tv-cad-tab-btn--active`,e===`sculpt`),U.classList.toggle(`tv-cad-tab-btn--active`,e===`prep`)}let Ce=!1,G=document.createElement(`button`);G.type=`button`,G.className=`tv-cad-view-dock__toggle`,G.setAttribute(`aria-label`,`Collapse camera view controls`),G.innerHTML=`
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="tv-cad-view-dock__arrow">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  `,G.title=`Collapse camera views`;function we(e){[Te,Ee,K,De,Oe].forEach(e=>{e.classList.remove(`tv-cam-btn--active`)}),e.classList.add(`tv-cam-btn--active`)}let Te=p_(`Front`,()=>{M.setView(`top`),we(Te)},`tv-cam-btn tv-cam-btn--active`);Te.title=`Frontal smile view`;let Ee=p_(`Back`,()=>{M.setView(`bottom`),we(Ee)},`tv-cam-btn`);Ee.title=`Lingual / back view`;let K=p_(`Left`,()=>{M.setView(`left`),we(K)},`tv-cam-btn`);K.title=`Left lateral profile view`;let De=p_(`Right`,()=>{M.setView(`right`),we(De)},`tv-cam-btn`);De.title=`Right lateral profile view`;let Oe=p_(`Bottom`,()=>{let e=Pe?Pe.getArch()===`lower`:!d.upperVisible&&d.lowerVisible;M.setView(e?`back`:`front`),we(Oe)},`tv-cam-btn`);Oe.title=`Occlusal view of teeth`;let ke=p_(`Reset`,()=>{M.setView(`top`),M.fitAll(),we(Te)},`tv-cam-btn tv-cam-btn--gold`);ke.title=`Reset and frame dental models in frontal smile position`;let Ae=Q(`tv-cad-view-dock`,[G,Q(`tv-cad-view-dock__buttons`,[Te,Ee,K,De,Oe,ke])]);Ae.hidden=!0,G.addEventListener(`click`,()=>{Ce=!Ce,Ae.classList.toggle(`tv-cad-view-dock--collapsed`,Ce),G.title=Ce?`Expand camera views`:`Collapse camera views`});let je=p_(ue?`Light`:`Dark`,()=>fe(),`tv-cad-tool-btn`);je.title=ue?`Switch to Light Mode`:`Switch to Dark Mode`;let Me=Q(`tv-cad-top-bar`,[Q(`tv-cad-top-bar__left`,[me,he,ge]),Q(`tv-cad-top-bar__center`,[ye,Se]),Q(`tv-cad-top-bar__right`,[je])]);function Ne(e,t){let n=e===`upper`;_e.classList.toggle(`tv-cad-arch-btn--active`,n),ve.classList.toggle(`tv-cad-arch-btn--active`,!n)}let Pe=null,Fe=null,Ie=()=>{},Le=()=>{if(Pe)Pe.unmount(),Pe=null,u=!1,Ie(!1),Re.classList.remove(`tv-btn--active`),on.hidden=!0,Fe&&=(d.upperVisible=Fe.upper,d.lowerVisible=Fe.lower,null),M.setLayerVisible(v,d.upperVisible),M.setLayerVisible(y,d.lowerVisible),$n();else{Fe={upper:d.upperVisible,lower:d.lowerVisible},u=!0;let e=d.upperVisible?`upper`:`lower`,t=e===`upper`;d.upperVisible=t,d.lowerVisible=!t,M.setLayerVisible(v,t),M.setLayerVisible(y,!t),M.setView(`top`),M.fitAll(),Ie(!0),Re.classList.add(`tv-btn--active`),on.hidden=!0,d.notesOpen&&kn(!1),H.hidden=!0,Et.hidden=!0,kt.hidden=!0,jt.hidden=!0,Ne(e,Math.max(0,d.currentIndex)),W(`blockout`),Pe=new a_({viewport:M,manifest:d.manifest,initialArch:e,initialStageIndex:Math.max(0,d.currentIndex),onExit:()=>{Le()},onTabChange:e=>{W(e)},onStageChange:e=>{Cn(e).then(()=>{Ne(Pe?.getArch()??`upper`,e),Pe?.reloadCurrentStage()})},onArchChange:e=>{let t=e===`upper`;d.upperVisible=t,d.lowerVisible=!t,M.setLayerVisible(v,t),M.setLayerVisible(y,!t),M.setView(`top`),M.fitAll(),Ne(e,d.currentIndex)}}),Pe.mount(cn)}},Re=p_(`Blockout Studio`,()=>Le(),`tv-btn--tool tv-btn--blockout`);Re.title=`Undercut Survey, Digital Wax Blockout & Print Prep`;let ze=p_(`Treatment Plan`,()=>On(),`tv-btn--tool tv-btn--notes`);ze.title=`View treatment plan, instructions & case remarks`;let Be=!1,Ve=p_(`Grid`,()=>{Be=!Be,z.hidden=!Be,M.setGridVisible(!1),Ve.classList.toggle(`tv-btn--active`,Be)},`tv-btn--tool`);Ve.title=`Toggle alignment reference grid`;let He=p_(`Recenter`,()=>{M.setView(`top`),M.fitAll()},`tv-btn--tool`);He.title=`Reset and frame dental models in frontal smile position`;let Ue=p_(`Stages`,()=>{un.classList.toggle(`tv-app--sidebar-open`)},`tv-btn--tool tv-btn--sidebar-toggle`);Ue.title=`Toggle stage progression drawer`;let We=p_(`Front`,()=>M.setView(`top`),`tv-cam-btn`);We.title=`Frontal smile view`;let Ge=p_(`Bottom`,()=>{let e=Pe?Pe.getArch()===`lower`:!d.upperVisible&&d.lowerVisible;M.setView(e?`back`:`front`)},`tv-cam-btn`);Ge.title=`Occlusal view of teeth`;let Ke=p_(`Back`,()=>M.setView(`bottom`),`tv-cam-btn`);Ke.title=`Lingual/back view`;let q=p_(`Top`,()=>M.setView(`back`),`tv-cam-btn`);q.title=`Top occlusal view`;let qe=p_(`Reset`,()=>{M.setView(`top`),M.fitAll()},`tv-cam-btn tv-cam-btn--gold`);qe.title=`Reset view to frontal smile position`;let Je=Q(`tv-camera-dock`,[We,Ge,Ke,q,qe]),Ye=$(`tv-stage-label`,`Stage 1 / 1`);Ye.title=`View all treatment stages`,Ye.addEventListener(`click`,()=>{er()});let Xe=document.createElement(`input`);Xe.type=`range`,Xe.min=`1`,Xe.max=String(Math.max(1,d.manifest.treatmentStages.length)),Xe.step=`1`,Xe.value=`1`,Xe.className=`tv-slider`,Xe.setAttribute(`aria-label`,`Treatment stage`);let Ze=p_(`‹`,()=>{Sn(),Cn(d.currentIndex-1)},`tv-stepper-btn`);Ze.title=`Previous stage`;let Qe=p_(`▶ Play`,()=>gn(),`tv-btn--play tv-sr-only`),$e=document.createElement(`button`);$e.type=`button`,$e.className=`tv-btn--play-circle`,$e.setAttribute(`aria-label`,`Play / pause treatment progression`),$e.innerHTML=`▶`,$e.title=`Play / pause treatment progression`,$e.addEventListener(`click`,()=>gn());let et=[1,.5,1.5],tt=document.createElement(`button`);tt.type=`button`,tt.className=`tv-btn--speed`,tt.textContent=`1x`,tt.title=`Playback speed: 1x (Click to cycle: 1x, 0.5x, 1.5x)`,tt.setAttribute(`aria-label`,`Playback speed: 1x`),tt.addEventListener(`click`,()=>{vn()});let nt=p_(`›`,()=>{Sn(),Cn(d.currentIndex+1)},`tv-stepper-btn`);nt.title=`Next stage`;let rt=null;Xe.addEventListener(`input`,()=>{Sn();let e=Number(Xe.value)-1;g=e,Xn(),Qn(),rt!==null&&clearTimeout(rt),rt=window.setTimeout(()=>{rt=null,Cn(e)},45)});let it=p_(`Before`,()=>{Sn(),Cn(0)},`tv-ba-btn tv-ba-btn--active`);it.title=`Jump to initial pre-treatment stage`;let at=p_(`After`,()=>{Sn();let e=d.manifest.treatmentStages.length;e>0&&Cn(e-1)},`tv-ba-btn`);at.title=`Jump to final aligned outcome stage`;let ot=Q(`tv-ba-pill`,[it,at]),st=p_(`Contacts`,()=>jn(),`tv-ba-btn tv-dock-tool-btn`);st.title=`Inspect occlusal bite contact collision & clearance heatmap`;let ct=p_(`Overlay`,()=>{Nn()},`tv-ba-btn tv-dock-tool-btn`);ct.title=`Overlay initial stage against current stage with blend slider`;let lt=p_(`Attachments`,()=>In(),`tv-ba-btn tv-dock-tool-btn`);lt.title=`Toggle visibility of orthodontic composite attachments (contrast deep orange engagers)`,lt.setAttribute(`aria-pressed`,`false`),lt.dataset.tool=`attachments`;let ut=p_(`IPR`,()=>Bn(),`tv-ba-btn tv-dock-tool-btn`);ut.title=`Toggle planned Interproximal Reduction (IPR) values and contact callouts`,ut.setAttribute(`aria-pressed`,`false`);let dt=!1,ft=document.createElement(`button`);ft.type=`button`,ft.className=`tv-ba-btn tv-dock-tool-btn tv-dock-minimize-btn`,ft.title=`Minimise playback controls (M)`,ft.setAttribute(`aria-label`,`Minimise playback controls`);let pt=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);pt.setAttribute(`class`,`tv-dock-minimize-icon`),pt.setAttribute(`viewBox`,`0 0 24 24`),pt.setAttribute(`width`,`13`),pt.setAttribute(`height`,`13`),pt.setAttribute(`fill`,`none`),pt.setAttribute(`stroke`,`currentColor`),pt.setAttribute(`stroke-width`,`2.5`),pt.setAttribute(`stroke-linecap`,`round`),pt.setAttribute(`stroke-linejoin`,`round`);let mt=document.createElementNS(`http://www.w3.org/2000/svg`,`polyline`);mt.setAttribute(`points`,`6 9 12 15 18 9`),pt.appendChild(mt),ft.append(pt);let ht=document.createElement(`button`);ht.type=`button`,ht.className=`tv-dock-expand-pill`,ht.title=`Expand playback controls (M)`,ht.setAttribute(`aria-label`,`Expand playback controls`),ht.hidden=!0;let gt=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);gt.setAttribute(`class`,`tv-dock-expand-icon`),gt.setAttribute(`viewBox`,`0 0 24 24`),gt.setAttribute(`width`,`14`),gt.setAttribute(`height`,`14`),gt.setAttribute(`fill`,`none`),gt.setAttribute(`stroke`,`currentColor`),gt.setAttribute(`stroke-width`,`2.5`),gt.setAttribute(`stroke-linecap`,`round`),gt.setAttribute(`stroke-linejoin`,`round`);let _t=document.createElementNS(`http://www.w3.org/2000/svg`,`polyline`);_t.setAttribute(`points`,`18 15 12 9 6 15`),gt.appendChild(_t);let vt=$(`tv-dock-expand-label`,`Controls · Stage 1 of 1`);ht.append(gt,vt);function yt(){let e=d.manifest.treatmentStages.length||1,t=g??d.currentIndex,n=d.manifest.treatmentStages[t]?.stageNumber??t+1;vt.textContent=`Controls · Stage ${n} of ${e}`}function bt(e){dt=e,Y.classList.toggle(`tv-bottom-dock--hidden`,dt),Y.hidden=dt,ht.hidden=!dt,dt&&yt()}function xt(){bt(!dt)}ft.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),bt(!0)}),ht.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),bt(!1)});let St=Q(`tv-dock-tools`,[ft,ot,st,ct,lt,ut]),Ct=Q(`tv-scrubber-track`),wt=Q(`tv-scrubber-buffer-bar`),J=Q(`tv-scrubber-fill`),Tt=Q(`tv-scrubber-dots`);Ct.append(wt,J,Tt);let Y=Q(`tv-bottom-dock tv-stage-controls`,[St,Q(`tv-scrubber-wrap`,[Q(`tv-scrubber-row`,[Ze,Q(`tv-scrubber-interactive`,[Ct,Xe]),nt]),Ye]),Q(`tv-bottom-dock__actions`,[tt,$e,Qe,L,R])]),Et=Q(`tv-contacts-legend`,[Q(`tv-contacts-legend__header`,[$(`tv-contacts-legend__title`,`Bite Contacts`),p_(`✕`,()=>jn(),`tv-btn--subtle tv-contacts-legend__close`)]),Q(`tv-contacts-legend__scale`,[$(`tv-contacts-legend__item tv-contacts-legend__item--heavy`,`● <0.25mm Heavy`),$(`tv-contacts-legend__item tv-contacts-legend__item--medium`,`● <0.6mm Medium`),$(`tv-contacts-legend__item tv-contacts-legend__item--light`,`● <1.0mm Light`)])]);Et.hidden=!0;let Dt=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);Dt.setAttribute(`class`,`tv-ipr-overlay`);let Ot=Q(`tv-ipr-legend__body`),kt=Q(`tv-ipr-legend`,[Q(`tv-ipr-legend__header`,[Q(`tv-ipr-legend__title-wrap`,[$(`tv-ipr-legend__title`,`Interproximal Reduction (IPR)`)]),p_(`✕`,()=>Bn(),`tv-btn--subtle tv-contacts-legend__close`)]),Ot]);kt.hidden=!0;let At=document.createElement(`input`);At.type=`range`,At.min=`0`,At.max=`100`,At.value=`50`,At.className=`tv-overlay-slider`,At.addEventListener(`input`,()=>{Pn(Number(At.value)/100)});let jt=Q(`tv-overlay-panel`,[Q(`tv-overlay-panel__header`,[$(`tv-overlay-panel__title`,`Stage Comparison Overlay`),p_(`✕`,()=>{Nn()},`tv-btn--subtle tv-overlay-panel__close`)]),Q(`tv-overlay-panel__controls`,[$(`tv-overlay-panel__label`,`Stage 1 (Initial)`),At,$(`tv-overlay-panel__label`,`Current Stage`)])]);jt.hidden=!0;let Mt=Q(`tv-template-notice`,[$(`tv-template-badge`,`Doctor Mode: Viewing Reference Template (Excluded from Patient Progression)`),p_(`Return to Patient Progression`,()=>{d.activeTemplateStage=null,Cn(Math.max(0,d.currentIndex))},`tv-btn--subtle`)]);Mt.hidden=!0;let Nt=Q(`tv-status`,[]);Nt.setAttribute(`role`,`status`),Nt.setAttribute(`aria-live`,`polite`),Nt.hidden=!0;let Pt=Q(`tv-ambiguity-banner`,[]);Pt.hidden=!0;let Ft=$(`tv-loading__text`,`Loading 3D Models…`),It=Q(`tv-loading__bar-fill`,[]),Lt=Q(`tv-loading__bar-track`,[It]),Rt=Q(`tv-loading`,[Q(`tv-loading__spinner`,[]),Ft,Lt]);Rt.hidden=!0;let zt=!1;function Bt(e,t){if(!d.loading)return;let n=e??pg(),r=t??d.manifest.treatmentStages.length;if(r<=0)return;let i=Math.min(100,Math.round(n/r*100));i>=100?(Ft.textContent=`All 3D models ready!`,It.style.width=`100%`,It.classList.remove(`tv-loading__bar-fill--pulse`)):(Ft.textContent=`Optimizing 3D models for smooth playback: ${n} of ${r} stages ready (${i}%)`,It.style.width=`${i}%`,It.classList.remove(`tv-loading__bar-fill--pulse`))}Lh((e,t,n)=>{if(d.loading){if(t>0){let r=(e/1048576).toFixed(1),i=(t/1048576).toFixed(1);n>=100?(zt=!0,Bt()):(zt=!1,Ft.textContent=`Downloading 3D Models: ${n}% (${r} / ${i} MB)`,It.style.width=`${n}%`,It.classList.remove(`tv-loading__bar-fill--pulse`))}else zt||(Ft.textContent=`Downloading 3D Models…`,It.style.width=`25%`,It.classList.add(`tv-loading__bar-fill--pulse`))}}),fg((e,t,n)=>{Xn(),d.loading&&Bt(t,n)});let Vt=Q(`tv-hud`,[]),Ht=Q(`tv-sidebar__patient-name`,[`Patient Case`]),Ut=Q(`tv-sidebar__patient-demographics`),Wt=$(`tv-sidebar__badge`,`10 Stages`),Gt=$(`tv-sidebar__status-dot`,``),Kt=Q(`tv-sidebar__list`),qt=Q(`tv-sidebar-backdrop`),Jt=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);Jt.setAttribute(`viewBox`,`0 0 24 24`),Jt.setAttribute(`width`,`18`),Jt.setAttribute(`height`,`18`),Jt.setAttribute(`fill`,`none`),Jt.setAttribute(`stroke`,`currentColor`),Jt.setAttribute(`stroke-width`,`2`),Jt.setAttribute(`stroke-linecap`,`round`),Jt.setAttribute(`stroke-linejoin`,`round`);let Yt=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);Yt.setAttribute(`d`,`M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2`);let Xt=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);Xt.setAttribute(`cx`,`12`),Xt.setAttribute(`cy`,`7`),Xt.setAttribute(`r`,`4`),Jt.append(Yt,Xt);let Zt=Q(`tv-sidebar`,[Q(`tv-sidebar__header`,[$(`tv-sidebar__header-title`,`Treatment Stages`),p_(`✕`,()=>un.classList.remove(`tv-app--sidebar-open`),`tv-btn--subtle tv-sidebar__close-btn`)]),Q(`tv-sidebar__card`,[Q(`tv-sidebar__avatar`,[Jt]),Q(`tv-sidebar__patient-info`,[Ht,Ut,Q(`tv-sidebar__status-row`,[Gt,Wt])])]),Kt]),Qt=$(`tv-tooth-tooltip__badge`,`#25`),$t=$(`tv-tooth-tooltip__notation`,`UL5`),en=$(`tv-tooth-tooltip__quadrant`,`Upper Left (Q2)`),tn=Q(`tv-tooth-tooltip__name`,[`Upper Left Second Premolar`]),nn=$(`tv-tooth-tooltip__delta`,`0.00 mm`),rn=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);rn.setAttribute(`class`,`tv-tooth-tooltip__pulse`),rn.setAttribute(`viewBox`,`0 0 24 24`),rn.setAttribute(`fill`,`none`),rn.setAttribute(`stroke`,`currentColor`),rn.setAttribute(`stroke-width`,`2.2`),rn.setAttribute(`stroke-linecap`,`round`),rn.setAttribute(`stroke-linejoin`,`round`);let an=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);an.setAttribute(`d`,`M22 12h-4l-3 9L9 3l-3 9H2`),rn.appendChild(an);let on=Q(`tv-tooth-tooltip`,[Q(`tv-tooth-tooltip__header`,[Qt,$t,en]),tn,Q(`tv-tooth-tooltip__movement`,[rn,$(`tv-tooth-tooltip__movement-label`,`Moved since stage 1`),nn])]);on.hidden=!0;let sn=Q(`tv-stage__top-bar`,[Q(`tv-stage__top-left`,[Ue]),Q(`tv-stage__top-center`,[I]),Q(`tv-stage__top-right`,[Ve,He,pe])]),cn=Q(`tv-stage`,[j,z,Dt,sn,Mt,Et,kt,jt,H,oe,le,Je,Ae,Y,ht,Rt,Vt,Pt,Nt,on]),ln=Q(`tv-header`,[Q(`tv-header__brand`,[Q(`tv-header__title-wrap`,[f_(`3D Treatment Progression`)]),Q(`tv-header__divider`),Q(`tv-header__sub tv-header__patient-chip`,[$(`tv-header__patient-dot`,``),$(`tv-header__patient-label`,`Patient`),$(`tv-header__patient-name`,d.manifest.patientId?`${d.manifest.patientName??d.manifest.caseId} (#${d.manifest.patientId})`:d.manifest.patientName??d.manifest.caseId),...d.manifest.patientSex||d.manifest.patientAge!=null?[$(`tv-header__patient-demo`,[d.manifest.patientSex,d.manifest.patientAge==null?null:`${d.manifest.patientAge}y`].filter(Boolean).join(` · `))]:[],...d.manifest.isRefinement?[$(`tv-header__patient-demo tv-header__refinement-pill`,`✦ Refinement`)]:[],...d.manifest.clinicName?[$(`tv-header__patient-demo`,d.manifest.clinicName)]:[]])]),Q(`tv-header__actions`,[ze,Ve,He,pe])]),un=Q(typeof window<`u`&&window.innerWidth<=900?`tv-app`:`tv-app tv-app--sidebar-open`,[ln,Me,Q(`tv-main-container`,[qt,Zt,cn])]);Ie=e=>{un.classList.toggle(`tv-app--blockout-mode`,e),Me.hidden=!e,Me.style.display=e?`flex`:`none`,ln.hidden=e,ln.style.display=e?`none`:``,Zt.hidden=e,Zt.style.display=e?`none`:``,qt.hidden=e,qt.style.display=e?`none`:``,Y.hidden=e||dt,Y.style.display=e||dt?`none`:``,ht.hidden=e||!dt,ht.style.display=e?`none`:dt?``:`none`,sn.hidden=e,sn.style.display=e?`none`:``,Je.hidden=e,Je.style.display=e?`none`:``,Ae.hidden=!e,Ae.style.display=e?`flex`:`none`,on.hidden=!0,on.style.display=e?`none`:``},Ie(u),ue?(un.classList.add(`tv-app--dark`),typeof document<`u`&&(document.documentElement.classList.add(`dark`),document.documentElement.setAttribute(`data-theme`,`dark`)),M.setBackgroundColor?.(988191)):(un.classList.remove(`tv-app--dark`),typeof document<`u`&&(document.documentElement.classList.remove(`dark`),document.documentElement.setAttribute(`data-theme`,`light`)),M.setBackgroundColor?.(15460320)),qt.addEventListener(`click`,()=>{un.classList.remove(`tv-app--sidebar-open`)}),e.replaceChildren(un),Yn(),Zn();let dn=e=>{e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||(e.key===`ArrowLeft`||e.key===`ArrowDown`?(e.preventDefault(),Sn(),Cn(d.currentIndex-1)):e.key===`ArrowRight`||e.key===`ArrowUp`?(e.preventDefault(),Sn(),Cn(d.currentIndex+1)):e.key===` `||e.key===`Spacebar`?(e.preventDefault(),gn()):(e.key===`m`||e.key===`M`)&&(e.preventDefault(),xt()))};window.addEventListener(`keydown`,dn);function fn(e){(u||Pe)&&e===`both`&&(e=(Pe?.getArch()??(d.upperVisible?`upper`:`lower`))===`lower`?`lower`:`upper`),e===`lower`?(d.upperVisible=!1,d.lowerVisible=!0):e===`upper`?(d.upperVisible=!0,d.lowerVisible=!1):(d.upperVisible=!0,d.lowerVisible=!0),M.setLayerVisible(v,d.upperVisible),M.setLayerVisible(y,d.lowerVisible),b&&M.setLayerVisible(b,d.upperVisible),x&&M.setLayerVisible(x,d.lowerVisible),d.overlayActive&&(M.setLayerVisible(f,d.upperVisible),M.setLayerVisible(p,d.lowerVisible)),d.contactsActive&&Mn(),d.iprActive&&Gn(),Pe&&Pe.setArch(e===`lower`?`lower`:`upper`),pn()}function pn(){if(c||l){I.style.display=`none`,st.style.display=`none`;return}let e=!d.upperVisible&&d.lowerVisible,t=d.upperVisible&&!d.lowerVisible,n=d.upperVisible&&d.lowerVisible;N.classList.toggle(`tv-arch-pill__btn--active`,e),P.classList.toggle(`tv-arch-pill__btn--active`,t),F.classList.toggle(`tv-arch-pill__btn--active`,n),L.classList.toggle(`tv-btn--active`,d.upperVisible),R.classList.toggle(`tv-btn--active`,d.lowerVisible)}function mn(){d.upperVisible=!d.upperVisible,M.setLayerVisible(v,d.upperVisible),b&&M.setLayerVisible(b,d.upperVisible),d.iprActive&&Gn(),pn()}function hn(){d.lowerVisible=!d.lowerVisible,M.setLayerVisible(y,d.lowerVisible),x&&M.setLayerVisible(x,d.lowerVisible),d.iprActive&&Gn(),pn()}function gn(){d.isPlaying?Sn():xn()}async function _n(){if(!d.isPlaying)return;let e=d.manifest.treatmentStages.length;if(e<=1)return;let t=d.currentIndex,n=(d.currentIndex+1)%e,i=d.manifest.treatmentStages[n];i&&lg(i.id)||$e.classList.add(`tv-btn--buffering`);try{await Cn(n)}finally{$e.classList.remove(`tv-btn--buffering`)}if(!d.isPlaying)return;if(d.currentIndex===t&&d.currentIndex!==n){let r=(n+1)%e;if(r!==t&&await Cn(r),d.currentIndex===t){Sn();return}}let a=n===e-1?Math.round(1200/d.playbackSpeed):Math.round(r/d.playbackSpeed);h=window.setTimeout(()=>{_n()},a)}function vn(){let e=et.indexOf(d.playbackSpeed),t=(e===-1?0:e+1)%et.length,n=et[t]??1;return yn(n),n}function yn(e){if(d.playbackSpeed=e>0?e:1,tt.textContent=`${d.playbackSpeed}x`,tt.title=`Playback speed: ${d.playbackSpeed}x (Click to cycle: 1x, 0.5x, 1.5x)`,tt.setAttribute(`aria-label`,`Playback speed: ${d.playbackSpeed}x`),d.isPlaying&&h!==null){clearTimeout(h);let e=Math.round(r/d.playbackSpeed);h=window.setTimeout(()=>{_n()},e)}}function bn(){return d.playbackSpeed}function xn(){if(d.isPlaying)return;let e=d.manifest.treatmentStages,t=e.length;if(t<=1)return;let n=d.currentIndex>=0?d.currentIndex:0,r=[];for(let i=1;i<=Math.min(12,t);i++){let a=e[(n+i)%t];a&&r.push(a.id)}yg(r),d.isPlaying=!0,Qe.textContent=`⏸ Pause`,Qe.classList.add(`tv-btn--active`),$e.textContent=`⏸`,$e.classList.add(`tv-btn--active`),h!==null&&(clearTimeout(h),h=null),_n()}function Sn(){d.isPlaying=!1,h!==null&&(clearTimeout(h),h=null),Qe.textContent=`▶ Play`,Qe.classList.remove(`tv-btn--active`),$e.textContent=`▶`,$e.classList.remove(`tv-btn--active`)}async function Cn(e){let t=d.manifest.treatmentStages;if(t.length===0)return;let n=Math.max(0,Math.min(t.length-1,e));if(n===d.currentIndex&&!d.activeTemplateStage)return;let r=t[n];if(!r)return;d.activeTemplateStage=null,Mt.hidden=!0,vg(r.id);let i=t[n+1];i&&vg(i.id);let a=t[n+2];a&&vg(a.id),!lg(r.id)&&!d.isPlaying&&(g=n,_=!0,$n());try{await Tn(r,n)}finally{g=null,_=!1,$n()}i&&Kh(i.upper,i.lower),a&&Kh(a.upper,a.lower)}async function wn(e){Sn(),d.activeTemplateStage=e,Mt.hidden=!1,await Tn(e,d.currentIndex)}async function Tn(e,t){d.isPlaying||(d.abortController?.abort(),d.abortController=new AbortController);let n=d.currentIndex===-1,r=c?!!v:l?!!y:!!(v&&y);if(!n&&i<=0&&M.setLayerGeometry&&r){let n=cg(e.id);if(n){d.abortController=null,S!==null&&(cancelAnimationFrame(S),S=null,b&&o&&M.removeLayer(b),x&&s&&M.removeLayer(x),b=null,x=null);let e=d.attachmentsVisible?n.upper:n.upperNoAttachments||n.upper,r=d.attachmentsVisible?n.lower:n.lowerNoAttachments||n.lower;d.contactsActive||wg(e,r),e&&v&&(D=e,M.setLayerGeometry(v,e),M.setLayerOpacity(v,1)),r&&y&&(O=r,M.setLayerGeometry(y,r),M.setLayerOpacity(y,1)),t===0?(T=n.upperCentroids,E=n.lowerCentroids,k={},A={}):(T&&(k=Sh(T,n.upperCentroids)),E&&(A=Sh(E,n.lowerCentroids))),d.currentIndex=t,$n(),Dn(),d.contactsActive&&!c&&!l&&Mn(),d.overlayActive&&Pn(d.overlayBlend),d.iprActive&&(Wn(),Gn()),d.notesOpen&&An();return}}n?(d.loading=!0,$n()):d.isPlaying||(_=!0,$n()),d.error=null;let a=await hg(e);if(_=!1,a.ok){let{upperStageNum:e,lowerStageNum:t}=Uh();if(t!==null&&t>0){let e=d.manifest.treatmentStages;for(let n=t;n<e.length;n++){let r=e[n];if(r&&(!r.lowerStageNumber||r.lowerStageNumber>t)){r.lowerStageNumber=t;let n=e[t-1];n?.lower&&(r.lower={...n.lower})}}}if(e!==null&&e>0){let t=d.manifest.treatmentStages;for(let n=e;n<t.length;n++){let r=t[n];if(r&&(!r.upperStageNumber||r.upperStageNumber>e)){r.upperStageNumber=e;let n=t[e-1];n?.upper&&(r.upper={...n.upper})}}}}if(a.ok&&!n&&i<=0&&M.setLayerGeometry&&r){d.abortController=null,d.loading=!1,_=!1,S!==null&&(cancelAnimationFrame(S),S=null,b&&o&&M.removeLayer(b),x&&s&&M.removeLayer(x),b=null,x=null);let e=a.geometries,n=d.attachmentsVisible?e.upper:e.upperNoAttachments||e.upper,r=d.attachmentsVisible?e.lower:e.lowerNoAttachments||e.lower;d.contactsActive||wg(n,r),n&&v&&(D=n,M.setLayerGeometry(v,n),M.setLayerOpacity(v,1)),r&&y&&(O=r,M.setLayerGeometry(y,r),M.setLayerOpacity(y,1)),t===0?(T=e.upperCentroids,E=e.lowerCentroids,k={},A={}):(T&&(k=Sh(T,e.upperCentroids)),E&&(A=Sh(E,e.lowerCentroids))),d.currentIndex=t,$n(),Dn(),d.contactsActive&&Mn(),d.overlayActive&&Pn(d.overlayBlend),d.iprActive&&(Wn(),Gn()),d.notesOpen&&An();return}let f=a.ok?d.attachmentsVisible?a.geometries.upper:a.geometries.upperNoAttachments||a.geometries.upper:void 0,p=a.ok?d.attachmentsVisible?a.geometries.lower:a.geometries.lowerNoAttachments||a.geometries.lower:void 0;if(!a.ok){if(D||O)f=D||void 0,p=O||void 0;else{d.abortController=null,w=!1,d.loading=!1,d.error=a.reason,$n();return}}if(d.abortController=null,w||(d.loading=!1),n||i<=0){S!==null&&(cancelAnimationFrame(S),S=null);let i=!!f,o=!!p;if(!n&&M.setLayerGeometry&&r)f&&v&&(M.setLayerGeometry(v,f),M.setLayerOpacity(v,1)),p&&y&&(M.setLayerGeometry(y,p),M.setLayerOpacity(y,1));else{if(M.clearLayers(),C++,v=n?o_:`${o_}-${C}`,y=n?s_:`${s_}-${C}`,b=null,x=null,i){let t=M.addLayer({id:v,label:`${e.label} - Upper`,colour:c_,stl:void 0,geometry:f||void 0});if(!t.ok){d.error=`Upper jaw: ${t.reason}`,$n();return}M.setLayerVisible(v,d.upperVisible),M.setLayerOpacity(v,1)}if(o){let t=M.addLayer({id:y,label:`${e.label} - Lower`,colour:l_,stl:void 0,geometry:p||void 0});if(!t.ok){d.error=`Lower jaw: ${t.reason}`,$n();return}M.setLayerVisible(y,d.lowerVisible),M.setLayerOpacity(y,1)}if(u||Pe){let e=(Pe?.getArch()??(d.upperVisible?`upper`:`lower`))===`upper`;d.upperVisible=e,d.lowerVisible=!e,M.setLayerVisible(v,e),M.setLayerVisible(y,!e),b&&M.setLayerVisible(b,e),x&&M.setLayerVisible(x,!e)}}if(n&&(M.setView(`top`),M.fitAll(),bg(d.manifest.treatmentStages)),a.ok)t===0?(T=a.geometries.upperCentroids,E=a.geometries.lowerCentroids,k={},A={}):(T&&a.geometries.upperCentroids&&(k=Sh(T,a.geometries.upperCentroids)),E&&a.geometries.lowerCentroids&&(A=Sh(E,a.geometries.lowerCentroids)));else{let e=i?M.getLayerGeometry?.(v):null,n=o?M.getLayerGeometry?.(y):null;if(t===0)e&&(T=xh(e,!0)),n&&(E=xh(n,!1)),k={},A={};else{if(e&&T){let t=xh(e,!0);k=Sh(T,t)}if(n&&E){let e=xh(n,!1);A=Sh(E,e)}}}d.contactsActive&&!c&&!l&&Mn(),d.overlayActive&&Pn(d.overlayBlend),d.iprActive&&(Wn(),Gn())}else{S!==null&&(cancelAnimationFrame(S),S=null,b&&o&&M.removeLayer(b),x&&s&&M.removeLayer(x)),b=v,x=y,C++;let n=`${o_}-${C}`,r=`${s_}-${C}`,a=!!f,m=!!p;if(a){let t=M.addLayer({id:n,label:`${e.label} - Upper`,colour:c_,stl:void 0,geometry:f||void 0});if(!t.ok){d.error=`Upper jaw: ${t.reason}`,$n();return}M.setLayerVisible(n,d.upperVisible),M.setLayerOpacity(n,0),v=n}if(m){let t=M.addLayer({id:r,label:`${e.label} - Lower`,colour:l_,stl:void 0,geometry:p||void 0});if(!t.ok){d.error=`Lower jaw: ${t.reason}`,$n();return}if(M.setLayerVisible(r,d.lowerVisible),M.setLayerOpacity(r,0),y=r,u||Pe){let e=(Pe?.getArch()??(d.upperVisible?`upper`:`lower`))===`upper`;d.upperVisible=e,d.lowerVisible=!e,M.setLayerVisible(v,e),M.setLayerVisible(y,!e),b&&M.setLayerVisible(b,e),x&&M.setLayerVisible(x,!e)}}let h=a?M.getLayerGeometry?.(n):null,g=m?M.getLayerGeometry?.(r):null;if(t===0)h&&(T=xh(h,!0)),g&&(E=xh(g,!1)),k={},A={};else{if(h&&T){let e=xh(h,!0);k=Sh(T,e)}if(g&&E){let e=xh(g,!1);A=Sh(E,e)}}let _=performance.now(),w=b,D=x,O=e=>{let t=e-_,o=Math.min(1,t/i),s=o*o*(3-2*o);a&&(w&&M.setLayerOpacity(w,1-s),M.setLayerOpacity(n,s)),m&&(D&&M.setLayerOpacity(D,1-s),M.setLayerOpacity(r,s)),t<i?S=requestAnimationFrame(O):(S=null,a&&(w&&M.removeLayer(w),M.setLayerOpacity(n,1)),m&&(D&&M.removeLayer(D),M.setLayerOpacity(r,1)),b=null,x=null,d.contactsActive&&!c&&!l&&Mn(),d.overlayActive&&Pn(d.overlayBlend),d.iprActive&&(Wn(),Gn()))};S=requestAnimationFrame(O)}d.currentIndex=t,$n(),Dn(),d.iprActive&&(Wn(),Gn()),d.notesOpen&&An()}function En(e){d.metricsPanelOpen=e,H.hidden=!e,H.classList.toggle(`tv-drawer--open`,e),H.style.display=e?`flex`:`none`,H.style.visibility=e?`visible`:`hidden`,H.style.opacity=e?`1`:`0`,H.style.pointerEvents=e?`auto`:`none`,H.style.backdropFilter=`none`,H.style.webkitBackdropFilter=`none`,e?(d.notesOpen&&kn(!1),Dn()):requestAnimationFrame(()=>{M.render?.()})}function Dn(){if(!d.metricsPanelOpen)return;let e=d.manifest.treatmentStages,t=e.length,n=d.currentIndex,r=e[n];if(r){let e=r.stageNumber??n+1;ee.textContent=n===0?`Initial (Stage ${e})`:`Stage ${e} of ${t}`}let i=Th(!0,k);B.replaceChildren(...i.map(e=>X(e.fdi,e.fullLabel,e.displacementMm)));let a=Th(!1,A);te.replaceChildren(...a.map(e=>X(e.fdi,e.fullLabel,e.displacementMm)))}function On(){kn(!d.notesOpen)}function kn(e){if(d.notesOpen=e,le.hidden=!e,le.classList.toggle(`tv-drawer--open`,e),le.style.display=e?`flex`:`none`,le.style.visibility=e?`visible`:`hidden`,le.style.opacity=e?`1`:`0`,le.style.pointerEvents=e?`auto`:`none`,le.style.backdropFilter=`none`,le.style.webkitBackdropFilter=`none`,oe.hidden=!e,oe.classList.toggle(`tv-backdrop--open`,e),oe.style.display=e?`block`:`none`,oe.style.visibility=e?`visible`:`hidden`,oe.style.opacity=e?`1`:`0`,oe.style.pointerEvents=e?`auto`:`none`,oe.style.backdropFilter=`none`,oe.style.webkitBackdropFilter=`none`,ze.classList.toggle(`tv-btn--active`,e),ze.setAttribute(`aria-expanded`,String(e)),e){d.metricsPanelOpen&&En(!1),An();let e=d.manifest.doctorNotes;e&&(e.general||e.doctorName||e.clinicName||Array.isArray(e.stageRemarks)&&e.stageRemarks.length>0)||Un()}else requestAnimationFrame(()=>{M.render?.()})}function An(){if(!d.notesOpen)return;let e=d.manifest.doctorNotes,t=d.manifest.treatmentStages,n=d.currentIndex,r=t[n]?.stageNumber??n+1;ne.replaceChildren();let i=e?.clinicName||d.manifest.clinicName,a=[d.manifest.patientSex,d.manifest.patientAge==null?null:`${d.manifest.patientAge} yrs`].filter(Boolean).join(` · `);if(e?.doctorName||i||e?.updatedAt||d.manifest.patientId||a){let t=[],n=Q(`tv-notes-meta-left`);e?.doctorName&&n.appendChild($(`tv-notes-doctor-name`,e.doctorName)),i&&n.appendChild($(`tv-notes-clinic-name`,i)),d.manifest.patientId&&n.appendChild($(`tv-notes-patient-id`,`Patient ID: ${d.manifest.patientId}`)),a&&n.appendChild($(`tv-notes-demographics`,`Patient: ${a}`)),t.push(n),e?.updatedAt&&t.push($(`tv-notes-date`,`Updated: ${e.updatedAt}`));let r=Q(`tv-notes-meta-card`,t);ne.appendChild(r)}if(re.replaceChildren(),e?.wearHoursPerDay||e?.daysPerStage){let t=[];e.wearHoursPerDay&&t.push(Q(`tv-notes-guideline-chip`,[$(`tv-notes-guideline-label`,`Daily Wear`),$(`tv-notes-guideline-val`,`${e.wearHoursPerDay} hrs / day`)])),e.daysPerStage&&t.push(Q(`tv-notes-guideline-chip`,[$(`tv-notes-guideline-label`,`Tray Duration`),$(`tv-notes-guideline-val`,`${e.daysPerStage} days / tray`)]));let n=e?.aligner_counts,r=n?.upper??d.manifest.upperStagesCount,i=n?.lower??d.manifest.lowerStagesCount;if(r&&i){let e=r!==i;t.push(Q(`tv-notes-guideline-chip`,[$(`tv-notes-guideline-label`,`Prescribed Trays`),$(`tv-notes-guideline-val`,e?`Upper: ${r} · Lower: ${i} (${r+i} Total)`:`${r} Each (${r+i} Total)`)]))}re.appendChild(Q(`tv-notes-guidelines-wrap`,t))}else if(e?.aligner_counts||d.manifest.upperStagesCount&&d.manifest.lowerStagesCount){let t=e?.aligner_counts,n=t?.upper??d.manifest.upperStagesCount,r=t?.lower??d.manifest.lowerStagesCount;if(n&&r){let e=n!==r;re.appendChild(Q(`tv-notes-guidelines-wrap`,[Q(`tv-notes-guideline-chip`,[$(`tv-notes-guideline-label`,`Prescribed Trays`),$(`tv-notes-guideline-val`,e?`Upper: ${n} · Lower: ${r} (${n+r} Total)`:`${n} Each (${n+r} Total)`)])]))}}if(ie.replaceChildren(),e?.general){let t=Q(`tv-notes-card`,[Q(`tv-notes-card__title`,[`Treatment Plan Instructions`]),Q(`tv-notes-card__text`,[e.general])]);ie.appendChild(t)}else if(!e?.stageRemarks||e.stageRemarks.length===0){let e=document.createElement(`div`);e.className=`tv-notes-empty__icon`,e.innerHTML=`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;let t=Q(`tv-notes-empty`,[e,Q(`tv-notes-empty__title`,[`No Treatment Plan Remarks Yet`]),Q(`tv-notes-empty__sub`,[`The treating doctor has not posted specific remarks for this treatment plan.`])]);ie.appendChild(t)}ae.replaceChildren();let o=e?.stageRemarks||[];if(o.length>0)[...o].sort((e,t)=>e.stage-t.stage).forEach(e=>{let n=Q(`tv-notes-stage-item ${e.stage===r?`tv-notes-stage-item--current`:``}`,[Q(`tv-notes-stage-item__badge`,[`Stage ${e.stage}`]),Q(`tv-notes-stage-item__text`,[e.note])]);n.title=`Click to jump to Stage ${e.stage}`,n.addEventListener(`click`,()=>{let n=t.findIndex(t=>(t.stageNumber??-1)===e.stage);n===-1?e.stage<=t.length&&Cn(e.stage-1):Cn(n)}),ae.appendChild(n)});else{let e=Q(`tv-notes-stage-empty`,[`No stage-specific remarks recorded in treatment plan.`]);ae.appendChild(e)}}function X(e,t,n){let r=n>.05,i=Q(r?`tv-movement-row tv-movement-row--moved`:`tv-movement-row`),a=$(`tv-movement-row__name`,`#${e} ${t}`),o=$(`tv-movement-row__delta`,r?`${n.toFixed(2)} mm`:`—`);return i.append(a,o),i}function jn(){if(d.contactsActive=!d.contactsActive,st.classList.toggle(`tv-dock-tool-btn--active`,d.contactsActive),st.classList.toggle(`tv-ba-btn--active`,d.contactsActive),d.contactsActive)!d.upperVisible&&!d.lowerVisible&&fn(`both`),Mn(),M.setSeparation(0),Et.hidden=!1;else{Et.hidden=!0,M.setSeparation(0);let e=M.getLayerGeometry?.(v),t=M.getLayerGeometry?.(y);wg(e,t),M.setLayerColour(v,c_),M.setLayerColour(y,l_)}}function Mn(){if(!d.contactsActive)return;let e=M.getLayerGeometry?.(v),t=M.getLayerGeometry?.(y);e&&t&&(Cg(e,t),M.setLayerColour(v,`contacts`),M.setLayerColour(y,`contacts`))}async function Nn(){d.overlayActive=!d.overlayActive,ct.classList.toggle(`tv-dock-tool-btn--active`,d.overlayActive),ct.classList.toggle(`tv-ba-btn--active`,d.overlayActive),d.overlayActive?(jt.hidden=!1,await Fn()):(jt.hidden=!0,o&&(M.removeLayer(f),M.setLayerOpacity(v,1)),s&&(M.removeLayer(p),M.setLayerOpacity(y,1)))}function Pn(e){if(d.overlayBlend=e,!d.overlayActive)return;let t=(1-e)*.7,n=Math.max(.25,e);o&&(M.setLayerOpacity(f,t),M.setLayerOpacity(v,n)),s&&(M.setLayerOpacity(p,t),M.setLayerOpacity(y,n))}async function Fn(){if(!d.overlayActive)return;let e=d.manifest.treatmentStages[0];if(!e)return;let[t,n]=await Promise.all([Gh(e.upper,e.lower),hg(e)]);if(t.ok){if(o&&(t.models.upperStl||n.ok&&n.geometries.upper)){let e=n.ok&&n.geometries.upper?d.attachmentsVisible?n.geometries.upper:n.geometries.upperNoAttachments||n.geometries.upper:void 0;M.addLayer({id:f,label:`Initial Stage 1 - Upper Ghost`,colour:m,stl:t.models.upperStl||void 0,geometry:e}),M.setLayerVisible(f,d.upperVisible)}if(s&&(t.models.lowerStl||n.ok&&n.geometries.lower)){let e=n.ok&&n.geometries.lower?d.attachmentsVisible?n.geometries.lower:n.geometries.lowerNoAttachments||n.geometries.lower:void 0;M.addLayer({id:p,label:`Initial Stage 1 - Lower Ghost`,colour:m,stl:t.models.lowerStl||void 0,geometry:e}),M.setLayerVisible(p,d.lowerVisible)}Pn(d.overlayBlend)}}function In(){Ln(!d.attachmentsVisible)}function Ln(e){d.attachmentsVisible=e,lt.classList.toggle(`tv-dock-tool-btn--active`,e),lt.classList.toggle(`tv-ba-btn--active`,e),lt.setAttribute(`aria-pressed`,String(e)),Rn()}function Rn(){if(d.currentIndex<0||d.currentIndex>=d.manifest.treatmentStages.length)return;let e=d.manifest.treatmentStages[d.currentIndex];if(!e)return;let t=cg(e.id);if(!t)return;let n=d.attachmentsVisible?t.upper:t.upperNoAttachments||t.upper,r=d.attachmentsVisible?t.lower:t.lowerNoAttachments||t.lower;if(d.contactsActive||wg(n,r),n&&v&&M.setLayerGeometry&&(M.setLayerGeometry(v,n),b&&M.setLayerGeometry(b,n)),r&&y&&M.setLayerGeometry&&(M.setLayerGeometry(y,r),x&&M.setLayerGeometry(x,r)),d.contactsActive&&Mn(),d.overlayActive){let e=d.manifest.treatmentStages[0];if(e){let t=cg(e.id);if(t){let e=d.attachmentsVisible?t.upper:t.upperNoAttachments||t.upper,n=d.attachmentsVisible?t.lower:t.lowerNoAttachments||t.lower;e&&M.setLayerGeometry&&M.setLayerGeometry(f,e),n&&M.setLayerGeometry&&M.setLayerGeometry(p,n)}}Pn(d.overlayBlend)}}let zn=null;function Bn(){Vn(!d.iprActive)}function Vn(e){d.iprActive=e,ut.classList.toggle(`tv-dock-tool-btn--active`,e),ut.classList.toggle(`tv-ba-btn--active`,e),ut.setAttribute(`aria-pressed`,String(e)),kt.hidden=!e,e?(Wn(),Kn(),Gn(),(!d.manifest.ipr||d.manifest.ipr.length===0)&&Hn()):qn()}async function Hn(){let e=d.manifest.caseId;if(e)try{let t=`https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${e}/manifest.json?t=${Date.now()}`,n=await fetch(t,{cache:`no-store`});if(n.ok){let e=await n.json();if(Array.isArray(e.ipr)&&e.ipr.length>0){d.manifest.ipr=e.ipr,Wn(),Gn();return}}let r=await fetch(`/api/cases/${e}/ipr?t=${Date.now()}`,{cache:`no-store`});if(r.ok){let e=await r.json();Array.isArray(e.ipr)&&e.ipr.length>0&&(d.manifest.ipr=e.ipr,Wn(),Gn())}}catch{}}async function Un(){let e=d.manifest.caseId;if(e)try{let t=`https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${e}/manifest.json?t=${Date.now()}`,n=await fetch(t,{cache:`no-store`});if(n.ok){let e=(await n.json()).doctorNotes;if(e&&(e.general||e.doctorName||e.clinicName||Array.isArray(e.stageRemarks)&&e.stageRemarks.length>0)){d.manifest.doctorNotes=e,d.notesOpen&&An(),$n();return}}let r=await fetch(`/api/cases/${e}/notes?t=${Date.now()}`,{cache:`no-store`});if(r.ok){let e=(await r.json()).doctorNotes;e&&(e.general||e.doctorName||e.clinicName||Array.isArray(e.stageRemarks)&&e.stageRemarks.length>0)&&(d.manifest.doctorNotes=e,d.notesOpen&&An(),$n())}}catch{}}function Wn(){Ot.replaceChildren();let e=d.manifest.ipr||[];if(e.length===0){let e=Q(`tv-ipr-empty`,[$(``,`No IPR prescribed for this treatment case.`)]);Ot.appendChild(e);return}let t=d.manifest.treatmentStages[d.currentIndex]?.stageNumber??d.currentIndex+1,n=e.reduce((e,t)=>e+(t.amountMm||0),0),r=Q(`tv-ipr-legend__summary`,[$(`tv-ipr-legend__count`,`${e.length} planned reductions`),$(`tv-ipr-legend__total`,`Total: ${n.toFixed(2)} mm`)]);Ot.appendChild(r);let i=document.createElement(`table`);i.className=`tv-ipr-table`;let a=document.createElement(`tbody`),o=[...e].sort((e,t)=>e.stage-t.stage||e.toothA-t.toothA);for(let e of o){let n=e.stage===t,r=document.createElement(`tr`);r.className=`tv-ipr-row ${n?`tv-ipr-row--current`:``}`,r.title=`Click to navigate to Stage ${e.stage}`,r.addEventListener(`click`,()=>{let t=d.manifest.treatmentStages.findIndex(t=>(t.stageNumber??-1)===e.stage);t===-1?e.stage<=d.manifest.treatmentStages.length&&Cn(e.stage-1):Cn(t)});let i=document.createElement(`td`);i.className=`tv-ipr-td-stage`,i.textContent=e.stage===1?`Stage 1 (Initial)`:`Stage ${e.stage}`;let o=document.createElement(`td`);o.className=`tv-ipr-td-contact`,o.textContent=`${e.arch===`upper`?`Upper`:`Lower`} ${e.contact}`;let s=document.createElement(`td`);s.className=`tv-ipr-td-amount`,s.textContent=`${e.amountMm.toFixed(2)} mm`,r.append(i,o,s),a.appendChild(r)}i.appendChild(a),Ot.appendChild(i)}function Gn(){if(Dt.replaceChildren(),!d.iprActive||!M.projectPoint)return;let e=d.manifest.ipr||[];if(e.length===0)return;let t=d.manifest.treatmentStages[d.currentIndex],n=t?.stageNumber??d.currentIndex+1,r=e.filter(e=>e.stage===n);if(r.length===0)return;let i=t?cg(t.id):null,a=i?.upperCentroids||T,o=i?.lowerCentroids||E,s=j.clientWidth,c=j.clientHeight;Dt.setAttribute(`viewBox`,`0 0 ${s} ${c}`);let l=document.createElementNS(`http://www.w3.org/2000/svg`,`defs`),u=document.createElementNS(`http://www.w3.org/2000/svg`,`marker`);u.setAttribute(`id`,`ipr-arrow-marker`),u.setAttribute(`viewBox`,`0 0 10 10`),u.setAttribute(`refX`,`7`),u.setAttribute(`refY`,`5`),u.setAttribute(`markerWidth`,`6`),u.setAttribute(`markerHeight`,`6`),u.setAttribute(`orient`,`auto`);let f=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);f.setAttribute(`d`,`M 0 1.5 L 8 5 L 0 8.5 z`),f.setAttribute(`fill`,`#38bdf8`),u.appendChild(f),l.appendChild(u),Dt.appendChild(l);for(let e of r){let t=e.arch===`upper`||e.toothA<30;if(t&&!d.upperVisible||!t&&!d.lowerVisible)continue;let n=Oh(e.toothA,e.toothB,a||void 0,o||void 0);if(!n)continue;let r=t?v:y,i=M.projectPoint({x:n[0],y:n[1],z:n[2]},r||void 0);if(!i||!i.visible||i.x<-60||i.x>s+60||i.y<-60||i.y>c+60)continue;let l=t?-68:68,u=(n[0]>=0?1:-1)*36,f=i.x+u,p=i.y+l,m=i.x-f,h=i.y-p,g=Math.hypot(m,h),_=g>0?m/g:0,b=g>0?h/g:0,x=f+_*14,S=p+b*14,C=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);C.setAttribute(`x1`,String(x)),C.setAttribute(`y1`,String(S)),C.setAttribute(`x2`,String(i.x)),C.setAttribute(`y2`,String(i.y)),C.setAttribute(`stroke`,`#38bdf8`),C.setAttribute(`stroke-width`,`2`),C.setAttribute(`stroke-dasharray`,`4,2`),C.setAttribute(`marker-end`,`url(#ipr-arrow-marker)`),C.setAttribute(`filter`,`drop-shadow(0 1px 2px rgba(0,0,0,0.65))`),Dt.appendChild(C);let w=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);w.setAttribute(`cx`,String(i.x)),w.setAttribute(`cy`,String(i.y)),w.setAttribute(`r`,`3`),w.setAttribute(`fill`,`#38bdf8`),w.setAttribute(`stroke`,`#ffffff`),w.setAttribute(`stroke-width`,`1.5`),w.setAttribute(`filter`,`drop-shadow(0 1px 3px rgba(0,0,0,0.7))`),Dt.appendChild(w);let T=document.createElementNS(`http://www.w3.org/2000/svg`,`g`);T.setAttribute(`transform`,`translate(${f}, ${p})`),T.setAttribute(`class`,`tv-ipr-badge`),T.style.cursor=`pointer`,T.style.pointerEvents=`auto`;let E=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);E.setAttribute(`x`,`-14`),E.setAttribute(`y`,`-14`),E.setAttribute(`width`,`28`),E.setAttribute(`height`,`28`),E.setAttribute(`rx`,`4.5`),E.setAttribute(`transform`,`rotate(45)`),E.setAttribute(`fill`,`#2563eb`),E.setAttribute(`stroke`,`#ffffff`),E.setAttribute(`stroke-width`,`1.8`),E.setAttribute(`filter`,`drop-shadow(0 3px 6px rgba(0,0,0,0.55)) drop-shadow(0 1px 3px rgba(37,99,235,0.45))`);let D=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);D.setAttribute(`text-anchor`,`middle`),D.setAttribute(`dominant-baseline`,`central`),D.setAttribute(`font-family`,`system-ui, -apple-system, sans-serif`),D.setAttribute(`font-size`,`13`),D.setAttribute(`font-weight`,`800`),D.setAttribute(`letter-spacing`,`-0.3px`),D.setAttribute(`fill`,`#ffffff`),D.textContent=(Number.isInteger(e.amountMm*10)?e.amountMm.toFixed(1):e.amountMm.toFixed(2)).replace(/^0/,``),T.append(E,D),T.addEventListener(`mouseenter`,()=>{Qt.textContent=`IPR ${e.amountMm.toFixed(2)} mm`,$t.textContent=`Stage ${e.stage}`,en.textContent=t?`Upper Arch (Maxilla)`:`Lower Arch (Mandible)`,tn.textContent=`Contact Tooth ${e.contact}`,nn.textContent=`Reduction: ${e.amountMm.toFixed(2)} mm`,on.style.left=`${Math.max(10,Math.min(window.innerWidth-250,f-120))}px`;let n=t?p-75<60?p+28:p-75:p+28>window.innerHeight-120?p-75:p+28;on.style.top=`${n}px`,on.hidden=!1}),T.addEventListener(`mouseleave`,()=>{on.hidden=!0}),Dt.appendChild(T)}}function Kn(){if(zn!==null)return;function e(){if(!d.iprActive){zn=null;return}Gn(),zn=requestAnimationFrame(e)}zn=requestAnimationFrame(e)}function qn(){zn!==null&&(cancelAnimationFrame(zn),zn=null),Dt.replaceChildren()}async function Jn(t){Sn(),S!==null&&(cancelAnimationFrame(S),S=null,b&&M.removeLayer(b),x&&M.removeLayer(x),b=null,x=null),d.manifest=Zf(t),d.currentIndex=-1,d.activeTemplateStage=null,T=null,E=null,k=null,A=null,D=null,O=null,Xe.max=String(Math.max(1,t.treatmentStages.length)),Xe.value=`1`;let n=e.querySelector(`.tv-header__patient-name`);if(n){let e=t.patientName??t.caseId;n.textContent=t.patientId?`${e} (#${t.patientId})`:e}Yn(),Zn(),t.ambiguities.length>0?(Pt.textContent=`${t.ambiguities.length} pairing ambiguity detected: ${t.ambiguities[0]}`,Pt.hidden=!1):Pt.hidden=!0,t.treatmentStages.length>0?await tr(t.treatmentStages):(d.error=`This case has no patient-visible treatment stages.`,$n())}function Yn(){Tt.replaceChildren();let e=d.manifest.treatmentStages.length;for(let t=0;t<e;t++){let e=document.createElement(`button`);e.type=`button`,e.className=`tv-scrubber-dot`,e.title=`Jump to stage ${t+1}`,e.addEventListener(`click`,()=>{Sn(),Cn(t)}),Tt.appendChild(e)}Xn()}function Xn(){let e=d.manifest.treatmentStages.length,t=g??d.currentIndex,n=d.manifest.treatmentStages,r=0;if(Tt.querySelectorAll(`.tv-scrubber-dot`).forEach((e,i)=>{let a=n[i],o=!!(a&&lg(a.id));o&&r++,e.classList.toggle(`tv-scrubber-dot--buffered`,o),e.classList.toggle(`tv-scrubber-dot--active`,i===t),e.classList.toggle(`tv-scrubber-dot--passed`,i<t),e.classList.toggle(`tv-scrubber-dot--loading`,!d.isPlaying&&i===g&&g!==d.currentIndex)}),e>1&&t>=0){let n=t/(e-1)*100;J.style.width=`${n}%`}else J.style.width=`0%`;if(e>0){let t=Math.min(100,Math.round(r/e*100));wt.style.width=`${t}%`,wt.title=`Preloaded stages: ${r} / ${e} (${t}%)`}else wt.style.width=`0%`}function Zn(){Kt.replaceChildren();let e=d.manifest.treatmentStages.length,t=d.manifest.patientName??d.manifest.caseId;Ht.textContent=d.manifest.patientId?`${t} (#${d.manifest.patientId})`:t;let n=[d.manifest.patientSex,d.manifest.patientAge==null?null:`${d.manifest.patientAge} yrs`].filter(Boolean).join(` · `);n?(Ut.textContent=n,Ut.hidden=!1):Ut.hidden=!0,Wt.textContent=`${e} ${e===1?`Stage`:`Stages`}`,d.manifest.treatmentStages.forEach((t,n)=>{let r=document.createElement(`button`);r.type=`button`,r.className=`tv-stage-card`,r.title=`Go to ${t.label}`;let i=Q(`tv-stage-card__thumb`,[String(t.stageNumber??n+1)]),{upperNum:a,lowerNum:o,hasMismatch:s}=Xf(t),c=s?`Upper ${a} · Lower ${o}`:`Stage ${t.stageNumber??n+1} of ${e}`,l=Q(s?`tv-stage-card__meta tv-stage-card__meta--mismatch`:`tv-stage-card__meta`,[c]),u=Q(`tv-stage-card__info`,[Q(`tv-stage-card__label`,[t.label]),l]),d=Q(`tv-stage-card__pip`);r.append(i,u,d),r.addEventListener(`click`,()=>{Sn(),Cn(n)}),Kt.appendChild(r)}),Qn()}function Qn(){let e=g??d.currentIndex;Kt.querySelectorAll(`.tv-stage-card`).forEach((t,n)=>{let r=n===e;t.classList.toggle(`tv-stage-card--active`,r),t.classList.toggle(`tv-stage-card--loading`,!d.isPlaying&&n===g&&g!==d.currentIndex),r&&un.classList.contains(`tv-app--sidebar-open`)&&typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`nearest`,behavior:`smooth`})})}function $n(){let e=d.manifest.treatmentStages,t=e.length,n=g??d.currentIndex,r=e[n];if(d.activeTemplateStage)Ye.textContent=`${d.activeTemplateStage.label} (Doctor Reference)`;else if(r){let e=r.stageNumber??n+1,{upperNum:i,lowerNum:a,hasMismatch:o}=Xf(r),s=`Stage ${e} (${n+1} of ${t})`;o&&(d.upperVisible&&d.lowerVisible?s=`Stage ${e} (${n+1} of ${t}) · Upper ${i} · Lower ${a}`:d.upperVisible&&!d.lowerVisible?s=`Stage ${e} (${n+1} of ${t}) · Upper ${i}`:!d.upperVisible&&d.lowerVisible&&(s=`Stage ${e} (${n+1} of ${t}) · Lower ${a} (final)`));let c=!d.isPlaying&&_&&g!==null&&g!==d.currentIndex;Ye.textContent=c?`${s} · Loading 3D model…`:s}else Ye.textContent=`Stage — / ${t}`;dt&&yt(),Xe.value=String(n+1),Xe.disabled=!!d.activeTemplateStage,Ze.disabled=n<=0||!!d.activeTemplateStage,nt.disabled=n>=t-1||!!d.activeTemplateStage,Qe.disabled=!!d.activeTemplateStage,$e.disabled=!!d.activeTemplateStage;let i=n===0,a=t>0&&n===t-1;it.classList.toggle(`tv-ba-btn--active`,i),at.classList.toggle(`tv-ba-btn--active`,a),st.classList.toggle(`tv-dock-tool-btn--active`,d.contactsActive),st.classList.toggle(`tv-ba-btn--active`,d.contactsActive),ct.classList.toggle(`tv-dock-tool-btn--active`,d.overlayActive),ct.classList.toggle(`tv-ba-btn--active`,d.overlayActive),lt.classList.toggle(`tv-dock-tool-btn--active`,d.attachmentsVisible),lt.classList.toggle(`tv-ba-btn--active`,d.attachmentsVisible),lt.setAttribute(`aria-pressed`,String(d.attachmentsVisible)),ut.classList.toggle(`tv-dock-tool-btn--active`,d.iprActive),ut.classList.toggle(`tv-ba-btn--active`,d.iprActive),ut.setAttribute(`aria-pressed`,String(d.iprActive)),ze.classList.toggle(`tv-btn--active`,d.notesOpen);let o=!!(d.manifest.doctorNotes&&(d.manifest.doctorNotes.general||d.manifest.doctorNotes.stageRemarks&&d.manifest.doctorNotes.stageRemarks.length>0));ze.classList.toggle(`tv-btn--has-notes`,o),Xn(),Qn(),pn(),d.loading?(Rt.classList.remove(`tv-loading--fade-out`),Rt.hidden=!1):Rt.hidden||(Rt.classList.add(`tv-loading--fade-out`),setTimeout(()=>{d.loading||(Rt.hidden=!0,Rt.classList.remove(`tv-loading--fade-out`))},220)),d.error===null?d.loading?(Nt.textContent=`Loading 3D Models…`,Nt.className=`tv-status`,Nt.hidden=!1):Nt.hidden=!0:(Nt.textContent=d.error,Nt.className=`tv-status tv-status--error`,Nt.hidden=!1),Pe&&d.currentIndex>=0&&Pe.setStageIndex(d.currentIndex)}function er(){let e=document.querySelector(`.tv-modal-backdrop`);e&&e.remove();let t=Q(`tv-modal-backdrop`),n=Q(`tv-modal`),r=Q(`tv-modal__header`,[f_(`Case Setup: ${d.manifest.patientName??d.manifest.caseId}`),p_(`Close`,()=>t.remove(),`tv-btn--subtle`)]),i=Q(`tv-modal__section`);d.manifest.ambiguities.length>0?i.append(Q(`tv-modal__subtitle--danger`,[`Detected Ambiguities (${d.manifest.ambiguities.length}):`]),...d.manifest.ambiguities.map(e=>Q(`tv-ambiguity-item`,[`• ${e}`]))):i.append(Q(`tv-modal__subtitle--success`,[`All treatment stages and arch pairings are validated.`]));let a=Q(`tv-modal__section`);if(a.append(Q(`tv-modal__subtitle`,[`Doctor-Only Reference Templates:`]),$(`tv-modal__hint`,`These reference scans are strictly excluded from patient progression.`)),d.manifest.templateStages.length===0)a.append(Q(`tv-modal__empty`,[`None present in this case.`]));else{let e=Q(`tv-stage-grid`);d.manifest.templateStages.forEach(n=>{let r=Q(`tv-stage-grid__item tv-stage-grid__item--template`,[Q(`tv-stage-grid__label`,[n.label]),Q(`tv-stage-grid__files`,[n.upper?`Upper: ${n.upper.filename}`:`Upper: None`,document.createElement(`br`),n.lower?`Lower: ${n.lower.filename}`:`Lower: None`]),p_(`Inspect in 3D (Doctor View)`,()=>{t.remove(),wn(n)},`tv-btn--accent tv-btn--small`)]);e.appendChild(r)}),a.appendChild(e)}let o=Q(`tv-modal__section`);o.append(Q(`tv-modal__subtitle`,[`Patient Treatment Progression Stages:`]),$(`tv-modal__hint`,`Stages presented to patient in the progression slider.`));let s=Q(`tv-stage-grid`);d.manifest.treatmentStages.forEach((e,n)=>{let r=Q(`tv-stage-grid__item`,[Q(`tv-stage-grid__label`,[e.label,e.stageNumber===void 0?``:` (Preserved #${e.stageNumber})`]),Q(`tv-stage-grid__files`,[e.upper?`Upper: ${e.upper.filename}`:`Upper: None`,document.createElement(`br`),e.lower?`Lower: ${e.lower.filename}`:`Lower: None`]),p_(`Jump to Stage`,()=>{t.remove(),Cn(n)},`tv-btn--small`)]);s.appendChild(r)}),o.appendChild(s);let c=Q(`tv-modal__section tv-modal__section--drop`),l=document.createElement(`input`);l.type=`file`,l.multiple=!0,l.accept=`.stl,.ply,.obj`,l.style.display=`none`;let u=p_(`Select STL Files to Ingest & Pair…`,()=>l.click(),`tv-btn--primary`);c.append(Q(`tv-modal__subtitle`,[`Ingest Raw STL Files for New Case:`]),$(`tv-modal__hint`,`Upload raw STL files to automatically detect stages, upper/lower jaws, and doctor templates.`),l,u);let f=Q(`tv-validation-results`);f.hidden=!0,l.addEventListener(`change`,()=>{if(!l.files||l.files.length===0)return;let e=Yf(Array.from(l.files).map(e=>({name:e.name,file:e,size:e.size})),`uploaded-case`,l.files[0]?.name.split(` `)[0]??`Patient`);if(f.replaceChildren(),f.hidden=!1,e.ambiguities.length>0&&f.append(Q(`tv-modal__subtitle--danger`,[`Ambiguities Detected (${e.ambiguities.length}):`]),...e.ambiguities.map(e=>Q(`tv-ambiguity-item`,[`• ${e}`]))),e.treatmentStages.length>0){let n=Q(`tv-validation-success`,[`Successfully paired ${e.treatmentStages.length} treatment stages (${e.templateStages.length} template reference scans).`]),r=p_(`Load Validated Case Into Viewer`,()=>{t.remove(),Jn(e)},`tv-btn--accent`);f.append(n,r)}else f.append(Q(`tv-modal__subtitle--danger`,[`No valid upper/lower pairs could be matched from these files.`]))}),c.appendChild(f),n.append(r,i,a,o,c),t.append(n),t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),document.body.appendChild(t)}async function tr(e){w=!0,d.loading=!0,$n();try{let t=bg(e);await Cn(0);let n=u_?60:35e3;await Promise.race([t,new Promise(e=>setTimeout(e,n))]),u_||(Bt(e.length,e.length),await new Promise(e=>setTimeout(e,200)))}catch(e){console.warn(`Initial boot prewarm warning:`,e)}finally{w=!1,d.loading=!1,$n(),(t.initialMode===`blockout`||typeof window<`u`&&new URLSearchParams(window.location.search).get(`mode`)===`blockout`)&&!Pe&&Le()}}t.autoLoad!==!1&&d.manifest.treatmentStages.length>0&&tr(d.manifest.treatmentStages);let nr=e=>{if(e.key===`dental_viewer_sync`&&e.newValue)try{let t=JSON.parse(e.newValue);t.caseId===d.manifest.caseId&&((t.type===`ipr`||!t.type)&&Hn(),(t.type===`notes`||!t.type)&&Un())}catch{}};return window.addEventListener(`storage`,nr),{dispose:()=>{Sn(),qn(),S!==null&&(cancelAnimationFrame(S),S=null),window.removeEventListener(`keydown`,dn),window.removeEventListener(`storage`,nr),Pe&&=(Pe.unmount(),null),M.dispose(),mg(),e.replaceChildren();let t=document.querySelector(`.tv-modal-backdrop`);t&&t.remove()},navigate:Cn,inspectTemplate:wn,loadManifest:Jn,togglePlay:gn,toggleUpper:mn,toggleLower:hn,openStageSelector:er,toggleContacts:jn,toggleOverlay:Nn,setOverlayBlend:Pn,toggleAttachments:In,setAttachmentsVisible:Ln,toggleIpr:Bn,setIprActive:Vn,toggleNotes:On,setNotesOpen:kn,toggleBlockoutStudio:Le,isBlockoutStudioOpen:()=>!!Pe,cyclePlaybackSpeed:vn,setPlaybackSpeed:yn,getPlaybackSpeed:bn,toggleDockMinimized:xt,setDockMinimized:bt,isDockMinimized:()=>dt,getState:()=>({...d})}}function Q(e,t=[]){let n=document.createElement(`div`);return n.className=e,n.append(...t),n}function $(e,t){let n=document.createElement(`span`);return n.className=e,n.textContent=t,n}function f_(e){let t=document.createElement(`h1`);if(t.className=`tv-brand`,e===`3D Treatment Progression`){let e=document.createElement(`span`);e.className=`tv-brand-desktop`,e.textContent=`3D Treatment Progression`;let n=document.createElement(`span`);n.className=`tv-brand-mobile`,n.textContent=`3D Progression`,t.appendChild(e),t.appendChild(n)}else t.textContent=e;return t}function p_(e,t,n){let r=document.createElement(`button`);return r.type=`button`,r.className=`tv-btn${n?` ${n}`:``}`,r.textContent=e,r.addEventListener(`click`,t),r}function m_(){return document.querySelector(`#app`)}function h_(e,t,n,r){let i=m_();i&&(i.innerHTML=`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: radial-gradient(circle at 50% 30%, #151821 0%, #0a0b0e 100%); color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px; box-sizing: border-box;">
      <div style="width: 64px; height: 64px; border-radius: 16px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 12px 0; color: #ffffff; letter-spacing: -0.02em;">${e}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; max-width: 440px; margin: 0 0 28px 0;">${t}</p>
      <a href="${n}" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s ease; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
        ${r}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </a>
    </div>
  `)}function g_(e){let t=m_();if(!t)return;let n=e.type===`revoked`,r=n?`Link Not Available`:`Treatment Link Expired`,i=e.expiredDate?e.expiredDate.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`,hour:`numeric`,minute:`2-digit`}):`its scheduled duration`,a=n?`This link is currently not available. If you need access to your 3D treatment preview, please reach out to your dental clinic or care team.`:`This shared treatment plan link expired on ${i}. Treatment progression links are time-limited for patient privacy.`,o=e.clinicName?e.clinicName:`your dental clinic or care team`,s=e.clinicEmail?e.clinicEmail.trim():null;t.innerHTML=`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; width: 100vw; background: radial-gradient(circle at 50% 28%, #161b26 0%, #090c13 100%); color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px; box-sizing: border-box;">
      <div style="width: 72px; height: 72px; border-radius: 20px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 35px rgba(245, 158, 11, 0.2);">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0; color: #ffffff; letter-spacing: -0.02em;">${r}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; max-width: 480px; margin: 0 0 28px 0;">${a}</p>
      
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 18px 24px; max-width: 420px; width: 100%; margin-bottom: 24px; box-sizing: border-box;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: #64748b; margin-bottom: 6px;">Next Step</div>
        <div style="font-size: 14px; color: #e2e8f0; font-weight: 500; margin-bottom: ${s?`14px`:`0`};">
          Please contact <strong style="color: #ffd166;">${o}</strong> to request an updated link.
        </div>
        ${s?`<a href="mailto:${s}?subject=${encodeURIComponent(`[3D Treatment Plan] Request Link - ${e.patientName}`)}&body=${encodeURIComponent(`Hello,\n\nThe 3D progression link for ${e.patientName} is not available. Could you please provide an updated link?\n\nThank you!`)}" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #38bdf8; text-decoration: none; font-weight: 500; background: rgba(56, 189, 248, 0.1); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.25);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email Clinic: ${s}
              </a>`:``}
        ${!n&&e.shareToken?`<div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <span style="font-size: 11px; color: #94a3b8;">Doctor / Dental Lab Staff?</span>
                <a href="/treatment?case=${encodeURIComponent(e.shareToken)}&mode=blockout" style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #ffd166; background: rgba(224, 180, 87, 0.15); border: 1px solid rgba(224, 180, 87, 0.3); padding: 8px 16px; border-radius: 8px; text-decoration: none;">
                  Open Undercut &amp; Blockout Studio →
                </a>
              </div>`:``}
      </div>
    </div>
  `}async function __(){if(typeof window<`u`&&window.__dentalTreatmentApp){try{window.__dentalTreatmentApp.dispose()}catch(e){console.warn(`Disposal of previous viewer instance:`,e)}window.__dentalTreatmentApp=null}let e=m_();if(e===null)return;let t=new URLSearchParams(window.location.search),n=t.get(`case`),r=t.get(`mode`);if(!n||n===`demo`){h_(`No Case Selected`,`Only uploaded treatment cases can be viewed. Please select or upload a case from the Doctor Dashboard.`,`/dashboard`,`Go to Dashboard`);return}try{let i=`https://yrjulcwnabnhgtqebrtn.supabase.co`,a=`sb_publishable_REBvv8NOv8KPkDHw3mVnnQ_rzM2165H`,o=await fetch(`${i}/rest/v1/cases?share_token=eq.${encodeURIComponent(n)}&select=*`,{cache:`no-store`,headers:{apikey:a,Authorization:`Bearer ${a}`,"Cache-Control":`no-cache`,Pragma:`no-cache`}});if(o.ok){let s=await o.json();if(s&&s.length>0){let o=s[0],c=o.total_stages||0,l=o.patient_name||`Patient`,u=o.id,d=typeof o.doctor_notes==`string`?(()=>{try{return JSON.parse(o.doctor_notes)}catch{return{}}})():o.doctor_notes&&typeof o.doctor_notes==`object`?o.doctor_notes:{},f=null;if(typeof window<`u`&&u)try{let e=localStorage.getItem(`dental_link_access_${u}`);e&&(f=JSON.parse(e))}catch{}if(o.is_revoked===!0||o.is_revoked===`true`||o.status===`revoked`||d?.link_access?.is_revoked===!0||d?.link_access?.is_revoked===`true`||f?.isRevoked===!0){g_({type:`revoked`,patientName:l,clinicName:o.clinic_name,clinicEmail:o.clinic_email});return}let p=r===`blockout`||t.get(`mode`)===`blockout`||window.location.hash.includes(`blockout`),m=o.expires_at??d?.link_access?.expires_at??f?.expiresAt??null;if(m&&!p){let e=new Date(m).getTime();if(!isNaN(e)&&e<Date.now()){g_({type:`expired`,patientName:l,clinicName:o.clinic_name,clinicEmail:o.clinic_email,expiredDate:new Date(m),shareToken:n});return}}if(c===0){h_(`No 3D Models in Case`,`Case "${l}" has no stages uploaded yet. Please upload aligner stages from the dashboard.`,`/dashboard`,`Go to Dashboard`);return}let h=`${i}/storage/v1/object/public/treatment-models/${u}`,g=o.updated_at?new Date(o.updated_at).getTime():Date.now();await Fh(u,g);let _=(e,t)=>{if(e)try{let n=new URL(e,window.location.href);return n.searchParams.set(`v`,String(t)),n.toString()}catch{return`${e.split(`?`)[0]}?v=${t}`}};typeof window<`u`&&!window.__dentalViewerSyncListenerAttached&&(window.__dentalViewerSyncListenerAttached=!0,window.addEventListener(`storage`,e=>{if(e.key===`dental_viewer_sync`&&e.newValue)try{JSON.parse(e.newValue).caseId===u&&window.location.reload()}catch{}}));let v;try{let e=await fetch(`${i}/storage/v1/object/list/treatment-models`,{method:`POST`,headers:{apikey:a,Authorization:`Bearer ${a}`,"Content-Type":`application/json`},body:JSON.stringify({prefix:u,limit:300})});if(e.ok){let t=await e.json();Array.isArray(t)&&(v=t.map(e=>e.name))}}catch(e){console.info(`Could not list storage files, relying on manifest/runtime fallback:`,e)}try{let t=await fetch(`${h}/manifest.json?t=${Date.now()}`,{cache:`no-store`});if(t.ok){let n=await t.json();if(n&&Array.isArray(n.treatmentStages)&&n.treatmentStages.length>0){let t=n.treatmentStages.some(e=>!!e.upper),i=n.treatmentStages.some(e=>!!e.lower);if(t&&i)n.archType=`both`,n.hasUpper=!0,n.hasLower=!0,n.patientName&&=n.patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i,``).trim();else if(t&&!i)n.archType=`upper`,n.hasUpper=!0,n.hasLower=!1;else if(!t&&i)n.archType=`lower`,n.hasUpper=!1,n.hasLower=!0;else{let e=o.patient_name?.includes(`[Upper]`),t=o.patient_name?.includes(`[Lower]`);e?(n.archType=`upper`,n.hasUpper=!0,n.hasLower=!1,n.patientName?.includes(`[Upper]`)||(n.patientName=`${n.patientName||``} [Upper]`.trim())):t&&(n.archType=`lower`,n.hasUpper=!1,n.hasLower=!0,n.patientName?.includes(`[Lower]`)||(n.patientName=`${n.patientName||``} [Lower]`.trim()))}Zf(n,v);for(let e of n.treatmentStages)e.upper?.url&&(e.upper={...e.upper,url:_(e.upper.url,g)}),e.lower?.url&&(e.lower={...e.lower,url:_(e.lower.url,g)});(!n.ipr||n.ipr.length===0)&&Array.isArray(o.ipr)&&o.ipr.length>0&&(n.ipr=o.ipr);let a=o.doctor_notes||o.doctorNotes,s=!!(n.doctorNotes&&(n.doctorNotes.general||n.doctorNotes.doctorName||n.doctorNotes.clinicName||Array.isArray(n.doctorNotes.stageRemarks)&&n.doctorNotes.stageRemarks.length>0));a&&(!s||!n.doctorNotes)&&(n.doctorNotes=a),!n.patientId&&o.patient_id&&(n.patientId=o.patient_id),!n.clinicName&&o.clinic_name&&(n.clinicName=o.clinic_name),!n.doctorName&&(o.doctor_name||d?.assigned_doctor)&&(n.doctorName=o.doctor_name||d?.assigned_doctor),(o.is_refinement||d?.is_refinement)&&(n.isRefinement=!0),n.patientAge==null&&o.patient_age!=null&&(n.patientAge=Number(o.patient_age)),!n.patientSex&&o.patient_sex&&(n.patientSex=o.patient_sex);let c=d_(e,{caseManifest:n,initialMode:r});typeof window<`u`&&(window.__dentalTreatmentApp=c);return}}}catch(e){console.info(`Using fallback dynamic manifest generator:`,e)}let y=l.includes(`[Upper]`),b=l.includes(`[Lower]`),x=!b,S=!y,C=l.replace(/\s*\[(Upper|Lower|Dual)\]/i,``).trim(),w={caseId:u,patientName:y?`${C} [Upper]`:b?`${C} [Lower]`:C,patientId:o.patient_id||void 0,patientAge:o.patient_age==null?void 0:Number(o.patient_age),patientSex:o.patient_sex||void 0,clinicName:o.clinic_name||void 0,doctorName:o.doctor_name||d?.assigned_doctor||void 0,isRefinement:!!(o.is_refinement||d?.is_refinement),archType:y?`upper`:b?`lower`:`both`,hasUpper:x,hasLower:S,ipr:Array.isArray(o.ipr)?o.ipr:[],doctorNotes:o.doctor_notes||o.doctorNotes||void 0,treatmentStages:Array.from({length:c},(e,t)=>{let n=t+1,r=String(n).padStart(2,`0`),i=`${C} Upper jaw - ${r} - Model.glb`,a=`${C} Lower jaw - ${r} - Model.glb`;return{id:`stage-${r}`,stageNumber:n,label:`Stage ${n}`,doctorOnly:!1,upper:x?{filename:i,url:`${h}/${encodeURIComponent(i)}`}:void 0,lower:S?{filename:a,url:`${h}/${encodeURIComponent(a)}`}:void 0}}),templateStages:[],ambiguities:[]};Zf(w,v);for(let e of w.treatmentStages)e.upper?.url&&(e.upper={...e.upper,url:_(e.upper.url,g)}),e.lower?.url&&(e.lower={...e.lower,url:_(e.lower.url,g)});let T=d_(e,{caseManifest:w,initialMode:r});typeof window<`u`&&(window.__dentalTreatmentApp=T);return}}h_(`Case Not Found`,`The requested treatment case could not be found or has no uploaded models.`,`/dashboard`,`Go to Dashboard`)}catch(e){console.warn(`Could not load dynamic case from cloud:`,e);let t=e instanceof Error?e.message:String(e);/webgl|context/i.test(t)?h_(`WebGL Hardware Acceleration Needed`,`Your browser or graphics hardware temporarily suspended WebGL context. Please ensure hardware acceleration is enabled in your browser settings and click below to reload the viewer.`,window.location.href,`Reload 3D Viewer`):h_(`Error Loading Case`,`Could not retrieve this treatment case. Please check your connection or return to the dashboard.`,`/dashboard`,`Go to Dashboard`)}}typeof window<`u`&&(window.__initDentalTreatmentViewer=__),__();
//# sourceMappingURL=treatment-main.js.map