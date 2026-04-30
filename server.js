const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'reports.json');

async function loadEnv() {
  try {
    const content = await fs.readFile(path.join(ROOT, '.env'), 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index === -1) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  } catch (_error) {
    // ignore when .env not found
  }
}

function validatePayload(body) { /* same */
  const errors = [];
  const name = (body.name || '').trim();
  const department = (body.department || '').trim();
  const interviewDate = (body.interviewDate || '').trim();
  const transcript = (body.transcript || '').trim();
  if (!name || name.length < 2) errors.push('受訪者姓名至少需 2 個字元。');
  if (!department || department.length < 2) errors.push('部門至少需 2 個字元。');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(interviewDate) || Number.isNaN(Date.parse(interviewDate))) errors.push('訪談日期格式不正確，請使用 YYYY-MM-DD。');
  if (!transcript || transcript.length < 30) errors.push('訪談逐字稿至少需 30 個字元。');
  if (transcript.length > 10000) errors.push('訪談逐字稿不可超過 10000 個字元。');
  return { errors, payload: { name, department, interviewDate, transcript } };
}

function containsAny(text, keywords) { return keywords.some((k) => text.includes(k)); }
function generateAnalysis(transcript) { const text = transcript.toLowerCase(); const mainIssues=[]; if(containsAny(text,['延遲','等待','慢','卡住'])) mainIssues.push('作業效率偏慢，疑似存在等待與延遲問題。'); if(containsAny(text,['系統','當機','錯誤','bug'])) mainIssues.push('系統穩定性不足，影響前線作業流程。'); if(containsAny(text,['溝通','資訊落差','誤解'])) mainIssues.push('跨部門溝通存在資訊落差，影響執行一致性。'); if(!mainIssues.length) mainIssues.push('目前未偵測到明確單點問題，建議持續蒐集更多訪談樣本。'); const processIssues=[]; if(containsAny(text,['手動','重工','重複'])) processIssues.push('流程中有重複與手動步驟，建議標準化或自動化。'); if(containsAny(text,['簽核','流程不清','不知道'])) processIssues.push('流程權責或簽核節點不明確，導致執行不順。'); if(!processIssues.length) processIssues.push('流程描述尚可，建議建立 SOP 檢核表進一步驗證。'); const attitude=containsAny(text,['抱怨','不耐煩','消極'])?'部分內容反映情緒壓力偏高，需關注士氣與支持機制。':containsAny(text,['願意','配合','積極'])?'受訪內容偏正向，團隊有意願配合改善。':'人員態度中性，需透過後續訪談確認。'; const recommendations=['建立單一窗口整合需求與問題回報，降低跨部門資訊落差。','針對高頻問題建立每週追蹤機制與責任分工。','將關鍵流程整理為可落地的 SOP 並安排教育訓練。']; const priorities=[mainIssues[0],processIssues[0],'安排 2 週內複盤會議，確認改善進度與阻礙。']; return {mainIssues,processIssues,attitude,recommendations,priorities}; }

async function readReports(){ try{const raw=await fs.readFile(DATA_FILE,'utf-8'); return JSON.parse(raw);}catch(e){ if(e.code==='ENOENT') return []; throw e; }}
async function writeReports(reports){ await fs.mkdir(DATA_DIR,{recursive:true}); await fs.writeFile(DATA_FILE,JSON.stringify(reports,null,2),'utf-8'); }

function sendJson(res, status, payload){ res.writeHead(status,{ 'Content-Type':'application/json; charset=utf-8' }); res.end(JSON.stringify(payload)); }

function serveStatic(req, res){
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(filePath).replace(/^\.\.(\/|\\|$)/, '');
  const full = path.join(ROOT, 'public', safePath);
  return fs.readFile(full).then((content)=>{
    const ext = path.extname(full);
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.css' ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8';
    res.writeHead(200, {'Content-Type':type}); res.end(content);
  }).catch(()=>{res.writeHead(404); res.end('Not Found');});
}

loadEnv().then(() => {
  const PORT = Number(process.env.PORT) || 3000;
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/analyze') {
      try {
        let body = '';
        req.on('data', (chunk) => { body += chunk; if (body.length > 1e6) req.socket.destroy(); });
        req.on('end', async () => {
          const parsed = JSON.parse(body || '{}');
          const { errors, payload } = validatePayload(parsed);
          if (errors.length) return sendJson(res, 400, { errors });
          const analysis = generateAnalysis(payload.transcript);
          const reports = await readReports();
          const record = { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, createdAt: new Date().toISOString(), ...payload, analysis };
          reports.push(record);
          await writeReports(reports);
          return sendJson(res, 201, { report: record });
        });
      } catch (error) {
        console.error(error);
        return sendJson(res, 500, { error: '系統忙碌中，請稍後再試。' });
      }
      return;
    }

    if (req.method === 'GET' && req.url === '/api/reports') {
      try { const reports = await readReports(); return sendJson(res, 200, { reports: reports.slice().reverse() }); }
      catch (error) { console.error(error); return sendJson(res, 500, { error: '系統忙碌中，請稍後再試。' }); }
    }

    return serveStatic(req, res);
  });

  server.listen(PORT, () => console.log(`Kaifa 訪談分析系統 MVP 啟動：http://localhost:${PORT}`));
});
