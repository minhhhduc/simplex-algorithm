function createInputs() {
  const ROWS = parseInt(document.getElementById('matrix-rows').value);
  const COLS = parseInt(document.getElementById('matrix-cols').value);

  const matrixDiv = document.getElementById('matrix-container');
  const v1Div = document.getElementById('vector1-container');
  const v2Div = document.getElementById('vector2-container');

  matrixDiv.innerHTML = '<h3>Ma trận:</h3>';
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `m-${i}-${j}`;
      input.classList.add('size');
      matrixDiv.appendChild(input);
    }
    matrixDiv.appendChild(document.createElement('br'));
  }

  v1Div.innerHTML = '<h3>c<sup>T</sup> (số cột):</h3>';
  for (let i = 0; i < COLS; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `v1-${i}`;
    input.classList.add('size');
    v1Div.appendChild(input);
  }

  v2Div.innerHTML = '<h3>b<sup>T</sup> (số hàng):</h3>';
  for (let i = 0; i < ROWS; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `v2-${i}`;
    input.classList.add('size');
    v2Div.appendChild(input);
  }
}

function parseFraction(str) {
  if (!str.includes('/')) return parseFloat(str);
  const parts = str.split('/');
  const num = parseFloat(parts[0]);
  const denom = parseFloat(parts[1]);
  return denom !== 0 ? num / denom : NaN;
}

function getData() {
  const ROWS = parseInt(document.getElementById('matrix-rows').value);
  const COLS = parseInt(document.getElementById('matrix-cols').value);

  const matrix = [];
  const ANumerator = [];
  const ADenominator = [];
  try {
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      const rowNumerator = [];
      const rowDenominator = [];

      for (let j = 0; j < COLS; j++) {
        const val = document.getElementById(`m-${i}-${j}`).value.trim();
        row.push(parseFraction(val));
        rowNumerator.push(val.split('/')[0]);
        rowDenominator.push(val.split('/')[1] || 1);
      }
      ANumerator.push(rowNumerator);
      ADenominator.push(rowDenominator);
      matrix.push(row);
    }
  } catch (error) {}

  const c = [];
  const cNumerator = [];
  const cDenominator = [];
  try {
    for (let i = 0; i < COLS; i++) {
      const val = document.getElementById(`v1-${i}`).value.trim();
      c.push(parseFraction(val));
      cNumerator.push(val.split('/')[0]);
      cDenominator.push(val.split('/')[1] || 1);
    }
  } catch (error) {
  }
  const b = [];
  const bNumerator = [];
  const bDenominator = [];
  try {
    for (let i = 0; i < ROWS; i++) {
      const val = document.getElementById(`v2-${i}`).value.trim();
      b.push(parseFraction(val));
      bNumerator.push(val.split('/')[0]);
      bDenominator.push(val.split('/')[1] || 1);
    }
  } catch (error) {}


  document.getElementById('output').textContent =
    `Matrix:\n${JSON.stringify(matrix, null, 2)}\n\nVector c (cols):\n${JSON.stringify(c)}\n\nVector b (rows):\n${JSON.stringify(b)}`;
  return { ADenominator, ANumerator,
            bDenominator, bNumerator, 
            cDenominator, cNumerator};
}

function callAPI() {
  console.log('Calling API...');
  const url = 'https://4f8bfa4d-cf29-4fd7-9d81-1bb202fd3114-00-35n6lrc7qxexx.sisko.replit.dev//simplex';
  const data = getData();
  const { ADenominator, ANumerator, bDenominator, bNumerator, cDenominator, cNumerator } = data;
  if (!ADenominator || !ANumerator || !bDenominator || !bNumerator || !cDenominator || !cNumerator) {
    alert('Please fill in all fields.');
    return;
  }
  const payload = {
  matrixNumerator: ANumerator.map(row => row.map(Number)),
  matrixDenominator: ADenominator.map(row => row.map(Number)),
  objectiveNumerator: cNumerator.map(Number),
  objectiveDenominator: cDenominator.map(Number),
  bNumerator: bNumerator.map(Number),
  bDenominator: bDenominator.map(Number)
  };
  
  fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  })
  .catch(err => console.error(err));

}