// Simple front-end auth (demo) and protected dashboard
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const demoBtn = document.getElementById('demo-btn');
const logoutBtn = document.getElementById('logout-btn');
const darkToggle = document.getElementById('dark-toggle');
const alertsEl = document.getElementById('alerts');
const sensorCountEl = document.getElementById('sensor-count');
const emergencyBtn = document.getElementById('emergency');
const alertHistory = document.getElementById('alert-history');

// Metric elements
const hrValue = document.getElementById('hr-value');
const hrStatus = document.getElementById('hr-status');
const spo2Value = document.getElementById('spo2-value');
const spo2Status = document.getElementById('spo2-status');
const tempValue = document.getElementById('temp-value');
const tempStatus = document.getElementById('temp-status');
const airValue = document.getElementById('air-value');
const airStatus = document.getElementById('air-status');
const motionValue = document.getElementById('motion-value');
const motionSub = document.getElementById('motion-sub');

// Charts
let chartHR=null, chartSpo2Temp=null;

// Simple auth - in real system replace with server auth
const DEMO_USER = {username: 'admin', password: 'baby123'};

function showDashboard(){
  loginScreen.classList.add('hidden');
  loginScreen.setAttribute('aria-hidden','true');
  dashboardScreen.classList.remove('hidden');
  dashboardScreen.setAttribute('aria-hidden','false');
  startRealtime();
}

function showLogin(){
  dashboardScreen.classList.add('hidden');
  dashboardScreen.setAttribute('aria-hidden','true');
  loginScreen.classList.remove('hidden');
  loginScreen.setAttribute('aria-hidden','false');
  stopRealtime();
}

loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const u = loginForm.username.value.trim();
  const p = loginForm.password.value.trim();
  if(u===DEMO_USER.username && p===DEMO_USER.password){
    localStorage.setItem('authenticated','1');
    showDashboard();
  } else {
    flashAlert('Invalid credentials', 'crit');
  }
});

demoBtn.addEventListener('click', ()=>{
  loginForm.username.value = DEMO_USER.username;
  loginForm.password.value = DEMO_USER.password;
});

logoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem('authenticated');
  showLogin();
});

// Dark mode persistence
if(localStorage.getItem('dark')==='1'){
  document.body.classList.add('dark');
  darkToggle.checked = true;
}
darkToggle.addEventListener('change', ()=>{
  if(darkToggle.checked){
    document.body.classList.add('dark');
    localStorage.setItem('dark','1');
  } else {
    document.body.classList.remove('dark');
    localStorage.removeItem('dark');
  }
});

// If already authenticated show dashboard
if(localStorage.getItem('authenticated')==='1') showDashboard();

// Alerts
function flashAlert(message, level='info'){
  const div = document.createElement('div');
  div.className = `alert ${level}`;
  div.textContent = message;
  alertsEl.prepend(div);
  setTimeout(()=>{div.remove()}, 7000);
}

function formatTime(ts){
  return new Date(ts).toLocaleTimeString();
}

function pushHistory(message, level='info'){
  if(!alertHistory) return;
  const div = document.createElement('div');
  div.className = 'alert-item';
  div.innerHTML = `<div class="title">${message}</div><div class="time muted">${formatTime(Date.now())}</div>`;
  alertHistory.prepend(div);
  // keep 12 items
  while(alertHistory.children.length>12) alertHistory.removeChild(alertHistory.lastChild);
}

const originalFlash = flashAlert;
function flashAlert(message, level='info'){
  originalFlash(message, level);
  pushHistory(message, level);
}

// Mock realtime data generation and update logic
let realtimeTimer = null;
let mockState = {time: Date.now(), hr: 120, spo2: 98, temp: 36.6, air: 12, motion:false};

function randomWalk(v, min, max, jitter=1){
  let n = v + (Math.random()*2-1)*jitter;
  if(n<min) n=min + Math.random()*jitter;
  if(n>max) n=max - Math.random()*jitter;
  return Math.round(n*10)/10;
}

function generateMock(){
  // baby HR baseline high for infants; vary realistically
  mockState.hr = Math.round(randomWalk(mockState.hr, 90, 180, 6));
  mockState.spo2 = Math.round(randomWalk(mockState.spo2, 88, 100, 0.6));
  mockState.temp = randomWalk(mockState.temp, 35.5, 38.5, 0.08);
  mockState.air = Math.round(randomWalk(mockState.air, 5, 120, 3));
  // motion random short bursts
  mockState.motion = (Math.random() < 0.15);
  mockState.time = Date.now();
  return {...mockState};
}

// Threshold checks
function assessMetrics(d){
  const issues = [];
  // Heart rate - for infants wide range; mark extremely low/high
  if(d.hr < 90) issues.push({k:'hr',t:'Low heart rate',lvl:'crit'});
  if(d.hr > 170) issues.push({k:'hr',t:'High heart rate',lvl:'warn'});
  // SpO2
  if(d.spo2 < 92) issues.push({k:'spo2',t:'Low oxygen saturation',lvl:'crit'});
  // Temperature
  if(d.temp < 36 || d.temp > 37.8) issues.push({k:'temp',t:'Abnormal temperature',lvl:'warn'});
  // Air quality - simple rule
  if(d.air > 100) issues.push({k:'air',t:'Poor air quality',lvl:'warn'});
  // Motion - prolonged stillness could be an alert, but here we treat heavy motion
  if(d.motion) issues.push({k:'motion',t:'Detected motion',lvl:'info'});
  return issues;
}

