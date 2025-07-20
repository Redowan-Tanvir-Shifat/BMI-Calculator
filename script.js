// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
themeToggle.addEventListener('click', toggleTheme);
// Set initial theme
setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// BMI Calculation
const bmiForm = document.getElementById('bmi-form');
const bmiResult = document.getElementById('bmi-result');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const heightUnit = document.getElementById('height-unit');
const weightUnit = document.getElementById('weight-unit');
const bmiChart = document.getElementById('bmi-chart');

function toMetric(height, weight, hUnit, wUnit) {
  let h = height, w = weight;
  if (hUnit === 'in') h = height * 2.54;
  if (wUnit === 'lb') w = weight * 0.453592;
  return { h, w };
}
function calculateBMI(height, weight, hUnit, wUnit) {
  const { h, w } = toMetric(height, weight, hUnit, wUnit);
  if (h === 0) return 0;
  return w / ((h / 100) ** 2);
}
function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', class: 'underweight', color: '#4f8cff' };
  if (bmi < 24.9) return { label: 'Normal', class: 'normal', color: '#4fcf4f' };
  if (bmi < 29.9) return { label: 'Overweight', class: 'overweight', color: '#ffd700' };
  return { label: 'Obesity', class: 'obesity', color: '#ff4f4f' };
}
function updateBMIChart(bmi) {
  if (!bmiChart) return;
  let percent = Math.min(Math.max((bmi / 40) * 100, 0), 100); // 40 is a reasonable max BMI
  let indicator = bmiChart.querySelector('.bmi-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'bmi-indicator';
    bmiChart.appendChild(indicator);
  }
  indicator.style.left = `calc(${percent}% - 1px)`;
  indicator.title = `Your BMI: ${bmi.toFixed(1)}`;
}
bmiForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);
  const hUnit = heightUnit.value;
  const wUnit = weightUnit.value;
  if (!height || !weight) {
    bmiResult.textContent = 'Please enter valid height and weight.';
    return;
  }
  const bmi = calculateBMI(height, weight, hUnit, wUnit);
  const cat = getBMICategory(bmi);
  bmiResult.innerHTML = `Your BMI: <span class="${cat.class}">${bmi.toFixed(1)}</span> <span class="bmi-label ${cat.class}">(${cat.label})</span>`;
  updateBMIChart(bmi);
});

// Unit Converter
const convertValue = document.getElementById('convert-value');
const convertFrom = document.getElementById('convert-from');
const convertTo = document.getElementById('convert-to');
const convertBtn = document.getElementById('convert-btn');
const convertResult = document.getElementById('convert-result');

function convertUnits(value, from, to) {
  if (from === to) return value;
  // Length
  if ((from === 'cm' && to === 'in')) return value / 2.54;
  if ((from === 'in' && to === 'cm')) return value * 2.54;
  // Weight
  if ((from === 'kg' && to === 'lb')) return value / 0.453592;
  if ((from === 'lb' && to === 'kg')) return value * 0.453592;
  // Cross type (invalid)
  return NaN;
}
function handleConvert(e) {
  if (e) e.preventDefault();
  const value = parseFloat(convertValue.value);
  const from = convertFrom.value;
  const to = convertTo.value;
  if (!value || from === to) {
    convertResult.textContent = '';
    return;
  }
  // Only allow length-to-length or weight-to-weight
  const isLength = (u) => u === 'cm' || u === 'in';
  const isWeight = (u) => u === 'kg' || u === 'lb';
  if ((isLength(from) && isLength(to)) || (isWeight(from) && isWeight(to))) {
    const result = convertUnits(value, from, to);
    if (isNaN(result)) {
      convertResult.textContent = 'Conversion not supported.';
    } else {
      convertResult.textContent = `${value} ${from} = ${result.toFixed(2)} ${to}`;
    }
  } else {
    convertResult.textContent = 'Cannot convert between length and weight.';
  }
}
convertBtn.addEventListener('click', handleConvert);
convertValue.addEventListener('input', function() {
  if (!convertValue.value) convertResult.textContent = '';
});
[convertValue, convertFrom, convertTo].forEach(el => {
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      handleConvert(e);
    }
  });
});

// Accessibility: Keyboard support for theme toggle
if (themeToggle) {
  themeToggle.tabIndex = 0;
  themeToggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle logic (already present)
  if (themeToggle) {
    themeToggle.tabIndex = 0;
    themeToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  // Highlight active nav link
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    if (window.location.pathname.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}); 