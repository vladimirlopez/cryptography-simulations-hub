(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const b of o.addedNodes)b.tagName==="LINK"&&b.rel==="modulepreload"&&a(b)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const d={sequenceLength:10,bases:["+","x"],symbols:{"+":{0:"|",1:"-"},x:{0:"\\",1:"/"}}};let i=[],r=[],c=1;const h=document.getElementById("alice-send-btn"),y=document.getElementById("bob-measure-btn"),g=document.getElementById("sift-btn"),E=document.getElementById("reset-btn"),p=document.getElementById("photon-stream"),u=document.getElementById("table-body"),f=document.getElementById("final-key-display"),L=document.querySelectorAll(".step-guide"),m=document.querySelectorAll(".tab-btn"),$=document.querySelectorAll(".tab-content");function v(){i=[],r=[],c=1,m.forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.tab;m.forEach(t=>t.classList.toggle("active",t===e)),$.forEach(t=>t.classList.toggle("active",t.id===`${s}-tab`))})}),l()}function l(){L.forEach(e=>{const s=parseInt(e.dataset.step);e.classList.toggle("active",s===c)}),h.disabled=c!==1,y.disabled=c!==2,g.disabled=c!==3,M(),B()}function M(){if(i.length===0){p.innerHTML='<div class="empty-state">Click "Alice Sends Photons" to begin.</div>';return}p.innerHTML="",i.forEach((e,s)=>{const t=document.createElement("div");t.className="photon-row";const a=r[s];t.innerHTML=`
            <div class="photon-pair">
                <div class="photon-box active">
                    <span class="photon-icon">${d.symbols[e.basis][e.bit]}</span>
                    <span class="photon-meta">${e.basis} (${e.bit})</span>
                </div>
            </div>
            <div class="photon-pair">
                <div class="photon-box ${a?"active":""}">
                    ${a?`
                        <span class="photon-icon">${d.symbols[a.basis][a.result]}</span>
                        <span class="photon-meta">${a.basis} (${a.result})</span>
                    `:"?"}
                </div>
            </div>
        `,p.appendChild(t)})}function B(){if(u.innerHTML="",i.forEach((e,s)=>{const t=r[s],a=c>=4,n=t&&e.basis===t.basis,o=document.createElement("tr");o.innerHTML=`
            <td>${s+1}</td>
            <td>${e.basis}</td>
            <td>${e.bit}</td>
            <td>${t?t.basis:"-"}</td>
            <td>${t?t.result:"-"}</td>
            <td>${t&&c>=3?n?'<span class="match-yes">YES</span>':'<span class="match-no">NO</span>':"-"}</td>
            <td>${a&&n?`<span class="final-key-bit">${e.bit}</span>`:"-"}</td>
        `,u.appendChild(o)}),c===4){const e=i.filter((s,t)=>r[t]&&s.basis===r[t].basis).map(s=>s.bit).join("");f.textContent=e||"No matching bases found!"}else f.textContent=""}h.addEventListener("click",()=>{i=Array.from({length:d.sequenceLength},()=>({bit:Math.floor(Math.random()*2).toString(),basis:d.bases[Math.floor(Math.random()*2)]})),c=2,l()});y.addEventListener("click",()=>{r=i.map(e=>{const s=d.bases[Math.floor(Math.random()*2)];let t;return s===e.basis?t=e.bit:t=Math.floor(Math.random()*2).toString(),{basis:s,result:t}}),c=3,l()});g.addEventListener("click",()=>{c=4,l()});E.addEventListener("click",v);v();