// Update UI
function updateUI(d){
  hrValue.textContent = d.hr;
  spo2Value.textContent = d.spo2;
  tempValue.textContent = d.temp.toFixed(1);
  airValue.textContent = d.air;
  motionValue.textContent = d.motion? 'Moving':'Still';
  motionSub.textContent = d.motion? 'Movement detected' : 'No significant motion';

  // status texts
  hrStatus.textContent = (d.hr>=100 && d.hr<=160)? 'Normal' : (d.hr<100? 'Low': 'High');
  spo2Status.textContent = d.spo2>=95? 'Normal' : 'Low';
  tempStatus.textContent = (d.temp>=36.4 && d.temp<=37.4)? 'Normal' : 'Check';
  airStatus.textContent = d.air<=50? 'Good' : (d.air<=100? 'Moderate':'Poor');

  // color coding
  colorCard('card-hr', assessMetrics(d).some(x=>x.k==='hr' && x.lvl==='crit')? 'crit' : (assessMetrics(d).some(x=>x.k==='hr')? 'warn' : 'ok'));
  colorCard('card-spo2', d.spo2<92? 'crit' : (d.spo2<95? 'warn' : 'ok'));
  colorCard('card-temp', (d.temp<36 || d.temp>37.6)? 'warn' : 'ok');
  colorCard('card-air', d.air>100? 'crit': (d.air>50? 'warn':'ok'));
  colorCard('card-motion', d.motion? 'info' : 'ok');

  // alerts
  const issues = assessMetrics(d);
  if(issues.length>0){
    issues.forEach(i=>{
      flashAlert(`${i.t} — ${i.k.toUpperCase()}`, i.lvl);
    });
  }
}

function colorCard(id, state){
  const el = document.getElementById(id);
  el.style.boxShadow = '';
  el.style.border = '';
  if(state==='crit'){
    el.style.border = `1px solid rgba(220,38,38,0.18)`;
  } else if(state==='warn'){
    el.style.border = `1px solid rgba(245,158,11,0.14)`;
  } else if(state==='info'){
    el.style.border = `1px solid rgba(6,182,212,0.12)`;
  } else {
    el.style.border = `1px solid transparent`;
  }
}

// Charts setup
function createCharts(){
  const ctxHr = document.getElementById('chart-hr').getContext('2d');
  chartHR = new Chart(ctxHr,{
    type:'line',data:{labels:[],datasets:[{label:'bpm',data:[],borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,0.08)',tension:0.3,pointRadius:0}]},options:{responsive:true,animation:false,scales:{x:{display:false},y:{beginAtZero:false}}}
  });

  const ctxST = document.getElementById('chart-spo2-temp').getContext('2d');
  chartSpo2Temp = new Chart(ctxST,{
    type:'line',data:{labels:[],datasets:[{label:'SpO2 %',data:[],yAxisID:'y1',borderColor:'#06b6d4',backgroundColor:'rgba(6,182,212,0.06)',tension:0.3,pointRadius:0},{label:'Temp °C',data:[],yAxisID:'y2',borderColor:'#059669',backgroundColor:'rgba(5,150,105,0.06)',tension:0.3,pointRadius:0}]},options:{responsive:true,animation:false,scales:{x:{display:false},y1:{type:'linear',position:'left',min:80,max:100},y2:{type:'linear',position:'right',min:35,max:39}}}
  });
}

function pushToCharts(d){
  const t = new Date(d.time).toLocaleTimeString();
  function push(chart, val, setIdx){
    chart.data.labels.push(t);
    chart.data.datasets[setIdx].data.push(val);
    // keep length ~120 points (2 minutes at 1s)
    if(chart.data.labels.length > 120){
      chart.data.labels.shift();
      chart.data.datasets.forEach(ds=>ds.data.shift());
    }
    chart.update('none');
  }
  push(chartHR, d.hr, 0);
  push(chartSpo2Temp, d.spo2, 0);
  push(chartSpo2Temp, d.temp, 1);
}

function startRealtime(){
  if(chartHR===null) createCharts();
  // initial fill
  for(let i=0;i<10;i++){
    const m = generateMock();
    pushToCharts(m);
    updateUI(m);
  }
  realtimeTimer = setInterval(()=>{
    const m = generateMock();
    pushToCharts(m);
    updateUI(m);
  }, 1000);
}

function stopRealtime(){
  if(realtimeTimer) clearInterval(realtimeTimer);
  realtimeTimer = null;
}

// Accessible keyboard shortcut to toggle dark for demos: D
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase()==='d'){
    darkToggle.checked = !darkToggle.checked;
    darkToggle.dispatchEvent(new Event('change'));
  }
});

// Ensure the canvas adapt to dark theme colors
function applyChartTheme(){
  Chart.defaults.color = document.body.classList.contains('dark')? '#cfe6ff':'#0f172a';
}
applyChartTheme();

// Reapply chart theme on dark toggle
darkToggle.addEventListener('change', ()=>{ applyChartTheme(); if(chartHR) chartHR.update(); if(chartSpo2Temp) chartSpo2Temp.update(); });

// Show sensors active (random for demo)
function updateSensorCount(){
  const c = 2 + Math.floor(Math.random()*3);
  sensorCountEl.textContent = `${c} Sensors Active`;
}
updateSensorCount();
setInterval(updateSensorCount, 8000);

emergencyBtn.addEventListener('click', ()=>{
  flashAlert('EMERGENCY button pressed — local alarm simulated', 'crit');
  emergencyBtn.classList.add('active');
  setTimeout(()=>emergencyBtn.classList.remove('active'),4000);
});

// Friendly load
console.log('Smart IoT Baby Crib Monitor UI loaded');
