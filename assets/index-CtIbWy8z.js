var X0=Object.defineProperty;var q0=(i,e,t)=>e in i?X0(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var ie=(i,e,t)=>q0(i,typeof e!="symbol"?e+"":e,t);var To="1.3.27";function Bl(i,e,t){return Math.max(i,Math.min(e,t))}function Y0(i,e,t){return(1-t)*i+t*e}function Z0(i,e,t,n){return Y0(i,e,1-Math.exp(-t*n))}function K0(i,e){return(i%e+e)%e}var $0=class{constructor(){ie(this,"isRunning",!1);ie(this,"value",0);ie(this,"from",0);ie(this,"to",0);ie(this,"currentTime",0);ie(this,"lerp");ie(this,"duration");ie(this,"easing");ie(this,"onUpdate")}advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const t=Bl(0,this.currentTime/this.duration,1);e=t>=1;const n=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*n}else this.lerp?(this.value=Z0(this.value,this.to,this.lerp*60,i),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(i,e,{lerp:t,duration:n,easing:r,onStart:s,onUpdate:a}){this.from=this.value=i,this.to=e,this.lerp=t,this.duration=n,this.easing=r,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=a}};function J0(i,e){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>{t=void 0,i.apply(this,n)},e)}}var Q0=class{constructor(i,e,{autoResize:t=!0,debounce:n=250}={}){ie(this,"width",0);ie(this,"height",0);ie(this,"scrollHeight",0);ie(this,"scrollWidth",0);ie(this,"debouncedResize");ie(this,"wrapperResizeObserver");ie(this,"contentResizeObserver");ie(this,"resize",()=>{this.onWrapperResize(),this.onContentResize()});ie(this,"onWrapperResize",()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)});ie(this,"onContentResize",()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)});this.wrapper=i,this.content=e,t&&(this.debouncedResize=J0(this.resize,n),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},zl=class{constructor(){ie(this,"events",{})}emit(i,...e){const t=this.events[i]||[];for(let n=0,r=t.length;n<r;n++)t[n]?.(...e)}on(i,e){return this.events[i]?this.events[i].push(e):this.events[i]=[e],()=>{this.events[i]=this.events[i]?.filter(t=>e!==t)}}off(i,e){this.events[i]=this.events[i]?.filter(t=>e!==t)}destroy(){this.events={}}};const j0=100/6,Un={passive:!1};function Ao(i,e){return i===1?j0:i===2?e:1}var ec=class{constructor(i,e={wheelMultiplier:1,touchMultiplier:1}){ie(this,"touchStart",{x:0,y:0});ie(this,"lastDelta",{x:0,y:0});ie(this,"window",{width:0,height:0});ie(this,"emitter",new zl);ie(this,"onTouchStart",i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:i})});ie(this,"onTouchMove",i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i,n=-(e-this.touchStart.x)*this.options.touchMultiplier,r=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:n,y:r},this.emitter.emit("scroll",{deltaX:n,deltaY:r,event:i})});ie(this,"onTouchEnd",i=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:i})});ie(this,"onWheel",i=>{let{deltaX:e,deltaY:t,deltaMode:n}=i;const r=Ao(n,this.window.width),s=Ao(n,this.window.height);e*=r,t*=s,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:i})});ie(this,"onWindowResize",()=>{this.window={width:window.innerWidth,height:window.innerHeight}});this.element=i,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,Un),this.element.addEventListener("touchstart",this.onTouchStart,Un),this.element.addEventListener("touchmove",this.onTouchMove,Un),this.element.addEventListener("touchend",this.onTouchEnd,Un)}on(i,e){return this.emitter.on(i,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,Un),this.element.removeEventListener("touchstart",this.onTouchStart,Un),this.element.removeEventListener("touchmove",this.onTouchMove,Un),this.element.removeEventListener("touchend",this.onTouchEnd,Un)}};const wo=i=>Math.min(1,1.001-2**(-10*i));var tc=class{constructor({wrapper:i=window,content:e=document.documentElement,eventsTarget:t=i,smoothWheel:n=!0,syncTouch:r=!1,syncTouchLerp:s=.075,touchInertiaExponent:a=1.7,duration:o,easing:l,lerp:c=.1,infinite:u=!1,orientation:f="vertical",gestureOrientation:h=f==="horizontal"?"both":"vertical",touchMultiplier:L=1,wheelMultiplier:g=1,autoResize:M=!0,prevent:m,virtualScroll:d,overscroll:T=!0,autoRaf:w=!1,anchors:x=!1,autoToggle:b=!1,allowNestedScroll:S=!1,__experimental__naiveDimensions:A=!1,naiveDimensions:v=A,stopInertiaOnNavigate:y=!1,respectReducedMotion:D=!0}={}){ie(this,"_isScrolling",!1);ie(this,"_isStopped",!1);ie(this,"_isLocked",!1);ie(this,"_preventNextNativeScrollEvent",!1);ie(this,"_resetVelocityTimeout",null);ie(this,"_rafId",null);ie(this,"_isDraggingSelection",!1);ie(this,"reducedMotionMediaQuery",window.matchMedia("(prefers-reduced-motion: reduce)"));ie(this,"isTouching");ie(this,"isIos");ie(this,"time",0);ie(this,"userData",{});ie(this,"lastVelocity",0);ie(this,"velocity",0);ie(this,"direction",0);ie(this,"options");ie(this,"targetScroll");ie(this,"animatedScroll");ie(this,"animate",new $0);ie(this,"emitter",new zl);ie(this,"dimensions");ie(this,"virtualScroll");ie(this,"onScrollEnd",i=>{i instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&i.stopPropagation()});ie(this,"dispatchScrollendEvent",()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))});ie(this,"onTransitionEnd",i=>{i.propertyName?.includes("overflow")&&i.target===this.rootElement&&this.checkOverflow()});ie(this,"onClick",i=>{const e=i.composedPath().filter(n=>n instanceof HTMLAnchorElement&&n.href).map(n=>new URL(n.href)),t=new URL(window.location.href);if(this.options.anchors){const n=e.find(r=>t.host===r.host&&t.pathname===r.pathname&&r.hash);if(n){const r=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,s=decodeURIComponent(n.hash);this.scrollTo(s,r);return}}if(this.options.stopInertiaOnNavigate&&e.some(n=>t.host===n.host&&t.pathname!==n.pathname)){this.reset();return}});ie(this,"onPointerDown",i=>{i.button===1&&this.reset()});ie(this,"onVirtualScroll",i=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(i)===!1)return;const{deltaX:e,deltaY:t,event:n}=i;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:n}),n.ctrlKey||n.lenisStopPropagation)return;const r=n.type.includes("touch"),s=n.type.includes("wheel");if(r&&this.isIos&&(n.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(n)),this._isDraggingSelection)){n.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=n.type==="touchstart"||n.type==="touchmove";const a=e===0&&t===0;if(this.options.syncTouch&&r&&n.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}const o=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(a||o)return;let l=n.composedPath();l=l.slice(0,l.indexOf(this.rootElement));const c=this.options.prevent,u=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";if(l.find(g=>g instanceof HTMLElement&&(typeof c=="function"&&c?.(g)||g.hasAttribute?.("data-lenis-prevent")||u==="vertical"&&g.hasAttribute?.("data-lenis-prevent-vertical")||u==="horizontal"&&g.hasAttribute?.("data-lenis-prevent-horizontal")||r&&g.hasAttribute?.("data-lenis-prevent-touch")||s&&g.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(g,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){n.cancelable&&n.preventDefault();return}if(!(this.options.syncTouch&&r||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),n.lenisStopPropagation=!0;return}let f=t;this.options.gestureOrientation==="both"?f=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(f=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(n.lenisStopPropagation=!0),n.cancelable&&n.preventDefault();const h=r&&this.options.syncTouch,L=r&&n.type==="touchend";L&&(f=Math.sign(f)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+f,{programmatic:!1,...h?{lerp:L?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})});ie(this,"onNativeScroll",()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const i=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-i,this.direction=Math.sign(this.animatedScroll-i),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}});ie(this,"raf",i=>{const e=i-(this.time||i);this.time=i,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))});window.lenisVersion=To,window.lenis||(window.lenis={}),window.lenis.version=To,f==="horizontal"&&(window.lenis.horizontal=!0),r===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!i||i===document.documentElement)&&(i=window),typeof o=="number"&&typeof l!="function"?l=wo:typeof l=="function"&&typeof o!="number"&&(o=1),this.options={wrapper:i,content:e,eventsTarget:t,smoothWheel:n,syncTouch:r,syncTouchLerp:s,touchInertiaExponent:a,duration:o,easing:l,lerp:c,infinite:u,gestureOrientation:h,orientation:f,touchMultiplier:L,wheelMultiplier:g,autoResize:M,prevent:m,virtualScroll:d,overscroll:T,autoRaf:w,anchors:x,autoToggle:b,allowNestedScroll:S,naiveDimensions:v,stopInertiaOnNavigate:y,respectReducedMotion:D},this.dimensions=new Q0(i,e,{autoResize:M}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new ec(t,{touchMultiplier:L,wheelMultiplier:g}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(i,e){return this.emitter.on(i,e)}off(i,e){return this.emitter.off(i,e)}get overflow(){const i=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[i]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}setScroll(i){this.isHorizontal?this.options.wrapper.scrollTo({left:i,behavior:"instant"}):this.options.wrapper.scrollTo({top:i,behavior:"instant"})}isTouchOnSelectionHandle(i){const e=window.getSelection();if(!e||e.isCollapsed||e.rangeCount===0)return!1;const t=i.targetTouches[0]??i.changedTouches[0];if(!t)return!1;const n=e.getRangeAt(0).getClientRects();if(n.length===0)return!1;const r=n[0],s=n[n.length-1],a=40,o=Math.hypot(t.clientX-r.left,t.clientY-r.top)<=a,l=Math.hypot(t.clientX-s.right,t.clientY-s.bottom)<=a;return o||l}resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}scrollTo(i,{offset:e=0,immediate:t=!1,lock:n=!1,programmatic:r=!0,lerp:s=r?this.options.lerp:void 0,duration:a=r?this.options.duration:void 0,easing:o=r?this.options.easing:void 0,onStart:l,onComplete:c,force:u=!1,userData:f}={}){if(this.prefersReducedMotion&&(r?t=!0:(s=1,a=void 0,o=void 0)),(this.isStopped||this.isLocked)&&!u)return;let h=i,L=e;if(typeof h=="string"&&["top","left","start","#"].includes(h))h=0;else if(typeof h=="string"&&["bottom","right","end"].includes(h))h=this.limit;else{let g=null;if(typeof h=="string"?(g=h.startsWith("#")?document.getElementById(h.slice(1)):document.querySelector(h),g||(h==="#top"?h=0:console.warn("Lenis: Target not found",h))):h instanceof Element&&(g=h),g){if(this.options.wrapper!==window){const x=this.rootElement.getBoundingClientRect();L-=this.isHorizontal?x.left:x.top}const M=g.getBoundingClientRect(),m=getComputedStyle(g),d=this.isHorizontal?Number.parseFloat(m.scrollMarginLeft):Number.parseFloat(m.scrollMarginTop),T=getComputedStyle(this.rootElement),w=this.isHorizontal?Number.parseFloat(T.scrollPaddingLeft):Number.parseFloat(T.scrollPaddingTop);h=(this.isHorizontal?M.left:M.top)+this.animatedScroll-(Number.isNaN(d)?0:d)-(Number.isNaN(w)?0:w)}}if(typeof h=="number"){if(h+=L,this.options.infinite){if(r){this.targetScroll=this.animatedScroll=this.scroll;const g=h-this.animatedScroll;g>this.limit/2?h-=this.limit:g<-this.limit/2&&(h+=this.limit)}}else h=Bl(0,h,this.limit);if(h===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=f??{},t){this.animatedScroll=this.targetScroll=h,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}r||(this.targetScroll=h),typeof a=="number"&&typeof o!="function"?o=wo:typeof o=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,h,{duration:a,easing:o,lerp:s,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(g,M)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=g-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=g,this.setScroll(this.scroll),r&&(this.targetScroll=g),M||this.emit(),M&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(i,{deltaX:e,deltaY:t}){const n=Date.now();i._lenis||(i._lenis={});const r=i._lenis;let s,a,o,l,c,u,f,h,L,g;if(n-(r.time??0)>2e3){r.time=Date.now();const S=window.getComputedStyle(i);if(r.computedStyle=S,s=["auto","overlay","scroll"].includes(S.overflowX),a=["auto","overlay","scroll"].includes(S.overflowY),c=["auto"].includes(S.overscrollBehaviorX),u=["auto"].includes(S.overscrollBehaviorY),r.hasOverflowX=s,r.hasOverflowY=a,!(s||a))return!1;f=i.scrollWidth,h=i.scrollHeight,L=i.clientWidth,g=i.clientHeight,o=f>L,l=h>g,r.isScrollableX=o,r.isScrollableY=l,r.scrollWidth=f,r.scrollHeight=h,r.clientWidth=L,r.clientHeight=g,r.hasOverscrollBehaviorX=c,r.hasOverscrollBehaviorY=u}else o=r.isScrollableX,l=r.isScrollableY,s=r.hasOverflowX,a=r.hasOverflowY,f=r.scrollWidth,h=r.scrollHeight,L=r.clientWidth,g=r.clientHeight,c=r.hasOverscrollBehaviorX,u=r.hasOverscrollBehaviorY;if(!(s&&o||a&&l))return!1;const M=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";let m,d,T,w,x,b;if(M==="horizontal")m=Math.round(i.scrollLeft),d=f-L,T=e,w=s,x=o,b=c;else if(M==="vertical")m=Math.round(i.scrollTop),d=h-g,T=t,w=a,x=l,b=u;else return!1;return!b&&(m>=d||m<=0)?!0:(T>0?m<d:m>0)&&w&&x}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const i=this.options.wrapper;return this.isHorizontal?i.scrollX??i.scrollLeft:i.scrollY??i.scrollTop}get scroll(){return this.options.infinite?K0(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(i){this._isScrolling!==i&&(this._isScrolling=i,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(i){this._isStopped!==i&&(this._isStopped=i,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(i){this._isLocked!==i&&(this._isLocked=i,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let i="lenis";return this.options.autoToggle&&(i+=" lenis-autoToggle"),this.isStopped&&(i+=" lenis-stopped"),this.isLocked&&(i+=" lenis-locked"),this.isScrolling&&(i+=" lenis-scrolling"),this.isScrolling==="smooth"&&(i+=" lenis-smooth"),i}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(i=>{this.rootElement.classList.add(i)})}cleanUpClassName(){for(const i of Array.from(this.rootElement.classList))(i==="lenis"||i.startsWith("lenis-"))&&this.rootElement.classList.remove(i)}};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qa="186",nc=0,Ro=1,ic=2,Fr=1,rc=2,Wi=3,ti=0,Nt=1,xn=2,bn=0,qi=1,Co=2,Po=3,Do=4,sc=5,Ti=100,ac=101,oc=102,lc=103,cc=104,hc=200,uc=201,dc=202,fc=203,Hl=204,kl=205,pc=206,mc=207,Lc=208,gc=209,_c=210,vc=211,xc=212,Sc=213,Mc=214,Qs=0,js=1,ea=2,Ji=3,ta=4,na=5,ia=6,ra=7,Gl=0,Ec=1,bc=2,hn=0,Vl=1,Wl=2,Xl=3,ql=4,Yl=5,Zl=6,Kl=7,$l=300,ni=301,Pi=302,ds=303,fs=304,ts=306,Wr=1e3,Mn=1001,sa=1002,Mt=1003,yc=1004,hr=1005,Et=1006,ps=1007,En=1008,Wt=1009,Jl=1010,Ql=1011,Qi=1012,Ya=1013,un=1014,ln=1015,dn=1016,Za=1017,Ka=1018,ji=1020,jl=35902,e0=35899,t0=1021,n0=1022,Qt=1023,Rn=1026,jn=1027,i0=1028,$a=1029,ii=1030,Ja=1031,Qa=1033,Or=33776,Br=33777,zr=33778,Hr=33779,aa=35840,oa=35841,la=35842,ca=35843,ha=36196,ua=37492,da=37496,fa=37488,pa=37489,Xr=37490,ma=37491,La=37808,ga=37809,_a=37810,va=37811,xa=37812,Sa=37813,Ma=37814,Ea=37815,ba=37816,ya=37817,Ta=37818,Aa=37819,wa=37820,Ra=37821,Ca=36492,Pa=36494,Da=36495,Ia=36283,Ua=36284,qr=36285,Na=36286,Tc=3200,Io=0,Ac=1,Sn="",Vt="srgb",Yr="srgb-linear",Zr="linear",Qe="srgb",ms=7680,wc=519,Rc=512,Cc=513,Pc=514,ja=515,Dc=516,Ic=517,eo=518,Uc=519,Nc=35044,Uo="300 es",cn=2e3,Kr=2001;function Fc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function er(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Oc(){const i=er("canvas");return i.style.display="block",i}const No={};function Fo(...i){const e="THREE."+i.shift();console.log(e,...i)}function r0(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ce(...i){i=r0(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function qe(...i){i=r0(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function wi(...i){const e=i.join(" ");e in No||(No[e]=!0,Ce(...i))}function Bc(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const zc={[Qs]:js,[ea]:ia,[ta]:ra,[Ji]:na,[js]:Qs,[ia]:ea,[ra]:ta,[na]:Ji};class ai{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ls=Math.PI/180,Fa=180/Math.PI;function rr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(At[i&255]+At[i>>8&255]+At[i>>16&255]+At[i>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[t&63|128]+At[t>>8&255]+"-"+At[t>>16&255]+At[t>>24&255]+At[n&255]+At[n>>8&255]+At[n>>16&255]+At[n>>24&255]).toLowerCase()}function ke(i,e,t){return Math.max(e,Math.min(t,i))}function Hc(i,e){return(i%e+e)%e}function gs(i,e,t){return(1-t)*i+t*e}function Ni(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function It(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ho=class ho{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ho.prototype.isVector2=!0;let Ve=ho;class Ii{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3],h=s[a+0],L=s[a+1],g=s[a+2],M=s[a+3];if(f!==M||l!==h||c!==L||u!==g){let m=l*h+c*L+u*g+f*M;m<0&&(h=-h,L=-L,g=-g,M=-M,m=-m);let d=1-o;if(m<.9995){const T=Math.acos(m),w=Math.sin(T);d=Math.sin(d*T)/w,o=Math.sin(o*T)/w,l=l*d+h*o,c=c*d+L*o,u=u*d+g*o,f=f*d+M*o}else{l=l*d+h*o,c=c*d+L*o,u=u*d+g*o,f=f*d+M*o;const T=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=T,c*=T,u*=T,f*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[a],h=s[a+1],L=s[a+2],g=s[a+3];return e[t]=o*g+u*f+l*L-c*h,e[t+1]=l*g+u*h+c*f-o*L,e[t+2]=c*g+u*L+o*h-l*f,e[t+3]=u*g-o*f-l*h-c*L,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),f=o(s/2),h=l(n/2),L=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=h*u*f+c*L*g,this._y=c*L*f-h*u*g,this._z=c*u*g+h*L*f,this._w=c*u*f-h*L*g;break;case"YXZ":this._x=h*u*f+c*L*g,this._y=c*L*f-h*u*g,this._z=c*u*g-h*L*f,this._w=c*u*f+h*L*g;break;case"ZXY":this._x=h*u*f-c*L*g,this._y=c*L*f+h*u*g,this._z=c*u*g+h*L*f,this._w=c*u*f-h*L*g;break;case"ZYX":this._x=h*u*f-c*L*g,this._y=c*L*f+h*u*g,this._z=c*u*g-h*L*f,this._w=c*u*f+h*L*g;break;case"YZX":this._x=h*u*f+c*L*g,this._y=c*L*f+h*u*g,this._z=c*u*g-h*L*f,this._w=c*u*f-h*L*g;break;case"XZY":this._x=h*u*f-c*L*g,this._y=c*L*f-h*u*g,this._z=c*u*g+h*L*f,this._w=c*u*f+h*L*g;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=n+o+f;if(h>0){const L=.5/Math.sqrt(h+1);this._w=.25/L,this._x=(u-l)*L,this._y=(s-c)*L,this._z=(a-r)*L}else if(n>o&&n>f){const L=2*Math.sqrt(1+n-o-f);this._w=(u-l)/L,this._x=.25*L,this._y=(r+a)/L,this._z=(s+c)/L}else if(o>f){const L=2*Math.sqrt(1+o-n-f);this._w=(s-c)/L,this._x=(r+a)/L,this._y=.25*L,this._z=(l+u)/L}else{const L=2*Math.sqrt(1+f-n-o);this._w=(a-r)/L,this._x=(s+c)/L,this._y=(l+u)/L,this._z=.25*L}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ke(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const uo=class uo{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Oo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Oo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),f=2*(s*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return _s.copy(this).projectOnVector(e),this.sub(_s)}reflect(e){return this.sub(_s.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};uo.prototype.isVector3=!0;let k=uo;const _s=new k,Oo=new Ii,fo=class fo{constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],L=n[5],g=n[8],M=r[0],m=r[3],d=r[6],T=r[1],w=r[4],x=r[7],b=r[2],S=r[5],A=r[8];return s[0]=a*M+o*T+l*b,s[3]=a*m+o*w+l*S,s[6]=a*d+o*x+l*A,s[1]=c*M+u*T+f*b,s[4]=c*m+u*w+f*S,s[7]=c*d+u*x+f*A,s[2]=h*M+L*T+g*b,s[5]=h*m+L*w+g*S,s[8]=h*d+L*x+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*s,L=c*s-a*l,g=t*f+n*h+r*L;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=f*M,e[1]=(r*c-u*n)*M,e[2]=(o*n-r*a)*M,e[3]=h*M,e[4]=(u*t-r*l)*M,e[5]=(r*s-o*t)*M,e[6]=L*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*s)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return wi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(vs.makeScale(e,t)),this}rotate(e){return wi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(vs.makeRotation(-e)),this}translate(e,t){return wi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(vs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};fo.prototype.isMatrix3=!0;let De=fo;const vs=new De,Bo=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zo=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kc(){const i={enabled:!0,workingColorSpace:Yr,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Qe&&(r.r=yn(r.r),r.g=yn(r.g),r.b=yn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Qe&&(r.r=Ri(r.r),r.g=Ri(r.g),r.b=Ri(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Sn?Zr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return wi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return wi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Yr]:{primaries:e,whitePoint:n,transfer:Zr,toXYZ:Bo,fromXYZ:zo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:e,whitePoint:n,transfer:Qe,toXYZ:Bo,fromXYZ:zo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}}),i}const He=kc();function yn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ri(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ci;class Gc{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ci===void 0&&(ci=er("canvas")),ci.width=e.width,ci.height=e.height;const r=ci.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=ci}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=er("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=yn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(yn(t[n]/255)*255):t[n]=yn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vc=0;class to{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=rr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(xs(r[a].image)):s.push(xs(r[a]))}else s=xs(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function xs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let Wc=0;const Ss=new k;class bt extends ai{constructor(e=bt.DEFAULT_IMAGE,t=bt.DEFAULT_MAPPING,n=Mn,r=Mn,s=Et,a=En,o=Qt,l=Wt,c=bt.DEFAULT_ANISOTROPY,u=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wc++}),this.uuid=rr(),this.name="",this.source=new to(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ss).x}get height(){return this.source.getSize(Ss).y}get depth(){return this.source.getSize(Ss).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$l)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wr:e.x=e.x-Math.floor(e.x);break;case Mn:e.x=e.x<0?0:1;break;case sa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wr:e.y=e.y-Math.floor(e.y);break;case Mn:e.y=e.y<0?0:1;break;case sa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=$l;bt.DEFAULT_ANISOTROPY=1;const po=class po{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],L=l[5],g=l[9],M=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+M)<.1&&Math.abs(g+m)<.1&&Math.abs(c+L+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,x=(L+1)/2,b=(d+1)/2,S=(u+h)/4,A=(f+M)/4,v=(g+m)/4;return w>x&&w>b?w<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(w),r=S/n,s=A/n):x>b?x<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),n=S/r,s=v/r):b<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),n=A/s,r=v/s),this.set(n,r,s,t),this}let T=Math.sqrt((m-g)*(m-g)+(f-M)*(f-M)+(h-u)*(h-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(f-M)/T,this.z=(h-u)/T,this.w=Math.acos((c+L+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this.w=ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this.w=ke(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};po.prototype.isVector4=!0;let at=po;class Xc extends ai{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:n.depth},s=new bt(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new to(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jt extends Xc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class s0 extends bt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qc extends bt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const es=class es{constructor(e,t,n,r,s,a,o,l,c,u,f,h,L,g,M,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,f,h,L,g,M,m)}set(e,t,n,r,s,a,o,l,c,u,f,h,L,g,M,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=L,d[7]=g,d[11]=M,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new es().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,r=1/hi.setFromMatrixColumn(e,0).length(),s=1/hi.setFromMatrixColumn(e,1).length(),a=1/hi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=a*u,L=a*f,g=o*u,M=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=L+g*c,t[5]=h-M*c,t[9]=-o*l,t[2]=M-h*c,t[6]=g+L*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,L=l*f,g=c*u,M=c*f;t[0]=h+M*o,t[4]=g*o-L,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=L*o-g,t[6]=M+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,L=l*f,g=c*u,M=c*f;t[0]=h-M*o,t[4]=-a*f,t[8]=g+L*o,t[1]=L+g*o,t[5]=a*u,t[9]=M-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,L=a*f,g=o*u,M=o*f;t[0]=l*u,t[4]=g*c-L,t[8]=h*c+M,t[1]=l*f,t[5]=M*c+h,t[9]=L*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,L=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=M-h*f,t[8]=g*f+L,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=L*f+g,t[10]=h-M*f}else if(e.order==="XZY"){const h=a*l,L=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+M,t[5]=a*u,t[9]=L*f-g,t[2]=g*f-L,t[6]=o*u,t[10]=M*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yc,e,Zc)}lookAt(e,t,n){const r=this.elements;return Ft.subVectors(e,t),Ft.lengthSq()===0&&(Ft.z=1),Ft.normalize(),Nn.crossVectors(n,Ft),Nn.lengthSq()===0&&(Math.abs(n.z)===1?Ft.x+=1e-4:Ft.z+=1e-4,Ft.normalize(),Nn.crossVectors(n,Ft)),Nn.normalize(),ur.crossVectors(Ft,Nn),r[0]=Nn.x,r[4]=ur.x,r[8]=Ft.x,r[1]=Nn.y,r[5]=ur.y,r[9]=Ft.y,r[2]=Nn.z,r[6]=ur.z,r[10]=Ft.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],L=n[13],g=n[2],M=n[6],m=n[10],d=n[14],T=n[3],w=n[7],x=n[11],b=n[15],S=r[0],A=r[4],v=r[8],y=r[12],D=r[1],I=r[5],z=r[9],V=r[13],U=r[2],H=r[6],J=r[10],W=r[14],ne=r[3],q=r[7],j=r[11],te=r[15];return s[0]=a*S+o*D+l*U+c*ne,s[4]=a*A+o*I+l*H+c*q,s[8]=a*v+o*z+l*J+c*j,s[12]=a*y+o*V+l*W+c*te,s[1]=u*S+f*D+h*U+L*ne,s[5]=u*A+f*I+h*H+L*q,s[9]=u*v+f*z+h*J+L*j,s[13]=u*y+f*V+h*W+L*te,s[2]=g*S+M*D+m*U+d*ne,s[6]=g*A+M*I+m*H+d*q,s[10]=g*v+M*z+m*J+d*j,s[14]=g*y+M*V+m*W+d*te,s[3]=T*S+w*D+x*U+b*ne,s[7]=T*A+w*I+x*H+b*q,s[11]=T*v+w*z+x*J+b*j,s[15]=T*y+w*V+x*W+b*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],L=e[14],g=e[3],M=e[7],m=e[11],d=e[15],T=l*L-c*h,w=o*L-c*f,x=o*h-l*f,b=a*L-c*u,S=a*h-l*u,A=a*f-o*u;return t*(M*T-m*w+d*x)-n*(g*T-m*b+d*S)+r*(g*w-M*b+d*A)-s*(g*x-M*S+m*A)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],L=e[11],g=e[12],M=e[13],m=e[14],d=e[15],T=t*o-n*a,w=t*l-r*a,x=t*c-s*a,b=n*l-r*o,S=n*c-s*o,A=r*c-s*l,v=u*M-f*g,y=u*m-h*g,D=u*d-L*g,I=f*m-h*M,z=f*d-L*M,V=h*d-L*m,U=T*V-w*z+x*I+b*D-S*y+A*v;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/U;return e[0]=(o*V-l*z+c*I)*H,e[1]=(r*z-n*V-s*I)*H,e[2]=(M*A-m*S+d*b)*H,e[3]=(h*S-f*A-L*b)*H,e[4]=(l*D-a*V-c*y)*H,e[5]=(t*V-r*D+s*y)*H,e[6]=(m*x-g*A-d*w)*H,e[7]=(u*A-h*x+L*w)*H,e[8]=(a*z-o*D+c*v)*H,e[9]=(n*D-t*z-s*v)*H,e[10]=(g*S-M*x+d*T)*H,e[11]=(f*x-u*S-L*T)*H,e[12]=(o*y-a*I-l*v)*H,e[13]=(t*I-n*y+r*v)*H,e[14]=(M*w-g*b-m*T)*H,e[15]=(u*b-f*w+h*T)*H,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,f=o+o,h=s*c,L=s*u,g=s*f,M=a*u,m=a*f,d=o*f,T=l*c,w=l*u,x=l*f,b=n.x,S=n.y,A=n.z;return r[0]=(1-(M+d))*b,r[1]=(L+x)*b,r[2]=(g-w)*b,r[3]=0,r[4]=(L-x)*S,r[5]=(1-(h+d))*S,r[6]=(m+T)*S,r[7]=0,r[8]=(g+w)*A,r[9]=(m-T)*A,r[10]=(1-(h+M))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=hi.set(r[0],r[1],r[2]).length();const o=hi.set(r[4],r[5],r[6]).length(),l=hi.set(r[8],r[9],r[10]).length();s<0&&(a=-a),qt.copy(this);const c=1/a,u=1/o,f=1/l;return qt.elements[0]*=c,qt.elements[1]*=c,qt.elements[2]*=c,qt.elements[4]*=u,qt.elements[5]*=u,qt.elements[6]*=u,qt.elements[8]*=f,qt.elements[9]*=f,qt.elements[10]*=f,t.setFromRotationMatrix(qt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=cn,l=!1){const c=this.elements,u=2*s/(t-e),f=2*s/(n-r),h=(t+e)/(t-e),L=(n+r)/(n-r);let g,M;if(l)g=s/(a-s),M=a*s/(a-s);else if(o===cn)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===Kr)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=L,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=cn,l=!1){const c=this.elements,u=2/(t-e),f=2/(n-r),h=-(t+e)/(t-e),L=-(n+r)/(n-r);let g,M;if(l)g=1/(a-s),M=a/(a-s);else if(o===cn)g=-2/(a-s),M=-(a+s)/(a-s);else if(o===Kr)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=L,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};es.prototype.isMatrix4=!0;let mt=es;const hi=new k,qt=new mt,Yc=new k(0,0,0),Zc=new k(1,1,1),Nn=new k,ur=new k,Ft=new k,Ho=new mt,ko=new Ii;class ri{constructor(e=0,t=0,n=0,r=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],L=r[10];switch(t){case"XYZ":this._y=Math.asin(ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,L),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,L),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,L),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ke(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,L),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,L));break;case"XZY":this._z=Math.asin(-ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,L),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ho.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ho,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ko.setFromEuler(this),this.setFromQuaternion(ko,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class a0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Kc=0;const Go=new k,ui=new Ii,mn=new mt,dr=new k,Fi=new k,$c=new k,Jc=new Ii,Vo=new k(1,0,0),Wo=new k(0,1,0),Xo=new k(0,0,1),qo={type:"added"},Qc={type:"removed"},di={type:"childadded",child:null},Ms={type:"childremoved",child:null};class Ht extends ai{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new k,t=new ri,n=new Ii,r=new k(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new mt},normalMatrix:{value:new De}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new a0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ui.setFromAxisAngle(e,t),this.quaternion.multiply(ui),this}rotateOnWorldAxis(e,t){return ui.setFromAxisAngle(e,t),this.quaternion.premultiply(ui),this}rotateX(e){return this.rotateOnAxis(Vo,e)}rotateY(e){return this.rotateOnAxis(Wo,e)}rotateZ(e){return this.rotateOnAxis(Xo,e)}translateOnAxis(e,t){return Go.copy(e).applyQuaternion(this.quaternion),this.position.add(Go.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vo,e)}translateY(e){return this.translateOnAxis(Wo,e)}translateZ(e){return this.translateOnAxis(Xo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?dr.copy(e):dr.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(Fi,dr,this.up):mn.lookAt(dr,Fi,this.up),this.quaternion.setFromRotationMatrix(mn),r&&(mn.extractRotation(r.matrixWorld),ui.setFromRotationMatrix(mn),this.quaternion.premultiply(ui.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qo),di.child=e,this.dispatchEvent(di),di.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qc),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qo),di.child=e,this.dispatchEvent(di),di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,e,$c),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,Jc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),L=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),L.length>0&&(n.animations=L),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ht.DEFAULT_UP=new k(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class fr extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jc={type:"move"};class Es{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const m=t.getJointPose(M,n),d=this._getHandJoint(c,M);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),L=.02,g=.005;c.inputState.pinching&&h>L+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=L-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jc)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new fr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const o0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},pr={h:0,s:0,l:0};function bs(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=He.workingColorSpace){return this.r=e,this.g=t,this.b=n,He.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=He.workingColorSpace){if(e=Hc(e,1),t=ke(t,0,1),n=ke(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=bs(a,s,e+1/3),this.g=bs(a,s,e),this.b=bs(a,s,e-1/3)}return He.colorSpaceToWorking(this,r),this}setStyle(e,t=Vt){function n(s){s!==void 0&&parseFloat(s)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Vt){const n=o0[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yn(e.r),this.g=yn(e.g),this.b=yn(e.b),this}copyLinearToSRGB(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return He.workingToColorSpace(wt.copy(this),e),Math.round(ke(wt.r*255,0,255))*65536+Math.round(ke(wt.g*255,0,255))*256+Math.round(ke(wt.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.workingToColorSpace(wt.copy(this),t);const n=wt.r,r=wt.g,s=wt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=He.workingColorSpace){return He.workingToColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=Vt){He.workingToColorSpace(wt.copy(this),e);const t=wt.r,n=wt.g,r=wt.b;return e!==Vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(pr);const n=gs(Fn.h,pr.h,t),r=gs(Fn.s,pr.s,t),s=gs(Fn.l,pr.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new $e;$e.NAMES=o0;class eh extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Yt=new k,Ln=new k,ys=new k,gn=new k,fi=new k,pi=new k,Yo=new k,Ts=new k,As=new k,ws=new k,Rs=new at,Cs=new at,Ps=new at;class Jt{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Yt.subVectors(e,t),r.cross(Yt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Yt.subVectors(r,t),Ln.subVectors(n,t),ys.subVectors(e,t);const a=Yt.dot(Yt),o=Yt.dot(Ln),l=Yt.dot(ys),c=Ln.dot(Ln),u=Ln.dot(ys),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,L=(c*l-o*u)*h,g=(a*u-o*l)*h;return s.set(1-L-g,g,L)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,gn)===null?!1:gn.x>=0&&gn.y>=0&&gn.x+gn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,gn.x),l.addScaledVector(a,gn.y),l.addScaledVector(o,gn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Rs.setScalar(0),Cs.setScalar(0),Ps.setScalar(0),Rs.fromBufferAttribute(e,t),Cs.fromBufferAttribute(e,n),Ps.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Rs,s.x),a.addScaledVector(Cs,s.y),a.addScaledVector(Ps,s.z),a}static isFrontFacing(e,t,n,r){return Yt.subVectors(n,t),Ln.subVectors(e,t),Yt.cross(Ln).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yt.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),Yt.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Jt.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;fi.subVectors(r,n),pi.subVectors(s,n),Ts.subVectors(e,n);const l=fi.dot(Ts),c=pi.dot(Ts);if(l<=0&&c<=0)return t.copy(n);As.subVectors(e,r);const u=fi.dot(As),f=pi.dot(As);if(u>=0&&f<=u)return t.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(fi,a);ws.subVectors(e,s);const L=fi.dot(ws),g=pi.dot(ws);if(g>=0&&L<=g)return t.copy(s);const M=L*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(pi,o);const m=u*g-L*f;if(m<=0&&f-u>=0&&L-g>=0)return Yo.subVectors(s,r),o=(f-u)/(f-u+(L-g)),t.copy(r).addScaledVector(Yo,o);const d=1/(m+M+h);return a=M*d,o=h*d,t.copy(n).addScaledVector(fi,a).addScaledVector(pi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class sr{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Zt):Zt.fromBufferAttribute(s,a),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),mr.copy(n.boundingBox)),mr.applyMatrix4(e.matrixWorld),this.union(mr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Oi),Lr.subVectors(this.max,Oi),mi.subVectors(e.a,Oi),Li.subVectors(e.b,Oi),gi.subVectors(e.c,Oi),On.subVectors(Li,mi),Bn.subVectors(gi,Li),Yn.subVectors(mi,gi);let t=[0,-On.z,On.y,0,-Bn.z,Bn.y,0,-Yn.z,Yn.y,On.z,0,-On.x,Bn.z,0,-Bn.x,Yn.z,0,-Yn.x,-On.y,On.x,0,-Bn.y,Bn.x,0,-Yn.y,Yn.x,0];return!Ds(t,mi,Li,gi,Lr)||(t=[1,0,0,0,1,0,0,0,1],!Ds(t,mi,Li,gi,Lr))?!1:(gr.crossVectors(On,Bn),t=[gr.x,gr.y,gr.z],Ds(t,mi,Li,gi,Lr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const _n=[new k,new k,new k,new k,new k,new k,new k,new k],Zt=new k,mr=new sr,mi=new k,Li=new k,gi=new k,On=new k,Bn=new k,Yn=new k,Oi=new k,Lr=new k,gr=new k,Zn=new k;function Ds(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Zn.fromArray(i,s);const o=r.x*Math.abs(Zn.x)+r.y*Math.abs(Zn.y)+r.z*Math.abs(Zn.z),l=e.dot(Zn),c=t.dot(Zn),u=n.dot(Zn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const pt=new k,_r=new Ve;let th=0;class Tn extends ai{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:th++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Nc,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ni(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=It(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ni(t,this.array)),t}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ni(t,this.array)),t}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ni(t,this.array)),t}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ni(t,this.array)),t}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array),r=It(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array),r=It(r,this.array),s=It(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class l0 extends Tn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class c0 extends Tn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class An extends Tn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const nh=new sr,Bi=new k,Is=new k;class no{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):nh.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bi.subVectors(e,this.center);const t=Bi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Bi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Is.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bi.copy(e.center).add(Is)),this.expandByPoint(Bi.copy(e.center).sub(Is))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ih=0;const Gt=new mt,Us=new Ht,_i=new k,Ot=new sr,zi=new sr,St=new k;class Cn extends ai{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ih++}),this.uuid=rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fc(e)?c0:l0)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new De().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,n){return Gt.makeTranslation(e,t,n),this.applyMatrix4(Gt),this}scale(e,t,n){return Gt.makeScale(e,t,n),this.applyMatrix4(Gt),this}lookAt(e){return Us.lookAt(e),Us.updateMatrix(),this.applyMatrix4(Us.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_i).negate(),this.translate(_i.x,_i.y,_i.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new An(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Ot.setFromBufferAttribute(s),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,Ot.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,Ot.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(Ot.min),this.boundingBox.expandByPoint(Ot.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new no);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const n=this.boundingSphere.center;if(Ot.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];zi.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(Ot.min,zi.min),Ot.expandByPoint(St),St.addVectors(Ot.max,zi.max),Ot.expandByPoint(St)):(Ot.expandByPoint(zi.min),Ot.expandByPoint(zi.max))}Ot.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)St.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(St));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)St.fromBufferAttribute(o,c),l&&(_i.fromBufferAttribute(e,c),St.add(_i)),r=Math.max(r,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Tn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new k,l[v]=new k;const c=new k,u=new k,f=new k,h=new Ve,L=new Ve,g=new Ve,M=new k,m=new k;function d(v,y,D){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,y),f.fromBufferAttribute(n,D),h.fromBufferAttribute(s,v),L.fromBufferAttribute(s,y),g.fromBufferAttribute(s,D),u.sub(c),f.sub(c),L.sub(h),g.sub(h);const I=1/(L.x*g.y-g.x*L.y);isFinite(I)&&(M.copy(u).multiplyScalar(g.y).addScaledVector(f,-L.y).multiplyScalar(I),m.copy(f).multiplyScalar(L.x).addScaledVector(u,-g.x).multiplyScalar(I),o[v].add(M),o[y].add(M),o[D].add(M),l[v].add(m),l[y].add(m),l[D].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let v=0,y=T.length;v<y;++v){const D=T[v],I=D.start,z=D.count;for(let V=I,U=I+z;V<U;V+=3)d(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const w=new k,x=new k,b=new k,S=new k;function A(v){b.fromBufferAttribute(r,v),S.copy(b);const y=o[v];w.copy(y),w.sub(b.multiplyScalar(b.dot(y))).normalize(),x.crossVectors(S,y);const I=x.dot(l[v])<0?-1:1;a.setXYZW(v,w.x,w.y,w.z,I)}for(let v=0,y=T.length;v<y;++v){const D=T[v],I=D.start,z=D.count;for(let V=I,U=I+z;V<U;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Tn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,L=n.count;h<L;h++)n.setXYZ(h,0,0,0);const r=new k,s=new k,a=new k,o=new k,l=new k,c=new k,u=new k,f=new k;if(e)for(let h=0,L=e.count;h<L;h+=3){const g=e.getX(h+0),M=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,m),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,L=t.count;h<L;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let L=0,g=0;for(let M=0,m=l.length;M<m;M++){o.isInterleavedBufferAttribute?L=l[M]*o.data.stride+o.offset:L=l[M]*u;for(let d=0;d<u;d++)h[g++]=c[L++]}return new Tn(h,u,f)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Cn,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],L=e(h,n);l.push(L)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const L=c[f];u.push(L.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,L=f.length;h<L;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ns=new k,rh=new k,sh=new De;class kn{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Ns.subVectors(n,t).cross(rh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const r=e.delta(Ns),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sh.getNormalMatrix(e),r=this.coplanarPoint(Ns).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let ah=0;class ns extends ai{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=rr(),this.name="",this.type="Material",this.blending=qi,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hl,this.blendDst=kl,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=Ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ms,this.stencilZFail=ms,this.stencilZPass=ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new $e().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new kn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ve().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ve().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const vn=new k,Fs=new k,vr=new k,xr=new k;class oh{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Fs.copy(e).add(t).multiplyScalar(.5),vr.copy(t).sub(e).normalize(),xr.copy(this.origin).sub(Fs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(vr),o=xr.dot(this.direction),l=-xr.dot(vr),c=xr.lengthSq(),u=Math.abs(1-a*a);let f,h,L,g;if(u>0)if(f=a*l-o,h=a*o-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const M=1/u;f*=M,h*=M,L=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=s,f=Math.max(0,-(a*h+o)),L=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(a*h+o)),L=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-l),s),L=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),L=h*(h+2*l)+c):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-l),s),L=-f*f+h*(h+2*l)+c);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),L=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Fs).addScaledVector(vr,h),L}intersectSphere(e,t){if(e.radius<0)return null;vn.subVectors(e.center,this.origin);const n=vn.dot(this.direction),r=vn.dot(vn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,n,r,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,f=e.x-a.x,h=e.y-a.y,L=e.z-a.z,g=t.x-a.x,M=t.y-a.y,m=t.z-a.z,d=n.x-a.x,T=n.y-a.y,w=n.z-a.z,x=Math.abs(l),b=Math.abs(c),S=Math.abs(u);let A,v,y,D,I,z,V,U,H,J,W,ne;if(x>=b&&x>=S?(y=l,z=f,H=g,ne=d,l>=0?(A=c,v=u,D=h,I=L,V=M,U=m,J=T,W=w):(A=u,v=c,D=L,I=h,V=m,U=M,J=w,W=T)):b>=S?(y=c,z=h,H=M,ne=T,c>=0?(A=u,v=l,D=L,I=f,V=m,U=g,J=w,W=d):(A=l,v=u,D=f,I=L,V=g,U=m,J=d,W=w)):(y=u,z=L,H=m,ne=w,u>=0?(A=l,v=c,D=f,I=h,V=g,U=M,J=d,W=T):(A=c,v=l,D=h,I=f,V=M,U=g,J=T,W=d)),y===0)return null;const q=A/y,j=v/y,te=1/y,we=D-q*z,Te=I-j*z,tt=V-q*H,Ge=U-j*H,Ye=J-q*ne,Y=W-j*ne,Q=Ye*Ge-Y*tt,ve=we*Y-Te*Ye,Pe=tt*Te-Ge*we;if(r){if(Q<0||ve<0||Pe<0)return null}else if((Q<0||ve<0||Pe<0)&&(Q>0||ve>0||Pe>0))return null;const ge=Q+ve+Pe;if(ge===0)return null;const Fe=te*(Q*z+ve*H+Pe*ne);return(ge>0?Fe<0:Fe>0)?null:this.at(Fe/ge,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class h0 extends ns{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zo=new mt,Kn=new oh,Sr=new no,Ko=new k,Mr=new k,Er=new k,br=new k,Os=new k,yr=new k,$o=new k,Tr=new k;class fn extends Ht{constructor(e=new Cn,t=new h0){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){yr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Os.fromBufferAttribute(f,e),a?yr.addScaledVector(Os,u):yr.addScaledVector(Os.sub(t),u))}t.add(yr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sr.copy(n.boundingSphere),Sr.applyMatrix4(s),Kn.copy(e.ray).recast(e.near),!(Sr.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(Sr,Ko)===null||Kn.origin.distanceToSquared(Ko)>(e.far-e.near)**2))&&(Zo.copy(s).invert(),Kn.copy(e.ray).applyMatrix4(Zo),!(n.boundingBox!==null&&Kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Kn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,L=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=h.length;g<M;g++){const m=h[g],d=a[m.materialIndex],T=Math.max(m.start,L.start),w=Math.min(o.count,Math.min(m.start+m.count,L.start+L.count));for(let x=T,b=w;x<b;x+=3){const S=o.getX(x),A=o.getX(x+1),v=o.getX(x+2);r=Ar(this,d,e,n,c,u,f,S,A,v),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,L.start),M=Math.min(o.count,L.start+L.count);for(let m=g,d=M;m<d;m+=3){const T=o.getX(m),w=o.getX(m+1),x=o.getX(m+2);r=Ar(this,a,e,n,c,u,f,T,w,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=h.length;g<M;g++){const m=h[g],d=a[m.materialIndex],T=Math.max(m.start,L.start),w=Math.min(l.count,Math.min(m.start+m.count,L.start+L.count));for(let x=T,b=w;x<b;x+=3){const S=x,A=x+1,v=x+2;r=Ar(this,d,e,n,c,u,f,S,A,v),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,L.start),M=Math.min(l.count,L.start+L.count);for(let m=g,d=M;m<d;m+=3){const T=m,w=m+1,x=m+2;r=Ar(this,a,e,n,c,u,f,T,w,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function lh(i,e,t,n,r,s,a,o){let l;if(e.side===Nt?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===ti,o),l===null)return null;Tr.copy(o),Tr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Tr);return c<t.near||c>t.far?null:{distance:c,point:Tr.clone(),object:i}}function Ar(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,Mr),i.getVertexPosition(l,Er),i.getVertexPosition(c,br);const u=lh(i,e,t,n,Mr,Er,br,$o);if(u){const f=new k;Jt.getBarycoord($o,Mr,Er,br,f),r&&(u.uv=Jt.getInterpolatedAttribute(r,o,l,c,f,new Ve)),s&&(u.uv1=Jt.getInterpolatedAttribute(s,o,l,c,f,new Ve)),a&&(u.normal=Jt.getInterpolatedAttribute(a,o,l,c,f,new k),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new k,materialIndex:0};Jt.getNormal(Mr,Er,br,h.normal),u.face=h,u.barycoord=f}return u}class u0 extends bt{constructor(e=null,t=1,n=1,r,s,a,o,l,c=Mt,u=Mt,f,h){super(null,a,o,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $n=new no,ch=new Ve(.5,.5),wr=new k;class d0{constructor(e=new kn,t=new kn,n=new kn,r=new kn,s=new kn,a=new kn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=cn,n=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],L=s[7],g=s[8],M=s[9],m=s[10],d=s[11],T=s[12],w=s[13],x=s[14],b=s[15];if(r[0].setComponents(c-a,L-u,d-g,b-T).normalize(),r[1].setComponents(c+a,L+u,d+g,b+T).normalize(),r[2].setComponents(c+o,L+f,d+M,b+w).normalize(),r[3].setComponents(c-o,L-f,d-M,b-w).normalize(),n)r[4].setComponents(l,h,m,x).normalize(),r[5].setComponents(c-l,L-h,d-m,b-x).normalize();else if(r[4].setComponents(c-l,L-h,d-m,b-x).normalize(),t===cn)r[5].setComponents(c+l,L+h,d+m,b+x).normalize();else if(t===Kr)r[5].setComponents(l,h,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(e){$n.center.set(0,0,0);const t=ch.distanceTo(e.center);return $n.radius=.7071067811865476+t,$n.applyMatrix4(e.matrixWorld),this.intersectsSphere($n)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(wr.x=r.normal.x>0?e.max.x:e.min.x,wr.y=r.normal.y>0?e.max.y:e.min.y,wr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(wr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class f0 extends bt{constructor(e=[],t=ni,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class hh extends bt{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class tr extends bt{constructor(e,t,n=un,r,s,a,o=Mt,l=Mt,c,u=Rn,f=1){if(u!==Rn&&u!==jn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:f};super(h,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new to(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class uh extends tr{constructor(e,t=un,n=ni,r,s,a=Mt,o=Mt,l,c=Rn){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class p0 extends bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ar extends Cn{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,L=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new An(c,3)),this.setAttribute("normal",new An(u,3)),this.setAttribute("uv",new An(f,2));function g(M,m,d,T,w,x,b,S,A,v,y){const D=x/A,I=b/v,z=x/2,V=b/2,U=S/2,H=A+1,J=v+1;let W=0,ne=0;const q=new k;for(let j=0;j<J;j++){const te=j*I-V;for(let we=0;we<H;we++){const Te=we*D-z;q[M]=Te*T,q[m]=te*w,q[d]=U,c.push(q.x,q.y,q.z),q[M]=0,q[m]=0,q[d]=S>0?1:-1,u.push(q.x,q.y,q.z),f.push(we/A),f.push(1-j/v),W+=1}}for(let j=0;j<v;j++)for(let te=0;te<A;te++){const we=h+te+H*j,Te=h+te+H*(j+1),tt=h+(te+1)+H*(j+1),Ge=h+(te+1)+H*j;l.push(we,Te,Ge),l.push(Te,tt,Ge),ne+=6}o.addGroup(L,ne,y),L+=ne,h+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ar(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class or extends Cn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,f=e/o,h=t/l,L=[],g=[],M=[],m=[];for(let d=0;d<u;d++){const T=d*h-a;for(let w=0;w<c;w++){const x=w*f-s;g.push(x,-T,0),M.push(0,0,1),m.push(w/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let T=0;T<o;T++){const w=T+c*d,x=T+c*(d+1),b=T+1+c*(d+1),S=T+1+c*d;L.push(w,x,S),L.push(x,b,S)}this.setIndex(L),this.setAttribute("position",new An(g,3)),this.setAttribute("normal",new An(M,3)),this.setAttribute("uv",new An(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new or(e.width,e.height,e.widthSegments,e.heightSegments)}}function Di(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];if(Jo(r))r.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(Jo(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function Pt(i){const e={};for(let t=0;t<i.length;t++){const n=Di(i[t]);for(const r in n)e[r]=n[r]}return e}function Jo(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function dh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function m0(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const fh={clone:Di,merge:Pt};var ph=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class en extends ns{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ph,this.fragmentShader=mh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Di(e.uniforms),this.uniformsGroups=dh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new $e().setHex(r.value);break;case"v2":this.uniforms[n].value=new Ve().fromArray(r.value);break;case"v3":this.uniforms[n].value=new k().fromArray(r.value);break;case"v4":this.uniforms[n].value=new at().fromArray(r.value);break;case"m3":this.uniforms[n].value=new De().fromArray(r.value);break;case"m4":this.uniforms[n].value=new mt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Lh extends en{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class gh extends ns{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _h extends ns{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Bs={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Qo(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Qo(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Qo(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class vh{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const L=c[f],g=c[f+1];if(L.global&&(L.lastIndex=0),L.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const xh=new vh;class io{constructor(e){this.manager=e!==void 0?e:xh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}io.DEFAULT_MATERIAL_NAME="__DEFAULT";const vi=new WeakMap;class Sh extends io{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Bs.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let f=vi.get(a);f===void 0&&(f=[],vi.set(a,f)),f.push({onLoad:t,onError:r})}return a}const o=er("img");function l(){u(),t&&t(this);const f=vi.get(this)||[];for(let h=0;h<f.length;h++){const L=f[h];L.onLoad&&L.onLoad(this)}vi.delete(this),s.manager.itemEnd(e)}function c(f){u(),r&&r(f),Bs.remove(`image:${e}`);const h=vi.get(this)||[];for(let L=0;L<h.length;L++){const g=h[L];g.onError&&g.onError(f)}vi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bs.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class Mh extends io{constructor(e){super(e)}load(e,t,n,r){const s=new bt,a=new Sh(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}const Rr=new k,Cr=new Ii,rn=new k;class L0 extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Rr,Cr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Rr,Cr,rn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Rr,Cr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Rr,Cr,rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const zn=new k,jo=new Ve,el=new Ve;class $t extends L0{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ls*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,jo,el),t.subVectors(el,jo)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ls*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ro extends L0{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const xi=-90,Si=1;class Eh extends Ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new $t(xi,Si,e,t);r.layers=this.layers,this.add(r);const s=new $t(xi,Si,e,t);s.layers=this.layers,this.add(s);const a=new $t(xi,Si,e,t);a.layers=this.layers,this.add(a);const o=new $t(xi,Si,e,t);o.layers=this.layers,this.add(o);const l=new $t(xi,Si,e,t);l.layers=this.layers,this.add(l);const c=new $t(xi,Si,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===cn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Kr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),L=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,h,L),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class bh extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const mo=class mo{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}};mo.prototype.isMatrix2=!0;let tl=mo;function nl(i,e,t,n){const r=yh(n);switch(t){case t0:return i*e;case i0:return i*e/r.components*r.byteLength;case $a:return i*e/r.components*r.byteLength;case ii:return i*e*2/r.components*r.byteLength;case Ja:return i*e*2/r.components*r.byteLength;case n0:return i*e*3/r.components*r.byteLength;case Qt:return i*e*4/r.components*r.byteLength;case Qa:return i*e*4/r.components*r.byteLength;case Or:case Br:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zr:case Hr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case oa:case ca:return Math.max(i,16)*Math.max(e,8)/4;case aa:case la:return Math.max(i,8)*Math.max(e,8)/2;case ha:case ua:case fa:case pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case da:case Xr:case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case La:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ga:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case _a:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case xa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ra:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ca:case Pa:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ia:case Ua:return Math.ceil(i/4)*Math.ceil(e/4)*8;case qr:case Na:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yh(i){switch(i){case Wt:case Jl:return{byteLength:1,components:1};case Qi:case Ql:case dn:return{byteLength:2,components:1};case Za:case Ka:return{byteLength:2,components:4};case un:case Ya:case ln:return{byteLength:4,components:1};case jl:case e0:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qa}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qa);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function g0(){let i=null,e=!1,t=null,n=null;function r(s,a){n=i.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Th(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let L;if(c instanceof Float32Array)L=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)L=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?L=i.HALF_FLOAT:L=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)L=i.SHORT;else if(c instanceof Uint32Array)L=i.UNSIGNED_INT;else if(c instanceof Int32Array)L=i.INT;else if(c instanceof Int8Array)L=i.BYTE;else if(c instanceof Uint8Array)L=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)L=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:L,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((L,g)=>L.start-g.start);let h=0;for(let L=1;L<f.length;L++){const g=f[h],M=f[L];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++h,f[h]=M)}f.length=h+1;for(let L=0,g=f.length;L<g;L++){const M=f[L];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var Ah=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wh=`#ifdef USE_ALPHAHASH
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
#endif`,Rh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ch=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ph=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ih=`#ifdef USE_AOMAP
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
#endif`,Uh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nh=`#ifdef USE_BATCHING
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
#endif`,Fh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Oh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hh=`#ifdef USE_IRIDESCENCE
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
#endif`,kh=`#ifdef USE_BUMPMAP
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
#endif`,Gh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Yh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Zh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Kh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,$h=`#define PI 3.141592653589793
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
} // validated`,Jh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Qh=`vec3 transformedNormal = objectNormal;
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
#endif`,jh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,eu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,iu="gl_FragColor = linearToOutputTexel( gl_FragColor );",ru=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,su=`#ifdef USE_ENVMAP
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
#endif`,au=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ou=`#ifdef USE_ENVMAP
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
#endif`,lu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cu=`#ifdef USE_ENVMAP
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
#endif`,hu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,du=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pu=`#ifdef USE_GRADIENTMAP
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
}`,mu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_u=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,vu=`#ifdef USE_ENVMAP
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
#endif`,xu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Su=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Mu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Eu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bu=`PhysicalMaterial material;
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
#endif`,yu=`uniform sampler2D dfgLUT;
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
}`,Tu=`
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
#endif`,Au=`#if defined( RE_IndirectDiffuse )
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
#endif`,wu=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ru=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Cu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Du=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Iu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Uu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Nu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ou=`#if defined( USE_POINTS_UV )
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
#endif`,Bu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ku=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vu=`#ifdef USE_MORPHTARGETS
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
#endif`,Wu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ku=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$u=`#ifdef USE_NORMALMAP
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
#endif`,Ju=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ju=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ed=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,td=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,id=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ad=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,od=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ld=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ud=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dd=`float getShadowMask() {
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
}`,fd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pd=`#ifdef USE_SKINNING
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
#endif`,md=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ld=`#ifdef USE_SKINNING
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
#endif`,gd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_d=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Sd=`#ifdef USE_TRANSMISSION
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
#endif`,Md=`#ifdef USE_TRANSMISSION
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
#endif`,Ed=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ad=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wd=`uniform sampler2D t2D;
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
}`,Rd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Pd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Id=`#include <common>
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
}`,Ud=`#if DEPTH_PACKING == 3200
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
}`,Nd=`#define DISTANCE
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
}`,Fd=`#define DISTANCE
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
}`,Od=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zd=`uniform float scale;
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
}`,Hd=`uniform vec3 diffuse;
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
}`,kd=`#include <common>
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
}`,Gd=`uniform vec3 diffuse;
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
}`,Vd=`#define LAMBERT
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
}`,Wd=`#define LAMBERT
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
}`,Xd=`#define MATCAP
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
}`,qd=`#define MATCAP
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
}`,Yd=`#define NORMAL
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
}`,Zd=`#define NORMAL
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
}`,Kd=`#define PHONG
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
}`,$d=`#define PHONG
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
}`,Jd=`#define STANDARD
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
}`,Qd=`#define STANDARD
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
}`,jd=`#define TOON
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
}`,ef=`#define TOON
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
}`,tf=`uniform float size;
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
}`,nf=`uniform vec3 diffuse;
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
}`,rf=`#include <common>
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
}`,sf=`uniform vec3 color;
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
}`,af=`uniform float rotation;
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
}`,of=`uniform vec3 diffuse;
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
}`,Ne={alphahash_fragment:Ah,alphahash_pars_fragment:wh,alphamap_fragment:Rh,alphamap_pars_fragment:Ch,alphatest_fragment:Ph,alphatest_pars_fragment:Dh,aomap_fragment:Ih,aomap_pars_fragment:Uh,batching_pars_vertex:Nh,batching_vertex:Fh,begin_vertex:Oh,beginnormal_vertex:Bh,bsdfs:zh,iridescence_fragment:Hh,bumpmap_pars_fragment:kh,clipping_planes_fragment:Gh,clipping_planes_pars_fragment:Vh,clipping_planes_pars_vertex:Wh,clipping_planes_vertex:Xh,color_fragment:qh,color_pars_fragment:Yh,color_pars_vertex:Zh,color_vertex:Kh,common:$h,cube_uv_reflection_fragment:Jh,defaultnormal_vertex:Qh,displacementmap_pars_vertex:jh,displacementmap_vertex:eu,emissivemap_fragment:tu,emissivemap_pars_fragment:nu,colorspace_fragment:iu,colorspace_pars_fragment:ru,envmap_fragment:su,envmap_common_pars_fragment:au,envmap_pars_fragment:ou,envmap_pars_vertex:lu,envmap_physical_pars_fragment:vu,envmap_vertex:cu,fog_vertex:hu,fog_pars_vertex:uu,fog_fragment:du,fog_pars_fragment:fu,gradientmap_pars_fragment:pu,lightmap_pars_fragment:mu,lights_lambert_fragment:Lu,lights_lambert_pars_fragment:gu,lights_pars_begin:_u,lights_toon_fragment:xu,lights_toon_pars_fragment:Su,lights_phong_fragment:Mu,lights_phong_pars_fragment:Eu,lights_physical_fragment:bu,lights_physical_pars_fragment:yu,lights_fragment_begin:Tu,lights_fragment_maps:Au,lights_fragment_end:wu,lightprobes_pars_fragment:Ru,logdepthbuf_fragment:Cu,logdepthbuf_pars_fragment:Pu,logdepthbuf_pars_vertex:Du,logdepthbuf_vertex:Iu,map_fragment:Uu,map_pars_fragment:Nu,map_particle_fragment:Fu,map_particle_pars_fragment:Ou,metalnessmap_fragment:Bu,metalnessmap_pars_fragment:zu,morphinstance_vertex:Hu,morphcolor_vertex:ku,morphnormal_vertex:Gu,morphtarget_pars_vertex:Vu,morphtarget_vertex:Wu,normal_fragment_begin:Xu,normal_fragment_maps:qu,normal_pars_fragment:Yu,normal_pars_vertex:Zu,normal_vertex:Ku,normalmap_pars_fragment:$u,clearcoat_normal_fragment_begin:Ju,clearcoat_normal_fragment_maps:Qu,clearcoat_pars_fragment:ju,iridescence_pars_fragment:ed,opaque_fragment:td,packing:nd,premultiplied_alpha_fragment:id,project_vertex:rd,dithering_fragment:sd,dithering_pars_fragment:ad,roughnessmap_fragment:od,roughnessmap_pars_fragment:ld,shadowmap_pars_fragment:cd,shadowmap_pars_vertex:hd,shadowmap_vertex:ud,shadowmask_pars_fragment:dd,skinbase_vertex:fd,skinning_pars_vertex:pd,skinning_vertex:md,skinnormal_vertex:Ld,specularmap_fragment:gd,specularmap_pars_fragment:_d,tonemapping_fragment:vd,tonemapping_pars_fragment:xd,transmission_fragment:Sd,transmission_pars_fragment:Md,uv_pars_fragment:Ed,uv_pars_vertex:bd,uv_vertex:yd,worldpos_vertex:Td,background_vert:Ad,background_frag:wd,backgroundCube_vert:Rd,backgroundCube_frag:Cd,cube_vert:Pd,cube_frag:Dd,depth_vert:Id,depth_frag:Ud,distance_vert:Nd,distance_frag:Fd,equirect_vert:Od,equirect_frag:Bd,linedashed_vert:zd,linedashed_frag:Hd,meshbasic_vert:kd,meshbasic_frag:Gd,meshlambert_vert:Vd,meshlambert_frag:Wd,meshmatcap_vert:Xd,meshmatcap_frag:qd,meshnormal_vert:Yd,meshnormal_frag:Zd,meshphong_vert:Kd,meshphong_frag:$d,meshphysical_vert:Jd,meshphysical_frag:Qd,meshtoon_vert:jd,meshtoon_frag:ef,points_vert:tf,points_frag:nf,shadow_vert:rf,shadow_frag:sf,sprite_vert:af,sprite_frag:of},de={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new k},probesMax:{value:new k},probesResolution:{value:new k}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},on={basic:{uniforms:Pt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Pt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new $e(0)},envMapIntensity:{value:1}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Pt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Pt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Pt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new $e(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Pt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Pt([de.points,de.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Pt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Pt([de.common,de.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Pt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Pt([de.sprite,de.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distance:{uniforms:Pt([de.common,de.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distance_vert,fragmentShader:Ne.distance_frag},shadow:{uniforms:Pt([de.lights,de.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};on.physical={uniforms:Pt([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const Pr={r:0,b:0,g:0},lf=new mt,_0=new De;_0.set(-1,0,0,0,1,0,0,0,1);function cf(i,e,t,n,r,s){const a=new $e(0);let o=r===!0?0:1,l,c,u=null,f=0,h=null;function L(T){let w=T.isScene===!0?T.background:null;if(w&&w.isTexture){const x=T.backgroundBlurriness>0;w=e.get(w,x)}return w}function g(T){let w=!1;const x=L(T);x===null?m(a,o):x&&x.isColor&&(m(x,1),w=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(T,w){const x=L(w);x&&(x.isCubeTexture||x.mapping===ts)?(c===void 0&&(c=new fn(new ar(1,1,1),new en({name:"BackgroundCubeMaterial",uniforms:Di(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:Nt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(lf.makeRotationFromEuler(w.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_0),c.material.toneMapped=He.getTransfer(x.colorSpace)!==Qe,(u!==x||f!==x.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=x,f=x.version,h=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new fn(new or(2,2),new en({name:"BackgroundMaterial",uniforms:Di(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=He.getTransfer(x.colorSpace)!==Qe,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,h=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function m(T,w){T.getRGB(Pr,m0(i)),t.buffers.color.setClear(Pr.r,Pr.g,Pr.b,w,s)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(T,w=1){a.set(T),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(T){o=T,m(a,o)},render:g,addToRenderList:M,dispose:d}}function hf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,a=!1;function o(I,z,V,U,H){let J=!1;const W=f(I,U,V,z);s!==W&&(s=W,c(s.object)),J=L(I,U,V,H),J&&g(I,U,V,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(J||a)&&(a=!1,x(I,z,V,U),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function u(I){return i.deleteVertexArray(I)}function f(I,z,V,U){const H=U.wireframe===!0;let J=n[z.id];J===void 0&&(J={},n[z.id]=J);const W=I.isInstancedMesh===!0?I.id:0;let ne=J[W];ne===void 0&&(ne={},J[W]=ne);let q=ne[V.id];q===void 0&&(q={},ne[V.id]=q);let j=q[H];return j===void 0&&(j=h(l()),q[H]=j),j}function h(I){const z=[],V=[],U=[];for(let H=0;H<t;H++)z[H]=0,V[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:V,attributeDivisors:U,object:I,attributes:{},index:null}}function L(I,z,V,U){const H=s.attributes,J=z.attributes;let W=0;const ne=V.getAttributes();for(const q in ne)if(ne[q].location>=0){const te=H[q];let we=J[q];if(we===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(we=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(we=I.instanceColor)),te===void 0||te.attribute!==we||we&&te.data!==we.data)return!0;W++}return s.attributesNum!==W||s.index!==U}function g(I,z,V,U){const H={},J=z.attributes;let W=0;const ne=V.getAttributes();for(const q in ne)if(ne[q].location>=0){let te=J[q];te===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(te=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(te=I.instanceColor));const we={};we.attribute=te,te&&te.data&&(we.data=te.data),H[q]=we,W++}s.attributes=H,s.attributesNum=W,s.index=U}function M(){const I=s.newAttributes;for(let z=0,V=I.length;z<V;z++)I[z]=0}function m(I){d(I,0)}function d(I,z){const V=s.newAttributes,U=s.enabledAttributes,H=s.attributeDivisors;V[I]=1,U[I]===0&&(i.enableVertexAttribArray(I),U[I]=1),H[I]!==z&&(i.vertexAttribDivisor(I,z),H[I]=z)}function T(){const I=s.newAttributes,z=s.enabledAttributes;for(let V=0,U=z.length;V<U;V++)z[V]!==I[V]&&(i.disableVertexAttribArray(V),z[V]=0)}function w(I,z,V,U,H,J,W){W===!0?i.vertexAttribIPointer(I,z,V,H,J):i.vertexAttribPointer(I,z,V,U,H,J)}function x(I,z,V,U){M();const H=U.attributes,J=V.getAttributes(),W=z.defaultAttributeValues;for(const ne in J){const q=J[ne];if(q.location>=0){let j=H[ne];if(j===void 0&&(ne==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),ne==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){const te=j.normalized,we=j.itemSize,Te=e.get(j);if(Te===void 0)continue;const tt=Te.buffer,Ge=Te.type,Ye=Te.bytesPerElement,Y=Ge===i.INT||Ge===i.UNSIGNED_INT||j.gpuType===Ya;if(j.isInterleavedBufferAttribute){const Q=j.data,ve=Q.stride,Pe=j.offset;if(Q.isInstancedInterleavedBuffer){for(let ge=0;ge<q.locationSize;ge++)d(q.location+ge,Q.meshPerAttribute);I.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ge=0;ge<q.locationSize;ge++)m(q.location+ge);i.bindBuffer(i.ARRAY_BUFFER,tt);for(let ge=0;ge<q.locationSize;ge++)w(q.location+ge,we/q.locationSize,Ge,te,ve*Ye,(Pe+we/q.locationSize*ge)*Ye,Y)}else{if(j.isInstancedBufferAttribute){for(let Q=0;Q<q.locationSize;Q++)d(q.location+Q,j.meshPerAttribute);I.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Q=0;Q<q.locationSize;Q++)m(q.location+Q);i.bindBuffer(i.ARRAY_BUFFER,tt);for(let Q=0;Q<q.locationSize;Q++)w(q.location+Q,we/q.locationSize,Ge,te,we*Ye,we/q.locationSize*Q*Ye,Y)}}else if(W!==void 0){const te=W[ne];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(q.location,te);break;case 3:i.vertexAttrib3fv(q.location,te);break;case 4:i.vertexAttrib4fv(q.location,te);break;default:i.vertexAttrib1fv(q.location,te)}}}}T()}function b(){y();for(const I in n){const z=n[I];for(const V in z){const U=z[V];for(const H in U){const J=U[H];for(const W in J)u(J[W].object),delete J[W];delete U[H]}}delete n[I]}}function S(I){if(n[I.id]===void 0)return;const z=n[I.id];for(const V in z){const U=z[V];for(const H in U){const J=U[H];for(const W in J)u(J[W].object),delete J[W];delete U[H]}}delete n[I.id]}function A(I){for(const z in n){const V=n[z];for(const U in V){const H=V[U];if(H[I.id]===void 0)continue;const J=H[I.id];for(const W in J)u(J[W].object),delete J[W];delete H[I.id]}}}function v(I){for(const z in n){const V=n[z],U=I.isInstancedMesh===!0?I.id:0,H=V[U];if(H!==void 0){for(const J in H){const W=H[J];for(const ne in W)u(W[ne].object),delete W[ne];delete H[J]}delete V[U],Object.keys(V).length===0&&delete n[z]}}}function y(){D(),a=!0,s!==r&&(s=r,c(s.object))}function D(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:y,resetDefaultState:D,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:m,disableUnusedAttributes:T}}function uf(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let L=0;L<u;L++)h+=c[L];t.update(h,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function df(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Qt&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const v=A===dn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Wt&&A!==ln&&!v&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Ce("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const L=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:L,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:T,maxVaryings:w,maxFragmentUniforms:x,maxSamples:b,samples:S}}function ff(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new kn,o=new De,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const L=f.length!==0||h||n!==0||r;return r=h,n=f.length,L},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,L){const g=f.clippingPlanes,M=f.clipIntersection,m=f.clipShadows,d=i.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const T=s?0:n,w=T*4;let x=d.clippingState||null;l.value=x,x=u(g,h,w,L);for(let b=0;b!==w;++b)x[b]=t[b];d.clippingState=x,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,h,L,g){const M=f!==null?f.length:0;let m=null;if(M!==0){if(m=l.value,g!==!0||m===null){const d=L+M*4,T=h.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<d)&&(m=new Float32Array(d));for(let w=0,x=L;w!==M;++w,x+=4)a.copy(f[w]).applyMatrix4(T,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}const Ai=4,pf=6,mf=20,Lf=256,Hi=new ro,il=new $e;let zs=null,Hs=0,ks=0,Gs=!1;const gf=new k,Jn=new k;class rl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=gf}=s;zs=this._renderer.getRenderTarget(),Hs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(zs,Hs,ks),this._renderer.xr.enabled=Gs,e.scissorTest=!1,Mi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ni||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zs=this._renderer.getRenderTarget(),Hs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:dn,format:Qt,colorSpace:Yr,depthBuffer:!1},r=sl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=_f(s)),this._blurMaterial=xf(s,e,t),this._ggxMaterial=vf(s,e,t)}return r}_compileMaterial(e){const t=new fn(new Cn,e);this._renderer.compile(t,Hi)}_sceneToCubeUV(e,t,n,r,s){const l=new $t(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,L=f.toneMapping;f.getClearColor(il),f.toneMapping=hn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new fn(new ar,new h0({name:"PMREM.Background",side:Nt,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,m=M.material;let d=!1;const T=e.background;T?T.isColor&&(m.color.copy(T),e.background=null,d=!0):(m.color.copy(il),d=!0);for(let w=0;w<6;w++){const x=w%3;x===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[w],s.y,s.z)):x===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[w]));const b=this._cubeSize;Mi(r,x*b,w>2?b:0,b,b),f.setRenderTarget(r),d&&f.render(M,l),f.render(e,l)}f.toneMapping=L,f.autoClear=h,e.background=T}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===ni||e.mapping===Pi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=al());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Mi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Hi)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,L=f*h,{_lodMax:g}=this,M=this._sizeLods[n],m=3*M*(n>g-Ai?n-g+Ai:0),d=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=L,l.mipInt.value=g-t,Mi(s,m,d,3*M,2*M),r.setRenderTarget(s),r.render(o,Hi),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,Mi(e,m,d,3*M,2*M),r.setRenderTarget(e),r.render(o,Hi)}_blur(e,t,n,r){const s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,r,s){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-n;const u=this._sizeLods[r],f=3*u*(r>this._lodMax-Ai?r-this._lodMax+Ai:0),h=4*(this._cubeSize-u);Mi(t,f,h,3*u,2*u),a.setRenderTarget(t),a.render(l,Hi)}}function _f(i){const e=[],t=[];let n=i;const r=i-Ai+1+pf;for(let s=0;s<r;s++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,L=3,g=new Float32Array(L*h*f),M=new Float32Array(L*h*f);for(let d=0;d<f;d++){const T=d%3*2/3-1,w=d>2?0:-1,x=[T,w,0,T+2/3,w,0,T+2/3,w+1,0,T,w,0,T+2/3,w+1,0,T,w+1,0];g.set(x,L*h*d);for(let b=0;b<h;b++){const S=u[b*2]*2-1,A=u[b*2+1]*2-1;d===0?Jn.set(1,A,S):d===1?Jn.set(-S,1,-A):d===2?Jn.set(-S,A,1):d===3?Jn.set(-1,A,-S):d===4?Jn.set(-S,-1,A):Jn.set(S,A,-1),Jn.toArray(M,(d*h+b)*L)}}const m=new Cn;m.setAttribute("position",new Tn(g,L)),m.setAttribute("outputDirection",new Tn(M,L)),t.push(new fn(m,null)),n>Ai&&n--}return{lodMeshes:t,sizeLods:e}}function sl(i,e,t){const n=new jt(i,e,t);return n.texture.mapping=ts,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Mi(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function vf(i,e,t){return new en({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Lf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:is(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function xf(i,e,t){return new en({name:"SphericalGaussianBlur",defines:{SAMPLES:mf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:is(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function al(){return new en({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:is(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function ol(){return new en({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:is(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function is(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class v0 extends jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new f0(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ar(5,5,5),s=new en({name:"CubemapFromEquirect",uniforms:Di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Nt,blending:bn});s.uniforms.tEquirect.value=t;const a=new fn(r,s),o=t.minFilter;return t.minFilter===En&&(t.minFilter=Et),new Eh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}function Sf(i){let e=new WeakMap,t=new WeakMap,n=null;function r(h,L=!1){return h==null?null:L?a(h):s(h)}function s(h){if(h&&h.isTexture){const L=h.mapping;if(L===ds||L===fs)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const M=new v0(g.height);return M.fromEquirectangularTexture(i,h),e.set(h,M),h.addEventListener("dispose",c),o(M.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const L=h.mapping,g=L===ds||L===fs,M=L===ni||L===Pi;if(g||M){let m=t.get(h);const d=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new rl(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const T=h.image;return g&&T&&T.height>0||M&&T&&l(T)?(n===null&&(n=new rl(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,L){return L===ds?h.mapping=ni:L===fs&&(h.mapping=Pi),h}function l(h){let L=0;const g=6;for(let M=0;M<g;M++)h[M]!==void 0&&L++;return L===g}function c(h){const L=h.target;L.removeEventListener("dispose",c);const g=e.get(L);g!==void 0&&(e.delete(L),g.dispose())}function u(h){const L=h.target;L.removeEventListener("dispose",u);const g=t.get(L);g!==void 0&&(t.delete(L),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:f}}function Mf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&wi("WebGLRenderer: "+n+" extension not supported."),r}}}function Ef(i,e,t,n){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete r[h.id];const L=s.get(h);L&&(e.remove(L),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const L in h)e.update(h[L],i.ARRAY_BUFFER)}function c(f){const h=[],L=f.index,g=f.attributes.position;let M=0;if(g===void 0)return;if(L!==null){const T=L.array;M=L.version;for(let w=0,x=T.length;w<x;w+=3){const b=T[w+0],S=T[w+1],A=T[w+2];h.push(b,S,S,A,A,b)}}else{const T=g.array;M=g.version;for(let w=0,x=T.length/3-1;w<x;w+=3){const b=w+0,S=w+1,A=w+2;h.push(b,S,S,A,A,b)}}const m=new(g.count>=65535?c0:l0)(h,1);m.version=M;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const h=s.get(f);if(h){const L=f.index;L!==null&&h.version<L.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function bf(i,e,t){let n;function r(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,s,f*a),t.update(h,n,1)}function c(f,h,L){L!==0&&(i.drawElementsInstanced(n,h,s,f*a,L),t.update(h,n,L))}function u(f,h,L){if(L===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,f,0,L);let M=0;for(let m=0;m<L;m++)M+=h[m];t.update(M,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function yf(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:qe("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Tf(i,e,t){const n=new WeakMap,r=new at;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==f){let D=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",D)};var L=D;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),M===!0&&(x=2),m===!0&&(x=3);let b=o.attributes.position.count*x,S=1;b>e.maxTextureSize&&(S=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const A=new Float32Array(b*S*4*f),v=new s0(A,b,S,f);v.type=ln,v.needsUpdate=!0;const y=x*4;for(let I=0;I<f;I++){const z=d[I],V=T[I],U=w[I],H=b*S*4*I;for(let J=0;J<z.count;J++){const W=J*y;g===!0&&(r.fromBufferAttribute(z,J),A[H+W+0]=r.x,A[H+W+1]=r.y,A[H+W+2]=r.z,A[H+W+3]=0),M===!0&&(r.fromBufferAttribute(V,J),A[H+W+4]=r.x,A[H+W+5]=r.y,A[H+W+6]=r.z,A[H+W+7]=0),m===!0&&(r.fromBufferAttribute(U,J),A[H+W+8]=r.x,A[H+W+9]=r.y,A[H+W+10]=r.z,A[H+W+11]=U.itemSize===4?r.w:1)}}h={count:f,texture:v,size:new Ve(b,S)},n.set(o,h),o.addEventListener("dispose",D)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const M=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function Af(i,e,t,n,r){let s=new WeakMap;function a(c){const u=r.render.frame,f=c.geometry,h=e.get(c,f);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const L=c.skeleton;s.get(L)!==u&&(L.update(),s.set(L,u))}return h}function o(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const wf={[Vl]:"LINEAR_TONE_MAPPING",[Wl]:"REINHARD_TONE_MAPPING",[Xl]:"CINEON_TONE_MAPPING",[ql]:"ACES_FILMIC_TONE_MAPPING",[Zl]:"AGX_TONE_MAPPING",[Kl]:"NEUTRAL_TONE_MAPPING",[Yl]:"CUSTOM_TONE_MAPPING"};function Rf(i,e,t,n,r,s){const a=new jt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Cn;c.setAttribute("position",new An([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new An([0,2,0,0,2,0],2));const u=new Lh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new fn(c,u),h=new ro(-1,1,1,-1,0,1);let L=null,g=null,M=!1,m,d=null,T=[],w=!1;this.setSize=function(x,b){a.setSize(x,b),o!==null&&o.setSize(x,b),l!==null&&l.setSize(x,b);for(let S=0;S<T.length;S++){const A=T[S];A.setSize&&A.setSize(x,b)}},this.setEffects=function(x){T=x,w=T.length>0&&T[0].isRenderPass===!0;const b=a.width,S=a.height;T.length>0&&o===null&&(o=new jt(b,S,{type:dn,depthBuffer:!1,stencilBuffer:!1}),l=new jt(b,S,{type:dn,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<T.length;A++){const v=T[A];v.setSize&&v.setSize(b,S)}},this.begin=function(x,b){if(M||x.toneMapping===hn&&T.length===0)return!1;if(d=b,b!==null){const S=b.width,A=b.height;(a.width!==S||a.height!==A)&&this.setSize(S,A)}return w===!1&&x.setRenderTarget(a),m=x.toneMapping,x.toneMapping=hn,!0},this.hasRenderPass=function(){return w},this.end=function(x,b){x.toneMapping=m,M=!0;let S=a,A=o;for(let v=0;v<T.length;v++){const y=T[v];y.enabled!==!1&&(y.render(x,A,S,b),y.needsSwap!==!1&&(S=A,A=A===o?l:o))}if(L!==x.outputColorSpace||g!==x.toneMapping){L=x.outputColorSpace,g=x.toneMapping,u.defines={},He.getTransfer(L)===Qe&&(u.defines.SRGB_TRANSFER="");const v=wf[g];v&&(u.defines[v]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=S.texture,x.setRenderTarget(d),x.render(f,h),d=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}const x0=new bt,Oa=new tr(1,1),S0=new s0,M0=new qc,E0=new f0,ll=[],cl=[],hl=new Float32Array(16),ul=new Float32Array(9),dl=new Float32Array(4);function Ui(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=ll[r];if(s===void 0&&(s=new Float32Array(r),ll[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function _t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function rs(i,e){let t=cl[e];t===void 0&&(t=new Int32Array(e),cl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Cf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Pf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2fv(this.addr,e),vt(t,e)}}function Df(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;i.uniform3fv(this.addr,e),vt(t,e)}}function If(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4fv(this.addr,e),vt(t,e)}}function Uf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;dl.set(n),i.uniformMatrix2fv(this.addr,!1,dl),vt(t,n)}}function Nf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;ul.set(n),i.uniformMatrix3fv(this.addr,!1,ul),vt(t,n)}}function Ff(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;hl.set(n),i.uniformMatrix4fv(this.addr,!1,hl),vt(t,n)}}function Of(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Bf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2iv(this.addr,e),vt(t,e)}}function zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3iv(this.addr,e),vt(t,e)}}function Hf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4iv(this.addr,e),vt(t,e)}}function kf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2uiv(this.addr,e),vt(t,e)}}function Vf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3uiv(this.addr,e),vt(t,e)}}function Wf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4uiv(this.addr,e),vt(t,e)}}function Xf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Oa.compareFunction=t.isReversedDepthBuffer()?eo:ja,s=Oa):s=x0,t.setTexture2D(e||s,r)}function qf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||M0,r)}function Yf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||E0,r)}function Zf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||S0,r)}function Kf(i){switch(i){case 5126:return Cf;case 35664:return Pf;case 35665:return Df;case 35666:return If;case 35674:return Uf;case 35675:return Nf;case 35676:return Ff;case 5124:case 35670:return Of;case 35667:case 35671:return Bf;case 35668:case 35672:return zf;case 35669:case 35673:return Hf;case 5125:return kf;case 36294:return Gf;case 36295:return Vf;case 36296:return Wf;case 35678:case 36198:case 36298:case 36306:case 35682:return Xf;case 35679:case 36299:case 36307:return qf;case 35680:case 36300:case 36308:case 36293:return Yf;case 36289:case 36303:case 36311:case 36292:return Zf}}function $f(i,e){i.uniform1fv(this.addr,e)}function Jf(i,e){const t=Ui(e,this.size,2);i.uniform2fv(this.addr,t)}function Qf(i,e){const t=Ui(e,this.size,3);i.uniform3fv(this.addr,t)}function jf(i,e){const t=Ui(e,this.size,4);i.uniform4fv(this.addr,t)}function ep(i,e){const t=Ui(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function tp(i,e){const t=Ui(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function np(i,e){const t=Ui(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ip(i,e){i.uniform1iv(this.addr,e)}function rp(i,e){i.uniform2iv(this.addr,e)}function sp(i,e){i.uniform3iv(this.addr,e)}function ap(i,e){i.uniform4iv(this.addr,e)}function op(i,e){i.uniform1uiv(this.addr,e)}function lp(i,e){i.uniform2uiv(this.addr,e)}function cp(i,e){i.uniform3uiv(this.addr,e)}function hp(i,e){i.uniform4uiv(this.addr,e)}function up(i,e,t){const n=this.cache,r=e.length,s=rs(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=Oa:a=x0;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function dp(i,e,t){const n=this.cache,r=e.length,s=rs(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||M0,s[a])}function fp(i,e,t){const n=this.cache,r=e.length,s=rs(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||E0,s[a])}function pp(i,e,t){const n=this.cache,r=e.length,s=rs(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||S0,s[a])}function mp(i){switch(i){case 5126:return $f;case 35664:return Jf;case 35665:return Qf;case 35666:return jf;case 35674:return ep;case 35675:return tp;case 35676:return np;case 5124:case 35670:return ip;case 35667:case 35671:return rp;case 35668:case 35672:return sp;case 35669:case 35673:return ap;case 5125:return op;case 36294:return lp;case 36295:return cp;case 36296:return hp;case 35678:case 36198:case 36298:case 36306:case 35682:return up;case 35679:case 36299:case 36307:return dp;case 35680:case 36300:case 36308:case 36293:return fp;case 36289:case 36303:case 36311:case 36292:return pp}}class Lp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Kf(t.type)}}class gp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mp(t.type)}}class _p{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const Vs=/(\w+)(\])?(\[|\.)?/g;function fl(i,e){i.seq.push(e),i.map[e.id]=e}function vp(i,e,t){const n=i.name,r=n.length;for(Vs.lastIndex=0;;){const s=Vs.exec(n),a=Vs.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){fl(t,c===void 0?new Lp(o,i,e):new gp(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new _p(o),fl(t,f)),t=f}}}class kr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);vp(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function pl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const xp=37297;let Sp=0;function Mp(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ml=new De;function Ep(i){He._getMatrix(ml,He.workingColorSpace,i);const e=`mat3( ${ml.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(i)){case Zr:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ll(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Mp(i.getShaderSource(e),o)}else return s}function bp(i,e){const t=Ep(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const yp={[Vl]:"Linear",[Wl]:"Reinhard",[Xl]:"Cineon",[ql]:"ACESFilmic",[Zl]:"AgX",[Kl]:"Neutral",[Yl]:"Custom"};function Tp(i,e){const t=yp[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Dr=new k;function Ap(){He.getLuminanceCoefficients(Dr);const i=Dr.x.toFixed(4),e=Dr.y.toFixed(4),t=Dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function wp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xi).join(`
`)}function Rp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Cp(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Xi(i){return i!==""}function gl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _l(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Pp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ba(i){return i.replace(Pp,Ip)}const Dp=new Map;function Ip(i,e){let t=Ne[e];if(t===void 0){const n=Dp.get(e);if(n!==void 0)t=Ne[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ba(t)}const Up=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vl(i){return i.replace(Up,Np)}function Np(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function xl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Fp={[Fr]:"SHADOWMAP_TYPE_PCF",[Wi]:"SHADOWMAP_TYPE_VSM"};function Op(i){return Fp[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Bp={[ni]:"ENVMAP_TYPE_CUBE",[Pi]:"ENVMAP_TYPE_CUBE",[ts]:"ENVMAP_TYPE_CUBE_UV"};function zp(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Bp[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Hp={[Pi]:"ENVMAP_MODE_REFRACTION"};function kp(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Hp[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Gp={[Gl]:"ENVMAP_BLENDING_MULTIPLY",[Ec]:"ENVMAP_BLENDING_MIX",[bc]:"ENVMAP_BLENDING_ADD"};function Vp(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Gp[i.combine]||"ENVMAP_BLENDING_NONE"}function Wp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Xp(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Op(t),c=zp(t),u=kp(t),f=Vp(t),h=Wp(t),L=wp(t),g=Rp(s),M=r.createProgram();let m,d,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Xi).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Xi).join(`
`),d.length>0&&(d+=`
`)):(m=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),d=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==hn?"#define TONE_MAPPING":"",t.toneMapping!==hn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==hn?Tp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,bp("linearToOutputTexel",t.outputColorSpace),Ap(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xi).join(`
`)),a=Ba(a),a=gl(a,t),a=_l(a,t),o=Ba(o),o=gl(o,t),o=_l(o,t),a=vl(a),o=vl(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[L,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Uo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Uo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const w=T+m+a,x=T+d+o,b=pl(r,r.VERTEX_SHADER,w),S=pl(r,r.FRAGMENT_SHADER,x);r.attachShader(M,b),r.attachShader(M,S),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function A(I){if(i.debug.checkShaderErrors){const z=r.getProgramInfoLog(M)||"",V=r.getShaderInfoLog(b)||"",U=r.getShaderInfoLog(S)||"",H=z.trim(),J=V.trim(),W=U.trim();let ne=!0,q=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,b,S);else{const j=Ll(r,b,"vertex"),te=Ll(r,S,"fragment");qe("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+H+`
`+j+`
`+te)}else H!==""?Ce("WebGLProgram: Program Info Log:",H):(J===""||W==="")&&(q=!1);q&&(I.diagnostics={runnable:ne,programLog:H,vertexShader:{log:J,prefix:m},fragmentShader:{log:W,prefix:d}})}r.deleteShader(b),r.deleteShader(S),v=new kr(r,M),y=Cp(r,M)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=r.getProgramParameter(M,xp)),D},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Sp++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=b,this.fragmentShader=S,this}let qp=0;class Yp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Zp(e),t.set(e,n)),n}}class Zp{constructor(e){this.id=qp++,this.code=e,this.usedTimes=0}}function Kp(i){return i===ii||i===Xr||i===qr}function $p(i,e,t,n,r,s){const a=new a0,o=new Yp,l=new Set,c=[],u=new Map,f=n.logarithmicDepthBuffer;let h=n.precision;const L={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function M(v,y,D,I,z,V){const U=I.fog,H=z.geometry,J=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?I.environment:null,W=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,ne=e.get(v.envMap||J,W),q=ne&&ne.mapping===ts?ne.image.height:null,j=L[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&Ce("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));const te=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,we=te!==void 0?te.length:0;let Te=0;H.morphAttributes.position!==void 0&&(Te=1),H.morphAttributes.normal!==void 0&&(Te=2),H.morphAttributes.color!==void 0&&(Te=3);let tt,Ge,Ye,Y;if(j){const it=on[j];tt=it.vertexShader,Ge=it.fragmentShader}else{tt=v.vertexShader,Ge=v.fragmentShader;const it=o.getVertexShaderStage(v),Ze=o.getFragmentShaderStage(v);o.update(v,it,Ze),Ye=it.id,Y=Ze.id}const Q=i.getRenderTarget(),ve=i.state.buffers.depth.getReversed(),Pe=z.isInstancedMesh===!0,ge=z.isBatchedMesh===!0,Fe=!!v.map,Lt=!!v.matcap,Oe=!!ne,Xe=!!v.aoMap,nt=!!v.lightMap,ze=!!v.bumpMap&&v.wireframe===!1,ot=!!v.normalMap,xt=!!v.displacementMap,Dt=!!v.emissiveMap,lt=!!v.metalnessMap,dt=!!v.roughnessMap,P=v.anisotropy>0,yt=v.clearcoat>0,Je=v.dispersion>0,E=v.retroreflectivity>0,p=v.iridescence>0,N=v.sheen>0,B=v.transmission>0,X=P&&!!v.anisotropyMap,re=yt&&!!v.clearcoatMap,ae=yt&&!!v.clearcoatNormalMap,Z=yt&&!!v.clearcoatRoughnessMap,$=p&&!!v.iridescenceMap,oe=p&&!!v.iridescenceThicknessMap,be=N&&!!v.sheenColorMap,ue=N&&!!v.sheenRoughnessMap,le=!!v.specularMap,ye=!!v.specularColorMap,Re=!!v.specularIntensityMap,Ie=B&&!!v.transmissionMap,C=B&&!!v.thicknessMap,ce=!!v.gradientMap,K=!!v.alphaMap,he=v.alphaTest>0,me=!!v.alphaHash,ee=!!v.extensions;let Ae=hn;v.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ae=i.toneMapping);const Me={shaderID:j,shaderType:v.type,shaderName:v.name,vertexShader:tt,fragmentShader:Ge,defines:v.defines,customVertexShaderID:Ye,customFragmentShaderID:Y,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:ge,batchingColor:ge&&z._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&z.instanceColor!==null,instancingMorph:Pe&&z.morphTexture!==null,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:He.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Fe,matcap:Lt,envMap:Oe,envMapMode:Oe&&ne.mapping,envMapCubeUVHeight:q,aoMap:Xe,lightMap:nt,bumpMap:ze,normalMap:ot,displacementMap:xt,emissiveMap:Dt,normalMapObjectSpace:ot&&v.normalMapType===Ac,normalMapTangentSpace:ot&&v.normalMapType===Io,packedNormalMap:ot&&v.normalMapType===Io&&Kp(v.normalMap.format),metalnessMap:lt,roughnessMap:dt,anisotropy:P,anisotropyMap:X,clearcoat:yt,clearcoatMap:re,clearcoatNormalMap:ae,clearcoatRoughnessMap:Z,dispersion:Je,retroreflection:E,iridescence:p,iridescenceMap:$,iridescenceThicknessMap:oe,sheen:N,sheenColorMap:be,sheenRoughnessMap:ue,specularMap:le,specularColorMap:ye,specularIntensityMap:Re,transmission:B,transmissionMap:Ie,thicknessMap:C,gradientMap:ce,opaque:v.transparent===!1&&v.blending===qi&&v.alphaToCoverage===!1,alphaMap:K,alphaTest:he,alphaHash:me,combine:v.combine,mapUv:Fe&&g(v.map.channel),aoMapUv:Xe&&g(v.aoMap.channel),lightMapUv:nt&&g(v.lightMap.channel),bumpMapUv:ze&&g(v.bumpMap.channel),normalMapUv:ot&&g(v.normalMap.channel),displacementMapUv:xt&&g(v.displacementMap.channel),emissiveMapUv:Dt&&g(v.emissiveMap.channel),metalnessMapUv:lt&&g(v.metalnessMap.channel),roughnessMapUv:dt&&g(v.roughnessMap.channel),anisotropyMapUv:X&&g(v.anisotropyMap.channel),clearcoatMapUv:re&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ae&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:be&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:ue&&g(v.sheenRoughnessMap.channel),specularMapUv:le&&g(v.specularMap.channel),specularColorMapUv:ye&&g(v.specularColorMap.channel),specularIntensityMapUv:Re&&g(v.specularIntensityMap.channel),transmissionMapUv:Ie&&g(v.transmissionMap.channel),thicknessMapUv:C&&g(v.thicknessMap.channel),alphaMapUv:K&&g(v.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ot||P),vertexNormals:!!H.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!H.attributes.uv&&(Fe||K),fog:!!U,useFog:v.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||H.attributes.normal===void 0&&ot===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ve,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Te,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ae,decodeVideoTexture:Fe&&v.map.isVideoTexture===!0&&He.getTransfer(v.map.colorSpace)===Qe,decodeVideoTextureEmissive:Dt&&v.emissiveMap.isVideoTexture===!0&&He.getTransfer(v.emissiveMap.colorSpace)===Qe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===xn,flipSided:v.side===Nt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ee&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ee&&v.extensions.multiDraw===!0||ge)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Me.vertexUv1s=l.has(1),Me.vertexUv2s=l.has(2),Me.vertexUv3s=l.has(3),l.clear(),Me}function m(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const D in v.defines)y.push(D),y.push(v.defines[D]);return v.isRawShaderMaterial===!1&&(d(y,v),T(y,v),y.push(i.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function d(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numSunLights),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numSunLightShadows),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function T(v,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function w(v){const y=L[v.type];let D;if(y){const I=on[y];D=fh.clone(I.uniforms)}else D=v.uniforms;return D}function x(v,y){let D=u.get(y);return D!==void 0?++D.usedTimes:(D=new Xp(i,y,v,r),c.push(D),u.set(y,D)),D}function b(v){if(--v.usedTimes===0){const y=c.indexOf(v);c[y]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function S(v){o.remove(v)}function A(){o.dispose()}return{getParameters:M,getProgramCacheKey:m,getUniforms:w,acquireProgram:x,releaseProgram:b,releaseShaderCache:S,programs:c,dispose:A}}function Jp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function Qp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Sl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ml(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h){let L=0;return h.isInstancedMesh&&(L+=2),h.isSkinnedMesh&&(L+=1),L}function o(h,L,g,M,m,d){let T=i[e];return T===void 0?(T={id:h.id,object:h,geometry:L,material:g,materialVariant:a(h),groupOrder:M,renderOrder:h.renderOrder,z:m,group:d},i[e]=T):(T.id=h.id,T.object=h,T.geometry=L,T.material=g,T.materialVariant=a(h),T.groupOrder=M,T.renderOrder=h.renderOrder,T.z=m,T.group=d),e++,T}function l(h,L,g,M,m,d,T){T.reversedDepth===!0&&(m=-m);const w=o(h,L,g,M,m,d);g.transmission>0?n.push(w):g.transparent===!0?r.push(w):t.push(w)}function c(h,L,g,M,m,d){const T=o(h,L,g,M,m,d);g.transmission>0?n.unshift(T):g.transparent===!0?r.unshift(T):t.unshift(T)}function u(h,L){t.length>1&&t.sort(h||Qp),n.length>1&&n.sort(L||Sl),r.length>1&&r.sort(L||Sl)}function f(){for(let h=e,L=i.length;h<L;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function jp(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Ml,i.set(n,[a])):r>=s.length?(a=new Ml,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function em(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new k,color:new $e};break;case"SpotLight":t={position:new k,direction:new k,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function tm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let nm=0;function im(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function rm(i){const e=new em,t=tm(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new k);const r=new k,s=new mt,a=new mt;function o(c){let u=0,f=0,h=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let L=0,g=0,M=0,m=0,d=0,T=0,w=0,x=0,b=0,S=0,A=0,v=0,y=0,D=0;c.sort(im);for(let z=0,V=c.length;z<V;z++){const U=c[z],H=U.color,J=U.intensity,W=U.distance;let ne=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===ii?ne=U.shadow.map.texture:ne=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=H.r*J,f+=H.g*J,h+=H.b*J;else if(U.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(U.sh.coefficients[q],J);D++}else if(U.isSunLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const j=U.shadow,te=t.get(U);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=te,n.sunShadowMap[g]=ne;const we=j.getViewportCount();for(let Te=0;Te<we;Te++)n.sunShadowMatrix[M+Te]=j.getMatrix(Te),n.sunShadowCascade[M+Te]=j._cascadeData[Te];M+=we,g++}n.sun[L]=q,L++}else if(U.isDirectionalLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const j=U.shadow,te=t.get(U);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,n.directionalShadow[m]=te,n.directionalShadowMap[m]=ne,n.directionalShadowMatrix[m]=U.shadow.matrix,b++}n.directional[m]=q,m++}else if(U.isSpotLight){const q=e.get(U);q.position.setFromMatrixPosition(U.matrixWorld),q.color.copy(H).multiplyScalar(J),q.distance=W,q.coneCos=Math.cos(U.angle),q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),q.decay=U.decay,n.spot[T]=q;const j=U.shadow;if(U.map&&(n.spotLightMap[v]=U.map,v++,j.updateMatrices(U),U.castShadow&&y++),n.spotLightMatrix[T]=j.matrix,U.castShadow){const te=t.get(U);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,n.spotShadow[T]=te,n.spotShadowMap[T]=ne,A++}T++}else if(U.isRectAreaLight){const q=e.get(U);q.color.copy(H).multiplyScalar(J),q.halfWidth.set(U.width*.5,0,0),q.halfHeight.set(0,U.height*.5,0),n.rectArea[w]=q,w++}else if(U.isPointLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),q.distance=U.distance,q.decay=U.decay,U.castShadow){const j=U.shadow,te=t.get(U);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,te.shadowCameraNear=j.camera.near,te.shadowCameraFar=j.camera.far,n.pointShadow[d]=te,n.pointShadowMap[d]=ne,n.pointShadowMatrix[d]=U.shadow.matrix,S++}n.point[d]=q,d++}else if(U.isHemisphereLight){const q=e.get(U);q.skyColor.copy(U.color).multiplyScalar(J),q.groundColor.copy(U.groundColor).multiplyScalar(J),n.hemi[x]=q,x++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;const I=n.hash;(I.sunLength!==L||I.directionalLength!==m||I.pointLength!==d||I.spotLength!==T||I.rectAreaLength!==w||I.hemiLength!==x||I.numSunShadows!==g||I.numDirectionalShadows!==b||I.numPointShadows!==S||I.numSpotShadows!==A||I.numSpotMaps!==v||I.numLightProbes!==D)&&(n.sun.length=L,n.directional.length=m,n.spot.length=T,n.rectArea.length=w,n.point.length=d,n.hemi.length=x,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+v-y,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=D,I.sunLength=L,I.directionalLength=m,I.pointLength=d,I.spotLength=T,I.rectAreaLength=w,I.hemiLength=x,I.numSunShadows=g,I.numDirectionalShadows=b,I.numPointShadows=S,I.numSpotShadows=A,I.numSpotMaps=v,I.numLightProbes=D,n.version=nm++)}function l(c,u){let f=0,h=0,L=0,g=0,M=0,m=0;const d=u.matrixWorldInverse;for(let T=0,w=c.length;T<w;T++){const x=c[T];if(x.isSunLight){const b=n.sun[f];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(d),f++}else if(x.isDirectionalLight){const b=n.directional[h];b.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(d),h++}else if(x.isSpotLight){const b=n.spot[g];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(d),b.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(d),g++}else if(x.isRectAreaLight){const b=n.rectArea[M];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(d),a.identity(),s.copy(x.matrixWorld),s.premultiply(d),a.extractRotation(s),b.halfWidth.set(x.width*.5,0,0),b.halfHeight.set(0,x.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),M++}else if(x.isPointLight){const b=n.point[L];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(d),L++}else if(x.isHemisphereLight){const b=n.hemi[m];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(d),m++}}}return{setup:o,setupView:l,state:n}}function El(i){const e=new rm(i),t=[],n=[],r=[];function s(h){f.camera=h,t.length=0,n.length=0,r.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function sm(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new El(i),e.set(r,[o])):s>=a.length?(o=new El(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const am=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,om=`uniform sampler2D shadow_pass;
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
}`,lm=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)],cm=[new k(0,-1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1),new k(0,-1,0),new k(0,-1,0)],bl=new mt,ki=new k,Ws=new k;function hm(i,e,t){let n=new d0;const r=new Ve,s=new Ve,a=new at,o=new gh,l=new _h,c={},u=t.maxTextureSize,f={[ti]:Nt,[Nt]:ti,[xn]:xn},h=new en({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:am,fragmentShader:om}),L=h.clone();L.defines.HORIZONTAL_PASS=1;const g=new Cn;g.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new fn(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fr;let d=this.type;this.render=function(S,A,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===rc&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Fr);const y=i.getRenderTarget(),D=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(bn),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const V=d!==this.type;V&&A.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(H=>H.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,H=S.length;U<H;U++){const J=S[U],W=J.shadow;if(W===void 0){Ce("WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const ne=W.getFrameExtents();r.multiply(ne),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ne.x),r.x=s.x*ne.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ne.y),r.y=s.y*ne.y,W.mapSize.y=s.y));const q=i.state.buffers.depth.getReversed();if(W.camera._reversedDepth=q,W.map===null||V===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===Wi){if(J.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new jt(r.x,r.y,{format:ii,type:dn,minFilter:Et,magFilter:Et,generateMipmaps:!1}),W.map.texture.name=J.name+".shadowMap",W.map.depthTexture=new tr(r.x,r.y,ln),W.map.depthTexture.name=J.name+".shadowMapDepth",W.map.depthTexture.format=Rn,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Mt,W.map.depthTexture.magFilter=Mt}else J.isPointLight?(W.map=new v0(r.x),W.map.depthTexture=new uh(r.x,un)):(W.map=new jt(r.x,r.y),W.map.depthTexture=new tr(r.x,r.y,un)),W.map.depthTexture.name=J.name+".shadowMap",W.map.depthTexture.format=Rn,this.type===Fr?(W.map.depthTexture.compareFunction=q?eo:ja,W.map.depthTexture.minFilter=Et,W.map.depthTexture.magFilter=Et):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Mt,W.map.depthTexture.magFilter=Mt);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==r.x||W.map.height!==r.y)&&W.map.setSize(r.x,r.y);const j=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();J.isPointLight!==!0&&W.updateMatrices(J,v);for(let te=0;te<j;te++){const we=W.getCamera(te);if(J.isPointLight){const Te=W.camera,tt=W.matrix,Ge=J.distance||Te.far;Ge!==Te.far&&(Te.far=Ge,Te.updateProjectionMatrix()),ki.setFromMatrixPosition(J.matrixWorld),Te.position.copy(ki),Ws.copy(Te.position),Ws.add(lm[te]),Te.up.copy(cm[te]),Te.lookAt(Ws),Te.updateMatrixWorld(),tt.makeTranslation(-ki.x,-ki.y,-ki.z),bl.multiplyMatrices(Te.projectionMatrix,Te.matrixWorldInverse),W._frustum.setFromProjectionMatrix(bl,Te.coordinateSystem,Te.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)i.setRenderTarget(W.map,te),i.clear();else{te===0&&(i.setRenderTarget(W.map),i.clear());const Te=W.getViewport(te);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),z.viewport(a)}n=W.getFrustum(te),x(A,v,we,J,this.type)}W.isPointLightShadow!==!0&&this.type===Wi&&T(W,v),W.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(y,D,I)};function T(S,A){const v=e.update(M);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,L.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,L.needsUpdate=!0),S.mapPass===null?S.mapPass=new jt(r.x,r.y,{format:ii,type:dn}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),h.uniforms.shadow_pass.value=S.map.depthTexture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,v,h,M,null),L.uniforms.shadow_pass.value=S.mapPass.texture,L.uniforms.resolution.value.set(S.map.width,S.map.height),L.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,v,L,M,null)}function w(S,A,v,y){let D=null;const I=v.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)D=I;else if(D=v.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const z=D.uuid,V=A.uuid;let U=c[z];U===void 0&&(U={},c[z]=U);let H=U[V];H===void 0&&(H=D.clone(),U[V]=H,A.addEventListener("dispose",b)),D=H}if(D.visible=A.visible,D.wireframe=A.wireframe,y===Wi?D.side=A.shadowSide!==null?A.shadowSide:A.side:D.side=A.shadowSide!==null?A.shadowSide:f[A.side],D.alphaMap=A.alphaMap,D.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,D.map=A.map,D.clipShadows=A.clipShadows,D.clippingPlanes=A.clippingPlanes,D.clipIntersection=A.clipIntersection,D.displacementMap=A.displacementMap,D.displacementScale=A.displacementScale,D.displacementBias=A.displacementBias,D.wireframeLinewidth=A.wireframeLinewidth,D.linewidth=A.linewidth,v.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const z=i.properties.get(D);z.light=v}return D}function x(S,A,v,y,D){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&D===Wi)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,S.matrixWorld);const V=e.update(S),U=S.material;if(Array.isArray(U)){const H=V.groups;for(let J=0,W=H.length;J<W;J++){const ne=H[J],q=U[ne.materialIndex];if(q&&q.visible){const j=w(S,q,y,D);S.onBeforeShadow(i,S,A,v,V,j,ne),i.renderBufferDirect(v,null,V,j,S,ne),S.onAfterShadow(i,S,A,v,V,j,ne)}}}else if(U.visible){const H=w(S,U,y,D);S.onBeforeShadow(i,S,A,v,V,H,null),i.renderBufferDirect(v,null,V,H,S,null),S.onAfterShadow(i,S,A,v,V,H,null)}}const z=S.children;for(let V=0,U=z.length;V<U;V++)x(z[V],A,v,y,D)}function b(S){S.target.removeEventListener("dispose",b);for(const v in c){const y=c[v],D=S.target.uuid;D in y&&(y[D].dispose(),delete y[D])}}}function um(i,e){function t(){let C=!1;const ce=new at;let K=null;const he=new at(0,0,0,0);return{setMask:function(me){K!==me&&!C&&(i.colorMask(me,me,me,me),K=me)},setLocked:function(me){C=me},setClear:function(me,ee,Ae,Me,it){it===!0&&(me*=Me,ee*=Me,Ae*=Me),ce.set(me,ee,Ae,Me),he.equals(ce)===!1&&(i.clearColor(me,ee,Ae,Me),he.copy(ce))},reset:function(){C=!1,K=null,he.set(-1,0,0,0)}}}function n(){let C=!1,ce=!1,K=null,he=null,me=null;return{setReversed:function(ee){if(ce!==ee){const Ae=e.get("EXT_clip_control");ee?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),ce=ee;const Me=me;me=null,this.setClear(Me)}},getReversed:function(){return ce},setTest:function(ee){ee?Q(i.DEPTH_TEST):ve(i.DEPTH_TEST)},setMask:function(ee){K!==ee&&!C&&(i.depthMask(ee),K=ee)},setFunc:function(ee){if(ce&&(ee=zc[ee]),he!==ee){switch(ee){case Qs:i.depthFunc(i.NEVER);break;case js:i.depthFunc(i.ALWAYS);break;case ea:i.depthFunc(i.LESS);break;case Ji:i.depthFunc(i.LEQUAL);break;case ta:i.depthFunc(i.EQUAL);break;case na:i.depthFunc(i.GEQUAL);break;case ia:i.depthFunc(i.GREATER);break;case ra:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}he=ee}},setLocked:function(ee){C=ee},setClear:function(ee){me!==ee&&(me=ee,ce&&(ee=1-ee),i.clearDepth(ee))},reset:function(){C=!1,K=null,he=null,me=null,ce=!1}}}function r(){let C=!1,ce=null,K=null,he=null,me=null,ee=null,Ae=null,Me=null,it=null;return{setTest:function(Ze){C||(Ze?Q(i.STENCIL_TEST):ve(i.STENCIL_TEST))},setMask:function(Ze){ce!==Ze&&!C&&(i.stencilMask(Ze),ce=Ze)},setFunc:function(Ze,Xt,tn){(K!==Ze||he!==Xt||me!==tn)&&(i.stencilFunc(Ze,Xt,tn),K=Ze,he=Xt,me=tn)},setOp:function(Ze,Xt,tn){(ee!==Ze||Ae!==Xt||Me!==tn)&&(i.stencilOp(Ze,Xt,tn),ee=Ze,Ae=Xt,Me=tn)},setLocked:function(Ze){C=Ze},setClear:function(Ze){it!==Ze&&(i.clearStencil(Ze),it=Ze)},reset:function(){C=!1,ce=null,K=null,he=null,me=null,ee=null,Ae=null,Me=null,it=null}}}const s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},h={},L=new WeakMap,g=[],M=null,m=!1,d=null,T=null,w=null,x=null,b=null,S=null,A=null,v=new $e(0,0,0),y=0,D=!1,I=null,z=null,V=null,U=null,H=null;const J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ne=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=ne>=1):q.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=ne>=2);let j=null,te={};const we=i.getParameter(i.SCISSOR_BOX),Te=i.getParameter(i.VIEWPORT),tt=new at().fromArray(we),Ge=new at().fromArray(Te);function Ye(C,ce,K,he){const me=new Uint8Array(4),ee=i.createTexture();i.bindTexture(C,ee),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<K;Ae++)C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY?i.texImage3D(ce,0,i.RGBA,1,1,he,0,i.RGBA,i.UNSIGNED_BYTE,me):i.texImage2D(ce+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,me);return ee}const Y={};Y[i.TEXTURE_2D]=Ye(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(i.DEPTH_TEST),a.setFunc(Ji),ze(!1),ot(Ro),Q(i.CULL_FACE),Xe(bn);function Q(C){u[C]!==!0&&(i.enable(C),u[C]=!0)}function ve(C){u[C]!==!1&&(i.disable(C),u[C]=!1)}function Pe(C,ce){return h[C]!==ce?(i.bindFramebuffer(C,ce),h[C]=ce,C===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ce),C===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ce),!0):!1}function ge(C,ce){let K=g,he=!1;if(C){K=L.get(ce),K===void 0&&(K=[],L.set(ce,K));const me=C.textures;if(K.length!==me.length||K[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,Ae=me.length;ee<Ae;ee++)K[ee]=i.COLOR_ATTACHMENT0+ee;K.length=me.length,he=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,he=!0);he&&i.drawBuffers(K)}function Fe(C){return M!==C?(i.useProgram(C),M=C,!0):!1}const Lt={[Ti]:i.FUNC_ADD,[ac]:i.FUNC_SUBTRACT,[oc]:i.FUNC_REVERSE_SUBTRACT};Lt[lc]=i.MIN,Lt[cc]=i.MAX;const Oe={[hc]:i.ZERO,[uc]:i.ONE,[dc]:i.SRC_COLOR,[Hl]:i.SRC_ALPHA,[_c]:i.SRC_ALPHA_SATURATE,[Lc]:i.DST_COLOR,[pc]:i.DST_ALPHA,[fc]:i.ONE_MINUS_SRC_COLOR,[kl]:i.ONE_MINUS_SRC_ALPHA,[gc]:i.ONE_MINUS_DST_COLOR,[mc]:i.ONE_MINUS_DST_ALPHA,[vc]:i.CONSTANT_COLOR,[xc]:i.ONE_MINUS_CONSTANT_COLOR,[Sc]:i.CONSTANT_ALPHA,[Mc]:i.ONE_MINUS_CONSTANT_ALPHA};function Xe(C,ce,K,he,me,ee,Ae,Me,it,Ze){if(C===bn){m===!0&&(ve(i.BLEND),m=!1);return}if(m===!1&&(Q(i.BLEND),m=!0),C!==sc){if(C!==d||Ze!==D){if((T!==Ti||b!==Ti)&&(i.blendEquation(i.FUNC_ADD),T=Ti,b=Ti),Ze)switch(C){case qi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFunc(i.ONE,i.ONE);break;case Po:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Do:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qe("WebGLState: Invalid blending: ",C);break}else switch(C){case qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Po:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Do:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",C);break}w=null,x=null,S=null,A=null,v.set(0,0,0),y=0,d=C,D=Ze}return}me=me||ce,ee=ee||K,Ae=Ae||he,(ce!==T||me!==b)&&(i.blendEquationSeparate(Lt[ce],Lt[me]),T=ce,b=me),(K!==w||he!==x||ee!==S||Ae!==A)&&(i.blendFuncSeparate(Oe[K],Oe[he],Oe[ee],Oe[Ae]),w=K,x=he,S=ee,A=Ae),(Me.equals(v)===!1||it!==y)&&(i.blendColor(Me.r,Me.g,Me.b,it),v.copy(Me),y=it),d=C,D=!1}function nt(C,ce){C.side===xn?ve(i.CULL_FACE):Q(i.CULL_FACE);let K=C.side===Nt;ce&&(K=!K),ze(K),C.blending===qi&&C.transparent===!1?Xe(bn):Xe(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),a.setFunc(C.depthFunc),a.setTest(C.depthTest),a.setMask(C.depthWrite),s.setMask(C.colorWrite);const he=C.stencilWrite;o.setTest(he),he&&(o.setMask(C.stencilWriteMask),o.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),o.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),Dt(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function ze(C){I!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),I=C)}function ot(C){C!==nc?(Q(i.CULL_FACE),C!==z&&(C===Ro?i.cullFace(i.BACK):C===ic?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ve(i.CULL_FACE),z=C}function xt(C){C!==V&&(W&&i.lineWidth(C),V=C)}function Dt(C,ce,K){C?(Q(i.POLYGON_OFFSET_FILL),(U!==ce||H!==K)&&(U=ce,H=K,a.getReversed()&&(ce=-ce),i.polygonOffset(ce,K))):ve(i.POLYGON_OFFSET_FILL)}function lt(C){C?Q(i.SCISSOR_TEST):ve(i.SCISSOR_TEST)}function dt(C){C===void 0&&(C=i.TEXTURE0+J-1),j!==C&&(i.activeTexture(C),j=C)}function P(C,ce,K){K===void 0&&(j===null?K=i.TEXTURE0+J-1:K=j);let he=te[K];he===void 0&&(he={type:void 0,texture:void 0},te[K]=he),(he.type!==C||he.texture!==ce)&&(j!==K&&(i.activeTexture(K),j=K),i.bindTexture(C,ce||Y[C]),he.type=C,he.texture=ce)}function yt(){const C=te[j];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function Je(){try{i.compressedTexImage2D(...arguments)}catch(C){qe("WebGLState:",C)}}function E(){try{i.compressedTexImage3D(...arguments)}catch(C){qe("WebGLState:",C)}}function p(){try{i.texSubImage2D(...arguments)}catch(C){qe("WebGLState:",C)}}function N(){try{i.texSubImage3D(...arguments)}catch(C){qe("WebGLState:",C)}}function B(){try{i.compressedTexSubImage2D(...arguments)}catch(C){qe("WebGLState:",C)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(C){qe("WebGLState:",C)}}function re(){try{i.texStorage2D(...arguments)}catch(C){qe("WebGLState:",C)}}function ae(){try{i.texStorage3D(...arguments)}catch(C){qe("WebGLState:",C)}}function Z(){try{i.texImage2D(...arguments)}catch(C){qe("WebGLState:",C)}}function $(){try{i.texImage3D(...arguments)}catch(C){qe("WebGLState:",C)}}function oe(C){return f[C]!==void 0?f[C]:i.getParameter(C)}function be(C,ce){f[C]!==ce&&(i.pixelStorei(C,ce),f[C]=ce)}function ue(C){tt.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),tt.copy(C))}function le(C){Ge.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),Ge.copy(C))}function ye(C,ce){let K=c.get(ce);K===void 0&&(K=new WeakMap,c.set(ce,K));let he=K.get(C);he===void 0&&(he=i.getUniformBlockIndex(ce,C.name),K.set(C,he))}function Re(C,ce){const he=c.get(ce).get(C);l.get(ce)!==he&&(i.uniformBlockBinding(ce,he,C.__bindingPointIndex),l.set(ce,he))}function Ie(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},j=null,te={},h={},L=new WeakMap,g=[],M=null,m=!1,d=null,T=null,w=null,x=null,b=null,S=null,A=null,v=new $e(0,0,0),y=0,D=!1,I=null,z=null,V=null,U=null,H=null,tt.set(0,0,i.canvas.width,i.canvas.height),Ge.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Q,disable:ve,bindFramebuffer:Pe,drawBuffers:ge,useProgram:Fe,setBlending:Xe,setMaterial:nt,setFlipSided:ze,setCullFace:ot,setLineWidth:xt,setPolygonOffset:Dt,setScissorTest:lt,activeTexture:dt,bindTexture:P,unbindTexture:yt,compressedTexImage2D:Je,compressedTexImage3D:E,texImage2D:Z,texImage3D:$,pixelStorei:be,getParameter:oe,updateUBOMapping:ye,uniformBlockBinding:Re,texStorage2D:re,texStorage3D:ae,texSubImage2D:p,texSubImage3D:N,compressedTexSubImage2D:B,compressedTexSubImage3D:X,scissor:ue,viewport:le,reset:Ie}}function dm(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,u=new WeakMap,f=new Set;let h;const L=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(E,p){return g?new OffscreenCanvas(E,p):er("canvas")}function m(E,p,N){let B=1;const X=Je(E);if((X.width>N||X.height>N)&&(B=N/Math.max(X.width,X.height)),B<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const re=Math.floor(B*X.width),ae=Math.floor(B*X.height);h===void 0&&(h=M(re,ae));const Z=p?M(re,ae):h;return Z.width=re,Z.height=ae,Z.getContext("2d").drawImage(E,0,0,re,ae),Ce("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+re+"x"+ae+")."),Z}else return"data"in E&&Ce("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),E;return E}function d(E){return E.generateMipmaps}function T(E){i.generateMipmap(E)}function w(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(E,p,N,B,X,re=!1){if(E!==null){if(i[E]!==void 0)return i[E];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ae;B&&(ae=e.get("EXT_texture_norm16"),ae||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=p;if(p===i.RED&&(N===i.FLOAT&&(Z=i.R32F),N===i.HALF_FLOAT&&(Z=i.R16F),N===i.UNSIGNED_BYTE&&(Z=i.R8),N===i.UNSIGNED_SHORT&&ae&&(Z=ae.R16_EXT),N===i.SHORT&&ae&&(Z=ae.R16_SNORM_EXT)),p===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.R8UI),N===i.UNSIGNED_SHORT&&(Z=i.R16UI),N===i.UNSIGNED_INT&&(Z=i.R32UI),N===i.BYTE&&(Z=i.R8I),N===i.SHORT&&(Z=i.R16I),N===i.INT&&(Z=i.R32I)),p===i.RG&&(N===i.FLOAT&&(Z=i.RG32F),N===i.HALF_FLOAT&&(Z=i.RG16F),N===i.UNSIGNED_BYTE&&(Z=i.RG8),N===i.UNSIGNED_SHORT&&ae&&(Z=ae.RG16_EXT),N===i.SHORT&&ae&&(Z=ae.RG16_SNORM_EXT)),p===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RG8UI),N===i.UNSIGNED_SHORT&&(Z=i.RG16UI),N===i.UNSIGNED_INT&&(Z=i.RG32UI),N===i.BYTE&&(Z=i.RG8I),N===i.SHORT&&(Z=i.RG16I),N===i.INT&&(Z=i.RG32I)),p===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),N===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),N===i.UNSIGNED_INT&&(Z=i.RGB32UI),N===i.BYTE&&(Z=i.RGB8I),N===i.SHORT&&(Z=i.RGB16I),N===i.INT&&(Z=i.RGB32I)),p===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),N===i.UNSIGNED_INT&&(Z=i.RGBA32UI),N===i.BYTE&&(Z=i.RGBA8I),N===i.SHORT&&(Z=i.RGBA16I),N===i.INT&&(Z=i.RGBA32I)),p===i.RGB&&(N===i.UNSIGNED_SHORT&&ae&&(Z=ae.RGB16_EXT),N===i.SHORT&&ae&&(Z=ae.RGB16_SNORM_EXT),N===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),p===i.RGBA){const $=re?Zr:He.getTransfer(X);N===i.FLOAT&&(Z=i.RGBA32F),N===i.HALF_FLOAT&&(Z=i.RGBA16F),N===i.UNSIGNED_BYTE&&(Z=$===Qe?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT&&ae&&(Z=ae.RGBA16_EXT),N===i.SHORT&&ae&&(Z=ae.RGBA16_SNORM_EXT),N===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function b(E,p){let N;return E?p===null||p===un||p===ji?N=i.DEPTH24_STENCIL8:p===ln?N=i.DEPTH32F_STENCIL8:p===Qi&&(N=i.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):p===null||p===un||p===ji?N=i.DEPTH_COMPONENT24:p===ln?N=i.DEPTH_COMPONENT32F:p===Qi&&(N=i.DEPTH_COMPONENT16),N}function S(E,p){return d(E)===!0||E.isFramebufferTexture&&E.minFilter!==Mt&&E.minFilter!==Et?Math.log2(Math.max(p.width,p.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?p.mipmaps.length:1}function A(E){const p=E.target;p.removeEventListener("dispose",A),y(p),p.isVideoTexture&&u.delete(p),p.isHTMLTexture&&f.delete(p)}function v(E){const p=E.target;p.removeEventListener("dispose",v),I(p)}function y(E){const p=n.get(E);if(p.__webglInit===void 0)return;const N=E.source,B=L.get(N);if(B){const X=B[p.__cacheKey];X.usedTimes--,X.usedTimes===0&&D(E),Object.keys(B).length===0&&L.delete(N)}n.remove(E)}function D(E){const p=n.get(E);i.deleteTexture(p.__webglTexture);const N=E.source,B=L.get(N);delete B[p.__cacheKey],a.memory.textures--}function I(E){const p=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let B=0;B<6;B++){if(Array.isArray(p.__webglFramebuffer[B]))for(let X=0;X<p.__webglFramebuffer[B].length;X++)i.deleteFramebuffer(p.__webglFramebuffer[B][X]);else i.deleteFramebuffer(p.__webglFramebuffer[B]);p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer[B])}else{if(Array.isArray(p.__webglFramebuffer))for(let B=0;B<p.__webglFramebuffer.length;B++)i.deleteFramebuffer(p.__webglFramebuffer[B]);else i.deleteFramebuffer(p.__webglFramebuffer);if(p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer),p.__webglMultisampledFramebuffer&&i.deleteFramebuffer(p.__webglMultisampledFramebuffer),p.__webglColorRenderbuffer)for(let B=0;B<p.__webglColorRenderbuffer.length;B++)p.__webglColorRenderbuffer[B]&&i.deleteRenderbuffer(p.__webglColorRenderbuffer[B]);p.__webglDepthRenderbuffer&&i.deleteRenderbuffer(p.__webglDepthRenderbuffer)}const N=E.textures;for(let B=0,X=N.length;B<X;B++){const re=n.get(N[B]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(N[B])}n.remove(E)}let z=0;function V(){z=0}function U(){return z}function H(E){z=E}function J(){const E=z;return E>=r.maxTextures&&Ce("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+r.maxTextures),z+=1,E}function W(E){const p=[];return p.push(E.wrapS),p.push(E.wrapT),p.push(E.wrapR||0),p.push(E.magFilter),p.push(E.minFilter),p.push(E.anisotropy),p.push(E.internalFormat),p.push(E.format),p.push(E.type),p.push(E.generateMipmaps),p.push(E.premultiplyAlpha),p.push(E.flipY),p.push(E.unpackAlignment),p.push(E.colorSpace),p.join()}function ne(E,p){const N=n.get(E);if(E.isVideoTexture&&P(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&N.__version!==E.version){const B=E.image;if(B===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(B.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{ve(N,E,p);return}}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+p)}function q(E,p){const N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){ve(N,E,p);return}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+p)}function j(E,p){const N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){ve(N,E,p);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+p)}function te(E,p){const N=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&N.__version!==E.version){Pe(N,E,p);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+p)}const we={[Wr]:i.REPEAT,[Mn]:i.CLAMP_TO_EDGE,[sa]:i.MIRRORED_REPEAT},Te={[Mt]:i.NEAREST,[yc]:i.NEAREST_MIPMAP_NEAREST,[hr]:i.NEAREST_MIPMAP_LINEAR,[Et]:i.LINEAR,[ps]:i.LINEAR_MIPMAP_NEAREST,[En]:i.LINEAR_MIPMAP_LINEAR},tt={[Rc]:i.NEVER,[Uc]:i.ALWAYS,[Cc]:i.LESS,[ja]:i.LEQUAL,[Pc]:i.EQUAL,[eo]:i.GEQUAL,[Dc]:i.GREATER,[Ic]:i.NOTEQUAL};function Ge(E,p){if(p.type===ln&&e.has("OES_texture_float_linear")===!1&&(p.magFilter===Et||p.magFilter===ps||p.magFilter===hr||p.magFilter===En||p.minFilter===Et||p.minFilter===ps||p.minFilter===hr||p.minFilter===En)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,we[p.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,we[p.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,we[p.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,Te[p.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,Te[p.minFilter]),p.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,tt[p.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(p.magFilter===Mt||p.minFilter!==hr&&p.minFilter!==En||p.type===ln&&e.has("OES_texture_float_linear")===!1)return;if(p.anisotropy>1||n.get(p).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(p.anisotropy,r.getMaxAnisotropy())),n.get(p).__currentAnisotropy=p.anisotropy}}}function Ye(E,p){let N=!1;E.__webglInit===void 0&&(E.__webglInit=!0,p.addEventListener("dispose",A));const B=p.source;let X=L.get(B);X===void 0&&(X={},L.set(B,X));const re=W(p);if(re!==E.__cacheKey){X[re]===void 0&&(X[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),X[re].usedTimes++;const ae=X[E.__cacheKey];ae!==void 0&&(X[E.__cacheKey].usedTimes--,ae.usedTimes===0&&D(p)),E.__cacheKey=re,E.__webglTexture=X[re].texture}return N}function Y(E,p,N){return Math.floor(Math.floor(E/N)/p)}function Q(E,p,N,B){const re=E.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,p.width,p.height,N,B,p.data);else{re.sort((be,ue)=>be.start-ue.start);let ae=0;for(let be=1;be<re.length;be++){const ue=re[ae],le=re[be],ye=ue.start+ue.count,Re=Y(le.start,p.width,4),Ie=Y(ue.start,p.width,4);le.start<=ye+1&&Re===Ie&&Y(le.start+le.count-1,p.width,4)===Re?ue.count=Math.max(ue.count,le.start+le.count-ue.start):(++ae,re[ae]=le)}re.length=ae+1;const Z=t.getParameter(i.UNPACK_ROW_LENGTH),$=t.getParameter(i.UNPACK_SKIP_PIXELS),oe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,p.width);for(let be=0,ue=re.length;be<ue;be++){const le=re[be],ye=Math.floor(le.start/4),Re=Math.ceil(le.count/4),Ie=ye%p.width,C=Math.floor(ye/p.width),ce=Re,K=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,C),t.texSubImage2D(i.TEXTURE_2D,0,Ie,C,ce,K,N,B,p.data)}E.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,$),t.pixelStorei(i.UNPACK_SKIP_ROWS,oe)}}function ve(E,p,N){let B=i.TEXTURE_2D;(p.isDataArrayTexture||p.isCompressedArrayTexture)&&(B=i.TEXTURE_2D_ARRAY),p.isData3DTexture&&(B=i.TEXTURE_3D);const X=Ye(E,p),re=p.source;t.bindTexture(B,E.__webglTexture,i.TEXTURE0+N);const ae=n.get(re);if(re.version!==ae.__version||X===!0){if(t.activeTexture(i.TEXTURE0+N),(typeof ImageBitmap<"u"&&p.image instanceof ImageBitmap)===!1){const K=He.getPrimaries(He.workingColorSpace),he=p.colorSpace===Sn?null:He.getPrimaries(p.colorSpace),me=p.colorSpace===Sn||K===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}t.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment);let $=m(p.image,!1,r.maxTextureSize);$=yt(p,$);const oe=s.convert(p.format,p.colorSpace),be=s.convert(p.type);let ue=x(p.internalFormat,oe,be,p.normalized,p.colorSpace,p.isVideoTexture);Ge(B,p);let le;const ye=p.mipmaps,Re=p.isVideoTexture!==!0,Ie=ae.__version===void 0||X===!0,C=re.dataReady,ce=S(p,$);if(p.isDepthTexture)ue=b(p.format===jn,p.type),Ie&&(Re?t.texStorage2D(i.TEXTURE_2D,1,ue,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,ue,$.width,$.height,0,oe,be,null));else if(p.isDataTexture)if(ye.length>0){Re&&Ie&&t.texStorage2D(i.TEXTURE_2D,ce,ue,ye[0].width,ye[0].height);for(let K=0,he=ye.length;K<he;K++)le=ye[K],Re?C&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,le.width,le.height,oe,be,le.data):t.texImage2D(i.TEXTURE_2D,K,ue,le.width,le.height,0,oe,be,le.data);p.generateMipmaps=!1}else Re?(Ie&&t.texStorage2D(i.TEXTURE_2D,ce,ue,$.width,$.height),C&&Q(p,$,oe,be)):t.texImage2D(i.TEXTURE_2D,0,ue,$.width,$.height,0,oe,be,$.data);else if(p.isCompressedTexture)if(p.isCompressedArrayTexture){Re&&Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,ue,ye[0].width,ye[0].height,$.depth);for(let K=0,he=ye.length;K<he;K++)if(le=ye[K],p.format!==Qt)if(oe!==null)if(Re){if(C)if(p.layerUpdates.size>0){const me=nl(le.width,le.height,p.format,p.type);for(const ee of p.layerUpdates){const Ae=le.data.subarray(ee*me/le.data.BYTES_PER_ELEMENT,(ee+1)*me/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,ee,le.width,le.height,1,oe,Ae)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,le.width,le.height,$.depth,oe,le.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,ue,le.width,le.height,$.depth,0,le.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Re?C&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,le.width,le.height,$.depth,oe,be,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,K,ue,le.width,le.height,$.depth,0,oe,be,le.data);p.layerUpdates.size>0&&p.clearLayerUpdates()}else{Re&&Ie&&t.texStorage2D(i.TEXTURE_2D,ce,ue,ye[0].width,ye[0].height);for(let K=0,he=ye.length;K<he;K++)le=ye[K],p.format!==Qt?oe!==null?Re?C&&t.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,le.width,le.height,oe,le.data):t.compressedTexImage2D(i.TEXTURE_2D,K,ue,le.width,le.height,0,le.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Re?C&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,le.width,le.height,oe,be,le.data):t.texImage2D(i.TEXTURE_2D,K,ue,le.width,le.height,0,oe,be,le.data)}else if(p.isDataArrayTexture)if(Re){if(Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,ue,$.width,$.height,$.depth),C)if(p.layerUpdates.size>0){const K=nl($.width,$.height,p.format,p.type);for(const he of p.layerUpdates){const me=$.data.subarray(he*K/$.data.BYTES_PER_ELEMENT,(he+1)*K/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,$.width,$.height,1,oe,be,me)}p.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,oe,be,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ue,$.width,$.height,$.depth,0,oe,be,$.data);else if(p.isData3DTexture)Re?(Ie&&t.texStorage3D(i.TEXTURE_3D,ce,ue,$.width,$.height,$.depth),C&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,oe,be,$.data)):t.texImage3D(i.TEXTURE_3D,0,ue,$.width,$.height,$.depth,0,oe,be,$.data);else if(p.isFramebufferTexture){if(Ie)if(Re)t.texStorage2D(i.TEXTURE_2D,ce,ue,$.width,$.height);else{let K=$.width,he=$.height;for(let me=0;me<ce;me++)t.texImage2D(i.TEXTURE_2D,me,ue,K,he,0,oe,be,null),K>>=1,he>>=1}}else if(p.isHTMLTexture){if("texElementImage2D"in i){const K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),$.parentNode!==K){K.appendChild($),f.add(p),K.onpaint=he=>{const me=he.changedElements;for(const ee of f)me.includes(ee.image)&&(ee.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,$);else{const me=i.RGBA,ee=i.RGBA,Ae=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,me,ee,Ae,$)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ye.length>0){if(Re&&Ie){const K=Je(ye[0]);t.texStorage2D(i.TEXTURE_2D,ce,ue,K.width,K.height)}for(let K=0,he=ye.length;K<he;K++)le=ye[K],Re?C&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,oe,be,le):t.texImage2D(i.TEXTURE_2D,K,ue,oe,be,le);p.generateMipmaps=!1}else if(Re){if(Ie){const K=Je($);t.texStorage2D(i.TEXTURE_2D,ce,ue,K.width,K.height)}C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,oe,be,$)}else t.texImage2D(i.TEXTURE_2D,0,ue,oe,be,$);d(p)&&T(B),ae.__version=re.version,p.onUpdate&&p.onUpdate(p)}E.__version=p.version}function Pe(E,p,N){if(p.image.length!==6)return;const B=Ye(E,p),X=p.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+N);const re=n.get(X);if(X.version!==re.__version||B===!0){t.activeTexture(i.TEXTURE0+N);const ae=He.getPrimaries(He.workingColorSpace),Z=p.colorSpace===Sn?null:He.getPrimaries(p.colorSpace),$=p.colorSpace===Sn||ae===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);const oe=p.isCompressedTexture||p.image[0].isCompressedTexture,be=p.image[0]&&p.image[0].isDataTexture,ue=[];for(let ee=0;ee<6;ee++)!oe&&!be?ue[ee]=m(p.image[ee],!0,r.maxCubemapSize):ue[ee]=be?p.image[ee].image:p.image[ee],ue[ee]=yt(p,ue[ee]);const le=ue[0],ye=s.convert(p.format,p.colorSpace),Re=s.convert(p.type),Ie=x(p.internalFormat,ye,Re,p.normalized,p.colorSpace),C=p.isVideoTexture!==!0,ce=re.__version===void 0||B===!0,K=X.dataReady;let he=S(p,le);Ge(i.TEXTURE_CUBE_MAP,p);let me;if(oe){C&&ce&&t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Ie,le.width,le.height);for(let ee=0;ee<6;ee++){me=ue[ee].mipmaps;for(let Ae=0;Ae<me.length;Ae++){const Me=me[Ae];p.format!==Qt?ye!==null?C?K&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Me.width,Me.height,ye,Me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Ie,Me.width,Me.height,0,Me.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Me.width,Me.height,ye,Re,Me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Ie,Me.width,Me.height,0,ye,Re,Me.data)}}}else{if(me=p.mipmaps,C&&ce){me.length>0&&he++;const ee=Je(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Ie,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(be){C?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ue[ee].width,ue[ee].height,ye,Re,ue[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ie,ue[ee].width,ue[ee].height,0,ye,Re,ue[ee].data);for(let Ae=0;Ae<me.length;Ae++){const it=me[Ae].image[ee].image;C?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,it.width,it.height,ye,Re,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Ie,it.width,it.height,0,ye,Re,it.data)}}else{C?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ye,Re,ue[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ie,ye,Re,ue[ee]);for(let Ae=0;Ae<me.length;Ae++){const Me=me[Ae];C?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,ye,Re,Me.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Ie,ye,Re,Me.image[ee])}}}d(p)&&T(i.TEXTURE_CUBE_MAP),re.__version=X.version,p.onUpdate&&p.onUpdate(p)}E.__version=p.version}function ge(E,p,N,B,X,re){const ae=s.convert(N.format,N.colorSpace),Z=s.convert(N.type),$=x(N.internalFormat,ae,Z,N.normalized,N.colorSpace),oe=n.get(p),be=n.get(N);if(be.__renderTarget=p,!oe.__hasExternalTextures){const ue=Math.max(1,p.width>>re),le=Math.max(1,p.height>>re);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?t.texImage3D(X,re,$,ue,le,p.depth,0,ae,Z,null):t.texImage2D(X,re,$,ue,le,0,ae,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),dt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,B,X,be.__webglTexture,0,lt(p)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,B,X,be.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Fe(E,p,N){if(i.bindRenderbuffer(i.RENDERBUFFER,E),p.depthBuffer){const B=p.depthTexture,X=B&&B.isDepthTexture?B.type:null,re=b(p.stencilBuffer,X),ae=p.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;dt(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt(p),re,p.width,p.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt(p),re,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,re,p.width,p.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ae,i.RENDERBUFFER,E)}else{const B=p.textures;for(let X=0;X<B.length;X++){const re=B[X],ae=s.convert(re.format,re.colorSpace),Z=s.convert(re.type),$=x(re.internalFormat,ae,Z,re.normalized,re.colorSpace);dt(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt(p),$,p.width,p.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt(p),$,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,$,p.width,p.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Lt(E,p,N){const B=p.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(p.depthTexture&&p.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const X=n.get(p.depthTexture);if(X.__renderTarget=p,(!X.__webglTexture||p.depthTexture.image.width!==p.width||p.depthTexture.image.height!==p.height)&&(p.depthTexture.image.width=p.width,p.depthTexture.image.height=p.height,p.depthTexture.needsUpdate=!0),B){if(X.__webglInit===void 0&&(X.__webglInit=!0,p.depthTexture.addEventListener("dispose",A)),X.__webglTexture===void 0){X.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,p.depthTexture);const oe=s.convert(p.depthTexture.format),be=s.convert(p.depthTexture.type);let ue;p.depthTexture.format===Rn?ue=i.DEPTH_COMPONENT24:p.depthTexture.format===jn&&(ue=i.DEPTH24_STENCIL8);for(let le=0;le<6;le++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,ue,p.width,p.height,0,oe,be,null)}}else ne(p.depthTexture,0);const re=X.__webglTexture,ae=lt(p),Z=B?i.TEXTURE_CUBE_MAP_POSITIVE_X+N:i.TEXTURE_2D,$=p.depthTexture.format===jn?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(p.depthTexture.format===Rn)dt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,re,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,re,0);else if(p.depthTexture.format===jn)dt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,re,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Oe(E){const p=n.get(E),N=E.isWebGLCubeRenderTarget===!0;if(p.__boundDepthTexture!==E.depthTexture){const B=E.depthTexture;if(p.__depthDisposeCallback&&p.__depthDisposeCallback(),B){const X=()=>{delete p.__boundDepthTexture,delete p.__depthDisposeCallback,B.removeEventListener("dispose",X)};B.addEventListener("dispose",X),p.__depthDisposeCallback=X}p.__boundDepthTexture=B}if(E.depthTexture&&!p.__autoAllocateDepthBuffer)if(N)for(let B=0;B<6;B++)Lt(p.__webglFramebuffer[B],E,B);else{const B=E.texture.mipmaps;B&&B.length>0?Lt(p.__webglFramebuffer[0],E,0):Lt(p.__webglFramebuffer,E,0)}else if(N){p.__webglDepthbuffer=[];for(let B=0;B<6;B++)if(t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[B]),p.__webglDepthbuffer[B]===void 0)p.__webglDepthbuffer[B]=i.createRenderbuffer(),Fe(p.__webglDepthbuffer[B],E,!1);else{const X=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=p.__webglDepthbuffer[B];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,re)}}else{const B=E.texture.mipmaps;if(B&&B.length>0?t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer),p.__webglDepthbuffer===void 0)p.__webglDepthbuffer=i.createRenderbuffer(),Fe(p.__webglDepthbuffer,E,!1);else{const X=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=p.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Xe(E,p,N){const B=n.get(E);p!==void 0&&ge(B.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Oe(E)}function nt(E){const p=E.texture,N=n.get(E),B=n.get(p);E.addEventListener("dispose",v);const X=E.textures,re=E.isWebGLCubeRenderTarget===!0,ae=X.length>1;if(ae||(B.__webglTexture===void 0&&(B.__webglTexture=i.createTexture()),B.__version=p.version,a.memory.textures++),re){N.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(p.mipmaps&&p.mipmaps.length>0){N.__webglFramebuffer[Z]=[];for(let $=0;$<p.mipmaps.length;$++)N.__webglFramebuffer[Z][$]=i.createFramebuffer()}else N.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(p.mipmaps&&p.mipmaps.length>0){N.__webglFramebuffer=[];for(let Z=0;Z<p.mipmaps.length;Z++)N.__webglFramebuffer[Z]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(ae)for(let Z=0,$=X.length;Z<$;Z++){const oe=n.get(X[Z]);oe.__webglTexture===void 0&&(oe.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&dt(E)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let Z=0;Z<X.length;Z++){const $=X[Z];N.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[Z]);const oe=s.convert($.format,$.colorSpace),be=s.convert($.type),ue=x($.internalFormat,oe,be,$.normalized,$.colorSpace,E.isXRRenderTarget===!0),le=lt(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,le,ue,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,N.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),Fe(N.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,p);for(let Z=0;Z<6;Z++)if(p.mipmaps&&p.mipmaps.length>0)for(let $=0;$<p.mipmaps.length;$++)ge(N.__webglFramebuffer[Z][$],E,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,$);else ge(N.__webglFramebuffer[Z],E,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);d(p)&&T(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){for(let Z=0,$=X.length;Z<$;Z++){const oe=X[Z],be=n.get(oe);let ue=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ue=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,be.__webglTexture),Ge(ue,oe),ge(N.__webglFramebuffer,E,oe,i.COLOR_ATTACHMENT0+Z,ue,0),d(oe)&&T(ue)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(Z=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,B.__webglTexture),Ge(Z,p),p.mipmaps&&p.mipmaps.length>0)for(let $=0;$<p.mipmaps.length;$++)ge(N.__webglFramebuffer[$],E,p,i.COLOR_ATTACHMENT0,Z,$);else ge(N.__webglFramebuffer,E,p,i.COLOR_ATTACHMENT0,Z,0);d(p)&&T(Z),t.unbindTexture()}E.depthBuffer&&Oe(E)}function ze(E){const p=E.textures;for(let N=0,B=p.length;N<B;N++){const X=p[N];if(d(X)){const re=w(E),ae=n.get(X).__webglTexture;t.bindTexture(re,ae),T(re),t.unbindTexture()}}}const ot=[],xt=[];function Dt(E){if(E.samples>0){if(dt(E)===!1){const p=E.textures,N=E.width,B=E.height;let X=i.COLOR_BUFFER_BIT;const re=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=n.get(E),Z=p.length>1;if(Z)for(let oe=0;oe<p.length;oe++)t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer);const $=E.texture.mipmaps;$&&$.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let oe=0;oe<p.length;oe++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ae.__webglColorRenderbuffer[oe]);const be=n.get(p[oe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,be,0)}i.blitFramebuffer(0,0,N,B,0,0,N,B,X,i.NEAREST),l===!0&&(ot.length=0,xt.length=0,ot.push(i.COLOR_ATTACHMENT0+oe),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(ot.push(re),xt.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,xt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let oe=0;oe<p.length;oe++){t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,ae.__webglColorRenderbuffer[oe]);const be=n.get(p[oe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.TEXTURE_2D,be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&l){const p=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[p])}}}function lt(E){return Math.min(r.maxSamples,E.samples)}function dt(E){const p=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&p.__useRenderToTexture!==!1}function P(E){const p=a.render.frame;u.get(E)!==p&&(u.set(E,p),E.update())}function yt(E,p){const N=E.colorSpace,B=E.format,X=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||N!==Yr&&N!==Sn&&(He.getTransfer(N)===Qe?(B!==Qt||X!==Wt)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",N)),p}function Je(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=V,this.getTextureUnits=U,this.setTextureUnits=H,this.setTexture2D=ne,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=te,this.rebindTextures=Xe,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=ze,this.updateMultisampleRenderTarget=Dt,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=dt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function fm(i,e){function t(n,r=Sn){let s;const a=He.getTransfer(r);if(n===Wt)return i.UNSIGNED_BYTE;if(n===Za)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ka)return i.UNSIGNED_SHORT_5_5_5_1;if(n===jl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===e0)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Jl)return i.BYTE;if(n===Ql)return i.SHORT;if(n===Qi)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===un)return i.UNSIGNED_INT;if(n===ln)return i.FLOAT;if(n===dn)return i.HALF_FLOAT;if(n===t0)return i.ALPHA;if(n===n0)return i.RGB;if(n===Qt)return i.RGBA;if(n===Rn)return i.DEPTH_COMPONENT;if(n===jn)return i.DEPTH_STENCIL;if(n===i0)return i.RED;if(n===$a)return i.RED_INTEGER;if(n===ii)return i.RG;if(n===Ja)return i.RG_INTEGER;if(n===Qa)return i.RGBA_INTEGER;if(n===Or||n===Br||n===zr||n===Hr)if(a===Qe)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Or)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Br)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Or)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Br)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===aa||n===oa||n===la||n===ca)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===aa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===oa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===la)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ca)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ha||n===ua||n===da||n===fa||n===pa||n===Xr||n===ma)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===ha||n===ua)return a===Qe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===da)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===fa)return s.COMPRESSED_R11_EAC;if(n===pa)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Xr)return s.COMPRESSED_RG11_EAC;if(n===ma)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===La||n===ga||n===_a||n===va||n===xa||n===Sa||n===Ma||n===Ea||n===ba||n===ya||n===Ta||n===Aa||n===wa||n===Ra)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===La)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ga)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_a)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===va)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ma)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ea)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ya)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ta)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ra)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ca||n===Pa||n===Da)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Ca)return a===Qe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Pa)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Da)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ia||n===Ua||n===qr||n===Na)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ia)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ua)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===qr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Na)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const pm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mm=`
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

}`;class Lm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new p0(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new en({vertexShader:pm,fragmentShader:mm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new fn(new or(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gm extends ai{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,L=null,g=null;const M=typeof XRWebGLBinding<"u",m=new Lm,d={},T=t.getContextAttributes();let w=null,x=null;const b=[],S=[],A=new Ve;let v=null,y=null;const D=new $t;D.viewport=new at;const I=new $t;I.viewport=new at;const z=[D,I],V=new bh;let U=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Es,b[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Es,b[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=b[Y];return Q===void 0&&(Q=new Es,b[Y]=Q),Q.getHandSpace()};function J(Y){const Q=S.indexOf(Y.inputSource);if(Q===-1)return;const ve=b[Q];ve!==void 0&&(ve.update(Y.inputSource,Y.frame,c||a),ve.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){r.removeEventListener("select",J),r.removeEventListener("selectstart",J),r.removeEventListener("selectend",J),r.removeEventListener("squeeze",J),r.removeEventListener("squeezestart",J),r.removeEventListener("squeezeend",J),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",ne);for(let Y=0;Y<b.length;Y++){const Q=S[Y];Q!==null&&(S[Y]=null,b[Y].disconnect(Q))}U=null,H=null,m.reset();for(const Y in d)delete d[Y];if(e.setRenderTarget(w),L=null,h=null,f=null,r=null,x=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),y!==null){const Y=y.camera;Y.fov=y.fov,Y.zoom=y.zoom,Y.updateProjectionMatrix(),y=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:L},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",J),r.addEventListener("selectstart",J),r.addEventListener("selectend",J),r.addEventListener("squeeze",J),r.addEventListener("squeezestart",J),r.addEventListener("squeezeend",J),r.addEventListener("end",W),r.addEventListener("inputsourceschange",ne),T.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,Pe=null,ge=null;T.depth&&(ge=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ve=T.stencil?jn:Rn,Pe=T.stencil?ji:un);const Fe={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(Fe),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),x=new jt(h.textureWidth,h.textureHeight,{format:Qt,type:Wt,depthTexture:new tr(h.textureWidth,h.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const ve={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};L=new XRWebGLLayer(r,t,ve),r.updateRenderState({baseLayer:L}),e.setPixelRatio(1),e.setSize(L.framebufferWidth,L.framebufferHeight,!1),x=new jt(L.framebufferWidth,L.framebufferHeight,{format:Qt,type:Wt,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:L.ignoreDepthValues===!1,resolveStencilBuffer:L.ignoreDepthValues===!1,storeMultisampledDepthBuffer:L.ignoreDepthValues===!1,storeMultisampledStencilBuffer:L.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Ye.setContext(r),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ne(Y){for(let Q=0;Q<Y.removed.length;Q++){const ve=Y.removed[Q],Pe=S.indexOf(ve);Pe>=0&&(S[Pe]=null,b[Pe].disconnect(ve))}for(let Q=0;Q<Y.added.length;Q++){const ve=Y.added[Q];let Pe=S.indexOf(ve);if(Pe===-1){for(let Fe=0;Fe<b.length;Fe++)if(Fe>=S.length){S.push(ve),Pe=Fe;break}else if(S[Fe]===null){S[Fe]=ve,Pe=Fe;break}if(Pe===-1)break}const ge=b[Pe];ge&&ge.connect(ve)}}const q=new k,j=new k;function te(Y,Q,ve){q.setFromMatrixPosition(Q.matrixWorld),j.setFromMatrixPosition(ve.matrixWorld);const Pe=q.distanceTo(j),ge=Q.projectionMatrix.elements,Fe=ve.projectionMatrix.elements,Lt=ge[14]/(ge[10]-1),Oe=ge[14]/(ge[10]+1),Xe=(ge[9]+1)/ge[5],nt=(ge[9]-1)/ge[5],ze=(ge[8]-1)/ge[0],ot=(Fe[8]+1)/Fe[0],xt=Lt*ze,Dt=Lt*ot,lt=Pe/(-ze+ot),dt=lt*-ze;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(dt),Y.translateZ(lt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ge[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const P=Lt+lt,yt=Oe+lt,Je=xt-dt,E=Dt+(Pe-dt),p=Xe*Oe/yt*P,N=nt*Oe/yt*P;Y.projectionMatrix.makePerspective(Je,E,p,N,P,yt),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function we(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let Q=Y.near,ve=Y.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(ve=m.depthFar)),V.near=I.near=D.near=Q,V.far=I.far=D.far=ve,(U!==V.near||H!==V.far)&&(r.updateRenderState({depthNear:V.near,depthFar:V.far}),U=V.near,H=V.far),V.layers.mask=Y.layers.mask|6,D.layers.mask=V.layers.mask&-5,I.layers.mask=V.layers.mask&-3;const Pe=Y.parent,ge=V.cameras;we(V,Pe);for(let Fe=0;Fe<ge.length;Fe++)we(ge[Fe],Pe);ge.length===2?te(V,D,I):V.projectionMatrix.copy(D.projectionMatrix),y===null&&Y.isPerspectiveCamera&&(y={camera:Y,fov:Y.fov,zoom:Y.zoom}),Te(Y,V,Pe)};function Te(Y,Q,ve){ve===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(ve.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Fa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&L===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),L!==null&&L.fixedFoveation!==void 0&&(L.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function(Y){return d[Y]};let tt=null;function Ge(Y,Q){if(u=Q.getViewerPose(c||a),g=Q,u!==null){const ve=u.views;L!==null&&(e.setRenderTargetFramebuffer(x,L.framebuffer),e.setRenderTarget(x));let Pe=!1;ve.length!==V.cameras.length&&(V.cameras.length=0,Pe=!0);for(let Oe=0;Oe<ve.length;Oe++){const Xe=ve[Oe];let nt=null;if(L!==null)nt=L.getViewport(Xe);else{const ot=f.getViewSubImage(h,Xe);nt=ot.viewport,Oe===0&&(e.setRenderTargetTextures(x,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(x))}let ze=z[Oe];ze===void 0&&(ze=new $t,ze.layers.enable(Oe),ze.viewport=new at,z[Oe]=ze),ze.matrix.fromArray(Xe.transform.matrix),ze.matrix.decompose(ze.position,ze.quaternion,ze.scale),ze.projectionMatrix.fromArray(Xe.projectionMatrix),ze.projectionMatrixInverse.copy(ze.projectionMatrix).invert(),ze.viewport.set(nt.x,nt.y,nt.width,nt.height),Oe===0&&(V.matrix.copy(ze.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Pe===!0&&V.cameras.push(ze)}const ge=r.enabledFeatures;if(ge&&ge.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){f=n.getBinding();const Oe=f.getDepthInformation(ve[0]);Oe&&Oe.isValid&&Oe.texture&&m.init(Oe,r.renderState)}if(ge&&ge.includes("camera-access")&&M){e.state.unbindTexture(),f=n.getBinding();for(let Oe=0;Oe<ve.length;Oe++){const Xe=ve[Oe].camera;if(Xe){let nt=d[Xe];nt||(nt=new p0,d[Xe]=nt);const ze=f.getCameraImage(Xe);nt.sourceTexture=ze}}}}for(let ve=0;ve<b.length;ve++){const Pe=S[ve],ge=b[ve];Pe!==null&&ge!==void 0&&ge.update(Pe,Q,c||a)}tt&&tt(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Ye=new g0;Ye.setAnimationLoop(Ge),this.setAnimationLoop=function(Y){tt=Y},this.dispose=function(){}}}const _m=new mt,b0=new De;b0.set(-1,0,0,0,1,0,0,0,1);function vm(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,m0(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,T,w,x){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?s(m,d):d.isMeshLambertMaterial?(s(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(s(m,d),h(m,d),d.isMeshPhysicalMaterial&&L(m,d,x)):d.isMeshMatcapMaterial?(s(m,d),g(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),M(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,T,w):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Nt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Nt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const T=e.get(d),w=T.envMap,x=T.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(_m.makeRotationFromEuler(x)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(b0),m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,T,w){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*T,m.scale.value=w*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function L(m,d,T){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Nt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.retroreflectivity>0&&(m.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function M(m,d){const T=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function xm(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,b){const S=b.program;n.uniformBlockBinding(x,S)}function c(x,b){let S=r[x.id];S===void 0&&(m(x),S=u(x),r[x.id]=S,x.addEventListener("dispose",T));const A=b.program;n.updateUBOMapping(x,A);const v=e.render.frame;s[x.id]!==v&&(h(x),s[x.id]=v)}function u(x){const b=f();x.__bindingPointIndex=b;const S=i.createBuffer(),A=x.__size,v=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,A,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,S),S}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const b=r[x.id],S=x.uniforms,A=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let v=0,y=S.length;v<y;v++){const D=S[v];if(Array.isArray(D))for(let I=0,z=D.length;I<z;I++)L(D[I],v,I,A);else L(D,v,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function L(x,b,S,A){if(M(x,b,S,A)===!0){const v=x.__offset,y=x.value;if(Array.isArray(y)){let D=0;for(let I=0;I<y.length;I++){const z=y[I],V=d(z);g(z,x.__data,D),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(D+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(y,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,x.__data)}}function g(x,b,S){typeof x=="number"||typeof x=="boolean"?b[0]=x:x.isMatrix3?(b[0]=x.elements[0],b[1]=x.elements[1],b[2]=x.elements[2],b[3]=0,b[4]=x.elements[3],b[5]=x.elements[4],b[6]=x.elements[5],b[7]=0,b[8]=x.elements[6],b[9]=x.elements[7],b[10]=x.elements[8],b[11]=0):ArrayBuffer.isView(x)?b.set(new x.constructor(x.buffer,x.byteOffset,b.length)):x.toArray(b,S)}function M(x,b,S,A){const v=x.value,y=b+"_"+S;if(A[y]===void 0)return typeof v=="number"||typeof v=="boolean"?A[y]=v:ArrayBuffer.isView(v)?A[y]=v.slice():A[y]=v.clone(),!0;{const D=A[y];if(typeof v=="number"||typeof v=="boolean"){if(D!==v)return A[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(D.equals(v)===!1)return D.copy(v),!0}}return!1}function m(x){const b=x.uniforms;let S=0;const A=16;for(let y=0,D=b.length;y<D;y++){const I=Array.isArray(b[y])?b[y]:[b[y]];for(let z=0,V=I.length;z<V;z++){const U=I[z],H=Array.isArray(U.value)?U.value:[U.value];for(let J=0,W=H.length;J<W;J++){const ne=H[J],q=d(ne),j=S%A,te=j%q.boundary,we=j+te;S+=te,we!==0&&A-we<q.storage&&(S+=A-we),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=S,S+=q.storage}}}const v=S%A;return v>0&&(S+=A-v),x.__size=S,x.__cache={},this}function d(x){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(b.boundary=16,b.storage=x.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",x),b}function T(x){const b=x.target;b.removeEventListener("dispose",T);const S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function w(){for(const x in r)i.deleteBuffer(r[x]);a=[],r={},s={}}return{bind:l,update:c,dispose:w}}const Sm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let sn=null;function Mm(){return sn===null&&(sn=new u0(Sm,16,16,ii,dn),sn.name="DFG_LUT",sn.minFilter=Et,sn.magFilter=Et,sn.wrapS=Mn,sn.wrapT=Mn,sn.generateMipmaps=!1,sn.needsUpdate=!0),sn}class Em{constructor(e={}){const{canvas:t=Oc(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:L=Wt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const M=L,m=new Set([Qa,Ja,$a]),d=new Set([Wt,un,Qi,ji,Za,Ka]),T=new Uint32Array(4),w=new Int32Array(4),x=new k;let b=null,S=null;const A=[],v=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let I=!1,z=null,V=null,U=null,H=null;this._outputColorSpace=Vt;let J=0,W=0,ne=null,q=-1,j=null;const te=new at,we=new at;let Te=null;const tt=new $e(0);let Ge=0,Ye=t.width,Y=t.height,Q=1,ve=null,Pe=null;const ge=new at(0,0,Ye,Y),Fe=new at(0,0,Ye,Y);let Lt=!1;const Oe=new d0;let Xe=!1,nt=!1;const ze=new mt,ot=new k,xt=new at,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let lt=!1;function dt(){return ne===null?Q:1}let P=n;function yt(_,R){return t.getContext(_,R)}let Je,E,p,N,B,X,re,ae,Z,$,oe,be,ue,le,ye,Re,Ie,C,ce,K,he,me,ee;try{const _={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qa}`),t.addEventListener("webglcontextlost",it,!1),t.addEventListener("webglcontextrestored",Ze,!1),t.addEventListener("webglcontextcreationerror",Xt,!1),P===null){const R="webgl2";if(P=yt(R,_),P===null)throw yt(R)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ae()}catch(_){throw t.removeEventListener("webglcontextlost",it,!1),t.removeEventListener("webglcontextrestored",Ze,!1),t.removeEventListener("webglcontextcreationerror",Xt,!1),qe("WebGLRenderer: "+_.message),_}function Ae(){Je=new Mf(P),Je.init(),he=new fm(P,Je),E=new df(P,Je,e,he),p=new um(P,Je),E.reversedDepthBuffer&&h&&p.buffers.depth.setReversed(!0),V=P.createFramebuffer(),U=P.createFramebuffer(),H=P.createFramebuffer(),N=new yf(P),B=new Jp,X=new dm(P,Je,p,B,E,he,N),re=new Sf(D),ae=new Th(P),me=new hf(P,ae),Z=new Ef(P,ae,N,me),$=new Af(P,Z,ae,me,N),C=new Tf(P,E,X),ye=new ff(B),oe=new $p(D,re,Je,E,me,ye),be=new vm(D,B),ue=new jp,le=new sm(Je),Ie=new cf(D,re,p,$,g,l),Re=new hm(D,$,E),ee=new xm(P,N,E,p),ce=new uf(P,Je,N),K=new bf(P,Je,N),N.programs=oe.programs,D.capabilities=E,D.extensions=Je,D.properties=B,D.renderLists=ue,D.shadowMap=Re,D.state=p,D.info=N}M!==Wt&&(y=new Rf(M,t.width,t.height,o,r,s));const Me=new gm(D,P);this.xr=Me,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const _=Je.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){const _=Je.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(_){_!==void 0&&(Q=_,this.setSize(Ye,Y,!1))},this.getSize=function(_){return _.set(Ye,Y)},this.setSize=function(_,R,G=!0){if(Me.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}Ye=_,Y=R,t.width=Math.floor(_*Q),t.height=Math.floor(R*Q),G===!0&&(t.style.width=_+"px",t.style.height=R+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,_,R)},this.getDrawingBufferSize=function(_){return _.set(Ye*Q,Y*Q).floor()},this.setDrawingBufferSize=function(_,R,G){Ye=_,Y=R,Q=G,t.width=Math.floor(_*G),t.height=Math.floor(R*G),this.setViewport(0,0,_,R)},this.setEffects=function(_){if(M===Wt){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(_){for(let R=0;R<_.length;R++)if(_[R].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(_||[])},this.getCurrentViewport=function(_){return _.copy(te)},this.getViewport=function(_){return _.copy(ge)},this.setViewport=function(_,R,G,F){_.isVector4?ge.set(_.x,_.y,_.z,_.w):ge.set(_,R,G,F),p.viewport(te.copy(ge).multiplyScalar(Q).round())},this.getScissor=function(_){return _.copy(Fe)},this.setScissor=function(_,R,G,F){_.isVector4?Fe.set(_.x,_.y,_.z,_.w):Fe.set(_,R,G,F),p.scissor(we.copy(Fe).multiplyScalar(Q).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(_){p.setScissorTest(Lt=_)},this.setOpaqueSort=function(_){ve=_},this.setTransparentSort=function(_){Pe=_},this.getClearColor=function(_){return _.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor(...arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha(...arguments)},this.clear=function(_=!0,R=!0,G=!0){let F=0;if(_){let O=!1;if(ne!==null){const pe=ne.texture.format;O=m.has(pe)}if(O){const pe=ne.texture.type,_e=d.has(pe),fe=Ie.getClearColor(),xe=Ie.getClearAlpha(),Ee=fe.r,Ue=fe.g,Be=fe.b;_e?(T[0]=Ee,T[1]=Ue,T[2]=Be,T[3]=xe,P.clearBufferuiv(P.COLOR,0,T)):(w[0]=Ee,w[1]=Ue,w[2]=Be,w[3]=xe,P.clearBufferiv(P.COLOR,0,w))}else F|=P.COLOR_BUFFER_BIT}R&&(F|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(F|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F!==0&&P.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(_){_.setRenderer(this),z=_},this.dispose=function(){t.removeEventListener("webglcontextlost",it,!1),t.removeEventListener("webglcontextrestored",Ze,!1),t.removeEventListener("webglcontextcreationerror",Xt,!1),Ie.dispose(),ue.dispose(),le.dispose(),B.dispose(),re.dispose(),$.dispose(),me.dispose(),ee.dispose(),oe.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",go),Me.removeEventListener("sessionend",_o),qn.stop()};function it(_){_.preventDefault(),Fo("WebGLRenderer: Context Lost."),I=!0}function Ze(){Fo("WebGLRenderer: Context Restored."),I=!1;const _=N.autoReset,R=Re.enabled,G=Re.autoUpdate,F=Re.needsUpdate,O=Re.type;Ae(),N.autoReset=_,Re.enabled=R,Re.autoUpdate=G,Re.needsUpdate=F,Re.type=O}function Xt(_){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function tn(_){const R=_.target;R.removeEventListener("dispose",tn),B0(R)}function B0(_){z0(_),B.remove(_)}function z0(_){const R=B.get(_).programs;R!==void 0&&(R.forEach(function(G){oe.releaseProgram(G)}),_.isShaderMaterial&&oe.releaseShaderCache(_))}this.renderBufferDirect=function(_,R,G,F,O,pe){R===null&&(R=Dt);const _e=O.isMesh&&O.matrixWorld.determinantAffine()<0,fe=G0(_,R,G,F,O);p.setMaterial(F,_e);let xe=G.index,Ee=1;if(F.wireframe===!0){if(xe=Z.getWireframeAttribute(G),xe===void 0)return;Ee=2}const Ue=G.drawRange,Be=G.attributes.position;let Se=Ue.start*Ee,Ke=(Ue.start+Ue.count)*Ee;pe!==null&&(Se=Math.max(Se,pe.start*Ee),Ke=Math.min(Ke,(pe.start+pe.count)*Ee)),xe!==null?(Se=Math.max(Se,0),Ke=Math.min(Ke,xe.count)):Be!=null&&(Se=Math.max(Se,0),Ke=Math.min(Ke,Be.count));const ft=Ke-Se;if(ft<0||ft===1/0)return;me.setup(O,F,fe,G,xe);let st,et=ce;if(xe!==null&&(st=ae.get(xe),et=K,et.setIndex(st)),O.isMesh)F.wireframe===!0?(p.setLineWidth(F.wireframeLinewidth*dt()),et.setMode(P.LINES)):et.setMode(P.TRIANGLES);else if(O.isLine){let Tt=F.linewidth;Tt===void 0&&(Tt=1),p.setLineWidth(Tt*dt()),O.isLineSegments?et.setMode(P.LINES):O.isLineLoop?et.setMode(P.LINE_LOOP):et.setMode(P.LINE_STRIP)}else O.isPoints?et.setMode(P.POINTS):O.isSprite&&et.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(Je.get("WEBGL_multi_draw"))et.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Tt=O._multiDrawStarts,Le=O._multiDrawCounts,Rt=O._multiDrawCount,We=xe?ae.get(xe).bytesPerElement:1,kt=B.get(F).currentProgram.getUniforms();for(let nn=0;nn<Rt;nn++)kt.setValue(P,"_gl_DrawID",nn),et.render(Tt[nn]/We,Le[nn])}else if(O.isInstancedMesh)et.renderInstances(Se,ft,O.count);else if(G.isInstancedBufferGeometry){const Tt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Le=Math.min(G.instanceCount,Tt);et.renderInstances(Se,ft,Le)}else et.render(Se,ft)};function Lo(_,R,G,F){z!==null&&_.isNodeMaterial&&z.setObject(F,_),Xe===!0&&ye.setState(_,G,!1),_.transparent===!0&&_.side===xn&&_.forceSinglePass===!1?(_.side=Nt,_.needsUpdate=!0,cr(_,R,F),_.side=ti,_.needsUpdate=!0,cr(_,R,F),_.side=xn):cr(_,R,F)}this.compile=function(_,R,G=null){G===null&&(G=_),z!==null&&z.renderStart(_,R,G),S=le.get(G),S.init(R),v.push(S),G.traverseVisible(function(O){O.isLight&&O.layers.test(R.layers)&&(S.pushLight(O),O.castShadow&&S.pushShadow(O))}),_!==G&&_.traverseVisible(function(O){O.isLight&&O.layers.test(R.layers)&&(S.pushLight(O),O.castShadow&&S.pushShadow(O))}),S.setupLights(),z!==null&&z.updateLights(S.state.lightsArray),nt=this.localClippingEnabled,Xe=ye.init(this.clippingPlanes,nt),Xe===!0&&ye.setGlobalState(this.clippingPlanes,R),z!==null&&Re.render(S.state.shadowsArray,G,R);const F=new Set;return _.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const pe=O.material;if(pe)if(Array.isArray(pe))for(let _e=0;_e<pe.length;_e++){const fe=pe[_e];Lo(fe,G,R,O),F.add(fe)}else Lo(pe,G,R,O),F.add(pe)}),S=v.pop(),z!==null&&z.renderEnd(),F},this.compileAsync=function(_,R,G=null){const F=this.compile(_,R,G);return new Promise(O=>{function pe(){if(F.forEach(function(_e){const xe=B.get(_e).currentProgram;(xe===void 0||xe.isReady())&&F.delete(_e)}),F.size===0){O(_);return}setTimeout(pe,10)}Je.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let hs=null;function H0(_){hs&&hs(_)}function go(){qn.stop()}function _o(){qn.start()}const qn=new g0;qn.setAnimationLoop(H0),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(_){hs=_,Me.setAnimationLoop(_),_===null?qn.stop():qn.start()},Me.addEventListener("sessionstart",go),Me.addEventListener("sessionend",_o),this.render=function(_,R){if(R!==void 0&&R.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;z!==null&&z.renderStart(_,R);const G=Me.enabled===!0&&Me.isPresenting===!0,F=y!==null&&(ne===null||G)&&y.begin(D,ne);if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),R.parent===null&&R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(R),R=Me.getCamera()),_.isScene===!0&&_.onBeforeRender(D,_,R,ne),S=le.get(_,v.length),S.init(R),S.state.textureUnits=X.getTextureUnits(),v.push(S),ze.multiplyMatrices(R.projectionMatrix,R.matrixWorldInverse),Oe.setFromProjectionMatrix(ze,cn,R.reversedDepth),nt=this.localClippingEnabled,Xe=ye.init(this.clippingPlanes,nt),b=ue.get(_,A.length),b.init(),A.push(b),Me.enabled===!0&&Me.isPresenting===!0){const _e=D.xr.getDepthSensingMesh();_e!==null&&us(_e,R,-1/0,D.sortObjects)}us(_,R,0,D.sortObjects),b.finish(),z!==null&&z.updateLights(S.state.lightsArray),D.sortObjects===!0&&b.sort(ve,Pe),lt=Me.enabled===!1||Me.isPresenting===!1||Me.hasDepthSensing()===!1,lt&&Ie.addToRenderList(b,_),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Xe===!0&&ye.beginShadows();const O=S.state.shadowsArray;if(Re.render(O,_,R),Xe===!0&&ye.endShadows(),(F&&y.hasRenderPass())===!1){const _e=b.opaque,fe=b.transmissive;if(S.setupLights(),R.isArrayCamera){const xe=R.cameras;if(fe.length>0)for(let Ee=0,Ue=xe.length;Ee<Ue;Ee++){const Be=xe[Ee];xo(_e,fe,_,Be)}lt&&Ie.render(_);for(let Ee=0,Ue=xe.length;Ee<Ue;Ee++){const Be=xe[Ee];vo(b,_,Be,Be.viewport)}}else fe.length>0&&xo(_e,fe,_,R),lt&&Ie.render(_),vo(b,_,R)}ne!==null&&W===0&&(X.updateMultisampleRenderTarget(ne),X.updateRenderTargetMipmap(ne)),F&&y.end(D),_.isScene===!0&&_.onAfterRender(D,_,R),me.resetDefaultState(),q=-1,j=null,v.pop(),v.length>0?(S=v[v.length-1],X.setTextureUnits(S.state.textureUnits),Xe===!0&&ye.setGlobalState(D.clippingPlanes,S.state.camera)):S=null,A.pop(),A.length>0?b=A[A.length-1]:b=null,z!==null&&z.renderEnd()};function us(_,R,G,F){if(_.visible===!1)return;if(_.layers.test(R.layers)){if(_.isGroup)G=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(R);else if(_.isLightProbeGrid)S.pushLightProbeGrid(_);else if(_.isLight)S.pushLight(_),_.castShadow&&S.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||_.intersectsFrustum(Oe)){F&&xt.setFromMatrixPosition(_.matrixWorld).applyMatrix4(ze);const _e=$.update(_),fe=_.material;fe.visible&&b.push(_,_e,fe,G,xt.z,null,R)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||_.intersectsFrustum(Oe))){const _e=$.update(_),fe=_.material;if(F&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),xt.copy(_.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),xt.copy(_e.boundingSphere.center)),xt.applyMatrix4(_.matrixWorld).applyMatrix4(ze)),Array.isArray(fe)){const xe=_e.groups;for(let Ee=0,Ue=xe.length;Ee<Ue;Ee++){const Be=xe[Ee],Se=fe[Be.materialIndex];Se&&Se.visible&&b.push(_,_e,Se,G,xt.z,Be,R)}}else fe.visible&&b.push(_,_e,fe,G,xt.z,null,R)}}const pe=_.children;for(let _e=0,fe=pe.length;_e<fe;_e++)us(pe[_e],R,G,F)}function vo(_,R,G,F){const{opaque:O,transmissive:pe,transparent:_e}=_;S.setupLightsView(G),Xe===!0&&ye.setGlobalState(D.clippingPlanes,G),F&&p.viewport(te.copy(F)),O.length>0&&lr(O,R,G),pe.length>0&&lr(pe,R,G),_e.length>0&&lr(_e,R,G),p.buffers.depth.setTest(!0),p.buffers.depth.setMask(!0),p.buffers.color.setMask(!0),p.setPolygonOffset(!1)}function xo(_,R,G,F){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[F.id]===void 0){const Se=Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[F.id]=new jt(1,1,{generateMipmaps:!0,type:Se?dn:Wt,minFilter:En,samples:Math.max(4,E.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:He.workingColorSpace})}const pe=S.state.transmissionRenderTarget[F.id],_e=F.viewport||te;pe.setSize(_e.z*D.transmissionResolutionScale,_e.w*D.transmissionResolutionScale);const fe=D.getRenderTarget(),xe=D.getActiveCubeFace(),Ee=D.getActiveMipmapLevel();D.setRenderTarget(pe),D.getClearColor(tt),Ge=D.getClearAlpha(),Ge<1&&D.setClearColor(16777215,.5),D.clear(),lt&&Ie.render(G);const Ue=D.toneMapping;D.toneMapping=hn;const Be=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),S.setupLightsView(F),Xe===!0&&ye.setGlobalState(D.clippingPlanes,F),lr(_,G,F),X.updateMultisampleRenderTarget(pe),X.updateRenderTargetMipmap(pe),Je.has("WEBGL_multisampled_render_to_texture")===!1){let Se=!1;for(let Ke=0,ft=R.length;Ke<ft;Ke++){const st=R[Ke],{object:et,geometry:Tt,material:Le,group:Rt}=st;if(Le.side===xn&&et.layers.test(F.layers)){const We=Le.side;Le.side=Nt,Le.needsUpdate=!0,So(et,G,F,Tt,Le,Rt),Le.side=We,Le.needsUpdate=!0,Se=!0}}Se===!0&&(X.updateMultisampleRenderTarget(pe),X.updateRenderTargetMipmap(pe))}D.setRenderTarget(fe,xe,Ee),D.setClearColor(tt,Ge),Be!==void 0&&(F.viewport=Be),D.toneMapping=Ue}function lr(_,R,G){const F=R.isScene===!0?R.overrideMaterial:null;for(let O=0,pe=_.length;O<pe;O++){const _e=_[O],{object:fe,geometry:xe,group:Ee}=_e;let Ue=_e.material;Ue.allowOverride===!0&&F!==null&&(Ue=F),fe.layers.test(G.layers)&&So(fe,R,G,xe,Ue,Ee)}}function So(_,R,G,F,O,pe){z!==null&&O.isNodeMaterial&&z.setObject(_,O),_.onBeforeRender(D,R,G,F,O,pe),_.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),O.onBeforeRender(D,R,G,F,_,pe),O.transparent===!0&&O.side===xn&&O.forceSinglePass===!1?(O.side=Nt,O.needsUpdate=!0,D.renderBufferDirect(G,R,F,O,_,pe),O.side=ti,O.needsUpdate=!0,D.renderBufferDirect(G,R,F,O,_,pe),O.side=xn):D.renderBufferDirect(G,R,F,O,_,pe),_.onAfterRender(D,R,G,F,O,pe)}function cr(_,R,G){R.isScene!==!0&&(R=Dt);const F=B.get(_),O=S.state.lights,pe=S.state.shadowsArray,_e=O.state.version,fe=oe.getParameters(_,O.state,pe,R,G,S.state.lightProbeGridArray),xe=oe.getProgramCacheKey(fe);let Ee=F.programs;F.environment=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,F.fog=R.fog;const Ue=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap;F.envMap=re.get(_.envMap||F.environment,Ue),F.envMapRotation=F.environment!==null&&_.envMap===null?R.environmentRotation:_.envMapRotation,Ee===void 0&&(_.addEventListener("dispose",tn),Ee=new Map,F.programs=Ee);let Be=Ee.get(xe);if(Be!==void 0){if(F.currentProgram===Be&&F.lightsStateVersion===_e)return Eo(_,fe),Be}else fe.uniforms=oe.getUniforms(_),z!==null&&_.isNodeMaterial&&z.build(_,G,fe),_.onBeforeCompile(fe,D),Be=oe.acquireProgram(fe,xe),Ee.set(xe,Be),F.uniforms=fe.uniforms;const Se=F.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(Se.clippingPlanes=ye.uniform),Eo(_,fe),F.needsLights=W0(_),F.lightsStateVersion=_e,F.needsLights&&(Se.ambientLightColor.value=O.state.ambient,Se.lightProbe.value=O.state.probe,Se.sunLights.value=O.state.sun,Se.sunLightShadows.value=O.state.sunShadow,Se.directionalLights.value=O.state.directional,Se.directionalLightShadows.value=O.state.directionalShadow,Se.spotLights.value=O.state.spot,Se.spotLightShadows.value=O.state.spotShadow,Se.rectAreaLights.value=O.state.rectArea,Se.ltc_1.value=O.state.rectAreaLTC1,Se.ltc_2.value=O.state.rectAreaLTC2,Se.pointLights.value=O.state.point,Se.pointLightShadows.value=O.state.pointShadow,Se.hemisphereLights.value=O.state.hemi,Se.sunShadowMatrix.value=O.state.sunShadowMatrix,Se.sunShadowCascade.value=O.state.sunShadowCascade,Se.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Se.spotLightMatrix.value=O.state.spotLightMatrix,Se.spotLightMap.value=O.state.spotLightMap,Se.pointShadowMatrix.value=O.state.pointShadowMatrix),F.lightProbeGrid=S.state.lightProbeGridArray.length>0,F.currentProgram=Be,F.uniformsList=null,Be}function Mo(_){if(_.uniformsList===null){const R=_.currentProgram.getUniforms();_.uniformsList=kr.seqWithValue(R.seq,_.uniforms)}return _.uniformsList}function Eo(_,R){const G=B.get(_);G.outputColorSpace=R.outputColorSpace,G.batching=R.batching,G.batchingColor=R.batchingColor,G.instancing=R.instancing,G.instancingColor=R.instancingColor,G.instancingMorph=R.instancingMorph,G.skinning=R.skinning,G.morphTargets=R.morphTargets,G.morphNormals=R.morphNormals,G.morphColors=R.morphColors,G.morphTargetsCount=R.morphTargetsCount,G.numClippingPlanes=R.numClippingPlanes,G.numIntersection=R.numClipIntersection,G.vertexAlphas=R.vertexAlphas,G.vertexTangents=R.vertexTangents,G.toneMapping=R.toneMapping}function k0(_,R){if(_.length===0)return null;if(_.length===1)return _[0].texture!==null?_[0]:null;x.setFromMatrixPosition(R.matrixWorld);for(let G=0,F=_.length;G<F;G++){const O=_[G];if(O.texture!==null&&O.boundingBox.containsPoint(x))return O}return null}function G0(_,R,G,F,O){R.isScene!==!0&&(R=Dt),X.resetTextureUnits();const pe=R.fog,_e=F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial?R.environment:null,fe=ne===null?D.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:He.workingColorSpace,xe=F.isMeshStandardMaterial||F.isMeshLambertMaterial&&!F.envMap||F.isMeshPhongMaterial&&!F.envMap,Ee=re.get(F.envMap||_e,xe),Ue=F.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Be=!!G.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),Se=!!G.morphAttributes.position,Ke=!!G.morphAttributes.normal,ft=!!G.morphAttributes.color;let st=hn;F.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(st=D.toneMapping);const et=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Tt=et!==void 0?et.length:0,Le=B.get(F),Rt=S.state.lights;if(Xe===!0&&(nt===!0||_!==j)){const rt=_===j&&F.id===q;ye.setState(F,_,rt)}let We=!1;F.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==Rt.state.version||Le.outputColorSpace!==fe||O.isBatchedMesh&&Le.batching===!1||!O.isBatchedMesh&&Le.batching===!0||O.isBatchedMesh&&Le.batchingColor===!0&&O._colorsTexture===null||O.isBatchedMesh&&Le.batchingColor===!1&&O._colorsTexture!==null||O.isInstancedMesh&&Le.instancing===!1||!O.isInstancedMesh&&Le.instancing===!0||O.isSkinnedMesh&&Le.skinning===!1||!O.isSkinnedMesh&&Le.skinning===!0||O.isInstancedMesh&&Le.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Le.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Le.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Le.instancingMorph===!1&&O.morphTexture!==null||Le.envMap!==Ee||F.fog===!0&&Le.fog!==pe||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==ye.numPlanes||Le.numIntersection!==ye.numIntersection)||Le.vertexAlphas!==Ue||Le.vertexTangents!==Be||Le.morphTargets!==Se||Le.morphNormals!==Ke||Le.morphColors!==ft||Le.toneMapping!==st||Le.morphTargetsCount!==Tt||!!Le.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(We=!0):(We=!0,Le.__version=F.version);let kt=Le.currentProgram;We===!0&&(kt=cr(F,R,O),z&&F.isNodeMaterial&&z.onUpdateProgram(F,kt,Le));let nn=!1,Pn=!1,oi=!1;const je=kt.getUniforms(),ut=Le.uniforms;if(p.useProgram(kt.program)&&(nn=!0,Pn=!0,oi=!0),F.id!==q&&(q=F.id,Pn=!0),Le.needsLights){const rt=k0(S.state.lightProbeGridArray,O);Le.lightProbeGrid!==rt&&(Le.lightProbeGrid=rt,Pn=!0)}if(nn||j!==_){p.buffers.depth.getReversed()&&_.reversedDepth!==!0&&(_._reversedDepth=!0,_.updateProjectionMatrix()),je.setValue(P,"projectionMatrix",_.projectionMatrix),je.setValue(P,"viewMatrix",_.matrixWorldInverse);const In=je.map.cameraPosition;In!==void 0&&In.setValue(P,ot.setFromMatrixPosition(_.matrixWorld)),E.logarithmicDepthBuffer&&je.setValue(P,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&je.setValue(P,"isOrthographic",_.isOrthographicCamera===!0),j!==_&&(j=_,Pn=!0,oi=!0)}if(Le.needsLights&&(Rt.state.sunShadowMap.length>0&&je.setValue(P,"sunShadowMap",Rt.state.sunShadowMap,X),Rt.state.directionalShadowMap.length>0&&je.setValue(P,"directionalShadowMap",Rt.state.directionalShadowMap,X),Rt.state.spotShadowMap.length>0&&je.setValue(P,"spotShadowMap",Rt.state.spotShadowMap,X),Rt.state.pointShadowMap.length>0&&je.setValue(P,"pointShadowMap",Rt.state.pointShadowMap,X)),O.isSkinnedMesh){je.setOptional(P,O,"bindMatrix"),je.setOptional(P,O,"bindMatrixInverse");const rt=O.skeleton;rt&&(rt.boneTexture===null&&rt.computeBoneTexture(),je.setValue(P,"boneTexture",rt.boneTexture,X))}O.isBatchedMesh&&(je.setOptional(P,O,"batchingTexture"),je.setValue(P,"batchingTexture",O._matricesTexture,X),je.setOptional(P,O,"batchingIdTexture"),je.setValue(P,"batchingIdTexture",O._indirectTexture,X),je.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&je.setValue(P,"batchingColorTexture",O._colorsTexture,X));const Dn=G.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&C.update(O,G,kt),(Pn||Le.receiveShadow!==O.receiveShadow)&&(Le.receiveShadow=O.receiveShadow,je.setValue(P,"receiveShadow",O.receiveShadow)),(F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial)&&F.envMap===null&&R.environment!==null&&(ut.envMapIntensity.value=R.environmentIntensity),ut.dfgLUT!==void 0&&(ut.dfgLUT.value=Mm()),Pn){if(je.setValue(P,"toneMappingExposure",D.toneMappingExposure),Le.needsLights&&V0(ut,oi),pe&&F.fog===!0&&be.refreshFogUniforms(ut,pe),be.refreshMaterialUniforms(ut,F,Q,Y,S.state.transmissionRenderTarget[_.id]),Le.needsLights&&Le.lightProbeGrid){const rt=Le.lightProbeGrid;ut.probesSH.value=rt.texture,ut.probesMin.value.copy(rt.boundingBox.min),ut.probesMax.value.copy(rt.boundingBox.max),ut.probesResolution.value.copy(rt.resolution)}kr.upload(P,Mo(Le),ut,X)}if(F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(kr.upload(P,Mo(Le),ut,X),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&je.setValue(P,"center",O.center),je.setValue(P,"modelViewMatrix",O.modelViewMatrix),je.setValue(P,"normalMatrix",O.normalMatrix),je.setValue(P,"modelMatrix",O.matrixWorld),F.uniformsGroups!==void 0){const rt=F.uniformsGroups;for(let In=0,li=rt.length;In<li;In++){const yo=rt[In];ee.update(yo,kt),ee.bind(yo,kt)}}return kt}function V0(_,R){_.ambientLightColor.needsUpdate=R,_.lightProbe.needsUpdate=R,_.sunLights.needsUpdate=R,_.sunLightShadows.needsUpdate=R,_.directionalLights.needsUpdate=R,_.directionalLightShadows.needsUpdate=R,_.pointLights.needsUpdate=R,_.pointLightShadows.needsUpdate=R,_.spotLights.needsUpdate=R,_.spotLightShadows.needsUpdate=R,_.rectAreaLights.needsUpdate=R,_.hemisphereLights.needsUpdate=R}function W0(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(_,R,G){const F=B.get(_);F.__autoAllocateDepthBuffer=_.resolveDepthBuffer===!1,F.__autoAllocateDepthBuffer===!1&&(F.__useRenderToTexture=!1),B.get(_.texture).__webglTexture=R,B.get(_.depthTexture).__webglTexture=F.__autoAllocateDepthBuffer?void 0:G,F.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(_,R){const G=B.get(_);G.__webglFramebuffer=R,G.__useDefaultFramebuffer=R===void 0},this.setRenderTarget=function(_,R=0,G=0){ne=_,J=R,W=G;let F=null,O=!1,pe=!1;if(_){const fe=B.get(_);if(fe.__useDefaultFramebuffer!==void 0){p.bindFramebuffer(P.FRAMEBUFFER,fe.__webglFramebuffer),te.copy(_.viewport),we.copy(_.scissor),Te=_.scissorTest,p.viewport(te),p.scissor(we),p.setScissorTest(Te),q=-1;return}else if(fe.__webglFramebuffer===void 0)X.setupRenderTarget(_);else if(fe.__hasExternalTextures)X.rebindTextures(_,B.get(_.texture).__webglTexture,B.get(_.depthTexture).__webglTexture);else if(_.depthBuffer){const Ue=_.depthTexture;if(fe.__boundDepthTexture!==Ue){if(Ue!==null&&B.has(Ue)&&(_.width!==Ue.image.width||_.height!==Ue.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(_)}}const xe=_.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(pe=!0);const Ee=B.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(Ee[R])?F=Ee[R][G]:F=Ee[R],O=!0):_.samples>0&&X.useMultisampledRTT(_)===!1?F=B.get(_).__webglMultisampledFramebuffer:Array.isArray(Ee)?F=Ee[G]:F=Ee,te.copy(_.viewport),we.copy(_.scissor),Te=_.scissorTest}else te.copy(ge).multiplyScalar(Q).floor(),we.copy(Fe).multiplyScalar(Q).floor(),Te=Lt;if(G!==0&&(F=V),p.bindFramebuffer(P.FRAMEBUFFER,F)&&p.drawBuffers(_,F),p.viewport(te),p.scissor(we),p.setScissorTest(Te),O){const fe=B.get(_.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+R,fe.__webglTexture,G)}else if(pe){const fe=R;for(let xe=0;xe<_.textures.length;xe++){const Ee=B.get(_.textures[xe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+xe,Ee.__webglTexture,G,fe)}}else if(_!==null&&G!==0){const fe=B.get(_.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,fe.__webglTexture,G)}q=-1};function bo(_){const R=B.get(_);return(R.__readFormat!==_.format||R.__readType!==_.type)&&(R.__readFormat=_.format,R.__readType=_.type,R.__formatReadable=E.textureFormatReadable(_.format),R.__typeReadable=E.textureTypeReadable(_.type)),R}this.readRenderTargetPixels=function(_,R,G,F,O,pe,_e,fe=0){if(!(_&&_.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=B.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe){p.bindFramebuffer(P.FRAMEBUFFER,xe);try{const Ee=_.textures[fe],Ue=Ee.format,Be=Ee.type;_.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+fe);const Se=bo(Ee);if(Se.__formatReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Se.__typeReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}R>=0&&R<=_.width-F&&G>=0&&G<=_.height-O&&P.readPixels(R,G,F,O,he.convert(Ue),he.convert(Be),pe)}finally{const Ee=ne!==null?B.get(ne).__webglFramebuffer:null;p.bindFramebuffer(P.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(_,R,G,F,O,pe,_e,fe=0){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=B.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe)if(R>=0&&R<=_.width-F&&G>=0&&G<=_.height-O){p.bindFramebuffer(P.FRAMEBUFFER,xe);const Ee=_.textures[fe],Ue=Ee.format,Be=Ee.type;_.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+fe);const Se=bo(Ee);if(Se.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Se.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ke),P.bufferData(P.PIXEL_PACK_BUFFER,pe.byteLength,P.STREAM_READ),P.readPixels(R,G,F,O,he.convert(Ue),he.convert(Be),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);const ft=ne!==null?B.get(ne).__webglFramebuffer:null;p.bindFramebuffer(P.FRAMEBUFFER,ft);const st=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Bc(P,st,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ke),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,pe),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(Ke),P.deleteSync(st),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(_,R=null,G=0){const F=Math.pow(2,-G),O=Math.floor(_.image.width*F),pe=Math.floor(_.image.height*F),_e=R!==null?R.x:0,fe=R!==null?R.y:0;X.setTexture2D(_,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,_e,fe,O,pe),p.unbindTexture()},this.copyTextureToTexture=function(_,R,G=null,F=null,O=0,pe=0){let _e,fe,xe,Ee,Ue,Be,Se,Ke,ft;const st=_.isCompressedTexture?_.mipmaps[pe]:_.image;if(G!==null)_e=G.max.x-G.min.x,fe=G.max.y-G.min.y,xe=G.isBox3?G.max.z-G.min.z:1,Ee=G.min.x,Ue=G.min.y,Be=G.isBox3?G.min.z:0;else{const ut=Math.pow(2,-O);_e=Math.floor(st.width*ut),fe=Math.floor(st.height*ut),_.isDataArrayTexture?xe=st.depth:_.isData3DTexture?xe=Math.floor(st.depth*ut):xe=1,Ee=0,Ue=0,Be=0}F!==null?(Se=F.x,Ke=F.y,ft=F.z):(Se=0,Ke=0,ft=0);const et=he.convert(R.format),Tt=he.convert(R.type);let Le;R.isData3DTexture?(X.setTexture3D(R,0),Le=P.TEXTURE_3D):R.isDataArrayTexture||R.isCompressedArrayTexture?(X.setTexture2DArray(R,0),Le=P.TEXTURE_2D_ARRAY):(X.setTexture2D(R,0),Le=P.TEXTURE_2D),p.activeTexture(P.TEXTURE0),p.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,R.flipY),p.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),p.pixelStorei(P.UNPACK_ALIGNMENT,R.unpackAlignment);const Rt=p.getParameter(P.UNPACK_ROW_LENGTH),We=p.getParameter(P.UNPACK_IMAGE_HEIGHT),kt=p.getParameter(P.UNPACK_SKIP_PIXELS),nn=p.getParameter(P.UNPACK_SKIP_ROWS),Pn=p.getParameter(P.UNPACK_SKIP_IMAGES);p.pixelStorei(P.UNPACK_ROW_LENGTH,st.width),p.pixelStorei(P.UNPACK_IMAGE_HEIGHT,st.height),p.pixelStorei(P.UNPACK_SKIP_PIXELS,Ee),p.pixelStorei(P.UNPACK_SKIP_ROWS,Ue),p.pixelStorei(P.UNPACK_SKIP_IMAGES,Be);const oi=_.isDataArrayTexture||_.isData3DTexture,je=R.isDataArrayTexture||R.isData3DTexture;if(_.isDepthTexture){const ut=B.get(_),Dn=B.get(R),rt=B.get(ut.__renderTarget),In=B.get(Dn.__renderTarget);p.bindFramebuffer(P.READ_FRAMEBUFFER,rt.__webglFramebuffer),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,In.__webglFramebuffer);for(let li=0;li<xe;li++)oi&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,B.get(_).__webglTexture,O,Be+li),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,B.get(R).__webglTexture,pe,ft+li)),P.blitFramebuffer(Ee,Ue,_e,fe,Se,Ke,_e,fe,P.DEPTH_BUFFER_BIT,P.NEAREST);p.bindFramebuffer(P.READ_FRAMEBUFFER,null),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(O!==0||_.isRenderTargetTexture||B.has(_)){const ut=B.get(_),Dn=B.get(R);p.bindFramebuffer(P.READ_FRAMEBUFFER,U),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,H);for(let rt=0;rt<xe;rt++)oi?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ut.__webglTexture,O,Be+rt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ut.__webglTexture,O),je?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Dn.__webglTexture,pe,ft+rt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Dn.__webglTexture,pe),O!==0?P.blitFramebuffer(Ee,Ue,_e,fe,Se,Ke,_e,fe,P.COLOR_BUFFER_BIT,P.NEAREST):je?P.copyTexSubImage3D(Le,pe,Se,Ke,ft+rt,Ee,Ue,_e,fe):P.copyTexSubImage2D(Le,pe,Se,Ke,Ee,Ue,_e,fe);p.bindFramebuffer(P.READ_FRAMEBUFFER,null),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else je?_.isDataTexture||_.isData3DTexture?P.texSubImage3D(Le,pe,Se,Ke,ft,_e,fe,xe,et,Tt,st.data):R.isCompressedArrayTexture?P.compressedTexSubImage3D(Le,pe,Se,Ke,ft,_e,fe,xe,et,st.data):P.texSubImage3D(Le,pe,Se,Ke,ft,_e,fe,xe,et,Tt,st):_.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,pe,Se,Ke,_e,fe,et,Tt,st.data):_.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,pe,Se,Ke,st.width,st.height,et,st.data):P.texSubImage2D(P.TEXTURE_2D,pe,Se,Ke,_e,fe,et,Tt,st);p.pixelStorei(P.UNPACK_ROW_LENGTH,Rt),p.pixelStorei(P.UNPACK_IMAGE_HEIGHT,We),p.pixelStorei(P.UNPACK_SKIP_PIXELS,kt),p.pixelStorei(P.UNPACK_SKIP_ROWS,nn),p.pixelStorei(P.UNPACK_SKIP_IMAGES,Pn),pe===0&&R.generateMipmaps&&P.generateMipmap(Le),p.unbindTexture()},this.initRenderTarget=function(_){B.get(_).__webglFramebuffer===void 0&&X.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?X.setTextureCube(_,0):_.isData3DTexture?X.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?X.setTexture2DArray(_,0):X.setTexture2D(_,0),p.unbindTexture()},this.resetState=function(){J=0,W=0,ne=null,p.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}const bm=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,Yi=14,ym=`
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform vec4 uWin;
uniform float uArch;
uniform float uBand;
uniform float uBorderAsp;
uniform float uOpaqueTop;
uniform float uShow;
uniform float uPx;

uniform sampler2D tA; uniform sampler2D mA; uniform vec2 uSizeA; uniform vec2 uFocA;
uniform sampler2D tB; uniform sampler2D mB; uniform vec2 uSizeB; uniform vec2 uFocB;
uniform float uMix;
uniform sampler2D tBorder;
uniform sampler2D tMsg; uniform vec4 uMsgRect; uniform float uMsg; uniform float uMsgT;

uniform float uTime, uRain, uSlant, uStorm, uWet, uDusk, uClear, uDry, uWind, uBurst, uMap, uCalm;
uniform vec2 uPar;
uniform float uFlash;
uniform vec4 uSeg[${Yi}];
uniform float uSegN, uBoltT, uBoltA;
uniform float uCrane; uniform float uCraneY; uniform float uDim;

const vec3 PAPER = vec3(0.914, 0.851, 0.753);
const vec3 INK = vec3(0.075, 0.07, 0.065);
const vec3 GOLD = vec3(0.80, 0.63, 0.29);
const vec3 GOLDHI = vec3(0.95, 0.76, 0.31);
const vec3 INDIGO = vec3(0.105, 0.125, 0.25);

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float hash1(float n) { return fract(sin(n * 91.3458) * 47453.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }

vec2 coverUV(vec2 q, vec2 size, vec2 foc) {
  float ap = size.x / size.y;
  float aw = uWin.z / uWin.w;
  vec2 frac = aw > ap ? vec2(1.0, ap / aw) : vec2(aw / ap, 1.0);
  frac *= 0.955;
  vec2 c = clamp(foc, frac * 0.5, 1.0 - frac * 0.5);
  vec2 uv = c + (q - 0.5) * frac;
  return vec2(uv.x, 1.0 - uv.y); // textures are stored bottom-up
}

vec3 plate(sampler2D tex, sampler2D msk, vec2 uv, float t, out vec3 m) {
  m = texture2D(msk, uv).rgb;
  float calm = 1.0 - uCalm;
  uv += uPar * (0.004 + 0.01 * (1.0 - m.r)) * calm;
  vec2 f = vec2(fbm(uv * 3.0 + vec2(t * 0.035, 0.0)), fbm(uv * 3.0 + vec2(7.3, -t * 0.028))) - 0.5;
  uv += f * 0.014 * m.r * calm;
  float wn = noise(vec2(uv.x * 70.0, uv.y * 16.0 + t * 1.6));
  uv += vec2(0.0015, 0.0045) * (wn - 0.5) * m.g * calm;
  uv.x += sin(t * 1.4 + uv.y * 34.0 + uv.x * 11.0) * 0.0011 * m.b * (0.5 + abs(uWind) * 2.0) * calm;
  vec3 col = texture2D(tex, uv).rgb;
  float sh = smoothstep(0.42, 0.8, fbm(uv * 2.2 + vec2(t * 0.025, 0.0)));
  col *= 1.0 - m.r * 0.2 * sh * calm;
  float g = pow(noise(vec2(uv.x * 140.0, uv.y * 40.0 + t * 2.5)), 9.0);
  col += m.g * g * 0.5 * vec3(0.95, 0.97, 1.0) * calm;
  return col;
}

float rainLayer(vec2 p, float sc, float speed, float dens, float seed) {
  float a = -0.08 - uSlant * 0.42 - uWind * 0.35;
  float ca = cos(a), sa = sin(a);
  p = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y);
  float cw = 7.0 * sc;
  float cid = floor(p.x / cw);
  float r1 = hash1(cid * 1.31 + seed), r2 = hash1(cid * 7.77 + seed), r3 = hash1(cid * 3.1 + seed * 2.0);
  float L = 46.0 * sc * (0.7 + r2 * 0.6);
  float y = p.y / L - uTime * speed * (0.8 + r1 * 0.5) * (1.0 - uCalm * 0.9) + r2 * 10.0;
  float row = floor(y / 3.0);
  float fy = fract(y / 3.0);
  float on = step(hash1(row * 1.7 + cid * 3.3 + seed), dens);
  float dx = abs(fract(p.x / cw) - (0.2 + r3 * 0.6)) * cw;
  float line = smoothstep(0.75 * sc, 0.0, dx);
  float body = smoothstep(0.0, 0.3, fy) * step(fy, 0.33);
  return line * body * on;
}

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;

  float x0 = uWin.x, y0 = uWin.y, w = uWin.z, h = uWin.w;
  vec2 c = vec2(x0 + w * 0.5, y0 + h * 0.5);
  vec2 dd = abs(px - c) - vec2(w, h) * 0.5;
  float dRect = max(dd.x, dd.y);
  float A = min(w * 0.36, h * 0.22) * uArch;
  float ys = y0 + A;
  float d = dRect;
  if (A > 0.5 && px.y < ys) {
    // a rounded Mughal arch with a soft point at the apex
    float u = clamp((px.x - c.x) / (w * 0.5), -1.0, 1.0);
    float top = A * (sqrt(max(0.0, 1.0 - u * u)) * 0.82 + (1.0 - abs(u)) * 0.18);
    float dArch = (ys - px.y) - top;
    d = max(dArch, dRect);
  }

  vec3 col = PAPER;
  float alpha = 0.0;
  vec2 q = (px - uWin.xy) / uWin.zw;

  if (d < 0.0) {
    float t = uTime;
    vec3 ma, mb;
    vec2 uva = coverUV(q, uSizeA, uFocA);
    vec2 uvb = coverUV(q, uSizeB, uFocB);
    vec3 ca = plate(tA, mA, uva, t, ma);
    vec3 cb = ca; mb = ma;
    if (uMix > 0.001) cb = plate(tB, mB, uvb, t, mb);
    float n = fbm(q * vec2(3.2, 4.0) + 3.0) * 0.55 + (q.y * 0.35 + 0.1) + fbm(q * 14.0) * 0.08;
    float edge = uMix * 1.25 - 0.12;
    float k = smoothstep(n - 0.035, n + 0.035, edge);
    col = mix(ca, cb, k);
    vec3 m = mix(ma, mb, k);
    float inkLine = exp(-pow((edge - n) / 0.022, 2.0)) * step(0.001, uMix) * step(uMix, 0.999);
    col = mix(col, INK, inkLine * 0.75);

    if (uMap > 0.001) {
      vec3 sheet = vec3(0.93, 0.87, 0.76) * (0.92 + 0.08 * fbm(q * 6.0)) - 0.06 * smoothstep(0.3, 0.8, fbm(q * 3.0 + 9.0));
      sheet *= 1.0 - 0.18 * pow(length(q - 0.5) * 1.3, 3.0);
      col = mix(col, sheet, uMap);
    }

    float nm = 1.0 - uMap;
    col = mix(col, col * vec3(1.07, 1.0, 0.84) + vec3(0.03, 0.02, 0.0), uDry * 0.45 * nm);
    col = mix(col, col * col * 1.32 + col * 0.04, uWet * 0.42 * nm);
    col *= mix(vec3(1.0), vec3(1.06, 0.9, 0.88), uDusk * 0.35 * nm);
    col *= 1.0 - uStorm * (0.08 + 0.2 * (1.0 - q.y)) * nm;
    col = mix(col, col * vec3(0.96, 1.0, 1.08) + vec3(0.0, 0.01, 0.03), uClear * 0.25 * nm);

    if (uBoltA > 0.001) {
      vec2 pq = vec2(q.x * w, q.y * h);
      float bd = 1e5;
      for (int i = 0; i < ${Yi}; i++) {
        if (float(i) >= uSegN) break;
        vec4 s = uSeg[i];
        float dist = segDist(pq, s.xy * vec2(w, h), s.zw * vec2(w, h));
        if (float(i) / uSegN <= uBoltT) bd = min(bd, dist);
      }
      float core = smoothstep(2.4, 0.6, bd);
      float glow = exp(-bd / 22.0) * 0.55;
      col = mix(col, GOLDHI * 1.15, core * uBoltA);
      col += GOLDHI * glow * uBoltA * 0.6;
    }
    col += col * uFlash * (0.8 + 0.8 * m.r) + vec3(1.0, 0.86, 0.55) * uFlash * 0.1 * (1.0 - q.y);

    if (uCrane > 0.0 && uCrane < 1.0) {
      vec2 pq = vec2(q.x * w / h, q.y);
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        vec2 b = vec2(mix(-0.25, w / h + 0.25, uCrane) - fi * 0.045, uCraneY + fi * 0.022 + sin(uCrane * 6.0 + fi) * 0.004);
        float flap = sin(uTime * 7.0 + fi * 1.3) * 0.5 + 0.5;
        float s = 0.018;
        vec2 l = b + vec2(-s, -s * (0.15 + flap * 0.6));
        vec2 r = b + vec2(s * 0.9, -s * (0.15 + flap * 0.6));
        float dc = min(segDist(pq, b, l), segDist(pq, b, r));
        dc = min(dc, length(pq - b - vec2(0.006, 0.0)) - 0.0025);
        float bird = smoothstep(0.0028, 0.0008, dc);
        col = mix(col, vec3(0.97, 0.95, 0.9), bird * 0.95);
      }
    }

    if (uRain > 0.001) {
      float r = 0.0;
      r += rainLayer(px, 1.7, 0.9, uRain * 0.55, 1.0) * 0.32;
      r += rainLayer(px + 13.0, 1.05, 1.15, uRain * 0.7, 2.0) * 0.26;
      r += rainLayer(px + 31.0, 0.62, 1.4, uRain * 0.85, 3.0) * 0.2;
      col = mix(col, vec3(0.86, 0.88, 0.9), r * (0.6 + uRain * 0.6));
    }

    if (uBurst > 0.001) {
      float fl = fbm(q * vec2(4.0, 2.0) + vec2(0.0, -uTime * 0.6)) * 0.4 + q.y * 0.6;
      float inked = smoothstep(fl - 0.05, fl + 0.05, uBurst * 1.3 - 0.05);
      col = mix(col, INK * (0.9 + 0.3 * fbm(q * 9.0 + uTime * 0.2)), inked);
    }

    if (uMsg > 0.001) {
      vec2 mq = (q - uMsgRect.xy) / uMsgRect.zw;
      float inside = step(0.0, mq.x) * step(mq.x, 1.0) * step(0.0, mq.y) * step(mq.y, 1.0);
      vec2 mt = vec2(mq.x, 1.0 - mq.y);
      float sharp = texture2D(tMsg, mt).r * inside;
      float soft = texture2D(tMsg, mt, 2.5).r * inside;
      float reveal = smoothstep(mq.x - 0.02, mq.x + 0.02, uMsgT * 1.15 - 0.08 + mq.y * 0.05);
      float stroke = smoothstep(0.25, 0.6, sharp) * reveal;
      float bead = smoothstep(0.05, 0.3, soft) * (1.0 - smoothstep(0.55, 0.85, sharp)) * reveal;
      float colid = floor(mq.x * 90.0);
      float dl = hash1(colid * 2.7);
      float drip = step(0.82, dl) * smoothstep(0.35, 0.0, abs(fract(mq.x * 90.0) - 0.5)) * smoothstep(dl * 0.6 + uMsgT * 0.5, 0.0, mq.y - 0.55) * step(0.55, mq.y) * reveal * inside;
      vec3 fogged = texture2D(tA, uva, 3.5).rgb * 0.55 + vec3(0.36, 0.4, 0.48);
      float fogAmt = uMsg * 0.8 * (1.0 - stroke * 0.92);
      vec3 base = mix(col, fogged, fogAmt);
      vec2 grad = vec2(dFdx(soft), dFdy(soft));
      vec3 refr = texture2D(tA, uva + grad * 0.6).rgb;
      base = mix(base, refr * 1.15 + 0.05, bead * uMsg * 0.8);
      base += vec3(0.9, 0.95, 1.0) * clamp(-grad.y * 18.0 + grad.x * 6.0, 0.0, 1.0) * bead * uMsg * 0.6;
      base = mix(base, refr * 1.1 + 0.08, drip * uMsg * 0.7);
      col = base;
    }

    col *= 1.0 - uDim * 0.78 * smoothstep(0.1, 0.9, q.y);
    col *= 1.0 - 0.22 * pow(length((q - 0.5) * vec2(1.0, 0.9)) * 1.35, 3.0);
    col += (hash(px * 0.73 + fract(uTime)) - 0.5) * 0.035;
    alpha = 1.0;
    float rim = smoothstep(1.6, 0.4, abs(d + 1.2)) * uArch;
    col = mix(col, GOLD, rim * 0.9);
  } else {
    float dr = dRect;
    float B = uBand;
    if (dRect < 0.0) {
      vec3 sp = INDIGO * (0.85 + 0.25 * fbm(px * 0.03));
      float dots = step(0.86, hash(floor(px / 7.0))) * smoothstep(1.4, 0.4, length(fract(px / 7.0) - 0.5) * 7.0);
      sp = mix(sp, GOLD, dots * 0.8);
      float rule = smoothstep(1.5, 0.3, abs(d - 1.0));
      col = mix(sp, GOLD, rule);
      alpha = 1.0;
    } else if (dr < 4.0) {
      float r1 = smoothstep(1.0, 0.2, abs(dr - 0.8)), r2 = smoothstep(1.0, 0.2, abs(dr - 3.2));
      col = mix(vec3(0.16, 0.14, 0.12), GOLD, max(r1, r2));
      alpha = 1.0;
    } else if (dr < 4.0 + B) {
      float ox = max(x0 - px.x, px.x - (x0 + w));
      float oy = max(y0 - px.y, px.y - (y0 + h));
      float across = (dr - 4.0) / B;
      vec2 tuv;
      float scale = B * uBorderAsp;
      if (ox > oy) tuv = vec2(px.y / scale, px.x < c.x ? 1.0 - across : across);
      else tuv = vec2(px.x / scale, px.y < c.y ? 1.0 - across : across);
      col = texture2D(tBorder, tuv).rgb;
      alpha = 1.0;
    } else if (dr < 7.0 + B) {
      float r1 = smoothstep(1.0, 0.2, abs(dr - 5.6 - B));
      col = mix(vec3(0.16, 0.14, 0.12), GOLD, r1);
      alpha = smoothstep(7.0 + B, 6.0 + B, dr);
    }
    if (alpha < 1.0 && px.y < uOpaqueTop) {
      vec3 paper = PAPER * (0.97 + 0.04 * noise(px * 0.35)) - 0.015 * fbm(px * 0.01);
      float pa = smoothstep(uOpaqueTop, uOpaqueTop - 14.0, px.y);
      col = mix(paper, col, alpha);
      alpha = max(alpha, pa);
    }
  }
  alpha *= uShow;
  gl_FragColor = vec4(col * alpha, alpha);
}
`,Tm=1.9562043795620438,Am={aspect:Tm},Zi=["p1-ramagiri","p3-reva","p4-ujjain","p5-ganga","p6-himalaya","p7-alaka"],yl=[[.42,.42],[.5,.5],[.55,.42],[.5,.45],[.5,.42],[.55,.62]],y0=[.5,.26,.33,.25,.36,.34];class wm{constructor(e){ie(this,"renderer");ie(this,"scene",new eh);ie(this,"camera",new ro(-1,1,1,-1,0,1));ie(this,"mat");ie(this,"u");ie(this,"tex",[]);ie(this,"blank");ie(this,"msgCanvas",document.createElement("canvas"));ie(this,"msgTex");this.renderer=new Em({canvas:e,antialias:!1,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.blank=new u0(new Uint8Array([20,19,18,255]),1,1),this.blank.needsUpdate=!0,this.msgCanvas.width=1024,this.msgCanvas.height=384,this.msgTex=new hh(this.msgCanvas),this.msgTex.generateMipmaps=!0,this.msgTex.minFilter=En;const t=[];for(let s=0;s<Yi;s++)t.push(new at);const n=(s=0,a=0)=>({value:new Ve(s,a)});this.u={uRes:n(1,1),uWin:{value:new at(0,0,1,1)},uArch:{value:0},uBand:{value:22},uBorderAsp:{value:Am.aspect},uOpaqueTop:{value:0},uShow:{value:1},uPx:{value:1},tA:{value:this.blank},mA:{value:this.blank},uSizeA:n(880,1200),uFocA:n(.5,.5),tB:{value:this.blank},mB:{value:this.blank},uSizeB:n(880,1200),uFocB:n(.5,.5),uMix:{value:0},tBorder:{value:this.blank},tMsg:{value:this.msgTex},uMsgRect:{value:new at(.1,.3,.8,.3)},uMsg:{value:0},uMsgT:{value:0},uTime:{value:0},uRain:{value:0},uSlant:{value:0},uStorm:{value:0},uWet:{value:0},uDusk:{value:0},uClear:{value:0},uDry:{value:0},uWind:{value:0},uBurst:{value:0},uMap:{value:0},uCalm:{value:0},uPar:n(),uFlash:{value:0},uSeg:{value:t},uSegN:{value:0},uBoltT:{value:0},uBoltA:{value:0},uCrane:{value:-1},uDim:{value:0},uCraneY:{value:.12}},this.mat=new en({vertexShader:bm,fragmentShader:ym,uniforms:this.u,depthTest:!1,depthWrite:!1,transparent:!0});const r=new fn(new or(2,2),this.mat);r.frustumCulled=!1,this.scene.add(r);for(let s=0;s<Zi.length;s++)this.tex.push({img:this.blank,mask:this.blank,size:new Ve(880,1200),ready:!1})}load(e){return new Promise((t,n)=>{new Mh().load(e,r=>{r.colorSpace=Sn,r.generateMipmaps=!0,r.minFilter=En,r.anisotropy=2,t(r)},void 0,n)})}async loadBorder(){const e=await this.load("./folio/border.webp");e.wrapS=Wr,e.generateMipmaps=!1,e.minFilter=Et,this.u.tBorder.value=e,this.renderer.initTexture(e)}async loadPlate(e){if(this.tex[e].ready)return;const[t,n]=await Promise.all([this.load(`./plates/${Zi[e]}.webp`),this.load(`./plates/${Zi[e]}-mask.webp`)]),r=t.image;this.tex[e]={img:t,mask:n,size:new Ve(r.naturalWidth||880,r.naturalHeight||1200),ready:!0},this.renderer.initTexture(t),this.renderer.initTexture(n)}setPlates(e,t,n){const r=this.tex[e]??this.tex[0],s=this.tex[t]??r;this.u.tA.value=r.img,this.u.mA.value=r.mask,this.u.uSizeA.value.copy(r.size),this.u.uFocA.value.set(...yl[e]??[.5,.5]),this.u.tB.value=s.img,this.u.mB.value=s.mask,this.u.uSizeB.value.copy(s.size),this.u.uFocB.value.set(...yl[t]??[.5,.5]),this.u.uMix.value=e===t?0:n}writeMessage(e){const t=this.msgCanvas,n=t.getContext("2d");n.fillStyle="#000",n.fillRect(0,0,t.width,t.height),n.fillStyle="#fff",n.textAlign="center",n.textBaseline="middle";const r=e.trim().split(/\s+/);let s=92,a=[];for(;s>40;s-=4){n.font=`400 ${s}px Kalam, cursive`,a=[];let l="";for(const c of r){const u=l?l+" "+c:c;n.measureText(u).width>t.width*.9&&l?(a.push(l),l=c):l=u}if(l&&a.push(l),a.length*s*1.15<=t.height*.92)break}const o=s*1.12;a.forEach((l,c)=>n.fillText(l,t.width/2,t.height/2+(c-(a.length-1)/2)*o)),this.msgTex.needsUpdate=!0}resize(e,t,n){this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.u.uRes.value.set(e,t),this.u.uPx.value=n}bolt(e){const t=this.u.uSeg.value;let n=.2+Math.random()*.6,r=0;const s=Math.max(.2,e*(.8+Math.random()*.35)),a=8+Math.floor(Math.random()*3);let o=0;const l=[[n,r]];for(let L=0;L<a;L++)n+=(Math.random()-.5)*.09,r+=s/a,l.push([n,r]);for(let L=0;L<l.length-1&&o<Yi;L++)t[o++].set(l[L][0],l[L][1],l[L+1][0],l[L+1][1]);const c=2+Math.floor(Math.random()*4);let u=l[c][0],f=l[c][1];const h=Math.random()>.5?1:-1;for(let L=0;L<3&&o<Yi;L++){const g=u+h*.04+(Math.random()-.5)*.03,M=f+s/a*.8;t[o++].set(u,f,g,M),u=g,f=M}this.u.uSegN.value=o}render(){this.renderer.render(this.scene,this.camera)}}const Ei=(i,e,t)=>{const n=Math.min(1,Math.max(0,(t-i)/(e-i)));return n*n*(3-2*n)};class Rm{constructor(){ie(this,"ctx",null);ie(this,"on",!1);ie(this,"master");ie(this,"ambience");ie(this,"window");ie(this,"music");ie(this,"beds",new Map);ie(this,"bufs",new Map);ie(this,"lastThunder",0);ie(this,"state",{rain:0,storm:0,ch:0,clear:0,msg:0,full:1,show:1})}async start(){if(this.ctx){this.ctx.state!=="running"&&await this.ctx.resume();return}const e=new AudioContext({latencyHint:"playback"});this.ctx=e;const t=e.createDynamicsCompressor();t.threshold.value=-8,t.knee.value=6,t.ratio.value=6,t.attack.value=.01,t.release.value=.4,this.master=e.createGain(),this.master.gain.value=0,this.master.connect(t).connect(e.destination),this.window=e.createBiquadFilter(),this.window.type="lowpass",this.window.frequency.value=2400,this.window.Q.value=.5,this.ambience=e.createGain(),this.ambience.gain.value=1,this.ambience.connect(this.window).connect(this.master),this.music=e.createGain(),this.music.gain.value=1,this.music.connect(this.master);for(const n of["rain-light","rain-mid","storm","koel"])this.beds.set(n,this.bed(this.ambience));for(const n of["megh","miyan"])this.beds.set(n,this.bed(this.music));this.loadAll()}bed(e){const t=this.ctx.createGain();return t.gain.value=0,t.connect(e),{gain:t,buf:null,src:null}}async loadAll(){const e=["rain-light","megh","koel","rain-mid","thunder-0","thunder-1","storm","miyan","thunder-2","thunder-3"];for(const t of e)try{const n=await fetch(`./sound/${t}.m4a`),r=await this.ctx.decodeAudioData(await n.arrayBuffer());this.bufs.set(t,r);const s=this.beds.get(t);s&&(s.buf=r,this.play(s,t!=="koel"))}catch(n){console.warn("sound",t,n)}}play(e,t){if(!e.buf||e.src)return;const n=this.ctx.createBufferSource();n.buffer=e.buf,n.loop=t,n.connect(e.gain),n.start(0,t?Math.random()*e.buf.duration*.5:0),t||(n.onended=()=>{e.src=null}),e.src=n}setOn(e){if(this.on=e,!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t),this.master.gain.setValueAtTime(this.master.gain.value,t),this.master.gain.linearRampToValueAtTime(e?1:0,t+(e?3.5:.6))}thunder(e=.4){if(!this.ctx||!this.on)return;const t=this.ctx.currentTime;if(t-this.lastThunder<1.2)return;this.lastThunder=t;const n=["thunder-0","thunder-1","thunder-2","thunder-3"].filter(c=>this.bufs.has(c));if(!n.length)return;const r=this.bufs.get(n[Math.floor(Math.random()*n.length)]),s=this.ctx.createBufferSource();s.buffer=r,s.playbackRate.value=.92+Math.random()*.14;const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=9e3-e*7500;const o=this.ctx.createGain();o.gain.value=.9-e*.55;const l=this.ctx.createStereoPanner();l.pan.value=(Math.random()-.5)*.8,s.connect(a).connect(o).connect(l).connect(this.master),s.start(t+.05+e*1.8)}swell(){this.thunder(.02)}update(e){if(!this.ctx||!this.on)return;const t=this.ctx.currentTime,n=this.state,r=(f,h,L=1.2)=>{const g=this.beds.get(f);g&&g.gain.gain.setTargetAtTime(h,t,L)},s=n.rain,a=(1-n.msg*.75)*(.35+.65*n.show);r("rain-light",.55*Ei(.02,.12,s)*(1-Ei(.35,.55,s))*a),r("rain-mid",.5*Ei(.3,.5,s)*(1-Ei(.72,.9,s))*a),r("storm",.62*Ei(.7,.9,s)*a);const o=(n.ch<=1&&s<.2?1:0)+(n.clear>.6&&n.msg<.3?.8:0);r("koel",.35*Math.min(1,o)*n.show,2.5);const l=this.beds.get("koel");l&&l.buf&&!l.src&&o>0&&this.play(l,!0);const c=Ei(.5,.75,n.storm),u=.62*(.75+.25*n.full)*(n.show>.5?1:.7);r("megh",u*(1-c),2.5),r("miyan",u*c,2.5),this.window.frequency.setTargetAtTime(1800+9e3*n.full*n.full,t,.6)}}const Cm="M912.3,883.6L915.4,883.9L921.1,882.4L924.2,882.5L927.1,883.6L929.8,884.2L936.3,883.4L937.5,883.6L938.7,884.2L939.7,885.2L942.7,888.7L947.7,893.0L949.2,895.8L950.0,898.9L956.2,905.6L956.8,908.1L956.0,911.5L957.7,914.3L963.2,916.8L966.5,918.7L967.2,919.8L967.6,921.2L969.4,923.2L971.7,924.6L978.8,928.0L988.0,935.3L993.3,938.8L997.7,944.0L999.2,946.6L1000.5,949.3L1003.2,953.2L1007.7,958.1L1008.8,959.6L1010.0,960.0L1011.4,960.0L1013.1,960.0L1015.1,960.0L1017.1,960.0L1020.4,960.0L1022.2,960.0L1020.4,960.0L1021.9,960.0L1023.4,960.0L1026.2,960.0L1030.6,960.0L1032.5,960.0L1033.9,960.0L1036.9,960.0L1039.4,960.0L1042.1,960.0L1044.6,960.0L1050.5,960.0L1052.5,960.0L1053.9,960.0L1055.6,960.0L1059.7,960.0L1054.7,960.0L1053.2,960.0L1045.4,960.0L1041.2,960.0L1039.5,960.0L1035.4,960.0L1032.6,960.0L1030.2,960.0L1028.0,960.0L1023.6,960.0L1022.2,960.0L1012.2,960.0L1009.8,960.0L1007.7,960.0L1002.2,960.0L1000.4,960.0L998.3,960.0L996.5,960.0L993.0,960.0L991.7,960.0L989.9,960.0L983.4,960.0L980.9,960.0L979.0,960.0L976.5,960.0L973.4,960.0L969.9,960.0L967.6,960.0L964.9,960.0L952.2,960.0L950.1,960.0L948.0,960.0L944.9,960.0L942.5,960.0L941.6,957.4L941.0,952.4L940.4,949.5L939.8,947.9L934.8,944.4L932.8,941.6L931.2,938.6L929.7,936.3L924.2,928.2L922.3,926.1L920.0,924.6L913.1,923.0L911.1,921.7L907.8,917.1L905.8,914.8L899.7,909.7L889.5,898.9L887.4,896.2L885.8,893.4L884.5,890.4L880.2,882.1L880.5,880.5L881.2,878.7L881.1,877.3L880.6,875.8L880.7,874.6L882.0,873.8L884.9,872.8L887.9,872.9L890.7,873.4L893.4,874.2L896.0,875.9L900.7,880.3L903.3,881.9L906.3,882.6L912.3,883.6Z M499.6,760.0L502.0,760.2L504.5,760.1L506.3,760.5L509.4,764.6L517.8,772.1L522.3,779.6L522.8,781.3L523.4,782.7L525.4,783.8L530.0,791.1L530.5,792.5L530.4,794.1L531.9,795.9L533.3,796.2L534.3,797.3L535.6,803.1L535.6,804.9L541.6,814.8L541.9,816.7L543.2,819.0L544.9,823.3L545.8,824.3L546.9,828.1L546.9,835.3L546.5,838.5L545.5,842.4L544.2,846.3L542.8,849.0L540.9,851.4L534.5,856.3L532.7,857.3L524.3,860.4L518.1,863.4L512.4,864.2L506.7,862.6L502.4,858.7L500.2,853.0L498.7,847.1L496.5,840.5L494.8,820.1L494.0,814.4L492.7,807.1L492.8,804.0L493.7,801.0L493.7,807.6L495.2,807.6L495.8,800.7L496.3,797.8L498.5,790.3L498.6,788.9L498.2,786.1L498.2,784.7L501.6,779.4L502.5,776.3L503.0,773.1L502.8,769.7L502.2,766.4L504.9,767.4L506.4,768.6L507.9,769.4L509.2,769.0L510.7,769.0L509.6,767.1L506.4,765.5L501.1,764.4L499.5,763.1L498.9,761.9L499.2,760.6Z M884.1,867.9L882.1,868.3L880.4,865.8L882.1,865.6L884.0,866.2L884.1,867.9Z M996.2,850.3L998.0,853.2L997.1,854.4L995.6,854.4L994.6,855.5L992.6,853.7L991.4,852.9L991.2,851.5L992.8,851.3L995.5,850.8Z M991.6,848.8L990.2,846.7L991.4,843.6L992.5,847.4L991.6,848.8Z M1001.9,763.2L1000.6,762.7L999.6,760.5L1001.1,760.6L1001.8,761.7L1001.9,763.2Z M1001.8,766.1L1001.9,767.7L1001.3,769.5L999.1,770.6L998.3,769.1L998.5,766.8L1001.1,766.4Z M964.8,810.7L963.2,806.0L965.1,807.4L964.8,810.7Z M960.2,811.5L960.0,813.5L957.9,814.8L956.6,810.9L957.5,805.2L958.8,805.9L960.9,806.6L960.0,809.9L960.2,811.5Z M957.7,780.6L956.3,780.8L956.5,779.4L957.5,778.2L957.8,779.8Z M847.3,840.4L845.7,842.6L842.7,835.8L841.5,835.4L841.4,832.2L842.1,830.9L845.6,829.5L848.2,836.6L847.3,840.4Z M843.3,826.3L841.0,828.8L839.9,827.3L841.4,825.6L842.3,824.8L843.3,826.3Z M828.5,802.2L829.3,803.2L827.9,803.0L826.6,801.5L826.9,800.1L828.5,802.2Z M836.1,812.2L834.1,812.2L833.5,811.1L832.7,809.9L833.4,808.7L835.8,810.3L836.2,811.6Z M838.4,807.4L837.3,808.4L836.7,806.9L836.4,804.3L837.4,802.8L837.8,804.6L838.4,807.4Z M819.7,778.3L817.9,777.5L818.5,775.7L820.2,777.3Z M812.6,740.0L809.2,740.2L809.4,737.4L808.8,734.7L809.3,733.6L811.2,731.6L812.8,730.8L813.9,733.4L814.4,736.0L812.6,740.0Z M817.3,717.7L816.1,718.3L814.9,717.6L815.8,716.5L816.0,714.3L817.3,715.5L817.2,716.9Z M825.4,700.1L826.6,703.8L824.5,702.1L823.9,701.0L824.9,700.2Z M817.9,677.7L817.1,679.5L817.0,675.7L818.3,675.5L817.9,677.7Z M818.1,713.6L816.7,713.5L814.4,708.6L814.0,705.5L813.3,704.5L814.2,702.9L815.8,700.7L816.0,698.0L816.9,695.9L819.2,695.2L819.4,692.9L818.4,692.0L818.0,686.5L818.3,684.4L819.0,683.0L818.5,680.0L820.2,677.3L820.8,674.0L821.5,667.9L821.4,664.4L823.1,661.0L825.7,659.4L826.7,662.3L825.4,665.0L826.8,667.3L826.1,669.9L825.1,671.7L823.8,672.4L822.7,674.8L824.1,678.1L824.8,686.5L823.3,688.8L821.6,689.3L822.0,694.9L821.7,696.2L820.0,698.9L819.7,700.1L818.7,701.2L819.1,702.7L819.9,704.4L819.2,707.4L819.1,710.8L818.1,713.6Z M963.5,729.0L961.9,728.6L963.2,725.7L963.5,729.0Z M955.2,729.3L957.3,734.0L956.3,734.9L955.5,732.4L953.9,730.8L952.0,731.1L953.6,729.0L955.2,729.3Z M954.6,756.8L953.4,758.3L953.5,755.7L955.5,753.8L957.3,753.6L955.8,756.2L954.6,756.8Z M955.5,715.1L955.0,712.7L956.0,710.6L957.0,707.6L957.1,712.0L956.6,713.9L955.5,715.1Z M962.9,703.6L961.4,699.4L963.1,700.9L965.2,702.2L962.9,703.6Z M951.9,709.3L952.1,710.8L950.5,709.2L950.3,704.8L951.5,707.6L951.9,709.3Z M963.8,707.9L963.2,713.5L961.6,712.7L959.9,709.6L959.4,706.7L963.1,706.3L963.8,707.9Z M953.4,697.0L951.9,696.6L950.9,694.8L951.4,693.5L953.1,693.5L953.0,695.0L953.4,697.0Z M951.7,690.5L950.1,693.5L948.8,692.4L949.8,690.4L951.1,690.6Z M960.3,684.9L961.7,685.6L961.5,688.3L959.5,691.5L958.4,692.0L958.3,687.3L957.6,684.6L957.8,682.8L959.9,683.6L960.3,684.9Z M957.9,671.4L957.7,675.8L956.5,673.7L956.3,671.3L956.4,669.0L957.5,670.0L957.9,671.4Z M939.4,586.4L937.0,585.0L936.7,580.8L937.9,579.8L939.5,580.1L940.0,581.6L939.4,586.4Z M977.0,819.9L977.6,823.2L975.9,821.1L976.0,819.0L977.0,819.9Z M870.1,598.1L868.6,598.3L870.7,595.0L870.1,598.1Z M861.9,594.7L860.3,597.3L859.7,593.4L862.3,591.2L863.6,589.1L865.0,587.7L865.5,589.4L864.2,592.7L861.9,594.7Z M842.3,520.8L839.2,518.8L837.2,515.9L840.5,515.3L843.6,515.9L843.6,517.5L843.0,520.0Z M837.3,488.2L837.8,492.0L836.1,490.6L835.5,488.6L835.3,486.7L837.3,488.2Z M825.3,487.4L825.6,490.0L824.4,488.9L822.8,485.3L822.9,483.0L824.0,484.1L825.3,487.4Z M842.9,497.3L845.7,499.5L848.6,500.7L848.3,502.5L845.4,504.3L843.9,503.5L843.3,501.1L841.6,499.9L842.2,497.6Z M796.8,435.9L795.9,438.1L795.5,436.5L795.9,434.5L796.5,433.4L797.1,434.6L796.8,435.9Z M798.7,444.7L797.2,444.8L796.8,442.9L796.4,439.3L797.7,438.9L798.7,440.0L799.0,441.9L798.7,444.7Z M778.8,426.7L776.1,428.6L777.0,417.4L779.0,421.6L779.5,423.8L778.8,426.7Z M788.9,421.1L787.8,421.9L786.7,421.2L785.3,418.6L786.0,415.3L787.1,415.9L788.1,418.2L788.7,419.9Z M766.0,405.4L766.5,406.6L765.1,405.9L764.1,405.1L763.4,404.0L766.0,405.4Z M769.4,429.0L765.1,430.0L762.9,429.7L767.0,422.6L766.9,419.4L766.2,416.8L764.1,414.8L764.0,413.3L763.1,411.3L762.6,408.9L764.9,408.1L766.8,409.5L767.5,412.2L768.4,414.2L771.7,418.3L771.6,420.9L770.7,427.1L769.4,429.0Z M499.2,764.9L497.7,765.2L496.4,763.4L496.5,762.1L497.8,763.6L499.2,764.9Z M496.9,780.6L497.6,782.6L495.5,781.2L494.2,780.1L496.5,780.2Z M-60.0,-60.0L-45.7,-60.0L-44.1,-60.0L-41.2,-60.0L-27.0,-60.0L-23.6,-60.0L-22.2,-60.0L-19.5,-60.0L-15.7,-60.0L-17.5,-60.0L-19.4,-60.0L-22.2,-60.0L-17.2,-60.0L-9.9,-60.0L-6.9,-60.0L-4.3,-60.0L-2.6,-60.0L4.0,-60.0L12.2,-60.0L15.9,-60.0L20.4,-60.0L23.3,-60.0L21.5,-60.0L16.6,-60.0L8.4,-60.0L4.3,-60.0L6.9,-60.0L14.0,-60.0L20.3,-60.0L22.7,-60.0L25.4,-60.0L44.3,-60.0L65.8,-60.0L84.0,-60.0L104.8,-60.0L114.8,-60.0L123.2,-60.0L125.8,-60.0L133.2,-60.0L138.2,-60.0L143.4,-60.0L145.3,-60.0L152.1,-60.0L160.4,-60.0L168.9,-60.0L175.1,-60.0L178.7,-60.0L191.0,-60.0L193.3,-60.0L203.9,-60.0L209.3,-60.0L212.6,-60.0L220.7,-60.0L225.6,-60.0L228.5,-60.0L223.1,-60.0L219.1,-60.0L216.5,-60.0L213.6,-60.0L208.9,-60.0L202.9,-60.0L200.1,-60.0L194.4,-60.0L190.6,-60.0L176.6,-60.0L174.1,-60.0L172.4,-60.0L171.0,-60.0L173.2,-60.0L176.7,-60.0L178.6,-60.0L181.0,-60.0L178.7,-60.0L181.2,-60.0L178.6,-60.0L170.6,-60.0L167.6,-60.0L169.0,-60.0L171.2,-60.0L167.3,-60.0L166.0,-60.0L169.2,-60.0L172.9,-60.0L181.9,-60.0L188.5,-60.0L199.0,-60.0L206.7,-60.0L211.7,-60.0L215.2,-60.0L220.7,-60.0L226.0,-60.0L234.8,-60.0L240.3,-60.0L242.4,-60.0L241.1,-60.0L243.5,-60.0L247.2,-60.0L254.3,-60.0L266.4,-60.0L287.5,-60.0L290.4,-60.0L298.2,-60.0L302.5,-60.0L311.2,-60.0L315.8,-60.0L320.3,-60.0L318.8,-60.0L315.6,-60.0L314.4,-60.0L309.4,-60.0L307.0,-60.0L303.2,-60.0L297.8,-60.0L302.0,-60.0L314.5,-60.0L317.6,-60.0L316.3,-60.0L314.0,-60.0L311.7,-60.0L313.2,-60.0L315.0,-60.0L313.2,-60.0L314.4,-60.0L317.0,-60.0L320.3,-60.0L329.8,-60.0L338.7,-60.0L336.6,-60.0L331.7,-60.0L328.5,-60.0L326.7,-60.0L323.7,-60.0L314.9,-60.0L296.2,-60.0L291.7,-60.0L284.1,-60.0L286.2,-60.0L288.8,-60.0L283.5,-60.0L276.6,-60.0L273.5,-60.0L268.1,-60.0L264.0,-60.0L259.6,-60.0L261.1,-60.0L264.2,-60.0L267.3,-60.0L265.8,-60.0L264.5,-60.0L261.1,-60.0L257.1,-60.0L252.3,-60.0L248.7,-60.0L246.9,-60.0L243.5,-60.0L230.4,-60.0L227.0,-60.0L225.3,-60.0L227.3,-60.0L228.6,-60.0L229.9,-60.0L235.3,-60.0L242.5,-60.0L249.6,-60.0L258.5,-60.0L278.6,-60.0L284.0,-60.0L289.1,-60.0L297.9,-60.0L301.7,-60.0L308.0,-60.0L309.6,-60.0L333.5,-60.0L337.8,-60.0L344.8,-60.0L347.1,-60.0L349.7,-60.0L351.9,-60.0L366.9,-60.0L369.2,-60.0L365.8,-60.0L362.8,-60.0L359.8,-60.0L362.0,-60.0L364.5,-60.0L378.1,-60.0L389.7,-60.0L402.7,-60.0L407.9,-60.0L411.5,-60.0L415.1,-60.0L418.4,-60.0L427.8,-60.0L431.0,-60.0L429.4,-60.0L433.1,-60.0L434.9,-60.0L439.5,-60.0L441.9,-60.0L444.3,-60.0L449.6,-60.0L464.7,-60.0L473.1,-60.0L471.0,-60.0L464.0,-60.0L454.0,-60.0L439.7,-60.0L438.0,-60.0L441.6,-60.0L443.9,-60.0L446.7,-60.0L449.9,-60.0L447.7,-60.0L444.6,-60.0L441.3,-60.0L436.7,-60.0L433.2,-60.0L416.1,-60.0L400.0,-60.0L389.0,-60.0L385.5,-60.0L376.3,-60.0L370.4,-60.0L359.1,-60.0L349.4,-60.0L345.9,-60.0L344.4,-60.0L347.3,-60.0L345.8,-60.0L341.6,-60.0L339.0,-60.0L345.8,-60.0L348.4,-60.0L355.2,-60.0L358.6,-60.0L343.3,-60.0L339.4,-60.0L337.7,-60.0L334.1,-60.0L328.8,-60.0L327.2,-60.0L341.8,-60.0L348.5,-60.0L357.8,-60.0L362.2,-60.0L370.1,-60.0L374.8,-60.0L376.3,-60.0L372.4,-60.0L369.7,-60.0L371.6,-60.0L373.6,-60.0L378.8,-60.0L384.2,-60.0L386.9,-60.0L390.1,-60.0L392.3,-60.0L393.5,-60.0L391.1,-60.0L388.8,-60.0L384.9,-60.0L381.8,-60.0L387.6,-60.0L385.4,-60.0L382.0,-60.0L383.3,-60.0L393.3,-60.0L402.8,-60.0L418.5,-60.0L423.2,-60.0L424.9,-60.0L439.7,-60.0L451.7,-60.0L458.0,-60.0L463.1,-60.0L473.6,-60.0L475.4,-60.0L477.1,-60.0L472.2,-60.0L470.1,-60.0L468.1,-60.0L464.7,-60.0L462.3,-60.0L459.7,-60.0L455.3,-60.0L447.7,-60.0L442.7,-60.0L437.0,-60.0L427.8,-60.0L421.8,-60.0L410.8,-60.0L407.8,-60.0L405.4,-60.0L402.6,-60.0L400.8,-60.0L403.1,-60.0L410.5,-60.0L421.8,-60.0L426.5,-60.0L438.8,-60.0L444.4,-60.0L454.7,-60.0L450.4,-60.0L444.5,-60.0L437.3,-60.0L435.3,-60.0L436.8,-60.0L440.6,-60.0L443.3,-60.0L449.2,-60.0L455.6,-60.0L462.1,-60.0L485.6,-60.0L498.8,-60.0L511.9,-60.0L517.5,-60.0L519.1,-60.0L520.4,-60.0L537.8,-60.0L541.5,-60.0L552.0,-60.0L563.7,-60.0L568.9,-60.0L574.7,-60.0L577.7,-60.0L580.8,-60.0L579.1,-60.0L577.6,-60.0L574.4,-60.0L572.9,-60.0L562.3,-60.0L558.1,-60.0L556.4,-60.0L557.9,-60.0L554.1,-60.0L555.5,-60.0L561.3,-60.0L564.8,-60.0L568.4,-60.0L571.7,-60.0L575.3,-60.0L573.0,-60.0L568.6,-60.0L567.1,-60.0L569.2,-60.0L571.4,-60.0L574.0,-60.0L577.0,-60.0L578.3,-60.0L576.8,-60.0L582.3,-60.0L587.4,-60.0L591.5,-60.0L593.4,-60.0L591.3,-60.0L589.5,-60.0L583.3,-60.0L578.8,-60.0L581.7,-60.0L586.4,-60.0L588.3,-60.0L583.5,-60.0L580.0,-60.0L568.9,-60.0L566.1,-60.0L558.0,-60.0L555.2,-60.0L552.3,-60.0L544.8,-60.0L539.7,-60.0L532.1,-60.0L527.5,-60.0L520.7,-60.0L518.0,-60.0L516.4,-60.0L519.3,-60.0L521.0,-60.0L518.9,-60.0L516.0,-60.0L512.7,-60.0L511.4,-60.0L510.0,-60.0L511.5,-60.0L514.9,-60.0L536.7,-60.0L545.4,-60.0L588.6,-60.0L591.7,-60.0L610.4,-60.0L618.4,-60.0L626.9,-60.0L630.0,-60.0L636.2,-60.0L640.3,-60.0L649.5,-60.0L664.8,-60.0L672.3,-60.0L674.0,-60.0L675.7,-60.0L667.4,-60.0L659.1,-60.0L652.4,-60.0L645.7,-60.0L652.5,-60.0L657.7,-60.0L662.9,-60.0L666.9,-60.0L653.0,-60.0L649.3,-60.0L647.8,-60.0L650.0,-60.0L652.3,-60.0L653.9,-60.0L659.4,-60.0L678.0,-60.0L682.4,-60.0L684.2,-60.0L689.3,-60.0L687.6,-60.0L683.4,-60.0L680.2,-60.0L667.4,-60.0L664.3,-60.0L654.4,-60.0L650.0,-60.0L654.6,-60.0L659.9,-60.0L663.5,-60.0L666.6,-60.0L672.4,-60.0L680.7,-60.0L677.7,-60.0L672.4,-60.0L667.5,-60.0L660.6,-60.0L652.9,-60.0L644.8,-60.0L647.0,-60.0L651.5,-60.0L653.0,-60.0L655.0,-60.0L666.3,-60.0L671.6,-60.0L676.0,-60.0L685.5,-60.0L682.2,-60.0L678.5,-60.0L673.5,-60.0L675.1,-60.0L679.3,-60.0L691.8,-60.0L712.6,-60.0L718.3,-60.0L732.8,-60.0L739.9,-60.0L754.6,-60.0L775.1,-60.0L787.0,-60.0L796.1,-60.0L810.2,-60.0L815.1,-60.0L838.7,-60.0L851.9,-60.0L853.9,-60.0L842.2,-60.0L839.4,-60.0L836.9,-60.0L835.2,-60.0L829.5,-60.0L827.9,-60.0L824.7,-60.0L822.3,-60.0L824.3,-60.0L827.6,-60.0L831.5,-60.0L834.0,-60.0L841.2,-60.0L846.1,-60.0L852.6,-60.0L859.7,-60.0L862.7,-60.0L864.4,-60.0L876.0,-60.0L884.0,-60.0L889.5,-60.0L898.0,-60.0L901.9,-60.0L899.7,-60.0L891.3,-60.0L893.6,-60.0L898.4,-60.0L912.7,-60.0L915.0,-60.0L913.4,-60.0L922.0,-60.0L930.1,-60.0L933.8,-60.0L937.5,-60.0L940.9,-60.0L948.0,-60.0L950.5,-60.0L954.9,-60.0L958.5,-60.0L966.6,-60.0L969.3,-60.0L974.6,-60.0L979.7,-60.0L989.1,-60.0L990.4,-60.0L994.3,-60.0L992.2,-60.0L990.1,-60.0L986.1,-60.0L988.5,-60.0L990.2,-60.0L993.4,-60.0L996.3,-60.0L990.4,-60.0L986.5,-60.0L977.3,-60.0L974.2,-60.0L970.1,-60.0L971.7,-60.0L989.4,-60.0L998.4,-60.0L1008.1,-60.0L1021.1,-60.0L1026.5,-60.0L1032.8,-60.0L1039.9,-60.0L1042.1,-60.0L1030.3,-60.0L1025.1,-60.0L1023.2,-60.0L1025.2,-60.0L1027.5,-60.0L1025.2,-60.0L1023.0,-60.0L1024.7,-60.0L1029.6,-60.0L1032.3,-60.0L1037.9,-60.0L1060.0,-60.0L1060.0,-57.4L1060.0,-54.9L1060.0,-51.1L1060.0,-48.0L1060.0,-45.7L1060.0,-42.1L1060.0,-39.4L1060.0,-37.1L1060.0,-34.9L1060.0,-32.6L1060.0,-30.8L1060.0,-29.2L1060.0,-24.2L1060.0,-22.0L1060.0,-20.1L1060.0,-18.4L1060.0,-16.8L1060.0,-4.7L1060.0,3.0L1060.0,8.7L1060.0,19.6L1060.0,25.4L1060.0,29.0L1060.0,33.9L1060.0,36.8L1060.0,41.2L1060.0,43.5L1060.0,45.2L1060.0,48.5L1060.0,50.2L1060.0,52.5L1060.0,53.8L1060.0,55.3L1060.0,62.4L1060.0,67.5L1060.0,71.9L1060.0,76.0L1060.0,77.6L1060.0,79.0L1060.0,80.5L1060.0,82.7L1060.0,84.4L1060.0,83.2L1060.0,80.3L1060.0,81.8L1060.0,83.9L1060.0,85.1L1060.0,86.8L1060.0,88.4L1060.0,85.2L1060.0,87.8L1060.0,89.3L1060.0,91.0L1060.0,93.0L1060.0,94.4L1060.0,93.1L1060.0,91.5L1060.0,90.0L1060.0,88.4L1060.0,91.5L1060.0,96.0L1060.0,94.5L1060.0,97.0L1060.0,99.3L1060.0,96.3L1060.0,94.5L1060.0,92.0L1060.0,89.7L1060.0,88.4L1060.0,86.9L1060.0,85.6L1060.0,82.7L1060.0,79.7L1060.0,76.7L1060.0,75.0L1060.0,72.4L1060.0,68.6L1060.0,67.4L1060.0,65.5L1060.0,63.4L1060.0,61.6L1060.0,60.2L1060.0,57.4L1060.0,56.0L1060.0,54.6L1060.0,52.9L1060.0,51.1L1060.0,49.4L1060.0,47.6L1060.0,44.7L1060.0,42.3L1060.0,41.0L1060.0,38.1L1060.0,35.2L1060.0,33.1L1060.0,30.4L1060.0,28.1L1060.0,26.8L1060.0,28.0L1060.0,31.1L1060.0,29.5L1060.0,28.1L1060.0,24.2L1060.0,22.7L1060.0,19.0L1060.0,15.9L1060.0,12.1L1060.0,10.3L1060.0,7.6L1060.0,5.9L1060.0,3.3L1060.0,4.6L1060.0,6.4L1060.0,3.5L1060.0,0.4L1060.0,2.2L1060.0,5.0L1060.0,7.3L1060.0,4.2L1060.0,2.1L1060.0,-1.0L1060.0,-2.5L1060.0,-6.3L1060.0,-8.0L1060.0,-9.2L1060.0,-12.9L1060.0,-15.0L1060.0,-17.9L1060.0,-19.6L1060.0,-21.7L1060.0,-23.5L1060.0,-34.7L1060.0,-38.5L1060.0,-41.2L1060.0,-42.7L1060.0,-45.9L1060.0,-47.4L1060.0,-44.5L1060.0,-46.3L1060.0,-48.3L1060.0,-50.3L1060.0,-53.8L1060.0,-51.9L1060.0,-49.6L1060.0,-48.2L1060.0,-46.6L1060.0,-45.1L1060.0,-43.7L1060.0,-36.8L1060.0,-34.2L1060.0,-31.1L1060.0,-29.5L1060.0,-27.9L1060.0,-25.7L1060.0,-24.0L1060.0,-22.4L1060.0,-20.7L1060.0,-21.9L1060.0,-24.8L1060.0,-29.9L1060.0,-32.9L1060.0,-34.2L1060.0,-36.3L1060.0,-37.8L1060.0,-39.2L1060.0,-41.0L1060.0,-43.7L1060.0,-45.4L1060.0,-47.3L1060.0,-49.7L1060.0,-52.6L1060.0,-55.2L1060.0,-57.6L1060.0,-60.0L1060.0,-53.6L1060.0,-51.3L1060.0,-47.3L1060.0,-44.8L1060.0,-42.1L1060.0,-38.0L1060.0,-33.0L1060.0,-31.5L1060.0,-30.1L1060.0,-28.8L1060.0,-32.2L1060.0,-30.6L1060.0,-23.0L1060.0,-18.6L1060.0,-16.9L1060.0,-11.4L1060.0,-8.4L1060.0,-4.9L1060.0,-2.6L1060.0,-1.2L1060.0,2.6L1060.0,5.1L1060.0,6.8L1060.0,8.1L1060.0,9.7L1060.0,13.6L1060.0,18.0L1060.0,19.5L1060.0,21.5L1060.0,23.2L1060.0,20.1L1060.0,17.5L1060.0,13.6L1060.0,10.2L1060.0,8.7L1060.0,4.5L1060.0,7.4L1060.0,10.8L1060.0,13.1L1060.0,14.6L1060.0,12.7L1060.0,14.7L1060.0,16.0L1060.0,18.4L1060.0,22.1L1060.0,25.1L1060.0,26.4L1060.0,28.4L1060.0,31.5L1060.0,30.2L1060.0,28.9L1060.0,31.4L1060.0,34.0L1060.0,36.1L1060.0,37.4L1060.0,39.4L1060.0,40.8L1060.0,42.4L1060.0,44.7L1060.0,49.4L1060.0,51.0L1060.0,52.5L1060.0,51.0L1060.0,48.8L1060.0,50.7L1060.0,53.5L1060.0,55.7L1060.0,57.7L1060.0,59.3L1060.0,60.9L1060.0,62.2L1060.0,63.5L1060.0,65.0L1060.0,68.2L1060.0,71.2L1060.0,72.8L1060.0,77.8L1060.0,80.6L1060.0,85.0L1060.0,87.7L1060.0,92.2L1060.0,94.5L1060.0,95.8L1060.0,99.1L1060.0,100.5L1060.0,103.3L1060.0,111.5L1060.0,115.5L1060.0,117.6L1060.0,121.6L1060.0,128.4L1060.0,134.4L1060.0,139.0L1060.0,141.2L1060.0,143.9L1060.0,146.5L1060.0,149.4L1060.0,151.8L1060.0,156.2L1060.0,157.6L1060.0,160.4L1060.0,162.0L1060.0,164.5L1060.0,166.7L1060.0,169.8L1060.0,165.6L1060.0,160.9L1060.0,159.6L1060.0,162.7L1060.0,164.3L1060.0,163.1L1060.0,161.2L1060.0,163.9L1060.0,166.6L1060.0,168.5L1060.0,171.8L1060.0,175.7L1060.0,180.1L1060.0,184.4L1060.0,187.1L1060.0,191.0L1060.0,192.2L1060.0,194.4L1060.0,196.8L1060.0,200.7L1060.0,203.0L1060.0,205.1L1060.0,208.1L1060.0,212.1L1060.0,207.6L1060.0,209.6L1060.0,216.3L1060.0,218.6L1060.0,221.6L1060.0,226.9L1060.0,228.2L1060.0,229.6L1060.0,226.4L1060.0,229.4L1060.0,239.0L1060.0,236.6L1060.0,239.1L1060.0,242.4L1060.0,243.9L1060.0,246.7L1060.0,248.9L1060.0,250.4L1060.0,252.3L1060.0,255.6L1060.0,259.7L1060.0,261.8L1060.0,263.4L1060.0,260.3L1060.0,261.8L1060.0,265.4L1060.0,268.6L1060.0,270.2L1060.0,272.6L1060.0,276.5L1060.0,278.0L1060.0,279.4L1060.0,280.9L1060.0,283.6L1060.0,285.5L1060.0,288.0L1060.0,289.7L1060.0,292.4L1060.0,294.0L1060.0,299.7L1060.0,302.5L1060.0,305.5L1060.0,307.7L1060.0,305.1L1060.0,303.7L1060.0,302.1L1060.0,300.7L1060.0,302.7L1060.0,303.9L1060.0,302.4L1060.0,303.9L1060.0,305.3L1060.0,306.8L1060.0,308.8L1060.0,311.4L1060.0,313.6L1060.0,315.5L1060.0,317.2L1060.0,320.1L1060.0,322.1L1060.0,320.7L1060.0,324.2L1060.0,325.8L1060.0,328.3L1060.0,331.7L1060.0,334.6L1060.0,338.7L1060.0,340.0L1060.0,338.1L1060.0,340.9L1060.0,342.2L1060.0,344.3L1060.0,347.1L1060.0,350.4L1060.0,352.4L1060.0,354.6L1060.0,356.4L1060.0,360.7L1060.0,362.0L1060.0,360.6L1060.0,362.4L1060.0,364.5L1060.0,365.8L1060.0,367.3L1060.0,368.7L1060.0,370.9L1060.0,374.6L1060.0,377.2L1060.0,379.1L1060.0,381.9L1060.0,383.6L1060.0,387.7L1060.0,385.3L1060.0,387.0L1060.0,388.3L1060.0,387.0L1060.0,392.2L1060.0,394.1L1060.0,395.6L1060.0,397.0L1060.0,398.3L1060.0,399.6L1060.0,404.3L1060.0,405.9L1060.0,407.5L1060.0,409.8L1060.0,408.4L1060.0,410.8L1060.0,412.0L1060.0,410.5L1060.0,412.3L1060.0,414.2L1060.0,411.5L1060.0,413.8L1060.0,417.2L1060.0,415.7L1060.0,417.9L1060.0,419.6L1060.0,421.3L1060.0,422.6L1060.0,421.3L1060.0,419.9L1060.0,418.4L1060.0,417.1L1060.0,415.0L1060.0,411.6L1060.0,409.8L1060.0,408.2L1060.0,405.3L1060.0,403.9L1060.0,402.4L1060.0,401.0L1060.0,403.0L1060.0,404.6L1060.0,406.1L1060.0,407.4L1060.0,410.1L1060.0,411.8L1060.0,415.4L1060.0,420.5L1060.0,422.0L1060.0,423.4L1060.0,425.4L1060.0,427.0L1060.0,429.0L1060.0,425.8L1060.0,428.2L1060.0,433.1L1060.0,434.6L1060.0,432.9L1060.0,435.2L1060.0,437.4L1060.0,434.6L1060.0,433.4L1060.0,431.9L1060.0,433.6L1060.0,436.8L1060.0,438.4L1060.0,436.6L1060.0,439.0L1060.0,440.7L1060.0,442.0L1060.0,443.3L1060.0,445.3L1060.0,446.8L1060.0,450.9L1060.0,452.6L1060.0,449.6L1060.0,451.7L1060.0,453.7L1060.0,457.4L1060.0,459.9L1060.0,462.2L1060.0,464.0L1060.0,465.9L1060.0,467.2L1060.0,471.4L1060.0,472.9L1060.0,475.8L1060.0,477.4L1060.0,475.5L1060.0,474.2L1060.0,472.6L1060.0,468.6L1060.0,466.2L1060.0,464.3L1060.0,462.7L1060.0,460.6L1060.0,457.0L1060.0,454.8L1060.0,452.2L1060.0,449.3L1060.0,445.4L1060.0,443.3L1060.0,440.3L1060.0,443.9L1060.0,445.4L1060.0,446.9L1060.0,445.2L1060.0,443.7L1060.0,442.5L1060.0,440.8L1060.0,438.8L1060.0,437.6L1060.0,436.4L1060.0,434.9L1060.0,438.4L1060.0,440.3L1060.0,442.0L1060.0,440.1L1060.0,441.6L1060.0,443.3L1060.0,444.7L1060.0,447.4L1060.0,449.3L1060.0,450.7L1060.0,453.1L1060.0,454.9L1060.0,456.9L1060.0,459.8L1060.0,458.4L1060.0,459.7L1060.0,458.4L1060.0,463.6L1060.0,465.5L1060.0,471.1L1060.0,474.8L1060.0,477.6L1060.0,479.8L1060.0,485.6L1060.0,487.0L1060.0,496.5L1060.0,499.7L1060.0,502.1L1060.0,504.4L1060.0,508.9L1060.0,510.8L1060.0,513.2L1060.0,518.3L1060.0,521.9L1060.0,523.8L1060.0,525.7L1060.0,530.7L1060.0,532.3L1060.0,537.8L1060.0,540.7L1060.0,542.7L1060.0,546.8L1060.0,545.6L1060.0,548.4L1060.0,556.3L1060.0,560.3L1060.0,564.7L1060.0,569.0L1060.0,571.8L1060.0,575.9L1060.0,577.9L1060.0,580.0L1060.0,582.3L1060.0,584.5L1060.0,586.6L1060.0,588.8L1060.0,590.7L1060.0,592.4L1060.0,596.6L1060.0,599.6L1060.0,604.4L1060.0,607.1L1060.0,608.7L1060.0,610.0L1060.0,615.3L1060.0,620.1L1060.0,625.5L1060.0,627.8L1060.0,632.2L1060.0,636.8L1060.0,639.8L1060.0,643.0L1060.0,644.5L1060.0,651.0L1060.0,653.5L1060.0,651.0L1060.0,658.2L1060.0,661.9L1060.0,666.6L1060.0,668.2L1060.0,673.4L1060.0,675.3L1060.0,681.7L1060.0,684.9L1060.0,683.0L1060.0,680.8L1060.0,683.6L1060.0,690.5L1060.0,699.1L1060.0,701.2L1060.0,703.5L1060.0,702.2L1060.0,700.8L1060.0,703.4L1060.0,705.4L1060.0,707.2L1060.0,708.5L1060.0,710.1L1060.0,711.8L1060.0,715.4L1060.0,718.9L1060.0,722.6L1060.0,726.9L1060.0,729.8L1060.0,735.6L1060.0,740.0L1060.0,741.9L1060.0,744.2L1060.0,742.3L1060.0,740.0L1060.0,738.0L1060.0,743.1L1060.0,744.7L1060.0,743.3L1060.0,740.5L1060.0,742.4L1060.0,744.8L1060.0,747.0L1060.0,748.7L1060.0,750.9L1060.0,753.4L1060.0,755.2L1060.0,757.6L1060.0,749.0L1060.0,751.1L1060.0,759.8L1060.0,762.6L1060.0,764.7L1060.0,766.9L1060.0,763.7L1060.0,756.0L1060.0,763.8L1060.0,765.9L1060.0,768.4L1060.0,769.9L1060.0,771.2L1060.0,779.4L1060.0,783.0L1060.0,787.3L1060.0,789.7L1060.0,791.9L1060.0,793.2L1060.0,788.8L1060.0,787.3L1060.0,776.9L1060.0,765.6L1060.0,759.9L1060.0,758.5L1060.0,756.5L1060.0,755.1L1060.0,753.2L1060.0,751.9L1060.0,749.5L1060.0,747.8L1060.0,745.8L1060.0,743.9L1060.0,740.4L1060.0,737.6L1060.0,739.3L1060.0,741.3L1060.0,738.7L1060.0,736.9L1060.0,735.5L1060.0,731.0L1060.0,726.4L1060.0,725.1L1060.0,728.6L1060.0,730.1L1060.0,726.0L1060.0,722.3L1060.0,718.1L1060.0,715.6L1060.0,712.1L1060.0,708.9L1060.0,707.2L1060.0,709.0L1060.0,707.2L1060.0,704.1L1060.0,700.7L1060.0,697.0L1060.0,695.6L1060.0,698.1L1060.0,696.2L1058.6,694.2L1056.5,690.4L1055.7,692.1L1053.4,689.1L1050.9,686.7L1048.6,685.8L1047.2,685.1L1045.9,683.8L1043.1,682.5L1036.1,684.4L1027.3,682.9L1023.8,684.3L1022.4,683.4L1021.6,681.8L1022.4,679.0L1022.6,673.1L1023.7,669.0L1023.2,665.9L1023.7,664.4L1024.1,662.4L1022.7,661.6L1016.4,660.0L1015.1,658.8L1013.4,660.2L1005.9,661.0L1003.1,662.2L1000.4,664.6L999.8,667.5L1001.3,669.5L1002.2,672.9L999.6,680.2L999.1,682.4L1000.1,691.5L999.7,696.4L998.3,699.8L995.9,702.8L995.0,707.8L993.1,710.2L990.7,715.5L989.0,722.2L987.9,725.3L987.2,731.0L982.1,739.6L980.9,744.5L979.1,746.4L979.8,747.8L979.9,750.2L979.2,756.7L979.0,762.1L979.8,765.0L982.2,770.8L981.6,772.4L981.3,774.8L983.4,775.9L984.8,776.2L993.1,773.5L995.9,774.2L996.9,776.7L997.6,778.9L999.0,790.8L999.7,793.0L1001.4,795.1L1003.2,797.4L1004.0,796.1L1005.7,797.4L1007.0,801.7L1011.3,823.9L1012.6,826.8L1013.6,829.7L1011.0,828.3L1010.3,823.3L1009.5,821.3L1007.1,821.0L1008.1,818.5L1007.9,816.6L1006.4,815.0L1004.0,816.2L1004.0,819.7L1005.1,822.4L1009.3,828.3L1010.6,830.8L1012.2,831.5L1014.7,831.1L1017.5,833.7L1019.8,836.0L1025.4,839.6L1028.9,839.2L1032.5,838.3L1035.0,838.6L1037.4,839.5L1040.4,842.5L1045.0,850.0L1052.5,856.3L1056.9,857.3L1058.5,858.2L1060.0,866.5L1060.0,872.4L1060.0,874.6L1060.0,878.8L1060.0,882.7L1060.0,893.8L1060.0,898.7L1060.0,906.2L1060.0,917.4L1060.0,923.0L1060.0,925.6L1060.0,929.7L1060.0,933.5L1060.0,936.7L1060.0,945.5L1060.0,948.1L1060.0,949.8L1060.0,955.0L1060.0,957.0L1060.0,960.0L1053.6,960.0L1047.2,958.6L1044.5,955.2L1038.0,952.2L1035.2,948.7L1033.8,948.1L1032.4,946.8L1033.9,943.4L1033.3,939.9L1032.5,936.9L1027.9,931.0L1025.6,926.9L1021.3,922.8L1019.5,920.4L1017.9,917.7L1018.9,916.7L1019.0,914.1L1016.5,910.7L1015.4,906.7L1015.4,899.2L1011.8,888.6L1008.8,873.9L1009.4,868.8L1008.6,863.3L1006.6,857.9L1004.0,854.1L1003.0,850.9L996.7,842.6L992.4,839.2L993.0,833.0L991.7,831.8L990.1,831.7L988.8,830.0L989.9,826.3L988.2,827.0L985.9,826.8L984.0,825.8L982.5,820.7L981.6,819.2L979.6,816.5L976.9,816.5L976.1,815.2L976.3,811.9L974.3,809.9L971.8,808.3L969.7,807.3L967.6,802.0L965.9,800.7L964.5,799.6L962.5,800.3L961.9,802.2L960.5,804.1L959.0,803.9L957.6,802.8L956.0,797.5L955.7,794.2L956.0,788.2L958.1,782.8L959.3,774.1L961.1,768.6L962.3,766.8L964.0,759.4L967.6,749.8L964.1,754.0L963.0,752.1L962.4,750.1L963.1,745.5L961.6,736.8L962.5,735.6L965.0,731.7L966.9,728.4L967.1,724.4L968.6,721.5L968.3,719.1L968.3,716.3L968.7,714.0L968.5,712.1L969.8,710.1L971.9,708.6L970.1,707.0L967.3,708.6L965.9,708.1L965.6,706.4L966.0,704.6L967.2,702.2L967.2,699.8L966.6,697.6L967.4,695.0L965.8,695.0L965.5,693.0L967.0,691.7L965.6,689.2L966.6,686.5L966.6,683.2L965.9,680.3L965.9,678.2L964.9,674.5L964.4,669.7L962.2,666.2L960.5,661.0L956.1,654.3L956.2,651.4L956.0,648.9L955.0,647.7L953.7,656.6L952.8,654.9L952.5,649.9L951.8,647.5L952.5,642.8L950.0,638.1L949.4,634.7L947.7,629.5L948.2,628.4L950.5,629.5L948.4,626.5L946.7,627.2L945.3,624.0L945.0,615.2L943.6,611.9L944.4,608.5L942.8,596.6L939.6,592.7L940.2,589.3L941.0,586.3L940.8,580.9L941.6,579.2L943.1,577.9L941.7,578.3L940.5,578.7L937.6,579.0L934.4,579.1L933.3,575.1L931.7,573.2L930.3,569.1L929.5,564.6L927.5,561.8L926.9,560.7L924.3,557.7L921.3,555.4L921.9,557.0L922.7,558.0L921.3,560.8L922.7,565.4L921.5,568.4L920.3,572.2L919.1,574.0L915.6,578.0L912.7,579.3L910.8,579.6L909.1,579.2L907.1,577.1L906.6,575.4L906.2,572.6L904.7,572.5L905.9,576.2L905.9,577.9L908.1,581.2L903.4,584.0L902.0,583.7L900.8,585.5L894.1,588.6L892.8,591.2L892.0,593.8L888.9,597.6L884.7,600.7L882.5,599.8L882.7,596.4L884.1,593.6L883.7,590.6L883.3,592.3L880.6,596.5L879.4,597.9L877.0,597.5L873.6,598.1L872.3,593.8L872.3,592.2L872.1,590.8L872.4,589.4L871.5,590.4L871.2,592.3L870.0,594.0L866.5,595.8L866.4,593.5L866.3,591.4L867.0,589.6L866.9,586.7L868.0,582.4L867.9,581.0L867.6,579.4L867.0,581.7L866.6,584.1L864.7,585.4L862.4,588.2L861.0,590.6L857.5,593.0L855.6,592.8L855.4,589.8L856.8,579.2L858.2,577.8L858.8,575.9L860.0,569.8L861.3,567.5L861.8,562.6L864.1,557.9L864.7,550.9L864.0,547.4L862.4,544.0L860.8,533.8L856.6,525.6L856.3,522.8L854.3,519.5L856.1,519.3L852.3,516.4L851.8,515.2L851.0,508.4L851.1,504.6L850.0,507.4L848.5,508.4L849.2,512.4L848.2,515.0L845.0,513.4L842.6,511.6L840.0,507.2L837.3,502.3L839.5,501.5L843.2,505.1L845.6,505.9L847.2,505.0L849.1,503.4L850.0,500.4L849.0,499.3L847.2,498.7L846.0,497.9L844.2,495.9L843.5,493.5L841.7,492.6L840.3,491.4L841.5,489.3L842.7,487.7L839.5,487.8L836.0,485.1L834.1,483.8L831.2,483.5L828.9,484.2L830.0,488.1L829.8,489.4L828.2,489.2L825.0,483.3L826.0,481.8L827.4,480.5L825.4,480.3L826.7,475.2L825.5,476.0L824.8,477.6L822.1,481.2L820.7,480.6L819.8,479.6L821.1,477.7L822.3,476.2L821.3,474.2L819.7,472.7L818.4,470.2L818.3,473.1L818.1,477.4L815.2,472.7L809.5,466.0L808.1,464.0L806.2,461.5L804.9,458.8L801.4,453.7L800.3,444.5L800.2,439.9L797.8,434.6L796.2,427.2L795.6,425.2L796.4,422.9L794.9,423.4L793.4,420.4L792.3,417.8L788.2,412.3L787.1,409.9L787.0,407.6L785.2,409.9L782.8,411.6L780.4,414.1L778.8,414.9L773.6,415.3L770.7,412.0L766.4,403.8L765.8,401.9L766.4,397.1L765.4,392.5L765.4,390.1L765.1,388.5L764.0,390.0L764.2,391.7L763.9,393.1L760.2,392.8L756.7,392.2L759.8,394.6L763.1,395.1L764.8,397.3L765.0,398.9L764.9,400.8L763.2,402.2L761.7,403.0L761.9,404.8L763.8,407.0L761.5,407.6L760.9,409.1L760.9,411.1L762.0,413.0L762.5,414.3L762.2,415.5L763.3,416.9L764.9,419.7L765.4,421.6L764.7,424.4L763.8,425.5L762.4,426.6L758.9,430.1L757.2,434.1L755.8,436.0L754.0,436.4L751.8,434.5L751.8,432.5L752.2,430.9L755.2,427.2L753.6,427.7L751.7,428.8L748.9,430.8L748.0,428.3L747.4,426.0L747.3,423.1L749.6,418.8L747.0,421.0L746.3,423.6L746.6,426.7L746.3,429.0L745.3,431.9L743.9,433.6L741.7,434.7L740.7,436.4L739.2,437.7L739.2,435.2L738.7,431.9L737.1,424.0L736.7,425.7L737.6,430.6L737.5,433.7L736.3,436.2L733.8,438.9L732.0,439.3L729.2,437.2L727.3,434.8L727.0,431.0L726.3,428.9L725.7,433.1L723.7,433.1L725.5,435.9L726.0,437.9L726.3,440.7L724.2,441.1L722.7,440.8L721.4,438.3L720.9,440.5L718.6,442.6L717.8,441.6L717.3,438.6L718.5,431.3L717.7,429.9L716.5,429.6L716.0,428.1L714.2,435.9L715.0,439.1L714.6,440.6L711.1,441.8L707.6,438.9L706.3,441.6L703.1,441.2L701.4,439.7L702.5,437.0L704.5,430.5L704.9,427.7L702.2,425.5L699.9,424.3L698.5,421.3L699.0,424.5L700.3,425.7L702.1,426.5L704.0,428.1L702.6,430.1L701.3,431.4L698.7,436.1L695.6,438.8L692.0,440.8L680.0,443.7L677.5,444.9L673.9,448.5L671.5,452.0L671.1,455.5L672.4,459.3L673.5,465.3L674.4,466.5L673.1,468.6L670.9,470.9L669.1,474.0L669.2,475.7L668.8,476.9L662.5,480.7L661.1,482.9L659.4,485.2L657.3,483.9L657.8,485.7L657.0,487.5L655.4,488.2L646.3,491.0L639.4,493.6L637.4,493.5L639.0,492.0L638.9,488.9L637.6,488.4L631.2,491.9L629.1,495.6L630.7,496.1L634.3,494.0L635.9,494.6L630.6,498.6L619.3,508.9L618.7,511.0L617.3,513.3L615.2,515.4L611.6,520.7L604.5,528.5L602.6,531.4L591.4,537.4L589.3,539.2L584.7,545.0L580.0,549.8L574.4,553.8L564.8,558.8L559.0,563.6L557.2,566.8L557.7,569.5L558.7,570.9L558.5,574.1L556.5,578.1L553.5,580.1L544.0,584.3L542.8,584.2L535.0,583.3L532.2,584.1L531.0,586.1L528.3,594.2L525.8,596.4L524.8,598.4L524.5,599.7L522.9,599.7L521.6,599.1L519.5,596.8L517.7,596.2L516.2,596.0L509.6,598.8L507.3,601.0L502.5,611.4L501.3,618.2L502.5,625.6L504.1,631.5L504.5,634.2L504.3,637.7L503.4,639.4L502.8,641.4L503.6,645.5L505.6,650.9L506.1,653.2L506.1,655.6L507.7,661.0L506.6,660.0L505.8,657.8L503.9,654.8L501.6,657.7L502.9,659.8L507.3,662.3L508.6,664.3L505.7,682.4L503.6,688.9L500.9,693.1L499.5,694.7L496.5,701.4L494.3,709.4L493.9,712.5L494.8,716.0L493.7,718.0L492.3,719.6L495.0,718.9L495.9,720.8L496.2,722.7L496.3,734.2L496.0,746.3L493.9,746.8L491.7,746.9L489.7,746.6L488.3,746.1L484.8,746.7L482.9,748.1L481.3,750.3L481.4,754.0L474.9,763.5L473.5,766.7L473.0,769.7L473.8,771.3L475.5,772.9L477.7,773.6L481.9,774.3L483.9,775.1L485.3,776.8L480.3,775.0L474.5,774.7L460.5,779.1L456.9,782.2L454.8,784.9L453.4,791.0L453.2,795.1L451.5,798.5L444.3,803.8L439.7,805.4L437.9,806.8L432.5,805.0L426.6,800.4L424.2,797.9L415.4,786.1L413.8,784.6L412.1,779.5L411.8,777.6L410.5,776.3L408.1,769.7L407.3,763.7L406.1,756.9L408.6,759.6L409.3,762.9L409.4,767.4L411.5,767.5L408.7,757.1L406.2,754.5L404.9,752.7L404.8,750.6L403.1,746.2L402.4,744.1L398.1,733.8L396.1,726.5L393.1,718.3L391.2,715.4L388.1,709.1L385.6,706.1L382.9,702.2L380.7,700.4L379.9,699.5L373.6,685.8L371.7,678.3L370.1,674.7L369.3,672.0L367.1,660.4L367.0,658.3L366.8,656.1L365.2,651.2L362.5,645.9L361.7,642.6L361.7,641.3L359.9,636.1L359.6,633.8L358.4,631.6L357.0,629.6L355.6,628.0L352.2,622.8L351.0,621.5L348.7,618.1L347.1,611.9L345.0,609.5L348.3,609.5L346.3,607.1L345.3,605.6L344.3,604.7L345.8,602.4L343.3,602.4L342.0,601.0L340.2,596.7L336.9,591.7L336.3,589.1L333.4,580.8L331.0,560.9L328.7,552.0L328.9,549.5L326.2,541.8L324.8,536.6L324.3,532.3L323.6,529.4L322.9,523.7L321.9,521.9L322.5,518.3L324.4,514.3L325.1,511.7L324.3,508.2L322.5,511.9L320.9,513.0L320.1,510.2L320.1,506.4L320.3,504.2L324.7,504.8L319.7,502.5L319.1,501.2L320.0,498.3L318.2,496.7L317.4,491.9L316.7,489.9L317.7,483.2L322.0,470.2L322.3,467.2L322.0,463.0L321.0,459.7L320.6,456.1L318.8,454.9L317.3,453.6L315.6,448.3L317.2,446.6L318.4,445.7L316.7,446.1L315.3,445.9L317.9,443.5L320.3,441.7L325.6,439.5L327.8,438.1L324.5,439.4L321.0,439.8L313.6,439.6L314.8,434.7L316.1,433.1L317.5,432.2L315.4,432.4L313.1,432.1L313.8,427.1L315.7,426.0L317.7,425.8L320.2,425.1L317.5,424.3L314.8,423.9L311.4,424.7L308.3,424.1L304.6,424.1L306.1,424.8L307.7,426.3L306.9,429.0L306.1,430.7L304.0,431.8L302.4,433.6L301.9,435.1L300.9,436.2L302.6,437.0L304.3,437.5L305.3,438.7L306.4,440.5L306.4,444.1L301.9,452.3L300.4,454.2L289.3,459.2L284.9,461.9L275.6,465.4L272.0,466.1L268.0,465.4L262.1,462.7L253.2,455.8L250.9,453.6L243.7,444.7L238.5,440.1L234.6,435.7L229.8,431.6L225.2,426.1L224.2,423.6L224.6,421.0L226.3,419.6L228.3,420.2L229.9,422.4L231.0,423.3L238.7,420.4L241.4,420.5L243.2,418.9L245.5,419.2L250.1,416.6L252.1,416.5L254.4,416.0L258.2,409.4L261.0,405.3L262.8,404.4L262.2,402.0L260.9,402.4L259.9,403.6L259.2,405.2L256.3,405.2L254.8,405.4L253.0,405.9L246.2,408.3L243.5,410.5L241.6,410.9L230.9,408.5L220.4,403.0L216.0,399.3L213.2,394.6L210.4,389.0L211.3,387.5L215.7,384.1L219.4,381.5L216.1,382.7L212.4,384.3L210.6,385.4L208.6,387.8L205.9,388.4L204.8,384.8L204.1,381.3L203.7,383.0L202.9,384.1L201.7,382.4L200.0,382.2L198.8,382.1L196.5,380.1L195.5,382.1L191.7,382.6L191.2,381.1L191.1,379.6L189.1,380.7L187.6,379.1L186.9,377.0L185.7,375.7L184.1,375.0L182.7,372.8L182.6,370.4L182.2,367.6L179.3,357.1L177.5,356.1L167.6,354.3L167.1,352.4L167.7,347.5L167.5,344.4L164.2,340.3L163.3,337.5L160.7,335.0L158.1,334.3L155.5,334.6L154.1,335.6L153.3,337.2L158.9,336.8L160.2,337.4L161.7,338.5L160.1,338.5L158.2,338.0L155.9,338.0L147.1,339.2L142.0,340.9L135.2,340.4L126.5,342.1L119.4,342.2L116.5,345.6L114.9,345.0L113.6,344.1L103.8,341.5L103.1,340.4L101.5,339.7L99.7,341.1L98.4,341.3L93.0,340.1L88.9,341.0L87.4,342.5L87.3,344.8L82.1,344.4L79.3,343.7L75.4,344.5L66.6,343.4L64.3,343.7L61.1,345.2L59.8,346.4L57.9,346.9L56.2,345.2L55.0,344.5L53.8,345.0L52.2,346.3L47.7,347.0L43.6,346.8L38.3,345.3L37.3,346.4L35.3,347.8L31.1,346.7L27.7,345.6L16.6,342.9L15.4,341.6L14.7,339.4L12.8,338.7L10.0,342.1L0.6,340.2L-2.6,340.8L-4.5,339.7L-9.6,339.7L-13.6,337.5L-19.3,339.0L-23.8,339.3L-30.1,335.6L-36.7,334.5L-42.1,334.9L-44.9,334.6L-49.4,333.2L-51.6,331.9L-55.1,332.9L-56.7,331.0L-60.0,329.2L-60.0,325.7L-60.0,322.6L-60.0,319.3L-60.0,313.5L-60.0,305.2L-60.0,302.0L-60.0,299.1L-60.0,296.7L-60.0,294.2L-60.0,291.2L-60.0,292.7L-60.0,295.6L-60.0,297.2L-60.0,301.2L-60.0,302.8L-60.0,308.6L-60.0,309.9L-60.0,307.7L-60.0,304.8L-60.0,300.6L-60.0,298.1L-60.0,296.5L-60.0,292.8L-60.0,287.9L-60.0,286.0L-60.0,283.3L-60.0,280.0L-60.0,277.3L-60.0,274.4L-60.0,272.1L-60.0,266.1L-60.0,263.7L-60.0,257.9L-60.0,255.8L-60.0,250.1L-60.0,248.5L-60.0,246.2L-60.0,244.6L-60.0,242.6L-60.0,241.0L-60.0,239.5L-60.0,236.9L-60.0,233.5L-60.0,231.3L-60.0,227.9L-60.0,224.4L-60.0,219.1L-60.0,217.8L-60.0,214.4L-60.0,210.4L-60.0,214.9L-60.0,212.2L-60.0,207.4L-60.0,205.6L-60.0,203.0L-60.0,205.0L-60.0,206.9L-60.0,209.2L-60.0,212.4L-60.0,214.0L-60.0,216.4L-60.0,214.6L-60.0,216.2L-60.0,220.1L-60.0,223.4L-60.0,226.0L-60.0,227.2L-60.0,229.5L-60.0,231.4L-60.0,232.8L-60.0,235.2L-60.0,237.0L-60.0,243.2L-60.0,245.3L-60.0,249.1L-60.0,251.0L-60.0,252.6L-60.0,255.0L-60.0,257.5L-60.0,260.1L-60.0,266.1L-60.0,270.7L-60.0,272.4L-60.0,275.0L-60.0,277.1L-60.0,279.6L-60.0,281.8L-60.0,283.3L-60.0,284.8L-60.0,288.2L-60.0,291.7L-60.0,297.8L-60.0,301.2L-60.0,305.7L-60.0,307.1L-60.0,309.4L-60.0,311.3L-60.0,312.6L-60.0,315.2L-60.0,320.8L-60.0,324.6L-60.0,327.7L-60.0,330.1L-60.0,333.7L-60.0,335.3L-60.0,339.1L-60.0,342.3L-60.0,348.2L-60.0,351.5L-60.0,354.0L-60.0,356.2L-60.0,354.6L-60.0,345.7L-60.0,339.8L-60.0,338.5L-60.0,337.1L-60.0,334.0L-60.0,331.0L-60.0,324.1L-60.0,321.4L-60.0,319.4L-60.0,323.3L-60.0,326.2L-60.0,329.5L-60.0,332.1L-60.0,336.4L-60.0,338.3L-60.0,340.0L-60.0,342.9L-60.0,346.5L-60.0,349.1L-60.0,351.5L-60.0,353.5L-60.0,359.5L-60.0,361.1L-60.0,363.2L-60.0,364.6L-60.0,368.3L-60.0,369.8L-60.0,368.4L-60.0,370.7L-60.0,375.5L-60.0,377.2L-60.0,374.5L-60.0,372.9L-60.0,370.6L-60.0,367.8L-60.0,365.0L-60.0,363.2L-60.0,360.7L-60.0,358.2L-60.0,355.6L-60.0,349.4L-60.0,344.1L-60.0,342.4L-60.0,339.9L-60.0,337.1L-60.0,329.1L-60.0,325.8L-60.0,322.1L-60.0,318.0L-60.0,315.1L-60.0,317.9L-60.0,320.6L-60.0,328.8L-60.0,330.2L-60.0,333.0L-60.0,335.2L-60.0,350.0L-60.0,358.2L-60.0,364.8L-60.0,368.5L-60.0,373.4L-60.0,378.0L-60.0,379.6L-59.7,382.8L-54.4,384.0L-47.0,385.1L-41.9,387.6L-40.2,387.8L-37.5,387.0L-35.5,387.1L-30.7,390.5L-29.2,393.7L-27.2,395.4L-25.4,398.1L-24.3,400.9L-20.1,405.2L-17.2,410.0L-14.3,413.6L-11.6,415.8L-7.6,416.7L-4.4,417.7L-4.1,420.1L-4.4,423.2L-5.0,425.5L-8.0,430.0L-8.7,432.7L-12.1,437.3L-15.7,444.9L-17.4,446.6L-23.3,450.6L-27.6,455.3L-32.7,463.6L-36.6,471.8L-38.1,474.4L-41.3,474.9L-43.3,474.7L-44.8,473.9L-44.2,471.7L-43.9,469.2L-45.8,469.4L-47.4,470.0L-51.3,476.1L-53.5,478.8L-53.9,482.2L-54.9,486.6L-56.5,490.6L-57.1,494.0L-57.1,495.9L-56.0,500.6L-55.9,505.5L-55.2,508.4L-54.7,511.8L-56.5,512.9L-58.1,513.4L-60.0,513.8L-60.0,516.9L-60.0,519.0L-60.0,523.4L-60.0,534.8L-60.0,539.6L-60.0,541.0L-60.0,542.3L-60.0,550.4L-60.0,552.6L-60.0,554.2L-60.0,555.9L-60.0,557.6L-60.0,562.0L-60.0,565.2L-60.0,567.2L-60.0,565.4L-60.0,568.4L-60.0,570.1L-60.0,572.7L-60.0,575.7L-60.0,580.5L-60.0,582.6L-60.0,585.3L-60.0,588.6L-60.0,594.4L-60.0,599.6L-60.0,602.5L-60.0,604.4L-60.0,605.7L-60.0,607.8L-60.0,609.9L-60.0,614.1L-60.0,616.4L-60.0,619.1L-60.0,622.1L-60.0,624.2L-60.0,627.6L-60.0,629.9L-60.0,633.6L-60.0,637.5L-60.0,639.9L-60.0,643.8L-60.0,645.8L-60.0,647.2L-60.0,645.8L-60.0,648.3L-60.0,650.9L-60.0,656.2L-60.0,657.7L-60.0,659.3L-60.0,661.5L-60.0,662.9L-60.0,665.0L-60.0,667.8L-60.0,672.3L-60.0,674.1L-60.0,675.7L-60.0,679.0L-60.0,680.5L-60.0,679.0L-60.0,683.0L-60.0,684.7L-60.0,682.9L-60.0,681.0L-60.0,682.2L-60.0,678.4L-60.0,666.9L-60.0,656.8L-60.0,655.4L-60.0,650.9L-60.0,646.8L-60.0,641.6L-60.0,637.9L-60.0,634.1L-60.0,632.2L-60.0,626.3L-60.0,623.8L-60.0,621.8L-60.0,620.0L-60.0,616.6L-60.0,613.9L-60.0,611.4L-60.0,613.0L-60.0,611.4L-60.0,602.5L-60.0,592.3L-60.0,583.2L-60.0,581.0L-60.0,577.8L-60.0,575.6L-60.0,573.3L-60.0,571.6L-60.0,569.8L-60.0,567.3L-60.0,564.9L-60.0,562.9L-60.0,559.3L-60.0,554.5L-60.0,548.2L-60.0,542.3L-60.0,539.1L-60.0,532.4L-60.0,527.1L-60.0,521.0L-60.0,518.6L-60.0,515.8L-60.0,512.6L-60.0,510.1L-60.0,499.1L-60.0,497.3L-60.0,494.9L-60.0,493.0L-60.0,490.1L-60.0,485.5L-60.0,478.2L-60.0,474.8L-60.0,471.4L-60.0,465.5L-60.0,459.1L-60.0,450.0L-60.0,446.7L-60.0,444.4L-60.0,440.5L-60.0,437.5L-60.0,434.6L-60.0,430.5L-60.0,425.9L-60.0,423.5L-60.0,420.8L-60.0,415.4L-60.0,412.6L-60.0,410.7L-60.0,407.6L-60.0,404.7L-60.0,403.1L-60.0,399.2L-60.0,396.2L-60.0,389.4L-60.0,385.3L-60.0,379.9L-60.0,375.9L-60.0,374.1L-60.0,372.5L-60.0,370.1L-60.0,365.1L-60.0,360.9L-60.0,355.4L-60.0,353.9L-60.0,351.6L-60.0,348.5L-60.0,346.5L-60.0,342.7L-60.0,333.2L-60.0,331.9L-60.0,330.3L-60.0,326.2L-60.0,322.5L-60.0,320.7L-60.0,307.5L-60.0,302.9L-60.0,299.8L-60.0,294.7L-60.0,289.6L-60.0,284.9L-60.0,276.8L-60.0,268.7L-60.0,267.3L-60.0,265.6L-60.0,262.5L-60.0,256.0L-60.0,250.2L-60.0,233.1L-60.0,229.6L-60.0,227.7L-60.0,229.8L-60.0,235.4L-60.0,249.2L-60.0,260.0L-60.0,266.8L-60.0,269.2L-60.0,272.6L-60.0,276.0L-60.0,274.2L-60.0,268.3L-60.0,262.7L-60.0,259.1L-60.0,254.3L-60.0,250.9L-60.0,248.7L-60.0,243.3L-60.0,240.7L-60.0,235.0L-60.0,231.9L-60.0,230.5L-60.0,228.6L-60.0,221.1L-60.0,216.4L-60.0,217.7L-60.0,219.7L-60.0,222.5L-60.0,225.7L-60.0,228.3L-60.0,232.3L-60.0,234.0L-60.0,237.8L-60.0,242.9L-60.0,244.6L-60.0,248.4L-60.0,250.7L-60.0,252.6L-60.0,254.4L-60.0,257.7L-60.0,264.0L-60.0,268.3L-60.0,270.3L-60.0,272.4L-60.0,277.7L-60.0,280.2L-60.0,285.0L-60.0,287.4L-60.0,289.4L-60.0,291.6L-60.0,295.3L-60.0,306.1L-60.0,308.7L-60.0,322.9L-60.0,331.9L-60.0,338.6L-60.0,346.8L-60.0,364.7L-60.0,370.2L-60.0,373.3L-60.0,375.7L-60.0,379.2L-60.0,381.7L-60.0,383.4L-60.0,392.5L-60.0,397.1L-60.0,405.9L-60.0,408.5L-60.0,410.2L-60.0,411.5L-60.0,414.5L-60.0,420.8L-60.0,428.8L-60.0,431.0L-60.0,437.6L-60.0,442.6L-60.0,449.6L-60.0,453.4L-60.0,455.5L-60.0,457.3L-60.0,455.6L-60.0,458.9L-60.0,461.2L-60.0,465.6L-60.0,470.3L-60.0,474.7L-60.0,482.1L-60.0,491.0L-60.0,496.6L-60.0,509.8L-60.0,517.2L-60.0,519.0L-60.0,520.5L-60.0,524.3L-60.0,528.2L-60.0,530.3L-60.0,532.5L-60.0,537.3L-60.0,539.1L-60.0,554.7L-60.0,563.9L-60.0,573.5L-60.0,588.0L-60.0,595.3L-60.0,598.9L-60.0,605.8L-60.0,608.0L-60.0,614.4L-60.0,616.8L-60.0,614.7L-60.0,611.6L-60.0,609.0L-60.0,607.5L-60.0,609.6L-60.0,611.1L-60.0,614.3L-60.0,616.1L-60.0,619.8L-60.0,621.1L-60.0,623.3L-60.0,627.1L-60.0,630.4L-60.0,640.5L-60.0,647.6L-60.0,658.2L-60.0,663.4L-60.0,668.4L-60.0,673.6L-60.0,677.7L-60.0,679.3L-60.0,676.8L-60.0,678.8L-60.0,681.9L-60.0,683.2L-60.0,688.5L-60.0,691.2L-60.0,695.9L-60.0,698.6L-60.0,700.3L-60.0,701.9L-60.0,705.7L-60.0,708.1L-60.0,712.9L-60.0,714.4L-60.0,712.9L-60.0,714.5L-60.0,718.7L-60.0,727.1L-60.0,733.8L-60.0,740.1L-60.0,742.3L-60.0,737.5L-60.0,733.3L-60.0,735.2L-60.0,730.0L-60.0,725.3L-60.0,723.3L-60.0,725.0L-60.0,720.2L-60.0,718.8L-60.0,715.9L-60.0,713.7L-60.0,708.4L-60.0,705.8L-60.0,702.6L-60.0,705.3L-60.0,707.9L-60.0,710.3L-60.0,714.4L-60.0,719.0L-60.0,725.9L-60.0,737.3L-60.0,738.9L-60.0,740.5L-60.0,741.8L-60.0,743.3L-60.0,742.0L-60.0,740.7L-60.0,742.2L-60.0,743.6L-60.0,745.9L-60.0,748.1L-60.0,757.0L-60.0,762.8L-60.0,770.4L-60.0,775.4L-60.0,779.0L-60.0,786.1L-60.0,792.2L-60.0,795.2L-60.0,803.5L-60.0,809.9L-60.0,818.1L-60.0,823.2L-60.0,827.9L-60.0,836.1L-60.0,841.9L-60.0,851.8L-60.0,858.1L-60.0,876.5L-60.0,891.1L-60.0,903.4L-60.0,917.6L-60.0,936.0L-60.0,957.9L-60.0,960.0L-60.0,956.1L-60.0,950.9L-60.0,946.0L-60.0,941.6L-60.0,937.3L-60.0,935.4L-60.0,929.2L-60.0,926.9L-60.0,924.9L-60.0,922.2L-60.0,920.3L-60.0,917.7L-60.0,915.2L-60.0,916.7L-60.0,918.3L-60.0,916.8L-60.0,914.3L-60.0,910.5L-60.0,908.9L-60.0,907.1L-60.0,905.0L-60.0,901.8L-60.0,899.3L-60.0,901.9L-60.0,900.4L-60.0,896.5L-60.0,894.8L-60.0,891.8L-60.0,899.1L-60.0,901.7L-60.0,899.1L-60.0,900.7L-60.0,902.0L-60.0,900.3L-60.0,898.3L-60.0,900.2L-60.0,902.9L-60.0,906.0L-60.0,902.6L-60.0,899.4L-60.0,897.2L-60.0,899.2L-60.0,900.8L-60.0,904.1L-60.0,906.7L-60.0,904.5L-60.0,907.5L-60.0,905.1L-60.0,906.4L-60.0,908.9L-60.0,907.6L-60.0,906.3L-60.0,904.5L-60.0,899.3L-60.0,897.0L-60.0,894.1L-60.0,891.3L-60.0,886.3L-60.0,884.5L-60.0,882.8L-60.0,880.7L-60.0,878.3L-60.0,877.0L-60.0,879.0L-60.0,876.7L-60.0,875.4L-60.0,873.3L-60.0,870.7L-60.0,872.5L-60.0,870.2L-60.0,868.3L-60.0,862.1L-60.0,857.0L-60.0,853.4L-60.0,851.7L-60.0,850.5L-60.0,847.1L-60.0,848.5L-60.0,852.1L-60.0,854.0L-60.0,855.8L-60.0,858.9L-60.0,860.4L-60.0,863.0L-60.0,865.4L-60.0,867.9L-60.0,869.3L-60.0,874.5L-60.0,876.3L-60.0,879.2L-60.0,881.2L-60.0,883.7L-60.0,888.8L-60.0,890.3L-60.0,893.0L-60.0,896.2L-60.0,893.2L-60.0,891.7L-60.0,889.4L-60.0,887.6L-60.0,885.8L-60.0,884.3L-60.0,880.4L-60.0,885.5L-60.0,883.8L-60.0,881.9L-60.0,883.4L-60.0,885.1L-60.0,887.4L-60.0,889.5L-60.0,891.1L-60.0,896.2L-60.0,898.6L-60.0,902.1L-60.0,903.7L-60.0,906.6L-60.0,903.0L-60.0,900.8L-60.0,888.3L-60.0,883.3L-60.0,875.8L-60.0,860.7L-60.0,858.3L-60.0,855.9L-60.0,854.5L-60.0,850.3L-60.0,847.8L-60.0,844.3L-60.0,838.4L-60.0,833.5L-60.0,830.9L-60.0,826.6L-60.0,823.9L-60.0,821.2L-60.0,817.9L-60.0,815.6L-60.0,817.0L-60.0,814.5L-60.0,812.8L-60.0,807.4L-60.0,805.0L-60.0,803.5L-60.0,799.8L-60.0,797.3L-60.0,795.8L-60.0,797.4L-60.0,794.7L-60.0,793.2L-60.0,791.9L-60.0,793.3L-60.0,790.1L-60.0,788.2L-60.0,786.2L-60.0,784.7L-60.0,782.3L-60.0,780.6L-60.0,777.3L-60.0,776.0L-60.0,773.5L-60.0,772.2L-60.0,770.6L-60.0,767.3L-60.0,764.7L-60.0,761.0L-60.0,759.0L-60.0,756.9L-60.0,758.5L-60.0,755.8L-60.0,753.7L-60.0,751.9L-60.0,748.3L-60.0,740.1L-60.0,738.3L-60.0,735.2L-60.0,736.4L-60.0,735.0L-60.0,731.7L-60.0,729.9L-60.0,733.3L-60.0,729.6L-60.0,727.7L-60.0,724.2L-60.0,727.1L-60.0,723.8L-60.0,722.2L-60.0,720.8L-60.0,719.0L-60.0,717.3L-60.0,714.6L-60.0,712.6L-60.0,710.2L-60.0,711.4L-60.0,708.5L-60.0,707.0L-60.0,705.3L-60.0,703.5L-60.0,701.9L-60.0,703.3L-60.0,705.9L-60.0,707.4L-60.0,703.2L-60.0,701.6L-60.0,699.7L-60.0,697.2L-60.0,695.5L-60.0,691.5L-60.0,688.3L-60.0,686.9L-60.0,684.7L-60.0,683.1L-60.0,681.8L-60.0,684.3L-60.0,683.0L-60.0,677.2L-60.0,674.6L-60.0,672.4L-60.0,670.1L-60.0,664.9L-60.0,662.6L-60.0,661.3L-60.0,664.5L-60.0,665.9L-60.0,663.7L-60.0,661.7L-60.0,664.8L-60.0,661.7L-60.0,658.2L-60.0,655.5L-60.0,653.3L-60.0,651.4L-60.0,649.7L-60.0,648.2L-60.0,646.9L-60.0,644.6L-60.0,641.5L-60.0,636.2L-60.0,634.1L-60.0,629.8L-60.0,628.2L-60.0,629.6L-60.0,626.8L-60.0,622.3L-60.0,612.2L-60.0,600.4L-60.0,597.6L-60.0,585.5L-60.0,580.9L-60.0,577.0L-60.0,568.2L-60.0,561.0L-60.0,551.5L-60.0,542.3L-60.0,533.3L-60.0,525.2L-60.0,519.9L-60.0,512.2L-60.0,508.2L-60.0,504.6L-60.0,502.5L-60.0,501.2L-60.0,498.5L-60.0,491.1L-60.0,485.3L-60.0,481.5L-60.0,479.2L-60.0,474.1L-60.0,467.8L-60.0,466.2L-60.0,467.7L-60.0,469.1L-60.0,463.6L-60.0,456.1L-60.0,457.3L-60.0,463.6L-60.0,462.2L-60.0,448.2L-60.0,434.1L-60.0,427.1L-60.0,424.0L-60.0,422.4L-60.0,415.4L-60.0,408.9L-60.0,405.9L-60.0,403.6L-60.0,401.8L-60.0,398.3L-60.0,393.0L-60.0,389.5L-60.0,384.2L-60.0,381.7L-60.0,384.8L-60.0,386.4L-60.0,384.5L-60.0,381.7L-60.0,378.8L-60.0,375.5L-60.0,364.6L-60.0,362.7L-60.0,358.1L-60.0,354.0L-60.0,344.6L-60.0,339.6L-60.0,335.8L-60.0,328.7L-60.0,325.6L-60.0,319.2L-60.0,316.7L-60.0,312.4L-60.0,310.4L-60.0,306.2L-60.0,303.7L-60.0,300.0L-60.0,292.6L-60.0,284.9L-60.0,278.9L-60.0,275.8L-60.0,271.9L-60.0,270.2L-60.0,266.1L-60.0,261.3L-60.0,259.3L-60.0,255.4L-60.0,250.4L-60.0,244.3L-60.0,240.9L-60.0,232.4L-60.0,225.4L-60.0,220.9L-60.0,216.8L-60.0,212.8L-60.0,206.2L-60.0,203.6L-60.0,199.4L-60.0,196.3L-60.0,192.9L-60.0,186.9L-60.0,177.3L-60.0,169.6L-60.0,159.5L-60.0,155.3L-60.0,148.7L-60.0,146.3L-60.0,137.0L-60.0,129.8L-60.0,128.0L-60.0,124.7L-60.0,117.6L-60.0,112.4L-60.0,108.7L-60.0,104.3L-60.0,86.9L-60.0,62.5L-60.0,59.7L-60.0,57.6L-60.0,55.8L-60.0,57.8L-60.0,60.8L-60.0,64.3L-60.0,68.3L-60.0,73.3L-60.0,75.3L-60.0,73.3L-60.0,74.7L-60.0,72.3L-60.0,69.9L-60.0,72.4L-60.0,76.2L-60.0,77.9L-60.0,76.0L-60.0,72.7L-60.0,71.1L-60.0,67.5L-60.0,65.3L-60.0,62.9L-60.0,57.7L-60.0,52.2L-60.0,49.5L-60.0,46.9L-60.0,44.3L-60.0,42.0L-60.0,39.9L-60.0,38.6L-60.0,34.0L-60.0,32.8L-60.0,29.8L-60.0,32.1L-60.0,35.7L-60.0,32.4L-60.0,30.6L-60.0,28.6L-60.0,25.7L-60.0,29.1L-60.0,27.8L-60.0,24.5L-60.0,27.0L-60.0,30.2L-60.0,28.7L-60.0,27.0L-60.0,22.8L-60.0,17.8L-60.0,20.1L-60.0,23.3L-60.0,22.1L-60.0,20.1L-60.0,21.4L-60.0,26.0L-60.0,30.6L-60.0,32.9L-60.0,34.2L-60.0,32.6L-60.0,30.2L-60.0,28.8L-60.0,25.4L-60.0,27.9L-60.0,30.4L-60.0,33.9L-60.0,40.6L-60.0,42.6L-60.0,45.2L-60.0,47.1L-60.0,49.2L-60.0,53.1L-60.0,57.0L-60.0,59.3L-60.0,63.8L-60.0,66.0L-60.0,68.7L-60.0,71.9L-60.0,74.4L-60.0,80.0L-60.0,84.0L-60.0,89.6L-60.0,93.2L-60.0,98.5L-60.0,100.3L-60.0,102.1L-60.0,104.1L-60.0,106.3L-60.0,111.9L-60.0,115.2L-60.0,117.0L-60.0,118.4L-60.0,120.9L-60.0,117.9L-60.0,119.6L-60.0,124.9L-60.0,126.5L-60.0,128.1L-60.0,129.9L-60.0,131.6L-60.0,138.6L-60.0,140.2L-60.0,137.6L-60.0,139.6L-60.0,142.6L-60.0,146.9L-60.0,151.2L-60.0,153.4L-60.0,157.5L-60.0,162.6L-60.0,166.2L-60.0,171.0L-60.0,174.4L-60.0,177.2L-60.0,179.0L-60.0,181.6L-60.0,183.0L-60.0,186.5L-60.0,190.7L-60.0,192.7L-60.0,194.7L-60.0,204.5L-60.0,207.9L-60.0,204.6L-60.0,202.5L-60.0,194.1L-60.0,189.7L-60.0,186.6L-60.0,183.5L-60.0,180.6L-60.0,177.7L-60.0,173.8L-60.0,166.7L-60.0,161.8L-60.0,158.9L-60.0,155.9L-60.0,150.2L-60.0,146.1L-60.0,140.9L-60.0,136.5L-60.0,138.1L-60.0,140.4L-60.0,141.8L-60.0,143.3L-60.0,145.1L-60.0,149.7L-60.0,151.1L-60.0,152.8L-60.0,156.0L-60.0,157.5L-60.0,160.8L-60.0,162.2L-60.0,164.9L-60.0,169.5L-60.0,171.1L-60.0,174.4L-60.0,172.0L-60.0,174.9L-60.0,178.6L-60.0,183.0L-60.0,186.1L-60.0,187.4L-60.0,190.3L-60.0,192.6L-60.0,190.7L-60.0,188.4L-60.0,182.6L-60.0,180.2L-60.0,177.9L-60.0,176.4L-60.0,173.5L-60.0,177.5L-60.0,176.3L-60.0,172.8L-60.0,176.4L-60.0,174.6L-60.0,179.5L-60.0,175.7L-60.0,177.6L-60.0,180.9L-60.0,182.3L-60.0,184.6L-60.0,186.2L-60.0,183.3L-60.0,182.1L-60.0,180.8L-60.0,186.0L-60.0,184.2L-60.0,186.5L-60.0,185.2L-60.0,183.9L-60.0,180.5L-60.0,175.7L-60.0,173.0L-60.0,164.6L-60.0,156.5L-60.0,145.2L-60.0,139.5L-60.0,135.7L-60.0,132.6L-60.0,130.5L-60.0,127.8L-60.0,124.2L-60.0,121.2L-60.0,111.1L-60.0,107.0L-60.0,101.2L-60.0,96.1L-60.0,94.6L-60.0,93.1L-60.0,90.9L-60.0,84.9L-60.0,82.3L-60.0,79.3L-60.0,74.9L-60.0,72.8L-60.0,71.4L-60.0,69.5L-60.0,65.5L-60.0,58.0L-60.0,56.2L-60.0,54.0L-60.0,49.6L-60.0,45.6L-60.0,43.0L-60.0,39.8L-60.0,36.2L-60.0,33.9L-60.0,32.2L-60.0,29.4L-60.0,31.1L-60.0,32.9L-60.0,34.4L-60.0,36.3L-60.0,37.8L-60.0,34.4L-60.0,32.4L-60.0,37.6L-60.0,44.7L-60.0,46.0L-60.0,49.0L-60.0,51.2L-60.0,53.0L-60.0,51.2L-60.0,49.0L-60.0,46.7L-60.0,41.8L-60.0,39.5L-60.0,37.4L-60.0,32.3L-60.0,31.0L-60.0,32.4L-60.0,39.7L-60.0,41.8L-60.0,45.6L-60.0,47.4L-60.0,45.6L-60.0,47.2L-60.0,49.4L-60.0,46.9L-60.0,45.2L-60.0,43.2L-60.0,39.9L-60.0,38.0L-60.0,36.7L-60.0,35.2L-60.0,32.3L-60.0,35.4L-60.0,36.8L-60.0,33.7L-60.0,35.7L-60.0,33.8L-60.0,32.1L-60.0,29.1L-60.0,27.1L-60.0,24.8L-60.0,23.5L-60.0,20.2L-60.0,18.7L-60.0,16.5L-60.0,13.7L-60.0,10.7L-60.0,9.2L-60.0,7.4L-60.0,3.2L-60.0,0.6L-60.0,-1.7L-60.0,-3.7L-60.0,-5.3L-60.0,-4.0L-60.0,-5.8L-60.0,-7.5L-60.0,-10.0L-60.0,-11.9L-60.0,-15.2L-60.0,-16.8L-60.0,-15.0L-60.0,-13.1L-60.0,-11.3L-60.0,-9.5L-60.0,-10.9L-60.0,-12.2L-60.0,-15.0L-60.0,-16.9L-60.0,-19.1L-60.0,-20.9L-60.0,-23.9L-60.0,-25.2L-60.0,-27.3L-60.0,-30.1L-60.0,-34.0L-60.0,-36.1L-60.0,-38.3L-60.0,-40.9L-60.0,-42.1L-60.0,-40.0L-60.0,-42.3L-60.0,-44.7L-60.0,-50.5L-60.0,-53.7L-60.0,-59.2L-60.0,-57.3L-60.0,-56.0L-60.0,-57.7L-60.0,-59.4L-60.0,-57.9L-60.0,-59.7L-60.0,-58.1L-60.0,-54.6L-60.0,-53.0L-60.0,-54.5L-60.0,-60.0L-60.0,-57.0L-60.0,-52.8L-60.0,-56.4L-60.0,-59.8L-60.0,-57.1L-60.0,-54.9L-60.0,-48.5L-60.0,-43.9L-60.0,-42.2L-60.0,-40.2L-60.0,-36.6L-60.0,-34.8L-60.0,-31.7L-60.0,-29.8L-60.0,-32.6L-60.0,-33.9L-60.0,-35.9L-60.0,-33.9L-60.0,-31.5L-60.0,-30.0L-60.0,-27.8L-60.0,-25.6L-60.0,-24.3L-60.0,-22.9L-60.0,-21.6L-60.0,-20.0L-60.0,-18.0L-60.0,-14.2L-60.0,-9.5L-60.0,-7.4L-60.0,-6.1L-60.0,-3.8L-60.0,1.2L-60.0,4.9L-60.0,7.8L-60.0,6.0L-60.0,3.1L-60.0,-0.3L-60.0,1.1L-60.0,2.4L-60.0,4.0L-60.0,5.5L-60.0,7.7L-60.0,10.2L-60.0,12.4L-60.0,14.5L-60.0,16.8L-60.0,15.1L-60.0,13.0L-60.0,11.2L-60.0,16.4L-60.0,19.1L-60.0,26.5L-60.0,30.9L-60.0,33.0L-60.0,36.5L-60.0,39.2L-60.0,41.8L-60.0,39.7L-60.0,35.4L-60.0,32.7L-60.0,38.6L-60.0,41.9L-60.0,40.1L-60.0,36.5L-60.0,35.0L-60.0,30.1L-60.0,27.9L-60.0,26.2L-60.0,29.9L-60.0,32.3L-60.0,34.0L-60.0,30.7L-60.0,24.8L-60.0,21.6L-60.0,18.6L-60.0,16.5L-60.0,12.4L-60.0,9.7L-60.0,6.1L-60.0,4.6L-60.0,2.9L-60.0,-0.7L-60.0,-5.3L-60.0,-7.4L-60.0,-8.8L-60.0,-5.1L-60.0,-3.1L-60.0,-1.3L-60.0,0.5L-60.0,-1.4L-60.0,-2.6L-60.0,-4.7L-60.0,-6.3L-60.0,-7.8L-60.0,-9.3L-60.0,-11.8L-60.0,-10.4L-60.0,-9.0L-60.0,-11.0L-60.0,-12.8L-60.0,-11.4L-60.0,-10.1L-60.0,-13.6L-60.0,-17.6L-60.0,-20.9L-60.0,-23.6L-60.0,-25.0L-60.0,-26.4L-60.0,-27.8L-60.0,-30.9L-60.0,-33.8L-60.0,-35.8L-60.0,-41.7L-60.0,-44.3L-60.0,-46.1L-60.0,-48.6L-60.0,-50.5L-60.0,-55.1L-60.0,-59.6L-60.0,-56.8L-60.0,-53.6L-60.0,-51.3L-60.0,-49.1L-60.0,-52.2L-60.0,-60.0L-60.0,-57.6L-60.0,-50.1L-60.0,-47.1L-60.0,-44.2L-60.0,-42.6L-60.0,-39.9L-60.0,-37.2L-60.0,-30.6L-60.0,-26.9L-60.0,-24.8L-60.0,-21.6L-60.0,-19.3L-60.0,-13.3L-60.0,-11.0L-60.0,-6.7L-60.0,-2.3L-60.0,-0.5L-60.0,1.6L-60.0,-0.9L-60.0,-4.7L-60.0,-7.1L-60.0,-13.0L-60.0,-16.6L-60.0,-18.1L-60.0,-19.9L-60.0,-25.4L-60.0,-27.6L-60.0,-30.7L-60.0,-36.5L-60.0,-43.9L-60.0,-50.4L-60.0,-53.7L-60.0,-55.4L-60.0,-60.0L-60.0,-56.8L-60.0,-54.3L-60.0,-50.6L-60.0,-41.0L-60.0,-38.2L-60.0,-28.7L-60.0,-26.1L-60.0,-24.0L-60.0,-22.2L-60.0,-20.5L-60.0,-18.8L-60.0,-15.8L-60.0,-11.7L-60.0,-8.6L-60.0,-5.5L-60.0,-4.1L-60.0,0.2L-60.0,3.1L-60.0,6.2L-60.0,7.8L-60.0,9.9L-60.0,11.3L-60.0,16.5L-60.0,20.7L-60.0,28.4L-60.0,33.0L-60.0,31.5L-60.0,33.8L-60.0,35.0L-60.0,37.0L-60.0,40.3L-60.0,42.5L-60.0,43.9L-60.0,47.6L-60.0,50.3L-60.0,51.9L-60.0,53.2L-60.0,51.5L-60.0,49.0L-60.0,44.9L-60.0,42.4L-60.0,39.7L-60.0,37.8L-60.0,34.3L-60.0,31.1L-60.0,29.7L-60.0,31.5L-60.0,28.2L-60.0,21.7L-60.0,20.2L-60.0,21.6L-60.0,26.8L-60.0,24.9L-60.0,26.5L-60.0,22.5L-60.0,15.3L-60.0,11.0L-60.0,7.2L-60.0,3.5L-60.0,1.1L-60.0,-5.0L-60.0,-8.1L-60.0,-12.0L-60.0,-14.0L-60.0,-12.3L-60.0,-14.5L-60.0,-17.7L-60.0,-20.1L-60.0,-21.6L-60.0,-24.3L-60.0,-26.9L-60.0,-29.1L-60.0,-27.4L-60.0,-22.5L-60.0,-20.0L-60.0,-21.5L-60.0,-23.0L-60.0,-25.9L-60.0,-30.0L-60.0,-33.7L-60.0,-36.1L-60.0,-37.5L-60.0,-41.6L-60.0,-49.1L-60.0,-57.0L-60.0,-58.8L-60.0,-60.0Z",Pm=[60,100,5,38],Dm=.9271838545667874,nr={land:Cm,box:Pm,k:Dm},Im="http://www.w3.org/2000/svg",Um=nr.box[0],Nm=nr.box[3],Fm=nr.k,bi=(i,e)=>[(i-Um)*25,(Nm-e)*25/Fm],Om=[["1 June",[[73.5,12.6],[75.6,11.2],[77.4,9.6],[78.6,8.2]]],["5 June",[[72.9,15.1],[75.5,14.6],[78.2,13.6],[80.6,13.4],[84.6,17.6],[89.5,22.6],[93.2,24.6],[96.2,27.4]]],["10 June",[[72.6,19.1],[75.2,18.5],[78.2,17.6],[82.2,18.2],[85.9,21.3],[88.2,24.2],[90.4,26.6]]],["15 June",[[70.2,21.6],[74.1,21.6],[78.1,22.1],[82.2,23.2],[85.2,25.2],[88.2,26.9]]],["20 June",[[69.2,22.6],[73.1,23.6],[77.1,24.2],[81.1,25.6],[84.2,27.2]]],["25 June",[[70.1,24.1],[74.1,25.6],[77.1,27.1],[79.1,28.6],[81.1,29.6]]],["30 June",[[69.6,26.1],[72.6,27.6],[75.6,29.6],[77.6,31.6],[79.1,32.6]]],["8 July",[[68.6,26.6],[70.1,28.6],[72.6,30.6],[74.6,32.6],[76.1,34.1]]]],Tl=[[79.3,21.4,"Rama's peak"],[81,22.4],[81.75,22.7],[80.3,23,"the Reva"],[77.8,23.5],[75.8,23.2,"Ujjain"],[76.3,25.5],[76.8,28],[76.85,29.9],[78.15,29.95,"the Ganga"],[79.4,30.5],[80.6,30.9],[81.3,31.07,"Kailasa · Alaka"]],Xs=i=>{let e=`M${i[0][0].toFixed(1)},${i[0][1].toFixed(1)}`;for(let t=0;t<i.length-1;t++){const n=i[Math.max(0,t-1)],r=i[t],s=i[t+1],a=i[Math.min(i.length-1,t+2)],o=[r[0]+(s[0]-n[0])/6,r[1]+(s[1]-n[1])/6],l=[s[0]-(a[0]-r[0])/6,s[1]-(a[1]-r[1])/6];e+=`C${o[0].toFixed(1)},${o[1].toFixed(1)} ${l[0].toFixed(1)},${l[1].toFixed(1)} ${s[0].toFixed(1)},${s[1].toFixed(1)}`}return e},gt=(i,e,t)=>{const n=document.createElementNS(Im,i);for(const r in e)n.setAttribute(r,String(e[r]));return t?.appendChild(n),n};class Bm{constructor(e){ie(this,"svg");ie(this,"onset",[]);ie(this,"labels",[]);ie(this,"route");ie(this,"routeLen",1);ie(this,"stops",[]);ie(this,"cloud");this.svg=e;const t=[bi(67,36.5),bi(98.5,6.5)];e.setAttribute("viewBox",`${t[0][0]} ${t[0][1]} ${t[1][0]-t[0][0]} ${t[1][1]-t[0][1]}`),e.setAttribute("preserveAspectRatio","xMidYMid meet");const n=gt("defs",{},e),r=gt("pattern",{id:"wash",width:6,height:6,patternUnits:"userSpaceOnUse",patternTransform:"rotate(35)"},n);gt("line",{x1:0,y1:0,x2:0,y2:6,stroke:"#b9a27a","stroke-width":1,opacity:.35},r),gt("path",{d:nr.land,fill:"#dccaa6",stroke:"#5a4b3a","stroke-width":1.3,"stroke-linejoin":"round"},e),gt("path",{d:nr.land,fill:"url(#wash)"},e);const s=gt("g",{},e);for(const[M,m]of Om){const d=gt("path",{d:Xs(m.map(([b,S])=>bi(b,S))),fill:"none",stroke:"#2b4a7a","stroke-width":2.2,"stroke-dasharray":"7 6","stroke-linecap":"round",opacity:0},s);this.onset.push(d);const[T,w]=bi(m[0][0],m[0][1]),x=gt("text",{x:T-8,y:w+4,"text-anchor":"end",fill:"#2b4a7a","font-family":"Mukta, sans-serif","font-size":17,"font-weight":600,opacity:0},s);x.textContent=M,this.labels.push(x)}const a=Tl.map(([M,m])=>bi(M,m)),o=gt("path",{d:Xs(a),fill:"none",stroke:"#3a2a14","stroke-width":8,opacity:.2,"stroke-linecap":"round"},e);this.route=gt("path",{d:Xs(a),fill:"none",stroke:"#c9a24a","stroke-width":4.5,"stroke-linecap":"round"},e),o.style.display="none";let l=0;const c=[0];for(let M=1;M<a.length;M++)l+=Math.hypot(a[M][0]-a[M-1][0],a[M][1]-a[M-1][1]),c.push(l);Tl.forEach(([,,M],m)=>{if(!M)return;const[d,T]=a[m],w=gt("g",{opacity:0},e);gt("circle",{cx:d,cy:T,r:6,fill:"#b8392a",stroke:"#f4f0e7","stroke-width":2},w);const x=m<6,b=gt("text",{x:d+(x?12:-12),y:T+6,"text-anchor":x?"start":"end",fill:"#2a241c","font-family":"Fraunces, serif","font-style":"italic","font-size":22},w);b.textContent=M,this.stops.push({g:w,at:c[m]/l})}),this.cloud=gt("g",{},e);for(const[M,m,d]of[[-12,2,10],[0,-6,13],[13,0,10],[4,5,9]])gt("circle",{cx:M,cy:m,r:d,fill:"#2a2b38",stroke:"#c9a24a","stroke-width":1.5},this.cloud);const u=gt("g",{},e),[f,h]=bi(88.5,13.2);gt("rect",{x:f-120,y:h-34,width:240,height:74,fill:"#efe3c9",stroke:"#b8923c","stroke-width":2},u);const L=gt("text",{x:f,y:h-4,"text-anchor":"middle","font-family":"Fraunces, serif","font-style":"italic","font-size":26,fill:"#2a241c"},u);L.textContent="The road north";const g=gt("text",{x:f,y:h+24,"text-anchor":"middle","font-family":"Mukta, sans-serif","font-size":14,fill:"#5a4b3a","letter-spacing":1},u);g.textContent="route in gold · onset dashed",requestAnimationFrame(()=>{this.routeLen=this.route.getTotalLength()||1,o.style.display="",this.set(0)})}set(e){const t=this.routeLen,n=Math.min(1,Math.max(0,(e-.08)/.8));this.route.style.strokeDasharray=`${t}`,this.route.style.strokeDashoffset=`${t*(1-n)}`,this.onset.forEach((r,s)=>{const a=Math.min(1,Math.max(0,(e-.04-s*.075)/.08));r.setAttribute("opacity",(a*.85).toFixed(3)),this.labels[s].setAttribute("opacity",a.toFixed(3))});for(const r of this.stops)r.g.setAttribute("opacity",n>=r.at-.01?"1":"0");if(t>1){const r=this.route.getPointAtLength(t*n);this.cloud.setAttribute("transform",`translate(${r.x},${r.y-16})`)}}}const zm=".skip,.th-sub,.th-mm .th-note,#enter-sound,#enter-quiet,.th-hint,.arr-k,.arr-h,.ladder .lt,.load-k,.hold-hint,.kicker,.mega-sub,.tag,.scroll-cue,.eyebrow,.verse p,.verse cite,.prose,.note h3,.note p,.fine,.try,.letter-k,.letter-n,.letter button,.gloss,.g-title,.g-item figcaption,.coda-t,.coda-actions .btn,.colophon p,.lang-k",Ct=i=>`पूर्वमेघ, ${i}`,qs=i=>`उत्तरमेघ, ${i}`,Hm=[["Skip to the story","सीधे कहानी पर जाएँ"],["Barsaat · The Cloud Messenger","बरसात · मेघदूत"],["— a hundred in an hour is a cloudburst","— एक घंटे में सौ, तो बादल फटा"],["Enter with sound","आवाज़ के साथ चलें"],["Enter in silence","चुपचाप चलें"],["Best with headphones. Scroll to fly north.","हेडफ़ोन के साथ सबसे अच्छा। उत्तर की ओर उड़ने के लिए स्क्रॉल करें।"],["A cloud has brought you a message.","एक बादल तुम्हारे लिए संदेश लाया है।"],["It came the long way, the way the rains come.","वह लंबी राह से आया है, जैसे बारिश आती है।"],["first drops","पहली बूँदें"],["spray","फुहार"],["steady rain","लय में बारिश"],["slanting rain","तिरछी बारिश"],["unending rain","न थमने वाली"],["downpour","मूसलाधार"],["it has cleared","आसमान खुला"],["cloud","बादल"],["Press and hold to thunder","गरजने के लिए दबाकर रखें"],["After Kalidasa's <em>Meghaduta</em>, c. 5th century","कालिदास के <em>मेघदूत</em> पर आधारित, लगभग पाँचवीं सदी"],["The Cloud Messenger","बादल, जो संदेश ले गया"],["“Even happy hearts thrill strangely to the cloud.”",'“मेघालोके भवति सुखिनोऽप्यन्यथावृत्ति चेतः”<br><span class="tag-sub">बादल को देखकर सुखी मन भी कुछ और हो जाता है।</span>'],["<span></span>scroll","<span></span>स्क्रॉल"],["Prologue · रामगिरि · Rama's peak","आरंभ · रामगिरि"],["On Rama's shady peak where hermits roam,<br>Mid streams by Sita's bathing sanctified,<br>An erring Yaksha made his hapless home,<br>Doomed by his master humbly to abide,<br>And spend a long, long year of absence from his bride.","रामगिरि के छायादार शिखर पर, जहाँ तपस्वी विचरते हैं,<br>सीता के स्नान से पावन हुए झरनों के बीच,<br>एक भूला-भटका यक्ष आ बसा,<br>स्वामी के शाप से विवश,<br>अपनी प्रिया से एक लंबे, लंबे बरस के बिछोह में।"],["Former Cloud, I",Ct("१")],["An attendant of the god of wealth is exiled for a year, to a hill in the middle of India. His young wife is half a subcontinent away, in a city on the slopes of Kailasa. Eight months pass. Then, at the edge of summer, a dark shape comes over the ridge.","धन के देवता कुबेर का एक सेवक एक बरस के लिए निर्वासित है, भारत के बीचोंबीच एक पहाड़ी पर। उसकी नवविवाहिता पत्नी आधे उपमहाद्वीप दूर है, कैलास की ढलानों पर बसे एक नगर में। आठ महीने बीत जाते हैं। फिर, गर्मी के आख़िरी छोर पर, एक साँवली आकृति पहाड़ी के ऊपर से उभरती है।"],["Some months were gone; the lonely lover's pain<br>Had loosed his golden bracelet day by day<br>Ere he beheld the harbinger of rain,<br>A cloud that charged the peak in mimic fray,<br>As an elephant attacks a bank of earth in play.","कुछ महीने बीत गए; विरही की पीड़ा ने<br>दिन-ब-दिन उसके सोने के कंगन ढीले कर दिए,<br>तब उसने देखा वर्षा का अग्रदूत,<br>एक बादल, जो खेल-खेल में शिखर से जा टकराया,<br>जैसे कोई हाथी क्रीड़ा में मिट्टी के टीले पर टूट पड़े।"],["Former Cloud, II",Ct("२")],["He offers it fresh blossoms, and asks it to carry a message north. <strong>You are that cloud.</strong>","वह उसे ताज़े फूल अर्पित करता है, और उत्तर तक एक संदेश ले जाने की विनती करता है। <strong>वह बादल तुम हो।</strong>"],["Before you leave, take a message of your own to someone far away.","चलने से पहले, किसी दूर बैठे अपने के लिए अपना भी एक संदेश ले लो।"],['<span id="msg-n">0</span>/140 · it never leaves this device','<span id="msg-n">0</span>/140 · यह इस डिवाइस से बाहर नहीं जाता'],["Carry it north","उत्तर ले चलो"],["<em>boonda-baandi</em> · the first scattered drops","पहली, बिखरी हुई बूँदें"],["Nor did it pass the lovelorn Yaksha's mind<br>How all unfitly might his message mate<br>With a cloud, mere fire and water, smoke and wind—<br>Ne'er yet was lover could discriminate<br>'Twixt life and lifeless things, in his love-blinded state.","विरही यक्ष के मन में यह बात न आई<br>कि उसका संदेश बादल से कैसे मेल खाएगा,<br>जो बस आग और पानी, धुआँ और हवा है—<br>प्रेम में अंधा कोई प्रेमी कब पहचान पाया है<br>जीवित और निर्जीव का भेद।"],["Former Cloud, V",Ct("५")],["The smell of the first rain","पहली बारिश की गंध"],["The first drops on hot dust release a smell scientists named <em>petrichor</em> in 1964. In Kannauj, perfumers had already been bottling it for generations as <em>mitti attar</em>, “earth's perfume”: baked clay distilled for days into sandalwood oil. Kalidasa had a line for it too: <em>“Scenting the sweet, sweet smell of forest earth.”</em>","तपती धूल पर गिरी पहली बूँदें जो गंध छोड़ती हैं, उसे वैज्ञानिकों ने 1964 में <em>पेट्रिकोर</em> नाम दिया। कन्नौज के इत्र बनाने वाले पीढ़ियों से उसे <em>मिट्टी अत्तर</em> के रूप में शीशियों में भर रहे थे: पकी हुई मिट्टी, कई दिनों तक चंदन के तेल में आसवित। कालिदास के पास भी इसके लिए एक पंक्ति थी: <em>“वन की मिट्टी की मीठी, मीठी गंध।”</em>"],["<em>phuhaar</em> · a fine spray you walk through","महीन बौछार, जिसमें से होकर तुम चलते हो"],["Learn first, O cloud, the road that thou must go,<br>Then hear my message ere thou speed away;<br>Before thee mountains rise and rivers flow:<br>When thou art weary, on the mountains stay,<br>And when exhausted, drink the rivers' driven spray.","पहले, हे मेघ, वह राह जान लो जिस पर तुम्हें जाना है,<br>फिर मेरा संदेश सुनकर उड़ चलना;<br>आगे पर्वत उठेंगे, नदियाँ बहेंगी:<br>थक जाओ तो पर्वतों पर ठहर जाना,<br>और रीत जाओ तो नदियों की उछलती फुहार पी लेना।"],["Former Cloud, XIII",Ct("१३")],["The route the exile gives is real: north-west to the Narmada, to Ujjain, then north across the plains to the Ganga and the Himalaya. It is also, near enough, the path the monsoon takes every year. The rains reach Kerala around the first of June and cover the whole country by the eighth of July.","यक्ष जो राह बताता है, वह असली है: उत्तर-पश्चिम में नर्मदा तक, उज्जैन तक, फिर उत्तर में मैदानों को पार करते हुए गंगा और हिमालय तक। लगभग यही राह मानसून भी हर साल लेता है। बारिश जून की पहली तारीख़ के आसपास केरल पहुँचती है और आठ जुलाई तक पूरे देश पर छा जाती है।"],["While favouring breezes waft thee gently forth,<br>And while upon thy left the plover sings<br>His proud, sweet song, the cranes who know thy worth<br>Will meet thee in the sky on joyful wings.","जब अनुकूल हवाएँ तुम्हें धीरे-धीरे आगे ले चलें,<br>और तुम्हारी बाईं ओर पपीहा<br>अपना गर्वीला, मीठा गीत गाए, तब तुम्हारा मोल जानने वाले सारस<br>आनंद के पंखों पर आकाश में तुमसे आ मिलेंगे।"],["Former Cloud, IX",Ct("९")],["Map: the poem's route in gold. Dashed lines: approximate normal monsoon onset dates, after the India Meteorological Department (2020 normals).","नक़्शा: कविता की राह सुनहरे रंग में। टूटी रेखाएँ: मानसून के आगमन की सामान्य तिथियाँ, लगभग, भारत मौसम विज्ञान विभाग के आधार पर (2020 के मानक)।"],["<em>rimjhim</em> · steady rain with a rhythm in it","लय में बरसती, थमी-थमी बारिश"],["Then fly, rain-quickened, to the Reva river<br>Which gaily breaks on Vindhya's rocky side,<br>Like painted streaks upon an elephant's dingy hide.","फिर, वर्षा से नई जान पाकर, रेवा नदी की ओर उड़ना,<br>जो विंध्य की चट्टानी ढलानों पर उल्लास से टूटती है,<br>जैसे किसी हाथी की धूसर देह पर रंगी हुई धारियाँ।"],["Former Cloud, XIX",Ct("१९")],["Spying the madder on the banks, half brown,<br>Half green with shoots that struggle to the birth,<br>Nibbling where early plantain-buds hang down,<br>Scenting the sweet, sweet smell of forest earth,<br>The deer will trace thy misty track that ends the dearth.","किनारों पर आधी भूरी, आधी हरी मजीठ को निहारते,<br>जन्म को आतुर कोंपलों के बीच,<br>लटकती केले की कलियों को कुतरते,<br>वन की मिट्टी की मीठी, मीठी गंध सूँघते,<br>हिरण तुम्हारी धुँधली राह का पीछा करेंगे, जो सूखे का अंत है।"],["Former Cloud, XXI",Ct("२१")],["Paper boats","काग़ज़ की कश्ती"],["Every monsoon childhood has the same engineering project: a page torn from a notebook, folded into a <em>kaagaz ki kashti</em>, and launched into the gutter the moment the lane floods. Most sink by the second corner. That is not the point.","हर बरसाती बचपन का एक ही इंजीनियरिंग प्रोजेक्ट होता है: कॉपी से फाड़ा एक पन्ना, मोड़कर बनी <em>काग़ज़ की कश्ती</em>, और गली में पानी भरते ही नाली में उतार दी गई। ज़्यादातर दूसरे मोड़ तक डूब जाती हैं। बात वह नहीं है।"],["Yet I foresee delay on every hill<br>Where jasmines blow, and where the peacock-train<br>Cries forth with joyful tears a welcome shrill.","फिर भी मुझे हर पहाड़ी पर देर होती दिखती है,<br>जहाँ चमेली खिलती है, और जहाँ मोरों की टोली<br>खुशी के आँसुओं के साथ ऊँची पुकार में स्वागत करती है।"],["Former Cloud, XXII",Ct("२२")],["<em>bauchhaar</em> · rain the wind throws sideways","वह बारिश, जिसे हवा तिरछा फेंकती है"],["Ujjain, at dusk","उज्जैन, साँझ के समय"],["Clothing thyself in twilight's rose-red glory,<br>Embrace the dancing Shiva's tree-like arm;<br>He will prefer thee to his mantle gory.","संध्या की गुलाबी-लाल आभा ओढ़कर,<br>नाचते शिव की वृक्ष-सी भुजा से लिपट जाना;<br>वे अपने रक्त-सने चर्म के बदले तुम्हें ही ओढ़ना चाहेंगे।"],["Former Cloud, XXXVI",Ct("३६")],["Where women steal to rendezvous by night<br>Through darkness that a needle might divide,<br>Show them the road with lightning-flashes bright<br>As golden streaks upon the touchstone's side—<br>But rain and thunder not, lest they be terrified.","जहाँ स्त्रियाँ रात में मिलन को चुपके से निकलती हैं<br>ऐसे घने अँधेरे में, जिसे सुई से काटा जा सके,<br>उन्हें बिजली की चमक से राह दिखाना,<br>कसौटी पर खिंची सोने की लकीरों जैसी—<br>पर गरजना-बरसना नहीं, कहीं वे डर न जाएँ।"],["Former Cloud, XXXVII",Ct("३७")],["The raga that brings rain","वह राग, जो बारिश लाता है"],["The story goes that Tansen, a singer at Akbar's court, sang Raag Deepak until every lamp lit itself and his own body burned, and that he was cooled when Raag Megh Malhar was sung and the rain came. It is a legend. Musicians still sing Malhar every monsoon, just in case. The music you may be hearing is Malhar itself, from recordings of the raga.","कहते हैं, अकबर के दरबार के गायक तानसेन ने राग दीपक इस तरह गाया कि हर दीया अपने आप जल उठा और उनका अपना शरीर जलने लगा, और जब राग मेघ मल्हार गाया गया, तब बारिश आई और उन्हें शीतलता मिली। यह एक किंवदंती है। फिर भी संगीतकार हर मानसून में मल्हार गाते हैं, क्या पता। जो संगीत तुम शायद सुन रहे हो, वह स्वयं मल्हार है, इसी राग की रिकॉर्डिंग से।"],["<span>Press and hold anywhere</span> to thunder.","<span>कहीं भी दबाकर रखो</span>, बादल गरजेगा।"],["Interlude","मध्यांतर"],["The rain in paint","रंगों में बारिश"],["For three hundred years, Indian painters gave the monsoon its own vocabulary: skies of ink instead of blue, lightning drawn as a gold snake, a row of white cranes across the dark, peacocks crying on the rooftops. These are the real thing.","तीन सौ बरसों तक भारतीय चित्रकारों ने मानसून को अपनी अलग भाषा दी: नीले की जगह स्याही-से आसमान, सोने के साँप-सी खिंची बिजली, अँधेरे के पार सफ़ेद सारसों की क़तार, छतों पर पुकारते मोर। ये असली चित्र हैं।"],["<b>Royal lovers watching rain clouds: the month of Bhadon</b> Pahari, Kangra school, c. 1790. The Cleveland Museum of Art, CC0.","<b>बादलों को निहारते राजसी प्रेमी: भादों का महीना</b> पहाड़ी, कांगड़ा शैली, लगभग 1790। क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट, CC0।"],["<b>Setmalar Ragini</b> Malwa, c. 1630–40. The Metropolitan Museum of Art, public domain.","<b>सेतमलार रागिनी</b> मालवा, लगभग 1630–40। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।"],["<b>Krishna and the Gopis take shelter from the rain</b> Jaipur, 1760. The Metropolitan Museum of Art, public domain.","<b>बारिश से बचते कृष्ण और गोपियाँ</b> जयपुर, 1760। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।"],["<b>Madhumadhavi Ragini</b> Marwar, c. 1640–50. The Metropolitan Museum of Art, public domain.","<b>मधुमाधवी रागिनी</b> मारवाड़, लगभग 1640–50। मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट, सार्वजनिक।"],["<b>Watching girls swinging at the Teej festival</b> Marwar. The Cleveland Museum of Art, CC0.","<b>तीज के झूलों पर झूलती लड़कियाँ</b> मारवाड़। क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट, CC0।"],["<em>jhadi</em> · rain that will not stop","वह बारिश, जो थमती ही नहीं"],["Fly then where Ganges o'er the king of mountains<br>Falls like a flight of stairs from heaven let down<br>For the sons of men; she hurls her billowy fountains<br>Like hands to grasp the moon on Shiva's crown<br>And laughs her foamy laugh at Gauri's jealous frown.","फिर उड़ना वहाँ, जहाँ गंगा पर्वतराज से<br>स्वर्ग से उतारी गई सीढ़ियों-सी उतरती है<br>मनुष्यों के लिए; वह अपनी लहरें ऊपर उछालती है<br>जैसे शिव के मुकुट पर चंद्रमा को पकड़ने बढ़े हाथ,<br>और गौरी की ईर्ष्या भरी भौंहों पर झागदार हँसी हँसती है।"],["Former Cloud, L",Ct("५०")],["If thou, like some great elephant of the sky,<br>Shouldst wish from heaven's eminence to bend<br>And taste the crystal stream, her beauties high—<br>As thy dark shadows with her whiteness blend—<br>Would be what Jumna's waters at Prayaga lend.","यदि तुम, आकाश के किसी विशाल हाथी-से,<br>स्वर्ग की ऊँचाई से झुककर<br>उसकी निर्मल धारा चखना चाहो—<br>तो तुम्हारी साँवली छाया उसकी धवलता में घुलकर<br>वैसी लगेगी, जैसी प्रयाग में यमुना की धारा।"],["Former Cloud, LI",Ct("५१")],["<em>Saawan ki jhadi</em> is the rain of the monsoon month that goes on for days. It is also what you call tears that will not stop. The language has always known the two are related.","<em>सावन की झड़ी</em> उस बारिश को कहते हैं जो दिनों तक चलती रहती है। उन आँसुओं को भी यही कहते हैं जो थमते नहीं। भाषा हमेशा से जानती है कि दोनों का रिश्ता है।"],["<em>mooslaadhaar</em> · rain in streams as thick as a pestle","मूसल जितनी मोटी धारों में बरसती बारिश"],["If, born from friction of the deodars,<br>A scudding fire should prove the mountain's bane,<br>Singeing the tails of yaks with fiery stars,<br>Quench thou the flame with countless streams of rain—<br>The great have power that they may soothe distress and pain.","यदि देवदारों की रगड़ से जन्मी<br>कोई भागती आग पर्वत पर विपदा बन जाए,<br>चिनगारियों से याकों की पूँछें झुलसाती हुई,<br>तो अनगिनत धाराओं से उस लौ को बुझा देना—<br>बड़ों के पास शक्ति इसीलिए होती है कि वे दुख और पीड़ा हरें।"],["Former Cloud, LIII",Ct("५३")],["The breeze is piping on the bamboo-tree;<br>And choirs of heaven sing in union sweet<br>O'er demon foe of Shiva's victory;<br>If thunders in the caverns drumlike beat,<br>Then surely Shiva's symphony will be complete.","बाँस के झुरमुटों में हवा बाँसुरी बजा रही है;<br>और स्वर्ग के गायक मधुर स्वर में मिलकर<br>असुर पर शिव की विजय गा रहे हैं;<br>यदि गुफाओं में तुम्हारी गर्जना मृदंग-सी गूँजे,<br>तो शिव का संगीत पूरा हो जाएगा।"],["Former Cloud, LVI",Ct("५६")],['<span class="dev" lang="hi">बादल फटना</span> · the cloud tears','<span class="dev" lang="hi">बादल फटना</span>'],["A cloudburst is a hundred millimetres of rain in an hour: a hundred litres poured on every square metre of ground. In the mountains it comes without warning, and the rivers rise in minutes.","बादल फटना यानी एक घंटे में सौ मिलीमीटर बारिश: ज़मीन के हर वर्ग मीटर पर सौ लीटर पानी। पहाड़ों में यह बिना चेतावनी के आता है, और नदियाँ मिनटों में चढ़ जाती हैं।"],["<em>khul gaya</em> · it has cleared","आसमान खुल गया है"],["Then, in familiar Alaka find rest,<br>Down whom the Ganges' silken river swirls,<br>Whose towers cling to her mountain lover's breast,<br>While clouds adorn her face like glossy curls<br>And streams of rain like strings of close-inwoven pearls.","फिर, अपनी जानी-पहचानी अलका में विश्राम करना,<br>जिसके नीचे गंगा की रेशमी धारा लहराती है,<br>जिसकी अटारियाँ अपने पर्वत-प्रिय के वक्ष से लगी हैं,<br>जबकि बादल उसके मुख को चमकीली लटों-से सजाते हैं<br>और वर्षा की धाराएँ घने गुँथे मोतियों की लड़ियों-सी।"],["Former Cloud, LXIII",Ct("६३")],["She is at the window, counting the days left with flowers laid on the sill. The cloud settles against the glass and does what it came to do.","वह खिड़की पर है, देहरी पर रखे फूलों से बचे हुए दिन गिन रही है। बादल शीशे से आ लगता है और वही करता है जिसके लिए आया था।"],["So she will know the cloud is a true messenger, he gives it a secret only the two of them could know:","ताकि वह जान सके कि बादल सच्चा दूत है, यक्ष उसे एक ऐसा रहस्य देता है जो केवल वे दोनों जानते हैं:"],["And one thing more: thou layest once asleep,<br>Clasping my neck, then wakening with a scream;<br>And when I wondered why, thou couldst but weep<br>A while, and then a smile began to beam:<br>“Rogue! Rogue! I saw thee with another girl in dream.”","और एक बात और: एक बार तुम सो रही थीं,<br>मेरे गले में बाँहें डाले, फिर चीख़कर जाग उठीं;<br>और जब मैंने कारण पूछा, तो तुम बस रोती रहीं<br>कुछ देर, और फिर एक मुस्कान खिल उठी:<br>“छलिया! छलिया! मैंने सपने में तुम्हें किसी और लड़की के साथ देखा।”"],["Latter Cloud, XLVIII",qs("४८")],["When Vishnu rises from his serpent bed<br>The curse is ended; close thine eyelids tight<br>And wait till only four months more are sped;<br>Then we shall taste each long-desired delight<br>Through nights that the full autumn moon illumines bright.","जब विष्णु अपनी शेष-शय्या से उठेंगे,<br>शाप का अंत होगा; आँखें कसकर मूँद लो<br>और बस चार महीने और बीतने दो;<br>फिर हम हर चिर-प्रतीक्षित सुख चखेंगे<br>उन रातों में, जिन्हें शरद का पूरा चाँद उजला करता है।"],["Latter Cloud, XLVII",qs("४७")],["…then wander free<br>In rainy loveliness, and ne'er abide<br>One moment's separation from thy lightning bride.","…फिर स्वच्छंद विचरना<br>वर्षा के सौंदर्य में, और कभी न सहना<br>अपनी बिजली-दुल्हन से एक पल का भी बिछोह।"],["Latter Cloud, LII",qs("५२")],["Send this cloud","यह बादल भेजो"],["Somebody is far away from somebody, every monsoon. Send them a cloud. Your message travels inside the link and nowhere else.","हर मानसून, कोई किसी से दूर होता है। उन्हें एक बादल भेजो। तुम्हारा संदेश बस लिंक के भीतर यात्रा करता है, और कहीं नहीं।"],["Fly again","फिर से उड़ो"],["Read the whole poem","पूरी कविता पढ़ो"],["<b>Words</b> Kalidasa, <em>Meghaduta</em> (c. 5th century), translated by Arthur W. Ryder (1912), public domain via Project Gutenberg.","<b>शब्द</b> कालिदास, <em>मेघदूत</em> (लगभग पाँचवीं सदी)। हिंदी पंक्तियाँ इस साइट के लिए आर्थर डब्ल्यू. राइडर (1912) के अंग्रेज़ी अनुवाद से किया गया भावानुवाद हैं।"],["<b>Chapter paintings</b> made for this site with image generation, after the Pahari masters of Kangra. <b>The rain in paint</b> The Metropolitan Museum of Art (Open Access) and The Cleveland Museum of Art (CC0).","<b>अध्यायों के चित्र</b> इस साइट के लिए इमेज जनरेशन से बनाए गए, कांगड़ा के पहाड़ी उस्तादों की शैली में। <b>रंगों में बारिश</b> मेट्रोपॉलिटन म्यूज़ियम ऑफ़ आर्ट (ओपन एक्सेस) और क्लीवलैंड म्यूज़ियम ऑफ़ आर्ट (CC0)।"],['<span class="dev" lang="hi">सावन की झड़ी</span>','<span class="dev" lang="hi">सावन की झड़ी</span>'],["<b>Onset lines</b> approximate, after India Meteorological Department normals. <b>Sound</b> Raag Megh Malhar and Miyan ki Malhar from NCERT's <em>Rag Ras Barse</em> (CC BY 3.0); rain and thunder recordings by ezwa (public domain) and RHumphries (CC BY 3.0); koel by Jappalang (CC BY-SA 3.0), via Wikimedia Commons.","<b>आगमन रेखाएँ</b> लगभग, भारत मौसम विज्ञान विभाग के मानकों के आधार पर। <b>ध्वनि</b> राग मेघ मल्हार और मियाँ की मल्हार, NCERT के <em>राग रस बरसे</em> से (CC BY 3.0); बारिश और गर्जन की रिकॉर्डिंग ezwa (सार्वजनिक) और RHumphries (CC BY 3.0) की; कोयल Jappalang (CC BY-SA 3.0) की, विकिमीडिया कॉमन्स से।"],["Made by <b>hapybeing</b>","<b>hapybeing</b> की रचना"]],za=i=>i.replace(/\s+/g," ").replace(/<br\s*\/?>/g,"<br>").trim(),km=new Map(Hm.map(([i,e])=>[za(i),e])),Gm={soundOn:{en:"Sound on",hi:"आवाज़ चालू"},soundOff:{en:"Sound off",hi:"आवाज़ बंद"},carrying:{en:"Carrying it",hi:"ले जा रहा हूँ"},carry:{en:"Carry it north",hi:"उत्तर ले चलो"},flyNorth:{en:"Fly north",hi:"उत्तर उड़ो"},arrivedK:{en:"This cloud is carrying a message for you. It will be delivered at the end of the road.",hi:"यह बादल तुम्हारे लिए एक संदेश ला रहा है। राह के अंत में वह तुम्हें मिलेगा।"},placeholder:{en:"I am well. The rains have come. I think of you.",hi:"मैं ठीक हूँ। बारिश आ गई है। तुम्हारी याद आती है।"},shareSent:{en:"The cloud is on its way.",hi:"बादल रास्ते में है।"},shareCopied:{en:"Link copied. Send it to someone far away.",hi:"लिंक कॉपी हो गया। किसी दूर बैठे अपने को भेजो।"},shareTitle:{en:"A cloud has brought you a message",hi:"एक बादल तुम्हारे लिए संदेश लाया है"},writtenOn:{en:"Written on the glass: ",hi:"शीशे पर लिखा है: "}};let Ys=null,so="en";function Vm(i){so=i,document.documentElement.lang=i,document.documentElement.dataset.lang=i;const e=[...document.querySelectorAll(zm)];Ys||(Ys=new Map(e.map(n=>[n,n.innerHTML])));const t=[];for(const n of e){const r=Ys.get(n)??n.innerHTML;if(i==="en"){n.innerHTML!==r&&(n.innerHTML=r);continue}const s=km.get(za(r));s?n.innerHTML=s:t.push(za(r).slice(0,60))}try{localStorage.setItem("barsaat-lang",i)}catch{}t.length&&new URL(location.href).searchParams.has("debug")&&console.warn("i18n missing",t),document.dispatchEvent(new CustomEvent("langchange"))}function Wm(){const i=new URL(location.href).searchParams.get("lang");if(i==="hi"||i==="en")return i;try{const e=localStorage.getItem("barsaat-lang");if(e==="hi"||e==="en")return e}catch{}return(navigator.languages||[navigator.language]).some(e=>e.toLowerCase().startsWith("hi"))?"hi":"en"}const Ut=i=>Gm[i][so],ht=i=>document.querySelector(i),Vn=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),Gi=(i,e,t)=>{const n=Vn((t-i)/(e-i));return n*n*(3-2*n)},ct=(i,e,t)=>i+(e-i)*t,ss=new URL(location.href),T0=ss.searchParams.has("debug"),Kt=matchMedia("(prefers-reduced-motion: reduce)").matches,as=matchMedia("(pointer: coarse)").matches,si=[...document.querySelectorAll(".sec")],Ha=[];{let i=0;for(const e of si){const t=e.dataset,n=t.plate==="map"||t.plate==="none"?i:Number(t.plate??i);i=n,Ha.push({plate:n,map:t.plate==="map"?1:0,show:t.plate==="none"?0:1,full:Number(t.full??0),rain:Number(t.rain??0),slant:Number(t.slant??.1),storm:Number(t.storm??0),dusk:Number(t.dusk??0),clear:Number(t.clear??0),dry:Number(t.dry??0),burst:Number(t.burst??0),msg:Number(t.msg??0),ch:Number(t.ch??0),end:Number(t.end??0)})}}let Gr=[],ka=[];const os=()=>{Gr=si.map(i=>i.offsetTop),ka=si.map(i=>i.offsetHeight)},se={full:1,show:1,rain:0,slant:.1,storm:.2,dusk:0,clear:0,dry:1,burst:0,msg:0,end:0,map:0,wet:0,load:0,wind:0};let Ki=0,Ga=0,Va=0,Qn=0,A0=0,w0=0;const Xm=ht("#gl");let zt=null;try{zt=new wm(Xm)}catch(i){console.warn("WebGL unavailable",i),document.body.classList.add("no-gl")}const pn=new Rm,Al=new Bm(ht("#map")),R0=[...document.querySelectorAll(".lang-b")];function C0(i){Vm(i),R0.forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.lang===i))),document.dispatchEvent(new Event("relabel"))}R0.forEach(i=>i.addEventListener("click",()=>C0(i.dataset.lang)));const Gn={dpr:Number(ss.searchParams.get("dpr"))||(as?1.25:1.5),slow:0},Bt={band:22,folio:{x:0,y:0,w:0,h:0},opaqueTop:0,portrait:!1};function ao(){const i=innerWidth,e=innerHeight,t=e>i*1.05||i<760;Bt.portrait=t;const n=Math.round(Vn(Math.min(i,e)*.028,13,30));Bt.band=n;const r=document.documentElement.style;if(t){const a=Math.round(Vn(i*.05,14,34))+n+7,o=i-2*a,l=54+n+7,c=Math.min(e*.48,o*1.3);Bt.folio={x:a,y:l,w:o,h:c},Bt.opaqueTop=l+c+n+7+18,r.setProperty("--frameTop",`${Bt.opaqueTop}px`)}else{const s=Math.max(26,e*.06);let a=e-2*s-2*(n+7),o=Math.min(a*.74,i*.44);a=Math.min(a,o/.62);const l=i-o-n-7-Math.max(i*.05,40),c=(e-a)/2;Bt.folio={x:l,y:c,w:o,h:a},Bt.opaqueTop=0;const u=Math.max(150+i*.02,i*.14),f=Math.min(560,l-n-7-u-i*.05);r.setProperty("--colx",`${u}px`),r.setProperty("--colw",`${Math.max(280,f)}px`)}zt?.resize(i,e,Math.min(devicePixelRatio||1,Gn.dpr)),os()}const Wn=!as&&!Kt?new tc({lerp:.085,wheelMultiplier:.9,anchors:!0,autoRaf:!1}):null;let $r=0,Jr=0;const qm=()=>{const i=Wn?Wn.scroll:window.scrollY;Jr=ct(Jr,i-$r,.2),$r=i},oo=(i,e=1.8)=>{Wn?Wn.scrollTo(i,{duration:e}):typeof i=="number"?scrollTo({top:i,behavior:Kt?"auto":"smooth"}):document.querySelector(i)?.scrollIntoView({behavior:Kt?"auto":"smooth"})},Xn=ht("#msg"),Ym=()=>ht("#msg-n"),lo={set textContent(i){const e=Ym();e&&(e.textContent=i)}},ei=ht("#letter");let Vr="";const Zm=i=>btoa(String.fromCharCode(...new TextEncoder().encode(i))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),Km=i=>{try{return new TextDecoder().decode(Uint8Array.from(atob(i.replace(/-/g,"+").replace(/_/g,"/")),e=>e.charCodeAt(0)))}catch{return""}},Ci=location.hash.startsWith("#m=")?Km(location.hash.slice(3)).replace(/[\u0000-\u001f]/g," ").slice(0,140):"",$m=()=>Ut("placeholder");function P0(i){Vr=(i.trim()||$m()).slice(0,140),document.fonts.load("400 60px Kalam").catch(()=>null).then(()=>zt?.writeMessage(Vr)),ht("#msg-sr").textContent=Ut("writtenOn")+Vr}Xn.addEventListener("input",()=>{lo.textContent=String(Xn.value.length)});ei.addEventListener("submit",i=>{i.preventDefault(),P0(Xn.value),ei.classList.add("sent"),ei.querySelector("button").textContent=Ut("carrying"),oo("#boonda-baandi",2.2)});Ci&&(Xn.value=Ci,Xn.readOnly=!0,lo.textContent=String(Ci.length));let D0=!1;Xn.addEventListener("input",()=>{D0=!0});function Jm(){Xn.placeholder=Ut("placeholder"),Ci?(ht(".letter-k").textContent=Ut("arrivedK"),ei.querySelector("button").textContent=Ut("flyNorth")):ei.classList.contains("sent")&&(ei.querySelector("button").textContent=Ut("carrying")),Qr.querySelector(".chip-t").textContent=pn.on?Ut("soundOn"):Ut("soundOff"),lo.textContent=String(Xn.value.length),!D0&&!Ci&&!ei.classList.contains("sent")&&P0("")}document.addEventListener("relabel",Jm);ht("#share").addEventListener("click",async()=>{const i=`${location.origin}${location.pathname}${so==="hi"?"?lang=hi":""}#m=${Zm(Vr)}`,e=ht("#share-out");try{if(navigator.share){await navigator.share({title:Ut("shareTitle"),url:i}),e.textContent=Ut("shareSent");return}}catch{}try{await navigator.clipboard.writeText(i),e.textContent=Ut("shareCopied")}catch{e.textContent=i}});ht("#again").addEventListener("click",i=>{i.preventDefault(),oo(0,3)});const I0=[...document.querySelectorAll(".ladder a")];I0.forEach(i=>i.addEventListener("click",e=>{e.preventDefault();const t=i.getAttribute("href");oo(t),history.replaceState(null,"",t)}));const Qr=ht("#sound");async function co(i){try{i&&await pn.start()}catch{i=!1}pn.setOn(i),Qr.setAttribute("aria-pressed",String(i)),Qr.querySelector(".chip-t").textContent=Ut(i?"soundOn":"soundOff")}Qr.addEventListener("click",()=>co(!pn.on));let wl=0,Wa=0,Rl=0,Hn=99,Zs=6;function ir(i=!1){zt&&(zt.bolt(y0[Ki]??.4),Hn=0,Wa=0,pn.thunder(i?.05:.2+Math.random()*.6))}let wn=!1,$i=0,ls=0,U0=0;const Qm=ht("#hold-hint"),N0=i=>i instanceof Element&&!!i.closest("a,button,textarea,input,label,.verse,.prose,.note,.letter,.g-track,.chrome,.ladder");addEventListener("pointerdown",i=>{N0(i.target)||i.button>0||!document.body.classList.contains("entered")||(U0=i.clientY,ls=window.setTimeout(()=>{wn=!0,$i=0,ir(!0),pn.swell()},340))});const F0=()=>{clearTimeout(ls),wn=!1};addEventListener("pointerup",F0);addEventListener("pointercancel",F0);addEventListener("pointermove",i=>{!wn&&Math.abs(i.clientY-U0)>8&&clearTimeout(ls)});addEventListener("scroll",()=>{wn||clearTimeout(ls)},{passive:!0});addEventListener("keydown",i=>{i.key==="t"&&!i.repeat&&!(i.target instanceof HTMLTextAreaElement)&&(wn=!0,$i=0,ir(!0),pn.swell())});addEventListener("keyup",i=>{i.key==="t"&&(wn=!1)});addEventListener("contextmenu",i=>{N0(i.target)||i.preventDefault()});const an={x:0,y:0,tx:0,ty:0};addEventListener("pointermove",i=>{an.tx=(i.clientX/innerWidth-.5)*2,an.ty=(i.clientY/innerHeight-.5)*2});const Cl=ht("#threshold"),jm=ht(".gauge-fill"),eL=ht("#mm");let Pl=0;const Ir=()=>{Pl++;const i=Pl/4;jm.style.width=`${i*100}%`,eL.textContent=String(Math.round(i*100))};async function tL(){const i=Promise.all([document.fonts.load('400 40px "Tiro Devanagari Hindi"',"बरसात"),document.fonts.load("italic 300 20px Fraunces"),document.fonts.load("400 16px Mukta")]).catch(()=>null).then(Ir),e=(zt?.loadBorder()??Promise.resolve()).catch(()=>null).then(Ir),t=(zt?.loadPlate(0)??Promise.resolve()).catch(()=>null).then(Ir),n=(zt?.loadPlate(5)??Promise.resolve()).catch(()=>null).then(Ir);await Promise.all([i,e,t,n]),(async()=>{for(const r of[1,2,3,4])await zt?.loadPlate(r).catch(()=>null)})(),ht(".th-enter").hidden=!1,ht("#enter-sound").focus({preventScroll:!0}),T0&&ss.searchParams.has("auto")&&cs(!1)}function cs(i){if(Cl.classList.add("gone"),Cl.setAttribute("aria-hidden","true"),document.body.classList.remove("is-loading"),document.body.classList.add("entered"),os(),i&&co(!0),Ci){const e=ht("#arrival");e.hidden=!1,setTimeout(()=>{e.style.transition="opacity 1.4s",e.style.opacity="0",setTimeout(()=>e.hidden=!0,1500)},2600)}}ht("#enter-sound").addEventListener("click",()=>cs(!0));ht("#enter-quiet").addEventListener("click",()=>cs(!1));let Dl=performance.now(),Xa=0,Ks=0,Ur=0,jr=60,Nr=0,yi=-1,$s=4;const nL=ht(".sec-burst"),Il=si.findIndex(i=>i.classList.contains("sec-map")),iL=ht(".load-bar span");let Ul=-1,Nl=-1;const Js=(i,e,t)=>{i.classList.contains(e)!==t&&i.classList.toggle(e,t)};function O0(i){requestAnimationFrame(O0);const e=(i-Dl)/1e3;if(Dl=i,Nr+=e,Nr<1/62)return;const t=Math.min(.05,Nr);Nr=0,Xa+=t,Wn&&Wn.raf(i),qm(),rL(t),Ks++,Ur+=t,Ur>1&&(jr=Ks/Ur,Ks=0,Ur=0,jr<(as?50:40)&&Gn.dpr>.75&&Xa>4&&!ss.searchParams.get("dpr")?++Gn.slow>2&&(Gn.dpr=Math.max(.75,Gn.dpr-.25),Gn.slow=0,ao()):Gn.slow=0),T0&&sL()}function rL(i){const e=innerHeight,t=$r+e*.55;let n=0;for(;n<si.length-1&&Gr[n+1]<=t;)n++;A0=n;const r=Vn((t-Gr[n])/Math.max(1,ka[n]));w0=r;const s=Ha[n],a=Ha[Math.min(si.length-1,n+1)],o=Gi(.72,1,r),l=S=>ct(s[S],a[S],o),c=1-Math.exp(-i*(Kt?20:4)),u=1-Math.exp(-i*12);se.full=ct(se.full,l("full"),u*1.6>1?1:u*1.6),se.show=ct(se.show,l("show"),u),se.map=ct(se.map,l("map"),u),se.storm=ct(se.storm,l("storm"),c),se.dusk=ct(se.dusk,l("dusk"),c),se.clear=ct(se.clear,l("clear"),c),se.dry=ct(se.dry,l("dry"),c),se.end=ct(se.end,l("end"),u),se.burst=ct(se.burst,s.burst?Gi(.05,.55,r):0,u),se.msg=ct(se.msg,s.msg?Gi(0,.2,r)*(1-Gi(.88,1,r)):0,u);const f=Math.abs(Jr)/Math.max(.001,i)/e;se.wind=ct(se.wind,Kt?0:Vn(Jr/Math.max(.001,i)/e*.25,-1,1),.08),s.ch&&f<.05?se.load=Math.min(1,se.load+i*.035):se.load=Math.max(0,se.load-i*(.02+f*.02));const h=l("rain")*(.75+se.load*.5)+(wn?.35:0);se.rain=ct(se.rain,Vn(h),c),se.slant=ct(se.slant,l("slant")+(wn?.2:0),c),se.wet=se.clear>.5?ct(se.wet,.25,1-Math.exp(-i*.4)):ct(se.wet,Math.max(se.wet,se.rain*1.1),1-Math.exp(-i*.6)),Ki=s.plate,Ga=a.plate,Va=s.plate!==a.plate?o:0,s.ch?Qn=s.ch:n<2&&(Qn=0),Js(document.body,"is-full",se.full>.5&&se.show>.5&&se.map<.5),Hn+=i,wn&&($i+=i,$i>1.1&&($i=0,ir(!0))),Zs-=i*(se.storm>.45?(se.storm-.4)*2.2:0)*(Kt?0:1),Zs<=0&&se.show>.5&&se.map<.5&&se.msg<.1&&(ir(),Zs=3+Math.random()*6),Wa=Vn(Hn/.14),Rl=Hn<.5?1:Math.max(0,1-(Hn-.5)/.5);const L=Math.exp(-Hn*7),g=Hn>.13?Math.exp(-(Hn-.13)*9)*.7:0;wl=Kt?0:Math.min(1.2,L+g),yi>=0?(yi+=i/16,yi>1&&(yi=-1)):($s-=i,$s<=0&&se.show>.5&&se.map<.5&&se.storm<.8&&(yi=0,$s=18+Math.random()*16)),an.x=ct(an.x,Kt?0:an.tx,.04),an.y=ct(an.y,Kt?0:an.ty,.04);const M=Bt.folio,m=Bt.band+8,d=se.full*se.full*(3-2*se.full),T={x:-m-2,y:-m-2,w:innerWidth+2*m+4,h:innerHeight+2*m+4},w={x:ct(M.x,T.x,d),y:ct(M.y,T.y,d),w:ct(M.w,T.w,d),h:ct(M.h,T.h,d)};if(zt){const S=zt.u;S.uWin.value.set(w.x,w.y,w.w,w.h),S.uArch.value=1-d,S.uBand.value=Bt.band,S.uOpaqueTop.value=Bt.portrait?Bt.opaqueTop*(1-d):0,S.uShow.value=se.show,zt.setPlates(Ki,Ga,Va),S.uTime.value=Xa,S.uRain.value=se.rain*se.show,S.uSlant.value=se.slant,S.uStorm.value=se.storm,S.uWet.value=se.wet,S.uDusk.value=se.dusk,S.uClear.value=se.clear,S.uDry.value=se.dry,S.uWind.value=se.wind,S.uBurst.value=se.burst,S.uMap.value=se.map,S.uCalm.value=Kt?1:0,S.uPar.value.set(an.x,an.y),S.uFlash.value=wl*(1-se.map)*se.show,S.uBoltT.value=Wa,S.uBoltA.value=Rl*(1-se.map)*se.show,S.uCrane.value=yi,S.uCraneY.value=Math.max(.06,(y0[Ki]??.3)*.35),S.uMsg.value=se.msg,S.uDim.value=se.end,S.uMsgT.value=s.msg?Gi(.12,.6,r):0,S.uMsgRect.value.set(.08,Bt.portrait?.16:.2,.84,.32),zt.render()}const x=Al.svg;if(se.map>.01){const S=Math.min(w.w,w.h)*.05,A=Math.min(w.w*.36,w.h*.22)*(1-d)*.45;x.style.opacity=String(se.map),x.style.visibility="visible",x.style.left=`${w.x+S}px`,x.style.top=`${w.y+S+A}px`,x.style.width=`${w.w-2*S}px`,x.style.height=`${w.h-2*S-A}px`,Al.set(Vn(($r+e*.5-Gr[Il])/Math.max(1,ka[Il]-e*.3)))}else x.style.opacity="0",x.style.visibility="hidden";Js(nL,"in",se.burst>.6),Qn!==Ul&&(Ul=Qn,I0.forEach(S=>S.classList.toggle("on",Number(S.dataset.ch)===Qn)));const b=Math.round(se.load*100);b!==Nl&&(Nl=b,iL.style.width=`${b}%`),Js(Qm,"show",s.ch>=4&&s.ch<=6&&se.full<.5&&se.show>.5),Object.assign(pn.state,{rain:se.rain,storm:se.storm,ch:Qn,clear:se.clear,msg:se.msg,full:se.full,show:se.show}),pn.update(i)}let Vi=null;function sL(){Vi||(Vi=document.createElement("pre"),Vi.style.cssText="position:fixed;left:8px;bottom:8px;z-index:99;margin:0;font:11px/1.3 monospace;color:#fff;background:#0009;padding:6px 8px;pointer-events:none",document.body.appendChild(Vi)),Vi.textContent=`sec ${A0} t ${w0.toFixed(2)} ch ${Qn} ${Zi[Ki]}→${Zi[Ga]} mix ${Va.toFixed(2)} full ${se.full.toFixed(2)} rain ${se.rain.toFixed(2)} storm ${se.storm.toFixed(2)} fps ${jr.toFixed(0)} dpr ${Gn.dpr}`}window.__barsaat={jump:i=>{Wn?Wn.scrollTo(i,{immediate:!0,force:!0}):scrollTo(0,i)},strike:ir,S:se,sections:si,get fps(){return jr},enter:cs,setSound:co,score:pn};let Fl=innerWidth,Ol=innerHeight;addEventListener("resize",()=>{if(as&&innerWidth===Fl&&Math.abs(innerHeight-Ol)<160){os();return}Fl=innerWidth,Ol=innerHeight,ao()});new ResizeObserver(os).observe(document.querySelector("main"));if(!Kt&&"IntersectionObserver"in window){const i=new IntersectionObserver(e=>e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("in"),i.unobserve(t.target))}),{rootMargin:"0px 0px -12% 0px"});document.querySelectorAll(".verse, .prose, .note, .eyebrow, .fine, .try, .letter, .g-head, .g-item").forEach(e=>{e.classList.add("rise"),i.observe(e)})}C0(Wm());ao();tL();requestAnimationFrame(O0);
