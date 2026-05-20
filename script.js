let quizData = null;
let currentQuestions = [];
let currentIndex = 0;
let currentMode = ''; // 'wordToMeaning' or 'meaningToWord'

// JSON読み込み
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        const listDiv = document.getElementById('section-list');
        data.sections.forEach((s, index) => {
            listDiv.innerHTML += `
                <div class="section-item">
                    <input type="checkbox" id="sec-${index}" value="${index}" checked>
                    <label for="sec-${index}">${s.title}</label>
                </div>`;
        });
    });

function startApp(mode) {
    currentMode = mode;
    const selectedIndices = Array.from(document.querySelectorAll('#section-list input:checked')).map(i => parseInt(i.value));
    
    if(selectedIndices.length === 0) {
        alert("セクションを選択してください");
        return;
    }

    currentQuestions = [];
    selectedIndices.forEach(idx => {
        const section = quizData.sections[idx];
        section.items.forEach(item => {
            currentQuestions.push({
                q: mode === 'wordToMeaning' ? item.word : item.meaning,
                a: mode === 'wordToMeaning' ? item.meaning : item.word,
                section: section.title
            });
        });
    });

    // シャッフル
    currentQuestions.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    
    document.getElementById('top-page').style.display = 'none';
    document.getElementById('quiz-page').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('current-section-title').innerText = q.section;
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('remaining-count').innerText = currentQuestions.length - currentIndex;
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('correct-answer').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'inline-block';
}

function checkAnswer() {
    const userAns = document.getElementById('answer-input').value.trim().toLowerCase();
    const correctAns = currentQuestions[currentIndex].a.toLowerCase();
    const feedback = document.getElementById('feedback');
    const displayCorrect = document.getElementById('correct-answer');

    // 部分一致判定（単語→意味の場合は厳格にせず、意味→単語の場合はある程度許容）
    if (userAns !== "" && (correctAns.includes(userAns) || userAns.includes(correctAns))) {
        feedback.innerText = "正解！";
        feedback.className = "feedback correct";
    } else {
        feedback.innerText = "残念...";
        feedback.className = "feedback incorrect";
    }

    displayCorrect.innerHTML = `<strong>正解:</strong><br>${currentQuestions[currentIndex].a}`;
    displayCorrect.style.display = 'block';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        alert("全問終了しました！トップに戻ります。");
        backToTop();
    }
}

function backToTop() {
    document.getElementById('top-page').style.display = 'block';
    document.getElementById('quiz-page').style.display = 'none';
}
