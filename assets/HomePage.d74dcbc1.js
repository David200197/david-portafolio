import{g as G,r as J,j as y,d as K,s as Q}from"./index.397f134c.js";var g={};(function(a){Object.defineProperty(a,"__esModule",{value:!0});var n=J.exports;function U(t){if(t&&t.__esModule)return t;var c=Object.create(null);return t&&Object.keys(t).forEach(function(o){if(o!=="default"){var e=Object.getOwnPropertyDescriptor(t,o);Object.defineProperty(c,o,e.get?e:{enumerable:!0,get:function(){return t[o]}})}}),c.default=t,Object.freeze(c)}var V=U(n),w=function(t,c){var o=!1;return function(){o||(t(),o=!0,setTimeout(function(){o=!1},c))}},q=function(t){var c=t.children,o=t.navContainerRef,e=t.parentScrollContainerRef,h=t.scrollThrottle,j=h===void 0?300:h,k=t.onUpdateCallback,R=t.offsetTop,E=R===void 0?0:R,A=t.offsetBottom,O=A===void 0?0:A,B=t.useDataAttribute,b=B===void 0?"to-scrollspy-id":B,L=t.activeClass,v=L===void 0?"active-scroll-spy":L,T=t.useBoxMethod,N=T===void 0?!0:T,H=t.updateHistoryStack,_=H===void 0?!0:H,P=n.useRef(null),x=n.useState(),m=x[0],D=x[1],M=n.useRef("");n.useEffect(function(){var r;D(o?(r=o.current)===null||r===void 0?void 0:r.querySelectorAll("[data-".concat(b,"]")):document.querySelectorAll("[data-".concat(b,"]")))},[o]),n.useEffect(function(){C()},[m]);var z=function(r){var u=r.getBoundingClientRect();if(N){var i=e!=null&&e.current?e==null?void 0:e.current.offsetHeight:window.innerHeight,l=i,S=u.top,d=u.top+i;return l<d+O&&l>S-E}else{var p=e!=null&&e.current?(e==null?void 0:e.current.offsetHeight)*.5:window.innerHeight*.5,i=e!=null&&e.current?e==null?void 0:e.current.offsetHeight:window.innerHeight;return u.top+p+E>=0&&u.bottom-p-O<=i}},C=function(){var r=P.current;if(!!(r&&m))for(var u=function(S){var d=r.children.item(S),p=z(d);if(p){var s=d.id;return M.current===s?{value:void 0}:(m.forEach(function(f){var F=f.getAttribute("data-".concat(b));f.classList.contains(v)&&f.classList.remove(v),F===s&&!f.classList.contains(v)&&(f.classList.add(v),k&&k(s),M.current=s,_&&window.history.replaceState({},"","#".concat(s)))}),"break")}},i=0;i<r.children.length;i++){var l=u(i);if(typeof l=="object")return l.value;if(l==="break")break}};return n.useEffect(function(){var r;e?(r=e.current)===null||r===void 0||r.addEventListener("scroll",w(C,j)):window.addEventListener("scroll",w(C,j))}),V.createElement("div",{ref:P},c)};a.default=q})(g);var W=G(g);const Z=()=>y(W,{offsetBottom:400,children:K.navigations.map(a=>{const n=a.section;return y(X,{id:a.mark,children:y(n,{navigation:a})},a.mark)})}),X=Q("section")({});export{Z as default};
