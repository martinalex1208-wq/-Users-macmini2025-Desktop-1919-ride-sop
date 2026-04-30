const form = document.getElementById('interviewForm');
const messageBox = document.getElementById('message');
const resultBox = document.getElementById('result');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  messageBox.textContent = '';
  resultBox.classList.add('hidden');

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      messageBox.textContent = (data.errors || [data.error || '送出失敗']).join(' ');
      messageBox.className = 'error';
      return;
    }

    const { report } = data;
    const a = report.analysis;
    messageBox.textContent = '分析完成，已儲存到本機 JSON。';
    messageBox.className = 'success';

    resultBox.innerHTML = `
      <h2>分析報告</h2>
      <p><strong>受訪者：</strong>${escapeHtml(report.name)}（${escapeHtml(report.department)}）</p>
      <p><strong>訪談日期：</strong>${escapeHtml(report.interviewDate)}</p>
      <h3>主要問題</h3>
      ${renderList(a.mainIssues)}
      <h3>流程問題</h3>
      ${renderList(a.processIssues)}
      <h3>人員態度</h3>
      <p>${escapeHtml(a.attitude)}</p>
      <h3>改善建議</h3>
      ${renderList(a.recommendations)}
      <h3>優先處理事項</h3>
      ${renderList(a.priorities)}
    `;
    resultBox.classList.remove('hidden');
  } catch (_error) {
    messageBox.textContent = '系統忙碌中，請稍後再試。';
    messageBox.className = 'error';
  }
});
