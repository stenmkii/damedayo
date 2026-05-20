let data = null;
let quizList = [];
let currentIndex = 0;

fetch('data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        const selector = document.getElementById('section-selector');
        data.sections.forEach((s, i) => {
            selector.innerHTML += `
                <div class="section-item">
                    <input type="checkbox" id="s${i}" value="${i}" checked>
                    <label for="s${i}">${s.title}</label>
                </div>`;
        });
    });

function startQuiz() {
    const checked = Array.from(document.querySelectorAll('#section-selector input:checked')).map(el => parseInt(el.value));
    if (checked.length === 0) return alert("セクションを選択してください");

    quizList = [];
    checked.forEach(idx => {
        data.sections[idx].items.forEach(item => {
            quizList.push({ ...item, sectionTitle: data.sections[idx].title });
        });
    });

    quizList.sort(() => Math.random() - 0.5);
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('quiz-view').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = quizList[currentIndex];
    document.getElementById('current-section').innerText = q.sectionTitle;
    document.getElementById('progress-text').innerText = `${currentIndex + 1} / ${quizList.length}`;
    document.getElementById('question-sentence').innerText = q.sentence;
    document.getElementById('answer-input').value = "";
    document.getElementById('result-area').innerHTML = "";
    document.getElementById('check-btn').style.display = "block";
    document.getElementById('next-btn').style.display = "none";
    document.getElementById('answer-input').focus();
}

function checkAnswer() {
    const input = document.getElementById('answer-input').value.trim();
    const correct = quizList[currentIndex].answer;
    const resultArea = document.getElementById('result-area');

    if (input === correct || correct.includes(input) && input.length > 1) {
        resultArea.innerHTML = `<span class="correct">正解: ${correct}</span>`;
    } else {
        resultArea.innerHTML = `<span class="incorrect">不正解</span><br>正解は「${correct}」です`;
    }

    document.getElementById('check-btn').style.display = "none";
    document.getElementById('next-btn').style.display = "block";
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < quizList.length) {
        showQuestion();
    } else {
        alert("学習完了です。");
        location.reload();
    }
}
