// 生命之旅前端簡易示範 (不包含AI與後端)

const btnAdd = document.getElementById('btn-add');
const btnMine = document.getElementById('btn-mine');
const btnOthers = document.getElementById('btn-others');
const btnAddToOthers = document.getElementById('btn-add-to-others');

const sectionAdd = document.getElementById('section-add');
const sectionMine = document.getElementById('section-mine');
const sectionOthers = document.getElementById('section-others');
const sectionAddToOthers = document.getElementById('section-add-to-others');

const addForm = document.getElementById('add-form');
const addResult = document.getElementById('add-result');

const addToOthersForm = document.getElementById('add-to-others-form');
const addToOthersResult = document.getElementById('add-to-others-result');

const mineJourneyDiv = document.getElementById('mine-journey');
const othersJourneyDiv = document.getElementById('others-journey');
const othersIdInput = document.getElementById('others-id');
const btnViewOthers = document.getElementById('btn-view-others');

function hideAllSections() {
  sectionAdd.classList.add('hidden');
  sectionMine.classList.add('hidden');
  sectionOthers.classList.add('hidden');
  sectionAddToOthers.classList.add('hidden');
  addResult.textContent = '';
  mineJourneyDiv.innerHTML = '';
  othersJourneyDiv.innerHTML = '';
  addToOthersResult.textContent = '';
}

function showSection(section) {
  hideAllSections();
  section.classList.remove('hidden');
}

// 模擬使用者資料存在localStorage
const STORAGE_KEY = 'lifejourney-data';
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 取得目前用戶 ID (示範用，本地模擬)
function getCurrentUserId() {
  let id = localStorage.getItem('lifejourney-userid');
  if (!id) {
    id = 'user-' + Math.random().toString(36).slice(2,10);
    localStorage.setItem('lifejourney-userid', id);
  }
  return id;
}

function createJourneyItemHTML(photoUrl, story) {
  const div = document.createElement('div');
  div.className = 'journey-item';
  const img = document.createElement('img');
  img.src = photoUrl;
  img.alt = '生命之旅的照片';
  const caption = document.createElement('div');
  caption.className = 'journey-caption';
  caption.textContent = story;
  div.appendChild(img);
  div.appendChild(caption);
  return div.outerHTML;
}

// 模擬 AI 生成標語(實際需後端AI計算)
function generateStoryFromAnswers(answers) {
  // 取前三題答案加簡單組合示範
  return `這段旅程代表了您回答的：${answers.join('；')}。每一步都刻劃生命的精彩風景。`;
}

// 增加個人生命之旅
addForm.addEventListener('submit', e => {
  e.preventDefault();
  addResult.textContent = '';
  const formData = new FormData(addForm);

  const q1 = formData.get('q1').trim();
  const q2 = formData.get('q2').trim();
  const q3 = formData.get('q3').trim();
  const photoFile = formData.get('photo');

  if (!q1 || !q2 || !q3 || !photoFile) {
    addResult.textContent = '請完整填寫並附上照片。';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const photoUrl = event.target.result;
    const story = generateStoryFromAnswers([q1, q2, q3]);

    const userId = getCurrentUserId();
    let data = loadData();
    if (!data[userId]) data[userId] = [];
    data[userId].push({ photo: photoUrl, story });
    saveData(data);

    addResult.textContent = '新增成功！您可以於【我的生命之旅】查看。';
    addForm.reset();
  };
  reader.readAsDataURL(photoFile);
});

// 顯示個人生命之旅
function renderJourney(userId, container) {
  const data = loadData();
  container.innerHTML = '';
  if (!data[userId] || data[userId].length === 0) {
    container.textContent = '尚無資料，請先新增生命之旅。';
    return;
  }

  // 依照設計呈現 S 型小徑, 此為簡易垂直列表示範
  data[userId].forEach(record => {
    container.innerHTML += createJourneyItemHTML(record.photo, record.story);
  });
}

btnAdd.addEventListener('click', () => {
  showSection(sectionAdd);
});
btnMine.addEventListener('click', () => {
  showSection(sectionMine);
  const userId = getCurrentUserId();
  renderJourney(userId, mineJourneyDiv);
});
btnOthers.addEventListener('click', () => {
  showSection(sectionOthers);
});
btnAddToOthers.addEventListener('click', () => {
  showSection(sectionAddToOthers);
});

btnViewOthers.addEventListener('click', () => {
  const targetId = othersIdInput.value.trim();
  othersJourneyDiv.innerHTML = '';
  if (!targetId) {
    othersJourneyDiv.textContent = '請輸入別人編號。';
    return;
  }
  const data = loadData();
  if (!data[targetId] || data[targetId].length === 0) {
    othersJourneyDiv.textContent = '查無該使用者資料，請確認編號。';
    return;
  }
  renderJourney(targetId, othersJourneyDiv);
});

// 為別人的生命增加風景 (示範不會真正修改他人資料，只本地file展示)
addToOthersForm.addEventListener('submit', e => {
  e.preventDefault();
  addToOthersResult.textContent = '';
  const formData = new FormData(addToOthersForm);
  const targetId = formData.get('targetId').trim();
  const photoFile = formData.get('photo');
  const description = formData.get('description').trim();

  if (!targetId || !photoFile || !description) {
    addToOthersResult.textContent = '請完整填寫並附上照片。';
    return;
  }

  const userId = getCurrentUserId();
  if (targetId === userId) {
    addToOthersResult.textContent = '無法為自己增加別人的風景，請使用新增生命之旅功能。';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const photoUrl = event.target.result;

    // 實際作法需後端同意機制，此處只示範前端放置提示
    addToOthersResult.innerHTML = `
      <p>您將新增以下風景給編號 <strong>${targetId}</strong>：</p>
      <img src="${photoUrl}" alt="新增風景照片" style="max-width:100%;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.15);" />
      <p>描述：${description}</p>
      <p><em>本示範不會真正送出，請等待後端實作。若有後端，點擊同意後會加入對方網頁。</em></p>
    `;
    addToOthersForm.reset();
  };
  reader.readAsDataURL(photoFile);
});

// 頁面載入自動隱藏所有section，只顯示功能格
hideAllSections();